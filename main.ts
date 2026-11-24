// Tiny stack VM for make.fun tiny-stack-vm-01 (matches the reference VM exactly).
import * as F from 'node:fs';
function run(p, x) {
  const D = new Int32Array(256), C = new Int32Array(64), M = new Int32Array(256), o = new Uint8Array(65536);
  const T = e => ({ o, l, e });
  let s = 0, c = 0, l = 0, i = 0, q = 0, t = 0, a, v, r;
  const n = p.length;
  for (;;) {
    if(t===1e6)return T(10);
    if(q<0||q>=n)return T(9);
    const k=p[q],m=k===1?1:k===2?4:k>47&&k<52?2:0;
    if(q+m>=n)return T(9);
    t++; q += 1 + m;
    const g = ((p[q - 2] | (p[q - 1] << 8)) << 16) >> 16;
    switch (k) {
      case 0: return T(0);
      case 1: D[s++] = (p[q - 1] << 24) >> 24; break;
      case 2: D[s++] = p[q - 4] | (p[q - 3] << 8) | (p[q - 2] << 16) | (p[q - 1] << 24); break;
      case 3: if(s<1)return T(2); s--; break;
      case 4: if(s<1)return T(2); D[s] = D[s - 1]; s++; break;
      case 5: if(s<2)return T(2); v = D[s - 1]; D[s - 1] = D[s - 2]; D[s - 2] = v; break;
      case 6: if(s<2)return T(2); D[s] = D[s - 2]; s++; break;
      case 7: if(s<3)return T(2); a = D[s - 3]; D[s - 3] = D[s - 2]; D[s - 2] = D[s - 1]; D[s - 1] = a; break;
      case 23: if(s<1)return T(2); D[s - 1] = -D[s - 1] | 0; break;
      case 27: if(s<1)return T(2); D[s - 1] = ~D[s - 1]; break;
      case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 24: case 25: case 26: case 28: case 29: case 30: case 32: case 33: case 34:
        if(s<2)return T(2);
        v = D[s - 1]; a = D[s - 2]; s -= 2;
        if (k === 16) r = (a + v) | 0;
        else if (k === 17) r = (a - v) | 0;
        else if (k === 18) r = Math.imul(a, v);
        else if (k === 19) { if(!v)return T(4); r = a === -2147483648 && v === -1 ? a : (a / v) | 0; }
        else if (k === 20) { if(!v)return T(4); r = v === -1 ? 0 : (a % v) | 0; }
        else if (k === 21) { if(!v)return T(4); r = Math.floor((a >>> 0) / (v >>> 0)) | 0; }
        else if (k === 22) { if(!v)return T(4); r = ((a >>> 0) % (v >>> 0)) | 0; }
        else if (k === 24) r = a & v;
        else if (k === 25) r = a | v;
        else if (k === 26) r = a ^ v;
        else if (k === 28) r = a << (v & 31);
        else if (k === 29) r = a >> (v & 31);
        else if (k === 30) r = (a >>> (v & 31)) | 0;
        else if (k === 32) r = a === v ? 1 : 0;
        else if (k === 33) r = a < v ? 1 : 0;
        else r = (a >>> 0) < (v >>> 0) ? 1 : 0;
        D[s++] = r; break;
      case 48: q = q + g; break;
      case 49: if(s<1)return T(2); if(D[--s]===0)q=q+g; break;
      case 50: if(s<1)return T(2); if(D[--s]!==0)q=q+g; break;
      case 51: if(c===64)return T(7); C[c++] = q; q = p[q - 2] | (p[q - 1] << 8); break;
      case 52: if(!c)return T(8); q = C[--c]; break;
      case 64: if(s<1)return T(2); a = D[s - 1]; if(a<0||a>255)return T(6); D[s - 1] = M[a]; break;
      case 65: if(s<2)return T(2); a = D[s - 1]; v = D[s - 2]; if(a<0||a>255)return T(6); s -= 2; M[a] = v; break;
      case 80: if(s<1)return T(2); { const u = String(D[s - 1]); if(l+u.length>65536)return T(11); s--; for (let j = 0; j < u.length; j++) o[l++] = u.charCodeAt(j); } break;
      case 81: if(s<1)return T(2); if(l>65535)return T(11); o[l++] = D[--s] & 255; break;
      case 82: D[s++] = i < x.length ? x[i++] : -1; break;
      case 83: if(s<1)return T(2); return T(D[--s] & 255);
      default: return T(5);
    }
    if (s > 256) return T(3);
  }
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for (const id of F.readdirSync(I).sort()) {
  const r = run(F.readFileSync(I + '/' + id + '/program.bin'), F.readFileSync(I + '/' + id + '/input.bin'));
  F.mkdirSync(O + '/' + id, { recursive: true });
  F.writeFileSync(O + '/' + id + '/stdout.bin', r.o.subarray(0, r.l));
  F.writeFileSync(O + '/' + id + '/exit.txt', r.e + '\n');
}
