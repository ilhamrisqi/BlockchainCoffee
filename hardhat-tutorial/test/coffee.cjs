const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Candidates", function () {
    it("initializes with two candidates", async function (){
        const Coffee = await ethers.getContractFactory("Smartcoffee");
        const coffee = await Coffee.deploy();
        //await voting.deployed();
        console.log('voting deployed at:'+ coffee.target);
        const [addr1] = await ethers.getSigners();
        
        await expect(coffee.registerUser(addr1._role)).to.emit(coffee, "UserRegistered");
    });

    // it("initializes the candidates with the correct values", async function() {
    //     const Voting = await ethers.getContractFactory("voting");
    //     const voting = await Voting.deploy();
    //     //await voting.deployed();
    //     const numCandidates = await voting.candCounter();
    //     const candNames = ["Contestant 1", "Contestant 2"];

    //     for(let i=1; i<= numCandidates; i++){
    //         const candidate = await voting.candidates(i);
    //         expect(candidate.id).to.equal(i);
    //         expect(candidate.name).to.equal(candNames[i-1]);
    //         expect(candidate.voteCount).to.equal(0);
    //     }
    // });
});

// describe("Voters", function() {
//     it("allows register voter", async function() {
//         const Voting = await ethers.getContractFactory("voting");
//         const voting = await Voting.deploy();
//         //await voting.deployed();
//         const [addr1] = await ethers.getSigners();
        
//         await voting.registerVoter(addr1.address);
//         const voter = await voting.voters(addr1.address);
//         expect(voter.validated).to.equal(true);
//         expect(voter.voted).to.equal(false);
//         expect(await voting.voterCounter()).to.equal(1);
//     });
//     it("allows a voter cast a vote", async function() {
//         const Voting = await ethers.getContractFactory("voting");
//         const voting = await Voting.deploy();
//         //await voting.deployed();
//         const [addr1] = await ethers.getSigners();
//         await voting.registerVoter(addr1.address);

//         await voting.vote(1, {from: addr1.address});
//         const voter = await voting.voters(addr1.address);
//         expect(voter.voted).to.equal(true);

//         const candidate = await voting.candidates(1);
//         expect(candidate.voteCount).to.equal(1);
//     });
// });

// describe("Events and modifier", function() {
//     it("throws an exception for invalid candidates", async function() {
//         const Voting = await ethers.getContractFactory("voting");
//         const voting = await Voting.deploy();
//         //await voting.deployed();
//         const [addr1] = await ethers.getSigners();
//         await voting.registerVoter(addr1.address);

//         await expect(voting.connect(addr1).vote(99)).to.be.revertedWith("Candidate ID not valid");
//     });

//     it("throws an exception for double voting", async function() {
//         const Voting = await ethers.getContractFactory("voting");
//         const voting = await Voting.deploy();
//         //await voting.deployed();
//         const [addr1] = await ethers.getSigners();
//         await voting.registerVoter(addr1.address);

//         await voting.connect(addr1).vote(1);

//         await expect(voting.connect(addr1).vote(2)).to.be.revertedWith("Voter already voted");

//         let candidate = await voting.candidates(1);
//         expect(candidate.voteCount).to.equal(1);
//         candidate = await voting.candidates(2);
//         expect(candidate.voteCount).to.equal(0);
//     });

//     it("should emit Registration success events", async function() {
//         const Voting = await ethers.getContractFactory("voting");
//         const voting = await Voting.deploy();
//         //await voting.deployed();
//         const [addr1] = await ethers.getSigners();
        
//         await expect(voting.registerVoter(addr1.address)).to.emit(voting, "registrationSuccess").withArgs(addr1.address);
//     });

//     it("should emit Voted events", async function() {
//         const Voting = await ethers.getContractFactory("voting");
//         const voting = await Voting.deploy();
//         //await voting.deployed();
//         const [addr1] = await ethers.getSigners();
//         await voting.registerVoter(addr1.address);

//         await expect(voting.connect(addr1).vote(1)).to.emit(voting, "votedEvent").withArgs(1);
//     });
// });