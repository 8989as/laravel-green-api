# 🚀 Coding Agent Task List: Laravel + React + Filament Bilingual Website

**Project:** Laravel React Starter Kit with Filament Admin  
**Priority:** P0 (Critical) → P1 (High) → P2 (Medium) → P3 (Low)  
**Estimated Total Effort:** 11-16 days  
**Current Status:** HOLD (Cannot release until P0 tasks completed)  

---

## 📋 How to Use This Document

This is a **prioritized, actionable task list** for your coding agent. Each task includes:
- **Task ID** - Unique identifier (e.g., P0-001)
- **Title** - Clear description of what needs to be done
- **Priority** - P0 (Critical) to P3 (Low)
- **Category** - Backend, Frontend, Security, Testing, etc.
- **Files to Modify** - Exact file paths
- **Acceptance Criteria** - How to verify the task is complete
- **Estimated Time** - Rough time estimate
- **Dependencies** - Tasks that must be completed first
- **Notes** - Additional context or warnings

---

## 🎯 Phase 1: P0 Critical Tasks (MUST COMPLETE FIRST - Blocks Release)

### P0-001: Fix RTL Direction Attribute in HTML Template
**Priority:** P0 Critical | **Category:** Frontend | **Time:** 1 hour

**Task:** Add `dir` attribute to the HTML element that changes based on locale

**Files to Modify:**
- [resources/views/app.blade.php](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/resources/views/app.blade.php)

**Changes Required:**
```php
// BEFORE:
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

// AFTER:
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
```

**Acceptance Criteria:**
- [ ] `dir="rtl"` appears when locale is `ar`
- [ ] `dir="ltr"` appears when locale is `en`
- [ ] Attribute changes dynamically when switching languages
- [ ] No console errors in browser

**Dependencies:** None

---

### P0-002: Implement Locale Persistence Mechanism
**Priority:** P0 Critical | **Category:** Backend + Frontend | **Time:** 4-6 hours

**Task:** Create a mechanism to persist locale choice across frontend and backend

**Files to Create/Modify:**
- `app/Http/Middleware/LocaleMiddleware.php` (NEW)
- `app/Http/Kernel.php`
- [resources/js/i18n/config.js](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/resources/js/i18n/config.js)
- [.env.example](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/.env.example)

**Changes Required:**

1. **Create LocaleMiddleware.php:**
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LocaleMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check for locale in: 1) Session, 2) Cookie, 3) Accept-Language header, 4) Default
        $locale = $request->session()->get('locale', 
            $request->cookie('locale', 
                $request->header('Accept-Language', config('app.locale'))
            )
        );
        
        // Validate locale
        $availableLocales = ['en', 'ar'];
        if (!in_array($locale, $availableLocales)) {
            $locale = config('app.fallback_locale', 'en');
        }
        
        // Set app locale
        app()->setLocale($locale);
        
        return $next($request);
    }
}
```

2. **Register Middleware in Kernel.php:**
```php
// Add to $middlewareGroups['web']:
\App\Http\Middleware\LocaleMiddleware::class,
```

3. **Update i18n/config.js:**
```javascript
// Add locale sync with backend
import i18n from 'i18next';

