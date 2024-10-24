import * as fs from 'fs';
import * as path from 'path';

export const UploadFileLocal = async (
  buffer: Buffer,
  filePath: string,
): Promise<void> => {
  const directory = path.dirname(filePath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const getLocalFilePath = (filename: string): string => {
  const basePath =
    process.env.NODE_ENV === 'production'
      ? '/tmp'
      : path.resolve(__dirname, '../tmp/uploads');
  return path.join(basePath, filename);
};
