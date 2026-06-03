'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Calculator,
  Info,
  Percent,
  Receipt,
  Wallet,
  History,
  Plus,
  Trash2,
  User,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

interface HistoryItem {
  id: string;
  price: number;
  govPays: number;
  userPays: number;
  timestamp: string;
}

export default function Home() {
  const [priceInput, setPriceInput] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load history from localStorage on client side mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('nut_chuay_kid_history');
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        setTimeout(() => {
          setHistory(parsed);
        }, 0);
      } catch (e) {
        console.error('Error parsing history', e);
      }
    }
  }, []);

  // Real-time calculations derived from state
  const price = parseFloat(priceInput) || 0;
  const govPays = Math.min(price * 0.6, 200);
  const userPays = price - govPays;
  const totalValue = price;

  // Save current calculation to history
  const handleSaveCalculation = () => {
    const price = parseFloat(priceInput);
    if (isNaN(price) || price <= 0) return;

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      price: price,
      govPays: govPays,
      userPays: userPays,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [newItem, ...history].slice(0, 10); // Keep last 10 calculations
    setHistory(updatedHistory);
    localStorage.setItem('nut_chuay_kid_history', JSON.stringify(updatedHistory));

    // Show feedback animation
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Delete individual item from history
  const handleDeleteItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('nut_chuay_kid_history', JSON.stringify(updatedHistory));
  };

  // Clear all history
  const handleClearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('nut_chuay_kid_history');
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return val.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans transition-all duration-300">

      {/* Header / TopAppBar */}
      <header className="bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/30 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop h-16 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl tracking-tight text-primary flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-on-tertiary-container animate-pulse" />
              นัทช่วยคิด
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <a
              className="text-primary font-semibold border-b-2 border-primary pb-1 font-label-md text-label-md"
              href="#calculator"
            >
              เครื่องคำนวณ
            </a>
            <a
              className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 font-label-md text-label-md"
              href="#how-it-works"
            >
              วิธีการทำงาน
            </a>
            <a
              className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 font-label-md text-label-md"
              href="#history-section"
            >
              ประวัติการคำนวณ
            </a>
          </nav>

          {/* User Profile / Burger Button */}
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center text-primary p-2 rounded-full hover:bg-surface-variant transition-colors duration-200">
              <User className="w-5 h-5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center text-primary p-2 rounded-lg hover:bg-surface-variant transition-colors duration-200"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-surface border-b border-outline-variant/30 px-6 py-6 shadow-lg flex flex-col gap-4 animate-in slide-in-from-top duration-200">
            <a
              onClick={() => setIsMenuOpen(false)}
              className="text-primary font-semibold text-lg py-2 border-b border-outline-variant/10"
              href="#calculator"
            >
              เครื่องคำนวณ
            </a>
            <a
              onClick={() => setIsMenuOpen(false)}
              className="text-on-surface-variant font-medium text-lg py-2 border-b border-outline-variant/10"
              href="#how-it-works"
            >
              วิธีการทำงาน
            </a>
            <a
              onClick={() => setIsMenuOpen(false)}
              className="text-on-surface-variant font-medium text-lg py-2"
              href="#history-section"
            >
              ประวัติการคำนวณ
            </a>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pb-12">

        {/* Hero Section */}
        <section className="py-12 md:py-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            ผู้ช่วยคำนวณเงินอุดหนุนรัฐบาล
          </div>
          <h1 className="font-bold text-headline-xl-mobile md:text-headline-xl mb-4 text-on-surface tracking-tight leading-tight max-w-4xl mx-auto">
            นัทช่วยคิด ผู้ช่วยคำนวณเงินอุดหนุน
          </h1>
          <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto leading-relaxed">
            คำนวณสิทธิ์เงินอุดหนุนโครงการรัฐบาลแบบทันที ช่วยสนับสนุนค่าใช้จ่าย 60% ของราคาสินค้า จำกัดส่วนลดสูงสุด 200 บาท
          </p>
        </section>

        {/* Bento Layout Calculator & Information */}
        <section id="calculator" className="scroll-mt-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left: Main Calculator Card */}
            <div className={`lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-6 md:p-8 border border-surface-container-high transition-transform duration-300 ${isFocused ? 'scale-[1.01] shadow-[0px_10px_30px_rgba(15,23,42,0.08)]' : ''}`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-secondary-container/50 rounded-lg text-on-secondary-container">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-headline-md">เครื่องคำนวณส่วนลด</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">กรอกราคาสินค้าเพื่อคำนวณสัดส่วนค่าใช้จ่ายของคุณและรัฐบาล</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Input Price Container */}
                <div>
                  <label className="block font-medium text-label-md text-on-surface-variant mb-2" htmlFor="product-price">
                    ราคาสินค้าจริง (บาท)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="product-price"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="0.00"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-4 pr-12 text-headline-sm font-semibold focus:ring-2 focus:ring-on-tertiary-container focus:border-on-tertiary-container outline-none transition-all duration-200"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold text-lg">฿</span>
                  </div>
                </div>

                {/* Subsidies Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gov Portion */}
                  <div className="bg-secondary-container/30 p-5 rounded-lg border border-secondary-container/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-on-secondary-container font-semibold text-label-sm uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Percent className="w-4 h-4 text-on-secondary-container" />
                      รัฐช่วยจ่าย (60%)
                    </p>
                    <div className="flex items-baseline gap-1 text-primary">
                      <span className="font-bold text-headline-md">฿</span>
                      <span className="font-bold text-headline-md" id="gov-pays">{formatCurrency(govPays)}</span>
                    </div>
                    <p className="text-on-surface-variant text-[11px] mt-2 italic flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      จำกัดช่วยเหลือสูงสุดไม่เกิน 200 ฿ต่อรายการ
                    </p>
                  </div>

                  {/* User Portion */}
                  <div className="bg-surface-container p-5 rounded-lg border border-outline-variant/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-outline-variant/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-on-surface-variant font-semibold text-label-sm uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-on-surface-variant" />
                      คุณจ่ายเองจริง
                    </p>
                    <div className="flex items-baseline gap-1 text-on-surface">
                      <span className="font-bold text-headline-md">฿</span>
                      <span className="font-bold text-headline-md" id="user-pays">{formatCurrency(userPays)}</span>
                    </div>
                    <p className="text-on-surface-variant text-[11px] mt-2 italic">
                      ส่วนต่างที่เหลือทั้งหมดหักจากส่วนลดรัฐบาล
                    </p>
                  </div>
                </div>

                {/* Total Value Received Banner */}
                <div className="pt-6 border-t border-outline-variant/40">
                  <div className="flex flex-col md:flex-row justify-between items-center bg-primary-container text-on-primary rounded-xl p-6 md:p-8 gap-4 shadow-md">
                    <div>
                      <p className="text-on-primary-container font-semibold text-label-md tracking-wide">มูลค่าสินค้ารวมที่ได้รับ</p>
                      <p className="text-on-primary-container text-body-sm opacity-80 mt-0.5">ราคาขายหน้าป้ายปกติของสินค้าชิ้นนี้</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-bold text-headline-xl-mobile md:text-headline-xl text-white">฿</span>
                        <span className="font-bold text-headline-xl-mobile md:text-headline-xl text-white" id="total-value">{formatCurrency(totalValue)}</span>
                      </div>
                      <button
                        onClick={handleSaveCalculation}
                        disabled={!priceInput || parseFloat(priceInput) <= 0}
                        className={`p-3 rounded-full flex items-center justify-center transition-all duration-200 ${saveSuccess
                          ? 'bg-emerald-500 text-white scale-105'
                          : 'bg-white hover:bg-surface-container text-primary-container disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed'
                          }`}
                        title="บันทึกประวัติการคำนวณ"
                        aria-label="Save Calculation"
                      >
                        {saveSuccess ? (
                          <span className="text-xs font-semibold px-1">บันทึกแล้ว!</span>
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Side Panel */}
            <div className="lg:col-span-5 flex flex-col gap-6 h-full">

              {/* Dynamic History Component */}
              {history.length > 0 && (
                <div id="history-section" className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-6 border border-surface-container-high scroll-mt-20">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-headline-sm flex items-center gap-2">
                      <History className="w-5 h-5 text-on-surface-variant" />
                      ประวัติการคำนวณล่าสุด
                    </h3>
                    <button
                      onClick={handleClearAllHistory}
                      className="text-error hover:underline text-xs flex items-center gap-1 font-semibold transition-colors duration-200"
                    >
                      ล้างประวัติทั้งหมด
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="bg-surface border border-outline-variant/30 rounded-lg p-3.5 hover:border-on-tertiary-container/30 transition-all duration-200 group flex justify-between items-center"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-on-surface-variant font-medium">{item.timestamp} น.</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                            <span className="text-xs font-semibold text-secondary">ราคา ฿{formatCurrency(item.price)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 text-xs font-medium text-on-surface">
                            <div>รัฐจ่าย: <span className="text-on-tertiary-container font-semibold">฿{formatCurrency(item.govPays)}</span></div>
                            <div>จ่ายจริง: <span className="font-bold">฿{formatCurrency(item.userPays)}</span></div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-md transition-all duration-200"
                          title="ลบรายการนี้"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decorative Visual Card */}
              <div className="relative rounded-xl overflow-hidden aspect-video lg:aspect-auto lg:h-[220px] bg-primary-container shadow-md flex flex-col justify-end group">
                <Image
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-500"
                  alt="Financial Desk View"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoct8wl54uopOw52I39WYYRuZfDHd9TYM3Cqsw1kkSCCkxTkhBZjn6PH71Yk-Xuwhqv3uWRCeXpC1Q2J-0bo13bGDHbrlznf5iNJ6cGN5aKLTzum9MHW_ucV2nvM73HtMploC7mOF79PUjlJb2V1wT0UTiVM8LGkczDtAn39_D26Lxd9bx8aT4JWtsAtMZEf-9-TXuyys2u4p_ErqxlftLNFmX0Tiad0UQHck9UnXr5Vchc0yMeGEptKEQkfXlSP-yIBf6Ee1ToB0U"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 via-primary-container/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <h3 className="text-white font-bold text-headline-sm mb-1.5 flex items-center gap-1.5">
                    ประหยัดอย่างชาญฉลาด
                  </h3>
                  <p className="text-white/80 text-body-sm leading-relaxed">
                    นัทช่วยคิด ทำงานและคำนวณสัดส่วนเงินอุดหนุนแบบอัตโนมัติ เพื่อให้ทุกการคำนวณเป็นเรื่องง่ายและประหยัดเวลาของคุณ
                  </p>
                </div>
              </div>

              {/* Quick Note Info Panel */}
              <div className="bg-tertiary-fixed p-6 rounded-xl border border-tertiary-fixed-dim shadow-sm flex items-start gap-4">
                <div className="p-2 bg-on-tertiary-fixed-variant/10 rounded-lg text-on-tertiary-fixed-variant">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-headline-sm text-on-tertiary-fixed mb-1.5">ข้อแนะนำพิเศษ</h4>
                  <p className="text-on-tertiary-fixed-variant text-body-sm leading-relaxed">
                    เงินอุดหนุนนี้จะหักลดทันทีเมื่อสแกนชำระเงินกับร้านค้าที่เข้าร่วมโครงการ ไม่ต้องยื่นแบบคำร้องหรือทำเรื่องขอรับเงินคืนภายหลัง
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-surface-container-low py-16 md:py-24 mt-16 scroll-mt-10">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">

            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="font-bold text-headline-lg-mobile md:text-headline-lg text-on-surface mb-3">
                วิธีการและเงื่อนไขการทำงาน
              </h2>
              <p className="text-on-surface-variant text-body-md leading-relaxed">
                ทำความคุ้นเคยกับหลักเกณฑ์การจ่ายและวงเงินสนับสนุน เพื่อการคำนวณสิทธิ์ที่ง่ายและรวดเร็วที่สุด
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Step 1: 60% Subsidy */}
              <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-surface-variant/40 shadow-sm hover:shadow-md transition-all duration-300 flex gap-4 items-start group">
                <div className="flex-shrink-0 w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center font-bold text-lg">
                  01
                </div>
                <div>
                  <h3 className="font-bold text-headline-sm mb-2 text-primary">รัฐช่วยออก 60%</h3>
                  <p className="text-on-surface-variant text-body-sm leading-relaxed">
                    รัฐบาลจะสนับสนุนค่าใช้จ่ายให้ <strong className="text-primary font-bold">60% ของราคาสินค้า</strong> สำหรับทุกผลิตภัณฑ์ที่เข้าร่วมรายการโครงการ
                  </p>
                </div>
              </div>

              {/* Step 2: 200 Baht Limit */}
              <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-surface-variant/40 shadow-sm hover:shadow-md transition-all duration-300 flex gap-4 items-start group">
                <div className="flex-shrink-0 w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center font-bold text-lg">
                  02
                </div>
                <div>
                  <h3 className="font-bold text-headline-sm mb-2 text-primary">จำกัดสูงสุด 200 บาท</h3>
                  <p className="text-on-surface-variant text-body-sm leading-relaxed">
                    สิทธิ์อุดหนุนจำกัดยอดสูงสุดไม่เกิน <strong className="text-primary font-bold">200 บาทต่อชิ้น</strong> หากยอด 60% เกินนี้ จะคิดส่วนลดที่ 200 บาทพอดี
                  </p>
                </div>
              </div>

              {/* Step 3: User Portion */}
              <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-surface-variant/40 shadow-sm hover:shadow-md transition-all duration-300 flex gap-4 items-start group">
                <div className="flex-shrink-0 w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center font-bold text-lg">
                  03
                </div>
                <div>
                  <h3 className="font-bold text-headline-sm mb-2 text-primary">คุณจ่ายส่วนต่างเอง</h3>
                  <p className="text-on-surface-variant text-body-sm leading-relaxed">
                    คุณชำระเพียง <strong className="text-primary font-bold">ส่วนต่างที่เหลือ 40%</strong> (หรือราคาสินค้าจริงหักออกด้วยส่วนลด 200 บาท) ณ จุดสแกนจ่ายเงิน
                  </p>
                </div>
              </div>

            </div>

            {/* Subsidy Reference Table */}
            <div className="mt-16 bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-surface-variant/40 shadow-sm">
              <div className="text-center md:text-left mb-6">
                <h3 className="font-bold text-headline-sm flex items-center justify-center md:justify-start gap-2">
                  <Receipt className="w-5 h-5 text-on-surface-variant" />
                  ตารางเปรียบเทียบสัดส่วนราคาสินค้า (รัฐออก vs เราออก)
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  ตารางแสดงราคาสินค้าจริงที่รัฐบาลช่วยออก 60% ตั้งแต่ 10 บาท ถึง 200 บาท และราคาส่วนต่างที่คุณจ่ายจริง (40%)
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Table Part 1 (10 - 100) */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-secondary-container/40 text-on-secondary-container font-semibold border-b border-secondary-container/60">
                        <th className="py-3 px-4 rounded-tl-lg">ราคาสินค้า (บาท)</th>
                        <th className="py-3 px-4">รัฐช่วยออก (60%)</th>
                        <th className="py-3 px-4 rounded-tr-lg">เราจ่ายเอง (40%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {[
                        { price: 16.67, gov: 10, user: 6.67 },
                        { price: 33.33, gov: 20, user: 13.33 },
                        { price: 50.00, gov: 30, user: 20.00 },
                        { price: 66.67, gov: 40, user: 26.67 },
                        { price: 83.33, gov: 50, user: 33.33 },
                        { price: 100.00, gov: 60, user: 40.00 },
                        { price: 116.67, gov: 70, user: 46.67 },
                        { price: 133.33, gov: 80, user: 53.33 },
                        { price: 150.00, gov: 90, user: 60.00 },
                        { price: 166.67, gov: 100, user: 66.67 }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-surface/50 transition-colors duration-150">
                          <td className="py-2.5 px-4 font-semibold">฿{row.price.toFixed(2)}</td>
                          <td className="py-2.5 px-4 text-on-tertiary-container font-semibold">฿{row.gov.toFixed(2)}</td>
                          <td className="py-2.5 px-4 text-on-surface font-semibold">฿{row.user.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Part 2 (110 - 200) */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-secondary-container/40 text-on-secondary-container font-semibold border-b border-secondary-container/60">
                        <th className="py-3 px-4 rounded-tl-lg">ราคาสินค้า (บาท)</th>
                        <th className="py-3 px-4">รัฐช่วยออก (60%)</th>
                        <th className="py-3 px-4 rounded-tr-lg">เราจ่ายเอง (40%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {[
                        { price: 183.33, gov: 110, user: 73.33 },
                        { price: 200.00, gov: 120, user: 80.00 },
                        { price: 216.67, gov: 130, user: 86.67 },
                        { price: 233.33, gov: 140, user: 93.33 },
                        { price: 250.00, gov: 150, user: 100.00 },
                        { price: 266.67, gov: 160, user: 106.67 },
                        { price: 283.33, gov: 170, user: 113.33 },
                        { price: 300.00, gov: 180, user: 120.00 },
                        { price: 316.67, gov: 190, user: 126.67 },
                        { price: 333.33, gov: 200, user: 133.33 }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-surface/50 transition-colors duration-150">
                          <td className="py-2.5 px-4 font-semibold">฿{row.price.toFixed(2)}</td>
                          <td className="py-2.5 px-4 text-on-tertiary-container font-semibold">
                            ฿{row.gov.toFixed(2)} {row.gov === 200 && '(จำกัดสูงสุด)'}
                          </td>
                          <td className="py-2.5 px-4 text-on-surface font-semibold">฿{row.user.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/30 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-secondary text-body-sm text-center md:text-left">
            <span className="font-semibold text-primary block md:inline md:mr-2">นัทช่วยคิด</span>
            © 2026 ระบบคำนวณเงินสมทบอุดหนุนรัฐบาล 60% จำกัดส่วนลดสูงสุด 200 บาท
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            <a href="#" className="text-secondary hover:text-primary text-body-sm hover:underline transition-colors duration-200">
              ข้อกำหนดการใช้งาน
            </a>
            <a href="#" className="text-secondary hover:text-primary text-body-sm hover:underline transition-colors duration-200">
              นโยบายความเป็นส่วนตัว
            </a>
            <a href="#" className="text-secondary hover:text-primary text-body-sm hover:underline transition-colors duration-200">
              ติดต่อสอบถาม/ช่วยเหลือ
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