// Sync with backend locale
export const syncLocaleWithBackend = async (locale) => {
    try {
        // Store in cookie
        document.cookie = `locale=${locale}; path=/; max-age=${60*60*24*365}`;
        
        // Set Accept-Language header for API requests
        axios.defaults.headers.common['Accept-Language'] = locale;
        
        // Change i18next language
        await i18n.changeLanguage(locale);
    } catch (error) {
        console.error('Failed to sync locale:', error);
    }
};
```

**Acceptance Criteria:**
- [ ] Locale persists across page refreshes
- [ ] Locale persists across navigation
- [ ] Locale persists after login/logout
- [ ] Backend receives correct locale in requests
- [ ] API responses use correct locale
- [ ] Frontend and backend stay in sync

**Dependencies:** None

---

### P0-003: Fix Twilio OTP Authentication
**Priority:** P0 Critical | **Category:** Backend | **Time:** 2-4 hours

**Task:** Fix Twilio OTP configuration and implementation

**Files to Modify:**
- [.env.example](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/.env.example)
- `config/services.php`
- `app/Services/TwilioService.php` (if exists)
- [tests/Feature/TwilioAuthTest.php](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/tests/Feature/TwilioAuthTest.php)

**Changes Required:**

1. **Verify .env Configuration:**
```env
# Required Twilio settings
TWILIO_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM=+1234567890
TWILIO_ENVIRONMENT=sandbox
```

2. **Update config/services.php:**
```php
'twilio' => [
    'sid' => env('TWILIO_SID'),
    'token' => env('TWILIO_AUTH_TOKEN'),
    'from' => env('TWILIO_FROM'),
    'environment' => env('TWILIO_ENVIRONMENT', 'sandbox'),
],
```

3. **Fix Twilio Service:**
```php
// Ensure proper error handling
public function sendOtp($phoneNumber)
{
    try {
        if (config('services.twilio.environment') === 'sandbox') {
            // For sandbox, use Twilio's test credentials
            $sid = 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
            $token = 'your_auth_token';
            $from = '+1234567890';
        } else {
            $sid = config('services.twilio.sid');
            $token = config('services.twilio.token');
            $from = config('services.twilio.from');
        }
        
        $client = new \Twilio\Rest\Client($sid, $token);
        $client->messages->create(
            $phoneNumber,
            ['from' => $from, 'body' => 'Your OTP code is: 123456']
        );
        
        return true;
    } catch (\Exception $e) {
        \Log::error('Twilio OTP Error: ' . $e->getMessage());
        return false;
    }
}
```

4. **Update Tests to Use Sandbox:**
```php
// In TwilioAuthTest.php, use mock or sandbox mode
public function testSendOtp()
{
    config(['services.twilio.environment' => 'sandbox']);
    
    $response = $this->post('/api/send-otp', [
        'phone' => '+1234567890'
    ]);
    
    $response->assertStatus(200);
}
```

**Acceptance Criteria:**
- [ ] `/api/send-otp` returns 200 status (not 500)
- [ ] OTP tests pass in sandbox mode
- [ ] Proper error handling for missing configuration
- [ ] No exceptions thrown in production

**Dependencies:** None

---

### P0-004: Patch Critical Security Vulnerabilities
**Priority:** P0 Critical | **Category:** Security | **Time:** 2-3 hours

**Task:** Update dependencies to patch critical CVEs

**Commands to Run:**
```bash
# Backend dependencies
composer update symfony/html-sanitizer symfony/http-foundation symfony/mailer symfony/mime symfony/routing symfony/yaml

# Frontend dependencies  
npm audit fix --force
# If above doesn't work:
npm update axios brace-expansion braces @babel/core
```

**Files to Verify:**
- `composer.lock` - Check Symfony versions
- `package-lock.json` - Check Axios version

**Acceptance Criteria:**
- [ ] `composer audit` shows 0 critical vulnerabilities
- [ ] `npm audit` shows 0 critical vulnerabilities
- [ ] All dependencies still compatible
- [ ] Application still builds successfully

**Dependencies:** None

---

## 🎯 Phase 2: P1 High Priority Tasks (Complete After P0)

### P1-001: Add RTL CSS Support
**Priority:** P1 High | **Category:** Frontend | **Time:** 4-8 hours

**Task:** Implement RTL CSS for Arabic layout

**Files to Create/Modify:**
- [resources/css/app.css](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/resources/css/app.css)
- [resources/js/index.css](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/resources/js/index.css)
- `resources/css/rtl.css` (NEW)

**Changes Required:**

1. **Add RTL CSS File:**
```css
/* resources/css/rtl.css */
[dir="rtl"] {
    direction: rtl;
    text-align: right;
}

[dir="rtl"] .text-left {
    text-align: right !important;
}

[dir="rtl"] .text-right {
    text-align: left !important;
}

[dir="rtl"] .float-left {
    float: right !important;
}

[dir="rtl"] .float-right {
    float: left !important;
}

[dir="rtl"] .mr-2 {
    margin-right: 0.5rem !important;
    margin-left: 0 !important;
}

[dir="rtl"] .ml-2 {
    margin-left: 0.5rem !important;
    margin-right: 0 !important;
}

/* Add more as needed */
```

2. **Import RTL CSS in app.blade.php:**
```php
@if(app()->getLocale() === 'ar')
    <link href="{{ asset('css/rtl.css') }}" rel="stylesheet">
@endif
```

3. **Update Vite Config:**
```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "resources/css/rtl.css";`
            }
        }
    }
});
```

