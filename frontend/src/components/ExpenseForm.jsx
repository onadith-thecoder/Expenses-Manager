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

  const inputClasses = "w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
        {initialExpense ? 'Edit Expense' : 'Add Expense'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClasses} required />
        </div>
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Cost</label>
          <input type="number" step="0.01" min="0" value={cost} onChange={(e) => setCost(e.target.value)} className={inputClasses} required />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClasses} required />
      </div>

      <div className="mb-4">
        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Category</label>
        <select value={expenseType} onChange={(e) => setExpenseType(e.target.value)} className={inputClasses}>
          {EXPENSE_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">
          {initialExpense ? 'Save Changes' : 'Add Expense'}
        </button>
        {initialExpense && (
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-500 dark:text-red-400">{error}</p>}
    </form>
  );
}

export default ExpenseForm;