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
  ListExpenseRequestBodyParams,
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

const installmentIdValidUuidOne = '660E8400-E29B-41D4-A716-446655440001';

const installmentIdBasicOne = InstallmentId.from(installmentIdValidUuidOne);

const installmentIdValidUuidTwo = '660E8400-E29B-41D4-A716-446655440002';

const installmentIdBasicTwo = InstallmentId.from(installmentIdValidUuidTwo);

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
    createdAt: new Date('2005-02-10'),
    updatedAt: new Date('2025-02-10'),
    isActive: true,
  });

  basicAltUser = User.reconstitute({
    id: UserId.from(basicAltValidUuid),
    name: 'Basic User',
    email: Email.create('basic_user@gmail.com.br'),
    hashedPassword: validHashedPassword,
    role: UserRole.BASIC,
    createdAt: new Date('2005-03-10'),
    updatedAt: new Date('2025-03-10'),
    isActive: true,
  });

  basicUserExpenses = [
    makeExpenseInput({
      userId: basicUser.id,
      name: ExpenseName.create('Expanse01'),
      installmentId: installmentIdBasicOne,
    }),
    makeExpenseInput({
      userId: basicUser.id,
      name: ExpenseName.create('Expanse02'),
      installmentId: installmentIdBasicTwo,
    }),
    makeExpenseInput({
      userId: basicUser.id,
      name: ExpenseName.create('Expanse03'),
      installmentId: installmentIdBasicTwo,
    }),
  ];
});

