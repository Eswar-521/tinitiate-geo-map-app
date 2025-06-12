
// import Fuse from 'fuse.js';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Button,
//   FlatList,
//   Switch,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   useColorScheme,
//   View,
// } from 'react-native';
// import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
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
//   const mapRef = useRef<MapView>(null);
//   const colorScheme = useColorScheme();

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
//     if (value >= 40) return 'rgba(255,255,0,0.5)';
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
//   }, []);

//   const getCenter = (coords: number[][]) => {
//     const lats = coords.map(c => c[1]);
//     const lngs = coords.map(c => c[0]);
//     return {
//       latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
//       longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
//     };
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
//       mapRef.current?.animateToRegion({
//         ...found.center,
//         latitudeDelta: 4,
//         longitudeDelta: 4,
//       }, 800);
//     }
//   };

//   const handleReset = () => {
//     setSearchText('');
//     setSuggestions([]);
//     setSelectedState(null);
//     setModalVisible(false);
//     mapRef.current?.animateToRegion({
//       latitude: 22.9734,
//       longitude: 78.6569,
//       latitudeDelta: 10,
//       longitudeDelta: 10,
//     }, 800);
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ flex: 1 }} />;
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#111' : '#fff' }}>
//       <View style={{ padding: 10, backgroundColor: '#fff', zIndex: 10 }}>
//         <TextInput
//           placeholder="Search state..."
//           value={searchText}
//           onChangeText={onSearchChange}
//           onSubmitEditing={() => handleSelectState(searchText)}
//           style={{
//             borderWidth: 1,
//             borderColor: '#aaa',
//             paddingHorizontal: 8,
//             paddingVertical: 6,
//             borderRadius: 4,
//             marginBottom: 6,
//           }}
//         />
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
//           <Button title="Search" onPress={() => handleSelectState(searchText)} />
//           <Button title="Reset" onPress={handleReset} color="#888" />
//           <Button title={showTraffic ? "Hide Traffic" : "Show Traffic"} onPress={() => setShowTraffic(!showTraffic)} />
//           <Button title={showBuildings ? "Hide 3D" : "Show 3D"} onPress={() => setShowBuildings(!showBuildings)} />
//         </View>
//         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
//           <Text>Show Labels</Text>
//           <Switch value={showLabels} onValueChange={setShowLabels} style={{ marginLeft: 10 }} />
//         </View>
//         {suggestions.length > 0 && (
//           <FlatList
//             data={suggestions}
//             keyExtractor={(item, index) => `${item}-${index}`}
//             style={{ backgroundColor: '#fff', maxHeight: 150, borderColor: '#ccc', borderWidth: 1, marginTop: 4 }}
//             renderItem={({ item }) => (
//               <TouchableOpacity onPress={() => handleSelectState(item)} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
//                 <Text>{item}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </View>

//       <MapView
//         ref={mapRef}
//         style={{ flex: 1 }}
//         provider={PROVIDER_GOOGLE}
//         customMapStyle={colorScheme === 'dark' ? darkMapStyle : []}
//         showsTraffic={showTraffic}
//         showsBuildings={showBuildings}
//         initialRegion={{
//           latitude: 22.9734,
//           longitude: 78.6569,
//           latitudeDelta: 10,
//           longitudeDelta: 10,
//         }}
//       >
//         {polygons.map((poly, index) => (
//           <React.Fragment key={`${poly.name}-${index}`}>
//             <Polygon
//               coordinates={poly.coordinates}
//               strokeColor="#000"
//               fillColor={
//                 poly.name === selectedState
//                   ? 'rgba(255, 0, 255, 0.5)'
//                   : getColorByValue(stateData[poly.name] || 10)
//               }
//               strokeWidth={1}
//               tappable
//               onPress={() => handleSelectState(poly.name)}
//             />
//             {showLabels && (
//               <Marker coordinate={poly.center} title={poly.name} />
//             )}
//           </React.Fragment>
//         ))}
//       </MapView>

//       {modalVisible && selectedDetails && (
//         <View style={{
//           position: 'absolute',
//           top: 100,
//           left: 30,
//           right: 30,
//           backgroundColor: '#fff',
//           padding: 20,
//           borderRadius: 10,
//           shadowColor: '#000',
//           shadowOpacity: 0.3,
//           shadowRadius: 10,
//           elevation: 5,
//           zIndex: 20,
//         }}>
//           <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
//             {selectedDetails.name}
//           </Text>
//           <Text style={{ marginVertical: 10 }}>
//             Data Value: {selectedDetails.value}
//           </Text>
//           <Button title="Close" onPress={() => setModalVisible(false)} />
//         </View>
//       )}
//     </View>
//   );
// }

// const darkMapStyle = [
//   { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
//   { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
//   { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
//   { featureType: 'administrative.country', stylers: [{ visibility: 'on' }] },
// ];


