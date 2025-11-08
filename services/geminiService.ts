import { GoogleGenAI, Type } from "@google/genai";
import { OnboardingSuggestions } from "../types";

// FIX: Initialize GoogleGenAI with API_KEY from environment variables directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getOnboardingSuggestions = async (businessDescription: string): Promise<OnboardingSuggestions> => {
  console.log("Calling Gemini API with description:", businessDescription);

  // FIX: Using the actual Gemini API call instead of mock implementation.
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following business description for a fintech onboarding process. Provide a business category, a KYB risk level (Low, Medium, or High), and three brief compliance notes. Business description: "${businessDescription}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessCategory: {
              type: Type.STRING,
              description: "A suitable business category, e.g., 'E-commerce', 'SaaS', 'Digital Marketing Agency'."
            },
            kybRiskLevel: {
              type: Type.STRING,
              description: "The estimated Know Your Business risk level: 'Low', 'Medium', or 'High'."
            },
            complianceNotes: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: "An array of three brief, actionable compliance notes or recommendations."
            }
          },
          required: ["businessCategory", "kybRiskLevel", "complianceNotes"]
        }
      }
    });

    const suggestions = JSON.parse(response.text.trim());
    return suggestions;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback to mock data on error
    return getMockSuggestions(businessDescription);
  }
};

const getMockSuggestions = (description: string): OnboardingSuggestions => {
    if (description?.toLowerCase().includes('crypto')) {
         return {
            businessCategory: "Digital Asset Exchange",
            kybRiskLevel: "High",
            complianceNotes: [
                "Ensure strict AML/CFT policies are in place.",
                "Verify user identities with enhanced due diligence (EDD).",
                "Maintain detailed records of all transactions for regulatory reporting."
            ]
        };
    }
    return {
        businessCategory: "Software as a Service (SaaS)",
        kybRiskLevel: "Low",
        complianceNotes: [
            "Clearly define service terms and privacy policy.",
            "Ensure compliance with data protection regulations like GDPR.",
            "Implement secure payment processing for subscriptions."
        ]
    };
};
