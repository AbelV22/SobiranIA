import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

// ==================== IDENTIDAD SOBIRANIA ====================
// IA Local + Protección de Datos + Barcelona
// =============================================================

// SERVIDOR 3D - Representa la IA instalada localmente
function LocalServer({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const mainBoxRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Animación de levitación y pulso
  useFrame((state) => {
    if (!groupRef.current || !mainBoxRef.current || !glowRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Levitación suave
    groupRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.15;
    
    // Rotación lenta
    groupRef.current.rotation.y = time * 0.2;
    
    // Pulso del glow
    const scale = 1 + Math.sin(time * 3) * 0.05;
    glowRef.current.scale.setScalar(scale);
    
    // Material brillante pulsante
    const material = mainBoxRef.current.material as THREE.MeshPhysicalMaterial;
    material.emissiveIntensity = 0.4 + Math.sin(time * 2) * 0.2;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Servidor principal - CPU/AI Box */}
      <mesh ref={mainBoxRef}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshPhysicalMaterial
          color={0x0A0A0F}
          metalness={0.9}
          roughness={0.1}
          emissive={0x22D3EE}
          emissiveIntensity={0.4}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Líneas decorativas del servidor */}
      {[-0.5, 0, 0.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0.76]}>
          <boxGeometry args={[1.2, 0.05, 0.02]} />
          <meshBasicMaterial color={0x22D3EE} transparent opacity={0.8} />
        </mesh>
      ))}
      
      {/* Glow exterior */}
      <mesh ref={glowRef} scale={1.2}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshBasicMaterial
          color={0x22D3EE}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Núcleo brillante */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial
          color={0x22D3EE}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Anillos de energía */}
      {[2, 2.3, 2.6].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius, 64]} />
          <meshBasicMaterial
            color={0x22D3EE}
            transparent
            opacity={0.15 - i * 0.03}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ESCUDO DE PROTECCIÓN - Representa la privacidad y seguridad
