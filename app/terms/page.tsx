import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Az-Horoscope",
  description: "Az-Horoscope kullanım koşulları. Platformumuzu kullanırken uymanız gereken kurallar ve şartlar.",
}

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1>Kullanım Koşulları</h1>
        <p className="text-muted-foreground">Son güncelleme: 12 Kasım 2025</p>

        <h2>1. Kabul</h2>
        <p>
          Az-Horoscope platformunu kullanarak, bu Kullanım Koşullarını kabul etmiş olursunuz. Bu koşulları kabul etmiyorsanız, lütfen platformumuzu kullanmayın.
        </p>

        <h2>2. Hizmet Tanımı</h2>
        <p>
          Az-Horoscope, kullanıcılara yapay zeka destekli burç yorumları, doğum haritası analizleri ve astroloji ile ilgili içerikler sunan bir web platformudur. Sunduğumuz hizmetler şunları içerir:
        </p>
        <ul>
          <li>Günlük, haftalık ve aylık burç yorumları</li>
          <li>Doğum haritası hesaplamaları ve analizleri</li>
          <li>Kişisel günlük ve ruh hali takibi</li>
          <li>Gezegen geçişleri ve etkileri hakkında bilgiler</li>
        </ul>

        <h2>3. Hesap Oluşturma</h2>
        <h3>3.1. Yaş Sınırı</h3>
        <p>
          Platformumuzu kullanmak için en az 13 yaşında olmanız gerekmektedir. 18 yaşın altındaysanız, ebeveyn veya vasi onayı ile platformumuzu kullanabilirsiniz.
        </p>

        <h3>3.2. Hesap Güvenliği</h3>
        <p>
          Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizi güvenli tutmalı ve kimseyle paylaşmamalısınız. Hesabınızda yetkisiz bir erişim fark ederseniz, derhal bize bildirmelisiniz.
        </p>

        <h3>3.3. Doğru Bilgi</h3>
        <p>
          Kayıt sırasında doğru ve güncel bilgiler sağlamalısınız. Yanlış bilgi vermek, hesabınızın askıya alınmasına veya silinmesine neden olabilir.
        </p>

        <h2>4. Kullanım Kuralları</h2>
        <p>
          Platformumuzu kullanırken aşağıdaki kurallara uymalısınız:
        </p>
        <ul>
          <li>Platformu yasa dışı amaçlarla kullanmamak</li>
          <li>Diğer kullanıcıların haklarına saygı göstermek</li>
          <li>Spam, kötü amaçlı yazılım veya zararlı içerik paylaşmamak</li>
          <li>Platformun güvenliğini tehlikeye atmamak</li>
          <li>Telif hakkı ihlali yapmamak</li>
        </ul>

        <h2>5. Fikri Mülkiyet</h2>
        <p>
          Platformumuzda yer alan tüm içerikler (metin, görsel, logo, tasarım vb.) Az-Horoscope&apos;un fikri mülkiyetidir ve telif hakkı yasaları ile korunmaktadır. İzinsiz kullanım, kopyalama veya dağıtım yasaktır.
        </p>

        <h2>6. Sorumluluk Reddi</h2>
        <h3>6.1. Eğlence Amaçlı</h3>
        <p>
          Az-Horoscope&apos;ta sunulan burç yorumları ve astroloji analizleri <strong>yalnızca eğlence ve bilgilendirme amaçlıdır</strong>. Bu yorumlar, profesyonel tavsiye (tıbbi, hukuki, finansal vb.) yerine geçmez.
        </p>

        <h3>6.2. Doğruluk Garantisi Yok</h3>
        <p>
          Platformumuzda sunulan bilgilerin doğruluğunu garanti etmiyoruz. Yapay zeka tarafından üretilen içerikler hata içerebilir.
        </p>

        <h3>6.3. Kararlarınızın Sorumluluğu</h3>
        <p>
          Platformumuzda sunulan bilgilere dayanarak aldığınız kararlardan siz sorumlusunuz. Az-Horoscope, bu kararlardan kaynaklanan herhangi bir zarardan sorumlu tutulamaz.
        </p>

        <h2>7. Hizmet Kesintileri</h2>
        <p>
          Platformumuz, bakım, güncelleme veya teknik sorunlar nedeniyle zaman zaman kesintiye uğrayabilir. Bu kesintilerden dolayı sorumluluk kabul etmiyoruz.
        </p>

        <h2>8. Hesap Askıya Alma ve Silme</h2>
        <p>
          Aşağıdaki durumlarda hesabınızı askıya alabilir veya silebiliriz:
        </p>
        <ul>
          <li>Kullanım Koşullarını ihlal etmeniz</li>
          <li>Platformun güvenliğini tehlikeye atmanız</li>
          <li>Yasa dışı faaliyetlerde bulunmanız</li>
          <li>Diğer kullanıcılara zarar vermeniz</li>
        </ul>

        <h2>9. Değişiklikler</h2>
        <p>
          Bu Kullanım Koşullarını zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda sizi e-posta yoluyla bilgilendireceğiz. Güncellemelerden sonra platformu kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir.
        </p>

        <h2>10. Uygulanacak Hukuk</h2>
        <p>
          Bu Kullanım Koşulları, Türkiye Cumhuriyeti yasalarına tabidir. Herhangi bir uyuşmazlık durumunda, Türkiye mahkemeleri yetkilidir.
        </p>

        <h2>11. İletişim</h2>
        <p>
          Kullanım Koşullarımız hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
        </p>
        <ul>
          <li>E-posta: <Link href="mailto:support@az-horoscope.com" className="text-primary hover:underline">support@az-horoscope.com</Link></li>
          <li>Web: <Link href="/about" className="text-primary hover:underline">Hakkımızda</Link></li>
        </ul>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>Not:</strong> Bu Kullanım Koşulları, Az-Horoscope platformunu kullanırken uymanız gereken kuralları belirler. Platformumuzu kullanarak, bu koşulları okuduğunuzu ve kabul ettiğinizi beyan edersiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
