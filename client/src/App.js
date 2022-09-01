import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import abi from './utils/WavePortal.json';
import './App.css';

export default function App() {
    const [currentAccount, setCurrentAccount] = useState('');
    const [waveStatus, setWaveStatus] = useState('');
    const [totalWavesNum, setTotalWavesNum] = useState('');
    const [allWaves, setAllWaves] = useState([]);
    const [userMessage, setUserMessage] = useState('');

    const contractAddress = '0xd95986aE25E36a6F8c01Ae2316d7667569508a24';
    const contractABI = abi.abi;

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                window.alert('Make sure you have metamask');
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length !== 0) {
                getAllWaves();
            } else {
                window.alert('No authorized account found');
            }
        } catch (error) {
            window.alert(error);
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                window.alert(
                    'Please nstall Metamask in order to connect your Wallet'
                );
                return;
            }

            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);
        }
    };

    const getTotalWavesNumber = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                let count = await wavePortalContract.getTotalWaves();
                await setTotalWavesNum(count.toNumber());
            }
        } catch (error) {
            window.alert(error);
        }
    };

    const getAllWaves = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = await new ethers.providers.Web3Provider(
                    ethereum
                );
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                const waves = await wavePortalContract.getAllWaves();

                let wavesCleaned = [];
                waves.forEach((wave) => {
                    wavesCleaned.push({
                        address: wave.waver,
                        timestamp: new Date(wave.timestamp * 1000),
                        message: wave.message,
                    });
                });
                setAllWaves(wavesCleaned);
            } else {
                window.alert("Ethereum object doesn't exist");
            }
        } catch (error) {
            window.alert(error);
        }
    };

    const wave = async () => {
        if (!userMessage) {
            window.alert("You should write me something cool isn't it? :D");
            return;
        }
        if (currentAccount !== '') {
            try {
                const { ethereum } = window;

                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(
                        ethereum
                    );
                    const signer = provider.getSigner();
                    const wavePortalContract = new ethers.Contract(
                        contractAddress,
                        contractABI,
                        signer
                    );

                    const waveTxn = await wavePortalContract.wave(userMessage);
                    setWaveStatus('mining');

                    await waveTxn.wait();
                    setWaveStatus('minted');

                    let count = await wavePortalContract.getTotalWaves();
                    await setTotalWavesNum(count.toNumber());

                    setInterval(() => {
                        setWaveStatus('');
                    }, 5000);
                } else {
                    window.alert("Ethereum object doesn't exist!");
                }
            } catch (error) {
                window.alert(error);
            }
        } else {
            window.alert('Connect your Metamask Wallet before Wave!');
        }
    };

    const onChange = (event) => {
        setUserMessage(event.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setUserMessage('');
    };

    useEffect(() => {
        checkIfWalletIsConnected();
        getTotalWavesNumber();
        // eslint-disable-next-line
    }, [totalWavesNum]);

    return (
        <div className="mainContainer">
            <div className="dataContainer">
                <div className="header">
                    <span role="img" aria-label="icon">
                        👋
                    </span>{' '}
                    Hey there!
                </div>

                <div className="bio">
                    I am Adrian BreadandWater, I'm a Software Engineer on web2
                    space trying to jump to web3 space. Connect your wallet and
                    wave at me!
                </div>
                <div className="bio">
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            value={userMessage}
                            onChange={onChange}
                        />
                        <button
                            className="waveButton"
                            onClick={wave}
                            type="submit"
                        >
                            {waveStatus === 'mining'
                                ? 'Mining your wave...'
                                : waveStatus === 'minted'
                                ? 'Minted Wave!!'
                                : 'Wave at Me'}
                        </button>
                    </form>
                </div>

                {!currentAccount && (
                    <button className="waveButton" onClick={connectWallet}>
                        Connect your Wallet
                    </button>
                )}

                <div className="bio">
                    Total waves to Adrian: {totalWavesNum}
                </div>

                {allWaves.map((wave, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                backgroundColor: 'OldLace',
                                marginTop: '16px',
                                padding: '8px',
                            }}
                        >
                            <div>Address: {wave.address}</div>
                            <div>
                                Time: {wave.timestamp.toString().slice(0, 29)}
                            </div>
                            <div>Message: {wave.message}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
