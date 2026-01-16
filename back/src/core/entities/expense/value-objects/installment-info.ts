export class InstallmentInfo {
  private readonly MAX_INSTALLMENTS = 120;
  private constructor(
    private readonly _current: number,
    private readonly _total: number
  ) {
    if (!Number.isInteger(_current) || !Number.isInteger(_total)) {
      throw new Error("Installment numbers must be integers");
    }

    if (_current < 1 || _total < 1) {
      throw new Error("Installment numbers must be positive");
    }

    if (_current > _total) {
      throw new Error(
        `Current installment (${_current}) cannot exceed total(${_total})`
      );
    }

    if (_total > this.MAX_INSTALLMENTS) {
      throw new Error(
        `Total installment cannot exceed ${this.MAX_INSTALLMENTS} months`
      );
    }
  }

  public static create(current: number, total: number): InstallmentInfo {
    return new InstallmentInfo(current, total);
  }

  get current(): number {
    return this._current;
  }

  get total(): number {
    return this._total;
  }

  public static single(): InstallmentInfo {
    return new InstallmentInfo(1, 1);
  }

  public isComplete(): boolean {
    return this._current === this._total;
  }

  public isSingle(): boolean {
    return this._total == 1;
  }

  public next(): InstallmentInfo {
    if (this.isComplete()) {
      throw new Error("Cannot advance beyond final installment");
    }
    return new InstallmentInfo(this._current + 1, this.total);
  }

  public equals(other: InstallmentInfo): boolean {
    if (!(other instanceof InstallmentInfo)) {
      return false;
    }

    return this._current === other._current && this._total === other._total;
  }

  public toString(): string {
    return `${this.current}/${this._total}`;
  }
}
