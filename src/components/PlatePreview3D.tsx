import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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

// Style configs matching Utopia's Three.js settings
const styleGeometry: Record<PlateStyle, {
  depth: number
  bevelEnabled: boolean
  bevelThickness: number
  bevelSize: number
  bevelOffset: number
  bevelSegments: number
  roughness: number
  metalness: number
  letterColor: string
}> = {
  '4d-5mm': {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3,
    roughness: 0.2,
    metalness: 0.1,
    letterColor: '#121212',
  },
  '4d-gel': {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 5,
    roughness: 0.1,
    metalness: 0.15,
    letterColor: '#0a0a0a',
  },
  '3d-gel': {
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelOffset: -0.02,
    bevelSegments: 6,
    roughness: 0.12,
    metalness: 0.1,
    letterColor: '#111',
  },
  'ghost': {
    depth: 0.04,
    bevelEnabled: true,
    bevelThickness: 0,
    bevelSize: 0,
    bevelOffset: -0.03,
    bevelSegments: 0,
    roughness: 0.5,
    metalness: 0.0,
    letterColor: '#2a2a2a',
  },
}

// Helvetiker bold font data embedded (trimmed - we'll load from CDN)
const FONT_URL = 'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json'

/* ═══ GB BADGE — SVG texture for the plate ═══ */
function createGBBadgeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 80
  canvas.height = 170
  const ctx = canvas.getContext('2d')!

  // Blue background
  ctx.fillStyle = '#003399'
  roundRect(ctx, 2, 2, 76, 166, 6)
  ctx.fill()

  // Union Jack pattern (simplified)
  ctx.globalAlpha = 0.5
  // White cross
  ctx.fillStyle = '#fff'
  ctx.fillRect(34, 4, 12, 162)
  ctx.fillRect(4, 78, 72, 12)
  // Red cross
  ctx.fillStyle = '#C8102E'
  ctx.fillRect(38, 4, 4, 162)
  ctx.fillRect(4, 82, 72, 4)
  ctx.globalAlpha = 1

  // GB text
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('GB', 40, 152)

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/* ═══ BSAU145e texture ═══ */
function createBSAUTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 20
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'rgba(0,0,0,0.22)'
  ctx.font = '10px Arial'
  ctx.textAlign = 'right'
  ctx.fillText('BSAU145e', 190, 14)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

