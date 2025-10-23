// Get entropy fee required for opening
const entropyFee = await boosterDrop.getEntropyFee();

// Open multiple packs (requires ETH for entropy)
const tokenIds = [1, 2, 3]; // Your unopened pack token IDs
await boosterDrop.open(tokenIds, { value: entropyFee });

// Get rarity info after randomness is fulfilled
const rarityInfo = await boosterDrop.getTokenRarity(tokenIds[0]);
console.log({
  rarity: rarityInfo.rarity, // 1=Common, 2=Rare, 3=Epic, 4=Legendary, 5=Mythic
  randomValue: rarityInfo.randomValue,
  randomness: rarityInfo.tokenSpecificRandomness,
});