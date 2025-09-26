import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const JSON_FILE = path.resolve("./src/data/image-source.json");

const newUpdates = `
0|1|0
1|1|0
2|0|0
3|1|0
5|1|0
7|1|0
8|1|0
10|1|0
11|1|0
12|1|0
13|1|0
16|0|1
17|1|0
20|0|1
21|0|1
22|0|1
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