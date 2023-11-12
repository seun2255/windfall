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

//A functional component that serves as a UI block in the app, This is the main and default page of the app
export default function Main() {
  // Teh state of the varoius modals retrieved from the redux stores modals slice
  const { walletModal, depositModal, networkModal } = useSelector(
    (state) => state.modals
  );
  const [hydrate, setHydrate] = useState(false);

  // The dispatch function is used to call the various actions from the redux store
  const dispatch = useDispatch();

  // Retrieves all the frontend data from the blockcahin before rendering the app
  useEffect(() => {
    const getData = async () => {
      const details = await getDrawDetails();
      const recentWindfalls = await getRecentWindfalls();
      // Dispatching the setDrawDetails action in the redux app slice
      dispatch(setDrawDetails(details));
      // Dispatching the setRecentWindfalls action in the redux app slice
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
