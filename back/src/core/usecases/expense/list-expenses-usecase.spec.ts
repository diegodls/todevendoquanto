import { CreateExpenseInput, Expense } from '@/core/entities/expense/expense';
import { ExpenseDescription } from '@/core/entities/expense/value-objects/expense-description';
import { ExpenseName } from '@/core/entities/expense/value-objects/expense-name';
import { ExpenseStatus } from '@/core/entities/expense/value-objects/expense-status';
import { InstallmentId } from '@/core/entities/expense/value-objects/installment-id';
import { InstallmentInfo } from '@/core/entities/expense/value-objects/installment-info';
import { Money } from '@/core/entities/expense/value-objects/money';
import { PaymentSchedule } from '@/core/entities/expense/value-objects/payment-schedule';
import { Tags } from '@/core/entities/expense/value-objects/tags';
import { User } from '@/core/entities/user/user';
import { Email } from '@/core/entities/user/value-objects/user-email';
import { UserId } from '@/core/entities/user/value-objects/user-id';
import { UserRole } from '@/core/entities/user/value-objects/user-role';
import { ExpenseRepositoryInterface } from '@/core/ports/repositories/expense-repository-interface';
import { UserRepositoryInterface } from '@/core/ports/repositories/user-repository-interface';
import {
  NotFoundError,
  UnauthorizedError,
} from '@/core/shared/errors/api-errors';
import { UserIdEmptyError } from '@/core/shared/errors/domain';
import {
  ListExpenseOutputDTO,
  ListExpensesInputDTO,
} from '@/core/usecases/expense/list-expense-dto';
import { ListExpenseUseCase } from '@/core/usecases/expense/list-expenses-usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let listExpenseUseCase: ListExpenseUseCase;
let expenseRepository: ExpenseRepositoryInterface;
let userRepository: UserRepositoryInterface;

const adminValidUuid = '550E8400-E29B-41D4-A716-446655440000';

const basicValidUuid = '550E8400-E29B-41D4-A716-446655440001';

const basicAltValidUuid = '550E8400-E29B-41D4-A716-446655440002';

const validHashedPassword = '$2b$10$hashedPassword';

let adminUser: User;
let basicUser: User;
let basicAltUser: User;
let basicUserExpenses: Expense[];

const makeExpenseInput = (overrides?: Partial<CreateExpenseInput>): Expense =>
  Expense.create({
    name: ExpenseName.create('Expanse01'),
    description: ExpenseDescription.create('Expanse01 description'),
    amount: Money.create(4990, 'BRL'),
    totalAmount: Money.create(4990, 'BRL'),
    status: ExpenseStatus.paying(),
    tags: Tags.create(['Test01', 'Test02', 'Test03']),
    installmentInfo: InstallmentInfo.create(1, 1),
    paymentSchedule: PaymentSchedule.create(
      new Date('2024-01-10'),
      new Date('2024-01-31'),
      new Date('2024-01-01'),
      new Date('2024-12-31'),
    ),
    userId: UserId.create(),
    installmentId: InstallmentId.create(),
    ...overrides,
  });

beforeEach(() => {
  expenseRepository = {
    create: vi.fn(),
    deleteByInstallmentId: vi.fn(),
    findInstallmentById: vi.fn(),
    list: vi.fn(),
  };

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

  listExpenseUseCase = new ListExpenseUseCase(
    expenseRepository,
    userRepository,
  );

  adminUser = User.reconstitute({
    id: UserId.from(adminValidUuid),
    name: 'Admin User',
    email: Email.create('admin_user@gmail.com.br'),
    hashedPassword: validHashedPassword,
    role: UserRole.ADMIN,
    createdAt: new Date('2005-01-10'),
    updatedAt: new Date('2025-01-10'),
    isActive: true,
  });

  basicUser = User.reconstitute({
    id: UserId.from(basicValidUuid),
    name: 'Basic User',
    email: Email.create('basic_user@gmail.com.br'),
    hashedPassword: validHashedPassword,
    role: UserRole.BASIC,
    createdAt: new Date('2005-01-10'),
    updatedAt: new Date('2025-01-10'),
    isActive: true,
  });

  basicAltUser = User.reconstitute({
    id: UserId.from(basicAltValidUuid),
    name: 'Basic User',
    email: Email.create('basic_user@gmail.com.br'),
    hashedPassword: validHashedPassword,
    role: UserRole.BASIC,
    createdAt: new Date('2005-01-10'),
    updatedAt: new Date('2025-01-10'),
    isActive: true,
  });

  const installmentIdBasicOne = InstallmentId.create();

  const installmentIdBasicTwo = InstallmentId.create();

  basicUserExpenses = [
    makeExpenseInput({
      userId: basicUser.id,
      installmentId: installmentIdBasicOne,
    }),
    makeExpenseInput({
      userId: basicUser.id,
      installmentId: installmentIdBasicTwo,
    }),
    makeExpenseInput({
      userId: basicUser.id,
      installmentId: installmentIdBasicTwo,
    }),
  ];
});

