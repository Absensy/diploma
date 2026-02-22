import createCache from '@emotion/cache';

/**
 * Creates an Emotion cache for MUI styles
 * 
 * Configuration:
 * - key: 'mui' - Matches MUI's default cache key for consistency
 * - prepend: true - Inserts styles at the beginning of the head for proper CSS specificity
 * - speedy: false - Disables speedy mode for better SSR compatibility and hydration matching
 * 
 * This cache ensures that styles generated on the server match exactly
 * with styles generated on the client, preventing hydration mismatches.
 */
export default function createEmotionCache() {
  return createCache({ 
    key: 'mui', 
    prepend: true,
    // Disable speedy mode for better SSR compatibility
    speedy: false
  });
}
