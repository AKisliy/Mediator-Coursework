import { render, screen } from '@testing-library/react';

import MainPage from '@/app/(webapp)/page';

describe('Main Page', () => {
  describe('Rendering', () => {
    it('should have main title', () => {
      render(<MainPage />);
      const title = screen.getByRole('heading');
      expect(title).toBeInTheDocument();
    });
  });
});
