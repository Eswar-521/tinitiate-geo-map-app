
// import * as Location from 'expo-location';
// import * as MediaLibrary from 'expo-media-library';
// import Fuse from 'fuse.js';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Button,
//   FlatList,
//   Image,
//   Switch,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   useColorScheme,
//   View
// } from 'react-native';
// import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
// import ViewShot from 'react-native-view-shot';
// import geojson from '../../assets/geojson/india_states.json';

// export default function MapTabScreen() {
//   const [polygons, setPolygons] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedState, setSelectedState] = useState<string | null>(null);
//   const [searchText, setSearchText] = useState('');
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [showLabels, setShowLabels] = useState(true);
//   const [showTraffic, setShowTraffic] = useState(false);
//   const [showBuildings, setShowBuildings] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedDetails, setSelectedDetails] = useState<any>(null);
//   const [location, setLocation] = useState<any>(null);
//   const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
//   const mapRef = useRef<MapView>(null);
//   const viewShotRef = useRef<any>();
//   const colorScheme = useColorScheme();

//   const [region, setRegion] = useState({
//     latitude: 22.9734,
//     longitude: 78.6569,
//     latitudeDelta: 10,
//     longitudeDelta: 10,
//   });

//   const stateData: Record<string, number> = {
//     Maharashtra: 100,
//     Gujarat: 80,
//     Kerala: 60,
//     Punjab: 40,
//     TamilNadu: 20,
//   };

//   const getColorByValue = (value: number) => {
//     if (value >= 80) return 'rgba(255,0,0,0.5)';
//     if (value >= 60) return 'rgba(255,165,0,0.5)';
//     if (value >= 40) return 'rgba(0,0,255,0.4)';
//     return 'rgba(0,255,0,0.4)';
//   };

//   useEffect(() => {
//     const loadGeoJson = async () => {
//       try {
//         const extracted = geojson.features
//           .filter(f => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')
//           .flatMap((feature) => {
//             const coords = feature.geometry.coordinates;
//             const name = feature.properties.NAME_1;
//             if (feature.geometry.type === 'Polygon') {
//               return [{
//                 coordinates: coords[0].map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
//                 name,
//                 center: getCenter(coords[0]),
//               }];
//             } else {
//               return coords.map(polygon => ({
//                 coordinates: polygon[0].map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
//                 name,
//                 center: getCenter(polygon[0]),
//               }));
//             }
//           });
//         setPolygons(extracted);
//       } catch (err) {
//         console.error("Error loading GeoJSON:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadGeoJson();
//     requestLocation();
//   }, []);

//   const getCenter = (coords: number[][]) => {
//     const lats = coords.map(c => c[1]);
//     const lngs = coords.map(c => c[0]);
//     return {
//       latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
//       longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
//     };
//   };

//   const requestLocation = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status === 'granted') {
//       const loc = await Location.getCurrentPositionAsync({});
//       setLocation(loc.coords);
//     }
//   };

//   const fuse = new Fuse(polygons, { keys: ['name'], threshold: 0.4 });

//   const onSearchChange = (text: string) => {
//     setSearchText(text);
//     if (!text.trim()) {
//       setSuggestions([]);
//       return;
//     }
//     const results = fuse.search(text).map(result => result.item.name);
//     setSuggestions(results);
//   };

//   const handleSelectState = (name: string) => {
//     setSuggestions([]);
//     if (!name) return;
//     setSearchText(name);
//     const found = polygons.find(p => p.name.toLowerCase() === name.toLowerCase());
//     if (found) {
//       setSelectedState(found.name);
//       setSelectedDetails({
//         name: found.name,
//         value: stateData[found.name] || 0,
//       });
//       setModalVisible(true);
//       const newRegion = {
//         ...found.center,
//         latitudeDelta: 4,
//         longitudeDelta: 4,
//       };
//       setRegion(newRegion);
//       mapRef.current?.animateToRegion(newRegion, 800);
//     }
//   };

