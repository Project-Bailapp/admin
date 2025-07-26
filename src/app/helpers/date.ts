export const dateTimeString = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const mins = date.getMinutes();

  return `${year}-${month}-${day}T${hour}:${mins}`;
}