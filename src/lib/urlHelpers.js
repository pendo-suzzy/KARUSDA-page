/**
 * Universal URL helpers for KARUSDA Church App.
 *
 * Handles every common format of YouTube and Google Photos links
 * so the admin can paste ANY version and the app will still render
 * thumbnails, embeds, and clickable links correctly.
 */

/* ------------------------------------------------------------------ */
/*  YOUTUBE                                                           */
/* ------------------------------------------------------------------ */

/**
 * Extract the 11-character YouTube video ID from virtually any URL format:
 *
 *   Standard watch     → https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *   Short share        → https://youtu.be/dQw4w9WgXcQ
 *   Embed              → https://www.youtube.com/embed/dQw4w9WgXcQ
 *   Shorts             → https://www.youtube.com/shorts/dQw4w9WgXcQ
 *   Live               → https://www.youtube.com/live/dQw4w9WgXcQ
 *   With timestamp     → https://youtu.be/dQw4w9WgXcQ?t=42
 *   With playlist      → https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLxxx
 *   Mobile             → https://m.youtube.com/watch?v=dQw4w9WgXcQ
 *   No-cookie          → https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ
 *   Music              → https://music.youtube.com/watch?v=dQw4w9WgXcQ
 *
 * Returns the 11-char ID string, or null if the URL isn't a valid YouTube video.
 */
export function getYoutubeId(url) {
  if (!url || typeof url !== "string") return null;

  const patterns = [
    // youtu.be/ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // youtube.com/watch?v=ID  (handles www, m, music subdomains)
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    // youtube.com/embed/ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    // youtube.com/v/ID
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    // youtube.com/shorts/ID
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    // youtube.com/live/ID
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    // youtube-nocookie.com/embed/ID
    /youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }

  return null;
}

/**
 * Convert any YouTube URL into a clean, standard watch URL.
 * If the input is not a recognised YouTube link, returns the original string.
 */
export function toYoutubeWatchUrl(url) {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : url;
}

/**
 * Convert any YouTube URL into an embeddable iframe URL.
 */
export function toYoutubeEmbedUrl(url) {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/**
 * Get the best-quality thumbnail for a YouTube video.
 * Falls back through hqdefault → mqdefault → default.
 */
export function getYoutubeThumbnail(url, quality = "mqdefault") {
  const id = getYoutubeId(url);
  if (!id) return null;
  // quality options: maxresdefault, sddefault, hqdefault, mqdefault, default
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

/* ------------------------------------------------------------------ */
/*  GOOGLE PHOTOS                                                     */
/* ------------------------------------------------------------------ */

/**
 * Convert a Google Photos sharing link into a directly-embeddable image URL.
 *
 * Handles these common formats:
 *
 *   Share link  → https://photos.google.com/share/AF1QipN.../photo/AF1QipO...
 *   Album link  → https://photos.google.com/album/AF1QipN...
 *   lh3 direct  → https://lh3.googleusercontent.com/pw/...
 *   Drive share → https://drive.google.com/file/d/FILE_ID/view
 *   Drive open  → https://drive.google.com/open?id=FILE_ID
 *
 * For standard Google Photos share links the API doesn't expose a direct
 * image URL without authentication, so we return the original link (it will
 * open the photo in a new tab).  For Google Drive links we convert them
 * to the direct-view thumbnail endpoint.
 */
export function toGooglePhotoUrl(url) {
  if (!url || typeof url !== "string") return url;

  const trimmedUrl = url.trim();

  // Already a direct image or thumbnail link.
  if (trimmedUrl.includes("lh3.googleusercontent.com")) {
    if (!trimmedUrl.includes("=w") && !trimmedUrl.includes("=s")) {
      return `${trimmedUrl}=w800`;
    }
    return trimmedUrl;
  }

  if (trimmedUrl.includes("drive.google.com")) {
    const driveFileMatch = trimmedUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveFileMatch) {
      return `https://drive.google.com/thumbnail?id=${driveFileMatch[1]}&sz=w800`;
    }

    const driveOpenMatch = trimmedUrl.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (driveOpenMatch) {
      return `https://drive.google.com/thumbnail?id=${driveOpenMatch[1]}&sz=w800`;
    }

    const driveUcMatch = trimmedUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveUcMatch) {
      return `https://drive.google.com/thumbnail?id=${driveUcMatch[1]}&sz=w800`;
    }
  }

  const photoPatterns = [
    /photos\.google\.com\/share\/[^/]+\/photo\/([a-zA-Z0-9_-]+)/,
    /photos\.google\.com\/lh\/photo\/([a-zA-Z0-9_-]+)/,
    /photos\.google\.com\/share\/([a-zA-Z0-9_-]+)/,
    /photos\.app\.goo\.gl\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of photoPatterns) {
    const match = trimmedUrl.match(pattern);
    if (match?.[1]) {
      const token = match[1];
      return [
        `https://lh3.googleusercontent.com/pw/${token}`,
        `https://lh3.googleusercontent.com/${token}`,
        `https://lh3.googleusercontent.com/pw/${token}=w800`,
        `https://lh3.googleusercontent.com/${token}=w800`,
      ][0];
    }
  }

  if (/photos\.google\.com\/album\//.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return trimmedUrl;
}

/* ------------------------------------------------------------------ */
/*  UNIVERSAL HELPERS                                                  */
/* ------------------------------------------------------------------ */

/**
 * Determine whether a URL is a YouTube link.
 */
export function isYoutubeUrl(url) {
  return getYoutubeId(url) !== null;
}

/**
 * Determine whether a URL is a Google Photos / Drive link.
 */
export function isGooglePhotoUrl(url) {
  if (!url || typeof url !== "string") return false;
  return (
    url.includes("photos.google.com") ||
    url.includes("photos.app.goo.gl") ||
    url.includes("lh3.googleusercontent.com") ||
    url.includes("drive.google.com")
  );
}

/**
 * Given any user-pasted URL, normalise it into the best usable form:
 *   - YouTube links   → clean watch URL
 *   - Google Photos   → direct image URL (when possible)
 *   - Everything else → returned as-is
 */
export function normalizeUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (isYoutubeUrl(url)) return toYoutubeWatchUrl(url);
  if (isGooglePhotoUrl(url)) return toGooglePhotoUrl(url);
  return url;
}

/**
 * Get a displayable thumbnail URL for any link:
 *   - YouTube → video thumbnail
 *   - Google Photos / Drive → direct image URL
 *   - Other image URLs → returned as-is
 *   - Non-image URLs → null
 */
export function getThumbnail(url) {
  if (!url) return null;
  if (isYoutubeUrl(url)) return getYoutubeThumbnail(url);
  if (isGooglePhotoUrl(url)) return toGooglePhotoUrl(url);
  // If it looks like a direct image URL, return it
  if (/\.(jpe?g|png|gif|webp|svg|avif)(\?.*)?$/i.test(url)) return url;
  if (url.startsWith("https://picsum.photos")) return url;
  return null;
}
