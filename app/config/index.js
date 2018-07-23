/*
 * Server configuration
 */

const config = {};
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'staging';

config.production = {
  mode: 'PRODUCTION',
  host: 'http://localhost',
  port: 3000
}

config.staging = {
  mode: 'STAGING',
  host: 'http://localhost',
  port: 4000
}

switch (NODE_ENV) {
  case 'production': module.exports = config.production; break;
  case 'staging': module.exports = config.staging; break;
  default: module.exports = config.staging;
}