**Acceptance Criteria:**
- [ ] Layout mirrors correctly in Arabic
- [ ] Navigation, forms, tables display properly
- [ ] No overlapping elements
- [ ] Directional icons flip correctly
- [ ] Tested at 360px, 768px, 1024px, 1440px

**Dependencies:** P0-001

---

### P1-002: Configure Filament for RTL and Arabic
**Priority:** P1 High | **Category:** Backend + Admin | **Time:** 4-6 hours

**Task:** Enable Arabic language and RTL support in Filament

**Files to Create/Modify:**
- [app/Providers/Filament/AdminPanelProvider.php](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/app/Providers/Filament/AdminPanelProvider.php)
- `composer.json` (add filament-translatable plugin)
- `resources/lang/ar/filament.php` (NEW)

**Changes Required:**

1. **Install Filament Translation Plugin:**
```bash
composer require bezhansalleh/filament-translatable
```

2. **Update AdminPanelProvider.php:**
```php
<?php

namespace App\Providers\Filament;

use Filament\Panel;
use Filament\PanelProvider;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Session\Middleware\StartSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->registration()
            ->passwordReset()
            ->emailVerification()
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
                \App\Http\Middleware\LocaleMiddleware::class, // Add locale middleware
            ])
            ->plugins([
                \BezhanSalleh\FilamentTranslatable\FilamentTranslatablePlugin::make()
                    ->defaultLocales(['en', 'ar'])
                    ->fallbackLocale('en'),
            ])
            ->brandName('Admin Panel')
            ->favicon(asset('images/logo.svg'));
    }
}
```

3. **Create Arabic Translations for Filament:**
```php
// resources/lang/ar/filament.php
return [
    'dashboard' => 'لوحة التحكم',
    'resources' => 'الموارد',
    'create' => 'إنشاء',
    'edit' => 'تعديل',
    'view' => 'عرض',
    'delete' => 'حذف',
    'save' => 'حفظ',
    'cancel' => 'إلغاء',
    // Add all Filament UI strings
];
```

4. **Add RTL Support to Filament:**
```php
// In AdminPanelProvider.php
public function panel(Panel $panel): Panel
{
    return $panel
        // ... existing code
        ->direction(app()->getLocale() === 'ar' ? 'rtl' : 'ltr')
        ->language(app()->getLocale());
}
```

**Acceptance Criteria:**
- [ ] Filament admin displays in Arabic when locale is `ar`
- [ ] Filament admin displays in English when locale is `en`
- [ ] RTL layout works in Filament admin
- [ ] All admin resources translatable
- [ ] Locale switcher works in admin panel

**Dependencies:** P0-002

---

### P1-003: Complete Arabic Translations
**Priority:** P1 High | **Category:** Frontend | **Time:** 6-8 hours

**Task:** Complete all Arabic translations for the frontend

**Files to Modify:**
- [resources/js/i18n/config.js](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/resources/js/i18n/config.js)

**Changes Required:**

1. **Audit Current Translations:**
```bash
# Find all translation keys used in the app
grep -r "t\|i18n\|useTranslation" resources/js/ --include="*.jsx" --include="*.js" | grep -oP "t\('([^']+)'" | sort | uniq
```

