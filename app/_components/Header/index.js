"use client";

import Image from "next/image";
import styles from "./index.module.css";
import { setWalletModal } from "@/app/_redux/modals";
import { useDispatch, useSelector } from "react-redux";
import formatEthereumAddress from "@/app/_utils/formatAddress";
import icons from "@/app/_assets/icons/icons";

export default function Header() {
  const { user, connected } = useSelector((state) => state.user);
  const { chain } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const colors = { Canto: "#01e186", ETHEREUM: "#3e8fff", MATIC: "#a46dff" };

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
            onClick={() => dispatch(setWalletModal(true))}
          >
            {connected && (
              <div
                className={styles.outer__circle}
                style={
                  chain === "Canto"
                    ? { border: `1px solid ${colors[chain]}` }
                    : null
                }
              >
                <div className={styles.icon}>
                  <Image
                    src={icons[chain.toLowerCase()]}
                    alt="token icon"
                    fill
                  />
                </div>
              </div>
            )}
            {connected ? formatEthereumAddress(user.address) : "Connect"}
          </button>
        ) : (
          <button className={styles.wrong__netowrk}>Wrong Network</button>
        )}
      </div>
    </div>
  );
}
