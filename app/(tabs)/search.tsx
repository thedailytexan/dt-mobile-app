import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDebounce } from "../../hooks/useDebounce";
import { searchArticles } from "../../services/articlesAPI";
import { SearchArticleCard } from "../../src/components/search-article-card";
import { SmallArticleCard } from "../../src/components/small-article-card";
import { CategoryCard } from "../../src/components/category-card";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const trendingIndexes = Array.from({ length: 10 }, (_, i) => i);
  const categories = [
    {
      title: "News",
      image: require("../../assets/images/news.jpg"),
    },
    {
      title: "Sports",
      image: require("../../assets/images/sports.jpg"),
    },
    {
      title: "Life & Arts",
      image: require("../../assets/images/life-and-arts.jpg"),
    },
    {
      title: "Opinion",
      image: require("../../assets/images/opinion.jpg"),
    },
    {
      title: "Longform",
      image: require("../../assets/images/longform.jpg"),
    },
    {
      title: "Multimedia",
      image: require("../../assets/images/multimedia.jpg"),
    },
  ];


  // category dummy data
  const dummyArticlesByCategory: any = {
    News: [
      {
        id: 1,
        title: "title",
        excerpt: "excerpt",
        metaText: "Writer | News | April 14, 2026",
        mediaId: 0,
      },
      {
        id: 2,
        title: "title",
        excerpt: "excerpt",
        metaText: "Writer | News | April 14, 2026",
        mediaId: 0,
      },
    ],
    Sports: [
      {
        id: 3,
        title: "title",
        excerpt: "excerpt",
        metaText: "Writer | Sports | April 14, 2026",
        mediaId: 0,
      },
      {
        id: 4,
        title: "title",
        excerpt: "excerpt",
        metaText: "Writer | Sports | April 14, 2026",
        mediaId: 0,
      },
    ],
    "Life & Arts": [
      {
        id: 5,
        title: "title",
        excerpt: "excerpt",
        metaText: "Writer | Life & Arts | April 14, 2026",
        mediaId: 0,
      },
    ],
    Opinion: [
      {
        id: 6,
        title: "title",
        excerpt: "excerpt",
        metaText: "Writer | Opinion | April 14, 2026",
        mediaId: 0,
      },
    ],
    Longform: [
      {
        id: 7,
        title: "title",
        excerpt: "excerpt",
        metaText: "Longform | April 14, 2026",
        mediaId: 0,
      },
    ],
    Multimedia: [
      {
        id: 8,
        title: "title",
        excerpt: "excerpt",
        metaText: "Multimedia | April 14, 2026",
        mediaId: 0,
      },
    ],
  };

  const performSearch = async (query: string) => {
    const results = await searchArticles({
      query,
      order: "desc",
      perPage: 20,
    });
    return results;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const results = await performSearch("");
        setArticles(results);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadInitialData();
  }, []);


  useEffect(() => {
    if (initialLoading) return;
    const handleSearch = async () => {
      setLoading(true);
      try {
        const results = await performSearch(debouncedSearchQuery);
        // sort the search results so that articles with query in the title appear first
        const sortedResults = results.sort((a: any, b: any) => {
          const query = debouncedSearchQuery.toLowerCase();
          const aTitle = a.title?.rendered || "";
          const bTitle = b.title?.rendered || "";
          const aMatch = aTitle.toLowerCase().includes(query);
          const bMatch = bTitle.toLowerCase().includes(query);
          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;
          return 0;
        });
        setArticles(sortedResults);
      } catch (error) {
        console.error("Error searching:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    handleSearch();
  }, [debouncedSearchQuery]);

  // loading screen for search tab
  if (initialLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading Data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, paddingHorizontal: 16 }}>

      {/* search bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#ffffff",
          paddingHorizontal: 15,
          paddingVertical: 12,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: "#e0e0e0",
          marginBottom: 10,
        }}
      >
        {/* search icon */}
        <Ionicons name="search" size={20} color="#888" />

        {/* search input */}
        <TextInput
          style={{
            flex: 1,
            marginLeft: 10,
            fontSize: 16,
            color: "#000",
          }}
          placeholder="Search The Daily Texan"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />

        {/* little X button, idk what to call it */}
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </Pressable>
        )}
      </View>

      {/* results header */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>
          {searchQuery ? `Results for "${searchQuery}"` : selectedCategory ? selectedCategory : "Trending"}
        </Text>
      </View>

      {/* category display */}
      {!searchQuery && selectedCategory ? (
        <>
          <Pressable
            onPress={() => setSelectedCategory(null)}
            style={{ marginBottom: 10 }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              ← Back to Sections
            </Text>
          </Pressable>

          <FlatList
            data={dummyArticlesByCategory[selectedCategory] || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <SearchArticleCard
                title={item.title}
                metaText={item.metaText}
                mediaId={item.mediaId}
                excerpt={item.excerpt}
              />
            )}
            ListEmptyComponent={<NoResultsFound />}
          />
        </>
      ) : !searchQuery ? (
        <>
          {/* Trending */}
          <FlatList
            data={trendingIndexes}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <View style={{ marginRight: 12 }}>
                <SmallArticleCard index={item} />
              </View>
            )}
          />
          {/* Category grid */}
          <View style={{ marginBottom: 10, marginTop: 10 }}>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>
              {"Sections"}
            </Text>
          </View>
          <FlatList
            data={categories}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item) => item.title}
            columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 12, }}
            renderItem={({ item }) => (
              <View style={{ flex: 1, marginHorizontal: 3 }}>
                <CategoryCard title={item.title} image={item.image}
                  onPress={() => setSelectedCategory(item.title)}
                />
              </View>
            )}
          />
        </>
      ) : loading ? (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SearchArticleCard
              title={item.title}
              metaText={item.metaText}
              mediaId={item.mediaId}
              excerpt={item.excerpt}
            />
          )}
          ListEmptyComponent={<NoResultsFound />}
        />
      )}
    </SafeAreaView>
  );
}

function NoResultsFound() {
  return (
    <View style={{ alignItems: "center", marginTop: 40 }}>
      <Ionicons name="search-outline" size={64} color="gray" />
      <Text style={{ fontSize: 18, marginTop: 10 }}>
        No articles found
      </Text>
      <Text style={{ color: "gray", marginTop: 6, textAlign: "center" }}>
        Try adjusting your search or using different keywords
      </Text>
    </View>
  );
}