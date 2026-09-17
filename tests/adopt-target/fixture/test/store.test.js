import assert from "node:assert/strict";
import test from "node:test";
import { createStore } from "../src/store.js";

test("referenced categories cannot be deleted", () => {
  const store = createStore();
  store.addCategory("food", "Food");
  store.addExpense({ id: "e1", date: "2026-09-17", amountCents: 1250, categoryId: "food" });
  assert.equal(store.deleteCategory("food"), false);
});

test("CSV-shaped rows exclude storage identifiers", () => {
  const store = createStore();
  store.addCategory("food", "Food");
  store.addExpense({ id: "e1", date: "2026-09-17", amountCents: 1250, categoryId: "food", note: "Rice" });
  assert.deepEqual(store.exportRows(), [{
    date: "2026-09-17",
    amount_cents: 1250,
    category_name: "Food",
    note: "Rice",
  }]);
});
