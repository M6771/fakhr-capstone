import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Root index: authenticated users → tabs; guests → signup stack (Create Account first).
 */
export default function Index() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace("/(tabs)");
    }
    setBootstrapped(true);
  }, [loading, user, router]);

  if (loading || !bootstrapped) {
    return null;
  }

  if (user) {
    return null;
  }

  return <Redirect href="/(signup)" />;
}
