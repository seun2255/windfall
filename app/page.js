"use client";

import styles from "./page.module.css";
import Header from "./_components/Header";
import DrawDetails from "./_components/DrawDetails";
import Deposits from "./_components/Deposits";
import RecentWindfalls from "./_components/Recent";
import ConnectWalletModal from "./_modals/walletConnectModal";
import DepositModal from "./_modals/depositModal";
import Footer from "./_components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { getContractState } from "./_utils/contract";
import { setDrawDetails, setRecentWindfalls } from "./_redux/app";
import { useEffect, useState } from "react";
import NetworkModal from "./_modals/wrongNetwork";
import ErrorModal from "./_modals/errorModal";
import ContractFailModal from "./_modals/contractFailModal";
import FirstStakeModal from "./_modals/firstStakeModal";

//A functional component that serves as a UI block in the app, This is the main and default page of the app
export default function Main() {
  // Teh state of the varoius modals retrieved from the redux stores modals slice
  const {
    walletModal,
    depositModal,
    networkModal,
    contractFailModal,
    errorModal,
    firstStakeModal,
  } = useSelector((state) => state.modals);
  const [hydrate, setHydrate] = useState(false);

  // The dispatch function is used to call the various actions from the redux store
  const dispatch = useDispatch();

  // Retrieves all the frontend data from the blockcahin before rendering the app
  useEffect(() => {
    const getData = async () => {
      const data = await getContractState();
      console.log("Interval");
      const details = data.drawDetails;
      const recentWindfalls = data.recentWindfalls;
      // Dispatching the setDrawDetails action in the redux app slice
      dispatch(setDrawDetails(details));
      // Dispatching the setRecentWindfalls action in the redux app slice
      dispatch(setRecentWindfalls(recentWindfalls));
      setHydrate(true);
    };

    getData();

    // Sets up an interval to fetch data every 20 seconds
    const intervalId = setInterval(getData, 20000);

    // Clears the interval when the component is unmounted, this ensures that there are no duplicate intervals fetching data
    return () => clearInterval(intervalId);
  }, []);

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
        {contractFailModal && <ContractFailModal />}
        {errorModal && <ErrorModal />}
        {firstStakeModal && <FirstStakeModal />}
      </main>
    );
  }
}
