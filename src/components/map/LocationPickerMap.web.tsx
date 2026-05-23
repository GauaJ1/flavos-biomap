import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/colors';

interface Props {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

/**
 * Mapa interativo clicável para selecionar coordenadas.
 * Versão Web: usa Blob URL com Leaflet (OpenStreetMap) para contornar
 * restrições de CSP que srcDoc impõe sobre scripts externos.
 */
export const LocationPickerMap = ({ latitude, longitude, onChange }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  // Centro padrão: Brasil
  const defaultLat = -14.235;
  const defaultLng = -51.925;
  const displayLat = latitude ?? defaultLat;
  const displayLng = longitude ?? defaultLng;
  const zoom = latitude && longitude ? 12 : 4;

  // Monta o HTML inline com Leaflet carregando do CDN
  const buildHtml = useCallback(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([${displayLat}, ${displayLng}], ${zoom});
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '\\u00a9 OpenStreetMap \\u00a9 CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    var marker = null;
    ${latitude && longitude ? `marker = L.marker([${latitude}, ${longitude}]).addTo(map);` : ''}

    map.on('click', function(e) {
      var lat = e.latlng.lat;
      var lng = e.latlng.lng;
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
      window.parent.postMessage(JSON.stringify({ type: 'MAP_CLICK', lat: lat, lng: lng }), '*');
    });
  <\/script>
</body>
</html>`;
  }, [displayLat, displayLng, zoom, latitude, longitude]);

  // Cria o Blob URL e limpa o anterior ao desmontar
  useEffect(() => {
    const html = buildHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    blobUrlRef.current = url;

    if (iframeRef.current) {
      iframeRef.current.src = url;
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [buildHtml]);

  // Escuta postMessage do iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.type === 'MAP_CLICK' && typeof data.lat === 'number' && typeof data.lng === 'number') {
          onChange(data.lat, data.lng);
        }
      } catch {
        // ignora mensagens que não são JSON do nosso mapa
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onChange]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>📍 Marque no Mapa (Clique para definir)</Text>
      <View style={styles.mapWrapper}>
        <iframe
          ref={iframeRef}
          title="Location Picker Map"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 12,
          }}
        />
      </View>
      {latitude && longitude ? (
        <View style={styles.coordsDisplay}>
          <Text style={styles.coordsIcon}>📌</Text>
          <Text style={styles.coordsText}>
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </Text>
        </View>
      ) : (
        <Text style={styles.hint}>
          Toque em qualquer lugar do mapa para definir a localização do produto e da comunidade.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  mapWrapper: {
    height: 260,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2DBCF',
    ...SHADOWS.small,
  },
  hint: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  coordsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  coordsIcon: {
    fontSize: 14,
  },
  coordsText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    fontVariant: ['tabular-nums'],
  },
});
