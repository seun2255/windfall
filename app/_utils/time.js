// Determines the times until the next draw (3pm PST)
function getTimeTillNextDraw() {
  // Create a date object for the current date
  const now = new Date();

  // Sets the target time to 3pm PST
  const targetTime = new Date(now);
  targetTime.setUTCHours(23, 0, 0, 0); // 23:00:00 UTC is equivalent to 3pm PST

  // Calculate the time difference in milliseconds
  let timeDifference = targetTime - now;

  // If the target time is in the past, adds 24 hours
  if (timeDifference < 0) {
    timeDifference += 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // Create a new Date object for the future time
  const futureTime = new Date(now.getTime() + timeDifference);

  return futureTime;
}

// Checks if a stake is valid (i.e it has passed its buffer period)
function stakeValid(timestampString, unstakeTimestamp) {
  // Converts the string timestamp to a number (integer)
  const timestamp = parseInt(timestampString, 10);

  if (isNaN(timestamp)) {
    console.error("Invalid timestamp string");
    return false; // Returns false in case of an invalid timestamp
  }

  const now = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
  const twoMinutesInSeconds = 120; // 2 minutes in seconds

  if (now >= timestamp + twoMinutesInSeconds && unstakeTimestamp === "0") {
    return true;
  } else {
    return false;
  }
}

function calculateTimeDifferenceFromTimestamp(timestampString) {
  // Converts the string timestamp to a number (integer)
  const timestamp = parseInt(timestampString, 10);

  // Calculates the current Unix timestamp in milliseconds
  const currentTimestamp = new Date().getTime();

  const timeDifference = currentTimestamp - timestamp * 1000; // Converts timestamp to milliseconds

  // Calculates the time remaining until 2 minutes have passed
  const timeRemaining = Math.max(0, 2 * 60 * 1000 - timeDifference);

  return timeRemaining; // Time remaining in milliseconds
}

// Calculates how long the unstake buffer period remains
function calculateUnstakePeriod(timestamp) {
  // Convert the timestamp string to a number (integer)
  const timestampNumber = parseInt(timestamp, 10);

  if (isNaN(timestampNumber)) {
    console.error("Invalid timestamp string");
    return 0; // Return 0 for an invalid input
  }

  // Get the current Unix timestamp in seconds
  const currentTimestamp = Math.ceil(Date.now() / 1000);

  // Calculate the difference in minutes
  const minutesPassed = Math.ceil((currentTimestamp - timestampNumber) / 60);

  var daysLeft = 24 - minutesPassed;
  daysLeft = daysLeft <= 0 ? 0 : daysLeft;

  return daysLeft;
}

export {
  getTimeTillNextDraw,
  stakeValid,
  calculateUnstakePeriod,
  calculateTimeDifferenceFromTimestamp,
};
