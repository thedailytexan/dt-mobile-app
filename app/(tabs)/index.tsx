import { View } from "react-native";
import { ArticleCard } from "../../src/components/article-card";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
      <ArticleCard />
    </View>
  );
}
