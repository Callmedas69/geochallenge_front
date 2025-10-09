export const ticketRenderer_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "length", type: "uint256" },
    ],
    name: "StringsInsufficientHexLength",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
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
      { internalType: "string", name: "competitionName", type: "string" },
    ],
    name: "generateTokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
  },
] as const;