//   const handleReset = () => {
//     setSearchText('');
//     setSuggestions([]);
//     setSelectedState(null);
//     setModalVisible(false);
//     const defaultRegion = {
//       latitude: 22.9734,
//       longitude: 78.6569,
//       latitudeDelta: 10,
//       longitudeDelta: 10,
//     };
//     setRegion(defaultRegion);
//     mapRef.current?.animateToRegion(defaultRegion, 800);
//   };

//   const takeScreenshot = async () => {
//     try {
//       const uri = await viewShotRef.current.capture();
//       setScreenshotUri(uri);

//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status === 'granted') {
//         const asset = await MediaLibrary.createAssetAsync(uri);
//         await MediaLibrary.createAlbumAsync('GeoMap Screenshots', asset, false);
//         alert('📸 Screenshot saved to gallery!');
//       } else {
//         alert('Permission denied to save screenshot.');
//       }

//       setTimeout(() => setScreenshotUri(null), 5000);
//     } catch (err) {
//       console.error('Screenshot error:', err);
//       alert('Failed to take screenshot');
//     }
//   };
//    const ZOOM_FACTOR = 1.2;

// const handleZoomIn = () => {
//   const newRegion = {
//     ...region,
//     latitudeDelta: region.latitudeDelta / ZOOM_FACTOR,
//     longitudeDelta: region.longitudeDelta / ZOOM_FACTOR,
//   };
//   setRegion(newRegion);
//   mapRef.current?.animateToRegion(newRegion, 500);
// };

// const handleZoomOut = () => {
//   const newRegion = {
//     ...region,
//     latitudeDelta: region.latitudeDelta * ZOOM_FACTOR,
//     longitudeDelta: region.longitudeDelta * ZOOM_FACTOR,
//   };
//   setRegion(newRegion);
//   mapRef.current?.animateToRegion(newRegion, 500);
// };


//   if (loading) {
//     return <ActivityIndicator size="large" style={{ flex: 1 }} />;
//   }

//   return (
//     <ViewShot ref={viewShotRef} style={{ flex: 1 }}>
//       <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#111' : '#fff' }}>
//         <View style={{ padding: 10, backgroundColor: '#fff', zIndex: 10 }}>
//           <TextInput
//             placeholder="Search state..."
//             value={searchText}
//             onChangeText={onSearchChange}
//             onSubmitEditing={() => handleSelectState(searchText)}
//             style={{
//               borderWidth: 1,
//               borderColor: '#aaa',
//               paddingHorizontal: 8,
//               paddingVertical: 6,
//               borderRadius: 4,
//               marginBottom: 6,
//             }}
//           />
//           <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'space-between', marginBottom: 6 }}>
//             <Button title="Search" onPress={() => handleSelectState(searchText)} />
//             <Button title="Reset" onPress={handleReset} color="#888" />
//             <Button title={showTraffic ? "Hide Traffic" : "Show Traffic"} onPress={() => setShowTraffic(!showTraffic)} />
//             <Button title={showBuildings ? "Hide 3D" : "Show 3D"} onPress={() => setShowBuildings(!showBuildings)} />
//             <Button title="📸 Save Screenshot" onPress={takeScreenshot} disabled={!!screenshotUri} />
//           </View>
//           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
//             <Text>Show Labels</Text>
//             <Switch value={showLabels} onValueChange={setShowLabels} style={{ marginLeft: 10 }} />
//           </View>
//           {suggestions.length > 0 && (
//             <FlatList
//               data={suggestions}
//               keyExtractor={(item, index) => `${item}-${index}`}
//               style={{ backgroundColor: '#fff', maxHeight: 150, borderColor: '#ccc', borderWidth: 1, marginTop: 4 }}
//               renderItem={({ item }) => (
//                 <TouchableOpacity onPress={() => handleSelectState(item)} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
//                   <Text>{item}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           )}
//         </View>

