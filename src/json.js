import { readFile, writeFile } from 'fs';

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

export async function writeJson(filePath, data) {
    return new Promise((resolve, reject) => {
        writeFile(`${process.cwd()}/${filePath}`, JSON.stringify(data), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}