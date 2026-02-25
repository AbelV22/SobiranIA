import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  
  varying vec2 vUv;
  
  // Función de ruido simple
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }
  
  float noise(vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0;
    return mix(mix(hash(n), hash(n + 1.0), f.x),
               mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Efecto de deformación circular alrededor del mouse (solo en parte derecha)
    float mouseEffect = 0.0;
    if (uMouseActive > 0.5 && uMouse.x > 0.5) {
      float dist = length(uv - uMouse);
      float radius = 0.15;
      if (dist < radius) {
        float strength = (1.0 - dist / radius) * 0.08;
        vec2 dir = normalize(uv - uMouse);
        uv += dir * strength * sin(uTime * 5.0 + dist * 20.0);
      }
    }
    
    // Samplear textura y convertir a escala de grises
    vec4 texColor = texture2D(uTexture, uv);
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Crear efecto de "código" tipo Matrix vertical
    float columns = 60.0;
    vec2 columnUV = uv;
    columnUV.x = floor(columnUV.x * columns) / columns;
    
    // Velocidad de caída variable por columna
    float speed = 2.0 + noise(columnUV.xx * 10.0) * 3.0;
    float drop = mod(columnUV.y * 40.0 + uTime * speed + noise(columnUV.xx) * 10.0, 1.0);
    
    // Crear patrón de 1s y 0s
    float charPattern = step(0.5, noise(vec2(columnUV.x * 100.0, drop * 100.0)));
    
    // Intensidad del efecto Matrix basada en:
    // 1. Progreso del scroll
    // 2. Brillo de la imagen original (más efecto en áreas claras)
    float matrixIntensity = uProgress * (0.3 + gray * 0.7);
    
    // Efecto de lluvia: solo algunas columnas activas
    float columnActive = step(0.3, noise(vec2(columnUV.x * 50.0, uTime * 0.5)));
    matrixIntensity *= columnActive;
    
    // Cabeza brillante de cada stream
    float head = smoothstep(0.0, 0.15, drop) * (1.0 - smoothstep(0.15, 0.25, drop));
    
    // Color del código: cyan brillante para la cabeza, cyan oscuro para el tail
    vec3 codeColor = vec3(0.0, 0.8, 1.0) * (0.2 + head * 0.8);
    
    // Mezclar imagen B/N con código
    vec3 finalColor = vec3(gray);
    finalColor = mix(finalColor, codeColor, matrixIntensity * 0.7);
    
    // Toques de cyan en áreas brillantes de la imagen
    if (gray > 0.6) {
      float cyanTouch = (gray - 0.6) * uProgress * 0.5;
      finalColor += vec3(0.0, 0.9, 1.0) * cyanTouch;
    }
    
    // Scanlines sutiles
    float scanline = sin(uv.y * 400.0) * 0.5 + 0.5;
    scanline = pow(scanline, 3.0) * 0.1;
    finalColor += vec3(scanline);
    
    // Vignette suave
    float vignette = 1.0 - length(uv - 0.5) * 0.5;
    finalColor *= vignette;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function DigitalCorruption({
  imageSrc,
  className = ''
}: {
  imageSrc: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.load(
      imageSrc,
      (texture: THREE.Texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTexture: { value: texture },
            uTime: { value: 0 },
            uProgress: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uMouseActive: { value: 0 }
          }
        });
        materialRef.current = material;

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        setIsLoaded(true);

        let time = 0;
        let rafId: number;
        
        const animate = () => {
          time += 0.016;
          
          if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = time;
            materialRef.current.uniforms.uProgress.value = scrollRef.current;
            materialRef.current.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
            materialRef.current.uniforms.uMouseActive.value = mouseRef.current.active ? 1.0 : 0.0;
          }
          
          renderer.render(scene, camera);
          rafId = requestAnimationFrame(animate);
        };
        
        animate();

        return () => {
          cancelAnimationFrame(rafId);
        };
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );

    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: '#0A0A0F' }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-[#22D3EE]">
          Loading...
        </div>
      )}
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(10, 10, 15, 0.85) 0%, rgba(10, 10, 15, 0.4) 35%, rgba(10, 10, 15, 0.1) 65%, rgba(10, 10, 15, 0.3) 100%),
            linear-gradient(to top, rgba(10, 10, 15, 0.9) 0%, rgba(10, 10, 15, 0.2) 30%, transparent 60%)
          `,
        }}
      />
    </div>
  );
}

export default DigitalCorruption;
