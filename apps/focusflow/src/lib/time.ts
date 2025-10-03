/**
 * Utility functions for time calculations related to tasks
 */

/**
 * Calculates the Estimated Time of Arrival (ETA) for completing a task
 * @param estimateHrs Total estimated hours to complete the task
 * @param spentHrs Hours already spent on the task
 * @returns Date object representing the ETA, or null if parameters are invalid
 */
export function calculateETA(estimateHrs: number | null, spentHrs: number | null): Date | null {
  if (estimateHrs === null || spentHrs === null) {
    return null;
  }

  if (estimateHrs <= 0 || spentHrs < 0 || spentHrs > estimateHrs) {
    return null;
  }

  const remainingHrs = estimateHrs - spentHrs;
  if (remainingHrs <= 0) {
    return new Date(); // Already completed or overestimated
  }

  // Calculate ETA: now + remaining hours
  const now = new Date();
  const eta = new Date(now.getTime() + remainingHrs * 60 * 60 * 1000);
  
  return eta;
}

/**
 * Calculates the time left until a task's due date
 * @param dueAt The due date of the task
 * @returns The time left in hours, or null if due date is not set
 */
export function calculateTimeLeft(dueAt: Date | null): number | null {
  if (!dueAt) {
    return null;
  }

  const now = new Date();
  const timeLeftMs = dueAt.getTime() - now.getTime();
  
  // Convert milliseconds to hours
  const timeLeftHours = timeLeftMs / (1000 * 60 * 60);
  
  return timeLeftHours;
}

/**
 * Formats a duration in hours to a human-readable string
 * @param hours The duration in hours
 * @returns Formatted string (e.g., "2 days, 3 hours", "1 hour, 30 minutes")
 */
export function formatDuration(hours: number): string {
  if (isNaN(hours) || hours <= 0) {
    return '0 minutes';
  }

  const totalMinutes = Math.round(hours * 60);
  const days = Math.floor(totalMinutes / (24 * 60));
  const remainingHours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (remainingHours > 0) parts.push(`${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);

  if (parts.length === 0) return '0 minutes';
  return parts.join(', ');
}

/**
 * Checks if a task is overdue
 * @param dueAt The due date of the task
 * @returns True if the task is overdue, false otherwise
 */
export function isOverdue(dueAt: Date | null): boolean {
  if (!dueAt) {
    return false;
  }

  return new Date() > new Date(dueAt);
}

/**
 * Gets a human-readable relative time string (e.g., "in 2 days", "1 hour ago")
 * @param date The date to compare
 * @returns Formatted relative time string
 */
export function getRelativeTimeString(date: Date | null): string {
  if (!date) {
    return '';
  }

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  
  // Calculate absolute values for time units
  const absSecs = Math.abs(diffSecs);
  const minutes = Math.floor(absSecs / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (absSecs < 60) {
    return diffSecs >= 0 ? 'now' : 'just now';
  } else if (minutes < 60) {
    const value = diffSecs >= 0 ? minutes : -minutes;
    const unit = value === 1 ? 'minute' : 'minutes';
    return diffSecs >= 0 ? `in ${value} ${unit}` : `${value} ${unit} ago`;
  } else if (hours < 24) {
    const value = diffSecs >= 0 ? hours : -hours;
    const unit = value === 1 ? 'hour' : 'hours';
    return diffSecs >= 0 ? `in ${value} ${unit}` : `${value} ${unit} ago`;
  } else {
    const value = diffSecs >= 0 ? days : -days;
    const unit = value === 1 ? 'day' : 'days';
    return diffSecs >= 0 ? `in ${value} ${unit}` : `${value} ${unit} ago`;
  }
}