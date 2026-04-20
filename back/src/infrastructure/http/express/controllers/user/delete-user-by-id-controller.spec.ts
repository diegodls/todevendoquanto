import { DeleteUserByIDControllerType } from "@/core/ports/infrastructure/http/controllers/user/delete-user-by-id-controller-type";
import { DomainError } from "@/core/shared/errors/domain-error";
import { DeleteUserUseCaseInterface } from "@/core/usecases/user/delete-user-usecase-interface";
import { DeleteUserByIDController } from "@/infrastructure/http/express/controllers/user/delete-user-by-id-controller";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";
import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@/infrastructure/validation/zod/validation/request-validation");

const VALID_USER_SUB = "550e8400-e29b-41d4-a716-446655440000";
const VALID_TARGET_ID = "660e8400-e29b-41d4-a716-446655440001";

const makeUseCase = (): DeleteUserUseCaseInterface => ({
  execute: vi.fn().mockResolvedValue(undefined),
});

const makeRequest = (overrides?: { user?: any; params?: any }) => ({
  user: overrides?.user ?? { sub: VALID_USER_SUB },
  params: overrides?.params ?? { id: VALID_TARGET_ID },
});

describe("DeleteUserByIDController", () => {
  let usecase: DeleteUserUseCaseInterface;
  let sut: DeleteUserByIDControllerType;

  beforeEach(() => {
    usecase = makeUseCase();
    sut = new DeleteUserByIDController(usecase);

    vi.mocked(requestValidation).mockReturnValue({ id: VALID_TARGET_ID });
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

    it("should call usecase with correct mapped data", async () => {
      await sut.handle(makeRequest() as any);

      expect(usecase.execute).toHaveBeenCalledOnce();
      expect(usecase.execute).toHaveBeenCalledWith({
        requestingUserId: VALID_USER_SUB,
        targetUserId: VALID_TARGET_ID,
      });
    });
  });

  describe("given usecase throws", () => {
    it("should propagate the error without suppressing", async () => {
      vi.mocked(usecase.execute).mockRejectedValue(
        new DomainError("Domain Error"),
      );

      await expect(sut.handle(makeRequest() as any)).rejects.toThrow(
        "Domain Error",
      );
    });
  });
});
