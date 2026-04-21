import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@tanstack/react-query";
import { createChild } from "../../../api/children.api";

// Design system colors
const colors = {
  bgApp: "#FAF9F6",
  bgCard: "#FFFFFF",
  primary: "#7FB77E",
  primaryLight: "#E8F5E8",
  secondary: "#5F8F8B",
  text: "#2F2F2F",
  textSecondary: "#4A4A4A",
  textMuted: "#8A8A8A",
  border: "rgba(0, 0, 0, 0.08)",
  error: "#D9534F",
  errorLight: "#FDECEA",
};

// Form steps
const STEPS = [
  { id: 1, title: "Basic Info", icon: "person-outline" },
  { id: 2, title: "Diagnosis", icon: "medical-outline" },
  { id: 3, title: "Medications", icon: "medkit-outline" },
  { id: 4, title: "Allergies", icon: "warning-outline" },
];

// Diagnosis options
const DIAGNOSIS_OPTIONS = [
  { id: "add", label: "ADD", description: "Attention Deficit Disorder" },
  { id: "adhd", label: "ADHD", description: "Attention Deficit Hyperactivity Disorder" },
  { id: "autism", label: "Autism", description: "Autism Spectrum Disorder" },
  { id: "dyslexia", label: "Dyslexia", description: "Reading and Learning Disorder" },
  { id: "speech", label: "Speech Delay", description: "Speech and Language Delay" },
  { id: "sensory", label: "SPD", description: "Sensory Processing Disorder" },
  { id: "other", label: "Other", description: "Other diagnosis" },
];

// Common allergies
const COMMON_ALLERGIES = [
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Wheat",
  "Soy",
  "Fish",
  "Shellfish",
  "Latex",
  "Penicillin",
];

