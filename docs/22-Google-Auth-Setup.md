# 22 - Google Sign-In + Firebase Auth Setup

This guide wires the existing auth UI to real Google sign-in using Firebase.
It matches the current codebase and Expo configuration.
Recommended path: Custom dev client (native Google Sign-In).

## 1) Create Firebase project
1. Go to Firebase Console -> Add project.
2. Enable Authentication -> Sign-in method -> Google.

## 2) Register app credentials
Add platform apps in Firebase and copy IDs.

### Web
1. Firebase Console -> Project Settings -> Add app -> Web.
2. Copy the Web config values.

### Android (required for native builds)
1. Confirm the package ID in `app.json`:
   - `expo.android.package` is `com.ifham.expensetracker`
2. Firebase Console -> Add app -> Android.
3. Use the same package name: `com.ifham.expensetracker`.
4. Add SHA-1:
   - Use `./gradlew signingReport` or `keytool` for your keystore.

### iOS (required for native builds)
1. Confirm the bundle ID in `app.json`:
   - `expo.ios.bundleIdentifier` is `com.ifham.expensetracker`
2. Firebase Console -> Add app -> iOS and use that bundle ID.

## 3) Place Google service files
1. Download `google-services.json` and put it at the project root.
2. Download `GoogleService-Info.plist` and put it at the project root.
3. Ensure `app.json` points to them:
   - `expo.android.googleServicesFile` -> `./google-services.json`
   - `expo.ios.googleServicesFile` -> `./GoogleService-Info.plist`
4. Do not keep copies under `src/`; remove any duplicates if present.

## 4) Create Google OAuth client IDs
In Google Cloud Console (or Firebase):
- Web client ID -> use for `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
- Android client ID -> use for `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`.
- iOS client ID -> use for `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`.
- Expo Go client ID (optional) -> use for `EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID`.

## 5) Add environment variables
Create a `.env` file at the project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID

EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=YOUR_GOOGLE_ANDROID_CLIENT_ID
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=YOUR_GOOGLE_IOS_CLIENT_ID
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=YOUR_GOOGLE_EXPO_CLIENT_ID
```

If you prefer app config, you can also place these values in `app.json` -> `expo.extra`.

## 6) Verify Expo scheme
The Google auth flow uses:
- `scheme: "expensetracker"`

This is already set in `app.json`. If you change it, update:
- `src/services/auth/google.ts`

## 7) Custom dev client (native Google picker, recommended)
This flow avoids the Expo Go redirect and uses the native Google account picker.

1. Ensure `app.json` includes the plugin:
   - `@react-native-google-signin/google-signin`
2. Install the native module:
   - `npx expo install @react-native-google-signin/google-signin`
3. Add your Android SHA-1 in Firebase and Google Cloud Console.
4. Download a fresh `google-services.json` to the project root.
5. Build a dev client:
   - `npx expo prebuild --clean`
   - `npx expo run:android`

## 8) Expo Go fallback (browser flow)
If you must use Expo Go, add the Expo redirect URI to your OAuth web client:

1. Set the redirect URI in Google Cloud Console:
   - `https://auth.expo.io/@YOUR_EXPO_USERNAME/expense-tracker`
2. Ensure `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is set in `.env`.
3. If Expo cannot infer the project full name, set:
   - `EXPO_PUBLIC_EXPO_PROJECT_FULL_NAME=@YOUR_EXPO_USERNAME/expense-tracker`

## 9) Run and test
1. Restart Expo: `npx expo start -c`
2. Open the app -> Welcome -> Sign Up / Log In -> Google button.
3. On success, the auth guard should route to `(tabs)`.

## Notes about auth persistence
- The current setup uses Firebase Auth without React Native persistence.
- This means sessions may not survive a full app restart until persistence is added.
- If you want persistence, install a Firebase build that includes
  `firebase/auth/react-native` and update `src/services/auth/firebase.ts`.

## Code locations (for reference)
- Firebase init: `src/services/auth/firebase.ts`
- Google sign-in hook: `src/services/auth/google.ts`
- Auth state tracking: `src/services/auth/session.ts`
- Auth store: `src/store/useAuthStore.ts`
- Auth guard: `src/app/_layout.tsx`
- UI entry points: `src/app/(auth)/login.tsx`, `src/app/(auth)/signup.tsx`
