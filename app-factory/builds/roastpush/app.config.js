export default {
  expo: {
    name: "RoastPush",
    slug: "roastpush",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "roastpush",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#1a1a1a"
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.roastpush.app",
      infoPlist: {
        UIBackgroundModes: ["fetch", "remote-notification"]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#1a1a1a"
      },
      package: "com.roastpush.app",
      permissions: ["RECEIVE_BOOT_COMPLETED", "VIBRATE", "SCHEDULE_EXACT_ALARM"]
    },
    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#FF4500"
        }
      ],
      "expo-font"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      revenueCatApiKeyApple: "appl_REPLACE_WITH_YOUR_KEY",
      revenueCatApiKeyGoogle: "goog_REPLACE_WITH_YOUR_KEY"
    }
  }
};
