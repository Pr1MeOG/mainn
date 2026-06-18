import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function CoreObject({ mouse, scrollProgress }) {
  const group = useRef();
  const inner = useRef();
  const emerald = useMemo(() => new THREE.Color('#00e5a0'), []);
  const coral = useMemo(() => new THREE.Color('#ff5c38'), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const targetX = mouse.y * 0.22 + scrollProgress * 0.45;
    const targetY = mouse.x * 0.25 + time * 0.08;

    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.055);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.055);
    group.current.position.y = Math.sin(time * 0.8) * 0.08 - scrollProgress * 0.55;

    inner.current.rotation.x = -time * 0.18;
    inner.current.rotation.z = time * 0.26;
  });

  return (
    <group ref={group} position={[0, 0.3, 0]}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[1.42, 2]} />
        <meshPhysicalMaterial
          color="#111923"
          metalness={0.72}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.16}
          transmission={0.08}
          thickness={1.4}
          emissive="#00190f"
          emissiveIntensity={0.45}
        />
      </mesh>

      <mesh ref={inner} scale={0.73}>
        <octahedronGeometry args={[1.05, 0]} />
        <meshPhysicalMaterial
          color="#0d131b"
          metalness={0.9}
          roughness={0.12}
          emissive="#00e5a0"
          emissiveIntensity={0.18}
          clearcoat={1}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.1, 0.2, 0.1]}>
        <torusGeometry args={[1.85, 0.018, 12, 160]} />
        <meshBasicMaterial color={emerald} transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2.8, 0.1, Math.PI / 2]}>
        <torusGeometry args={[2.18, 0.014, 12, 160]} />
        <meshBasicMaterial color={coral} transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[0.7, 0.4, Math.PI / 1.9]}>
        <torusGeometry args={[2.48, 0.011, 12, 160]} />
        <meshBasicMaterial color="#f2f5f8" transparent opacity={0.28} />
      </mesh>

      <SignalCards scrollProgress={scrollProgress} />
    </group>
  );
}

function SignalCards({ scrollProgress }) {
  const cards = useRef([]);
  const data = useMemo(
    () => [
      ['DEV', -2.45, -0.35, -0.65, '#00e5a0'],
      ['MGMT', 2.35, 0.15, -0.4, '#ff5c38'],
      ['DROP', -1.8, 1.55, -0.9, '#f2f5f8'],
      ['500+', 1.65, -1.45, -0.7, '#00e5a0'],
    ],
    [],
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    cards.current.forEach((card, index) => {
      if (!card) return;
      card.rotation.y = Math.sin(time * 0.6 + index) * 0.18 - scrollProgress * 0.25;
      card.position.y += Math.sin(time + index) * 0.0008;
    });
  });

  return data.map(([label, x, y, z, color], index) => (
    <group key={label} ref={(node) => { cards.current[index] = node; }} position={[x, y, z]}>
      <mesh>
        <boxGeometry args={[0.95, 0.42, 0.035]} />
        <meshPhysicalMaterial color="#0d131b" roughness={0.2} metalness={0.45} clearcoat={1} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, 0, 0.024]}>
        <planeGeometry args={[0.82, 0.28]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
      <TextSprite label={label} color={color} />
    </group>
  ));
}

function TextSprite({ label, color }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 192;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '800 54px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = color;
    context.fillText(label, 256, 96);
    const map = new THREE.CanvasTexture(canvas);
    map.needsUpdate = true;
    return map;
  }, [label, color]);

  return (
    <sprite position={[0, 0, 0.08]} scale={[0.9, 0.34, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function StageGrid() {
  const grid = useRef();

  useFrame((state) => {
    if (!grid.current) return;
    grid.current.rotation.y = state.clock.getElapsedTime() * 0.035;
  });

  return (
    <group ref={grid} position={[0, -1.65, 0]}>
      <gridHelper args={[8, 28, '#00e5a0', '#1a2934']} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[3.25, 80]} />
        <meshBasicMaterial color="#00e5a0" transparent opacity={0.045} />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const points = useRef();
  const positions = useMemo(() => {
    const values = new Float32Array(120 * 3);
    for (let i = 0; i < values.length; i += 3) {
      values[i] = (Math.random() - 0.5) * 6;
      values[i + 1] = (Math.random() - 0.5) * 4;
      values[i + 2] = (Math.random() - 0.5) * 5;
    }
    return values;
  }, []);

  useFrame((state) => {
    points.current.rotation.y = state.clock.getElapsedTime() * 0.025;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00e5a0" size={0.018} transparent opacity={0.48} sizeAttenuation />
    </points>
  );
}

export default function HeroScene({ mouse, scrollProgress }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.65]}
      camera={{ position: [0, 0.25, 6.2], fov: 42 }}
      gl={{ powerPreference: 'high-performance', antialias: true, alpha: true }}
      className="absolute inset-0 rounded-[3rem]"
    >
      <color attach="background" args={['#080c11']} />
      <fog attach="fog" args={['#080c11', 7, 12]} />
      <ambientLight intensity={0.62} />
      <spotLight position={[4, 5, 4]} angle={0.35} penumbra={0.8} intensity={28} castShadow color="#00e5a0" />
      <pointLight position={[-3, -1, 3]} intensity={14} color="#ff5c38" />
      <pointLight position={[0, 4, -2]} intensity={7} color="#f2f5f8" />
      <CoreObject mouse={mouse} scrollProgress={scrollProgress} />
      <StageGrid />
      <ParticleField />
    </Canvas>
  );
}
