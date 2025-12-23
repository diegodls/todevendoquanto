const today = new Date();

export const monthsAhead = (quantity: number): Date => {
  return new Date(today.setMonth(today.getMonth() + quantity));
};
