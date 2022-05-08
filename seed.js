const seedrandom = require("seedrandom");
const seed = Date.now()
seedrandom(seed, { global: true });
function getSeed(){
    return seed
}
module.exports = {seed}