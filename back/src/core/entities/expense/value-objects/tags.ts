import { Tag } from "@/core/entities/expense/value-objects/tag";

export class Tags {
  private static readonly MAX_TAGS = 10;

  private constructor(private readonly _tags: ReadonlyArray<Tag>) {
    if (this._tags.length > Tags.MAX_TAGS) {
      throw new Error(`Maximum of ${Tags.MAX_TAGS} tags exceeded.`);
    }
  }

  public static create(tags?: string[]): Tags {
    if (!tags || tags.length === 0) {
      return new Tags([]);
    }

    let uniqueTags = new Set<string>();

    for (const tag of tags) {
      const created = Tag.create(tag);

      uniqueTags.add(created.value);
    }

    const tagObjects = Array.from(uniqueTags).map((value) => Tag.create(value));

    return new Tags(tagObjects);
  }

  public get value(): string[] {
    return this._tags.map((tag) => tag.value);
  }

  public get tags(): ReadonlyArray<Tag> {
    return this._tags;
  }

  public static fromTags(tags: Tag[]): Tags {
    const uniqueValues = new Set(tags.map((t) => t.value));
    const uniqueTags = Array.from(uniqueValues).map((v) => Tag.create(v));
    return new Tags(uniqueTags);
  }

  public static empty(): Tags {
    return new Tags([]);
  }

  public add(tag: string | Tag): Tags {
    const newTag = typeof tag === "string" ? Tag.create(tag) : tag;

    if (this.has(newTag)) {
      return this;
    }

    if (this._tags.length >= Tags.MAX_TAGS) {
      throw new Error(`Cannot add more than ${Tags.MAX_TAGS} tags`);
    }

    return new Tags([...this._tags, newTag]);
  }

  public has(tag: string | Tag): boolean {
    const tagValue =
      typeof tag === "string" ? Tag.create(tag).value : tag.value;

    return this._tags.some((t) => t.value === tagValue);
  }

  public remove(tag: string | Tag): Tags {
    const tagValue = typeof tag == "string" ? Tag.create(tag).value : tag.value;

    const filtered = this._tags.filter((t) => t.value !== tagValue);

    if (filtered.length === this._tags.length) {
      return this;
    }
    return new Tags(filtered);
  }

  public isEmpty(): boolean {
    return this._tags.length === 0;
  }

  public size(): number {
    return this._tags.length;
  }

  public equals(other: Tags): boolean {
    if (!(other instanceof Tags)) {
      return false;
    }

    if (this._tags.length !== other._tags.length) {
      return false;
    }

    const thisSorted = [...this._tags].sort((a, b) =>
      a.value.localeCompare(b.value),
    );

    const otherSorted = [...other._tags].sort((a, b) =>
      a.value.localeCompare(b.value),
    );

    return thisSorted.every((tag, i) => tag.equals(otherSorted[i]));
  }

  public toArray(): string[] {
    return this._tags.map((tag) => tag.value);
  }

  public toString(): string {
    return this._tags.map((t) => t.value).join(", ");
  }
}
