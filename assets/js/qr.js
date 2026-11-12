window.DU = window.DU || {};
(function () {
  function mul(x, y) { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z & 0xFF; }
  function divisor(deg) { const r = new Array(deg - 1).fill(0).concat([1]); let root = 1; for (let i = 0; i < deg; i++) { for (let j = 0; j < deg; j++) { r[j] = mul(r[j], root); if (j + 1 < deg) r[j] ^= r[j + 1]; } root = mul(root, 2); } return r; }
  function remainder(data, div) { const r = div.map(() => 0); data.forEach((b) => { const f = b ^ r.shift(); r.push(0); div.forEach((c, i) => { r[i] ^= mul(c, f); }); }); return r; }
  DU.qrMatrix = function (text) {
    const size = 33, DATA = 80, EC = 20;
    const bytes = Array.from(new TextEncoder().encode(text));
    if (bytes.length > 78) throw new Error('Link too long for this QR code (max 78 characters).');
    const bits = []; const put = (v, n) => { for (let i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1); };
    put(4, 4); put(bytes.length, 8); bytes.forEach((b) => put(b, 8)); put(0, Math.min(4, DATA * 8 - bits.length));
    while (bits.length % 8) bits.push(0);
    const cw = []; for (let i = 0; i < bits.length; i += 8) cw.push(parseInt(bits.slice(i, i + 8).join(''), 2));
    for (let p = 0; cw.length < DATA; p++) cw.push(p % 2 ? 0x11 : 0xEC);
    const all = cw.concat(remainder(cw, divisor(EC)));
    const M = Array.from({ length: size }, () => new Array(size).fill(false));
    const F = Array.from({ length: size }, () => new Array(size).fill(false));
    const S = (x, y, d) => { M[y][x] = d; F[y][x] = true; };
    for (let i = 0; i < size; i++) { S(6, i, i % 2 === 0); S(i, 6, i % 2 === 0); }
    [[3, 3], [size - 4, 3], [3, size - 4]].forEach(([cx, cy]) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy; if (x >= 0 && x < size && y >= 0 && y < size) S(x, y, ![2, 4].includes(Math.max(Math.abs(dx), Math.abs(dy)))); } });
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) S(26 + dx, 26 + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    let data = (1 << 3) | 0, r = data; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    const fb = ((data << 10) | r) ^ 0x5412; const g = (i) => ((fb >>> i) & 1) !== 0;
    for (let i = 0; i < 6; i++) S(8, i, g(i)); S(8, 7, g(6)); S(8, 8, g(7)); S(7, 8, g(8));
    for (let i = 9; i < 15; i++) S(14 - i, 8, g(i));
    for (let i = 0; i < 8; i++) S(size - 1 - i, 8, g(i));
    for (let i = 8; i < 15; i++) S(8, size - 15 + i, g(i));
    S(8, size - 8, true);
    let k = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let v = 0; v < size; v++) for (let j = 0; j < 2; j++) {
        const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - v : v;
        if (!F[y][x] && k < all.length * 8) { M[y][x] = ((all[k >>> 3] >>> (7 - (k & 7))) & 1) !== 0; k++; }
      }
    }
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!F[y][x] && (x + y) % 2 === 0) M[y][x] = !M[y][x];
    return M;
  };
  DU.qrSvg = function (text, color, bg) {
    const M = DU.qrMatrix(text); let d = '';
    M.forEach((row, y) => { let x = 0; while (x < 33) { if (row[x]) { const s = x; while (x < 33 && row[x]) x++; d += `M${s} ${y}h${x - s}v1H${s}z`; } else x++; } });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 39 39" shape-rendering="crispEdges"><rect x="-3" y="-3" width="39" height="39" fill="${bg || '#fff'}"/><path d="${d}" fill="${color || '#0A1628'}"/></svg>`;
  };
})();
