import { format, isToday, isYesterday, isThisYear } from "date-fns";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  } else if (isThisYear(date)) {
    return format(date, "MMM d 'at' h:mm a");
  } else {
    return format(date, "MMM d, yyyy 'at' h:mm a");
  }
};