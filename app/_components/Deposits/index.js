"use client";

import Image from "next/image";
import styles from "./index.module.css";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import DepositBox from "./depositBox";
import { useEffect } from "react";

export default function Deposits() {
  const dispatch = useDispatch();
  const { chain, color } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state.user);

  // Displays only if the user is connected, is on a correct network and has deposit NFTS
  if (chain != "other" && user.address && user.deposits.length !== 0) {
    return (
      <div className={styles.main}>
        <h2>
          Your{" "}
          <span className={styles.chain} style={{ color: color }}>
            {chain.toUpperCase()}
          </span>{" "}
          Deposits
        </h2>
        <div className={styles.deposits}>
          {user.deposits.map((deposit, id) => {
            return <DepositBox data={deposit} key={id} />;
          })}
        </div>
      </div>
    );
  }
}
