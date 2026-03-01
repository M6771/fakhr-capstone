import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getCenters } from "../../api/directory.api";
import { HealthCenter } from "../../types/directory.types";
import { getCurrentUser } from "../../api/users.api";
import { useAuth } from "../../context/AuthContext";

// Organized resource data by category
const RESOURCES = {
  add: {
    videos: [
      {
        id: "v1",
        title: "Understanding ADD in Children",
        description:
          "Learn about Attention Deficit Disorder symptoms and support",
        duration: "8 min",
        url: "https://www.youtube.com/watch?v=ouZrZa5pLXk",
        source: "YouTube",
      },
      {
        id: "v2",
        title: "ADD Strategies for Parents",
        description: "Practical tips for supporting your child with ADD",
        duration: "12 min",
        url: "https://www.youtube.com/watch?v=Li_tcua0AJI",
        source: "YouTube",
      },
    ],
    articles: [
      {
        id: "a1",
        title: "ADD vs ADHD: What's the Difference?",
        description:
          "Understanding the distinction between ADD and ADHD diagnoses",
        readTime: "5 min read",
        url: "https://www.healthline.com/health/adhd/difference-between-add-and-adhd",
        source: "Healthline",
      },
      {
        id: "a2",
        title: "Parenting a Child with ADD",
        description: "Expert advice on supporting your child's development",
        readTime: "7 min read",
        url: "https://www.verywellmind.com/add-and-parenting-20538",
        source: "Verywell Mind",
      },
    ],
    guides: [
      {
        id: "g1",
        title: "ADD Treatment Options Guide",
        description: "Comprehensive overview of treatment approaches",
        pages: "12 pages",
        url: "https://chadd.org/about-adhd/treatment/",
        source: "CHADD",
      },
    ],
    podcasts: [] as {
      id: string;
      title: string;
      description: string;
      duration: string;
      url: string;
      source: string;
    }[],
  },
  adhd: {
    videos: [
      {
        id: "v1",
        title: "What is ADHD?",
        description: "A comprehensive guide to understanding ADHD",
        duration: "10 min",
        url: "https://www.youtube.com/watch?v=xMWtGozn5jU",
        source: "YouTube",
      },
      {
        id: "v2",
        title: "ADHD Management Techniques",
        description: "Evidence-based strategies for managing ADHD",
        duration: "15 min",
        url: "https://www.youtube.com/watch?v=cx13a2-unjE",
        source: "YouTube",
      },
      {
        id: "v3",
        title: "ADHD in the Classroom",
        description: "Supporting children with ADHD at school",
        duration: "11 min",
        url: "https://www.youtube.com/watch?v=QW5jOmD2J94",
        source: "YouTube",
      },
    ],
    articles: [
      {
        id: "a1",
        title: "ADHD Symptoms Checklist",
        description: "Common signs and symptoms to look for in children",
        readTime: "6 min read",
        url: "https://www.cdc.gov/adhd/symptoms/index.html",
        source: "CDC",
      },
      {
        id: "a2",
        title: "ADHD and Diet: What You Need to Know",
        description: "How nutrition affects ADHD symptoms",
        readTime: "8 min read",
        url: "https://www.webmd.com/add-adhd/childhood-adhd/adhd-diets",
        source: "WebMD",
      },
    ],
    guides: [] as {
      id: string;
      title: string;
      description: string;
      pages: string;
      url: string;
      source: string;
    }[],
    podcasts: [
      {
        id: "p1",
        title: "ADHD Experts Podcast",
        description: "Weekly insights from leading ADHD specialists",
        duration: "45 min",
        url: "https://www.additudemag.com/adhd-podcast/",
        source: "ADDitude",
      },
    ],
  },
  autism: {
    videos: [
      {
        id: "v1",
        title: "Understanding Autism Spectrum",
        description: "Learn about autism signs, diagnosis, and support",
        duration: "14 min",
        url: "https://www.youtube.com/watch?v=Lk4qs8jGN4U",
        source: "YouTube",
      },
      {
        id: "v2",
        title: "Autism: Early Intervention",
        description: "The importance of early support for autistic children",
        duration: "9 min",
        url: "https://www.youtube.com/watch?v=dAKvM7wXtyg",
        source: "YouTube",
      },
      {
        id: "v3",
        title: "Communication Strategies for Autism",
        description: "Helping your child communicate effectively",
        duration: "12 min",
        url: "https://www.youtube.com/watch?v=wKlMcLTqRLs",
        source: "YouTube",
      },
    ],
    articles: [
      {
        id: "a1",
        title: "Early Signs of Autism",
        description: "Recognizing autism spectrum disorder in young children",
        readTime: "6 min read",
        url: "https://www.autismspeaks.org/signs-autism",
        source: "Autism Speaks",
      },
      {
        id: "a2",
        title: "Sensory Processing in Autism",
        description: "Understanding sensory sensitivities and how to help",
        readTime: "9 min read",
        url: "https://www.autism.org/sensory-processing/",
        source: "Autism Research Institute",
      },
    ],
    guides: [
      {
        id: "g1",
        title: "ABA Therapy Parent Guide",
        description: "Everything parents need to know about ABA therapy",
        pages: "15 pages",
        url: "https://www.autismspeaks.org/applied-behavior-analysis",
        source: "Autism Speaks",
      },
      {
        id: "g2",
        title: "IEP Guide for Autism",
        description: "Navigating special education for your child",
        pages: "20 pages",
        url: "https://www.understood.org/iep-guide",
        source: "Understood",
      },
    ],
    podcasts: [] as {
      id: string;
      title: string;
      description: string;
      duration: string;
      url: string;
      source: string;
    }[],
  },
};

