import "./globals.css";

export const metadata = { title: "SportsEdge", description: "AI sports research. Live odds. Real edges." };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
