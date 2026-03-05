import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { WPImage } from './wp-image';

type WPPost = {
  id: number;
  date: string;
  featured_media: number;
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

type MediumArticleCardProps = {
  category?: CategoryName;
  index?: number;
};

export function MediumArticleCard({ category, index = 0 }: MediumArticleCardProps = {}) {
  const [post, setPost] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestArticle = async () => {
      setLoading(true);
      try {
        let url = `https://thedailytexan.com/wp-json/wp/v2/posts?per_page=1&orderby=date&order=desc&_embed=1&offset=${index}`;
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
  }, [category, index]);

  if (loading) {
    return (
      <ThemedView style={[styles.card, styles.center, { padding: 12 }]}>
        <ActivityIndicator size="small" />
      </ThemedView>
    );
  }

  if (!post) {
    return (
      <ThemedView style={[styles.card, styles.center, { padding: 12 }]}>
        <ThemedText style={{ color: '#000000' }}>No articles found</ThemedText>
      </ThemedView>
    );
  }

  let authorName = 'Unknown Author';
  let categoryName = category || '';
  if (post._embedded && post._embedded['wp:term']) {
    for (const terms of post._embedded['wp:term']) {
      if (authorName === 'Unknown Author') {
        const staffTerm = terms.find((term) => term.taxonomy === 'staff_name');
        if (staffTerm) {
          authorName = staffTerm.name;
        }
      }
      if (!categoryName) {
        const categoryTerm = terms.find((term) => term.taxonomy === 'category');
        if (categoryTerm) {
          categoryName = decodeHTMLEntities(categoryTerm.name);
        }
      }
    }
  }

  const dateObj = new Date(post.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const metaText = [authorName, categoryName, formattedDate].filter(Boolean).join(' | ');

  const decodedTitle = decodeHTMLEntities(post.title.rendered);

  return (
    <ThemedView style={styles.card}>
      {post.featured_media > 0 && (
        <WPImage imageid={post.featured_media} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={2}>
          {decodedTitle}
        </ThemedText>
        <ThemedText type="default" style={styles.author}>
          {metaText}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: "#e0e0e0ff",
    marginBottom: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 12,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    /* Replace fonts for title and stuff */
    marginBottom: 5,
    color: '#000000',
  },
  author: {
    fontSize: 13,
    opacity: 0.7,
    color: '#000000',
    marginBottom: 0,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 0,
  },
});
