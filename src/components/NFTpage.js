import Navigation from "./Navigation";
import { useParams } from 'react-router-dom';
import MarketplaceJSON from "../Gallery.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

// This component displays detailed information about a specific NFT.
export default function NFTPage (props) {

    const [data, updateData] = useState({}); // State to store NFT data.
    const [dataFetched, updateDataFetched] = useState(false); // State to track if data has been fetched.
    const [currentAddress, setCurrentAddress] = useState("0x"); // State to store the current user's wallet address.

    // Function to fetch NFT data based on the token ID from the blockchain.
    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        //After adding Hardhat network to metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        //Create an NFT Token
        var tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getListedTokenForId(tokenId);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let item = {
            price: meta.price,
            tokenId: tokenId,
            owner: listedToken.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        updateData(item);
        updateDataFetched(true);
        setCurrentAddress(addr);
    }

    const params = useParams(); // Retrieve params from the URL.
    const tokenId = params.tokenId; // Extract tokenId from URL params.
    if (!dataFetched)
        getNFTData(tokenId); // Fetch NFT data if not already fetched.
    if (typeof data.image === "string")
        data.image = GetIpfsUrlFromPinata(data.image); // Update image URL if necessary.

    // Render the NFT page layout including the navigation bar and detailed information.
    return (
        <div style={{ "minHeight": "50vh", "maxHeight": "60vh" }}>
            <Navigation />
            <div className="flex ml-20 mt-20">
                <img src={data.image} alt="" className="w-2/5" />
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5" style={{ "maxheight": "35vh" }}>
                    <div>
                        Name: {data.name}
                    </div>
                    <div>
                        Description: {data.description}
                    </div>
                    <div>
                        Price: <span>{data.price + " ETH"}</span>
                    </div>
                    <div>
                        Wallet: <span className="text-sm">{data.owner}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
