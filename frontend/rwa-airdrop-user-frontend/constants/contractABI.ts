export const AIRDROP_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'meowCoinAddress_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'airdropAmount_',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'oracleAddress_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'stockPriceThreshold_',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'verifierAddress_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'stockQuantityThreshold_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'holdingPeriodThreshold_',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'proof_',
        type: 'bytes',
      },
      {
        internalType: 'uint256[]',
        name: 'input_',
        type: 'uint256[]',
      },
    ],
    name: 'claimAirdrop',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
