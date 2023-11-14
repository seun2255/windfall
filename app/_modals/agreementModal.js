"use client";

import styles from "./agreementModal.module.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { animated, useSpring } from "@react-spring/web";
import { setContractFailModal } from "../_redux/modals";

export default function AgreementModal(props) {
  const { type, handleDeposit, handleUnstake, setModal } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  // react spring animation
  const popUpEffect = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 300 },
  });

  // Initiates the pop up animation
  useEffect(() => {
    setOpen(true);
  }, []);

  // Toggles the checkbox
  const handleCheckBox = () => {
    setChecked(!checked);
  };

  const handleClick = () => {
    if (checked) {
      setModal(false);
      type === "stake" ? handleDeposit() : handleUnstake();
    }
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        setModal(false);
      }}
    >
      <animated.div
        className={styles.main}
        style={popUpEffect}
        onClick={(e) => {
          e.stopPropagation();
          setModal(true);
        }}
      >
        <h2 className={styles.title}>Before we begin...</h2>
        <div className={styles.terms}>
          <div
            className={styles.bubble}
            onClick={handleCheckBox}
            style={
              checked
                ? { backgroundColor: "#01e186", borderColor: "#009358" }
                : null
            }
          ></div>
          <span className={styles.text}>
            {type === "stake"
              ? `I understand that my selected tokens will be 
                withdrawn from my wallet and will require a 
                mandatory unstaking period before they’re able 
                to be withdrawn.`
              : `I understand that my selected tokens will 
                 undergo a mandatory unstaking period before 
                 they’re able to be withdrawn. During this time, 
                 they will be ineligible to win.`}
          </span>
        </div>
        <div className={styles.gradient__border}>
          <button
            className={styles.change__button}
            onClick={() => handleClick()}
            style={{ color: "#ffffff" }}
          >
            <span>CONTINUE</span>
          </button>
        </div>
      </animated.div>
    </div>
  );
}