//         <MapView
//           ref={mapRef}
//           style={{ flex: 1 }}
//           provider={PROVIDER_GOOGLE}
//           customMapStyle={colorScheme === 'dark' ? darkMapStyle : []}
//           showsTraffic={showTraffic}
//           showsBuildings={showBuildings}
//           showsUserLocation={true}
//           region={region}
//           onRegionChangeComplete={setRegion}
//         >
//           {polygons.map((poly, index) => (
//             <React.Fragment key={`${poly.name}-${index}`}>
//               <Polygon
//                 coordinates={poly.coordinates}
//                 strokeColor="#000"
//                 fillColor={
//                   poly.name === selectedState
//                     ? 'rgba(255, 0, 255, 0.5)'
//                     : getColorByValue(stateData[poly.name] || 10)
//                 }
//                 strokeWidth={1}
//                 tappable
//                 onPress={() => handleSelectState(poly.name)}
//               />
//               {showLabels && <Marker coordinate={poly.center} title={poly.name} />}
//             </React.Fragment>
//           ))}
//           {location && <Marker coordinate={location} title="You are here" pinColor="blue" />}
//         </MapView>

//         {/* Zoom Buttons */}
//         <View style={{
//           position: 'absolute',
//           right: 10,
//           bottom: 100,
//           zIndex: 10,
//           flexDirection: 'column',
//           backgroundColor: '#fff',
//           borderRadius: 5,
//           overflow: 'hidden',
//           elevation: 5,
//         }}>
//           <TouchableOpacity onPress={handleZoomIn} style={{
//             padding: 10,
//             borderBottomWidth: 1,
//             borderColor: '#ccc',
//           }}>
//             <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>＋</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={handleZoomOut} style={{ padding: 10 }}>
//             <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>−</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Legend */}
//         <View style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: '#fff', padding: 10, borderRadius: 8, zIndex: 10 }}>
//           <Text style={{ fontWeight: 'bold' }}>Color Legend</Text>
//           <Text style={{ color: 'red' }}>80+ : High</Text>
//           <Text style={{ color: 'orange' }}>60-79 : Medium</Text>
//           <Text style={{ color: 'blue' }}>40-59 : Low</Text>
//           <Text style={{ color: 'green' }}>Below 40 : Very Low</Text>
//         </View>

//         {modalVisible && selectedDetails && (
//           <View style={{
//             position: 'absolute',
//             top: 100,
//             left: 30,
//             right: 30,
//             backgroundColor: '#fff',
//             padding: 20,
//             borderRadius: 10,
//             shadowColor: '#000',
//             shadowOpacity: 0.3,
//             shadowRadius: 10,
//             elevation: 5,
//             zIndex: 20
//           }}>
//             <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{selectedDetails.name}</Text>
//             <Text style={{ marginVertical: 10 }}>Data Value: {selectedDetails.value}</Text>
//             <Button title="Close" onPress={() => setModalVisible(false)} />
//           </View>
//         )}

//         {screenshotUri && (
//           <View style={{
//             position: 'absolute',
//             bottom: 20,
//             left: 20,
//             right: 20,
//             backgroundColor: '#fff',
//             padding: 10,
//             borderRadius: 10,
//             zIndex: 30,
//             shadowColor: '#000',
//             shadowOpacity: 0.2,
//             shadowRadius: 6,
//             elevation: 4,
//             alignItems: 'center'
//           }}>
//             <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Screenshot</Text>
//             <Image source={{ uri: screenshotUri }} style={{ width: 300, height: 200, marginBottom: 10 }} resizeMode="contain" />
//             <Button title="Close Preview" onPress={() => setScreenshotUri(null)} />
//           </View>
//         )}
//       </View>
//     </ViewShot>
//   );
// }

// const darkMapStyle = [
//   { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
//   { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
//   { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
//   { featureType: 'administrative.country', stylers: [{ visibility: 'on' }] },
// ];


import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import Fuse from 'fuse.js';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import ViewShot from 'react-native-view-shot';

