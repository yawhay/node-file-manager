import { add, cat, cd, cp, ls, mv, rm, rn, up } from './fileManager.js';
import { os } from './osInfo.js';
import { hash } from './hashCalculator.js';
import { compress, decompress } from './compression.js';

const commandHandlers = {
  up: up,
  cd: cd,
  ls: ls,
  cat: cat,
  add: add,
  rn: rn,
  cp: cp,
  mv: mv,
  rm: rm,
  os: os,
  hash: hash,
  compress: compress,
  decompress: decompress,
}

export { commandHandlers }