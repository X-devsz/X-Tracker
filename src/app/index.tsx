/**
 * App Entry — Route redirect
 *
 * Redirects to tabs (main app) on start.
 * Auth guard will be added later to redirect unauthenticated users.
 */
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(tabs)" />;
}