// import * as Location from 'expo-location';
// import Fuse from 'fuse.js';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator, Button, FlatList, Image,
//   Switch, Text, TextInput, TouchableOpacity, useColorScheme, View
// } from 'react-native';
// import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
// import { captureRef } from 'react-native-view-shot';
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
//   const mapViewRef = useRef<View>(null);
//   const colorScheme = useColorScheme();

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
//     if (value >= 40) return 'rgba(255,255,0,0.5)';
//     return 'rgba(0,255,0,0.4)';
//   };

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status === 'granted') {
//         let loc = await Location.getCurrentPositionAsync({});
//         setLocation(loc.coords);
//       }
//     })();

//     const loadGeoJson = async () => {
//       try {
//         const extracted = geojson.features.flatMap((feature) => {
//           const coords = feature.geometry.coordinates;
//           const name = feature.properties.NAME_1;
//           if (feature.geometry.type === 'Polygon') {
//             return [{
//               coordinates: coords[0].map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
//               name,
//               center: getCenter(coords[0]),
//             }];
//           } else {
//             return coords.map(polygon => ({
//               coordinates: polygon[0].map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
//               name,
//               center: getCenter(polygon[0]),
//             }));
//           }
//         });
//         setPolygons(extracted);
//       } catch (err) {
//         console.error("Error loading GeoJSON:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadGeoJson();
//   }, []);

//   const getCenter = (coords: number[][]) => {
//     const lats = coords.map(c => c[1]);
//     const lngs = coords.map(c => c[0]);
//     return {
//       latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
//       longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
//     };
//   };

//   const fuse = new Fuse(polygons, { keys: ['name'], threshold: 0.4 });

//   const onSearchChange = (text: string) => {
//     setSearchText(text);
//     setSuggestions(text.trim() ? fuse.search(text).map(result => result.item.name) : []);
//   };

//   const handleSelectState = (name: string) => {
//     setSuggestions([]);
//     if (!name) return;
//     setSearchText(name);
//     const found = polygons.find(p => p.name.toLowerCase() === name.toLowerCase());
//     if (found) {
//       setSelectedState(found.name);
//       setSelectedDetails({ name: found.name, value: stateData[found.name] || 0 });
//       setModalVisible(true);
//       mapRef.current?.animateToRegion({ ...found.center, latitudeDelta: 4, longitudeDelta: 4 }, 800);
//     }
//   };

//   const handleReset = () => {
//     setSearchText('');
//     setSuggestions([]);
//     setSelectedState(null);
//     setModalVisible(false);
//     mapRef.current?.animateToRegion({ latitude: 22.9734, longitude: 78.6569, latitudeDelta: 10, longitudeDelta: 10 }, 800);
//   };

//   const handleCapture = async () => {
//     if (!mapViewRef.current) return;
//     const uri = await captureRef(mapViewRef, { format: 'png', quality: 1 });
//     setScreenshotUri(uri);
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ flex: 1 }} />;
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#111' : '#fff' }}>
//       <View style={{ padding: 10, backgroundColor: '#fff', zIndex: 10 }}>
//         <TextInput
//           placeholder="Search state..."
//           value={searchText}
//           onChangeText={onSearchChange}
//           onSubmitEditing={() => handleSelectState(searchText)}
//           style={{
//             borderWidth: 1, borderColor: '#aaa', paddingHorizontal: 8, paddingVertical: 6,
//             borderRadius: 4, marginBottom: 6,
//           }}
//         />
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 6 }}>
//           <Button title="Search" onPress={() => handleSelectState(searchText)} />
//           <Button title="Reset" onPress={handleReset} color="#888" />
//           <Button title={showTraffic ? "Hide Traffic" : "Show Traffic"} onPress={() => setShowTraffic(!showTraffic)} />
//           <Button title={showBuildings ? "Hide 3D" : "Show 3D"} onPress={() => setShowBuildings(!showBuildings)} />
//           <Button title="Export Screenshot" onPress={handleCapture} />
//         </View>
//         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
//           <Text>Show Labels</Text>
//           <Switch value={showLabels} onValueChange={setShowLabels} style={{ marginLeft: 10 }} />
//         </View>
//         {suggestions.length > 0 && (
//           <FlatList
//             data={suggestions}
//             keyExtractor={(item, index) => `${item}-${index}`}
//             style={{ backgroundColor: '#fff', maxHeight: 150, borderColor: '#ccc', borderWidth: 1 }}
//             renderItem={({ item }) => (
//               <TouchableOpacity onPress={() => handleSelectState(item)} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
//                 <Text>{item}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </View>

