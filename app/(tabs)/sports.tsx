import { Text, View } from "react-native";
import { WPImage } from "../../src/components/wp-image";

export default function Sports() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Sports Page</Text>
      <WPImage 
      imageid={184939}
      style={{ width: 200, height: 200}}
      />
    </View>
  );
}
