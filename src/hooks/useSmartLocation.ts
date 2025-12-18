import { useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { identifyLocation } from '@/app/actions/geo';
import { toast } from 'sonner';

interface SmartLocationState {
    loading: boolean;
    data: {
        name: string;
        category: string;
        address?: string;
    } | null;
    error: string | null;
}

export function useSmartLocation() {
    const [state, setState] = useState<SmartLocationState>({
        loading: false,
        data: null,
        error: null
    });

    const checkCurrentLocation = async (userId?: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            // Check permissions
            // On Web, the browser handles permissions automatically during getCurrentPosition
            if (Capacitor.getPlatform() !== 'web') {
                const permission = await Geolocation.checkPermissions();

                if (permission.location !== 'granted') {
                    const request = await Geolocation.requestPermissions();
                    if (request.location !== 'granted') {
                        throw new Error('Permissão de localização negada');
                    }
                }
            }

            // Get Position
            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 3000
            });
            const { latitude, longitude } = position.coords;

            // Call Server Action
            const result = await identifyLocation(latitude, longitude, userId);

            if (result) {
                // ... result handling ...
                setState({
                    loading: false,
                    data: result,
                    error: null
                });
            } else {
                setState({
                    loading: false,
                    data: null,
                    error: 'Local não identificado'
                });
            }

            return result;

        } catch (error: any) {
            console.error('Smart Location Error:', error);
            setState({
                loading: false,
                data: null,
                error: error.message || 'Erro ao obter localização'
            });
            toast.error('Erro ao obter localização');
            return null;
        }
    };

    return {
        ...state,
        checkCurrentLocation
    };
}
