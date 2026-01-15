// Text content and copy for EVP Analyzer Pro
// Based on Stage 08 brand voice and messaging

export const STRINGS = {
  // App branding
  appName: 'EVP Analyzer Pro',
  tagline: 'Professional paranormal investigation toolkit',
  
  // Onboarding
  onboarding: {
    welcome: 'Welcome to EVP Analyzer Pro',
    professionalTools: 'Professional EVP Analysis',
    professionalDescription: 'Replace expensive hardware with superior mobile analysis capabilities. Professional-grade tools designed for serious paranormal investigators.',
    autoDetection: 'Automatic Anomaly Detection',
    autoDetectionDescription: 'Advanced algorithms automatically detect and timestamp unusual audio patterns during recording, so you never miss potential evidence.',
    documentation: 'Evidence-Quality Documentation', 
    documentationDescription: 'Export professional formats (WAV, FLAC) with metadata for credible investigation documentation and team collaboration.',
    readyToBegin: 'Ready to Begin',
    readyDescription: 'Start your first investigation session to experience authentic professional-grade EVP analysis tools.',
    getStarted: 'Get Started',
    skip: 'Skip'
  },

  // Navigation
  nav: {
    sessions: 'Sessions',
    analysis: 'Analysis', 
    library: 'Library',
    settings: 'Settings'
  },

  // Sessions screen
  sessions: {
    title: 'EVP Sessions',
    startNewSession: 'Start New Session',
    recentSessions: 'Recent Sessions',
    noSessions: 'No investigation sessions yet.',
    noSessionsDescription: 'Start your first session to begin professional EVP analysis.',
    startFirstSession: 'Start First Session',
    sessionLimitReached: 'Session Limit Reached',
    sessionLimitMessage: 'Free accounts are limited to 10 sessions. Upgrade to Pro for unlimited sessions.',
    totalSessions: 'Total Sessions',
    totalAnomalies: 'Total Anomalies',
    recordingTime: 'Recording Time',
    sessionsRemaining: 'sessions remaining. Upgrade for unlimited sessions.'
  },

  // Recording screen
  recording: {
    sessionName: 'Session',
    readyToRecord: 'Ready to record',
    recordingInProgress: 'Recording in progress...',
    recordingPaused: 'Recording paused',
    startRecording: 'Start recording',
    pauseRecording: 'Pause recording',
    resumeRecording: 'Resume recording',
    stopRecording: 'Stop recording',
    cancelRecording: 'Cancel recording',
    anomalies: 'anomalies',
    anomaly: 'anomaly',
    recordingLimit: 'Recording Limit',
    recordingLimitMessage: 'Free accounts are limited to 5 minutes. Upgrade to Pro for unlimited recording.',
    recordingLimitReachedMessage: 'Free accounts are limited to 5 minutes. Your session has been saved automatically.',
    sessionSaved: 'Session Saved',
    sessionSavedMessage: 'Recording saved with {count} detected anomalies.',
    newSession: 'New Session',
    reviewSession: 'Review Session',
    cancelConfirmTitle: 'Cancel Recording',
    cancelConfirmMessage: 'Are you sure you want to cancel the current recording? All data will be lost.',
    keepRecording: 'Keep Recording',
    recordingWillStop: 'Recording will stop automatically in {time}. Upgrade to Pro for unlimited recording.'
  },

  // Analysis screen
  analysis: {
    title: 'Audio Analysis',
    selectSession: 'Select Session',
    noSessions: 'No sessions available for analysis.',
    noSessionsDescription: 'Record your first EVP session to begin professional analysis.',
    detectedAnomalies: 'Detected Anomalies',
    reviewSession: 'Review Session',
    advancedAnalysis: 'Advanced Analysis',
    professionalAnalysisTitle: 'Professional Analysis',
    professionalAnalysisMessage: 'Advanced spectral analysis is available with EVP Pro subscription.',
    noAnomalies: 'No anomalies detected in this session.',
    noAnomaliesDescription: 'This could indicate a quiet investigation period or optimal recording conditions.',
    comingSoon: 'Feature coming soon in the next update!'
  },

  // Library screen
  library: {
    title: 'Session Library',
    searchPlaceholder: 'Search sessions, locations, notes...',
    sortBy: 'Sort by:',
    date: 'Date',
    name: 'Name',
    anomalies: 'Anomalies',
    sessionsCount: '{filtered} of {total} sessions',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    selected: 'selected',
    deleteSessions: 'Delete Sessions',
    deleteConfirmTitle: 'Delete Sessions',
    deleteConfirmMessage: 'Are you sure you want to delete {count} session{plural}? This action cannot be undone.',
    deleteSuccess: 'Selected sessions deleted successfully',
    emptyLibrary: 'Your session library is empty.',
    emptyLibraryDescription: 'Start recording EVP sessions to build your investigation archive.',
    noMatches: 'No sessions match your search criteria.',
    duration: 'Duration',
    quality: 'Quality',
    location: 'Location'
  },

  // Settings screen
  settings: {
    title: 'Settings',
    subscription: 'EVP Pro',
    subscriptionActive: 'EVP Pro Active',
    subscriptionDescription: 'You have access to all professional investigation features.',
    upgradeDescription: 'Upgrade to unlock unlimited recording, advanced analysis, and professional export formats.',
    manageSub: 'Manage Subscription',
    restorePurchases: 'Restore Purchases',
    upgradeToPro: 'Upgrade to Pro',
    
    // Sections
    recordingSettings: 'Recording Settings',
    exportSettings: 'Export Settings', 
    privacyAnalytics: 'Privacy & Analytics',
    support: 'Support',
    
    // Settings items
    audioQuality: 'Audio Quality',
    audioQualityDescription: 'Recording quality and file size',
    autoDetect: 'Auto-Detect Anomalies',
    autoDetectDescription: 'Automatically detect and mark audio anomalies during recording',
    noiseReduction: 'Noise Reduction',
    noiseReductionDescription: 'Apply real-time noise filtering to improve analysis',
    exportFormat: 'Export Format', 
    exportFormatDescription: 'Default format for audio exports',
    cloudSync: 'Cloud Sync',
    cloudSyncDescription: 'Sync sessions across devices (Pro only)',
    analytics: 'Analytics',
    analyticsDescription: 'Help improve the app by sharing usage data',
    privacyPolicy: 'Privacy Policy',
    privacyPolicyDescription: 'View our privacy policy and data usage',
    termsOfService: 'Terms of Service',
    termsDescription: 'View terms and conditions',
    contactSupport: 'Contact Support',
    supportDescription: 'Get help with investigation techniques and app usage',
    rateApp: 'Rate App',
    rateAppDescription: 'Share your experience with other investigators',
    
    // Pro features
    unlimitedRecording: 'Unlimited recording length',
    advancedAnalysis: 'Advanced spectral analysis with frequency visualization', 
    cloudBackup: 'Cloud session backup and cross-device sync',
    professionalExport: 'Professional export formats (WAV, FLAC) with metadata',
    batchAnalysis: 'Batch anomaly analysis across multiple sessions',
    prioritySupport: 'Priority customer support with investigation guidance'
  },

  // Paywall screen
  paywall: {
    title: 'Upgrade to EVP Pro',
    subtitle: 'Unlock professional-grade analysis tools and replace expensive hardware with superior mobile capabilities.',
    annualPlan: 'Annual Plan',
    monthlyPlan: 'Monthly Plan',
    save: 'Save {percent}%',
    billedAnnually: 'Billed annually',
    billedMonthly: 'Billed monthly • Cancel anytime',
    startFreeTrial: 'Start Free Trial',
    legal: 'Start with a free 14-day trial. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period. You can manage and cancel subscriptions in your device\'s App Store settings.',
    privacyTerms: 'Privacy Policy • Terms of Service',
    purchaseFailed: 'Purchase Failed',
    purchaseCancelled: 'Purchase was cancelled.',
    welcomeToPro: 'Welcome to Pro!',
    welcomeMessage: 'Your subscription is now active. Enjoy unlimited professional features.',
    restoreSuccess: 'Purchases restored successfully!',
    restoreNone: 'No active subscriptions found to restore.',
    restoreFailed: 'Failed to restore purchases. Please try again.'
  },

  // Error messages
  errors: {
    generic: 'An unexpected error occurred. Please try again.',
    network: 'Network error. Please check your connection and try again.',
    permission: 'Permission denied. Please check app permissions.',
    storage: 'Storage error. Please ensure sufficient space is available.',
    recording: 'Recording failed. Please check microphone permissions.',
    database: 'Database error. Please restart the app.',
    subscription: 'Subscription error. Please try again or contact support.',
    initialization: 'Failed to initialize the app. Please check your configuration.'
  },

  // Success messages
  success: {
    sessionSaved: 'Session saved successfully',
    settingUpdated: 'Setting updated',
    purchaseComplete: 'Purchase completed successfully',
    exportComplete: 'Export completed successfully',
    purchasesRestored: 'Purchases restored successfully'
  },

  // Common actions
  actions: {
    ok: 'OK',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    share: 'Share',
    export: 'Export',
    retry: 'Retry',
    close: 'Close',
    next: 'Next',
    back: 'Back',
    done: 'Done',
    upgrade: 'Upgrade',
    contactSupport: 'Contact Support'
  },

  // Time formats
  time: {
    seconds: 'seconds',
    minutes: 'minutes', 
    hours: 'hours',
    days: 'days'
  },

  // File formats
  formats: {
    mp3: 'MP3 (Free)',
    wav: 'WAV (Pro)',
    flac: 'FLAC (Pro)'
  }
};

export default STRINGS;