2. **Complete Arabic Translations:**
```javascript
// In resources/js/i18n/config.js
// Add missing Arabic translations for:
// - All page titles
// - All form labels
// - All buttons
// - All validation messages
// - All error messages
// - All success messages
// - All product-related text
// - All checkout flow text
// - All admin panel text

export const ar = {
    translation: {
        // Existing translations...
        
        // Add missing translations:
        'welcome': 'مرحبًا',
        'home': 'الرئيسية',
        'products': 'المنتجات',
        'categories': 'التصنيفات',
        'cart': 'سلة المشتريات',
        'checkout': 'إتمام الشراء',
        'login': 'تسجيل الدخول',
        'register': 'إنشاء حساب',
        'logout': 'تسجيل الخروج',
        'profile': 'الملف الشخصي',
        'settings': 'الإعدادات',
        'search': 'بحث',
        'add_to_cart': 'أضف إلى السلة',
        'remove_from_cart': 'إزالة من السلة',
        'total': 'الإجمالي',
        'subtotal': 'المبلغ الفرعي',
        'tax': 'الضريبة',
        'shipping': 'التوصيل',
        'discount': 'الخصم',
        'quantity': 'الكمية',
        'price': 'السعر',
        'description': 'الوصف',
        'name': 'الاسم',
        'email': 'البريد الإلكتروني',
        'phone': 'الهاتف',
        'address': 'العنوان',
        'city': 'المدينة',
        'country': 'الدولة',
        'zip_code': 'الرمز البريدي',
        'payment_method': 'طريقة الدفع',
        'credit_card': 'بطاقة ائتمان',
        'cash_on_delivery': 'الدفع عند الاستلام',
        'place_order': 'تأكيد الطلب',
        'order_confirmation': 'تأكيد الطلب',
        'thank_you': 'شكرًا لك',
        'order_number': 'رقم الطلب',
        'status': 'الحالة',
        'pending': 'قيد الانتظار',
        'processing': 'قيد المعالجة',
        'shipped': 'تم الشحن',
        'delivered': 'تم التوصيل',
        'cancelled': 'ملغى',
        'refunded': 'مسترد',
        'my_orders': 'طلبياتي',
        'order_history': 'سجل الطلبات',
        'account_settings': 'إعدادات الحساب',
        'change_password': 'تغيير كلمة المرور',
        'current_password': 'كلمة المرور الحالية',
        'new_password': 'كلمة المرور الجديدة',
        'confirm_password': 'تأكيد كلمة المرور',
        'forgot_password': 'نسيت كلمة المرور؟',
        'reset_password': 'إعادة تعيين كلمة المرور',
        'verify_email': 'تأكيد البريد الإلكتروني',
        'resend_verification': 'إعادة إرسال رمز التأكيد',
        'contact_us': 'اتصل بنا',
        'about_us': 'من نحن',
        'terms_and_conditions': 'الشروط والأحكام',
        'privacy_policy': 'سياسة الخصوصية',
        'faq': 'الأسئلة الشائعة',
        'no_results': 'لا توجد نتائج',
        'loading': 'جاري التحميل...',
        'error': 'خطأ',
        'success': 'نجح',
        'warning': 'تحذير',
        'are_you_sure': 'هل أنت متأكد؟',
        'delete_confirmation': 'هل تريد حذف هذا العنصر؟',
        'this_action_cannot_be_undone': 'لا يمكن التراجع عن هذا الإجراء',
        // Add more as needed
    }
};
```

3. **Deduplicate Translation Keys:**
```javascript
// Remove duplicate keys in both en and ar
// Keep only the last definition of each key
```

**Acceptance Criteria:**
- [ ] All UI text has Arabic translation
- [ ] No raw translation keys visible in UI
- [ ] No mixed language content
- [ ] All pages display correctly in Arabic

**Dependencies:** P0-002

---

### P1-004: Create Laravel Translation Files
**Priority:** P1 High | **Category:** Backend | **Time:** 2-3 hours

**Task:** Create Laravel translation files for backend messages

**Files to Create:**
- `resources/lang/en/validation.php`
- `resources/lang/ar/validation.php`
- `resources/lang/en/messages.php`
- `resources/lang/ar/messages.php`
- `resources/lang/en/auth.php`
- `resources/lang/ar/auth.php`

**Changes Required:**

1. **Create Directory Structure:**
```bash
mkdir -p resources/lang/en resources/lang/ar
```

2. **Create validation.php (English):**
```php
// resources/lang/en/validation.php
return [
    'required' => 'The :attribute field is required.',
    'email' => 'The :attribute must be a valid email address.',
    'numeric' => 'The :attribute must be a number.',
    'min' => 'The :attribute must be at least :min characters.',
    'max' => 'The :attribute may not be greater than :max characters.',
    'confirmed' => 'The :attribute confirmation does not match.',
    'unique' => 'The :attribute has already been taken.',
    'exists' => 'The selected :attribute is invalid.',
    // Add all validation rules
];
```

3. **Create validation.php (Arabic):**
```php
// resources/lang/ar/validation.php
return [
    'required' => 'حقل :attribute مطلوب.',
    'email' => 'يجب أن يكون :attribute عنوان بريد إلكتروني صالح.',
    'numeric' => 'يجب أن يكون :attribute رقم.',
    'min' => 'يجب أن يكون :attribute على الأقل :min أحرف.',
    'max' => 'لا يمكن أن يكون :attribute أكثر من :max أحرف.',
    'confirmed' => 'تأكيد :attribute غير متطابق.',
    'unique' => 'تم استخدام :attribute مسبقًا.',
    'exists' => 'ال :attribute المختار غير صالح.',
    // Add all validation rules in Arabic
];
```

