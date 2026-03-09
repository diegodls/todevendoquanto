export class InstallmentId {
  private readonly _value: string;

  private constructor(id: string) {
    this._value = id;
  }

  public static create(): InstallmentId {
    return new InstallmentId(crypto.randomUUID());
  }

  public static from(id: string): InstallmentId {
    if (!id || id.trim().length === 0) {
      throw new Error("Installment id cannot be empty");
    }

    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidV4Regex.test(id)) {
      throw new Error("Installment id must be a valid UUID v4");
    }

    return new InstallmentId(id);
  }

  public toString(): string {
    return this._value;
  }

  public equals(other: InstallmentId): boolean {
    if (!other) return false;
    return this._value === other._value;
  }
}
