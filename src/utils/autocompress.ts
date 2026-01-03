import sharp from "sharp";
import path from "path";
import fs from "fs";

export interface CompressOptions {
  targetKB?: number;
  maxWidth?: number;
  minQuality?: number;
  maxIterations?: number;
}

export const compressAndSaveImage = async (
  inputPath: string,
  outputFolder = "uploads/processed"
) => {
  const uploadDir = path.join(process.cwd(), outputFolder);

  // BUAT FOLDER JIKA BELUM ADA
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
  const outputPath = path.join(uploadDir, filename);

  await sharp(inputPath)
    .resize({ width: 1280 })
    .jpeg({ quality: 70 })
    .toFile(outputPath);

  return {
    filename,
    path: outputPath,
  };
};
