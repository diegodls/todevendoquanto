export interface PasswordHasherInterface {
  hash(input: string): Promise<string>;
  compare(input: string, encrypted: string): Promise<boolean>;
}
