declare module "@paralleldrive/cuid2" {
  export function createId(): string;
  export function init(options?: {
    length?: number;
    fingerprint?: string;
  }): () => string;
  export function isCuid(id: string): boolean;
}
