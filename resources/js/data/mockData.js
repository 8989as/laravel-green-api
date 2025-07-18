// Mock Categories (Arabic names for default language)
export const mockCategories = [
    { id: 1, name: "نباتات داخلية", name_latin: "Indoor Plants", value: 1 },
    { id: 2, name: "نباتات خارجية", name_latin: "Outdoor Plants", value: 2 },
    { id: 3, name: "نباتات مزٌهرة", name_latin: "Flowering Plants", value: 3 },
    { id: 4, name: "صبارات", name_latin: "Succulents", value: 4 },
    { id: 5, name: "نباتات عطرية", name_latin: "Aromatic Plants", value: 5 },
    { id: 6, name: "نباتات زينة", name_latin: "Ornamental Plants", value: 6 }
];

// Mock Colors (Arabic labels for default language)
export const mockColors = [
    { id: 1, label: "أحمر", label_latin: "Red", value: 1, hex_code: "#FF0000" },
    { id: 2, label: "أبيض", label_latin: "White", value: 2, hex_code: "#FFFFFF" },
    { id: 3, label: "وردي", label_latin: "Pink", value: 3, hex_code: "#FFC0CB" },
    { id: 4, label: "بنفسجي", label_latin: "Purple", value: 4, hex_code: "#800080" }
];

// Mock Sizes (Arabic labels for default language)
export const mockSizes = [
    { id: 1, label: "صغير", label_latin: "Small", value: 1 },
    { id: 2, label: "متوسط", label_latin: "Medium", value: 2 },
    { id: 3, label: "كبير", label_latin: "Large", value: 3 }
];

// Mock Products (Arabic names for default language)
export const mockProducts = [
    {
        id: 1,
        name: "ورد",
        name_latin: "Rosa (Rose)",
        price: 150,
        special_price: null,
        description: "نبتة ورد جميلة بألوان زاهية",
        images: [
            {
                id: 1,
                url: "/assets/images/product_1.png",
                small_image_url: "/assets/images/product_1.png",
                medium_image_url: "/assets/images/product_1.png",
                large_image_url: "/assets/images/product_1.png"
            }
        ],
        categories: [
            { id: 1, name: "نباتات داخلية" },
            { id: 3, name: "نباتات مزٌهرة" }
        ],
        colors: [
            { id: 1, name: "أحمر", hex_code: "#FF0000" },
            { id: 3, name: "وردي", hex_code: "#FFC0CB" }
        ],
        sizes: [
            { id: 1, name: "صغير" },
            { id: 2, name: "متوسط" }
        ],
        is_saved: false
    },
    {
        id: 2,
        name: "زنبق",
        name_latin: "Lilium (Lily)",
        price: 120,
        special_price: 100,
        description: "نبتة زنبق أنيقة بأزهار بيضاء",
        images: [
            {
                id: 2,
                url: "/assets/images/product_1.png",
                small_image_url: "/assets/images/product_1.png",
                medium_image_url: "/assets/images/product_1.png",
                large_image_url: "/assets/images/product_1.png"
            }
        ],
        categories: [
            { id: 2, name: "نباتات خارجية" },
            { id: 3, name: "نباتات مزٌهرة" }
        ],
        colors: [
            { id: 2, name: "أبيض", hex_code: "#FFFFFF" }
        ],
        sizes: [
            { id: 2, name: "متوسط" },
            { id: 3, name: "كبير" }
        ],
        is_saved: false
    },
    {
        id: 3,
        name: "أوركيد",
        name_latin: "Orchidaceae (Orchid)",
        price: 200,
        special_price: null,
        description: "نبتة أوركيد غريبة بأزهار بنفسجية",
        images: [
            {
                id: 3,
                url: "/assets/images/product_1.png",
                small_image_url: "/assets/images/product_1.png",
                medium_image_url: "/assets/images/product_1.png",
                large_image_url: "/assets/images/product_1.png"
            }
        ],
        categories: [
            { id: 1, name: "نباتات داخلية" },
            { id: 3, name: "نباتات مزٌهرة" }
        ],
        colors: [
            { id: 4, name: "بنفسجي", hex_code: "#800080" }
        ],
        sizes: [
            { id: 1, name: "صغير" },
            { id: 2, name: "متوسط" },
            { id: 3, name: "كبير" }
        ],
        is_saved: false
    },
    {
        id: 4,
        name: "صبار",
        name_latin: "Cactaceae (Cactus)",
        price: 80,
        special_price: null,
        description: "نبتة صبار مقاومة للجفاف",
        images: [
            {
                id: 4,
                url: "/assets/images/product_1.png",
                small_image_url: "/assets/images/product_1.png",
                medium_image_url: "/assets/images/product_1.png",
                large_image_url: "/assets/images/product_1.png"
            }
        ],
        categories: [
            { id: 2, name: "نباتات خارجية" },
            { id: 4, name: "صبارات" }
        ],
        colors: [
            { id: 1, name: "أحمر", hex_code: "#FF0000" },
            { id: 2, name: "أبيض", hex_code: "#FFFFFF" }
        ],
        sizes: [
            { id: 1, name: "صغير" },
            { id: 2, name: "متوسط" }
        ],
        is_saved: false
    },
    {
        id: 5,
        name: "نبات عطرية",
        name_latin: "Aromatic Plant",
        price: 90,
        special_price: null,
        description: "نبتة عطرية تضيف رائحة جميلة للمنزل",
        images: [
            {
                id: 5,
                url: "/assets/images/product_1.png",
                small_image_url: "/assets/images/product_1.png",
                medium_image_url: "/assets/images/product_1.png",
                large_image_url: "/assets/images/product_1.png"
            }
        ],
        categories: [
            { id: 1, name: "نباتات داخلية" },
            { id: 5, name: "نباتات عطرية" }
        ],
        colors: [
            { id: 3, name: "وردي", hex_code: "#FFC0CB" }
        ],
        sizes: [
            { id: 2, name: "متوسط" },
            { id: 3, name: "كبير" }
        ],
        is_saved: false
    },
    {
        id: 6,
        name: "نبات زينة",
        name_latin: "Ornamental Plant",
        price: 110,
        special_price: null,
        description: "نبتة زينة تضيف لمسة جمالية للديكور",
        images: [
            {
                id: 6,
                url: "/assets/images/product_1.png",
                small_image_url: "/assets/images/product_1.png",
                medium_image_url: "/assets/images/product_1.png",
                large_image_url: "/assets/images/product_1.png"
            }
        ],
        categories: [
            { id: 1, name: "نباتات داخلية" },
            { id: 6, name: "نباتات زينة" }
        ],
        colors: [
            { id: 4, name: "بنفسجي", hex_code: "#800080" }
        ],
        sizes: [
            { id: 1, name: "صغير" },
            { id: 2, name: "متوسط" }
        ],
        is_saved: false
    }
];
