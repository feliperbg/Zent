'use server';

import prisma from '@/lib/prisma';
import { PlaceType } from '@prisma/client';

interface GeoResponse {
    name: string;
    category: string;
    address?: string;
    source: 'cache' | 'google' | 'saved';
    latitude?: number;
    longitude?: number;
    alternatives?: GeoResponse[];
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

// Simple mapping from Google types to internal categories
function mapGoogleTypeToCategory(type: string): string {
    const t = type.toLowerCase();
    if (['restaurant', 'cafe', 'bar', 'food_court', 'bakery', 'meal_delivery', 'meal_takeaway'].some(x => t.includes(x))) return 'Alimentação';
    if (['gas_station', 'parking', 'car_wash', 'auto_repair', 'parking_lot'].some(x => t.includes(x))) return 'Transporte';
    if (['supermarket', 'grocery_store', 'convenience_store', 'liquor_store'].some(x => t.includes(x))) return 'Mercado';
    if (['gym', 'spa', 'beauty_salon', 'hair_care', 'hospital', 'doctor', 'pharmacy', 'drugstore'].some(x => t.includes(x))) return 'Saúde';
    if (['shopping_mall', 'store', 'clothing_store', 'electronics_store', 'home_goods_store'].some(x => t.includes(x))) return 'Compras';
    return 'Outros';
}

export async function identifyLocation(lat: number, lng: number, userId?: string): Promise<GeoResponse | null> {
    try {
        // 0. Check User Saved Places (Priority 1)
        // Check within 50 meters
        if (userId) {
            const savedPlaces = await prisma.place.findMany({
                where: { userId }
            });

            const matchSaved = savedPlaces.find(place => {
                const dist = getDistanceFromLatLonInKm(lat, lng, place.latitude, place.longitude);
                return dist < 0.05; // 50m
            });

            if (matchSaved) {
                // Map internal PlaceType to category string
                let category = 'Outros';
                if (matchSaved.type === 'HOME') category = 'Casa';
                if (matchSaved.type === 'WORK') category = 'Trabalho';
                if (matchSaved.type === 'STORE') category = 'Compras';

                return {
                    name: matchSaved.name,
                    category: category,
                    source: 'saved' // custom source type
                } as any;
            }
        }

        // 1. Check Cache (Radius < 20m = 0.0002 deg approx)
        const range = 0.0002;

        const cachedLocations = await prisma.locationCache.findMany({
            where: {
                latitude: {
                    gte: lat - range,
                    lte: lat + range
                },
                longitude: {
                    gte: lng - range,
                    lte: lng + range
                }
            }
        });

        const match = cachedLocations.find(loc => {
            const dist = getDistanceFromLatLonInKm(lat, lng, loc.latitude, loc.longitude);
            return dist < 0.02; // 20 meters
        });

        if (match) {
            return {
                name: match.name,
                category: match.category || 'Outros',
                address: match.address || undefined,
                source: 'cache'
            };
        }

        // 2. Google Places API (New) - Search Nearby
        const apiKey = process.env.GOOGLE_MAPS_KEY;
        if (!apiKey) {
            console.warn('GOOGLE_MAPS_KEY not configured');
            return null;
        }

        const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.primaryType,places.formattedAddress,places.id,places.location'
            },
            body: JSON.stringify({
                includedTypes: [
                    'restaurant', 'cafe', 'bar', 'supermarket', 'gas_station',
                    'gym', 'shopping_mall', 'store', 'bakery', 'drugstore',
                    'point_of_interest', 'establishment' // Broader search
                ],
                maxResultCount: 5,
                locationRestriction: {
                    circle: {
                        center: { latitude: lat, longitude: lng },
                        radius: 100.0 // Increased radius
                    }
                },
                rankPreference: 'DISTANCE'
            })
        });

        const data = await response.json();

        if (data.places && data.places.length > 0) {
            const places = data.places.map((p: any) => {
                const name = p.displayName?.text || 'Local Desconhecido';
                const type = p.primaryType || 'unknown';
                return {
                    name: name,
                    category: mapGoogleTypeToCategory(type),
                    address: p.formattedAddress,
                    source: 'google',
                    latitude: p.location?.latitude || lat,
                    longitude: p.location?.longitude || lng,
                    googleId: p.id
                };
            });

            const primary = places[0];
            const alternatives = places.slice(1);

            // Save primary to Cache
            await prisma.locationCache.create({
                data: {
                    latitude: lat,
                    longitude: lng,
                    name: primary.name,
                    address: primary.address,
                    googleId: primary.googleId,
                    category: primary.category
                }
            });

            return {
                ...primary,
                alternatives: alternatives
            } as any; // Type assertion to match GeoResponse + alternatives
        }

        console.log('No relevant place found nearby');
        return null;

    } catch (error) {
        console.error('Error identifying location:', error);
        return null;
    }
}
