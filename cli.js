#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2))
console.log(argv)
var htmlpack = require('./')(argv)

