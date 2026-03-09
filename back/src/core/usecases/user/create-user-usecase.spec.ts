// core/use-cases/user/create-user/create-user.usecase.spec.ts

import { PasswordHasherInterface } from "@/core/ports/infrastructure/protocols/passwordHasher-interface";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import { CreateUserUseCase } from "@/core/usecases/user/create-user-usecase";
import { beforeEach, describe, expect, it, vi } from "vitest";

let createUserUseCase: CreateUserUseCase;
let userRepository: UserRepositoryInterface;
let passwordHasher: PasswordHasherInterface;

beforeEach(() => {
  userRepository = {
    deleteById: vi.fn(),
    exists: vi.fn(),
    findByEmail: vi.fn(),
    findByName: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
  };

  passwordHasher = {
    hash: vi.fn(),
    compare: vi.fn(),
  };

  createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);
});

describe("CreateUserUseCase", () => {
  describe("execute", () => {
    describe("successful creation", () => {
      it("should create a new user with valid data", async () => {
        const input = {
          name: "John Doe",
          email: "john@example.com",
          password: "Secret123!",
        };

        vi.spyOn(userRepository, "exists").mockResolvedValue(false);
        vi.spyOn(passwordHasher, "hash").mockResolvedValue(
          "$2b$10$hashedPassword",
        );
        vi.spyOn(userRepository, "save").mockResolvedValue();

        const result = await createUserUseCase.execute(input);

        expect(result).toEqual({
          id: expect.any(String),
          name: "John Doe",
          email: "john@example.com",
          role: "BASIC",
          isActive: true,
          createdAt: expect.any(String),
        });
      });
    });
  });

  it("should create user with ADMIN role when specified", async () => {
    const input = {
      name: "Admin User",
      email: "admin@example.com",
      password: "Secret123!",
      role: "ADMIN",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    const result = await createUserUseCase.execute(input);

    expect(result.role).toBe("ADMIN");
  });

  it("should generate unique UUID for each user", async () => {
    const input = {
      name: "User One",
      email: "user1@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    const result1 = await createUserUseCase.execute(input);

    const input2 = { ...input, email: "user2@example.com" };
    const result2 = await createUserUseCase.execute(input2);

    expect(result1.id).not.toBe(result2.id);
    expect(result1.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it("should set user as active by default", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    const result = await createUserUseCase.execute(input);

    expect(result.isActive).toBe(true);
  });
  it("should return createdAt in ISO format", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    const result = await createUserUseCase.execute(input);

    expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });
});

describe("email validation", () => {
  it("should throw when email is invalid format", async () => {
    const input = {
      name: "John Doe",
      email: "invalid-email",
      password: "Secret123!",
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow();

    expect(userRepository.exists).not.toHaveBeenCalled();
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it("should throw when email is empty", async () => {
    const input = {
      name: "John Doe",
      email: "",
      password: "Secret123!",
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow();
  });

  it("should throw when email is too long", async () => {
    const input = {
      name: "John Doe",
      email: "a".repeat(250) + "@example.com", // > 254 chars
      password: "Secret123!",
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow();
  });
  it("should normalize email to lowercase", async () => {
    const input = {
      name: "John Doe",
      email: "JOHN@EXAMPLE.COM",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    const result = await createUserUseCase.execute(input);

    expect(result.email).toBe("john@example.com");
  });
  it("should trim whitespace from email", async () => {
    const input = {
      name: "John Doe",
      email: "  john@example.com  ",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    const result = await createUserUseCase.execute(input);

    expect(result.email).toBe("john@example.com");
  });
});

describe("password validation", () => {
  it("should throw when password is too short", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Short1!",
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow();

    expect(userRepository.exists).not.toHaveBeenCalled();
  });

  it("should throw when password has no uppercase", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "secret123!",
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow();
  });
  it("should throw when password has no lowercase", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "SECRET123!",
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow();
  });

  it("should throw when password has no number", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecretPass!",
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow();
  });
  it("should throw when password has no special character", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Secret123",
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow();
  });

  it("should throw when password is too common", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Password1!",
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow();
  });

  it("should accept valid complex passwords", async () => {
    const validPasswords = ["MyP@ssw0rd", "C0mpl3x!Pass", "Str0ng#Secret"];

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    for (const password of validPasswords) {
      const input = {
        name: "John Doe",
        email: `john${Math.random()}@example.com`,
        password,
      };

      await expect(createUserUseCase.execute(input)).resolves.toBeDefined();
    }
  });
});

describe("name validation", () => {
  it("should throw when name is empty", async () => {
    const input = {
      name: "",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");

    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "Name cannot be empty",
    );
  });

  it("should throw when name is too short", async () => {
    const input = {
      name: "J",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");

    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "Name must have at least 2 characters",
    );
  });

  it("should throw when name is too long", async () => {
    const input = {
      name: "J".repeat(101),
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");

    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "Name exceeds maximum length of 100 characters",
    );
  });

  it("should throw when name contains invalid characters", async () => {
    const input = {
      name: "John123",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");

    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "Name contains invalid characters",
    );
  });

  it("should accept names with valid special characters", async () => {
    const validNames = ["O'Brien", "Mary-Jane", "Jean-Claude", "Mária José"];

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    for (const name of validNames) {
      const input = {
        name,
        email: `${name.replace(/\s/g, "").toLowerCase()}@example.com`,
        password: "Secret123!",
      };

      const result = await createUserUseCase.execute(input);

      console.log(input);

      expect(result.name).toBe(name);
    }
  });
  it("should trim whitespace from name", async () => {
    const input = {
      name: "  John Doe  ",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    const result = await createUserUseCase.execute(input);

    expect(result.name).toBe("John Doe");
  });
});

describe("role validation", () => {
  it("should throw when role is invalid", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Secret123!",
      role: "SUPER_ADMIN",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");

    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "Invalid role",
    );
  });

  it("should default to BASIC role when not specified", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    const result = await createUserUseCase.execute(input);

    expect(result.role).toBe("BASIC");
  });
  it("should normalize role to uppercase", async () => {
    const input = {
      name: "Admin User",
      email: "admin@example.com",
      password: "Secret123!",
      role: "admin", // lowercase
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    const result = await createUserUseCase.execute(input);

    expect(result.role).toBe("ADMIN");
  });
});

describe("email uniqueness", () => {
  it("should throw UserAlreadyExistsError when email already exists", async () => {
    const input = {
      name: "John Doe",
      email: "existing@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(true);

    await expect(createUserUseCase.execute(input)).rejects.toThrow();

    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it("should include email in error message when user already exists", async () => {
    const input = {
      name: "John Doe",
      email: "existing@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(true);

    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "User already exists with given email",
    );
  });

  it("should check email existence with normalized email", async () => {
    const input = {
      name: "John Doe",
      email: "  JOHN@EXAMPLE.COM  ",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    await createUserUseCase.execute(input);

    const emailArg = (userRepository.exists as any).mock.calls[0][0];
    expect(emailArg.toString()).toBe("john@example.com");
  });
});

describe("password hashing", () => {
  it("should hash password before saving", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    await createUserUseCase.execute(input);

    expect(passwordHasher.hash).toHaveBeenCalledWith("Secret123!");
  });

  it("should save user with hashed password", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Secret123!",
    };

    const hashedPassword = "$2b$10$mockedHashedPassword";

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue(hashedPassword);
    vi.spyOn(userRepository, "save").mockResolvedValue();

    await createUserUseCase.execute(input);

    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        hashedPassword: hashedPassword,
      }),
    );
  });
  it("should never store plain text password", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    await createUserUseCase.execute(input);

    const savedUser = (userRepository.save as any).mock.calls[0][0];
    expect(savedUser.hashedPassword).not.toBe("Secret123!");
    expect(savedUser.hashedPassword).toBe("$2b$10$hashedPassword");
  });
});

