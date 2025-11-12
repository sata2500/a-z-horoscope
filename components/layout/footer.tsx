import Link from "next/link"
import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="size-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                AZ-Horoscope
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Yapay zeka destekli modern astroloji platformu. Kişiselleştirilmiş burç yorumları ve analizler.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Keşfet</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/public-horoscope" className="text-muted-foreground transition-colors hover:text-primary">
                  Burçlar
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-primary">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Hakkında</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-primary">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-primary">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">İletişim</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                salihtanriseven25@gmail.com
              </li>
              <li>
                <a 
                  href="https://github.com/sata2500" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AZ-Horoscope. Tüm hakları saklıdır.</p>
          <p className="mt-2">Geliştirici: Salih TANRISEVEN</p>
        </div>
      </div>
    </footer>
  )
}
