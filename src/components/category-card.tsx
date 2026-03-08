import React from "react";
import { View, Pressable, StyleSheet, ImageBackground } from "react-native";
import { ThemedText } from "./themed-text";
import { Dimensions } from "react-native";

type CategoryCardProps = {
  title: string;
  image: any;
  onPress?: () => void;
};

export function CategoryCard({ title, image, onPress }: CategoryCardProps) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <ImageBackground
        source={image}
        style={styles.card}
        imageStyle={styles.image}
      >
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const screenWidth = Dimensions.get("window").width;
const CARD_GAP = 15;
const CARD_WIDTH = (screenWidth - CARD_GAP * 3) / 2;
const CARD_HEIGHT = CARD_WIDTH * 0.5;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 18,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  textContainer: {
    position: "absolute",
    bottom: 10,
    left: 12,
  },
});