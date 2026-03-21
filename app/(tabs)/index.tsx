import { Text, View, Image, FlatList } from "react-native";
import { ArticleCard } from "../../src/components/article-card";
import { SmallArticleCard } from "../../src/components/small-article-card";


export default function Home() {
  const trendingIndexes = Array.from({ length: 10 }, (_, i) => i);

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
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10, marginTop: 25, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>Top Stories</Text>
          <View style={{ height: 2, backgroundColor: "#000000", width: 190, marginLeft: 10 }}></View>
      </View>
      <FlatList
        data={trendingIndexes}
        showsVerticalScrollIndicator={false}
        style={{ height: 310 }}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <ArticleCard index={item} />
          </View>
        )}
      />

      {/* Latest */}
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10, marginTop: 25, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Latest</Text>
        <View style={{ height: 2, backgroundColor: "#000000", width: 250, marginLeft: 10 }}></View>
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
