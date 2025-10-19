export const metadata = {
  title: "Spacebitch v2",
  description: "An emotionally intelligent AI companion built with reasoning, logic, and memory.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{
        backgroundColor: "#0d0d0d",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        transition: "opacity 1s ease-in-out"
      }}>
        {children}
      </body>
    </html>
  );
}
