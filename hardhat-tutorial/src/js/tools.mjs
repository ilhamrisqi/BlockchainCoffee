import { ethers } from "ethers";
import CoffeeArtifact from "./src/contracts/Coffee.json";
import contractAddress from "./src/contracts/contract-address.json";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // Update with your provider
const signer = provider.getSigner(); // Adjust based on your setup

export async function constructSmartContract() {
    const Coffee = new ethers.Contract(contractAddress.Coffee, CoffeeArtifact.abi, signer);
    return Coffee;
}
