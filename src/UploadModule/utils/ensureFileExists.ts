import * as fs from 'fs';

const ensureFileExists = (path): Promise<void> => new Promise((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, (error) => {
      if (error){
        reject(error);
        return;
      }
      resolve();
    });
  });

export default ensureFileExists;
