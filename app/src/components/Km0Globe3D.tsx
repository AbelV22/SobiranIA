import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// ================================================================
//  KM0 GLOBE — "Del Caos al Control"
//  Dual-mode 3D globe that transitions between:
//    mode=0 (DANGER): Red/orange arcs fleeing Barcelona → USA/Asia
//    mode=1 (SAFE):   Cyan shield dome + local data loops
//  `scrollProgress` (0→1) drives smooth color/behavior lerp
// ================================================================

const BCN_LAT = 41.3874;
const BCN_LON = 2.1686;
const GLOBE_RADIUS = 2.2;

// Danger palette
const COLOR_DANGER = new THREE.Color(0xff4444);
const COLOR_DANGER_DIM = new THREE.Color(0xff6b35);
const COLOR_DANGER_BG = new THREE.Color(0x1a0505);

// Safe palette
const COLOR_SAFE = new THREE.Color(0x22d3ee);
const COLOR_SAFE_DIM = new THREE.Color(0x0891b2);
const COLOR_SAFE_BG = new THREE.Color(0x000000);

function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// ─── Globe wireframe grid ───
function GlobeWireframe({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const matsRef = useRef<THREE.LineBasicMaterial[]>([]);
  const shellRef = useRef<THREE.Mesh>(null);

  const gridLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = [];
    for (let lat = -60; lat <= 70; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lon = -180; lon <= 180; lon += 4) pts.push(latLonToVec3(lat, lon, GLOBE_RADIUS));
      lines.push(new THREE.BufferGeometry().setFromPoints(pts));
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 4) pts.push(latLonToVec3(lat, lon, GLOBE_RADIUS));
      lines.push(new THREE.BufferGeometry().setFromPoints(pts));
    }
    return lines;
  }, []);

  useFrame(() => {
    const lerpedColor = COLOR_DANGER_DIM.clone().lerp(COLOR_SAFE_DIM, progress);
    matsRef.current.forEach((m) => {
      m.color.copy(lerpedColor);
      m.opacity = 0.04 + progress * 0.04;
    });
    if (shellRef.current) {
      (shellRef.current.material as THREE.MeshBasicMaterial).color.copy(lerpedColor);
    }
  });

  return (
    <group ref={groupRef}>
      {gridLines.map((geo, i) => (
        <line key={i} geometry={geo}>
          <lineBasicMaterial
            ref={(el) => { if (el) matsRef.current[i] = el; }}
            color={0xff4444}
            transparent
            opacity={0.05}
          />
        </line>
      ))}
      <mesh ref={shellRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
        <meshBasicMaterial color={0xff4444} transparent opacity={0.02} wireframe />
      </mesh>
    </group>
  );
}

// ─── Barcelona glowing node ───
function BarcelonaPoint({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const bcnPos = useMemo(() => latLonToVec3(BCN_LAT, BCN_LON, GLOBE_RADIUS), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const scale = 1 + Math.sin(t * 3.5) * 0.25;
    groupRef.current.scale.setScalar(scale);

    const c = COLOR_DANGER.clone().lerp(COLOR_SAFE, progress);
    [coreRef, innerRef, outerRef].forEach((ref) => {
      if (ref.current) (ref.current.material as THREE.MeshBasicMaterial).color.copy(c);
    });
  });

  return (
    <group position={bcnPos}>
      <group ref={groupRef}>
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={0xff4444} />
        </mesh>
        <mesh ref={innerRef}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial color={0xff4444} transparent opacity={0.45} />
        </mesh>
        <mesh ref={outerRef}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial color={0xff4444} transparent opacity={0.12} />
        </mesh>
      </group>
      {[0, 1, 2].map((i) => (
        <PulseRing key={i} delay={i * 1.1} position={bcnPos} progress={progress} />
      ))}
    </group>
  );
}

