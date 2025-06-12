import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function StreetViewScreen() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{
          uri: 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=28.6139,77.2090',
        }}
      />
    </View>
  );
}
