import { Text, View, Image, Dimensions, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SmallArticleCard } from "../../src/components/small-article-card";
import { useFonts } from 'expo-font';
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const trendingIndexes = Array.from({ length: 10 }, (_, i) => i);
  const preferenceItems = ["Accessibility", "Notifications", "Appearance"];
  const aboutItems = [
    "The Daily Texan",
    "Contact Us",
    "Subscribe to our Newsletter",
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

  const preferenceRoutes: Record<string, any> = {
    "Accessibility": "/profile-pages/accessibility",
    "Notifications": "/profile-pages/notifications",
    "Appearance": "/profile-pages/appearance",
  };

  const aboutRoutes: Record<string, any> = {
    "The Daily Texan": "/profile-pages/daily-texan",
    "Contact Us": "/profile-pages/contact",
    "Subscribe to our Newsletter": "/profile-pages/newsletter",
    "Privacy Policy": "/profile-pages/privacy",
    "Support Student Media": "/profile-pages/student-media",
    "Terms and Conditions": "/profile-pages/terms",
  };

  function MenuRow({ label, onPress }: { label: string; onPress?: () => void }) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          paddingHorizontal: 16,
          marginTop: 10,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 15 }}>{label}</Text>
          <Image
            source={require('../../assets/images/right-arrow.png')}
            style={{ width: 23, height: 23, resizeMode: 'contain' }}
          />
        </View>
      </Pressable>
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
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <View style={{ marginLeft: 13 }}>
              <SmallArticleCard index={item} />
            </View>
          )}
        />
        <Pressable
          onPress={() => router.push("/profile-pages/bookmarks")}
          style={({ pressed }) => ({
            paddingHorizontal: 16,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 15 }}>View all bookmarks</Text>
            <Image
              source={require('../../assets/images/right-arrow.png')}
              style={{ width: 23, height: 23, resizeMode: 'contain' }}
            />
          </View>
        </Pressable>
      </View>
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <View style={{ height: 2.3, backgroundColor: "#000000", width: screenWidth, paddingHorizontal: 10, opacity: 0.25 }}></View>
      </View>

      {/* Preferences */}
      <View style={{ marginTop: 10, justifyContent: "flex-start" }}>
        <Text style={{ fontSize: 18, fontWeight: '500', paddingHorizontal: 16 }}>Preferences</Text>
        {preferenceItems.map((item) => (
          <MenuRow key={item} label={item}
          onPress={() => router.push(preferenceRoutes[item])}
          />
        ))}
      </View>
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <View style={{ height: 2.3, backgroundColor: "#000000", width: screenWidth, paddingHorizontal: 10, opacity: 0.25 }}></View>
      </View>

      {/* About */}
      <View style={{ marginTop: 10, justifyContent: "flex-start" }}>
        <Text style={{ fontSize: 18, fontWeight: '500', paddingHorizontal: 16 }}>About</Text>
        {aboutItems.map((item) => (
          <MenuRow key={item} label={item}
          onPress={() => router.push(aboutRoutes[item])}
          />
        ))}
      </View>

    </SafeAreaView>
  );
}
