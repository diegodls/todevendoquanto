export class UserId {
  private readonly _value: string;

  private constructor(id: string) {
    this._value = id;
  }

  public static create(): UserId {
    return new UserId(crypto.randomUUID());
  }

  public static from(id: string): UserId {
    if (!id || id.trim().length === 0) {
      throw new Error("UserId cannot be empty");
    }

    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidV4Regex.test(id)) {
      throw new Error("UserId must be a valid UUID v4");
    }

    return new UserId(id);
  }

  public toString(): string {
    return this._value;
  }

  public equals(other: UserId): boolean {
    if (!other) return false;
    return this._value === other._value;
  }
}
