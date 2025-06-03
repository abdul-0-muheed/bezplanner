import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from './sign-up';
import { Building2, Menu } from 'lucide-react';

function Navbar() {
  const [session, setSession] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Add scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
  }

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
    
  }, [location.pathname]);

  const authcheck = () => {
    if (session) {
      return (
        <ul className="flex space-x-6">
          <li>
            <Link to="/dashboard">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                Feature
              </button>
            </Link>
          </li>
          <li>
            <button
              onClick={signOut}
              className="border-2 border-purple-400 text-purple-400 px-6 py-3 rounded-full font-semibold hover:bg-purple-400 hover:text-white transition-all duration-300"
            >
              Log Out
            </button>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="flex space-x-6">
          <li>
            <Link to="/">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                Home
              </button>
            </Link>
          </li>
          <li>
            <Link to="/signup">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                Login / Sign Up
              </button>
            </Link>
          </li>
        </ul>
      );
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isVisible 
        ? 'translate-y-0 opacity-100 bg-slate-900/95 backdrop-blur-sm border-b border-purple-500/20' 
        : '-translate-y-full opacity-0'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">BizLaunch</span>
            </Link>
          </div>
          <div className="hidden md:flex">{authcheck()}</div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-purple-300 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {authcheck()}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;