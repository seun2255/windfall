"use client";

import icons from "../_assets/icons/icons";
import styles from "./depositModal.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "@react-spring/web";
import {
  setContractFailModal,
  setDepositModal,
  setFirstStakeModal,
} from "../_redux/modals";
import { updateUser } from "../_redux/user";
import { getBalanceMinusGas, depositTokens, connect } from "../_utils/contract";
import { useMediaQuery } from "react-responsive";
import AgreementModal from "./agreementModal";

export default function DepositModal(props) {
  const { chain } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [belowMinimum, setBelowMinimum] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [agreementModal, setAgreementModal] = useState(false);

  const isMobile = useMediaQuery({
    query: "(max-width: 662px)",
  });

  // react spring animation
  const popUpEffect = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 300 },
  });

  // Initiates the pop up animation
  useEffect(() => {
    setOpen(true);
  }, []);

  // Sets the input amount to the users total balance minus enough for 2 gas fees
  const handleMax = async () => {
    const maxAmount = await getBalanceMinusGas();
    setAmount(maxAmount);
  };

  // Calls the stake function, if the input amount is below the minimum amount it triggers the below minimum warning
  const handleDeposit = async () => {
    if (amount >= minimumAmounts[chain]) {
      var depositAmount = amount.toString();
      setDepositing(true);

      const result = await depositTokens(depositAmount);
      if (result) {
        const data = await connect();
        dispatch(updateUser({ address: data.address, deposits: data.tokens }));
        const firstStake = data.tokens.length === 1 ? true : false;
        setDepositing(false);
        dispatch(setDepositModal(false));
        setAgreementModal(false);
        if (firstStake) dispatch(setFirstStakeModal(true));
      } else {
        setDepositing(false);
        dispatch(setDepositModal(false));
        setAgreementModal(false);
        dispatch(setContractFailModal(true));
      }
    } else {
      setBelowMinimum(true);
      setTimeout(() => {
        setBelowMinimum(false);
      }, 3000);
    }
  };

  // The minimum amounts for each network, modify to set the minimum amount
  const minimumAmounts = {
    Canto: 0.1,
    Ethereum: 0.001,
    Matic: 0.01,
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setDepositModal(false));
      }}
      style={
        agreementModal
          ? { backdropFilter: "none", backgroundColor: "transparent" }
          : null
      }
    >
      <animated.div
        className={styles.main}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setDepositModal(true));
        }}
        style={agreementModal ? { opacity: 0 } : { popUpEffect }}
      >
        <h2 className={styles.title}>Deposit Tokens</h2>
        <div className={styles.gradient__border}>
          <div className={styles.input__box}>
            <div
              className={styles.token__icon}
              style={
                chain === "Canto"
                  ? isMobile
                    ? { width: "22xp", height: "28px" }
                    : { width: "32xp", height: "31px" }
                  : null
              }
            >
              <Image
                src={icons[`${chain.toLowerCase()}Mobile`]}
                alt="token icon"
                fill
              />
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
        {belowMinimum ? (
          <BelowMinimumButton amount={minimumAmounts[chain]} chain={chain} />
        ) : (
          <button
            className={styles.deposit__button}
            onClick={() => setAgreementModal(true)}
            style={
              depositing
                ? {
                    background: "none",
                    backgroundColor: "white",
                    color: "rgba(30, 86, 104, 1)",
                  }
                : null
            }
          >
            {depositing ? (
              <span>
                Staking<span className={styles.blink}>...</span>
              </span>
            ) : (
              "Deposit"
            )}
          </button>
        )}
        <span className={styles.info}>
          Looking for a different pool? Change your wallet’s network.{" "}
        </span>
      </animated.div>
      {agreementModal && (
        <AgreementModal
          type={"stake"}
          handleDeposit={handleDeposit}
          setModal={setAgreementModal}
        />
      )}
    </div>
  );
}

function BelowMinimumButton(props) {
  const { amount, chain } = props;
  return (
    <button
      className={styles.deposit__button}
      style={{ background: "#952727", color: "white" }}
    >
      Minimum deposit amount is {`${amount} ${chain}`}
    </button>
  );
}
