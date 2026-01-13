import { Tag } from "@/core/entities/expense/value-objects/tag";

export class Tags {
  private constructor(private readonly _value: string[]) {
    if (this._value.length > 10) {
      throw new Error("Maximum of 10 tags exceeded.");
    }
  }

  public static create(tags?: string[]): Tags {
    if (!tags || tags.length <= 0) {
      return new Tags([]);
    }

    let newTagArr: string[] = [];

    for (const tag of tags) {
      const newTag = Tag.create(tag);

      if (!newTagArr.includes(newTag.value)) {
        newTagArr.push(newTag.value);
      }
    }

    return new Tags(newTagArr);
  }

  public get value(): string[] {
    return this._value;
  }

  public add(tag: string): void {
    const newTag = Tag.create(tag);

    if (!this._value.includes(newTag.value)) {
      this._value.push(newTag.value);
    }
  }
}
