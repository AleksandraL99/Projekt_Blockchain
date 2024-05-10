import Navigation from "./Navigation";
import { useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useEffect } from "react";
import NFTTile from "./NFTTile";

// Gallery component displays a user's collection of NFTs and their total value.
export default function Gallery () {
    // State for managing data, fetch status, user address, and total value of NFTs.
    const [data, setData] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [address, setAddress] = useState("0x");
    const [totalPrice, setTotalPrice] = useState("0");

    // Function to load NFT data from the blockchain and update the component state.
    async function getNFTData() {
        const ethers = require("ethers");
        let sumPrice = 0;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        let transaction = await contract.getMyNFTs();

        // Process each NFT fetched from the blockchain, extract metadata, and compute total value.
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            sumPrice += parseFloat(price);

            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            };
            return item;
        }));

        setData(items);
        setDataFetched(true);
        setAddress(addr);
        setTotalPrice(sumPrice.toFixed(3));
    }

    useEffect(() => {
        if (!dataFetched) {
            getNFTData();
        }
    }, [dataFetched]);  // Ensure getNFTData is only called once after the initial render.

    // Render the gallery layout including navigation, and display the total value and number of NFTs.
    return (
        <div className="profileClass" style={{ minHeight: "100vh" }}>
            <Navigation />
            <div className="profileClass">
                <div className="flex flex-row ml-10 mt-10 md:text-2xl text-white text-center justify-center">
                    <div>
                        <h2 className="font-bold">Number of NFTs</h2>
                        {data.length}
                    </div>
                    <div className="ml-20">
                        <h2 className="font-bold">Total Value</h2>
                        {totalPrice} ETH
                    </div>
                </div>
                <div className="flex flex-col text-center items-center mt-11 text-white">
                    <h2 className="font-bold">My NFTs</h2>
                    <div className="flex justify-center flex-wrap max-w-screen-xl">
                        {data.map((value, index) => {
                            return <NFTTile data={value} key={index}/>;
                        })}
                    </div>
                    <div className="mt-10 text-xl">
                        {data.length === 0 ? "No NFTs to display" : ""}
                    </div>
                </div>
            </div>
        </div>
    );
}
