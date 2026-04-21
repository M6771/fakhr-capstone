import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Root index: redirect after auth bootstrap (user restored from API or SecureStore cache).
 */
export default function Index() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/login");
    }
    setRedirected(true);
  }, [loading, user, router]);

  if (loading || !redirected) {
    return null;
  }

  return null;
}
