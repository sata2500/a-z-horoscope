# Az-Horoscope: 20 Kişilik Ekip Çalışma Planı

**Tarih:** 12 Kasım 2025  
**Proje:** Az-Horoscope  
**Ekip Büyüklüğü:** 20 Kişi  
**Metodoloji:** Agile/Scrum

---

## 📊 Ekip Yapısı ve Roller

### 1. Yönetim & Koordinasyon (3 Kişi)

#### 1.1 Product Owner (1 Kişi)
**Sorumluluklar:**
- Product backlog yönetimi
- Özellik önceliklendirme
- Stakeholder iletişimi
- Sprint hedefleri belirleme
- ROI analizi

**Araçlar:**
- Jira / Linear
- Figma (tasarım onayı)
- Google Analytics

#### 1.2 Scrum Master (1 Kişi)
**Sorumluluklar:**
- Sprint planning ve retrospective
- Daily standup yönetimi
- Engelleri kaldırma
- Agile süreç iyileştirme
- Ekip verimliliği takibi

**Araçlar:**
- Jira / Linear
- Miro (retrospective)
- Slack

#### 1.3 Tech Lead (1 Kişi)
**Sorumluluklar:**
- Teknik mimari kararları
- Code review süreçleri
- Teknoloji seçimleri
- Performans optimizasyonu
- Teknik dokümantasyon

**Araçlar:**
- GitHub
- Architecture Decision Records (ADR)
- Lighthouse / Web Vitals

---

### 2. Backend Ekibi (5 Kişi)

#### 2.1 Senior Backend Developer (2 Kişi)
**Sorumluluklar:**
- API tasarımı ve geliştirme
- Database optimizasyonu
- Microservices mimarisi
- Güvenlik implementasyonu
- Junior mentoring

**Odak Alanları:**
- **Developer 1:** API routes, authentication, authorization
- **Developer 2:** Database schema, Prisma, migrations

#### 2.2 Backend Developer (2 Kişi)
**Sorumluluklar:**
- API endpoint geliştirme
- Business logic implementasyonu
- Unit test yazma
- API dokümantasyonu

**Odak Alanları:**
- **Developer 1:** Horoscope API, Gemini AI integration
- **Developer 2:** Journal API, Swiss Ephemeris integration

#### 2.3 DevOps Engineer (1 Kişi)
**Sorumluluklar:**
- CI/CD pipeline yönetimi
- Deployment otomasyonu
- Monitoring ve alerting
- Infrastructure as Code
- Performance monitoring

**Araçlar:**
- Vercel
- GitHub Actions
- Sentry
- DataDog / New Relic

---

### 3. Frontend Ekibi (6 Kişi)

#### 3.1 Senior Frontend Developer (2 Kişi)
**Sorumluluklar:**
- Component architecture
- State management
- Performance optimization
- Accessibility standards
- Junior mentoring

**Odak Alanları:**
- **Developer 1:** Core components, layout system
- **Developer 2:** Forms, data fetching, caching

#### 3.2 Frontend Developer (3 Kişi)
**Sorumluluklar:**
- React component geliştirme
- UI implementation
- Client-side logic
- Unit testing

**Odak Alanları:**
- **Developer 1:** Dashboard, horoscope pages
- **Developer 2:** Journal system, natal chart
- **Developer 3:** Admin panel, user profile

#### 3.3 UI/UX Developer (1 Kişi)
**Sorumluluklar:**
- Design system implementation
- Animation ve transitions
- Responsive design
- CSS architecture
- Accessibility

**Araçlar:**
- Tailwind CSS
- Framer Motion
- Figma (design handoff)

---

### 4. QA & Test Ekibi (2 Kişi)

#### 4.1 QA Engineer (1 Kişi)
**Sorumluluklar:**
- Test planı oluşturma
- Manuel test execution
- Bug reporting
- Regression testing
- UAT koordinasyonu

**Araçlar:**
- TestRail / Zephyr
- Jira (bug tracking)
- BrowserStack (cross-browser)

