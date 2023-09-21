export const formatTime = (timeString?: string) => {
  if (!timeString) {
    return "";
  }
  // Create a new date object (it doesn't matter which day it is)
  const date = new Date(`1970-01-01T${timeString}Z`);

  // Extract the hours and minutes
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  let formattedTime = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

  // format time to 12 hour clock if necessary if locale is en-US
  if (navigator.language === "en-US") {
    const ampm = hours >= 12 ? " pm" : " am";
    const twelveHour = hours % 12 || 12;
    formattedTime = `${twelveHour}:${
      minutes < 10 ? `0${minutes}` : minutes
    }${ampm}`;
  }

  return formattedTime;
};
