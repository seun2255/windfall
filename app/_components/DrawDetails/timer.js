"use client";

import React, { useState, useEffect } from "react";
import styles from "./index.module.css";

function CountdownTimer({ targetTime }) {
  const [timeLeft, setTimeLeft] = useState(targetTime - new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTimeLeft = targetTime - new Date();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        clearInterval(intervalId);
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  // Convert milliseconds to hours, minutes, seconds
  const hours = String(Math.floor((timeLeft / 1000 / 3600) % 24)).padStart(
    2,
    "0"
  );
  const minutes = String(Math.floor((timeLeft / 1000 / 60) % 60)).padStart(
    2,
    "0"
  );

  return (
    <div className={styles.timer}>
      <span>{hours}</span>
      <span className={styles.blink}>:</span>
      <span>{minutes}</span>
    </div>
  );
}

export default CountdownTimer;
