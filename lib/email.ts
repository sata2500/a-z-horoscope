import { Resend } from 'resend';
import { DailyHoroscopeEmail } from '@/components/emails/daily-horoscope';

// Resend client'ı oluştur
const resend = new Resend(process.env.RESEND_API_KEY);

// Development modunda e-posta göndermek yerine console'a yaz
const isDevelopment = process.env.NODE_ENV === 'development';

interface SendDailyHoroscopeParams {
  to: string;
  userName: string;
  zodiacSign: string;
  zodiacSignTurkish: string;
  horoscopeText: string;
  date: string;
}

/**
 * Günlük burç yorumu e-postası gönderir
 */
export async function sendDailyHoroscope({
  to,
  userName,
  zodiacSign,
  zodiacSignTurkish,
  horoscopeText,
  date,
}: SendDailyHoroscopeParams) {
  try {
    // Development modunda sadece log yaz
    if (isDevelopment || !process.env.RESEND_API_KEY) {
      console.log('📧 [DEV] E-posta gönderimi simüle edildi:', {
        to,
        userName,
        zodiacSign,
        zodiacSignTurkish,
        date,
        horoscopePreview: horoscopeText.substring(0, 100) + '...',
      });
      return {
        success: true,
        message: 'Development mode - email simulated',
      };
    }

    // Production'da gerçek e-posta gönder
    const { data, error } = await resend.emails.send({
      from: 'AZ-Horoscope <noreply@a-z-horoscope.vercel.app>',
      to: [to],
      subject: `🌟 ${zodiacSignTurkish} Burcu - Günlük Yorumunuz (${date})`,
      react: DailyHoroscopeEmail({
        userName,
        zodiacSign,
        zodiacSignTurkish,
        horoscopeText,
        date,
      }),
    });

    if (error) {
      console.error('❌ E-posta gönderme hatası:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('✅ E-posta başarıyla gönderildi:', data);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('❌ E-posta gönderme hatası:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test e-postası gönderir (geliştirme ve test için)
 */
export async function sendTestEmail(to: string) {
  try {
    return await sendDailyHoroscope({
      to,
      userName: 'Test Kullanıcı',
      zodiacSign: 'aries',
      zodiacSignTurkish: 'Koç',
      horoscopeText: 'Bu bir test e-postasıdır. Günlük burç yorumunuz burada görünecektir.',
      date: new Date().toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    });
  } catch (error) {
    console.error('❌ Test e-postası gönderme hatası:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
