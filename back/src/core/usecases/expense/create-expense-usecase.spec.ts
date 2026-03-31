import { Money } from "@/core/entities/expense/value-objects/money";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import {
  CreateExpenseInputDTO,
  CreateExpenseOutputDTO,
} from "@/core/usecases/expense/create-expense-dto";
import { CreateExpenseUseCase } from "@/core/usecases/expense/create-expense-usecase";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockerUserUuidV4 = "550E8400-E29B-41D4-A716-446655440000";

const makeRepository = (): ExpenseRepositoryInterface => ({
  create: vi.fn(),
  deleteByInstallmentId: vi.fn(),
  findInstallmentsById: vi.fn(),
});

const makeInput = (
  overrides?: Partial<CreateExpenseInputDTO>,
): CreateExpenseInputDTO => ({
  name: "Netflix",
  description: "Streaming",
  totalAmount: 9980,
  totalInstallment: 2,
  currency: "BRL",
  status: "PAYING",
  tags: ["streaming"],
  paymentDay: new Date("2024-01-10"),
  expirationDay: new Date("2024-01-31"),
  paymentStartAt: new Date("2024-01-01"),
  paymentEndAt: new Date("2024-12-31"),
  ...overrides,
});

const makeOutputExpenses = (count: number): CreateExpenseOutputDTO[] => {
  const splittedMoney = Money.create(4990).split(count);

  const expenses: CreateExpenseOutputDTO[] = Array.from(
    { length: count },
    (_, i) => ({
      name: "New Shirt",
      description: "My new T shirt",
      amount: splittedMoney[i].cents,
      totalAmount: 4990,
      currency: "BRL",
      status: "PAYING",
      tags: ["clothes"],
      currentInstallment: i + 1,
      totalInstallment: count,
      paymentDay: "2024-01-10",
      expirationDay: "2024-01-31",
      paymentStartAt: "2024-01-01",
      paymentEndAt: "2024-12-31",
    }),
  );

  return expenses;
};