4. **Create messages.php (English):**
```php
// resources/lang/en/messages.php
return [
    'welcome' => 'Welcome to our application',
    'goodbye' => 'Goodbye',
    'success' => 'Operation completed successfully',
    'error' => 'An error occurred',
    'not_found' => 'Resource not found',
    'unauthorized' => 'Unauthorized access',
    // Add all backend messages
];
```

5. **Create messages.php (Arabic):**
```php
// resources/lang/ar/messages.php
return [
    'welcome' => 'مرحبًا بك في تطبيقنا',
    'goodbye' => 'مع السلامة',
    'success' => 'تمت العملية بنجاح',
    'error' => 'حدث خطأ',
    'not_found' => 'المورد غير موجود',
    'unauthorized' => 'وصول غير مصرح به',
    // Add all backend messages in Arabic
];
```

6. **Create auth.php (English):**
```php
// resources/lang/en/auth.php
return [
    'failed' => 'These credentials do not match our records.',
    'password' => 'The provided password is incorrect.',
    'throttle' => 'Too many login attempts. Please try again in :seconds seconds.',
    'otp_sent' => 'OTP code sent successfully.',
    'otp_verified' => 'OTP verified successfully.',
    'otp_invalid' => 'Invalid OTP code.',
    'otp_expired' => 'OTP code has expired.',
];
```

7. **Create auth.php (Arabic):**
```php
// resources/lang/ar/auth.php
return [
    'failed' => 'بيانات الاعتماد هذه لا تطابق سجلاتنا.',
    'password' => 'كلمة المرور المقدمة غير صحيحة.',
    'throttle' => 'محاولات تسجيل دخول كثيرة. يرجى المحاولة مرة أخرى بعد :seconds ثوانٍ.',
    'otp_sent' => 'تم إرسال رمز OTP بنجاح.',
    'otp_verified' => 'تم التحقق من رمز OTP بنجاح.',
    'otp_invalid' => 'رمز OTP غير صالح.',
    'otp_expired' => 'انتهت صلاحية رمز OTP.',
];
```

**Acceptance Criteria:**
- [ ] Laravel can load translations from files
- [ ] Validation messages appear in correct locale
- [ ] API error messages appear in correct locale
- [ ] All backend messages have translations

**Dependencies:** P0-002

---

### P1-005: Fix Settings Routes or Remove Tests
**Priority:** P1 High | **Category:** Backend | **Time:** 2-3 hours

**Task:** Either fix settings routes or remove settings-related tests

**Option A: Fix Settings Routes (Recommended)**

**Files to Modify:**
- [routes/settings.php](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/routes/settings.php)
- `app/Http/Controllers/Settings/ProfileController.php` (if exists)

**Changes Required:**
```php
// routes/settings.php
// Uncomment and fix all routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
    Route::put('/email', [EmailController::class, 'update'])->name('email.update');
});
```

**Option B: Remove Settings Tests (If not using settings functionality)**

**Files to Delete/Modify:**
- Delete `tests/Feature/Settings/` directory
- Or comment out settings tests in `phpunit.xml`

**Acceptance Criteria:**
- [ ] Either settings routes work OR settings tests are removed
- [ ] No 405 errors on settings endpoints
- [ ] Test suite passes (or settings tests excluded)

**Dependencies:** None

---

## 🎯 Phase 3: P2 Medium Priority Tasks

### P2-001: Create Locale Middleware
**Priority:** P2 Medium | **Category:** Backend | **Time:** 1-2 hours

**Note:** This may already be covered by P0-002. If locale middleware was created in P0-002, this task is already complete.

**Files to Create:**
- `app/Http/Middleware/LocaleMiddleware.php`

**Acceptance Criteria:**
- [ ] Middleware detects locale from Accept-Language header
- [ ] Middleware detects locale from cookie
- [ ] Middleware detects locale from session
- [ ] Middleware falls back to default locale
- [ ] Middleware validates locale is supported

**Dependencies:** P0-002

---

### P2-002: Localize Form Validation
**Priority:** P2 Medium | **Category:** Backend | **Time:** 2-3 hours

**Task:** Ensure form validation messages are localized

