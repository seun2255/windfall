const formatAmount = (total) => {
  let formattedTotal;

  if (total >= 100) {
    formattedTotal = Math.floor(total); // Remove decimals for values greater than or equal to 100
  } else if (total >= 1) {
    formattedTotal = total.toFixed(2); // Format to 2 decimal places for values between 1 and 99.99
  } else if (total >= 0.001) {
    formattedTotal = total.toFixed(3); // Format to 3 decimal places for values between 0.001 and 0.999
  } else {
    formattedTotal = "0"; // Return "0" for values less than 0.001
  }

  return formattedTotal;
};

export default formatAmount;
