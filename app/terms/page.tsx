import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Kullanım Koşulları | AZ-Horoscope",
  description: "AZ-Horoscope kullanım koşulları. Platformumuzu kullanırken uymanız gereken kurallar ve şartlar.",
}

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-foreground dark:text-white">Kullanım Koşulları</h1>
        <p className="text-muted-foreground">Son güncelleme: 12 Kasım 2025</p>

        <h2 className="text-foreground dark:text-white">1. Kabul</h2>
        <p className="text-foreground dark:text-gray-200">
          AZ-Horoscope platformunu kullanarak, bu Kullanım Koşullarını kabul etmiş olursunuz. Bu koşulları kabul etmiyorsanız, lütfen platformumuzu kullanmayın.
        </p>

        <h2 className="text-foreground dark:text-white">2. Hizmet Tanımı</h2>
        <p className="text-foreground dark:text-gray-200">
          AZ-Horoscope, kullanıcılara yapay zeka destekli burç yorumları, doğum haritası analizleri ve astroloji ile ilgili içerikler sunan bir web platformudur. Sunduğumuz hizmetler şunları içerir:
        </p>
        <ul className="text-foreground dark:text-gray-200">
          <li>Günlük, haftalık ve aylık burç yorumları</li>
          <li>Doğum haritası hesaplamaları ve analizleri</li>
          <li>Kişisel günlük ve ruh hali takibi</li>
          <li>Gezegen geçişleri ve etkileri hakkında bilgiler</li>
        </ul>

        <h2 className="text-foreground dark:text-white">3. Hesap Oluşturma</h2>
        <h3 className="text-foreground dark:text-gray-100">3.1. Yaş Sınırı</h3>
        <p className="text-foreground dark:text-gray-200">
          Platformumuzu kullanmak için en az 13 yaşında olmanız gerekmektedir. 18 yaşın altındaysanız, ebeveyn veya vasi onayı ile platformumuzu kullanabilirsiniz.
        </p>

        <h3 className="text-foreground dark:text-gray-100">3.2. Hesap Güvenliği</h3>
        <p className="text-foreground dark:text-gray-200">
          Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizi güvenli tutmalı ve kimseyle paylaşmamalısınız. Hesabınızda yetkisiz bir erişim fark ederseniz, derhal bize bildirmelisiniz.
        </p>

        <h3 className="text-foreground dark:text-gray-100">3.3. Doğru Bilgi</h3>
        <p className="text-foreground dark:text-gray-200">
          Kayıt sırasında doğru ve güncel bilgiler sağlamalısınız. Yanlış bilgi vermek, hesabınızın askıya alınmasına veya silinmesine neden olabilir.
        </p>

        <h2 className="text-foreground dark:text-white">4. Kullanım Kuralları</h2>
        <p className="text-foreground dark:text-gray-200">
          Platformumuzu kullanırken aşağıdaki kurallara uymalısınız:
        </p>
        <ul className="text-foreground dark:text-gray-200">
          <li>Platformu yasa dışı amaçlarla kullanmamak</li>
          <li>Diğer kullanıcıların haklarına saygı göstermek</li>
          <li>Spam, kötü amaçlı yazılım veya zararlı içerik paylaşmamak</li>
          <li>Platformun güvenliğini tehlikeye atmamak</li>
          <li>Telif hakkı ihlali yapmamak</li>
        </ul>

        <h2 className="text-foreground dark:text-white">5. Fikri Mülkiyet</h2>
        <p className="text-foreground dark:text-gray-200">
          Platformumuzda yer alan tüm içerikler (metin, görsel, logo, tasarım vb.) AZ-Horoscope&apos;un fikri mülkiyetidir ve telif hakkı yasaları ile korunmaktadır. İzinsiz kullanım, kopyalama veya dağıtım yasaktır.
        </p>

        <h2 className="text-foreground dark:text-white">6. Sorumluluk Reddi</h2>
        <h3 className="text-foreground dark:text-gray-100">6.1. Eğlence Amaçlı</h3>
        <p className="text-foreground dark:text-gray-200">
          AZ-Horoscope&apos;ta sunulan burç yorumları ve astroloji analizleri <strong className="text-foreground dark:text-white font-bold">yalnızca eğlence ve bilgilendirme amaçlıdır</strong>. Bu yorumlar, profesyonel tavsiye (tıbbi, hukuki, finansal vb.) yerine geçmez.
        </p>

        <h3 className="text-foreground dark:text-gray-100">6.2. Doğruluk Garantisi Yok</h3>
        <p className="text-foreground dark:text-gray-200">
          Platformumuzda sunulan bilgilerin doğruluğunu garanti etmiyoruz. Yapay zeka tarafından üretilen içerikler hata içerebilir.
        </p>

        <h3 className="text-foreground dark:text-gray-100">6.3. Kararlarınızın Sorumluluğu</h3>
        <p className="text-foreground dark:text-gray-200">
          Platformumuzda sunulan bilgilere dayanarak aldığınız kararlardan siz sorumlusunuz. AZ-Horoscope, bu kararlardan kaynaklanan herhangi bir zarardan sorumlu tutulamaz.
        </p>

        <h2 className="text-foreground dark:text-white">7. Hizmet Kesintileri</h2>
        <p className="text-foreground dark:text-gray-200">
          Platformumuz, bakım, güncelleme veya teknik sorunlar nedeniyle zaman zaman kesintiye uğrayabilir. Bu kesintilerden dolayı sorumluluk kabul etmiyoruz.
        </p>

        <h2 className="text-foreground dark:text-white">8. Hesap Askıya Alma ve Silme</h2>
        <p className="text-foreground dark:text-gray-200">
          Aşağıdaki durumlarda hesabınızı askıya alabilir veya silebiliriz:
        </p>
        <ul className="text-foreground dark:text-gray-200">
          <li>Kullanım Koşullarını ihlal etmeniz</li>
          <li>Platformun güvenliğini tehlikeye atmanız</li>
          <li>Yasa dışı faaliyetlerde bulunmanız</li>
          <li>Diğer kullanıcılara zarar vermeniz</li>
        </ul>

        <h2 className="text-foreground dark:text-white">9. Değişiklikler</h2>
        <p className="text-foreground dark:text-gray-200">
          Bu Kullanım Koşullarını zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda sizi e-posta yoluyla bilgilendireceğiz. Güncellemelerden sonra platformu kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir.
        </p>

        <h2 className="text-foreground dark:text-white">10. Uygulanacak Hukuk</h2>
        <p className="text-foreground dark:text-gray-200">
          Bu Kullanım Koşulları, Türkiye Cumhuriyeti yasalarına tabidir. Herhangi bir uyuşmazlık durumunda, Türkiye mahkemeleri yetkilidir.
        </p>

        <h2 className="text-foreground dark:text-white">11. İletişim</h2>
        <p className="text-foreground dark:text-gray-200">
          Kullanım Koşullarımız hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
        </p>
        <ul className="text-foreground dark:text-gray-200">
          <li>E-posta: <Link href="mailto:support@az-horoscope.com" className="text-primary hover:underline dark:text-blue-400">support@az-horoscope.com</Link></li>
          <li>Web: <Link href="/about" className="text-primary hover:underline dark:text-blue-400">Hakkımızda</Link></li>
        </ul>

        <div className="mt-8 p-4 bg-muted dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700">
          <p className="text-sm text-foreground dark:text-gray-200">
            <strong className="text-foreground dark:text-white font-bold">Not:</strong> Bu Kullanım Koşulları, AZ-Horoscope platformunu kullanırken uymanız gereken kuralları belirler. Platformumuzu kullanarak, bu koşulları okuduğunuzu ve kabul ettiğinizi beyan edersiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
