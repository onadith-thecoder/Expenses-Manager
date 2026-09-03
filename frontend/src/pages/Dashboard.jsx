import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import ThemeToggle from '../components/ThemeToggle';

const TYPE_STYLES = {
  education: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  travel: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  food: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  utility: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  other: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchExpenses = () => {
    setLoading(true);
    apiClient.get('/expenses')
      .then((response) => setExpenses(response.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSave = async (formData) => {
    if (editingExpense) {
      await apiClient.put(`/expenses/${editingExpense.id}`, formData);
    } else {
      await apiClient.post('/expenses', formData);
    }
    setEditingExpense(null);
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await apiClient.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (err) {}
    logout();
    navigate('/login');
  };

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.cost), 0);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Expense Manager</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors">
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
          <ExpenseForm
            initialExpense={editingExpense}
            onSave={handleSave}
            onCancel={() => setEditingExpense(null)}
          />
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
          </h2>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Total: {total.toFixed(2)}
          </p>
        </div>

        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">No expenses yet — add your first one above.</p>
        ) : (
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <li key={expense.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_STYLES[expense.expense_type] || TYPE_STYLES.other}`}>
                      {expense.expense_type}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{expense.date}</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 truncate">{expense.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{Number(expense.cost).toFixed(2)}</span>
                  <button onClick={() => setEditingExpense(expense)} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(expense.id)} className="text-sm text-red-500 dark:text-red-400 hover:underline">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default Dashboard;