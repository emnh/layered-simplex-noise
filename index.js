require('simplex-noise');

// Import stylesheets
import './style.css';

import SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise('seed');

// const value2d = simplex.noise2D(x, y);

const canvas = document.createElement('canvas');

document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

const w = 800;
const h = 800;
const ws = 0.005;
const hs = 0.005;
const ds = 0.5;
//const ds = 1.0;

canvas.width = w;
canvas.height = h;

const imageData = ctx.createImageData(w, h);

const f = (x) => Math.min(255.0, Math.floor(x * 255.0));

const noise3 = (x, y, z) =>
  (simplex.noise3D(x * ws, y * hs, z * ds) + 1.0) * 0.5;

const f2 = (x, y) => Math.max(x, y);

const colors = [];

const maxi = 50;
for (let i = 0; i < maxi; i++) {
  //colors[i] = [Math.random(), Math.random(), Math.random()];
  const c = i / maxi;
  colors[i] = [Math.sqrt(c), c * c, c * c];
}
//colors.sort();


for (let x = 0; x < w; x++) {
  for (let y = 0; y < h; y++) {
    const idx = y * (w * 4) + x * 4;

    let r = 0.0;
    let g = 0.0;
    let b = 0.0;
    let nm = 0.0;
    let ni = 0;
    let nmap = [];
    for (let color = 0; color < colors.length; color++) {
      const n = noise3(x, y, color * 0.1);
      nmap.push([n, color]);
    }
    nmap.sort((x, y) => x[0] - y[0]);
    for (let color = 0; color < colors.length; color++) {
      // if (n >= nm) {
      //   nm = n;
      //   ni = color;
      // }
      const ni = nmap[color][1];
      // const ni2 = color > 0 ? nmap[color - 1][1] : 0;
      const n2 = color > 0 ? nmap[color - 1][0] : 0.0;
      const n = nmap[color][0] - n2;
      r += colors[ni][0] * n;
      g += colors[ni][1] * n;
      b += colors[ni][2] * n;
    }
    const n = noise3(x, y, ni);
    //r = colors[ni][0] * n;
    //g = colors[ni][1] * n;
    //b = colors[ni][2] * n;

    imageData.data[idx + 0] = f(r);
    imageData.data[idx + 1] = f(g);
    imageData.data[idx + 2] = f(b);
    imageData.data[idx + 3] = f(1);
  }
}

ctx.putImageData(imageData, 0, 0);
