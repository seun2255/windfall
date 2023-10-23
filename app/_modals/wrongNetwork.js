"use client";

import Image from "next/image";
import styles from "./wrongNetwork.module.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { animated, useSpring } from "@react-spring/web";
import { setDepositModal, setNetworkModal } from "../_redux/modals";
import { setAppData } from "../_redux/app";
import { login } from "../_redux/user";
import icons from "../_assets/icons/icons";
import { switchNetwork, connect } from "../_utils/contract";

export default function NetworkModal(props) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const popUpEffect = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 300 },
  });

  useEffect(() => {
    setOpen(true);
  }, []);

  const options = [
    { text: "Canto", icon: icons.canto },
    { text: "Ethereum", icon: icons.ethereum },
    { text: "Matic", icon: icons.matic },
  ];

  const handleSelect = async (network) => {
    await switchNetwork(network);
    const data = await connect();
    const colors = {
      Canto: "#01e186",
      Ethereum: "#3e8fff",
      Matic: "#a46dff",
    };
    dispatch(setAppData({ color: colors[data.chain], chain: data.chain }));
    dispatch(login({ address: data.address, deposits: data.tokens }));
    dispatch(setNetworkModal(false));
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setNetworkModal(false));
      }}
    >
      <animated.div
        className={styles.main}
        style={popUpEffect}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setNetworkModal(true));
        }}
      >
        <h2 className={styles.title}>Wrong Network</h2>
        <p className={styles.details}>
          Your wallet is currently selected on a network that Windfall does not
          support. Please connect to one of the following networks:
        </p>
        <div className={styles.gradient__border}>
          <button
            className={styles.change__button}
            onClick={() => setMenuOpen(true)}
            // style={
            //   menuOpen
            //     ? {
            //         background:
            //           "linear-gradient(180deg, rgba(58, 137, 163, 0.00) 0%, rgba(10, 48, 61, 0.42) 100%)",
            //       }
            //     : null
            // }
          >
            <span style={{ color: "#ff3e3e" }}>CHANGE NETWORK</span>
            {menuOpen &&
              options.map((option) => {
                return (
                  <span
                    className={styles.option}
                    id={styles[option.text]}
                    onClick={() => handleSelect(option.text)}
                  >
                    <div className={styles.token__icon}>
                      <Image src={option.icon} alt="icon" fill />
                    </div>
                    {option.text}
                  </span>
                );
              })}
          </button>
        </div>
      </animated.div>
    </div>
  );
}
