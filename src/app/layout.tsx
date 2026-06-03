import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "นัทช่วยคิด - เครื่องคำนวณเงินอุดหนุนรัฐบาล 60% สูงสุด 200 บาท",
  description: "คำนวณเงินสนับสนุนโครงการรัฐบาล 60% สูงสุดไม่เกิน 200 บาทต่อชิ้น ได้อย่างรวดเร็ว แม่นยำ พร้อมระบบบันทึกประวัติการคำนวณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
