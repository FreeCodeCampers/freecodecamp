import { render, screen } from '@testing-library/react';
import { startOfDay } from 'date-fns';
import React from 'react';
import Stats, {
  calculateStreaks,
  generateCalendarData,
  generatePages
} from './stats';

const props: { calendar: { [key: number]: number }; points: number } = {
  calendar: {},
  points: 0
};

describe('<Stats/>', () => {
  it('calculates the correct longest streak', () => {
    render(<Stats {...props} />);
    expect(screen.getByTestId('longest-streak')).toHaveTextContent(
      'profile.longest-streak'
    );
  });

  it('calculates the correct current streak', () => {
    render(<Stats {...props} />);
    expect(screen.getByTestId('current-streak')).toHaveTextContent(
      'profile.current-streak'
    );
  });
});

const calendar1 = {
  '1736496000': 1, // 2025-01-10 08:00:00 UTC
  '1736582400': 1, // 2025-01-11 08:00:00 UTC
  '1736668800': 1, // 2025-01-12 08:00:00 UTC
  '1736755200': 1, // 2025-01-13 08:00:00 UTC
  '1736841600': 1 // 2025-01-14 08:00:00 UTC
};

const calendar2 = {
  '1736699400': 1, // 2025-01-12 16:30:00 UTC
  '1736763300': 1, // 2025-01-13 10:15:00 UTC
  '1736865900': 1 // 2025-01-14 14:45:00 UTC
};

const calendar3 = {
  '1736503200': 1, // 2025-01-10 10:00:00 UTC
  '1736604000': 1, // 2025-01-11 14:00:00 UTC
  '1736697600': 1, // 2025-01-12 16:00:00 UTC
  // Skipping Jan 13, 2025
  '1736845200': 1, // 2025-01-14 09:00:00 UTC
  '1736946000': 1 // 2025-01-15 13:00:00 UTC
};

describe('Should Calculate Streaks correctly', () => {
  const handleTimeStamps = (calendar: Record<string, number>) => {
    return Object.keys(calendar).map(
      stamp => Number.parseInt(stamp, 10) * 1000
    );
  };

  test('Should return a longest streak of 5 days when the user has not completed a challenge in a while', () => {
    const timeStamps = handleTimeStamps(calendar1);
    const startOfTimestamps = startOfDay(new Date(timeStamps[0]));
    const endOfCalendar = startOfDay(Date.now());

    const pages = generatePages(startOfTimestamps, endOfCalendar);

    const newCalendarData = generateCalendarData(pages);

    const { longestStreak, currentStreak } = calculateStreaks(
      newCalendarData,
      timeStamps
    );

    expect(longestStreak).toBe(5);
    expect(currentStreak).toBe(0);
  });

  test('Should return a longest streak of 3 days when the current streak is 3 days', () => {
    const timeStamps = handleTimeStamps(calendar2);
    const startOfTimestamps = startOfDay(new Date(timeStamps[0]));
    const endOfCalendar = startOfDay(new Date(2025, 0, 14));

    const pages = generatePages(startOfTimestamps, endOfCalendar);

    const newCalendarData = generateCalendarData(pages);

    const { longestStreak, currentStreak } = calculateStreaks(
      newCalendarData,
      timeStamps
    );

    expect(longestStreak).toBe(3);
    expect(currentStreak).toBe(3);
  });

  test('Should return a longenst/current streak of 1 day when the user has recently completed their first challenge', () => {
    const timeStamps = handleTimeStamps({
      '1736496000': 1 // 2025-01-10 08:00:00 UTC
    });
    const startOfTimestamps = startOfDay(new Date(timeStamps[0]));
    const endOfCalendar = startOfDay(new Date(2025, 0, 10));

    const pages = generatePages(startOfTimestamps, endOfCalendar);

    const newCalendarData = generateCalendarData(pages);

    const { longestStreak, currentStreak } = calculateStreaks(
      newCalendarData,
      timeStamps
    );

    expect(longestStreak).toBe(1);
    expect(currentStreak).toBe(1);
  });

  test('Should return a current streak of 2 days with a longest streak of 3 days when the longest streak is longer than the current one', () => {
    const timeStamps = handleTimeStamps(calendar3);
    const startOfTimestamps = startOfDay(new Date(timeStamps[0]));
    const endOfCalendar = startOfDay(new Date(2025, 0, 15));

    const pages = generatePages(startOfTimestamps, endOfCalendar);

    const newCalendarData = generateCalendarData(pages);

    const { longestStreak, currentStreak } = calculateStreaks(
      newCalendarData,
      timeStamps
    );

    expect(longestStreak).toBe(3);
    expect(currentStreak).toBe(2);
  });

  test('Should return a streak of 0 days if no challenges have been completed', () => {
    const timeStamps = handleTimeStamps({});
    const startOfTimestamps = startOfDay(new Date(timeStamps[0]));
    const endOfCalendar = startOfDay(Date.now());

    const pages = generatePages(startOfTimestamps, endOfCalendar);

    const newCalendarData = generateCalendarData(pages);

    const { longestStreak, currentStreak } = calculateStreaks(
      newCalendarData,
      timeStamps
    );

    expect(longestStreak).toBe(0);
    expect(currentStreak).toBe(0);
  });
});