#### 4.2 Test Automation Engineer (1 Kişi)
**Sorumluluklar:**
- E2E test automation
- Integration test yazma
- CI/CD test entegrasyonu
- Test coverage raporlama

**Araçlar:**
- Playwright / Cypress
- Jest
- GitHub Actions

---

### 5. Design Ekibi (2 Kişi)

#### 5.1 UI/UX Designer (1 Kişi)
**Sorumluluklar:**
- User research
- Wireframe ve mockup
- Prototype oluşturma
- Usability testing
- Design system

**Araçlar:**
- Figma
- FigJam (brainstorming)
- Maze (user testing)

#### 5.2 Graphic Designer (1 Kişi)
**Sorumluluklar:**
- Visual assets
- Icon design
- Illustration
- Marketing materials
- Brand identity

**Araçlar:**
- Figma
- Adobe Illustrator
- Midjourney / DALL-E

---

### 6. Veri & AI Ekibi (2 Kişi)

#### 6.1 AI/ML Engineer (1 Kişi)
**Sorumluluklar:**
- Gemini AI optimizasyonu
- Prompt engineering
- AI model fine-tuning
- Pattern analysis algoritmaları
- AI performance monitoring

**Araçlar:**
- Google AI Studio
- Python
- Jupyter Notebooks

#### 6.2 Data Analyst (1 Kişi)
**Sorumluluklar:**
- User behavior analysis
- A/B test analizi
- Dashboard oluşturma
- Metrik tanımlama
- Insight raporlama

**Araçlar:**
- Google Analytics
- Mixpanel / Amplitude
- Metabase / Looker

---

## 🔄 Agile Workflow

### Sprint Yapısı
- **Sprint Süresi:** 2 hafta
- **Sprint Planning:** Sprint başlangıcı, 4 saat
- **Daily Standup:** Her gün, 15 dakika
- **Sprint Review:** Sprint sonu, 2 saat
- **Sprint Retrospective:** Sprint sonu, 1.5 saat

### Sprint Döngüsü

```
Hafta 1:
├── Pazartesi: Sprint Planning
├── Salı-Cuma: Development
│   ├── Daily Standup (09:00)
│   ├── Code Review Sessions
│   └── Pair Programming (opsiyonel)
└── Cuma: Mid-Sprint Check-in

Hafta 2:
├── Pazartesi-Çarşamba: Development & Testing
├── Perşembe: 
│   ├── Code Freeze (12:00)
│   ├── Final Testing
│   └── Sprint Review (14:00)
└── Cuma:
    ├── Sprint Retrospective (10:00)
    ├── Deployment (14:00)
    └── Next Sprint Preparation
```

---

## 🛠️ Geliştirme Workflow

### 1. Git Workflow (GitHub Flow)

```
main (production)
  ↓
develop (staging)
  ↓
feature/JIRA-123-add-journal-search
  ↓
Pull Request → Code Review → Merge
```

#### Branch Naming Convention
```
feature/JIRA-123-short-description
bugfix/JIRA-456-fix-login-error
hotfix/JIRA-789-critical-security-patch
refactor/JIRA-101-optimize-api
docs/JIRA-202-update-readme
```

#### Commit Message Format
```
feat(journal): add full-text search capability

- Implement search API endpoint
- Add search UI component
- Update Prisma schema with indexes

Closes JIRA-123
```

**Commit Types:**
- `feat`: Yeni özellik
- `fix`: Bug düzeltme
- `refactor`: Kod iyileştirme
- `docs`: Dokümantasyon
- `test`: Test ekleme/düzeltme
- `chore`: Rutin işler (dependency update vb.)
- `perf`: Performance iyileştirme
- `style`: Code formatting

---

### 2. Code Review Süreci

#### Pull Request Checklist
- [ ] Tests yazıldı ve geçiyor
- [ ] TypeScript hatasız
- [ ] ESLint hatasız
- [ ] Build başarılı
- [ ] Accessibility kontrolleri yapıldı
- [ ] Performance impact değerlendirildi
- [ ] Dokümantasyon güncellendi
- [ ] Screenshots/videos eklendi (UI değişiklikleri için)

