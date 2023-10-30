// Formats the users wallet address to the format in the header connect button
function formatEthereumAddress(address) {
  // Check if the address is a valid Ethereum address
  if (!/^(0x)?[0-9a-fA-F]{40}$/.test(address)) {
    console.error("Invalid Ethereum address");
    return null; // Return null for an invalid address
  }

  // Format the address with "0x" at the beginning and the last 4 characters
  const formattedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

  return formattedAddress;
}

export default formatEthereumAddress;
