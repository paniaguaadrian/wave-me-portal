import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {
    const [currentAccount, setCurrentAccount] = useState('');
    const [waveStatus, setWaveStatus] = useState('');
    const [totalWaves, setTotalWaves] = useState('');

    const contractAddress = '0x9C447D3CBA17D0c000d73714b7893839B28da765';
    const contractABI = abi.abi;

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log('Make sure you have metamask');
            } else {
                console.log('We have the ethereum object', ethereum);
            }
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log('Found an aouthorized account: ', account);
            } else {
                console.log('No authorized account found');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log('Install Metamask!');
                return;
            }

            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            console.log('Connected: ', accounts);
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
                await setTotalWaves(count.toNumber());
            }
        } catch (error) {
            console.log(error);
        }
    };

    const wave = async () => {
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

                    const waveTxn = await wavePortalContract.wave();
                    console.log('Mining...', waveTxn.hash);
                    setWaveStatus('mining');

                    await waveTxn.wait();
                    console.log('Mined -- ', waveTxn.hash);
                    setWaveStatus('minted');

                    let count = await wavePortalContract.getTotalWaves();
                    await setTotalWaves(count.toNumber());

                    setInterval(() => {
                        setWaveStatus('');
                    }, 5000);
                } else {
                    console.log("Ethereum object doesn't exist!");
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            window.alert('Connect your Metamask Wallet before Wave!');
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
        getTotalWavesNumber();
    }, [totalWaves]);

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

                <button className="waveButton" onClick={wave}>
                    {waveStatus === 'mining'
                        ? 'Mining your wave...'
                        : waveStatus === 'minted'
                        ? 'Minted Wave!!'
                        : 'Wave at Me'}
                </button>

                {!currentAccount && (
                    <button className="waveButton" onClick={connectWallet}>
                        Connect your Wallet
                    </button>
                )}

                <div className="bio">Total waves to Adrian: {totalWaves}</div>
            </div>
        </div>
    );
}
