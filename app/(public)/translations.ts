export type Language = "en" | "tr" | "de";

export type TranslationKeys = {
    nav: {
        features: string;
        howItWorks: string;
        panel: string;
        security: string;
        login: string;
        getStarted: string;
    };
    hero: {
        title: string;
        subtitle: string;
        primaryCta: string;
        secondaryCta: string;
    };
    whySos: {
        title: string;
        description1: string;
        description2: string;
    };
    howItWorks: {
        title: string;
        step1Title: string;
        step1Desc: string;
        step2Title: string;
        step2Desc: string;
        step3Title: string;
        step3Desc: string;
    };
    features: {
        title: string;
        subtitle: string;
        batteryFree: { title: string; desc: string };
        hybridTech: { title: string; desc: string };
        waterResistant: { title: string; desc: string };
        comfortable: { title: string; desc: string };
    };
    panel: {
        title: string;
        subtitle: string;
        roleBased: { title: string; desc: string };
        easyData: { title: string; desc: string };
        multiTenant: { title: string; desc: string };
    };
    security: {
        title: string;
        minimalInfo: { title: string; desc: string };
        secureInfra: { title: string; desc: string };
        authAccess: { title: string; desc: string };
    };
    footer: {
        ctaTitle: string;
        ctaButton1: string;
        ctaButton2: string;
        copyright: string;
        privacy: string;
        terms: string;
        kvkk: string;
    };
};