#### Review Kuralları
1. **Minimum 2 Approval:** Her PR en az 2 developer tarafından onaylanmalı
2. **Tech Lead Approval:** Kritik değişiklikler için Tech Lead onayı gerekli
3. **Response Time:** 24 saat içinde ilk review
4. **Constructive Feedback:** Eleştiriler yapıcı ve öğretici olmalı
5. **No Merge on Friday:** Cuma günleri kritik merge yapılmaz

#### Review Kategorileri
- 🟢 **LGTM (Looks Good To Me):** Onay
- 🟡 **Comment:** Öneri, soru
- 🔴 **Request Changes:** Değişiklik gerekli
- 🔵 **Approved with Suggestions:** Onay ama iyileştirme önerileri var

---

### 3. Testing Stratejisi

#### Test Piramidi
```
        /\
       /E2E\          (10% - Playwright)
      /------\
     /  API   \       (30% - Jest)
    /----------\
   /   Unit     \     (60% - Jest, React Testing Library)
  /--------------\
```

#### Test Coverage Hedefleri
- **Unit Tests:** %80+
- **Integration Tests:** %60+
- **E2E Tests:** Critical paths
- **API Tests:** %90+

#### Test Automation
```yaml
# .github/workflows/test.yml
on: [push, pull_request]

jobs:
  test:
    - Unit Tests
    - Integration Tests
    - E2E Tests (smoke)
    - Accessibility Tests
    - Performance Tests
```

---

### 4. Deployment Pipeline

```
Developer Push
  ↓
GitHub Actions Triggered
  ↓
├── Lint & Type Check
├── Unit Tests
├── Build
└── Integration Tests
  ↓
Deploy to Preview (Vercel)
  ↓
QA Testing
  ↓
Merge to develop
  ↓
Deploy to Staging
  ↓
Staging Tests
  ↓
Merge to main
  ↓
Deploy to Production
  ↓
Smoke Tests
  ↓
Monitoring & Alerting
```

---

## 📅 Sprint Planlama Örneği

### Sprint 1: Foundation & Bug Fixes (2 Hafta)

#### Backend Ekibi
- [ ] ESLint hatalarını düzelt (2 SP)
- [ ] TypeScript strict mode aktif et (3 SP)
- [ ] API rate limiting ekle (5 SP)
- [ ] Database indexleri optimize et (3 SP)
- [ ] API dokümantasyonu (OpenAPI) (5 SP)

#### Frontend Ekibi
- [ ] Accessibility audit ve düzeltmeler (8 SP)
- [ ] Bundle size optimizasyonu (5 SP)
- [ ] Lazy loading implementation (3 SP)
- [ ] Loading states iyileştirme (2 SP)
- [ ] Error boundaries ekle (3 SP)

#### QA Ekibi
- [ ] Test planı oluştur (3 SP)
- [ ] Smoke test suite (5 SP)
- [ ] Bug bash session (2 SP)

#### Design Ekibi
- [ ] Design system dokümantasyonu (5 SP)
- [ ] Dark mode iyileştirmeleri (3 SP)

**Toplam:** 56 Story Points

---

### Sprint 2: Testing & Performance (2 Hafta)

#### Backend Ekibi
- [ ] Unit tests (API routes) (13 SP)
- [ ] Integration tests (8 SP)
- [ ] Error monitoring (Sentry) (5 SP)

#### Frontend Ekibi
- [ ] Component unit tests (13 SP)
- [ ] E2E tests (critical paths) (8 SP)
- [ ] Performance monitoring (3 SP)

#### QA Ekibi
- [ ] Test automation framework (8 SP)
- [ ] Regression test suite (5 SP)

**Toplam:** 63 Story Points

---

## 🔧 Araç ve Teknolojiler

### Proje Yönetimi
- **Jira / Linear:** Sprint planning, backlog management
- **Confluence / Notion:** Dokümantasyon, wiki
- **Miro:** Brainstorming, retrospective

