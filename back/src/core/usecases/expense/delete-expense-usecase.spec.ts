import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
import { InfrastructureError } from "@/core/shared/errors/infrastructure-errors";
import { DeleteExpenseInputDTO } from "@/core/usecases/expense/delete-expense-dto";
import { DeleteExpenseUseCase } from "@/core/usecases/expense/delete-expense-usecase";
import { beforeEach, describe, expect, it, vi } from "vitest";

const INSTALLMENT_ID = "550e8400-e29b-41d4-a716-446655440000";
const OWNER_USER_ID = "660e8400-e29b-41d4-a716-446655440001";
const OTHER_USER_ID = "770e8400-e29b-41d4-a716-446655440002";

const makeExpenses = (overrides?: Partial<{ userId: string }>) =>
  Array.from({ length: 2 }, (_, i) => ({
    id: `expense-${i + 1}`,
    userId: {
      value: overrides?.userId ?? OWNER_USER_ID,
      equals: vi.fn(
        (other: any) => other.value === (overrides?.userId ?? OWNER_USER_ID),
      ),
    },
    installmentId: { value: INSTALLMENT_ID },
  }));

const makeUser = (overrides?: { id?: string; canDeleteContent?: boolean }) => ({
  id: {
    value: overrides?.id ?? OWNER_USER_ID,
    equals: vi.fn(
      (other: any) => other.value === (overrides?.id ?? OWNER_USER_ID),
    ),
  },
  canDeleteContent: vi
    .fn()
    .mockReturnValue(overrides?.canDeleteContent ?? false),
});

const makeInput = (
  overrides?: Partial<DeleteExpenseInputDTO>,
): DeleteExpenseInputDTO => ({
  installmentId: INSTALLMENT_ID,
  requestingUserId: OWNER_USER_ID,
  ...overrides,
});

const makeRepositories = () => ({
  expenseRepository: {
    findInstallmentById: vi.fn(),
    deleteByInstallmentId: vi.fn().mockResolvedValue(undefined),
  } as unknown as ExpenseRepositoryInterface,

  userRepository: {
    findById: vi.fn(),
  } as unknown as UserRepositoryInterface,
});

