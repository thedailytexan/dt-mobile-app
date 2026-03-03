import { View, Image } from 'react-native';

export default function Load() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#bf5700" }}>
      <Image source={require('../assets/images/DT_logo.png')} style={{ width: 250, height: 250 }} />
    </View>
  );
}