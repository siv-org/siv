// Beginning of an algorithm to calculate max burst.
// Goal is to use this to see the highest # of votes submitted in a 60 window, 10 second window, 1 second etc.

function calculateMaxBurst(timestamps: number[], windowSize: number): number {
  // Initialize variables
  let startIdx = 0
  let endIdx = 0
  let currentBurst = 1
  let maxBurst = 1

  // Iterate over the timestamps
  while (endIdx < timestamps.length) {
    // Check if the current timestamp is within the window
    if (timestamps[endIdx] - timestamps[startIdx] <= windowSize) {
      currentBurst++
      endIdx++
    } else {
      // Update the max burst if necessary
      if (currentBurst > maxBurst) {
        maxBurst = currentBurst
      }
      // Slide the window forward by one timestamp
      currentBurst--
      startIdx++
    }
  }

  // Update the max burst if necessary for the last window
  if (currentBurst > maxBurst) {
    maxBurst = currentBurst
  }

  // Return the max burst
  return maxBurst
}
