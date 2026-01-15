// Error Boundary component for production reliability
// Handles crashes and provides recovery options

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../styles/theme';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show error UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // In production, you might want to log this to an error reporting service
    if (!__DEV__) {
      // Example: Crashlytics.recordError(error);
    }
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReportIssue = () => {
    Alert.alert(
      'Report Issue',
      'Thank you for helping us improve. Please contact support with details about what you were doing when this error occurred.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Contact Support', onPress: () => {
          // In a real app, this would open email or support system
          console.log('Contact support triggered');
        }}
      ]
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          onRestart={this.handleRestart}
          onReportIssue={this.handleReportIssue}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, onRestart, onReportIssue }) => {
  // Safe theme fallbacks - never rely on external theme that might be broken
  let safeTheme;
  try {
    const theme = useTheme();
    safeTheme = {
      colors: theme?.colors || {},
      typography: theme?.typography || {},
      spacing: theme?.spacing || {},
    };
  } catch (themeError) {
    console.warn('Theme system unavailable in ErrorBoundary, using safe fallbacks:', themeError);
    safeTheme = { colors: {}, typography: {}, spacing: {} };
  }

  // Paranormal-themed safe fallbacks with guaranteed values
  const colors = {
    background: safeTheme.colors.background || '#0D0D0D',
    primary: safeTheme.colors.primary || '#1A237E',
    surface: safeTheme.colors.surface || '#1A1A1A',
    border: safeTheme.colors.border || '#333333',
    error: safeTheme.colors.error || '#F44336',
    text: {
      primary: safeTheme.colors.text?.primary || '#FFFFFF',
      secondary: safeTheme.colors.text?.secondary || '#B0B0B0',
    },
  };

  const typography = {
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
      ...(safeTheme.typography.h1 || {}),
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      ...(safeTheme.typography.body || {}),
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
      ...(safeTheme.typography.caption || {}),
    },
  };

  const spacing = {
    md: safeTheme.spacing.md || 16,
    lg: safeTheme.spacing.lg || 24,
    xl: safeTheme.spacing.xl || 32,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    icon: {
      fontSize: 64,
      color: colors.error,
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.h1,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    message: {
      ...typography.body,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    button: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: 8,
      minWidth: 120,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonText: {
      ...typography.body,
      fontWeight: '600',
      color: colors.text.primary,
      textAlign: 'center',
    },
    errorDetails: {
      marginTop: spacing.xl,
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: 8,
      maxHeight: 200,
    },
    errorText: {
      ...typography.caption,
      color: colors.text.secondary,
      fontFamily: 'monospace',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      
      <Text style={styles.title}>Something went wrong</Text>
      
      <Text style={styles.message}>
        The app encountered an unexpected error. Don't worry - your investigation data is safe. 
        You can restart the app or report this issue to help us improve.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onRestart}
          accessibilityLabel="Restart app"
          accessibilityHint="Restart the application to recover from the error"
        >
          <Text style={styles.buttonText}>Restart App</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={onReportIssue}
          accessibilityLabel="Report issue"
          accessibilityHint="Report this error to help us improve the app"
        >
          <Text style={styles.buttonText}>Report Issue</Text>
        </TouchableOpacity>
      </View>

      {__DEV__ && error && (
        <View style={styles.errorDetails}>
          <Text style={styles.errorText}>
            {error.toString()}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ErrorBoundary;