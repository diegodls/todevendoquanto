import { DomainError } from "../domain-error";

export class TagError extends DomainError {}

export class TagTooShortError extends TagError {
  constructor(minLength: number) {
    super(`Tag must have at least ${minLength} characters`);
  }
}

export class TagTooLongError extends TagError {
  constructor(maxLength: number) {
    super(`Tag cannot exceed ${maxLength} characters`);
  }
}

export class TagInvalidFormatError extends TagError {
  constructor() {
    super("Tag can only contain lowercase letters, numbers, and hyphens");
  }
}

export class TagEmptyError extends TagError {
  constructor() {
    super("Tag cannot be empty or whitespace");
  }
}

export class TagsLimitExceededError extends TagError {
  constructor(maxTags: number) {
    super(`Maximum of ${maxTags} tags exceeded`);
  }
}

export class CannotAddMoreTagsError extends TagError {
  constructor(maxTags: number) {
    super(`Cannot add more than ${maxTags} tags`);
  }
}
