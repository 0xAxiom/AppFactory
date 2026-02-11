export const GuessGameScoringABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'score',
        type: 'uint256',
      },
    ],
    name: 'NewHighScore',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'highScores',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'score', type: 'uint256' }],
    name: 'submitScore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
