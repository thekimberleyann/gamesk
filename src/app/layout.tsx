/**
 * Layout Notes
 * Author: Kimberley Gonzalez
 * Created: December 2025
 * Version: 1.0
 */


import "./globals.css";

export const metadata = {
  title: "Chad's Games", /*What shows on the tab*/
  description: "Chad's Christmas Gift",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" flex flex-col items-center justify-center">
        {children}
      </body>
    </html>
  );
}