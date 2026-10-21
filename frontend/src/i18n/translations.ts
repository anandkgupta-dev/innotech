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

    // Institutional Scope
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

    // Status
    systemStatusTitle: 'System Readiness & Operational Health',
    statusKiosk: 'Kiosk Terminal: Online & Secure',
    statusOcr: 'OCR Document Engine: Standby (Local Mode)',
    statusSpeech: 'Speech Recognition: Web Speech API (Replaceable Adapter)',
    statusDatabase: 'Storage: Local Synthetic Sandbox (Phase 1 Ready)',

    // Phase 1 Modals
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

    // ==========================================
    // Phase 2: Patient Intake Workflow Translations
    // ==========================================
    intakeHeaderTitle: 'Patient Clinical Intake Kiosk',
    exitKiosk: 'Exit Kiosk to Home',
    stepIndicator: 'Step',
    ofText: 'of',
    nextButton: 'Continue',
    previousButton: 'Previous',
    saveProgress: 'Save Progress',
    saveSuccess: 'Progress saved locally in session.',

    // Step A: Language
    stepLangTitle: 'Select Your Preferred Language',
    stepLangSubtitle: 'Please select the language you are most comfortable speaking and reading.',
    langEnglishDesc: 'Continue in English. All questions will be in English.',
    langHindiDesc: 'हिंदी में जारी रखें। सभी प्रश्न हिंदी में होंगे।',
    changeLangNote: 'You can switch languages anytime using the button at the top right.',

    // Step B: Consent
    stepConsentTitle: 'Informed Clinical Consent & Information Notice',
    stepConsentSubtitle: 'Please read how your medical information is collected and used.',
    consentPurposeHeading: 'Why is your information collected?',
    consentPurposeText:
      'MediKiosk collects your symptoms, illness duration, and medical background to prepare a structured draft clinical summary for your consulting doctor. This saves consultation time and ensures important medical details are not missed.',
    consentDoctorHeading: 'Physician Review & Clinical Oversight',
    consentDoctorText:
      'This kiosk does NOT diagnose your condition and does NOT prescribe medicines. Your answers will only be viewed, verified, and approved by the licensed medical officer assigned to your consultation.',
    consentDemoHeading: 'Prototype Environment Notice',
    consentDemoText:
      'This is an academic development prototype. Your data remains stored in your local browser session and will not be shared with external commercial platforms.',
    consentCheckboxLabel:
      'I voluntarily provide my consent to record my health symptoms for preparing a medical history summary for the consulting physician.',
    consentRequiredError: 'You must provide consent before proceeding with clinical intake.',

    // Step C: Registration
    stepRegTitle: 'Patient Details & Demographics',
    stepRegSubtitle: 'Enter your basic details or generate a demo registration ID for testing.',
    patientIdLabel: 'Patient Registration / OPD ID',
    generateDemoIdBtn: 'Generate Demo ID',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'e.g. Ramesh Sharma',
    ageLabel: 'Age (in years)',
    agePlaceholder: 'e.g. 54',
    genderLabel: 'Sex / Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderOther: 'Other',
    genderUndisclosed: 'Prefer not to disclose',
    visitDateLabel: 'Visit Date',
    phoneLabel: 'Contact Mobile Number (Optional)',
    phonePlaceholder: 'e.g. 9876543210',
    preferredLangLabel: 'Preferred Language for Doctor Notes',
    errFullNameRequired: 'Please enter patient full name.',
    errAgeRequired: 'Please enter a valid age (1-120).',
    errPatientIdRequired: 'Patient ID is required. Click "Generate Demo ID" if registering for the first time.',

    // Step D: Chief Complaint
    stepComplaintTitle: 'What problem brought you to the hospital today?',
    stepComplaintSubtitle:
      'Select your main symptoms below or describe what you are feeling in your own words.',
    commonSymptomsTitle: 'Common Symptoms (Tap to select)',
    symptomFever: 'Fever / High Temperature',
    symptomCough: 'Cough',
    symptomChestPain: 'Chest Pain / Discomfort',
    symptomShortnessOfBreath: 'Shortness of Breath / Breathing Difficulty',
    symptomHeadache: 'Headache',
    symptomAbdominalPain: 'Abdominal / Stomach Pain',
    symptomNausea: 'Nausea / Vomiting',
    symptomDizziness: 'Dizziness / Vertigo',
    symptomBodyAche: 'Body Ache / Generalized Pain',
    symptomJointPain: 'Joint Pain / Swelling',
    symptomRash: 'Skin Rash / Itching',
    symptomUrinary: 'Urinary Pain / Difficulty',
    symptomWeakness: 'Sudden Weakness / Numbness',
    symptomOther: 'My symptom is not listed here',
    describeOwnWordsTitle: 'Describe in your own words (or use microphone):',
    describePlaceholder: 'e.g., I have had burning pain in my stomach for 3 weeks that gets worse after meals...',
    durationTitle: 'How long have you had this problem?',
    durationValueLabel: 'Number',
    durationUnitLabel: 'Unit',
    unitHours: 'Hours',
    unitDays: 'Days',
    unitWeeks: 'Weeks',
    unitMonths: 'Months',
    unitYears: 'Years',
    severityTitle: 'How severe is your discomfort?',
    severityMild: 'Mild (tolerable, does not hinder daily activity)',
    severityModerate: 'Moderate (interferes with normal tasks)',
    severitySevere: 'Severe (intense, cannot perform activities)',
    errComplaintRequired: 'Please select at least one symptom or describe your complaint.',
    errDurationRequired: 'Please specify how long you have experienced symptoms.',

    // Step E: Guided Medical History
    stepHistoryTitle: 'Guided Medical & Health History',
    stepHistorySubtitle: 'Please answer these questions to help your doctor understand your full medical background.',
    sectionAssociated: '1. Associated Symptoms',
    sectionConditions: '2. Existing Chronic Conditions',
    conditionDiabetes: 'Diabetes (High Blood Sugar)',
    conditionHypertension: 'Hypertension (High Blood Pressure)',
    conditionAsthma: 'Asthma / Respiratory Problem',
    conditionHeartDisease: 'Heart Condition',
    conditionThyroid: 'Thyroid Disorder',
    conditionKidney: 'Kidney Problem',
    conditionNone: 'No known chronic conditions',
    sectionSurgery: '3. Past Surgeries or Hospitalizations',
    surgeryPrompt: 'Have you undergone any major surgery or been admitted to a hospital in the past?',
    surgeryDetailsPlaceholder: 'Please specify surgery or admission reason and approximate year...',
    sectionMeds: '4. Current Medications',
    medsPrompt: 'Are you currently taking any prescription medicines, Ayurvedic formulations, or daily pills?',
    medsDetailsPlaceholder: 'Please list medicine names and doses (e.g., Metformin 500mg, Amlodipine 5mg)...',
    sectionAllergies: '5. Known Drug or Food Allergies',
    allergiesPrompt: 'Do you have known allergies to medications (like Penicillin, Sulfa) or specific foods?',
    allergiesDetailsPlaceholder: 'Specify allergen and reaction (e.g., Penicillin causes skin rash)...',
    sectionFamily: '6. Family Medical History',
    familyPrompt: 'Do any immediate family members (parents, siblings) have serious health conditions?',
    familyDiabetes: 'Diabetes in family',
    familyHeart: 'Heart Disease / Early heart attack',
    familyHypertension: 'Hypertension',
    familyCancer: 'Cancer',
    familyNone: 'No significant family history',
    sectionPersonal: '7. Personal & Daily Routine',
    dietLabel: 'Dietary Pattern:',
    dietVeg: 'Vegetarian',
    dietNonVeg: 'Non-Vegetarian',
    dietVegan: 'Vegan',
    tobaccoLabel: 'Tobacco / Smoking Habit:',
    alcoholLabel: 'Alcohol Consumption:',
    sleepLabel: 'Sleep Quality:',
    sleepGood: 'Normal (6-8 hours restful)',
    sleepDisturbed: 'Disturbed / Frequent waking',
    sleepInsomnia: 'Severe insomnia / Poor sleep',
    optYes: 'Yes',
    optNo: 'No / None',
    optDontKnow: "I don't know",
    optPreferNot: 'Prefer not to say',

    // Voice interaction
    voiceButtonText: 'Speak Answer',
    voiceListening: 'Listening... Speak clearly into your mic',
    voiceStop: 'Stop Recording',
    voiceNotSupported: 'Speech recognition is not supported in this browser. Please use touch/keyboard.',
    voicePermissionDenied: 'Microphone permission was denied. Please allow microphone in browser settings.',
    voiceError: 'Voice capture failed. Please try again or type directly.',

    // Emergency Red Flag Alert
    emergencyTriggerTitle: '⚠️ Immediate Emergency Red Flag Alert',
    emergencyTriggerText:
      'Based on the symptoms selected (such as chest discomfort, severe breathlessness, or sudden weakness), you may require IMMEDIATE emergency clinical care.',
    emergencyStaffAdvice:
      'Please alert the nearest hospital nurse, doctor, or security guard IMMEDIATELY, or proceed to Counter 1 (Emergency Casualty Ward).',
    emergencyAcknowledgeBtn: 'I understand — I have alerted clinical staff',
    emergencyBypassNotice:
      'MediKiosk safety rules require alerting emergency personnel. Do not wait to complete the intake questionnaire if you feel severely ill.',

    // Step G: Review & Confirmation
    stepReviewTitle: 'Review Your Medical Intake Summary',
    stepReviewSubtitle: 'Please review all recorded information carefully before submitting it for doctor consultation.',
    reviewPatientInfo: 'Patient Information',
    reviewChiefComplaint: 'Presenting Complaint & Duration',
    reviewHistory: 'Medical History & Lifestyle',
    reviewUnanswered: 'Not specified / Skipped',
    reviewEditBtn: 'Edit Section',
    reviewConfirmLabel:
      'I confirm that the above clinical details are accurate to the best of my knowledge and can be provided to my consulting doctor.',
    reviewSubmitBtn: 'Submit Medical Intake to Doctor Desk',
    errReviewConfirmRequired: 'Please confirm that the information is accurate before submitting.',
    submittingIntake: 'Saving record to hospital database...',
    submissionFailedTitle: 'Submission Error',
    submissionRetryBtn: 'Retry Submission',
    databaseSavedBadge: 'Persisted to Hospital Database (MongoDB Atlas)',

    // Success Screen
    intakeSuccessTitle: 'Clinical Intake Registered Successfully!',
    intakeSuccessSubtitle: 'Your medical history draft has been queued for your consulting doctor.',
    intakeTokenLabel: 'Your OPD Intake Token Number:',
    intakeInstructionsHeading: 'What to do next:',
    intakeInstruction1: 'Please take your token slip and proceed to OPD Room #14 (General Medicine).',
    intakeInstruction2: 'When your token number is called, meet Dr. Sunita Rao for your consultation.',
    intakeInstruction3: 'Your doctor will review, verify, and complete your clinical history notes.',
    newIntakeBtn: 'Start New Patient Intake',
    printSummaryBtn: 'Print / Save Intake Slip',
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

    // Institutional Scope
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

    // Status
    systemStatusTitle: 'प्रणाली स्थिति एवं संचालन स्वास्थ्य',
    statusKiosk: 'कियोस्क टर्मिनल: सक्रिय एवं सुरक्षित',
    statusOcr: 'दस्तावेज ओसीआर इंजन: तैयार (स्थानीय मोड)',
    statusSpeech: 'ध्वनि पहचान: वेब स्पीच एपीआई (परिवर्तनीय एडाप्टर)',
    statusDatabase: 'भंडारण: स्थानीय सिमुलेटेड सैंडबॉक्स (चरण 1 तैयार)',

    // Phase 1 Modals
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

    // ==========================================
    // Phase 2: Patient Intake Workflow Translations (Hindi)
    // ==========================================
    intakeHeaderTitle: 'मरीज क्लिनिकल स्व-पंजीकरण कियोस्क',
    exitKiosk: 'मुख्य पृष्ठ पर वापस जाएं',
    stepIndicator: 'चरण',
    ofText: 'का',
    nextButton: 'आगे बढ़ें',
    previousButton: 'पीछे जाएं',
    saveProgress: 'प्रगति सुरक्षित करें',
    saveSuccess: 'प्रगति वर्तमान सत्र में सुरक्षित कर ली गई है।',

    // Step A: Language
    stepLangTitle: 'अपनी पसंदीदा भाषा चुनें',
    stepLangSubtitle: 'कृपया वह भाषा चुनें जिसमें आप पढ़ने और बोलने में सबसे सहज हों।',
    langEnglishDesc: 'अंग्रेजी में जारी रखें। सभी प्रश्न अंग्रेजी में होंगे।',
    langHindiDesc: 'हिंदी में जारी रखें। सभी प्रश्न हिंदी में होंगे।',
    changeLangNote: 'आप ऊपर दाईं ओर दिए गए बटन से किसी भी समय भाषा बदल सकते हैं।',

    // Step B: Consent
    stepConsentTitle: 'सूचित क्लिनिकल सहमति एवं डेटा सूचना',
    stepConsentSubtitle: 'कृपया ध्यानपूर्वक पढ़ें कि आपका स्वास्थ्य विवरण कैसे संकलित एवं उपयोग किया जाएगा।',
    consentPurposeHeading: 'आपकी जानकारी क्यों संकलित की जाती है?',
    consentPurposeText:
      'मेडीकियोस्क आपके लक्षणों, बीमारी की अवधि और पिछले स्वास्थ्य इतिहास को दर्ज करता है ताकि आपके परामर्श डॉक्टर के लिए एक संरचित सारांश तैयार किया जा सके। इससे परामर्श के समय की बचत होती है और कोई महत्वपूर्ण बिंदु छूटता नहीं है।',
    consentDoctorHeading: 'डॉक्टर की देखरेख एवं परीक्षण',
    consentDoctorText:
      'यह कियोस्क किसी बीमारी का स्वयं निदान नहीं करता और न ही दवा लिखता है। आपके द्वारा दर्ज की गई जानकारी को केवल आपके परामर्श डॉक्टर द्वारा जांचा और स्वीकृत किया जाएगा।',
    consentDemoHeading: 'प्रोटोटाइप विकास सैंडबॉक्स सूचना',
    consentDemoText:
      'यह एक शैक्षणिक एवं शोध प्रोटोटाइप है। आपका डेटा स्थानीय ब्राउज़र सत्र में रहता है और किसी बाहरी संस्था को नहीं भेजा जाता है।',
    consentCheckboxLabel:
      'मैं परामर्श डॉक्टर के लिए स्वास्थ्य इतिहास सारांश तैयार करने हेतु अपने लक्षणों की जानकारी देने की स्वेच्छा से सहमति देता/देती हूँ।',
    consentRequiredError: 'आगे बढ़ने के लिए सहमति देना अनिवार्य है।',

    // Step C: Registration
    stepRegTitle: 'मरीज विवरण एवं पंजीकरण',
    stepRegSubtitle: 'अपना बुनियादी विवरण दर्ज करें या परीक्षण के लिए डेमो आईडी बनाएं।',
    patientIdLabel: 'मरीज पंजीकरण / ओपीडी संख्या',
    generateDemoIdBtn: 'डेमो आईडी बनाएं',
    fullNameLabel: 'पूरा नाम',
    fullNamePlaceholder: 'उदा. रमेश शर्मा',
    ageLabel: 'उम्र (वर्षों में)',
    agePlaceholder: 'उदा. 54',
    genderLabel: 'लिंग',
    genderMale: 'पुरुष',
    genderFemale: 'महिला',
    genderOther: 'अन्य',
    genderUndisclosed: 'बताना नहीं चाहते',
    visitDateLabel: 'परामर्श तिथि',
    phoneLabel: 'मोबाइल नंबर (वैकल्पिक)',
    phonePlaceholder: 'उदा. 9876543210',
    preferredLangLabel: 'डॉक्टर पर्चे हेतु पसंदीदा भाषा',
    errFullNameRequired: 'कृपया मरीज का पूरा नाम दर्ज करें।',
    errAgeRequired: 'कृपया सही उम्र दर्ज करें (1 से 120 वर्ष)।',
    errPatientIdRequired: 'मरीज आईडी अनिवार्य है। पहली बार आने पर "डेमो आईडी बनाएं" पर क्लिक करें।',

    // Step D: Chief Complaint
    stepComplaintTitle: 'आज अस्पताल आने का मुख्य कारण क्या है?',
    stepComplaintSubtitle: 'लागू होने वाले सामान्य लक्षणों को चुनें या नीचे अपने शब्दों में लिखें।',
    commonSymptomsTitle: 'सामान्य लक्षण (चुनने के लिए टैप करें)',
    symptomFever: 'बुखार / तेज तापमान',
    symptomCough: 'खांसी',
    symptomChestPain: 'सीने में दर्द या भारीपन',
    symptomShortnessOfBreath: 'सांस फूलना या सांस लेने में तकलीफ',
    symptomHeadache: 'सिरदर्द',
    symptomAbdominalPain: 'पेट दर्द / जलन',
    symptomNausea: 'मिचली / उल्टी',
    symptomDizziness: 'चक्कर आना / सिर घूमना',
    symptomBodyAche: 'बदन दर्द / थकान',
    symptomJointPain: 'जोड़ों का दर्द / सूजन',
    symptomRash: 'त्वचा पर लाल चकत्ते / खुजली',
    symptomUrinary: 'पेशाब में जलन या रुकावट',
    symptomWeakness: 'अचानक कमजोरी या सुन्नपन',
    symptomOther: 'मेरा लक्षण सूची में नहीं है',
    describeOwnWordsTitle: 'अपने शब्दों में विस्तार से बताएं (या माइक से बोलें):',
    describePlaceholder: 'उदा. पिछले 3 हफ्तों से पेट में जलन हो रही है और खाना खाने के बाद दर्द बढ़ जाता है...',
    durationTitle: 'यह तकलीफ कितने समय से है?',
    durationValueLabel: 'संख्या',
    durationUnitLabel: 'इकाई',
    unitHours: 'घंटे',
    unitDays: 'दिन',
    unitWeeks: 'सप्ताह',
    unitMonths: 'महीने',
    unitYears: 'साल',
    severityTitle: 'तकलीफ की तीव्रता कितनी है?',
    severityMild: 'हल्की (सहन करने योग्य, रोजमर्रा काम पर असर नहीं)',
    severityModerate: 'मध्यम (सामान्य कामकाज में रुकावट)',
    severitySevere: 'गंभीर (अत्यधिक, रोजमर्रा काम असंभव)',
    errComplaintRequired: 'कृपया कम से कम एक लक्षण चुनें या अपनी परेशानी लिखें।',
    errDurationRequired: 'कृपया बताएं कि यह परेशानी कितने समय से है।',

    // Step E: Guided Medical History
    stepHistoryTitle: 'विस्तृत स्वास्थ्य एवं चिकित्सा इतिहास',
    stepHistorySubtitle: 'आपके डॉक्टर को पूरी स्थिति समझने में सहायता के लिए इन सरल प्रश्नों के उत्तर दें।',
    sectionAssociated: '१. साथ में महसूस होने वाले अन्य लक्षण',
    sectionConditions: '२. पूर्व से चल रही पुरानी बीमारियां',
    conditionDiabetes: 'मधुमेह (डायबिटीज / शुगर)',
    conditionHypertension: 'उच्च रक्तचाप (हाई ब्लड प्रेशर)',
    conditionAsthma: 'अस्थमा / दमा / सांस की बीमारी',
    conditionHeartDisease: 'हृदय रोग',
    conditionThyroid: 'थायराइड विकार',
    conditionKidney: 'गुर्दे (किडनी) की बीमारी',
    conditionNone: 'कोई ज्ञात पुरानी बीमारी नहीं',
    sectionSurgery: '३. पूर्व ऑपरेशन अथवा अस्पताल में भर्ती',
    surgeryPrompt: 'क्या पहले आपका कोई ऑपरेशन हुआ है या आप कभी अस्पताल में भर्ती हुए हैं?',
    surgeryDetailsPlaceholder: 'ऑपरेशन या भर्ती का कारण एवं वर्ष लिखें...',
    sectionMeds: '४. वर्तमान में ली जा रही दवाइयां',
    medsPrompt: 'क्या आप वर्तमान में कोई नियमित अंग्रेजी, आयुर्वेदिक या अन्य दवाइयां ले रहे हैं?',
    medsDetailsPlaceholder: 'दवाइयों के नाम एवं मात्रा लिखें (उदा. मेटफॉर्मिन 500mg)...',
    sectionAllergies: '५. ज्ञात दवा अथवा खाद्य एलर्जी',
    allergiesPrompt: 'क्या आपको किसी दवा (जैसे पेनिसिलिन, सल्फा) अथवा किसी भोजन से एलर्जी है?',
    allergiesDetailsPlaceholder: 'एलर्जी का कारण एवं लक्षण लिखें (उदा. पेनिसिलिन से त्वचा पर चकत्ते)...',
    sectionFamily: '६. परिवार का स्वास्थ्य इतिहास',
    familyPrompt: 'क्या आपके परिवार (माता-पिता, भाई-बहन) में किसी को गंभीर बीमारी रही है?',
    familyDiabetes: 'परिवार में मधुमेह',
    familyHeart: 'हृदय रोग / असमय दिल का दौरा',
    familyHypertension: 'उच्च रक्तचाप',
    familyCancer: 'कैंसर',
    familyNone: 'परिवार में कोई विशेष बीमारी नहीं',
    sectionPersonal: '७. दिनचर्या एवं आदतें',
    dietLabel: 'खान-पान (आहार):',
    dietVeg: 'शाकाहारी',
    dietNonVeg: 'मांसाहारी',
    dietVegan: 'वीगन',
    tobaccoLabel: 'तंबाकू / धूम्रपान की आदत:',
    alcoholLabel: 'शराब का सेवन:',
    sleepLabel: 'नींद की स्थिति:',
    sleepGood: 'सामान्य (६-८ घंटे आरामदायक)',
    sleepDisturbed: 'अशांत / बार-बार टूटने वाली',
    sleepInsomnia: 'गंभीर अनिद्रा / कम नींद',
    optYes: 'हाँ',
    optNo: 'नहीं',
    optDontKnow: 'मुझे नहीं पता',
    optPreferNot: 'बताना नहीं चाहते',

    // Voice interaction
    voiceButtonText: 'बोलकर उत्तर दें',
    voiceListening: 'सुन रहे हैं... कृपया स्पष्ट बोलें',
    voiceStop: 'रिकॉर्डिंग रोकें',
    voiceNotSupported: 'इस ब्राउज़र में ध्वनि पहचान समर्थित नहीं है। कृपया लिखकर दर्ज करें।',
    voicePermissionDenied: 'माइक्रोफोन की अनुमति अस्वीकृत की गई। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।',
    voiceError: 'आवाज दर्ज करने में असमर्थ। कृपया पुनः प्रयास करें या सीधे लिखें।',

    // Emergency Red Flag Alert
    emergencyTriggerTitle: '⚠️ तत्काल आपातकालीन चेतावनी (Red Flag Alert)',
    emergencyTriggerText:
      'आपके द्वारा चुने गए लक्षणों (जैसे सीने में भारी दर्द, सांस लेने में अत्यधिक तकलीफ या अचानक कमजोरी) के आधार पर आपको तत्काल आपातकालीन चिकित्सा सहायता की आवश्यकता हो सकती है।',
    emergencyStaffAdvice:
      'कृपया तुरंत पास के नर्सिंग स्टाफ, डॉक्टर या सुरक्षा गार्ड को सूचित करें, अथवा तत्काल काउंटर नं. 1 (इमरजेंसी कैजुअल्टी वार्ड) पर जाएं।',
    emergencyAcknowledgeBtn: 'मैं समझ गया/गई हूँ — मैंने अस्पताल स्टाफ को सूचित कर दिया है',
    emergencyBypassNotice:
      'सुरक्षा नियमों के अनुसार गंभीर स्थिति में कियोस्क का पूरा फॉर्म भरने की प्रतीक्षा न करें, सीधे आपातकालीन सहायता लें।',

    // Step G: Review & Confirmation
    stepReviewTitle: 'अपने स्वास्थ्य विवरण की समीक्षा करें',
    stepReviewSubtitle: 'डॉक्टर परामर्श हेतु जमा करने से पहले कृपया सभी दर्ज जानकारी की पुष्टि करें।',
    reviewPatientInfo: 'मरीज बुनियादी विवरण',
    reviewChiefComplaint: 'मुख्य परेशानी एवं अवधि',
    reviewHistory: 'चिकित्सा इतिहास एवं आदतें',
    reviewUnanswered: 'छोड़ दिया गया / दर्ज नहीं',
    reviewEditBtn: 'संपादित करें',
    reviewConfirmLabel:
      'मैं पुष्टि करता/करती हूँ कि ऊपर दी गई सभी जानकारी मेरी जानकारी के अनुसार सत्य है और इसे मेरे परामर्श डॉक्टर को दिखाया जा सकता है।',
    reviewSubmitBtn: 'डॉक्टर डेस्क पर विवरण जमा करें',
    errReviewConfirmRequired: 'विवरण जमा करने से पहले कृपया पुष्टि बॉक्स पर टिक करें।',
    submittingIntake: 'अस्पताल डेटाबेस में सहेजा जा रहा है...',
    submissionFailedTitle: 'जमा करने में त्रुटि',
    submissionRetryBtn: 'पुनः प्रयास करें',
    databaseSavedBadge: 'अस्पताल डेटाबेस में सुरक्षित (MongoDB Atlas)',

    // Success Screen
    intakeSuccessTitle: 'क्लिनिकल विवरण सफलतापूर्वक पंजीकृत!',
    intakeSuccessSubtitle: 'आपका स्वास्थ्य इतिहास प्रारूप आपके परामर्श डॉक्टर के पास भेज दिया गया है।',
    intakeTokenLabel: 'आपका ओपीडी क्लिनिकल टोकन नंबर:',
    intakeInstructionsHeading: 'अब आगे क्या करें:',
    intakeInstruction1: 'कृपया अपनी टोकन पर्ची लेकर ओपीडी कमरा नं. 14 (सामान्य चिकित्सा विभाग) में जाएं।',
    intakeInstruction2: 'जब आपका टोकन नंबर बुलाया जाए, तो डॉक्टर सुनीता राव से परामर्श लें।',
    intakeInstruction3: 'डॉक्टर आपके द्वारा दर्ज किए गए इस ब्योरे की जांच और सत्यापन करेंगे।',
    newIntakeBtn: 'नया मरीज पंजीकरण शुरू करें',
    printSummaryBtn: 'पर्ची प्रिंट / सुरक्षित करें',
  },
};
