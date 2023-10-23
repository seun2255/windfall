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

  if (chain != "other" && user.address) {
    return (
      <div className={styles.main}>
        <h2>
          Your{" "}
          <span className={styles.chain} style={{ color: color }}>
            {chain}
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