describe('ListExpenseUseCase', () => {
  describe('execute', () => {
    describe('authorization', () => {
      it('should allow user list own expenses', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);

        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);
      });

      it('should not return others expenses', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        const basicAltUserExpense = makeExpenseInput({
          userId: basicAltUser.id,
          installmentId: InstallmentId.create(),
        });

        const wrongOutput: Expense[] = [
          ...basicUserExpenses,
          basicAltUserExpense,
        ];

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: wrongOutput,
          total: 4,
        });

        expect(async () => {
          return await listExpenseUseCase.execute(input);
        }).rejects.toThrow(
          new UnauthorizedError(
            "You don't have the permissions to list this expense.",
          ),
        );
      });

      it('should not allow user list other user expenses', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicAltValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
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

        expect(userRepository.list).not.toHaveBeenCalled();
      });

      it('should allow admin user list other user expenses', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);
      });

      it('should not allow basic user list admin user expenses', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: adminValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);

        await expect(listExpenseUseCase.execute(input)).rejects.toThrow(
          new UnauthorizedError(
            "You don't have the permissions to list this expense.",
          ),
        );

        expect(userRepository.list).not.toHaveBeenCalled();
      });
    });

    describe('pagination', () => {
      it('should use default pagination when no provided', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
          { page: 1, pageSize: 10 },
        );
      });

      it('should default to page 1 when page is less than 1', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
          { page: 1, pageSize: 10 },
        );
      });

      it('should limit to 100 items per page', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 500 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
          { page: 1, pageSize: 100 },
        );
      });

      it('should return correct pagination metadata', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 5 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(result.meta).toEqual({
          page: 1,
          pageSize: 5,
          hasPreviousPage: false,
          hasNextPage: false,
          totalItems: 3,
          totalPages: 1,
        });
      });

      it('should indicate no next page on last page', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });
        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(result.meta.hasPreviousPage).toBe(false);
        expect(result.meta.hasNextPage).toBe(false);
      });

      it('should indicate no previous page on first page', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });
        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(result.meta.hasPreviousPage).toBe(false);
        expect(result.meta.hasNextPage).toBe(false);
      });

      it('should indicate next page on first page', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 1 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });
        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(result.meta.hasPreviousPage).toBe(false);
        expect(result.meta.hasNextPage).toBe(true);
      });

      it('should indicate previous page on first page', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 2, pageSize: 1 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });
        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(result.meta.hasPreviousPage).toBe(true);
        expect(result.meta.hasNextPage).toBe(true);
      });
    });

    describe('filters', () => {
      it('should default when argument is missing', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(3);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          {},
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should filter expenses by installment id', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { installmentId: installmentIdBasicTwo.toString() },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses.filter(
            (expense) =>
              expense.installmentId.toString() ===
              installmentIdBasicTwo.toString(),
          ),
          total: 2,
        });

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(2);
        expect(result.meta.totalItems).toBe(2);
        expect(result.data[0].installmentId).toBe(installmentIdValidUuidTwo);
        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { installmentId: installmentIdBasicTwo.toString() },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should filter expenses by name', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { name: 'Expanse01' },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses.filter(
            (expense) => expense.name.value === 'Expanse01',
          ),
          total: 1,
        });

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(input);

        expect(result.data.length).toBe(1);
        expect(result.data[0].name).toBe('Expanse01');
        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { name: basicUserExpenses[0].name.value },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward created_before date', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { created_after: new Date('2024-01-01') },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { created_after: new Date('2024-01-01') },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward created_after date', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { created_after: new Date('2024-01-01') },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { created_after: new Date('2024-01-01') },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward updated_before date', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { updated_before: new Date('2024-01-01') },
          sorting: {},
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { updated_before: new Date('2024-01-01') },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward description', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { description: 'description test' },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { description: 'description test' },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward amount_min', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { amount_min: 10 },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { amount_min: 10 },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward amount_max', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { amount_max: 100 },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { amount_max: 100 },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward currency', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { currency: ['BRL', 'USD'] },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { currency: ['BRL', 'USD'] },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward totalAmount_min', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { totalAmount_min: 10 },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { totalAmount_min: 10 },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward totalAmount_max', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { totalAmount_max: 100 },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { totalAmount_max: 100 },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward status', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { status: ['paid', 'paying'] },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          {
            status: ['paid', 'paying'],
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward currentInstallment', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { currentInstallment: 2 },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          {
            currentInstallment: 2,
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward totalInstallment', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { totalInstallment: 1 },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          {
            totalInstallment: 1,
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward paymentDay_before', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { paymentDay_before: new Date('2024-01-01') },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          {
            paymentDay_before: new Date('2024-01-01'),
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward paymentDay_after', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { paymentDay_after: new Date('2024-01-01') },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          {
            paymentDay_after: new Date('2024-01-01'),
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward expirationDay_before', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { expirationDay_before: new Date('2024-01-01') },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          {
            expirationDay_before: new Date('2024-01-01'),
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward expirationDay_after', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { expirationDay_after: new Date('2024-01-01') },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          { expirationDay_after: new Date('2024-01-01') },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward paymentStartAt_before', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { paymentStartAt_before: new Date('2024-01-01') },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          {
            paymentStartAt_before: new Date('2024-01-01'),
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward paymentStartAt_after', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { paymentStartAt_after: new Date('2024-01-01') },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          {
            paymentStartAt_after: new Date('2024-01-01'),
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward paymentEndAt_before', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { paymentEndAt_before: new Date('2024-01-01') },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          {
            paymentEndAt_before: new Date('2024-01-01'),
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward paymentEndAt_after', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: { paymentEndAt_after: new Date('2024-01-01') },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          {
            paymentEndAt_after: new Date('2024-01-01'),
          },
          expect.any(Object),
          expect.any(Object),
        );
      });

      it('should forward multiples filters', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {
            status: ['paid', 'paying'],
            paymentEndAt_after: new Date('2024-01-01'),
            paymentEndAt_before: new Date('2024-01-01'),
          },
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          {
            status: ['paid', 'paying'],
            paymentEndAt_before: new Date('2024-01-01'),
            paymentEndAt_after: new Date('2024-01-01'),
          },
          expect.any(Object),
          expect.any(Object),
        );
      });
    });

    describe('shorting', () => {
      it('should forward sort by name as default', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'name' },
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'name' },
          expect.any(Object),
        );
      });

      it('should forward sort by name ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'name' },
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'name' },
          expect.any(Object),
        );
      });

      it('should forward sort by name descending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'desc', orderBy: 'name' },
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'desc', orderBy: 'name' },
          expect.any(Object),
        );
      });

      it('should forward sort by description ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'description' },
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'description' },
          expect.any(Object),
        );
      });

      it('should forward sort by description descending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'desc', orderBy: 'description' },
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'desc', orderBy: 'description' },
          expect.any(Object),
        );
      });

      it('should forward sort by amount ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'amount' },
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'amount' },
          expect.any(Object),
        );
      });

      it('should forward sort by amount ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'amount' },
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'amount' },
          expect.any(Object),
        );
      });

      it('should forward sort by currency descending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'desc', orderBy: 'currency' },
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'desc', orderBy: 'currency' },
          expect.any(Object),
        );
      });

      it('should forward sort by currency ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'currency' },
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'currency' },
          expect.any(Object),
        );
      });

      it('should forward sort by totalAmount descending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'desc', orderBy: 'totalAmount' },
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'desc', orderBy: 'totalAmount' },
          expect.any(Object),
        );
      });

      it('should forward sort by totalAmount ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'totalAmount' },
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'totalAmount' },
          expect.any(Object),
        );
      });

      it('should forward sort by status descending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'desc', orderBy: 'status' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'desc', orderBy: 'status' },
          expect.any(Object),
        );
      });

      it('should forward sort by status ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'status' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'status' },
          expect.any(Object),
        );
      });

      it('should forward sort by tags descending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'desc', orderBy: 'tags' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'desc', orderBy: 'tags' },
          expect.any(Object),
        );
      });

      it('should forward sort by tags ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'tags' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'tags' },
          expect.any(Object),
        );
      });

      it('should forward sort by currentInstallment descending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'desc', orderBy: 'currentInstallment' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'desc', orderBy: 'currentInstallment' },
          expect.any(Object),
        );
      });

      it('should forward sort by currentInstallment ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'currentInstallment' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'currentInstallment' },
          expect.any(Object),
        );
      });

      it('should forward sort by totalInstallment descending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'desc', orderBy: 'totalInstallment' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'desc', orderBy: 'totalInstallment' },
          expect.any(Object),
        );
      });

      it('should forward sort by totalInstallment ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'totalInstallment' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'totalInstallment' },
          expect.any(Object),
        );
      });

      it('should forward sort by paymentDay descending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'desc', orderBy: 'paymentDay' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'desc', orderBy: 'paymentDay' },
          expect.any(Object),
        );
      });

      it('should forward sort by paymentDay ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'paymentDay' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'paymentDay' },
          expect.any(Object),
        );
      });

      it('should forward sort by expirationDay descending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'desc', orderBy: 'expirationDay' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'desc', orderBy: 'expirationDay' },
          expect.any(Object),
        );
      });

      it('should forward sort by expirationDay ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'expirationDay' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'expirationDay' },
          expect.any(Object),
        );
      });

      it('should forward sort by paymentStartAt descending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'desc', orderBy: 'paymentStartAt' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'desc', orderBy: 'paymentStartAt' },
          expect.any(Object),
        );
      });

      it('should forward sort by paymentStartAt ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'paymentStartAt' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'paymentStartAt' },
          expect.any(Object),
        );
      });

      it('should forward sort by paymentEndAt descending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'desc', orderBy: 'paymentEndAt' },
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'desc', orderBy: 'paymentEndAt' },
          expect.any(Object),
        );
      });

      it('should forward sort by paymentEndAt ascending', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: { order: 'asc', orderBy: 'paymentEndAt' },
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        await listExpenseUseCase.execute(input);

        expect(expenseRepository.list).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { order: 'asc', orderBy: 'paymentEndAt' },
          expect.any(Object),
        );
      });
    });

    describe('output', () => {
      it("should map expenses to DTO's correctly", async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: {},
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        const result = await listExpenseUseCase.execute(input);

        expect(result.data[0]).toEqual({
          userId: basicUserExpenses[0].userId.toString(),
          installmentId: basicUserExpenses[0].installmentId.toString(),
          name: basicUserExpenses[0].name.value,
          description: basicUserExpenses[0].description?.value,
          amount: basicUserExpenses[0].amount.cents,
          currency: basicUserExpenses[0].amount.currency,
          totalAmount: basicUserExpenses[0].totalAmount.cents,
          status: basicUserExpenses[0].status.toString(),
          tags: basicUserExpenses[0].tags.toArray(),
          currentInstallment: basicUserExpenses[0].installmentInfo.current,
          totalInstallment: basicUserExpenses[0].installmentInfo.total,
          paymentDay:
            basicUserExpenses[0].paymentSchedule.paymentDay.toISOString(),
          expirationDay:
            basicUserExpenses[0].paymentSchedule.expirationDay.toISOString(),
          paymentStartAt:
            basicUserExpenses[0].paymentSchedule.startAt.toISOString(),
          paymentEndAt:
            basicUserExpenses[0].paymentSchedule.endAt.toISOString(),
        });
      });

      it('should return dates in ISO format', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(adminUser);
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(basicUser);
        vi.spyOn(expenseRepository, 'list').mockResolvedValueOnce({
          data: basicUserExpenses,
          total: 3,
        });

        const result = await listExpenseUseCase.execute(input);

        expect(result.data[0].paymentDay).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
        );

        expect(result.data[0].expirationDay).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
        );

        expect(result.data[0].paymentStartAt).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
        );

        expect(result.data[0].paymentEndAt).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
        );
      });
    });

    describe('validation', () => {
      it('should throw UserIdEmptyError when requesting user id does not exist', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: '',
          targetUserId: basicValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        await expect(listExpenseUseCase.execute(input)).rejects.toThrow(
          new UserIdEmptyError(),
        );

        expect(userRepository.findById).not.toHaveBeenCalled();
      });

      it('should throw UserIdEmptyError when target user id does not exist', async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: adminValidUuid,
          targetUserId: '',
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: { page: 1, pageSize: 10 },
        };

        await expect(listExpenseUseCase.execute(input)).rejects.toThrow(
          new UserIdEmptyError(),
        );

        expect(userRepository.findById).not.toHaveBeenCalled();
      });

      it("should throw NotFoundError when requesting user doesn't exist", async () => {
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicAltValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: {},
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
        const body: ListExpenseRequestBodyParams = {
          requestingUserId: basicValidUuid,
          targetUserId: basicAltValidUuid,
        };

        const input: ListExpensesInputDTO = {
          body,
          filters: {},
          sorting: {},
          pagination: {},
        };
        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(
          basicAltUser,
        );

        vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);

        await expect(listExpenseUseCase.execute(input)).rejects.toThrow(
          new NotFoundError('User not found.'),
        );
      });
    });
  });
});
