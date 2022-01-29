import { readFile } from 'fs';

export async function readJson(filePath) {
    return new Promise((resolve, reject) => {
        readFile(`${process.cwd()}/${filePath}`, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        })
    });
}