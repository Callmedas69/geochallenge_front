export const metadataManager_ABI = [
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
      { indexed: false, internalType: "string", name: "name", type: "string" },
    ],
    name: "MetadataSet",
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
      { indexed: false, internalType: "string", name: "name", type: "string" },
    ],
    name: "MetadataUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "competitionContract",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "competitionDescriptions",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "competitionNames",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "competitionId", type: "uint256" },
    ],
    name: "getCompetitionDescription",
    outputs: [{ internalType: "string", name: "description", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "competitionId", type: "uint256" },
    ],
    name: "getCompetitionMetadata",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "description", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "competitionId", type: "uint256" },
    ],
    name: "getCompetitionName",
    outputs: [{ internalType: "string", name: "name", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "competitionIds", type: "uint256[]" },
    ],
    name: "getMultipleMetadata",
    outputs: [
      { internalType: "string[]", name: "names", type: "string[]" },
      { internalType: "string[]", name: "descriptions", type: "string[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "competitionId", type: "uint256" },
    ],
    name: "hasMetadata",
    outputs: [{ internalType: "bool", name: "exists", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "competitionId", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "description", type: "string" },
    ],
    name: "setCompetitionMetadata",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "competitionId", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "description", type: "string" },
    ],
    name: "updateCompetitionMetadata",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
