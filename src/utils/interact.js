import ADDRESSES from "../constants/ADDRESSES.json";
import { ethers } from "ethers";

export const connectWallet = async () => {
  const chainId = ADDRESSES.CHAINID;

  if (window.ethereum) {
    try {
      const currentChain = await window.ethereum.request({
        method: "eth_chainId",
      });
      const addressArr = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (currentChain === chainId) {
        return { event: "connected", response: addressArr[0] };
      } else {
        console.log(currentChain, chainId);
        console.log("plz switch your network!");
        return { event: "Wrong Chain", response: currentChain };
      }
    } catch (err) {
      console.log(err.message);
    }
  } else {
    console.log("plz install metamask on your browser");
    return { event: "No Wallet" };
  }
};

export const getTokenContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractABI = require("../abis/Token.json");
  const contract = new ethers.Contract(
    ADDRESSES.TOKEN_ADDRESS,
    contractABI,
    signer
  );
  return contract;
};

export const getContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractABI = require("../abis/TokenTransfer.json");
  const contract = new ethers.Contract(
    ADDRESSES.TRANSFER_ADDRESS,
    contractABI,
    signer
  );
  return contract;
};

export const approveToken = async (receiver, amount) => {
  const usdt = getTokenContract();
  const contract = getContract();
  try {
    const usdt_response = await usdt.approve(
      ADDRESSES.TRANSFER_ADDRESS,
      ethers.utils.parseUnits(amount.toString(), 6),
      { gasPrice: 100000000000 }
    );
    await usdt_response.wait();

    try {
      const response = await contract.deposit(
        ADDRESSES.TOKEN_ADDRESS,
        receiver,
        ethers.utils.parseUnits(amount.toString(), 6)
      );

      await response.wait();
      alert("Successfully Approved!");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

export const transferToken = async (amount) => {
  const contract = getContract();
  try {
    const response = await contract.recieveToken(
      ADDRESSES.TOKEN_ADDRESS,
      ethers.utils.parseUnits(amount.toString(), 6)
    );
    await response.wait()
    alert("Successfully received!");
  } catch (error) {
    console.log(error);
  }
};