describe("DeleteExpenseUseCase", () => {
  let expenseRepository: ExpenseRepositoryInterface;
  let userRepository: UserRepositoryInterface;
  let sut: DeleteExpenseUseCase;

  beforeEach(() => {
    ({ expenseRepository, userRepository } = makeRepositories());
    sut = new DeleteExpenseUseCase(expenseRepository, userRepository);
  });

  describe("given valid input and authorized owner", () => {
    it("should call deleteByInstallmentId once", async () => {
      const expenses = makeExpenses();

      const user = makeUser();

      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        expenses as any,
      );

      vi.mocked(userRepository.findById).mockResolvedValue(user as any);

      await sut.execute(makeInput());

      expect(expenseRepository.deleteByInstallmentId).toHaveBeenCalledTimes(1);
    });

    it("should delete using the correct installmentId", async () => {
      const expenses = makeExpenses();
      const user = makeUser();

      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        expenses as any,
      );

      vi.mocked(userRepository.findById).mockResolvedValue(user as any);

      await sut.execute(makeInput());

      const [calledId] = vi.mocked(expenseRepository.deleteByInstallmentId).mock
        .calls[0];
      expect(calledId.toString()).toBe(INSTALLMENT_ID);
    });

    it("should allow admin user to delete expense they don't own", async () => {
      const expenses = makeExpenses({ userId: OWNER_USER_ID });
      const adminUser = makeUser({ id: OTHER_USER_ID, canDeleteContent: true });
      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        expenses as any,
      );
      vi.mocked(userRepository.findById).mockResolvedValue(adminUser as any);

      await expect(
        sut.execute(makeInput({ requestingUserId: OTHER_USER_ID })),
      ).resolves.toBeUndefined();
      expect(expenseRepository.deleteByInstallmentId).toHaveBeenCalledTimes(1);
    });

    it("should resolve without returning a value", async () => {
      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        makeExpenses() as any,
      );
      vi.mocked(userRepository.findById).mockResolvedValue(makeUser() as any);

      await expect(sut.execute(makeInput())).resolves.toBeUndefined();
    });
  });

  describe("given expenses not found", () => {
    it("should throw NotFoundError when findInstallmentById returns null", async () => {
      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        null as any,
      );

      await expect(sut.execute(makeInput())).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError when findInstallmentById returns empty array", async () => {
      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue([]);

      await expect(sut.execute(makeInput())).rejects.toThrow(NotFoundError);
    });

    it("should not query user when expenses are not found", async () => {
      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue([]);

      await sut.execute(makeInput()).catch(() => {});

      expect(userRepository.findById).not.toHaveBeenCalled();
    });

    it("should not call delete when expenses are not found", async () => {
      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue([]);

      await sut.execute(makeInput()).catch(() => {});

      expect(expenseRepository.deleteByInstallmentId).not.toHaveBeenCalled();
    });
  });

  describe("given user not found", () => {
    it("should throw NotFoundError when user does not exist", async () => {
      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        makeExpenses() as any,
      );

      vi.mocked(userRepository.findById).mockResolvedValue(null);

      await expect(sut.execute(makeInput())).rejects.toThrow(NotFoundError);
    });

    it("should not call delete when user is not found", async () => {
      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        makeExpenses() as any,
      );

      vi.mocked(userRepository.findById).mockResolvedValue(null);

      await sut.execute(makeInput()).catch(() => {});

      expect(expenseRepository.deleteByInstallmentId).not.toHaveBeenCalled();
    });

    it("should throw NotFoundError not UnauthorizedError when user is missing", async () => {
      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        makeExpenses() as any,
      );
      vi.mocked(userRepository.findById).mockResolvedValue(null);

      await expect(sut.execute(makeInput())).rejects.toThrow(NotFoundError);
      await expect(sut.execute(makeInput())).rejects.not.toThrow(
        UnauthorizedError,
      );
    });
  });

  describe("given unauthorized user", () => {
    it("should throw UnauthorizedError when user is not the owner and cannot delete content", async () => {
      const expenses = makeExpenses({ userId: OWNER_USER_ID });
      const otherUser = makeUser({
        id: OTHER_USER_ID,
        canDeleteContent: false,
      });

      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        expenses as any,
      );

      vi.mocked(userRepository.findById).mockResolvedValue(otherUser as any);

      await expect(
        sut.execute(makeInput({ requestingUserId: OTHER_USER_ID })),
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should not call delete when user is unauthorized", async () => {
      const expenses = makeExpenses({ userId: OWNER_USER_ID });
      const otherUser = makeUser({
        id: OTHER_USER_ID,
        canDeleteContent: false,
      });

      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        expenses as any,
      );

      vi.mocked(userRepository.findById).mockResolvedValue(otherUser as any);

      await sut
        .execute(makeInput({ requestingUserId: OTHER_USER_ID }))
        .catch(() => {});

      expect(expenseRepository.deleteByInstallmentId).not.toHaveBeenCalled();
    });
  });

  describe("given invalid input", () => {
    it("should throw when installmentId is not a valid uuid", async () => {
      await expect(
        sut.execute(makeInput({ installmentId: "not-a-uuid" })),
      ).rejects.toThrow();

      expect(expenseRepository.findInstallmentById).not.toHaveBeenCalled();
    });

    it("should throw when requestingUserId is not a valid uuid", async () => {
      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        makeExpenses() as any,
      );

      await expect(
        sut.execute(makeInput({ requestingUserId: "not-a-uuid" })),
      ).rejects.toThrow();
    });
  });

  describe("given repository failures", () => {
    it("should propagate exception from findInstallmentById", async () => {
      vi.mocked(expenseRepository.findInstallmentById).mockRejectedValue(
        new InfrastructureError("DB unavailable"),
      );

      await expect(sut.execute(makeInput())).rejects.toThrow("DB unavailable");
    });

    it("should propagate exception from userRepository.findById", async () => {
      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        makeExpenses() as any,
      );

      vi.mocked(userRepository.findById).mockRejectedValue(
        new InfrastructureError("User DB unavailable"),
      );

      await expect(sut.execute(makeInput())).rejects.toThrow(
        "User DB unavailable",
      );
    });

    it("should propagate exception from deleteByInstallmentId", async () => {
      vi.mocked(expenseRepository.findInstallmentById).mockResolvedValue(
        makeExpenses() as any,
      );

      vi.mocked(userRepository.findById).mockResolvedValue(makeUser() as any);

      vi.mocked(expenseRepository.deleteByInstallmentId).mockRejectedValue(
        new InfrastructureError("Delete failed"),
      );

      await expect(sut.execute(makeInput())).rejects.toThrow("Delete failed");
    });
  });
});
