import { Text, View } from "react-native";
import { MediumArticleCard } from "../../src/components/medium-article-card";
import { SmallArticleCard } from "../../src/components/small-article-card";

export default function Sports() {
  return (
    <View style={{ flex: 1, padding: 16, paddingTop: 60 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Sports Page</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <SmallArticleCard category="Sports" index={0} />
        <SmallArticleCard category="Sports" index={1} />
      </View>
      <MediumArticleCard category="Sports" index={3}/>
    </View>
  );
}
