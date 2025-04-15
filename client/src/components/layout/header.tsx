import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  let user = null;
  
  // For logout functionality
  const handleLogout = () => {
    try {
      const { logoutMutation } = useAuth();
      logoutMutation.mutate();
    } catch (error) {
      console.warn("Auth not available for logout:", error);
    }
  };
  
  // Try to get user data if available
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.warn("Auth context not available for user data:", error);
  }
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-[#2A3828] py-4 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-orange-500 font-bold text-2xl">
          Vanished
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/search" className="text-white hover:text-orange-500 transition duration-200">
            Buscar
          </Link>
          <Link href="/register-missing" className="text-white hover:text-orange-500 transition duration-200">
            Cadastrar pessoas
          </Link>
          <Link href="/about" className="text-white hover:text-orange-500 transition duration-200">
            Sobre nós
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Olá, {user.name || user.username}</span>
              <Button
                onClick={handleLogout}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Sair
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Login
              </Button>
            </Link>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2A3828] py-4 mt-2">
          <nav className="container mx-auto flex flex-col space-y-4 px-4">
            <Link
              href="/search"
              className="text-white hover:text-orange-500 transition duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Buscar
            </Link>
            <Link
              href="/register-missing"
              className="text-white hover:text-orange-500 transition duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cadastrar pessoas
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-orange-500 transition duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre nós
            </Link>
            {user ? (
              <>
                <span className="text-gray-300 py-2">Olá, {user.name || user.username}</span>
                <Button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Sair
                </Button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
