import { render, screen } from '@testing-library/react';
import ResultsGrid from '../../components/ResultsGrid';

describe('ResultsGrid', () => {
  it('renders empty state with count 0', () => {
    render(<ResultsGrid results={[]} loading={false} error={null} />);
    expect(screen.getByTestId('results-count')).toHaveTextContent('0');
    expect(screen.getByTestId('results-empty')).toBeInTheDocument();
  });

  it('renders rows when results provided', () => {
    render(<ResultsGrid results={[{ applicant: 'A', status: 'APPROVED' }]} loading={false} error={null} />);
    expect(screen.getByTestId('results-count')).toHaveTextContent('1');
    expect(screen.queryByTestId('results-empty')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('results-row').length).toBeGreaterThan(0);
  });
});

