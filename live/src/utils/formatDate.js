export function formatDate(dateString) {
  const dateObject = new Date(dateString);
  return dateObject.toLocaleString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour12: true,
  });
}
