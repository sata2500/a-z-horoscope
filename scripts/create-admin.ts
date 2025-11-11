/**
 * Admin Kullanıcı Oluşturma Script'i
 * 
 * Bu script, mevcut bir kullanıcıyı admin yapar.
 * 
 * Kullanım:
 * npx tsx scripts/create-admin.ts
 * 
 * veya
 * npm run admin:create
 */

import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('\n🚀 Az-Horoscope - Admin Kullanıcı Oluşturma\n')
  console.log('Bu script, mevcut bir kullanıcıyı admin yapar.\n')

  // E-posta adresi iste
  const email = await question('Admin yapmak istediğiniz kullanıcının e-posta adresi: ')

  if (!email || !email.includes('@')) {
    console.error('\n❌ Geçersiz e-posta adresi!')
    process.exit(1)
  }

  console.log('\n🔍 Kullanıcı aranıyor...')

  // Kullanıcıyı bul
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  })

  if (!user) {
    console.error(`\n❌ "${email}" e-posta adresine sahip kullanıcı bulunamadı!`)
    console.log('\n💡 İpucu: Önce uygulamaya giriş yaparak bir kullanıcı hesabı oluşturun.')
    process.exit(1)
  }

  console.log('\n✅ Kullanıcı bulundu:')
  console.log(`   ID: ${user.id}`)
  console.log(`   İsim: ${user.name || 'Belirtilmemiş'}`)
  console.log(`   E-posta: ${user.email}`)
  console.log(`   Mevcut Rol: ${user.role}`)
  console.log(`   Kayıt Tarihi: ${user.createdAt.toLocaleDateString('tr-TR')}`)

  if (user.role === 'ADMIN') {
    console.log('\n⚠️  Bu kullanıcı zaten admin!')
    const confirm = await question('\nYine de devam etmek istiyor musunuz? (e/h): ')
    if (confirm.toLowerCase() !== 'e') {
      console.log('\n👋 İşlem iptal edildi.')
      process.exit(0)
    }
  }

  // Onay iste
  const confirm = await question('\nBu kullanıcıyı admin yapmak istediğinizden emin misiniz? (e/h): ')

  if (confirm.toLowerCase() !== 'e') {
    console.log('\n👋 İşlem iptal edildi.')
    process.exit(0)
  }

  console.log('\n⏳ Kullanıcı admin yapılıyor...')

  // Kullanıcıyı admin yap
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  console.log('\n🎉 Başarılı! Kullanıcı admin yapıldı.')
  console.log(`\n✅ ${updatedUser.name || updatedUser.email} artık admin!`)
  console.log('\n📝 Detaylar:')
  console.log(`   ID: ${updatedUser.id}`)
  console.log(`   İsim: ${updatedUser.name || 'Belirtilmemiş'}`)
  console.log(`   E-posta: ${updatedUser.email}`)
  console.log(`   Rol: ${updatedUser.role}`)

  console.log('\n🔗 Admin paneline erişmek için:')
  console.log('   https://a-z-horoscope.vercel.app/admin')
  console.log('\n💡 Not: Değişikliklerin etkili olması için çıkış yapıp tekrar giriş yapmanız gerekebilir.')

  // Tüm admin kullanıcıları listele
  const allAdmins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  console.log(`\n👑 Toplam ${allAdmins.length} admin kullanıcı:`)
  allAdmins.forEach((admin, index) => {
    console.log(`   ${index + 1}. ${admin.name || admin.email} (${admin.email})`)
  })

  console.log('\n✨ İşlem tamamlandı!\n')
}

main()
  .catch((error) => {
    console.error('\n❌ Hata oluştu:', error)
    process.exit(1)
  })
  .finally(async () => {
    rl.close()
    await prisma.$disconnect()
  })
