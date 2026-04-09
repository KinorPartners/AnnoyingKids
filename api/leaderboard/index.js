const { BlobServiceClient } = require('@azure/storage-blob');

const CONTAINER = 'game-data';
const BLOB_NAME = 'leaderboard.json';
const MAX_ENTRIES = 50;
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache',
};

async function getContainerClient() {
  const connStr = process.env.LEADERBOARD_STORAGE_CONNECTION;
  if (!connStr) return null;
  const blobService = BlobServiceClient.fromConnectionString(connStr);
  const container = blobService.getContainerClient(CONTAINER);
  await container.createIfNotExists();
  return container;
}

async function readLeaderboard(container) {
  try {
    const blob = container.getBlockBlobClient(BLOB_NAME);
    const resp = await blob.download(0);
    const text = await streamToString(resp.readableStreamBody);
    return JSON.parse(text);
  } catch (err) {
    if (err.statusCode === 404) return [];
    throw err;
  }
}

async function writeLeaderboard(container, data) {
  const blob = container.getBlockBlobClient(BLOB_NAME);
  const json = JSON.stringify(data);
  await blob.upload(json, json.length, {
    blobHTTPHeaders: { blobContentType: 'application/json' },
  });
}

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    stream.on('error', reject);
  });
}

module.exports = async function (context, req) {
  // --- GET: return current leaderboard ---
  if (req.method === 'GET') {
    const container = await getContainerClient();
    if (!container) {
      context.res = { status: 200, headers: CORS_HEADERS, body: JSON.stringify([]) };
      return;
    }
    try {
      const lb = await readLeaderboard(container);
      context.res = { status: 200, headers: CORS_HEADERS, body: JSON.stringify(lb) };
    } catch (err) {
      context.log.error('Leaderboard GET error:', err);
      context.res = { status: 200, headers: CORS_HEADERS, body: JSON.stringify([]) };
    }
    return;
  }

  // --- POST: add a new entry ---
  if (req.method === 'POST') {
    const { name, score, level } = req.body || {};

    // Validate
    if (
      typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 16 ||
      typeof score !== 'number' || !Number.isInteger(score) || score <= 0 ||
      typeof level !== 'number' || !Number.isInteger(level) || level <= 0
    ) {
      context.res = {
        status: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Invalid entry. Need name (1-16 chars), score (positive int), level (positive int).' }),
      };
      return;
    }

    const container = await getContainerClient();
    if (!container) {
      context.res = {
        status: 503,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Leaderboard storage not configured.' }),
      };
      return;
    }

    try {
      const lb = await readLeaderboard(container);
      const entry = { name: name.trim().slice(0, 16), score, level, ts: Date.now() };
      lb.push(entry);
      lb.sort((a, b) => b.score - a.score);
      const trimmed = lb.slice(0, MAX_ENTRIES);
      await writeLeaderboard(container, trimmed);
      context.res = { status: 200, headers: CORS_HEADERS, body: JSON.stringify(trimmed) };
    } catch (err) {
      context.log.error('Leaderboard POST error:', err);
      context.res = {
        status: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Failed to save score.' }),
      };
    }
    return;
  }

  context.res = { status: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed.' }) };
};
