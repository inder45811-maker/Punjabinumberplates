import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'

export default function WebGLIntro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const rafRef = useRef<number>(0)
  const [visible, setVisible] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  const dismiss = useCallback(() => {
    if (!visible || dismissed) return
    setDismissed(true)
    const container = containerRef.current
    if (!container) {
      setVisible(false)
      return
    }
    container.style.transition = 'opacity 2.5s cubic-bezier(0.16, 1, 0.3, 1), transform 2.5s cubic-bezier(0.16, 1, 0.3, 1)'
    container.style.opacity = '0'
    container.style.transform = 'scale(1.1)'
    container.style.pointerEvents = 'none'
    setTimeout(() => {
      setVisible(false)
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current = null
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }, 2600)
  }, [visible, dismissed])

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      setTimeout(() => dismiss(), 1500)
      return
    }

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    // Liquid glass distortion shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision mediump float;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform sampler2D uNoiseTexture;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = vUv;
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

        // Mouse-driven lens distortion
        vec2 mouseOffset = (uMouse - 0.5) * aspect * 0.3;
        vec2 distUv = uv - mouseOffset;

        float dist = length((uv - uMouse) * aspect);
        float lensStrength = smoothstep(0.5, 0.0, dist) * 0.15;

        // Liquid distortion
        float t = uTime * 0.5;
        float distortX = sin(distUv.y * 8.0 + t) * 0.02;
        float distortY = cos(distUv.x * 8.0 + t * 0.7) * 0.02;

        // Chromatic aberration
        float r = texture2D(uNoiseTexture, uv + vec2(lensStrength * 1.5 + distortX, distortY)).r;
        float g = texture2D(uNoiseTexture, uv + vec2(lensStrength + distortX * 0.8, distortY * 0.8)).g;
        float b = texture2D(uNoiseTexture, uv + vec2(lensStrength * 0.5 + distortX * 0.5, distortY * 0.5)).b;

        vec3 color = vec3(r, g, b);

        // Gold tint overlay near cursor
        float goldGlow = smoothstep(0.4, 0.0, dist) * 0.3;
        color += vec3(1.0, 0.84, 0.0) * goldGlow;

        // Dark vignette
        float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.5);
        color *= vignette * 0.6 + 0.2;

        gl_FragColor = vec4(color, 1.0);
      }
    `

    // Create noise texture
    const size = 512
    const data = new Uint8Array(size * size * 4)
    for (let i = 0; i < size * size * 4; i += 4) {
      const v = Math.random() * 255
      data[i] = v
      data[i + 1] = v
      data[i + 2] = v
      data[i + 3] = 255
    }
    const noiseTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
    noiseTexture.needsUpdate = true

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uNoiseTexture: { value: noiseTexture },
      },
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    const clock = new THREE.Clock()
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      material.uniforms.uTime.value = clock.getElapsedTime()
      material.uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        0.05
      )
      renderer.render(scene, camera)
    }
    animate()

    // Dismiss on scroll
    const onScroll = () => {
      if (window.scrollY > 50) dismiss()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      geometry.dispose()
      material.dispose()
      noiseTexture.dispose()
      renderer.dispose()
    }
  }, [dismiss])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      onClick={dismiss}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        cursor: 'pointer',
        backgroundColor: '#050401',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            color: '#757575',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          DISRUPT THE ORDINARY
        </p>
        <h2
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-2.4px',
            color: '#f2f3f4',
            textTransform: 'uppercase',
          }}
        >
          INTERACT TO BEGIN
        </h2>
      </div>
    </div>
  )
}
