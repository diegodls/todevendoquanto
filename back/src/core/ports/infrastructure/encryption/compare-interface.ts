export interface CompareInterface {
  execute(input: string, encrypted: string): Promise<boolean>;
}
