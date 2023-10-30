// Calculates the percentage of the total staked
function calculatePercentage(amount, totalAmount) {
  const totalStaked = parseFloat(totalAmount);
  const percentage = (parseFloat(amount) / totalAmount) * 100;
  const formattedPercentage = percentage.toFixed(2);

  return formattedPercentage >= 0.01 ? `${formattedPercentage}%` : "<0.00%";
}

export default calculatePercentage;
