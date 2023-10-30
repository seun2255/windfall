import { ethers } from "ethers";
import formatAmount from "./formatAmount";

/**
 *
 * @param {*} dataString The string returned from the getMetadata contract function
 * @returns an object with the NFTS metadata
 */
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
    result["stakingAmount"] = formatAmount(parseFloat(amountInEthers));

    return result;
  } catch (error) {
    console.error("Error parsing contract data:", error);
    return {}; // Return an empty object on error
  }
}

export default processMetadata;
