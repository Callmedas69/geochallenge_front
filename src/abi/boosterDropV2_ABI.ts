/**
 * @title BoosterDropV2 ABI
 * @notice ABI for interacting with VibeMarket BoosterDropV2 contracts
 * @dev Each collection contract implements IBoosterDropV2
 */

export const boosterDropV2_ABI = [
  {
    type: 'function',
    name: 'mint',
    inputs: [
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
      { name: 'recipient', type: 'address', internalType: 'address' },
      { name: 'referrer', type: 'address', internalType: 'address' },
      { name: 'originReferrer', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'getMintPrice',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: 'tokenAmount', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokensPerMint',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
] as const
