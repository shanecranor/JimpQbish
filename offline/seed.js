const seedrandom = require("seedrandom");
const seed = Date.now()//
//const seed = 1652045137345
seedrandom(seed, { global: true });
function getSeed(){
    return seed
}
module.exports = {seed}