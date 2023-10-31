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
import { connect, det } from "../_utils/contract";
import { login } from "../_redux/user";
import { setAppData } from "../_redux/app";

export default function ConnectWalletModal(props) {
  const { depositModal } = useSelector((state) => state.modals);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  // react spring animation
  const popUpEffect = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 300 },
  });

  // Initiates the pop up animation
  useEffect(() => {
    setOpen(true);
  }, []);

  // Toggles the first checkbox
  const handleCheckBox1 = () => {
    setChecked1(!checked1);
  };

  // Toggles the second checkbox
  const handleCheckBox2 = () => {
    setChecked2(!checked2);
  };

  /**
   * @notice Checks if the checkboxes are ticked and then Connects the users wallet to the app
   * @notice adds an event listener that listens for when the user manually changes their network, upon network change the app updates
   */
  const handleConnect = async () => {
    // If a second checkbox is added change this to if(checked1 && checked2)
    if (checked1) {
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

      window.ethereum.on("networkChanged", async () => {
        const data = await connect();
        const colors = {
          Canto: "#01e186",
          Ethereum: "#3e8fff",
          Matic: "#a46dff",
        };
        dispatch(setAppData({ color: colors[data.chain], chain: data.chain }));
        if (data.chain === "Other") {
          dispatch(login({ address: "", deposits: [] }));
          dispatch(setDepositModal(false));
          dispatch(setWalletModal(false));
          dispatch(setNetworkModal(true));
        } else {
          dispatch(login({ address: data.address, deposits: data.tokens }));
          dispatch(setWalletModal(false));
        }
      });

      // This event is triggered when the active account is changed
      window.ethereum.on("accountsChanged", async (accounts) => {
        const data = await connect();
        dispatch(setAppData({ color: colors[data.chain], chain: data.chain }));
        dispatch(login({ address: data.address, deposits: data.tokens }));
      });
    }
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        if (depositModal) {
          dispatch(setDepositModal(false));
        }
        dispatch(setWalletModal(false));
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

        {/* First Term */}
        <div className={styles.terms}>
          <div
            className={styles.bubble}
            onClick={handleCheckBox1}
            style={
              checked1
                ? { backgroundColor: "#01e186", borderColor: "#009358" }
                : null
            }
          ></div>
          <span className={styles.text}>
            By connecting a wallet, I have read and agree to Windfall’s{" "}
            <span>Terms of Use</span>, <span>Risks</span>,{" "}
            <span>Cookies Policy</span>, use of <span>3rd party services</span>,
            and <span>Privacy Policy</span>.
          </span>
        </div>

        {/* Second term (remove the style below on line 121 to show this) */}
        <div className={styles.terms} style={{ display: "none" }}>
          <div
            className={styles.bubble}
            onClick={handleCheckBox2}
            style={
              checked2
                ? {
                    backgroundColor: "#01e186",
                    borderColor: "#009358",
                  }
                : null
            }
          ></div>
          <span className={styles.text}>
            By connecting a wallet, I have read and agree to Windfall’s{" "}
            <span>Terms of Use</span>, <span>Risks</span>,{" "}
            <span>Cookies Policy</span>, use of <span>3rd party services</span>,
            and <span>Privacy Policy</span>.
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
