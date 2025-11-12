/**
 * Test Email API Endpoint
 * 
 * Bu endpoint tarayıcıdan email testi yapmak için kullanılır.
 * 
 * Kullanım:
 * GET /api/test-email?to=your-email@example.com
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const toEmail = searchParams.get('to')

    if (!toEmail) {
      return NextResponse.json(
        { 
          error: 'Email adresi gerekli',
          usage: '/api/test-email?to=your-email@example.com'
        },
        { status: 400 }
      )
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(toEmail)) {
      return NextResponse.json(
        { error: 'Geçersiz email formatı' },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: 'AZ-Horoscope <noreply@azhoroscope.com>',
      to: [toEmail],
      subject: '🌟 AZ-Horoscope Email Test',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .success {
                background: #10b981;
                color: white;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                margin: 20px 0;
              }
              .info {
                background: white;
                padding: 20px;
                border-left: 4px solid #667eea;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                color: #6b7280;
                font-size: 14px;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🌟 AZ-Horoscope</h1>
              <p>Email Test Mesajı</p>
            </div>
            
            <div class="content">
              <div class="success">
                <h2>✅ Email Gönderimi Başarılı!</h2>
              </div>
              
              <div class="info">
                <h3>📋 Test Detayları</h3>
                <p><strong>Domain:</strong> azhoroscope.com</p>
                <p><strong>Gönderen:</strong> noreply@azhoroscope.com</p>
                <p><strong>Alıcı:</strong> ${toEmail}</p>
                <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
              </div>
              
              <div class="info">
                <h3>🎯 Bu Email'i Aldıysanız:</h3>
                <ul>
                  <li>✅ Resend domain doğrulaması başarılı</li>
                  <li>✅ SPF, DKIM, DMARC kayıtları doğru</li>
                  <li>✅ Email gönderimi çalışıyor</li>
                  <li>✅ Günlük burç yorumları gönderilebilir</li>
                </ul>
              </div>
              
              <div class="info">
                <h3>📧 Sonraki Adımlar:</h3>
                <ol>
                  <li>Uygulamaya giriş yapın</li>
                  <li>Profile → Notification Settings</li>
                  <li>Email bildirimlerini aktif edin</li>
                  <li>Ertesi gün günlük burç yorumunuzu alın!</li>
                </ol>
              </div>
              
              <div class="footer">
                <p>Bu bir test mesajıdır.</p>
                <p>AZ-Horoscope © 2025</p>
                <p><a href="https://azhoroscope.com">azhoroscope.com</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Email gönderim hatası:', error)
      return NextResponse.json(
        { 
          error: 'Email gönderilemedi',
          details: error
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email başarıyla gönderildi!',
      to: toEmail,
      from: 'noreply@azhoroscope.com',
      emailId: data?.id,
      timestamp: new Date().toISOString(),
      note: 'Email kutunuzu ve spam klasörünüzü kontrol edin.'
    })

  } catch (error) {
    console.error('Beklenmeyen hata:', error)
    return NextResponse.json(
      { 
        error: 'Beklenmeyen bir hata oluştu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    )
  }
}