describe("repository interaction", () => {
  it("should call repository.exists with Email value object", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    await createUserUseCase.execute(input);

    expect(userRepository.exists).toHaveBeenCalledWith(
      expect.objectContaining({
        toString: expect.any(Function),
      }),
    );
  });

  it("should call repository.save exactly once", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    await createUserUseCase.execute(input);

    expect(userRepository.save).toHaveBeenCalledTimes(1);
  });
  it("should not call save when email already exists", async () => {
    const input = {
      name: "John Doe",
      email: "existing@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(true);

    await expect(createUserUseCase.execute(input)).rejects.toThrow();

    expect(userRepository.save).not.toHaveBeenCalled();
  });
});

describe("output", () => {
  it("should not return hashedPassword in output", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    const result = await createUserUseCase.execute(input);

    expect(result).not.toHaveProperty("password");
    expect(result).not.toHaveProperty("hashedPassword");
  });

  it("should return all required fields", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(false);
    vi.spyOn(passwordHasher, "hash").mockResolvedValue("$2b$10$hashedPassword");
    vi.spyOn(userRepository, "save").mockResolvedValue();

    const result = await createUserUseCase.execute(input);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("role");
    expect(result).toHaveProperty("isActive");
    expect(result).toHaveProperty("createdAt");
  });
});

describe("execution order", () => {
  it("should validate email before checking existence", async () => {
    const input = {
      name: "John Doe",
      email: "invalid-email",
      password: "Secret123!",
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow();

    expect(userRepository.exists).not.toHaveBeenCalled();
  });

  it("should validate password before checking email existence", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "weak",
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow();

    expect(userRepository.exists).not.toHaveBeenCalled();
  });

  it("should check email existence before hashing password", async () => {
    const input = {
      name: "John Doe",
      email: "existing@example.com",
      password: "Secret123!",
    };

    vi.spyOn(userRepository, "exists").mockResolvedValue(true);

    await expect(createUserUseCase.execute(input)).rejects.toThrow();

    expect(passwordHasher.hash).not.toHaveBeenCalled();
  });
});
