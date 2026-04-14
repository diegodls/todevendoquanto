import { InternalError } from "@/core/shared/errors/api-errors";
import { ExpenseRepositoryPrisma } from "@/infrastructure/repositories/prisma/expense-repository-prisma";
import { ExpenseMapper } from "@/infrastructure/repositories/prisma/mappers/expense-mapper";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/infrastructure/repositories/prisma/mappers/expense-mapper");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INSTALLMENT_ID = "550e8400-e29b-41d4-a716-446655440000";

const makeInstallmentId = () => ({
  toString: () => INSTALLMENT_ID,
});

const makePrismaExpense = (overrides?: Partial<object>) => ({
  id: "expense-1",
  installmentId: INSTALLMENT_ID,
  name: "Netflix",
  amount: 4990,
  totalAmount: 9980,
  ...overrides,
});

const makeDomainExpense = (overrides?: Partial<object>) => ({
  id: { value: "expense-1" },
  installmentId: { toString: () => INSTALLMENT_ID },
  name: { value: "Netflix" },
  ...overrides,
});

const makeOutputDTO = () => ({
  name: "Netflix",
  amount: 4990,
  totalAmount: 9980,
  currency: "BRL",
  status: "PAYING",
  tags: [],
  currentInstallment: 1,
  totalInstallment: 2,
  paymentDay: "2024-01-10",
  expirationDay: "2024-01-31",
  paymentStartAt: "2024-01-01",
  paymentEndAt: "2024-12-31",
  description: "",
});

const makePrismaClient = () => ({
  expense: {
    findMany: vi.fn(),
    createMany: vi.fn(),
    deleteMany: vi.fn(),
  },
});

// ─── Suite ────────────────────────────────────────────────────────────────────

