import prisma from "@/lib/prisma";

export interface AssistantMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AssistantResponse {
  message: string;
  suggestedServiceSlug?: string;
  suggestedAction?: {
    label: string;
    url: string;
  };
  sources?: string[];
}

export interface IAIProvider {
  askAssistant(
    query: string,
    history: AssistantMessage[],
    currentContext?: { serviceSlug?: string; templateId?: string }
  ): Promise<AssistantResponse>;
}

export class MockCitizenAssistantProvider implements IAIProvider {
  async askAssistant(
    query: string,
    history: AssistantMessage[],
    currentContext?: { serviceSlug?: string; templateId?: string }
  ): Promise<AssistantResponse> {
    const cleanQuery = query.toLowerCase().trim();

    // 1. Fetch all published services from local DB as ground truth with resilient fallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let services: any[] = [];
    try {
      services = await prisma.service.findMany({
        where: { isPublished: true },
        select: {
          title: true,
          slug: true,
          shortDesc: true,
          whatIsIt: true,
          eligibility: true,
          requiredDocsJson: true,
          stepsJson: true,
          officialFees: true,
          processingTime: true,
          whereToApply: true,
          officialUrl: true,
        },
      });
    } catch {
      services = [
        {
          title: "Income Certificate (आय प्रमाण पत्र)",
          slug: "income-certificate",
          shortDesc: "Official proof of annual household income for scholarship, EWS reservation, and subsidy schemes.",
          whatIsIt: "State revenue document certifying family income.",
          eligibility: "Resident citizen of the concerned state.",
          requiredDocsJson: JSON.stringify(["Salary Slip or Patwari Report", "Aadhaar Card of Applicant", "Self-Declaration Affidavit", "Ration Card or Electricity Bill"]),
          officialFees: "₹15 - ₹30 depending on State e-District portal",
          processingTime: "7 - 15 business days",
          whereToApply: "State e-District Portal / Tahsil Office",
          officialUrl: "https://edistrict.up.gov.in",
        },
        {
          title: "Caste Certificate (जाति प्रमाण पत्र)",
          slug: "caste-certificate",
          shortDesc: "Statutory proof of SC/ST/OBC category membership for affirmative action and reservation benefits.",
          whatIsIt: "Official certificate confirming social category.",
          eligibility: "Citizens belonging to notified SC/ST/OBC communities.",
          requiredDocsJson: JSON.stringify(["Aadhaar Card", "Father's or Blood Relative's Caste Certificate", "School Leaving Certificate / Marksheet", "Land Record / Khatiyan or Pradhan Verification"]),
          officialFees: "₹15 - ₹30",
          processingTime: "15 - 21 business days",
          whereToApply: "State e-District Portal / SDO Office",
          officialUrl: "https://serviceonline.gov.in",
        },
        {
          title: "Domicile / Residence Certificate (निवास प्रमाण पत्र)",
          slug: "domicile-certificate",
          shortDesc: "Legal evidence proving continuous permanent residence in a specific state for employment and education.",
          whatIsIt: "State document certifying resident status.",
          eligibility: "Permanent resident with 3-10+ years domicile history.",
          requiredDocsJson: JSON.stringify(["Aadhaar Card", "Electricity Bill or Land Registry", "Education Proof (10th/12th Marksheet)", "Voter ID of Parent/Applicant"]),
          officialFees: "₹15 - ₹30",
          processingTime: "7 - 14 business days",
          whereToApply: "e-District Portal / Tehsildar Office",
          officialUrl: "https://edistrict.up.gov.in",
        },
        {
          title: "PAN Card (Permanent Account Number)",
          slug: "pan-card-application",
          shortDesc: "10-digit alphanumeric tax identifier issued by Income Tax Department (UTIITSL/Protean NSDL).",
          whatIsIt: "Mandatory tax and financial identification card.",
          eligibility: "Any individual, minor, NRI, or business entity.",
          requiredDocsJson: JSON.stringify(["Aadhaar Card (Serves as Identity, Address & DOB proof)", "2 Passport Size Color Photos", "Existing PAN copy (for corrections)"]),
          officialFees: "₹107 (Physical card within India)",
          processingTime: "7 - 10 business days (e-PAN in 48 hours)",
          whereToApply: "Protean (NSDL) / UTIITSL Portal",
          officialUrl: "https://www.onlineservices.nsdl.com",
        },
      ];
    }

    // 2. If user is currently on a specific service page or template
    if (currentContext?.serviceSlug) {
      const activeService = services.find((s) => s.slug === currentContext.serviceSlug);
      if (activeService) {
        if (cleanQuery.includes("fee") || cleanQuery.includes("cost") || cleanQuery.includes("charge") || cleanQuery.includes("paisa")) {
          return {
            message: `Official Government Fee for **${activeService.title}** is **${activeService.officialFees}**.\n\n*Note: Cyber Cafés may charge nominal typing, biometric scanning, or printout charges (typically ₹50 - ₹150) as per their posted rate cards.*`,
            suggestedServiceSlug: activeService.slug,
            sources: ["Official State Portal / Gazette Notification"],
          };
        }
        if (cleanQuery.includes("document") || cleanQuery.includes("kagaz") || cleanQuery.includes("proof") || cleanQuery.includes("require")) {
          let docs: string[] = [];
          try {
            docs = JSON.parse(activeService.requiredDocsJson);
          } catch {
            docs = [];
          }
          const docList = docs.map((d) => `• ${d}`).join("\n");
          return {
            message: `Here are the mandatory documents required for **${activeService.title}**:\n\n${docList}\n\n*Make sure all documents are self-attested with valid dates.*`,
            suggestedServiceSlug: activeService.slug,
            sources: [activeService.whereToApply],
          };
        }
        if (cleanQuery.includes("time") || cleanQuery.includes("din") || cleanQuery.includes("status") || cleanQuery.includes("how long")) {
          return {
            message: `The standard statutory processing turnaround for **${activeService.title}** is approximately **${activeService.processingTime}** under the Citizen Right to Public Services Act (RTS).`,
            suggestedServiceSlug: activeService.slug,
          };
        }
      }
    }

    // 3. Search matching services based on citizen inquiry
    const matchedService = services.find((s) => {
      const t = s.title.toLowerCase();
      const d = s.shortDesc.toLowerCase();
      return (
        cleanQuery.includes(t) ||
        (cleanQuery.includes("income") && t.includes("income")) ||
        (cleanQuery.includes("caste") && t.includes("caste")) ||
        (cleanQuery.includes("domicile") && (t.includes("domicile") || t.includes("residence") || t.includes("niwas"))) ||
        (cleanQuery.includes("pan") && t.includes("pan")) ||
        (cleanQuery.includes("aadhaar") && t.includes("aadhaar")) ||
        (cleanQuery.includes("license") && t.includes("driving")) ||
        (cleanQuery.includes("licence") && t.includes("driving")) ||
        (cleanQuery.includes("ration") && t.includes("ration")) ||
        (cleanQuery.includes("birth") && t.includes("birth")) ||
        (cleanQuery.includes("death") && t.includes("death")) ||
        (cleanQuery.includes("ews") && t.includes("ews")) ||
        (cleanQuery.includes("pension") && t.includes("pension")) ||
        (cleanQuery.includes("kisan") && t.includes("kisan")) ||
        (cleanQuery.includes("passport") && t.includes("passport"))
      );
    });

    if (matchedService) {
      let docs: string[] = [];
      try {
        docs = JSON.parse(matchedService.requiredDocsJson);
      } catch {
        docs = [];
      }

      const sampleDocs = docs.slice(0, 4).map((d) => `• ${d}`).join("\n");

      return {
        message: `### ${matchedService.title}\n\n${matchedService.shortDesc}\n\n**Official Government Fee:** ${matchedService.officialFees}\n**Statutory Turnaround:** ${matchedService.processingTime}\n**Where to Apply:** ${matchedService.whereToApply}\n\n**Primary Documents Needed:**\n${sampleDocs}\n\nWould you like to type the application letter or find a verified nearby Cyber Café to submit it?`,
        suggestedServiceSlug: matchedService.slug,
        suggestedAction: {
          label: `View ${matchedService.title} Guide`,
          url: `/services/${matchedService.slug}`,
        },
        sources: [matchedService.whereToApply, matchedService.officialUrl],
      };
    }

    // 4. General guidance for Cyber Cafe or Document typing
    if (cleanQuery.includes("cyber cafe") || cleanQuery.includes("csc") || cleanQuery.includes("operator") || cleanQuery.includes("near me")) {
      return {
        message: `You can find verified Cyber Cafés and Common Service Centre (CSC) operators in our directory. Operators can assist you with biometric verification, online portal submissions, and fee payments.\n\nVisit the **Cyber Café Directory** to filter by state, district, or PIN code.`,
        suggestedAction: {
          label: "Search Cyber Cafés",
          url: "/cyber-cafes",
        },
      };
    }

    if (cleanQuery.includes("type") || cleanQuery.includes("format") || cleanQuery.includes("affidavit") || cleanQuery.includes("application")) {
      return {
        message: `SevaDesk provides standardized bilingual (English/Hindi) document templates for application letters, self-declarations, and grievance notices. You can fill the fields on your phone/laptop and generate an authentic A4 PDF ready for print and signature.`,
        suggestedAction: {
          label: "Type a Document Now",
          url: "/type-document",
        },
      };
    }

    // Default friendly official public service response
    return {
      message: `Namaste! I am your **SevaDesk Sahayak** (Citizen Facilitation Guide).\n\nI can help you with:\n1. **Which documents** are needed for Income, Domicile, Caste, Ration Card, or Driving Licence.\n2. **Official government fees** and estimated processing times.\n3. **Application templates** you can type and print.\n4. Finding a **verified Cyber Café** nearby for biometric or online submission.\n\nPlease ask me questions like *"What documents are needed for Income Certificate?"* or *"What is the fee for PAN card?"*`,
      suggestedAction: {
        label: "Browse All Government Services",
        url: "/services",
      },
    };
  }
}

