"use client";

import Image from "next/image";
import styles from "./index.module.css";
import { setWalletModal, setNetworkModal } from "@/app/_redux/modals";
import { login } from "@/app/_redux/user";
import { setAppData } from "@/app/_redux/app";
import { useDispatch, useSelector } from "react-redux";
import formatEthereumAddress from "@/app/_utils/formatAddress";
import icons from "@/app/_assets/icons/icons";
import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";
import { switchNetwork, connect } from "@/app/_utils/contract";

export default function Header() {
  const { user, connected } = useSelector((state) => state.user);
  const { chain } = useSelector((state) => state.app);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const dispatch = useDispatch();

  const colors = { Canto: "#01e186", Ethereum: "#3e8fff", Matic: "#a46dff" };
  const networks = ["Canto", "Ethereum", "Matic"];

  const popUpEffect = useSpring({
    opacity: optionsOpen ? 1 : 0,
    config: { duration: 300 },
  });

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
  };

  return (
    <div className={styles.main}>
      <div className={styles.nav}>
        <div className={styles.logo}>
          W
          <span>
            <div className={styles.flower}>
              <Image src={"/img/common/flower.png"} alt="logo" fill />
            </div>
            I
          </span>
          NDFALL
        </div>
        {chain !== "Other" ? (
          <button
            className={styles.wallet__connect__button}
            onClick={() =>
              connected
                ? setOptionsOpen(!optionsOpen)
                : dispatch(setWalletModal(true))
            }
          >
            {connected && (
              <div
                className={styles.outer__circle}
                style={{
                  border: `1.5px solid ${colors[chain]}`,
                }}
                onClick={() => setOptionsOpen(!optionsOpen)}
              >
                <div className={styles.icon}>
                  <Image
                    src={icons[chain.toLowerCase()]}
                    alt="token icon"
                    fill
                  />
                </div>
                {optionsOpen && (
                  <animated.div className={styles.networks} style={popUpEffect}>
                    {networks.map((network, id) => {
                      if (network !== chain) {
                        return (
                          <div
                            className={styles.network__outer__circle}
                            key={id}
                            style={{
                              border: `1.5px solid ${colors[network]}`,
                            }}
                            onClick={() => handleSelect(network)}
                          >
                            <div className={styles.icon}>
                              <Image
                                src={icons[network.toLowerCase()]}
                                alt="token icon"
                                fill
                              />
                            </div>
                          </div>
                        );
                      }
                    })}
                  </animated.div>
                )}
              </div>
            )}
            {connected ? formatEthereumAddress(user.address) : "Connect"}
          </button>
        ) : (
          <button
            className={styles.wrong__netowrk}
            onClick={() => dispatch(setNetworkModal(true))}
          >
            Wrong Network
          </button>
        )}
      </div>
    </div>
  );
}
