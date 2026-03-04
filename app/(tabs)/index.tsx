import { ScrollView, Text } from "react-native";
import { ArticleCard } from "../../src/components/article-card";

export default function Home() {
  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", padding: 16 }}>
      <Text>News</Text>
      <ArticleCard category="News" index = {4} />
      <Text>Sports</Text>
      <ArticleCard category="Sports" index = {1} />
      <Text>Life&Arts</Text>
      <ArticleCard category="Life&Arts" />
      <Text>Projects</Text>
      <ArticleCard category="Projects" />
      <Text>Opinion</Text>
      <ArticleCard category="Opinion" />
      <Text>Multimedia</Text>
      <ArticleCard category="Multimedia" />
      <Text>Texan en Español</Text>
      <ArticleCard category="Texan en Español" />
      <Text>Flipbooks / Print</Text>
      <ArticleCard category="Flipbooks / Print" />
      <Text>Obituaries</Text>
      <ArticleCard category="Obituaries" />
    </ScrollView>
  );
}
