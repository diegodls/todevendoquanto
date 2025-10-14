import { z } from "zod";

const trulyFields = ["true", "yes", "on", "1"];

// ! only work with "as", "satisfies" throw error

const StringToBoolean = z
  .union([z.string(), z.boolean()])
  .transform((val) => {
    if (typeof val == "boolean") return val;

    if (trulyFields.includes(val.toLowerCase())) {
      return true;
    }
    return false;
  })
  .pipe(z.boolean());

export { StringToBoolean };
