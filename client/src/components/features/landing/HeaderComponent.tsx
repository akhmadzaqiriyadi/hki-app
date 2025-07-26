'use client';
import React from 'react';
import { Menu, X, ChevronDown } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

type HeaderProps = {
  onLogin: () => void;
  onRegister: () => void;
};

export default function Header({ onLogin, onRegister }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 px-4 lg:px-28 h-16 flex items-center backdrop-blur-md bg-white/90 border-b border-slate-200/60 shadow-sm">
      <div className="flex items-center justify-center gap-x-2">
        <Link href="/" className="flex items-center gap-x-2">
          <Image src="/UTY.png" alt="Logo" width={42} height={42} />
          <Image src="/PrimaryLogo.png" alt="Logo" width={40} height={40} />
          <span className="ml-2 font-bold text-xl bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
            Portal UTY HKI
          </span>
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="ml-auto hidden md:flex items-center gap-8 md:gap-4">
        {/* Layanan Dropdown */}
        <div className="relative">
          <button
            onClick={handleDropdownToggle}
            className="text-sm font-medium text-slate-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            Layanan
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10">
              <a
                href="/hakcipta"
                className="block px-4 py-2 text-sm text-slate-600 hover:text-blue-800 hover:bg-slate-50 transition-colors"
                onClick={handleDropdownClose}
              >
                HAK CIPTA
              </a>
              <a
                href="#paten"
                className="block px-4 py-2 text-sm text-slate-600 hover:text-blue-800 hover:bg-slate-50 transition-colors"
                onClick={handleDropdownClose}
              >
                PATEN (coming soon)
              </a>
              <a
                href="#desain-industri"
                className="block px-4 py-2 text-sm text-slate-600 hover:text-blue-800 hover:bg-slate-50 transition-colors"
                onClick={handleDropdownClose}
              >
                DESAIN INDUSTRI (coming soon)
              </a>
            </div>
          )}
        </div>

        <Link href="/#fitur" className="text-sm font-medium text-slate-600 hover:text-blue-800 transition-colors">
          Fitur
        </Link>
        <button onClick={onLogin} className="text-sm font-medium text-slate-600 hover:text-blue-800 transition-colors">
          Masuk
        </button>
        <button 
          className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          onClick={onRegister}
        >
          Daftar Sekarang
        </button>
      </nav>

      {/* Mobile menu button */}
      <button 
        className="ml-auto md:hidden p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden">
          <nav className="flex flex-col p-4 space-y-4">
            {/* Mobile Layanan Dropdown */}
            <div>
              <button
                onClick={handleDropdownToggle}
                className="text-sm font-medium text-slate-600 hover:text-blue-800 flex items-center gap-1 w-full text-left"
              >
                Layanan
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  <a href="/hakcipta" onClick={closeMobileMenu} className="block py-1 text-sm text-slate-500 hover:text-blue-800">HAK CIPTA</a>
                  <a href="#paten" onClick={closeMobileMenu} className="block py-1 text-sm text-slate-500 hover:text-blue-800">PATEN (coming soon)</a>
                  <a href="#desain-industri" onClick={closeMobileMenu} className="block py-1 text-sm text-slate-500 hover:text-blue-800">DESAIN INDUSTRI (coming soon)</a>
                </div>
              )}
            </div>
            
            <Link href="/#fitur" onClick={closeMobileMenu} className="text-sm font-medium text-slate-600 hover:text-blue-800">
              Fitur
            </Link>
            <button onClick={() => { onLogin(); closeMobileMenu(); }} className="text-sm font-medium text-slate-600 hover:text-blue-800 text-left">Masuk</button>
            <button onClick={() => { onRegister(); closeMobileMenu(); }} className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-2 rounded-xl font-medium w-full">
              Daftar Sekarang
            </button>
          </nav>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={handleDropdownClose}
        />
      )}
    </header>
  );
}