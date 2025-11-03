export type GenericFilterMapper<
  TFilterObject extends object,
  TPrismaWhere extends object
> = {
  [K in keyof TFilterObject]?: (
    value: NonNullable<TFilterObject[K]>
  ) => TPrismaWhere;
};

export const mapFiltersToPrisma = <
  TFilters extends object,
  TPrismaWhere extends object
>(
  filters: TFilters,
  mapper: GenericFilterMapper<TFilters, TPrismaWhere>
): TPrismaWhere => {
  const where = {} as TPrismaWhere;

  for (const key in mapper) {
    const filterKey = key as keyof TFilters;

    const inputValue = filters[filterKey];

    if (inputValue !== undefined && inputValue !== null && inputValue !== "") {
      const mapperFunction = mapper[filterKey];

      if (mapperFunction) {
        const whereClause = (mapperFunction as any)(inputValue);
        Object.assign(where, whereClause);
      }
    }
  }

  return where;
};
