import { access } from "node:fs/promises";
import { constants } from "node:fs";

export async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true; // ✅ File exists
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return false; // 🚫 File does not exist
    }
    throw error; // ⚠️ Unexpected error (e.g., permission denied)
  }
}
