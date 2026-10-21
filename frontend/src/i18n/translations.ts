export const translations = {
  en: {
    // Header & Meta
    hospitalName: 'District Memorial & AYUSH Integrated Hospital',
    platformName: 'MediKiosk Clinical Intake System',
    platformTagline: 'AI-assisted pre-consultation medical history & document intake',
    emergencyHelpline: 'Emergency Hotline: 108 / 112',
    dateLabel: 'Today',
    selectLanguage: 'Language',
    textSizeLabel: 'Text Size',
    voiceAssist: 'Voice Guide',
    voiceAssistOn: 'Voice Guide Active',
    voiceAssistOff: 'Voice Guide Muted',

    // Emergency Notice
    emergencyBannerTitle: 'Critical Notice for Urgent Medical Needs',
    emergencyBannerText:
      'If you have severe chest pain, extreme breathlessness, sudden speech loss, acute trauma, or uncontrollable bleeding, DO NOT use this kiosk. Please report immediately to the Emergency Casualty Ward (Counter 1) or notify hospital nursing staff.',
    emergencyActionBtn: 'Find Emergency Desk',

    // Hero Section
    welcomeHeading: 'Welcome to Outpatient Clinical Intake',
    welcomeSubheading:
      'Save time before meeting your doctor. Complete your medical history, record current symptoms, and scan previous prescriptions or test reports in a few simple steps.',
    kioskModeBadge: 'Self-Service Patient Kiosk v1.0',
    complianceBadge: 'HIPAA & ABDM Architecture Ready',

    // Primary Action Cards
    patientCardTitle: 'Patient Self-Registration & Intake',
    patientCardSubtitle: 'For Patients & Attendants',
    patientCardDesc:
      'Answer easy guided questions about your illness, current medicines, and allergies. You can speak or tap on screen.',
    patientCardBtn: 'Start Patient Intake',
    patientCardDemoBtn: 'Try with Demo Patient Record',

    doctorCardTitle: 'Doctor & Clinical Staff Portal',
    doctorCardSubtitle: 'For Medical Officers & Residents',
    doctorCardDesc:
      'Review AI-structured history summaries, verify scanned prescriptions and lab reports, edit clinical notes, and assess AYUSH parameters.',
    doctorCardBtn: 'Enter Doctor Portal',
    doctorCardDemoBtn: 'View Sample Clinical Summary',

    // Workflow Steps
    workflowTitle: 'How MediKiosk Works in 5 Simple Steps',
    workflowSubtitle: 'Designed for quick, stress-free clinical history documentation before your consultation',
    step1Title: 'Language & Consent',
    step1Desc: 'Choose your comfortable language (English / Hindi) and provide informed data consent.',
    step2Title: 'Patient Details',
    step2Desc: 'Enter your basic details or scan your OPD registration card / Demo Patient ID.',
    step3Title: 'Guided Symptom History',
    step3Desc: 'Answer adaptive questions regarding your chief complaint, duration, and medical history.',
    step4Title: 'Document Scanning',
    step4Desc: 'Digitize previous paper prescriptions, lab investigations, and discharge summaries via OCR.',
    step5Title: 'Doctor Review Summary',
    step5Desc: 'A concise, structured clinical summary is prepared for your doctor to review, edit, and approve.',

    // Institutional Scope & Boundaries (Crucial healthcare ethics requirement)
    scopeTitle: 'Clinical Scope, Safety & Ethical Guidelines',
    scopeSubtitle: 'MediKiosk is an assistive tool built strictly under human physician oversight',
    point1Title: 'Physician-in-the-Loop Oversight',
    point1Desc:
      'MediKiosk does NOT provide independent diagnoses or prescribe medicines. All summaries are draft documentation requiring physician validation.',
    point2Title: 'Conservative Emergency Triage',
    point2Desc:
      'Rule-based safety checks immediately halt the questionnaire if red-flag symptoms are detected, redirecting patients to emergency staff.',
    point3Title: 'AYUSH Parameter Support',
    point3Desc:
      'Includes specialized assessment parameters such as Dashavidha Pariksha, Ahara-Vihara (dietary & lifestyle habits), and Prakriti assessment.',
    point4Title: 'Local Data Privacy & ABDM Integration',
    point4Desc:
      'Health records remain strictly confidential in localized hospital storage with full audit logs and FHIR/ABDM interoperability boundaries.',

    // Status / System Readiness
    systemStatusTitle: 'System Readiness & Operational Health',
    statusKiosk: 'Kiosk Terminal: Online & Secure',
    statusOcr: 'OCR Document Engine: Standby (Local Mode)',
    statusSpeech: 'Speech Recognition: Web Speech API (Replaceable Adapter)',
    statusDatabase: 'Storage: Local Synthetic Sandbox (Phase 1 Ready)',

    // Modals & Interactive States
    patientModalTitle: 'Patient Clinical Intake — Registration Demo',
    patientModalDesc:
      'Phase 1 provides the hospital entry portal. In Phase 2, the complete guided voice & touch questionnaire will be activated.',
    patientModalDemoId: 'Demo Patient ID: PAT-2026-0842 (Ramesh Sharma, 54y, OPD Gen Medicine)',
    patientModalAction: 'Proceed to Questionnaire (Preview)',
    closeBtn: 'Close',

    doctorModalTitle: 'Clinical Review & Documentation Dashboard',
    doctorModalDesc:
      'In Phase 6, physicians will review real-time structured summaries with OCR verification and AYUSH assessment tabs.',
    doctorSampleDoctor: 'Dr. Sunita Rao, MD (Internal Medicine), OPD Room #14',
    doctorSampleSummaryTitle: 'Structured History Draft Preview',
    doctorSampleSummaryContent:
      'Chief Complaint: Epigastric discomfort and intermittent nausea for 3 weeks. Past History: Type 2 Diabetes (5 yrs on Metformin 500mg BD). Known Allergy: Penicillin. Red Flags: None detected. AYUSH Note: Agnimandya (impaired digestive fire) reported.',

    // Accessibility
    highContrast: 'High Contrast',
    accessibilityHelp: 'Touch large buttons or use voice assistance. Help desks are located in the main hall.',
    emergencyHelpDesk: 'Helpdesk Phone: +91 11-23456789 | OPD Timings: 8:00 AM – 2:00 PM',

    // Footer
    footerDisclaimer:
      'MediKiosk is an academic medical informatics research & deployment prototype. Complies with institutional safety guidelines. Not a substitute for professional clinical judgment.',
    footerCopyright: '© 2026 MediKiosk Platform. All rights reserved. Hospital Information System Interface.',
  },
  hi: {
    // Header & Meta
    hospitalName: 'जिला मेमोरियल एवं आयुष एकीकृत अस्पताल',
    platformName: 'मेडीकियोस्क - क्लिनिकल इतिहास प्रणाली',
    platformTagline: 'डॉक्टर से परामर्श से पूर्व एआई-सहायता प्राप्त मरीज इतिहास एवं पर्चा डिजिटलीकरण',
    emergencyHelpline: 'आपातकालीन हेल्पलाइन: 108 / 112',
    dateLabel: 'आज की तिथि',
    selectLanguage: 'भाषा चुनें',
    textSizeLabel: 'अक्षर आकार',
    voiceAssist: 'ध्वनि सहायता',
    voiceAssistOn: 'ध्वनि सहायता सक्रिय',
    voiceAssistOff: 'ध्वनि सहायता बंद',

    // Emergency Notice
    emergencyBannerTitle: 'गंभीर अथवा आपातकालीन चिकित्सा हेतु आवश्यक सूचना',
    emergencyBannerText:
      'यदि आपको सीने में अत्यधिक दर्द, सांस लेने में गंभीर तकलीफ, अचानक बोलने में असमर्थता, गहरा घाव या भारी रक्तस्राव हो रहा है, तो इस कियोस्क का उपयोग न करें। कृपया तुरंत आपातकालीन आकस्मिक विभाग (काउंटर नं. 1) पर संपर्क करें या अस्पताल के नर्सिंग स्टाफ को सूचित करें।',
    emergencyActionBtn: 'आपातकालीन डेस्क देखें',

    // Hero Section
    welcomeHeading: 'ओपीडी मरीज स्व-पंजीकरण एवं इतिहास प्रणाली',
    welcomeSubheading:
      'डॉक्टर से मिलने से पहले समय की बचत करें। कुछ आसान चरणों में अपनी बीमारी का विवरण दें, पूर्व दवाइयों की जानकारी दर्ज करें और पुरानी पर्चियों को स्कैन करें।',
    kioskModeBadge: 'मरीज स्व-सेवा कियोस्क v1.0',
    complianceBadge: 'आयुष्मान भारत डिजिटल मिशन (ABDM) तैयार संरचना',

    // Primary Action Cards
    patientCardTitle: 'मरीज स्व-पंजीकरण एवं लक्षण विवरण',
    patientCardSubtitle: 'मरीजों एवं परिजनों के लिए',
    patientCardDesc:
      'अपनी वर्तमान परेशानी, पुरानी बीमारियों और चल रही दवाओं के बारे में आसान सवालों के जवाब बोलकर या स्क्रीन पर छूकर दें।',
    patientCardBtn: 'मरीज पंजीकरण शुरू करें',
    patientCardDemoBtn: 'डेमो मरीज रिकॉर्ड से देखें',

    doctorCardTitle: 'चिकित्सक एवं स्टाफ पोर्टल',
    doctorCardSubtitle: 'चिकित्सा अधिकारियों एवं डॉक्टरों के लिए',
    doctorCardDesc:
      'मरीज द्वारा दिए गए ब्योरे का संरचित सारांश देखें, स्कैन की गई पर्चियों का सत्यापन करें, क्लिनिकल नोट्स संपादित करें और आयुष मानकों की समीक्षा करें।',
    doctorCardBtn: 'डॉक्टर पोर्टल में प्रवेश करें',
    doctorCardDemoBtn: 'नमूना सारांश देखें',

    // Workflow Steps
    workflowTitle: 'मेडीकियोस्क कैसे कार्य करता है (5 आसान चरण)',
    workflowSubtitle: 'परामर्श से पहले आपके स्वास्थ्य इतिहास के त्वरित और तनाव-मुक्त प्रलेखन के लिए निर्मित',
    step1Title: 'भाषा एवं सहमति',
    step1Desc: 'अपनी पसंद की भाषा (हिंदी / अंग्रेजी) चुनें और स्वास्थ्य डेटा उपयोग की सरल सहमति दें।',
    step2Title: 'मरीज विवरण',
    step2Desc: 'अपनी ओपीडी पर्ची संख्या दर्ज करें या डेमो मरीज पहचान (ID) का उपयोग करें।',
    step3Title: 'सरल प्रश्नोत्तर इतिहास',
    step3Desc: 'मुख्य परेशानी, बीमारी की अवधि, अन्य लक्षण और पिछली बीमारियों से जुड़े आसान सवालों के जवाब दें।',
    step4Title: 'दस्तावेज एवं पर्ची स्कैन',
    step4Desc: 'पुरानी डॉक्टरों की पर्चियां, खून की जांच रिपोर्ट और डिस्चार्ज कार्ड को ओसीआर से डिजिटाइज़ करें।',
    step5Title: 'डॉक्टर के लिए संक्षिप्त सारांश',
    step5Desc: 'डॉक्टर के परीक्षण के लिए एक स्पष्ट संरचित सारांश तैयार होता है जिसे डॉक्टर जांच और स्वीकृत करते हैं।',

    // Institutional Scope & Boundaries
    scopeTitle: 'क्लिनिकल सुरक्षा, सीमाएं एवं नैतिक नियम',
    scopeSubtitle: 'मेडीकियोस्क एक सहायक प्रणाली है जो पूर्णतः योग्य चिकित्सक की देखरेख में कार्य करती है',
    point1Title: 'चिकित्सक का अंतिम निर्णय अनिवार्य',
    point1Desc:
      'मेडीकियोस्क कभी भी स्वयं बीमारी की पुष्टि (डायग्नोसिस) या दवा नहीं लिखता। यह केवल डॉक्टर के समय की बचत हेतु पूर्व-इतिहास तैयार करता है।',
    point2Title: 'कठोर आपातकालीन सुरक्षा नियम',
    point2Desc:
      'यदि किसी मरीज में गंभीर या खतरनाक लक्षण पाए जाते हैं, तो प्रश्नावली तुरंत रोककर मरीज को तत्काल आपातकालीन सहायता के लिए भेजा जाता है।',
    point3Title: 'आयुष (AYUSH) मूल्यांकन सहायता',
    point3Desc:
      'आयुष चिकित्सा पद्धति के अनुसार दशविध परीक्षा, आहार-विहार, अग्नि और दिनचर्या से संबंधित महत्वपूर्ण बिंदुओं को संकलित किया जाता है।',
    point4Title: 'डेटा गोपनीयता एवं सुरक्षित भंडारण',
    point4Desc:
      'सभी स्वास्थ्य डेटा अस्पताल के स्थानीय निजी डेटाबेस में सुरक्षित रहता है और बिना सहमति के किसी बाहरी पक्ष को नहीं भेजा जाता।',

    // Status / System Readiness
    systemStatusTitle: 'प्रणाली स्थिति एवं संचालन स्वास्थ्य',
    statusKiosk: 'कियोस्क टर्मिनल: सक्रिय एवं सुरक्षित',
    statusOcr: 'दस्तावेज ओसीआर इंजन: तैयार (स्थानीय मोड)',
    statusSpeech: 'ध्वनि पहचान: वेब स्पीच एपीआई (परिवर्तनीय एडाप्टर)',
    statusDatabase: 'भंडारण: स्थानीय सिमुलेटेड सैंडबॉक्स (चरण 1 तैयार)',

    // Modals & Interactive States
    patientModalTitle: 'मरीज क्लिनिकल इतिहास — पूर्वावलोकन डेमो',
    patientModalDesc:
      'चरण 1 में अस्पताल का प्राथमिक प्रवेश द्वार तैयार है। चरण 2 में पूरी संवादात्मक आवाज एवं स्पर्श आधारित प्रश्नावली सक्रिय होगी।',
    patientModalDemoId: 'डेमो मरीज आईडी: PAT-2026-0842 (रमेश शर्मा, 54 वर्ष, ओपीडी सामान्य चिकित्सा)',
    patientModalAction: 'प्रश्नावली का पूर्वावलोकन करें',
    closeBtn: 'बंद करें',

    doctorModalTitle: 'डॉक्टर समीक्षा एवं क्लिनिकल सारांश पोर्टल',
    doctorModalDesc:
      'चरण 6 में डॉक्टर सीधे संरचित सारांश की समीक्षा करेंगे, पर्चियों की पुष्टि करेंगे और आयुष विवरण की जांच करेंगे।',
    doctorSampleDoctor: 'डॉ. सुनीता राव, एमडी (इंटरनल मेडिसिन), कमरा संख्या 14',
    doctorSampleSummaryTitle: 'प्रारूप क्लिनिकल इतिहास पूर्वावलोकन',
    doctorSampleSummaryContent:
      'मुख्य शिकायत: पिछले 3 हफ्तों से पेट के ऊपरी हिस्से में बेचैनी एवं मिचली। पुराना इतिहास: टाइप 2 मधुमेह (5 वर्षों से मेटफॉर्मिन 500mg)। ज्ञात एलर्जी: पेनिसिलिन। आपातकालीन लक्षण: कोई नहीं। आयुष अवलोकन: अग्निमांद्य की शिकायत।',

    // Accessibility
    highContrast: 'उच्च कंट्रास्ट',
    accessibilityHelp: 'बड़े बटनों को छुएं या आवाज सहायता का उपयोग करें। सहायता डेस्क मुख्य हॉल में उपलब्ध है।',
    emergencyHelpDesk: 'हेल्पलाइन: +91 11-23456789 | ओपीडी समय: प्रातः 8:00 से दोपहर 2:00 बजे तक',

    // Footer
    footerDisclaimer:
      'मेडीकियोस्क एक शैक्षणिक एवं अनुसंधान आधारित क्लिनिकल सूचना विज्ञान प्रोटोटाइप है। यह पेशेवर डॉक्टर के परामर्श का विकल्प नहीं है।',
    footerCopyright: '© 2026 मेडीकियोस्क प्लेटफॉर्म। सर्वाधिकार सुरक्षित। अस्पताल सूचना प्रणाली इंटरफेस।',
  },
};
