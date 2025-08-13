import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App integration (frontend unit tests)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders header and initial results count', () => {
    render(<App />);
    expect(screen.getByText(/SF Food Mapper/i)).toBeInTheDocument();
    expect(screen.getByTestId('results-count')).toHaveTextContent('0');
  });

  it('submits applicant search and updates results count on success', async () => {
    const user = userEvent.setup();
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ applicant: 'TACO TRUCK' }],
    } as any);

    render(<App />);
    const input = screen.getByLabelText(/Applicant name/i);
    await user.type(input, 'TACO');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => expect(screen.getByTestId('results-count')).toHaveTextContent('1'));
  });

  it('shows an error alert when API fails', async () => {
    const user = userEvent.setup();
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false, status: 500 } as any);

    render(<App />);
    const input = screen.getByLabelText(/Applicant name/i);
    await user.type(input, 'ANY');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByRole('alert')).toHaveTextContent('HTTP 500');
  });
});

