import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, signOut } from 'firebase/auth';
import { getFirebaseAuth } from './firebase';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
});

export const useGoogleSignIn = () => {
  const signInWithGoogle = async () => {
    try {
      console.log('Checking Google Play Services...');

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      console.log('Starting Google Sign-In...');

      const response = await GoogleSignin.signIn();
      const idToken = response.idToken;

      if (!idToken) {
        throw new Error('No ID token received from Google.');
      }

      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error('Firebase is not configured for Google sign-in.');
      }

      console.log('Signing in to Firebase...');

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);

      console.log('Firebase sign-in success:', userCredential.user.email);

      return userCredential.user;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      throw error;
    }
  };

  const signOutAsync = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      const auth = getFirebaseAuth();
      if (auth) {
        await signOut(auth);
      }

      console.log('Signed out successfully');
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  return { signInWithGoogle, signInAsync: signInWithGoogle, signOut: signOutAsync };
};
