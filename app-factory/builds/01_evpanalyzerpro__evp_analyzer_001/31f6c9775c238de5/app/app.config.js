export default {
  name: "EVP Analyzer Pro",
  slug: "evp-analyzer-pro",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#1a1a1a"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.appfactory.evpanalyzerpro"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#1a1a1a"
    },
    package: "com.appfactory.evpanalyzerpro"
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  scheme: "evp-analyzer-pro",
  plugins: [
    "expo-router"
  ],
  extra: {
    revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
    revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
    eas: {
      projectId: "PLACEHOLDER_EAS_PROJECT_ID"
    }
  }
};