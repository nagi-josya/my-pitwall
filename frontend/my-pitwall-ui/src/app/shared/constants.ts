const currentYear = new Date().getFullYear();
const firstAvailableYear = 2023;
const yearCount = Math.max(0, currentYear - firstAvailableYear + 1);
export const AVAILABLE_YEARS = Array.from({ length: yearCount }, (_, i) => firstAvailableYear + i);
