
import axios from 'axios';

export const getApiErrorMessage = (
  error: unknown,
): string => {
  if (!axios.isAxiosError(error)) {
    return 'Something went wrong. Please try again.';
  }

  if (error.response) {
    const data = error.response.data;

    // DRF detail message
    if (typeof data?.detail === 'string') {
      return data.detail;
    }

    // Handle your backend response:
    // { message: "...", errors: { username: ["..."] } }
    if (data && typeof data === 'object') {
      const validationErrors = data.errors;

      if (
        validationErrors &&
        typeof validationErrors === 'object'
      ) {
        const messages: string[] = [];

        Object.entries(validationErrors).forEach(
          ([field, value]) => {
            if (Array.isArray(value)) {
              messages.push(
                ...value.filter(
                  (item): item is string =>
                    typeof item === 'string',
                ),
              );
            } else if (typeof value === 'string') {
              messages.push(value);
            }
          },
        );

        if (messages.length > 0) {
          return messages.join('\n');
        }
      }

      // Handle standard DRF field errors
      const messages: string[] = [];

      Object.entries(data).forEach(([field, value]) => {
        if (field === 'message' || field === 'errors') {
          return;
        }

        if (Array.isArray(value)) {
          messages.push(`${field}: ${value.join(', ')}`);
        } else if (typeof value === 'string') {
          messages.push(`${field}: ${value}`);
        }
      });

      if (messages.length > 0) {
        return messages.join('\n');
      }

      // General API message, used only when no specific
      // validation error is available
      if (typeof data.message === 'string') {
        return data.message;
      }
    }

    if (typeof data === 'string') {
      return data;
    }

    return `Request failed with status ${error.response.status}.`;
  }

  if (error.request) {
    return 'Unable to reach the server. Please check your internet connection.';
  }

  return error.message || 'Something went wrong. Please try again.';
};