describe('ListExpenseUseCase', () => {
  describe('execute', () => {
    describe('authorization', () => {
      it('should allow user list own expenses', async () => {
        const input: ListExpensesInputDTO = {
          requestingUserId: basicUser.id.toString(),
          targetUserId: basicUser.id.toString(),
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);

        vi.spyOn(expenseRepository, 'list').mockResolvedValue(
          basicUserExpenses,
        );

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);
      });

      it('should not return others expenses', async () => {
        const input: ListExpensesInputDTO = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const installmentIdBasicTwo = InstallmentId.create();

        const basicAltUserExpense = makeExpenseInput({
          userId: basicAltUser.id,
          installmentId: installmentIdBasicTwo,
        });

        const wrongOutput: Expense[] = [
          ...basicUserExpenses,
          basicAltUserExpense,
        ];

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce(wrongOutput);

        expect(async () => {
          return await listExpenseUseCase.execute(input);
        }).rejects.toThrow(
          new UnauthorizedError(
            "You don't have the permissions to list this expense.",
          ),
        );
      });

      it('should not allow user list other user expenses', async () => {
        const input: ListExpensesInputDTO = {
          requestingUserId: basicValidUuid,
          targetUserId: basicAltValidUuid,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(
          basicAltUser,
        );

        await expect(listExpenseUseCase.execute(input)).rejects.toThrow(
          new UnauthorizedError(
            "You don't have the permissions to list this expense.",
          ),
        );
      });

      it('should allow admin user list other user expenses', async () => {
        const input: ListExpensesInputDTO = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce(
          basicUserExpenses,
        );

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);
      });
    });

    describe('pagination', () => {
      it('should use default pagination when no provided', async () => {
        const input: ListExpensesInputDTO = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce(
          basicUserExpenses,
        );

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { page: 1, pageSize: 10 },
        );
      });

      it('should default to page 1 when page is less than 1', async () => {
        const input: ListExpensesInputDTO = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
          page: 0,
          pageSize: 10,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce(
          basicUserExpenses,
        );

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { page: 1, pageSize: 10 },
        );
      });

      it('should limit to 100 items per page', async () => {
        const input: ListExpensesInputDTO = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
          page: 0,
          pageSize: 500,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce(
          basicUserExpenses,
        );

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { page: 1, pageSize: 100 },
        );
      });

      it('should return correct pagination metadata', async () => {
        const input: ListExpensesInputDTO = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
          page: 2,
          pageSize: 5,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce(
          basicUserExpenses,
        );

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(result.meta).toEqual({
          page: 1,
          pageSize: 5,
          totalItems: 3,
          totalPages: 1,
        });
      });
    });

    describe('validation', () => {
      it('should throw UserIdEmptyError when requesting user id does not exist', async () => {
        const input: ListExpensesInputDTO = {
          requestingUserId: '',
          targetUserId: basicValidUuid,
        };

        await expect(listExpenseUseCase.execute(input)).rejects.toThrow(
          new UserIdEmptyError(),
        );

        expect(userRepository.findById).not.toHaveBeenCalled();
      });

      it('should throw UserIdEmptyError when target user id does not exist', async () => {
        const input: ListExpensesInputDTO = {
          requestingUserId: adminValidUuid,
          targetUserId: '',
        };

        await expect(listExpenseUseCase.execute(input)).rejects.toThrow(
          new UserIdEmptyError(),
        );

        expect(userRepository.findById).not.toHaveBeenCalled();
      });

      it("should throw NotFoundError when requesting user doesn't exist", async () => {
        const input: ListExpensesInputDTO = {
          requestingUserId: basicValidUuid,
          targetUserId: basicAltValidUuid,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(
          basicAltUser,
        );

        await expect(listExpenseUseCase.execute(input)).rejects.toThrow(
          new NotFoundError('User not found.'),
        );

        expect(userRepository.findById).toHaveBeenCalledTimes(2);
      });

      it("should throw NotFoundError when target user doesn't exist", async () => {
        const input: ListExpensesInputDTO = {
          requestingUserId: basicValidUuid,
          targetUserId: basicAltValidUuid,
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(
          basicAltUser,
        );

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);

        await expect(listExpenseUseCase.execute(input)).rejects.toThrow(
          new NotFoundError('A user ID must be provided.'),
        );
      });
    });
  });
});
