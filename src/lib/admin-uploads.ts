import { supabase } from "@/integrations/supabase/client";

const bucket = "sidokerto-media";
const allowedTypes = new Set(["image/png", "image/jpeg", "application/pdf"]);
const maxFileSize = 20 * 1024 * 1024;

export async function uploadAdminFile(file: File): Promise<string> {
  if (!allowedTypes.has(file.type)) {
    throw new Error("Pilih berkas PNG, JPG, atau PDF.");
  }
  if (file.size > maxFileSize) {
    throw new Error("Ukuran berkas maksimal 20 MB.");
  }

  const safeName = file.name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-100);
  const path = `${crypto.randomUUID()}-${safeName || "file"}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 365);
  if (!data?.signedUrl) throw new Error("Tautan berkas gagal dibuat.");
  return data.signedUrl;
}