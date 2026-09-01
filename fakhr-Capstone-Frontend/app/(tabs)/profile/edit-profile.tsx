import { Redirect } from "expo-router";

/** Kept so old links still work. Profile tab renders index.tsx. */
export default function EditProfileAlias() {
  return <Redirect href="/(tabs)/profile" />;
}
