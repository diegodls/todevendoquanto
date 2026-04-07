import {
  CreateExpenseBodyInput,
  CreateExpenseOutputDTO,
} from "@/core/usecases/expense/create-expense-dto";
import { CreateExpenseUseCaseInterface } from "@/core/usecases/expense/create-expense-usecase-interface";
import { CreateExpenseController } from "@/infrastructure/http/express/controllers/expense/create-expense-controller";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/infrastructure/validation/zod/validation/request-validation");

const VALID_USER_SUB = "550e8400-e29b-41d4-a716-446655440000";

const makeUseCaseOutput = (): CreateExpenseOutputDTO[] => [
  {
    name: "Netflix",
    description: "Streaming",
    amount: 4990,
    currency: "BRL",
    totalAmount: 9980,
    status: "PAYING",
    tags: ["streaming"],
    currentInstallment: 1,
    totalInstallment: 2,
    paymentDay: "2024-01-10",
    expirationDay: "2024-01-31",
    paymentStartAt: "2024-01-01",
    paymentEndAt: "2024-12-31",
  },
];

const makeValidatedInput = (): CreateExpenseBodyInput => ({
  name: "Netflix",
  totalAmount: 9980,
  totalInstallment: 2,
  currency: "BRL",
});

const makeUseCase = (): CreateExpenseUseCaseInterface => ({
  execute: vi.fn().mockResolvedValue(makeUseCaseOutput()),
});

const makeRequest = (overrides?: { user?: any; body?: any }) => ({
  user: overrides?.user ?? { sub: VALID_USER_SUB },
  body: overrides?.body ?? makeValidatedInput(),
  params: {},
  query: {},
});

describe("CreateExpenseController", () => {
  let usecase: CreateExpenseUseCaseInterface;
  let sut: CreateExpenseController;

  beforeEach(() => {
    usecase = makeUseCase();
    sut = new CreateExpenseController(usecase);
    vi.mocked(requestValidation).mockReturnValue(makeValidatedInput());
  });

  describe("given a valid request", () => {
    it("should return statusCode 201", async () => {
      const result = await sut.handle(makeRequest() as any);

      expect(result.statusCode).toBe(201);
    });

    it("should return the use case output as body", async () => {
      const expected = makeUseCaseOutput();
      vi.mocked(usecase.execute).mockResolvedValue(expected);

      const result = await sut.handle(makeRequest() as any);

      expect(result.body).toStrictEqual(expected);
    });

    it("should call use case with user.sub and validated input", async () => {
      const validatedInput = makeValidatedInput();
      vi.mocked(requestValidation).mockReturnValue(validatedInput);

      await sut.handle(makeRequest() as any);

      expect(usecase.execute).toHaveBeenCalledOnce();
      expect(usecase.execute).toHaveBeenCalledWith(
        VALID_USER_SUB,
        validatedInput,
      );
    });
  });

  describe("given use case throws", () => {
    it("should propagate the error without suppressing", async () => {
      vi.mocked(usecase.execute).mockRejectedValue(new Error("Domain error"));

      await expect(sut.handle(makeRequest() as any)).rejects.toThrow(
        "Domain error",
      );
    });
  });
});
