import i18next from "i18next";

export const getDaysSince = (date: number): string => {
  const now = new Date();
  const nowUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  const then = new Date(date);
  const thenUTC = Date.UTC(
    then.getUTCFullYear(),
    then.getUTCMonth(),
    then.getUTCDate()
  );

  const daysSince = Math.floor((nowUTC - thenUTC) / (1000 * 60 * 60 * 24));

  if (daysSince === 0) {
    return i18next.t("Today");
  } else if (daysSince === 1) {
    return i18next.t("Yesterday");
  } else {
    return i18next.t("daysAgo", { count: daysSince });
  }
};
