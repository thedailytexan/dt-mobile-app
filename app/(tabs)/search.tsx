import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDebounce } from "../../hooks/useDebounce";
import { searchArticles } from "../../services/articlesAPI";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const performSearch = async (query) => {
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
        const sortedResults = results.sort((a, b) => {
          const query = debouncedSearchQuery.toLowerCase();
          const aTitleMatch = stripHtml(a.title).toLowerCase().includes(query);
          const bTitleMatch = stripHtml(b.title).toLowerCase().includes(query);
          if (aTitleMatch && !bTitleMatch) return -1;
          if (!aTitleMatch && bTitleMatch) return 1;
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
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>

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
          marginBottom: 15,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
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
          placeholder="Search articles"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />

        {/* little X button, idk what to call it */}
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery("")}
            style={{
              padding: 4,
            }}
          >
            <Ionicons name="close-circle" size={20} color="#888" />
          </Pressable>
        )}
      </View>

      {/* results header */}
      <View style={{ marginTop: 20, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {searchQuery
            ? `Results for "${searchQuery}"`
            : "Popular Articles"}
        </Text>
        <Text style={{ color: "gray", marginTop: 4 }}>
          {articles.length} found
        </Text>
      </View>

      {/* loading search results */}
      {loading ? (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                backgroundColor: "#ffffff",
                marginBottom: 10,
                borderRadius: 8,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {/* TODO: add more stuff here for the search results (date, category, image, etc.) */}
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {highlightText(stripHtml(item.title), searchQuery)}
              </Text>
              <Text style={{ color: "gray", marginTop: 4 }}>
                {stripHtml(item.excerpt).slice(0, 100)}...
              </Text>
            </View>
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

function highlightText(text, query) {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <Text key={index} style={{ backgroundColor: "yellow" }}>
        {part}
      </Text>
    ) : (
      part
    )
  );
}

// helper function to remove html tags
function stripHtml(html) {
  return html ? html.replace(/<[^>]*>/g, "") : "";
}