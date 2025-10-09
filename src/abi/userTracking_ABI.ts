export const userTracking_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_geoChallenge", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "competitionId",
        type: "uint256",
      },
    ],
    name: "ParticipationTracked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PrizeTracked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "WinTracked",
    type: "event",
  },
  {
    inputs: [],
    name: "geoChallenge",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserCompetitionIds",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserStats",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "totalCompetitionsJoined",
            type: "uint256",
          },
          { internalType: "uint256", name: "totalPrizesWon", type: "uint256" },
          { internalType: "uint256", name: "competitionsWon", type: "uint256" },
        ],
        internalType: "struct ICompetitionStorage.UserStats",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "competitionId", type: "uint256" },
    ],
    name: "trackParticipation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "trackPrizeWon",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "trackWin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
