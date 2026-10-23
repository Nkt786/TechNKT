import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export interface StorageUploadResult {
  success: boolean;
  url: string;
  provider: "neon_s3" | "local";
  filename: string;
  size: number;
  mimeType: string;
  bucket?: string;
  objectKey?: string;
  error?: string;
}

export function getNeonStorageConfig() {
  if (!process.env.AWS_ENDPOINT_URL_S3 && typeof process.loadEnvFile === "function") {
    try {
      if (fs.existsSync(".env")) process.loadEnvFile(".env");
    } catch {}
  }
  const endpoint = process.env.NEON_STORAGE_ENDPOINT || process.env.AWS_ENDPOINT_URL_S3;
  const accessKeyId = process.env.NEON_STORAGE_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEON_STORAGE_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  const bucket = process.env.NEON_STORAGE_BUCKET || "technkt-products";
  const region = process.env.NEON_STORAGE_REGION || process.env.AWS_REGION || "ap-southeast-1";
  const publicBaseUrl = process.env.NEON_STORAGE_PUBLIC_URL;

  const isConfigured = Boolean(endpoint && accessKeyId && secretAccessKey);

  return {
    isConfigured,
    endpoint,
    accessKeyId,
    secretAccessKey,
    bucket,
    region,
    publicBaseUrl,
  };
}

let _s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  const config = getNeonStorageConfig();
  if (!config.isConfigured) {
    throw new Error("Neon Object Storage is not configured.");
  }
  if (!_s3Client) {
    _s3Client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId!,
        secretAccessKey: config.secretAccessKey!,
      },
      forcePathStyle: true,
    });
  }
  return _s3Client;
}

/**
 * Uploads a product image.
 * Uses Neon Object Storage (S3 wire protocol) when configured.
 * Automatically falls back to local static filesystem storage when developing locally.
 */
export async function uploadProductImage(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<StorageUploadResult> {
  const ext = path.extname(originalFilename) || (mimeType === "image/png" ? ".png" : mimeType === "image/webp" ? ".webp" : ".jpg");
  const uniqueId = crypto.randomBytes(6).toString("hex");
  const filename = `product_${Date.now()}_${uniqueId}${ext}`;
  const config = getNeonStorageConfig();

  if (config.isConfigured) {
    try {
      const client = getS3Client();
      const objectKey = `products/${filename}`;

      await client.send(
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: objectKey,
          Body: buffer,
          ContentType: mimeType,
          Metadata: {
            "original-filename": originalFilename,
            "uploaded-by": "technkt-admin",
          },
        })
      );

      // Determine public URL
      let publicUrl: string;
      if (config.publicBaseUrl) {
        publicUrl = `${config.publicBaseUrl.replace(/\/$/, "")}/${objectKey}`;
      } else {
        // Neon Object Storage wildcard SSL certificate (*.storage...neon.tech) requires path-style URLs
        const cleanEndpoint = config.endpoint!.replace(/\/$/, "");
        publicUrl = `${cleanEndpoint}/${config.bucket}/${objectKey}`;
      }

      return {
        success: true,
        url: publicUrl,
        provider: "neon_s3",
        filename,
        size: buffer.length,
        mimeType,
        bucket: config.bucket,
        objectKey,
      };
    } catch (err: any) {
      console.error("[Neon Storage] S3 upload failed, falling back to local storage:", err.message);
    }
  }

  // Local filesystem fallback
  const targetDir = path.resolve(process.cwd(), "public/images/products");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, buffer);
  const publicUrl = `/images/products/${filename}`;

  return {
    success: true,
    url: publicUrl,
    provider: "local",
    filename,
    size: buffer.length,
    mimeType,
  };
}
