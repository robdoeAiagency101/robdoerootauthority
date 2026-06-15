const { ethers } = require("ethers");

// === FILL THESE IN ===
const RPC_URL = "https://rpc.ankr.com/eth";   // public RPC
const PRIVATE_KEY = "";                       // optional

// Provider (ethers v5 syntax)
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Optional wallet
let wallet = null;
if (PRIVATE_KEY !== "") {
  wallet = new ethers.Wallet(PRIVATE_KEY, provider);
}

async function run() {
  const block = await provider.getBlockNumber();
  console.log("Latest block:", block);

  if (wallet) {
    const balance = await provider.getBalance(wallet.address);
    console.log("Wallet:", wallet.address);
    console.log("Balance:", ethers.utils.formatEther(balance));
  }
}

run();
