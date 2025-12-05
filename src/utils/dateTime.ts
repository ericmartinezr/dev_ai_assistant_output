// Utility functions for date and time operations

export type DaysOfWeek = {
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
};

export type RepeatType = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Formats a date object to a time string (HH:MM)
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

/**
 * Formats a date object to a date string (YYYY-MM-DD) in local timezone
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Combines date and time into a single Date object
 */
export const combineDateTime = (date: Date, time: Date): Date => {
  const combined = new Date(date);
  combined.setHours(time.getHours());
  combined.setMinutes(time.getMinutes());
  combined.setSeconds(0);
  combined.setMilliseconds(0);
  return combined;
};

/**
 * Checks if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Gets the next occurrence of a repeating alarm
 */
export const getNextOccurrence = (
  baseDate: Date,
  repeatType: RepeatType,
  daysOfWeek?: DaysOfWeek
): Date => {
  const nextDate = new Date(baseDate);
  const now = new Date();

  switch (repeatType) {
    case 'daily':
      // If the time has passed today, schedule for tomorrow
      if (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 1);
        // If still in the past, calculate how many days to skip
        if (nextDate < now) {
          const diffDays = Math.ceil((now.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
          nextDate.setDate(nextDate.getDate() + diffDays);
        }
      }
      break;

    case 'weekly':
      // If the time has passed this week, schedule for next week
      if (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 7);
        // If still in the past, calculate how many weeks to skip
        if (nextDate < now) {
          const diffWeeks = Math.ceil((now.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
          nextDate.setDate(nextDate.getDate() + diffWeeks * 7);
        }
      }
      break;

    case 'monthly':
      // If the time has passed this month, schedule for next month
      if (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 1);
        // Handle edge case for months with fewer days
        if (nextDate < now) {
          // Set to the next valid month after now
          nextDate.setMonth(now.getMonth() + 1);
          nextDate.setDate(baseDate.getDate());
          // If still in the past, adjust
          if (nextDate < now) {
            nextDate.setDate(nextDate.getDate() + 32); // Jump to next month
            nextDate.setDate(baseDate.getDate());
          }
        }
      }
      break;

    case 'yearly':
      // If the time has passed this year, schedule for next year
      if (nextDate <= now) {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        // Handle leap year edge case
        if (nextDate < now) {
          nextDate.setFullYear(now.getFullYear() + 1);
        }
      }
      break;

    case 'once':
    default:
      // For one-time alarms, if the time has passed, set to next day
      if (baseDate < now) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      break;
  }

  // For weekly alarms with specific days, find the next valid day
  if (repeatType === 'weekly' && daysOfWeek) {
    return getNextWeeklyOccurrence(nextDate, daysOfWeek);
  }

  return nextDate;
};

/**
 * Gets the next valid occurrence for weekly alarms with specific days
 */
const getNextWeeklyOccurrence = (startDate: Date, daysOfWeek: DaysOfWeek): Date => {
  const nextDate = new Date(startDate);
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  // Find all selected days
  const selectedDays: number[] = [];
  dayNames.forEach((day, index) => {
    if (daysOfWeek[day]) {
      selectedDays.push(index);
    }
  });

  if (selectedDays.length === 0) return nextDate;

  // Sort days numerically
  selectedDays.sort((a, b) => a - b);

  const currentDay = nextDate.getDay();
  
  // Find the next selected day
  let nextDayIndex = selectedDays.findIndex(day => day > currentDay);
  
  // If no future day this week, use the first day next week
  if (nextDayIndex === -1) {
    nextDayIndex = 0;
    // Move to next week and recalculate current day
    nextDate.setDate(nextDate.getDate() + (7 - currentDay + selectedDays[0]));
  } else {
    // Set to the next selected day this week
    const targetDay = selectedDays[nextDayIndex];
    const daysDiff = targetDay - currentDay;
    nextDate.setDate(nextDate.getDate() + daysDiff);
  }
  
  return nextDate;
};

/**
 * Calculates snooze time (default 5 minutes)
 */
export const getSnoozeTime = (minutes: number = 5): Date => {
  const snoozeTime = new Date();
  snoozeTime.setMinutes(snoozeTime.getMinutes() + minutes);
  return snoozeTime;
};

/**
 * Checks if a date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date < new Date();
};