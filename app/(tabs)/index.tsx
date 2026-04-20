import { Text, View, Image, FlatList, Dimensions } from "react-native";
import { ArticleCard } from "../../src/components/article-card";
import { SmallArticleCard } from "../../src/components/small-article-card";
import { useFonts } from 'expo-font';


export default function Home() {
  const screenWidth = Dimensions.get("window").width;
  const trendingIndexes = Array.from({ length: 10 }, (_, i) => i);
  const [loaded] = useFonts({
    LibreBaskerville: require('../../assets/fonts/Libre-Baskerville.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View>

      {/* Header */}
      <View style={{ backgroundColor: "#BF5700", height: 100, justifyContent: "flex-end", alignItems: "center" }}> 
        <Image 
          source={require('../../assets/images/The Daily Texan.png')}
          style={{ width: 200, height: 27, marginBottom: 10 }}
        />
      </View>

      {/* Top Stories */}
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 15, marginTop: 25, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 27, fontFamily: 'LibreBaskerville' }}>TOP STORIES</Text>
          <View style={{ height: 2.3, backgroundColor: "#000000", width: screenWidth * 0.35, marginLeft: 10 }}></View>
      </View>
      <FlatList
        data={trendingIndexes}
        showsVerticalScrollIndicator={false}
        style={{ height: 290 }}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <ArticleCard index={item} />
          </View>
        )}
      />

      {/* Latest */}
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 15, marginTop: 25, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 25, fontFamily: 'LibreBaskerville' }}>LATEST</Text>
        <View style={{ height: 2.3, backgroundColor: "#000000", width: screenWidth * 0.6, marginLeft: 10, paddingHorizontal: 16 }}></View>
      </View>
      <FlatList
        data={trendingIndexes}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={{ marginLeft: 13 }}>
            <SmallArticleCard index={item} />
          </View>
        )}
      />
    </View>
  );
}
