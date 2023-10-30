"use client";

import Image from "next/image";
import styles from "./depositBox.module.css";
import icons from "../../_assets/icons/icons";
import {
  stakeValid,
  calculateUnstakePeriod,
  calculateTimeDifferenceFromTimestamp,
} from "@/app/_utils/time";
import { useEffect, useState } from "react";
import { setDrawDetails } from "@/app/_redux/app";
import { useSelector, useDispatch } from "react-redux";
import calculatePercentage from "@/app/_utils/calculatePercentage";
import { getDrawDetails } from "@/app/_utils/contract";
import {
  ClaimRewardButton,
  NoRewardButton,
  UnstakeBufferPeriodButton,
  UnstakeButton,
  FinishUnstakingButton,
} from "./Buttons/buttons";

export default function DepositBox(props) {
  const { data } = props;
  const dispatch = useDispatch();
  const { chain, color, drawDetails } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state.user);
  const [active, setActive] = useState(true);
  const [hasRewards, setHasRewards] = useState(false);
  const [unstaking, setUnstaking] = useState(false);
  const [unstakingBufferPeriod, setUnstakingBufferPeriod] = useState(true);
  const [percentage, setPercentage] = useState("");

  //Array of variables that make the box rerender with the latest state upon changing
  const dependencyArray = [
    user.deposits,
    drawDetails.Canto.totalStaked,
    drawDetails.Matic.totalStaked,
    drawDetails.Ethereum.totalStaked,
  ];

  // Updates the box with the latest state once an action takes place e.g startunstake, claim rewards e.t.c
  useEffect(() => {
    const percent = calculatePercentage(
      data.stakingAmount,
      drawDetails[chain].totalStaked
    );
    setPercentage(percent);
    const isValid = stakeValid(data.stakeTimestamp, data.unstakeTimestamp);
    setActive(isValid);
    const timeTillActive = calculateTimeDifferenceFromTimestamp(
      data.stakeTimestamp
    );
    if (timeTillActive !== 0) {
      setTimeout(async () => {
        const details = await getDrawDetails();
        dispatch(setDrawDetails(details));
        setActive(true);
      }, timeTillActive + 5000);
    }
    data.reward == "0" ? setHasRewards(false) : setHasRewards(true);
    data.unstakeTimestamp !== "0"
      ? setUnstakingBufferPeriod(true)
      : setUnstakingBufferPeriod(false);
    data.unstakeTimestamp !== "0" ? setUnstaking(true) : setUnstaking(false);
  }, dependencyArray);

  return (
    <div className={styles.main}>
      <div className={styles.details}>
        <div className={styles.amount__details}>
          <div className={styles.token} style={{ color: color }}>
            <div className={styles.token__icon}>
              <Image src={icons[chain.toLowerCase()]} alt="canto logo" fill />
            </div>
            {chain.toUpperCase()}
          </div>
          <div className={styles.amount}>
            {data.stakingAmount}
            {active && <span>{percentage}</span>}
          </div>
        </div>
        <div className={styles.status__details}>
          <div className={styles.status}>
            <div
              className={styles.dot}
              style={{
                backgroundColor: !unstakingBufferPeriod
                  ? active
                    ? "#33de2f"
                    : "#7B7B7B"
                  : "#7B7B7B",
              }}
            ></div>
            <span className={styles.status__text}>
              {!unstakingBufferPeriod
                ? active
                  ? "Live"
                  : "Inactive"
                : "Inactive"}
            </span>
          </div>
          <span>{data.id}</span>
        </div>
      </div>
      <div className={styles.buttons}>
        {hasRewards ? (
          <ClaimRewardButton data={data} chain={chain} />
        ) : (
          <NoRewardButton />
        )}
        {unstakingBufferPeriod ? (
          <UnstakeBufferPeriodButton
            token={data}
            setUnstakingBufferPeriod={setUnstakingBufferPeriod}
          />
        ) : unstaking ? (
          <FinishUnstakingButton token={data} />
        ) : (
          <UnstakeButton
            data={data}
            setUnstakingBufferPeriod={setUnstakingBufferPeriod}
            showBuffer={setUnstaking}
            setActive={setActive}
          />
        )}
      </div>
    </div>
  );
}
