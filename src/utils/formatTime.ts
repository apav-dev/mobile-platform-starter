export const formatTime = (timeString?: string) => {
  if (!timeString) {
    return "";
  }
  // Create a new date object (it doesn't matter which day it is)
  const date = new Date(`1970-01-01T${timeString}Z`);
  // Use toLocaleTimeString with specific options to get just the time
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
