module.exports = {
  apps : [{
    name       : "texCompiler",
    script     : "./src/index.js",
    instances  : 1,
    exec_mode  : "fork"
  },
  {
    name        : "worker",
    script      : "./src/worker.js",
    instances   : 4,
    exec_mode   : "cluster"
  },]
}