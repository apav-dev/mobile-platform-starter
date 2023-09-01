export const getDaysSince = (date: string): string => {
  // Get the current date and time in UTC
  const now = new Date();
  const nowUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  // Convert the input date to UTC time
  const then = new Date(date);
  const thenUTC = Date.UTC(
    then.getUTCFullYear(),
    then.getUTCMonth(),
    then.getUTCDate()
  );

  // Calculate the difference in days
  const daysSince = Math.floor((nowUTC - thenUTC) / (1000 * 60 * 60 * 24));

  // Generate the display string based on the difference
  if (daysSince === 0) {
    return "Today";
  } else if (daysSince === 1) {
    return "Yesterday";
  } else {
    return `${daysSince} days ago`;
  }
};
