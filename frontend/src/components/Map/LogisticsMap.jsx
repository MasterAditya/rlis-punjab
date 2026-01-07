import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { IconBuildingFactory, IconTractor, IconBuildingCottage, IconRoad, IconMapPinFilled } from '@tabler/icons-react';
import { Stack, Group, Text, Divider, Card, Badge } from '@mantine/core';

// --- 1. EXPANDED SANDBOX BOUNDARY (Includes Amritsar & Ferozepur) ---
const SANDBOX_BOUNDARY = [
  [31.75, 74.50], // Top Left (Above Amritsar & Ferozepur)
  [31.75, 76.80], // Top Right (Near Chandigarh/Rupnagar)
  [30.15, 76.80], // Bottom Right (Below Patiala)
  [30.15, 74.50]  // Bottom Left (Below Bathinda/Ferozepur)
];

const SANDBOX_STYLE = {
    color: '#339af0',      // Tech Blue
    weight: 2,             // Thin line
    dashArray: '10, 10',   // Dashed "Digital" look
    fillColor: '#339af0',  
    fillOpacity: 0.03,     // Very faint blue tint
};

// --- 2. ICON FACTORY ---
const createIcon = (ReactIcon, className, size=26) => {
  const iconHtml = renderToStaticMarkup(<ReactIcon size={size} />);
  return L.divIcon({
    html: `<div class="${className}">${iconHtml}</div>`,
    className: "bg-transparent",
    iconSize: [size, size],
    iconAnchor: [size/2, size],
  });
};

const icons = {
  "Hub": createIcon(IconBuildingFactory, "custom-icon-hub"),
  "Mandi": createIcon(IconTractor, "custom-icon-mandi"),
  "Village": createIcon(IconBuildingCottage, "custom-icon-village", 24),
  "Road": createIcon(IconRoad, "custom-icon-road", 24),
  "Search": createIcon(IconMapPinFilled, "search-pin", 48), 
};

// --- 3. PULSE FACTORY ---
const createPulseIcon = (priority) => {
  const p = priority ? priority.toLowerCase() : "low";
  let cssClass = "severity-low"; 
  if (p.includes("critical")) cssClass = "severity-critical";
  else if (p.includes("high")) cssClass = "severity-high";
  else if (p.includes("medium")) cssClass = "severity-medium";
  
  return L.divIcon({
    html: `<div class="incident-dot ${cssClass}"></div>`,
    className: "bg-transparent",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const isValid = (lat, lng) => {
    return lat !== undefined && lng !== undefined && lat !== null && lng !== null;
};

// --- 4. ZOOM CONTROLLER ---
function MapController({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && isValid(coords[0], coords[1])) {
      map.flyTo(coords, 13, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

const LogisticsMap = ({ center, activeCoords, locations, incidents, searchResult }) => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "#0c0d0e", zIndex: 0 }}>
      <MapContainer center={center} zoom={9} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        
        {/* NEON TILES */}
        <div className="neon-map-tiles">
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </div>

        <MapController coords={activeCoords} />

        {/* --- THE SANDBOX FENCE --- */}
        <Polygon positions={SANDBOX_BOUNDARY} pathOptions={SANDBOX_STYLE}>
            <Tooltip permanent direction="top" offset={[0, -10]} opacity={0.7} className="sandbox-tooltip">
                ACTIVE OPERATION ZONE (SANDBOX V1)
            </Tooltip>
        </Polygon>

        {/* STATIC NODES */}
        {locations.map((loc) => {
             if (!isValid(loc.lat, loc.lng)) return null;
             return (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={icons[loc.type] || icons["Village"]}>
                <Popup className="custom-popup">
                    <Text fw={700} tt="uppercase" size="xs">{loc.name}</Text>
                    <Badge size="xs" color="gray" variant="light">{loc.type}</Badge>
                </Popup>
              </Marker>
             );
        })}

        {/* SEARCH TARGET */}
        {searchResult && isValid(searchResult.coords[0], searchResult.coords[1]) && (
           <Marker position={searchResult.coords} icon={icons["Search"]}>
             <Popup><Text fw={900} c="red" tt="uppercase">📍 {searchResult.label}</Text></Popup>
           </Marker>
        )}

        {/* ACTIVE INCIDENTS */}
        {incidents.map((inc) => {
             if (!inc.position || !isValid(inc.position[0], inc.position[1])) return null;
             return (
              <Marker key={inc.id} position={inc.position} icon={createPulseIcon(inc.priority)}>
                <Popup>
                   <Text fw={700} size="sm" c={inc.priority.includes("Critical") ? "red" : "dark"}>{inc.category} ALERT</Text>
                   <Divider my={4} />
                   <Text size="xs">{inc.text}</Text>
                </Popup>
              </Marker>
             );
        })}

      </MapContainer>

      {/* --- DIRECTORY LEGEND --- */}
      <Card shadow="xl" radius="md" p="md" style={{ 
          position: 'absolute', bottom: 30, right: 30, zIndex: 900, 
          background: 'rgba(12, 13, 14, 0.90)', border: '1px solid #333', 
          color: '#e0e0e0', minWidth: 220 
      }}>
          <Text size="xs" fw={800} c="dimmed" mb={10} tt="uppercase" ls={1}>Network Directory</Text>
          <Stack gap={10}>
            <Group gap="xs"><IconBuildingFactory size={16} color="#ff6b6b" /><Text size="xs">Logistics Hub</Text></Group>
            <Group gap="xs"><IconTractor size={16} color="#fcc419" /><Text size="xs">Grain Mandi</Text></Group>
            <Group gap="xs"><IconBuildingCottage size={16} color="#20c997" /><Text size="xs">Village Node</Text></Group>
            <Group gap="xs"><IconRoad size={16} color="#adb5bd" /><Text size="xs">Key Route / Road</Text></Group>
            <Divider color="gray.8" />
            <Text size="xs" fw={800} c="dimmed" tt="uppercase" ls={1}>Signals</Text>
            <Group gap="xs"><div className="incident-dot severity-critical" style={{width:12, height:12, border:'none'}}></div><Text size="xs">Critical (Panic Pulse)</Text></Group>
            <Group gap="xs"><div className="incident-dot severity-high" style={{width:12, height:12, border:'none'}}></div><Text size="xs">High (Fast Pulse)</Text></Group>
            <Group gap="xs"><div className="incident-dot severity-medium" style={{width:12, height:12, border:'none'}}></div><Text size="xs">Medium (Slow Pulse)</Text></Group>
            <Group gap="xs"><div className="incident-dot severity-low" style={{width:12, height:12, border:'none'}}></div><Text size="xs">Low (Calm - No Pulse)</Text></Group>
          </Stack>
      </Card>
    </div>
  );
};

export default LogisticsMap;