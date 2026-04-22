import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { DirectoryListing } from "../../../components/directory/types";
import { libraryColors as c } from "../../../constants/libraryTheme";
import { saveMockBooking } from "../../../utils/mockBookingsStore";

const TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:30 PM",
];

function parseListing(raw: string | string[] | undefined): DirectoryListing | null {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (!s) return null;
  const tryParse = (x: string) => JSON.parse(x) as DirectoryListing;
  try {
    return tryParse(decodeURIComponent(s));
  } catch {
    try {
      return tryParse(s);
    } catch {
      return null;
    }
  }
}

function formatDateChip(d: Date): { key: string; line1: string; line2: string } {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    key: d.toISOString().slice(0, 10),
    line1: days[d.getDay()],
    line2: String(d.getDate()),
  };
}

export default function BookingScreen() {
  const router = useRouter();
  const { item: itemParam } = useLocalSearchParams<{ item?: string }>();
  const listing = useMemo(() => parseListing(itemParam), [itemParam]);

  const dateOptions = useMemo(() => {
    const out: { key: string; line1: string; line2: string }[] = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      out.push(formatDateChip(d));
    }
    return out;
  }, []);

  const [selectedDateKey, setSelectedDateKey] = useState(
    () => dateOptions[0]?.key ?? ""
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const selectedDateLabel = useMemo(() => {
    const opt = dateOptions.find((d) => d.key === selectedDateKey);
    if (!opt) return "";
    return `${opt.line1} ${opt.line2}`;
  }, [dateOptions, selectedDateKey]);

  const confirm = () => {
    if (!listing) {
      Alert.alert("Error", "Missing listing.");
      return;
    }
    if (!patientName.trim() || !phone.trim()) {
      Alert.alert("Required", "Please enter full name and phone number.");
      return;
    }
    if (!selectedTime) {
      Alert.alert("Required", "Please select a time slot.");
      return;
    }
    saveMockBooking({
      listingName: listing.name,
      dateLabel: `${selectedDateLabel} (${selectedDateKey})`,
      timeLabel: selectedTime,
      patientName: patientName.trim(),
      phone: phone.trim(),
      notes: notes.trim() || undefined,
    });
    Alert.alert(
      "Booking confirmed",
      `Your appointment with ${listing.name} is saved (mock).`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  if (!listing) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={c.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <View style={{ width: 44 }} />
        </View>
        <Text style={styles.missing}>Unable to load this booking.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={c.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Image
            source={{ uri: listing.imageUrl }}
            style={styles.summaryImage}
            contentFit="cover"
          />
          <View style={styles.summaryText}>
            <Text style={styles.summaryName}>{listing.name}</Text>
            <Text style={styles.summarySub}>{listing.subtitle}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#D4A017" />
              <Text style={styles.ratingNum}>{listing.rating}</Text>
            </View>
            <View style={styles.locRow}>
              <Ionicons name="location-outline" size={14} color={c.textMuted} />
              <Text style={styles.locSmall}>{listing.locationLine}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Select date</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateStrip}
        >
          {dateOptions.map((d) => {
            const sel = d.key === selectedDateKey;
            return (
              <Pressable
                key={d.key}
                onPress={() => setSelectedDateKey(d.key)}
                style={({ pressed }) => [
                  styles.dateChip,
                  sel && styles.dateChipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.dateLine1, sel && styles.dateLineSel]}>
                  {d.line1}
                </Text>
                <Text style={[styles.dateLine2, sel && styles.dateLineSel]}>
                  {d.line2}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionLabel}>Available times</Text>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((t) => {
            const sel = selectedTime === t;
            return (
              <Pressable
                key={t}
                onPress={() => setSelectedTime(t)}
                style={({ pressed }) => [
                  styles.timeCell,
                  sel && styles.timeCellSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.timeText, sel && styles.timeTextSel]}>
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Patient information</Text>
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          placeholderTextColor={c.textLight}
          value={patientName}
          onChangeText={setPatientName}
        />
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="05xxxxxxxx"
          placeholderTextColor={c.textLight}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.sectionLabel}>Notes (optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Anything we should know?"
          placeholderTextColor={c.textLight}
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
        />

        <View style={styles.recap}>
          <Text style={styles.recapTitle}>Summary</Text>
          <Text style={styles.recapLine}>
            <Text style={styles.recapBold}>When: </Text>
            {selectedDateLabel}
            {selectedTime ? ` at ${selectedTime}` : ""}
          </Text>
          <Text style={styles.recapLine}>
            <Text style={styles.recapBold}>With: </Text>
            {listing.name}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.callSupport, pressed && styles.pressed]}
          onPress={() =>
            Linking.openURL(`tel:${listing.phone.replace(/\s/g, "")}`).catch(
              () => {}
            )
          }
        >
          <Ionicons name="call-outline" size={18} color={c.primary} />
          <Text style={styles.callSupportText}>Call Center</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.confirmBtn, pressed && styles.pressed]}
          onPress={confirm}
        >
          <Text style={styles.confirmText}>Confirm Booking</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bgApp },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: c.text,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32 },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: c.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.inputBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryImage: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: c.chipBg,
  },
  summaryText: { flex: 1, marginLeft: 12, justifyContent: "center" },
  summaryName: {
    fontSize: 16,
    fontWeight: "700",
    color: c.text,
    marginBottom: 4,
  },
  summarySub: { fontSize: 13, color: c.textMuted, marginBottom: 6 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  ratingNum: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "700",
    color: c.text,
  },
  locRow: { flexDirection: "row", alignItems: "center" },
  locSmall: { marginLeft: 4, fontSize: 12, color: c.textMuted, flex: 1 },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: c.text,
    marginBottom: 10,
    marginTop: 4,
  },
  dateStrip: { paddingBottom: 8, flexDirection: "row" },
  dateChip: {
    width: 56,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 14,
    backgroundColor: c.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.inputBorder,
    alignItems: "center",
  },
  dateChipSelected: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
  dateLine1: { fontSize: 11, fontWeight: "600", color: c.textMuted },
  dateLine2: { fontSize: 16, fontWeight: "700", color: c.text, marginTop: 2 },
  dateLineSel: { color: c.white },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  timeCell: {
    width: "31%",
    marginBottom: 10,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: c.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.inputBorder,
    alignItems: "center",
  },
  timeCellSelected: {
    backgroundColor: c.selectedCardBg,
    borderColor: c.primary,
  },
  timeText: { fontSize: 13, fontWeight: "600", color: c.text },
  timeTextSel: { color: c.primary },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: c.textMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: c.white,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: c.text,
    marginBottom: 14,
  },
  textArea: {
    backgroundColor: c.white,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 90,
    fontSize: 15,
    color: c.text,
    marginBottom: 18,
  },
  recap: {
    backgroundColor: c.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.inputBorder,
  },
  recapTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: c.text,
    marginBottom: 8,
  },
  recapLine: { fontSize: 14, color: c.textMuted, marginBottom: 4 },
  recapBold: { fontWeight: "700", color: c.text },
  callSupport: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginBottom: 10,
  },
  callSupportText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "700",
    color: c.primary,
  },
  confirmBtn: {
    backgroundColor: c.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  confirmText: { color: c.white, fontSize: 17, fontWeight: "700" },
  missing: { padding: 24, fontSize: 15, color: c.textMuted, textAlign: "center" },
  pressed: { opacity: 0.9 },
});
