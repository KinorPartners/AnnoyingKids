#!/bin/bash
# ============================================================
# AnnoyingKids.com — One-Shot Setup Script
# ============================================================
# Run this on your local machine. It will:
#   1. Add the GitHub Actions workflow file
#   2. Set GitHub repository secrets
#   3. Configure Azure Static Web Apps env vars
#   4. Set up the Stripe webhook
#   5. Connect your custom domain
#
# Prerequisites:
#   - GitHub CLI:  brew install gh   (then: gh auth login)
#   - Azure CLI:   brew install azure-cli   (then: az login)
#   - Stripe CLI:  brew install stripe/stripe-cli/stripe   (then: stripe login)
#   - jq:          brew install jq
#
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
# ============================================================

set -e

# ---- COLOR OUTPUT ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
fail()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ---- CONFIGURATION ----
GITHUB_REPO="KinorPartners/AnnoyingKids"
AZURE_RESOURCE_GROUP=""
AZURE_STATIC_APP_NAME=""
CUSTOM_DOMAIN="www.annoyingkids.com"
PRINTIFY_SHOP_ID="26276851"

# ---- GATHER CREDENTIALS ----
echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}   AnnoyingKids.com Setup${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# Check prerequisites
info "Checking prerequisites..."
command -v gh >/dev/null 2>&1 || fail "GitHub CLI (gh) not found. Install: brew install gh"
command -v az >/dev/null 2>&1 || fail "Azure CLI (az) not found. Install: brew install azure-cli"
command -v stripe >/dev/null 2>&1 || warn "Stripe CLI not found. Webhook setup will be skipped. Install: brew install stripe/stripe-cli/stripe"
command -v jq >/dev/null 2>&1 || fail "jq not found. Install: brew install jq"
ok "Prerequisites found"

# Check auth status
info "Checking auth status..."
gh auth status >/dev/null 2>&1 || fail "Not logged into GitHub CLI. Run: gh auth login"
az account show >/dev/null 2>&1 || fail "Not logged into Azure CLI. Run: az login"
ok "Authenticated with GitHub and Azure"

echo ""

# Prompt for Azure resource group
if [ -z "$AZURE_RESOURCE_GROUP" ]; then
    info "Your Azure resource groups:"
    az group list --output table --query "[].{Name:name, Location:location}"
    echo ""
    read -p "Enter the Resource Group name for your Static Web App: " AZURE_RESOURCE_GROUP
fi

# Prompt for Azure Static Web App name
if [ -z "$AZURE_STATIC_APP_NAME" ]; then
    info "Your Static Web Apps in '${AZURE_RESOURCE_GROUP}':"
    az staticwebapp list --resource-group "$AZURE_RESOURCE_GROUP" --output table --query "[].{Name:name, URL:defaultHostname}" 2>/dev/null || true
    echo ""
    read -p "Enter the Static Web App name: " AZURE_STATIC_APP_NAME
fi

echo ""

# Prompt for secrets (masked input)
read -sp "Paste your STRIPE_SECRET_KEY (sk_live_...): " STRIPE_SECRET_KEY
echo ""
read -sp "Paste your STRIPE_PUBLISHABLE_KEY (pk_live_...): " STRIPE_PUBLISHABLE_KEY
echo ""
read -sp "Paste your PRINTIFY_API_KEY: " PRINTIFY_API_KEY
echo ""

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}   Starting Setup...${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# ---- STEP 1: GitHub Actions Workflow ----
info "Step 1/5: Adding GitHub Actions workflow..."

# Check if workflow already exists
WORKFLOW_EXISTS=$(gh api repos/${GITHUB_REPO}/contents/.github/workflows/azure-static-web-apps.yml --jq '.name' 2>/dev/null || echo "")

if [ -z "$WORKFLOW_EXISTS" ]; then
    # Create the workflow file via GitHub API
    WORKFLOW_CONTENT=$(cat << 'WORKFLOW_EOF'
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: ${{ vars.NEXT_PUBLIC_SITE_URL }}

      - name: Deploy to Azure Static Web Apps
        id: deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: ".next"
          skip_app_build: true

  close_pull_request:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
WORKFLOW_EOF
)
    
    ENCODED=$(echo "$WORKFLOW_CONTENT" | base64 -w 0 2>/dev/null || echo "$WORKFLOW_CONTENT" | base64)
    
    gh api --method PUT repos/${GITHUB_REPO}/contents/.github/workflows/azure-static-web-apps.yml \
        --field message="Add GitHub Actions CI/CD workflow" \
        --field content="$ENCODED" > /dev/null
    
    ok "GitHub Actions workflow created"
else
    ok "GitHub Actions workflow already exists — skipping"
fi

# ---- STEP 2: Azure Deployment Token → GitHub Secret ----
info "Step 2/5: Setting up Azure deployment token..."

DEPLOY_TOKEN=$(az staticwebapp secrets list \
    --name "$AZURE_STATIC_APP_NAME" \
    --resource-group "$AZURE_RESOURCE_GROUP" \
    --query "properties.apiKey" -o tsv)

if [ -z "$DEPLOY_TOKEN" ]; then
    fail "Could not retrieve Azure deployment token. Check your app name and resource group."
fi

gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN \
    --repo "$GITHUB_REPO" \
    --body "$DEPLOY_TOKEN"

ok "Azure deployment token saved as GitHub secret"

# ---- STEP 3: Azure Environment Variables ----
info "Step 3/5: Configuring Azure environment variables..."

az staticwebapp appsettings set \
    --name "$AZURE_STATIC_APP_NAME" \
    --resource-group "$AZURE_RESOURCE_GROUP" \
    --setting-names \
        "STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}" \
        "STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}" \
        "PRINTIFY_API_KEY=${PRINTIFY_API_KEY}" \
        "PRINTIFY_SHOP_ID=${PRINTIFY_SHOP_ID}" \
        "NEXT_PUBLIC_SITE_URL=https://${CUSTOM_DOMAIN}" \
    > /dev/null

# Also set NEXT_PUBLIC_SITE_URL as a GitHub variable (needed at build time)
gh variable set NEXT_PUBLIC_SITE_URL \
    --repo "$GITHUB_REPO" \
    --body "https://${CUSTOM_DOMAIN}" 2>/dev/null || true

ok "Azure environment variables configured"

# ---- STEP 4: Stripe Webhook ----
info "Step 4/5: Creating Stripe webhook endpoint..."

if command -v stripe >/dev/null 2>&1; then
    # Get the Azure default hostname for now (custom domain may not be ready)
    AZURE_HOSTNAME=$(az staticwebapp show \
        --name "$AZURE_STATIC_APP_NAME" \
        --resource-group "$AZURE_RESOURCE_GROUP" \
        --query "defaultHostname" -o tsv)

    WEBHOOK_URL="https://${CUSTOM_DOMAIN}/api/webhooks/stripe"
    
    info "Creating webhook for: ${WEBHOOK_URL}"
    
    WEBHOOK_RESULT=$(stripe webhook_endpoints create \
        --url "$WEBHOOK_URL" \
        --enabled-events checkout.session.completed \
        --api-key "$STRIPE_SECRET_KEY" 2>&1) || true
    
    WEBHOOK_SECRET=$(echo "$WEBHOOK_RESULT" | grep -o 'whsec_[a-zA-Z0-9]*' | head -1)
    
    if [ -n "$WEBHOOK_SECRET" ]; then
        # Add webhook secret to Azure
        az staticwebapp appsettings set \
            --name "$AZURE_STATIC_APP_NAME" \
            --resource-group "$AZURE_RESOURCE_GROUP" \
            --setting-names "STRIPE_WEBHOOK_SECRET=${WEBHOOK_SECRET}" \
            > /dev/null
        
        ok "Stripe webhook created and secret saved to Azure"
    else
        warn "Could not auto-create Stripe webhook. Set it up manually:"
        echo "   1. Go to: https://dashboard.stripe.com/webhooks"
        echo "   2. Add endpoint: ${WEBHOOK_URL}"
        echo "   3. Event: checkout.session.completed"
        echo "   4. Copy signing secret → add as STRIPE_WEBHOOK_SECRET in Azure"
    fi
else
    warn "Stripe CLI not installed — skipping webhook setup"
    echo "   Set it up manually:"
    echo "   1. Go to: https://dashboard.stripe.com/webhooks"
    echo "   2. Add endpoint: https://${CUSTOM_DOMAIN}/api/webhooks/stripe"
    echo "   3. Event: checkout.session.completed"
    echo "   4. Copy signing secret → add as STRIPE_WEBHOOK_SECRET in Azure"
fi

# ---- STEP 5: Custom Domain ----
info "Step 5/5: Custom domain setup..."

AZURE_HOSTNAME=$(az staticwebapp show \
    --name "$AZURE_STATIC_APP_NAME" \
    --resource-group "$AZURE_RESOURCE_GROUP" \
    --query "defaultHostname" -o tsv)

info "Attempting to add custom domain: ${CUSTOM_DOMAIN}"

az staticwebapp hostname set \
    --name "$AZURE_STATIC_APP_NAME" \
    --resource-group "$AZURE_RESOURCE_GROUP" \
    --hostname "$CUSTOM_DOMAIN" 2>/dev/null && ok "Custom domain added to Azure" || {
    warn "Custom domain not yet verified. Add this DNS record first:"
    echo ""
    echo "   Type:  CNAME"
    echo "   Name:  www"
    echo "   Value: ${AZURE_HOSTNAME}"
    echo ""
    echo "   After DNS propagates, re-run or add the domain in Azure Portal."
}

# ---- DONE ----
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   Setup Complete! 🎉${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Summary:"
echo "  ✓ GitHub Actions workflow"
echo "  ✓ Azure deployment token → GitHub secret"
echo "  ✓ Azure environment variables"
echo "  ✓ Stripe webhook (check above for status)"
echo "  ✓ Custom domain (check above for DNS)"
echo ""
echo "Your site will deploy automatically on the next push to main."
echo "Default Azure URL: https://${AZURE_HOSTNAME}"
echo "Custom domain:     https://${CUSTOM_DOMAIN}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Add the CNAME DNS record if not done yet"
echo "  2. Revoke any GitHub PATs you shared"
echo "  3. Verify the deployment at your Azure URL"
echo "  4. Test a checkout flow with Stripe test mode first"
echo ""
echo "🔥 Go cause some chaos!"
