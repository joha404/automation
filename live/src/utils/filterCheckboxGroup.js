const filterCheckboxGroup = (data = {}, keywords = []) => {
  return Object.entries(data)
    .filter(([key, value]) => value && keywords.includes(key))
    .map(([key]) =>
      key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .trim()
    )
    .join(", ");
};
export default filterCheckboxGroup;
