"use client";

import icons from "../_assets/icons/icons";
import styles from "./depositModal.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "@react-spring/web";
import { setDepositModal } from "../_redux/modals";
import { setDrawDetails } from "../_redux/app";
import { updateUser } from "../_redux/user";
import {
  getBalanceMinusGas,
  depositTokens,
  connect,
  getDrawDetails,
} from "../_utils/contract";

export default function DepositModal(props) {
  const { chain } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const popUpEffect = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 300 },
  });

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleMax = async () => {
    const maxAmount = await getBalanceMinusGas();
    setAmount(maxAmount);
  };

  const handleDeposit = () => {
    var depositAmount = amount.toString();

    depositTokens(depositAmount).then(async () => {
      const data = await connect();
      dispatch(updateUser({ address: data.address, deposits: data.tokens }));
      dispatch(setDepositModal(false));
    });
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setDepositModal(false));
      }}
    >
      <animated.div
        className={styles.main}
        style={popUpEffect}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setDepositModal(true));
        }}
      >
        <h2 className={styles.title}>Deposit Tokens</h2>
        <div className={styles.gradient__border}>
          <div className={styles.input__box}>
            <div className={styles.token__icon}>
              <Image src={icons[chain.toLowerCase()]} alt="token icon" fill />
            </div>
            <input
              className={styles.input}
              type="number"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              value={amount}
            />
            <button className={styles.max__button} onClick={handleMax}>
              MAX
            </button>
          </div>
        </div>
        <button className={styles.deposit__button} onClick={handleDeposit}>
          Deposit
        </button>
        <span className={styles.info}>
          Looking for a different pool? Change your wallet’s network.{" "}
        </span>
      </animated.div>
    </div>
  );
}
