import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const FACE_COUNT = 20;

// Palette matches the rest of the quest: zinc backgrounds, amber / #ff9b00 accents, Cinzel.
const DICE_THEME = {
  body: "#27272a", // zinc-800
  edges: "#ff9b00", // ActionButton accent
  number: "#fcd34d", // amber-300
  numberOutline: "#451a03", // amber-950
  keyLight: "#fef3c7", // amber-100
  rimLight: "#ff9b00",
  font: "/fonts/cinzel-700.woff",
} as const;

interface Dice3DProps {
  result: number | null;
  onSettled: () => void;
  /** Change this to replay the animation even when the same number is rolled again. */
  rollId?: number | string;
}

interface Face {
  value: number;
  center: THREE.Vector3;
  /** Rotates the local text frame (+Z out, +Y up) onto the face. */
  orientation: THREE.Quaternion;
}

/**
 * Standard d20 layout (as on Chessex dice), taken from the Dice Collecting Wiki net
 * https://dice.miraheze.org/wiki/D20 :
 * - 20 touches 2, 14, 8; 1 touches 13, 19, 7; opposite faces sum to 21;
 * - each number's top points at a specific vertex of its face, as printed on the net.
 *
 * Vertex ids: 0 = north pole, 1..5 = upper ring, 6..10 = lower ring, 11 = south pole.
 * Each entry: [value, a, b, c, up] — a, b, c are counter-clockwise seen from outside,
 * `up` is the vertex the top of the number points to.
 */
const D20_FACES: readonly (readonly [number, number, number, number, number])[] = [
  [18, 0, 1, 2, 0], [4, 0, 2, 3, 0], [11, 0, 3, 4, 3], [13, 0, 4, 5, 0], [5, 0, 5, 1, 1],
  [12, 1, 6, 7, 6], [20, 2, 7, 8, 2], [6, 3, 8, 9, 9], [19, 4, 9, 10, 9], [7, 5, 10, 6, 6],
  [2, 1, 7, 2, 1], [14, 2, 8, 3, 3], [9, 3, 9, 4, 3], [1, 4, 10, 5, 10], [15, 5, 6, 1, 1],
  [10, 6, 11, 7, 6], [8, 7, 11, 8, 11], [16, 8, 11, 9, 9], [3, 9, 11, 10, 11], [17, 10, 11, 6, 11],
];

function d20Vertices(radius: number): THREE.Vector3[] {
  const height = radius / Math.sqrt(5);
  const ringRadius = (2 * radius) / Math.sqrt(5);
  const ring = (degrees: number, y: number) => {
    const angle = THREE.MathUtils.degToRad(degrees);
    return new THREE.Vector3(ringRadius * Math.sin(angle), y, ringRadius * Math.cos(angle));
  };

  return [
    new THREE.Vector3(0, radius, 0),
    ...[0, 1, 2, 3, 4].map((k) => ring(36 + k * 72, height)),
    ...[0, 1, 2, 3, 4].map((k) => ring(k * 72, -height)),
    new THREE.Vector3(0, -radius, 0),
  ];
}

/** 6 and 9 look the same upside down, so mark them with a dot like real dice do. */
function faceLabel(value: number): string {
  return value === 6 || value === 9 ? `${value}.` : String(value);
}

function normalizeResult(result: number | null): number | null {
  if (result === null) return null;

  const safe = Number.isFinite(result)
    ? THREE.MathUtils.clamp(Math.round(result), 1, FACE_COUNT)
    : 1;

  if (safe !== result) {
    console.warn(`Dice3D: result ${result} is out of range, using ${safe}`);
  }

  return safe;
}

function Die({ result: rawResult, onSettled, rollId }: Dice3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startedAt = useRef<number | null>(null);
  const settled = useRef(false);

  const result = normalizeResult(rawResult);

  const { geometry, faces } = useMemo(() => {
    const vertices = d20Vertices(1.25);
    const positions: number[] = [];
    const faceList: Face[] = [];

    for (const [value, ia, ib, ic, iup] of D20_FACES) {
      const [a, b, c] = [vertices[ia], vertices[ib], vertices[ic]];
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);

      const center = a.clone().add(b).add(c).divideScalar(3);
      const normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
      const up = vertices[iup].clone().sub(center).normalize();
      const right = up.clone().cross(normal);

      const orientation = new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().makeBasis(right, up, normal),
      );

      faceList.push({ value, center, orientation });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.computeVertexNormals();

    return { geometry: geo, faces: faceList };
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  // Inverse of the face orientation: face normal -> camera (+Z), digit up -> screen up (+Y).
  const targetQuaternion = useMemo(() => {
    if (result === null) return null;
    const face = faces.find((item) => item.value === result);
    return face?.orientation.clone().invert() ?? null;
  }, [result, faces]);

  useEffect(() => {
    startedAt.current = null;
    settled.current = false;
  }, [result, rollId]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (!targetQuaternion) {
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
      group.quaternion.slerp(targetQuaternion, eased);
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
          color={DICE_THEME.body}
          metalness={0.7}
          roughness={0.35}
          flatShading
        />
      </mesh>

      <mesh geometry={geometry} scale={1.003}>
        <meshBasicMaterial
          color={DICE_THEME.edges}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      {faces.map((face) => (
        <Text
          key={face.value}
          position={face.center.clone().normalize().multiplyScalar(1.02)}
          quaternion={face.orientation}
          font={DICE_THEME.font}
          fontSize={0.26}
          color={DICE_THEME.number}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor={DICE_THEME.numberOutline}
        >
          {faceLabel(face.value)}
        </Text>
      ))}
    </group>
  );
}

export function Dice3D({ result, onSettled, rollId }: Dice3DProps) {
  return (
    <div className="relative mx-auto h-64 w-full max-w-sm">
      <div className="pointer-events-none absolute inset-x-10 bottom-5 h-8 rounded-full bg-[#ff9b00]/15 blur-xl" />

      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[3, 4, 5]}
          intensity={3}
          color={DICE_THEME.keyLight}
        />
        <pointLight
          position={[-3, -2, 2]}
          intensity={18}
          color={DICE_THEME.rimLight}
        />

        <Die result={result} onSettled={onSettled} rollId={rollId} />
      </Canvas>
    </div>
  );
}
