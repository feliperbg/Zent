'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Default Icon in Next.js
const fixLeafletIcon = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
};

// Component to handle map clicks/drags to update position
function DraggableMarker({ position, onPositionChange }: { position: [number, number], onPositionChange: (lat: number, lng: number) => void }) {
    const markerRef = useRef<L.Marker>(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const { lat, lng } = marker.getLatLng();
                    onPositionChange(lat, lng);
                }
            },
        }),
        [onPositionChange],
    );

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    );
}

// Component to recenter map when props change
function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMapEvents({});
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

interface LocationPickerMapProps {
    lat: number;
    lng: number;
    onPositionChange: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({ lat, lng, onPositionChange }: LocationPickerMapProps) {
    useEffect(() => {
        fixLeafletIcon();
    }, []);

    const [position, setPosition] = useState<[number, number]>([lat, lng]);

    useEffect(() => {
        setPosition([lat, lng]);
    }, [lat, lng]);

    const handleChange = (newLat: number, newLng: number) => {
        setPosition([newLat, newLng]);
        onPositionChange(newLat, newLng);
    };

    return (
        <MapContainer
            center={[lat, lng]}
            zoom={18}
            style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker position={position} onPositionChange={handleChange} />
            <MapUpdater center={[lat, lng]} />
        </MapContainer>
    );
}
