import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'

import { adminValidationManager_ABI } from './src/abi/adminValidationManager_ABI'
import { boosterBoxManager_ABI } from './src/abi/boosterBoxManager_ABI'
import { competitionLifecycleManager_ABI } from './src/abi/competitionLifecycleManager_ABI'
import { competitionManager_ABI } from './src/abi/competitionManager_ABI'
import { geoChallenge_implementation_ABI } from './src/abi/geoChallenge_implementation_ABI'
import { geoChallenge_proxy_ABI } from './src/abi/geoChallenge_proxy_ABI'
import { metadataManager_ABI } from './src/abi/metadataManager_ABI'
import { prizeCalculationManager_ABI } from './src/abi/prizeCalculationManager_ABI'
import { prizeManager_ABI } from './src/abi/prizeManager_ABI'
import { proofValidator_ABI } from './src/abi/proofValidator_ABI'
import { queryManager_ABI } from './src/abi/queryManager_ABI'
import { ticketRenderer_ABI } from './src/abi/ticketRenderer_ABI'

/**
 * @title Wagmi CLI Configuration
 * @notice Auto-generates TypeScript hooks and types from ABIs
 * @dev Run: npx wagmi generate
 */
export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'GeoChallenge',
      abi: geoChallenge_implementation_ABI,
    },
    {
      name: 'GeoChallengeProxy',
      abi: geoChallenge_proxy_ABI,
    },
    {
      name: 'AdminValidationManager',
      abi: adminValidationManager_ABI,
    },
    {
      name: 'BoosterBoxManager',
      abi: boosterBoxManager_ABI,
    },
    {
      name: 'CompetitionLifecycleManager',
      abi: competitionLifecycleManager_ABI,
    },
    {
      name: 'CompetitionManager',
      abi: competitionManager_ABI,
    },
    {
      name: 'MetadataManager',
      abi: metadataManager_ABI,
    },
    {
      name: 'PrizeCalculationManager',
      abi: prizeCalculationManager_ABI,
    },
    {
      name: 'PrizeManager',
      abi: prizeManager_ABI,
    },
    {
      name: 'ProofValidator',
      abi: proofValidator_ABI,
    },
    {
      name: 'QueryManager',
      abi: queryManager_ABI,
    },
    {
      name: 'TicketRenderer',
      abi: ticketRenderer_ABI,
    },
  ],
  plugins: [react()],
})
