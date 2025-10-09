import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AdminValidationManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const adminValidationManagerAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'competitionExists',
    outputs: [{ name: 'exists', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'currentCompetitionId',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'isValidCompetitionId',
    outputs: [{ name: 'isValid', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validateAddBoosterBoxes',
    outputs: [
      { name: 'isValid', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'currentCompetitionId',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'prizeAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validateAddPrize',
    outputs: [
      { name: 'isValid', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validateBoosterBoxQuantity',
    outputs: [
      { name: 'isValid', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'validateEmergencyPause',
    outputs: [
      { name: 'canPause', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'validateEmergencyUnpause',
    outputs: [
      { name: 'canUnpause', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'currentTimestamp', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validateEndCompetition',
    outputs: [
      { name: 'canEnd', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'validatePrizeAdditionState',
    outputs: [
      { name: 'isValid', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'validateStartCompetition',
    outputs: [
      { name: 'canStart', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'newVerifier', internalType: 'address', type: 'address' },
    ],
    name: 'validateVerifierUpdate',
    outputs: [
      { name: 'isValid', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BoosterBoxManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const boosterBoxManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_competitionContract',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'additionalQuantity',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'addedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AdditionalBoosterBoxesAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'quantity',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BoosterBoxQuantitySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'winner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'quantity',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BoosterBoxesClaimed',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
      { name: '_additionalQuantity', internalType: 'uint256', type: 'uint256' },
      { name: 'adminCaller', internalType: 'address', type: 'address' },
    ],
    name: 'addBoosterBoxes',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'areBoosterBoxesClaimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'boosterBoxQuantity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'boosterBoxesClaimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
      { name: 'winner', internalType: 'address', type: 'address' },
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'claimBoosterBoxes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'competitionContract',
    outputs: [
      {
        name: '',
        internalType: 'contract ICompetitionStorage',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getBoosterBoxQuantity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
      { name: '_quantity', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'setBoosterBoxQuantity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CompetitionLifecycleManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const competitionLifecycleManagerAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'GRACE_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_DEADLINE_EXTENSION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_DEADLINE_BUFFER',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'NO_WINNER_WAIT_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateRefund',
    outputs: [
      { name: 'refundAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getGracePeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNoWinnerWaitPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'currentTimestamp', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasNoWinnerWaitPeriodEnded',
    outputs: [{ name: 'hasEnded', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'winnerDeclaredAt', internalType: 'uint256', type: 'uint256' },
      { name: 'currentTimestamp', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isGracePeriodActive',
    outputs: [{ name: 'isActive', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'shouldDistributeNoWinnerPrizes',
    outputs: [{ name: 'shouldDistribute', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'validateCancellation',
    outputs: [
      { name: 'canCancel', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'newDeadline', internalType: 'uint256', type: 'uint256' },
      { name: 'currentTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'currentCompetitionId',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'validateDeadlineExtension',
    outputs: [
      { name: 'isValid', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'currentTimestamp', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validateFinalization',
    outputs: [
      { name: 'canFinalize', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'hasTicket', internalType: 'bool', type: 'bool' },
      { name: 'alreadyClaimed', internalType: 'bool', type: 'bool' },
    ],
    name: 'validateRefundClaim',
    outputs: [
      { name: 'isValid', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CompetitionManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const competitionManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_competitionContract',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'collection',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'CompetitionCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'CompetitionValidated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'competitionContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ICompetitionStorage.CreateCompetitionParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'createCompetitionData',
    outputs: [
      {
        name: 'competition',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ICompetitionStorage.CreateCompetitionParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'getCreationGasEstimate',
    outputs: [
      { name: 'gasEstimate', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ICompetitionStorage.CreateCompetitionParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
        ],
      },
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'processCompetitionCreation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ICompetitionStorage.CreateCompetitionParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'validateCompetitionParams',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GeoChallenge
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const geoChallengeAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1967InvalidImplementation',
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' },
  { type: 'error', inputs: [], name: 'EnforcedPause' },
  { type: 'error', inputs: [], name: 'ExpectedPause' },
  { type: 'error', inputs: [], name: 'FailedCall' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'UUPSUnauthorizedCallContext' },
  {
    type: 'error',
    inputs: [{ name: 'slot', internalType: 'bytes32', type: 'bytes32' }],
    name: 'UUPSUnsupportedProxiableUUID',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'addedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AdditionalPrizeAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'CompetitionCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'collectionAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'CompetitionCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'CompetitionEmergencyPaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'CompetitionEmergencyUnpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'hasWinner', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'CompetitionEnded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'CompetitionFinalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'deadline',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CompetitionStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'treasuryAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'prizeAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FundsSplit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'prizePerTicket',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NoWinnerPrizeDistribution',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ParticipantPrizeClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RefundIssued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TicketPurchased',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'proofHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'WinnerClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'winner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WinnerDeclared',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GRACE_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'NO_WINNER_WAIT_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
      { name: '_additionalQuantity', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addBoosterBoxes',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addPrizeETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'adminValidationManager',
    outputs: [
      {
        name: '',
        internalType: 'contract AdminValidationManager',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'boosterBoxManager',
    outputs: [
      { name: '', internalType: 'contract BoosterBoxManager', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'buyTicket',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancelCompetition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimParticipantPrize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimPrize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimRefund',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'competitionLifecycleManager',
    outputs: [
      {
        name: '',
        internalType: 'contract CompetitionLifecycleManager',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'competitionManager',
    outputs: [
      {
        name: '',
        internalType: 'contract CompetitionManager',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ICompetitionStorage.CreateCompetitionParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'createCompetition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'emergencyPauseCompetition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'emergencyUnpauseCompetition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'endCompetition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
      { name: '_newDeadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'extendDeadline',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'finalizeCompetition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getBoosterBoxInfo',
    outputs: [
      { name: 'enabled', internalType: 'bool', type: 'bool' },
      { name: 'contractAddress', internalType: 'address', type: 'address' },
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
      { name: 'claimed', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getBoosterBoxQuantity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getClaimableBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCompetition',
    outputs: [
      {
        name: '',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCompetitionDescription',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCompetitionMetadata',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCompetitionName',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentCompetitionId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPrizePool',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'hasTicket',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
      { name: '_proofHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'iamtheWinner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'modules',
        internalType: 'struct ModuleAddresses',
        type: 'tuple',
        components: [
          { name: 'ticketRenderer', internalType: 'address', type: 'address' },
          { name: 'proofValidator', internalType: 'address', type: 'address' },
          { name: 'prizeManager', internalType: 'address', type: 'address' },
          {
            name: 'prizeCalculationManager',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'competitionLifecycleManager',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'adminValidationManager',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'boosterBoxManager',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'competitionManager',
            internalType: 'address',
            type: 'address',
          },
          { name: 'metadataManager', internalType: 'address', type: 'address' },
          { name: 'queryManager', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'metadataManager',
    outputs: [
      { name: '', internalType: 'contract MetadataManager', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'participantPrizePerTicket',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'prizeCalculationManager',
    outputs: [
      {
        name: '',
        internalType: 'contract PrizeCalculationManager',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'prizeManager',
    outputs: [
      { name: '', internalType: 'contract PrizeManager', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proofValidator',
    outputs: [
      { name: '', internalType: 'contract ProofValidator', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'queryManager',
    outputs: [
      { name: '', internalType: 'contract QueryManager', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'refundsClaimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
      { name: '_quantity', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setBoosterBoxQuantity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'startCompetition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'ticketHolders',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ticketRenderer',
    outputs: [
      { name: '', internalType: 'contract TicketRenderer', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
      { name: '_newVerifier', internalType: 'address', type: 'address' },
    ],
    name: 'updateVerifier',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdrawBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GeoChallengeProxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const geoChallengeProxyAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1967InvalidImplementation',
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' },
  { type: 'error', inputs: [], name: 'FailedCall' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  { type: 'fallback', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MetadataManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const metadataManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_competitionContract',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'MetadataSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'MetadataUpdated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'competitionContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'competitionDescriptions',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'competitionNames',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCompetitionDescription',
    outputs: [{ name: 'description', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCompetitionMetadata',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCompetitionName',
    outputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'getMultipleMetadata',
    outputs: [
      { name: 'names', internalType: 'string[]', type: 'string[]' },
      { name: 'descriptions', internalType: 'string[]', type: 'string[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasMetadata',
    outputs: [{ name: 'exists', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'setCompetitionMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'updateCompetitionMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PrizeCalculationManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const prizeCalculationManagerAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'prizePerTicket',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NoWinnerPrizeDistribution',
  },
  {
    type: 'function',
    inputs: [
      { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
      { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateNoWinnerDistribution',
    outputs: [
      { name: 'prizePerTicket', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'noWinnerPrizePerTicket',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'calculateParticipantPrizeNoWinner',
    outputs: [
      { name: 'prizeAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'claimer', internalType: 'address', type: 'address' },
      { name: 'prizeManagerAddress', internalType: 'address', type: 'address' },
    ],
    name: 'calculateParticipantPrizeWithWinner',
    outputs: [
      { name: 'prizeAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateTreasurySplit',
    outputs: [
      { name: 'treasuryAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'prizePoolAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
      { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateWinnerPrize',
    outputs: [
      { name: 'winnerPrize', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getParticipantPercentage',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWinnerPercentage',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'shouldDistributeNoWinnerPrizes',
    outputs: [{ name: 'shouldDistribute', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PrizeManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const prizeManagerAbi = [
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BalanceWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ParticipantPrizeClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'winnerPrize',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'participantPrizePerTicket',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PrizeCalculated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'winner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'competitionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PrizeClaimed',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GRACE_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PARTICIPANT_PERCENT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WINNER_PERCENT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addToClaimableBalance',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'calculatePotentialPrizes',
    outputs: [
      { name: 'winnerPrize', internalType: 'uint256', type: 'uint256' },
      { name: 'prizePerTicket', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'calculatePrizes',
    outputs: [
      { name: 'winnerPrize', internalType: 'uint256', type: 'uint256' },
      { name: 'prizePerTicket', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'hasTicket', internalType: 'bool', type: 'bool' },
    ],
    name: 'claimParticipantPrize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      { name: 'winner', internalType: 'address', type: 'address' },
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'claimWinnerPrize',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'claimableBalances',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getClaimableBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getParticipantPrizePerTicket',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isPrizeCalculated',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'withdrawBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ProofValidator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const proofValidatorAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCompletionProofTypeHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDomainSeparator',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'proofHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getExpectedDigest',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      { name: 'proofHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'isProofUsed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'usedProofs',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      { name: 'proofHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
      { name: 'participant', internalType: 'address', type: 'address' },
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'validateProof',
    outputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'isWinner', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'competitionId', internalType: 'uint256', type: 'uint256' },
      { name: 'proofHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
      { name: 'participant', internalType: 'address', type: 'address' },
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'validateProofView',
    outputs: [
      { name: 'isValid', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// QueryManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const queryManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_competitionContract',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'queryCount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BulkQueryExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'HealthCheckExecuted',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'checkCompetitionHealth',
    outputs: [
      { name: 'exists', internalType: 'bool', type: 'bool' },
      { name: 'isActive', internalType: 'bool', type: 'bool' },
      { name: 'hasParticipants', internalType: 'bool', type: 'bool' },
      { name: 'isPaused', internalType: 'bool', type: 'bool' },
      { name: 'isExpired', internalType: 'bool', type: 'bool' },
      { name: 'timeRemaining', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'competitionContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'competitionStorage',
    outputs: [
      {
        name: '',
        internalType: 'contract ICompetitionStorage',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getActiveCompetitions',
    outputs: [
      { name: 'activeIds', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: 'activeComps',
        internalType: 'struct ICompetitionStorage.Competition[]',
        type: 'tuple[]',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCompetitionStats',
    outputs: [
      { name: 'notStarted', internalType: 'uint256', type: 'uint256' },
      { name: 'active', internalType: 'uint256', type: 'uint256' },
      { name: 'ended', internalType: 'uint256', type: 'uint256' },
      { name: 'finalized', internalType: 'uint256', type: 'uint256' },
      { name: 'emergencyPaused', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_state',
        internalType: 'enum ICompetitionStorage.CompetitionState',
        type: 'uint8',
      },
    ],
    name: 'getCompetitionsByState',
    outputs: [
      { name: 'stateIds', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: 'stateComps',
        internalType: 'struct ICompetitionStorage.Competition[]',
        type: 'tuple[]',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getContractHealth',
    outputs: [
      { name: 'totalCompetitions', internalType: 'uint256', type: 'uint256' },
      { name: 'activeCompetitions', internalType: 'uint256', type: 'uint256' },
      { name: 'totalEthLocked', internalType: 'uint256', type: 'uint256' },
      { name: 'pendingRefunds', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExpiredCompetitions',
    outputs: [
      { name: 'expiredIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_competitionIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'getMultipleCompetitions',
    outputs: [
      {
        name: 'competitions',
        internalType: 'struct ICompetitionStorage.Competition[]',
        type: 'tuple[]',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPaginatedCompetitions',
    outputs: [
      { name: 'competitionIds', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: 'competitions',
        internalType: 'struct ICompetitionStorage.Competition[]',
        type: 'tuple[]',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalValueLocked',
    outputs: [{ name: 'totalTVL', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: '_competitionIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'getUserTicketStatus',
    outputs: [{ name: 'statuses', internalType: 'bool[]', type: 'bool[]' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TicketRenderer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ticketRendererAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'comp',
        internalType: 'struct ICompetitionStorage.Competition',
        type: 'tuple',
        components: [
          {
            name: 'collectionAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rarityTiers', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'ticketPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryWallet', internalType: 'address', type: 'address' },
          { name: 'treasuryPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'boosterBoxEnabled', internalType: 'bool', type: 'bool' },
          {
            name: 'boosterBoxAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'verifierAddress', internalType: 'address', type: 'address' },
          {
            name: 'state',
            internalType: 'enum ICompetitionStorage.CompetitionState',
            type: 'uint8',
          },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'totalTickets', internalType: 'uint256', type: 'uint256' },
          { name: 'winnerDeclared', internalType: 'bool', type: 'bool' },
          {
            name: 'winnerDeclaredAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyPaused', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'generateTokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link adminValidationManagerAbi}__
 */
export const useReadAdminValidationManager =
  /*#__PURE__*/ createUseReadContract({ abi: adminValidationManagerAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link adminValidationManagerAbi}__ and `functionName` set to `"competitionExists"`
 */
export const useReadAdminValidationManagerCompetitionExists =
  /*#__PURE__*/ createUseReadContract({
    abi: adminValidationManagerAbi,
    functionName: 'competitionExists',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link adminValidationManagerAbi}__ and `functionName` set to `"isValidCompetitionId"`
 */
export const useReadAdminValidationManagerIsValidCompetitionId =
  /*#__PURE__*/ createUseReadContract({
    abi: adminValidationManagerAbi,
    functionName: 'isValidCompetitionId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link adminValidationManagerAbi}__ and `functionName` set to `"validateAddBoosterBoxes"`
 */
export const useReadAdminValidationManagerValidateAddBoosterBoxes =
  /*#__PURE__*/ createUseReadContract({
    abi: adminValidationManagerAbi,
    functionName: 'validateAddBoosterBoxes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link adminValidationManagerAbi}__ and `functionName` set to `"validateAddPrize"`
 */
export const useReadAdminValidationManagerValidateAddPrize =
  /*#__PURE__*/ createUseReadContract({
    abi: adminValidationManagerAbi,
    functionName: 'validateAddPrize',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link adminValidationManagerAbi}__ and `functionName` set to `"validateBoosterBoxQuantity"`
 */
export const useReadAdminValidationManagerValidateBoosterBoxQuantity =
  /*#__PURE__*/ createUseReadContract({
    abi: adminValidationManagerAbi,
    functionName: 'validateBoosterBoxQuantity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link adminValidationManagerAbi}__ and `functionName` set to `"validateEmergencyPause"`
 */
export const useReadAdminValidationManagerValidateEmergencyPause =
  /*#__PURE__*/ createUseReadContract({
    abi: adminValidationManagerAbi,
    functionName: 'validateEmergencyPause',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link adminValidationManagerAbi}__ and `functionName` set to `"validateEmergencyUnpause"`
 */
export const useReadAdminValidationManagerValidateEmergencyUnpause =
  /*#__PURE__*/ createUseReadContract({
    abi: adminValidationManagerAbi,
    functionName: 'validateEmergencyUnpause',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link adminValidationManagerAbi}__ and `functionName` set to `"validateEndCompetition"`
 */
export const useReadAdminValidationManagerValidateEndCompetition =
  /*#__PURE__*/ createUseReadContract({
    abi: adminValidationManagerAbi,
    functionName: 'validateEndCompetition',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link adminValidationManagerAbi}__ and `functionName` set to `"validatePrizeAdditionState"`
 */
export const useReadAdminValidationManagerValidatePrizeAdditionState =
  /*#__PURE__*/ createUseReadContract({
    abi: adminValidationManagerAbi,
    functionName: 'validatePrizeAdditionState',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link adminValidationManagerAbi}__ and `functionName` set to `"validateStartCompetition"`
 */
export const useReadAdminValidationManagerValidateStartCompetition =
  /*#__PURE__*/ createUseReadContract({
    abi: adminValidationManagerAbi,
    functionName: 'validateStartCompetition',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link adminValidationManagerAbi}__ and `functionName` set to `"validateVerifierUpdate"`
 */
export const useReadAdminValidationManagerValidateVerifierUpdate =
  /*#__PURE__*/ createUseReadContract({
    abi: adminValidationManagerAbi,
    functionName: 'validateVerifierUpdate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__
 */
export const useReadBoosterBoxManager = /*#__PURE__*/ createUseReadContract({
  abi: boosterBoxManagerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `functionName` set to `"areBoosterBoxesClaimed"`
 */
export const useReadBoosterBoxManagerAreBoosterBoxesClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: boosterBoxManagerAbi,
    functionName: 'areBoosterBoxesClaimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `functionName` set to `"boosterBoxQuantity"`
 */
export const useReadBoosterBoxManagerBoosterBoxQuantity =
  /*#__PURE__*/ createUseReadContract({
    abi: boosterBoxManagerAbi,
    functionName: 'boosterBoxQuantity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `functionName` set to `"boosterBoxesClaimed"`
 */
export const useReadBoosterBoxManagerBoosterBoxesClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: boosterBoxManagerAbi,
    functionName: 'boosterBoxesClaimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `functionName` set to `"competitionContract"`
 */
export const useReadBoosterBoxManagerCompetitionContract =
  /*#__PURE__*/ createUseReadContract({
    abi: boosterBoxManagerAbi,
    functionName: 'competitionContract',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `functionName` set to `"getBoosterBoxQuantity"`
 */
export const useReadBoosterBoxManagerGetBoosterBoxQuantity =
  /*#__PURE__*/ createUseReadContract({
    abi: boosterBoxManagerAbi,
    functionName: 'getBoosterBoxQuantity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__
 */
export const useWriteBoosterBoxManager = /*#__PURE__*/ createUseWriteContract({
  abi: boosterBoxManagerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `functionName` set to `"addBoosterBoxes"`
 */
export const useWriteBoosterBoxManagerAddBoosterBoxes =
  /*#__PURE__*/ createUseWriteContract({
    abi: boosterBoxManagerAbi,
    functionName: 'addBoosterBoxes',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `functionName` set to `"claimBoosterBoxes"`
 */
export const useWriteBoosterBoxManagerClaimBoosterBoxes =
  /*#__PURE__*/ createUseWriteContract({
    abi: boosterBoxManagerAbi,
    functionName: 'claimBoosterBoxes',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `functionName` set to `"setBoosterBoxQuantity"`
 */
export const useWriteBoosterBoxManagerSetBoosterBoxQuantity =
  /*#__PURE__*/ createUseWriteContract({
    abi: boosterBoxManagerAbi,
    functionName: 'setBoosterBoxQuantity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__
 */
export const useSimulateBoosterBoxManager =
  /*#__PURE__*/ createUseSimulateContract({ abi: boosterBoxManagerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `functionName` set to `"addBoosterBoxes"`
 */
export const useSimulateBoosterBoxManagerAddBoosterBoxes =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boosterBoxManagerAbi,
    functionName: 'addBoosterBoxes',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `functionName` set to `"claimBoosterBoxes"`
 */
export const useSimulateBoosterBoxManagerClaimBoosterBoxes =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boosterBoxManagerAbi,
    functionName: 'claimBoosterBoxes',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `functionName` set to `"setBoosterBoxQuantity"`
 */
export const useSimulateBoosterBoxManagerSetBoosterBoxQuantity =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boosterBoxManagerAbi,
    functionName: 'setBoosterBoxQuantity',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boosterBoxManagerAbi}__
 */
export const useWatchBoosterBoxManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: boosterBoxManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `eventName` set to `"AdditionalBoosterBoxesAdded"`
 */
export const useWatchBoosterBoxManagerAdditionalBoosterBoxesAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boosterBoxManagerAbi,
    eventName: 'AdditionalBoosterBoxesAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `eventName` set to `"BoosterBoxQuantitySet"`
 */
export const useWatchBoosterBoxManagerBoosterBoxQuantitySetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boosterBoxManagerAbi,
    eventName: 'BoosterBoxQuantitySet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boosterBoxManagerAbi}__ and `eventName` set to `"BoosterBoxesClaimed"`
 */
export const useWatchBoosterBoxManagerBoosterBoxesClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boosterBoxManagerAbi,
    eventName: 'BoosterBoxesClaimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__
 */
export const useReadCompetitionLifecycleManager =
  /*#__PURE__*/ createUseReadContract({ abi: competitionLifecycleManagerAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"GRACE_PERIOD"`
 */
export const useReadCompetitionLifecycleManagerGracePeriod =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'GRACE_PERIOD',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"MAX_DEADLINE_EXTENSION"`
 */
export const useReadCompetitionLifecycleManagerMaxDeadlineExtension =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'MAX_DEADLINE_EXTENSION',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"MIN_DEADLINE_BUFFER"`
 */
export const useReadCompetitionLifecycleManagerMinDeadlineBuffer =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'MIN_DEADLINE_BUFFER',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"NO_WINNER_WAIT_PERIOD"`
 */
export const useReadCompetitionLifecycleManagerNoWinnerWaitPeriod =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'NO_WINNER_WAIT_PERIOD',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"calculateRefund"`
 */
export const useReadCompetitionLifecycleManagerCalculateRefund =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'calculateRefund',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"getGracePeriod"`
 */
export const useReadCompetitionLifecycleManagerGetGracePeriod =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'getGracePeriod',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"getNoWinnerWaitPeriod"`
 */
export const useReadCompetitionLifecycleManagerGetNoWinnerWaitPeriod =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'getNoWinnerWaitPeriod',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"hasNoWinnerWaitPeriodEnded"`
 */
export const useReadCompetitionLifecycleManagerHasNoWinnerWaitPeriodEnded =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'hasNoWinnerWaitPeriodEnded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"isGracePeriodActive"`
 */
export const useReadCompetitionLifecycleManagerIsGracePeriodActive =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'isGracePeriodActive',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"shouldDistributeNoWinnerPrizes"`
 */
export const useReadCompetitionLifecycleManagerShouldDistributeNoWinnerPrizes =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'shouldDistributeNoWinnerPrizes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"validateCancellation"`
 */
export const useReadCompetitionLifecycleManagerValidateCancellation =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'validateCancellation',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"validateDeadlineExtension"`
 */
export const useReadCompetitionLifecycleManagerValidateDeadlineExtension =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'validateDeadlineExtension',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"validateFinalization"`
 */
export const useReadCompetitionLifecycleManagerValidateFinalization =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'validateFinalization',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionLifecycleManagerAbi}__ and `functionName` set to `"validateRefundClaim"`
 */
export const useReadCompetitionLifecycleManagerValidateRefundClaim =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionLifecycleManagerAbi,
    functionName: 'validateRefundClaim',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionManagerAbi}__
 */
export const useReadCompetitionManager = /*#__PURE__*/ createUseReadContract({
  abi: competitionManagerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionManagerAbi}__ and `functionName` set to `"competitionContract"`
 */
export const useReadCompetitionManagerCompetitionContract =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionManagerAbi,
    functionName: 'competitionContract',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionManagerAbi}__ and `functionName` set to `"createCompetitionData"`
 */
export const useReadCompetitionManagerCreateCompetitionData =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionManagerAbi,
    functionName: 'createCompetitionData',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionManagerAbi}__ and `functionName` set to `"getCreationGasEstimate"`
 */
export const useReadCompetitionManagerGetCreationGasEstimate =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionManagerAbi,
    functionName: 'getCreationGasEstimate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link competitionManagerAbi}__ and `functionName` set to `"validateCompetitionParams"`
 */
export const useReadCompetitionManagerValidateCompetitionParams =
  /*#__PURE__*/ createUseReadContract({
    abi: competitionManagerAbi,
    functionName: 'validateCompetitionParams',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link competitionManagerAbi}__
 */
export const useWriteCompetitionManager = /*#__PURE__*/ createUseWriteContract({
  abi: competitionManagerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link competitionManagerAbi}__ and `functionName` set to `"processCompetitionCreation"`
 */
export const useWriteCompetitionManagerProcessCompetitionCreation =
  /*#__PURE__*/ createUseWriteContract({
    abi: competitionManagerAbi,
    functionName: 'processCompetitionCreation',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link competitionManagerAbi}__
 */
export const useSimulateCompetitionManager =
  /*#__PURE__*/ createUseSimulateContract({ abi: competitionManagerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link competitionManagerAbi}__ and `functionName` set to `"processCompetitionCreation"`
 */
export const useSimulateCompetitionManagerProcessCompetitionCreation =
  /*#__PURE__*/ createUseSimulateContract({
    abi: competitionManagerAbi,
    functionName: 'processCompetitionCreation',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link competitionManagerAbi}__
 */
export const useWatchCompetitionManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: competitionManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link competitionManagerAbi}__ and `eventName` set to `"CompetitionCreated"`
 */
export const useWatchCompetitionManagerCompetitionCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: competitionManagerAbi,
    eventName: 'CompetitionCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link competitionManagerAbi}__ and `eventName` set to `"CompetitionValidated"`
 */
export const useWatchCompetitionManagerCompetitionValidatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: competitionManagerAbi,
    eventName: 'CompetitionValidated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__
 */
export const useReadGeoChallenge = /*#__PURE__*/ createUseReadContract({
  abi: geoChallengeAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"GRACE_PERIOD"`
 */
export const useReadGeoChallengeGracePeriod =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'GRACE_PERIOD',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"NO_WINNER_WAIT_PERIOD"`
 */
export const useReadGeoChallengeNoWinnerWaitPeriod =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'NO_WINNER_WAIT_PERIOD',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"UPGRADE_INTERFACE_VERSION"`
 */
export const useReadGeoChallengeUpgradeInterfaceVersion =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'UPGRADE_INTERFACE_VERSION',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"adminValidationManager"`
 */
export const useReadGeoChallengeAdminValidationManager =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'adminValidationManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadGeoChallengeBalanceOf = /*#__PURE__*/ createUseReadContract(
  { abi: geoChallengeAbi, functionName: 'balanceOf' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadGeoChallengeBalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"boosterBoxManager"`
 */
export const useReadGeoChallengeBoosterBoxManager =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'boosterBoxManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"competitionLifecycleManager"`
 */
export const useReadGeoChallengeCompetitionLifecycleManager =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'competitionLifecycleManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"competitionManager"`
 */
export const useReadGeoChallengeCompetitionManager =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'competitionManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"getBoosterBoxInfo"`
 */
export const useReadGeoChallengeGetBoosterBoxInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'getBoosterBoxInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"getBoosterBoxQuantity"`
 */
export const useReadGeoChallengeGetBoosterBoxQuantity =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'getBoosterBoxQuantity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"getClaimableBalance"`
 */
export const useReadGeoChallengeGetClaimableBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'getClaimableBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"getCompetition"`
 */
export const useReadGeoChallengeGetCompetition =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'getCompetition',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"getCompetitionDescription"`
 */
export const useReadGeoChallengeGetCompetitionDescription =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'getCompetitionDescription',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"getCompetitionMetadata"`
 */
export const useReadGeoChallengeGetCompetitionMetadata =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'getCompetitionMetadata',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"getCompetitionName"`
 */
export const useReadGeoChallengeGetCompetitionName =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'getCompetitionName',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"getCurrentCompetitionId"`
 */
export const useReadGeoChallengeGetCurrentCompetitionId =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'getCurrentCompetitionId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"getPrizePool"`
 */
export const useReadGeoChallengeGetPrizePool =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'getPrizePool',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"hasTicket"`
 */
export const useReadGeoChallengeHasTicket = /*#__PURE__*/ createUseReadContract(
  { abi: geoChallengeAbi, functionName: 'hasTicket' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadGeoChallengeIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"metadataManager"`
 */
export const useReadGeoChallengeMetadataManager =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'metadataManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useReadGeoChallengeOnErc1155BatchReceived =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useReadGeoChallengeOnErc1155Received =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"owner"`
 */
export const useReadGeoChallengeOwner = /*#__PURE__*/ createUseReadContract({
  abi: geoChallengeAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"participantPrizePerTicket"`
 */
export const useReadGeoChallengeParticipantPrizePerTicket =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'participantPrizePerTicket',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"paused"`
 */
export const useReadGeoChallengePaused = /*#__PURE__*/ createUseReadContract({
  abi: geoChallengeAbi,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"prizeCalculationManager"`
 */
export const useReadGeoChallengePrizeCalculationManager =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'prizeCalculationManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"prizeManager"`
 */
export const useReadGeoChallengePrizeManager =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'prizeManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"proofValidator"`
 */
export const useReadGeoChallengeProofValidator =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'proofValidator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadGeoChallengeProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"queryManager"`
 */
export const useReadGeoChallengeQueryManager =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'queryManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"refundsClaimed"`
 */
export const useReadGeoChallengeRefundsClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'refundsClaimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadGeoChallengeSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"ticketHolders"`
 */
export const useReadGeoChallengeTicketHolders =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'ticketHolders',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"ticketRenderer"`
 */
export const useReadGeoChallengeTicketRenderer =
  /*#__PURE__*/ createUseReadContract({
    abi: geoChallengeAbi,
    functionName: 'ticketRenderer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"uri"`
 */
export const useReadGeoChallengeUri = /*#__PURE__*/ createUseReadContract({
  abi: geoChallengeAbi,
  functionName: 'uri',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__
 */
export const useWriteGeoChallenge = /*#__PURE__*/ createUseWriteContract({
  abi: geoChallengeAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"addBoosterBoxes"`
 */
export const useWriteGeoChallengeAddBoosterBoxes =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'addBoosterBoxes',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"addPrizeETH"`
 */
export const useWriteGeoChallengeAddPrizeEth =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'addPrizeETH',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"buyTicket"`
 */
export const useWriteGeoChallengeBuyTicket =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'buyTicket',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"cancelCompetition"`
 */
export const useWriteGeoChallengeCancelCompetition =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'cancelCompetition',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"claimParticipantPrize"`
 */
export const useWriteGeoChallengeClaimParticipantPrize =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'claimParticipantPrize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"claimPrize"`
 */
export const useWriteGeoChallengeClaimPrize =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'claimPrize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"claimRefund"`
 */
export const useWriteGeoChallengeClaimRefund =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'claimRefund',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"createCompetition"`
 */
export const useWriteGeoChallengeCreateCompetition =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'createCompetition',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"emergencyPauseCompetition"`
 */
export const useWriteGeoChallengeEmergencyPauseCompetition =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'emergencyPauseCompetition',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"emergencyUnpauseCompetition"`
 */
export const useWriteGeoChallengeEmergencyUnpauseCompetition =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'emergencyUnpauseCompetition',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"endCompetition"`
 */
export const useWriteGeoChallengeEndCompetition =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'endCompetition',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"extendDeadline"`
 */
export const useWriteGeoChallengeExtendDeadline =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'extendDeadline',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"finalizeCompetition"`
 */
export const useWriteGeoChallengeFinalizeCompetition =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'finalizeCompetition',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"iamtheWinner"`
 */
export const useWriteGeoChallengeIamtheWinner =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'iamtheWinner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteGeoChallengeInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"pause"`
 */
export const useWriteGeoChallengePause = /*#__PURE__*/ createUseWriteContract({
  abi: geoChallengeAbi,
  functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteGeoChallengeRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteGeoChallengeSafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteGeoChallengeSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteGeoChallengeSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"setBoosterBoxQuantity"`
 */
export const useWriteGeoChallengeSetBoosterBoxQuantity =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'setBoosterBoxQuantity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"startCompetition"`
 */
export const useWriteGeoChallengeStartCompetition =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'startCompetition',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteGeoChallengeTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"unpause"`
 */
export const useWriteGeoChallengeUnpause = /*#__PURE__*/ createUseWriteContract(
  { abi: geoChallengeAbi, functionName: 'unpause' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"updateVerifier"`
 */
export const useWriteGeoChallengeUpdateVerifier =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'updateVerifier',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteGeoChallengeUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"withdrawBalance"`
 */
export const useWriteGeoChallengeWithdrawBalance =
  /*#__PURE__*/ createUseWriteContract({
    abi: geoChallengeAbi,
    functionName: 'withdrawBalance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__
 */
export const useSimulateGeoChallenge = /*#__PURE__*/ createUseSimulateContract({
  abi: geoChallengeAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"addBoosterBoxes"`
 */
export const useSimulateGeoChallengeAddBoosterBoxes =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'addBoosterBoxes',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"addPrizeETH"`
 */
export const useSimulateGeoChallengeAddPrizeEth =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'addPrizeETH',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"buyTicket"`
 */
export const useSimulateGeoChallengeBuyTicket =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'buyTicket',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"cancelCompetition"`
 */
export const useSimulateGeoChallengeCancelCompetition =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'cancelCompetition',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"claimParticipantPrize"`
 */
export const useSimulateGeoChallengeClaimParticipantPrize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'claimParticipantPrize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"claimPrize"`
 */
export const useSimulateGeoChallengeClaimPrize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'claimPrize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"claimRefund"`
 */
export const useSimulateGeoChallengeClaimRefund =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'claimRefund',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"createCompetition"`
 */
export const useSimulateGeoChallengeCreateCompetition =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'createCompetition',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"emergencyPauseCompetition"`
 */
export const useSimulateGeoChallengeEmergencyPauseCompetition =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'emergencyPauseCompetition',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"emergencyUnpauseCompetition"`
 */
export const useSimulateGeoChallengeEmergencyUnpauseCompetition =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'emergencyUnpauseCompetition',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"endCompetition"`
 */
export const useSimulateGeoChallengeEndCompetition =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'endCompetition',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"extendDeadline"`
 */
export const useSimulateGeoChallengeExtendDeadline =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'extendDeadline',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"finalizeCompetition"`
 */
export const useSimulateGeoChallengeFinalizeCompetition =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'finalizeCompetition',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"iamtheWinner"`
 */
export const useSimulateGeoChallengeIamtheWinner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'iamtheWinner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateGeoChallengeInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"pause"`
 */
export const useSimulateGeoChallengePause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateGeoChallengeRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateGeoChallengeSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateGeoChallengeSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateGeoChallengeSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"setBoosterBoxQuantity"`
 */
export const useSimulateGeoChallengeSetBoosterBoxQuantity =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'setBoosterBoxQuantity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"startCompetition"`
 */
export const useSimulateGeoChallengeStartCompetition =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'startCompetition',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateGeoChallengeTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"unpause"`
 */
export const useSimulateGeoChallengeUnpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"updateVerifier"`
 */
export const useSimulateGeoChallengeUpdateVerifier =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'updateVerifier',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateGeoChallengeUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link geoChallengeAbi}__ and `functionName` set to `"withdrawBalance"`
 */
export const useSimulateGeoChallengeWithdrawBalance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: geoChallengeAbi,
    functionName: 'withdrawBalance',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__
 */
export const useWatchGeoChallengeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: geoChallengeAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"AdditionalPrizeAdded"`
 */
export const useWatchGeoChallengeAdditionalPrizeAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'AdditionalPrizeAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchGeoChallengeApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"CompetitionCancelled"`
 */
export const useWatchGeoChallengeCompetitionCancelledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'CompetitionCancelled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"CompetitionCreated"`
 */
export const useWatchGeoChallengeCompetitionCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'CompetitionCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"CompetitionEmergencyPaused"`
 */
export const useWatchGeoChallengeCompetitionEmergencyPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'CompetitionEmergencyPaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"CompetitionEmergencyUnpaused"`
 */
export const useWatchGeoChallengeCompetitionEmergencyUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'CompetitionEmergencyUnpaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"CompetitionEnded"`
 */
export const useWatchGeoChallengeCompetitionEndedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'CompetitionEnded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"CompetitionFinalized"`
 */
export const useWatchGeoChallengeCompetitionFinalizedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'CompetitionFinalized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"CompetitionStarted"`
 */
export const useWatchGeoChallengeCompetitionStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'CompetitionStarted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"FundsSplit"`
 */
export const useWatchGeoChallengeFundsSplitEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'FundsSplit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchGeoChallengeInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"NoWinnerPrizeDistribution"`
 */
export const useWatchGeoChallengeNoWinnerPrizeDistributionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'NoWinnerPrizeDistribution',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchGeoChallengeOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"ParticipantPrizeClaimed"`
 */
export const useWatchGeoChallengeParticipantPrizeClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'ParticipantPrizeClaimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchGeoChallengePausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"RefundIssued"`
 */
export const useWatchGeoChallengeRefundIssuedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'RefundIssued',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"TicketPurchased"`
 */
export const useWatchGeoChallengeTicketPurchasedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'TicketPurchased',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchGeoChallengeTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchGeoChallengeTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchGeoChallengeUriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchGeoChallengeUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'Unpaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchGeoChallengeUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"WinnerClaimed"`
 */
export const useWatchGeoChallengeWinnerClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'WinnerClaimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeAbi}__ and `eventName` set to `"WinnerDeclared"`
 */
export const useWatchGeoChallengeWinnerDeclaredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeAbi,
    eventName: 'WinnerDeclared',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeProxyAbi}__
 */
export const useWatchGeoChallengeProxyEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: geoChallengeProxyAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link geoChallengeProxyAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchGeoChallengeProxyUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: geoChallengeProxyAbi,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataManagerAbi}__
 */
export const useReadMetadataManager = /*#__PURE__*/ createUseReadContract({
  abi: metadataManagerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataManagerAbi}__ and `functionName` set to `"competitionContract"`
 */
export const useReadMetadataManagerCompetitionContract =
  /*#__PURE__*/ createUseReadContract({
    abi: metadataManagerAbi,
    functionName: 'competitionContract',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataManagerAbi}__ and `functionName` set to `"competitionDescriptions"`
 */
export const useReadMetadataManagerCompetitionDescriptions =
  /*#__PURE__*/ createUseReadContract({
    abi: metadataManagerAbi,
    functionName: 'competitionDescriptions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataManagerAbi}__ and `functionName` set to `"competitionNames"`
 */
export const useReadMetadataManagerCompetitionNames =
  /*#__PURE__*/ createUseReadContract({
    abi: metadataManagerAbi,
    functionName: 'competitionNames',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataManagerAbi}__ and `functionName` set to `"getCompetitionDescription"`
 */
export const useReadMetadataManagerGetCompetitionDescription =
  /*#__PURE__*/ createUseReadContract({
    abi: metadataManagerAbi,
    functionName: 'getCompetitionDescription',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataManagerAbi}__ and `functionName` set to `"getCompetitionMetadata"`
 */
export const useReadMetadataManagerGetCompetitionMetadata =
  /*#__PURE__*/ createUseReadContract({
    abi: metadataManagerAbi,
    functionName: 'getCompetitionMetadata',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataManagerAbi}__ and `functionName` set to `"getCompetitionName"`
 */
export const useReadMetadataManagerGetCompetitionName =
  /*#__PURE__*/ createUseReadContract({
    abi: metadataManagerAbi,
    functionName: 'getCompetitionName',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataManagerAbi}__ and `functionName` set to `"getMultipleMetadata"`
 */
export const useReadMetadataManagerGetMultipleMetadata =
  /*#__PURE__*/ createUseReadContract({
    abi: metadataManagerAbi,
    functionName: 'getMultipleMetadata',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataManagerAbi}__ and `functionName` set to `"hasMetadata"`
 */
export const useReadMetadataManagerHasMetadata =
  /*#__PURE__*/ createUseReadContract({
    abi: metadataManagerAbi,
    functionName: 'hasMetadata',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link metadataManagerAbi}__
 */
export const useWriteMetadataManager = /*#__PURE__*/ createUseWriteContract({
  abi: metadataManagerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link metadataManagerAbi}__ and `functionName` set to `"setCompetitionMetadata"`
 */
export const useWriteMetadataManagerSetCompetitionMetadata =
  /*#__PURE__*/ createUseWriteContract({
    abi: metadataManagerAbi,
    functionName: 'setCompetitionMetadata',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link metadataManagerAbi}__ and `functionName` set to `"updateCompetitionMetadata"`
 */
export const useWriteMetadataManagerUpdateCompetitionMetadata =
  /*#__PURE__*/ createUseWriteContract({
    abi: metadataManagerAbi,
    functionName: 'updateCompetitionMetadata',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link metadataManagerAbi}__
 */
export const useSimulateMetadataManager =
  /*#__PURE__*/ createUseSimulateContract({ abi: metadataManagerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link metadataManagerAbi}__ and `functionName` set to `"setCompetitionMetadata"`
 */
export const useSimulateMetadataManagerSetCompetitionMetadata =
  /*#__PURE__*/ createUseSimulateContract({
    abi: metadataManagerAbi,
    functionName: 'setCompetitionMetadata',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link metadataManagerAbi}__ and `functionName` set to `"updateCompetitionMetadata"`
 */
export const useSimulateMetadataManagerUpdateCompetitionMetadata =
  /*#__PURE__*/ createUseSimulateContract({
    abi: metadataManagerAbi,
    functionName: 'updateCompetitionMetadata',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link metadataManagerAbi}__
 */
export const useWatchMetadataManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: metadataManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link metadataManagerAbi}__ and `eventName` set to `"MetadataSet"`
 */
export const useWatchMetadataManagerMetadataSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: metadataManagerAbi,
    eventName: 'MetadataSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link metadataManagerAbi}__ and `eventName` set to `"MetadataUpdated"`
 */
export const useWatchMetadataManagerMetadataUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: metadataManagerAbi,
    eventName: 'MetadataUpdated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeCalculationManagerAbi}__
 */
export const useReadPrizeCalculationManager =
  /*#__PURE__*/ createUseReadContract({ abi: prizeCalculationManagerAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeCalculationManagerAbi}__ and `functionName` set to `"calculateNoWinnerDistribution"`
 */
export const useReadPrizeCalculationManagerCalculateNoWinnerDistribution =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeCalculationManagerAbi,
    functionName: 'calculateNoWinnerDistribution',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeCalculationManagerAbi}__ and `functionName` set to `"calculateParticipantPrizeNoWinner"`
 */
export const useReadPrizeCalculationManagerCalculateParticipantPrizeNoWinner =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeCalculationManagerAbi,
    functionName: 'calculateParticipantPrizeNoWinner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeCalculationManagerAbi}__ and `functionName` set to `"calculateTreasurySplit"`
 */
export const useReadPrizeCalculationManagerCalculateTreasurySplit =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeCalculationManagerAbi,
    functionName: 'calculateTreasurySplit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeCalculationManagerAbi}__ and `functionName` set to `"calculateWinnerPrize"`
 */
export const useReadPrizeCalculationManagerCalculateWinnerPrize =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeCalculationManagerAbi,
    functionName: 'calculateWinnerPrize',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeCalculationManagerAbi}__ and `functionName` set to `"getParticipantPercentage"`
 */
export const useReadPrizeCalculationManagerGetParticipantPercentage =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeCalculationManagerAbi,
    functionName: 'getParticipantPercentage',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeCalculationManagerAbi}__ and `functionName` set to `"getWinnerPercentage"`
 */
export const useReadPrizeCalculationManagerGetWinnerPercentage =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeCalculationManagerAbi,
    functionName: 'getWinnerPercentage',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeCalculationManagerAbi}__ and `functionName` set to `"shouldDistributeNoWinnerPrizes"`
 */
export const useReadPrizeCalculationManagerShouldDistributeNoWinnerPrizes =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeCalculationManagerAbi,
    functionName: 'shouldDistributeNoWinnerPrizes',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizeCalculationManagerAbi}__
 */
export const useWritePrizeCalculationManager =
  /*#__PURE__*/ createUseWriteContract({ abi: prizeCalculationManagerAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizeCalculationManagerAbi}__ and `functionName` set to `"calculateParticipantPrizeWithWinner"`
 */
export const useWritePrizeCalculationManagerCalculateParticipantPrizeWithWinner =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizeCalculationManagerAbi,
    functionName: 'calculateParticipantPrizeWithWinner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizeCalculationManagerAbi}__
 */
export const useSimulatePrizeCalculationManager =
  /*#__PURE__*/ createUseSimulateContract({ abi: prizeCalculationManagerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizeCalculationManagerAbi}__ and `functionName` set to `"calculateParticipantPrizeWithWinner"`
 */
export const useSimulatePrizeCalculationManagerCalculateParticipantPrizeWithWinner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizeCalculationManagerAbi,
    functionName: 'calculateParticipantPrizeWithWinner',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizeCalculationManagerAbi}__
 */
export const useWatchPrizeCalculationManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: prizeCalculationManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizeCalculationManagerAbi}__ and `eventName` set to `"NoWinnerPrizeDistribution"`
 */
export const useWatchPrizeCalculationManagerNoWinnerPrizeDistributionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizeCalculationManagerAbi,
    eventName: 'NoWinnerPrizeDistribution',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeManagerAbi}__
 */
export const useReadPrizeManager = /*#__PURE__*/ createUseReadContract({
  abi: prizeManagerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"GRACE_PERIOD"`
 */
export const useReadPrizeManagerGracePeriod =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeManagerAbi,
    functionName: 'GRACE_PERIOD',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"PARTICIPANT_PERCENT"`
 */
export const useReadPrizeManagerParticipantPercent =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeManagerAbi,
    functionName: 'PARTICIPANT_PERCENT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"WINNER_PERCENT"`
 */
export const useReadPrizeManagerWinnerPercent =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeManagerAbi,
    functionName: 'WINNER_PERCENT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"calculatePotentialPrizes"`
 */
export const useReadPrizeManagerCalculatePotentialPrizes =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeManagerAbi,
    functionName: 'calculatePotentialPrizes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"claimableBalances"`
 */
export const useReadPrizeManagerClaimableBalances =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeManagerAbi,
    functionName: 'claimableBalances',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"getClaimableBalance"`
 */
export const useReadPrizeManagerGetClaimableBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeManagerAbi,
    functionName: 'getClaimableBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"getParticipantPrizePerTicket"`
 */
export const useReadPrizeManagerGetParticipantPrizePerTicket =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeManagerAbi,
    functionName: 'getParticipantPrizePerTicket',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"isPrizeCalculated"`
 */
export const useReadPrizeManagerIsPrizeCalculated =
  /*#__PURE__*/ createUseReadContract({
    abi: prizeManagerAbi,
    functionName: 'isPrizeCalculated',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizeManagerAbi}__
 */
export const useWritePrizeManager = /*#__PURE__*/ createUseWriteContract({
  abi: prizeManagerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"addToClaimableBalance"`
 */
export const useWritePrizeManagerAddToClaimableBalance =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizeManagerAbi,
    functionName: 'addToClaimableBalance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"calculatePrizes"`
 */
export const useWritePrizeManagerCalculatePrizes =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizeManagerAbi,
    functionName: 'calculatePrizes',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"claimParticipantPrize"`
 */
export const useWritePrizeManagerClaimParticipantPrize =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizeManagerAbi,
    functionName: 'claimParticipantPrize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"claimWinnerPrize"`
 */
export const useWritePrizeManagerClaimWinnerPrize =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizeManagerAbi,
    functionName: 'claimWinnerPrize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"withdrawBalance"`
 */
export const useWritePrizeManagerWithdrawBalance =
  /*#__PURE__*/ createUseWriteContract({
    abi: prizeManagerAbi,
    functionName: 'withdrawBalance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizeManagerAbi}__
 */
export const useSimulatePrizeManager = /*#__PURE__*/ createUseSimulateContract({
  abi: prizeManagerAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"addToClaimableBalance"`
 */
export const useSimulatePrizeManagerAddToClaimableBalance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizeManagerAbi,
    functionName: 'addToClaimableBalance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"calculatePrizes"`
 */
export const useSimulatePrizeManagerCalculatePrizes =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizeManagerAbi,
    functionName: 'calculatePrizes',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"claimParticipantPrize"`
 */
export const useSimulatePrizeManagerClaimParticipantPrize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizeManagerAbi,
    functionName: 'claimParticipantPrize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"claimWinnerPrize"`
 */
export const useSimulatePrizeManagerClaimWinnerPrize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizeManagerAbi,
    functionName: 'claimWinnerPrize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link prizeManagerAbi}__ and `functionName` set to `"withdrawBalance"`
 */
export const useSimulatePrizeManagerWithdrawBalance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: prizeManagerAbi,
    functionName: 'withdrawBalance',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizeManagerAbi}__
 */
export const useWatchPrizeManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: prizeManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizeManagerAbi}__ and `eventName` set to `"BalanceWithdrawn"`
 */
export const useWatchPrizeManagerBalanceWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizeManagerAbi,
    eventName: 'BalanceWithdrawn',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizeManagerAbi}__ and `eventName` set to `"ParticipantPrizeClaimed"`
 */
export const useWatchPrizeManagerParticipantPrizeClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizeManagerAbi,
    eventName: 'ParticipantPrizeClaimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizeManagerAbi}__ and `eventName` set to `"PrizeCalculated"`
 */
export const useWatchPrizeManagerPrizeCalculatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizeManagerAbi,
    eventName: 'PrizeCalculated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link prizeManagerAbi}__ and `eventName` set to `"PrizeClaimed"`
 */
export const useWatchPrizeManagerPrizeClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: prizeManagerAbi,
    eventName: 'PrizeClaimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link proofValidatorAbi}__
 */
export const useReadProofValidator = /*#__PURE__*/ createUseReadContract({
  abi: proofValidatorAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link proofValidatorAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useReadProofValidatorEip712Domain =
  /*#__PURE__*/ createUseReadContract({
    abi: proofValidatorAbi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link proofValidatorAbi}__ and `functionName` set to `"getCompletionProofTypeHash"`
 */
export const useReadProofValidatorGetCompletionProofTypeHash =
  /*#__PURE__*/ createUseReadContract({
    abi: proofValidatorAbi,
    functionName: 'getCompletionProofTypeHash',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link proofValidatorAbi}__ and `functionName` set to `"getDomainSeparator"`
 */
export const useReadProofValidatorGetDomainSeparator =
  /*#__PURE__*/ createUseReadContract({
    abi: proofValidatorAbi,
    functionName: 'getDomainSeparator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link proofValidatorAbi}__ and `functionName` set to `"getExpectedDigest"`
 */
export const useReadProofValidatorGetExpectedDigest =
  /*#__PURE__*/ createUseReadContract({
    abi: proofValidatorAbi,
    functionName: 'getExpectedDigest',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link proofValidatorAbi}__ and `functionName` set to `"isProofUsed"`
 */
export const useReadProofValidatorIsProofUsed =
  /*#__PURE__*/ createUseReadContract({
    abi: proofValidatorAbi,
    functionName: 'isProofUsed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link proofValidatorAbi}__ and `functionName` set to `"usedProofs"`
 */
export const useReadProofValidatorUsedProofs =
  /*#__PURE__*/ createUseReadContract({
    abi: proofValidatorAbi,
    functionName: 'usedProofs',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link proofValidatorAbi}__ and `functionName` set to `"validateProofView"`
 */
export const useReadProofValidatorValidateProofView =
  /*#__PURE__*/ createUseReadContract({
    abi: proofValidatorAbi,
    functionName: 'validateProofView',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link proofValidatorAbi}__
 */
export const useWriteProofValidator = /*#__PURE__*/ createUseWriteContract({
  abi: proofValidatorAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link proofValidatorAbi}__ and `functionName` set to `"validateProof"`
 */
export const useWriteProofValidatorValidateProof =
  /*#__PURE__*/ createUseWriteContract({
    abi: proofValidatorAbi,
    functionName: 'validateProof',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link proofValidatorAbi}__
 */
export const useSimulateProofValidator =
  /*#__PURE__*/ createUseSimulateContract({ abi: proofValidatorAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link proofValidatorAbi}__ and `functionName` set to `"validateProof"`
 */
export const useSimulateProofValidatorValidateProof =
  /*#__PURE__*/ createUseSimulateContract({
    abi: proofValidatorAbi,
    functionName: 'validateProof',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link proofValidatorAbi}__
 */
export const useWatchProofValidatorEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: proofValidatorAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link proofValidatorAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useWatchProofValidatorEip712DomainChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: proofValidatorAbi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__
 */
export const useReadQueryManager = /*#__PURE__*/ createUseReadContract({
  abi: queryManagerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__ and `functionName` set to `"checkCompetitionHealth"`
 */
export const useReadQueryManagerCheckCompetitionHealth =
  /*#__PURE__*/ createUseReadContract({
    abi: queryManagerAbi,
    functionName: 'checkCompetitionHealth',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__ and `functionName` set to `"competitionContract"`
 */
export const useReadQueryManagerCompetitionContract =
  /*#__PURE__*/ createUseReadContract({
    abi: queryManagerAbi,
    functionName: 'competitionContract',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__ and `functionName` set to `"competitionStorage"`
 */
export const useReadQueryManagerCompetitionStorage =
  /*#__PURE__*/ createUseReadContract({
    abi: queryManagerAbi,
    functionName: 'competitionStorage',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__ and `functionName` set to `"getActiveCompetitions"`
 */
export const useReadQueryManagerGetActiveCompetitions =
  /*#__PURE__*/ createUseReadContract({
    abi: queryManagerAbi,
    functionName: 'getActiveCompetitions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__ and `functionName` set to `"getCompetitionStats"`
 */
export const useReadQueryManagerGetCompetitionStats =
  /*#__PURE__*/ createUseReadContract({
    abi: queryManagerAbi,
    functionName: 'getCompetitionStats',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__ and `functionName` set to `"getCompetitionsByState"`
 */
export const useReadQueryManagerGetCompetitionsByState =
  /*#__PURE__*/ createUseReadContract({
    abi: queryManagerAbi,
    functionName: 'getCompetitionsByState',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__ and `functionName` set to `"getContractHealth"`
 */
export const useReadQueryManagerGetContractHealth =
  /*#__PURE__*/ createUseReadContract({
    abi: queryManagerAbi,
    functionName: 'getContractHealth',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__ and `functionName` set to `"getExpiredCompetitions"`
 */
export const useReadQueryManagerGetExpiredCompetitions =
  /*#__PURE__*/ createUseReadContract({
    abi: queryManagerAbi,
    functionName: 'getExpiredCompetitions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__ and `functionName` set to `"getMultipleCompetitions"`
 */
export const useReadQueryManagerGetMultipleCompetitions =
  /*#__PURE__*/ createUseReadContract({
    abi: queryManagerAbi,
    functionName: 'getMultipleCompetitions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__ and `functionName` set to `"getPaginatedCompetitions"`
 */
export const useReadQueryManagerGetPaginatedCompetitions =
  /*#__PURE__*/ createUseReadContract({
    abi: queryManagerAbi,
    functionName: 'getPaginatedCompetitions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__ and `functionName` set to `"getTotalValueLocked"`
 */
export const useReadQueryManagerGetTotalValueLocked =
  /*#__PURE__*/ createUseReadContract({
    abi: queryManagerAbi,
    functionName: 'getTotalValueLocked',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link queryManagerAbi}__ and `functionName` set to `"getUserTicketStatus"`
 */
export const useReadQueryManagerGetUserTicketStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: queryManagerAbi,
    functionName: 'getUserTicketStatus',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link queryManagerAbi}__
 */
export const useWatchQueryManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: queryManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link queryManagerAbi}__ and `eventName` set to `"BulkQueryExecuted"`
 */
export const useWatchQueryManagerBulkQueryExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: queryManagerAbi,
    eventName: 'BulkQueryExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link queryManagerAbi}__ and `eventName` set to `"HealthCheckExecuted"`
 */
export const useWatchQueryManagerHealthCheckExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: queryManagerAbi,
    eventName: 'HealthCheckExecuted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketRendererAbi}__
 */
export const useReadTicketRenderer = /*#__PURE__*/ createUseReadContract({
  abi: ticketRendererAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketRendererAbi}__ and `functionName` set to `"generateTokenURI"`
 */
export const useReadTicketRendererGenerateTokenUri =
  /*#__PURE__*/ createUseReadContract({
    abi: ticketRendererAbi,
    functionName: 'generateTokenURI',
  })
