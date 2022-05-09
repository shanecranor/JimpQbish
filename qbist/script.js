// handlers for before and after image elements
const grid = document.querySelector(".grid");
const colorSystem = document.querySelector(".colorSystem");
// open a file called "profile.jpg"
let opsOneArg = [Math.sin, Math.tan, Math.floor, Math.ceil, Math.abs, sqrt];
let opsTwoArg = [add, sub, div, mult, mod, pow];
//let outFile = 'out'+s.seed+'.png'
function newCanvas(x, y) {
  let out = new Jimp(x, y, 0xffffff00, (err, image) => {
    if (err) throw err;
  });
  return out;
}
function bistYUV(img, zoom, rops) {
  let stuff0 = function (x, y) {
    return rops[5](rops[0](x, y), rops[1](x, y));
  };
  let stuff1 = function (x, y) {
    return rops[6](rops[2](x, y), rops[3](x, y));
  };
  let stuff2 = function (x, y) {
    return rops[7](rops[1](x, y), rops[2](x, y));
  };
  let stuff3 = function (x, y) {
    return rops[8](rops[3](x, y), rops[4](x, y));
  };
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    x = (x / img.bitmap.width) * zoom;
    y = (y / img.bitmap.height) * zoom;
    // x, y is the position of this pixel on the image
    // idx is the position start position of this rgba tuple in the bitmap Buffer
    // this is the image
    let out = yuv2rgb(stuff1(x, y), stuff0(x, y), stuff2(x, y));
    let red = idx + 0;
    let green = idx + 1;
    let blue = idx + 2;
    let alpha = idx + 3;
    this.bitmap.data[red] = out.r * 255;
    this.bitmap.data[green] = out.g * 255;
    this.bitmap.data[blue] = out.b * 255;
    this.bitmap.data[alpha] = (stuff3(x, y) * 255) % 255;
    // rgba values run from 0 - 255
  });
  return img;
}
function bistCYMK(img, zoom, rops) {
  let stuff0 = function (x, y) {
    return rops[5](rops[0](x, y), rops[1](x, y));
  };
  let stuff1 = function (x, y) {
    return rops[6](rops[2](x, y), rops[3](x, y));
  };
  let stuff2 = function (x, y) {
    return rops[7](rops[1](x, y), rops[2](x, y));
  };
  let stuff3 = function (x, y) {
    return rops[8](rops[3](x, y), rops[4](x, y));
  };
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    x = (x / img.bitmap.width) * zoom;
    y = (y / img.bitmap.height) * zoom;
    // x, y is the position of this pixel on the image
    // idx is the position start position of this rgba tuple in the bitmap Buffer
    // this is the image
    let out = cmyk2rgb(stuff0(x, y), stuff1(x, y), stuff2(x, y), stuff3(x, y));
    let red = idx + 0;
    let green = idx + 1;
    let blue = idx + 2;
    let alpha = idx + 3;
    this.bitmap.data[red] = out.r * 255;
    this.bitmap.data[green] = out.g * 255;
    this.bitmap.data[blue] = out.b * 255;
    this.bitmap.data[alpha] = 255;
    // rgba values run from 0 - 255
  });
  return img;
}

function bistRGB(img, zoom, rops) {
  let stuff0 = function (x, y) {
    return rops[5](rops[0](x, y), rops[1](x, y));
  };
  let stuff1 = function (x, y) {
    return rops[6](rops[1](x, y), rops[2](x, y));
  };
  let stuff2 = function (x, y) {
    return rops[7](rops[2](x, y), rops[3](x, y));
  };
  let stuff3 = function (x, y) {
    return rops[8](rops[3](x, y), rops[4](x, y));
  };
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    x = (x / img.bitmap.width) * zoom;
    y = (y / img.bitmap.height) * zoom;
    // x, y is the position of this pixel on the image
    // idx is the position start position of this rgba tuple in the bitmap Buffer
    // this is the image
    let red = idx + 0;
    let green = idx + 1;
    let blue = idx + 2;
    let alpha = idx + 3;
    this.bitmap.data[red] = stuff0(x, y) * 255;
    this.bitmap.data[green] = stuff1(x, y) * 255;
    this.bitmap.data[blue] = stuff2(x, y) * 255;
    this.bitmap.data[alpha] = (stuff3(x, y) * 255) % 255;
    // rgba values run from 0 - 255
  });
  return img;
}

