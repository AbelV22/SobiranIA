import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import Globe from 'react-globe.gl';
import { useIsMobile } from '@/hooks/use-mobile';


// ==================== GITHUB-STYLE SCROLLYTELLING GLOBE ====================
// Combines the "GitHub" vector look (react-globe.gl) with the
// "Scrollytelling" dual-mode logic (Danger vs Safe)
// ===========================================================================

export interface Km0Globe3DProps {
    scrollProgress?: number;
}

const BARCELONA = { lat: 41.3874, lng: 2.1686 };

// --- DATASETS ---

// DANGER MODE (Red): Data fleeing to US/Asia
const DANGER_ARCS = [
    { startLat: BARCELONA.lat, startLng: BARCELONA.lng, endLat: 37.7749, endLng: -122.4194, city: 'San Francisco' },
    { startLat: BARCELONA.lat, startLng: BARCELONA.lng, endLat: 40.7128, endLng: -74.0060, city: 'New York' },
    { startLat: BARCELONA.lat, startLng: BARCELONA.lng, endLat: 35.6762, endLng: 139.6503, city: 'Tokyo' },
    { startLat: BARCELONA.lat, startLng: BARCELONA.lng, endLat: 31.2304, endLng: 121.4737, city: 'Shanghai' },
    { startLat: BARCELONA.lat, startLng: BARCELONA.lng, endLat: 1.3521, endLng: 103.8198, city: 'Singapore' },
].map(d => ({
    ...d,
    color: ['rgba(255,68,68,0.8)', 'rgba(255,68,68,0.1)'],
    stroke: 0.6,
    dash: 0.8,
    gap: 0.2,
}));

// SAFE MODE (Cyan): Controlled data flowing to EU partners (or just staying local/loops)
// We visualize secure connections to key EU nodes
const SAFE_ARCS = [
    { endLat: 48.8566, endLng: 2.3522, city: 'Paris' },
    { endLat: 52.5200, endLng: 13.4050, city: 'Berlin' },
    { endLat: 51.5074, endLng: -0.1278, city: 'London' },
    { endLat: 45.4642, endLng: 9.1900, city: 'Milan' },
    { endLat: 52.3676, endLng: 4.9041, city: 'Amsterdam' },
    { endLat: 50.8503, endLng: 4.3517, city: 'Brussels' },
].map(d => ({
    startLat: BARCELONA.lat,
    startLng: BARCELONA.lng,
    endLat: d.endLat,
    endLng: d.endLng,
    color: ['rgba(34,211,238,0.8)', 'rgba(34,211,238,0.1)'],
    stroke: 0.7,
    dash: 0.5,
    gap: 0.4,
}));

export function Km0Globe3D({ scrollProgress = 0 }: Km0Globe3DProps) {
    const globeRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 1, height: 1 });
    const isMobile = useIsMobile();

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const [countries, setCountries] = useState({ features: [] });

    // Load GeoJSON for vector map
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(setCountries)
            .catch(err => console.error("Failed to load globe data", err));
    }, []);

    // Configure globe controls on mount
    const handleGlobeReady = useCallback(() => {
        const globe = globeRef.current;
        if (!globe) return;

        // Point camera at BCN
        globe.pointOfView({ lat: 38, lng: -5, altitude: 1.7 }, 1000);

        // Auto-rotate
        const controls = globe.controls();
        if (controls) {
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.6;
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.enableRotate = true;
            controls.minPolarAngle = Math.PI * 0.3;
            controls.maxPolarAngle = Math.PI * 0.7;
        }

        // Disable fog to keep colors vivid
        const scene = globe.scene();
        if (scene) scene.fog = null;
    }, []);

    // --- DYNAMIC STATE BASED ON SCROLL ---

    // Decide Mode: 0 = Danger (Red), 1 = Safe (Cyan)
    // Transition happens around scrollProgress 0.5
    const isSafeMode = scrollProgress > 0.5;

    // Arcs
    const currentArcs = useMemo(() => {
        return isSafeMode ? SAFE_ARCS : DANGER_ARCS;
    }, [isSafeMode]);

    // Atmosphere Color (Lerp-ish switch)
    const atmosphereColor = isSafeMode ? "#22d3ee" : "#ff4444";

    // Polygon (Country) Colors
    const getPolygonCapColor = useCallback(() => {
        return isSafeMode
            ? 'rgba(20,30,40,0.9)' // Dark blueish for safe
            : 'rgba(20,20,20,0.9)'; // Neutral dark for danger (was reddish)
    }, [isSafeMode]);

    const getPolygonStrokeColor = useCallback(() => {
        return isSafeMode
            ? 'rgba(34,211,238,0.3)' // Cyan borders
            : 'rgba(255,255,255,0.1)'; // Neutral borders for danger (was red)
    }, [isSafeMode]);

    // Rings (Pulse from Barcelona + Destinations in Danger Mode)
    const ringsData = useMemo(() => {
        const baseRing = {
            lat: BARCELONA.lat,
            lng: BARCELONA.lng,
            maxR: isSafeMode ? 6 : 12,
            propagationSpeed: isSafeMode ? 2 : 5,
            repeatPeriod: isSafeMode ? 1000 : 600,
            color: isSafeMode ? (t: number) => `rgba(34,211,238,${1 - t})` : (t: number) => `rgba(255,68,68,${1 - t})`
        };

        if (isSafeMode) {
            return [baseRing];
        } else {
            // Danger Mode: Barcelona ring + Destination rings
            const destRings = DANGER_ARCS.map(d => ({
                lat: d.endLat,
                lng: d.endLng,
                maxR: 12,
                propagationSpeed: 5,
                repeatPeriod: 600,
                color: (t: number) => `rgba(255,68,68,${1 - t})`
            }));
            return [baseRing, ...destRings];
        }
    }, [isSafeMode]);

    // Points (Barcelona always visible)
    const pointsData = useMemo(() => {
        return [{
            lat: BARCELONA.lat, lng: BARCELONA.lng, size: 0.15,
            color: isSafeMode ? '#22d3ee' : '#ff4444',
            label: 'Barcelona'
        }];
    }, [isSafeMode]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <Globe
                ref={globeRef}
                onGlobeReady={handleGlobeReady}

                // Appearance
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                backgroundColor="rgba(0,0,0,0)"
                showAtmosphere={true}
                atmosphereColor={atmosphereColor}
                atmosphereAltitude={0.15}

                // Vector Map (Polygons)
                polygonsData={countries.features}
                polygonCapColor={getPolygonCapColor}
                polygonSideColor={() => 'rgba(0,0,0,0)'}
                polygonStrokeColor={getPolygonStrokeColor}
                polygonAltitude={0.005}

                // Arcs (Data Flow)
                arcsData={currentArcs}
                arcColor="color"
                arcStroke="stroke"
                arcDashLength="dash"
                arcDashGap="gap"
                arcDashAnimateTime={2000}
                arcAltitudeAutoScale={0.4}
                arcsTransitionDuration={500} // Smooth transition when dataset changes

                // Rings (Pulse)
                ringsData={ringsData}
                ringMaxRadius="maxR"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"
                ringColor="color"

                // Points
                pointsData={pointsData}
                pointAltitude={0.02}
                pointColor="color"
                pointRadius="size"
                pointsMerge={false}

                // Sizing
                width={dimensions.width}
                height={dimensions.height}

                // Performance
                rendererConfig={{ antialias: !isMobile, alpha: true }}
            />
        </div>
    );
}

export default Km0Globe3D;
