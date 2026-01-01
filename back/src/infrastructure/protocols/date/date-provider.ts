import { DateProviderInterface } from "@/core/ports/infrastructure/protocols/date/date-provider-interface";

export class DateProvider implements DateProviderInterface {
  addMonthStrict(baseDate: Date, monthsToAdd: number): Date {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const day = baseDate.getDate();

    let output = new Date(year, month + monthsToAdd);

    if (output.getDate() !== day) {
      output = new Date(year, month + monthsToAdd + 1, 0);
    }

    return output;
  }
}
