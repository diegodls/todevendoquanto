export class InstallmentInfo {
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
  }

  public static create(current: number, total: number): InstallmentInfo {
    return new InstallmentInfo(current, total);
  }

  public static single(): InstallmentInfo {
    return new InstallmentInfo(1, 1);
  }

  get current(): number {
    return this._current;
  }

  get total(): number {
    return this._total;
  }

  private isComplete(): boolean {
    return this._current === this._total;
  }

  public next(): InstallmentInfo {
    if (this.isComplete()) {
      throw new Error("Cannot advance beyond final installment");
    }
    return new InstallmentInfo(this._current + 1, this.total);
  }
}
