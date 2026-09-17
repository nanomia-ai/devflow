export function createStore() {
  const categories = new Map();
  const expenses = [];

  return {
    addCategory(id, name) {
      categories.set(id, name);
    },
    addExpense({ id, date, amountCents, categoryId, note = "" }) {
      if (!Number.isInteger(amountCents) || amountCents <= 0) throw new Error("amount must be positive cents");
      if (!categories.has(categoryId)) throw new Error("category must exist");
      expenses.push({ id, date, amountCents, categoryId, note });
    },
    deleteCategory(id) {
      if (expenses.some((expense) => expense.categoryId === id)) return false;
      return categories.delete(id);
    },
    exportRows() {
      return expenses.map(({ date, amountCents, categoryId, note }) => ({
        date,
        amount_cents: amountCents,
        category_name: categories.get(categoryId),
        note,
      }));
    },
  };
}
