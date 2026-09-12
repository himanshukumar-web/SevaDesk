import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SevaDesk database...");

  // 1. Password hash
  const salt = await bcrypt.genSalt(10);
  const userPasswordHash = await bcrypt.hash("User@123456", salt);
  const cafePasswordHash = await bcrypt.hash("Cafe@123456", salt);
  const adminPasswordHash = await bcrypt.hash("Admin@123456", salt);

  // 2. Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.requestStatusHistory.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.userDocument.deleteMany();
  await prisma.adUnlock.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.service.deleteMany();
  await prisma.documentTemplate.deleteMany();
  await prisma.category.deleteMany();
  await prisma.cyberCafe.deleteMany();
  await prisma.user.deleteMany();

  // 3. Create Users
  const citizen = await prisma.user.create({
    data: {
      email: "user@sevadesk.in",
      passwordHash: userPasswordHash,
      role: "USER",
      name: "Rajesh Kumar Sharma",
      phone: "+91 9876543210",
      state: "Uttar Pradesh",
      district: "Lucknow",
      city: "Hazratganj",
      pincode: "226001",
      isVerified: true,
      subscriptions: {
        create: {
          plan: "PREMIUM",
          status: "ACTIVE",
          amount: 99.0,
          paymentRef: "PAY_SEED_MOCK_001",
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  const cafeUser1 = await prisma.user.create({
    data: {
      email: "operator@delhicyber.in",
      passwordHash: cafePasswordHash,
      role: "CYBER_CAFE",
      name: "Amit Verma",
      phone: "+91 9811223344",
      state: "Delhi",
      district: "Central Delhi",
      city: "Connaught Place",
      pincode: "110001",
      isVerified: true,
    },
  });

  const cafeUser2 = await prisma.user.create({
    data: {
      email: "newcafe@biharseva.in",
      passwordHash: cafePasswordHash,
      role: "CYBER_CAFE",
      name: "Manoj Kumar",
      phone: "+91 9822334455",
      state: "Bihar",
      district: "Patna",
      city: "Kankarbagh",
      pincode: "800020",
      isVerified: false,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@sevadesk.in",
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
      name: "SevaDesk National Administrator",
      phone: "+91 9999900000",
      state: "Delhi",
      district: "New Delhi",
      city: "New Delhi",
      pincode: "110001",
      isVerified: true,
    },
  });

  // 4. Create Cyber Cafes
  const cafe1 = await prisma.cyberCafe.create({
    data: {
      userId: cafeUser1.id,
      shopName: "Verma Digital Seva Kendra & CSC",
      ownerName: "Amit Verma",
      phone: "+91 9811223344",
      email: "operator@delhicyber.in",
      address: "Shop 14, Block B, Near Metro Gate 2, Connaught Place",
      city: "New Delhi",
      district: "Central Delhi",
      state: "Delhi",
      pincode: "110001",
      openingHours: "09:00 AM - 08:30 PM (Mon-Sat)",
      servicesOffered: "Online Forms, Caste/Income/Domicile Applications, PAN Card, Aadhaar Print, High-Speed Color Printing, Lamination",
      pricingJson: JSON.stringify({
        typing: 30,
        assistance: 60,
        printBlack: 5,
        printColor: 15,
        scan: 10,
        lamination: 25,
      }),
      verificationStatus: "VERIFIED",
      verificationDocsJson: JSON.stringify({
        shopRegistration: "DOC-REG-DEL-2024-8891",
        aadhaarVerified: true,
        panVerified: true,
        cscId: "CSC-DEL-09941",
      }),
      isAvailable: true,
      rating: 4.9,
      reviewCount: 48,
    },
  });

  const cafe2 = await prisma.cyberCafe.create({
    data: {
      userId: cafeUser2.id,
      shopName: "Manoj Cyber Point & CSC Sahaj Seva",
      ownerName: "Manoj Kumar",
      phone: "+91 9822334455",
      email: "newcafe@biharseva.in",
      address: "Near Old Bus Stand, Kankarbagh Main Road",
      city: "Patna",
      district: "Patna",
      state: "Bihar",
      pincode: "800020",
      openingHours: "08:30 AM - 09:00 PM (All 7 Days)",
      servicesOffered: "RTPS Bihar Applications, Ration Card, Voter ID, Scholarship Forms, Passport Assist",
      pricingJson: JSON.stringify({
        typing: 25,
        assistance: 50,
        printBlack: 3,
        printColor: 10,
        scan: 5,
        lamination: 20,
      }),
      verificationStatus: "PENDING",
      verificationDocsJson: JSON.stringify({
        shopRegistration: "DOC-REG-BR-2024-3312",
        aadhaarVerified: true,
        panVerified: true,
        cscId: "CSC-BR-14022",
      }),
      isAvailable: true,
      rating: 4.7,
      reviewCount: 14,
    },
  });

  // 5. Categories
  const catIdentity = await prisma.category.create({
    data: {
      name: "Identity & Citizenship",
      slug: "identity-citizenship",
      description: "Aadhaar, PAN Card, Voter Card, Passport, and address proof credentials.",
      icon: "ShieldCheck",
      displayOrder: 1,
    },
  });

  const catCertificates = await prisma.category.create({
    data: {
      name: "Certificates & Revenue",
      slug: "certificates-revenue",
      description: "State revenue documents including Income, Caste, Domicile, EWS, and Character certificates.",
      icon: "Award",
      displayOrder: 2,
    },
  });

  const catTransport = await prisma.category.create({
    data: {
      name: "Transport & Driving",
      slug: "transport-driving",
      description: "Learner's licence, permanent driving licence, RC transfer, and vehicle certificates.",
      icon: "Car",
      displayOrder: 3,
    },
  });

  const catWelfare = await prisma.category.create({
    data: {
      name: "Social Welfare & Pensions",
      slug: "social-welfare-pensions",
      description: "Old age pensions, PM-Kisan Samman Nidhi, scholarship applications, and ration cards.",
      icon: "HeartHandshake",
      displayOrder: 4,
    },
  });

  const catCivil = await prisma.category.create({
    data: {
      name: "Vital Events & Civil Registry",
      slug: "civil-registry",
      description: "Birth registration, Death certificates, Marriage registrations, and legal affidavits.",
      icon: "FileSignature",
      displayOrder: 5,
    },
  });

  // 6. Templates
  const templateIncome = await prisma.documentTemplate.create({
    data: {
      title: "Application for Income Certificate (आय प्रमाण पत्र हेतु आवेदन)",
      slug: "income-certificate-application",
      category: "Certificates & Revenue",
      description: "Standard citizen application for revenue tehsildar/revenue officer verification.",
      layoutType: "standard_application",
      instructions: "Enter your family's annual earnings accurately from all sources (Salary, Agriculture, Business). False declarations may lead to rejection by the Revenue Inspector.",
      disclaimer: "This document is a citizen-prepared draft application. It must be presented to the Tehsildar/SDM or submitted on the official State e-District portal.",
      fieldsJson: JSON.stringify([
        { id: "applicantName", label: "Applicant's Full Name (आवेदक का पूरा नाम)", type: "text", required: true, placeholder: "e.g. Ramesh Chandra" },
        { id: "fatherHusbandName", label: "Father's / Husband's Name (पिता / पति का नाम)", type: "text", required: true, placeholder: "e.g. Late Harish Chandra" },
        { id: "gender", label: "Gender (लिंग)", type: "radio", options: ["Male", "Female", "Transgender"], required: true },
        { id: "dob", label: "Date of Birth (जन्म तिथि)", type: "date", required: true },
        { id: "mobileNumber", label: "Mobile Number (मोबाइल नंबर)", type: "mobile", required: true, placeholder: "10-digit mobile" },
        { id: "email", label: "Email Address (ईमेल)", type: "email", required: false, placeholder: "applicant@example.com" },
        { id: "occupation", label: "Primary Occupation / Profession (व्यवसाय)", type: "text", required: true, placeholder: "e.g. Agriculture / Small Business / Private Job" },
        { id: "residentialAddress", label: "Permanent Residential Address (स्थाई पता)", type: "address", required: true, placeholder: "Village / Mohalla, Post, Tehsil" },
        { id: "district", label: "District (जनपद / जिला)", type: "text", required: true, placeholder: "e.g. Lucknow" },
        { id: "state", label: "State (राज्य)", type: "text", required: true, placeholder: "e.g. Uttar Pradesh" },
        { id: "pincode", label: "Pincode (पिन कोड)", type: "pincode", required: true, placeholder: "e.g. 226001" },
        { id: "familyMembersCount", label: "Number of Family Members (परिवार के कुल सदस्य)", type: "number", required: true, placeholder: "e.g. 4" },
        { id: "annualIncomeAgriculture", label: "Annual Income from Agriculture (कृषि से वार्षिक आय ₹)", type: "number", required: false, placeholder: "0" },
        { id: "annualIncomeBusiness", label: "Annual Income from Business/Vocation (व्यवसाय से आय ₹)", type: "number", required: false, placeholder: "0" },
        { id: "annualIncomeSalary", label: "Annual Income from Salary/Wages (वेतन/मजदूरी से आय ₹)", type: "number", required: false, placeholder: "0" },
        { id: "annualIncomeOther", label: "Income from Other Sources (अन्य स्रोतों से आय ₹)", type: "number", required: false, placeholder: "0" },
        { id: "purposeOfCertificate", label: "Purpose of Certificate (प्रमाण पत्र का प्रयोजन)", type: "dropdown", options: ["Scholarship / Fee Waiver", "Government Scheme Subsidy", "Education Admission", "EWS Certificate Support", "Legal / Official Work"], required: true },
        { id: "selfDeclaration", label: "I certify that all details given above are true and complete to the best of my knowledge (स्वघोषणा)", type: "checkbox", required: true },
      ]),
      sampleDataJson: JSON.stringify({
        applicantName: "Rajesh Kumar Sharma",
        fatherHusbandName: "Harish Chandra Sharma",
        gender: "Male",
        dob: "1988-06-15",
        mobileNumber: "9876543210",
        email: "user@sevadesk.in",
        occupation: "Small Retail Shop",
        residentialAddress: "House No. 42, Civil Lines, Hazratganj",
        district: "Lucknow",
        state: "Uttar Pradesh",
        pincode: "226001",
        familyMembersCount: 4,
        annualIncomeAgriculture: 20000,
        annualIncomeBusiness: 65000,
        annualIncomeSalary: 0,
        annualIncomeOther: 0,
        purposeOfCertificate: "Scholarship / Fee Waiver",
        selfDeclaration: true,
      }),
    },
  });

  const templateDomicile = await prisma.documentTemplate.create({
    data: {
      title: "Application for Domicile / Residence Certificate (निवास प्रमाण पत्र हेतु आवेदन)",
      slug: "domicile-certificate-application",
      category: "Certificates & Revenue",
      description: "Draft application for proof of continuous residential status in the state/district.",
      layoutType: "standard_application",
      instructions: "Attach proof of stay (such as electricity bill, voter card, school certificate, or ration card).",
      disclaimer: "Citizen-prepared draft application. Official certificate is issued by the Sub-Divisional Magistrate (SDM) / Tehsildar upon field inquiry.",
      fieldsJson: JSON.stringify([
        { id: "applicantName", label: "Applicant's Name (आवेदक का नाम)", type: "text", required: true },
        { id: "guardianName", label: "Father / Mother / Husband Name (अभिभावक का नाम)", type: "text", required: true },
        { id: "dob", label: "Date of Birth (जन्म तिथि)", type: "date", required: true },
        { id: "birthPlace", label: "Place of Birth (जन्म स्थान)", type: "text", required: true },
        { id: "yearsOfResidence", label: "Years Living at Current Address (वर्तमान पते पर निवास के वर्ष)", type: "number", required: true },
        { id: "currentAddress", label: "Full Present Address (वर्तमान पता)", type: "address", required: true },
        { id: "district", label: "District (जिला)", type: "text", required: true },
        { id: "state", label: "State (राज्य)", type: "text", required: true },
        { id: "pincode", label: "Pincode (पिन कोड)", type: "pincode", required: true },
        { id: "residenceProofType", label: "Primary Proof of Residence (निवास प्रमाण का प्रकार)", type: "dropdown", options: ["Electricity Bill", "Ration Card", "Voter ID Card", "Registered Rent / Lease Deed", "School Leaving Certificate"], required: true },
        { id: "residenceProofNumber", label: "Proof Document Number / Consumer ID", type: "text", required: true },
        { id: "reasonForCertificate", label: "Reason for Certificate (प्रमाण पत्र की आवश्यकता)", type: "dropdown", options: ["State Govt Job Application", "College Admission / Counselling", "State Welfare Scheme", "Land / Property Registry"], required: true },
        { id: "selfDeclaration", label: "I hereby solemnly affirm that I am a permanent resident of this state and have not obtained a domicile certificate from any other state.", type: "checkbox", required: true },
      ]),
    },
  });

  const templateGeneralLetter = await prisma.documentTemplate.create({
    data: {
      title: "General Government Application Letter (सार्वजनिक कार्यालय हेतु औपचारिक प्रार्थना पत्र)",
      slug: "general-govt-application",
      category: "Citizen Letters & Affidavits",
      description: "Professional formal letter template addressed to any Government Officer, Collector, or Municipal Commissioner.",
      layoutType: "standard_application",
      instructions: "State your grievance, demand, or inquiry clearly in polite official language.",
      disclaimer: "Citizen-prepared formal communication. Not an official receipt or decree.",
      fieldsJson: JSON.stringify([
        { id: "officerDesignation", label: "Designation of Officer (अधिकारी का पदनाम)", type: "text", required: true, placeholder: "e.g. The District Magistrate / Municipal Commissioner" },
        { id: "officeDepartment", label: "Department / Office Name (विभाग / कार्यालय)", type: "text", required: true, placeholder: "e.g. Collectorate Office / Nagar Nigam" },
        { id: "officeCityDistrict", label: "Office City & District (कार्यालय का शहर व जिला)", type: "text", required: true, placeholder: "e.g. Lucknow, Uttar Pradesh" },
        { id: "subjectLine", label: "Subject of Application (आवेदन का विषय)", type: "text", required: true, placeholder: "e.g. Application regarding road repair in Ward 12" },
        { id: "applicantName", label: "Applicant's Full Name (प्रार्थी का नाम)", type: "text", required: true },
        { id: "applicantFatherName", label: "Father's / Husband's Name (पिता/पति का नाम)", type: "text", required: true },
        { id: "applicantAddress", label: "Complete Address (पूरा पता)", type: "address", required: true },
        { id: "mobileNumber", label: "Mobile Number (दूरभाष)", type: "mobile", required: true },
        { id: "applicationContent", label: "Detailed Matter / Application Body (विस्तृत विवरण)", type: "textarea", required: true, placeholder: "Explain your problem, reference previous complaints if any, and specific request..." },
        { id: "enclosures", label: "List of Enclosed Documents (संलग्नक विवरण)", type: "text", required: false, placeholder: "e.g. 1. Copy of Aadhaar, 2. Previous complaint receipt dated 12/01/2024" },
      ]),
    },
  });

  const templateLostAffidavit = await prisma.documentTemplate.create({
    data: {
      title: "Affidavit for Lost Document (दस्तावेज़ गुम होने पर शपथ पत्र प्रारूप)",
      slug: "lost-document-affidavit",
      category: "Citizen Letters & Affidavits",
      description: "Sworn affidavit format for lost marksheets, vehicle RC, identity cards, or share certificates.",
      layoutType: "affidavit",
      instructions: "To be printed on Non-Judicial Stamp Paper (e.g. ₹10 / ₹50 or ₹100 depending on state rule) and notarized before an Executive Magistrate or Notary Public.",
      disclaimer: "This draft affidavit template is prepared by the citizen. It is valid only after being executed on appropriate Stamp Paper and attested by an authorized Notary or Oath Commissioner.",
      fieldsJson: JSON.stringify([
        { id: "deponentName", label: "Deponent's Full Name (शपथकर्ता का नाम)", type: "text", required: true },
        { id: "deponentFatherName", label: "Father's / Spouse's Name (पिता/पति का नाम)", type: "text", required: true },
        { id: "deponentAge", label: "Age in Years (आयु)", type: "number", required: true },
        { id: "deponentAddress", label: "Permanent Residential Address (स्थाई पता)", type: "address", required: true },
        { id: "lostItemName", label: "Name of Lost Document/Certificate (गुम हुए प्रलेख का नाम)", type: "text", required: true, placeholder: "e.g. Class 10th Original Marksheet / Vehicle RC / Passport" },
        { id: "lostItemRegNumber", label: "Registration / Serial / Roll Number of Lost Item", type: "text", required: true, placeholder: "e.g. Roll No: 12849102 / Vehicle No: UP32AB1234" },
        { id: "approxDateOfLoss", label: "Approximate Date of Loss (गुम होने की अनुमानित तिथि)", type: "date", required: true },
        { id: "placeOfLoss", label: "Place where it was Lost or Misplaced (गुम होने का स्थान)", type: "text", required: true },
        { id: "policeReportNo", label: "Police Diary (GD) / Online Lost Article Report No.", type: "text", required: true, placeholder: "e.g. LR/LKO/2024/09841" },
        { id: "policeStation", label: "Police Station Name (संबंधित थाना)", type: "text", required: true },
        { id: "oathConfirmation", label: "I solemnly affirm that the said document has not been pledged or misused anywhere, and if found, will be surrendered.", type: "checkbox", required: true },
      ]),
    },
  });

  // 7. Government Services
  const servicesData = [
    {
      categoryId: catCertificates.id,
      templateId: templateIncome.id,
      title: "Income Certificate (आय प्रमाण पत्र)",
      slug: "income-certificate",
      shortDesc: "Official certification of family annual earnings for scholarships, fee concessions, and government welfare benefits.",
      whatIsIt: "An Income Certificate is an official document issued by the State Government's Revenue Department certifying the annual earnings of an individual or their household from all known sources.",
      whoNeedsIt: "Students applying for fee reimbursements or government scholarships, families seeking EWS category benefits, medical aid from Chief Minister Relief Funds, or ration card category changes.",
      eligibility: "Any permanent resident or domicile holder of the state whose family earnings need official certification. Both salaried and self-employed/agricultural families can apply.",
      requiredDocsJson: JSON.stringify([
        "Salary Slip or Form 16 (for salaried persons)",
        "Bank Account Statement (last 6 months)",
        "Land Record / Khasra-Khatauni (for farmers)",
        "Self-Declaration Affidavit / Income declaration form",
        "Aadhaar Card of Applicant & Family Head",
        "Ration Card or BPL Card (if available)",
        "Passport-size photograph",
      ]),
      stepsJson: JSON.stringify([
        "Step 1: Check your state's online citizen portal (e-District, RTPS, MeeSeva, Seva Sindhu, etc.) or visit a local CSC / Cyber Café.",
        "Step 2: Fill out the structured application with verified details of family members and annual income.",
        "Step 3: Upload supporting proofs (Aadhaar, income self-declaration, bank statement).",
        "Step 4: Pay the state government statutory portal fee (usually ₹15 - ₹50).",
        "Step 5: Revenue Inspector (Lekhpal / Patwari) conducts localized field inquiry.",
        "Step 6: Approved digitally signed certificate is issued by Tehsildar / Sub-Divisional Officer (SDO).",
      ]),
      officialFees: "₹15 to ₹50 (Government portal fee depending on State). Cyber Café service fee is separate.",
      processingTime: "7 to 15 Working Days (Information may vary by state/district. Verify on the official government portal).",
      whereToApply: "State e-District Portal, CSC Digital Seva Kendra, or Tehsildar Office.",
      stateSpecificNotesJson: JSON.stringify({
        "Uttar Pradesh": "Apply via edistrict.up.gov.in. Fee ₹30. Valid for 3 years.",
        "Bihar": "Apply via serviceonline.bihar.gov.in (RTPS). Valid for 1 year.",
        "Maharashtra": "Apply via aaplesarkar.mahaonline.gov.in. Issued by Tehsildar.",
        "Delhi": "Apply via edistrict.delhigovt.nic.in. SDM verification required.",
      }),
      officialUrl: "https://services.india.gov.in",
    },
    {
      categoryId: catCertificates.id,
      templateId: templateDomicile.id,
      title: "Domicile / Residence Certificate (मूल निवास प्रमाण पत्र)",
      slug: "domicile-certificate",
      shortDesc: "Proof of permanent residency in a State or Union Territory required for state jobs, institutional quotas, and admissions.",
      whatIsIt: "A Domicile or Permanent Resident Certificate (PRC) certifies that an individual is an authentic permanent resident of a specific State or Union Territory of India.",
      whoNeedsIt: "Job seekers for state public service exams, students seeking state-quota seats in NEET/JEE/Universities, and beneficiaries of local state social security schemes.",
      eligibility: "Resident living in the state for a specified number of years (often 3 to 15 years depending on the state's domicile rules) or born in the state to domicile parents.",
      requiredDocsJson: JSON.stringify([
        "Proof of Continuous Residence (10+ years utility bills / Land deed / School certificates)",
        "Aadhaar Card or Voter Identity Card",
        "Birth Certificate or High School Marksheet showing place of birth",
        "Parents' Domicile Certificate (if applying for minors)",
        "Passport size photograph",
        "Self-declaration / Affidavit of Residence",
      ]),
      stepsJson: JSON.stringify([
        "Step 1: Gather address proofs spanning required years in the state.",
        "Step 2: Submit application on State e-District portal or at your local Cyber Café / CSC counter.",
        "Step 3: Verification is routed through Patwari / Lekhpal and Municipal Councillor / Gram Pradhan.",
        "Step 4: SDM or Tehsildar signs and issues digital certificate with QR code verification.",
      ]),
      officialFees: "₹15 to ₹50 statutory portal fee. Information may vary by state/district. Verify on the official government portal.",
      processingTime: "15 to 21 Working Days.",
      whereToApply: "State e-District portal, Tehsildar Office, or CSC centre.",
      stateSpecificNotesJson: JSON.stringify({
        "Delhi": "Minimum 3 continuous years residence required. Apply on edistrict.delhigovt.nic.in.",
        "Uttar Pradesh": "Issued by SDM / Tehsildar under edistrict.up.gov.in.",
        "Karnataka": "Available on Seva Sindhu portal (sevasindhu.karnataka.gov.in).",
      }),
      officialUrl: "https://services.india.gov.in",
    },
    {
      categoryId: catIdentity.id,
      title: "PAN Card Application & Correction (पैन कार्ड नया/सुधार)",
      slug: "pan-card-services",
      shortDesc: "Permanent Account Number required for all financial transactions, bank accounts, and income tax filing.",
      whatIsIt: "A 10-digit alphanumeric identifier issued by the Income Tax Department of India via authorized entities (Protean / NSDL e-Gov and UTIITSL).",
      whoNeedsIt: "Anyone earning taxable income, opening a bank account, investing in mutual funds, or undertaking major financial transactions.",
      eligibility: "Any Indian citizen, minor (via guardian), NRI, or business entity.",
      requiredDocsJson: JSON.stringify([
        "Proof of Identity (Aadhaar Card, Voter ID, Passport, Driving Licence)",
        "Proof of Address (Aadhaar, Electricity Bill, Bank Passbook, Rent Agreement)",
        "Proof of Date of Birth (Birth Certificate, 10th Certificate, Aadhaar, Passport)",
        "Two recent passport-size color photographs",
      ]),
      stepsJson: JSON.stringify([
        "Step 1: Fill Form 49A (for Indian Citizens) on Protean (NSDL) or UTIITSL official portal.",
        "Step 2: Choose Paperless e-KYC (Aadhaar OTP based) or physical document submission.",
        "Step 3: Pay official government processing fee online.",
        "Step 4: e-PAN is delivered to email in 2-4 days; physical plastic PVC card is dispatched to address.",
      ]),
      officialFees: "₹107 for dispatch in India; ₹1017 for dispatch outside India (Official fee fixed by Income Tax Dept).",
      processingTime: "Instant e-PAN via Aadhaar (minutes); Physical Card 10 to 15 days.",
      whereToApply: "Official Protean (tin-nsdl.com), UTIITSL (pan.utiitsl.com), or authorized TIN-FC / Cyber Café.",
      officialUrl: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    },
    {
      categoryId: catIdentity.id,
      title: "Aadhaar Services & Demographic Update (आधार अद्यतन एवं सेवाएँ)",
      slug: "aadhaar-services",
      shortDesc: "Essential guide for updating name, address, date of birth, mobile number linkage, and downloading e-Aadhaar.",
      whatIsIt: "12-digit unique identity number issued by UIDAI. Valid proof of identity and address across India.",
      whoNeedsIt: "Every resident of India. Necessary for government subsidies (DBT), SIM cards, bank accounts, and examinations.",
      eligibility: "Any resident of India residing in the country for 182 days or more in the preceding 12 months.",
      requiredDocsJson: JSON.stringify([
        "For Address Update: Valid Proof of Address (Electricity bill, Rent deed, Bank statement, Voter ID)",
        "For Name/DOB: Valid birth certificate or matriculation marksheet",
        "For Mobile Linking: No documents required, only biometric verification at Aadhaar Seva Kendra",
      ]),
      stepsJson: JSON.stringify([
        "Step 1: For online address updates, log in to myaadhaar.uidai.gov.in using Aadhaar & OTP.",
        "Step 2: Submit valid address document and pay ₹50 fee.",
        "Step 3: For Biometric/Mobile update, visit an authorized Aadhaar Enrolment Centre or Bank/Post Office branch.",
        "Step 4: Track status using 14-digit Service Request Number (SRN) or URN.",
      ]),
      officialFees: "Address online update: ₹50. Biometric update with photo: ₹100. Demographic at centre: ₹50. New Enrolment is FREE.",
      processingTime: "5 to 15 Working Days (Information may vary by state/district. Verify on the official government portal).",
      whereToApply: "UIDAI Official Portal (myaadhaar.uidai.gov.in) and authorized Aadhaar Seva Kendras.",
      officialUrl: "https://myaadhaar.uidai.gov.in",
    },
    {
      categoryId: catCertificates.id,
      title: "Caste / Category Certificate - SC / ST / OBC (जाति प्रमाण पत्र)",
      slug: "caste-certificate",
      shortDesc: "Proof of belonging to a recognized Scheduled Caste, Scheduled Tribe, or Other Backward Class (Non-Creamy Layer).",
      whatIsIt: "Government certificate establishing the social category of a citizen under constitutional orders for educational reservations and social welfare provisions.",
      whoNeedsIt: "Students and applicants availing reservation quotas, age concessions, and scholarship schemes in schools, colleges, and competitive exams.",
      eligibility: "Citizens belonging to castes enumerated in the Central or State Gazette lists of SC/ST/OBC.",
      requiredDocsJson: JSON.stringify([
        "Father's or Paternal Blood Relative's Caste Certificate / Land Record",
        "Applicant's Aadhaar Card and School Transfer Certificate (TC)",
        "Family Pedigree / Shajra (वंशावली) certified by Gram Pradhan / Councillor",
        "Income Certificate / ITR (for OBC Non-Creamy Layer applicants)",
        "Self-declaration affidavit",
      ]),
      stepsJson: JSON.stringify([
        "Step 1: Check lineage documents proving caste heritage prior to the presidential order year.",
        "Step 2: Apply via State e-District portal or local authorized CSC / Cyber Café.",
        "Step 3: Revenue inspector examines revenue records and interviews local community elders.",
        "Step 4: Certificate is authorized and issued with digital signature and verification bar code.",
      ]),
      officialFees: "₹15 to ₹50 statutory state fee.",
      processingTime: "15 to 30 Working Days.",
      whereToApply: "Tehsildar Office, Sub-Divisional Magistrate (SDM), or State e-District portal.",
      officialUrl: "https://services.india.gov.in",
    },
    {
      categoryId: catCertificates.id,
      title: "EWS Certificate (आर्थिक रूप से कमजोर वर्ग प्रमाण पत्र)",
      slug: "ews-certificate",
      shortDesc: "10% reservation certificate for General category citizens fulfilling specified economic criteria.",
      whatIsIt: "Economically Weaker Section (EWS) income and asset certificate granting 10% reservation in central/state government admissions and recruitments.",
      whoNeedsIt: "General category (non-SC/ST/OBC) candidates whose gross family annual income is below ₹8 Lakhs and who meet asset limits.",
      eligibility: "General category citizens with family annual income < ₹8,00,000, residential flat < 1000 sq ft, or residential plot < 100 sq yards in notified municipalities.",
      requiredDocsJson: JSON.stringify([
        "Aadhaar Card and PAN Card of all earning family members",
        "Income Tax Returns (ITR) or Form 16 / Salary certificate",
        "Land & Property documents / Registry deeds",
        "Ration card or Parivar Register Nakal",
        "Self-Declaration Affidavit of Assets and Income",
      ]),
      stepsJson: JSON.stringify([
        "Step 1: Collate financial and asset records across all family members.",
        "Step 2: Submit application to SDM/Tehsildar counter or e-District state portal.",
        "Step 3: Comprehensive verification of real estate and agricultural land holdings by revenue staff.",
        "Step 4: Issuance of EWS Certificate valid for the designated financial year.",
      ]),
      officialFees: "₹20 to ₹60 statutory state fee.",
      processingTime: "15 to 21 Working Days.",
      whereToApply: "SDM / Revenue Tehsildar Office or State Citizen Services Portal.",
      officialUrl: "https://services.india.gov.in",
    },
    {
      categoryId: catTransport.id,
      title: "Learner's & Permanent Driving Licence (ड्राइविंग लाइसेंस)",
      slug: "driving-licence",
      shortDesc: "Complete process for applying for Learning Licence, permanent DL, and test slot booking via Sarathi Parivahan.",
      whatIsIt: "Legal document issued by the Regional Transport Office (RTO) authorizing a person to operate motor vehicles on public roads.",
      whoNeedsIt: "Anyone 18+ years of age (or 16+ for gearless 50cc two-wheelers with guardian consent).",
      eligibility: "Indian citizen of legal driving age with mental and physical fitness.",
      requiredDocsJson: JSON.stringify([
        "Proof of Age (Birth Certificate, 10th Pass Certificate, Passport)",
        "Proof of Address (Aadhaar, Voter ID, LIC policy, Utility Bill)",
        "Medical Fitness Certificate (Form 1 and Form 1A by registered doctor)",
        "Passport size photographs",
      ]),
      stepsJson: JSON.stringify([
        "Step 1: Visit sarathi.parivahan.gov.in, select state, and choose 'Apply for Learner Licence'.",
        "Step 2: Complete online Aadhaar-authenticated LL test (available from home in many states) or at RTO.",
        "Step 3: Download instant digital Learner Licence valid for 6 months.",
        "Step 4: After 30 days, apply for Permanent Driving Licence and book driving test slot at RTO.",
        "Step 5: Pass practical driving track test; Smart Card DL is dispatched to residential address.",
      ]),
      officialFees: "₹200 for Learner's Licence; ₹300-₹500 for Driving Licence test & smart card (Official Parivahan fee).",
      processingTime: "Learner's: Instant/24 hours; Permanent DL: 10-15 days after practical test.",
      whereToApply: "Ministry of Road Transport Parivahan Portal (sarathi.parivahan.gov.in).",
      officialUrl: "https://sarathi.parivahan.gov.in",
    },
    {
      categoryId: catWelfare.id,
      title: "Ration Card Application & Member Addition (राशन कार्ड सेवाएँ)",
      slug: "ration-card-services",
      shortDesc: "National Food Security Act (NFSA) ration card for subsidized grains, Antyodaya Anna Yojana, and family address proof.",
      whatIsIt: "Official family food security document issued by the State Food & Civil Supplies Department under One Nation One Ration Card (ONORC).",
      whoNeedsIt: "Eligible households qualifying for NFSA priority cards (PHH) or Antyodaya Anna Yojana (AAY) for grain allocation.",
      eligibility: "Households meeting state-specific poverty line and socio-economic census criteria.",
      requiredDocsJson: JSON.stringify([
        "Aadhaar card of all family members",
        "Photograph of the Female Head of the Family",
        "Bank Passbook copy of Female Head",
        "LPG connection number / Gas passbook",
        "Proof of residence and income certificate",
      ]),
      stepsJson: JSON.stringify([
        "Step 1: Apply online on the State Food Department portal or through CSC.",
        "Step 2: Submit family tree, demographic data, and Aadhaar numbers.",
        "Step 3: Supply Inspector conducts spot verification.",
        "Step 4: Digital Ration card is generated and linked with Fair Price Shop (FPS).",
      ]),
      officialFees: "Free or nominal fee (₹10 - ₹20).",
      processingTime: "20 to 30 Working Days.",
      whereToApply: "State Food and Civil Supplies Department portal / District Supply Office (DSO).",
      officialUrl: "https://nfsa.gov.in",
    },
    {
      categoryId: catCivil.id,
      title: "Birth Certificate Registration & Correction (जन्म प्रमाण पत्र)",
      slug: "birth-certificate",
      shortDesc: "Official permanent record of an individual's birth issued by Registrar of Births and Deaths (Civil Registration System - CRS).",
      whatIsIt: "The paramount proof of age, citizenship, and parentage in India issued under the Registration of Births and Deaths Act, 1969.",
      whoNeedsIt: "Crucial for school admissions, obtaining a passport, voter registration, government jobs, and legal rights.",
      eligibility: "Any birth occurring within Indian jurisdiction. Timely registration within 21 days is free of penal fines.",
      requiredDocsJson: JSON.stringify([
        "Hospital Discharge Summary / Institutional Birth Report",
        "Aadhaar cards of both parents",
        "Marriage certificate or declaration of parentage",
        "Informant's address proof",
      ]),
      stepsJson: JSON.stringify([
        "Step 1: For institutional births, hospital directly reports to Municipal Corporation / Gram Panchayat.",
        "Step 2: For home births, report within 21 days to the local Registrar.",
        "Step 3: Access crsorgi.gov.in or local municipal portal to download digital birth certificate with QR verification.",
      ]),
      officialFees: "Free within 21 days. Late fee applies between 21 to 30 days; SDM order required after 1 year.",
      processingTime: "3 to 7 Working Days for institutional registration.",
      whereToApply: "Civil Registration System (crsorgi.gov.in), Municipal Corporation, or Gram Panchayat office.",
      officialUrl: "https://crsorgi.gov.in",
    },
    {
      categoryId: catWelfare.id,
      title: "PM-Kisan Samman Nidhi Yojana (पीएम-किसान सम्मान निधि)",
      slug: "pm-kisan-yojana",
      shortDesc: "Income support scheme of ₹6,000 per year in three equal installments directly transferred to farmer families' bank accounts.",
      whatIsIt: "Central sector scheme by Ministry of Agriculture providing direct benefit transfer (DBT) to small and marginal landholding farmers.",
      whoNeedsIt: "Landholder farmer families possessing cultivable landholding in revenue records.",
      eligibility: "Farmer families with land in their name. Institutional landholders and high-income/ITR payers are excluded.",
      requiredDocsJson: JSON.stringify([
        "Aadhaar Card linked with active mobile number",
        "Land Ownership Records (Khatauni / Khasra / Jamabandi)",
        "Bank Account details (DBT / NPCI enabled)",
        "Mobile Number for OTP verification",
      ]),
      stepsJson: JSON.stringify([
        "Step 1: Go to pmkisan.gov.in and click 'New Farmer Registration'.",
        "Step 2: Enter Aadhaar, State, and District, and verify OTP.",
        "Step 3: Enter land record details (Khata / Khasra / Khatauni) and upload land ownership proof.",
        "Step 4: Block / District Agriculture Officer approves record after revenue verification.",
        "Step 5: Complete mandatory e-KYC (facial or biometric/OTP) to maintain active payments.",
      ]),
      officialFees: "Application on pmkisan.gov.in is completely FREE. Cyber Cafes charge nominal typing/assistance fee.",
      processingTime: "15 to 45 Days for revenue verification.",
      whereToApply: "Official PM-Kisan Portal (pmkisan.gov.in) or local CSC / Cyber Café.",
      officialUrl: "https://pmkisan.gov.in",
    },
  ];

  for (const svc of servicesData) {
    await prisma.service.create({
      data: svc,
    });
  }

  // 8. Sample User Document
  const userDoc = await prisma.userDocument.create({
    data: {
      userId: citizen.id,
      templateId: templateIncome.id,
      title: "My Income Certificate Application 2024-25",
      formDataJson: templateIncome.sampleDataJson || "{}",
      status: "COMPLETED",
    },
  });

  // 9. Sample Service Request
  const svcReq = await prisma.serviceRequest.create({
    data: {
      userId: citizen.id,
      cyberCafeId: cafe1.id,
      userDocumentId: userDoc.id,
      title: "Income Certificate Application Review & State Portal Upload",
      description: "Hello Amit ji, I have typed my income certificate draft on SevaDesk. Please check the income heads and help me upload it to UP e-District portal.",
      status: "IN_PROGRESS",
      quoteAmount: 50.0,
      isPaid: true,
      statusHistory: {
        create: [
          {
            status: "PENDING",
            note: "Request created by citizen Rajesh Sharma",
            changedByUserId: citizen.id,
          },
          {
            status: "ACCEPTED",
            note: "Operator Amit Verma accepted the request",
            changedByUserId: cafeUser1.id,
          },
          {
            status: "IN_PROGRESS",
            note: "Documents under review for e-District submission",
            changedByUserId: cafeUser1.id,
          },
        ],
      },
      conversation: {
        create: {
          user1Id: citizen.id,
          user2Id: cafeUser1.id,
          messages: {
            create: [
              {
                senderId: citizen.id,
                content: "Namaste Amit ji, I need your help in filing this application on UP eDistrict.",
                isRead: true,
              },
              {
                senderId: cafeUser1.id,
                content: "Namaste Rajesh ji! I reviewed your draft. Your details look very clean. Please also bring your self-declaration copy or send it here.",
                isRead: true,
              },
              {
                senderId: citizen.id,
                content: "Sure, I have attached the signed draft PDF generated from SevaDesk.",
                isRead: false,
              },
            ],
          },
        },
      },
      review: {
        create: {
          userId: citizen.id,
          cyberCafeId: cafe1.id,
          rating: 5,
          comment: "Verma Digital Seva Kendra was very helpful and knowledgeable about UP e-District process. Highly recommended!",
          isModerated: true,
        },
      },
    },
  });

  // 10. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "DATABASE_INITIALIZATION",
      entity: "SYSTEM",
      details: "Initial standard seeding completed with government services, categories, and test roles.",
    },
  });

  console.log("Database seeded successfully!");
  console.log("-----------------------------------------");
  console.log("Test Accounts:");
  console.log("Citizen:     user@sevadesk.in / User@123456");
  console.log("Cyber Café:  operator@delhicyber.in / Cafe@123456");
  console.log("Admin:       admin@sevadesk.in / Admin@123456");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
