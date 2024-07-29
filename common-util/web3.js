import Web3 from "web3";
import olasAbi from "../data/ABIs/Olas.json";
import tokenomicsAbi from "../data/ABIs/Tokenomics.json";

const providerUrl = "https://ethereum-rpc.publicnode.com";

export const olasAddress = "0x0001A500A6B18995B03f44bb040A5fFc28E45CB0";
export const tokenomicsAddress = "0xc096362fa6f4A4B1a9ea68b1043416f3381ce300";

export const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

export const getOlasContract = () => {
  const olasContract = new web3.eth.Contract(olasAbi, olasAddress);
  return olasContract;
};

export const getTokenomicsContract = () => {
  const tokenomicsContract = new web3.eth.Contract(tokenomicsAbi, tokenomicsAddress);
  return tokenomicsContract;
};
