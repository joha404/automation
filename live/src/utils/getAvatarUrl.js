const buildFallbackAvatar = (name = "User") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=2e3450&color=fff&bold=true&size=64`;

const normalizeImageValue = (value) => {
  if (typeof value !== "string") return null;

  const trimmedValue = value.trim();
  if (
    !trimmedValue ||
    trimmedValue === "null" ||
    trimmedValue === "undefined"
  ) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  const baseUrl = import.meta.env.VITE_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return trimmedValue;

  if (trimmedValue.startsWith("/")) {
    return `${baseUrl}${trimmedValue}`;
  }

  return `${baseUrl}/${trimmedValue}`;
};

export const getAvatarUrl = (entity, fallbackName = "User") =>
  normalizeImageValue(entity?.avatar) ||
  normalizeImageValue(entity?.profile_img_url) ||
  normalizeImageValue(entity?.profile_image) ||
  normalizeImageValue(entity?.image) ||
  normalizeImageValue(entity?.image_url) ||
  normalizeImageValue(entity?.photoURL) ||
  normalizeImageValue(entity?.photoUrl) ||
  normalizeImageValue(entity?.photo_url) ||
  buildFallbackAvatar(entity?.sender || entity?.name || fallbackName);

export const getFallbackAvatarUrl = buildFallbackAvatar;
