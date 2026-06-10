// Element screenshotter. Scrolls a selector into view and captures its region.
// Usage: node scripts/shot-el.mjs <url> <selector> <outfile>
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import fs from 'node:fs'
const SHELL = 'C:/Users/IReyat/AppData/Local/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-win64/chrome-headless-shell.exe'
const URL = process.argv[2]; const SELECTOR = process.argv[3]; const OUT = process.argv[4]; const PORT = 9351
const proc = spawn(SHELL, ['--headless','--enable-unsafe-swiftshader','--hide-scrollbars','--no-first-run','--no-sandbox',`--remote-debugging-port=${PORT}`,'--window-size=1600,1200','--force-device-scale-factor=2',URL],{stdio:'ignore'})
function cleanup(c){try{ws?.close()}catch{}try{proc.kill()}catch{}process.exit(c)}
let wsUrl
for (let i=0;i<60;i++){try{const r=await fetch(`http://localhost:${PORT}/json`);const l=await r.json();const p=l.find(t=>t.type==='page'&&t.url.includes('localhost'));wsUrl=p?.webSocketDebuggerUrl;if(wsUrl)break}catch{}await sleep(200)}
const ws=new WebSocket(wsUrl);let id=0;const pending=new Map()
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id)}})
const send=(method,params={})=>new Promise(res=>{const i=++id;pending.set(i,res);ws.send(JSON.stringify({id:i,method,params}))})
const evalJs=async(expr)=>{const r=await send('Runtime.evaluate',{expression:expr,returnByValue:true});return r?.result?.value}
await new Promise(res=>ws.addEventListener('open',res))
await send('Page.enable'); await send('Runtime.enable')
for(let i=0;i<40;i++){const len=await evalJs('document.body.innerText.length');if(len>500)break;await sleep(250)}
await evalJs(`(()=>{const s=document.createElement('style');s.textContent='*{opacity:1 !important;visibility:visible !important;}';document.head.appendChild(s);})()`)
for(let i=0;i<40;i++){if(await evalJs(`!!document.querySelector(${JSON.stringify(SELECTOR)})`))break;await sleep(300)}
await sleep(2500)
const raw=await evalJs(`(()=>{const el=document.querySelector(${JSON.stringify(SELECTOR)});if(!el)return null;el.scrollIntoView({block:'start'});const r=el.getBoundingClientRect();return JSON.stringify({x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:Math.min(r.height,1100)});})()`)
await sleep(600)
let cl; if(raw){const r=JSON.parse(raw);cl={x:Math.max(0,r.x),y:Math.max(0,r.y),width:r.w,height:r.h,scale:1}}
const s=await send('Page.captureScreenshot',cl?{format:'png',clip:cl,captureBeyondViewport:true}:{format:'png'})
fs.writeFileSync(OUT,Buffer.from(s.data,'base64'))
console.log('wrote',OUT)
cleanup(0)
