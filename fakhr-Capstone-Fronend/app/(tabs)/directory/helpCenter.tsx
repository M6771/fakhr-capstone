import { useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { sendHelpMessage } from "../../../api/helpCenter.api";
import {
    colors,
    spacing,
    typography,
    radius,
} from "../../../theme";

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export default function HelpCenterScreen() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hello! I'm here to help you with any questions about Fakhr. How can I assist you today?",
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);

    const sendMessageMutation = useMutation({
        mutationFn: sendHelpMessage,
        onSuccess: (response) => {
            const aiMessage: Message = {
                id: Date.now().toString(),
                text: response.message || "I'm here to help!",
                isUser: false,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        },
        onError: (error: any) => {
            const errorMessage: Message = {
                id: Date.now().toString(),
                text: error?.message || "Sorry, I couldn't process your request. Please try again.",
                isUser: false,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        },
    });

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");

        // Scroll to bottom
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Send to API
        sendMessageMutation.mutate({ message: inputText });
    };

    useEffect(() => {
        // Scroll to bottom when new message is added
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerLeftButton}
                        onPress={() => router.replace("/(tabs)")}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Help Center</Text>
                        <Text style={styles.headerSubtitle}>AI Assistant</Text>
                    </View>
                    <View style={styles.headerRightSpacer} />
                </View>

                {/* Messages */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            style={[
                                styles.messageWrapper,
                                message.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
                            ]}
                        >
                            <View
                                style={[
                                    styles.messageBubble,
                                    message.isUser ? styles.userMessage : styles.aiMessage,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.messageText,
                                        message.isUser ? styles.userMessageText : styles.aiMessageText,
                                    ]}
                                >
                                    {message.text}
                                </Text>
                            </View>
                            {!message.isUser && (
                                <View style={styles.aiIcon}>
                                    <Ionicons name="sparkles" size={16} color={colors.primary} />
                                </View>
                            )}
                        </View>
                    ))}
                    {sendMessageMutation.isPending && (
                        <View style={[styles.messageWrapper, styles.aiMessageWrapper]}>
                            <View style={[styles.messageBubble, styles.aiMessage]}>
                                <ActivityIndicator size="small" color={colors.primary} />
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        placeholderTextColor={colors.textLight}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                        editable={!sendMessageMutation.isPending}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!inputText.trim() || sendMessageMutation.isPending) && styles.sendButtonDisabled,
                        ]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || sendMessageMutation.isPending}
                        activeOpacity={0.7}
                    >
                        {sendMessageMutation.isPending ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Ionicons name="send" size={20} color="#FFFFFF" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        position: "relative",
    },
    headerLeftButton: {
        position: "absolute",
        left: spacing.xl,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    headerContent: {
        alignItems: "center",
        justifyContent: "center",
    },
    headerRightSpacer: {
        width: 40,
        height: 40,
        position: "absolute",
        right: spacing.xl,
    },
    headerTitle: {
        fontSize: typography.h1,
        fontWeight: typography.weightBold,
        color: colors.text,
        marginBottom: 4,
        textAlign: "center",
    },
    headerSubtitle: {
        fontSize: typography.body,
        color: colors.textMuted,
        textAlign: "center",
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    messageWrapper: {
        flexDirection: "row",
        marginBottom: spacing.md,
        alignItems: "flex-end",
    },
    userMessageWrapper: {
        justifyContent: "flex-end",
    },
    aiMessageWrapper: {
        justifyContent: "flex-start",
    },
    messageBubble: {
        maxWidth: "75%",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.lg,
    },
    userMessage: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
    },
    aiMessage: {
        backgroundColor: colors.backgroundCard,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    messageText: {
        fontSize: typography.body,
        lineHeight: 20,
    },
    userMessageText: {
        color: "#FFFFFF",
    },
    aiMessageText: {
        color: colors.text,
    },
    aiIcon: {
        marginLeft: spacing.xs,
        marginBottom: spacing.xs,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: typography.body,
        color: colors.text,
        backgroundColor: colors.backgroundCard,
        maxHeight: 100,
        marginRight: spacing.sm,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    sendButtonDisabled: {
        backgroundColor: colors.textLight,
        opacity: 0.5,
    },
});
