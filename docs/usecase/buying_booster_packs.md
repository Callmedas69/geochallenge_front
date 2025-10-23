// Using ethers.js v6
import { ethers } from "ethers";

// Connect to provider
const provider = new ethers.JsonRpcProvider("https://base.llamarpc.com");
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// BoosterDropV2 contract
const boosterDrop = new ethers.Contract(
  BOOSTER_DROP_ADDRESS,
  IBoosterDropV2_ABI,
  signer
);

// Get mint price for packs (example: 5 packs)
const mintPrice = await boosterDrop.getMintPrice(5);

// Mint packs with referral (earn fees!)
await boosterDrop.mint(
  5, // amount of packs
  signer.address, // recipient
  YOUR_ADDRESS, // referrer (example: earn portion of fees)
  YOUR_ADDRESS, // originReferrer (example: earn additional portion)
  { value: mintPrice } // ETH payment
);