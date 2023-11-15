"use client";

import styles from "./contractFailModal.module.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { animated, useSpring } from "@react-spring/web";
import { setContractFailModal } from "../_redux/modals";

export default function ContractFailModal(props) {
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

  // Closes the ContractFail modal
  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(setContractFailModal(false));
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setContractFailModal(false));
      }}
    >
      <animated.div
        className={styles.main}
        style={popUpEffect}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setContractFailModal(true));
        }}
      >
        <h2 className={styles.title}>Contract Failed</h2>
        <p className={styles.details}>
          Uh oh! The contract failed to execute correctly.
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
