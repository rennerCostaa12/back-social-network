import * as fs from 'fs';
import * as path from 'path';

// Função para upload local de arquivos
export const UploadFileLocal = async (
  buffer: Buffer,
  filePath: string,
): Promise<void> => {
  const directory = path.dirname(filePath);

  // Verifica se o diretório existe; se não, cria-o
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, buffer, (err) => {
      if (err){
        reject(err)
      }else{
        resolve()
      };
    });
  });
};