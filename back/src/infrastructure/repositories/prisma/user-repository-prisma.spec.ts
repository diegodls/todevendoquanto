import { PaginationDTO } from '@/application/dtos/shared/pagination-dto';
import { User as EntityUser } from '@/core/entities/user/user';
import { Password } from '@/core/entities/user/value-objects/password';
import { Email } from '@/core/entities/user/value-objects/user-email';
import { UserId } from '@/core/entities/user/value-objects/user-id';
import { UserRole } from '@/core/entities/user/value-objects/user-role';
import { ConflictError, NotFoundError } from '@/core/shared/errors/api-errors';
import { InfrastructureError } from '@/core/shared/errors/infrastructure-errors';
import {
  ListUsersFiltersOptions,
  ListUsersOrderRequestProps,
} from '@/core/usecases/user/list-user-dto';
import { UserRepositoryPrisma } from '@/infrastructure/repositories/prisma/user-repository-prisma';
import { User as PrismaUser } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRoleMapper } from './mappers/user-role-mapper';

vi.mock('@/core/entities/user/user');
vi.mock('@/core/entities/user/value-objects/user-role');
vi.mock('@/core/entities/user/value-objects/user-id');
vi.mock('@/core/entities/user/value-objects/user-email');
vi.mock('@/core/entities/user/value-objects/password');
vi.mock('@/infrastructure/repositories/prisma/mappers/user-role-mapper');

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_HASHED_PWD =
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

const makePrismaUser = (overrides?: Partial<PrismaUser>): PrismaUser => ({
  id: VALID_UUID,
  name: 'John Doe',
  email: 'john@example.com',
  hashedPassword: VALID_HASHED_PWD,
  role: UserRoleMapper.toPersistence(UserRole.create('BASIC')),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  isActive: true,
  ...overrides,
});

const makeDomainUser = (overrides?: Partial<EntityUser>): EntityUser =>
  ({
    id: { toString: () => VALID_UUID },
    name: 'John Doe',
    email: { toString: () => 'john@example.com' },
    hashedPassword: VALID_HASHED_PWD,
    role: { toString: () => 'BASIC' },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
    ...overrides,
  }) as unknown as EntityUser;

const makeUserId = (value = VALID_UUID) => ({
  toString: () => value,
});

const makeEmail = (value = 'john@example.com') => ({
  toString: () => value,
});

