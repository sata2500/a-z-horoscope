"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sparkles, Menu, Home, Star, Calendar, Heart } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Ana sayfada mıyız kontrolü
  const isHomePage = pathname === "/"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="size-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Az-Horoscope
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          {/* Ana Sayfa - Sadece ana sayfa dışında göster */}
          {!isHomePage && (
            <Link 
              href="/" 
              className="group relative px-4 py-2 rounded-lg transition-all hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <Home className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  Ana Sayfa
                </span>
              </div>
            </Link>
          )}
          
          {/* Burçlar */}
          {session && (
            <Link 
              href="/zodiac"
              className={`group relative px-4 py-2 rounded-lg transition-all ${
                pathname === "/zodiac" || pathname?.startsWith("/zodiac/")
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent"
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className={`size-4 transition-colors ${
                  pathname === "/zodiac" || pathname?.startsWith("/zodiac/")
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                }`} />
                <span className="text-sm font-medium">
                  Burçlar
                </span>
              </div>
            </Link>
          )}
          
          {/* Burç Yorumları */}
          <Link 
            href="/public-horoscope"
            className={`group relative px-4 py-2 rounded-lg transition-all ${
              pathname === "/public-horoscope"
                ? "bg-primary/10 text-primary"
                : "hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className={`size-4 transition-colors ${
                pathname === "/public-horoscope"
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-primary"
              }`} />
              <span className="text-sm font-medium">
                Burç Yorumları
              </span>
            </div>
          </Link>
          
          {/* Doğum Haritası */}
          <Link 
            href="/public-natal-chart"
            className={`group relative px-4 py-2 rounded-lg transition-all ${
              pathname === "/public-natal-chart"
                ? "bg-primary/10 text-primary"
                : "hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className={`size-4 transition-colors ${
                pathname === "/public-natal-chart"
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-primary"
              }`} />
              <span className="text-sm font-medium">
                Doğum Haritası
              </span>
            </div>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <Menu className="size-5" />
          </Button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative size-10 rounded-full">
                  <Avatar className="size-10">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/natal-chart">Doğum Haritam</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/journal">Günlüğüm</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Giriş Yap</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="container py-4 flex flex-col gap-2">
            {/* Ana Sayfa - Sadece ana sayfa dışında göster */}
            {!isHomePage && (
              <Link 
                href="/" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="size-5 text-muted-foreground" />
                <span className="text-sm font-medium">Ana Sayfa</span>
              </Link>
            )}
            
            {/* Burçlar */}
            {session && (
              <Link 
                href="/zodiac" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  pathname === "/zodiac" || pathname?.startsWith("/zodiac/")
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Star className={`size-5 ${
                  pathname === "/zodiac" || pathname?.startsWith("/zodiac/")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`} />
                <span className="text-sm font-medium">Burçlar</span>
              </Link>
            )}
            
            {/* Burç Yorumları */}
            <Link 
              href="/public-horoscope" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === "/public-horoscope"
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className={`size-5 ${
                pathname === "/public-horoscope"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`} />
              <span className="text-sm font-medium">Burç Yorumları</span>
            </Link>
            
            {/* Doğum Haritası */}
            <Link 
              href="/public-natal-chart" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === "/public-natal-chart"
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calendar className={`size-5 ${
                pathname === "/public-natal-chart"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`} />
              <span className="text-sm font-medium">Doğum Haritası</span>
            </Link>
            
            {session && (
              <>
                <div className="border-t border-border/40 my-2" />
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut({ callbackUrl: "/" })
                  }}
                >
                  Çıkış Yap
                </Button>
              </>
            )}
            {!session && (
              <>
                <div className="border-t border-border/40 my-2" />
                <Button asChild className="w-full">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Giriş Yap
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