export default function PlatePreview3D({
  registration,
  plateStyle = '4d-5mm',
  showToggle = true,
}: PlatePreview3DProps) {
  const [isRear, setIsRear] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: OrbitControls
    plateBg: THREE.Mesh
    letters: THREE.Group
    font: any
  } | null>(null)

  const cleanText = (registration || 'YOUR REG').toUpperCase().replace(/[^A-Z0-9\s]/g, '').trim() || 'YOUR REG'
  const si = styleConfig[plateStyle]

  // Build the scene
  const buildScene = useCallback((canvas: HTMLCanvasElement) => {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(520, 200)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(35, 520 / 200, 0.1, 100)
    camera.position.set(0, 0, 8)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.enablePan = false
    controls.maxPolarAngle = Math.PI * 0.6
    controls.minPolarAngle = Math.PI * 0.3
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
    dirLight.position.set(3, 5, 4)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 512
    dirLight.shadow.mapSize.height = 512
    scene.add(dirLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
    fillLight.position.set(-3, 2, 2)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0xffffff, 0.4)
    rimLight.position.set(0, -2, 5)
    scene.add(rimLight)

    // Plate background (box)
    const plateWidth = 6.2
    const plateHeight = 1.5
    const plateDepth = 0.06
    const plateGeom = new THREE.BoxGeometry(plateWidth, plateHeight, plateDepth)
    const plateMat = new THREE.MeshPhysicalMaterial({
      color: isRear ? '#facc15' : '#f5f5f5',
      roughness: 0.4,
      metalness: 0.0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.3,
    })
    const plateBg = new THREE.Mesh(plateGeom, plateMat)
    plateBg.position.z = -plateDepth / 2
    plateBg.receiveShadow = true
    scene.add(plateBg)

    // Inner border line
    const borderGeom = new THREE.PlaneGeometry(plateWidth - 0.12, plateHeight - 0.12)
    const borderMat = new THREE.MeshBasicMaterial({
      color: plateStyle === 'ghost' ? 0x000000 : 0x111111,
      transparent: true,
      opacity: plateStyle === 'ghost' ? 0.03 : 0.10,
      side: THREE.DoubleSide,
    })
    const border = new THREE.Mesh(borderGeom, borderMat)
    border.position.z = 0.001
    scene.add(border)

    // GB Badge
    const badgeTex = createGBBadgeTexture()
    const badgeGeom = new THREE.PlaneGeometry(0.38, 0.80)
    const badgeMat = new THREE.MeshBasicMaterial({
      map: badgeTex,
      transparent: true,
      side: THREE.DoubleSide,
    })
    const badge = new THREE.Mesh(badgeGeom, badgeMat)
    badge.position.set(-2.55, 0, 0.005)
    scene.add(badge)

    // BSAU145e mark
    const bsauTex = createBSAUTexture()
    const bsauGeom = new THREE.PlaneGeometry(1.0, 0.1)
    const bsauMat = new THREE.MeshBasicMaterial({
      map: bsauTex,
      transparent: true,
      side: THREE.DoubleSide,
    })
    const bsau = new THREE.Mesh(bsauGeom, bsauMat)
    bsau.position.set(2.4, -0.58, 0.005)
    scene.add(bsau)

    // Letters group
    const letters = new THREE.Group()
    scene.add(letters)

    return { scene, camera, renderer, controls, plateBg, letters }
  }, [isRear, plateStyle])

  // Load font and render letters
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Load font then render
    const loader = new FontLoader()
    loader.load(FONT_URL, (font) => {
      const s = buildScene(canvas)
      if (!s) return

      sceneRef.current = { ...s, font }
      renderLetters(s.letters, font, cleanText, plateStyle)

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate)
        s.controls.update()
        s.renderer.render(s.scene, s.camera)
      }
      animate()
    })

    return () => {
      if (sceneRef.current) {
        sceneRef.current.renderer.dispose()
        sceneRef.current.controls.dispose()
      }
    }
  }, [])

  // Re-render when text/style/rear changes
  useEffect(() => {
    if (!sceneRef.current) return
    const { letters, font, plateBg } = sceneRef.current

    // Update plate colour
    ;(plateBg.material as THREE.MeshPhysicalMaterial).color.set(isRear ? '#facc15' : '#f5f5f5')

    // Re-render letters
    renderLetters(letters, font, cleanText, plateStyle)
  }, [cleanText, plateStyle, isRear])

  return (
    <div style={{ width: '100%' }}>
      {/* Canvas */}
      <div style={{
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'grab',
      }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>

      {/* Controls */}
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

/* ═══ Render letters onto the scene ═══ */
function renderLetters(
  group: THREE.Group,
  font: any,
  text: string,
  plateStyle: PlateStyle,
) {
  // Clear existing
  while (group.children.length > 0) {
    const child = group.children[0]
    group.remove(child)
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose()
      ;(child.material as THREE.Material).dispose()
    }
  }

  const style = styleGeometry[plateStyle]
  const ghostOpacity = plateStyle === 'ghost' ? 0.35 : 1.0

  // Letter material
  const mat = new THREE.MeshPhysicalMaterial({
    color: style.letterColor,
    roughness: style.roughness,
    metalness: style.metalness,
    transparent: plateStyle === 'ghost',
    opacity: ghostOpacity,
    depthWrite: plateStyle !== 'ghost',
  })

  // Split text
  const words = text.split(/\s+/).filter(Boolean)
  const totalChars = text.replace(/\s/g, '').length
  const letterSize = totalChars <= 5 ? 0.7 : totalChars <= 7 ? 0.55 : totalChars <= 9 ? 0.42 : 0.32
  const letterSpacing = letterSize * 0.12

  // Calculate total width
  const spaceWidth = letterSize * 0.5
  let totalWidth = 0
  const charWidths: number[] = []

  words.forEach((word, wi) => {
    for (let i = 0; i < word.length; i++) {
      const geom = new TextGeometry(word[i], {
        font,
        size: letterSize,
        depth: style.depth,
        bevelEnabled: style.bevelEnabled,
        bevelThickness: style.bevelThickness,
        bevelSize: style.bevelSize,
        bevelOffset: style.bevelOffset,
        bevelSegments: style.bevelSegments,
      })
      geom.computeBoundingBox()
      const w = (geom.boundingBox?.max.x || letterSize) - (geom.boundingBox?.min.x || 0)
      charWidths.push(w)
      totalWidth += w + letterSpacing
      geom.dispose()
    }
    if (wi < words.length - 1) {
      totalWidth += spaceWidth
    }
  })

  // Start position (centered)
  let xPos = -totalWidth / 2
  let charIdx = 0

  words.forEach((word, wi) => {
    for (let i = 0; i < word.length; i++) {
      const geom = new TextGeometry(word[i], {
        font,
        size: letterSize,
        depth: style.depth,
        bevelEnabled: style.bevelEnabled,
        bevelThickness: style.bevelThickness,
        bevelSize: style.bevelSize,
        bevelOffset: style.bevelOffset,
        bevelSegments: style.bevelSegments,
      })
      geom.computeBoundingBox()
      geom.center()

      const mesh = new THREE.Mesh(geom, mat.clone())
      mesh.name = `letter-${charIdx}`
      mesh.position.set(xPos + charWidths[charIdx] / 2, 0, style.depth / 2)
      mesh.castShadow = true
      mesh.receiveShadow = true
      group.add(mesh)

      xPos += charWidths[charIdx] + letterSpacing
      charIdx++
    }
    if (wi < words.length - 1) {
      xPos += spaceWidth
    }
  })
}
