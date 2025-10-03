// Time calculation utilities for ETA and timeLeft in apps/focusflow/lib/time.ts

// Helper function to calculate ETA (Estimated Time of Arrival)
// ETA = now + (estimateHrs - spentHrs)
export function calculateETA(estimateHrs?: number, spentHrs?: number): Date | null {
  if (estimateHrs === undefined || spentHrs === undefined) {
    return null;
  }

  const remainingHours = estimateHrs - spentHrs;
  if (remainingHours <= 0) {
    return new Date(); // Task should already be completed
  }

  const now = new Date();
  const eta = new Date(now.getTime() + remainingHours * 60 * 60 * 1000);
  return eta;
}

// Helper function to calculate timeLeft until due date
// timeLeft = dueAt - now (in milliseconds)
export function calculateTimeLeft(dueAt?: Date): number | null {
  if (!dueAt) {
    return null;
  }

  const now = new Date();
  const timeLeft = dueAt.getTime() - now.getTime();
  
  // Return time in milliseconds; negative if overdue
  return timeLeft;
}

// Helper function to format timeLeft into a human-readable string
export function formatTimeLeft(timeLeftMs: number | null): string | null {
  if (timeLeftMs === null) {
    return null;
  }

  if (timeLeftMs < 0) {
    const absTimeLeft = Math.abs(timeLeftMs);
    const days = Math.floor(absTimeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absTimeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((absTimeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `-${days}d ${hours}h ${mins}m overdue`;
    } else if (hours > 0) {
      return `-${hours}h ${mins}m overdue`;
    } else {
      return `-${mins}m overdue`;
    }
  }

  const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h ${mins}m left`;
  } else if (hours > 0) {
    return `${hours}h ${mins}m left`;
  } else {
    return `${mins}m left`;
  }
}

// Helper function to format duration (in hours) into human-readable format
export function formatDuration(durationHrs: number | null): string | null {
  if (durationHrs === null) {
    return null;
  }

  const hours = Math.floor(durationHrs);
  const minutes = Math.floor((durationHrs - hours) * 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

// Helper function to convert minutes to hours
export function minutesToHours(minutes: number): number {
  return minutes / 60;
}

// Helper function to convert hours to minutes
export function hoursToMinutes(hours: number): number {
  return hours * 60;
}