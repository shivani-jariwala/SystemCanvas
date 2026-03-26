/**
 * Smoke test for the App layout.
 *
 * Verifies that the three-panel shell (Sidebar, Canvas, Inspector)
 * mounts without crashing and that essential landmarks are present.
 */
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App layout', () => {
  it('renders all three panels without crashing', () => {
    render(<App />);

    expect(screen.getByLabelText('Component palette')).toBeInTheDocument();
    expect(screen.getByLabelText('Architecture canvas')).toBeInTheDocument();
    expect(screen.getByLabelText('Node inspector')).toBeInTheDocument();
  });

  it('shows the app title in the sidebar', () => {
    render(<App />);

    expect(screen.getByText('SystemCanvas')).toBeInTheDocument();
  });

  it('displays all six component types in the palette', () => {
    render(<App />);

    const expectedLabels = [
      'API Gateway',
      'Load Balancer',
      'Microservice',
      'Message Queue',
      'Database',
      'Cache',
    ];

    for (const label of expectedLabels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
