import { ListUserOutputDTO } from "@/core/usecases/user/list-user-dto";
import { ListUsersUseCaseInterface } from "@/core/usecases/user/list-users-usecase-interface";
import { ListUserController } from "@/infrastructure/http/express/controllers/user/list-user-controller";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/infrastructure/validation/zod/validation/request-validation");

const VALID_USER_SUB = "550e8400-e29b-41d4-a716-446655440000";

const makeUseCaseOutput = (): ListUserOutputDTO => ({
  data: [
    {
      id: "660e8400-e29b-41d4-a716-446655440001",
      name: "John Doe",
      email: "john@example.com",
      role: "BASIC",
      isActive: true,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  ],
  meta: {
    page: 1,
    pageSize: 10,
    hasNextPage: true,
    hasPreviousPage: false,
    totalPages: 1,
    totalItems: 10,
  },
});

const makeQueryProps = () => ({
  page: 1,
  perPage: 10,
});

const makeUseCase = (): ListUsersUseCaseInterface => ({
  execute: vi.fn().mockResolvedValue(makeUseCaseOutput()),
});

const makeRequest = (overrides?: { user?: any; query?: any }) => ({
  user: overrides?.user ?? { sub: VALID_USER_SUB },
  query: overrides?.query ?? makeQueryProps(),
  body: {},
  params: {},
});

describe("ListUserController", () => {
  let usecase: ListUsersUseCaseInterface;
  let sut: ListUserController;

  beforeEach(() => {
    usecase = makeUseCase();
    sut = new ListUserController(usecase);
    vi.mocked(requestValidation).mockReturnValue(makeQueryProps());
  });

  describe("given a valid request", () => {
    it("should return statusCode 200", async () => {
      const result = await sut.handle(makeRequest() as any);

      expect(result.statusCode).toBe(200);
    });

    it("should return the use case output as body", async () => {
      const expected = makeUseCaseOutput();
      vi.mocked(usecase.execute).mockResolvedValue(expected);

      const result = await sut.handle(makeRequest() as any);

      expect(result.body).toStrictEqual(expected);
    });

    it("should call use case with user.sub and validated query props", async () => {
      const queryProps = makeQueryProps();
      vi.mocked(requestValidation).mockReturnValue(queryProps);

      await sut.handle(makeRequest() as any);

      expect(usecase.execute).toHaveBeenCalledOnce();
      expect(usecase.execute).toHaveBeenCalledWith({
        requestingUserId: VALID_USER_SUB,
        ...queryProps,
      });
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