describe("CreateExpenseUseCase", () => {
  let repository: ExpenseRepositoryInterface;
  let sut: CreateExpenseUseCase;

  beforeEach(() => {
    repository = makeRepository();
    sut = new CreateExpenseUseCase(repository);
  });

  describe("given valid input", () => {
    it("should call repository.create once", async () => {
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(2));

      await sut.execute(mockerUserUuidV4, makeInput());

      expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it("should return the repository output directly", async () => {
      const expected = makeOutputExpenses(2);
      vi.mocked(repository.create).mockResolvedValue(expected);

      const result = await sut.execute(mockerUserUuidV4, makeInput());

      expect(result).toStrictEqual(expected);
    });

    it("should create a single expense when totalInstallment is 1", async () => {
      const input = makeInput({ totalInstallment: 1, totalAmount: 4990 });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(1));

      await sut.execute(mockerUserUuidV4, input);

      const [expenses] = vi.mocked(repository.create).mock.calls[0];
      expect(expenses).toHaveLength(1);
    });

    it("should split into N expenses matching totalInstallment", async () => {
      const input = makeInput({ totalInstallment: 4, totalAmount: 19960 });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(4));

      await sut.execute(mockerUserUuidV4, input);

      const [expenses] = vi.mocked(repository.create).mock.calls[0];
      expect(expenses).toHaveLength(4);
    });

    it("should share the same installmentId across all installments", async () => {
      const input = makeInput({ totalInstallment: 3, totalAmount: 9990 });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(3));

      await sut.execute(mockerUserUuidV4, input);

      const [expenses] = vi.mocked(repository.create).mock.calls[0];
      const ids = expenses.map((e: any) => e.installmentId.value);
      expect(new Set(ids).size).toBe(1);
    });

    it("should generate a different installmentId on each execution", async () => {
      const input = makeInput({ totalInstallment: 1, totalAmount: 4990 });
      vi.mocked(repository.create)
        .mockResolvedValueOnce(makeOutputExpenses(1))
        .mockResolvedValueOnce(makeOutputExpenses(1));

      await sut.execute(mockerUserUuidV4, input);
      await sut.execute(mockerUserUuidV4, input);

      const firstId = vi
        .mocked(repository.create)
        .mock.calls[0][0][0].installmentId.toString();

      const secondId = vi
        .mocked(repository.create)
        .mock.calls[1][0][0].installmentId.toString();

      expect(firstId).not.toBe(secondId);
    });
  });

  describe("given optional fields", () => {
    it("should set description to null when not provided", async () => {
      const input = makeInput({ description: undefined });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(2));

      await sut.execute(mockerUserUuidV4, input);

      const [expenses] = vi.mocked(repository.create).mock.calls[0];
      expenses.forEach((e: any) => expect(e.description).toBeNull());
    });

    it("should set description to null when explicitly null", async () => {
      const input = makeInput({ description: null as any });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(2));

      await sut.execute(mockerUserUuidV4, input);

      const [expenses] = vi.mocked(repository.create).mock.calls[0];
      expenses.forEach((e: any) => expect(e.description).toBeNull());
    });

    it("should default status to PAYING when not provided", async () => {
      const input = makeInput({ status: undefined });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(2));

      await sut.execute(mockerUserUuidV4, input);

      const [expenses] = vi.mocked(repository.create).mock.calls[0];
      expenses.forEach((e: any) => expect(e.status.value).toBe("PAYING"));
    });

    it("should default totalInstallment to 1 when not provided", async () => {
      const input = makeInput({
        totalInstallment: undefined,
        totalAmount: 4990,
      });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(1));

      await sut.execute(mockerUserUuidV4, input);

      const [expenses] = vi.mocked(repository.create).mock.calls[0];
      expect(expenses).toHaveLength(1);
    });

    it("should default totalAmount to zero when not provided", async () => {
      const input = makeInput({
        totalAmount: undefined,
        totalInstallment: 1,
      });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(1));

      await sut.execute(mockerUserUuidV4, input);

      const [expenses] = vi.mocked(repository.create).mock.calls[0];
      expect(expenses[0].totalAmount.cents).toBe(0);
    });

    it("should accept totalAmount === 0 as valid", async () => {
      const input = makeInput({ totalAmount: 0, totalInstallment: 1 });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(1));

      await expect(sut.execute(mockerUserUuidV4, input)).resolves.toBeDefined();
    });

    it("should use current date when payment dates are not provided", async () => {
      const before = new Date();
      const input = makeInput({
        paymentDay: undefined,
        expirationDay: undefined,
        paymentStartAt: undefined,
        paymentEndAt: undefined,
        totalInstallment: 1,
        totalAmount: 4990,
      });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(1));

      await sut.execute(mockerUserUuidV4, input);

      const after = new Date();
      const [expenses] = vi.mocked(repository.create).mock.calls[0];
      const { paymentDay } = expenses[0].paymentSchedule;

      expect(paymentDay.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(paymentDay.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("should create expense with empty tags", async () => {
      const input = makeInput({ tags: [] });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(2));

      await expect(sut.execute(mockerUserUuidV4, input)).resolves.toBeDefined();
    });
  });

  describe("given invalid domain input", () => {
    it("should throw when userId is not a valid uuid", async () => {
      await expect(sut.execute("not-a-uuid", makeInput())).rejects.toThrow();

      expect(repository.create).not.toHaveBeenCalled();
    });

    it("should throw when name is empty string", async () => {
      const input = makeInput({ name: "" });

      await expect(sut.execute(mockerUserUuidV4, input)).rejects.toThrow();
      expect(repository.create).not.toHaveBeenCalled();
    });

    it("should throw when name is undefined", async () => {
      const input = makeInput({ name: undefined as any });

      await expect(sut.execute(mockerUserUuidV4, input)).rejects.toThrow();
      expect(repository.create).not.toHaveBeenCalled();
    });

    it("should throw when status is an unknown string", async () => {
      const input = makeInput({ status: "INVALID_STATUS" });

      await expect(sut.execute(mockerUserUuidV4, input)).rejects.toThrow();
      expect(repository.create).not.toHaveBeenCalled();
    });

    it("should throw when currency is invalid", async () => {
      const input = makeInput({ currency: "INVALID" });

      await expect(sut.execute(mockerUserUuidV4, input)).rejects.toThrow();
      expect(repository.create).not.toHaveBeenCalled();
    });

    it("should throw when totalInstallment is zero", async () => {
      const input = makeInput({ totalInstallment: 0 });

      await expect(sut.execute(mockerUserUuidV4, input)).rejects.toThrow();
      expect(repository.create).not.toHaveBeenCalled();
    });

    it("should throw when totalInstallment is negative", async () => {
      const input = makeInput({ totalInstallment: -1 });

      await expect(sut.execute(mockerUserUuidV4, input)).rejects.toThrow();
      expect(repository.create).not.toHaveBeenCalled();
    });

    it("should throw when totalAmount is negative", async () => {
      const input = makeInput({ totalAmount: -100 });

      await expect(sut.execute(mockerUserUuidV4, input)).rejects.toThrow();
      expect(repository.create).not.toHaveBeenCalled();
    });

    it("should throw when totalAmount generates zero-value installments", async () => {
      const input = makeInput({ totalAmount: 5, totalInstallment: 10 });

      await expect(sut.execute(mockerUserUuidV4, input)).rejects.toThrow();
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe("given repository failure", () => {
    it("should throw InternalError when repository returns null", async () => {
      vi.mocked(repository.create).mockResolvedValue(null as any);

      await expect(sut.execute(mockerUserUuidV4, makeInput())).rejects.toThrow(
        InternalError,
      );
    });

    it("should throw InternalError when repository returns empty array", async () => {
      vi.mocked(repository.create).mockResolvedValue([]);

      await expect(sut.execute(mockerUserUuidV4, makeInput())).rejects.toThrow(
        InternalError,
      );
    });

    it("should throw InternalError when repository returns fewer items than expected", async () => {
      const input = makeInput({ totalInstallment: 3, totalAmount: 9990 });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(2));

      await expect(sut.execute(mockerUserUuidV4, input)).rejects.toThrow(
        InternalError,
      );
    });

    it("should propagate unexpected repository exceptions", async () => {
      vi.mocked(repository.create).mockRejectedValue(
        new Error("DB connection lost"),
      );

      await expect(sut.execute(mockerUserUuidV4, makeInput())).rejects.toThrow(
        "DB connection lost",
      );
    });
  });

  describe("contract guarantees", () => {
    it("should not mutate the input DTO", async () => {
      const input = makeInput();
      const snapshot = structuredClone(input);
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(2));

      await sut.execute(mockerUserUuidV4, input);

      expect(input).toStrictEqual(snapshot);
    });

    it("should pass exactly the split expenses to repository, not the original input", async () => {
      const input = makeInput({ totalInstallment: 3, totalAmount: 9990 });
      vi.mocked(repository.create).mockResolvedValue(makeOutputExpenses(3));

      await sut.execute(mockerUserUuidV4, input);

      const [expenses] = vi.mocked(repository.create).mock.calls[0];
      expect(expenses).toHaveLength(3);
      expenses.forEach((e: any, i: number) => {
        expect(e.installmentInfo.current).toBe(i + 1);
        expect(e.installmentInfo.total).toBe(3);
      });
    });
  });
});