export const translations: Record<Language, TranslationKeys> = {
    en: {
        nav: {
            features: "Features",
            howItWorks: "How it Works",
            panel: "Panel",
            security: "Security",
            login: "Login",
            getStarted: "Get Started",
        },
        hero: {
            title: "Emergency Information, Always One Wristband Away",
            subtitle:
                "Signal Of Safety is a battery-free emergency wristband and school management system that makes students’ health and contact information instantly accessible in critical moments.",
            primaryCta: "Get Information for Your School",
            secondaryCta: "View Digital Demo",
        },
        whySos: {
            title: "When Seconds Matter, Clarity Saves Time",
            description1:
                "On school trips, in the park, or just after the school day ends, a student may suddenly need help. In those moments, people nearby often don’t know who to call, whether the child has allergies, or if there are critical health notes they should be aware of.",
            description2:
                "Signal Of Safety acts as a silent guardian on the student’s wrist. Even if their phone is off, essential information can still be reached through the wristband.",
        },
        howItWorks: {
            title: "Three Simple Steps to Safer Response",
            step1Title: "Define",
            step1Desc: "School staff securely enter the student’s health and emergency contact details into the management panel.",
            step2Title: "Wear",
            step2Desc: "Each student receives a durable, comfortable wristband linked to their profile and wears it throughout their school day and activities.",
            step3Title: "Access",
            step3Desc: "In an emergency, a helper scans the QR code or uses NFC on the wristband. Only the key information needed in that moment appears instantly on screen.",
        },
        features: {
            title: "Continuous Protection, No Charging Required",
            subtitle: "Smart safety without the hassle of batteries.",
            batteryFree: {
                title: "Battery-Free & Always Ready",
                desc: "No charging, no battery to run out. As long as the wristband is on the student’s wrist, the system can be used.",
            },
            hybridTech: {
                title: "Hybrid Technology: QR + NFC",
                desc: "Works with both QR codes and NFC. A standard smartphone camera or NFC-enabled device is enough to access the information.",
            },
            waterResistant: {
                title: "Water & Shock Resistant",
                desc: "Designed for the reality of school life, playgrounds, and sports. The wristband can handle an active child’s day.",
            },
            comfortable: {
                title: "Comfortable to Wear",
                desc: "Lightweight, flexible, and skin-friendly materials so students can wear it all day without discomfort.",
            },
        },
        panel: {
            title: "Powerful Yet Simple for Schools",
            subtitle:
                "The Signal Of Safety management panel makes it easier, not harder, to keep student information organized and accessible. Multiple authorized staff can manage and update records when needed.",
            roleBased: {
                title: "Role-Based Access",
                desc: "Different roles — Owner, Admin, Teacher — have clearly defined permissions, so each user only sees what they need to.",
            },
            easyData: {
                title: "Easy Data Management",
                desc: "Class lists, health notes, and emergency contacts can be added in bulk and updated quickly when something changes.",
            },
            multiTenant: {
                title: "Multi-Tenant Architecture",
                desc: "Each school’s data is fully isolated from others, providing both security and scalability as more schools join the platform.",
            },
        },
        security: {
            title: "Your Data is Protected, Your Privacy Respected",
            minimalInfo: {
                title: "Minimal Information Principle",
                desc: "The emergency view only shows essential details such as name, blood type, key health notes, and emergency contact.",
            },
            secureInfra: {
                title: "Secure Infrastructure",
                desc: "Detailed records and history are stored in secure, access-controlled databases behind the school’s management panel.",
            },
            authAccess: {
                title: "Authorized Access Only",
                desc: "Student data is only accessible to school staff who have been granted permission. Parents can work with the school to adjust and update data whenever needed.",
            },
        },
        footer: {
            ctaTitle: "Ready to Make Safety More Accessible at Your School?",
            ctaButton1: "Request Information",
            ctaButton2: "Schedule a Demo",
            copyright: "© 2024 Signal Of Safety. All rights reserved.",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            kvkk: "KVKK Clarification Text",
        },
    },
    tr: {
        nav: {
            features: "Özellikler",
            howItWorks: "Nasıl Çalışır?",
            panel: "Panel",
            security: "Güvenlik",
            login: "Giriş Yap",
            getStarted: "Başlayın",
        },
        hero: {
            title: "Acil Durum Bilgileri, Bir Bileklik Kadar Yakın",
            subtitle:
                "Signal Of Safety, öğrencilerin sağlık ve iletişim bilgilerini kritik anlarda anında erişilebilir kılan, pilsiz bir acil durum bilekliği ve okul yönetim sistemidir.",
            primaryCta: "Okulunuz İçin Bilgi Alın",
            secondaryCta: "Dijital Demoyu İncele",
        },
        whySos: {
            title: "Saniyelerin Önemli Olduğu Anlarda Netlik Zaman Kazandırır",
            description1:
                "Okul gezilerinde, parkta veya okul çıkışında bir öğrenci aniden yardıma ihtiyaç duyabilir. O anlarda çevredeki insanlar kimi arayacaklarını, çocuğun alerjisi olup olmadığını veya bilinmesi gereken kritik sağlık notlarını bilemeyebilir.",
            description2:
                "Signal Of Safety, öğrencinin bileğinde sessiz bir koruyucu görevi görür. Telefonu kapalı olsa bile, gerekli bilgilere bileklik üzerinden ulaşılabilir.",
        },
        howItWorks: {
            title: "Daha Güvenli Müdahale İçin Üç Basit Adım",
            step1Title: "Tanımla",
            step1Desc: "Okul personeli, öğrencinin sağlık ve acil durum iletişim bilgilerini yönetim paneline güvenli bir şekilde girer.",
            step2Title: "Tak",
            step2Desc: "Her öğrenci, profiline bağlı dayanıklı ve rahat bir bileklik alır ve okul günü boyunca takar.",
            step3Title: "Eriş",
            step3Desc: "Acil bir durumda, yardımcı kişi bileklikteki QR kodunu tarar veya NFC'yi kullanır. Sadece o an ihtiyaç duyulan temel bilgiler ekranda belirir.",
        },
        features: {
            title: "Kesintisiz Koruma, Şarj Gerektirmez",
            subtitle: "Pil derdi olmadan akıllı güvenlik.",
            batteryFree: {
                title: "Pilsiz & Her Zaman Hazır",
                desc: "Şarj yok, bitecek pil yok. Bileklik öğrencinin kolunda olduğu sürece sistem kullanılabilir.",
            },
            hybridTech: {
                title: "Hibrit Teknoloji: QR + NFC",
                desc: "Hem QR kod hem de NFC ile çalışır. Standart bir akıllı telefon kamerası veya NFC özellikli cihaz bilgilere erişmek için yeterlidir.",
            },
            waterResistant: {
                title: "Suya & Darbeye Dayanıklı",
                desc: "Okul hayatının, oyun alanlarının ve sporun gerçeklerine göre tasarlandı. Bileklik aktif bir çocuğun gününe dayanabilir.",
            },
            comfortable: {
                title: "Rahat Kullanım",
                desc: "Hafif, esnek ve cilt dostu malzemeler sayesinde öğrenciler tüm gün rahatsızlık duymadan takabilir.",
            },
        },
        panel: {
            title: "Okullar İçin Güçlü Ama Basit",
            subtitle:
                "Signal Of Safety yönetim paneli, öğrenci bilgilerini düzenli ve erişilebilir tutmayı zorlaştırmaz, kolaylaştırır. Birden fazla yetkili personel gerektiğinde kayıtları yönetebilir ve güncelleyebilir.",
            roleBased: {
                title: "Rol Tabanlı Erişim",
                desc: "Sahip, Yönetici, Öğretmen gibi farklı rollerin net tanımlanmış izinleri vardır, böylece her kullanıcı sadece ihtiyacı olanı görür.",
            },
            easyData: {
                title: "Kolay Veri Yönetimi",
                desc: "Sınıf listeleri, sağlık notları ve acil durum kişileri toplu olarak eklenebilir ve bir değişiklik olduğunda hızla güncellenebilir.",
            },
            multiTenant: {
                title: "Çok Kiracılı Mimari",
                desc: "Her okulun verisi diğerlerinden tamamen izole edilmiştir, bu da platforma daha fazla okul katıldıkça hem güvenlik hem de ölçeklenebilirlik sağlar.",
            },
        },
        security: {
            title: "Verileriniz Koruma Altında, Gizliliğinize Saygılı",
            minimalInfo: {
                title: "Minimum Bilgi İlkesi",
                desc: "Acil durum görünümü sadece isim, kan grubu, önemli sağlık notları ve acil durum kişisi gibi temel detayları gösterir.",
            },
            secureInfra: {
                title: "Güvenli Altyapı",
                desc: "Detaylı kayıtlar ve geçmiş, okulun yönetim panelinin arkasında, güvenli ve erişim kontrollü veritabanlarında saklanır.",
            },
            authAccess: {
                title: "Sadece Yetkili Erişim",
                desc: "Öğrenci verilerine sadece izin verilmiş okul personeli erişebilir. Veliler gerektiğinde verileri düzenlemek ve güncellemek için okulla işbirliği yapabilir.",
            },
        },
        footer: {
            ctaTitle: "Okulunuzda Güvenliği Daha Erişilebilir Yapmaya Hazır Mısınız?",
            ctaButton1: "Bilgi Talep Et",
            ctaButton2: "Demo Planla",
            copyright: "© 2024 Signal Of Safety. Tüm hakları saklıdır.",
            privacy: "Gizlilik Politikası",
            terms: "Kullanım Şartları",
            kvkk: "KVKK Aydınlatma Metni",
        },
    },
    de: {
        nav: {
            features: "Funktionen",
            howItWorks: "Wie es funktioniert",
            panel: "Panel",
            security: "Sicherheit",
            login: "Anmelden",
            getStarted: "Anfangen",
        },
        hero: {
            title: "Notfallinformationen, immer ein Armband entfernt",
            subtitle:
                "Signal Of Safety ist ein batteriefreies Notfallarmband und Schulverwaltungssystem, das Gesundheits- und Kontaktinformationen von Schülern in kritischen Momenten sofort zugänglich macht.",
            primaryCta: "Infos für Ihre Schule",
            secondaryCta: "Digitales Demo ansehen",
        },
        whySos: {
            title: "Wenn Sekunden zählen, spart Klarheit Zeit",
            description1:
                "Bei Schulausflügen, im Park oder direkt nach Schulschluss kann ein Schüler plötzlich Hilfe benötigen. In solchen Momenten wissen Umstehende oft nicht, wen sie anrufen sollen, ob das Kind Allergien hat oder ob es kritische Gesundheitsnotizen gibt.",
            description2:
                "Signal Of Safety fungiert als stiller Wächter am Handgelenk des Schülers. Selbst wenn das Telefon ausgeschaltet ist, sind wichtige Informationen über das Armband abrufbar.",
        },
        howItWorks: {
            title: "Drei einfache Schritte für sicherere Hilfe",
            step1Title: "Definieren",
            step1Desc: "Schulpersonal gibt die Gesundheits- und Notfallkontaktdaten des Schülers sicher in das Verwaltungspanel ein.",
            step2Title: "Tragen",
            step2Desc: "Jeder Schüler erhält ein langlebiges, bequemes Armband, das mit seinem Profil verknüpft ist, und trägt es während des Schultags und bei Aktivitäten.",
            step3Title: "Zugreifen",
            step3Desc: "In einem Notfall scannt ein Helfer den QR-Code oder nutzt NFC am Armband. Nur die in diesem Moment benötigten Schlüsselinformationen erscheinen sofort auf dem Bildschirm.",
        },
        features: {
            title: "Kontinuierlicher Schutz, kein Aufladen erforderlich",
            subtitle: "Smarte Sicherheit ohne Sorge um Batterien.",
            batteryFree: {
                title: "Batteriefrei & immer bereit",
                desc: "Kein Aufladen, keine leere Batterie. Solange das Armband am Handgelenk ist, kann das System genutzt werden.",
            },
            hybridTech: {
                title: "Hybrid-Technologie: QR + NFC",
                desc: "Funktioniert sowohl mit QR-Codes als auch mit NFC. Eine normale Smartphone-Kamera oder ein NFC-fähiges Gerät reicht aus.",
            },
            waterResistant: {
                title: "Wasser- & Stoßfest",
                desc: "Entworfen für die Realität des Schullebens, Spielplätze und Sport. Das Armband hält dem Tag eines aktiven Kindes stand.",
            },
            comfortable: {
                title: "Bequem zu tragen",
                desc: "Leichte, flexible und hautfreundliche Materialien, damit Schüler es den ganzen Tag ohne Beschwerden tragen können.",
            },
        },
        panel: {
            title: "Mächtig und doch einfach für Schulen",
            subtitle:
                "Das Signal Of Safety Verwaltungspanel macht es einfacher, nicht schwerer, Schülerinformationen organisiert und zugänglich zu halten. Mehrere autorisierte Mitarbeiter können Datensätze bei Bedarf verwalten und aktualisieren.",
            roleBased: {
                title: "Rollenbasierter Zugriff",
                desc: "Unterschiedliche Rollen – Eigentümer, Administrator, Lehrer – haben klar definierte Berechtigungen, sodass jeder Benutzer nur das sieht, was er benötigt.",
            },
            easyData: {
                title: "Einfache Datenverwaltung",
                desc: "Klassenlisten, Gesundheitsnotizen und Notfallkontakte können massenhaft hinzugefügt und schnell aktualisiert werden, wenn sich etwas ändert.",
            },
            multiTenant: {
                title: "Mandantenfähige Architektur",
                desc: "Die Daten jeder Schule sind vollständig von anderen isoliert, was sowohl Sicherheit als auch Skalierbarkeit bietet, wenn mehr Schulen der Plattform beitreten.",
            },
        },
        security: {
            title: "Ihre Daten sind geschützt, Ihre Privatsphäre respektiert",
            minimalInfo: {
                title: "Prinzip der minimalen Information",
                desc: "Die Notfallansicht zeigt nur wesentliche Details wie Name, Blutgruppe, wichtige Gesundheitsnotizen und Notfallkontakt.",
            },
            secureInfra: {
                title: "Sichere Infrastruktur",
                desc: "Detaillierte Aufzeichnungen und Historien werden in sicheren, zugriffsgeschützten Datenbanken hinter dem Verwaltungspanel der Schule gespeichert.",
            },
            authAccess: {
                title: "Nur autorisierter Zugriff",
                desc: "Schülerdaten sind nur für Schulpersonal zugänglich, dem die Erlaubnis erteilt wurde. Eltern können mit der Schule zusammenarbeiten, um Daten bei Bedarf anzupassen.",
            },
        },
        footer: {
            ctaTitle: "Bereit, Sicherheit an Ihrer Schule zugänglicher zu machen?",
            ctaButton1: "Informationen anfordern",
            ctaButton2: "Demo planen",
            copyright: "© 2024 Signal Of Safety. Alle Rechte vorbehalten.",
            privacy: "Datenschutzerklärung",
            terms: "Nutzungsbedingungen",
            kvkk: "KVKK Aufklärungstext",
        },
    },
};
