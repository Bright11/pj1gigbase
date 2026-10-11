
type CloudinaryImageOptions = {
  width?: number;
};

const CLOUDINARY_UPLOAD_MARKER = "/image/upload/";

export function optimizeCloudinaryImage(
  imageUrl: string | null | undefined,
  options: CloudinaryImageOptions = {},
): string | undefined {
  if (!imageUrl) {
    return undefined;
  }

  // Only transform Cloudinary image URLs.
  if (
    !imageUrl.startsWith("https://res.cloudinary.com/") ||
    !imageUrl.includes(CLOUDINARY_UPLOAD_MARKER)
  ) {
    return imageUrl;
  }

  const width = Math.min(
    1600,
    Math.max(100, Math.round(options.width ?? 400)),
  );

  const markerIndex = imageUrl.indexOf(CLOUDINARY_UPLOAD_MARKER);
  const transformationStart =
    markerIndex + CLOUDINARY_UPLOAD_MARKER.length;

  const remainingPath = imageUrl.slice(transformationStart);

  // Avoid adding these transformations when they already exist.
  const firstPathSegment = remainingPath.split("/")[0];
  const hasExistingOptimization = firstPathSegment
    .split(",")
    .some((part) =>
      ["f_auto", "q_auto", "c_limit"].includes(part) ||
      /^w_\d+$/.test(part),
    );

  if (hasExistingOptimization) {
    return imageUrl;
  }

  return (
    imageUrl.slice(0, transformationStart) +
    `c_limit,w_${width},f_auto,q_auto/` +
    remainingPath
  );
}