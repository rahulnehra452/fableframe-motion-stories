/** Trusted, deterministic Canvas toolkit. No generated code is executed in the studio. */
export type StoryKind = 'moon' | 'boat' | 'cloud';
export const artPalette = {
  ink: '#393e36', paper: '#f3eddc', rabbit: '#f4efdf', blush: '#e8a394',
  night: '#26444b', nightTop: '#213b45', moon: '#f9e7a8', sage: '#a4b392',
  grass: '#657d66', grassDark: '#405c51', fox: '#ce8050', leaf: '#d59773',
  water: '#86aaa4', sky: '#c2d5d0', peach: '#edc0ab', gold: '#e2b15a',
};
export function random(seed: number) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}
export function ease(n: number) { const x = Math.max(0, Math.min(1, n)); return x * x * (3 - 2 * x); }

function ellipse(c: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, fill: string, rotation = 0, outline = true) {
  c.beginPath(); c.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2); c.fillStyle = fill; c.fill();
  if (outline) { c.lineWidth = 1.4; c.strokeStyle = artPalette.ink; c.stroke(); }
}
function path(c: CanvasRenderingContext2D, points: number[], color: string, width = 2) {
  c.beginPath(); c.moveTo(points[0] ?? 0, points[1] ?? 0);
  if (points.length === 8) c.bezierCurveTo(points[2] ?? 0, points[3] ?? 0, points[4] ?? 0, points[5] ?? 0, points[6] ?? 0, points[7] ?? 0);
  else for (let i = 2; i < points.length; i += 2) c.lineTo(points[i] ?? 0, points[i + 1] ?? 0);
  c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.stroke();
}
function shape(c: CanvasRenderingContext2D, fill: string, draw: () => void) {
  c.beginPath(); draw(); c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = artPalette.ink; c.lineWidth = 1.5; c.stroke();
}
function hatching(c: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, color: string, seed = 22, amount = 180) {
  const r = random(seed); c.save(); c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.clip(); c.globalAlpha = 0.16;
  for (let i = 0; i < amount; i++) { const a = x + (r() - 0.5) * rx * 2, b = y + (r() - 0.5) * ry * 2; path(c, [a, b, a + r() * 8 + 3, b - r() * 6 - 2], color, 0.65); }
  c.restore();
}
function star(c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, angle = 0) {
  c.save(); c.translate(x, y); c.rotate(angle); c.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rad = i % 2 === 0 ? size : size * 0.3; const px = Math.cos(a) * rad, py = Math.sin(a) * rad; if (i === 0) c.moveTo(px, py); else c.lineTo(px, py); }
  c.closePath(); c.fillStyle = color; c.fill(); c.restore();
}
function face(c: CanvasRenderingContext2D, x: number, y: number, scale: number, t: number, look = 0) {
  const blink = Math.sin(t * 1.7) > 0.997; c.save(); c.translate(x, y); c.scale(scale, scale);
  ellipse(c, -23, 7, 12, 7, artPalette.blush, 0, false); ellipse(c, 23, 7, 12, 7, artPalette.blush, 0, false);
  for (const xx of [-16, 16]) {
    if (blink) path(c, [xx - 5, -6, xx + 5, -6], artPalette.ink, 2);
    else { ellipse(c, xx + look, -8, 5, 6.8, artPalette.ink, 0, false); ellipse(c, xx + look - 1.5, -10, 1.5, 1.8, artPalette.paper, 0, false); }
  }
  shape(c, artPalette.ink, () => { c.moveTo(-4, 1); c.quadraticCurveTo(0, -1, 4, 1); c.lineTo(0, 5); });
  path(c, [0, 5, 0, 13, -7, 15, -10, 10], artPalette.ink, 1.4); path(c, [0, 5, 0, 13, 7, 15, 10, 10], artPalette.ink, 1.4);
  c.restore();
}
function rabbit(c: CanvasRenderingContext2D, x: number, y: number, s: number, t: number) {
  c.save(); c.translate(x, y + Math.sin(t * 2.2) * 3); c.scale(s, s);
  ellipse(c, 50, 40, 18, 18, artPalette.rabbit); ellipse(c, 0, 26, 48, 59, artPalette.rabbit);
  hatching(c, 0, 26, 48, 59, artPalette.grass, 44);
  ellipse(c, -28, 77, 24, 13, artPalette.rabbit, -0.08); ellipse(c, 25, 77, 24, 13, artPalette.rabbit, 0.08);
  const ear = Math.sin(t * 2) * 0.035;
  ellipse(c, -25, -78, 15, 55, artPalette.rabbit, -0.18 + ear); ellipse(c, 22, -83, 15, 59, artPalette.rabbit, 0.13 - ear);
  ellipse(c, -25, -81, 6.5, 39, artPalette.blush, -0.18 + ear, false); ellipse(c, 22, -86, 6.5, 42, artPalette.blush, 0.13 - ear, false);
  ellipse(c, 0, -22, 54, 46, artPalette.rabbit); hatching(c, 0, -22, 54, 46, artPalette.grass, 76);
  face(c, 0, -23, 1, t, 2);
  path(c, [-48, -22, -62, -27], artPalette.ink, 0.7); path(c, [-48, -16, -65, -14], artPalette.ink, 0.7);
  path(c, [48, -22, 62, -27], artPalette.ink, 0.7); path(c, [48, -16, 65, -14], artPalette.ink, 0.7);
  ellipse(c, -26, 32, 15, 27, artPalette.rabbit, -0.7); ellipse(c, 28, 31, 15, 27, artPalette.rabbit, 0.7);
  c.restore();
}
function fox(c: CanvasRenderingContext2D, x: number, y: number, s: number, t: number) {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, artPalette.fox, () => { c.moveTo(27, 63); c.bezierCurveTo(111, 93, 120, -8, 88, -27); c.bezierCurveTo(113, 45, 39, 12, 27, 63); });
  shape(c, artPalette.paper, () => { c.moveTo(94, 7); c.quadraticCurveTo(106, -2, 88, -27); c.quadraticCurveTo(97, 8, 83, 24); });
  ellipse(c, 0, 29, 45, 58, artPalette.fox); ellipse(c, 0, 34, 24, 37, artPalette.paper);
  shape(c, artPalette.fox, () => { c.moveTo(-52, -18); c.lineTo(-54, -85); c.quadraticCurveTo(-29, -78, -17, -48); c.quadraticCurveTo(0, -59, 17, -48); c.quadraticCurveTo(31, -80, 54, -85); c.lineTo(52, -18); c.quadraticCurveTo(39, 26, 0, 27); c.quadraticCurveTo(-39, 26, -52, -18); });
  shape(c, artPalette.paper, () => { c.moveTo(-48, -15); c.quadraticCurveTo(-21, -10, 0, 4); c.quadraticCurveTo(21, -10, 48, -15); c.quadraticCurveTo(30, 31, 0, 27); c.quadraticCurveTo(-30, 31, -48, -15); });
  shape(c, artPalette.ink, () => { c.moveTo(-48, -72); c.lineTo(-43, -37); c.lineTo(-27, -47); });
  shape(c, artPalette.ink, () => { c.moveTo(48, -72); c.lineTo(43, -37); c.lineTo(27, -47); });
  hatching(c, 0, -22, 50, 50, artPalette.ink, 18, 110); face(c, 0, -6, 1.1, t);
  ellipse(c, -22, 78, 19, 10, artPalette.ink); ellipse(c, 22, 78, 19, 10, artPalette.ink); c.restore();
}
function bear(c: CanvasRenderingContext2D, x: number, y: number, s: number, t: number) {
  c.save(); c.translate(x, y); c.scale(s, s);
  ellipse(c, 0, 27, 52, 60, artPalette.gold); hatching(c, 0, 27, 52, 60, artPalette.fox);
  ellipse(c, -41, -57, 22, 22, artPalette.gold); ellipse(c, 41, -57, 22, 22, artPalette.gold);
  ellipse(c, -41, -57, 12, 12, artPalette.fox, 0, false); ellipse(c, 41, -57, 12, 12, artPalette.fox, 0, false);
  ellipse(c, 0, -25, 59, 49, artPalette.gold); hatching(c, 0, -25, 59, 49, artPalette.fox, 6);
  ellipse(c, 0, -11, 26, 20, artPalette.paper, 0, false); face(c, 0, -22, 1.15, t);
  ellipse(c, -30, 79, 24, 15, artPalette.gold); ellipse(c, 28, 79, 24, 15, artPalette.gold);
  ellipse(c, -42, 25, 15, 29, artPalette.gold, -0.4); ellipse(c, 47, 2, 15, 32, artPalette.gold, 0.65 + Math.sin(t * 2) * 0.08);
  c.restore();
}
function plant(c: CanvasRenderingContext2D, x: number, y: number, height: number, color: string, t: number, seed: number) {
  const r = random(seed); c.save(); c.translate(x, y); c.rotate(Math.sin(t * 0.7 + seed) * 0.035);
  path(c, [0, 0, -8, -height * 0.4, 9, -height * 0.7, 0, -height], color, 1.5);
  for (let i = 1; i < 7; i++) {
    const yy = -height * i / 8, dir = i % 2 ? 1 : -1, len = height * (0.1 + r() * 0.12);
    shape(c, color, () => { c.moveTo(0, yy); c.quadraticCurveTo(dir * len * 0.35, yy - len, dir * len, yy - len * 0.6); c.quadraticCurveTo(dir * len * 0.65, yy, 0, yy); });
  }
  c.restore();
}
function ground(c: CanvasRenderingContext2D, t: number) {
  shape(c, artPalette.grass, () => { c.moveTo(-10, 486); c.bezierCurveTo(85, 455, 225, 502, 370, 466); c.lineTo(370, 650); c.lineTo(-10, 650); });
  shape(c, artPalette.grassDark, () => { c.moveTo(-10, 567); c.bezierCurveTo(100, 508, 248, 574, 370, 516); c.lineTo(370, 650); c.lineTo(-10, 650); });
  for (let i = 0; i < 12; i++) plant(c, i * 35 - 8, 640, 80 + (i * 29 % 100), i % 2 ? artPalette.sage : artPalette.grass, t, i + 50);
  for (let i = 0; i < 15; i++) {
    const x = i * 28 + 9, y = 512 + (i * 17 % 111); path(c, [x, y + 14, x + 2, y], artPalette.sage, 1);
    for (let p = 0; p < 5; p++) ellipse(c, x + Math.cos(p * 1.26) * 4, y + Math.sin(p * 1.26) * 4, 3, 2, i % 3 ? artPalette.paper : artPalette.blush, p * 1.26, false);
    ellipse(c, x, y, 1.8, 1.8, artPalette.gold, 0, false);
  }
}
function drawMoon(c: CanvasRenderingContext2D, t: number) {
  c.fillStyle = artPalette.night; c.fillRect(0, 0, 360, 640);
  const r = random(800);
  for (let i = 0; i < 50; i++) {
    const x = r() * 360, y = 30 + r() * 430, size = 1 + r() * 3;
    c.globalAlpha = 0.5 + Math.sin(t * 1.2 + i) * 0.25; star(c, x, y, size, artPalette.moon, 0.1); c.globalAlpha = 1;
  }
  const capture = ease((t - 4) / 5), release = ease((t - 11) / 3), captured = capture * (1 - release);
  const mx = 214 - captured * 10, my = 172 + captured * 263, mr = 77 - captured * 60;
  ellipse(c, mx, my, mr, mr * 1.015, artPalette.moon, 0, false); hatching(c, mx, my, mr, mr, artPalette.gold, 29, 420);
  for (let i = 0; i < 7; i++) ellipse(c, mx + Math.cos(i * 2.2) * mr * 0.62, my + Math.sin(i * 2.2) * mr * 0.56, mr * 0.08, mr * 0.07, '#e8d295', 0, false);
  plant(c, 8, 549, 209, artPalette.grass, t, 36); plant(c, 349, 566, 251, artPalette.sage, t, 75);
  ground(c, t); ellipse(c, 185, 506, 83, 12, artPalette.grassDark, 0, false);
  rabbit(c, 158 + Math.sin(t * 0.55) * 7, 405, 1.06, t);
  c.save(); c.globalAlpha = 0.35; shape(c, artPalette.paper, () => { c.moveTo(182, 405); c.lineTo(228, 405); c.lineTo(238, 469); c.quadraticCurveTo(205, 481, 174, 469); }); c.restore();
  path(c, [182, 405, 228, 405, 238, 469, 224, 479, 184, 479, 174, 469, 182, 405], artPalette.moon, 1.4);
  ellipse(c, 205, 404, 24, 5, artPalette.gold, 0, true); path(c, [179, 416, 177, 457], artPalette.paper, 2);
  for (let i = 0; i < 5; i++) { const a = t * 0.4 + i * 1.25; star(c, 205 + Math.cos(a) * 63, 366 + Math.sin(a) * 43, 4, artPalette.moon, a); }
}
function drawBoat(c: CanvasRenderingContext2D, t: number) {
  c.fillStyle = artPalette.peach; c.fillRect(0, 0, 360, 640);
  ellipse(c, 251, 178, 81, 81, artPalette.paper, 0, false); hatching(c, 251, 178, 81, 81, artPalette.gold, 41, 440);
  shape(c, '#a9b39b', () => { c.moveTo(-10, 294); c.bezierCurveTo(98, 191, 253, 280, 370, 242); c.lineTo(370, 420); c.lineTo(-10, 420); });
  shape(c, artPalette.sage, () => { c.moveTo(-10, 323); c.bezierCurveTo(98, 358, 233, 293, 370, 331); c.lineTo(370, 450); c.lineTo(-10, 450); });
  c.fillStyle = artPalette.water; c.fillRect(0, 356, 360, 284);
  const r = random(7); for (let i = 0; i < 45; i++) { const x = r() * 360, y = 372 + r() * 265; path(c, [x + Math.sin(t + i) * 5, y, x + 14 + r() * 27, y], i % 2 ? artPalette.sage : artPalette.paper, 0.65); }
  const drift = Math.sin(t * 0.45) * 13, bob = Math.sin(t * 1.4) * 4;
  c.save(); c.translate(drift, bob); ellipse(c, 181, 501, 106, 10, '#6c9590', 0, false);
  fox(c, 176, 394, 0.92, t);
  shape(c, artPalette.leaf, () => { c.moveTo(58, 449); c.bezierCurveTo(131, 475, 204, 469, 297, 431); c.bezierCurveTo(271, 541, 103, 547, 58, 449); });
  path(c, [69, 454, 129, 484, 219, 472, 283, 440], artPalette.ink, 1.5);
  for (let i = 0; i < 7; i++) { const x = 91 + i * 27; path(c, [x, 468 + Math.sin(i * 0.6) * 10, x + 17, 504 - Math.abs(3 - i) * 5], '#a26950', 0.8); }
  path(c, [211, 401, 285, 525], artPalette.ink, 3); ellipse(c, 284, 525, 10, 25, artPalette.paper, -0.5); c.restore();
  plant(c, -8, 643, 250, artPalette.grassDark, t, 81); plant(c, 354, 645, 223, artPalette.grass, t, 82);
  for (const [x, y] of [[54, 566], [279, 587], [310, 398]]) { ellipse(c, x ?? 0, y ?? 0, 30, 11, artPalette.grass, 0.05); }
  const bx = 120 + Math.sin(t * 0.8) * 54, by = 274 + Math.cos(t * 1.1) * 24;
  ellipse(c, bx - 6, by, 10, 4, artPalette.paper, -0.5, false); ellipse(c, bx + 6, by, 10, 4, artPalette.paper, 0.5, false); path(c, [bx, by - 3, bx, by + 10], artPalette.ink, 1.2);
}
function cloud(c: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, color, () => { c.moveTo(-100, 15); c.bezierCurveTo(-133, -10, -85, -64, -55, -36); c.bezierCurveTo(-55, -85, 21, -88, 37, -44); c.bezierCurveTo(69, -66, 121, -18, 99, 12); c.bezierCurveTo(109, 38, -88, 44, -100, 15); }); c.restore();
}
function drawCloud(c: CanvasRenderingContext2D, t: number) {
  c.fillStyle = artPalette.sky; c.fillRect(0, 0, 360, 640);
  ellipse(c, 286, 154, 62, 62, artPalette.moon, 0, false); hatching(c, 286, 154, 62, 62, artPalette.gold);
  cloud(c, 0 + Math.sin(t * 0.2) * 25, 260, 0.8, artPalette.paper); cloud(c, 344 + Math.sin(t * 0.2) * 25, 341, 0.8, artPalette.paper);
  const y = 430 + Math.sin(t * 0.9) * 7;
  bear(c, 165, y - 63, 1.05, t); cloud(c, 170, y + 38, 1.24, artPalette.peach);
  for (let i = 0; i < 65; i++) { const r = random(i + 40), x = 57 + r() * 229, yy = y + 38 + r() * 22; path(c, [x, yy, x + 7, yy - 3], '#bc9689', 0.7); }
  const kx = 228 + Math.sin(t * 0.8) * 17, ky = 218 + Math.cos(t * 0.7) * 13;
  path(c, [203, y - 73, 219, 306, 183, 269, kx, ky + 26], artPalette.ink, 1);
  c.save(); c.translate(kx, ky); c.rotate(Math.sin(t) * 0.12);
  shape(c, artPalette.fox, () => { c.moveTo(0, -39); c.lineTo(31, 0); c.lineTo(0, 41); c.lineTo(-31, 0); });
  path(c, [0, -37, 0, 39], artPalette.paper, 1); path(c, [-30, 0, 30, 0], artPalette.paper, 1);
  path(c, [0, 41, 22, 73, -12, 95, 12, 115], artPalette.ink, 1);
  for (const yy of [62, 86, 109]) { shape(c, artPalette.moon, () => { c.moveTo(7, yy); c.lineTo(-3, yy - 5); c.lineTo(-3, yy + 5); c.lineTo(17, yy - 5); c.lineTo(17, yy + 5); }); }
  c.restore();
  cloud(c, 55, 609, 0.87, artPalette.paper); cloud(c, 314, 562, 0.9, artPalette.paper);
  for (let i = 0; i < 8; i++) star(c, 24 + (i * 73 % 319), 100 + (i * 97 % 430), 4, artPalette.paper, Math.sin(t * 0.3));
}
let grain: HTMLCanvasElement | OffscreenCanvas | undefined;
function paperGrain() {
  if (grain) return grain;
  if (typeof document === 'undefined') return;
  const layer = document.createElement('canvas'); layer.width = 360; layer.height = 640;
  const ctx = layer.getContext('2d'); if (!ctx) return;
  const data = ctx.createImageData(360, 640), r = random(942);
  for (let i = 0; i < data.data.length; i += 4) { const v = r() > 0.5 ? 255 : 25; data.data[i] = v; data.data[i + 1] = v; data.data[i + 2] = v; data.data[i + 3] = Math.floor(r() * 22); }
  ctx.putImageData(data, 0, 0); grain = layer; return grain;
}
export function renderStory(ctx: CanvasRenderingContext2D, t: number, W: number, H: number, story: StoryKind = 'moon') {
  ctx.save(); ctx.setTransform(W / 360, 0, 0, H / 640, 0, 0); ctx.clearRect(0, 0, 360, 640);
  ctx.lineJoin = 'round'; const time = ((t % 15) + 15) % 15;
  if (story === 'boat') drawBoat(ctx, time); else if (story === 'cloud') drawCloud(ctx, time); else drawMoon(ctx, time);
  const texture = paperGrain(); if (texture) ctx.drawImage(texture, 0, 0);
  ctx.restore();
}