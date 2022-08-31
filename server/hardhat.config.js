require('@nomiclabs/hardhat-waffle');

require('dotenv').config();

module.exports = {
    solidity: '0.8.4',
    networks: {
        rinkeby: {
            chainId: 4,
            url: process.env.STAGING_QUICKNODE_KEY,
            accounts: [process.env.PRIVATE_KEY],
        },
        mainnet: {
            chainId: 1,
            url: process.env.PROD_QUICKNODE_KEY,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
};