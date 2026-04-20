import { JwtGenerateTokenInterface } from "@/core/ports/infrastructure/protocols/jwt/jwt-generate-token-interface";
import { PasswordHasherInterface } from "@/core/ports/infrastructure/protocols/passwordHasher-interface";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import { UnauthorizedError } from "@/core/shared/errors/api-errors";
import { InfrastructureError } from "@/core/shared/errors/infrastructure-errors";
import { LoginUserInputDTO } from "@/core/usecases/auth/login-dto";
import { LoginUseCase } from "@/core/usecases/auth/login-usecase";
import { beforeEach, describe, expect, it, vi } from "vitest";

const VALID_EMAIL = "john@example.com";
const VALID_PASSWORD = "Secret123!";
const VALID_TOKEN = "jwt.token.here";

const makeUser = (overrides?: {
  isActive?: boolean;
  hashedPassword?: string;
}) => ({
  id: { toString: () => "550e8400-e29b-41d4-a716-446655440000" },
  email: { toString: () => VALID_EMAIL },
  role: { toString: () => "USER" },
  hashedPassword: overrides?.hashedPassword ?? "hashed_password",
  isActive: overrides?.isActive ?? true,
});

const makeRepository = (): UserRepositoryInterface => ({
  findByEmail: vi.fn().mockResolvedValue(makeUser()),
  deleteById: vi.fn(),
  exists: vi.fn(),
  findByName: vi.fn(),
  findById: vi.fn(),
  list: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
});

const makePasswordHasher = (): PasswordHasherInterface => ({
  compare: vi.fn().mockResolvedValue(true),
  hash: vi.fn(),
});

const makeGenerateToken = (): JwtGenerateTokenInterface => ({
  execute: vi.fn().mockReturnValue(VALID_TOKEN),
});

const makeInput = (
  overrides?: Partial<LoginUserInputDTO>,
): LoginUserInputDTO => ({
  email: VALID_EMAIL,
  password: VALID_PASSWORD,
  ...overrides,
});

describe("LoginUseCase", () => {
  let repository: UserRepositoryInterface;
  let passwordHasher: PasswordHasherInterface;
  let generateToken: JwtGenerateTokenInterface;
  let sut: LoginUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = makeRepository();
    passwordHasher = makePasswordHasher();
    generateToken = makeGenerateToken();
    sut = new LoginUseCase(repository, passwordHasher, generateToken);
  });

  describe("given valid credentials", () => {
    it("should return a token", async () => {
      const result = await sut.execute(makeInput());

      expect(result.token).toBe(VALID_TOKEN);
    });

    it("should call repository.findByEmail with the parsed email", async () => {
      await sut.execute(makeInput());

      expect(repository.findByEmail).toHaveBeenCalledOnce();
    });

    it("should call passwordHasher.compare with raw password and stored hash", async () => {
      const user = makeUser({ hashedPassword: "hashed_password" });
      vi.mocked(repository.findByEmail).mockResolvedValue(user as any);

      await sut.execute(makeInput());

      expect(passwordHasher.compare).toHaveBeenCalledWith(
        expect.any(String),
        "hashed_password",
      );
    });

    it("should call generateToken with email, role and user id", async () => {
      await sut.execute(makeInput());

      expect(generateToken.execute).toHaveBeenCalledWith(
        { email: VALID_EMAIL, role: "USER" },
        "550e8400-e29b-41d4-a716-446655440000",
      );
    });
  });

  describe("given invalid credentials format", () => {
    it("should throw UnauthorizedError when email format is invalid", async () => {
      await expect(
        sut.execute(makeInput({ email: "not-an-email" })),
      ).rejects.toThrow(UnauthorizedError);

      expect(repository.findByEmail).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError when password format is invalid", async () => {
      await expect(sut.execute(makeInput({ password: "" }))).rejects.toThrow(
        UnauthorizedError,
      );

      expect(repository.findByEmail).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError — not leak which field is invalid", async () => {
      const error = await sut
        .execute(makeInput({ email: "bad" }))
        .catch((e) => e);

      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.message).toBe("Wrong credentials!");
    });
  });

  describe("given user not found", () => {
    it("should throw UnauthorizedError when no user exists with that email", async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(null);

      await expect(sut.execute(makeInput())).rejects.toThrow(UnauthorizedError);
    });

    it("should not call passwordHasher when user is not found", async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(null);

      await sut.execute(makeInput()).catch(() => {});

      expect(passwordHasher.compare).not.toHaveBeenCalled();
    });

    it("should use same error message as invalid credentials — no user enumeration", async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(null);

      const error = await sut.execute(makeInput()).catch((e) => e);

      expect(error.message).toBe("Wrong credentials!");
    });
  });

  describe("given inactive user", () => {
    it("should throw UnauthorizedError when user account is deactivated", async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(
        makeUser({ isActive: false }) as any,
      );

      console.log;

      await expect(sut.execute(makeInput())).rejects.toThrow(UnauthorizedError);
    });

    it("should use a distinct message for deactivated accounts", async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(
        makeUser({ isActive: false }) as any,
      );

      const error = await sut.execute(makeInput()).catch((e) => e);

      expect(error.message).toBe("User account is deactivated");
    });

    it("should not call passwordHasher when user is deactivated", async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(
        makeUser({ isActive: false }) as any,
      );

      await sut.execute(makeInput()).catch(() => {});

      expect(passwordHasher.compare).not.toHaveBeenCalled();
    });
  });

  describe("given wrong password", () => {
    it("should throw UnauthorizedError when password does not match", async () => {
      vi.mocked(passwordHasher.compare).mockResolvedValue(false);

      await expect(sut.execute(makeInput())).rejects.toThrow(UnauthorizedError);
    });

    it("should not generate token when password is wrong", async () => {
      vi.mocked(passwordHasher.compare).mockResolvedValue(false);

      await sut.execute(makeInput()).catch(() => {});

      expect(generateToken.execute).not.toHaveBeenCalled();
    });

    it("should use same error message as user not found — no user enumeration", async () => {
      vi.mocked(passwordHasher.compare).mockResolvedValue(false);

      const error = await sut.execute(makeInput()).catch((e) => e);

      expect(error.message).toBe("Wrong credentials!");
    });
  });

  describe("given infrastructure failures", () => {
    it("should propagate repository exception", async () => {
      vi.mocked(repository.findByEmail).mockRejectedValue(
        new InfrastructureError("DB unavailable"),
      );

      await expect(sut.execute(makeInput())).rejects.toThrow("DB unavailable");
    });

    it("should propagate passwordHasher exception", async () => {
      vi.mocked(passwordHasher.compare).mockRejectedValue(
        new InfrastructureError("Hasher failed"),
      );

      await expect(sut.execute(makeInput())).rejects.toThrow("Hasher failed");
    });

    it("should propagate generateToken exception", async () => {
      vi.mocked(generateToken.execute).mockImplementation(() => {
        throw new InfrastructureError("JWT signing failed");
      });

      await expect(sut.execute(makeInput())).rejects.toThrow(
        "JWT signing failed",
      );
    });
  });
});
