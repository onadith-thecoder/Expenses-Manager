import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExpenseForm from './ExpenseForm';

describe('ExpenseForm', () => {
  it('renders empty fields and "Add Expense" button in create mode', () => {
    render(<ExpenseForm initialExpense={null} onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('pre-fills fields and shows "Save Changes" when editing', () => {
    const existingExpense = {
      id: 1,
      date: '2026-08-20',
      cost: '1500.00',
      description: 'Bus ticket to Colombo',
      expense_type: 'travel',
    };

    render(<ExpenseForm initialExpense={existingExpense} onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByDisplayValue('Bus ticket to Colombo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});