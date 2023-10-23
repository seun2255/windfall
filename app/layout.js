"use client";

import "./globals.css";
import { store } from "./_redux/store";
import { Provider } from "react-redux";

export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Provider>
  );
}