### İletişim
- **Slack:** Daily communication
  - #general
  - #backend
  - #frontend
  - #qa
  - #design
  - #random
- **Google Meet / Zoom:** Meetings
- **Loom:** Async video updates

### Geliştirme
- **GitHub:** Version control
- **VS Code:** IDE (önerilen)
- **GitHub Copilot:** AI pair programming
- **Google Jules:** Autonomous coding tasks

### CI/CD
- **GitHub Actions:** Automation
- **Vercel:** Hosting & deployment
- **Sentry:** Error tracking
- **DataDog:** Monitoring

### Testing
- **Jest:** Unit testing
- **Playwright:** E2E testing
- **React Testing Library:** Component testing
- **Lighthouse CI:** Performance testing

### Design
- **Figma:** Design & prototyping
- **Zeplin / Figma Inspect:** Design handoff
- **Storybook:** Component documentation

---

## 📊 Metrikler ve KPI'lar

### Geliştirme Metrikleri
1. **Velocity:** Sprint başına tamamlanan story points
2. **Cycle Time:** Ticket açılışından deploy'a kadar geçen süre
3. **Lead Time:** İlk commit'ten production'a kadar geçen süre
4. **Deployment Frequency:** Günlük deployment sayısı
5. **Change Failure Rate:** Deployment sonrası hata oranı
6. **MTTR (Mean Time To Recovery):** Hata düzeltme süresi

### Kod Kalitesi Metrikleri
1. **Test Coverage:** %80+ hedef
2. **Code Review Time:** 24 saat içinde ilk review
3. **PR Size:** Ortalama 200-400 satır
4. **Bug Density:** 1000 satır koda düşen bug sayısı
5. **Technical Debt Ratio:** Sonar analizi

### Kullanıcı Metrikleri
1. **User Satisfaction:** NPS score
2. **Page Load Time:** <2 saniye
3. **Error Rate:** <%1
4. **Uptime:** %99.9+
5. **Active Users:** DAU, MAU

---

## 🎯 Ekip Ritüelleri

### Daily Standup (15 dk)
**Format:**
- Dün ne yaptım?
- Bugün ne yapacağım?
- Engellerim var mı?

**Kurallar:**
- Kamera açık
- Saat 09:00
- Maksimum 15 dakika
- Detaylı tartışmalar sonraya

### Sprint Planning (4 saat)
**Ajanda:**
1. Sprint hedefi belirleme (30 dk)
2. Backlog refinement (1 saat)
3. Story estimation (1.5 saat)
4. Sprint commitment (1 saat)

### Sprint Review (2 saat)
**Ajanda:**
1. Demo (1 saat)
2. Stakeholder feedback (30 dk)
3. Backlog güncelleme (30 dk)

### Sprint Retrospective (1.5 saat)
**Format:** Start, Stop, Continue
1. What went well?
2. What didn't go well?
3. What should we improve?

**Action Items:**
- Her retrospective'den 2-3 action item
- Sorumlu atama
- Takip mekanizması

---

## 🚀 Onboarding Süreci (Yeni Ekip Üyeleri)

### İlk Gün
- [ ] Araç erişimleri (GitHub, Jira, Slack, Figma)
- [ ] Geliştirme ortamı kurulumu
- [ ] Ekip tanışması
- [ ] Proje overview sunumu
- [ ] Buddy assignment

### İlk Hafta
- [ ] Codebase walkthrough
- [ ] İlk küçük task (good first issue)
- [ ] Code review sürecine katılım
- [ ] Daily standup'lara katılım
- [ ] Dokümantasyon okuma

### İlk Ay
- [ ] Orta büyüklükte feature geliştirme
- [ ] Code review yapma
- [ ] Sprint planning'e aktif katılım
- [ ] Pair programming sessions
- [ ] Feedback toplama

---

## 📚 Dokümantasyon Standartları

