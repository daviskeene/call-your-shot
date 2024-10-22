import React from "react";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={{
        width: "90vw",
        paddingBottom: "4rem",
      }}
    >
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            <Header />
          </div>
        </div>
      </header>
      <main className="flex-1 w-full">
        <div
          className="container mx-auto"
          style={{
            minHeight: "calc(100vh - 4rem)",
            padding: "0",
          }}
        >
          {children}
        </div>
      </main>
      <footer className="mt-8">
        Made with ❤️ by{" "}
        <a
          target="_blank"
          href="https://daviskeene.com"
          style={{
            color: "#4F46E5",
            textDecoration: "none",
          }}
        >
          Davis Keene
        </a>
      </footer>
    </div>
  );
};

export default Layout;
