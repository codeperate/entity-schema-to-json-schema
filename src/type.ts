export type ExtractKindKeys<T> = {
  [K in keyof T]: T[K] extends { kind: string } ? K : never;
}[keyof T];
