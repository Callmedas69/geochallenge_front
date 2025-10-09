/**
 * Test script to debug finalization issue for Competition #2
 */

const competitionId = BigInt(2);
const state = 2; // ENDED
const winnerDeclared = false;
const deadline = BigInt(1728289815); // Oct 7, 2024 9:30:15 AM
const winnerDeclaredAt = BigInt(0);

// Constants from contract
const GRACE_PERIOD = 86400; // 24 hours in seconds
const NO_WINNER_WAIT_PERIOD = 86400; // 1 day in seconds

const now = Math.floor(Date.now() / 1000);

console.log('\n🔍 COMPETITION #2 FINALIZATION DEBUG\n');
console.log('═══════════════════════════════════════════');

console.log('\n📊 Competition Data:');
console.log(`  Competition ID: ${competitionId}`);
console.log(`  State: ${state} (ENDED)`);
console.log(`  Winner Declared: ${winnerDeclared}`);
console.log(`  Deadline: ${new Date(Number(deadline) * 1000).toISOString()}`);
console.log(`  Current Time: ${new Date(now * 1000).toISOString()}`);

console.log('\n⏱️  Wait Period Calculation:');
if (winnerDeclared) {
  const waitPeriodEnd = Number(winnerDeclaredAt) + GRACE_PERIOD;
  const timeRemaining = waitPeriodEnd - now;
  console.log(`  Type: GRACE_PERIOD (Winner Declared)`);
  console.log(`  Duration: ${GRACE_PERIOD}s (24 hours)`);
  console.log(`  Winner Declared At: ${new Date(Number(winnerDeclaredAt) * 1000).toISOString()}`);
  console.log(`  Wait Period Ends: ${new Date(waitPeriodEnd * 1000).toISOString()}`);
  console.log(`  Time Remaining: ${timeRemaining}s`);
  console.log(`  Can Finalize: ${now >= waitPeriodEnd ? '✅ YES' : '❌ NO'}`);
} else {
  const waitPeriodEnd = Number(deadline) + NO_WINNER_WAIT_PERIOD;
  const timeRemaining = waitPeriodEnd - now;
  console.log(`  Type: NO_WINNER_WAIT_PERIOD (No Winner)`);
  console.log(`  Duration: ${NO_WINNER_WAIT_PERIOD}s (1 day)`);
  console.log(`  Deadline: ${new Date(Number(deadline) * 1000).toISOString()}`);
  console.log(`  Wait Period Ends: ${new Date(waitPeriodEnd * 1000).toISOString()}`);
  console.log(`  Time Remaining: ${Math.max(0, timeRemaining)}s (${(Math.max(0, timeRemaining) / 3600).toFixed(2)} hours)`);
  console.log(`  Can Finalize: ${now >= waitPeriodEnd ? '✅ YES' : '❌ NO'}`);
}

console.log('\n🎯 UI Button State Logic:');
const canFinalize = (() => {
  if (state !== 2) {
    console.log('  ❌ State is not ENDED');
    return false;
  }

  if (winnerDeclared) {
    const waitPeriodEnd = Number(winnerDeclaredAt) + GRACE_PERIOD;
    const result = now >= waitPeriodEnd;
    console.log(`  Check: now (${now}) >= waitPeriodEnd (${waitPeriodEnd})`);
    console.log(`  Result: ${result ? '✅ ENABLED' : '❌ DISABLED'}`);
    return result;
  } else {
    const waitPeriodEnd = Number(deadline) + NO_WINNER_WAIT_PERIOD;
    const result = now >= waitPeriodEnd;
    console.log(`  Check: now (${now}) >= waitPeriodEnd (${waitPeriodEnd})`);
    console.log(`  Result: ${result ? '✅ ENABLED' : '❌ DISABLED'}`);
    return result;
  }
})();

console.log('\n═══════════════════════════════════════════');
console.log(`\n${canFinalize ? '✅ FINALIZE BUTTON SHOULD BE ENABLED' : '❌ FINALIZE BUTTON SHOULD BE DISABLED'}\n`);

if (!canFinalize && !winnerDeclared) {
  const waitPeriodEnd = Number(deadline) + NO_WINNER_WAIT_PERIOD;
  const hoursRemaining = (waitPeriodEnd - now) / 3600;
  console.log(`⏰ Button will be enabled in ${hoursRemaining.toFixed(2)} hours`);
  console.log(`   at ${new Date(waitPeriodEnd * 1000).toISOString()}\n`);
}
