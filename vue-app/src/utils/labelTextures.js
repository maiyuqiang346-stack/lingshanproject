import * as THREE from 'three';

export function createLabelTexture(text) {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  const fontSize = text.length <= 2 ? 84 : (text.length <= 4 ? 56 : 42);
  ctx.font = `bold ${fontSize}px "KaiTi", "STKaiti", "楷体", serif`;
  const metrics = ctx.measureText(text);
  const pad = 40;
  const h = 170;
  const w = Math.max(h, Math.ceil(metrics.width) + pad * 2);
  c.width = w; c.height = h;

  const cx = w / 2;
  const cy = h / 2 + 8;
  const r = (h - 30) / 2 - 4;

  for (let i = 4; i >= 0; i--) {
    ctx.save();
    ctx.shadowColor = `rgba(212, 160, 23, ${0.08 + i * 0.06})`;
    ctx.shadowBlur = 40 + i * 20;
    ctx.beginPath();
    if (w > h - 20 + 8) {
      const gr = r + 2;
      ctx.moveTo(gr, 30);
      ctx.lineTo(w - gr, 30);
      ctx.arc(w - gr, cy, gr, -Math.PI/2, Math.PI/2);
      ctx.lineTo(gr, h - 4);
      ctx.arc(gr, cy, gr, Math.PI/2, -Math.PI/2);
    } else {
      ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
    }
    ctx.fillStyle = 'rgba(212,160,23,0)';
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.beginPath();
  if (w > h - 20 + 8) {
    ctx.moveTo(r, 30);
    ctx.lineTo(w - r, 30);
    ctx.arc(w - r, cy, r, -Math.PI/2, Math.PI/2);
    ctx.lineTo(r, h - 4);
    ctx.arc(r, cy, r, Math.PI/2, -Math.PI/2);
  } else {
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  }
  const bgGrad = ctx.createLinearGradient(0, 30, 0, h);
  bgGrad.addColorStop(0, '#2a1a08');
  bgGrad.addColorStop(0.3, '#3d2409');
  bgGrad.addColorStop(0.7, '#3d2409');
  bgGrad.addColorStop(1, '#2a1a08');
  ctx.fillStyle = bgGrad;
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  if (w > h - 20 + 8) {
    const br = r - 5;
    ctx.moveTo(br, 35);
    ctx.lineTo(w - br, 35);
    ctx.arc(w - br, cy, br, -Math.PI/2, Math.PI/2);
    ctx.lineTo(br, h - 9);
    ctx.arc(br, cy, br, Math.PI/2, -Math.PI/2);
  } else {
    ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
  }
  ctx.strokeStyle = 'rgba(212,160,23,0.8)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  if (w > h - 20 + 8) {
    const br2 = r - 10;
    ctx.moveTo(br2, 40);
    ctx.lineTo(w - br2, 40);
    ctx.arc(w - br2, cy, br2, -Math.PI/2, Math.PI/2);
    ctx.lineTo(br2, h - 14);
    ctx.arc(br2, cy, br2, Math.PI/2, -Math.PI/2);
  } else {
    ctx.arc(cx, cy, r - 10, 0, Math.PI * 2);
  }
  ctx.strokeStyle = 'rgba(255,235,180,0.35)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  const lotusY = 22;
  ctx.save();
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const px = cx + Math.cos(angle) * 10;
    const py = lotusY + Math.sin(angle) * 3;
    ctx.beginPath();
    ctx.ellipse(px, py, 9, 5, angle + Math.PI / 2, 0, Math.PI * 2);
    const pg = ctx.createRadialGradient(px, py - 1, 1, px, py, 9);
    pg.addColorStop(0, '#f0d878');
    pg.addColorStop(0.6, '#d4a017');
    pg.addColorStop(1, '#a67010');
    ctx.fillStyle = pg;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,245,200,0.5)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, lotusY, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#fff2b2';
  ctx.fill();
  ctx.restore();

  ctx.font = `bold ${fontSize}px "KaiTi", "STKaiti", "楷体", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  const textGrad = ctx.createLinearGradient(cx - metrics.width/2, cy - fontSize/2, cx - metrics.width/2, cy + fontSize/2);
  textGrad.addColorStop(0, '#fff8d0');
  textGrad.addColorStop(0.5, '#f0d878');
  textGrad.addColorStop(1, '#d4a017');
  ctx.fillStyle = textGrad;
  ctx.fillText(text, cx, cy + 2);
  ctx.restore();

  ctx.strokeStyle = 'rgba(166,112,16,0.6)';
  ctx.lineWidth = 2;
  ctx.strokeText(text, cx, cy + 2);

  return new THREE.CanvasTexture(c);
}

export function createArrowTexture(text) {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  const w = 200, h = 340;
  c.width = w; c.height = h;
  const cx = w / 2;
  const tipY = 20, baseY = h - 100;
  const bodyW = 68;

  for (let i = 3; i >= 0; i--) {
    ctx.save();
    ctx.shadowColor = `rgba(212, 160, 23, ${0.12 + i * 0.08})`;
    ctx.shadowBlur = 50 + i * 20;
    ctx.beginPath();
    ctx.ellipse(cx, (tipY + baseY) / 2, bodyW * 0.8 + i * 8, (baseY - tipY) * 0.55 + i * 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212,160,23,0)';
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 10;
  const petalY = baseY + 18;
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI - Math.PI / 2;
    const px = cx + Math.cos(angle) * 28;
    const py = petalY + Math.sin(angle) * 10;
    ctx.beginPath();
    ctx.ellipse(px, py, 14, 8, angle + Math.PI / 2, 0, Math.PI * 2);
    const pg = ctx.createRadialGradient(px, py - 2, 2, px, py, 14);
    pg.addColorStop(0, '#f0d878');
    pg.addColorStop(0.6, '#d4a017');
    pg.addColorStop(1, '#a67010');
    ctx.fillStyle = pg;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,235,160,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(cx, tipY);
  ctx.quadraticCurveTo(cx + 10, tipY + 16, cx + bodyW / 2, tipY + 34);
  ctx.lineTo(cx + bodyW / 2 + 2, baseY - 10);
  ctx.quadraticCurveTo(cx + bodyW / 2 + 2, baseY + 8, cx + bodyW / 2 - 8, baseY + 14);
  ctx.lineTo(cx - bodyW / 2 + 8, baseY + 14);
  ctx.quadraticCurveTo(cx - bodyW / 2 - 2, baseY + 8, cx - bodyW / 2 - 2, baseY - 10);
  ctx.lineTo(cx - bodyW / 2, tipY + 34);
  ctx.quadraticCurveTo(cx - 10, tipY + 16, cx, tipY);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, tipY, 0, baseY + 20);
  grad.addColorStop(0, '#fff2b2');
  grad.addColorStop(0.25, '#f0d878');
  grad.addColorStop(0.55, '#d4a017');
  grad.addColorStop(0.85, '#c68e17');
  grad.addColorStop(1, '#a67010');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'rgba(255, 245, 200, 0.8)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 235, 160, 0.35)';
  ctx.lineWidth = 5;
  ctx.stroke();

  const wheelR = 22, wheelY = baseY - 48;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(cx, wheelY, wheelR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, wheelY, wheelR - 6, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 8, wheelY + Math.sin(a) * 8);
    ctx.lineTo(cx + Math.cos(a) * (wheelR - 2), wheelY + Math.sin(a) * (wheelR - 2));
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, wheelY, 6, 0, Math.PI * 2);
  const beadG = ctx.createRadialGradient(cx - 2, wheelY - 2, 1, cx, wheelY, 6);
  beadG.addColorStop(0, '#fff8d0');
  beadG.addColorStop(0.5, '#f0d878');
  beadG.addColorStop(1, '#c68e17');
  ctx.fillStyle = beadG;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  if (text) {
    ctx.save();
    ctx.font = 'bold 26px "KaiTi", "STKaiti", "楷体", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fillText(text, cx, baseY + 24);
    ctx.restore();
  }

  return new THREE.CanvasTexture(c);
}
