import { ScrollView, Text } from "react-native";
import { ArticleCard } from "../../src/components/article-card";

export default function Home() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ paddingBottom: 5, paddingLeft: 5}}>News</Text>
      <ArticleCard category="News" index = {4} />
      <Text style={{ paddingBottom: 5, paddingLeft: 5}}>Sports</Text>
      <ArticleCard category="Sports" index = {1} />
      <Text style={{ paddingBottom: 5, paddingLeft: 5}}>Life&Arts</Text>
      <ArticleCard category="Life&Arts" />
      <Text style={{ paddingBottom: 5, paddingLeft: 5}}>Projects</Text>
      <ArticleCard category="Projects" />
      <Text style={{ paddingBottom: 5, paddingLeft: 5}}>Opinion</Text>
      <ArticleCard category="Opinion" />
      <Text style={{ paddingBottom: 5, paddingLeft: 5}}>Multimedia</Text>
      <ArticleCard category="Multimedia" />
      <Text style={{ paddingBottom: 5, paddingLeft: 5}}>Texan en Español</Text>
      <ArticleCard category="Texan en Español" />
      <Text style={{ paddingBottom: 5, paddingLeft: 5}}>Flipbooks / Print</Text>
      <ArticleCard category="Flipbooks / Print" />
      <Text style={{ paddingBottom: 5, paddingLeft: 5}}>Obituaries</Text>
      <ArticleCard category="Obituaries" />
    </ScrollView>
  );
}
