"use client";

import Image from "next/image";
import styles from "./errorModal.module.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { animated, useSpring } from "@react-spring/web";
import { setErrorModal } from "../_redux/modals";

export default function ErrorModal(props) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  // react spring animation
  const popUpEffect = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 300 },
  });

  // Initiates the pop up animation
  useEffect(() => {
    setOpen(true);
  }, []);

  // Closes the Error Modal
  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(setErrorModal(false));
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setErrorModal(false));
      }}
    >
      <animated.div
        className={styles.main}
        style={popUpEffect}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setErrorModal(true));
        }}
      >
        <h2 className={styles.title}>Error</h2>
        <p className={styles.details}>
          We ran into an unexpected error. Please try again later.
        </p>
        <div className={styles.gradient__border}>
          <button
            className={styles.change__button}
            onClick={(e) => handleClick(e)}
            style={{ color: "#ffffff" }}
          >
            <span>CONTINUE</span>
          </button>
        </div>
      </animated.div>
    </div>
  );
}
