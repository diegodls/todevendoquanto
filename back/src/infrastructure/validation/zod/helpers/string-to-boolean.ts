import { z } from "zod";

const trulyFields = new Set(["true", "yes", "on", "1"]);

// ! only work with "as", "satisfies" throw error

export const StringToBoolean = z
  .string()
  .transform((val) => {
    if (typeof val == "boolean") return val;

    if (trulyFields.has(val.toLowerCase())) {
      return true;
    }
    return false;
  })
  .pipe(z.boolean())
  .optional();
