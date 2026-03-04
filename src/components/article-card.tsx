import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type WPPost = {
  id: number;
  title: {
    rendered: string;
  };
  _embedded?: {
    'wp:term'?: Array<Array<{
      taxonomy: string;
      name: string;
    }>>;
  };
};

const decodeHTMLEntities = (str: string) => {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--');
};

export type CategoryName = 'News' | 'Sports' | 'Life&Arts' | 'Projects' | 'Opinion' | 'Multimedia' | 'Texan en Español' | 'Flipbooks / Print' | 'Obituaries' | 'Shorts' | 'Club Sports' | 'Editorials' | 'Columns';

export const CATEGORY_IDS: Record<CategoryName, number> = {
  'News': 218,
  'Sports': 226,
  'Life&Arts': 235,
  'Projects': 22312,
  'Opinion': 222,
  'Multimedia': 256,
  'Texan en Español': 15894,
  'Flipbooks / Print': 12916,
  'Obituaries': 15253,
  'Shorts': 24867,
  'Club Sports': 22986,
  'Editorials': 13104,
  'Columns': 223,
};

type ArticleCardProps = {
  category?: CategoryName;
};

export function ArticleCard({ category }: ArticleCardProps = {}) {
  const [post, setPost] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestArticle = async () => {
      setLoading(true);
      try {
        let url = 'https://thedailytexan.com/wp-json/wp/v2/posts?per_page=1&orderby=date&order=desc&_embed=1';
        if (category && CATEGORY_IDS[category]) {
          url += `&categories=${CATEGORY_IDS[category]}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.length > 0) {
          setPost(data[0]);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error('Error fetching latest article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArticle();
  }, [category]);

  if (loading) {
    return (
      <ThemedView style={[styles.card, styles.center]}>
        <ActivityIndicator size="small" />
      </ThemedView>
    );
  }

  if (!post) {
    return (
      <ThemedView style={[styles.card, styles.center]}>
        <ThemedText>No articles found</ThemedText>
      </ThemedView>
    );
  }

  let authorName = 'Unknown Author';
  if (post._embedded && post._embedded['wp:term']) {
    for (const terms of post._embedded['wp:term']) {
      const staffTerm = terms.find((term) => term.taxonomy === 'staff_name');
      if (staffTerm) {
        authorName = staffTerm.name;
        break;
      }
    }
  }

  const decodedTitle = decodeHTMLEntities(post.title.rendered);

  return (
    <ThemedView style={styles.card}>
      <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={3}>
        {decodedTitle}
      </ThemedText>
      <ThemedText type="default" style={styles.author}>
        {authorName}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'gray',
    marginVertical: 8,
    minHeight: 100,
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    opacity: 0.7,
  },
});
