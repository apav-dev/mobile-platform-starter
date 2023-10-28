// get day of week based on date string that is in format YYYY-MM-DD. Day should be in the format of "Mon", "Tue", etc.
export const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00Z");
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return daysOfWeek[date.getUTCDay()];
};
