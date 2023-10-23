"use client";

import Image from "next/image";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import images from "@/app/_assets/img/img";
import icons from "@/app/_assets/icons/icons";
import { setWalletModal, setDepositModal } from "@/app/_redux/modals";
import CountdownTimer from "./timer";
import { getTimeTillNextDraw } from "@/app/_utils/time";

export default function DrawDetails() {
  const { connected } = useSelector((state) => state.user);
  const { drawDetails } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const timeTillNextDraw = getTimeTillNextDraw();

  const handleDepositClick = () => {
    if (connected) {
      dispatch(setDepositModal(true));
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
                  <td>{Math.floor(item.deposit)}</td>
                  <td>{item.daily}</td>
                  <td className={styles.last__column}>{item.super}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button className={styles.button} onClick={handleDepositClick}>
          Deposit
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
