export class Tag {
  private constructor(private readonly _value: string) {
    if (_value.length < 3) {
      throw new Error("Tag must have at least 3 characters");
    }

    if (_value.length > 10) {
      throw new Error("Tag cannot exceed 10 characters");
    }
  }

  public static create(tag: string): Tag {
    const trimmed = tag.trim();

    if (trimmed.length === 0) {
      throw new Error("Tag cannot be empty or whitespace");
    }

    return new Tag(tag);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Tag): boolean {
    if (!(other instanceof Tag)) {
      return false;
    }

    return other._value === this._value;
  }
}
