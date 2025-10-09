export const boosterBoxManager_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_competitionContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "competitionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "additionalQuantity",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "addedBy",
        type: "address",
      },
    ],
    name: "AdditionalBoosterBoxesAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "competitionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
    ],
    name: "BoosterBoxQuantitySet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "competitionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
    ],
    name: "BoosterBoxesClaimed",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_competitionId", type: "uint256" },
      { internalType: "uint256", name: "_additionalQuantity", type: "uint256" },
      { internalType: "address", name: "adminCaller", type: "address" },
    ],
    name: "addBoosterBoxes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_competitionId", type: "uint256" },
    ],
    name: "areBoosterBoxesClaimed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "boosterBoxQuantity",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "boosterBoxesClaimed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_competitionId", type: "uint256" },
      { internalType: "address", name: "winner", type: "address" },
      {
        components: [
          {
            internalType: "address",
            name: "collectionAddress",
            type: "address",
          },
          { internalType: "uint8[]", name: "rarityTiers", type: "uint8[]" },
          { internalType: "uint256", name: "ticketPrice", type: "uint256" },
          { internalType: "address", name: "treasuryWallet", type: "address" },
          { internalType: "uint256", name: "treasuryPercent", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "bool", name: "boosterBoxEnabled", type: "bool" },
          {
            internalType: "address",
            name: "boosterBoxAddress",
            type: "address",
          },
          { internalType: "address", name: "verifierAddress", type: "address" },
          {
            internalType: "enum ICompetitionStorage.CompetitionState",
            name: "state",
            type: "uint8",
          },
          { internalType: "address", name: "winner", type: "address" },
          { internalType: "uint256", name: "prizePool", type: "uint256" },
          { internalType: "uint256", name: "totalTickets", type: "uint256" },
          { internalType: "bool", name: "winnerDeclared", type: "bool" },
          {
            internalType: "uint256",
            name: "winnerDeclaredAt",
            type: "uint256",
          },
          { internalType: "bool", name: "emergencyPaused", type: "bool" },
        ],
        internalType: "struct ICompetitionStorage.Competition",
        name: "comp",
        type: "tuple",
      },
    ],
    name: "claimBoosterBoxes",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "competitionContract",
    outputs: [
      {
        internalType: "contract ICompetitionStorage",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_competitionId", type: "uint256" },
    ],
    name: "getBoosterBoxQuantity",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_competitionId", type: "uint256" },
      { internalType: "uint256", name: "_quantity", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "setBoosterBoxQuantity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
