"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Header from "./_components/Header";
import DrawDetails from "./_components/DrawDetails";
import Deposits from "./_components/Deposits";
import RecentWindfalls from "./_components/Recent";
import ConnectWalletModal from "./_modals/walletConnectModal";
import DepositModal from "./_modals/depositModal";
import Footer from "./_components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { getDrawDetails, getRecentWindfalls } from "./_utils/contract";
import { setDrawDetails, setRecentWindfalls } from "./_redux/app";
import { useEffect, useState } from "react";
import NetworkModal from "./_modals/wrongNetwork";

export default function Home() {
  const { walletModal, depositModal, networkModal } = useSelector(
    (state) => state.modals
  );
  const [hydrate, setHydrate] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const details = await getDrawDetails();
      const recentWindfalls = await getRecentWindfalls();
      console.log(details);
      dispatch(setDrawDetails(details));
      dispatch(setRecentWindfalls(recentWindfalls));
      setHydrate(true);
    };

    getData();
  });

  if (hydrate) {
    return (
      <main className={styles.main}>
        <Header />
        <DrawDetails />
        <Deposits />
        <RecentWindfalls />
        <Footer />
        {walletModal && <ConnectWalletModal />}
        {depositModal && <DepositModal />}
        {networkModal && <NetworkModal />}
      </main>
    );
  }
}
