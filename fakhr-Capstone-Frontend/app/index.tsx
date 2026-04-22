import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { CreateAccountScreen } from "../components/screens/CreateAccountScreen";
import { useAuth } from "../context/AuthContext";

/**
 * Root index: authenticated users go to tabs; guests land on Create Account (MVP entry).
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

  return <CreateAccountScreen />;
}
