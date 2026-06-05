import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text3D, Center, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

export type PlateStyle = '4d-5mm' | '4d-gel' | '3d-gel' | 'ghost'

interface PlatePreview3DProps {
  registration: string
  plateStyle?: PlateStyle
  showToggle?: boolean
}

export const styleConfig: Record<PlateStyle, { label: string; price: number; desc: string }> = {
  '4d-5mm': { label: '4D 5MM', price: 45, desc: 'Laser-cut acrylic' },
  '4d-gel':  { label: '4D GEL', price: 55, desc: 'Gloss gel resin' },
  '3d-gel':  { label: '3D GEL', price: 35, desc: 'Domed resin' },
  'ghost':   { label: 'GHOST',  price: 70, desc: 'Stealth subtle' },
}

// Charles Wright Bold — the mandatory UK plate typeface (2001 spec),
// converted to a three.js typeface at build time. Lives in /public/fonts.
const FONT_URL = '/fonts/CharlesWright-Bold.typeface.json'

// Real UK plate is 520 × 111 mm (≈4.685:1). Scene units ≈ centimetres.
const PLATE_W = 5.2
const PLATE_H = PLATE_W / 4.685 // ≈ 1.11
const PLATE_DEPTH = 0.07
// Glyphs occupy ~71% of plate height on a real plate; leave a margin.
const TEXT_TARGET_W = PLATE_W * 0.84

/* ─── per-style extrusion + material ─── */
interface StyleGeo {
  depth: number
  bevelEnabled: boolean
  bevelThickness: number
  bevelSize: number
  bevelSegments: number
  roughness: number
  metalness: number
  clearcoat: number
  clearcoatRoughness: number
  color: string
  opacity: number
}

// Plate characters are black acrylic/resin — dielectric, so metalness stays 0.
// (Any metalness on a near-black base reflects the bright studio env as grey,
// which washes the faces out. Gloss comes from clearcoat, not metalness.)
// Values are in glyph-size units (em ≈ 1). Bevels are kept small so the chamfer
// never overruns a letter's counter (the holes in O/R/e/g/8) and fills it in.
const styleGeometry: Record<PlateStyle, StyleGeo> = {
  // 4D 5mm — flat-topped laser-cut acrylic, crisp small bevel, satin black
  '4d-5mm': {
    depth: 0.11, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.011,
    bevelSegments: 2, roughness: 0.35, metalness: 0, clearcoat: 0.35,
    clearcoatRoughness: 0.3, color: '#040404', opacity: 1,
  },
  // 4D gel — tall acrylic riser topped with a glossy gel dome
  '4d-gel': {
    depth: 0.14, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.024,
    bevelSegments: 5, roughness: 0.12, metalness: 0, clearcoat: 1,
    clearcoatRoughness: 0.06, color: '#040404', opacity: 1,
  },
  // 3D gel — domed resin, lower rise, rounded bevel
  '3d-gel': {
    depth: 0.06, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03,
    bevelSegments: 6, roughness: 0.16, metalness: 0, clearcoat: 0.8,
    clearcoatRoughness: 0.12, color: '#050505', opacity: 1,
  },
  // Ghost — stealthy near-flat tonal lettering
  'ghost': {
    depth: 0.03, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.003,
    bevelSegments: 1, roughness: 0.55, metalness: 0, clearcoat: 0.2,
    clearcoatRoughness: 0.5, color: '#3a3a3a', opacity: 0.55,
  },
}

