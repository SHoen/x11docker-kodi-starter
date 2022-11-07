
// Logger 
const logger = require('./logger')
const dgram = require('dgram');

// Load config from .env file
require('dotenv').config()

// Config Variables - Set PORT and KODI_START_CMD in .enf file
const PORT = process.env.PORT ?? 8081;
const START_CMD= process.env.KODI_START_CMD ?? 'x11docker --xorg --name=kodi-docker --home=/home/kodi-home --docker-kodi'

// Set udp socket to capture WOL package
const serverUDP = dgram.createSocket('udp4');

var lockOnContainerStart = false;

// error handling
serverUDP.on('error', (err) => {
  logger.error(`serverUDP error:\n${err.stack}`);
  serverUDP.close();
});

serverUDP.on('message', (msg, rinfo) => {
  logger.debug(`Got UDP Message on ${PORT} from ${rinfo.address}:${rinfo.port} and will start Kodi`);
  // Create buffer and check if it is a WOL for KODI + handle package UDP bounce 
  let buffer = Buffer.from(msg)
  if (!lockOnContainerStart && (buffer[0] == '255')) {
    lockOnContainerStart = true;
    startKodi(false);
  } else {
    logger.info('Skip request as Docker is starting')
  }

});

serverUDP.on('listening', () => {
  const address = serverUDP.address();
  logger.info(`serverUDP listening ${address.address}:${address.port}`);
});

serverUDP.bind(PORT);

function startKodi(retry){
  logger.debug('Check if Kodi process available')
  getPidOfKodi().then(
    running => {
      if (!running) {
        logger.info('Start x11docker')
        let resp = startX11docker()
        resp.then(res => {
          lockOnContainerStart = false;
          if(!retry && !res) {
            logger.debug('Startup Failed on first try - Retry now!')
            startKodi(true)
          }
        });
      } else {
        logger.debug('Skip starting x11docker as Kodi process is available');
      }
    }
  );

}

function getPidOfKodi() {
  return run('pidof kodi.bin')
}

function startX11docker() {
  return run(START_CMD);
}

function run(cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    try {
      exec(cmd, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
        if (error) {
          logger.debug(error);
        } else if (stdout) {
          logger.debug(stdout);
        } else {
          logger.debug(stderr);
        }
        resolve(stdout ? true : false);
      });
    }
    catch {
      logger.warn(`Execution of ${cmd} failed`);
      resolve(false);
    }

  });
}