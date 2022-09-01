const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory(
        'WavePortal'
    );
    const waveContract = await waveContractFactory.deploy({
        // New added line to deploy the contract and fund it. This will remove ETH from our wallet and use it to fund the contract.
        value: hre.ethers.utils.parseEther('0.1'),
    });
    await waveContract.deployed();

    console.log('Contract deployed to: ', waveContract.address);

    // Get contract balance
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        'Contract Balance: ',
        hre.ethers.utils.formatEther(contractBalance)
    );

    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());

    let waveTxn = await waveContract.wave('A message!');
    await waveTxn.wait();

    const [_, randomPerson] = await hre.ethers.getSigners();
    waveTxn = await waveContract.connect(randomPerson).wave('Another message!');
    await waveTxn.wait();

    // Get contract Balance to see what happened
    contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        'Contract Balance 2: ',
        hre.ethers.utils.formatEther(contractBalance)
    );

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0); // Exit from node process without error
    } catch (error) {
        console.log(error);
        process.exit(1); // Exit form node process with error
    }
};

runMain();
