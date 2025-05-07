/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

import { getUserPlanWithPurchaseDate } from '@/app/actions/data/plan';
import UserPlan from '@/components/profile/user-plan';
import { formatDate } from '@/lib/utils';

jest.mock('@/app/actions/data/plan', () => ({
  getUserPlanWithPurchaseDate: jest.fn()
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn(),
  formatDate: jest.fn()
}));

jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = 'Link';
  return MockLink;
});

jest.mock('lucide-react', () => ({
  Crown: () => <svg data-testid="crown-icon" />,
  ChevronRight: () => <svg data-testid="chevron-right-icon" />
}));

describe('UserPlan', () => {
  const mockPlanName = 'Эксперт';
  const mockPurchaseDate = new Date('2023-10-01');
  const mockFormattedDate = '01.10.2023';

  beforeEach(() => {
    jest.clearAllMocks();
    (formatDate as jest.Mock).mockReturnValue(mockFormattedDate);
    process.env.HIGHEST_TIER_PLAN_ID = '3';
  });

  it('should display "Улучшить" button when user does not have the highest plan', async () => {
    (getUserPlanWithPurchaseDate as jest.Mock).mockResolvedValue({
      plan: { id: 1, name: mockPlanName },
      planPurchase: mockPurchaseDate
    });

    render(await UserPlan());

    expect(screen.getByText('Текущий тариф')).toBeInTheDocument();
    expect(screen.getByText(mockPlanName)).toBeInTheDocument();

    expect(
      screen.getByText(`Дата приобретения: ${mockFormattedDate}`)
    ).toBeInTheDocument();

    const button = screen.getByRole('link', { name: /Улучшить/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/plans');
  });

  it('should display "Тарифы" button when user has the highest plan', async () => {
    (getUserPlanWithPurchaseDate as jest.Mock).mockResolvedValue({
      plan: { id: 3, name: mockPlanName },
      planPurchase: mockPurchaseDate
    });

    render(await UserPlan());

    expect(screen.getByText('Текущий тариф')).toBeInTheDocument();
    expect(screen.getByText(mockPlanName)).toBeInTheDocument();

    expect(
      screen.getByText(`Дата приобретения: ${mockFormattedDate}`)
    ).toBeInTheDocument();

    const button = screen.getByRole('link', { name: /Тарифы/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/plans');
  });

  it('should handle case when planWithPurchaseDate is null', async () => {
    (getUserPlanWithPurchaseDate as jest.Mock).mockResolvedValue(null);

    render(await UserPlan());

    expect(screen.getByText('Текущий тариф')).toBeInTheDocument();

    const button = screen.getByRole('link', { name: /Улучшить/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/plans');

    expect(screen.queryByText(mockPlanName)).not.toBeInTheDocument();
    expect(
      screen.queryByText(`Дата приобретения: ${mockFormattedDate}`)
    ).not.toBeInTheDocument();
  });
});
