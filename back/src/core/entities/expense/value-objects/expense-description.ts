import { InvalidDescriptionError } from "@/core/shared/errors/domain/InvalidDescriptionError";
import { HTML_TAG_REGEX } from "./../../../shared/regex/html-tag";

interface DescriptionProps {
  value: string;
}

export class ExpenseDescription {
  private readonly _value: string;

  private static readonly MAX_LENGTH = 500;

  private constructor(props: DescriptionProps) {
    this._value = props.value;
    Object.freeze(this);
  }

  public static create(value: string): ExpenseDescription {
    const trimmed = value.trim();

    if (!trimmed) {
      throw new InvalidDescriptionError(
        "Description cannot be empty or whitespace.",
      );
    }

    if (trimmed.length > ExpenseDescription.MAX_LENGTH) {
      throw new InvalidDescriptionError(
        `Description cannot exceed ${ExpenseDescription.MAX_LENGTH} characters.`,
      );
    }

    if (HTML_TAG_REGEX.test(trimmed)) {
      throw new InvalidDescriptionError(
        "Description cannot contain HTML tags.",
      );
    }

    return new ExpenseDescription({ value: trimmed });
  }

  public toString(): string {
    return this._value;
  }

  public equals(other: ExpenseDescription): boolean {
    if (other === null || other === undefined) return false;
    return this._value === other.toString();
  }
}
