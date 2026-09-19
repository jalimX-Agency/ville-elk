import "server-only";
import { randomBytes } from "node:crypto";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Photographs live in Cloudflare R2 and are served from the bucket's custom
 * domain, so the public site never proxies them. R2 speaks the S3 API; the
 * endpoint below is the API host, R2_PUBLIC_URL is the CDN host.
 */
function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

let client: S3Client | undefined;

function s3(): S3Client {
  client ??= new S3Client({
    region: "auto",
    endpoint: `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env("R2_ACCESS_KEY_ID"),
      secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
    },
  });
  return client;
}

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

/**
 * A browser's Content-Type is whatever the browser felt like sending, and these
 * files end up on a public domain. Read the first bytes instead: every format
 * below announces itself in its own header.
 */
const SIGNATURES: { ext: string; type: string; matches: (b: Buffer) => boolean }[] = [
  {
    ext: "jpg",
    type: "image/jpeg",
    matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    ext: "png",
    type: "image/png",
    matches: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  {
    ext: "webp",
    type: "image/webp",
    matches: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP",
  },
  {
    ext: "avif",
    type: "image/avif",
    // ISO-BMFF: bytes 4..8 are "ftyp", then the brand.
    matches: (b) =>
      b.subarray(4, 8).toString("ascii") === "ftyp" &&
      ["avif", "avis"].includes(b.subarray(8, 12).toString("ascii")),
  },
];

export type ImageKind = { ext: string; type: string };

export function identifyImage(bytes: Buffer): ImageKind | null {
  if (bytes.length < 12) return null;
  const match = SIGNATURES.find((signature) => signature.matches(bytes));
  return match ? { ext: match.ext, type: match.type } : null;
}

/**
 * Uploads under a random name. Two people saving "piscine.jpg" never collide,
 * and a replaced photograph never serves from a stale cache.
 */
export async function uploadImage(
  bytes: Buffer,
  kind: ImageKind,
  folder: string,
): Promise<string> {
  const key = `${folder}/${randomBytes(12).toString("hex")}.${kind.ext}`;

  await s3().send(
    new PutObjectCommand({
      Bucket: env("R2_BUCKET_NAME"),
      Key: key,
      Body: bytes,
      ContentType: kind.type,
      // The name is random, so the object at this URL can never change.
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${env("R2_PUBLIC_URL").replace(/\/$/, "")}/${key}`;
}

/** True for URLs this bucket serves — anything else is not ours to delete. */
export function isStoredImage(url: string): boolean {
  const base = process.env.R2_PUBLIC_URL;
  return Boolean(base) && url.startsWith(`${base!.replace(/\/$/, "")}/`);
}

/** Removes a photograph the dashboard replaced. Failure here is never fatal. */
export async function deleteImage(url: string): Promise<void> {
  if (!isStoredImage(url)) return;
  const key = url.slice(`${env("R2_PUBLIC_URL").replace(/\/$/, "")}/`.length);
  if (!key) return;

  try {
    await s3().send(new DeleteObjectCommand({ Bucket: env("R2_BUCKET_NAME"), Key: key }));
  } catch (error) {
    // An orphaned object costs a fraction of a cent; a failed save costs the
    // owner their work.
    console.error("Could not delete the replaced image", key, error);
  }
}
