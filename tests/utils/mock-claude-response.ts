/**
 * Mock Claude Response Utilities
 *
 * Provides mock AI responses for testing pipeline logic without making actual API calls.
 * Supports various response types including intent normalization, spec generation, and errors.
 *
 * @module tests/utils
 */

/**
 * Mock Claude response structure
 */
export interface MockClaudeResponse {
  /** Response content */
  content: string;
  /** Token usage stats */
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
  /** Stop reason */
  stopReason?: 'end_turn' | 'max_tokens' | 'stop_sequence';
  /** Model used */
  model?: string;
}

/**
 * Mock intent normalization response
 */
export interface MockNormalizedIntent {
  /** Normalized app description */
  description: string;
  /** Inferred app name */
  name: string;
  /** Key features extracted */
  features: string[];
  /** Target platform */
  platform: 'mobile' | 'web' | 'agent' | 'plugin' | 'miniapp';
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Create a mock Claude API response
 *
 * @param content - The response content
 * @param options - Optional response configuration
 * @returns Mock Claude response object
 */
export function createMockResponse(
  content: string,
  options: Partial<Omit<MockClaudeResponse, 'content'>> = {}
): MockClaudeResponse {
  return {
    content,
    usage: options.usage ?? {
      input_tokens: Math.floor(content.length / 4),
      output_tokens: Math.floor(content.length / 3),
    },
    stopReason: options.stopReason ?? 'end_turn',
    model: options.model ?? 'claude-3-sonnet-20240229',
  };
}

/**
 * Create a mock normalized intent response
 *
 * @param rawInput - The raw user input
 * @param overrides - Optional overrides for the normalized output
 * @returns Mock normalized intent
 */
export function createMockNormalizedIntent(
  rawInput: string,
  overrides: Partial<MockNormalizedIntent> = {}
): MockNormalizedIntent {
  // Simple heuristic to detect platform from input
  const platformDetection: Record<string, MockNormalizedIntent['platform']> = {
    mobile: 'mobile',
    app: 'mobile',
    ios: 'mobile',
    android: 'mobile',
    dapp: 'web',
    website: 'web',
    web: 'web',
    agent: 'agent',
    bot: 'agent',
    plugin: 'plugin',
    miniapp: 'miniapp',
    mini: 'miniapp',
  };

  const words = rawInput.toLowerCase().split(/\s+/);
  let platform: MockNormalizedIntent['platform'] = 'mobile';

  for (const word of words) {
    if (platformDetection[word]) {
      platform = platformDetection[word];
      break;
    }
  }

  // Extract potential app name from first few words
  const name =
    overrides.name ??
    words
      .slice(0, 3)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')
      .replace(/[^a-zA-Z0-9]/g, '');

  return {
    description: overrides.description ?? normalizeDescription(rawInput),
    name: name || 'AppName',
    features: overrides.features ?? extractFeatures(rawInput),
    platform: overrides.platform ?? platform,
    metadata: overrides.metadata,
  };
}

/**
 * Normalize a raw description into a professional format
 */
function normalizeDescription(raw: string): string {
  // Clean up the input
  const cleaned = raw.trim().replace(/\s+/g, ' ');

  // If it's already well-formed, return as-is
  if (cleaned.length > 100 && cleaned.includes('.')) {
    return cleaned;
  }

  // Otherwise, expand into a more complete description
  return `A ${cleaned.toLowerCase()} with a polished user interface, smooth animations, loading states, and error handling. Features include core functionality, user preferences, and modern design patterns.`;
}

/**
 * Extract features from raw input
 */
function extractFeatures(raw: string): string[] {
  const features: string[] = [];
  const lowered = raw.toLowerCase();

  // Common feature keywords
  const featureMap: Record<string, string> = {
    timer: 'Timer functionality',
    notification: 'Push notifications',
    calendar: 'Calendar integration',
    sync: 'Cloud sync',
    offline: 'Offline mode',
    dark: 'Dark mode',
    theme: 'Theme customization',
    auth: 'User authentication',
    login: 'User authentication',
    payment: 'Payment processing',
    wallet: 'Wallet integration',
    track: 'Progress tracking',
    analytics: 'Usage analytics',
    share: 'Social sharing',
    export: 'Data export',
    import: 'Data import',
    search: 'Search functionality',
    filter: 'Filtering options',
    sort: 'Sorting options',
  };

  for (const [keyword, feature] of Object.entries(featureMap)) {
    if (lowered.includes(keyword)) {
      features.push(feature);
    }
  }

  // Always include core features
  if (features.length === 0) {
    features.push('Core functionality');
    features.push('User-friendly interface');
    features.push('Settings management');
  }

  return features;
}

/**
 * Create a mock error response
 *
 * @param errorType - Type of error to simulate
 * @param message - Optional custom error message
 * @returns Mock error object
 */
export function createMockErrorResponse(
  errorType: 'rate_limit' | 'context_length' | 'invalid_request' | 'api_error',
  message?: string
): { error: { type: string; message: string } } {
  const errors: Record<string, { type: string; message: string }> = {
    rate_limit: {
      type: 'rate_limit_error',
      message: message ?? 'Rate limit exceeded. Please retry in 60 seconds.',
    },
    context_length: {
      type: 'context_length_exceeded',
      message:
        message ??
        'The prompt is too long. Maximum context length is 200000 tokens.',
    },
    invalid_request: {
      type: 'invalid_request_error',
      message: message ?? 'Invalid request parameters.',
    },
    api_error: {
      type: 'api_error',
      message: message ?? 'An unexpected error occurred on the API server.',
    },
  };

  return { error: errors[errorType] };
}

/**
 * Create a mock streaming response generator
 *
 * @param content - Full content to stream
 * @param chunkSize - Size of each chunk (default: 20 characters)
 * @yields Content chunks
 */
export function* createMockStreamingResponse(
  content: string,
  chunkSize = 20
): Generator<string, void, unknown> {
  for (let i = 0; i < content.length; i += chunkSize) {
    yield content.slice(i, i + chunkSize);
  }
}

/**
 * Create a mock spec document response
 *
 * @param appName - Name of the application
 * @param features - List of features
 * @returns Mock spec document content
 */
export function createMockSpecDocument(
  appName: string,
  features: string[]
): string {
  return `# ${appName} Specification

## 1. Product Vision

${appName} is a modern application designed to provide exceptional user experience.

## 2. Core Features

${features.map((f, i) => `${i + 1}. ${f}`).join('\n')}

## 3. Technical Stack

- Framework: Next.js 14 / Expo (based on platform)
- Language: TypeScript
- Styling: Tailwind CSS
- State: Zustand
- Animations: Framer Motion

## 4. User Flows

### Main Flow
1. User opens application
2. User views main dashboard
3. User interacts with core features
4. User manages settings

## 5. Design System

- Primary Color: #6366F1 (Indigo)
- Background: #FFFFFF / #0F172A
- Typography: Inter font family
- Spacing: 4px base unit

## 6. Success Criteria

- [ ] App loads in under 3 seconds
- [ ] All user flows complete successfully
- [ ] Error states are handled gracefully
- [ ] Accessibility score > 90
`;
}
