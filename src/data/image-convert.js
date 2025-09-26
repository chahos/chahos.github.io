import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const TXT_FILE = path.resolve("./src/data/images.txt");
const JSON_FILE = path.resolve("./src/data/image-source.json");

// Read existing JSON if available
let existingData = { data: [] };
if (existsSync(JSON_FILE)) {
  const rawJson = readFileSync(JSON_FILE, "utf-8");
  existingData = JSON.parse(rawJson);
}

const data = existingData.data
let index = existingData.data.length ? existingData.data[existingData.data.length - 1].id : -1
index++

const linkSet = {}
for (const i of data) {
  linkSet[i.link] = true
}

// Read the txt file
const input = readFileSync(TXT_FILE, "utf-8");

// Split lines and process
const lines = input.split(/\n/).filter(Boolean);

for (const line of lines) {
  const [name, link] = line.split(",").map(i => i.trim())
  if (!link || !link.startsWith("http") || linkSet[link]) {
    continue
  }
  data.push({id: index, name, link})
  linkSet[link] = true
  index++
}

// Write back merged data
writeFileSync(JSON_FILE, JSON.stringify(existingData, null, 2));

console.log("✅ image-source.json updated successfully!");
