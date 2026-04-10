import {
  UpdateUserBodyDTO,
  UpdateUserOutputDTO,
} from "@/core/usecases/user/update-user-dto";
import { UpdateUserUseCaseInterface } from "@/core/usecases/user/update-user-usecase-interface";
import { UserUpdateController } from "@/infrastructure/http/express/controllers/user/update-user-controller";
import {
  UpdateUserBodySchema,
  UpdateUserParamsSchema,
} from "@/infrastructure/validation/zod/schemas/user/update-user-profile-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/infrastructure/validation/zod/validation/request-validation");

const VALID_USER_SUB = "550e8400-e29b-41d4-a716-446655440000";
const VALID_TARGET_ID = "660e8400-e29b-41d4-a716-446655440001";

const makeUseCaseOutput = (): UpdateUserOutputDTO => ({
  id: VALID_TARGET_ID,
  name: "John Doe",
  email: "john@example.com",
  role: "USER",
  isActive: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-02T00:00:00.000Z",
});

const makeBodyInput = (): UpdateUserBodyDTO => ({
  name: "John Doe",
  email: "john@example.com",
});

const makeUseCase = (): UpdateUserUseCaseInterface => ({
  execute: vi.fn().mockResolvedValue(makeUseCaseOutput()),
});

const makeRequest = (overrides?: { user?: any; params?: any; body?: any }) => ({
  user: overrides?.user ?? { sub: VALID_USER_SUB },
  params: overrides?.params ?? { id: VALID_TARGET_ID },
  body: overrides?.body ?? makeBodyInput(),
  query: {},
});

describe("UserUpdateController", () => {
  let usecase: UpdateUserUseCaseInterface;
  let sut: UserUpdateController;

  beforeEach(() => {
    vi.clearAllMocks();
    usecase = makeUseCase();
    sut = new UserUpdateController(usecase);

    vi.mocked(requestValidation).mockImplementation((type: string) => {
      if (type === "params") return { id: VALID_TARGET_ID };
      if (type === "body") return makeBodyInput();
    });
  });

  describe("given a valid request", () => {
    it("should return statusCode 200", async () => {
      const result = await sut.handle(makeRequest() as any);

      expect(result.statusCode).toBe(200);
    });

    it("should return the updated user as body", async () => {
      const expected = makeUseCaseOutput();
      vi.mocked(usecase.execute).mockResolvedValue(expected);

      const result = await sut.handle(makeRequest() as any);

      expect(result.body).toStrictEqual(expected);
    });

    it("should call use case with requestingUserId, targetUserId and body fields", async () => {
      const bodyInput = makeBodyInput();
      vi.mocked(requestValidation).mockImplementation((type: string) => {
        if (type === "params") return { id: VALID_TARGET_ID };
        if (type === "body") return bodyInput;
      });

      await sut.handle(makeRequest() as any);

      expect(usecase.execute).toHaveBeenCalledOnce();
      expect(usecase.execute).toHaveBeenCalledWith({
        requestingUserId: VALID_USER_SUB,
        targetUserId: VALID_TARGET_ID,
        ...bodyInput,
      });
    });

    it("should call requestValidation twice — once for params, once for body", async () => {
      await sut.handle(makeRequest() as any);

      expect(requestValidation).toHaveBeenCalledTimes(2);
      expect(requestValidation).toHaveBeenCalledWith(
        "params",
        expect.anything(),
        UpdateUserParamsSchema,
      );
      expect(requestValidation).toHaveBeenCalledWith(
        "body",
        expect.anything(),
        UpdateUserBodySchema,
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
