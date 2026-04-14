import { Text, View, Image, Dimensions, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SmallArticleCard } from "../../src/components/small-article-card";
import { useFonts } from 'expo-font';

export default function Profile() {
  const screenWidth = Dimensions.get("window").width;
  const trendingIndexes = Array.from({ length: 10 }, (_, i) => i);
  const preferenceItems = ["Accessibility", "Notifications", "Appearance"];
  const aboutItems = [
    "The Daily Texan",
    "Contact Us",
    "Subscribe to our NewsLetter",
    "Privacy Policy",
    "Support Student Media",
    "Terms and Conditions",
  ];
  const [loaded] = useFonts({
    LibreBaskerville: require('../../assets/fonts/Libre-Baskerville.ttf'),
  });

  if (!loaded) {
    return null;
  }

  function MenuRow({ label }: { label: string }) {
    return (
      <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 15 }}>{label}</Text>
          <Image
            source={require('../../assets/images/right-arrow.png')}
            style={{ width: 23, height: 23, resizeMode: 'contain' }}
          />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, paddingHorizontal: 16 }}>
      {/* Profile Header */}
      <View style={{ flexDirection: "row", justifyContent: "flex-start", marginTop: 5, paddingHorizontal: 16 }}>
        <Text style = {{ fontSize: 27, fontFamily: 'LibreBaskerville' }}>PROFILE</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <View style={{ height: 2.3, backgroundColor: "#000000", width: screenWidth * 0.85, paddingHorizontal: 10, opacity: 0.25 }}></View>
      </View>

      {/* Bookmarks */}
      <View style={{ marginTop: 10, justifyContent: "flex-start" }}>
        <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 7, paddingHorizontal: 16 }}>Bookmarks</Text>
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
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 15 }}>View all bookmarks</Text>
            <Image
              source={require('../../assets/images/right-arrow.png')}
              style={{ width: 23, height: 23, resizeMode: 'contain' }}
            />
          </View>
        </View>
      </View>
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <View style={{ height: 2.3, backgroundColor: "#000000", width: screenWidth, paddingHorizontal: 10, opacity: 0.25 }}></View>
      </View>

      {/* Preferences */}
      <View style={{ marginTop: 10, justifyContent: "flex-start" }}>
        <Text style={{ fontSize: 18, fontWeight: '500', paddingHorizontal: 16 }}>Preferences</Text>
        {preferenceItems.map((item) => (
          <MenuRow key={item} label={item} />
        ))}
      </View>
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <View style={{ height: 2.3, backgroundColor: "#000000", width: screenWidth, paddingHorizontal: 10, opacity: 0.25 }}></View>
      </View>

      {/* About */}
      <View style={{ marginTop: 10, justifyContent: "flex-start" }}>
        <Text style={{ fontSize: 18, fontWeight: '500', paddingHorizontal: 16 }}>About</Text>
        {aboutItems.map((item) => (
          <MenuRow key={item} label={item} />
        ))}
      </View>

    </SafeAreaView>
  );
}