export default function AddChildScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  // Form state
  const [formData, setFormData] = React.useState({
    // Basic Info
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    // Diagnosis
    diagnoses: [] as string[],
    diagnosisDate: "",
    diagnosisNotes: "",
    // Medications
    medications: [] as { name: string; dosage: string; frequency: string }[],
    currentMedication: { name: "", dosage: "", frequency: "" },
    // Allergies
    allergies: [] as string[],
    allergyNotes: "",
  });

  // Format date to DD/MM/YYYY
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number | undefined => {
    if (!dateOfBirth) return undefined;
    const parts = dateOfBirth.split("/");
    if (parts.length !== 3) return undefined;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const birthDate = new Date(year, month, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle date picker change
  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (date) {
        setSelectedDate(date);
        setFormData((prev) => ({ ...prev, dateOfBirth: formatDate(date) }));
      }
    } else if (Platform.OS === "ios") {
      // On iOS, update selected date in real-time as user scrolls
      if (date) {
        setSelectedDate(date);
      }
    }
  };

  // Open date picker
  const openDatePicker = () => {
    // Initialize with current date if no date is selected
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
    setShowDatePicker(true);
  };

  // Confirm date on iOS
  const confirmDate = () => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, dateOfBirth: formatDate(selectedDate) }));
    }
    setShowDatePicker(false);
  };

  // Cancel date picker on iOS
  const cancelDatePicker = () => {
    // Reset to previous date if user cancels
    if (formData.dateOfBirth) {
      // Parse existing date if available
      const parts = formData.dateOfBirth.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        setSelectedDate(new Date(year, month, day));
      }
    }
    setShowDatePicker(false);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const validateStep1 = (): boolean => {
    if (!formData.firstName.trim()) {
      Alert.alert("Validation Error", "Please enter the child's first name.");
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert("Validation Error", "Please enter the child's last name.");
      return false;
    }
    if (!formData.dateOfBirth) {
      Alert.alert("Validation Error", "Please select the child's date of birth.");
      return false;
    }
    return true;
  };

  const handleStep1Submit = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const validateStep2 = (): boolean => {
    if (formData.diagnoses.length === 0) {
      Alert.alert("Validation Error", "Please select at least one diagnosis.");
      return false;
    }
    return true;
  };

  const handleStep2Submit = () => {
    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleStep3Submit = () => {
    // Medications step is optional, so no validation needed
    setCurrentStep(4);
  };

  // Create child mutation
  const createChildMutation = useMutation({
    mutationFn: createChild,
    onSuccess: (data) => {
      Alert.alert(
        "Child Added Successfully",
        `${formData.firstName} ${formData.lastName} has been added to your profile.`,
        [
          {
            text: "View Profile",
            onPress: () => router.replace("/(tabs)/profile"),
          },
        ]
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.message || "Failed to add child. Please try again."
      );
    },
  });

  const handleSubmit = () => {
    // Prepare data for API
    const childData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      age: calculateAge(formData.dateOfBirth),
      gender: formData.gender || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      diagnosis: formData.diagnoses.length > 0 ? formData.diagnoses : undefined,
      medicalHistory: formData.diagnosisNotes
        ? `${formData.diagnosisNotes}${formData.allergyNotes ? `\n\nAllergy Notes: ${formData.allergyNotes}` : ""}`
        : formData.allergyNotes
          ? `Allergy Notes: ${formData.allergyNotes}`
          : undefined,
      medications: formData.medications.length > 0 ? formData.medications : undefined,
      allergies: formData.allergies.length > 0 ? formData.allergies : undefined,
    };

    createChildMutation.mutate(childData);
  };

  const toggleDiagnosis = (diagnosisId: string) => {
    setFormData((prev) => ({
      ...prev,
      diagnoses: prev.diagnoses.includes(diagnosisId)
        ? prev.diagnoses.filter((d) => d !== diagnosisId)
        : [...prev.diagnoses, diagnosisId],
    }));
  };

  const toggleAllergy = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy],
    }));
  };

  const addMedication = () => {
    if (formData.currentMedication.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        medications: [...prev.medications, prev.currentMedication],
        currentMedication: { name: "", dosage: "", frequency: "" },
      }));
    }
  };

  const removeMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, index) => (
        <React.Fragment key={step.id}>
          <Pressable
            style={[
              styles.stepDot,
              currentStep >= step.id && styles.stepDotActive,
              currentStep === step.id && styles.stepDotCurrent,
            ]}
            onPress={() => step.id < currentStep && setCurrentStep(step.id)}
          >
            {currentStep > step.id ? (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            ) : (
              <Text
                style={[
                  styles.stepNumber,
                  currentStep >= step.id && styles.stepNumberActive,
                ]}
              >
                {step.id}
              </Text>
            )}
          </Pressable>
          {index < STEPS.length - 1 && (
            <View
              style={[
                styles.stepLine,
                currentStep > step.id && styles.stepLineActive,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name="person-outline" size={22} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <Text style={styles.sectionSubtitle}>
            Enter your child basic details
          </Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>First Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          placeholderTextColor={colors.textMuted}
          value={formData.firstName}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, firstName: text }))
          }
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Last Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          placeholderTextColor={colors.textMuted}
          value={formData.lastName}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, lastName: text }))
          }
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Date of Birth *</Text>
        <Pressable style={styles.dateInput} onPress={openDatePicker}>
          <Text
            style={[
              styles.dateInputText,
              !formData.dateOfBirth && styles.dateInputPlaceholder,
            ]}
          >
            {formData.dateOfBirth || "DD/MM/YYYY"}
          </Text>
          <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
        </Pressable>
        {Platform.OS === "ios" && showDatePicker && (
          <Modal
            transparent
            animationType="slide"
            visible={showDatePicker}
            onRequestClose={cancelDatePicker}
          >
            <View style={styles.datePickerModal}>
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <Pressable onPress={cancelDatePicker}>
                    <Text style={styles.datePickerButton}>Cancel</Text>
                  </Pressable>
                  <Text style={styles.datePickerTitle}>Select Date</Text>
                  <Pressable onPress={confirmDate}>
                    <Text style={[styles.datePickerButton, styles.datePickerButtonConfirm]}>
                      Done
                    </Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              </View>
            </View>
          </Modal>
        )}
        {Platform.OS === "android" && showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Gender</Text>
        <View style={styles.genderRow}>
          {["Male", "Female"].map((gender) => (
            <Pressable
              key={gender}
              style={[
                styles.genderOption,
                formData.gender === gender && styles.genderOptionActive,
              ]}
              onPress={() => setFormData((prev) => ({ ...prev, gender }))}
            >
              <Ionicons
                name={gender === "Male" ? "male" : "female"}
                size={20}
                color={formData.gender === gender ? "#FFFFFF" : colors.textSecondary}
              />
              <Text
                style={[
                  styles.genderText,
                  formData.gender === gender && styles.genderTextActive,
                ]}
              >
                {gender}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          pressed && { opacity: 0.8 },
        ]}
        onPress={handleStep1Submit}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  const renderDiagnosis = () => (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name="medical-outline" size={22} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <Text style={styles.sectionSubtitle}>
            Select at least one diagnosis *
          </Text>
        </View>
      </View>

      <View style={styles.diagnosisList}>
        {DIAGNOSIS_OPTIONS.map((diagnosis) => (
          <Pressable
            key={diagnosis.id}
            style={[
              styles.diagnosisCard,
              formData.diagnoses.includes(diagnosis.id) &&
              styles.diagnosisCardActive,
            ]}
            onPress={() => toggleDiagnosis(diagnosis.id)}
          >
            <View style={styles.diagnosisContent}>
              <Text
                style={[
                  styles.diagnosisLabel,
                  formData.diagnoses.includes(diagnosis.id) &&
                  styles.diagnosisLabelActive,
                ]}
              >
                {diagnosis.label}
              </Text>
              <Text style={styles.diagnosisDesc}>{diagnosis.description}</Text>
            </View>
            <View
              style={[
                styles.checkbox,
                formData.diagnoses.includes(diagnosis.id) &&
                styles.checkboxActive,
              ]}
            >
              {formData.diagnoses.includes(diagnosis.id) && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Diagnosis Date</Text>
        <TextInput
          style={styles.input}
          placeholder="When was the diagnosis made?"
          placeholderTextColor={colors.textMuted}
          value={formData.diagnosisDate}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, diagnosisDate: text }))
          }
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Additional Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any additional information about the diagnosis..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          value={formData.diagnosisNotes}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, diagnosisNotes: text }))
          }
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          pressed && { opacity: 0.8 },
        ]}
        onPress={handleStep2Submit}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  const renderMedications = () => (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name="medkit-outline" size={22} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Medications</Text>
          <Text style={styles.sectionSubtitle}>
            Add current medications (optional)
          </Text>
        </View>
      </View>

      {/* Existing medications */}
      {formData.medications.length > 0 && (
        <View style={styles.medicationsList}>
          {formData.medications.map((med, index) => (
            <View key={index} style={styles.medicationCard}>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{med.name}</Text>
                <Text style={styles.medicationDetails}>
                  {med.dosage} • {med.frequency}
                </Text>
              </View>
              <Pressable
                style={styles.removeButton}
                onPress={() => removeMedication(index)}
              >
                <Ionicons name="close-circle" size={24} color={colors.error} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Add new medication */}
      <View style={styles.addMedicationCard}>
        <Text style={styles.addMedicationTitle}>Add Medication</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Medication Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Ritalin, Adderall"
            placeholderTextColor={colors.textMuted}
            value={formData.currentMedication.name}
            onChangeText={(text) =>
              setFormData((prev) => ({
                ...prev,
                currentMedication: { ...prev.currentMedication, name: text },
              }))
            }
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Dosage</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 10mg"
              placeholderTextColor={colors.textMuted}
              value={formData.currentMedication.dosage}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  currentMedication: { ...prev.currentMedication, dosage: text },
                }))
              }
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Frequency</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Daily"
              placeholderTextColor={colors.textMuted}
              value={formData.currentMedication.frequency}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  currentMedication: { ...prev.currentMedication, frequency: text },
                }))
              }
            />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && { opacity: 0.8 },
            !formData.currentMedication.name.trim() && styles.addButtonDisabled,
          ]}
          onPress={addMedication}
          disabled={!formData.currentMedication.name.trim()}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Medication</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          pressed && { opacity: 0.8 },
        ]}
        onPress={handleStep3Submit}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  const renderAllergies = () => (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name="warning-outline" size={22} color={colors.error} />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Allergies</Text>
          <Text style={styles.sectionSubtitle}>
            Select known allergies (optional)
          </Text>
        </View>
      </View>

      <Text style={styles.subsectionTitle}>Common Allergies</Text>
      <View style={styles.allergiesGrid}>
        {COMMON_ALLERGIES.map((allergy) => (
          <Pressable
            key={allergy}
            style={[
              styles.allergyChip,
              formData.allergies.includes(allergy) && styles.allergyChipActive,
            ]}
            onPress={() => toggleAllergy(allergy)}
          >
            <Text
              style={[
                styles.allergyChipText,
                formData.allergies.includes(allergy) &&
                styles.allergyChipTextActive,
              ]}
            >
              {allergy}
            </Text>
            {formData.allergies.includes(allergy) && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Other Allergies or Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="List any other allergies or reactions..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          value={formData.allergyNotes}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, allergyNotes: text }))
          }
        />
      </View>

      {formData.allergies.length > 0 && (
        <View style={styles.selectedAllergies}>
          <Text style={styles.selectedTitle}>Selected Allergies:</Text>
          <View style={styles.selectedList}>
            {formData.allergies.map((allergy) => (
              <View key={allergy} style={styles.selectedBadge}>
                <Ionicons name="alert-circle" size={14} color={colors.error} />
                <Text style={styles.selectedBadgeText}>{allergy}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.doneButton,
          pressed && { opacity: 0.8 },
          createChildMutation.isPending && styles.doneButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={createChildMutation.isPending}
      >
        {createChildMutation.isPending ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.doneButtonText}>Done</Text>
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          </>
        )}
      </Pressable>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderDiagnosis();
      case 3:
        return renderMedications();
      case 4:
        return renderAllergies();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Add Child</Text>
          <Text style={styles.headerSubtitle}>
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Form Content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderCurrentStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && { opacity: 0.7 },
          ]}
          onPress={handleBack}
        >
          <Text style={styles.secondaryButtonText}>
            {currentStep === 1 ? "Cancel" : "Back"}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.primaryButtonText}>
            {currentStep === 4 ? "Save Child" : "Continue"}
          </Text>
          <Ionicons
            name={currentStep === 4 ? "checkmark" : "arrow-forward"}
            size={18}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  // Step Indicator
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepDotCurrent: {
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: colors.bgCard,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  stepNumberActive: {
    color: colors.primary,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  // Form Section
  formSection: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  // Input
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.bgApp,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateInput: {
    backgroundColor: colors.bgApp,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInputText: {
    fontSize: 15,
    color: colors.text,
  },
  dateInputPlaceholder: {
    color: colors.textMuted,
  },
  datePickerModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  datePickerContainer: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  datePickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  datePickerButton: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  datePickerButtonConfirm: {
    color: colors.primary,
    fontWeight: "600",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  // Gender
  genderRow: {
    flexDirection: "row",
    gap: 12,
  },
  genderOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.bgApp,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  genderOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  genderTextActive: {
    color: "#FFFFFF",
  },
  // Submit Button
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Done Button
  doneButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  doneButtonDisabled: {
    opacity: 0.6,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Diagnosis
  diagnosisList: {
    gap: 10,
    marginBottom: 20,
  },
  diagnosisCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.bgApp,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  diagnosisCardActive: {
    backgroundColor: `${colors.primary}10`,
    borderColor: colors.primary,
  },
  diagnosisContent: {
    flex: 1,
  },
  diagnosisLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  diagnosisLabelActive: {
    color: colors.primary,
  },
  diagnosisDesc: {
    fontSize: 12,
    color: colors.textMuted,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.bgCard,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  // Medications
  medicationsList: {
    gap: 10,
    marginBottom: 20,
  },
  medicationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgApp,
    borderRadius: 12,
    padding: 14,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  medicationDetails: {
    fontSize: 13,
    color: colors.textMuted,
  },
  removeButton: {
    padding: 4,
  },
  addMedicationCard: {
    backgroundColor: colors.bgApp,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  addMedicationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 4,
  },
  addButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Allergies
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 12,
  },
  allergiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  allergyChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.bgApp,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  allergyChipActive: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  allergyChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  allergyChipTextActive: {
    color: "#FFFFFF",
  },
  selectedAllergies: {
    backgroundColor: colors.errorLight,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  selectedTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.error,
    marginBottom: 10,
  },
  selectedList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.bgCard,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.error,
  },
  // Bottom Navigation
  bottomNav: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  secondaryButton: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.bgApp,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  primaryButton: {
    flex: 0.6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
