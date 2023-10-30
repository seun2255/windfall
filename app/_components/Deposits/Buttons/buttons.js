import { useState, useEffect } from "react";
import styles from "./buttons.module.css";
import {
  claimRewards,
  unstake,
  startUnStake,
  connect,
  getDrawDetails,
} from "@/app/_utils/contract";
import { setDrawDetails } from "@/app/_redux/app";
import { calculateUnstakePeriod } from "@/app/_utils/time";
import { useDispatch } from "react-redux";
import { updateUser } from "@/app/_redux/user";

// Claim rewards button
function ClaimRewardButton(props) {
  const { data, chain } = props;
  const [claiming, setClaiming] = useState(false);
  const dispatch = useDispatch();

  // Claims the users rewards and reloads the deposit boxes with the new state from the blockchain
  const handleClaimRewards = async () => {
    setClaiming(true);
    const result = await claimRewards(data.tokenId);
    if (result) {
      const details = await connect();
      setClaiming(false);
      dispatch(
        updateUser({ address: details.address, deposits: details.tokens })
      );
    } else {
      setClaiming(false);
    }
  };

  return (
    <button
      className={styles.claim__reward}
      onClick={handleClaimRewards}
      style={claiming ? { color: "#01854F", background: "white" } : null}
    >
      {claiming
        ? `Claiming ${data.reward} ${chain.toUpperCase()}`
        : `Claim Reward: ${data.reward} ${chain.toUpperCase()}`}
    </button>
  );
}

// No rewards button
function NoRewardButton() {
  const [clicked, setClicked] = useState(false);

  // sets the state of the button to clicked and sets a timeout that reverts it back to its original state after 3 seconds
  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 3000);
  };

  return (
    <button
      className={styles.no__reward}
      onClick={handleClick}
      style={{ color: clicked ? "white" : null }}
    >
      {clicked ? "No Rewards To Claim" : "Claim Reward: 0"}
    </button>
  );
}

// Unstake buffer period button
function UnstakeBufferPeriodButton(props) {
  const { token, setUnstakingBufferPeriod } = props;
  const [timeleft, setTimeLeft] = useState(24);

  useEffect(() => {
    // calculates how much time is left for the unstake period and sets the unstake button to false when the unstake period is over
    const intervalFunction = () => {
      const period = calculateUnstakePeriod(token.unstakeTimestamp);
      if (period === 0) setUnstakingBufferPeriod(false);
      setTimeLeft(period);
    };

    // Runs the function initially when the component mounts
    intervalFunction();

    // Sets up an interval to run the function every 1 minute (60,000 milliseconds)
    const intervalId = setInterval(intervalFunction, 60000);

    // Cleans up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  });

  return <button className={styles.action}>{`${timeleft} Days Left`}</button>;
}

// Finish Unstaking Button
function FinishUnstakingButton(props) {
  const { token } = props;
  const [withdrawing, setWithdrawing] = useState(false);
  const dispatch = useDispatch();

  // Completes the unstake process and sets the state of the button to withdrawing
  const handleClick = async () => {
    setWithdrawing(true);
    const result = await unstake(token.tokenId);
    if (result) {
      const data = await connect();
      setWithdrawing(false);
      dispatch(updateUser({ address: data.address, deposits: data.tokens }));
    } else {
      setWithdrawing(false);
    }
  };

  return (
    <button
      className={styles.action}
      onClick={handleClick}
      style={
        !withdrawing
          ? { color: "white", backgroundColor: "rgba(255, 62, 62, 0.30)" }
          : null
      }
    >
      {withdrawing ? (
        <span>
          Withdrawing<span className={styles.blink}>...</span>
        </span>
      ) : (
        "Finish Unstaking"
      )}
    </button>
  );
}

// Unstake Button
function UnstakeButton(props) {
  const [unstaking, setUnstaking] = useState(false);
  const { setUnstakingBufferPeriod, showBuffer, data } = props;
  const dispatch = useDispatch();

  // Starts the unstaking buffer period
  const handleUnstake = async () => {
    if (data.unstakeTimestamp == "0") {
      setUnstaking(true);
      const result = await startUnStake(data.tokenId);
      if (result) {
        const drawDetails = await getDrawDetails();
        dispatch(setDrawDetails(drawDetails));
        setUnstakingBufferPeriod(true);
        showBuffer(true);
        const details = await connect();
        dispatch(
          updateUser({ address: details.address, deposits: details.tokens })
        );
      } else {
        setUnstaking(false);
      }
    }
  };

  return (
    <button
      className={styles.action}
      onClick={handleUnstake}
      style={
        unstaking
          ? { color: "white", backgroundColor: "rgba(255, 62, 62, 1)" }
          : null
      }
    >
      {unstaking ? (
        <span>
          Unstaking<span className={styles.blink}>...</span>
        </span>
      ) : (
        "Unstake"
      )}
    </button>
  );
}

export {
  ClaimRewardButton,
  NoRewardButton,
  UnstakeBufferPeriodButton,
  FinishUnstakingButton,
  UnstakeButton,
};