export default function MapTabScreen() {
  const [polygons, setPolygons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showLabels, setShowLabels] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showBuildings, setShowBuildings] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const viewShotRef = useRef<any>();
  const colorScheme = useColorScheme();

  const [region, setRegion] = useState({
    latitude: 22.9734,
    longitude: 78.6569,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });

  const stateData: Record<string, number> = {
    Maharashtra: 100,
    Gujarat: 80,
    Kerala: 60,
    Punjab: 40,
    TamilNadu: 20,
  };

  const getColorByValue = (value: number) => {
    if (value >= 80) return 'rgba(255,0,0,0.5)';
    if (value >= 60) return 'rgba(255,165,0,0.5)';
    if (value >= 40) return 'rgba(0,0,255,0.4)';
    return 'rgba(0,255,0,0.4)';
  };

  const loadGeoJson = async () => {
    try {
      const res = await fetch('https://gist.githubusercontent.com/rupinder-developer/6de550b61988c3309904ad4f72d0bbc7/raw/indian-states.geojson');
      const geojson = await res.json();

      const extracted = geojson.features
        .filter(f => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')
        .flatMap((feature) => {
          const coords = feature.geometry.coordinates;
          const name = feature.properties.NAME_1 || feature.properties.name;

          if (feature.geometry.type === 'Polygon') {
            return [{
              coordinates: coords[0].map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
              name,
              center: getCenter(coords[0]),
            }];
          } else {
            return coords.map(polygon => ({
              coordinates: polygon[0].map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
              name,
              center: getCenter(polygon[0]),
            }));
          }
        });

      setPolygons(extracted);
    } catch (err) {
      console.error("Error loading GeoJSON:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCenter = (coords: number[][]) => {
    const lats = coords.map(c => c[1]);
    const lngs = coords.map(c => c[0]);
    return {
      latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
      longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    };
  };

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    }
  };

  useEffect(() => {
    loadGeoJson();
    requestLocation();
  }, []);

  const fuse = new Fuse(polygons, { keys: ['name'], threshold: 0.4 });

  const onSearchChange = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }
    const results = fuse.search(text).map(result => result.item.name);
    setSuggestions(results);
  };

  const handleSelectState = (name: string) => {
    setSuggestions([]);
    if (!name) return;
    setSearchText(name);
    const found = polygons.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setSelectedState(found.name);
      setSelectedDetails({
        name: found.name,
        value: stateData[found.name] || 0,
      });
      setModalVisible(true);
      const newRegion = {
        ...found.center,
        latitudeDelta: 4,
        longitudeDelta: 4,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 800);
    }
  };

  const handleReset = () => {
    setSearchText('');
    setSuggestions([]);
    setSelectedState(null);
    setModalVisible(false);
    const defaultRegion = {
      latitude: 22.9734,
      longitude: 78.6569,
      latitudeDelta: 10,
      longitudeDelta: 10,
    };
    setRegion(defaultRegion);
    mapRef.current?.animateToRegion(defaultRegion, 800);
  };

  const takeScreenshot = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      setScreenshotUri(uri);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('GeoMap Screenshots', asset, false);
        alert('📸 Screenshot saved to gallery!');
      } else {
        alert('Permission denied to save screenshot.');
      }

      setTimeout(() => setScreenshotUri(null), 5000);
    } catch (err) {
      console.error('Screenshot error:', err);
      alert('Failed to take screenshot');
    }
  };

  const ZOOM_FACTOR = 1.2;

  const handleZoomIn = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta / ZOOM_FACTOR,
      longitudeDelta: region.longitudeDelta / ZOOM_FACTOR,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 500);
  };

  const handleZoomOut = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * ZOOM_FACTOR,
      longitudeDelta: region.longitudeDelta * ZOOM_FACTOR,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 500);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <ViewShot ref={viewShotRef} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#111' : '#fff' }}>
        <View style={{ padding: 10, backgroundColor: '#fff', zIndex: 10 }}>
          <TextInput
            placeholder="Search state..."
            value={searchText}
            onChangeText={onSearchChange}
            onSubmitEditing={() => handleSelectState(searchText)}
            style={{
              borderWidth: 1,
              borderColor: '#aaa',
              paddingHorizontal: 8,
              paddingVertical: 6,
              borderRadius: 4,
              marginBottom: 6,
            }}
          />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'space-between', marginBottom: 6 }}>
            <Button title="Search" onPress={() => handleSelectState(searchText)} />
            <Button title="Reset" onPress={handleReset} color="#888" />
            <Button title={showTraffic ? "Hide Traffic" : "Show Traffic"} onPress={() => setShowTraffic(!showTraffic)} />
            <Button title={showBuildings ? "Hide 3D" : "Show 3D"} onPress={() => setShowBuildings(!showBuildings)} />
            <Button title="📸 Save Screenshot" onPress={takeScreenshot} disabled={!!screenshotUri} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text>Show Labels</Text>
            <Switch value={showLabels} onValueChange={setShowLabels} style={{ marginLeft: 10 }} />
          </View>
          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => `${item}-${index}`}
              style={{ backgroundColor: '#fff', maxHeight: 150, borderColor: '#ccc', borderWidth: 1, marginTop: 4 }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectState(item)} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          customMapStyle={colorScheme === 'dark' ? darkMapStyle : []}
          showsTraffic={showTraffic}
          showsBuildings={showBuildings}
          showsUserLocation={true}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {polygons.map((poly, index) => (
            <React.Fragment key={`${poly.name}-${index}`}>
              <Polygon
                coordinates={poly.coordinates}
                strokeColor="#000"
                fillColor={
                  poly.name === selectedState
                    ? 'rgba(255, 0, 255, 0.5)'
                    : getColorByValue(stateData[poly.name] || 10)
                }
                strokeWidth={1}
                tappable
                onPress={() => handleSelectState(poly.name)}
              />
              {showLabels && <Marker coordinate={poly.center} title={poly.name} />}
            </React.Fragment>
          ))}
          {location && <Marker coordinate={location} title="You are here" pinColor="blue" />}
        </MapView>

        {/* Zoom Buttons */}
        <View style={{
          position: 'absolute',
          right: 10,
          bottom: 100,
          zIndex: 10,
          flexDirection: 'column',
          backgroundColor: '#fff',
          borderRadius: 5,
          overflow: 'hidden',
          elevation: 5,
        }}>
          <TouchableOpacity onPress={handleZoomIn} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleZoomOut} style={{ padding: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>−</Text>
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: '#fff', padding: 10, borderRadius: 8, zIndex: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>Color Legend</Text>
          <Text style={{ color: 'red' }}>80+ : High</Text>
          <Text style={{ color: 'orange' }}>60-79 : Medium</Text>
          <Text style={{ color: 'blue' }}>40-59 : Low</Text>
          <Text style={{ color: 'green' }}>Below 40 : Very Low</Text>
        </View>

        {/* Modal */}
        {modalVisible && selectedDetails && (
          <View style={{
            position: 'absolute',
            top: 100,
            left: 30,
            right: 30,
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
            zIndex: 20
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{selectedDetails.name}</Text>
            <Text style={{ marginVertical: 10 }}>Data Value: {selectedDetails.value}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        )}

        {/* Screenshot Preview */}
        {screenshotUri && (
          <View style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 10,
            zIndex: 30,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 4,
            alignItems: 'center'
          }}>
            <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Screenshot</Text>
            <Image source={{ uri: screenshotUri }} style={{ width: 300, height: 200, marginBottom: 10 }} resizeMode="contain" />
            <Button title="Close Preview" onPress={() => setScreenshotUri(null)} />
          </View>
        )}
      </View>
    </ViewShot>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'administrative.country', stylers: [{ visibility: 'on' }] },
];
