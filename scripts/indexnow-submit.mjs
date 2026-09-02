#!/usr/bin/env node
/**
 * Submit the site's URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 *
 * Runs after a successful deploy. Reads the freshly built out/sitemap.xml so the
 * submitted list always matches what was just published.
 *
 *   node scripts/indexnow-submit.mjs            # submit every sitemap URL
 *   node scripts/indexnow-submit.mjs --dry-run  # print the payload, send nothing
 *
 * The key file lives at public/<key>.txt and is deployed to https://<host>/<key>.txt,
 * which is how IndexNow verifies ownership. Rotating the key means renaming that file.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const HOST = process.env.INDEXNOW_HOST || 'annoyingkids.com';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 10000;
const DRY_RUN = process.argv.includes('--dry-run');

function resolveKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY;
  const keyFile = readdirSync('public').find((f) => /^[0-9a-f]{8,128}\.txt$/i.test(f));
  if (!keyFile) throw new Error('No IndexNow key file found in public/ and INDEXNOW_KEY is unset.');
  return path.basename(keyFile, '.txt');
}

function readSitemapUrls() {
  const file = path.join('out', 'sitemap.xml');
  if (!existsSync(file)) throw new Error('out/sitemap.xml not found — run `npm run build` before submitting.');
  const xml = readFileSync(file, 'utf8');
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  return { file, urls: [...new Set(urls)].filter((u) => u.includes(HOST)) };
}

async function main() {
  const key = resolveKey();
  const { file, urls } = readSitemapUrls();
  if (urls.length === 0) throw new Error(`No URLs for ${HOST} in ${file}.`);
  if (urls.length > MAX_URLS) throw new Error(`${urls.length} URLs exceeds the IndexNow per-request limit of ${MAX_URLS}.`);

  const body = { host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList: urls };
  console.log(`IndexNow: ${urls.length} URLs from ${file} (key ${key.slice(0, 6)}…)`);

  if (DRY_RUN) {
    console.log('--dry-run: nothing submitted.');
    console.log(urls.slice(0, 5).join('\n') + (urls.length > 5 ? `\n… and ${urls.length - 5} more` : ''));
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  // 200 = accepted, 202 = accepted, key validation pending.
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`IndexNow returned ${res.status} ${res.statusText}: ${text.slice(0, 300)}`);
  }
  console.log(`IndexNow: ${res.status} ${res.statusText} — ${urls.length} URLs submitted.`);
}

main().catch((err) => {
  console.error('IndexNow submission failed: ' + err.message);
  process.exit(1);
});
