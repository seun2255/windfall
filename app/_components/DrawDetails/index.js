"use client";

import Image from "next/image";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import images from "@/app/_assets/img/img";
import icons from "@/app/_assets/icons/icons";
import {
  setWalletModal,
  setDepositModal,
  setNetworkModal,
} from "@/app/_redux/modals";
import CountdownTimer from "./timer";
import { getTimeTillNextDraw } from "@/app/_utils/time";
import { useEffect } from "react";

export default function DrawDetails() {
  const { connected } = useSelector((state) => state.user);
  const { drawDetails, chain } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const timeTillNextDraw = getTimeTillNextDraw();

  //Array of variables that make the app rerender with the latest state upon changing
  const dependencyArray = [
    drawDetails.Canto.totalStaked,
    drawDetails.Matic.totalStaked,
    drawDetails.Ethereum.totalStaked,
  ];

  // UseEffect that rerenders the app anytime one of the dependecies above are changed
  useEffect(() => {}, dependencyArray);

  // opens the deposit modal or network modal if the user is on a wrong network
  const handleDepositClick = () => {
    if (connected) {
      chain === "Other"
        ? dispatch(setNetworkModal(true))
        : dispatch(setDepositModal(true));
    } else {
      dispatch(setWalletModal(true));
      dispatch(setDepositModal(true));
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.background__twirl}>
        <Image src={images.twirl} alt="twirl" fill />
      </div>
      <div className={styles.box}>
        <div className={styles.top}>
          <span>
            <div className={styles.timer__icon}>
              <Image src={icons.timer} alt="timer icon" fill />
            </div>
            Time until next draw
          </span>
          <CountdownTimer targetTime={timeTillNextDraw} />
        </div>
        <table className={styles.display}>
          <thead className={styles.table__head}>
            <tr>
              <th>Token</th>
              <th>Deposits</th>
              <th>Daily</th>
              <th className={styles.last__column}>Super</th>
            </tr>
          </thead>
          <tbody className={styles.table__body}>
            {Object.values(drawDetails).map((item, id) => {
              return (
                <tr className={styles[`row__${id}`]} key={id}>
                  <td>{item.token}</td>
                  <td>{item.deposit}</td>
                  <td>{item.daily}</td>
                  <td className={styles.last__column}>{item.super}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button className={styles.button} onClick={handleDepositClick}>
          DEPOSIT
        </button>

        {/* Background colored ball icons */}
        <div className={styles.ball1}>
          <Image src={images.ball1} alt="ball" fill />
        </div>
        <div className={styles.ball2}>
          <Image src={images.ball2} alt="ball" fill />
        </div>
        <div className={styles.ball3}>
          <Image src={images.ball3} alt="ball" fill />
        </div>
        <div className={styles.ball4}>
          <Image src={images.ball4} alt="ball" fill />
        </div>
        <div className={styles.ball5}>
          <Image src={images.ball5} alt="ball" fill />
        </div>
        <div className={styles.ball6}>
          <Image src={images.ball6} alt="ball" fill />
        </div>
      </div>
    </div>
  );
}
