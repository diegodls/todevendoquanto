/**
 * Function to make the prisma "where" over the filters object
 * No need to use IF to check if a props exists to add on where
 */

export type GenericFilterMapper<
  TFilterObject extends object,
  TPrismaWhere extends object
> = {
  [K in keyof TFilterObject]?: (
    value: NonNullable<TFilterObject[K]>
  ) => TPrismaWhere;
};

export const queryFiltersToPrisma = <
  TFilters extends object,
  TPrismaWhere extends object
>(
  filters: TFilters,
  query: GenericFilterMapper<TFilters, TPrismaWhere>
): TPrismaWhere => {
  const where = {} as TPrismaWhere;

  for (const key in query) {
    const filterKey = key as keyof TFilters;

    const inputValue = filters[filterKey];

    if (inputValue !== undefined && inputValue !== null && inputValue !== "") {
      const mapperFunction = query[filterKey];

      if (mapperFunction) {
        const whereClause = (mapperFunction as any)(inputValue);
        Object.assign(where, whereClause);
      }
    }
  }

  return where;
};
