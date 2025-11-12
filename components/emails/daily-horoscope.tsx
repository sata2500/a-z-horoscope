import * as React from 'react';

interface DailyHoroscopeEmailProps {
  userName: string;
  zodiacSign: string;
  zodiacSignTurkish: string;
  horoscopeText: string;
  date: string;
}

export function DailyHoroscopeEmail({
  userName,
  zodiacSign,
  zodiacSignTurkish,
  horoscopeText,
  date,
}: DailyHoroscopeEmailProps) {
  const zodiacEmojis: Record<string, string> = {
    aries: '♈',
    taurus: '♉',
    gemini: '♊',
    cancer: '♋',
    leo: '♌',
    virgo: '♍',
    libra: '♎',
    scorpio: '♏',
    sagittarius: '♐',
    capricorn: '♑',
    aquarius: '♒',
    pisces: '♓',
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#ffffff',
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f0f0f0',
      }}>
        <h1 style={{ 
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1a1a1a',
          margin: '0 0 10px 0',
        }}>
          🌟 AZ-Horoscope
        </h1>
        <p style={{ 
          fontSize: '14px',
          color: '#666',
          margin: '0',
        }}>
          Günlük Burç Yorumunuz
        </p>
      </div>

      {/* Greeting */}
      <p style={{ 
        fontSize: '16px',
        color: '#333',
        marginBottom: '20px',
      }}>
        Merhaba <strong>{userName}</strong>,
      </p>

      {/* Zodiac Sign Badge */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '25px',
      }}>
        <div style={{ 
          display: 'inline-block',
          padding: '15px 30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '2px solid #e9ecef',
        }}>
          <span style={{ 
            fontSize: '32px',
            marginRight: '10px',
          }}>
            {zodiacEmojis[zodiacSign] || '⭐'}
          </span>
          <span style={{ 
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1a1a1a',
          }}>
            {zodiacSignTurkish}
          </span>
        </div>
      </div>

      {/* Date */}
      <p style={{ 
        fontSize: '14px',
        color: '#666',
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        📅 {date}
      </p>

      {/* Horoscope Content */}
      <div style={{ 
        backgroundColor: '#f8f9fa',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #e9ecef',
      }}>
        <p style={{ 
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#333',
          margin: '0',
          whiteSpace: 'pre-wrap',
        }}>
          {horoscopeText}
        </p>
      </div>

      {/* CTA Button */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '30px',
      }}>
        <a 
          href="https://azhoroscope.com/horoscope" 
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'background-color 0.2s',
          }}
        >
          Detaylı Yorumu Görüntüle
        </a>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '2px solid #f0f0f0',
        marginTop: '30px',
      }}>
        <p style={{ 
          fontSize: '13px',
          color: '#999',
          margin: '0 0 10px 0',
        }}>
          Bu e-postayı aldınız çünkü AZ-Horoscope platformunda günlük burç yorumu bildirimlerini etkinleştirdiniz.
        </p>
        <p style={{ 
          fontSize: '13px',
          color: '#999',
          margin: '0',
        }}>
          <a 
            href="https://azhoroscope.com/profile" 
            style={{ 
              color: '#666',
              textDecoration: 'underline',
            }}
          >
            Bildirim tercihlerinizi değiştirin
          </a>
        </p>
        <p style={{ 
          fontSize: '12px',
          color: '#bbb',
          margin: '15px 0 0 0',
        }}>
          © 2025 AZ-Horoscope. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
