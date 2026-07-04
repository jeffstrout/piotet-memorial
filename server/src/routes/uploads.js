// Presigned uploads to DO Spaces (Milestone 3).
//
//   POST /api/admin/uploads/sign  { filename, contentType, folder }
//     → { url, key, publicUrl }   (admin)
//
// The browser then PUTs the file straight to `url` (with the same Content-Type
// and `x-amz-acl: public-read`), and saves the returned `key` onto the photo or
// song record. Keeping bytes off our server keeps the API tiny.
//
// If SPACES_* env vars aren't set, /sign returns 503 and the admin UI falls back
// to letting you paste an already-uploaded key by hand.

import { Router } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const uploadsRouter = Router();

const {
  SPACES_KEY, SPACES_SECRET, SPACES_BUCKET, SPACES_REGION,
  SPACES_ENDPOINT, MEDIA_CDN_BASE,
} = process.env;

export const spacesConfigured = Boolean(
  SPACES_KEY && SPACES_SECRET && SPACES_BUCKET && SPACES_REGION && SPACES_ENDPOINT,
);

let client = null;
function s3() {
  if (!client) {
    client = new S3Client({
      region: SPACES_REGION,
      endpoint: SPACES_ENDPOINT,          // e.g. https://nyc3.digitaloceanspaces.com
      forcePathStyle: false,
      credentials: { accessKeyId: SPACES_KEY, secretAccessKey: SPACES_SECRET },
    });
  }
  return client;
}

const ALLOWED_FOLDERS = new Set(['photos', 'videos', 'posters', 'audio', 'downloads']);
const safeName = (name) =>
  String(name || 'file').toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '').slice(-80) || 'file';

// Lets the admin UI decide whether to show upload widgets or key-paste fallback,
// and resolve keys → preview URLs.
uploadsRouter.get('/uploads/config', (_req, res) =>
  res.json({ enabled: spacesConfigured, cdnBase: (MEDIA_CDN_BASE || '').replace(/\/$/, '') }),
);

uploadsRouter.post('/uploads/sign', async (req, res, next) => {
  try {
    if (!spacesConfigured) {
      return res.status(503).json({ error: 'Media uploads are not configured yet.' });
    }
    const folder = ALLOWED_FOLDERS.has(req.body?.folder) ? req.body.folder : 'photos';
    const key = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e6)}-${safeName(req.body?.filename)}`;

    // Sign a bare PUT (host only). We deliberately do NOT sign ContentType or an
    // ACL: signing them forces the browser to echo them byte-for-byte or the
    // upload fails with SignatureDoesNotMatch. Spaces still stores the
    // Content-Type the browser sends, and public read is granted once via a
    // bucket policy on the Space (see README), not per-object ACL.
    const url = await getSignedUrl(
      s3(),
      new PutObjectCommand({ Bucket: SPACES_BUCKET, Key: key }),
      { expiresIn: 600 },
    );

    const cdn = (MEDIA_CDN_BASE || '').replace(/\/$/, '');
    res.json({ url, key, publicUrl: cdn ? `${cdn}/${key}` : null });
  } catch (err) {
    next(err);
  }
});
