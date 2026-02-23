import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFirebaseAuth } from './firebase';
import { setAuthToken } from './secureStore';
import type { AuthUser } from './types';

const mapUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

export const subscribeToAuthState = (onChange: (user: AuthUser | null) => void) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    return () => undefined;
  }

  return onAuthStateChanged(auth, (user) => {
    void (async () => {
      if (user) {
        const token = await user.getIdToken();
        await setAuthToken(token);
        onChange(mapUser(user));
      } else {
        await setAuthToken(null);
        onChange(null);
      }
    })();
  });
};

export const signOutUser = async () => {
  const auth = getFirebaseAuth();
  if (!auth) {
    return;
  }

  await signOut(auth);
  await setAuthToken(null);
};
