import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchArticleById } from '../../services/articlesAPI';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const decodeHTMLEntities = (str: string) => {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8211;/g, "\u2013")
    .replace(/&#8212;/g, "\u2014");
};

type Article = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  authorName: string;
  categoryName: string;
  formattedDate: string;
  mediaId: number;
  featuredImageUrl: string | null;
  link: string;
};

export default function ArticlePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchArticleById(id);
        setArticle(data);
      } catch (err) {
        console.error('Failed to load article:', err);
        setError('Failed to load article. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        message: `${decodeHTMLEntities(article.title)}\n${article.link}`,
        url: article.link,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#BF5700" />
        <Text style={styles.loadingText}>Loading article...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={64} color="#999" />
        <Text style={styles.errorText}>{error || 'Article not found'}</Text>
        <Pressable style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const decodedTitle = decodeHTMLEntities(article.title);

  const tagsStyles = {
    body: {
      color: '#1a1a1a',
      fontSize: 17,
      lineHeight: 28,
    },
    p: {
      marginBottom: 16,
      lineHeight: 28,
    },
    a: {
      color: '#BF5700',
      textDecorationLine: 'none' as const,
    },
    h2: {
      fontSize: 22,
      fontWeight: 'bold' as const,
      marginTop: 24,
      marginBottom: 12,
      color: '#1a1a1a',
    },
    h3: {
      fontSize: 19,
      fontWeight: '600' as const,
      marginTop: 20,
      marginBottom: 10,
      color: '#1a1a1a',
    },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: '#BF5700',
      paddingLeft: 16,
      marginLeft: 0,
      fontStyle: 'italic' as const,
      color: '#555',
    },
    img: {
      borderRadius: 8,
    },
    figcaption: {
      fontSize: 13,
      color: '#888',
      fontStyle: 'italic' as const,
      marginTop: 6,
      marginBottom: 16,
    },
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </Pressable>
          <Text style={styles.headerCategory} numberOfLines={1}>
            {article.categoryName || 'Article'}
          </Text>
          <Pressable onPress={handleShare} style={styles.headerButton}>
            <Ionicons name="share-outline" size={22} color="#1a1a1a" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured image */}
        {article.featuredImageUrl && (
          <Image
            source={{ uri: article.featuredImageUrl }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
        )}

        {/* Article header */}
        <View style={styles.articleHeader}>
          {/* Category badge */}
          {article.categoryName ? (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {article.categoryName}
              </Text>
            </View>
          ) : null}

          {/* Title */}
          <Text style={styles.title}>{decodedTitle}</Text>

          {/* Meta info */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color="#888" />
              <Text style={styles.metaText}>{article.authorName}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#888" />
              <Text style={styles.metaText}>{article.formattedDate}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />
        </View>

        {/* Article body (HTML content) */}
        <View style={styles.articleBody}>
          <RenderHtml
            contentWidth={SCREEN_WIDTH - 40}
            source={{ html: article.content }}
            tagsStyles={tagsStyles}
            enableExperimentalMarginCollapsing={true}
          />
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#BF5700',
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSafeArea: {
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerCategory: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginHorizontal: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  featuredImage: {
    width: '100%',
    height: 260,
  },
  articleHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#BF5700',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 14,
  },
  categoryBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 34,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  metaText: {
    fontSize: 13,
    color: '#888',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
  },
  articleBody: {
    paddingHorizontal: 20,
  },
});
