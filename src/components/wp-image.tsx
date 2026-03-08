import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';

interface WPImageProps {
  imageid: number;
  style?: StyleProp<ImageStyle>;
}

export function WPImage({ imageid, style }: WPImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!imageid) {
      setLoading(false);
      return;
    }

    const fetchImageDetails = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`https://thedailytexan.com/wp-json/wp/v2/media/${imageid}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch media with ID: ${imageid}`);
        }

        const data = await response.json();
        
        // Prefer medium size if available for mobile performance, otherwise use source_url
        const source = data.media_details?.sizes?.medium?.source_url || data.source_url;
        
        if (source) {
          setImageUrl(source);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching WordPress image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [imageid]);

  if (!imageUrl) {
    return (
      <Image
        source={require("../../assets/images/DT_logo.png")}
        style={style}
      />
    );
  }

  if (loading) {
    return (
      <View style={[styles.placeholder, style, styles.center]}>
        <ActivityIndicator size="small" color="#ffffffff" />
      </View>
    );
  }

  if (error || !imageUrl) {
    return (
      <View style={[styles.placeholder, style, styles.error]}>
        {/* I need to insert placeholder icon */}
      </View>
    );
  }

  return (
    <Image 
      source={{ uri: imageUrl }} 
      style={[styles.image, style]} 
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    backgroundColor: '#eeeeee',
  },
  image: {
    // Default dimensions but should be overridden by style property
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
