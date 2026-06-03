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
import {
  ListExpenseOutputDTO,
  ListExpensesInputDTO,
} from '@/core/usecases/expense/list-expense-dto';
import { ListExpenseUseCase } from '@/core/usecases/expense/list-expenses-usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/*
Administradores podem ver de outros usuários
Usuários não podem ver de outros usuários
Filtrar usando todos dos campos do dto (boa sorte)

*/

const validHashedPassword = '$2b$10$hashedPassword';

let listExpenseUseCase: ListExpenseUseCase;
let expenseRepository: ExpenseRepositoryInterface;

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

describe('ListExpenseUseCase', () => {
  beforeEach(() => {
    expenseRepository = {
      create: vi.fn(),
      deleteByInstallmentId: vi.fn(),
      findInstallmentById: vi.fn(),
      list: vi.fn(),
    };
  });

  listExpenseUseCase = new ListExpenseUseCase(expenseRepository);

  const adminValidUuid = '550E8400-E29B-41D4-A716-446655440000';

  const adminUser = User.reconstitute({
    id: UserId.from(adminValidUuid),
    name: 'Admin User',
    email: Email.create('admin_user@gmail.com.br'),
    hashedPassword: validHashedPassword,
    role: UserRole.ADMIN,
    createdAt: new Date('2000-01-10'),
    updatedAt: new Date('2024-01-10'),
    isActive: true,
  });

  const installmentIdAdmin = InstallmentId.create();

  const basicValidUuid = '550E8400-E29B-41D4-A716-446655440001';

  let basicUser: User = User.reconstitute({
    id: UserId.from(basicValidUuid),
    name: 'Basic User',
    email: Email.create('basic_user@gmail.com.br'),
    hashedPassword: validHashedPassword,
    role: UserRole.BASIC,
    createdAt: new Date('2005-01-10'),
    updatedAt: new Date('2025-01-10'),
    isActive: true,
  });

  const installmentIdBasicOne = InstallmentId.create();
  let expenses: Expense[];
  const installmentIdBasicTwo = InstallmentId.create();

  describe('execute', () => {
    basicUser = User.create(
      {
        name: 'Admin User',
        email: 'basic@example.com',
        role: 'BASIC',
      },
      validHashedPassword,
    );

    expenses = [
      makeExpenseInput({
        userId: adminUser.id,
        installmentId: installmentIdAdmin,
      }),
      makeExpenseInput({
        userId: basicUser.id,
        installmentId: installmentIdBasicOne,
      }),
      makeExpenseInput({
        userId: basicUser.id,
        installmentId: installmentIdBasicTwo,
      }),
    ];

    describe('authorization', () => {
      it('should allow user list own expenses', async () => {
        const data: ListExpensesInputDTO = {
          userId: basicUser.id.toString(),
        };

        const result: ListExpenseOutputDTO =
          await listExpenseUseCase.execute(data);

        expect(result.data.length).toBe(2);
      });
    });
  });
});
