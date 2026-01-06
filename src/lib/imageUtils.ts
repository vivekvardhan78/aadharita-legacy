// Image utility functions for handling various URL formats

/**
 * Converts Google Drive sharing URLs to direct image URLs
 * Supports various Google Drive URL formats
 */
export const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return '';
  
  // Already a valid non-Google Drive URL
  if (!url.includes('drive.google.com') && !url.includes('docs.google.com')) {
    return url;
  }

  // Extract file ID from various Google Drive URL formats
  let fileId = '';

  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }

  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([^&]+)/);
  if (!fileId && openMatch) {
    fileId = openMatch[1];
  }

  // Format: https://docs.google.com/uc?id=FILE_ID
  const ucMatch = url.match(/uc\?.*id=([^&]+)/);
  if (!fileId && ucMatch) {
    fileId = ucMatch[1];
  }

  if (fileId) {
    // Use Google's thumbnail API for better reliability
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }

  return url;
};

/**
 * Gets a fallback image URL based on the context
 */
export const getFallbackImage = (type: 'event' | 'sponsor' | 'team' | 'gallery' | 'logo' = 'event'): string => {
  const fallbacks: Record<string, string> = {
    event: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    sponsor: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80',
    team: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    gallery: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    logo: '/placeholder.svg',
  };
  return fallbacks[type] || fallbacks.event;
};

/**
 * Handles image loading errors with fallback
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement>,
  fallbackType: 'event' | 'sponsor' | 'team' | 'gallery' | 'logo' = 'event'
) => {
  const target = e.currentTarget;
  if (!target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true';
    target.src = getFallbackImage(fallbackType);
  }
};

/**
 * Processes an image URL - converts Google Drive URLs and validates
 */
export const processImageUrl = (url: string | null | undefined): string => {
  if (!url || url.trim() === '') return '';
  return convertGoogleDriveUrl(url.trim());
};
