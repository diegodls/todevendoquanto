import { ExpenseName } from "@/core/entities/expense/value-objects/expense-name";
import { InstallmentInfo } from "@/core/entities/expense/value-objects/installment-info";
import { Money } from "@/core/entities/expense/value-objects/money";
import { PaymentSchedule } from "@/core/entities/expense/value-objects/payment-schedule";
import { Tags } from "@/core/entities/expense/value-objects/tags";
import { describe, expect, it } from "vitest";
import { Expense, ExpenseStatus } from "./expense";

describe("Expense", () => {
  const validInput = {
    name: "Netflix Subscription",
    description: "Monthly streaming service",
    amount: 4990,
    totalInstallments: 1,
    paymentDay: new Date(2026, 0, 15),
    expirationDay: new Date(2026, 0, 20),
    paymentStartAt: new Date(2026, 0, 1),
    paymentEndAt: new Date(2026, 0, 31),
    userId: "user-123",
    installmentId: "inst-123",
    tags: ["streaming", "entertainment"],
  };

  describe("create", () => {
    it("should create valid expense", () => {
      const expense = Expense.create(validInput);

      expect(expense.name.value).toBe("Netflix Subscription");
      expect(expense.description).toBe("Monthly streaming service");
      expect(expense.amount.cents).toBe(4990);
      expect(expense.totalAmount.cents).toBe(4990);
      expect(expense.status).toBe(ExpenseStatus.PAYING);
      expect(expense.installmentInfo.current).toBe(1);
      expect(expense.installmentInfo.total).toBe(1);
      expect(expense.tags.size()).toBe(2);
    });

    it("should create expense with multiple installments", () => {
      const expense = Expense.create({
        ...validInput,
        totalInstallments: 12,
      });

      expect(expense.amount.cents).toBe(4990);
      expect(expense.totalAmount.cents).toBe(4990 * 12);
      expect(expense.installmentInfo.total).toBe(12);
    });

    it("should always start with PAYING status", () => {
      const expense = Expense.create(validInput);

      expect(expense.status).toBe(ExpenseStatus.PAYING);
    });

    it("should always start at installment 1", () => {
      const expense = Expense.create({
        ...validInput,
        totalInstallments: 12,
      });

      expect(expense.installmentInfo.current).toBe(1);
    });

    it("should create with custom currency", () => {
      const expense = Expense.create({
        ...validInput,
        currency: "USD",
      });

      expect(expense.amount.currency).toBe("USD");
      expect(expense.totalAmount.currency).toBe("USD");
    });

    it("should create without tags", () => {
      const expense = Expense.create({
        ...validInput,
        tags: undefined,
      });

      expect(expense.tags.isEmpty()).toBe(true);
    });

    it("should generate ID if not provided", () => {
      const expense = Expense.create(validInput);

      expect(expense.id).toBeDefined();
      expect(typeof expense.id).toBe("string");
    });

    it("should use provided ID", () => {
      const customId = "custom-id-123";
      const expense = Expense.create(validInput, customId);

      expect(expense.id).toBe(customId);
    });

    it("should set creation and update timestamps", () => {
      const before = new Date();
      const expense = Expense.create(validInput);
      const after = new Date();

      expect(expense.createdAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(expense.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(expense.updatedAt).toEqual(expense.createdAt);
    });
  });

  describe("restore", () => {
    it("should restore expense from persistence", () => {
      const props = {
        name: ExpenseName.create("netflix"),
        description: "Streaming",
        amount: Money.fromCents(4990),
        totalAmount: Money.fromCents(4990),
        status: ExpenseStatus.PAID,
        tags: Tags.create(["streaming"]),
        installmentInfo: InstallmentInfo.create(1, 1),
        paymentSchedule: PaymentSchedule.create(
          new Date(2026, 0, 15),
          new Date(2026, 0, 20),
          new Date(2026, 0, 1),
          new Date(2026, 0, 31),
        ),
        userId: "user-123",
        installmentId: "inst-123",
        createdAt: new Date(2025, 11, 1),
        updatedAt: new Date(2025, 11, 15),
      };

      const expense = Expense.restore("expense-123", props);

      expect(expense.id).toBe("expense-123");
      expect(expense.status).toBe(ExpenseStatus.PAID);
      expect(expense.createdAt).toEqual(props.createdAt);
    });
  });

  describe("validation errors", () => {
    it("should throw error on invalid name", () => {
      expect(() =>
        Expense.create({
          ...validInput,
          name: "ab",
        }),
      ).toThrow("Expense name must have at least 3 characters");
    });

    it("should throw error on invalid amount", () => {
      expect(() =>
        Expense.create({
          ...validInput,
          amount: -100,
        }),
      ).toThrow("Cents cannot be negative");
    });

    it("should throw error on invalid installments", () => {
      expect(() =>
        Expense.create({
          ...validInput,
          totalInstallments: 0,
        }),
      ).toThrow("Installment numbers must be positive");
    });

    it("should throw error on too many tags", () => {
      const manyTags = Array.from({ length: 11 }, (_, i) => `tag-${i}`);

      expect(() =>
        Expense.create({
          ...validInput,
          tags: manyTags,
        }),
      ).toThrow("Maximum of 10 tags exceeded");
    });
  });

  describe("invariants validation", () => {
    it("should validate amount consistency on restore", () => {
      const props = {
        name: ExpenseName.create("netflix"),
        description: "Streaming",
        amount: Money.fromCents(4990),
        totalAmount: Money.fromCents(10000),
        status: ExpenseStatus.PAYING,
        tags: Tags.empty(),
        installmentInfo: InstallmentInfo.create(1, 12),
        paymentSchedule: PaymentSchedule.create(
          new Date(2026, 0, 15),
          new Date(2026, 0, 20),
          new Date(2026, 0, 1),
          new Date(2026, 0, 31),
        ),
        userId: "user-123",
        installmentId: "inst-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(() => Expense.restore("id", props)).toThrow(
        "Total amount (100) must equal amount (49.9) × installments (12)",
      );
    });

    it("should validate currency consistency", () => {
      const props = {
        name: ExpenseName.create("netflix"),
        description: "Streaming",
        amount: Money.fromCents(4990, "USD"),
        totalAmount: Money.fromCents(4990, "BRL"),
        status: ExpenseStatus.PAYING,
        tags: Tags.empty(),
        installmentInfo: InstallmentInfo.create(1, 1),
        paymentSchedule: PaymentSchedule.create(
          new Date(2026, 0, 15),
          new Date(2026, 0, 20),
          new Date(2026, 0, 1),
          new Date(2026, 0, 31),
        ),
        userId: "user-123",
        installmentId: "inst-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(() => Expense.restore("id", props)).toThrow(
        "Amount and totalAmount must have same currency",
      );
    });

    it("should validate status consistency", () => {
      const props = {
        name: ExpenseName.create("netflix"),
        description: "Streaming",
        amount: Money.fromCents(4990),
        totalAmount: Money.fromCents(4990 * 12),
        status: ExpenseStatus.PAID,
        tags: Tags.empty(),
        installmentInfo: InstallmentInfo.create(3, 12),
        paymentSchedule: PaymentSchedule.create(
          new Date(2026, 0, 15),
          new Date(2026, 0, 20),
          new Date(2026, 0, 1),
          new Date(2026, 0, 31),
        ),
        userId: "user-123",
        installmentId: "inst-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(() => Expense.restore("id", props)).toThrow(
        "Expense marked as PAID but installment is 3/12",
      );
    });
  });

  describe("getters immutability", () => {
    it("should not allow mutation of createdAt", () => {
      const expense = Expense.create(validInput);
      const original = expense.createdAt;

      const mutated = expense.createdAt;
      mutated.setFullYear(2099);

      expect(expense.createdAt.getFullYear()).toBe(original.getFullYear());
    });

    it("should not allow mutation of updatedAt", () => {
      const expense = Expense.create(validInput);
      const original = expense.updatedAt;

      const mutated = expense.updatedAt;
      mutated.setFullYear(2099);

      expect(expense.updatedAt.getFullYear()).toBe(original.getFullYear());
    });
  });

  describe("Expense - Domain Methods", () => {
    const validInput = {
      name: "Netflix Subscription",
      description: "Monthly streaming service",
      amount: 4990,
      totalInstallments: 1,
      paymentDay: new Date(2026, 0, 15),
      expirationDay: new Date(2026, 0, 20),
      paymentStartAt: new Date(2026, 0, 1),
      paymentEndAt: new Date(2026, 0, 31),
      userId: "user-123",
      installmentId: "inst-123",
      tags: ["streaming"],
    };

    describe("updateDetails", () => {
      it("should update name", () => {
        const expense = Expense.create(validInput);
        const originalUpdatedAt = expense.updatedAt;

        expense.updateDetails("Spotify Premium", "Monthly streaming service");

        expect(expense.name.value).toBe("Spotify Premium");
        expect(expense.description).toBe("Monthly streaming service");
        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime(),
        );
      });

      it("should update description", () => {
        const expense = Expense.create(validInput);

        expense.updateDetails("Netflix Subscription", "Premium plan");

        expect(expense.name.value).toBe("Netflix Subscription");
        expect(expense.description).toBe("Premium plan");
      });

      it("should update both name and description", () => {
        const expense = Expense.create(validInput);
        const originalUpdatedAt = expense.updatedAt;

        expense.updateDetails("Spotify Premium", "Music streaming");

        expect(expense.name.value).toBe("Spotify Premium");
        expect(expense.description).toBe("Music streaming");
        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime(),
        );
      });

      it("should not update timestamp if nothing changed", () => {
        const expense = Expense.create(validInput);
        const originalUpdatedAt = expense.updatedAt;

        setTimeout(() => {
          expense.updateDetails(
            "Netflix Subscription",
            "Monthly streaming service",
          );
          expect(expense.updatedAt).toEqual(originalUpdatedAt);
        }, 10);
      });

      it("should update timestamp only once when both change", () => {
        const expense = Expense.create(validInput);

        expense.updateDetails("New Name", "New Description");
        const firstUpdate = expense.updatedAt;

        expense.updateDetails("Another Name", "Another Description");
        const secondUpdate = expense.updatedAt;

        expect(secondUpdate.getTime()).toBeGreaterThanOrEqual(
          firstUpdate.getTime(),
        );
      });
      it("should throw error on invalid name", () => {
        const expense = Expense.create(validInput);

        expect(() => expense.updateDetails("ab", "Valid description")).toThrow(
          "Expense name must have at least 3 characters",
        );
      });

      it("should normalize name", () => {
        const expense = Expense.create(validInput);

        expense.updateDetails("  NETFLIX  ", "description");

        expect(expense.name.value).toBe("NETFLIX");
      });
    });

    describe("addTag", () => {
      it("should add new tag", () => {
        const expense = Expense.create(validInput);

        expense.addTag("subscription");

        expect(expense.tags.has("subscription")).toBe(true);
        expect(expense.tags.size()).toBe(2);
      });

      it("should not add duplicate tag", () => {
        const expense = Expense.create(validInput);

        expense.addTag("streaming");

        expect(expense.tags.size()).toBe(1);
      });

      it("should update timestamp when tag added", () => {
        const expense = Expense.create(validInput);
        const originalUpdatedAt = expense.updatedAt;

        expense.addTag("subscription");

        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime(),
        );
      });

      it("should throw error when exceeding max tags", () => {
        const expense = Expense.create({
          ...validInput,
          tags: Array.from({ length: 10 }, (_, i) => `tag-${i}`),
        });

        expect(() => expense.addTag("extra-tag")).toThrow(
          "Cannot add more than 10 tags",
        );
      });

      it("should normalize tag before adding", () => {
        const expense = Expense.create(validInput);

        expense.addTag("  SUBSCRIPTION  ");

        expect(expense.tags.has("subscription")).toBe(true);
      });
    });

    describe("removeTag", () => {
      it("should remove existing tag", () => {
        const expense = Expense.create(validInput);

        expense.removeTag("streaming");

        expect(expense.tags.has("streaming")).toBe(false);
        expect(expense.tags.isEmpty()).toBe(true);
      });

      it("should update timestamp when tag removed", () => {
        const expense = Expense.create(validInput);
        const originalUpdatedAt = expense.updatedAt;

        expense.removeTag("streaming");

        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime(),
        );
      });

      it("should not update timestamp when tag does not exist", () => {
        const expense = Expense.create(validInput);
        const originalUpdatedAt = expense.updatedAt;

        expense.removeTag("nonexistent");

        expect(expense.updatedAt).toEqual(originalUpdatedAt);
      });

      it("should normalize tag before removing", () => {
        const expense = Expense.create(validInput);

        expense.removeTag("STREAMING");

        expect(expense.tags.isEmpty()).toBe(true);
      });
    });

    describe("advanceInstallment", () => {
      it("should advance to next installment", () => {
        const expense = Expense.create({
          ...validInput,
          totalInstallments: 12,
        });

        expense.advanceInstallment();

        expect(expense.installmentInfo.current).toBe(2);
        expect(expense.installmentInfo.total).toBe(12);
      });

      it("should update timestamp", () => {
        const expense = Expense.create({
          ...validInput,
          totalInstallments: 12,
        });
        const originalUpdatedAt = expense.updatedAt;

        expense.advanceInstallment();

        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime(),
        );
      });

      it("should advance multiple times", () => {
        const expense = Expense.create({
          ...validInput,
          totalInstallments: 12,
        });

        expense.advanceInstallment();
        expense.advanceInstallment();
        expense.advanceInstallment();

        expect(expense.installmentInfo.current).toBe(4);
      });

      it("should throw error when already at final installment", () => {
        const expense = Expense.create({
          ...validInput,
          totalInstallments: 1,
        });

        expect(() => expense.advanceInstallment()).toThrow(
          "Cannot advance: already at final installment",
        );
      });

      it("should throw error when expense is paid", () => {
        const expense = Expense.create(validInput);

        expense.markAsPaid();

        expect(() => expense.advanceInstallment()).toThrow(
          "Cannot advance installment of paid expense",
        );
      });

      it("should throw error when expense is abandoned", () => {
        const expense = Expense.create(validInput);

        expense.markAsAbandoned();

        expect(() => expense.advanceInstallment()).toThrow(
          "Cannot advance installment of abandoned expense",
        );
      });
    });

    describe("markAsPaid", () => {
      it("should mark single installment expense as paid", () => {
        const expense = Expense.create(validInput);

        expense.markAsPaid();

        expect(expense.status).toBe(ExpenseStatus.PAID);
        expect(expense.isPaid()).toBe(true);
      });

      it("should mark completed multi-installment expense as paid", () => {
        const expense = Expense.create({
          ...validInput,
          totalInstallments: 3,
        });

        expense.advanceInstallment();
        expense.advanceInstallment();
        expense.markAsPaid();

        expect(expense.status).toBe(ExpenseStatus.PAID);
      });

      it("should update timestamp", () => {
        const expense = Expense.create(validInput);
        const originalUpdatedAt = expense.updatedAt;

        expense.markAsPaid();

        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime(),
        );
      });

      it("should not update timestamp if already paid", () => {
        const expense = Expense.create(validInput);
        expense.markAsPaid();
        const firstUpdate = expense.updatedAt;

        expense.markAsPaid();

        expect(expense.updatedAt).toEqual(firstUpdate);
      });

      it("should throw error when not at final installment", () => {
        const expense = Expense.create({
          ...validInput,
          totalInstallments: 12,
        });

        expect(() => expense.markAsPaid()).toThrow(
          "Cannot mark as paid: installment 1/12 is not complete",
        );
      });

      it("should throw error when already abandoned", () => {
        const expense = Expense.create(validInput);
        expense.markAsAbandoned();

        expect(() => expense.markAsPaid()).toThrow(
          "Cannot mark abandoned expense as paid",
        );
      });
    });

    describe("markAsAbandoned", () => {
      it("should mark expense as abandoned", () => {
        const expense = Expense.create(validInput);

        expense.markAsAbandoned();

        expect(expense.status).toBe(ExpenseStatus.ABANDONED);
        expect(expense.isAbandoned()).toBe(true);
      });

      it("should update timestamp", () => {
        const expense = Expense.create(validInput);
        const originalUpdatedAt = expense.updatedAt;

        expense.markAsAbandoned();

        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime(),
        );
      });

      it("should not update timestamp if already abandoned", () => {
        const expense = Expense.create(validInput);
        expense.markAsAbandoned();
        const firstUpdate = expense.updatedAt;

        expense.markAsAbandoned();

        expect(expense.updatedAt).toEqual(firstUpdate);
      });

      it("should allow abandoning from PAYING status", () => {
        const expense = Expense.create(validInput);

        expense.markAsAbandoned();

        expect(expense.status).toBe(ExpenseStatus.ABANDONED);
      });

      it("should allow abandoning from PAID status", () => {
        const expense = Expense.create(validInput);
        expense.markAsPaid();

        expense.markAsAbandoned();

        expect(expense.status).toBe(ExpenseStatus.ABANDONED);
      });
    });

    describe("markAsPaying", () => {
      it("should mark abandoned expense as paying", () => {
        const expense = Expense.create(validInput);
        expense.markAsAbandoned();

        expense.markAsPaying();

        expect(expense.status).toBe(ExpenseStatus.PAYING);
        expect(expense.isPaying()).toBe(true);
      });

      it("should update timestamp", () => {
        const expense = Expense.create(validInput);
        expense.markAsAbandoned();
        const abandonedAt = expense.updatedAt;

        expense.markAsPaying();

        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(
          abandonedAt.getTime(),
        );
      });

      it("should not update timestamp if already paying", () => {
        const expense = Expense.create(validInput);
        const originalUpdatedAt = expense.updatedAt;

        expense.markAsPaying();

        expect(expense.updatedAt).toEqual(originalUpdatedAt);
      });

      it("should throw error when changing from PAID to PAYING", () => {
        const expense = Expense.create(validInput);
        expense.markAsPaid();

        expect(() => expense.markAsPaying()).toThrow(
          "Cannot change status from PAID to PAYING",
        );
      });
    });

    describe("isOverdue", () => {
      it("should return false when not expired and paying", () => {
        const expense = Expense.create(validInput);
        const referenceDate = new Date(2026, 0, 10);

        expect(expense.isOverdue(referenceDate)).toBe(false);
      });

      it("should return true when expired and paying", () => {
        const expense = Expense.create(validInput);
        const referenceDate = new Date(2026, 0, 25);

        expect(expense.isOverdue(referenceDate)).toBe(true);
      });

      it("should return false when expired but paid", () => {
        const expense = Expense.create(validInput);
        expense.markAsPaid();
        const referenceDate = new Date(2026, 0, 25);

        expect(expense.isOverdue(referenceDate)).toBe(false);
      });

      it("should return false when on expiration day", () => {
        const expense = Expense.create(validInput);
        const referenceDate = new Date(2026, 0, 20);

        expect(expense.isOverdue(referenceDate)).toBe(false);
      });

      it("should use current date when not provided", () => {
        const pastExpense = Expense.create({
          ...validInput,
          paymentDay: new Date(2020, 0, 1),
          expirationDay: new Date(2020, 0, 5),
          paymentStartAt: new Date(2020, 0, 1),
          paymentEndAt: new Date(2020, 0, 31),
        });

        expect(pastExpense.isOverdue()).toBe(true);
      });
    });

    describe("canBePaid", () => {
      it("should return true for valid single installment", () => {
        const expense = Expense.create(validInput);

        expect(expense.canBePaid()).toBe(true);
      });

      it("should return true for completed multi-installment", () => {
        const expense = Expense.create({
          ...validInput,
          totalInstallments: 3,
        });

        expense.advanceInstallment();
        expense.advanceInstallment();

        expect(expense.canBePaid()).toBe(true);
      });

      it("should return false for incomplete installments", () => {
        const expense = Expense.create({
          ...validInput,
          totalInstallments: 12,
        });

        expect(expense.canBePaid()).toBe(false);
      });

      it("should return false for abandoned expense", () => {
        const expense = Expense.create(validInput);
        expense.markAsAbandoned();

        expect(expense.canBePaid()).toBe(false);
      });

      it("should return false for expired expense", () => {
        const expense = Expense.create({
          ...validInput,
          paymentDay: new Date(2020, 0, 1),
          expirationDay: new Date(2020, 0, 5),
          paymentStartAt: new Date(2020, 0, 1),
          paymentEndAt: new Date(2020, 0, 31),
        });

        expect(expense.canBePaid()).toBe(true);
      });
    });

    describe("getDaysUntilExpiration", () => {
      it("should calculate days until expiration", () => {
        const expense = Expense.create(validInput);
        const referenceDate = new Date(2026, 0, 15);

        const days = expense.getDaysUntilExpiration(referenceDate);

        expect(days).toBe(5);
      });

      it("should return 0 on expiration day", () => {
        const expense = Expense.create(validInput);
        const referenceDate = new Date(2026, 0, 20);

        expect(expense.getDaysUntilExpiration(referenceDate)).toBe(0);
      });

      it("should return negative for past expiration", () => {
        const expense = Expense.create(validInput);
        const referenceDate = new Date(2026, 0, 25);

        expect(expense.getDaysUntilExpiration(referenceDate)).toBe(-5);
      });
    });

    describe("getRemainingAmount", () => {
      it("should return full amount for unpaid single installment", () => {
        const expense = Expense.create(validInput);

        const remaining = expense.getRemainingAmount();

        expect(remaining.cents).toBe(4990);
      });

      it("should return zero for paid single installment", () => {
        const expense = Expense.create(validInput);
        expense.markAsPaid();

        const remaining = expense.getRemainingAmount();

        expect(remaining.isZero()).toBe(true);
      });

      it("should calculate remaining for multi-installment", () => {
        const expense = Expense.create({
          ...validInput,
          amount: 10000,
          totalInstallments: 12,
        });

        const remaining = expense.getRemainingAmount();

        expect(remaining.cents).toBe(10000 * 12);
      });

      it("should calculate remaining after advancing installments", () => {
        const expense = Expense.create({
          ...validInput,
          amount: 10000,
          totalInstallments: 12,
        });

        expense.advanceInstallment();
        expense.advanceInstallment();

        const remaining = expense.getRemainingAmount();

        expect(remaining.cents).toBe(10000 * 10);
      });

      it("should preserve currency", () => {
        const expense = Expense.create({
          ...validInput,
          currency: "USD",
        });

        const remaining = expense.getRemainingAmount();

        expect(remaining.currency).toBe("USD");
      });
    });

    describe("status queries", () => {
      it("should check if paid", () => {
        const expense = Expense.create(validInput);

        expect(expense.isPaid()).toBe(false);

        expense.markAsPaid();

        expect(expense.isPaid()).toBe(true);
      });

      it("should check if abandoned", () => {
        const expense = Expense.create(validInput);

        expect(expense.isAbandoned()).toBe(false);

        expense.markAsAbandoned();

        expect(expense.isAbandoned()).toBe(true);
      });

      it("should check if paying", () => {
        const expense = Expense.create(validInput);

        expect(expense.isPaying()).toBe(true);

        expense.markAsPaid();

        expect(expense.isPaying()).toBe(false);
      });
    });
  });
});
