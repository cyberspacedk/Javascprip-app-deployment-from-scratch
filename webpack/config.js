/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const webpackMerge = require('webpack-merge');
const loadBase = require('./configs/base');

const loadMode = env => require(`./configs/${env.mode}`);

module.exports = env => webpackMerge(loadBase, loadMode(env));
