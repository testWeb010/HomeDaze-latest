import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * @param content - The HTML content or string to sanitize.
 * @returns Sanitized string.
 */
export const sanitizeInput = (content: string): string => {
  return DOMPurify.sanitize(content);
};

/**
 * Sanitizes an object or array recursively to clean all string values.
 * @param data - The data to sanitize (object, array, or string).
 * @returns Sanitized data.
 */
export const sanitizeData = (data: any): any => {
  if (typeof data === 'string') {
    return sanitizeInput(data);
  } else if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  } else if (typeof data === 'object' && data !== null) {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = sanitizeData(data[key]);
      return acc;
    }, {} as any);
  }
  return data;
};
