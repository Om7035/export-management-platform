import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // Leaflet dependency

const Map = ({ shipmentData }) => {
  const mapRef = useRef(null);
  const { coordinates, description, location } = shipmentData;

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize(); // Resize map if necessary
    }
  }, []);

  // Custom SVG Pin as the icon
  const pinIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="red" d="M12 2C7 2 3 6 3 10c0 4 3 6 6 9 2 2 3 4 3 4s1-2 3-4c3-3 6-5 6-9 0-4-4-8-9-8z"/>
      </svg>`)}`,
    iconSize: [32, 32], // Icon size
    iconAnchor: [16, 32], // Anchor at the bottom center
    popupAnchor: [0, -32], // Position the popup above the pin
  });

  return (
    <MapContainer
      center={coordinates}
      zoom={13}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
      whenCreated={(map) => (mapRef.current = map)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={coordinates} icon={pinIcon}>
        <Popup>
          <strong>{description}</strong><br />
          {location}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
