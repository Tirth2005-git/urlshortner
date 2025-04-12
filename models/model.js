import { readFile, writeFile } from "fs/promises";
const path = "./data/links.json";
export async function loadFile() {
  let data = await readFile(path, "utf-8");
  return JSON.parse(data);
}

export async function saveLink(links) {
  await writeFile(path, JSON.stringify(links));
}

export function sendLink(res, shortcode) {
  res.status(200).json({
    shorturl: `${process.env.HOST}` + `${shortcode}`,
  });
}
