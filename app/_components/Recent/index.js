"use client";

import Image from "next/image";
import styles from "./index.module.css";
import { useSelector } from "react-redux";

export default function RecentWindfalls() {
  const { recentWindfalls } = useSelector((state) => state.app);

  // App color theme for the different networks
  const colors = { Canto: "#01e186", Ethereum: "#3e8fff", Matic: "#a46dff" };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.title}>
          Recent Windfalls <div className={styles.title__underline}></div>
        </div>

        <table className={styles.display}>
          <thead className={styles.table__head}>
            <tr>
              <th>WINDFALL</th>
              <th>NFT</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody className={styles.table__body}>
            {recentWindfalls.map((item, id) => {
              return (
                <tr
                  className={styles[`row__${id}`]}
                  key={id}
                  style={item.title === "SUPER" ? { color: "#FBFF3E" } : null}
                >
                  <td>
                    <p className={styles.title__mobile}>
                      <span style={{ color: colors[item.chain] }}>
                        {item.chain}
                      </span>{" "}
                      {item.title}
                    </p>
                    <p className={styles.date__mobile}>{item.date}</p>
                  </td>
                  <td>{item.nft}</td>
                  <td>
                    {item.amount}{" "}
                    <span style={{ color: colors[item.chain] }}>
                      {item.chain}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
