import axios from 'axios';

export const getApiErrorMessage = (
  error: unknown,
): string => {
  if (!axios.isAxiosError(error)) {
    return 'Something went wrong. Please try again.';
  }

  // Server responded with an error
  if (error.response) {
    const data = error.response.data;

    // DRF detail message
    if (typeof data?.detail === 'string') {
      return data.detail;
    }

    // DRF field validation errors
    if (data && typeof data === 'object') {
      const messages: string[] = [];

      Object.entries(data).forEach(
        ([field, value]) => {
          if (Array.isArray(value)) {
            messages.push(
              `${field}: ${value.join(', ')}`
            );
          } else if (typeof value === 'string') {
            messages.push(`${field}: ${value}`);
          }
        },
      );

      if (messages.length > 0) {
        return messages.join('\n');
      }
    }

    // Fallback if server returned something unexpected
    if (typeof data === 'string') {
      return data;
    }

    return `Request failed with status ${error.response.status}.`;
  }

  // Request was made but no response received
  if (error.request) {
    return 'Unable to reach the server. Please check your internet connection.';
  }

  return error.message || 'Something went wrong. Please try again.';
};