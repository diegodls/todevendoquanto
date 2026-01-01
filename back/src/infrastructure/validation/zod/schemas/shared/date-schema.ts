import { DATE_PATTERNS } from "@/core/shared/regex/date-patterns";
import z from "zod";

export const DateSchema = z
  .string()
  .optional()
  .transform((dateString, context) => {
    if (dateString) {
      const matchPatternDate = dateString.match(DATE_PATTERNS);

      if (matchPatternDate) {
        const [_, yearString, monthString, dayString] = matchPatternDate;
        const year = parseInt(yearString);
        const month = parseInt(monthString);
        const day = parseInt(dayString);
        const defaultHourDrift = 12;
        // prevent drift, local 01/01/2026 11:00:00 ~> cloud 02/01/2026 00:00:00

        const matchDate = new Date(
          year,
          month - 1,
          day,
          defaultHourDrift,
          0,
          0
        );

        if (matchDate.getDate() != day) {
          context.addIssue({
            code: "custom",
            message: `Invalid date, day ${matchDate.getDate()} doesn't exist in ${matchDate.getMonth()} month`,
          });
          return z.NEVER;
        }
        return matchDate;
      }

      const fullISODate = new Date(dateString);

      if (isNaN(fullISODate.getTime())) {
        context.addIssue({
          code: "custom",
          message: `Invalid date type, please use ISO: YYYY-MM-DDTHH:MM:SS.NNNZ or YYYY-MM-DD or YYYY/MM/DD`,
        });
        return z.NEVER;
      }

      return fullISODate;
    }
  });