const makePrismaClient = () => ({
  user: {
    create: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
});

describe('UserRepositoryPrisma', () => {
  let prisma: ReturnType<typeof makePrismaClient>;
  let sut: UserRepositoryPrisma;

  beforeEach(() => {
    vi.clearAllMocks();
    prisma = makePrismaClient();
    sut = new UserRepositoryPrisma(prisma as any);

    vi.mocked(EntityUser.reconstitute).mockReturnValue(makeDomainUser());
    vi.mocked(UserRoleMapper.toDomain).mockReturnValue('BASIC' as any);
    vi.mocked(UserRoleMapper.toPersistence).mockReturnValue('BASIC' as any);
    vi.mocked(Password.create).mockReturnValue({
      getValue: () => '123456789',
    } as any);
    vi.mocked(Password.fromHash).mockReturnValue({
      getValue: () => VALID_HASHED_PWD,
    } as any);
    vi.mocked(Email.create).mockReturnValue(makeEmail() as any);
    vi.mocked(UserId.from).mockReturnValue(makeUserId() as any);
  });

  describe('save', () => {
    describe('when user is created successfully', () => {
      it('should resolve without returning a value', async () => {
        prisma.user.create.mockResolvedValue(makePrismaUser());

        await expect(sut.save(makeDomainUser())).resolves.toBeUndefined();
      });

      it('should call prisma.create once', async () => {
        prisma.user.create.mockResolvedValue(makePrismaUser());

        await sut.save(makeDomainUser());

        expect(prisma.user.create).toHaveBeenCalledOnce();
      });

      it('should persist mapped user data', async () => {
        const user = makeDomainUser();
        prisma.user.create.mockResolvedValue(makePrismaUser());

        await sut.save(user);

        expect(prisma.user.create).toHaveBeenCalledWith({
          data: expect.objectContaining({ id: VALID_UUID }),
        });
      });
    });

    describe('when database throws', () => {
      it('should propagate the exception', async () => {
        prisma.user.create.mockRejectedValue(
          new ConflictError('Unique constraint failed'),
        );

        await expect(sut.save(makeDomainUser())).rejects.toThrow(
          'Unique constraint failed',
        );
      });
    });
  });

  describe('deleteById', () => {
    describe('when user is deleted successfully', () => {
      it('should resolve without returning a value', async () => {
        prisma.user.delete.mockResolvedValue(makePrismaUser());

        await expect(
          sut.deleteById(makeUserId() as any),
        ).resolves.toBeUndefined();
      });

      it('should call delete with correct id', async () => {
        prisma.user.delete.mockResolvedValue(makePrismaUser());

        await sut.deleteById(makeUserId() as any);

        expect(prisma.user.delete).toHaveBeenCalledWith({
          where: { id: VALID_UUID },
        });
      });
    });

    describe('when user does not exist', () => {
      it('should propagate prisma not found exception', async () => {
        prisma.user.delete.mockRejectedValue(
          new NotFoundError('Record not found'),
        );

        await expect(sut.deleteById(makeUserId() as any)).rejects.toThrow(
          'Record not found',
        );
      });
    });
  });

  describe('exists', () => {
    describe('when user exists', () => {
      it('should return true when count is greater than zero', async () => {
        prisma.user.count.mockResolvedValue(1);

        const result = await sut.exists(makeEmail() as any);

        expect(result).toBe(true);
      });
    });

    describe('when user does not exist', () => {
      it('should return false when count is zero', async () => {
        prisma.user.count.mockResolvedValue(0);

        const result = await sut.exists(makeEmail() as any);

        expect(result).toBe(false);
      });
    });

    describe('when querying', () => {
      it('should query by email string value', async () => {
        prisma.user.count.mockResolvedValue(0);

        await sut.exists(makeEmail() as any);

        expect(prisma.user.count).toHaveBeenCalledWith({
          where: { email: 'john@example.com' },
        });
      });
    });

    describe('when database throws', () => {
      it('should propagate the exception', async () => {
        prisma.user.count.mockRejectedValue(
          new InfrastructureError('DB unavailable'),
        );

        await expect(sut.exists(makeEmail() as any)).rejects.toThrow(
          'DB unavailable',
        );
      });
    });
  });

  describe('findById', () => {
    describe('when user is found', () => {
      it('should return mapped domain user', async () => {
        const prismaUser = makePrismaUser();

        const domainUser = makeDomainUser();

        prisma.user.findUnique.mockResolvedValue(prismaUser);

        vi.mocked(EntityUser.reconstitute).mockReturnValue(domainUser);

        const result = await sut.findById(makeUserId() as any);

        expect(result).toStrictEqual(domainUser);
      });

      it('should query with findUnique by id', async () => {
        prisma.user.findUnique.mockResolvedValue(makePrismaUser());

        await sut.findById(makeUserId() as any);

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
          where: { id: VALID_UUID },
        });
      });
    });

    describe('when user is not found', () => {
      it('should return null', async () => {
        prisma.user.findUnique.mockResolvedValue(null);

        const result = await sut.findById(makeUserId() as any);

        expect(result).toBeNull();
      });

      it('should not call reconstitute when user is not found', async () => {
        prisma.user.findUnique.mockResolvedValue(null);

        await sut.findById(makeUserId() as any);

        expect(EntityUser.reconstitute).not.toHaveBeenCalled();
      });
    });

    describe('when database throws', () => {
      it('should propagate the exception', async () => {
        prisma.user.findUnique.mockRejectedValue(
          new InfrastructureError('DB unavailable'),
        );

        await expect(sut.findById(makeUserId() as any)).rejects.toThrow(
          'DB unavailable',
        );
      });
    });
  });

  describe('findByEmail', () => {
    describe('when user is found', () => {
      it('should return mapped domain user', async () => {
        const domainUser = makeDomainUser();
        prisma.user.findFirst.mockResolvedValue(makePrismaUser());
        vi.mocked(EntityUser.reconstitute).mockReturnValue(domainUser);

        const result = await sut.findByEmail(makeEmail() as any);

        expect(result).toStrictEqual(domainUser);
      });

      it('should query by email string value', async () => {
        prisma.user.findFirst.mockResolvedValue(makePrismaUser());

        await sut.findByEmail(makeEmail() as any);

        expect(prisma.user.findFirst).toHaveBeenCalledWith({
          where: { email: 'john@example.com' },
        });
      });
    });

    describe('when user is not found', () => {
      it('should return null', async () => {
        prisma.user.findFirst.mockResolvedValue(null);

        const result = await sut.findByEmail(makeEmail() as any);

        expect(result).toBeNull();
      });
    });

    describe('when database throws', () => {
      it('should propagate the exception', async () => {
        prisma.user.findFirst.mockRejectedValue(
          new InfrastructureError('DB unavailable'),
        );

        await expect(sut.findByEmail(makeEmail() as any)).rejects.toThrow(
          'DB unavailable',
        );
      });
    });
  });

  describe('findByName', () => {
    describe('when user is found', () => {
      it('should return mapped domain user', async () => {
        const domainUser = makeDomainUser();
        prisma.user.findFirst.mockResolvedValue(makePrismaUser());
        vi.mocked(EntityUser.reconstitute).mockReturnValue(domainUser);

        const result = await sut.findByName('John Doe');

        expect(result).toStrictEqual(domainUser);
      });

      it('should query by name', async () => {
        prisma.user.findFirst.mockResolvedValue(makePrismaUser());

        await sut.findByName('John Doe');

        expect(prisma.user.findFirst).toHaveBeenCalledWith({
          where: { name: 'John Doe' },
        });
      });
    });

    describe('when user is not found', () => {
      it('should return null', async () => {
        prisma.user.findFirst.mockResolvedValue(null);

        const result = await sut.findByName('Unknown');

        expect(result).toBeNull();
      });
    });

    describe('when database throws', () => {
      it('should propagate the exception', async () => {
        prisma.user.findFirst.mockRejectedValue(
          new InfrastructureError('DB unavailable'),
        );

        await expect(sut.findByName('John Doe')).rejects.toThrow(
          'DB unavailable',
        );
      });
    });
  });

  describe('list', () => {
    const makeListArgs = () => ({
      filters: {} as ListUsersFiltersOptions,
      order: {
        orderBy: 'createdAt',
        order: 'desc',
      } as ListUsersOrderRequestProps,
      pagination: { page: 1, pageSize: 10 } as PaginationDTO,
    });

    describe('when users are found', () => {
      it('should return paginated result with mapped domain users', async () => {
        const prismaUsers = [makePrismaUser(), makePrismaUser()];
        const domainUser = makeDomainUser();
        prisma.user.count.mockResolvedValue(2);
        prisma.user.findMany.mockResolvedValue(prismaUsers);
        vi.mocked(EntityUser.reconstitute).mockReturnValue(domainUser);

        const { filters, order, pagination } = makeListArgs();
        const result = await sut.list(filters, order, pagination);

        expect(result.data).toHaveLength(2);
        expect(result.total).toBe(2);
      });

      it('should call count and findMany concurrently', async () => {
        prisma.user.count.mockResolvedValue(0);
        prisma.user.findMany.mockResolvedValue([]);

        const { filters, order, pagination } = makeListArgs();
        await sut.list(filters, order, pagination);

        expect(prisma.user.count).toHaveBeenCalledOnce();
        expect(prisma.user.findMany).toHaveBeenCalledOnce();
      });

      it('should apply correct skip and take from pagination', async () => {
        prisma.user.count.mockResolvedValue(0);
        prisma.user.findMany.mockResolvedValue([]);

        await sut.list(
          {} as any,
          { orderBy: 'createdAt', order: 'desc' } as any,
          { page: 3, pageSize: 10 } as any,
        );

        expect(prisma.user.findMany).toHaveBeenCalledWith(
          expect.objectContaining({ skip: 20, take: 10 }),
        );
      });

      it('should apply correct orderBy from order props', async () => {
        prisma.user.count.mockResolvedValue(0);
        prisma.user.findMany.mockResolvedValue([]);

        await sut.list(
          {} as any,
          { orderBy: 'name', order: 'asc' } as any,
          { page: 1, pageSize: 10 } as any,
        );

        expect(prisma.user.findMany).toHaveBeenCalledWith(
          expect.objectContaining({ orderBy: { name: 'asc' } }),
        );
      });
    });

    describe('when no users are found', () => {
      it('should return empty data array and total zero', async () => {
        prisma.user.count.mockResolvedValue(0);
        prisma.user.findMany.mockResolvedValue([]);

        const { filters, order, pagination } = makeListArgs();
        const result = await sut.list(filters, order, pagination);

        expect(result.data).toHaveLength(0);
        expect(result.total).toBe(0);
      });
    });

    describe('when database throws', () => {
      it('should propagate the exception', async () => {
        prisma.user.count.mockRejectedValue(
          new InfrastructureError('DB unavailable'),
        );

        const { filters, order, pagination } = makeListArgs();
        await expect(sut.list(filters, order, pagination)).rejects.toThrow(
          'DB unavailable',
        );
      });
    });
  });

  describe('update', () => {
    describe('when user is updated successfully', () => {
      it('should return the updated mapped domain user', async () => {
        const domainUser = makeDomainUser();
        prisma.user.update.mockResolvedValue(makePrismaUser());
        vi.mocked(EntityUser.reconstitute).mockReturnValue(domainUser);

        const result = await sut.update(makeDomainUser());

        expect(result).toStrictEqual(domainUser);
      });

      it('should update by correct id', async () => {
        prisma.user.update.mockResolvedValue(makePrismaUser());

        await sut.update(makeDomainUser());

        expect(prisma.user.update).toHaveBeenCalledWith(
          expect.objectContaining({ where: { id: VALID_UUID } }),
        );
      });
    });

    describe('when user does not exist', () => {
      it('should propagate prisma not found exception', async () => {
        prisma.user.update.mockRejectedValue(
          new NotFoundError('Record not found'),
        );

        await expect(sut.update(makeDomainUser())).rejects.toThrow(
          'Record not found',
        );
      });
    });

    describe('when database throws', () => {
      it('should propagate the exception', async () => {
        prisma.user.update.mockRejectedValue(
          new InfrastructureError('DB unavailable'),
        );

        await expect(sut.update(makeDomainUser())).rejects.toThrow(
          'DB unavailable',
        );
      });
    });
  });
});
