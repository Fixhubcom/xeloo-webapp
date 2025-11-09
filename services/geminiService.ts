import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { OnboardingSuggestions, Transaction, JournalEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getOnboardingSuggestions = async (businessDescription: string): Promise<OnboardingSuggestions> => {
  console.log("Calling Gemini API with description:", businessDescription);

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

export const getTransactionsSummary = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) {
    return "There are no transactions to analyze in the current view.";
  }
  
  console.log("Calling Gemini API for transaction summary:", transactions);
  const prompt = `
    Based on the following JSON data of transactions, provide a brief, insightful summary for the user in 3-4 sentences.
    Mention the total number of transactions, total amount sent (in USD), the most frequent recipient country, and any notable large transactions.
    Keep the tone friendly and professional.
    
    Transactions:
    ${JSON.stringify(transactions, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for transaction summary:", error);
    return "There was an error analyzing your transactions. Please try again later.";
  }
};

export const categorizeTransaction = async (recipient: string, amount: number): Promise<{ category: string }> => {
  const prompt = `Based on the recipient name "${recipient}" and amount "${amount}", categorize this transaction into one of the following business expense categories: "Software & Subscriptions", "Utilities", "Travel", "Payroll", "Supplies", "Marketing", "Rent", "Other".`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "The most likely transaction category."
            }
          },
          required: ["category"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error calling Gemini API for categorization:", error);
    return { category: 'Other' }; // Fallback
  }
};

export const getSupportResponseSuggestion = async (prompt: string): Promise<string> => {
    if (!prompt) {
        return "Please provide the user's message to generate a suggestion.";
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The user's support message is: "${prompt}". Generate a concise, empathetic, and professional reply.`,
            config: {
              systemInstruction: "You are a helpful customer support agent for Xeloo, a fintech platform. Your responses should be clear and aimed at resolving the user's issue effectively.",
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for support suggestion:", error);
        return "Sorry, I couldn't generate a suggestion at this time. Please try again.";
    }
};

export const processAccountingEntry = async (prompt: string, image?: { mimeType: string, data: string }): Promise<Omit<JournalEntry, 'id'>[]> => {
    const systemInstruction = `You are an expert accountant AI. Your task is to analyze user input (text or an image of a receipt/invoice) and convert it into a standard double-entry bookkeeping journal entry.
    - Always generate two entries: one debit and one credit.
    - The debit and credit amounts must be equal.
    - Today's date is ${new Date().toISOString().split('T')[0]}. If no date is provided, use today's date.
    - Infer the correct accounts. For example, cash payments affect '1010 - Cash and Bank'. Software costs affect '5010 - Software Subscriptions'. Sales affect '4010 - Service Revenue'. Payments to suppliers affect '2010 - Accounts Payable'.
    - The description should be a concise summary of the transaction.
    - ALWAYS return a JSON array with two journal entry objects.`;
    
    const contents: any = {
      parts: [{ text: prompt }]
    };

    if (image) {
      contents.parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      });
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            date: { type: Type.STRING, description: "Transaction date in YYYY-MM-DD format." },
                            description: { type: Type.STRING, description: "A brief description of the transaction." },
                            account: { type: Type.STRING, description: "The account name and code, e.g., '1010 - Cash and Bank'." },
                            debit: { type: Type.NUMBER, description: "The debit amount. Should be 0 if it's a credit entry." },
                            credit: { type: Type.NUMBER, description: "The credit amount. Should be 0 if it's a debit entry." },
                        },
                        required: ["date", "description", "account", "debit", "credit"],
                    },
                },
            },
        });
        
        let jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        
        if (Array.isArray(result) && result.length === 2 && result[0].debit === result[1].credit) {
            return result;
        } else {
             throw new Error("Invalid journal entry format returned by AI.");
        }
    } catch (error) {
        console.error("Error calling Gemini API for accounting entry:", error);
        // Fallback mock response on error
        return [
            { date: new Date().toISOString().split('T')[0], description: "Mock - Software purchase", account: "5010 - Software Subscriptions", debit: 50.00, credit: 0 },
            { date: new Date().toISOString().split('T')[0], description: "Mock - Software purchase", account: "1010 - Cash and Bank", debit: 0, credit: 50.00 }
        ];
    }
};
