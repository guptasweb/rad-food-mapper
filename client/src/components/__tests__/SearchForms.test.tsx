import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForms from '../../components/SearchForms';

const baseProps = {
  applicant: '',
  status: '',
  onApplicantChange: () => {},
  onStatusChange: () => {},
  street: '',
  onStreetChange: () => {},
  lat: '',
  lng: '',
  onLatChange: () => {},
  onLngChange: () => {},
  nearestLimit: '5',
  onNearestLimitChange: () => {},
  nearestStatus: 'APPROVED' as const,
  onNearestStatusChange: () => {},
  onApplicantSubmit: () => {},
  onStreetSubmit: () => {},
  onNearestSubmit: () => {},
};

describe('SearchForms', () => {
  it('renders applicant form when mode is applicant', () => {
    render(<SearchForms mode="applicant" {...baseProps} />);
    expect(screen.getByTestId('form-applicant')).toBeInTheDocument();
    expect(screen.queryByTestId('form-street')).not.toBeInTheDocument();
    expect(screen.queryByTestId('form-nearest')).not.toBeInTheDocument();
  });

  it('calls change and submit handlers for applicant form', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSubmit = vi.fn((e: any) => e.preventDefault());
    render(
      <SearchForms
        mode="applicant"
        {...baseProps}
        onApplicantChange={onChange}
        onApplicantSubmit={onSubmit}
      />
    );
    const form = screen.getByTestId('form-applicant');
    const input = within(form).getByTestId('input-applicant');
    await user.type(input, 'TACO');
    expect(onChange).toHaveBeenCalled();
    // Submit the form to ensure onSubmit is invoked
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('renders nearest form when mode is nearest', () => {
    render(<SearchForms mode="nearest" {...baseProps} />);
    expect(screen.getByTestId('form-nearest')).toBeInTheDocument();
  });
});