export class GeminiCitizenAssistantProvider implements IAIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async askAssistant(
    query: string,
    history: AssistantMessage[],
    currentContext?: { serviceSlug?: string; templateId?: string }
  ): Promise<AssistantResponse> {
    try {
      // Get all services as truth context
      const services = await prisma.service.findMany({
        where: { isPublished: true },
        select: {
          title: true,
          slug: true,
          shortDesc: true,
          eligibility: true,
          requiredDocsJson: true,
          officialFees: true,
          processingTime: true,
          whereToApply: true,
          officialUrl: true,
        },
      });

      const groundTruthContext = JSON.stringify(
        services.map((s) => ({
          title: s.title,
          slug: s.slug,
          fees: s.officialFees,
          turnaround: s.processingTime,
          authority: s.whereToApply,
          url: s.officialUrl,
        }))
      );

      const systemPrompt = `You are "SevaDesk Sahayak", an official, polite, and trustworthy Indian Citizen Service Assistant.
CRITICAL RULES:
1. NEVER invent, guess, or hallucinate government fees, rules, or URLs. Only state facts verified in Indian state gazettes or the provided database: ${groundTruthContext}.
2. Always distinguish clearly between Official Government Fee and Cyber Café facilitation charges.
3. Be respectful, concise, and helpful. Use bilingual terminology (e.g. Income Certificate / आय प्रमाण पत्र).
4. Direct users to SevaDesk services (/services/[slug]), document typing (/type-document), or finding a Cyber Café (/cyber-cafes).`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 600,
            },
          }),
        }
      );

      if (!response.ok) {
        // Fallback to Mock provider
        const fallback = new MockCitizenAssistantProvider();
        return fallback.askAssistant(query, history, currentContext);
      }

      const data = await response.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!replyText) {
        const fallback = new MockCitizenAssistantProvider();
        return fallback.askAssistant(query, history, currentContext);
      }

      return {
        message: replyText,
        sources: ["Verified National Public Portal & SevaDesk Gazette Database"],
      };
    } catch {
      const fallback = new MockCitizenAssistantProvider();
      return fallback.askAssistant(query, history, currentContext);
    }
  }
}

// Factory function
export function getAssistantProvider(): IAIProvider {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim().length > 10) {
    return new GeminiCitizenAssistantProvider(geminiKey);
  }
  return new MockCitizenAssistantProvider();
}
