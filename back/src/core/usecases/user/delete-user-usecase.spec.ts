import { User } from "@/core/entities/user/user";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { UserRole } from "@/core/entities/user/value-objects/user-role";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
import { DeleteUserUseCase } from "@/core/usecases/user/delete-user-usecase";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("DeleteUserUseCase", () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let userRepository: UserRepositoryInterface;

  const validHashedPassword = "$2b$10$hashedPassword";

  let basicUser: User;
  let adminUser: User;
  let anotherBasicUser: User;

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

    deleteUserUseCase = new DeleteUserUseCase(userRepository);

    basicUser = User.create(
      {
        name: "Basic User",
        email: "basic@example.com",
      },
      validHashedPassword,
    );

    adminUser = User.create(
      {
        name: "Admin User",
        email: "admin@example.com",
        role: "ADMIN",
      },
      validHashedPassword,
    );

    anotherBasicUser = User.create(
      {
        name: "Another User",
        email: "another@example.com",
      },
      validHashedPassword,
    );
  });

  describe("execute", () => {
    describe("self-delete", () => {
      it("should allow basic user to delete themselves", async () => {
        const input = {
          requestingUserId: basicUser.id.toString(),
          targetUserId: basicUser.id.toString(),
        };

        vi.spyOn(userRepository, "findById").mockResolvedValue(basicUser);
        vi.spyOn(userRepository, "deleteById").mockResolvedValue(basicUser);

        await deleteUserUseCase.execute(input);

        expect(userRepository.deleteById).toHaveBeenCalledWith(basicUser.id);
      });
    });

    it("should call repository delete with correct UserId value object", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: basicUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById").mockResolvedValue(basicUser);
      vi.spyOn(userRepository, "deleteById").mockResolvedValue(basicUser);

      await deleteUserUseCase.execute(input);

      const deleteArg = (userRepository.deleteById as any).mock.calls[0][0];
      expect(deleteArg).toBeInstanceOf(UserId);
      expect(deleteArg.toString()).toBe(basicUser.id.toString());
    });

    it("should throw UnauthorizedError when admin tries to delete themselves", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: adminUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow(
        UnauthorizedError,
      );

      expect(userRepository.deleteById).not.toHaveBeenCalled();
    });

    it("should throw correct message when admin tries to delete themselves", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: adminUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById").mockResolvedValue(adminUser);

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow(
        "Only admins can delete other admins",
      );
    });
  });

  describe("deleting other users", () => {
    it("should throw UnauthorizedError when basic user tries to delete another user", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: anotherBasicUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(basicUser)
        .mockResolvedValueOnce(anotherBasicUser);

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow(
        UnauthorizedError,
      );

      expect(userRepository.deleteById).not.toHaveBeenCalled();
    });

    it("should throw correct message when basic user tries to delete another user", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: anotherBasicUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(basicUser)
        .mockResolvedValueOnce(anotherBasicUser);

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow(
        "Only admins can delete other users",
      );
    });

    it("should allow admin to delete basic user", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "deleteById").mockResolvedValue(basicUser);

      await deleteUserUseCase.execute(input);

      expect(userRepository.deleteById).toHaveBeenCalledWith(basicUser.id);
    });

    it("should allow admin to delete another admin", async () => {
      const anotherAdmin = User.create(
        {
          name: "Another Admin",
          email: "anotheradmin@example.com",

          role: "ADMIN",
        },
        validHashedPassword,
      );

      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: anotherAdmin.id.toString(),
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(anotherAdmin);

      vi.spyOn(userRepository, "deleteById").mockResolvedValue(adminUser);

      await deleteUserUseCase.execute(input);

      expect(userRepository.deleteById).toHaveBeenCalledWith(anotherAdmin.id);
    });

    it("should delete user even if they are inactive", async () => {
      const inactiveUser = User.reconstitute({
        id: UserId.create(),
        name: "Inactive User",
        email: Email.create("inactive@example.com"),
        hashedPassword: validHashedPassword,
        role: UserRole.BASIC,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
      });

      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: inactiveUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(inactiveUser);

      vi.spyOn(userRepository, "deleteById").mockResolvedValue(adminUser);

      await deleteUserUseCase.execute(input);

      expect(userRepository.deleteById).toHaveBeenCalledWith(inactiveUser.id);
    });
  });

  describe("validation errors", () => {
    it("should throw when requesting user ID is invalid UUID", async () => {
      const input = {
        requestingUserId: "invalid-uuid",
        targetUserId: basicUser.id.toString(),
      };

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow();

      expect(userRepository.findById).not.toHaveBeenCalled();
      expect(userRepository.deleteById).not.toHaveBeenCalled();
    });

    it("should throw correct message when requesting user ID is invalid", async () => {
      const input = {
        requestingUserId: "invalid-uuid",
        targetUserId: basicUser.id.toString(),
      };

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow(
        "UserId must be a valid UUID v4",
      );
    });

    it("should throw when target user ID is invalid UUID", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: "invalid-uuid",
      };

      vi.spyOn(userRepository, "findById").mockResolvedValueOnce(basicUser);

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow();

      expect(userRepository.deleteById).not.toHaveBeenCalled();
    });

    it("should throw when requesting user ID is empty", async () => {
      const input = {
        requestingUserId: "",
        targetUserId: basicUser.id.toString(),
      };

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow();
    });

    it("should throw ValidationError when target user ID is empty", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: "",
      };

      vi.spyOn(userRepository, "findById").mockResolvedValueOnce(basicUser);

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow();
    });
  });

  describe("user not found errors", () => {
    it("should throw UserNotFoundError when requesting user does not exist", async () => {
      const input = {
        requestingUserId: UserId.create().toString(),
        targetUserId: basicUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById").mockResolvedValueOnce(null);

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow(
        NotFoundError,
      );

      expect(userRepository.deleteById).not.toHaveBeenCalled();
    });

    it("should include user ID in error message when requesting user not found", async () => {
      const nonExistentId = UserId.create().toString();
      const input = {
        requestingUserId: nonExistentId,
        targetUserId: basicUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById").mockResolvedValueOnce(null);

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow(
        "User not found",
      );
    });
    it("should throw UserNotFoundError when target user does not exist", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: UserId.create().toString(),
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(null);

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow(
        NotFoundError,
      );

      expect(userRepository.deleteById).not.toHaveBeenCalled();
    });

    it("should include user ID in error message when target user not found", async () => {
      const nonExistentId = UserId.create().toString();
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: nonExistentId,
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(null);

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("repository calls", () => {
    it("should call findById twice with correct parameters", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "deleteById").mockResolvedValue(adminUser);

      await deleteUserUseCase.execute(input);

      expect(userRepository.findById).toHaveBeenCalledTimes(2);

      const firstCall = (userRepository.findById as any).mock.calls[0][0];
      const secondCall = (userRepository.findById as any).mock.calls[1][0];

      expect(firstCall.toString()).toBe(adminUser.id.toString());
      expect(secondCall.toString()).toBe(basicUser.id.toString());
    });

    it("should call delete only once", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "deleteById").mockResolvedValue(basicUser);

      await deleteUserUseCase.execute(input);

      expect(userRepository.deleteById).toHaveBeenCalledTimes(1);
    });
    it("should not call delete when authorization fails", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: anotherBasicUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(basicUser)
        .mockResolvedValueOnce(anotherBasicUser);

      vi.spyOn(userRepository, "deleteById").mockResolvedValue(basicUser);

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow();

      expect(userRepository.deleteById).not.toHaveBeenCalled();
    });

    it("should not call delete when user not found", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: UserId.create().toString(),
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(null);

      vi.spyOn(userRepository, "deleteById").mockResolvedValue(adminUser);

      await expect(deleteUserUseCase.execute(input)).rejects.toThrow();

      expect(userRepository.deleteById).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle deleting user with same email domain as requesting user", async () => {
      const sameCompanyUser = User.create(
        {
          name: "Same Company User",
          email: "colleague@example.com",
        },
        validHashedPassword,
      );

      const adminSameCompany = User.create(
        {
          name: "Admin Same Company",
          email: "boss@example.com",

          role: "ADMIN",
        },
        validHashedPassword,
      );

      const input = {
        requestingUserId: adminSameCompany.id.toString(),
        targetUserId: sameCompanyUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminSameCompany)
        .mockResolvedValueOnce(sameCompanyUser);

      vi.spyOn(userRepository, "deleteById").mockResolvedValue(basicUser);

      await deleteUserUseCase.execute(input);

      expect(userRepository.deleteById).toHaveBeenCalledWith(
        sameCompanyUser.id,
      );
    });

    it("should successfully delete when using same ID twice (self-delete)", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: basicUser.id.toString(),
      };

      // Mesmo usuário retornado nas duas buscas
      vi.spyOn(userRepository, "findById").mockResolvedValue(basicUser);
      vi.spyOn(userRepository, "deleteById").mockResolvedValue(basicUser);

      await deleteUserUseCase.execute(input);

      expect(userRepository.findById).toHaveBeenCalledTimes(2);
      expect(userRepository.deleteById).toHaveBeenCalledTimes(1);
    });
  }); /*
            });
            });
  */
});
