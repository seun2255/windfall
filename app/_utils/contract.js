import { ethers, toBigInt } from "ethers";
import CONTRACT from "../_contracts/Staking.json";
import TOKENCONTRACT from "../_contracts/Token.json";
import { formatEther } from "ethers";
import processMetadata from "./processMetadata";
/**
 * Blockchain Integration
 */
const getProvider = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider;
};

const getSigner = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer;
};

const getAddress = async () => {
  const signer = await getSigner();
  return signer.address;
};

const getContract = async () => {
  const signer = await getSigner();
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    CONTRACT.abi,
    signer
  );
  return contract;
};

const getContractJson = async () => {
  const rpcURL = "https://canto-testnet.plexnode.wtf"; // canto rpc url

  // Creates an ethers.js provider using the JSON-RPC URL
  const provider = new ethers.JsonRpcProvider(rpcURL);

  // Creates a contract instance
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    CONTRACT.abi,
    provider
  );
  return contract;
};

const getTokenContract = async () => {
  const signer = await getSigner();
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS,
    TOKENCONTRACT.abi,
    signer
  );
  return contract;
};

const determineNetwork = async (provider) => {
  const network = await provider.getNetwork();

  var networkName;
  console.log(network.name);

  if (network.name === "mainnet") {
    networkName = "Ethereum";
  } else if (network.name === "matic-mumbai") {
    networkName = "Matic";
  } else if (network.chainId.toString() === "7701") {
    networkName = "Canto";
  } else {
    return "Other";
  }

  return networkName;
};

const switchNetwork = async (network) => {
  if (window.ethereum) {
    const provider = window.ethereum;

    const Networks = {
      Canto: {
        chainId: "0x1E15", // Chain ID for canto testnet
        chainName: "Canto Testnet",
        nativeCurrency: {
          name: "Canto",
          symbol: "CANTO",
          decimals: 18,
        },
        rpcUrls: ["https://canto-testnet.plexnode.wtf"],
        blockExplorerUrls: ["https://testnet.tuber.build/"],
      },
      Ethereum: {
        chainId: "0x1", // Chain ID for Ethereum mainnet
        chainName: "Ethereum Mainnet",
        nativeCurrency: {
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://mainnet.infura.io/v3/"],
        blockExplorerUrls: ["https://etherscan.io/"], // Ethereum block explorer URL
      },
      Matic: {
        chainId: "0x13881", // Chain ID for Matic mainnet
        chainName: "Matic Mumbai",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: ["https://rpc-mumbai.maticvigil.com/"], // Matic mainnet RPC URL
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"], // Matic block explorer URL
      },
    };

    // Add the Matic network to MetaMask
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [Networks[network]],
    });
  } else {
    console.log("MetaMask Ethereum provider not available.");
  }
};

const getFrontendData = async () => {
  const contract = await getContractJson();
  const frontData = await contract.getFrontendData();
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const [
    isSuper,
    superMultiplier,
    dayAmount,
    weekAmount,
    totalStaked,
    winningAmounts,
    winningTokens,
  ] = abiCoder.decode(
    [
      "bool",
      "uint32",
      "uint256",
      "uint256",
      "uint256",
      "uint256[7] memory",
      "uint256[7] memory",
    ],
    frontData
  );
  return {
    isSuper,
    superMultiplier,
    dayAmount,
    weekAmount,
    totalStaked,
    winningAmounts,
    winningTokens,
  };
};

const getDrawDetails = async () => {
  const { dayAmount, weekAmount, totalStaked } = await getFrontendData();
  const networkList = ["CANTO", "Ethereum", "Matic"];
  const colors = { Canto: "#01e186", Ethereum: "#3e8fff", Matic: "#a46dff" };
  const list = networkList.map((item) => {
    return item === "CANTO"
      ? {
          token: item,
          deposit: parseFloat(formatEther(totalStaked)).toPrecision(4),
          totalStaked: parseFloat(formatEther(totalStaked)).toPrecision(4),
          daily: parseFloat(formatEther(dayAmount)).toPrecision(4),
          super: parseFloat(formatEther(weekAmount)).toPrecision(4),
          color: colors[item],
        }
      : {
          token: item,
          deposit: 0,
          daily: 0,
          super: 0,
          color: colors[item],
        };
  });
  const details = {
    Canto: list[0],
    Ethereum: list[1],
    Matic: list[2],
  };

  return details;
};

