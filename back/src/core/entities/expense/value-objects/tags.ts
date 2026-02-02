import { Tag } from "@/core/entities/expense/value-objects/tag";

export class Tags {
  private static readonly MAX_TAGS = 10;

  private constructor(private readonly _tags: ReadonlyArray<Tag>) {
    if (_tags.length > Tags.MAX_TAGS) {
      throw new Error(`Maximum of ${Tags.MAX_TAGS} tags exceeded`);
    }
  }

  public static create(tags?: string[]): Tags {
    if (!tags || tags.length === 0) {
      return new Tags([]);
    }

    // Usa Set para remover duplicatas de forma eficiente (O(n))
    const uniqueTags = new Set<string>();

    for (const tag of tags) {
      const created = Tag.create(tag);
      uniqueTags.add(created.value);
    }

    // Converte Set → Array → Tag[]
    const tagObjects = Array.from(uniqueTags).map((value) => Tag.create(value));

    return new Tags(tagObjects);
  }

  public static fromTags(tags: Tag[]): Tags {
    // Remove duplicatas
    const uniqueValues = new Set(tags.map((t) => t.value));
    const uniqueTags = Array.from(uniqueValues).map((v) => Tag.create(v));

    return new Tags(uniqueTags);
  }

  public static empty(): Tags {
    return new Tags([]);
  }

  get value(): string[] {
    // Retorna cópia para prevenir mutação
    return this._tags.map((tag) => tag.value);
  }

  get tags(): ReadonlyArray<Tag> {
    // Retorna array readonly
    return this._tags;
  }

  public add(tag: string | Tag): Tags {
    const newTag = typeof tag === "string" ? Tag.create(tag) : tag;

    // Verifica se já existe
    if (this.has(newTag)) {
      return this; // Retorna mesmo objeto (imutável)
    }

    // Verifica limite
    if (this._tags.length >= Tags.MAX_TAGS) {
      throw new Error(`Cannot add more than ${Tags.MAX_TAGS} tags`);
    }

    // Cria novo Tags com a tag adicionada
    return new Tags([...this._tags, newTag]);
  }

  public remove(tag: string | Tag): Tags {
    const tagValue =
      typeof tag === "string" ? Tag.create(tag).value : tag.value;

    // Filtra removendo a tag
    const filtered = this._tags.filter((t) => t.value !== tagValue);

    // Se não removeu nada, retorna mesmo objeto
    if (filtered.length === this._tags.length) {
      return this;
    }

    return new Tags(filtered);
  }

  public has(tag: string | Tag): boolean {
    const tagValue =
      typeof tag === "string" ? Tag.create(tag).value : tag.value;
    return this._tags.some((t) => t.value === tagValue);
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

    // Compara cada tag (assumindo que estão na mesma ordem)
    // Se quiser comparação sem ordem, use Set
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

  public map<T>(fn: (tag: Tag, index: number) => T): T[] {
    return this._tags.map(fn);
  }

  public filter(predicate: (tag: Tag) => boolean): Tags {
    const filtered = this._tags.filter(predicate);
    return new Tags(filtered);
  }

  public forEach(fn: (tag: Tag, index: number) => void): void {
    this._tags.forEach(fn);
  }
}
