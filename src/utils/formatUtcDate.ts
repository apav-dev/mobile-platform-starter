// format utc date number to date string in the format of "Month Day, Year, Hour:Minute"

export const formatUtcDate = (input: number): string => {
  // Create a Date object from the input string
  const date = new Date(input);

  // Array of month names for formatting
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract various pieces of the date
  const year = date.getUTCFullYear();
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Zero pad minutes if necessary
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;

  // Combine and format
  return `${month} ${day}, ${year}, ${hours}:${minutesStr}`;
};
