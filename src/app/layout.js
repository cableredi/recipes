import { Suspense } from "react";
import { Roboto, Irish_Grover } from "next/font/google";

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
});

const irish = Irish_Grover({
  subsets: ["latin"],
  variable: "--font-irish",
  weight: ["400"],
});

export const metadata = {
  title: "Recipes",
  description: "Our Best Recipes",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${irish.variable}`}>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
