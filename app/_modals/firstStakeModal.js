"use client";

import Link from "next/link";
import styles from "./firstStakeModal.module.css";
import { useState, useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";
import { setFirstStakeModal } from "../_redux/modals";
import { useDispatch } from "react-redux";

export default function FirstStakeModal() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  // react spring animation
  const popUpEffect = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 300 },
  });

  // Initiates the pop up animation
  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(setFirstStakeModal(false));
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setFirstStakeModal(false));
      }}
    >
      <animated.div
        className={styles.main}
        style={popUpEffect}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setFirstStakeModal(true));
        }}
      >
        <h2 className={styles.title}>You did it! Now what?</h2>
        <div className={styles.terms__container}>
          <div className={styles.terms}>
            <div
              className={styles.bubble}
              style={{ backgroundColor: "#4DFF5F", borderColor: "#007D14" }}
            ></div>
            <span className={styles.text}>
              Come back each day to see if you’ve won!
            </span>
          </div>
          <div className={styles.terms}>
            <div
              className={styles.bubble}
              style={{ backgroundColor: "#4DFF5F", borderColor: "#007D14" }}
            ></div>
            <span className={styles.text}>
              <Link
                href={
                  "https://app.gitbook.com/o/kJtfy5OqPfuA6aeBb99F/s/p4yUSk23AubmL5kX5Stz/"
                }
                target="_blank"
              >
                <span className={styles.colored}>Add</span>
              </Link>{" "}
              the Windfall NFT contract to your wallet.{" "}
            </span>
          </div>
          <div className={styles.terms}>
            <div
              className={styles.bubble}
              style={{ backgroundColor: "#4DFF5F", borderColor: "#007D14" }}
            ></div>
            <span className={styles.text}>
              <span className={styles.colored}>Borrow</span> against your NFT as
              collateral.
            </span>
          </div>
          <div className={styles.terms}>
            <div
              className={styles.bubble}
              style={{ backgroundColor: "#4DFF5F", borderColor: "#007D14" }}
            ></div>
            <span className={styles.text}>
              Add tokens on one of our other{" "}
              <span className={styles.colored}>supported chains.</span>
            </span>
          </div>
        </div>
        <div className={styles.gradient__border}>
          <button
            className={styles.change__button}
            onClick={(e) => handleClick(e)}
            style={{ color: "#ffffff" }}
          >
            <span>DISMISS</span>
          </button>
        </div>
      </animated.div>
    </div>
  );
}
