import { readJson } from "./json.js";

const res = await readJson('package.json');

export const version = res.version