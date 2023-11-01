import { ethers, toBigInt } from "ethers";
import CONTRACT from "../_contracts/Staking.json";
import TOKENCONTRACT from "../_contracts/Token.json";
import { formatEther } from "ethers";
import processMetadata from "./processMetadata";
import formatAmount from "./formatAmount";

// creates an instance of the provider
const getProvider = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider;
};

// creates an instance of the signer
const getSigner = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer;
};

// gets the address of the connected user
const getAddress = async () => {
  const signer = await getSigner();
  return signer.address;
};

// Object that houses the details for the apps availabble networks and their respective contracts and rpc urls
const contracts = {
  Canto: {
    stakingContract: process.env.NEXT_PUBLIC_CANTO_CONTRACT_ADDRESS,
    tokenContract: process.env.NEXT_PUBLIC_CANTO_TOKEN_CONTRACT_ADDRESS,
    rpcURL: "https://canto-testnet.plexnode.wtf",
  },
  Matic: {
    stakingContract: process.env.NEXT_PUBLIC_MATIC_CONTRACT_ADDRESS,
    tokenContract: process.env.NEXT_PUBLIC_MATIC_TOKEN_CONTRACT_ADDRESS,
    rpcURL: "https://endpoints.omniatech.io/v1/matic/mumbai/public",
  },
  Ethereum: {
    stakingContract: process.env.NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS,
    tokenContract: process.env.NEXT_PUBLIC_ETHEREUM_TOKEN_CONTRACT_ADDRESS,
    rpcURL: "https://goerli.infura.io/v3/feabfe61cc34425dae943b13d19d6f07",
  },
};

// creates an instance of the contract object for the staking contract of the network the user is connected to
const getContract = async () => {
  const network = await determineNetwork();
  const signer = await getSigner();
  const contract = new ethers.Contract(
    contracts[network].stakingContract,
    CONTRACT.abi,
    signer
  );
  return contract;
};

// creates an instance of the contract object with a Json RPC provider. contract view functions can be called without being connected
const getContractJson = async (network) => {
  const rpcURL = contracts[network].rpcURL;

  // Creates an ethers.js provider using the JSON-RPC URL
  const provider = new ethers.JsonRpcProvider(rpcURL);

  // Creates a contract instance
  const contract = new ethers.Contract(
    contracts[network].stakingContract,
    CONTRACT.abi,
    provider
  );
  return contract;
};

// creates an instance of the contract object for the token contract of the network the user is connected to
const getTokenContract = async () => {
  const network = await determineNetwork();
  const signer = await getSigner();
  const contract = new ethers.Contract(
    contracts[network].tokenContract,
    TOKENCONTRACT.abi,
    signer
  );
  return contract;
};

// returns a string of the network the user is connected to
const determineNetwork = async () => {
  const provider = await getProvider();
  const network = await provider.getNetwork();

  var networkName;

  if (network.name === "goerli") {
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

/**
 *
 * @param {*} network the network the user wants to connect to
 */
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
        chainId: "0x5", // Chain ID for Ethereum mainnet
        chainName: "Goerli",
        nativeCurrency: {
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: [
          "https://goerli.infura.io/v3/feabfe61cc34425dae943b13d19d6f07",
        ],
        blockExplorerUrls: ["https://goerli.etherscan.io/"], // Goerli block explorer URL
      },
      Matic: {
        chainId: "0x13881",
        chainName: "Matic Mumbai",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: ["https://rpc-mumbai.maticvigil.com"], // Matic mumbai RPC URL
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"], // Matic block explorer URL
      },
    };

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Networks[network].chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [Networks[network]],
        });
      }
    }
  } else {
    console.log("No metamask provider");
  }
};

/**
 *
 * @param {*} network the network whichs frontend data you want to get
 * @returns the frontend data {isSuper, superMultiplier, dayAmount, weekAmount, totalStaked, winningAmounts, winningTokens,}
 */
