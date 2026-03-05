// core/use-cases/user/list-users/list-users.usecase.spec.ts

import { User } from "@/core/entities/user/user";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
import {
  ListUserOrderDirectionOptions,
  ListUsersInputDTO,
} from "@/core/usecases/user/list-user-dto";
import { ListUsersUseCase } from "@/core/usecases/user/list-users-usecase";
import { beforeEach, describe, expect, it, vi } from "vitest";

let listUsersUseCase: ListUsersUseCase;
let userRepository: UserRepositoryInterface;

const validHashedPassword = "$2b$10$hashedPassword";

let adminUser: User;
let basicUser: User;
let users: User[];

beforeEach(() => {
  userRepository = {
    list: vi.fn(),
    findByEmail: vi.fn(),
    findByName: vi.fn(),
    findById: vi.fn(),
    deleteById: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
  };

  listUsersUseCase = new ListUsersUseCase(userRepository);

  adminUser = User.create(
    {
      name: "Admin User",
      email: "admin@example.com",
      role: "ADMIN",
    },
    validHashedPassword,
  );

  basicUser = User.create(
    {
      name: "Basic User",
      email: "basic@example.com",
    },
    validHashedPassword,
  );

  users = [
    User.create(
      { name: "User One", email: "user1@example.com" },
      validHashedPassword,
    ),
    User.create(
      { name: "User Two", email: "user2@example.com" },
      validHashedPassword,
    ),
    User.create(
      { name: "User Three", email: "user3@example.com", role: "ADMIN" },
      validHashedPassword,
    ),
  ];
});

describe("ListUsersUseCase", () => {
  let listUsersUseCase: ListUsersUseCase;
  let userRepository: UserRepositoryInterface;

  const validHashedPassword = "$2b$10$hashedPassword";

  let adminUser: User;
  let basicUser: User;
  let users: User[];

  beforeEach(() => {
    userRepository = {
      list: vi.fn(),
      findByEmail: vi.fn(),
      findByName: vi.fn(),
      findById: vi.fn(),
      deleteById: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    listUsersUseCase = new ListUsersUseCase(userRepository);

    adminUser = User.create(
      {
        name: "Admin User",
        email: "admin@example.com",
        role: "ADMIN",
      },
      validHashedPassword,
    );

    basicUser = User.create(
      {
        name: "Basic User",
        email: "basic@example.com",
      },
      validHashedPassword,
    );

    users = [
      User.create(
        { name: "User One", email: "user1@example.com" },
        validHashedPassword,
      ),
      User.create(
        { name: "User Two", email: "user2@example.com" },
        validHashedPassword,
      ),
      User.create(
        { name: "User Three", email: "user3@example.com", role: "ADMIN" },
        validHashedPassword,
      ),
    ];
  });

  describe("execute", () => {
    describe("authorization", () => {
      it("should allow admin to list users", async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
        };

        vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
        vi.spyOn(userRepository, "list").mockResolvedValue({
          data: users,
          total: 3,
        });

        const result = await listUsersUseCase.execute(input);

        expect(result.data).toHaveLength(3);
        expect(userRepository.list).toHaveBeenCalled();
      });
    });
  });

  it("should throw ForbiddenError when basic user tries to list users", async () => {
    const input = {
      requestingUserId: basicUser.id.toString(),
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(basicUser);

    await expect(listUsersUseCase.execute(input)).rejects.toThrow(
      UnauthorizedError,
    );

    expect(userRepository.list).not.toHaveBeenCalled();
  });

  it("should throw correct message when basic user tries to list users", async () => {
    const input = {
      requestingUserId: basicUser.id.toString(),
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(basicUser);

    await expect(listUsersUseCase.execute(input)).rejects.toThrow(
      "Only admins can list users",
    );
  });

  it("should throw NotFoundError when requesting user does not exist", async () => {
    const input = {
      requestingUserId: UserId.create().toString(),
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(null);

    await expect(listUsersUseCase.execute(input)).rejects.toThrow(
      NotFoundError,
    );

    expect(userRepository.list).not.toHaveBeenCalled();
  });

  describe("pagination", () => {
    it("should use default pagination when not provided", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
      vi.spyOn(userRepository, "list").mockResolvedValue({
        data: users,
        total: 3,
      });

      await listUsersUseCase.execute(input);

      expect(userRepository.list).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Object),
      );
    });
  });

  it("should use custom pagination when provided", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      page: 10,
      pageSize: 5,
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    await listUsersUseCase.execute(input);

    expect(userRepository.list).toHaveBeenCalledWith(
      {},
      {
        order: "asc",
        orderBy: "name",
      },
      { page: 10, pageSize: 5 },
    );
  });

  it("should default to page 1 when page is 0 or negative", async () => {
    const input: ListUsersInputDTO = {
      requestingUserId: adminUser.id.toString(),
      page: 0,
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    await listUsersUseCase.execute(input);

    const paginationArg = (userRepository.list as any).mock.calls[0][2];

    expect(paginationArg.page).toBe(1);
  });

  it("should limit to 100 items per page maximum", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      pageSize: 500,
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);

    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    await listUsersUseCase.execute(input);

    const paginationArg = (userRepository.list as any).mock.calls[0][2];

    expect(paginationArg.pageSize).toBe(100);
  });

  it("should return correct pagination metadata", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      page: 2,
      pageSize: 5,
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    const result = await listUsersUseCase.execute(input);

    expect(result.meta).toEqual({
      page: 1,
      pageSize: 5,
      hasPreviousPage: false,
      hasNextPage: false,
      totalItems: 3,
      totalPages: 1,
    });
  });

  it("should indicate no next page on last page", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      page: 3,
      pageSize: 5,
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);

    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    const result = await listUsersUseCase.execute(input);

    expect(result.meta.hasNextPage).toBe(false);
    expect(result.meta.hasPreviousPage).toBe(false);
  });

  it("should indicate no previous page on first page", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      page: 1,
      pageSize: 5,
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    const result = await listUsersUseCase.execute(input);

    expect(result.meta.hasNextPage).toBe(false);
    expect(result.meta.hasPreviousPage).toBe(false);
  });
});

