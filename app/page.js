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

  // Retrieves all the frontend data from the blockcahin before rendering the app
  useEffect(() => {
    const getData = async () => {
      const details = await getDrawDetails();
      const recentWindfalls = await getRecentWindfalls();
      dispatch(setDrawDetails(details));
      dispatch(setRecentWindfalls(recentWindfalls));
      setHydrate(true);
    };

    getData();
  });

  // The app is rendered only after the frontend data has been fetched from the backend
  if (hydrate) {
    return (
      <main className={styles.main}>
        {/* Components for the various sections of the app */}
        <Header />
        <DrawDetails />
        <Deposits />
        <RecentWindfalls />
        <Footer />

        {/* The various pop up modals */}
        {walletModal && <ConnectWalletModal />}
        {depositModal && <DepositModal />}
        {networkModal && <NetworkModal />}
      </main>
    );
  }
}
