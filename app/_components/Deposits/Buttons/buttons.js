import { useState, useEffect } from "react";
import styles from "./buttons.module.css";
import {
  claimRewards,
  unstake,
  startUnStake,
  connect,
} from "@/app/_utils/contract";
import { calculateUnstakePeriod } from "@/app/_utils/time";
import { useDispatch } from "react-redux";
import { updateUser } from "@/app/_redux/user";

function ClaimRewardButton(props) {
  const { data, chain } = props;
  const [claiming, setClaiming] = useState(false);
  const dispatch = useDispatch();

  const handleClaimRewards = async () => {
    setClaiming(true);
    await claimRewards(data.tokenId);
    const details = await connect();
    setClaiming(false);
    dispatch(
      updateUser({ address: details.address, deposits: details.tokens })
    );
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

function NoRewardButton() {
  const [clicked, setClicked] = useState(false);

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

function UnstakeBufferPeriodButton(props) {
  const { token, setUnstakingBufferPeriod } = props;
  const [timeleft, setTimeLeft] = useState(24);

  useEffect(() => {
    const intervalFunction = () => {
      // Your code to be executed every 1 minute goes here
      console.log(token.unstakeTimestamp);
      const period = calculateUnstakePeriod(token.unstakeTimestamp);
      console.log(period);
      if (period === 0) setUnstakingBufferPeriod(false);
      setTimeLeft(period);
    };

    // Run the function initially when the component mounts
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

function FinishUnstakingButton(props) {
  const { token } = props;
  const [withdrawing, setWithdrawing] = useState(false);
  const dispatch = useDispatch();

  const handleClick = async () => {
    setWithdrawing(true);
    await unstake(token.tokenId);
    const data = await connect();
    setWithdrawing(false);
    dispatch(updateUser({ address: data.address, deposits: data.tokens }));
  };

  return (
    <button
      className={styles.action}
      onClick={handleClick}
      style={
        !withdrawing
          ? { color: "white", backgroundColor: "rgba(255, 62, 62, 1)" }
          : null
      }
    >
      {withdrawing ? "Withdrawing" : "Finish Unstaking"}
    </button>
  );
}

function UnstakeButton(props) {
  const [unstaking, setUnstaking] = useState(false);
  const { setUnstakingBufferPeriod, showBuffer, data } = props;
  const dispatch = useDispatch();

  const handleUnstake = async () => {
    if (data.unstakeTimestamp == "0") {
      setUnstaking(true);
      await startUnStake(data.tokenId);
      setUnstakingBufferPeriod(true);
      showBuffer(true);
      const details = await connect();
      dispatch(
        updateUser({ address: details.address, deposits: details.tokens })
      );
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
      {unstaking ? "Unstaking" : "Unstake"}
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
