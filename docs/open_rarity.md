Get token rarity by open transaction hash



Header
API-KEY

string
required
Free API key needed to authorize requests, grab one at docs.wield.xyz

enter API-KEY

Query
transactionHash

string
required
The transaction hash

enter transactionHash
contractAddress

string
required
The contract address

enter contractAddress




const url = 'https://build.wield.xyz/vibe/boosterbox/rarity';
const options = {method: 'GET', headers: {'API-KEY': '<api-key>'}, body: undefined};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}