describe("filters", () => {
  let listUsersUseCase: ListUsersUseCase;
  let userRepository: UserRepositoryInterface;

  const validHashedPassword = "$2b$10$hashedPassword";

  let adminUser: User;
  let basicUser: User;
  let users: User[];

  beforeEach(() => {
    userRepository = {
      list: vi.fn(),
      findByEmail: vi.fn(),
      findByName: vi.fn(),
      findById: vi.fn(),
      deleteById: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    listUsersUseCase = new ListUsersUseCase(userRepository);

    adminUser = User.create(
      {
        name: "Admin User",
        email: "admin@example.com",
        role: "ADMIN",
      },
      validHashedPassword,
    );

    basicUser = User.create(
      {
        name: "Basic User",
        email: "basic@example.com",
      },
      validHashedPassword,
    );

    users = [
      User.create(
        { name: "User One", email: "user1@example.com" },
        validHashedPassword,
      ),
      User.create(
        { name: "User Two", email: "user2@example.com" },
        validHashedPassword,
      ),
      User.create(
        { name: "User Three", email: "user3@example.com", role: "ADMIN" },
        validHashedPassword,
      ),
    ];
  });

  it("should filter by name", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      name: "John",
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    await listUsersUseCase.execute(input);

    expect(userRepository.list).toHaveBeenCalledWith(
      { name: "John" },
      expect.any(Object),
      expect.any(Object),
    );
  });

  it("should filter by email", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      email: "john@example.com",
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    await listUsersUseCase.execute(input);

    expect(userRepository.list).toHaveBeenCalledWith(
      { email: "john@example.com" },
      expect.any(Object),
      expect.any(Object),
    );
  });

  it("should filter by role", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      roles: ["ADMIN"],
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    await listUsersUseCase.execute(input);

    expect(userRepository.list).toHaveBeenCalledWith(
      { roles: ["ADMIN"] },
      expect.any(Object),
      expect.any(Object),
    );
  });

  it("should filter by isActive", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      isActive: true,
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    await listUsersUseCase.execute(input);

    expect(userRepository.list).toHaveBeenCalledWith(
      { isActive: true },
      expect.any(Object),
      expect.any(Object),
    );
  });

  it("should combine multiple filters", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      name: "John",
      roles: ["ADMIN"],
      isActive: true,
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    await listUsersUseCase.execute(input);

    expect(userRepository.list).toHaveBeenCalledWith(
      {
        name: "John",
        roles: ["ADMIN"],
        isActive: true,
      },
      expect.any(Object),
      expect.any(Object),
    );
  });

  it("should throw when role filter is invalid", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      roles: ["SUPER_ADMIN"],
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);

    await expect(listUsersUseCase.execute(input)).rejects.toThrow();

    expect(userRepository.list).not.toHaveBeenCalled();
  });

  it("should pass empty filters when none provided", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    await listUsersUseCase.execute(input);

    expect(userRepository.list).toHaveBeenCalledWith(
      {}, // ← empty filters
      expect.any(Object),
      expect.any(Object),
    );
  });
});

