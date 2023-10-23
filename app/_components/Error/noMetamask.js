"use client";
import styles from "./noMetamask.module.css";

export default function NoMetamask() {
  return (
    <div className={styles.main}>
      <h2>No Wallet Found</h2>
      <p>
        You need to have a wallet like metamask enabled/unlocked to acces this
        site
      </p>
    </div>
  );
}
