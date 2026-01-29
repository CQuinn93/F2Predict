// Username validation utility
// Checks for inappropriate words, reserved names, and standard guidelines

// List of reserved/inappropriate words
const RESERVED_WORDS = [
  'admin',
  'administrator',
  'moderator',
  'mod',
  'system',
  'support',
  'help',
  'info',
  'contact',
  'official',
  'fifa',
  'worldcup',
  'worldcup2026',
  'wc2026',
];

// Common inappropriate words (basic list - can be expanded)
// NOTE: Add inappropriate words here. For production, consider using a comprehensive
// profanity filter library or API service for better coverage.
const INAPPROPRIATE_WORDS = [
  // Add inappropriate words here as needed
  // Examples of words to add: profanity, hate speech, etc.
  // For a production app, consider using a service like:
  // - Google Cloud Natural Language API
  // - AWS Comprehend
  // - Or a dedicated profanity filter library
];

// Validation rules
const MIN_LENGTH = 3;
const MAX_LENGTH = 20;
const ALLOWED_CHARS = /^[a-zA-Z0-9_]+$/;

export interface UsernameValidationResult {
  valid: boolean;
  error?: string;
}

export const validateUsername = (username: string): UsernameValidationResult => {
  const trimmed = username.trim();

  // Check if empty
  if (!trimmed) {
    return {
      valid: false,
      error: 'Username is required',
    };
  }

  // Check minimum length
  if (trimmed.length < MIN_LENGTH) {
    return {
      valid: false,
      error: `Username must be at least ${MIN_LENGTH} characters`,
    };
  }

  // Check maximum length
  if (trimmed.length > MAX_LENGTH) {
    return {
      valid: false,
      error: `Username must be less than ${MAX_LENGTH} characters`,
    };
  }

  // Check allowed characters
  if (!ALLOWED_CHARS.test(trimmed)) {
    return {
      valid: false,
      error: 'Username can only contain letters, numbers, and underscores',
    };
  }

  // Check if starts with underscore or number
  if (trimmed[0] === '_' || /^[0-9]/.test(trimmed)) {
    return {
      valid: false,
      error: 'Username must start with a letter',
    };
  }

  // Check for reserved words (case insensitive)
  const lowerUsername = trimmed.toLowerCase();
  if (RESERVED_WORDS.some((word) => lowerUsername.includes(word))) {
    return {
      valid: false,
      error: 'This username is not available. Please choose another.',
    };
  }

  // Check for inappropriate words (case insensitive)
  if (INAPPROPRIATE_WORDS.some((word) => lowerUsername.includes(word))) {
    return {
      valid: false,
      error: 'Username contains inappropriate content. Please choose another.',
    };
  }

  // Check for consecutive underscores
  if (trimmed.includes('__')) {
    return {
      valid: false,
      error: 'Username cannot contain consecutive underscores',
    };
  }

  // Check for only underscores
  if (trimmed.replace(/_/g, '').length === 0) {
    return {
      valid: false,
      error: 'Username cannot contain only underscores',
    };
  }

  return {
    valid: true,
  };
};

// Check if username is available (unique check)
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  try {
    const { supabase } = await import('@/utils/supabase');
    const { getUserProfileByUsername } = await import('@/services/user-profile');
    
    const existingProfile = await getUserProfileByUsername(username);
    return existingProfile === null;
  } catch (error) {
    console.error('Error checking username availability:', error);
    return false;
  }
};
