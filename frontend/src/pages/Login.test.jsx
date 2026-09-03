import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Login from './Login';
import apiClient from '../api/client';

vi.mock('../api/client', () => ({
  default: { post: vi.fn() },
}));

describe('Login', () => {
  it('renders email, password fields and a submit button', () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows an error message when login fails', async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { message: 'The provided credentials are incorrect.' } },
    });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/provided credentials are incorrect/i)).toBeInTheDocument();
    });
  });
});