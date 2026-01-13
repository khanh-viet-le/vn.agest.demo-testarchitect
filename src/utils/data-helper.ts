import { readFileSync } from "fs";
import path from "path";

export function getDataset<T>(datasetName: string): Array<T> {
  const datasetFileName = datasetName + ".dataset.json";
  const testDataPath = path.resolve(
    __dirname,
    "..",
    "..",
    "datasets",
    datasetFileName
  );

  try {
    const rawData = readFileSync(testDataPath, "utf8");
    const data = JSON.parse(rawData) as Array<T>;
    return data;
  } catch (error) {
    throw new Error(
      `Cannot load dataset: ${datasetFileName} in file path: ${testDataPath}`
    );
  }
}
