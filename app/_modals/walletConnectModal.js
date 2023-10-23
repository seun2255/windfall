"use client";

import icons from "../_assets/icons/icons";
import styles from "./walletConnectModal.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "@react-spring/web";
import {
  setWalletModal,
  setDepositModal,
  setNetworkModal,
} from "../_redux/modals";
import { connect } from "../_utils/contract";
import { login } from "../_redux/user";
import { setAppData } from "../_redux/app";

export default function ConnectWalletModal(props) {
  const { depositModal } = useSelector((state) => state.modals);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  const popUpEffect = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 300 },
  });

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleCheckBox = () => {
    344;
    setChecked(!checked);
  };

  const handleConnect = async () => {
    if (checked) {
      const data = await connect();
      const colors = {
        Canto: "#01e186",
        Ethereum: "#3e8fff",
        Matic: "#a46dff",
      };
      dispatch(setAppData({ color: colors[data.chain], chain: data.chain }));
      if (data.chain === "Other") {
        dispatch(setWalletModal(false));
        dispatch(setNetworkModal(true));
      } else {
        dispatch(login({ address: data.address, deposits: data.tokens }));
        dispatch(setWalletModal(false));
      }
    }
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        if (depositModal) {
          dispatch(setDepositModal(false));
          dispatch(setWalletModal(false));
        }
      }}
    >
      <animated.div
        className={styles.main}
        style={popUpEffect}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setWalletModal(true));
        }}
      >
        <h3 className={styles.title}>Connect your wallet</h3>
        <div className={styles.terms}>
          <div
            className={styles.bubble}
            onClick={handleCheckBox}
            style={
              checked
                ? { backgroundColor: "#01e186", borderColor: "#01e186" }
                : null
            }
          ></div>
          <span className={styles.text}>
            By connecting a wallet, I have read and agree to Windfall’s Terms of
            Use, Risks, Cookies Policy, use of 3rd party services, and Privacy
            Policy.
          </span>
        </div>
        <div className={styles.gradient__border} onClick={handleConnect}>
          <button className={styles.connect__button}>
            <div className={styles.metamask__icon}>
              <Image src={icons.metamask} alt="metamask icon" fill />
            </div>
            Metamask
          </button>
        </div>
      </animated.div>
    </div>
  );
}
