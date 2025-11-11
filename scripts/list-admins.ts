/**
 * Admin Kullanıcıları Listeleme Script'i
 * 
 * Bu script, tüm admin kullanıcıları listeler.
 * 
 * Kullanım:
 * npx tsx scripts/list-admins.ts
 * 
 * veya
 * npm run admin:list
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('\n👑 Az-Horoscope - Admin Kullanıcıları\n')

  // Tüm admin kullanıcıları getir
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      zodiacSign: true,
      createdAt: true,
      _count: {
        select: {
          horoscopeReadings: true,
          favoriteReadings: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  if (admins.length === 0) {
    console.log('❌ Hiç admin kullanıcı bulunamadı!')
    console.log('\n💡 İpucu: Admin kullanıcı oluşturmak için:')
    console.log('   npm run admin:create')
    return
  }

  console.log(`✅ Toplam ${admins.length} admin kullanıcı bulundu:\n`)

  admins.forEach((admin, index) => {
    console.log(`${index + 1}. ${admin.name || 'İsimsiz'}`)
    console.log(`   📧 E-posta: ${admin.email}`)
    console.log(`   🆔 ID: ${admin.id}`)
    if (admin.zodiacSign) {
      console.log(`   ⭐ Burç: ${admin.zodiacSign}`)
    }
    console.log(`   📝 Yorum Sayısı: ${admin._count.horoscopeReadings}`)
    console.log(`   ❤️  Favori Sayısı: ${admin._count.favoriteReadings}`)
    console.log(`   📅 Kayıt Tarihi: ${admin.createdAt.toLocaleDateString('tr-TR')}`)
    console.log('')
  })

  // Toplam kullanıcı sayısı
  const totalUsers = await prisma.user.count()
  console.log(`📊 İstatistikler:`)
  console.log(`   Toplam Kullanıcı: ${totalUsers}`)
  console.log(`   Admin Kullanıcı: ${admins.length}`)
  console.log(`   Normal Kullanıcı: ${totalUsers - admins.length}`)
  console.log(`   Admin Oranı: %${((admins.length / totalUsers) * 100).toFixed(1)}`)

  console.log('\n✨ İşlem tamamlandı!\n')
}

main()
  .catch((error) => {
    console.error('\n❌ Hata oluştu:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
