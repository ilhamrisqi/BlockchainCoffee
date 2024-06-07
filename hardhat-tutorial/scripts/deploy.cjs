const path = require("path");

async function main() {
    // This is just a convenience check
    if (network.name === "hardhat") {
      console.warn(
        "You are trying to deploy a contract to the Hardhat Network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }
    
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );

    const Coffee = await ethers.getContractFactory("Smartcoffee");
    const coffee = await Coffee.deploy();

    console.log("Coffee smart contract address:", coffee.target);
  
    saveFrontendFiles(coffee);
}

function saveFrontendFiles(coffee) {
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "src", "contracts");
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      path.join(contractsDir, "contract-address.json"),
      JSON.stringify({ Coffee: coffee.target }, undefined, 2)
    );
  
    const CoffeeArtifact = artifacts.readArtifactSync("Smartcoffee");
  
    fs.writeFileSync(
      path.join(contractsDir, "Coffee.json"),
      JSON.stringify(CoffeeArtifact, null, 2)
    );
}
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
