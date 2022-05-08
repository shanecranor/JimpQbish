var Jimp = require('jimp');
var _ = require('lodash')
// open a file called "profile.jpg"
let opsOneArg = [Math.sin, Math.tan, Math.floor, Math.ceil] 
let opsTwoArg = [add, sub, div, mult, mod]
let outFile = 'out'+Date.now()+'.png'

let c = newCanvas(500,500)
c = bist(c,20).write(outFile)
function newCanvas(x,y){
    let out = new Jimp(
        x,
        y, 
        0xFFFFFF00, 
        (err, image) => { if (err) throw err })
    return out
}
function bist(img, zoom){
    let stuff = randOp()
    let stuff1 = randOp()
    let stuff2 = randOp()
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
        x = (x/img.bitmap.width)*zoom
        y = (y/img.bitmap.height)*zoom
        // x, y is the position of this pixel on the image
        // idx is the position start position of this rgba tuple in the bitmap Buffer
        // this is the image
        let red = idx + 0
        let green = idx + 1
        let blue = idx + 2
        let alpha = idx + 3
        this.bitmap.data[red] = stuff[0](stuff[1](x,y))*255
        this.bitmap.data[green] = stuff1[0](stuff1[1](x,y))*255
        this.bitmap.data[blue] = stuff2[0](stuff2[1](x,y))*255
        this.bitmap.data[alpha] = 255;
        // rgba values run from 0 - 255
    });
    return img
}

function add(a,b){ return a+b }
function sub(a,b){ return a-b }
function mult(a,b){return a*b }
function div(a,b){ return a/b }
function mod(a,b){ return a%b }
//console.log(randOp())
function randOp(){
    let f = _.sample(opsOneArg)
    let f2 = _.sample(opsTwoArg)
    return [f,f2]
}