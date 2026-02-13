import { User } from "@/core/entities/user/user";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { UserRole } from "@/core/entities/user/value-objects/user-role";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
import { UpdateUserUseCase } from "@/core/usecases/user/update-user-usecase";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("UpdateUserUseCase", () => {
  let updateUserUseCase: UpdateUserUseCase;
  let userRepository: UserRepositoryInterface;

  const validHashedPassword = "$2b$10$hashedPassword";

  let basicUser: User;
  let adminUser: User;
  let anotherBasicUser: User;

  beforeEach(() => {
    userRepository = {
      deleteById: vi.fn(),
      list: vi.fn(),
      findByName: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
    };

    updateUserUseCase = new UpdateUserUseCase(userRepository);

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
    describe("self-update (user updating themselves)", () => {
      it("should allow user to update their own name", async () => {
        const input = {
          requestingUserId: basicUser.id.toString(),
          targetUserId: basicUser.id.toString(),
          name: "Updated Name",
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(basicUser)
          .mockResolvedValueOnce(basicUser);

        vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

        const result = await updateUserUseCase.execute(input);

        expect(result!.name).toBe("Updated Name");
        expect(userRepository.update).toHaveBeenCalledWith(basicUser);
      });

      it("should update updatedAt timestamp when updating", async () => {
        const input = {
          requestingUserId: basicUser.id.toString(),
          targetUserId: basicUser.id.toString(),
          name: "New Name",
        };

        const oldUpdatedAt = basicUser.updatedAt;

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(basicUser)
          .mockResolvedValueOnce(basicUser);

        vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

        await new Promise((resolve) => setTimeout(resolve, 10));

        await updateUserUseCase.execute(input);

        expect(basicUser.updatedAt.getTime()).toBeGreaterThan(
          oldUpdatedAt.getTime(),
        );
      });

      it("should throw UnauthorizedError when basic user tries to update own email", async () => {
        const input = {
          requestingUserId: basicUser.id.toString(),
          targetUserId: basicUser.id.toString(),
          email: "newemail@example.com",
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(basicUser)
          .mockResolvedValueOnce(basicUser);

        await expect(updateUserUseCase.execute(input)).rejects.toThrow(
          UnauthorizedError,
        );

        expect(userRepository.update).not.toHaveBeenCalled();
      });

      it("should throw correct error message when basic user tries to update own email", async () => {
        const input = {
          requestingUserId: basicUser.id.toString(),
          targetUserId: basicUser.id.toString(),
          email: "newemail@example.com",
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(basicUser)
          .mockResolvedValueOnce(basicUser);

        await expect(updateUserUseCase.execute(input)).rejects.toThrow(
          "Only admins can update email",
        );
      });

      it("should throw UnauthorizedError when basic user tries to update own role", async () => {
        const input = {
          requestingUserId: basicUser.id.toString(),
          targetUserId: basicUser.id.toString(),
          role: "ADMIN",
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(basicUser)
          .mockResolvedValueOnce(basicUser);

        await expect(updateUserUseCase.execute(input)).rejects.toThrow(
          UnauthorizedError,
        );

        expect(userRepository.update).not.toHaveBeenCalled();
      });

      it("should throw correct error message when basic user tries to update own role", async () => {
        const input = {
          requestingUserId: basicUser.id.toString(),
          targetUserId: basicUser.id.toString(),
          role: "ADMIN",
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(basicUser)
          .mockResolvedValueOnce(basicUser);

        await expect(updateUserUseCase.execute(input)).rejects.toThrow(
          "Only admins can update role",
        );
      });

      it("should throw UnauthorizedError when basic user tries to activate/deactivate themselves", async () => {
        const input = {
          requestingUserId: basicUser.id.toString(),
          targetUserId: basicUser.id.toString(),
          isActive: false,
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(basicUser)
          .mockResolvedValueOnce(basicUser);

        await expect(updateUserUseCase.execute(input)).rejects.toThrow(
          UnauthorizedError,
        );
      });

      it("should throw correct error message when basic user tries to activate/deactivate themselves", async () => {
        const input = {
          requestingUserId: basicUser.id.toString(),
          targetUserId: basicUser.id.toString(),
          isActive: false,
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(basicUser)
          .mockResolvedValueOnce(basicUser);

        await expect(updateUserUseCase.execute(input)).rejects.toThrow(
          "Only admins can activate/deactivate users",
        );
      });

      it("should allow admin to update their own name", async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          targetUserId: adminUser.id.toString(),
          name: "New Admin Name",
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(adminUser)
          .mockResolvedValueOnce(adminUser);

        vi.spyOn(userRepository, "update").mockResolvedValue(adminUser);

        const result = await updateUserUseCase.execute(input);

        expect(result!.name).toBe("New Admin Name");
      });

      it("should allow admin to update their own email", async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          targetUserId: adminUser.id.toString(),
          email: "newadmin@example.com",
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(adminUser)
          .mockResolvedValueOnce(adminUser);

        vi.spyOn(userRepository, "update").mockResolvedValue(adminUser);

        const result = await updateUserUseCase.execute(input);

        expect(result!.email).toBe("newadmin@example.com");
      });

      it("should throw UnauthorizedError when admin tries to demote themselves", async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          targetUserId: adminUser.id.toString(),
          role: "BASIC",
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(adminUser)
          .mockResolvedValueOnce(adminUser);

        await expect(updateUserUseCase.execute(input)).rejects.toThrow(
          UnauthorizedError,
        );
      });

      it("should throw correct error message when admin tries to demote themselves", async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          targetUserId: adminUser.id.toString(),
          role: "BASIC",
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(adminUser)
          .mockResolvedValueOnce(adminUser);

        await expect(updateUserUseCase.execute(input)).rejects.toThrow(
          "Admins cannot demote themselves",
        );
      });

      it("should throw UnauthorizedError when admin tries to deactivate themselves", async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          targetUserId: adminUser.id.toString(),
          isActive: false,
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(adminUser)
          .mockResolvedValueOnce(adminUser);

        await expect(updateUserUseCase.execute(input)).rejects.toThrow(
          UnauthorizedError,
        );
      });

      it("should throw UnauthorizedError when admin tries to deactivate themselves", async () => {
        const input = {
          requestingUserId: adminUser.id.toString(),
          targetUserId: adminUser.id.toString(),
          isActive: false,
        };

        vi.spyOn(userRepository, "findById")
          .mockResolvedValueOnce(adminUser)
          .mockResolvedValueOnce(adminUser);

        await expect(updateUserUseCase.execute(input)).rejects.toThrow(
          "Admins cannot deactivate themselves",
        );
      });
    });
  });

  describe("updating other users", () => {
    it("should throw UnauthorizedError when basic user tries to update another user", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: anotherBasicUser.id.toString(),
        name: "Hacked Name",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(basicUser)
        .mockResolvedValueOnce(anotherBasicUser);

      await expect(updateUserUseCase.execute(input)).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it("should throw correct error message when basic user tries to update another user", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: anotherBasicUser.id.toString(),
        name: "Hacked Name",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(basicUser)
        .mockResolvedValueOnce(anotherBasicUser);

      await expect(updateUserUseCase.execute(input)).rejects.toThrow(
        "Only admins can update other users info",
      );
    });

    it("should allow admin to update another user name", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        name: "Admin Changed Name",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

      const result = await updateUserUseCase.execute(input);

      expect(result!.name).toBe("Admin Changed Name");

      expect(userRepository.update).toHaveBeenCalledWith(basicUser);
    });

    it("should allow admin to update another user email", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        email: "adminchanged@example.com",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

      const result = await updateUserUseCase.execute(input);

      expect(result!.email).toBe("adminchanged@example.com");
    });

    it("should allow admin to promote user to admin", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        role: "ADMIN",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

      const result = await updateUserUseCase.execute(input);

      expect(result!.role).toBe("ADMIN");
    });

    it("should allow admin to demote another admin to basic", async () => {
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
        role: "BASIC",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(anotherAdmin);

      vi.spyOn(userRepository, "update").mockResolvedValue(anotherAdmin);

      const result = await updateUserUseCase.execute(input);

      expect(result!.role).toBe("BASIC");
    });

    it("should allow admin to deactivate another user", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        isActive: false,
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

      const result = await updateUserUseCase.execute(input);

      expect(result!.isActive).toBe(false);
    });

    it("should allow admin to activate deactivated user", async () => {
      const deactivatedUser = User.reconstitute({
        id: UserId.create(),
        name: "Deactivated User",
        email: Email.create("deactivated@example.com"),
        hashedPassword: validHashedPassword,
        role: UserRole.BASIC,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
      });

      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: deactivatedUser.id.toString(),
        isActive: true,
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(deactivatedUser);

      vi.spyOn(userRepository, "update").mockResolvedValue(deactivatedUser);

      const result = await updateUserUseCase.execute(input);

      expect(result!.isActive).toBe(true);
    });

    it("should allow admin to update multiple fields at once", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        name: "Multi Update",
        email: "multiupdate@example.com",
        role: "ADMIN",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

      const result = await updateUserUseCase.execute(input);

      expect(result!.name).toBe("Multi Update");
      expect(result!.email).toBe("multiupdate@example.com");
      expect(result!.role).toBe("ADMIN");
    });
  });

  describe("validation errors", () => {
    it("should throw when name is invalid", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        name: "A",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(basicUser)
        .mockResolvedValueOnce(basicUser);

      await expect(updateUserUseCase.execute(input)).rejects.toThrow();
    });

    it("should throw correct message when name is invalid", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        name: "A",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(basicUser)
        .mockResolvedValueOnce(basicUser);

      await expect(updateUserUseCase.execute(input)).rejects.toThrow(
        "Name must have at least 2 characters",
      );
    });

    it("should throw UnauthorizedError when email is invalid format", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        email: "invalid-email",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      await expect(updateUserUseCase.execute(input)).rejects.toThrow();
    });

    it("should throw correct message when email is invalid format", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        email: "invalid-email",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      await expect(updateUserUseCase.execute(input)).rejects.toThrow(
        "Email format is invalid",
      );
    });

    it("should throw UnauthorizedError when role is invalid", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        role: "SUPER_ADMIN",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      await expect(updateUserUseCase.execute(input)).rejects.toThrow(
        "Invalid role",
      );
    });

    it("should throw UnauthorizedError when requesting user ID is invalid UUID", async () => {
      const input = {
        requestingUserId: "invalid-uuid",
        targetUserId: basicUser.id.toString(),
        name: "Test",
      };

      await expect(updateUserUseCase.execute(input)).rejects.toThrow(
        "UserId must be a valid UUID v4",
      );
    });
    it("should throw UnauthorizedError when target user ID is invalid UUID", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: "invalid-uuid",
        name: "Test",
      };

      vi.spyOn(userRepository, "findById").mockResolvedValueOnce(basicUser);

      await expect(updateUserUseCase.execute(input)).rejects.toThrow(
        "UserId must be a valid UUID v4",
      );
    });
  });

  describe("user not found errors", () => {
    it("should throw NotFoundError when requesting user does not exist", async () => {
      const input = {
        requestingUserId: UserId.create().toString(),
        targetUserId: basicUser.id.toString(),
        name: "Test",
      };

      vi.spyOn(userRepository, "findById").mockResolvedValueOnce(null);

      await expect(updateUserUseCase.execute(input)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should throw NotFoundError when target user does not exist", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: UserId.create().toString(),
        name: "Test",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(null);

      await expect(updateUserUseCase.execute(input)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe("edge cases", () => {
    it("should not call update when no fields are updated", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: basicUser.id.toString(),
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(basicUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

      await updateUserUseCase.execute(input);

      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it("should handle updating isActive when already in desired state", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        isActive: true,
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

      const result = await updateUserUseCase.execute(input);

      expect(result!.isActive).toBe(true);
    });
    it("should normalize email before updating", async () => {
      const input = {
        requestingUserId: adminUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        email: "  NEWEMAIL@EXAMPLE.COM  ",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

      const result = await updateUserUseCase.execute(input);

      expect(result!.email).toBe("newemail@example.com");
    });
    it("should trim name before updating", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        name: "  Trimmed Name  ",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(basicUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

      const result = await updateUserUseCase.execute(input);

      expect(result!.name).toBe("Trimmed Name");
    });
  });

  describe("output DTO", () => {
    it("should not return hashedPassword in output", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        name: "Updated",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(basicUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

      const result = await updateUserUseCase.execute(input);

      expect(result).not.toHaveProperty("password");
      expect(result).not.toHaveProperty("hashedPassword");
    });

    it("should return updated timestamp in ISO format", async () => {
      const input = {
        requestingUserId: basicUser.id.toString(),
        targetUserId: basicUser.id.toString(),
        name: "Updated",
      };

      vi.spyOn(userRepository, "findById")
        .mockResolvedValueOnce(basicUser)
        .mockResolvedValueOnce(basicUser);

      vi.spyOn(userRepository, "update").mockResolvedValue(basicUser);

      const result = await updateUserUseCase.execute(input);

      expect(result!.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});