/* ─── plate substrate ─── */
function PlateBody({ isRear, plateStyle }: { isRear: boolean; plateStyle: PlateStyle }) {
  return (
    <group>
      {/* plate slab */}
      <mesh position={[0, 0, -PLATE_DEPTH / 2]} receiveShadow castShadow>
        <boxGeometry args={[PLATE_W, PLATE_H, PLATE_DEPTH]} />
        <meshPhysicalMaterial
          color={isRear ? '#FCD116' : '#F5F5F5'}
          roughness={0.45}
          metalness={0}
          clearcoat={0.15}
          clearcoatRoughness={0.35}
        />
      </mesh>
      {/* faint inner border */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[PLATE_W - 0.14, PLATE_H - 0.14]} />
        <meshBasicMaterial
          color={plateStyle === 'ghost' ? '#000000' : '#111111'}
          transparent
          opacity={plateStyle === 'ghost' ? 0.04 : 0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

/* ─── the raised registration text ─── */
function PlateText({ text, plateStyle }: { text: string; plateStyle: PlateStyle }) {
  // Render the glyphs at their true size and fit by adjusting `size` directly —
  // NOT by scaling a parent group. Scaling the group would force the bevel/depth
  // to be inflated in the glyph's local space, overflowing tight counters (the
  // holes in O, R, e, g, 8…) and filling them in. With absolute bevel values the
  // chamfer stays small relative to every letter, so counters punch cleanly.
  const [size, setSize] = useState(0.9)
  const g = styleGeometry[plateStyle]

  // width scales linearly with `size`, so this converges to the fit in one step.
  const handleCentered = (props: { width: number }) => {
    if (props.width > 0) {
      const next = Math.min(size * (TEXT_TARGET_W / props.width), PLATE_H * 0.92)
      if (Math.abs(next - size) > 0.005) setSize(next)
    }
  }

  return (
    <Center onCentered={handleCentered}>
      <Text3D
        font={FONT_URL}
        size={size}
        height={g.depth}
        curveSegments={12}
        bevelEnabled={g.bevelEnabled}
        bevelThickness={g.bevelThickness}
        bevelSize={g.bevelSize}
        bevelOffset={0}
        bevelSegments={g.bevelSegments}
      >
        {text}
        <meshPhysicalMaterial
          color={g.color}
          roughness={g.roughness}
          metalness={g.metalness}
          clearcoat={g.clearcoat}
          clearcoatRoughness={g.clearcoatRoughness}
          transparent={g.opacity < 1}
          opacity={g.opacity}
        />
      </Text3D>
    </Center>
  )
}

/* ─── BSAU145e supplier mark, bottom-right ─── */
function BsauMark() {
  return (
    <Center bottom right position={[PLATE_W / 2 - 0.12, -PLATE_H / 2 + 0.1, 0.01]}>
      <Text3D font={FONT_URL} size={0.085} height={0.001} curveSegments={3}>
        BSAU145e
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </Text3D>
    </Center>
  )
}

/* ─── scene contents ─── */
function PlateScene({ text, isRear, plateStyle }: { text: string; isRear: boolean; plateStyle: PlateStyle }) {
  return (
    <>
      {/* key + fill + rim lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 2, 2]} intensity={0.35} />
      <pointLight position={[0, -2, 5]} intensity={0.5} />

      {/* procedural studio env map → gel/4D reflections, no external HDR */}
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 2.5, 4]} scale={[8, 3, 1]} />
        <Lightformer intensity={1.4} position={[-4, 0, 3]} scale={[3, 4, 1]} />
        <Lightformer intensity={1.4} position={[4, 0, 3]} scale={[3, 4, 1]} />
        <Lightformer intensity={0.8} position={[0, -3, 2]} scale={[6, 2, 1]} />
      </Environment>

      <PlateBody isRear={isRear} plateStyle={plateStyle} />
      <PlateText text={text} plateStyle={plateStyle} />
      <BsauMark />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
        // Lock the vertical angle to dead level so the spin is a pure horizontal
        // yaw — the plate never rolls on a diagonal and the lettering stays readable.
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.06}
      />
    </>
  )
}

export default function PlatePreview3D({
  registration,
  plateStyle = '4d-5mm',
  showToggle = true,
}: PlatePreview3DProps) {
  const [isRear, setIsRear] = useState(true)

  const cleanText =
    (registration || 'YOUR REG').toUpperCase().replace(/[^A-Z0-9\s]/g, '').trim() || 'YOUR REG'
  const si = styleConfig[plateStyle]

  return (
    <div style={{ width: '100%' }}>
      {/* 3D canvas */}
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          aspectRatio: '520 / 205',
          margin: '0 auto',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'grab',
        }}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ fov: 32, position: [0, 0, 8], near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        >
          <Suspense fallback={null}>
            <PlateScene text={cleanText} isRear={isRear} plateStyle={plateStyle} />
          </Suspense>
        </Canvas>
      </div>

      {/* controls */}
      {showToggle && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '10px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.12em', color: '#757575', textTransform: 'uppercase' }}>{si.label}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 700, color: '#ffd700' }}>&pound;{si.price}</span>
          </div>
          <div style={{ display: 'flex', backgroundColor: '#1a1a1a', borderRadius: '9999px', padding: '3px', gap: '2px' }}>
            <button onClick={() => setIsRear(false)} style={{ padding: '5px 14px', borderRadius: '9999px', border: 'none', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: !isRear ? '#f5f5f5' : 'transparent', color: !isRear ? '#050401' : '#757575', fontWeight: 700, textTransform: 'uppercase' }}>Front</button>
            <button onClick={() => setIsRear(true)} style={{ padding: '5px 14px', borderRadius: '9999px', border: 'none', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: isRear ? '#ffd700' : 'transparent', color: isRear ? '#050401' : '#757575', fontWeight: 700, textTransform: 'uppercase' }}>Rear</button>
          </div>
        </div>
      )}
    </div>
  )
}
