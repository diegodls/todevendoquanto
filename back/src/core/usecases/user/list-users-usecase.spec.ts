// core/use-cases/user/list-users/list-users.usecase.spec.ts

import { User } from "@/core/entities/user/user";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import { UnauthorizedError } from "@/core/shared/errors/api-errors";
import { ListUsersUseCase } from "@/core/usecases/user/list-users-usecase";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
      create: vi.fn(),
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
          meta: {
            totalItems: 3,
            hasNextPage: true,
            hasPreviousPage: true,
            page: 1,
            pageSize: 20,
            totalPages: 100,
          },
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
}); /*
      
      it('should throw UserNotFoundError when requesting user does not exist', async () => {
        const input = {
          requestingUserId: UserId.create().toString(),
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(null);

        await expect(listUsersUseCase.execute(input))
          .rejects
          .toThrow(UserNotFoundError);

        expect(userRepository.list).not.toHaveBeenCalled();
      });
    });

    describe('pagination', () => {
      it('should use default pagination when not provided', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 3,
        });

        await listUsersUseCase.execute(input);

        expect(userRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { page: 1, limit: 10 } // ← defaults
        );
      });

      it('should use custom pagination when provided', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          page: 2,
          limit: 5,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 15,
        });

        await listUsersUseCase.execute(input);

        expect(userRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { page: 2, limit: 5 }
        );
      });

      it('should default to page 1 when page is 0 or negative', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          page: 0,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 3,
        });

        await listUsersUseCase.execute(input);

        const paginationArg = (userRepository.list as any).mock.calls[0][2];
        expect(paginationArg.page).toBe(1);
      });

      it('should limit to 100 items per page maximum', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          limit: 500,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 3,
        });

        await listUsersUseCase.execute(input);

        const paginationArg = (userRepository.list as any).mock.calls[0][2];
        expect(paginationArg.limit).toBe(100);
      });

      it('should return correct pagination metadata', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          page: 2,
          limit: 5,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 15, // 15 total users
        });

        const result = await listUsersUseCase.execute(input);

        expect(result.pagination).toEqual({
          page: 2,
          limit: 5,
          total: 15,
          totalPages: 3, // Math.ceil(15 / 5)
          hasNext: true, // page 2 of 3
          hasPrevious: true, // page 2 > 1
        });
      });

      it('should indicate no next page on last page', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          page: 3,
          limit: 5,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 15,
        });

        const result = await listUsersUseCase.execute(input);

        expect(result.pagination.hasNext).toBe(false);
        expect(result.pagination.hasPrevious).toBe(true);
      });

      it('should indicate no previous page on first page', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          page: 1,
          limit: 5,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 15,
        });

        const result = await listUsersUseCase.execute(input);

        expect(result.pagination.hasPrevious).toBe(false);
        expect(result.pagination.hasNext).toBe(true);
      });
    });

    describe('filters', () => {
      it('should filter by name', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          name: 'John',
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 1,
        });

        await listUsersUseCase.execute(input);

        expect(userRepository.list).toHaveBeenCalledWith(
          { name: 'John' },
          expect.any(Object),
          expect.any(Object)
        );
      });

      it('should filter by email', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          email: 'john@example.com',
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 1,
        });

        await listUsersUseCase.execute(input);

        expect(userRepository.list).toHaveBeenCalledWith(
          { email: 'john@example.com' },
          expect.any(Object),
          expect.any(Object)
        );
      });

      it('should filter by role', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          role: 'ADMIN',
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 1,
        });

        await listUsersUseCase.execute(input);

        expect(userRepository.list).toHaveBeenCalledWith(
          { role: 'ADMIN' },
          expect.any(Object),
          expect.any(Object)
        );
      });

      it('should filter by isActive', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          isActive: true,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 3,
        });

        await listUsersUseCase.execute(input);

        expect(userRepository.list).toHaveBeenCalledWith(
          { isActive: true },
          expect.any(Object),
          expect.any(Object)
        );
      });

      it('should combine multiple filters', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          name: 'John',
          role: 'ADMIN',
          isActive: true,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 1,
        });

        await listUsersUseCase.execute(input);

        expect(userRepository.list).toHaveBeenCalledWith(
          {
            name: 'John',
            role: 'ADMIN',
            isActive: true,
          },
          expect.any(Object),
          expect.any(Object)
        );
      });

      it('should throw ValidationError when role filter is invalid', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          role: 'SUPER_ADMIN',
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);

        await expect(listUsersUseCase.execute(input))
          .rejects
          .toThrow(ValidationError);

        expect(userRepository.list).not.toHaveBeenCalled();
      });

      it('should pass empty filters when none provided', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 3,
        });

        await listUsersUseCase.execute(input);

        expect(userRepository.list).toHaveBeenCalledWith(
          {}, // ← empty filters
          expect.any(Object),
          expect.any(Object)
        );
      });
    });

    describe('sorting', () => {
      it('should use default sort when not provided', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 3,
        });

        await listUsersUseCase.execute(input);

        expect(userRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { field: 'createdAt', order: 'desc' }, // ← defaults
          expect.any(Object)
        );
      });

      it('should sort by name ascending', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          sortBy: 'name' as const,
          order: 'asc' as const,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 3,
        });

        await listUsersUseCase.execute(input);

        expect(userRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { field: 'name', order: 'asc' },
          expect.any(Object)
        );
      });

      it('should sort by email descending', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          sortBy: 'email' as const,
          order: 'desc' as const,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 3,
        });

        await listUsersUseCase.execute(input);

        expect(userRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { field: 'email', order: 'desc' },
          expect.any(Object)
        );
      });

      it('should throw ValidationError for invalid sort field', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          sortBy: 'invalid' as any,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);

        await expect(listUsersUseCase.execute(input))
          .rejects
          .toThrow(ValidationError);

        expect(userRepository.list).not.toHaveBeenCalled();
      });

      it('should throw ValidationError for invalid sort order', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          order: 'invalid' as any,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);

        await expect(listUsersUseCase.execute(input))
          .rejects
          .toThrow(ValidationError);
      });
    });

    describe('output', () => {
      it('should map users to DTOs correctly', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: [users[0]],
          total: 1,
        });

        const result = await listUsersUseCase.execute(input);

        expect(result.users[0]).toEqual({
          id: users[0].id.toString(),
          name: users[0].name,
          email: users[0].email.toString(),
          role: users[0].role.toString(),
          isActive: users[0].isActive,
          createdAt: users[0].createdAt.toISOString(),
          updatedAt: users[0].updatedAt.toISOString(),
        });
      });

      it('should not return hashedPassword in output', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: users,
          total: 3,
        });

        const result = await listUsersUseCase.execute(input);

        result.users.forEach(user => {
          expect(user).not.toHaveProperty('password');
          expect(user).not.toHaveProperty('hashedPassword');
        });
      });

      it('should return empty array when no users found', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          name: 'NonExistent',
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: [],
          total: 0,
        });

        const result = await listUsersUseCase.execute(input);

        expect(result.users).toEqual([]);
        expect(result.pagination.total).toBe(0);
        expect(result.pagination.totalPages).toBe(0);
      });

      it('should return dates in ISO format', async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValue(adminUser);
        vi.spyOn(userRepository, 'list').mockResolvedValue({
          data: [users[0]],
          total: 1,
        });

        const result = await listUsersUseCase.execute(input);

        expect(result.users[0].createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        expect(result.users[0].updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      });
    });

    describe('validation', () => {
      it('should throw ValidationError when requesting user ID is invalid', async () => {
        const input = {
          requestingUserId: 'invalid-uuid',
        };

        await expect(listUsersUseCase.execute(input))
          .rejects
          .toThrow(ValidationError);

        expect(userRepository.findById).not.toHaveBeenCalled();
        expect(userRepository.list).not.toHaveBeenCalled();
      });
    });
  });
});
*/
