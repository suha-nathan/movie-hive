import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import "../embla.css";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MovieHive",
  description: "A NextJS movie social media Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/images/favicon.ico" sizes="any" />
        </head>
        <body className={inter.className}>
          <Topbar />
          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            {/* <RightSidebar /> */}
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
