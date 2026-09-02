import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

useEffect(() => {
    apiClient.get('/expenses')
      .then((response) => setExpenses(response.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.date} — {expense.description} — {expense.cost} — {expense.expense_type}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;