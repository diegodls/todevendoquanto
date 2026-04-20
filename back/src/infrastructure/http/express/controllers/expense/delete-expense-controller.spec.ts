import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  InternalError,
} from "@/core/shared/errors/api-errors";
import { InfrastructureError } from "@/core/shared/errors/infrastructure-errors";
import { DeleteExpenseUseCaseInterface } from "@/core/usecases/expense/delete-expense-usecase-interface";
import { DeleteExpenseController } from "@/infrastructure/http/express/controllers/expense/delete-expense-controller";
import { DeleteExpenseByIdSchema } from "@/infrastructure/validation/zod/schemas/expense/delete-expense-by-id-schema";
import { schemaParser } from "@/infrastructure/validation/zod/validation/schema-parser";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/infrastructure/validation/zod/validation/schema-parser", () => ({
  schemaParser: vi.fn(),
}));

const VALID_INSTALLMENT_ID = "550e8400-e29b-41d4-a716-446655440000";
const VALID_USER_SUB = "660e8400-e29b-41d4-a716-446655440001";

const makeUseCase = (): DeleteExpenseUseCaseInterface => ({
  execute: vi.fn().mockResolvedValue(undefined),
});

const makeRequest = (overrides?: { user?: any; params?: any }) => ({
  user: overrides?.user ?? { sub: VALID_USER_SUB },
  params: overrides?.params ?? { id: VALID_INSTALLMENT_ID },
  body: {},
  query: {},
});

describe("DeleteExpenseController", () => {
  let usecase: DeleteExpenseUseCaseInterface;
  let sut: DeleteExpenseController;

  beforeEach(() => {
    usecase = makeUseCase();
    sut = new DeleteExpenseController(usecase);
    vi.mocked(schemaParser).mockReturnValue({ id: VALID_INSTALLMENT_ID });
  });

  describe("given a valid request", () => {
    it("should return statusCode 204", async () => {
      const result = await sut.handle(makeRequest() as any);

      expect(result.statusCode).toBe(204);
    });

    it("should return an empty body", async () => {
      const result = await sut.handle(makeRequest() as any);

      expect(result.body).toStrictEqual({});
    });

    it("should call use case once with correct data", async () => {
      await sut.handle(makeRequest() as any);

      expect(usecase.execute).toHaveBeenCalledTimes(1);
      expect(usecase.execute).toHaveBeenCalledWith({
        requestingUserId: VALID_USER_SUB,
        installmentId: VALID_INSTALLMENT_ID,
      });
    });

    it("should call schemaParser with request params and correct context", async () => {
      const params = { id: VALID_INSTALLMENT_ID };
      await sut.handle(makeRequest({ params }) as any);

      expect(schemaParser).toHaveBeenCalledWith(
        params,
        DeleteExpenseByIdSchema,
        "params",
      );
    });
  });

  describe("given invalid user", () => {
    describe("when user is not present in request", () => {
      it("should throw when user is undefined", async () => {
        const request = makeRequest();

        request.user = undefined;

        await expect(sut.handle(request as any)).rejects.toThrow(
          UnauthorizedError,
        );

        expect(usecase.execute).not.toHaveBeenCalled();
      });

      it("should throw when user is null", async () => {
        const request = makeRequest();

        request.user = null;

        await expect(sut.handle(request as any)).rejects.toThrow(
          UnauthorizedError,
        );
        expect(usecase.execute).not.toHaveBeenCalled();
      });
    });

    describe("when user.sub is not present", () => {
      it("should throw when user.sub is undefined", async () => {
        const request = makeRequest();

        request.user.sub = undefined;

        await expect(sut.handle(request as any)).rejects.toThrow(
          UnauthorizedError,
        );

        expect(usecase.execute).not.toHaveBeenCalled();
      });

      it("should throw when user.sub is null", async () => {
        const request = makeRequest();

        request.user.sub = null;

        await expect(sut.handle(request as any)).rejects.toThrow(
          UnauthorizedError,
        );
        expect(usecase.execute).not.toHaveBeenCalled();
      });

      it("should forward whatever sub value is present to the use case", async () => {
        const request = makeRequest({ user: { sub: VALID_USER_SUB } });

        await sut.handle(request as any);

        expect(usecase.execute).toHaveBeenCalledWith(
          expect.objectContaining({ requestingUserId: VALID_USER_SUB }),
        );
      });
    });
  });

  describe("given invalid params", () => {
    describe("when id is not a valid value", () => {
      it("should throw when schemaParser throws due to invalid id", async () => {
        vi.mocked(schemaParser).mockImplementation(() => {
          throw new BadRequestError("Validation error: invalid uuid");
        });

        await expect(
          sut.handle(makeRequest({ params: { id: "not-a-uuid" } }) as any),
        ).rejects.toThrow("Validation error: invalid uuid");

        expect(usecase.execute).not.toHaveBeenCalled();
      });

      it("should not call use case when schema validation fails", async () => {
        vi.mocked(schemaParser).mockImplementation(() => {
          throw new BadRequestError("Validation error");
        });

        await sut.handle(makeRequest() as any).catch(() => {});

        expect(usecase.execute).not.toHaveBeenCalled();
      });
    });

    describe("when id is not sent", () => {
      it("should throw when schemaParser throws due to missing id", async () => {
        vi.mocked(schemaParser).mockImplementation(() => {
          throw new BadRequestError("Validation error: id is required");
        });

        await expect(
          sut.handle(makeRequest({ params: {} }) as any),
        ).rejects.toThrow("Validation error: id is required");

        expect(usecase.execute).not.toHaveBeenCalled();
      });
    });
  });

  describe("given use case errors", () => {
    describe("when expense is not found", () => {
      it("should propagate NotFoundError from use case", async () => {
        vi.mocked(usecase.execute).mockRejectedValue(
          new NotFoundError("Expense not found", {}, "ERR_001"),
        );

        await expect(sut.handle(makeRequest() as any)).rejects.toThrow(
          NotFoundError,
        );
      });

      it("should not suppress the error", async () => {
        const error = new NotFoundError("Expense not found", {}, "ERR_001");
        vi.mocked(usecase.execute).mockRejectedValue(error);

        await expect(sut.handle(makeRequest() as any)).rejects.toThrow(
          "Expense not found",
        );
      });
    });

    describe("when user is unauthorized", () => {
      it("should propagate UnauthorizedError from use case", async () => {
        vi.mocked(usecase.execute).mockRejectedValue(
          new UnauthorizedError(
            "You can't delete this expense!",
            {},
            "ERR_002",
          ),
        );

        await expect(sut.handle(makeRequest() as any)).rejects.toThrow(
          UnauthorizedError,
        );
      });
    });

    describe("when an internal error occurs", () => {
      it("should propagate InternalError from use case", async () => {
        vi.mocked(usecase.execute).mockRejectedValue(
          new InternalError("Unexpected error", {}, "ERR_003"),
        );

        await expect(sut.handle(makeRequest() as any)).rejects.toThrow(
          InternalError,
        );
      });

      it("should propagate generic unexpected exceptions", async () => {
        vi.mocked(usecase.execute).mockRejectedValue(
          new InfrastructureError("DB connection lost"),
        );

        await expect(sut.handle(makeRequest() as any)).rejects.toThrow(
          "DB connection lost",
        );
      });
    });
  });
});
