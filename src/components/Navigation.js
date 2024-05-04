import {Link} from "react-router-dom";
import {useEffect, useState} from 'react';
import {useLocation} from 'react-router';

function Navigation() {

    const [connected, toggleConnect] = useState(false);
    const location = useLocation();
    const [currAddress, updateAddress] = useState('0x');

    async function getAddress() {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        updateAddress(addr);
    }

    function updateButton() {
        const ethereumButton = document.querySelector('.enableEthereumButton');
        ethereumButton.textContent = "Connected";
        ethereumButton.classList.remove("hover:bg-blue-70");
        ethereumButton.classList.remove("bg-blue-500");
        ethereumButton.classList.add("hover:bg-green-70");
        ethereumButton.classList.add("bg-green-500");
    }

    async function connectWebsite() {

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if(chainId !== '0xAA36A7')
        {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xAA36A7' }],
            })
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(() => {
                updateButton();
                getAddress();
                window.location.replace(location.pathname)
            });
    }

    useEffect(() => {
        if(window.ethereum === undefined)
            return;
        let val = window.ethereum.isConnected();
        if(val)
        {
            getAddress();
            toggleConnect(val);
            updateButton();
        }

        window.ethereum.on('accountsChanged', function(){
            window.location.replace(location.pathname)
        })
    });

    return (
        <div className="">
            <nav className="w-screen">
                <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
                    <li/>
                    <li className='w-2/6'>
                        <ul className='justify-between font-bold ml-10 text-lg items-center' style={{'display': 'flex'}}>
                            <li className={(location.pathname === "/gallery" ? 'border-b-2 hover:pb-0 p-2' : 'hover:border-b-2 hover:pb-0 p-2')}>
                                <Link to="/gallery">My Gallery</Link>
                            </li>
                            <li className={(location.pathname === "/addNFT" ? 'border-b-2 hover:pb-0 p-2' : 'hover:border-b-2 hover:pb-0 p-2')}>
                                <Link to="/addNFT">Add NFT</Link>
                            </li>
                            <li>
                                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                                        style={{cursor: connected ? "default": "pointer", backgroundColor: connected ? "green" : "bg-blue-500"} }
                                        onClick={connectWebsite}>{connected ? "Connected":"Connect Wallet"}</button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
            <div className='text-white text-bold mr-10 text-sm text-right '>
                {currAddress !== "0x" ? "Connected to":"Not Connected"} {currAddress !== "0x" ? (currAddress):""}
            </div>
        </div>
    );
}

export default Navigation;