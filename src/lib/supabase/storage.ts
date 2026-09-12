import { createServerSupabaseClient, createAdminSupabaseClient } from "./server";
import { createClient } from "./client";

export const STORAGE_BUCKETS = {
  DOCUMENTS: "documents", // Private: user-uploaded applications, citizen proofs, generated PDFs
  AVATARS: "avatars",     // Public or authenticated profile avatars
  TEMPLATES: "templates", // Public: standardized blank government application templates
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

/**
 * Uploads a document file to the private 'documents' bucket.
 * Files are stored under documents/{userId}/{fileName} for isolation.
 */
export async function uploadPrivateDocument(
  userId: string,
  fileName: string,
  fileBuffer: Buffer | Blob,
  contentType: string
) {
  const supabase = createServerSupabaseClient() || createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase Storage client is not configured.");
  }

  const path = `${userId}/${Date.now()}_${fileName}`;
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.DOCUMENTS)
    .upload(path, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    console.error("[Storage] Upload private document error:", error);
    throw error;
  }

  return { path: data.path };
}

/**
 * Creates a time-limited signed URL for private documents.
 * Private documents are never exposed through permanent public URLs.
 */
export async function getPrivateDocumentSignedUrl(
  path: string,
  expiresInSeconds: number = 3600
): Promise<string | null> {
  const supabase = createServerSupabaseClient() || createAdminSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.DOCUMENTS)
    .createSignedUrl(path, expiresInSeconds);

  if (error) {
    console.error("[Storage] Signed URL generation error:", error);
    return null;
  }

  return data.signedUrl;
}

/**
 * Uploads an avatar image to the 'avatars' bucket.
 */
export async function uploadUserAvatar(
  userId: string,
  fileName: string,
  fileBuffer: Buffer | Blob,
  contentType: string
) {
  const supabase = createServerSupabaseClient() || createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase Storage client is not configured.");
  }

  const path = `${userId}/${Date.now()}_${fileName}`;
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.AVATARS)
    .upload(path, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error("[Storage] Upload avatar error:", error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKETS.AVATARS)
    .getPublicUrl(data.path);

  return { path: data.path, publicUrl: publicUrlData.publicUrl };
}

/**
 * Retrieves public URL for public bucket assets (templates, avatars).
 */
export function getStoragePublicUrl(bucket: StorageBucket, path: string): string | null {
  const client = typeof window !== "undefined" ? createClient() : createServerSupabaseClient();
  if (!client) {
    return null;
  }

  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