**Files to Modify:**
- All form request classes in `app/Http/Requests/`
- All controllers with inline validation

**Changes Required:**
```php
// In form requests, use trans() helper
public function rules()
{
    return [
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:8|confirmed',
    ];
}

public function messages()
{
    return [
        'name.required' => trans('validation.required', ['attribute' => 'name']),
        'email.required' => trans('validation.required', ['attribute' => 'email']),
        'email.email' => trans('validation.email', ['attribute' => 'email']),
        'password.required' => trans('validation.required', ['attribute' => 'password']),
        'password.min' => trans('validation.min', ['attribute' => 'password', 'min' => 8]),
        'password.confirmed' => trans('validation.confirmed', ['attribute' => 'password']),
    ];
}
```

**Acceptance Criteria:**
- [ ] Validation messages appear in correct locale
- [ ] All form requests have localized messages
- [ ] Inline validation uses trans() helper

**Dependencies:** P1-004

---

### P2-003: Verify Database Charset
**Priority:** P2 Medium | **Category:** Database | **Time:** 1-2 hours

**Task:** Ensure database supports Arabic and emoji characters

**Files to Modify:**
- All migration files in `database/migrations/`
- `.env` (database configuration)

**Changes Required:**

1. **Check Database Configuration:**
```env
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci
```

2. **Update Migrations:**
```php
// In all migrations, ensure charset is specified
Schema::create('table_name', function (Blueprint $table) {
    $table->id();
    $table->string('name')->charset('utf8mb4');
    $table->string('description')->charset('utf8mb4');
    $table->text('content')->charset('utf8mb4');
    // ... all string/text fields
    $table->timestamps();
});
```

3. **Verify Existing Database:**
```bash
# Check current charset
php artisan db:show

# If not utf8mb4, create migration to convert
php artisan make:migration convert_to_utf8mb4
```

**Acceptance Criteria:**
- [ ] Database uses utf8mb4 charset
- [ ] Database uses utf8mb4_unicode_ci collation
- [ ] All string/text fields support full Unicode
- [ ] Arabic text can be stored and retrieved correctly
- [ ] Emoji can be stored and retrieved correctly

**Dependencies:** None

---

### P2-004: Add Hreflang Tags
**Priority:** P2 Medium | **Category:** SEO | **Time:** 1-2 hours

**Task:** Add hreflang tags for SEO

**Files to Modify:**
- [resources/views/app.blade.php](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/resources/views/app.blade.php)

**Changes Required:**
```php
<!-- In app.blade.php head section -->
<link rel="alternate" hreflang="en" href="{{ url()->current() }}" />
<link rel="alternate" hreflang="ar" href="{{ url()->current() }}?lang=ar" />
<link rel="alternate" hreflang="x-default" href="{{ url()->current() }}" />
```

**Acceptance Criteria:**
- [ ] Hreflang tags present in page source
- [ ] Both en and ar hreflang tags present
- [ ] x-default hreflang tag present
- [ ] URLs in hreflang tags are correct

**Dependencies:** P0-002

---

### P2-005: Add Rate Limiting to Auth Endpoints
**Priority:** P2 Medium | **Category:** Security | **Time:** 1-2 hours

**Task:** Add rate limiting to authentication endpoints

**Files to Modify:**
- [routes/api.php](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/routes/api.php)

**Changes Required:**
```php
// In routes/api.php
Route::middleware(['throttle:5,1'])->group(function () {
    Route::post('/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
});

// For more strict limiting on OTP
Route::middleware(['throttle:3,1'])->post('/send-otp', [AuthController::class, 'sendOtp']);
```

**Acceptance Criteria:**
- [ ] Rate limiting applied to auth endpoints
- [ ] Too many requests returns 429 status
- [ ] Rate limit headers present in responses
- [ ] OTP endpoint has stricter limit than others

**Dependencies:** None

---

### P2-006: Secure File Uploads
**Priority:** P2 Medium | **Category:** Security | **Time:** 2-3 hours

**Task:** Ensure file uploads are secure

**Files to Modify:**
- `app/Http/Controllers/ProductController.php` (or wherever uploads are handled)
- `app/Http/Requests/StoreProductRequest.php` (or similar)
- `config/filesystems.php`

**Changes Required:**

1. **Add File Validation:**
```php
// In StoreProductRequest.php
public function rules()
{
    return [
        'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'gallery.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ];
}
```

