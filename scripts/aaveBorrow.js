const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth, AMOUNT } = require("../scripts/getWeth")
require("dotenv").config

const WETH_TOKEN_ADDRESS = process.env.WETH_TOKEN_ADDRESS
const DAI_TOKEN_ADDRESS = process.env.DAI_TOKEN_ADDRESS
const CHAINLINK_PRICE_FEED = process.env.CHAINLINK_PRICE_FEED
const LENDING_POOL_ADDRESS_PROVIDER = process.env.LENDING_POOL_ADDRESS_PROVIDER

async function main() {
    await getWeth()
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.provider.getSigner()
    const lendingPool = await getLendingPool(signer)
    console.log(`Lending Pool address ${lendingPool.target}`)

    //deposit
    const wethTokenAddress = WETH_TOKEN_ADDRESS
    //approve
    await approveErc20(wethTokenAddress, lendingPool.target, AMOUNT, signer)
    console.log("Depositing...!")
    await lendingPool.deposit(wethTokenAddress, AMOUNT, signer, 0)
    console.log("Deposited!")
    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
        lendingPool,
        deployer,
    )
    //borrow
    const daiPrice = await getDaiPrice()
    const amountDaiToBorrow =
        availableBorrowsETH.toString() * 0.95 * (1 / ethers.toNumber(daiPrice))
    const daiInWei = ethers.parseEther(amountDaiToBorrow.toString())
    const daiTokenAddress = DAI_TOKEN_ADDRESS
    await borrowDai(daiTokenAddress, lendingPool, daiInWei, signer)
    await getBorrowUserData(lendingPool, signer)
    await repay(daiInWei, daiTokenAddress, lendingPool, signer)
    await getBorrowUserData(lendingPool, signer)
}

async function repay(amount, daiAddress, lendingPool, account) {
    await approveErc20(daiAddress, lendingPool.target, amount, account)
    const repayTx = await lendingPool.repay(daiAddress, amount, 2, account)
    await repayTx.wait(1)
    console.log("Repayed")
}

async function borrowDai(daiAddress, lendingPool, daiInWei, account) {
    const borrowTx = await lendingPool.borrow(
        daiAddress,
        daiInWei,
        2,
        0,
        account,
    )
    await borrowTx.wait(1)
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account)
    console.log(`You Borrowed ${totalDebtETH}`)
    return { totalDebtETH, availableBorrowsETH }
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        CHAINLINK_PRICE_FEED,
    )
    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log(price.toString())
    return price
}

async function getLendingPool() {
    signer = await ethers.provider.getSigner()
    const lendingPoolAddressProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        LENDING_POOL_ADDRESS_PROVIDER,
        signer,
    )
    const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt(
        "ILendingPool",
        lendingPoolAddress,
        signer,
    )
    return lendingPool
}

async function approveErc20(
    erc20Address,
    spenderAddress,
    amountToSpend,
    account,
) {
    const erc20 = await ethers.getContractAt("IERC20", erc20Address, account)
    const tx = await erc20.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log("Approved!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(0)
    })
