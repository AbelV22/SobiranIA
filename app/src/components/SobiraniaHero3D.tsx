import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

// Partículas orgánicas que forman la red neuronal
function NeuralParticles({ count = 3000, mousePosition }: { count?: number; mousePosition: THREE.Vector3 }) {
  const mesh = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);
  
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Formar una estructura orgánica tipo Barcelona
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 3;
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i3 + 2] = r * Math.cos(phi);
      
      // Colores: cian para datos, blanco para nodos principales
      const isNode = Math.random() > 0.95;
      colors[i3] = isNode ? 1 : 0.13;     // R
      colors[i3 + 1] = isNode ? 1 : 0.83; // G
      colors[i3 + 2] = isNode ? 1 : 0.93; // B
      
      sizes[i] = isNode ? Math.random() * 0.08 + 0.04 : Math.random() * 0.03 + 0.01;
    }
    
    return { positions, colors, sizes };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uHover: { value: 0 },
  }), []);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const material = mesh.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMouse.value.lerp(mousePosition, 0.05);
    material.uniforms.uHover.value = THREE.MathUtils.lerp(
      material.uniforms.uHover.value,
      hovered ? 1 : 0,
      0.1
    );
    
    // Rotación lenta orgánica
    mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  const vertexShader = `
    uniform float uTime;
    uniform vec3 uMouse;
    uniform float uHover;
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vDistance;
    
    void main() {
      vColor = color;
      vec3 pos = position;
      
      // Movimiento orgánico tipo fluido
      float noise = sin(pos.x * 2.0 + uTime) * cos(pos.y * 2.0 + uTime * 0.5) * sin(pos.z * 2.0 + uTime * 0.3);
      pos += normal * noise * 0.3;
      
      // Interacción con el mouse - atracción suave
      float dist = distance(pos, uMouse);
      float attraction = smoothstep(2.0, 0.0, dist) * uHover * 0.5;
      pos += normalize(uMouse - pos) * attraction;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      vDistance = -mvPosition.z;
      gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + uHover * 0.5);
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vDistance;
    uniform float uTime;
    
    void main() {
      // Crear círculo suave
      vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
      float dist = length(circCoord);
      if (dist > 1.0) discard;
      
      // Glow interior
      float glow = 1.0 - dist;
      glow = pow(glow, 2.0);
      
      // Pulse
      float pulse = sin(uTime * 2.0) * 0.2 + 0.8;
      
      vec3 finalColor = vColor * glow * pulse;
      float alpha = glow * 0.8;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  return (
    <points
      ref={mesh}
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

// Líneas de conexión entre partículas
function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const [linePositions, lineColors] = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    
    // Generar conexiones entre puntos cercanos
    const maxConnections = 150;
    
    for (let i = 0; i < maxConnections; i++) {
      const theta1 = Math.random() * Math.PI * 2;
      const phi1 = Math.acos(2 * Math.random() - 1);
      const r1 = 2 + Math.random() * 3;
      
      const x1 = r1 * Math.sin(phi1) * Math.cos(theta1);
      const y1 = r1 * Math.sin(phi1) * Math.sin(theta1) * 0.6;
      const z1 = r1 * Math.cos(phi1);
      
      // Conectar a un punto cercano
      const theta2 = theta1 + (Math.random() - 0.5) * 0.5;
      const phi2 = phi1 + (Math.random() - 0.5) * 0.5;
      const r2 = r1 + (Math.random() - 0.5) * 1;
      
      const x2 = r2 * Math.sin(phi2) * Math.cos(theta2);
      const y2 = r2 * Math.sin(phi2) * Math.sin(theta2) * 0.6;
      const z2 = r2 * Math.cos(phi2);
      
      positions.push(x1, y1, z1, x2, y2, z2);
      
      // Color cian semitransparente
      colors.push(0.13, 0.83, 0.93, 0.13, 0.83, 0.93);
    }
    
    return [new Float32Array(positions), new Float32Array(colors)];
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
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
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

// Escudo de protección de datos
function DataShield() {
  const meshRef = useRef<THREE.Mesh>(null);
  const outlineRef = useRef<THREE.LineSegments>(null);
  
  const shieldGeometry = useMemo(() => {
    // Crear geometría de escudo hexagonal
    const shape = new THREE.Shape();
    const radius = 1.5;
    const segments = 6;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 1.3;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    });
    
    geometry.center();
    return geometry;
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !outlineRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Rotación suave
    meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    meshRef.current.rotation.x = Math.cos(time * 0.3) * 0.05;
    
    // Escala pulsante
    const scale = 1 + Math.sin(time * 2) * 0.02;
    meshRef.current.scale.setScalar(scale);
    outlineRef.current.scale.setScalar(scale);
    
    // Material brillante
    const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
    material.emissiveIntensity = 0.3 + Math.sin(time * 3) * 0.2;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Escudo interior */}
      <mesh ref={meshRef} geometry={shieldGeometry}>
        <meshPhysicalMaterial
          color={0x22D3EE}
          metalness={0.8}
          roughness={0.2}
          emissive={0x22D3EE}
          emissiveIntensity={0.3}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Outline brillante */}
      <lineSegments ref={outlineRef}>
        <edgesGeometry args={[shieldGeometry]} />
        <lineBasicMaterial color={0x22D3EE} transparent opacity={0.6} />
      </lineSegments>
      
      {/* Círculos concéntricos de protección */}
      {[2, 2.5, 3].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius, 64]} />
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

// Sistema de partículas flotantes
function FloatingDataParticles({ count = 100 }: { count?: number }) {
  const instancedMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ),
      speed: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.5 + 0.5,
    }));
  }, [count]);

  useFrame((state) => {
    if (!instancedMesh.current) return;
    
    const time = state.clock.elapsedTime;
    
    particles.forEach((particle, i) => {
      const { position, speed, phase, scale } = particle;
      
      // Movimiento ondulante
      dummy.position.x = position.x + Math.sin(time * speed + phase) * 0.5;
      dummy.position.y = position.y + Math.cos(time * speed * 0.7 + phase) * 0.3;
      dummy.position.z = position.z + Math.sin(time * speed * 0.5 + phase) * 0.2;
      
      // Rotación
      dummy.rotation.x = time * speed + phase;
      dummy.rotation.y = time * speed * 0.5 + phase;
      
      // Escala pulsante
      const pulse = 1 + Math.sin(time * 3 + phase) * 0.3;
      dummy.scale.setScalar(scale * pulse * 0.1);
      
      dummy.updateMatrix();
      instancedMesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    instancedMesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh 
      ref={instancedMesh} 
      args={[undefined, undefined, count]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color={0x22D3EE}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

// Efectos de post-procesamiento
function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        height={300}
        width={300}
      />
      <ChromaticAberration
        offset={[0.002, 0.002]}
        radialModulation={true}
        modulationOffset={0.5}
      />
    </EffectComposer>
  );
}

// Cámara con movimiento suave
function CameraController() {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    camera.position.x = Math.sin(time * 0.1) * 0.5;
    camera.position.y = Math.cos(time * 0.15) * 0.3;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Componente principal
export function SobiraniaHero3D() {
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3(0, 0, 0));
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    setMousePosition(new THREE.Vector3(x * 5, y * 5, 0));
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0"
      onMouseMove={handleMouseMove}
      style={{ cursor: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#0A0A0F']} />
        <fog attach="fog" args={['#0A0A0F', 5, 20]} />
        
        <CameraController />
        
        {/* Iluminación */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#22D3EE" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0EA5E9" />
        <spotLight
          position={[0, 10, 0]}
          angle={Math.PI / 6}
          penumbra={1}
          intensity={1}
          color="#22D3EE"
        />
        
        {/* Elementos 3D */}
        <NeuralParticles count={4000} mousePosition={mousePosition} />
        <ConnectionLines />
        <DataShield />
        <FloatingDataParticles count={150} />
        
        {/* Post-procesamiento */}
        <PostProcessing />
      </Canvas>
      
      {/* Overlay gradiente para integración con texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-transparent to-[#0A0A0F] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] via-transparent to-[#0A0A0F] pointer-events-none" />
    </div>
  );
}

export default SobiraniaHero3D;
