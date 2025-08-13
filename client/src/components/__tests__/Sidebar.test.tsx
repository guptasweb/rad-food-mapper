import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../../components/Sidebar';

describe('Sidebar', () => {
  it('highlights selected item and calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Sidebar mode="applicant" onChange={onChange} />);
    const street = screen.getByTestId('nav-street');
    await user.click(street);
    expect(onChange).toHaveBeenCalledWith('street');
  });
});