2. **Sanitize Filenames:**
```php
// In controller
public function store(Request $request)
{
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);
    
    if ($request->hasFile('image')) {
        $file = $request->file('image');
        $filename = time() . '_' . str_replace(' ', '_', $file->getClientOriginalName());
        $path = $file->storeAs('public/products', $filename);
        
        // Save $path to database
    }
}
```

3. **Prevent Path Traversal:**
```php
// In filesystem config
'disks' => [
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
        'throw' => false,
    ],
],
```

**Acceptance Criteria:**
- [ ] File uploads validate file types
- [ ] File uploads have size limits
- [ ] Filenames are sanitized
- [ ] No path traversal possible
- [ ] Uploaded files stored securely

**Dependencies:** None

---

## 🎯 Phase 4: P3 Low Priority Tasks

### P3-001: Remove Duplicate Routes
**Priority:** P3 Low | **Category:** Backend | **Time:** 30 minutes

**Task:** Remove duplicate route definitions

**Files to Modify:**
- [routes/api.php](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/routes/api.php)

**Changes Required:**
```php
// Remove line 47 (duplicate of line 46)
// Keep only one definition of categories/{id}/products route
```

**Acceptance Criteria:**
- [ ] No duplicate route definitions
- [ ] Route caching works without errors
- [ ] All routes still functional

**Dependencies:** None

---

### P3-002: Clean Up Commented Auth Routes
**Priority:** P3 Low | **Category:** Backend | **Time:** 30 minutes

**Task:** Remove or uncomment auth routes

**Files to Modify:**
- [routes/auth.php](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/routes/auth.php)

**Changes Required:**
```php
// Either:
// Option A: Uncomment and use the routes
// Option B: Delete the file entirely if not using web-based auth
```

**Acceptance Criteria:**
- [ ] No commented-out code in routes files
- [ ] Clear whether using API or web auth

**Dependencies:** None

---

### P3-003: Deduplicate Translation Keys
**Priority:** P3 Low | **Category:** Frontend | **Time:** 1-2 hours

**Task:** Remove duplicate translation keys

