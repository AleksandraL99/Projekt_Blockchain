// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Importing required modules and contracts from OpenZeppelin and Hardhat
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// NFTMarketplace extends ERC721URIStorage to leverage the functionality of ERC721 tokens with metadata URI storage.
contract NFTMarketplace is ERC721URIStorage {
    // Using the Counters utility from OpenZeppelin to safely increment and decrement counters
    using Counters for Counters.Counter;
    // Private counter to keep track of token IDs
    Counters.Counter private _tokenIds;
    // Owner of the contract (who deployed it)
    address payable owner;
    // Listing price to mint an NFT
    uint256 listPrice = 0.01 ether;

    // Structure to store information about listed tokens
    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        uint256 price;
        bool currentlyListed;
    }

    // Event to notify when a token is successfully listed
    event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        uint256 price,
        bool currentlyListed
    );

    // Mapping from token ID to its details, used for easy retrieval
    mapping(uint256 => ListedToken) private idToListedToken;

    // Constructor sets up the ERC721 token with a name and symbol
    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);  // Sets the contract deployer as the owner
    }

    // Public function to update the listing price, only callable by the owner
    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    // Getter to return the current listing price
    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    // Function to create a new token with metadata URI and price
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        require(msg.value == listPrice, "Insufficient funds sent for listing.");

        _tokenIds.increment();  // Increment the token ID counter
        uint256 newTokenId = _tokenIds.current();  // Get the new token ID
        _safeMint(msg.sender, newTokenId);  // Mint the new token
        _setTokenURI(newTokenId, tokenURI);  // Set the token's URI

        // Store the token's details in the mapping
        idToListedToken[newTokenId] = ListedToken({
            tokenId: newTokenId,
            owner: payable(msg.sender),
            price: price,
            currentlyListed: true
        });

        // Emit an event to signal successful token creation
        emit TokenListedSuccess(newTokenId, msg.sender, price, true);

        return newTokenId;
    }

    // Retrieves the details of a token given its ID
    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        require(_exists(tokenId), "Token does not exist.");
        return idToListedToken[tokenId];
    }

    // Returns an array of all NFTs currently listed in the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint256 total = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](total);
        for (uint256 i = 0; i < total; i++) {
            uint256 tokenId = i + 1;
            if (_exists(tokenId)) {
                tokens[i] = idToListedToken[tokenId];
            }
        }
        return tokens;
    }

    // Returns an array of NFTs owned by the caller
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        ListedToken[] memory items = new ListedToken[](totalItemCount); // Pre-allocate memory for worst case

        for(uint256 i = 0; i < totalItemCount; i++) {
            uint256 tokenId = i + 1;
            if (idToListedToken[tokenId].owner == msg.sender && _exists(tokenId)) {
                items[currentIndex] = idToListedToken[tokenId];
                currentIndex++;
            }
        }

        // Reduce the memory size of the array to fit actual count
        assembly {
            mstore(items, currentIndex)
        }

        return items;
    }
}
