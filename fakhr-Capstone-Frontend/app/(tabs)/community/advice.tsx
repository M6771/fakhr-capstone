import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { libraryColors as c } from "../../../constants/libraryTheme";

export default function AdviceReplyScreen() {
  const router = useRouter();
  const { postId, preview } = useLocalSearchParams<{
    postId?: string;
    preview?: string;
  }>();

  const previewText = (() => {
    if (!preview) return "";
    const s = Array.isArray(preview) ? preview[0] : preview;
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  })();
  const [reply, setReply] = useState("");

  const submit = () => {
    if (!reply.trim()) {
      Alert.alert("Reply", "Please write a short message.");
      return;
    }
    Alert.alert(
      "Advice sent",
      "Thank you for supporting another parent. (mock)",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={26} color={c.text} />
        </Pressable>
        <Text style={styles.title}>Give Advice</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Thread</Text>
        <Text style={styles.preview}>
          {previewText || `Post ${postId ?? ""}`}
        </Text>
        <Text style={styles.label}>Your reply</Text>
        <TextInput
          style={styles.input}
          placeholder="Share experience, resources, or encouragement..."
          placeholderTextColor={c.textLight}
          value={reply}
          onChangeText={setReply}
          multiline
          textAlignVertical="top"
        />
        <Pressable style={styles.submit} onPress={submit}>
          <Text style={styles.submitText}>Post reply</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bgApp },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  back: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: c.text,
  },
  scroll: { padding: 20, paddingBottom: 40 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: c.textMuted,
    marginBottom: 8,
  },
  preview: {
    fontSize: 15,
    lineHeight: 22,
    color: c.text,
    marginBottom: 20,
    backgroundColor: c.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.inputBorder,
  },
  input: {
    minHeight: 140,
    backgroundColor: c.white,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.inputBorder,
    padding: 14,
    fontSize: 15,
    color: c.text,
    marginBottom: 20,
  },
  submit: {
    backgroundColor: c.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: { color: c.white, fontSize: 16, fontWeight: "700" },
});
