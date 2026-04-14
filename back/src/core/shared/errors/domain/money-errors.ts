import { DomainError } from "../domain-error";

export class MoneyError extends DomainError {}

export class NegativeMoneyAmountError extends MoneyError {
  constructor() {
    super("Money amount cannot be negative");
  }
}

export class InvalidMoneyAmountError extends MoneyError {
  constructor() {
    super("Money amount must be a valid number");
  }
}

export class MoneyCurrencyEmptyError extends MoneyError {
  constructor() {
    super("Currency cannot be empty");
  }
}

export class InvalidMoneyCurrencyError extends MoneyError {
  constructor(currency: string) {
    super(`Invalid currency: ${currency}`);
  }
}

export class MoneyCurrencyMismatchError extends MoneyError {
  constructor(currentCurrency: string, otherCurrency: string) {
    super(
      `Cannot operate on different currencies: ${currentCurrency} vs ${otherCurrency}`,
    );
  }
}

export class NegativeMoneyResultError extends MoneyError {
  constructor(minuend: number, subtrahend: number) {
    super(
      `Subtraction would result in negative amount: ${minuend} - ${subtrahend} = ${minuend - subtrahend}`,
    );
  }
}

export class InvalidMoneyMultiplicationFactorError extends MoneyError {
  constructor() {
    super("Multiplication factor must be a finite number");
  }
}

export class NegativeMoneyMultiplicationFactorError extends MoneyError {
  constructor() {
    super("Multiplication factor cannot be negative");
  }
}

export class InvalidMoneyDivisorError extends MoneyError {
  constructor() {
    super("Divisor factor must be a finite number");
  }
}

export class MoneyDivisionByZeroError extends MoneyError {
  constructor() {
    super("Cannot divide by zero");
  }
}

export class NegativeMoneyDivisorError extends MoneyError {
  constructor() {
    super("Divisor cannot be negative");
  }
}

export class InvalidMoneySplitQuantityError extends MoneyError {
  constructor() {
    super("The split quantity must be a integer positive");
  }
}

export class MoneySplitAmountTooSmallError extends MoneyError {
  constructor(amount: number, parts: number) {
    super(`Is not possible to split ${amount} in ${parts} parts`);
  }
}

export class EmptyMoneyAllocationRatiosError extends MoneyError {
  constructor() {
    super("Ratios array cannot be empty");
  }
}

export class ZeroMoneyAllocationRatiosTotalError extends MoneyError {
  constructor() {
    super("Total of ratios cannot be zero");
  }
}

export class NegativeMoneyAllocationRatioError extends MoneyError {
  constructor() {
    super("Ratios cannot be negative");
  }
}
