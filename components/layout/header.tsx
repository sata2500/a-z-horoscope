"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
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
import { Sparkles, Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Ana Sayfa
          </Link>
          <Link href="/public-horoscope" className="text-sm font-medium transition-colors hover:text-primary">
            Burç Yorumları
          </Link>
          <Link href="/public-natal-chart" className="text-sm font-medium transition-colors hover:text-primary">
            Doğum Haritası
          </Link>
          {session && (
            <>
              <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link href="/zodiac" className="text-sm font-medium transition-colors hover:text-primary">
                Burçlar
              </Link>
              <Link href="/journal" className="text-sm font-medium transition-colors hover:text-primary">
                Günlüğüm
              </Link>
            </>
          )}
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
          <nav className="container py-4 flex flex-col gap-3">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/public-horoscope" 
              className="text-sm font-medium transition-colors hover:text-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Burç Yorumları
            </Link>
            <Link 
              href="/public-natal-chart" 
              className="text-sm font-medium transition-colors hover:text-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Doğum Haritası
            </Link>
            {session && (
              <>
                <div className="border-t border-border/40 my-2" />
                <Link 
                  href="/dashboard" 
                  className="text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/zodiac" 
                  className="text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Burçlar
                </Link>
                <Link 
                  href="/journal" 
                  className="text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Günlüğüm
                </Link>
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