//       <View ref={mapViewRef} collapsable={false} style={{ flex: 1 }}>
//         <MapView
//           ref={mapRef}
//           style={{ flex: 1 }}
//           provider={PROVIDER_GOOGLE}
//           customMapStyle={colorScheme === 'dark' ? darkMapStyle : []}
//           showsTraffic={showTraffic}
//           showsBuildings={showBuildings}
//           showsUserLocation={true}
//           initialRegion={{
//             latitude: 22.9734,
//             longitude: 78.6569,
//             latitudeDelta: 10,
//             longitudeDelta: 10,
//           }}
//         >
//           {polygons.map((poly, index) => (
//             <React.Fragment key={`${poly.name}-${index}`}>
//               <Polygon
//                 coordinates={poly.coordinates}
//                 strokeColor="#000"
//                 fillColor={poly.name === selectedState ? 'rgba(255, 0, 255, 0.5)' : getColorByValue(stateData[poly.name] || 10)}
//                 strokeWidth={1}
//                 tappable
//                 onPress={() => handleSelectState(poly.name)}
//               />
//               {showLabels && <Marker coordinate={poly.center} title={poly.name} />}
//             </React.Fragment>
//           ))}
//           {location && <Marker coordinate={location} title="You are here" pinColor="blue" />}
//         </MapView>
//       </View>

//       {/* Legend */}
//       <View style={{ padding: 10, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around' }}>
//         <View><Text>🟥 80-100</Text></View>
//         <View><Text>🟧 60-79</Text></View>
//         <View><Text>🟨 40-59</Text></View>
//         <View><Text>🟩 0-39</Text></View>
//       </View>

//       {modalVisible && selectedDetails && (
//         <View style={{
//           position: 'absolute', top: 100, left: 30, right: 30,
//           backgroundColor: '#fff', padding: 20, borderRadius: 10,
//           shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10,
//           elevation: 5, zIndex: 20,
//         }}>
//           <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{selectedDetails.name}</Text>
//           <Text style={{ marginVertical: 10 }}>Data Value: {selectedDetails.value}</Text>
//           <Button title="Close" onPress={() => setModalVisible(false)} />
//         </View>
//       )}

//       {screenshotUri && (
//         <View style={{ padding: 10, alignItems: 'center' }}>
//           <Text>📸 Screenshot:</Text>
//           <Image source={{ uri: screenshotUri }} style={{ width: 200, height: 200, marginTop: 10 }} />
//         </View>
//       )}
//     </View>
//   );
// }

// const darkMapStyle = [
//   { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
//   { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
//   { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
//   { featureType: 'administrative.country', stylers: [{ visibility: 'on' }] },
// ];




import * as Location from 'expo-location';
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
import geojson from '../../assets/geojson/india_states.json';

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
    if (value >= 40) return 'rgba(255,255,0,0.5)';
    return 'rgba(0,255,0,0.4)';
  };

  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        const extracted = geojson.features
          .filter(f => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')
          .flatMap((feature) => {
            const coords = feature.geometry.coordinates;
            const name = feature.properties.NAME_1;
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

    loadGeoJson();
    requestLocation();
  }, []);

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
    if (status !== 'granted') return;
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

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
      mapRef.current?.animateToRegion({
        ...found.center,
        latitudeDelta: 4,
        longitudeDelta: 4,
      }, 800);
    }
  };

  const handleReset = () => {
    setSearchText('');
    setSuggestions([]);
    setSelectedState(null);
    setModalVisible(false);
    mapRef.current?.animateToRegion({
      latitude: 22.9734,
      longitude: 78.6569,
      latitudeDelta: 10,
      longitudeDelta: 10,
    }, 800);
  };

  const takeScreenshot = async () => {
    const uri = await viewShotRef.current.capture();
    setScreenshotUri(uri);
    setTimeout(() => setScreenshotUri(null), 5000); // auto-hide after 5s
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
            style={{ borderWidth: 1, borderColor: '#aaa', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4, marginBottom: 6 }}
          />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'space-between', marginBottom: 6 }}>
            <Button title="Search" onPress={() => handleSelectState(searchText)} />
            <Button title="Reset" onPress={handleReset} color="#888" />
            <Button title={showTraffic ? "Hide Traffic" : "Show Traffic"} onPress={() => setShowTraffic(!showTraffic)} />
            <Button title={showBuildings ? "Hide 3D" : "Show 3D"} onPress={() => setShowBuildings(!showBuildings)} />
            <Button title="Export Screenshot" onPress={takeScreenshot} disabled={!!screenshotUri} />
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
          initialRegion={{ latitude: 22.9734, longitude: 78.6569, latitudeDelta: 10, longitudeDelta: 10 }}
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

        {/* Color Legend */}
        <View style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: '#fff', padding: 10, borderRadius: 8, zIndex: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>Color Legend</Text>
          <Text style={{ color: 'red' }}>80+ : High</Text>
          <Text style={{ color: 'orange' }}>60-79 : Medium</Text>
          <Text style={{ color: 'blue' }}>40-59 : Low</Text>
          <Text style={{ color: 'green' }}>Below 40 : Very Low</Text>
        </View>

        {modalVisible && selectedDetails && (
          <View style={{ position: 'absolute', top: 100, left: 30, right: 30, backgroundColor: '#fff', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5, zIndex: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{selectedDetails.name}</Text>
            <Text style={{ marginVertical: 10 }}>Data Value: {selectedDetails.value}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        )}

        {screenshotUri && (
          <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#fff', padding: 10, borderRadius: 10, zIndex: 30, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, elevation: 4, alignItems: 'center' }}>
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
