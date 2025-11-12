import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Gizlilik Politikası | AZ-Horoscope",
  description: "AZ-Horoscope gizlilik politikası. Verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi edinin.",
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-foreground dark:text-white">Gizlilik Politikası</h1>
        <p className="text-muted-foreground">Son güncelleme: 12 Kasım 2025</p>

        <h2 className="text-foreground dark:text-white">1. Giriş</h2>
        <p className="text-foreground dark:text-gray-200">
          AZ-Horoscope olarak, kullanıcılarımızın gizliliğini korumayı taahhüt ediyoruz. Bu Gizlilik Politikası, kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı, sakladığımızı ve koruduğumuzu açıklamaktadır.
        </p>

        <h2 className="text-foreground dark:text-white">2. Topladığımız Bilgiler</h2>
        <h3 className="text-foreground dark:text-gray-100">2.1. Hesap Bilgileri</h3>
        <p className="text-foreground dark:text-gray-200">
          Platformumuza kaydolduğunuzda aşağıdaki bilgileri topluyoruz:
        </p>
        <ul className="text-foreground dark:text-gray-200">
          <li>Ad ve soyad</li>
          <li>E-posta adresi</li>
          <li>Doğum tarihi (burç hesaplamaları için)</li>
          <li>Profil fotoğrafı (isteğe bağlı)</li>
        </ul>

        <h3 className="text-foreground dark:text-gray-100">2.2. Astroloji Verileri</h3>
        <p className="text-foreground dark:text-gray-200">
          Kişiselleştirilmiş burç yorumları sunabilmek için aşağıdaki bilgileri topluyoruz:
        </p>
        <ul className="text-foreground dark:text-gray-200">
          <li>Doğum tarihi, saati ve yeri (doğum haritası hesaplamaları için)</li>
          <li>Burç tercihleri</li>
          <li>Günlük ruh hali ve notlar (günlük özelliği kullanıldığında)</li>
        </ul>

        <h3 className="text-foreground dark:text-gray-100">2.3. Kullanım Verileri</h3>
        <p className="text-foreground dark:text-gray-200">
          Platformumuzun iyileştirilmesi için aşağıdaki verileri otomatik olarak topluyoruz:
        </p>
        <ul className="text-foreground dark:text-gray-200">
          <li>IP adresi</li>
          <li>Tarayıcı türü ve sürümü</li>
          <li>Ziyaret edilen sayfalar</li>
          <li>Ziyaret tarihi ve saati</li>
        </ul>

        <h2 className="text-foreground dark:text-white">3. Bilgilerinizi Nasıl Kullanıyoruz</h2>
        <p className="text-foreground dark:text-gray-200">Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:</p>
        <ul className="text-foreground dark:text-gray-200">
          <li>Kişiselleştirilmiş burç yorumları ve doğum haritası analizleri sunmak</li>
          <li>Hesabınızı yönetmek ve kimliğinizi doğrulamak</li>
          <li>E-posta bildirimleri göndermek (tercih ettiğiniz takdirde)</li>
          <li>Platformumuzun performansını ve kullanıcı deneyimini iyileştirmek</li>
          <li>Yasal yükümlülüklerimizi yerine getirmek</li>
        </ul>

        <h2 className="text-foreground dark:text-white">4. Bilgi Paylaşımı</h2>
        <p className="text-foreground dark:text-gray-200">
          Kişisel bilgilerinizi üçüncü taraflarla <strong className="text-foreground dark:text-white font-bold">satmıyoruz</strong>. Ancak, aşağıdaki durumlarda bilgilerinizi paylaşabiliriz:
        </p>
        <ul className="text-foreground dark:text-gray-200">
          <li><strong className="text-foreground dark:text-white font-bold">Hizmet Sağlayıcılar:</strong> Google (OAuth ve AI), Vercel (hosting), Neon (veritabanı), Resend (e-posta) gibi güvenilir hizmet sağlayıcılarla.</li>
          <li><strong className="text-foreground dark:text-white font-bold">Yasal Zorunluluklar:</strong> Yasal bir talep veya mahkeme kararı durumunda.</li>
          <li><strong className="text-foreground dark:text-white font-bold">İş Transferi:</strong> Şirket birleşmesi veya satın alma durumunda.</li>
        </ul>

        <h2 className="text-foreground dark:text-white">5. Veri Güvenliği</h2>
        <p className="text-foreground dark:text-gray-200">
          Kişisel bilgilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz:
        </p>
        <ul className="text-foreground dark:text-gray-200">
          <li>HTTPS şifrelemesi</li>
          <li>Güvenli veritabanı bağlantıları</li>
          <li>Düzenli güvenlik denetimleri</li>
          <li>Erişim kontrolü ve kimlik doğrulama</li>
        </ul>

        <h2 className="text-foreground dark:text-white">6. Çerezler (Cookies)</h2>
        <p className="text-foreground dark:text-gray-200">
          Platformumuz, kullanıcı deneyimini iyileştirmek için çerezler kullanır. Çerezler, tarayıcınızda saklanan küçük metin dosyalarıdır. Aşağıdaki çerez türlerini kullanıyoruz:
        </p>
        <ul className="text-foreground dark:text-gray-200">
          <li><strong className="text-foreground dark:text-white font-bold">Zorunlu Çerezler:</strong> Platformun çalışması için gereklidir (örn. oturum çerezleri).</li>
          <li><strong className="text-foreground dark:text-white font-bold">Analitik Çerezler:</strong> Kullanım istatistiklerini toplamak için kullanılır.</li>
        </ul>
        <p className="text-foreground dark:text-gray-200">
          Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz.
        </p>

        <h2 className="text-foreground dark:text-white">7. Haklarınız</h2>
        <p className="text-foreground dark:text-gray-200">
          Kişisel verileriniz üzerinde aşağıdaki haklara sahipsiniz:
        </p>
        <ul className="text-foreground dark:text-gray-200">
          <li><strong className="text-foreground dark:text-white font-bold">Erişim Hakkı:</strong> Hangi verilerimizin saklandığını öğrenebilirsiniz.</li>
          <li><strong className="text-foreground dark:text-white font-bold">Düzeltme Hakkı:</strong> Yanlış veya eksik bilgileri düzeltebilirsiniz.</li>
          <li><strong className="text-foreground dark:text-white font-bold">Silme Hakkı:</strong> Hesabınızı ve verilerinizi silebilirsiniz.</li>
          <li><strong className="text-foreground dark:text-white font-bold">İtiraz Hakkı:</strong> Veri işleme faaliyetlerine itiraz edebilirsiniz.</li>
        </ul>
        <p className="text-foreground dark:text-gray-200">
          Bu haklarınızı kullanmak için <Link href="mailto:info@azhoroscope.com" className="text-primary hover:underline dark:text-blue-400">info@azhoroscope.com</Link> adresinden bizimle iletişime geçebilirsiniz.
        </p>

        <h2 className="text-foreground dark:text-white">8. Çocukların Gizliliği</h2>
        <p className="text-foreground dark:text-gray-200">
          Platformumuz 13 yaşın altındaki çocuklara yönelik değildir. Bilerek 13 yaşın altındaki çocuklardan kişisel bilgi toplamıyoruz.
        </p>

        <h2 className="text-foreground dark:text-white">9. Değişiklikler</h2>
        <p className="text-foreground dark:text-gray-200">
          Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda sizi e-posta yoluyla bilgilendireceğiz.
        </p>

        <h2 className="text-foreground dark:text-white">10. İletişim</h2>
        <p className="text-foreground dark:text-gray-200">
          Gizlilik Politikamız hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
        </p>
        <ul className="text-foreground dark:text-gray-200">
          <li>E-posta: <Link href="mailto:info@azhoroscope.com" className="text-primary hover:underline dark:text-blue-400">info@azhoroscope.com</Link></li>
          <li>Web: <Link href="/about" className="text-primary hover:underline dark:text-blue-400">Hakkımızda</Link></li>
        </ul>
      </div>
    </div>
  )
}
