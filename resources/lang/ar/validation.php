<?php

return [
    /*
    |--------------------------------------------------------------------------
    | سطور لغة التحقق
    |--------------------------------------------------------------------------
    |
    | تحتوي الأسطر اللغوية التالية على رسائل الخطأ الافتراضية المستخدمة من قبل
    | فئة المحقق. بعض هذه القواعد لديها نسخ متعددة مثل قواعد الحجم.
    |
    */

    'accepted' => 'يجب قبول :attribute.',
    'accepted_if' => 'يجب قبول :attribute عندما يكون :other هو :value.',
    'active_url' => ':attribute ليس عنوان URL صالح.',
    'after' => 'يجب أن يكون :attribute تاريخاً بعد :date.',
    'after_or_equal' => 'يجب أن يكون :attribute تاريخاً مساوياً أو بعد :date.',
    'alpha' => 'يجب أن يحتوي :attribute على أحرف فقط.',
    'alpha_dash' => 'يجب أن يحتوي :attribute على أحرف وأرقام وشرطات وشرطات سفلية فقط.',
    'alpha_num' => 'يجب أن يحتوي :attribute على أحرف وأرقام فقط.',
    'array' => 'يجب أن يكون :attribute مصفوفة.',
    'ascii' => 'يجب أن يحتوي :attribute على أحرف ورموز أبجدية رقمية أحادية البايت فقط.',
    'before' => 'يجب أن يكون :attribute تاريخاً قبل :date.',
    'before_or_equal' => 'يجب أن يكون :attribute تاريخاً مساوياً أو قبل :date.',
    'between' => [
        'array' => 'يجب أن يحتوي :attribute على عدد من العناصر بين :min و :max.',
        'file' => 'يجب أن يكون حجم :attribute بين :min و :max كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة :attribute بين :min و :max.',
        'string' => 'يجب أن يكون عدد أحرف :attribute بين :min و :max.',
    ],
    'boolean' => 'يجب أن يكون حقل :attribute صحيحاً أو خاطئاً.',
    'can' => 'يحتوي حقل :attribute على قيمة غير مصرح بها.',
    'confirmed' => 'تأكيد :attribute غير متطابق.',
    'current_password' => 'كلمة المرور غير صحيحة.',
    'date' => ':attribute ليس تاريخاً صالحاً.',
    'date_equals' => 'يجب أن يكون :attribute تاريخاً مساوياً لـ :date.',
    'date_format' => ':attribute لا يتطابق مع التنسيق :format.',
    'decimal' => 'يجب أن يحتوي :attribute على :decimal منزلة عشرية.',
    'declined' => 'يجب رفض :attribute.',
    'declined_if' => 'يجب رفض :attribute عندما يكون :other هو :value.',
    'different' => 'يجب أن يكون :attribute و :other مختلفين.',
    'digits' => 'يجب أن يحتوي :attribute على :digits أرقام.',
    'digits_between' => 'يجب أن يحتوي :attribute على أرقام بين :min و :max.',
    'dimensions' => ':attribute يحتوي على أبعاد صورة غير صالحة.',
    'distinct' => 'حقل :attribute يحتوي على قيمة مكررة.',
    'doesnt_end_with' => 'يجب ألا ينتهي :attribute بأحد القيم التالية: :values.',
    'doesnt_start_with' => 'يجب ألا يبدأ :attribute بأحد القيم التالية: :values.',
    'email' => 'يجب أن يكون :attribute عنوان بريد إلكتروني صالح.',
    'ends_with' => 'يجب أن ينتهي :attribute بأحد القيم التالية: :values.',
    'enum' => 'الـ :attribute المختار غير صالح.',
    'exists' => 'الـ :attribute المختار غير صالح.',
    'file' => 'يجب أن يكون :attribute ملف.',
    'filled' => 'حقل :attribute يجب أن يحتوي على قيمة.',
    'gt' => [
        'array' => 'يجب أن يحتوي :attribute على أكثر من :value عنصر.',
        'file' => 'يجب أن يكون حجم :attribute أكبر من :value كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة :attribute أكبر من :value.',
        'string' => 'يجب أن يكون عدد أحرف :attribute أكبر من :value.',
    ],
    'gte' => [
        'array' => 'يجب أن يحتوي :attribute على :value عنصر أو أكثر.',
        'file' => 'يجب أن يكون حجم :attribute مساوياً أو أكبر من :value كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة :attribute مساوية أو أكبر من :value.',
        'string' => 'يجب أن يكون عدد أحرف :attribute مساوياً أو أكبر من :value.',
    ],
    'image' => 'يجب أن يكون :attribute صورة.',
    'in' => 'الـ :attribute المختار غير صالح.',
    'in_array' => 'حقل :attribute غير موجود في :other.',
    'integer' => 'يجب أن يكون :attribute عدداً صحيحاً.',
    'ip' => 'يجب أن يكون :attribute عنوان IP صالح.',
    'ipv4' => 'يجب أن يكون :attribute عنوان IPv4 صالح.',
    'ipv6' => 'يجب أن يكون :attribute عنوان IPv6 صالح.',
    'json' => 'يجب أن يكون :attribute نص JSON صالح.',
    'lowercase' => 'يجب أن يكون :attribute بأحرف صغيرة.',
    'lt' => [
        'array' => 'يجب أن يحتوي :attribute على أقل من :value عنصر.',
        'file' => 'يجب أن يكون حجم :attribute أقل من :value كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة :attribute أقل من :value.',
        'string' => 'يجب أن يكون عدد أحرف :attribute أقل من :value.',
    ],
    'lte' => [
        'array' => 'يجب ألا يحتوي :attribute على أكثر من :value عنصر.',
        'file' => 'يجب أن يكون حجم :attribute مساوياً أو أقل من :value كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة :attribute مساوية أو أقل من :value.',
        'string' => 'يجب أن يكون عدد أحرف :attribute مساوياً أو أقل من :value.',
    ],
    'mac_address' => 'يجب أن يكون :attribute عنوان MAC صالح.',
    'max' => [
        'array' => 'يجب ألا يحتوي :attribute على أكثر من :max عنصر.',
        'file' => 'يجب ألا يكون حجم :attribute أكبر من :max كيلوبايت.',
        'numeric' => 'يجب ألا تكون قيمة :attribute أكبر من :max.',
        'string' => 'يجب ألا يكون عدد أحرف :attribute أكبر من :max.',
    ],
    'max_digits' => 'يجب ألا يحتوي :attribute على أكثر من :max أرقام.',
    'mimes' => 'يجب أن يكون :attribute ملف من نوع: :values.',
    'mimetypes' => 'يجب أن يكون :attribute ملف من نوع: :values.',
    'min' => [
        'array' => 'يجب أن يحتوي :attribute على الأقل على :min عنصر.',
        'file' => 'يجب أن يكون حجم :attribute على الأقل :min كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة :attribute على الأقل :min.',
        'string' => 'يجب أن يحتوي :attribute على الأقل على :min أحرف.',
    ],
    'min_digits' => 'يجب أن يحتوي :attribute على الأقل على :min أرقام.',
    'missing' => 'حقل :attribute يجب أن يكون مفقوداً.',
    'missing_if' => 'حقل :attribute يجب أن يكون مفقوداً عندما يكون :other هو :value.',
    'missing_unless' => 'حقل :attribute يجب أن يكون مفقوداً ما لم يكن :other في :values.',
    'missing_with' => 'حقل :attribute يجب أن يكون مفقوداً عندما تكون :values موجودة.',
    'missing_with_all' => 'حقل :attribute يجب أن يكون مفقوداً عندما تكون :values موجودة.',
    'multiple_of' => 'يجب أن يكون :attribute مضاعفاً لـ :value.',
    'not_in' => 'الـ :attribute المختار غير صالح.',
    'not_regex' => 'تنسيق :attribute غير صالح.',
    'numeric' => 'يجب أن يكون :attribute رقماً.',
    'password' => [
        'letters' => 'يجب أن يحتوي :attribute على حرف واحد على الأقل.',
        'mixed' => 'يجب أن يحتوي :attribute على حرف كبير وحرف صغير على الأقل.',
        'numbers' => 'يجب أن يحتوي :attribute على رقم واحد على الأقل.',
        'symbols' => 'يجب أن يحتوي :attribute على رمز واحد على الأقل.',
        'uncompromised' => 'ظهر الـ :attribute المعطى في تسريب بيانات. يرجى اختيار :attribute مختلف.',
    ],
    'present' => 'حقل :attribute يجب أن يكون موجوداً.',
    'prohibited' => 'حقل :attribute محظور.',
    'prohibited_if' => 'حقل :attribute محظور عندما يكون :other هو :value.',
    'prohibited_unless' => 'حقل :attribute محظور ما لم يكن :other في :values.',
    'prohibits' => 'حقل :attribute يمنع :other من أن يكون موجوداً.',
    'regex' => 'تنسيق :attribute غير صالح.',
    'required' => 'حقل :attribute مطلوب.',
    'required_array_keys' => 'حقل :attribute يجب أن يحتوي على مدخلات لـ: :values.',
    'required_if' => 'حقل :attribute مطلوب عندما يكون :other هو :value.',
    'required_if_accepted' => 'حقل :attribute مطلوب عندما يتم قبول :other.',
    'required_unless' => 'حقل :attribute مطلوب ما لم يكن :other في :values.',
    'required_with' => 'حقل :attribute مطلوب عندما تكون :values موجودة.',
    'required_with_all' => 'حقل :attribute مطلوب عندما تكون :values موجودة.',
    'required_without' => 'حقل :attribute مطلوب عندما لا تكون :values موجودة.',
    'required_without_all' => 'حقل :attribute مطلوب عندما لا تكون أي من :values موجودة.',
    'same' => ':attribute و :other يجب أن يتطابقا.',
    'size' => [
        'array' => 'يجب أن يحتوي :attribute على :size عنصر.',
        'file' => 'يجب أن يكون حجم :attribute :size كيلوبايت.',
        'numeric' => 'يجب أن تكون قيمة :attribute :size.',
        'string' => 'يجب أن يحتوي :attribute على :size أحرف.',
    ],
    'starts_with' => 'يجب أن يبدأ :attribute بأحد القيم التالية: :values.',
    'string' => 'يجب أن يكون :attribute نص.',
    'timezone' => 'يجب أن يكون :attribute منطقة زمنية صالحة.',
    'unique' => 'تم استخدام :attribute مسبقاً.',
    'uploaded' => 'فشل رفع :attribute.',
    'uppercase' => 'يجب أن يكون :attribute بأحرف كبيرة.',
    'url' => 'يجب أن يكون :attribute عنوان URL صالح.',
    'ulid' => 'يجب أن يكون :attribute ULID صالح.',
    'uuid' => 'يجب أن يكون :attribute UUID صالح.',

    /*
    |--------------------------------------------------------------------------
    | سطور لغة التحقق المخصصة
    |--------------------------------------------------------------------------
    |
    | هنا يمكنك تحديد رسائل تحقق مخصصة للسمات باستخدام الاصطلاح
    | "attribute.rule" لتسمية السطور. هذا يجعل من السريع تحديد
    | سطر لغة مخصص محدد لقاعدة سمة معينة.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | سمات التحقق المخصصة
    |--------------------------------------------------------------------------
    |
    | تُستخدم الأسطر اللغوية التالية لاستبدال عنصر نائب السمة الخاص بنا
    | بشيء أكثر سهولة في القراءة مثل "عنوان البريد الإلكتروني" بدلاً
    | من "email". هذا يساعدنا ببساطة على جعل رسالتنا أكثر تعبيراً.
    |
    */

    'attributes' => [
        'name' => 'الاسم',
        'username' => 'اسم المستخدم',
        'email' => 'البريد الإلكتروني',
        'password' => 'كلمة المرور',
        'password_confirmation' => 'تأكيد كلمة المرور',
        'phone' => 'رقم الهاتف',
        'mobile' => 'رقم الجوال',
        'address' => 'العنوان',
        'city' => 'المدينة',
        'country' => 'الدولة',
        'postal_code' => 'الرمز البريدي',
        'first_name' => 'الاسم الأول',
        'last_name' => 'اسم العائلة',
    ],
];
