import 'dotenv/config';

export default {
  expo: {
    name: "VisualBell - Kids Timer",
    slug: "visualbell-kids-timer",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FFFBF5"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.appfactory.visualbell.kids.timer",
      buildNumber: "1",
      infoPlist: {
        NSUserTrackingUsageDescription: "This identifier will be used to deliver personalized ads to you.",
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FFFBF5"
      },
      package: "com.appfactory.visualbell.kids.timer",
      versionCode: 1,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.VIBRATE",
        "android.permission.SCHEDULE_EXACT_ALARM"
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-notifications"
    ],
    newArchEnabled: true,
    scheme: "visualbell",
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "your-project-id-here"
      }
    }
  }
};