function DataShield({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const shieldRef = useRef<THREE.Group>(null);
  const hexRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!shieldRef.current || !hexRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Rotación suave del escudo
    shieldRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
    
    // Pulso del hexágono
    const scale = 1 + Math.sin(time * 2) * 0.03;
    hexRef.current.scale.setScalar(scale);
    
    // Material pulsante
    const material = hexRef.current.material as THREE.MeshPhysicalMaterial;
    material.emissiveIntensity = 0.3 + Math.sin(time * 3) * 0.15;
  });

  // Crear geometría de escudo hexagonal
  const shieldGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const radius = 2.5;
    const segments = 6;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 1.2;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
    });
    
    geometry.center();
    return geometry;
  }, []);

  return (
    <group ref={shieldRef} position={position}>
      {/* Escudo principal */}
      <mesh ref={hexRef} geometry={shieldGeometry}>
        <meshPhysicalMaterial
          color={0x0A0A0F}
          metalness={0.8}
          roughness={0.2}
          emissive={0x22D3EE}
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Borde brillante */}
      <lineSegments>
        <edgesGeometry args={[shieldGeometry]} />
        <lineBasicMaterial color={0x22D3EE} transparent opacity={0.6} />
      </lineSegments>
      
      {/* Círculos de protección concéntricos */}
      {[3.2, 3.8, 4.4].map((radius, i) => (
        <mesh key={i} rotation={[0, 0, 0]}>
          <ringGeometry args={[radius - 0.03, radius, 64]} />
          <meshBasicMaterial
            color={0x22D3EE}
            transparent
            opacity={0.08 - i * 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// PARTÍCULAS DE DATOS - Fluyen hacia el servidor protegido
function DataParticles({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);
  
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Posiciones iniciales aleatorias en una esfera alrededor
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 3;
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      
      // Colores: mayoría cian, algunos blancos (datos importantes)
      const isImportant = Math.random() > 0.9;
      colors[i3] = isImportant ? 1 : 0.13;
      colors[i3 + 1] = isImportant ? 1 : 0.83;
      colors[i3 + 2] = isImportant ? 1 : 0.93;
      
      sizes[i] = isImportant ? Math.random() * 0.06 + 0.03 : Math.random() * 0.02 + 0.01;
    }
    
    return { positions, colors, sizes };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHover: { value: 0 },
  }), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const material = pointsRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uHover.value = THREE.MathUtils.lerp(
      material.uniforms.uHover.value,
      hovered ? 1 : 0,
      0.1
    );
    
    // Rotación lenta del sistema de partículas
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  const vertexShader = `
    uniform float uTime;
    uniform float uHover;
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    
    void main() {
      vColor = color;
      vec3 pos = position;
      
      // Movimiento orgánico tipo fluido
      float noise = sin(pos.x * 3.0 + uTime * 2.0) * 
                    cos(pos.y * 3.0 + uTime * 1.5) * 
                    sin(pos.z * 3.0 + uTime);
      pos += normal * noise * 0.2;
      
      // Atracción hacia el centro cuando hover
      float dist = length(pos);
      float attraction = smoothstep(5.0, 0.0, dist) * uHover * 0.3;
      pos = mix(pos, normalize(pos) * 2.0, attraction);
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Tamaño basado en distancia y hover
      gl_PointSize = size * (400.0 / -mvPosition.z) * (1.0 + uHover * 0.5);
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    uniform float uTime;
    
    void main() {
      // Crear círculo suave con glow
      vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
      float dist = length(circCoord);
      if (dist > 1.0) discard;
      
      // Glow interior
      float glow = 1.0 - dist;
      glow = pow(glow, 2.0);
      
      // Pulse sincronizado
      float pulse = sin(uTime * 3.0 + vColor.r * 2.0) * 0.2 + 0.8;
      
      vec3 finalColor = vColor * glow * pulse;
      float alpha = glow * 0.7;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  return (
    <points
      ref={pointsRef}
      onPointerMove={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// LÍNEAS DE CONEXIÓN - Representan el flujo de datos
function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const [linePositions, lineColors] = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const lineCount = 80;
    
    for (let i = 0; i < lineCount; i++) {
      // Punto exterior
      const theta1 = Math.random() * Math.PI * 2;
      const phi1 = Math.acos(2 * Math.random() - 1);
      const r1 = 4 + Math.random() * 2;
      
      const x1 = r1 * Math.sin(phi1) * Math.cos(theta1);
      const y1 = r1 * Math.sin(phi1) * Math.sin(theta1);
      const z1 = r1 * Math.cos(phi1);
      
      // Punto cercano al centro (protegido)
      const theta2 = theta1 + (Math.random() - 0.5) * 0.8;
      const phi2 = phi1 + (Math.random() - 0.5) * 0.8;
      const r2 = 2.5 + Math.random() * 0.5;
      
      const x2 = r2 * Math.sin(phi2) * Math.cos(theta2);
      const y2 = r2 * Math.sin(phi2) * Math.sin(theta2);
      const z2 = r2 * Math.cos(phi2);
      
      positions.push(x1, y1, z1, x2, y2, z2);
      
      // Color degradado de cian (exterior) a blanco (centro)
      colors.push(0.13, 0.83, 0.93, 0.5, 0.9, 1.0);
    }
    
    return [new Float32Array(positions), new Float32Array(colors)];
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[lineColors, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

// ELEMENTO BARCELONA - Geometría orgánica inspirada en Gaudí
function BarcelonaElement({ position = [0, -3, 0] }: { position?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Forma orgánica tipo Gaudí/Modernismo */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.5 + Math.sin(i * 1.5) * 0.3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const height = 0.8 + Math.random() * 0.6;
        
        return (
          <mesh key={i} position={[x, height / 2, z]}>
            <capsuleGeometry args={[0.15, height, 4, 8]} />
            <meshPhysicalMaterial
              color={0x22D3EE}
              metalness={0.6}
              roughness={0.3}
              transparent
              opacity={0.3}
              emissive={0x22D3EE}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
      
      {/* Círculos decorativos tipo mosaico */}
      {[0.5, 1.0, 1.5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
          <ringGeometry args={[radius - 0.05, radius, 32]} />
          <meshBasicMaterial
            color={0x22D3EE}
            transparent
            opacity={0.1 - i * 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// POST-PROCESAMIENTO PREMIUM
function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={2.0}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.8}
        height={300}
        width={300}
      />
      <ChromaticAberration
        offset={[0.001, 0.001]}
        radialModulation={true}
        modulationOffset={0.5}
      />
    </EffectComposer>
  );
}

// ILUMINACIÓN DRAMÁTICA
function Lighting() {
  return (
    <>
      {/* Luz ambiental base */}
      <ambientLight intensity={0.1} />
      
      {/* Luz principal cian */}
      <pointLight
        position={[5, 5, 5]}
        intensity={2}
        color="#22D3EE"
        distance={20}
        decay={2}
      />
      
      {/* Luz de relleno azul */}
      <pointLight
        position={[-5, -5, -5]}
        intensity={1}
        color="#0EA5E9"
        distance={20}
        decay={2}
      />
      
      {/* Spotlight principal */}
      <spotLight
        position={[0, 10, 0]}
        angle={Math.PI / 6}
        penumbra={0.5}
        intensity={3}
        color="#22D3EE"
        castShadow
      />
      
      {/* Luz de acento */}
      <pointLight
        position={[0, 0, 8]}
        intensity={1.5}
        color="#ffffff"
        distance={15}
      />
    </>
  );
}

// CÁMARA CON MOVIMIENTO CINEMATOGRÁFICO
function CameraController() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Movimiento circular suave
    const baseX = Math.sin(time * 0.1) * 0.3;
    const baseY = Math.cos(time * 0.15) * 0.2;
    
    // Interacción con mouse
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, baseX + mouseRef.current.x * 0.5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, baseY + mouseRef.current.y * 0.3, 0.05);
    
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// COMPONENTE PRINCIPAL
export function SobiraniaIdentity3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 cursor-none"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#0A0A0F']} />
        <fog attach="fog" args={['#0A0A0F', 8, 25]} />
        
        <CameraController />
        <Lighting />
        
        {/* Elementos de la escena */}
        <LocalServer position={[0, 0, 0]} />
        <DataShield position={[0, 0, 0]} />
        <DataParticles count={600} />
        <ConnectionLines />
        <BarcelonaElement position={[0, -3.5, 0]} />
        
        <PostProcessing />
      </Canvas>
      
      {/* Overlays para integración con texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F]/80 via-transparent to-[#0A0A0F]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/60 via-transparent to-[#0A0A0F]/90 pointer-events-none" />
    </div>
  );
}

export default SobiraniaIdentity3D;
