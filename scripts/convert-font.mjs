// Convert a TTF/OTF font into a Three.js typeface.json file.
// Mirrors the proven gero3/facetype.js algorithm, restricted to the
// glyphs a UK number plate actually needs (A–Z, 0–9, space).
//
// Usage: node scripts/convert-font.mjs <input.otf> <output.json>

import opentype from 'opentype.js'
import fs from 'node:fs'

const [, , inPath, outPath] = process.argv
if (!inPath || !outPath) {
  console.error('Usage: node scripts/convert-font.mjs <input.(o|t)tf> <output.json>')
  process.exit(1)
}

// Glyphs used on plates + a few separators. Space is included explicitly.
const ALLOWED = new Set(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -.'.split('')
)

const font = opentype.parse(fs.readFileSync(inPath))
const scale = (1000 * 100) / ((font.unitsPerEm || 2048) * 72)

const result = { glyphs: {} }

const glyphs = font.glyphs.glyphs
Object.keys(glyphs).forEach((k) => {
  const glyph = glyphs[k]
  if (glyph.unicode === undefined) return
  const ch = String.fromCharCode(glyph.unicode)
  if (!ALLOWED.has(ch)) return

  const token = {
    ha: Math.round(glyph.advanceWidth * scale),
    x_min: Math.round((glyph.xMin || 0) * scale),
    x_max: Math.round((glyph.xMax || 0) * scale),
    o: '',
  }

  const commands = glyph.path.commands
  commands.forEach((command) => {
    let type = command.type.toLowerCase()
    if (type === 'c') type = 'b' // cubic bezier → three.js "b"
    token.o += type + ' '
    if (command.x !== undefined && command.y !== undefined) {
      token.o += Math.round(command.x * scale) + ' ' + Math.round(command.y * scale) + ' '
    }
    if (command.x1 !== undefined && command.y1 !== undefined) {
      token.o += Math.round(command.x1 * scale) + ' ' + Math.round(command.y1 * scale) + ' '
    }
    if (command.x2 !== undefined && command.y2 !== undefined) {
      token.o += Math.round(command.x2 * scale) + ' ' + Math.round(command.y2 * scale) + ' '
    }
  })

  result.glyphs[ch] = token
})

const nameTable = font.tables.name || {}
const pick = (entry) => (entry && (entry.en || Object.values(entry)[0])) || ''

result.familyName = pick(nameTable.fontFamily) || 'CharlesWright'
result.ascender = Math.round(font.ascender * scale)
result.descender = Math.round(font.descender * scale)
result.underlinePosition = Math.round((font.tables.post?.underlinePosition || 0) * scale)
result.underlineThickness = Math.round((font.tables.post?.underlineThickness || 0) * scale)
result.boundingBox = {
  yMin: Math.round((font.tables.head?.yMin || 0) * scale),
  xMin: Math.round((font.tables.head?.xMin || 0) * scale),
  yMax: Math.round((font.tables.head?.yMax || 0) * scale),
  xMax: Math.round((font.tables.head?.xMax || 0) * scale),
}
result.resolution = 1000
result.original_font_information = nameTable

// Weight/style hints (three.js ignores these but the format expects them).
const weight = pick(nameTable.fontSubfamily).toLowerCase()
result.cssFontWeight = weight.includes('bold') ? 'bold' : 'normal'
result.cssFontStyle = weight.includes('italic') ? 'italic' : 'normal'

fs.writeFileSync(outPath, JSON.stringify(result))
console.log(
  `Wrote ${outPath} — ${Object.keys(result.glyphs).length} glyphs, family "${result.familyName}", ${result.cssFontWeight}`
)
