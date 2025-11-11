import { requireAdmin } from "@/lib/admin"
import Link from "next/link"
import { LayoutDashboard, Users, BarChart3, Settings, Home } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Admin yetkisi kontrolü
  await requireAdmin()

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Kullanıcılar",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "İstatistikler",
      href: "/admin/stats",
      icon: BarChart3,
    },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              👑
            </div>
            <span>Admin Panel</span>
          </Link>
        </div>
        
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="size-4" />
              {item.title}
            </Link>
          ))}
          
          <div className="my-4 border-t" />
          
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="size-4" />
            Ana Sayfaya Dön
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
