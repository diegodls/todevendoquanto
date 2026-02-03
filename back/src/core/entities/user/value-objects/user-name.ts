export class UserName {
  private static readonly MIN_NAME_LENGTH = 3;
  private static readonly MAX_NAME_LENGTH = 20;

  private constructor(private readonly _value: string) {
    if (_value.length < UserName.MIN_NAME_LENGTH) {
      throw new Error(
        `User name must have at least ${UserName.MIN_NAME_LENGTH} characters`,
      );
    }

    if (_value.length > UserName.MAX_NAME_LENGTH) {
      throw new Error(
        `User name cannot exceed ${UserName.MAX_NAME_LENGTH} characters`,
      );
    }
  }

  public static create(name: string) {
    const trimmed = name.trim();

    if (trimmed.length <= 0) {
      throw new Error("User name cannot be empty or whitespace");
    }

    return new UserName(trimmed);
  }

  public get value(): string {
    return this._value;
  }
}
