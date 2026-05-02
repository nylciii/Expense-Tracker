import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const LOCAL_EXPENSES_KEY = 'expenses_local_data';
const createLocalId = () =>
  window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function ExpenseUi({
  expenses,
  form,
  loading,
  handleChange,
  handleSubmit,
  handleDelete,
  currentMoney,
  handleCurrentMoneyChange,
  userLabel,
  onLogout,
}) {
  const totalIncome = expenses
    .filter((exp) => exp.type === 'income')
    .reduce((sum, exp) => sum + Number(exp.amount), 0);
  const totalSpent = expenses
    .filter((exp) => exp.type !== 'income')
    .reduce((sum, exp) => sum + Number(exp.amount), 0);
  const remaining = Number(currentMoney || 0) + totalIncome - totalSpent;

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-inner">
          <div>
            <h1 className="title">
              <span className="icon">◎</span>
              FinPlanner
            </h1>
            <p className="subtitle">{userLabel}</p>
          </div>
          {onLogout ? (
            <button onClick={onLogout} className="btn btn-ghost">
              Log Out
            </button>
          ) : null}
        </div>
      </div>

      <div className="summary-grid">
        <div className="card total-card">
          <div className="total-label">Remaining Balance</div>
          <div className="total-amount">₱{remaining.toLocaleString()}</div>
          <div className="total-subtitle">{expenses.length} transactions</div>
        </div>

        <div className="card metrics-card">
          <div className="metric-row">
            <span className="metric-label">Spent</span>
            <span className="metric-value metric-expense">₱{totalSpent.toLocaleString()}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Income</span>
            <span className="metric-value metric-income">₱{totalIncome.toLocaleString()}</span>
          </div>
          <div className="metric-row metric-row-last">
            <span className="metric-label">Available Money</span>
            <span className="metric-value">₱{Number(currentMoney || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <div className="card form-card">
          <h2 className="card-title">Money Overview</h2>
          <div className="form-group">
            <label htmlFor="currentMoney">Current/Available Money (₱)</label>
            <input
              id="currentMoney"
              name="currentMoney"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={currentMoney}
              onChange={handleCurrentMoneyChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="card form-card">
          <h2 className="card-title">Add Transaction</h2>
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                name="description"
                placeholder="e.g., Groceries, Transportation"
                value={form.description}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount (₱)</label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="form-input"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <button type="submit" className="btn btn-submit">
              <span className="btn-icon">+</span>
              Add Transaction
            </button>
          </form>
        </div>
      </div>

      <div className="card expenses-card">
        <h2 className="card-title">Recent Transactions</h2>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p>No expenses yet. Add your first expense above!</p>
          </div>
        ) : (
          <ul className="expense-list">
            {expenses.map((exp) => (
              <li key={exp.id} className="expense-item">
                <div className="expense-details">
                  <span className={`expense-icon ${exp.type === 'income' ? 'expense-icon-income' : 'expense-icon-expense'}`}>
                    {exp.type === 'income' ? '↗' : '↘'}
                  </span>
                  <div className="expense-info">
                    <div className="expense-title">{exp.description}</div>
                    <div className="expense-date">
                      {new Date(exp.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
                <div className="expense-actions">
                  <span className={`type-pill ${exp.type === 'income' ? 'type-pill-income' : 'type-pill-expense'}`}>
                    {exp.type}
                  </span>
                  <div className={`expense-amount ${exp.type === 'income' ? 'expense-amount-income' : 'expense-amount-expense'}`}>
                    ₱{Number(exp.amount).toLocaleString()}
                  </div>
                  <button onClick={() => handleDelete(exp.id)} className="btn btn-danger">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function AppWithoutAuth() {
  const [expenses, setExpenses] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_EXPENSES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState({ description: '', amount: '', type: 'expense' });
  const [loading] = useState(false);
  const [currentMoney, setCurrentMoney] = useState(() => localStorage.getItem('currentMoney') || '');

  useEffect(() => {
    localStorage.setItem('currentMoney', currentMoney);
  }, [currentMoney]);

  useEffect(() => {
    localStorage.setItem(LOCAL_EXPENSES_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCurrentMoneyChange = (e) => {
    setCurrentMoney(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    const localTransaction = {
      id: createLocalId(),
      description: form.description,
      amount: Number(form.amount),
      category: 'other',
      type: form.type,
      date: null,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [localTransaction, ...prev]);
    setForm({ description: '', amount: '', type: 'expense' });
  };

  const handleDelete = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ExpenseUi
      expenses={expenses}
      form={form}
      loading={loading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      currentMoney={currentMoney}
      handleCurrentMoneyChange={handleCurrentMoneyChange}
      userLabel="Local mode (Auth disabled)"
      onLogout={null}
    />
  );
}

function AppWithAuth() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, getAccessTokenSilently, user } = useAuth0();
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ description: '', amount: '', type: 'expense' });
  const [loading, setLoading] = useState(false);
  const [currentMoney, setCurrentMoney] = useState(() => localStorage.getItem('currentMoney') || '');

  useEffect(() => {
    localStorage.setItem('currentMoney', currentMoney);
  }, [currentMoney]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    }
  }, [isAuthenticated]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_BASE_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCurrentMoneyChange = (e) => {
    setCurrentMoney(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: form.description,
          amount: Number(form.amount),
          type: form.type,
        }),
      });

      if (res.ok) {
        setForm({ description: '', amount: '', type: 'expense' });
        fetchExpenses();
      } else {
        const errorData = await res.text();
        alert(`Failed to add expense: ${errorData}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchExpenses();
      } else {
        const errorData = await res.text();
        alert(`Failed to delete expense: ${errorData}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <div className="header">
          <h1 className="title">
            <span className="icon">💰</span>
            Expense Tracker
          </h1>
          <p className="subtitle">Track your daily expenses easily</p>
        </div>
        <div className="card">
          <h2 className="card-title">Welcome!</h2>
          <p style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>
            Please log in to access your expenses
          </p>
          <button onClick={() => loginWithRedirect()} className="btn-submit">
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExpenseUi
      expenses={expenses}
      form={form}
      loading={loading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      currentMoney={currentMoney}
      handleCurrentMoneyChange={handleCurrentMoneyChange}
      userLabel={`Welcome, ${user?.name || user?.email}!`}
      onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    />
  );
}

function App({ authDisabled = false }) {
  return authDisabled ? <AppWithoutAuth /> : <AppWithAuth />;
}

export default App;
