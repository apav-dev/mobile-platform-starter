export const validateTime = (time: string, type: string) => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!regex.test(time)) return false;
  if (type === "start" && time < "00:00") return false;
  if (type === "end" && time > "23:59") return false;
  return true;
};
