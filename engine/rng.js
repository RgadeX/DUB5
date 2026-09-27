// Seeded PRNG using mulberry32 algorithm
export class GameRNG {
  constructor(seed = Date.now()) {
    this.seed = seed;
    this.state = seed;
  }

  // Set seed
  setSeed(seed) {
    this.seed = seed;
    this.state = seed;
  }

  // Get current seed
  getSeed() {
    return this.seed;
  }

  // Reset to initial seed
  reset() {
    this.state = this.seed;
  }

  // Mulberry32 algorithm
  next() {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  // Random integer in range [min, max] (inclusive)
  int(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Random float in range [min, max] (inclusive)
  float(min, max) {
    return this.next() * (max - min) + min;
  }

  // Random boolean
  bool() {
    return this.next() < 0.5;
  }

  // Pick random element from array
  pick(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[this.int(0, arr.length - 1)];
  }

  // Shuffle array (returns new array)
  shuffle(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Pick N random elements from array (without replacement)
  pickN(arr, n) {
    if (!arr || arr.length === 0) return [];
    if (n >= arr.length) return this.shuffle(arr);
    
    const result = [];
    const available = [...arr];
    
    for (let i = 0; i < n; i++) {
      const index = this.int(0, available.length - 1);
      result.push(available.splice(index, 1)[0]);
    }
    
    return result;
  }

  // Weighted random pick
  weighted(items, weightFn) {
    if (!items || items.length === 0) return null;
    
    const totalWeight = items.reduce((sum, item) => sum + weightFn(item), 0);
    let random = this.next() * totalWeight;
    
    for (const item of items) {
      random -= weightFn(item);
      if (random <= 0) return item;
    }
    
    return items[items.length - 1];
  }

  // Normal distribution (Box-Muller transform)
  normal(mean = 0, stdDev = 1) {
    let u = 0, v = 0;
    while (u === 0) u = this.next();
    while (v === 0) v = this.next();
    
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * stdDev + mean;
  }

  // Chance check (returns true with given probability)
  chance(probability) {
    return this.next() < probability;
  }
}