// Category configuration
const RESOURCE_CATEGORIES = {
  videos: {
    title: "Videos",
    icon: "play-circle",
    color: "#FF0000",
    bgColor: "#FFE4E4",
  },
  articles: {
    title: "Articles",
    icon: "document-text",
    color: "#5F8F8B",
    bgColor: "#E8F0EF",
  },
  guides: {
    title: "Guides & Resources",
    icon: "book",
    color: "#7B68EE",
    bgColor: "#EDE8FF",
  },
  podcasts: {
    title: "Podcasts",
    icon: "headset",
    color: "#E8A838",
    bgColor: "#FFF4E0",
  },
};

// Design system colors
const colors = {
  bgApp: "#FAF9F6",
  bgCard: "#FFFFFF",
  primary: "#7FB77E",
  primaryHover: "#6A9E69",
  primarySoft: "#E8F0E8",
  accentCare: "#5F8F8B",
  accentCareSoft: "#E8F0EF",
  accentLearn: "#5F8F8B",
  accentLearnSoft: "#E8F0EF",
  text: "#2F2F2F",
  textSecondary: "#4A4A4A",
  textTertiary: "#8A8A8A",
  border: "rgba(0, 0, 0, 0.05)",
  badge: "#7FB77E",
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const greeting = getGreeting();
  // "ADHD" is selected by default
  const [selectedResource, setSelectedResource] = React.useState<string | null>(
    "adhd"
  );

  // Fetch current user profile from API
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!user, // Only fetch if user is logged in
    retry: false,
  });

  // Fetch centers for the home screen (limit to 3)
  const { data: centersData, isLoading: centersLoading } = useQuery({
    queryKey: ["centers", "home"],
    queryFn: () => getCenters(),
  });

  // Extract centers array from response (handle both array and object responses)
  const centers: HealthCenter[] = React.useMemo(() => {
    if (!centersData) return [];
    if (Array.isArray(centersData)) {
      return centersData.slice(0, 3);
    }
    const centersResponse = centersData as { centers?: HealthCenter[] };
    if (centersResponse?.centers && Array.isArray(centersResponse.centers)) {
      return centersResponse.centers.slice(0, 3);
    }
    return [];
  }, [centersData]);

  // Get user information - use API data if available, fallback to context user, then defaults
  const userName = currentUser?.name || user?.name || "User";
  const userInitials = React.useMemo(() => {
    if (!userName) return "U";
    return userName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {userLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.avatarText}>{userInitials}</Text>
                )}
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.greetingSmall}>{greeting}</Text>
              {userLoading ? (
                <ActivityIndicator size="small" color={colors.text} style={{ marginTop: 4 }} />
              ) : (
                <Text style={styles.userName}>{userName}</Text>
              )}
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.notificationBtn,
              pressed && { transform: [{ scale: 0.95 }] },
            ]}
            onPress={() => {
              Alert.alert("Notifications", "You have 2 new notifications");
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </Pressable>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Welcome to Sanad</Text>
            <Text style={styles.welcomeSubtitle}>
              Your trusted companion for special needs resources
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/directory/helpCenter")}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Resource Selection Card */}
        <View style={styles.resourceCard}>
          <View style={styles.resourceCardHeader}>
            <Ionicons name="library-outline" size={22} color={colors.primary} />
            <Text style={styles.resourceCardTitle}>
              What resource are you looking for?
            </Text>
          </View>
          <Text style={styles.resourceCardSubtitle}>
            Select a category to explore helpful resources
          </Text>

          {/* Resource Type Buttons */}
          <View style={styles.resourceButtonsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.resourceButton,
                selectedResource === "add" && styles.resourceButtonActive,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
              onPress={() =>
                setSelectedResource(selectedResource === "add" ? null : "add")
              }
            >
              <View
                style={[
                  styles.resourceIconWrap,
                  selectedResource === "add" && styles.resourceIconWrapActive,
                ]}
              >
                <Ionicons
                  name="flash-outline"
                  size={24}
                  color={
                    selectedResource === "add" ? "#FFFFFF" : colors.primary
                  }
                />
              </View>
              <Text
                style={[
                  styles.resourceButtonText,
                  selectedResource === "add" && styles.resourceButtonTextActive,
                ]}
              >
                ADD
              </Text>
              <Text style={styles.resourceButtonDesc}>Attention Deficit</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.resourceButton,
                selectedResource === "adhd" && styles.resourceButtonActive,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
              onPress={() =>
                setSelectedResource(selectedResource === "adhd" ? null : "adhd")
              }
            >
              <View
                style={[
                  styles.resourceIconWrap,
                  selectedResource === "adhd" && styles.resourceIconWrapActive,
                ]}
              >
                <Ionicons
                  name="pulse-outline"
                  size={24}
                  color={
                    selectedResource === "adhd" ? "#FFFFFF" : colors.primary
                  }
                />
              </View>
              <Text
                style={[
                  styles.resourceButtonText,
                  selectedResource === "adhd" &&
                  styles.resourceButtonTextActive,
                ]}
              >
                ADHD
              </Text>
              <Text style={styles.resourceButtonDesc}>Hyperactivity</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.resourceButton,
                selectedResource === "autism" && styles.resourceButtonActive,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
              onPress={() =>
                setSelectedResource(
                  selectedResource === "autism" ? null : "autism"
                )
              }
            >
              <View
                style={[
                  styles.resourceIconWrap,
                  selectedResource === "autism" &&
                  styles.resourceIconWrapActive,
                ]}
              >
                <Ionicons
                  name="heart-outline"
                  size={24}
                  color={
                    selectedResource === "autism" ? "#FFFFFF" : colors.primary
                  }
                />
              </View>
              <Text
                style={[
                  styles.resourceButtonText,
                  selectedResource === "autism" &&
                  styles.resourceButtonTextActive,
                ]}
              >
                Autism
              </Text>
              <Text style={styles.resourceButtonDesc}>Spectrum</Text>
            </Pressable>
          </View>
        </View>

        {/* Resources Section */}
        {selectedResource ? (
          <View style={styles.resourcesSection}>
            {/* Section Header */}
            <View style={styles.resourcesSectionHeader}>
              <View style={styles.resourcesSectionHeaderLeft}>
                <View style={styles.resourcesSectionIcon}>
                  <Ionicons
                    name={
                      selectedResource === "add"
                        ? "flash"
                        : selectedResource === "adhd"
                          ? "pulse"
                          : "heart"
                    }
                    size={18}
                    color="#FFFFFF"
                  />
                </View>
                <View>
                  <Text style={styles.resourcesSectionTitle}>
                    {selectedResource === "add"
                      ? "ADD Resources"
                      : selectedResource === "adhd"
                        ? "ADHD Resources"
                        : "Autism Resources"}
                  </Text>
                  <Text style={styles.resourcesSectionCount}>
                    Curated resources to help you
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => setSelectedResource(null)}
                style={({ pressed }) => [
                  styles.clearButton,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.textTertiary}
                />
              </Pressable>
            </View>

            {/* Videos Section */}
            {RESOURCES[selectedResource as keyof typeof RESOURCES]?.videos
              ?.length > 0 && (
                <View style={styles.categorySection}>
                  <View style={styles.categoryHeader}>
                    <View
                      style={[
                        styles.categoryIconWrap,
                        { backgroundColor: RESOURCE_CATEGORIES.videos.bgColor },
                      ]}
                    >
                      <Ionicons
                        name="play-circle"
                        size={20}
                        color={RESOURCE_CATEGORIES.videos.color}
                      />
                    </View>
                    <Text style={styles.categoryTitle}>Videos</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {
                          RESOURCES[selectedResource as keyof typeof RESOURCES]
                            ?.videos?.length
                        }
                      </Text>
                    </View>
                  </View>
                  {RESOURCES[
                    selectedResource as keyof typeof RESOURCES
                  ]?.videos?.map((video) => (
                    <Pressable
                      key={video.id}
                      style={({ pressed }) => [
                        styles.resourceItem,
                        pressed && { transform: [{ scale: 0.98 }] },
                      ]}
                      onPress={() => Linking.openURL(video.url)}
                    >
                      <View
                        style={[
                          styles.resourceItemIcon,
                          { backgroundColor: RESOURCE_CATEGORIES.videos.bgColor },
                        ]}
                      >
                        <Ionicons name="logo-youtube" size={22} color="#FF0000" />
                      </View>
                      <View style={styles.resourceItemContent}>
                        <Text style={styles.resourceItemTitle} numberOfLines={2}>
                          {video.title}
                        </Text>
                        <Text style={styles.resourceItemDesc} numberOfLines={1}>
                          {video.description}
                        </Text>
                        <View style={styles.resourceItemMeta}>
                          <Ionicons
                            name="time-outline"
                            size={12}
                            color={colors.textTertiary}
                          />
                          <Text style={styles.resourceItemMetaText}>
                            {video.duration}
                          </Text>
                          <View style={styles.resourceItemDot} />
                          <Text style={styles.resourceItemSource}>
                            {video.source}
                          </Text>
                        </View>
                      </View>
                      <Ionicons
                        name="open-outline"
                        size={18}
                        color={colors.textTertiary}
                      />
                    </Pressable>
                  ))}
                </View>
              )}

            {/* Articles Section */}
            {RESOURCES[selectedResource as keyof typeof RESOURCES]?.articles
              ?.length > 0 && (
                <View style={styles.categorySection}>
                  <View style={styles.categoryHeader}>
                    <View
                      style={[
                        styles.categoryIconWrap,
                        { backgroundColor: RESOURCE_CATEGORIES.articles.bgColor },
                      ]}
                    >
                      <Ionicons
                        name="document-text"
                        size={20}
                        color={RESOURCE_CATEGORIES.articles.color}
                      />
                    </View>
                    <Text style={styles.categoryTitle}>Articles</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {
                          RESOURCES[selectedResource as keyof typeof RESOURCES]
                            ?.articles?.length
                        }
                      </Text>
                    </View>
                  </View>
                  {RESOURCES[
                    selectedResource as keyof typeof RESOURCES
                  ]?.articles?.map((article) => (
                    <Pressable
                      key={article.id}
                      style={({ pressed }) => [
                        styles.resourceItem,
                        pressed && { transform: [{ scale: 0.98 }] },
                      ]}
                      onPress={() => Linking.openURL(article.url)}
                    >
                      <View
                        style={[
                          styles.resourceItemIcon,
                          {
                            backgroundColor: RESOURCE_CATEGORIES.articles.bgColor,
                          },
                        ]}
                      >
                        <Ionicons
                          name="document-text"
                          size={22}
                          color={RESOURCE_CATEGORIES.articles.color}
                        />
                      </View>
                      <View style={styles.resourceItemContent}>
                        <Text style={styles.resourceItemTitle} numberOfLines={2}>
                          {article.title}
                        </Text>
                        <Text style={styles.resourceItemDesc} numberOfLines={1}>
                          {article.description}
                        </Text>
                        <View style={styles.resourceItemMeta}>
                          <Ionicons
                            name="book-outline"
                            size={12}
                            color={colors.textTertiary}
                          />
                          <Text style={styles.resourceItemMetaText}>
                            {article.readTime}
                          </Text>
                          <View style={styles.resourceItemDot} />
                          <Text style={styles.resourceItemSource}>
                            {article.source}
                          </Text>
                        </View>
                      </View>
                      <Ionicons
                        name="open-outline"
                        size={18}
                        color={colors.textTertiary}
                      />
                    </Pressable>
                  ))}
                </View>
              )}

            {/* Guides Section */}
            {RESOURCES[selectedResource as keyof typeof RESOURCES]?.guides
              ?.length > 0 && (
                <View style={styles.categorySection}>
                  <View style={styles.categoryHeader}>
                    <View
                      style={[
                        styles.categoryIconWrap,
                        { backgroundColor: RESOURCE_CATEGORIES.guides.bgColor },
                      ]}
                    >
                      <Ionicons
                        name="book"
                        size={20}
                        color={RESOURCE_CATEGORIES.guides.color}
                      />
                    </View>
                    <Text style={styles.categoryTitle}>Guides & Resources</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {
                          RESOURCES[selectedResource as keyof typeof RESOURCES]
                            ?.guides?.length
                        }
                      </Text>
                    </View>
                  </View>
                  {RESOURCES[
                    selectedResource as keyof typeof RESOURCES
                  ]?.guides?.map((guide) => (
                    <Pressable
                      key={guide.id}
                      style={({ pressed }) => [
                        styles.resourceItem,
                        pressed && { transform: [{ scale: 0.98 }] },
                      ]}
                      onPress={() => Linking.openURL(guide.url)}
                    >
                      <View
                        style={[
                          styles.resourceItemIcon,
                          { backgroundColor: RESOURCE_CATEGORIES.guides.bgColor },
                        ]}
                      >
                        <Ionicons
                          name="book"
                          size={22}
                          color={RESOURCE_CATEGORIES.guides.color}
                        />
                      </View>
                      <View style={styles.resourceItemContent}>
                        <Text style={styles.resourceItemTitle} numberOfLines={2}>
                          {guide.title}
                        </Text>
                        <Text style={styles.resourceItemDesc} numberOfLines={1}>
                          {guide.description}
                        </Text>
                        <View style={styles.resourceItemMeta}>
                          <Ionicons
                            name="document-outline"
                            size={12}
                            color={colors.textTertiary}
                          />
                          <Text style={styles.resourceItemMetaText}>
                            {guide.pages}
                          </Text>
                          <View style={styles.resourceItemDot} />
                          <Text style={styles.resourceItemSource}>
                            {guide.source}
                          </Text>
                        </View>
                      </View>
                      <Ionicons
                        name="open-outline"
                        size={18}
                        color={colors.textTertiary}
                      />
                    </Pressable>
                  ))}
                </View>
              )}

            {/* Podcasts Section */}
            {RESOURCES[selectedResource as keyof typeof RESOURCES]?.podcasts
              ?.length > 0 && (
                <View style={styles.categorySection}>
                  <View style={styles.categoryHeader}>
                    <View
                      style={[
                        styles.categoryIconWrap,
                        { backgroundColor: RESOURCE_CATEGORIES.podcasts.bgColor },
                      ]}
                    >
                      <Ionicons
                        name="headset"
                        size={20}
                        color={RESOURCE_CATEGORIES.podcasts.color}
                      />
                    </View>
                    <Text style={styles.categoryTitle}>Podcasts</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {
                          RESOURCES[selectedResource as keyof typeof RESOURCES]
                            ?.podcasts?.length
                        }
                      </Text>
                    </View>
                  </View>
                  {RESOURCES[
                    selectedResource as keyof typeof RESOURCES
                  ]?.podcasts?.map((podcast) => (
                    <Pressable
                      key={podcast.id}
                      style={({ pressed }) => [
                        styles.resourceItem,
                        pressed && { transform: [{ scale: 0.98 }] },
                      ]}
                      onPress={() => Linking.openURL(podcast.url)}
                    >
                      <View
                        style={[
                          styles.resourceItemIcon,
                          {
                            backgroundColor: RESOURCE_CATEGORIES.podcasts.bgColor,
                          },
                        ]}
                      >
                        <Ionicons
                          name="headset"
                          size={22}
                          color={RESOURCE_CATEGORIES.podcasts.color}
                        />
                      </View>
                      <View style={styles.resourceItemContent}>
                        <Text style={styles.resourceItemTitle} numberOfLines={2}>
                          {podcast.title}
                        </Text>
                        <Text style={styles.resourceItemDesc} numberOfLines={1}>
                          {podcast.description}
                        </Text>
                        <View style={styles.resourceItemMeta}>
                          <Ionicons
                            name="time-outline"
                            size={12}
                            color={colors.textTertiary}
                          />
                          <Text style={styles.resourceItemMetaText}>
                            {podcast.duration}
                          </Text>
                          <View style={styles.resourceItemDot} />
                          <Text style={styles.resourceItemSource}>
                            {podcast.source}
                          </Text>
                        </View>
                      </View>
                      <Ionicons
                        name="open-outline"
                        size={18}
                        color={colors.textTertiary}
                      />
                    </Pressable>
                  ))}
                </View>
              )}
          </View>
        ) : (
          <View style={styles.emptyStateCard}>
            <View style={styles.emptyStateIconWrap}>
              <Ionicons
                name="videocam-outline"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyStateTitle}>Discover Resources</Text>
            <Text style={styles.emptyStateDescription}>
              Select ADD, ADHD, or Autism above to explore curated video
              resources and helpful guides
            </Text>
            <View style={styles.emptyStateHints}>
              <View style={styles.emptyStateHint}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.emptyStateHintText}>
                  Expert-curated content
                </Text>
              </View>
              <View style={styles.emptyStateHint}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.emptyStateHintText}>
                  Free YouTube videos
                </Text>
              </View>
              <View style={styles.emptyStateHint}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.emptyStateHintText}>
                  Practical strategies
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Health Centers Card - Third from bottom */}
        <View style={styles.centersCard}>
          <View style={styles.centersCardHeader}>
            <View style={styles.centersCardHeaderLeft}>
              <View style={styles.centersCardIcon}>
                <Ionicons name="medical" size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.centersCardTitle}>Health Centers</Text>
                <Text style={styles.centersCardSubtitle}>
                  Find specialized care centers near you
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => router.push("/(tabs)/directory/centers")}
              style={({ pressed }) => [
                styles.centersViewAllBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.centersViewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </Pressable>
          </View>

          {centersLoading ? (
            <View style={styles.centersLoading}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.centersLoadingText}>Loading centers...</Text>
            </View>
          ) : centers.length > 0 ? (
            <View style={styles.centersList}>
              {centers.map((center: HealthCenter) => (
                <Pressable
                  key={center.id}
                  style={({ pressed }) => [
                    styles.centerItem,
                    pressed && { transform: [{ scale: 0.98 }] },
                  ]}
                  onPress={() =>
                    router.push(`/(tabs)/directory/center-details?id=${center.id}`)
                  }
                >
                  <View style={styles.centerItemContent}>
                    <View style={styles.centerItemHeader}>
                      <Text style={styles.centerItemName} numberOfLines={1}>
                        {center.name || "Unnamed Center"}
                      </Text>
                      {center.type && (
                        <View
                          style={[
                            styles.centerTypeBadge,
                            center.type === "public"
                              ? styles.centerTypeBadgePublic
                              : styles.centerTypeBadgePrivate,
                          ]}
                        >
                          <Text
                            style={[
                              styles.centerTypeText,
                              center.type === "public"
                                ? styles.centerTypeTextPublic
                                : styles.centerTypeTextPrivate,
                            ]}
                          >
                            {center.type === "public" ? "Public" : "Private"}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.centerItemAddress} numberOfLines={1}>
                      {center.address || "Address not available"}
                    </Text>
                    {center.city && (
                      <Text style={styles.centerItemCity}>{center.city}</Text>
                    )}
                    {(center.rating !== undefined && center.rating !== null && typeof center.rating === "number") && (
                      <View style={styles.centerItemRating}>
                        <Ionicons name="star" size={14} color="#F5A623" />
                        <Text style={styles.centerItemRatingText}>
                          {center.rating.toFixed(1)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textTertiary}
                  />
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.centersEmpty}>
              <Ionicons
                name="medical-outline"
                size={32}
                color={colors.textTertiary}
              />
              <Text style={styles.centersEmptyText}>No centers available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgApp, // #FAF6F2
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16, // padding: 20px 16px from .page
    paddingTop: 20,
    paddingBottom: 140, // Increased padding: 64px (tab bar) + safe area (up to 34px) + 24px (spacing) + 18px (extra safety)
    maxWidth: 420, // max-width: 420px
    alignSelf: "center",
    width: "100%",
  },
  // Header - Professional Design
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: colors.bgApp,
  },
  headerText: {
    flex: 1,
  },
  greetingSmall: {
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.3,
  },
  // Welcome Card
  welcomeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.primary}12`,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  // Resource Card - Professional design
  resourceCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  resourceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  resourceCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  resourceCardSubtitle: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 20,
  },
  resourceButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  resourceButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.bgApp,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  resourceButtonActive: {
    backgroundColor: `${colors.primary}10`,
    borderColor: colors.primary,
  },
  resourceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  resourceIconWrapActive: {
    backgroundColor: colors.primary,
  },
  resourceButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  resourceButtonTextActive: {
    color: colors.primary,
  },
  resourceButtonDesc: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  // Notification Button
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: colors.badge,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  // Create account CTA
  createCta: {
    backgroundColor: colors.bgCard, // #FFFFFF
    borderRadius: 14, // var(--radius)
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  createCtaText: {
    marginBottom: 16,
    fontSize: 16, // 1rem - BODY TEXT SIZE
    fontWeight: "400", // REGULAR WEIGHT
    color: colors.text,
    textAlign: "center",
    lineHeight: 24, // 1.5 for readability
  },
  btnPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: colors.primary,
    borderRadius: 24,
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  btnPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // Mood Row - exact CSS values
  moodRow: {
    flexDirection: "row",
    gap: 10, // gap: 10px
    marginBottom: 22, // margin-bottom: 22px
  },
  moodBtn: {
    flex: 1,
    paddingVertical: 14, // padding: 14px
    borderRadius: 20, // border-radius: 20px
    backgroundColor: colors.bgCard, // var(--bg-card)
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  moodBtnActive: {
    backgroundColor: colors.primary, // var(--primary)
    borderColor: colors.primary,
  },
  moodBtnText: {
    fontSize: 14.4, // 0.9rem = 14.4px
    fontWeight: "400",
    color: colors.text, // var(--text)
  },
  moodBtnTextActive: {
    color: "#FFFFFF",
  },
  // Card - exact CSS values
  card: {
    backgroundColor: colors.bgCard, // var(--bg-card)
    borderRadius: 14, // var(--radius)
    padding: 20, // padding: 20px
    marginBottom: 20, // Increased spacing below cards for better separation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border, // var(--border)
  },
  profileCardContainer: {
    // Make entire card pressable
  },
  // Profile card - exact CSS values
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14, // gap: 14px
  },
  profileAvatar: {
    width: 52, // 52px
    height: 52,
    borderRadius: 26, // 50%
    borderWidth: 2,
    borderColor: colors.accentCare, // var(--accent-care)
    backgroundColor: colors.accentCareSoft, // var(--accent-care-soft)
  },
  profileInfo: {
    flex: 1,
  },
  profileInfoH3: {
    fontSize: 16.8, // 1.05rem = 16.8px
    fontWeight: "600",
    color: colors.text,
    lineHeight: 21.84, // 1.3
    margin: 0,
  },
  profileInfoP: {
    fontSize: 14, // 0.875rem = 14px
    color: colors.textSecondary,
    lineHeight: 19.6, // 1.4
    marginTop: 4,
    marginBottom: 0,
  },
  dropdownBtn: {
    width: 40, // 40px
    height: 40,
    borderRadius: 10, // var(--radius-sm)
    backgroundColor: colors.bgApp, // var(--bg-app)
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownBtnText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  // Section title - exact CSS values
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12, // margin-bottom: 12px - EXACT CSS VALUE
    marginTop: 20, // Increased spacing above sections for clear separation
  },
  sectionTitleH2: {
    fontSize: 16, // 1rem = 16px - SECTION TITLE SIZE
    fontWeight: "600", // BOLD - DISTINCT FROM BODY TEXT
    color: colors.text, // #3A3A3A - DARKER THAN BODY
    letterSpacing: -0.16, // -0.01em
    lineHeight: 20.8, // 1.3
    margin: 0,
  },
  sectionTitleSpan: {
    fontSize: 12.8, // 0.8rem = 12.8px
    color: colors.textTertiary, // var(--text-tertiary)
  },
  // Progress - exact CSS values
  progressDots: {
    flexDirection: "row",
    gap: 8, // gap: 8px
    marginBottom: 10, // margin-bottom: 10px
  },
  progressDot: {
    width: 10, // 10px
    height: 10,
    borderRadius: 5, // 50%
    backgroundColor: colors.accentCare, // var(--accent-care)
  },
  progressDotPending: {
    backgroundColor: colors.primarySoft, // var(--primary-soft)
  },
  planSummary: {
    fontSize: 14.4, // 0.9rem = 14.4px
    color: colors.textSecondary,
  },
  // Task card - exact CSS values
  taskCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16, // gap: 16px
    padding: 20, // padding: 20px
    backgroundColor: colors.bgCard,
    borderRadius: 14, // var(--radius)
    marginBottom: 20, // Increased spacing below task card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  taskCheckbox: {
    width: 22, // 22px
    height: 22,
    borderWidth: 2,
    borderColor: colors.textTertiary, // var(--text-tertiary)
    borderRadius: 6, // border-radius: 6px
    marginTop: 2, // margin-top: 2px
    justifyContent: "center",
    alignItems: "center",
  },
  taskCheckboxCompleted: {
    backgroundColor: colors.accentCare,
    borderColor: colors.accentCare,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  taskContent: {
    flex: 1,
  },
  taskContentH4: {
    fontSize: 16, // 1rem
    fontWeight: "600",
    color: colors.text,
    lineHeight: 22.4, // 1.4
    marginBottom: 6, // margin: 0 0 6px
    marginTop: 0,
  },
  taskContentP: {
    fontSize: 14, // 0.875rem
    color: colors.textSecondary,
    lineHeight: 21, // 1.5
    margin: 0,
  },
  why: {
    marginTop: 12, // margin-top: 12px
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // gap: 6px
  },
  whyText: {
    fontSize: 12.8, // 0.8rem = 12.8px
    color: colors.textTertiary,
  },
  // Recommendation card - exact CSS values
  recCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16, // gap: 16px
    padding: 20, // padding: 20px
    marginBottom: 12,
    backgroundColor: colors.bgCard,
    borderRadius: 14, // var(--radius)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recIcon: {
    width: 48, // 48px
    height: 48,
    borderRadius: 10, // var(--radius-sm)
    backgroundColor: colors.accentLearnSoft, // var(--accent-learn-soft)
    justifyContent: "center",
    alignItems: "center",
  },
  recIconText: {
    fontSize: 19.2, // 1.2rem = 19.2px
    color: colors.accentLearn, // var(--accent-learn)
  },
  recContent: {
    flex: 1,
  },
  recContentH4: {
    fontSize: 16, // 1rem
    fontWeight: "600",
    color: colors.text,
    lineHeight: 22.4, // 1.4
    marginBottom: 6, // margin: 0 0 6px
    marginTop: 0,
  },
  recContentDesc: {
    fontSize: 13.6, // 0.85rem = 13.6px
    color: colors.textSecondary,
    marginBottom: 10, // margin-bottom: 10px
    lineHeight: 20.4, // 1.5
  },
  recMeta: {
    fontSize: 12, // 0.75rem = 12px
    color: colors.textTertiary, // var(--text-tertiary)
  },
  // Resources Section - Professional Design
  resourcesSection: {
    marginTop: 4,
  },
  resourcesSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  resourcesSectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resourcesSectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  resourcesSectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  resourcesSectionCount: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 1,
  },
  clearButton: {
    padding: 4,
  },
  // Category Section
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  categoryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  categoryBadge: {
    backgroundColor: colors.bgApp,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  // Resource Item
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  resourceItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  resourceItemContent: {
    flex: 1,
  },
  resourceItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  resourceItemDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  resourceItemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  resourceItemMetaText: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  resourceItemDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
    marginHorizontal: 3,
  },
  resourceItemSource: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.primary,
  },
  // Video Card - Professional Design
  videoCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  videoThumbnail: {
    height: 120,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  videoPlayButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  videoDurationBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  videoDurationText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  videoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  videoMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  videoMetaText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  videoMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
    marginHorizontal: 4,
  },
  videoMetaLink: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  // Empty State Card - Professional Design
  emptyStateCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateHints: {
    gap: 10,
  },
  emptyStateHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emptyStateHintText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  // Quick actions - exact CSS values
  quickActions: {
    flexDirection: "row",
    gap: 12, // gap: 12px
    marginBottom: 16,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 14, // var(--radius)
    paddingVertical: 18, // padding: 18px 12px
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 10, // var(--radius-sm)
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapPrimary: {
    backgroundColor: colors.primarySoft,
  },
  iconWrapGreen: {
    backgroundColor: colors.accentCareSoft,
  },
  iconWrapText: {
    fontSize: 20,
  },
  quickActionSpan: {
    fontSize: 12.48, // 0.78rem = 12.48px
    fontWeight: "400",
    color: colors.text,
    lineHeight: 16.224,
    textAlign: "center",
  },
  // Chart card - exact CSS values
  chartCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14, // var(--radius)
    padding: 20, // padding: 20px
    marginBottom: 20, // Spacing below chart card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 180, // Increased to accommodate bars (120px) + labels (~20px) + padding (40px) = ~180px
    overflow: "visible", // Allow labels to be visible
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8, // gap: 8px between bars
    minHeight: 120, // Changed from height to minHeight to accommodate labels
    paddingBottom: 20, // Space for labels below bars
  },
  chartBarContainer: {
    flex: 1,
    alignItems: "center",
  },
  chartBar: {
    width: "100%",
    borderRadius: 4, // Rounded top corners
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 20, // Minimum bar height
  },
  chartBarLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 6,
    textAlign: "center",
  },
  chartBarGreen: {
    backgroundColor: colors.accentCare, // #7BA68A
  },
  chartBarBlue: {
    backgroundColor: colors.accentLearn, // #9B8BA6
  },
  // Health Centers Card
  centersCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  centersCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  centersCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  centersCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  centersCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  centersCardSubtitle: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  centersViewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  centersViewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  centersList: {
    gap: 12,
  },
  centerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgApp,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  centerItemContent: {
    flex: 1,
  },
  centerItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  centerItemName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  centerTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  centerTypeBadgePublic: {
    backgroundColor: "#dcfce7",
  },
  centerTypeBadgePrivate: {
    backgroundColor: "#fef3c7",
  },
  centerTypeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  centerTypeTextPublic: {
    color: "#15803d",
  },
  centerTypeTextPrivate: {
    color: "#b45309",
  },
  centerItemAddress: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  centerItemCity: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 6,
  },
  centerItemRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  centerItemRatingText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  centersLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  centersLoadingText: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  centersEmpty: {
    alignItems: "center",
    paddingVertical: 24,
  },
  centersEmptyText: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 8,
  },
});
