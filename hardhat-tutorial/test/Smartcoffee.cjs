const { expect } = require("chai");
const { ethers } = require("hardhat");

// cant run

describe("SmartCoffee", function () {
    it("initializes with two coffee batches", async function (){
        const Coffee = await ethers.getContractFactory("SmartCoffee");
        const coffee = await Coffee.deploy();
        await coffee.deployed();
        console.log('SmartCoffee deployed at:'+ coffee.address);
        expect(await coffee.batchCounter()).to.equal(2);
    });

    it("initializes the coffee batches with the correct values", async function() {
        const Coffee = await ethers.getContractFactory("SmartCoffee");
        const coffee = await Coffee.deploy();
        await coffee.deployed();
        const numBatches = await coffee.batchCounter();
        const batchNames = ["Batch 1", "Batch 2"];

        for(let i=1; i<= numBatches; i++){
            const batch = await coffee.batches(i);
            expect(batch.id).to.equal(i);
            expect(batch.name).to.equal(batchNames[i-1]);
            expect(batch.status).to.equal("Pending");
        }
    });
});

describe("Participants", function() {
    it("allows register participant", async function() {
        const Coffee = await ethers.getContractFactory("SmartCoffee");
        const coffee = await Coffee.deploy();
        await coffee.deployed();
        const [addr1] = await ethers.getSigners();
        
        await coffee.registerParticipant(addr1.address);
        const participant = await coffee.participants(addr1.address);
        expect(participant.validated).to.equal(true);
        expect(participant.registered).to.equal(true);
        expect(await coffee.participantCounter()).to.equal(1);
    });
    it("allows a participant to update batch status", async function() {
        const Coffee = await ethers.getContractFactory("SmartCoffee");
        const coffee = await Coffee.deploy();
        await coffee.deployed();
        const [addr1] = await ethers.getSigners();
        await coffee.registerParticipant(addr1.address);

        await coffee.updateBatchStatus(1, "Processed", {from: addr1.address});
        const participant = await coffee.participants(addr1.address);
        expect(participant.registered).to.equal(true);

        const batch = await coffee.batches(1);
        expect(batch.status).to.equal("Processed");
    });
});

describe("Events and modifier", function() {
    it("throws an exception for invalid batches", async function() {
        const Coffee = await ethers.getContractFactory("SmartCoffee");
        const coffee = await Coffee.deploy();
        await coffee.deployed();
        const [addr1] = await ethers.getSigners();
        await coffee.registerParticipant(addr1.address);

        await expect(coffee.connect(addr1).updateBatchStatus(99, "Processed")).to.be.revertedWith("Batch ID not valid");
    });

    it("throws an exception for double processing", async function() {
        const Coffee = await ethers.getContractFactory("SmartCoffee");
        const coffee = await Coffee.deploy();
        await coffee.deployed();
        const [addr1] = await ethers.getSigners();
        await coffee.registerParticipant(addr1.address);

        await coffee.connect(addr1).updateBatchStatus(1, "Processed");

        await expect(coffee.connect(addr1).updateBatchStatus(1, "Shipped")).to.be.revertedWith("Batch already processed");

        let batch = await coffee.batches(1);
        expect(batch.status).to.equal("Processed");
    });

    it("should emit Registration success events", async function() {
        const Coffee = await ethers.getContractFactory("SmartCoffee");
        const coffee = await Coffee.deploy();
        await coffee.deployed();
        const [addr1] = await ethers.getSigners();
        
        await expect(coffee.registerParticipant(addr1.address)).to.emit(coffee, "RegistrationSuccess").withArgs(addr1.address);
    });

    it("should emit BatchStatusUpdated events", async function() {
        const Coffee = await ethers.getContractFactory("SmartCoffee");
        const coffee = await Coffee.deploy();
        await coffee.deployed();
        const [addr1] = await ethers.getSigners();
        await coffee.registerParticipant(addr1.address);

        await expect(coffee.connect(addr1).updateBatchStatus(1, "Processed")).to.emit(coffee, "BatchStatusUpdated").withArgs(1, "Processed");
    });
});
