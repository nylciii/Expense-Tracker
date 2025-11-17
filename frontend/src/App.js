import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, getAccessTokenSilently, user } = useAuth0();
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ description: '', amount: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    }
  }, [isAuthenticated]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch('http://localhost:3000/expenses', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch('http://localhost:3000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: form.description, amount: Number(form.amount) })
      });
      
      if (res.ok) {
        setForm({ description: '', amount: '' });
        fetchExpenses();
      } else {
        const errorData = await res.text();
        alert(`Failed to add expense: ${errorData}`);
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

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="app-container">
      <div className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '600px' }}>
          <div>
            <h1 className="title">
              <span className="icon">💰</span>
              Expense Tracker
            </h1>
            <p className="subtitle">Welcome, {user?.name || user?.email}!</p>
          </div>
          <button 
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} 
            className="btn-logout"
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="card total-card">
        <div className="total-label">Total Balance</div>
        <div className="total-amount">₱{total.toLocaleString()}</div>
        <div className="total-subtitle">{expenses.length} transactions</div>
      </div>

      <div className="card form-card">
        <h2 className="card-title">Add New Expense</h2>
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
          <button type="submit" className="btn-submit">
            <span className="btn-icon">+</span>
            Add Expense
          </button>
        </form>
      </div>

      <div className="card expenses-card">
        <h2 className="card-title">Recent Expenses</h2>
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
                  <span className="expense-icon">🛒</span>
                  <div className="expense-info">
                    <div className="expense-title">{exp.description}</div>
                    <div className="expense-date">
                      {new Date(exp.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <div className="expense-amount">₱{exp.amount.toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