const getRecentWindfalls = async () => {
  const { winningAmounts, winningTokens } = await getFrontendData();
  const contract = await getContractJson();
  const network = "Canto";
  const recentWindfalls = [];

  const drawCounter = await contract.drawCounter();
  console.log(parseInt(drawCounter));

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date();
    const currentHour = currentDate.getUTCHours();
    const currentMinute = currentDate.getUTCMinutes();
    const targetHour = 15; // 3 PM in PST
    const isPST3pmPassed =
      currentHour > targetHour ||
      (currentHour === targetHour && currentMinute >= 0);

    if (isPST3pmPassed) {
      currentDate.setDate(currentDate.getDate() - i - 1);
    } else {
      currentDate.setDate(currentDate.getDate() - i);
    }

    let formattedDate = currentDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    var titleType = "DAILY";
    if (parseInt(drawCounter) > 0 && (parseInt(drawCounter) - 1 - i) % 7 == 0) {
      titleType = "SUPER";
    }

    let item = {
      chain: network,
      title: titleType,
      date: formattedDate,
      nft: `${network[0]}-${winningTokens[i]}`,
      amount: parseFloat(formatEther(winningAmounts[i])).toPrecision(3),
    };
    recentWindfalls.push(item);
  }
  console.log("Recent Windfalls: ", recentWindfalls);
  return recentWindfalls;
};

const connect = async () => {
  const contract = await getContract();
  const tokenContract = await getTokenContract();

  var data = {};
  const address = await getAddress();
  const provider = await getProvider();
  const network = await determineNetwork(provider);
  if (network !== "Other") {
    const tokens = await tokenContract.getTokensOfOwner(address);

    // Converts the uint[] returned to a normal array of numbers
    const numberArray = tokens.map((value) => Number(value));

    data.address = address;
    data.tokens = [];
    for (var i = 0; i < numberArray.length; i++) {
      const tokenMetaData = await contract.getMetadata(numberArray[i]);
      var tokenRewards = await contract.checkRewards(numberArray[i]);
      tokenRewards = ethers.formatUnits(tokenRewards, "ether");
      tokenRewards = parseFloat(tokenRewards).toFixed(2);
      if (tokenRewards == "0.00") tokenRewards = "0";
      data.tokens[i] = processMetadata(tokenMetaData);
      data.tokens[i]["id"] = `${network[0]}-${numberArray[i]}`;
      data.tokens[i]["tokenId"] = numberArray[i];
      data.tokens[i]["reward"] = tokenRewards;
    }
    data.chain = network;

    return data;
  } else {
    data.tokens = [];
    data.chain = network;

    return data;
  }
};

const getBalanceMinusGas = async () => {
  const address = await getAddress();
  const provider = await getProvider();
  const balance = await provider.getBalance(address);

  // Calculates the gas cost for a basic transaction (You can adjust this as needed)
  const gasPrice = ethers.parseUnits("1", "gwei"); // Adjust the gas price
  const gasLimit = ethers.toBigInt(2100); // Adjust the gas limit
  const gasCost = gasPrice * gasLimit;

  // Calculates the amount minus two gas fees
  const amountMinusGas = balance - gasCost * toBigInt(2);
  var amount = ethers.formatUnits(amountMinusGas, "ether");

  amount = parseFloat(amount).toFixed(6);

  // Checks if the result is positive, return 0 if negative
  if (amount < 0) {
    return 0; // Return 0 wei
  }

  return amount;
};

const depositTokens = async (amount) => {
  const contract = await getContract();

  const etherAmount = ethers.parseEther(amount);

  // Call the function and pass Ether
  const tx = await contract.stake({ value: etherAmount });

  // Wait for the transaction to be mined
  await tx.wait();
};

/**
 * Main Functions
 */

const startUnStake = async (_tokenId) => {
  const contract = await getContract();

  const tx = await contract.startUnstake(_tokenId);

  // Wait for the transaction to be mined
  await tx.wait();
};

const unstake = async (_tokenId) => {
  const tokenContract = await getTokenContract();
  const contract = await getContract();

  const approvalTx = await tokenContract.approve(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    _tokenId
  );

  await approvalTx.wait();

  const unstakeTx = await contract.unstake(_tokenId);

  await unstakeTx.wait();

  return true;
};

const claimRewards = async (_tokenId) => {
  const contract = await getContract();

  const claimTx = await contract.claimRewards(_tokenId);

  await claimTx.wait();
};

export {
  connect,
  getDrawDetails,
  getRecentWindfalls,
  getBalanceMinusGas,
  depositTokens,
  startUnStake,
  unstake,
  claimRewards,
  switchNetwork,
};
