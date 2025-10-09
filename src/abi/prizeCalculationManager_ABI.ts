export const prizeCalculationManager_ABI = [
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
        name: "prizePerTicket",
        type: "uint256",
      },
    ],
    name: "NoWinnerPrizeDistribution",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "prizePool", type: "uint256" },
      { internalType: "uint256", name: "totalTickets", type: "uint256" },
    ],
    name: "calculateNoWinnerDistribution",
    outputs: [
      { internalType: "uint256", name: "prizePerTicket", type: "uint256" },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "noWinnerPrizePerTicket",
        type: "uint256",
      },
    ],
    name: "calculateParticipantPrizeNoWinner",
    outputs: [
      { internalType: "uint256", name: "prizeAmount", type: "uint256" },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "competitionId", type: "uint256" },
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
      { internalType: "address", name: "claimer", type: "address" },
      { internalType: "address", name: "prizeManagerAddress", type: "address" },
    ],
    name: "calculateParticipantPrizeWithWinner",
    outputs: [
      { internalType: "uint256", name: "prizeAmount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "ticketPrice", type: "uint256" },
      { internalType: "uint256", name: "treasuryPercent", type: "uint256" },
    ],
    name: "calculateTreasurySplit",
    outputs: [
      { internalType: "uint256", name: "treasuryAmount", type: "uint256" },
      { internalType: "uint256", name: "prizePoolAmount", type: "uint256" },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "prizePool", type: "uint256" },
      { internalType: "uint256", name: "totalTickets", type: "uint256" },
    ],
    name: "calculateWinnerPrize",
    outputs: [
      { internalType: "uint256", name: "winnerPrize", type: "uint256" },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getParticipantPercentage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getWinnerPercentage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
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
    name: "shouldDistributeNoWinnerPrizes",
    outputs: [{ internalType: "bool", name: "shouldDistribute", type: "bool" }],
    stateMutability: "pure",
    type: "function",
  },
] as const;
