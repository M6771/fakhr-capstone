import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../context/AuthContext";

/**
 * Root index: redirect based on token presence
 */
export default function Index() {
  const router = useRouter();
  const { loading } = useAuth();
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          // Token exists, redirect to home screen
          router.replace("/(tabs)");
        } else {
          // No token, redirect to login
          router.replace("/(auth)/login");
        }
      } catch {
        // Error reading token, redirect to login
        router.replace("/(auth)/login");
      } finally {
        setTokenChecked(true);
      }
    };

    if (!loading) {
      checkToken();
    }
  }, [loading, router]);

  if (loading || !tokenChecked) {
    return null; // Show nothing while checking token
  }

  return null;
}
