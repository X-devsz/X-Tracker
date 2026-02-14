import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import Constants, { ExecutionEnvironment } from "expo-constants";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";

WebBrowser.maybeCompleteAuthSession();

type GoogleConfig = {
  webClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
  expoClientId?: string;
};

const getGoogleConfig = (): GoogleConfig => {
  const extra = Constants.expoConfig?.extra ?? {};

  return {
    webClientId:
      process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? extra.googleWebClientId,
    iosClientId:
      process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? extra.googleIosClientId,
    androidClientId:
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ??
      extra.googleAndroidClientId,
    expoClientId:
      process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID ?? extra.googleExpoClientId,
  };
};

const getExpoProjectFullName = (): string | null => {
  const extra = Constants.expoConfig?.extra ?? {};
  const envFullName = process.env.EXPO_PUBLIC_EXPO_PROJECT_FULL_NAME;
  if (envFullName) {
    return envFullName;
  }

  if (extra.expoProjectFullName) {
    return extra.expoProjectFullName;
  }

  if (Constants.expoConfig?.originalFullName) {
    return Constants.expoConfig.originalFullName;
  }

  const owner = Constants.expoConfig?.owner ?? extra.expoOwner;
  const slug = Constants.expoConfig?.slug ?? extra.expoSlug;

  if (owner && slug) {
    return `@${owner}/${slug}`;
  }

  return null;
};

const resolveRedirectUri = () => {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    const projectFullName = getExpoProjectFullName();
    if (!projectFullName) {
      throw new Error(
        "Expo Go requires EXPO_PUBLIC_EXPO_PROJECT_FULL_NAME (example: @username/expense-tracker) or an Expo account login."
      );
    }
    return `https://auth.expo.io/${projectFullName}`;
  }

  return AuthSession.makeRedirectUri({ scheme: "expensetracker" });
};

export const useGoogleSignIn = () => {
  type SignInResult = { status: "success" | "cancelled" };
  const config = getGoogleConfig();
  const redirectUri = resolveRedirectUri();
  const isExpoGo =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  const requestConfig = isExpoGo
    ? {
        clientId: config.webClientId ?? config.expoClientId,
        redirectUri,
      }
    : {
        ...config,
        redirectUri,
      };

  const [request, response, promptAsync] =
    Google.useIdTokenAuthRequest(requestConfig);

  const signInWithGoogle = async (): Promise<SignInResult> => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error("Firebase is not configured for Google sign-in.");
    }

    const result = await promptAsync();
    if (result.type === "cancel" || result.type === "dismiss") {
      return { status: "cancelled" };
    }
    if (result.type === "error") {
      throw new Error("Google sign-in failed.");
    }
    if (result.type !== "success") {
      return { status: "cancelled" };
    }

    const idToken = result.params?.id_token;
    if (!idToken) {
      throw new Error("Google sign-in did not return an ID token.");
    }

    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);
    return { status: "success" };
  };

  const signOut = async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      return;
    }

    await firebaseSignOut(auth);
  };

  return { request, response, signInWithGoogle, signOut };
};