function PulseRing({ delay, position, progress }: { delay: number; position: THREE.Vector3; progress: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());
    return q;
  }, [position]);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = ((state.clock.elapsedTime + delay) % 2.8) / 2.8;
    ringRef.current.scale.setScalar(0.5 + t * 2.5);
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = (1 - t) * 0.35;
    mat.color.copy(COLOR_DANGER.clone().lerp(COLOR_SAFE, progress));
  });

  return (
    <mesh ref={ringRef} quaternion={quaternion}>
      <ringGeometry args={[0.08, 0.11, 32]} />
      <meshBasicMaterial color={0xff4444} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── DANGER: Arcs fleeing Barcelona → USA + Asia ───
function DangerFlows({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const { geometries, particleData } = useMemo(() => {
    const routes = [
      // Barcelona → USA
      { from: [BCN_LAT, BCN_LON], to: [37.77, -122.42] },   // → San Francisco
      { from: [BCN_LAT, BCN_LON], to: [40.71, -74.01] },    // → New York
      { from: [BCN_LAT, BCN_LON], to: [47.61, -122.33] },   // → Seattle
      { from: [BCN_LAT, BCN_LON], to: [34.05, -118.24] },   // → Los Angeles
      // Barcelona → Asia
      { from: [BCN_LAT, BCN_LON], to: [35.68, 139.69] },    // → Tokyo
      { from: [BCN_LAT, BCN_LON], to: [31.23, 121.47] },    // → Shanghai
      { from: [BCN_LAT, BCN_LON], to: [1.35, 103.82] },     // → Singapore
    ];

    const geometries: THREE.BufferGeometry[] = [];
    const particleData: { curvePoints: THREE.Vector3[] }[] = [];

    routes.forEach(({ from, to }) => {
      const start = latLonToVec3(from[0], from[1], GLOBE_RADIUS + 0.03);
      const end = latLonToVec3(to[0], to[1], GLOBE_RADIUS + 0.03);
      const points: THREE.Vector3[] = [];
      const segs = 64;
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const p = start.clone().lerp(end, t);
        const lift = Math.sin(t * Math.PI) * 1.2;
        p.normalize().multiplyScalar(GLOBE_RADIUS + 0.03 + lift);
        points.push(p);
      }
      geometries.push(new THREE.BufferGeometry().setFromPoints(points));
      particleData.push({ curvePoints: points });
    });

    return { geometries, particleData };
  }, []);

  // Animated flowing dots along arcs
  const dotRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const dangerOpacity = (1 - progress) * 0.35;

    // Fade entire group
    groupRef.current.visible = progress < 0.95;

    // Animate line materials
    groupRef.current.children.forEach((child) => {
      if ((child as THREE.Line).isLine) {
        const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
        mat.opacity = dangerOpacity * (0.6 + Math.sin(t * 2) * 0.2);
      }
    });

    // Animate flowing dots
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      const curve = particleData[i]?.curvePoints;
      if (!curve) return;
      const idx = Math.floor(((t * 0.4 + i * 0.15) % 1) * (curve.length - 1));
      const pt = curve[idx];
      if (pt) {
        dot.position.copy(pt);
        (dot.material as THREE.MeshBasicMaterial).opacity = dangerOpacity * 1.5;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {geometries.map((geo, i) => (
        <line key={`arc-${i}`} geometry={geo}>
          <lineBasicMaterial
            color={COLOR_DANGER}
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
      {particleData.map((_, i) => (
        <mesh
          key={`dot-${i}`}
          ref={(el) => { if (el) dotRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={COLOR_DANGER} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ─── SAFE: Privacy Dome + Local Data Loops ───
function SafeShield({ progress }: { progress: number }) {
  const domeRef = useRef<THREE.Mesh>(null);
  const hexRingsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!domeRef.current) return;
    const t = state.clock.elapsedTime;
    const mat = domeRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = progress * (0.05 + Math.sin(t * 1.5) * 0.02);

    if (hexRingsRef.current) {
      hexRingsRef.current.rotation.y = t * 0.15;
      hexRingsRef.current.children.forEach((child, i) => {
        const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        m.opacity = progress * (0.08 + Math.sin(t * 2 + i) * 0.03);
      });
    }
  });

  return (
    <group visible={progress > 0.05}>
      {/* Shield dome */}
      <mesh ref={domeRef}>
        <sphereGeometry args={[GLOBE_RADIUS + 0.65, 48, 48]} />
        <meshBasicMaterial
          color={COLOR_SAFE}
          transparent
          opacity={0}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Hexagonal scanning rings */}
      <group ref={hexRingsRef}>
        {[GLOBE_RADIUS + 0.5, GLOBE_RADIUS + 0.7, GLOBE_RADIUS + 0.9].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.15, 0, 0]}>
            <ringGeometry args={[r - 0.015, r, 6]} />
            <meshBasicMaterial
              color={COLOR_SAFE}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Local data loops that orbit around Barcelona (safe mode)
function LocalDataLoops({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const bcnPos = useMemo(() => latLonToVec3(BCN_LAT, BCN_LON, GLOBE_RADIUS), []);

  // Create orbital loop geometries around Barcelona
  const loops = useMemo(() => {
    const result: THREE.BufferGeometry[] = [];
    const dir = bcnPos.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const tangent1 = new THREE.Vector3().crossVectors(dir, up).normalize();
    const tangent2 = new THREE.Vector3().crossVectors(dir, tangent1).normalize();

    for (let loop = 0; loop < 5; loop++) {
      const points: THREE.Vector3[] = [];
      const loopRadius = 0.25 + loop * 0.12;
      const tilt = (loop - 2) * 0.3;
      const segs = 48;
      for (let i = 0; i <= segs; i++) {
        const angle = (i / segs) * Math.PI * 2;
        const offset = tangent1.clone().multiplyScalar(Math.cos(angle) * loopRadius)
          .add(tangent2.clone().multiplyScalar(Math.sin(angle) * loopRadius))
          .add(dir.clone().multiplyScalar(tilt * Math.sin(angle) * 0.3));
        const pt = bcnPos.clone().add(offset);
        pt.normalize().multiplyScalar(GLOBE_RADIUS + 0.15 + loop * 0.06);
        points.push(pt);
      }
      result.push(new THREE.BufferGeometry().setFromPoints(points));
    }
    return result;
  }, [bcnPos]);

  // Orbiting particles
  const orbitDotsRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.visible = progress > 0.1;

    groupRef.current.children.forEach((child) => {
      if ((child as THREE.Line).isLine) {
        const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
        mat.opacity = progress * 0.2;
      }
    });

    orbitDotsRef.current.forEach((dot, i) => {
      if (!dot) return;
      const loopGeo = loops[i];
      if (!loopGeo) return;
      const posArr = loopGeo.attributes.position.array as Float32Array;
      const totalPts = posArr.length / 3;
      const speed = 0.3 + i * 0.08;
      const idx = Math.floor(((t * speed + i * 0.2) % 1) * (totalPts - 1));
      const i3 = idx * 3;
      dot.position.set(posArr[i3], posArr[i3 + 1], posArr[i3 + 2]);
      (dot.material as THREE.MeshBasicMaterial).opacity = progress * 0.9;
    });
  });

  return (
    <group ref={groupRef}>
      {loops.map((geo, i) => (
        <line key={`loop-${i}`} geometry={geo}>
          <lineBasicMaterial
            color={COLOR_SAFE}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
      {loops.map((_, i) => (
        <mesh
          key={`orbit-dot-${i}`}
          ref={(el) => { if (el) orbitDotsRef.current[i] = el; }}
        >
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color={COLOR_SAFE} transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Ambient data particles ───
function AmbientParticles({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 300;

  const { positions, baseColors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const baseColors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = GLOBE_RADIUS + 0.3 + Math.random() * 2;

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      baseColors[i3] = 1;
      baseColors[i3 + 1] = 1;
      baseColors[i3 + 2] = 1;

      sizes[i] = Math.random() * 0.025 + 0.008;
    }

    return { positions, baseColors, sizes };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
  }), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uProgress.value = progress;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[baseColors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform float uProgress;
          attribute float size;
          varying float vProgress;
          varying float vDist;
          void main() {
            vProgress = uProgress;
            vec3 pos = position;
            pos += normalize(pos) * sin(uTime * 0.8 + length(pos) * 2.0) * 0.05;
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = size * (300.0 / -mv.z);
            vDist = length(pos);
          }
        `}
        fragmentShader={`
          varying float vProgress;
          varying float vDist;
          void main() {
            vec2 c = 2.0 * gl_PointCoord - 1.0;
            float d = length(c);
            if (d > 1.0) discard;
            float glow = pow(1.0 - d, 2.0);
            // Lerp from red/orange to cyan
            vec3 dangerCol = vec3(1.0, 0.3, 0.2);
            vec3 safeCol = vec3(0.133, 0.827, 0.933);
            vec3 col = mix(dangerCol, safeCol, vProgress);
            gl_FragColor = vec4(col * glow, glow * 0.5);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Lighting that transitions ───
function DynamicLighting({ progress }: { progress: number }) {
  const mainRef = useRef<THREE.PointLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (mainRef.current) {
      mainRef.current.color.copy(COLOR_DANGER.clone().lerp(COLOR_SAFE, progress));
      mainRef.current.intensity = 0.6 + progress * 0.4;
    }
    if (fillRef.current) {
      fillRef.current.color.copy(
        new THREE.Color(0x661111).lerp(new THREE.Color(0x0e4f5e), progress)
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.03 + progress * 0.03} />
      <pointLight ref={mainRef} position={[4, 4, 4]} intensity={0.8} color={0xff4444} distance={16} />
      <pointLight ref={fillRef} position={[-4, -3, 3]} intensity={0.4} color={0x661111} distance={14} />
    </>
  );
}

// ─── Background color transition ───
function BackgroundTransition({ progress }: { progress: number }) {
  const colorRef = useRef<THREE.Color>(new THREE.Color());

  useFrame(({ scene }) => {
    colorRef.current.copy(COLOR_DANGER_BG).lerp(COLOR_SAFE_BG, progress);
    scene.background = colorRef.current;
    (scene.fog as THREE.Fog).color.copy(colorRef.current);
  });

  return null;
}

// ─── Master scene ───
function GlobeScene({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgress = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    // Smooth interpolation
    smoothProgress.current = THREE.MathUtils.lerp(smoothProgress.current, scrollProgress, 0.04);
    // Slow rotation
    groupRef.current.rotation.y += 0.001 + smoothProgress.current * 0.001;
  });

  const p = smoothProgress.current;

  return (
    <>
      <BackgroundTransition progress={p} />
      <DynamicLighting progress={p} />
      <group ref={groupRef} rotation={[0.25, -0.4, 0.05]}>
        <GlobeWireframe progress={p} />
        <BarcelonaPoint progress={p} />
        <DangerFlows progress={p} />
        <SafeShield progress={p} />
        <LocalDataLoops progress={p} />
        <AmbientParticles progress={p} />
      </group>
    </>
  );
}

function PostFX() {
  return (
    <EffectComposer>
      <Bloom intensity={2.0} luminanceThreshold={0.08} luminanceSmoothing={0.85} height={280} width={280} />
    </EffectComposer>
  );
}

// ════════════════════════════════════════
//  PUBLIC API
// ════════════════════════════════════════

export interface Km0Globe3DProps {
  /** 0 = danger (red, data leaking) → 1 = safe (cyan, sovereign) */
  scrollProgress?: number;
}

export function Km0Globe3D({ scrollProgress = 0 }: Km0Globe3DProps) {
  // Sync progress via ref to avoid Canvas re-renders
  const progressRef = useRef(scrollProgress);
  useEffect(() => { progressRef.current = scrollProgress; }, [scrollProgress]);

  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <fog attach="fog" args={['#1a0505', 7, 16]} />
      <GlobeSceneWrapper progressRef={progressRef} />
      <PostFX />
    </Canvas>
  );
}

// Wrapper to read ref inside Canvas
function GlobeSceneWrapper({ progressRef }: { progressRef: React.RefObject<number> }) {
  const progressValue = useRef(0);
  useFrame(() => {
    progressValue.current = progressRef.current ?? 0;
  });

  return <GlobeSceneInner progressValue={progressValue} />;
}

function GlobeSceneInner({ progressValue }: { progressValue: React.RefObject<number> }) {
  const p = useRef(0);
  useFrame(() => { p.current = progressValue.current ?? 0; });
  return <GlobeScene scrollProgress={p.current} />;
}

export default Km0Globe3D;
