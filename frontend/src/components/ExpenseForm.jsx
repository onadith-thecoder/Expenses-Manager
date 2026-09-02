import { useState, useEffect } from 'react';

const EXPENSE_TYPES = ['education', 'travel', 'food', 'utility', 'other'];

function ExpenseForm({ initialExpense, onSave, onCancel }) {
  const [date, setDate] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const [expenseType, setExpenseType] = useState('education');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialExpense) {
      setDate(initialExpense.date);
      setCost(initialExpense.cost);
      setDescription(initialExpense.description);
      setExpenseType(initialExpense.expense_type);
    } else {
      setDate('');
      setCost('');
      setDescription('');
      setExpenseType('education');
    }
  }, [initialExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await onSave({ date, cost: parseFloat(cost), description, expense_type: expenseType });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{initialExpense ? 'Edit Expense' : 'Add Expense'}</h3>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="number" step="0.01" min="0" placeholder="Cost" value={cost} onChange={(e) => setCost(e.target.value)} required />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <select value={expenseType} onChange={(e) => setExpenseType(e.target.value)}>
        {EXPENSE_TYPES.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      <button type="submit">{initialExpense ? 'Save Changes' : 'Add Expense'}</button>
      {initialExpense && <button type="button" onClick={onCancel}>Cancel</button>}
      {error && <p>{error}</p>}
    </form>
  );
}

export default ExpenseForm;