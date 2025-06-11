import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';

export default function MapScreen() {
  const [polygons, setPolygons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGeoJson = async () => {
      const asset = Asset.fromModule(require('../../../assets/geojson/india_states.json'));
      await asset.downloadAsync();
      const fileUri = asset.localUri || asset.uri;
      const response = await FileSystem.readAsStringAsync(fileUri);
      const geojson = JSON.parse(response);

      const extractedPolygons = geojson.features
        .filter(f => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')
        .flatMap((feature) => {
          const coords = feature.geometry.coordinates;
          if (feature.geometry.type === 'Polygon') {
            return [{
              coordinates: coords[0].map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
              name: feature.properties.NAME_1
            }];
          } else {
            return coords.map(polygon =>
              ({
                coordinates: polygon[0].map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
                name: feature.properties.NAME_1
              })
            );
          }
        });

      setPolygons(extractedPolygons);
      setLoading(false);
    };

    loadGeoJson();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 22.9734,
        longitude: 78.6569,
        latitudeDelta: 10,
        longitudeDelta: 10,
      }}
    >
      {polygons.map((poly, index) => (
        <Polygon
          key={index}
          coordinates={poly.coordinates}
          strokeColor="#000"
          fillColor="rgba(100, 100, 200, 0.3)"
          strokeWidth={1}
        />
      ))}
    </MapView>
  );
}


