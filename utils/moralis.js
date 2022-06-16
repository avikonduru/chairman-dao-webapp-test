'use strict';

const MASTER_DB_ID = -1;
const RINKEBY_CHAIN_ID = '0x4'; //rinkeby
const MUMBAI_CHAIN_ID = '80001'; //mumbai exclusive DB
const ETHEREUM_CHAIN_ID = '0x1';
const POLYGON_CHAIN_ID = '0x2';

const credentials = [
  {
    chainId: RINKEBY_CHAIN_ID, //master DB
    chainName: 'All Chains',
    currency: 'All',

    // jahans
    // moralisAppID: 'HpgolVRoKhDdBJtS1w7qQ0f2CgkEiKqxngctprAm', // using failover DB
    // moralisServerURL: 'https://r5qptsoiebbs.usemoralis.com:2053/server',
    // moralisMasterKey: 'oOMsHYu7daHsyb1m5VjVnmI13JEM1Z5OMAfIeh2R',

    moralisAppID: 'QmJ4dj0JW01SHmtNAbrV6FlXO1KjW3XSkXJbgtQp', // using failover DB
    moralisServerURL: 'https://jvvsie0bvlbh.usemoralis.com:2053/server',
    moralisMasterKey: 'JeB19gYmWz7cBpAUhL6YWw6GHeMYZFCWEOLEeXyw',
  },
];

function translateBlockchainToID(blockchainName) {
  switch (blockchainName.toLowerCase()) {
    default:
      return null;
    case 'rinkeby':
      return RINKEBY_CHAIN_ID;
    case 'mumbai':
      return MUMBAI_CHAIN_ID;
    case 'polygon':
      return POLYGON_CHAIN_ID;
    case 'ethereum':
      return ETHEREUM_CHAIN_ID;
  }
}

function getAppID() {
  return credentials[0].moralisAppID;
}

function getServerURL() {
  return credentials[0].moralisServerURL;
}

function getServerCredentials(chainId) {
  var credObj = {};

  for (const cred of credentials) {
    return cred; //return the only DB credentials for now
  }

  return credObj;
}

module.exports = {
  MASTER_DB_ID,
  RINKEBY_CHAIN_ID,
  MUMBAI_CHAIN_ID,
  POLYGON_CHAIN_ID,
  ETHEREUM_CHAIN_ID,
  translateBlockchainToID,
  getServerCredentials,
  getAppID,
  getServerURL,
};