import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { WPImage } from './wp-image';

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

type SearchArticleCardProps = {
  title: string;
  metaText: string;
  mediaId?: number;
  excerpt: string;
};

export function SearchArticleCard({ title, metaText, mediaId, excerpt }: SearchArticleCardProps) {
  const decodedTitle = decodeHTMLEntities(title);
  const decodedExcerpt = decodeHTMLEntities(excerpt.replace(/<[^>]+>/g, '')); // Strip HTML tags from excerpt

  return (
    <ThemedView style={styles.card}>
      {mediaId !== undefined && mediaId > 0 && (
        <WPImage imageid={mediaId} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={2}>
          {decodedTitle}
        </ThemedText>
        <ThemedText type="default" style={styles.author} numberOfLines={1}>
          {metaText}
        </ThemedText>
        {decodedExcerpt ? (
          <ThemedText type="default" style={styles.excerpt} numberOfLines={2}>
            {decodedExcerpt}
          </ThemedText>
        ) : null}
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
    padding: 10,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    /* Replace fonts for title and stuff */
    marginBottom: 1,
    color: '#000000',
    lineHeight: 18,
  },
  author: {
    fontSize: 13,
    opacity: 0.7,
    color: '#000000',
    marginBottom: 1,
  },
  excerpt: {
    fontSize: 12,
    opacity: 0.8,
    color: '#000000',
    lineHeight: 16,
  },
  image: {
    width: 100,
    height: '100%',
    borderRadius: 0,
  },
});
