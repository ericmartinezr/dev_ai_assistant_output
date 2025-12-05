import { format, parseISO, isToday, isTomorrow, isYesterday, differenceInMinutes } from 'date-fns';

/**
 * Formats a date to a localized string representation
 * @param date - Date object or ISO string
 * @param formatStr - Format string (default: 'PPpp')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, formatStr = 'PPpp'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Gets relative day description
 * @param date - Date object or ISO string
 * @returns 'Today', 'Tomorrow', 'Yesterday' or empty string
 */
export const getRelativeDay = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) return 'Today';
  if (isTomorrow(dateObj)) return 'Tomorrow';
  if (isYesterday(dateObj)) return 'Yesterday';
  return '';
};

/**
 * Calculates minutes between two dates
 * @param start - Start date
 * @param end - End date
 * @returns Difference in minutes
 */
export const getMinutesDifference = (start: Date | string, end: Date | string): number => {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;
  return differenceInMinutes(endDate, startDate);
};

/**
 * Checks if a date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export const isPastDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date();
};

/**
 * Converts time string (HH:mm) to Date object for today
 * @param time - Time string in HH:mm format
 * @returns Date object
 */
export const timeStringToDate = (time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * Formats time to HH:mm format
 * @param date - Date object
 * @returns Formatted time string
 */
export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};