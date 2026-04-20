import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "@/core/usecases/user/create-user-dto";
import { DomainError } from "@/core/shared/errors/domain-error";
import { CreateUserUseCaseInterface } from "@/core/usecases/user/create-user-usecase-interface";
import { CreateUserController } from "@/infrastructure/http/express/controllers/user/create-user-controller";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/infrastructure/validation/zod/validation/request-validation");

const makeUseCaseOutput = (): CreateUserOutputDTO => ({
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "John Doe",
  email: "john@example.com",
  role: "BASIC",
  createdAt: "2026-01-01",
  isActive: true,
});

const makeValidatedInput = (): CreateUserInputDTO => ({
  name: "John Doe",
  email: "john@example.com",
  password: "secret123",
  role: "ADMIN",
});

const makeUseCase = (): CreateUserUseCaseInterface => ({
  execute: vi.fn().mockResolvedValue(makeUseCaseOutput()),
});

const makeRequest = (overrides?: { body?: any }) => ({
  body: overrides?.body ?? makeValidatedInput(),
  params: {},
  query: {},
  user: {},
});

describe("CreateUserController", () => {
  let usecase: CreateUserUseCaseInterface;
  let sut: CreateUserController;

  beforeEach(() => {
    usecase = makeUseCase();
    sut = new CreateUserController(usecase);
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

    it("should call use case with the validated input", async () => {
      const validatedInput = makeValidatedInput();
      vi.mocked(requestValidation).mockReturnValue(validatedInput);

      await sut.handle(makeRequest() as any);

      expect(usecase.execute).toHaveBeenCalledOnce();
      expect(usecase.execute).toHaveBeenCalledWith(validatedInput);
    });
  });

  describe("given a invalid body", () => {
    it("should note call use case", async () => {
      const invalidatedInput = makeValidatedInput();

      invalidatedInput.name = "";

      vi.mocked(requestValidation).mockReturnValue(invalidatedInput);

      expect(usecase.execute).not.toHaveBeenCalledOnce();
      expect(usecase.execute).not.toHaveBeenCalledWith(invalidatedInput);
    });
  });

  describe("given use case throws", () => {
    it("should propagate the error without suppressing", async () => {
      vi.mocked(usecase.execute).mockRejectedValue(
        new DomainError("Domain error"),
      );

      await expect(sut.handle(makeRequest() as any)).rejects.toThrow(
        "Domain error",
      );
    });
  });
});
