import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface Dice3DProps {
  result: number | null;
  onSettled: () => void;
}

function Die({ result, onSettled }: Dice3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startedAt = useRef<number | null>(null);
  const settled = useRef(false);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.25, 0), []);

  const faces = useMemo(() => {
    const position = geometry.getAttribute("position");
    const index = geometry.getIndex();
    const result: {
      center: THREE.Vector3;
      normal: THREE.Vector3;
    }[] = [];

    const triangleCount = index ? index.count / 3 : position.count / 3;

    for (let i = 0; i < triangleCount; i++) {
      const ids = index
        ? [index.getX(i * 3), index.getX(i * 3 + 1), index.getX(i * 3 + 2)]
        : [i * 3, i * 3 + 1, i * 3 + 2];

      const a = new THREE.Vector3().fromBufferAttribute(position, ids[0]);
      const b = new THREE.Vector3().fromBufferAttribute(position, ids[1]);
      const c = new THREE.Vector3().fromBufferAttribute(position, ids[2]);

      const center = a.clone().add(b).add(c).divideScalar(3);
      const normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize();

      // Ensure the normal points outwards.
      if (normal.dot(center) < 0) normal.negate();

      result.push({ center, normal });
    }

    return result;
  }, [geometry]);

  const targetQuaternion = useMemo(() => {
    if (result === null || !faces.length) return null;

    const face = faces[result - 1];
    if (!face) return null;

    return new THREE.Quaternion().setFromUnitVectors(
      face.normal,
      new THREE.Vector3(0, 0, 1),
    );
  }, [result, faces]);

  useEffect(() => {
    if (result !== null) {
      startedAt.current = null;
      settled.current = false;
    }
  }, [result]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (result === null || !targetQuaternion) {
      group.rotation.y += delta * 0.25;
      group.rotation.x += delta * 0.12;
      return;
    }

    if (settled.current) return;

    startedAt.current ??= state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startedAt.current;
    const duration = 2.6;
    const progress = Math.min(elapsed / duration, 1);

    if (progress < 0.82) {
      // Fast tumbling phase.
      group.rotation.x += delta * 9;
      group.rotation.y += delta * 11;
      group.rotation.z += delta * 7;
    } else {
      // Smoothly settle on the face matching the result.
      const eased = THREE.MathUtils.smoothstep(progress, 0.82, 1);
      const current = group.quaternion.clone();
      group.quaternion.copy(current.slerp(targetQuaternion, eased));
    }

    if (progress >= 1) {
      group.quaternion.copy(targetQuaternion);
      settled.current = true;
      onSettled();
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#29251f"
          metalness={0.82}
          roughness={0.3}
          flatShading
        />
      </mesh>

      <mesh geometry={geometry} scale={1.003}>
        <meshBasicMaterial
          color="#bd9250"
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>

      {faces.map((face, index) => {
        const orientation = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          face.normal,
        );

        const rotation = new THREE.Euler().setFromQuaternion(orientation);

        return (
          <Text
            key={index}
            position={face.center.clone().normalize().multiplyScalar(1.08)}
            rotation={[rotation.x, rotation.y, rotation.z]}
            fontSize={0.23}
            color="#f5d58b"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.008}
            outlineColor="#5a3513"
          >
            {index + 1}
          </Text>
        );
      })}
    </group>
  );
}

export function Dice3D({ result, onSettled }: Dice3DProps) {
  return (
    <div className="relative mx-auto h-64 w-full max-w-sm">
      <div className="pointer-events-none absolute inset-x-10 bottom-5 h-8 rounded-full bg-amber-500/10 blur-xl" />

      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 5]} intensity={3} color="#ffe0a0" />
        <pointLight position={[-3, -2, 2]} intensity={18} color="#b87932" />

        <Die result={result} onSettled={onSettled} />
      </Canvas>
    </div>
  );
}
