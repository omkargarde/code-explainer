/**
 * Waits for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to wait.
 */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
