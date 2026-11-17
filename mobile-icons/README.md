# Grovia Mobile app icons

The six icons the **Grovia Mobile** course (Expo SDK 58 and React Native) gives its app, in the chapter "Native
modules and the app config". They keep the Expo template's file names, so copy all six into your app's
`apps/mobile/assets/images/`, replacing the template's.

| File | Size | Where the app config uses it |
| :-- | :-- | :-- |
| `icon.png` | 1024 × 1024, no transparency | `icon`: the app icon |
| `splash-icon.png` | 1024 × 1024, transparent | the `expo-splash-screen` plugin's `image` |
| `favicon.png` | 48 × 48 | `web.favicon` |
| `android-icon-background.png` | 1024 × 1024 | `android.adaptiveIcon.backgroundImage` |
| `android-icon-foreground.png` | 1024 × 1024, transparent | `android.adaptiveIcon.foregroundImage` |
| `android-icon-monochrome.png` | 1024 × 1024, transparent | `android.adaptiveIcon.monochromeImage` (themed icons) |
