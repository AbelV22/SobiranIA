import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 8000;

// Shader para partículas con efecto pulso y glow
const particleVertexShader = `
  uniform float uTime;
  uniform float uExpand;
  uniform vec3 uMouse;
  
  attribute float aSize;
  attribute vec3 aPosition;
  attribute float aPhase;
  attribute float aRandom;
  
  varying float vAlpha;
  varying float vGlow;
  varying vec3 vColor;
  
  void main() {
    vec3 pos = aPosition;
    
    // Expansión basada en scroll
    float expandFactor = 1.0 + uExpand * 0.5;
    pos *= expandFactor;
    
    // Movimiento orgánico de respiración
    float breath = sin(uTime * 0.5 + aPhase) * 0.05;
    pos += normalize(pos) * breath;
    
    // Movimiento ondulante suave
    pos.y += sin(uTime * 0.3 + aPosition.x * 2.0) * 0.02 * (1.0 + uExpand);
    pos.x += cos(uTime * 0.2 + aPosition.z * 1.5) * 0.02 * (1.0 + uExpand);
    
    // Interacción con mouse (suave)
    float distToMouse = distance(pos.xy, uMouse.xy);
    float mouseInfluence = smoothstep(2.0, 0.0, distToMouse) * 0.1;
    pos.z += mouseInfluence;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Tamaño con profundidad y variación
    float sizeVariation = 1.0 + sin(uTime + aPhase) * 0.2;
    gl_PointSize = aSize * sizeVariation * (400.0 / -mvPosition.z);
    
    // Alpha basado en profundidad
    vAlpha = smoothstep(-15.0, -2.0, mvPosition.z) * (0.7 + aRandom * 0.3);
    
    // Glow intenso para partículas del centro
    float distFromCenter = length(aPosition);
    vGlow = 1.0 - smoothstep(0.0, 3.0, distFromCenter);
    
    // Color: cian brillante con variación
    vColor = vec3(0.13, 0.83, 0.93); // #22D3EE
  }
`;

const particleFragmentShader = `
  varying float vAlpha;
  varying float vGlow;
  varying vec3 vColor;
  
  void main() {
    // Crear círculo perfecto
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // Glow interior intenso
    float glow = 1.0 - dist * 2.0;
    glow = pow(glow, 1.5);
    
    // Núcleo más brillante
    vec3 finalColor = vColor * (1.0 + vGlow * 2.0);
    
    // Alpha con glow
    float finalAlpha = glow * vAlpha * (1.0 + vGlow);
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

// Núcleo brillante central
function CoreGlow() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Pulso suave
    const scale = 1.0 + Math.sin(time * 0.8) * 0.05;
    meshRef.current.scale.setScalar(scale);
    
    // Rotación muy lenta
    meshRef.current.rotation.z = time * 0.05;
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshBasicMaterial
        color="#22D3EE"
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Sistema de partículas de la nube
function CloudParticles() {
  const meshRef = useRef<THREE.Points>(null);
  
  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);
    const randoms = new Float32Array(PARTICLE_COUNT);
    
    // Generar forma de nube local abstracta
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      
      // Distribución en forma de nube (más densa en el centro)
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      
      // Radio variable para forma de nube
      const radiusBase = Math.pow(Math.random(), 1/3) * 3.5;
      
      // Aplanar en Y para forma de nube
      const flattenY = 0.4 + Math.random() * 0.4;
      
      positions[i3] = radiusBase * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radiusBase * Math.sin(phi) * Math.sin(theta) * flattenY;
      positions[i3 + 2] = radiusBase * Math.cos(phi) * flattenY;
      
      // Tamaño variable: más pequeñas en los bordes
      const distFromCenter = Math.sqrt(
        positions[i3] * positions[i3] + 
        positions[i3 + 1] * positions[i3 + 1] + 
        positions[i3 + 2] * positions[i3 + 2]
      );
      sizes[i] = (0.03 + Math.random() * 0.04) * (1.0 - distFromCenter * 0.1);
      
      phases[i] = Math.random() * Math.PI * 2;
      randoms[i] = Math.random();
    }
    
    geo.setAttribute('aPosition', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    
    const uni = {
      uTime: { value: 0 },
      uExpand: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
    };
    
    return { geometry: geo, uniforms: uni };
  }, []);
  
  // Scroll animation
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#hero-wrapper",
      start: "top top",
      end: "bottom top",
      scrub: 0.8,
      onUpdate: (self) => {
        uniforms.uExpand.value = self.progress;
      }
    });
    
    return () => st.kill();
  }, []);
  
  // Mouse interaction
  const handleMouseMove = (e: any) => {
    const x = (e.point.x / 10) * 2;
    const y = (e.point.y / 10) * 2;
    uniforms.uMouse.value.set(x, y, 0);
  };
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Rotación suave de la nube
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
  });
  
  return (
    <points
      ref={meshRef}
      geometry={geometry}
      onPointerMove={handleMouseMove}
    >
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Anillos de conexión
function ConnectionRings() {
  const groupRef = useRef<THREE.Group>(null);
  
  const rings = useMemo(() => {
    return [1.5, 2.2, 3.0].map((radius, i) => ({
      radius,
      speed: 0.02 + i * 0.01,
      opacity: 0.15 - i * 0.04,
    }));
  }, []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((child, i) => {
      child.rotation.x = Math.PI / 2 + Math.sin(time * 0.1 + i) * 0.1;
      child.rotation.y = time * rings[i].speed;
    });
  });
  
  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ring.radius - 0.02, ring.radius, 64]} />
          <meshBasicMaterial
            color="#22D3EE"
            transparent
            opacity={ring.opacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Post-processing
function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={2.5}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
        height={400}
        width={400}
      />
    </EffectComposer>
  );
}

// Cámara con movimiento suave
function CameraController() {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    camera.position.x = Math.sin(time * 0.1) * 0.3;
    camera.position.y = Math.cos(time * 0.08) * 0.2;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Componente principal
export function CloudCore3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ cursor: 'crosshair' }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
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
        
        {/* Iluminación ambiental */}
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#22D3EE" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#0EA5E9" />
        
        {/* Elementos 3D */}
        <CloudParticles />
        <CoreGlow />
        <ConnectionRings />
        
        {/* Post-processing */}
        <PostProcessing />
      </Canvas>
      
      {/* Overlay gradientes sutiles */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] via-transparent to-[#0A0A0F]/80 pointer-events-none" />
    </div>
  );
}

export default CloudCore3D;
