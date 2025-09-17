export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>Root layout</header>
        {children}
        <footer>Root layout</footer>
      </body>
    </html>
  );
}