### Kod Dokümantasyonu
```typescript
/**
 * Kullanıcının günlük burç yorumunu getirir
 * 
 * @param userId - Kullanıcı ID'si
 * @param zodiacSign - Burç işareti (aries, taurus, vb.)
 * @param date - Yorum tarihi (opsiyonel, varsayılan: bugün)
 * @returns Burç yorumu ve metadata
 * @throws {UnauthorizedError} Kullanıcı yetkisiz ise
 * @throws {NotFoundError} Yorum bulunamazsa
 * 
 * @example
 * const reading = await getDailyHoroscope('user123', 'aries')
 * console.log(reading.content)
 */
async function getDailyHoroscope(
  userId: string,
  zodiacSign: ZodiacSign,
  date?: Date
): Promise<HoroscopeReading>
```

### API Dokümantasyonu
- OpenAPI 3.0 specification
- Request/response örnekleri
- Error codes ve messages
- Authentication requirements
- Rate limiting bilgisi

### README Standartları
Her klasörde README.md:
- Amaç ve sorumluluk
- Dosya yapısı
- Kullanım örnekleri
- Test çalıştırma
- Troubleshooting

---

## 🔐 Güvenlik ve Compliance

### Security Checklist
- [ ] Environment variables güvenli
- [ ] API rate limiting aktif
- [ ] Input validation (Zod)
- [ ] SQL injection koruması (Prisma)
- [ ] XSS koruması
- [ ] CSRF protection
- [ ] HTTPS zorunlu
- [ ] Security headers
- [ ] Dependency scanning
- [ ] Secret scanning

### Code Review Security Focus
- Sensitive data exposure
- Authentication/authorization
- Input validation
- Error handling
- Logging (no sensitive data)

---

## 🎓 Sürekli Öğrenme

### Haftalık Tech Talks (1 saat)
- Ekip üyeleri sırayla sunum
- Yeni teknolojiler
- Best practices
- Post-mortem analizleri

### Aylık Hackathon (1 gün)
- Yeni özellik denemeleri
- Teknik borç temizliği
- Proof of concept'ler
- Eğlenceli projeler

### Quarterly OKRs
- Ekip hedefleri
- Bireysel gelişim hedefleri
- Teknik iyileştirmeler
- Süreç optimizasyonları

---

## 📞 İletişim Protokolleri

### Senkron İletişim
- **Acil:** Slack DM + telefon
- **Önemli:** Slack mention (@name)
- **Genel:** Slack channel mesajı
- **Planlı:** Calendar invite

### Asenkron İletişim
- **Dokümantasyon:** Confluence/Notion
- **Code Review:** GitHub PR comments
- **Bug Report:** Jira ticket
- **Feature Request:** Product backlog

### Response Time Expectations
- **Acil (P0):** 15 dakika
- **Yüksek (P1):** 2 saat
- **Orta (P2):** 1 gün
- **Düşük (P3):** 3 gün

---

## 🎯 Başarı Kriterleri

### Ekip Başarısı
- ✅ Sprint hedeflerine %90+ ulaşma
- ✅ Deployment frequency: Günde 2+
- ✅ Change failure rate: <%5
- ✅ Test coverage: %80+
- ✅ Code review time: <24 saat

### Ürün Başarısı
- ✅ Page load time: <2 saniye
- ✅ Uptime: %99.9+
- ✅ Error rate: <%1
- ✅ User satisfaction: NPS >50
- ✅ Active users: %20 aylık büyüme

### Ekip Mutluluğu
- ✅ Quarterly survey: >4/5
- ✅ Retention rate: >90%
- ✅ Work-life balance
- ✅ Learning opportunities
- ✅ Career growth

---

## 📝 Sonuç

Bu plan, 20 kişilik bir ekibin Az-Horoscope projesi üzerinde verimli ve organize şekilde çalışmasını sağlamak için tasarlanmıştır. Agile/Scrum metodolojisi, modern araçlar ve best practice'ler kullanılarak yüksek kaliteli yazılım geliştirme hedeflenmiştir.

**Önemli:** Bu plan bir başlangıç noktasıdır ve ekip dinamiklerine göre sürekli olarak adapte edilmelidir. Sprint retrospective'lerden çıkan action item'lar ile süreç iyileştirmeleri yapılmalıdır.
