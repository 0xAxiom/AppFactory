export default {
  name: "WarrantyVault",
  slug: "warrantyvault",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "warrantyvault",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#2563EB"
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.appfactory.warrantyvault",
    infoPlist: {
      NSCameraUsageDescription: "WarrantyVault needs camera access to capture receipt photos",
      NSPhotoLibraryUsageDescription: "WarrantyVault needs photo library access to save and select receipt images"
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#2563EB"
    },
    package: "com.appfactory.warrantyvault",
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "RECEIVE_BOOT_COMPLETED",
      "VIBRATE"
    ]
  },
  plugins: [
    "expo-router",
    [
      "expo-image-picker",
      {
        photosPermission: "WarrantyVault needs access to your photos to store receipt images.",
        cameraPermission: "WarrantyVault needs access to your camera to capture receipt photos."
      }
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/images/notification-icon.png",
        color: "#2563EB"
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    revenuecatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || "",
    revenuecatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || "",
    eas: {
      projectId: "warrantyvault-app-factory"
    }
  }
};
