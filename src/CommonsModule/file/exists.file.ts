import * as fs from 'fs';

export const exists = (path): Promise<void> => new Promise((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
