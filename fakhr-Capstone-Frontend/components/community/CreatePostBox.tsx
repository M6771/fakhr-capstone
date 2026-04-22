import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { libraryColors as c } from "../../constants/libraryTheme";

type Props = {
  draft: string;
  onChangeDraft: (t: string) => void;
  onOpenModal: () => void;
  onPhoto: () => void;
  onTagTopics: () => void;
  onPrivacy: () => void;
};

export function CreatePostBox({
  draft,
  onChangeDraft,
  onOpenModal,
  onPhoto,
  onTagTopics,
  onPrivacy,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color={c.textLight} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Share a parenting win or question..."
          placeholderTextColor={c.textLight}
          value={draft}
          onChangeText={onChangeDraft}
          onFocus={onOpenModal}
          multiline
        />
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={onPhoto}>
          <Ionicons name="image-outline" size={18} color={c.primary} />
          <Text style={styles.actionText}>Photo</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={onTagTopics}>
          <Ionicons name="pricetag-outline" size={18} color={c.primary} />
          <Text style={styles.actionText}>Tag Topics</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={onPrivacy}>
          <Ionicons name="eye-outline" size={18} color={c.primary} />
          <Text style={styles.actionText}>Privacy</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: c.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.headerIconBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: c.chipBg,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: c.text,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
    color: c.primary,
  },
});