describe("ExpenseRepositoryPrisma", () => {
  let prisma: ReturnType<typeof makePrismaClient>;
  let sut: ExpenseRepositoryPrisma;

  beforeEach(() => {
    vi.clearAllMocks();
    prisma = makePrismaClient();
    sut = new ExpenseRepositoryPrisma(prisma as any);
  });

  describe("findInstallmentById", () => {
    describe("when expenses are found", () => {
      it("should return mapped domain expenses", async () => {
        const raw = [
          makePrismaExpense(),
          makePrismaExpense({ id: "expense-2" }),
        ];
        const domain = raw.map(() => makeDomainExpense());
        prisma.expense.findMany.mockResolvedValue(raw);
        vi.mocked(ExpenseMapper.toDomain)
          .mockReturnValueOnce(domain[0] as any)
          .mockReturnValueOnce(domain[1] as any);

        const result = await sut.findInstallmentById(
          makeInstallmentId() as any,
        );

        expect(result).toStrictEqual(domain);
      });

      it("should query by installmentId string value", async () => {
        prisma.expense.findMany.mockResolvedValue([makePrismaExpense()]);
        vi.mocked(ExpenseMapper.toDomain).mockReturnValue(
          makeDomainExpense() as any,
        );

        await sut.findInstallmentById(makeInstallmentId() as any);

        expect(prisma.expense.findMany).toHaveBeenCalledWith({
          where: { installmentId: INSTALLMENT_ID },
        });
      });

      it("should call toDomain once per expense returned", async () => {
        const raw = [
          makePrismaExpense(),
          makePrismaExpense(),
          makePrismaExpense(),
        ];
        prisma.expense.findMany.mockResolvedValue(raw);
        vi.mocked(ExpenseMapper.toDomain).mockReturnValue(
          makeDomainExpense() as any,
        );

        await sut.findInstallmentById(makeInstallmentId() as any);

        expect(ExpenseMapper.toDomain).toHaveBeenCalledTimes(3);
      });
    });

    describe("when no expenses are found", () => {
      it("should return null when findMany returns empty array", async () => {
        prisma.expense.findMany.mockResolvedValue([]);

        const result = await sut.findInstallmentById(
          makeInstallmentId() as any,
        );

        expect(result).toBeNull();
      });

      it("should not call toDomain when array is empty", async () => {
        prisma.expense.findMany.mockResolvedValue([]);

        await sut.findInstallmentById(makeInstallmentId() as any);

        expect(ExpenseMapper.toDomain).not.toHaveBeenCalled();
      });
    });

    describe("when database throws", () => {
      it("should propagate the exception", async () => {
        prisma.expense.findMany.mockRejectedValue(new Error("DB unavailable"));

        await expect(
          sut.findInstallmentById(makeInstallmentId() as any),
        ).rejects.toThrow("DB unavailable");
      });
    });
  });

  describe("create", () => {
    describe("when all expenses are created successfully", () => {
      it("should return mapped output DTOs", async () => {
        const expenses = [makeDomainExpense(), makeDomainExpense()];
        const dto = makeOutputDTO();
        prisma.expense.createMany.mockResolvedValue({ count: 2 });
        vi.mocked(ExpenseMapper.toPersistence).mockReturnValue({} as any);
        vi.mocked(ExpenseMapper.toCreateExpenseOutputDTO)
          .mockReturnValueOnce(dto as any)
          .mockReturnValueOnce(dto as any);

        const result = await sut.create(expenses as any);

        expect(result).toHaveLength(2);
        expect(result[0]).toStrictEqual(dto);
      });

      it("should call toPersistence once per expense", async () => {
        const expenses = [
          makeDomainExpense(),
          makeDomainExpense(),
          makeDomainExpense(),
        ];
        prisma.expense.createMany.mockResolvedValue({ count: 3 });
        vi.mocked(ExpenseMapper.toPersistence).mockReturnValue({} as any);
        vi.mocked(ExpenseMapper.toCreateExpenseOutputDTO).mockReturnValue(
          makeOutputDTO() as any,
        );

        await sut.create(expenses as any);

        expect(ExpenseMapper.toPersistence).toHaveBeenCalledTimes(3);
      });

      it("should call createMany with all mapped persistence objects", async () => {
        const persistence = { name: "Netflix", amount: 4990 };
        const expenses = [makeDomainExpense()];
        prisma.expense.createMany.mockResolvedValue({ count: 1 });
        vi.mocked(ExpenseMapper.toPersistence).mockReturnValue(
          persistence as any,
        );
        vi.mocked(ExpenseMapper.toCreateExpenseOutputDTO).mockReturnValue(
          makeOutputDTO() as any,
        );

        await sut.create(expenses as any);

        expect(prisma.expense.createMany).toHaveBeenCalledWith({
          data: [persistence],
        });
      });
    });

    describe("when creation count does not match", () => {
      it("should throw InternalError when count is less than expected", async () => {
        const expenses = [
          makeDomainExpense(),
          makeDomainExpense(),
          makeDomainExpense(),
        ];
        prisma.expense.createMany.mockResolvedValue({ count: 2 });
        vi.mocked(ExpenseMapper.toPersistence).mockReturnValue({} as any);

        await expect(sut.create(expenses as any)).rejects.toThrow(
          InternalError,
        );
      });

      it("should not call toCreateExpenseOutputDTO when count mismatches", async () => {
        const expenses = [makeDomainExpense(), makeDomainExpense()];
        prisma.expense.createMany.mockResolvedValue({ count: 1 });
        vi.mocked(ExpenseMapper.toPersistence).mockReturnValue({} as any);

        await sut.create(expenses as any).catch(() => {});

        expect(ExpenseMapper.toCreateExpenseOutputDTO).not.toHaveBeenCalled();
      });

      it("should throw InternalError when count is zero", async () => {
        const expenses = [makeDomainExpense()];
        prisma.expense.createMany.mockResolvedValue({ count: 0 });
        vi.mocked(ExpenseMapper.toPersistence).mockReturnValue({} as any);

        await expect(sut.create(expenses as any)).rejects.toThrow(
          InternalError,
        );
      });
    });

    describe("when database throws", () => {
      it("should propagate the exception", async () => {
        prisma.expense.createMany.mockRejectedValue(
          new Error("DB unavailable"),
        );
        vi.mocked(ExpenseMapper.toPersistence).mockReturnValue({} as any);

        await expect(sut.create([makeDomainExpense()] as any)).rejects.toThrow(
          "DB unavailable",
        );
      });
    });
  });

  describe("deleteByInstallmentId", () => {
    describe("when deletion succeeds", () => {
      it("should resolve without returning a value", async () => {
        prisma.expense.deleteMany.mockResolvedValue({ count: 2 });

        await expect(
          sut.deleteByInstallmentId(makeInstallmentId() as any),
        ).resolves.toBeUndefined();
      });

      it("should call deleteMany with correct installmentId", async () => {
        prisma.expense.deleteMany.mockResolvedValue({ count: 2 });

        await sut.deleteByInstallmentId(makeInstallmentId() as any);

        expect(prisma.expense.deleteMany).toHaveBeenCalledWith({
          where: { installmentId: INSTALLMENT_ID },
        });
      });
    });

    describe("when database throws", () => {
      it("should propagate the exception", async () => {
        prisma.expense.deleteMany.mockRejectedValue(
          new Error("DB unavailable"),
        );

        await expect(
          sut.deleteByInstallmentId(makeInstallmentId() as any),
        ).rejects.toThrow("DB unavailable");
      });
    });
  });
});
