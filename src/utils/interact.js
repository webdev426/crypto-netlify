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
  console.log("MSCH SC => ", ADDRESSES.TOKEN_ADDRESS);
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
  console.log("MAsterChef SC => ", ADDRESSES.TRANSFER_ADDRESS);
  const contractABI = require("../abis/TokenTransfer.json");
  const contract = new ethers.Contract(
    ADDRESSES.TRANSFER_ADDRESS,
    contractABI,
    signer
  );
  return contract;
};

export const approveTokenTransfer = async (address, amount) => {
  const msch = getTokenContract();
  console.log(msch);
  console.log("Requsting MSCH Token Approve for levelup ...");
  console.log(ethers.utils.parseUnits(amount.toString(), 6));
  const msch_response = await msch.approve(
    address,
    ethers.utils.parseUnits(amount.toString(), 6),
    { gasPrice: 100000000000 }
  );
  await msch_response.wait();
  console.log("MSCH Approved");
};

export const tokenTransfer = async (tokenAddress, amount, userAddress) => {
  const msch = getContract();
  let addresss = [userAddress];
  await msch.transferToken(
    tokenAddress,
    ethers.utils.parseUnits(amount.toString(), 6),
    addresss
  );
};
