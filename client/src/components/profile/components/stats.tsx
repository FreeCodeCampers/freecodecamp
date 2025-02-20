import React, { useState, useEffect } from 'react';
import { startOfDay, addDays, addMonths, isEqual } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Spacer } from '@freecodecamp/ui';
import { FullWidthRow } from '../../helpers';

import './stats.css';

interface StatsProps {
  points: number;
  calendar: Record<string, number>;
}

interface PageData {
  startOfCalendar: Date;
  endOfCalendar: Date;
}

interface CalendarData {
  date: Date;
  count: number;
}

export const generateCalendarData = (pages: PageData[]): CalendarData[] => {
  let dayCounter = pages[0].startOfCalendar;
  const data: CalendarData[] = [];

  while (dayCounter <= pages[pages.length - 1].endOfCalendar) {
    data.push({ date: startOfDay(dayCounter), count: 0 });
    dayCounter = addDays(dayCounter, 1);
  }
  return data;
};

export const calculateStreaks = (
  calendarData: CalendarData[],
  timestamps: number[]
) => {
  let longestStreak = 0;
  let currentStreak = 0;
  let lastIndex = -1;

  timestamps.forEach(stamp => {
    const index = calendarData.findIndex(day =>
      isEqual(day.date, startOfDay(stamp))
    );

    if (index >= 0) {
      calendarData[index].count++;

      if (index !== lastIndex) {
        if (calendarData[index - 1] && calendarData[index - 1].count > 0) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }

        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      }

      lastIndex = index;
    }
  });

  if (
    calendarData.length &&
    calendarData[calendarData.length - 1].count === 0
  ) {
    currentStreak = 0;
  }

  return { longestStreak, currentStreak };
};

export const generatePages = (
  startOfTimestamps: Date,
  endOfCalendar: Date
): PageData[] => {
  let startOfCalendar;
  const pages: PageData[] = [];

  do {
    startOfCalendar = addDays(addMonths(endOfCalendar, -6), 1);
    pages.push({ startOfCalendar, endOfCalendar });
    endOfCalendar = addDays(startOfCalendar, -1);
  } while (startOfTimestamps < startOfCalendar);

  return pages.reverse();
};

function Stats({ points, calendar }: StatsProps): JSX.Element {
  const { t } = useTranslation();

  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    const timestamps = Object.keys(calendar).map(
      stamp => Number.parseInt(stamp, 10) * 1000
    );
    const startOfTimestamps = startOfDay(new Date(timestamps[0]));
    const endOfCalendar = startOfDay(Date.now());

    const pages = generatePages(startOfTimestamps, endOfCalendar);

    const newCalendarData = generateCalendarData(pages);

    const { longestStreak, currentStreak } = calculateStreaks(
      newCalendarData,
      timestamps
    );

    setLongestStreak(longestStreak);
    setCurrentStreak(currentStreak);
  }, [calendar]);

  return (
    <FullWidthRow>
      <section className='card'>
        <h2>{t('profile.stats')}</h2>
        <Spacer size='s' />
        <dl className='stats'>
          <div>
            <dt>
              <b data-testid='current-streak'>{t('profile.current-streak')}</b>
            </dt>
            <dd>{currentStreak || 0}</dd>
          </div>
          <div>
            <dt>
              <b>{t('profile.total-points')}</b>
            </dt>
            <dd>{points}</dd>
          </div>
          <div>
            <dt>
              <b data-testid='longest-streak'>{t('profile.longest-streak')}</b>
            </dt>
            <dd>{longestStreak || 0}</dd>
          </div>
        </dl>
      </section>
    </FullWidthRow>
  );
}

export default Stats;
