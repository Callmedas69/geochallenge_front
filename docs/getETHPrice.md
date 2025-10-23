const url = 'https://build.wield.xyz/vibe/boosterbox/eth-price';
const options = {
  method: 'GET',
  headers: {'API-KEY': 'DEMO_REPLACE_WITH_FREE_API_KEY'},
  body: undefined
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}

RESPONSE
{
  "success": true,
  "price": 123,
  "priceFormatted": "<string>",
  "lastUpdated": "2023-11-07T05:31:56Z"
}