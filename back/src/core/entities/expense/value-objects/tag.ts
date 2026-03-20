import {
  TagEmptyError,
  TagInvalidFormatError,
  TagTooLongError,
  TagTooShortError,
} from "@/core/shared/errors/domain/expense-value-object-errors";

const ONLY_LETTERS_NUMBERS_HYPHENS = /^[a-z0-9-]+$/;
const LOWERCASE_NOSPACE_HYPHENS = /\s+/g;
export class Tag {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 20;

  private constructor(private readonly _value: string) {
    if (_value.length < Tag.MIN_LENGTH) {
      throw new TagTooShortError(
        `Tag must have at least ${Tag.MIN_LENGTH} characters`,
      );
    }

    if (_value.length > Tag.MAX_LENGTH) {
      throw new TagTooLongError(
        `Tag cannot exceed ${Tag.MAX_LENGTH} characters`,
      );
    }

    if (!ONLY_LETTERS_NUMBERS_HYPHENS.test(_value)) {
      throw new TagInvalidFormatError(
        "Tag can only contain lowercase letters, numbers, and hyphens",
      );
    }
  }

  public static create(tag: string): Tag {
    const trimmed = tag.trim();

    if (trimmed.length === 0) {
      throw new TagEmptyError("Tag cannot be empty or whitespace");
    }

    const normalized = trimmed
      .toLowerCase()
      .replace(LOWERCASE_NOSPACE_HYPHENS, "-");

    return new Tag(normalized);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Tag): boolean {
    if (!(other instanceof Tag)) {
      return false;
    }

    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
