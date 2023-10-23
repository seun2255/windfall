import { ethers } from "ethers";

function processMetadata(dataString) {
  try {
    const data = JSON.parse(dataString);
    const result = {};

    if (data.attributes && Array.isArray(data.attributes)) {
      data.attributes.forEach((attribute) => {
        const { trait_type, value } = attribute;
        result[trait_type] = value;
      });
    }

    const amountInEthers = ethers.formatUnits(result["stakingAmount"], "ether");
    result["stakingAmount"] = parseFloat(amountInEthers).toFixed(2);

    return result;
  } catch (error) {
    console.error("Error parsing contract data:", error);
    return {}; // Return an empty object on error
  }
}

export default processMetadata;