describe("sorting", () => {
  it("should use default sort when not provided", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    await listUsersUseCase.execute(input);

    expect(userRepository.list).toHaveBeenCalledWith(
      expect.any(Object),
      { orderBy: "name", order: "asc" },
      expect.any(Object),
    );
  });

  it("should sort by name ascending", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      orderBy: "name" as const,
      order: "asc" as const,
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    await listUsersUseCase.execute(input);

    expect(userRepository.list).toHaveBeenCalledWith(
      expect.any(Object),
      { orderBy: "name", order: "asc" },
      expect.any(Object),
    );
  });

  it("should sort by email descending", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      orderBy: "email" as const,
      order: "desc" as const,
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    await listUsersUseCase.execute(input);

    expect(userRepository.list).toHaveBeenCalledWith(
      expect.any(Object),
      { orderBy: "email", order: "desc" },
      expect.any(Object),
    );
  });

  it("should throw BadRequestError for invalid order field", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      order: "invalid" as any,
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);

    await expect(listUsersUseCase.execute(input)).rejects.toThrow(
      new BadRequestError(
        `Invalid sorting type: ${input.order}, valid types: ${ListUserOrderDirectionOptions}`,
      ),
    );

    expect(userRepository.list).not.toHaveBeenCalledWith();
  });

  it("should throw BadRequestError for invalid orderBy field", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
      orderBy: "invalid" as any,
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);

    await expect(listUsersUseCase.execute(input)).rejects.toThrow(
      BadRequestError,
    );
  });
});

describe("output", () => {
  it("should map users to DTOs correctly", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: [users[0]],
      total: 3,
    });

    const result = await listUsersUseCase.execute(input);

    expect(result.data[0]).toEqual({
      id: users[0].id.toString(),
      name: users[0].name,
      email: users[0].email.toString(),
      role: users[0].role.toString(),
      isActive: users[0].isActive,
      createdAt: users[0].createdAt.toISOString(),
      updatedAt: users[0].updatedAt.toISOString(),
    });
  });
  it("should not return hashedPassword in output", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: users,
      total: 3,
    });

    const result = await listUsersUseCase.execute(input);

    result.data.forEach((user) => {
      expect(user).not.toHaveProperty("password");
      expect(user).not.toHaveProperty("hashedPassword");
    });
  });

  it("should return empty array when no users found", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: [],
      total: 0,
    });

    const result = await listUsersUseCase.execute(input);

    expect(result.data).toEqual([]);
    expect(result.meta.totalItems).toBe(0);
    expect(result.meta.totalPages).toBe(0);
  });
  it("should return dates in ISO format", async () => {
    const input = {
      requestingUserId: adminUser.id.toString(),
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);
    vi.spyOn(userRepository, "list").mockResolvedValue({
      data: [users[0]],
      total: 3,
    });

    const result = await listUsersUseCase.execute(input);

    expect(result.data[0].createdAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    );
    expect(result.data[0].updatedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    );
  });
});

describe("validation", () => {
  it("should throw BadRequestError when requesting user ID is invalid", async () => {
    const input = {
      requestingUserId: "invalid-uuid",
    };

    await expect(listUsersUseCase.execute(input)).rejects.toThrow();

    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(userRepository.list).not.toHaveBeenCalled();
  });
});
