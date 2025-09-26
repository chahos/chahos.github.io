import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const JSON_FILE = path.resolve("./src/data/image-source.json");

const newUpdates = `
`

// Read existing JSON if available
let existingData = null;
if (existsSync(JSON_FILE)) {
  const rawJson = readFileSync(JSON_FILE, "utf-8");
  existingData = JSON.parse(rawJson);
}

const data = existingData?.data

if (!data || !Array.isArray(data)) {
  throw new Error("No existingData")
}

const mapper = {}

const lines = newUpdates.split("\n")
for (const line of lines) {
  const temp = line.split("|")
  if (temp.length !== 3) {
    continue
  }
  mapper[temp[0]] = {
    like: temp[1] === "1",
    unlike: temp[2] === "1",
  }
}

for (const item of data) {
  const change = mapper[item.id.toString()]
  if (!change) {
    continue
  }
  item.like = change.like
  item.unlike = change.unlike
}

// Write back merged data
writeFileSync(JSON_FILE, JSON.stringify({ data }, null, 2));

console.log("✅ image-source.json updated successfully!");