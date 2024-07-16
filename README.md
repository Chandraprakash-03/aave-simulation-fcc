# Aave Borrow and Repay Simulation

This project demonstrates how to programmatically borrow and repay assets using the Aave protocol with JavaScript and Solidity. The code simulates the borrowing functionality and the subsequent repayment of the borrowed amount.

## Introduction

Aave is an open-source and non-custodial liquidity protocol for earning interest on deposits and borrowing assets. This project provides a simple example of how to interact with the Aave protocol programmatically using JavaScript for the front-end interaction and Solidity for smart contract interactions.

## Prerequisites

To run this project, you need to have the following installed on your machine

-   Node.js
-   npm
-   Hardhat

Additionally you will need an **Ethereum wallet** like Metamask and some test Ether

## Installation

1. ### Clone the repository

`git clone https://github.com/Chandraprakash-03/aave-simulation-fcc.git`
`cd aave aave-simulation-fcc`

2. ### Install dependencies

`npm install`

## Usage

1. ### Configure the environment

Create a `.env` file in the root directory of the project and add your environment variables. You'll need to set up your Alchemy Mainnet RPC URL, Weth Token Address, Dai Token Address, Aave Lending Pool Address Provider Contract Address, Chainlink Price Feed Address and other necessary configurations.

```MAINNET_RPC_URL = your_mainnet_rpc_url
WETH_TOKEN_ADDRESS = your_weth_address
DAI_TOKEN_ADDRESS = your_dai_address
LENDING_POOL_ADDRESS_PROVIDER = your_lending_pool_address_provider_address
CHAINLINK_PRICE_FEED = your_chainlink_pricefeed_address
```

2. ### Compile the smart Contracts

`hh compile`

3. ### Run the simulation scripts

You can run your borrowing and repaying scripts using Hardhat. Make sure to configure the scripts according to your needs

`hh run scripts/aaveBorrow.js`

## Contributing

Contributions are Welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
