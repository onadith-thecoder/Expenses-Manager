import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ExpenseForm from '../components/ExpenseForm';

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
    } catch (err) {
      //continue logging out locally even if this request fails
    }
    logout();
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Your Expenses</h2>
      <button onClick={handleLogout}>Log Out</button>

      <ExpenseForm
        initialExpense={editingExpense}
        onSave={handleSave}
        onCancel={() => setEditingExpense(null)}
      />

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.date} — {expense.description} — {expense.cost} — {expense.expense_type}
            <button onClick={() => setEditingExpense(expense)}>Edit</button>
            <button onClick={() => handleDelete(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;