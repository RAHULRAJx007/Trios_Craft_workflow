import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950">
        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}