**Files to Modify:**
- [resources/js/i18n/config.js](file:///Users/ahmedsaeed/Projects/Laravel/laravel-green-api/resources/js/i18n/config.js)

**Changes Required:**
```javascript
// Remove duplicate keys, keeping only the last definition
// Example: if 'login' appears multiple times, keep only the last one
```

**Acceptance Criteria:**
- [ ] No duplicate keys in translation files
- [ ] All translations still work
- [ ] No missing translations

**Dependencies:** P1-003

---

## 📊 Task Summary by Priority

### P0 Critical (4 tasks) - **MUST COMPLETE FIRST**
| Task ID | Title | Time | Status |
|---------|-------|------|--------|
| P0-001 | Fix RTL Direction Attribute | 1h | ⬜ Not Started |
| P0-002 | Implement Locale Persistence | 4-6h | ⬜ Not Started |
| P0-003 | Fix Twilio OTP Authentication | 2-4h | ⬜ Not Started |
| P0-004 | Patch Security Vulnerabilities | 2-3h | ⬜ Not Started |
| **Total** | | **9-14h** | |

### P1 High (5 tasks) - **Complete After P0**
| Task ID | Title | Time | Status |
|---------|-------|------|--------|
| P1-001 | Add RTL CSS Support | 4-8h | ⬜ Not Started |
| P1-002 | Configure Filament for RTL | 4-6h | ⬜ Not Started |
| P1-003 | Complete Arabic Translations | 6-8h | ⬜ Not Started |
| P1-004 | Create Laravel Translation Files | 2-3h | ⬜ Not Started |
| P1-005 | Fix Settings Routes | 2-3h | ⬜ Not Started |
| **Total** | | **18-28h** | |

### P2 Medium (6 tasks) - **Complete After P1**
| Task ID | Title | Time | Status |
|---------|-------|------|--------|
| P2-001 | Create Locale Middleware | 1-2h | ⬜ Not Started |
| P2-002 | Localize Form Validation | 2-3h | ⬜ Not Started |
| P2-003 | Verify Database Charset | 1-2h | ⬜ Not Started |
| P2-004 | Add Hreflang Tags | 1-2h | ⬜ Not Started |
| P2-005 | Add Rate Limiting | 1-2h | ⬜ Not Started |
| P2-006 | Secure File Uploads | 2-3h | ⬜ Not Started |
| **Total** | | **8-14h** | |

### P3 Low (3 tasks) - **Complete Last**
| Task ID | Title | Time | Status |
|---------|-------|------|--------|
| P3-001 | Remove Duplicate Routes | 30m | ⬜ Not Started |
| P3-002 | Clean Up Commented Auth Routes | 30m | ⬜ Not Started |
| P3-003 | Deduplicate Translation Keys | 1-2h | ⬜ Not Started |
| **Total** | | **2-3h** | |

---

## 🎯 Recommended Execution Order

### Week 1: Unblock Release (P0 Tasks)
1. **P0-001** - Fix RTL Direction Attribute (1h)
2. **P0-002** - Implement Locale Persistence (4-6h)
3. **P0-003** - Fix Twilio OTP Authentication (2-4h)
4. **P0-004** - Patch Security Vulnerabilities (2-3h)

**Result:** Application can be conditionally released

### Week 2: Complete Bilingual Features (P1 Tasks)
1. **P1-004** - Create Laravel Translation Files (2-3h)
2. **P1-005** - Fix Settings Routes (2-3h)
3. **P1-001** - Add RTL CSS Support (4-8h)
4. **P1-002** - Configure Filament for RTL (4-6h)
5. **P1-003** - Complete Arabic Translations (6-8h)

**Result:** Full bilingual support implemented

### Week 3: Security & Quality (P2 Tasks)
1. **P2-005** - Add Rate Limiting (1-2h)
2. **P2-006** - Secure File Uploads (2-3h)
3. **P2-003** - Verify Database Charset (1-2h)
4. **P2-002** - Localize Form Validation (2-3h)
5. **P2-001** - Create Locale Middleware (1-2h)
6. **P2-004** - Add Hreflang Tags (1-2h)

**Result:** Security hardened, quality improved

### Week 4: Cleanup (P3 Tasks)
1. **P3-001** - Remove Duplicate Routes (30m)
2. **P3-002** - Clean Up Commented Auth Routes (30m)
3. **P3-003** - Deduplicate Translation Keys (1-2h)

**Result:** Codebase cleaned up

---

## 📝 Notes for Coding Agent

### Important Guidelines:

1. **Always Test Your Changes**
   - Run `php artisan test` after backend changes
   - Run `npm run build` after frontend changes
   - Test in both Arabic and English locales

2. **Follow Laravel Best Practices**
   - Use Laravel's built-in localization features
   - Use `trans()` helper for translations
   - Use `__()` helper as shortcut for `trans()`

3. **Follow React Best Practices**
   - Use i18next hooks properly
   - Don't hardcode text in components
   - Always use translation keys

4. **Security First**
   - Never commit `.env` files
   - Use prepared statements for database queries
   - Validate all user input
   - Sanitize all output

5. **Performance Considerations**
   - Minimize database queries
   - Use eager loading for relationships
   - Cache where appropriate
   - Optimize images

6. **RTL Specific Notes**
   - Use logical properties (`start`, `end`) instead of physical (`left`, `right`)
   - Test all components in RTL mode
   - Directional icons should flip in RTL
   - Numbers and LTR text (emails, URLs) should remain LTR in RTL context

7. **File Structure**
   - Keep translations organized
   - Group related translations together
   - Use consistent naming conventions

---

## 🎯 Success Criteria

### Minimum Viable (Conditional Release)
- [ ] All P0 tasks completed
- [ ] Application can switch between Arabic and English
- [ ] RTL layout works (at least basic)
- [ ] Authentication works
- [ ] No critical security vulnerabilities

### Full Release
- [ ] All P0 and P1 tasks completed
- [ ] All tests passing
- [ ] Full bilingual support
- [ ] RTL layout fully functional
- [ ] All security vulnerabilities patched

### Production Ready
- [ ] All tasks completed (P0-P3)
- [ ] Full test coverage
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Documentation complete

---

## 📞 Need Help?

If you encounter any issues:
1. Check the original QA report for more details
2. Refer to Laravel documentation: https://laravel.com/docs/12.x
3. Refer to Filament documentation: https://filamentphp.com/docs
4. Refer to i18next documentation: https://www.i18next.com/
5. Ask for clarification on specific tasks

---

**Document Version:** 1.0  
**Last Updated:** October 21, 2026  
**Next Review:** After P0 tasks completed
