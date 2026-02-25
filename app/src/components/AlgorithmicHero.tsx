import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 15000;

function Particles() {
  const mesh = useRef<THREE.Points>(null);
  
  // Generar geometría de partículas
  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const randoms = new Float32Array(PARTICLE_COUNT);
    
    // Targets para morphing
    const target0 = new Float32Array(PARTICLE_COUNT * 3); // Disperso
    const target1 = new Float32Array(PARTICLE_COUNT * 3); // Servidor
    const target2 = new Float32Array(PARTICLE_COUNT * 3); // Espiral
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      randoms[i] = Math.random();
      
      // POSICIÓN INICIAL - Nube dispersa
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 4;
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      
      // TARGET 0: Mismo que inicial
      target0[i3] = positions[i3];
      target0[i3 + 1] = positions[i3 + 1];
      target0[i3 + 2] = positions[i3 + 2];
      
      // TARGET 1: SERVIDOR DETALLADO
      const partType = Math.random();
      let sx, sy, sz;
      
      if (partType < 0.50) {
        // Caja principal
        sx = (Math.random() - 0.5) * 1.6;
        sy = (Math.random() - 0.5) * 2.8;
        sz = (Math.random() - 0.5) * 1.6;
      } else if (partType < 0.70) {
        // Panel frontal
        sx = (Math.random() - 0.5) * 1.2;
        sy = (Math.random() - 0.5) * 2.4;
        sz = 0.8 + Math.random() * 0.1;
      } else if (partType < 0.85) {
        // Ventilador superior
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.sqrt(Math.random()) * 0.5;
        sx = Math.cos(angle) * rad;
        sy = 1.4 + Math.random() * 0.1;
        sz = Math.sin(angle) * rad;
      } else {
        // Aura dispersa
        const aTheta = Math.random() * Math.PI * 2;
        const aPhi = Math.acos(2 * Math.random() - 1);
        const aR = 2.2 + Math.random() * 0.8;
        sx = aR * Math.sin(aPhi) * Math.cos(aTheta);
        sy = aR * Math.sin(aPhi) * Math.sin(aTheta);
        sz = aR * Math.cos(aPhi);
      }
      
      // Añadir ruido orgánico
      target1[i3] = sx + (Math.random() - 0.5) * 0.1;
      target1[i3 + 1] = sy + (Math.random() - 0.5) * 0.1;
      target1[i3 + 2] = sz + (Math.random() - 0.5) * 0.1;
      
      // TARGET 2: ESPIRAL COMPACTA (no se aleja mucho)
      const idx = i / PARTICLE_COUNT;
      const sRadius = Math.sqrt(idx) * 2.0; // Radio más pequeño
      const sAngle = idx * Math.PI * (3 - Math.sqrt(5)) * 12;
      target2[i3] = sRadius * Math.cos(sAngle);
      target2[i3 + 1] = (idx - 0.5) * 2.0; // Altura más compacta
      target2[i3 + 2] = sRadius * Math.sin(sAngle);
      
      // COLORES
      const cMix = Math.random();
      if (cMix > 0.90) {
        colors[i3] = 1.0; colors[i3 + 1] = 1.0; colors[i3 + 2] = 1.0;
      } else if (cMix > 0.70) {
        colors[i3] = 0.2; colors[i3 + 1] = 0.9; colors[i3 + 2] = 1.0;
      } else {
        colors[i3] = 0.13; colors[i3 + 1] = 0.82; colors[i3 + 2] = 0.93;
      }
      
      sizes[i] = 0.015 + Math.random() * 0.02;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('random', new THREE.BufferAttribute(randoms, 1));
    geo.setAttribute('target0', new THREE.BufferAttribute(target0, 3));
    geo.setAttribute('target1', new THREE.BufferAttribute(target1, 3));
    geo.setAttribute('target2', new THREE.BufferAttribute(target2, 3));
    
    const uni = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uState: { value: 0 },
    };
    
    return { geometry: geo, uniforms: uni };
  }, []);
  
  // Scroll effect - SIN PINNING, flujo natural
  useEffect(() => {
    // Trigger de GSAP para mejor rendimiento
    const st = ScrollTrigger.create({
      trigger: "#hero-wrapper",
      start: "top top",
      end: "bottom top",
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // FASES DEL MORPHING
        // 0-25%: Disperso -> Servidor (construcción)
        // 25-50%: Servidor estático (leer mensaje)
        // 50-75%: Servidor -> Espiral (transformación)
        // 75-100%: Espiral -> Disperso (disolución)
        
        if (progress < 0.25) {
          uniforms.uState.value = 0;
          uniforms.uProgress.value = progress / 0.25;
        } else if (progress < 0.50) {
          uniforms.uState.value = 1;
          uniforms.uProgress.value = 0;
        } else if (progress < 0.75) {
          uniforms.uState.value = 1;
          uniforms.uProgress.value = (progress - 0.50) / 0.25;
        } else {
          uniforms.uState.value = 2;
          uniforms.uProgress.value = (progress - 0.75) / 0.25;
        }
      }
    });
    
    return () => st.kill();
  }, []);
  
  useFrame((state) => {
    if (!mesh.current) return;
    const material = mesh.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
  });
  
  const vertexShader = `
    uniform float uTime;
    uniform float uProgress;
    uniform int uState;
    
    attribute vec3 target0;
    attribute vec3 target1;
    attribute vec3 target2;
    attribute vec3 color;
    attribute float size;
    attribute float random;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      vColor = color;
      
      vec3 pos;
      
      // uState 0: target0 -> target1 (Disperso -> Servidor)
      // uState 1: target1 -> target2 (Servidor -> Espiral)
      // uState 2: target2 -> target0 (Espiral -> Disperso)
      
      if (uState == 0) {
        float t = uProgress;
        t = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
        pos = mix(target0, target1, t);
      } else if (uState == 1) {
        float t = uProgress;
        t = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
        pos = mix(target1, target2, t);
      } else {
        float t = uProgress;
        t = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
        pos = mix(target2, target0, t);
      }
      
      // Movimiento orgánico suave
      float breath = sin(uTime * 0.3 + random * 8.0) * 0.03;
      pos.x += breath;
      pos.y += cos(uTime * 0.2 + random * 5.0) * 0.02;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Tamaño con profundidad
      gl_PointSize = size * (350.0 / -mvPosition.z);
      vAlpha = smoothstep(-15.0, -3.0, mvPosition.z) * 0.9;
    }
  `;
  
  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      if (dist > 0.5) discard;
      
      float glow = 1.0 - dist * 2.0;
      glow = pow(glow, 2.0);
      
      gl_FragColor = vec4(vColor * glow, glow * vAlpha);
    }
  `;
  
  return (
    <points ref={mesh} geometry={geometry} position={[2, 0, 0]}>
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

export function AlgorithmicHero() {
  return (
    <div id="hero-wrapper" className="relative w-full h-[200vh] z-0">
      {/* Canvas sticky para que se quede fijo durante el scroll */}
      <div className="sticky top-0 w-full h-screen">
        <Canvas
          camera={{ position: [2, 0, 14], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: '#0A0A0F' }}
        >
          <ambientLight intensity={0.5} />
          
          <Particles />
          
          <EffectComposer>
            <Bloom intensity={2} luminanceThreshold={0.1} />
          </EffectComposer>
        </Canvas>
        
        {/* Gradientes para integración con texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/70 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0F]/50 pointer-events-none" />
      </div>
    </div>
  );
}

export default AlgorithmicHero;
