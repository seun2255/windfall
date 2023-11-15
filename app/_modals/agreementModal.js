"use client";

import styles from "./agreementModal.module.css";
import { useState, useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";

// Component for both the deposit agreement and Unstake agreement Modals
export default function AgreementModal(props) {
  // the type variable determines which agreement the modal shows, it is either stake or unstake
  const { type, handleDeposit, handleUnstake, setModal } = props;
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

  // Closes the modal and initates the deposit / unstake transaction
  const handleClick = (e) => {
    e.stopPropagation();
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
            {/* Checks the type of the modal and then displays the associated agreemtent text */}
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
