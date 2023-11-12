"use client";

import "./globals.css";
// The redux store is used for state managemnt
import { store } from "./_redux/store";
import { Provider } from "react-redux";

// The root component for the whole app, sort of like index.js
export default function RootLayout({ children }) {
  // The children object passed into the component and then used in the body tag is the page your rendering,
  // in the case of this app thats just 1 page then thats the page.js

  // The html tag is wrapped in a Provider component. The Provider injects the redux store into the whole app and makes it possible
  // to access the state of the store from all components and pages
  return (
    <Provider store={store}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Provider>
  );
}
