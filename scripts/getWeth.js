const { ethers, getNamedAccounts, network } = require("hardhat")
// const { networkConfig } = require("../helper-hardhat-config")

const AMOUNT = ethers.parseEther("0.02")

async function getWeth() {
    const { deployer } = await getNamedAccounts()
    // const abi =
    const signer = await ethers.provider.getSigner()
    const iWeth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        signer,
    )
    const txResponse = await iWeth.deposit({
        value: AMOUNT,
    })
    await txResponse.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} WETH`)
}

module.exports = { getWeth, AMOUNT }
