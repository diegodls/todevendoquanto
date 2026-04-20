import { ExpenseDescription } from '@/core/entities/expense/value-objects/expense-description';
import { InvalidDescriptionError } from '@/core/shared/errors/domain/description-errors';
import { describe, expect, it } from 'vitest';

describe('Description Value Object', () => {
  it('should create a valid description with normal text', () => {
    const description = ExpenseDescription.create(
      'This is a valid description',
    );
    expect(description.value).toBe('This is a valid description');
  });

  it('should automatically trim whitespace from ends', () => {
    const description = ExpenseDescription.create('  Trimmed content  ');
    expect(description.value).toBe('Trimmed content');
    expect(description.value.startsWith(' ')).toBe(false);
    expect(description.value.endsWith(' ')).toBe(false);
  });

  it('should throw error if description is empty', () => {
    expect(() => ExpenseDescription.create('')).toThrow(
      InvalidDescriptionError,
    );
    expect(() => ExpenseDescription.create('')).toThrow('cannot be empty');
  });

  it('should throw error if description is only whitespace', () => {
    expect(() => ExpenseDescription.create('   ')).toThrow(
      InvalidDescriptionError,
    );
    expect(() => ExpenseDescription.create('\n\t')).toThrow(
      InvalidDescriptionError,
    );
  });

  it('should accept description with exactly minimum length', () => {
    const description = ExpenseDescription.create('One');
    expect(description.value).toBe('One');
  });

  it('should throw error if description is too long (more than 500 chars)', () => {
    const longString = 'a'.repeat(501);
    expect(() => ExpenseDescription.create(longString)).toThrow(
      InvalidDescriptionError,
    );
    expect(() => ExpenseDescription.create(longString)).toThrow(
      'cannot exceed 500',
    );
  });

  it('should accept description with exactly maximum length', () => {
    const maxString = 'a'.repeat(500);
    const description = ExpenseDescription.create(maxString);
    expect(description.value.length).toBe(500);
  });

  it('should throw error if description contains HTML tags', () => {
    expect(() =>
      ExpenseDescription.create('Safe text <script>alert(1)</script>'),
    ).toThrow(InvalidDescriptionError);
    expect(() => ExpenseDescription.create('Div <div>content</div>')).toThrow(
      InvalidDescriptionError,
    );
  });

  it('should allow special characters but not HTML tags', () => {
    const description = ExpenseDescription.create(
      'Cost is $100 & taxes are 10% <--- not a tag',
    );

    const safeDesc = ExpenseDescription.create('Cost is $100 & taxes are 10%');
    expect(safeDesc.value).toBe('Cost is $100 & taxes are 10%');
  });

  it('should be immutable (value cannot be changed after creation)', () => {
    const description = ExpenseDescription.create('Initial Value');

    expect(() => {
      // @ts-ignore - for tests
      description._value = 'Hacked';
    }).toThrow();

    expect(description.value).toBe('Initial Value');
  });

  it('should check equality correctly', () => {
    const description1 = ExpenseDescription.create('Same Text');
    const description2 = ExpenseDescription.create('Same Text');
    const description3 = ExpenseDescription.create('Different Text');

    expect(description1.equals(description2)).toBe(true);
    expect(description1.equals(description3)).toBe(false);
    // @ts-ignore - for tests
    expect(description1.equals(null)).toBe(false);
  });

  it('should create a new instance for updates (immutable pattern)', () => {
    const description1 = ExpenseDescription.create('First Value');
    const description2 = ExpenseDescription.create('Second Value');
    expect(description1).not.toBe(description2);
    expect(description1.value).not.toBe(description2.value);
  });
});