//https://www.standardabweichung.de/code/javascript/cmyk-rgb-conversion-javascript
function cmyk2rgb(c, m, y, k) {
  c = c % 1.0;
  m = m % 1.0;
  y = Math.abs(y) % 1.0;
  k = Math.abs(k) % 1.0;

  c = c * (1 - k) + k;
  m = m * (1 - k) + k;
  y = y * (1 - k) + k;

  var r = 1 - c;
  var g = 1 - m;
  var b = 1 - y;

  return {
    r: r,
    g: g,
    b: b
  };
}
function YUVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  h = ((Math.abs(h) % 1.0) + (s % 1.0)) / 2;
  s = (v + s + h) / 3;
  v = (v + s + h) / 3; //Math.abs(v)%5.0
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: r,
    g: g,
    b: b
  };
}
function yuv2rgb(y, u, v) {
  y = y % 1.0;
  u = u % 2.0;
  v = v % 2.0;
  r = y + 1.4075 * (v - 0.5);
  g = y - 0.3455 * (u - 0.5) - 0.7169 * (v - 0.5);
  b = y + 1.779 * (u - 0.5);
  return { r: r, g: g, b: b };
}
function sqrt(a) {
  return Math.sqrt(Math.abs(a));
}
function add(a, b) {
  return a + b;
}
function sub(a, b) {
  return a - b;
}
function mult(a, b) {
  return a * b;
}
function div(a, b) {
  return a / b;
}
function mod(a, b) {
  return a % b;
}
function pow(a, b) {
  return Math.pow(Math.abs(a), b);
}
//console.log(randOp())
function randOp() {
  let f = sample(opsOneArg);
  let f2 = sample(opsTwoArg);
  let amp = randrange(-5, 5);
  let amp2 = randrange(-5, 5);
  let phase = randrange(-1000, 1000);
  let startX = randrange(-100, 100);
  let startY = randrange(-100, 100);
  let yAmp = randrange(-2, 2);
  let xAmp = randrange(-2, 2);
  return function (x, y) {
    return amp2 * f(amp * f2(xAmp * x + startX, yAmp * y + startY) + phase);
  };
}

// c = bistYUV(c,10,rops).write("YUV"+outFile)
// c = bistCYMK(c,10,rops).write("cymk"+outFile)

function randrange(a, b) {
  return Math.random() * (b - a) + a;
}

function sample(arr) {
  return arr[Math.floor(randrange(0, arr.length))];
}
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
let t = 0
let seed = 10
async function generateImages() {
  //t++
  
  for (let i = 0; i < grid.children.length; i++) {
    Math.seedrandom(seed+i);
    let rops = [
      randOp(),
      randOp(),
      randOp(),
      randOp(),
      randOp(),
      randOp(),
      randOp(),
      randOp(),
      randOp()
    ];
    console.log(randOp())
    document.querySelector("#equations").innerHTML = String(rops).replaceAll("},", "},<br>")
    let frame = grid.children[i];
    let c = newCanvas(300, 400);
    console.log (colorSystem.value)
    switch(colorSystem.value){
      case "RGB":
        c = bistRGB(c, 20, rops)
        break
      case "YUV":
        c = bistYUV(c, 20, rops)
        break
      case "CYMK":
        c = bistCYMK(c, 20, rops)
        break
    }
    c.getBase64("image/png", (err, res) => {
      frame.src = res;
    });
    await sleep(0);
  }
}

generateImages()