const getFrontendData = async (network) => {
  const contract = await getContractJson(network);
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

/**
 * @notice gets the detials for the next draw
 * @returns an object with the draw details for each netowrk available on the app
 */
const getDrawDetails = async () => {
  const cantoData = await getFrontendData("Canto");
  const ethereumData = await getFrontendData("Ethereum");
  const maticData = await getFrontendData("Matic");
  const data = { Canto: cantoData, Ethereum: ethereumData, Matic: maticData };

  const networkList = ["Canto", "Ethereum", "Matic"];
  const colors = { Canto: "#01e186", Ethereum: "#3e8fff", Matic: "#a46dff" };
  const list = networkList.map((item) => {
    return {
      token: item,
      deposit: formatAmount(parseFloat(formatEther(data[item].totalStaked))),
      totalStaked: formatAmount(
        parseFloat(formatEther(data[item].totalStaked))
      ),
      daily: formatAmount(parseFloat(formatEther(data[item].dayAmount))),
      super: formatAmount(parseFloat(formatEther(data[item].weekAmount))),
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

// Returns an array of the last 12 draw winners
const getRecentWindfalls = async () => {
  const cantoData = await getFrontendData("Canto");
  const ethereumData = await getFrontendData("Ethereum");
  const maticData = await getFrontendData("Matic");
  const data = { Canto: cantoData, Ethereum: ethereumData, Matic: maticData };

  const networkList = ["Canto", "Ethereum", "Matic"];

  const contract = await getContractJson("Canto");
  const recentWindfalls = [];

  const drawCounter = await contract.drawCounter();

  for (let i = 0; i < 4; i++) {
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

    for (let j = 0; j < networkList.length; j++) {
      let item = {
        chain: networkList[j],
        title: titleType,
        date: formattedDate,
        nft: `${networkList[j][0]}-${data[networkList[j]].winningTokens[i]}`,
        amount: formatAmount(
          parseFloat(formatEther(data[networkList[j]].winningAmounts[i]))
        ),
      };
      recentWindfalls.push(item);
    }
  }
  return recentWindfalls;
};

/**
 * @notice Connects the users wallet to the app
 * @returns an object with the chain the user is connected to and the nfts/deposits they have on that network
 */
const connect = async () => {
  var data = {};
  const address = await getAddress();
  const network = await determineNetwork();
  if (network !== "Other") {
    const contract = await getContract();
    const tokenContract = await getTokenContract();
    const tokens = await tokenContract.getTokensOfOwner(address);

    // Converts the uint[] returned to a normal array of numbers
    const numberArray = tokens.map((value) => Number(value));

    data.address = address;
    data.tokens = [];
    for (var i = 0; i < numberArray.length; i++) {
      const tokenMetaData = await contract.getMetadata(numberArray[i]);
      var tokenRewards = await contract.checkRewards(numberArray[i]);
      tokenRewards = ethers.formatUnits(tokenRewards, "ether");
      tokenRewards = formatAmount(parseFloat(tokenRewards));
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

// Returns the users total balance on the connected network minus enough for 3 gas fees on that network
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

/**
 * @notice calls the staking contracts deposit method
 * @param {*} amount the amount of tokens the user whiches to deposit
 */
const depositTokens = async (amount) => {
  const contract = await getContract();

  try {
    const etherAmount = ethers.parseEther(amount);

    // Call the function and pass Ether
    const tx = await contract.stake({ value: etherAmount });

    // Wait for the transaction to be mined
    await tx.wait();
    return true;
  } catch {
    return false;
  }
};

/**
 * @notice calls the staking contracts startUnstake method
 * @param {*} _tokenId the id for the nft/deposit the user which to start unstaking
 */
const startUnStake = async (_tokenId) => {
  const contract = await getContract();

  try {
    const tx = await contract.startUnstake(_tokenId);

    // Wait for the transaction to be mined
    await tx.wait();
    return true;
  } catch {
    return false;
  }
};

/**
 * @notice calls the token contracts approve method before calling the staking contracts unstake method
 * @param {*} _tokenId the id for the nft/deposit the user which to unstake
 */
const unstake = async (_tokenId) => {
  const network = await determineNetwork();
  const tokenContract = await getTokenContract();
  const contract = await getContract();

  try {
    const approvalTx = await tokenContract.approve(
      contracts[network].stakingContract,
      _tokenId
    );

    await approvalTx.wait();

    const unstakeTx = await contract.unstake(_tokenId);

    await unstakeTx.wait();

    return true;
  } catch {
    return false;
  }
};

/**
 * @notice calls the staking contracts claimRewards method
 * @param {*} _tokenId the id for the nft/deposit the user whiches to claim rewards for
 */
const claimRewards = async (_tokenId) => {
  const contract = await getContract();

  try {
    const claimTx = await contract.claimRewards(_tokenId);

    await claimTx.wait();

    return true;
  } catch {
    return false;
  }
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
