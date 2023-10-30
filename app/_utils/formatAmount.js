//Formats an amount to have 2 d.p for numbers > 1, 3 d.p for numbers < 1 but > 0.001 and returns 0 for amounts
// less than 0.001
const formatAmount = (total) => {
  let formattedTotal;

  if (total >= 1) {
    formattedTotal = total.toFixed(2); // Format to 2 decimal places for values greater than or equal to 1
  } else if (total >= 0.001) {
    formattedTotal = total.toFixed(3); // Format to 3 decimal places for values between 0.001 and 1
  } else {
    formattedTotal = "0"; // Return "0" for values less than 0.001
  }

  return formattedTotal;
};

export default formatAmount;
