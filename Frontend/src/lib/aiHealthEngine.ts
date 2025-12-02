// src/lib/aiHealthEngine.ts
/**
 * AI Health Engine for Dr. AI
 *
 * This module implements the comprehensive health information, triage, and care navigation system.
 * It can be replaced with a real AI API (OpenAI, Gemini, Claude, etc.)
 *
 * To swap in a real model:
 *  - Replace the internals of generateHealthResponse to call your API
 *  - Use SYSTEM_PROMPT as system message
 *  - Pass conversation history and patient profile as context
 */

export const SYSTEM_PROMPT = `You are "Dr. AI," a health information, triage, and care-navigation assistant for the general public.

MISSION
- Provide clear, compassionate, evidence-informed guidance that helps people understand symptoms, make safer decisions about when to seek care, learn about medications (education only), and interpret lab REPORTS (not raw medical images).
- Reduce unnecessary worry and unnecessary visits while also flagging red-flags early.
- Never present yourself as a medical professional. You are an educational assistant, not a doctor.

SCOPE — WHAT YOU DO
1) Symptom triage & self-care:
   - Ask targeted follow-ups to understand the situation (see "Intake").
   - Estimate urgency (Emergency / Urgent in 24–48h / Routine / Self-care OK).
   - Provide self-care steps and OTC options (where appropriate), plus clear "go-now" warnings.

2) Medication education:
   - Explain what a medicine is used for, how it generally works, common side effects, common interactions, who should avoid it, and safety warnings.
   - OTC: You may provide label-concordant dosing guidance based on age/weight (never invent dosages; if unknown, say so and advise reading the label).
   - Prescription meds: EDUCATION ONLY. Do not prescribe or adjust dosing. If the user was prescribed a drug, you may explain typical use and safety considerations and advise to follow their clinician's instructions. Never provide individualized Rx dosing or taper schedules.

3) Test report explainer:
   - LABS: Parse user-provided lab report text/numbers (name, value, units, reference range) and explain what each test generally measures, whether the value is flagged high/low by the lab, and common, non-diagnostic reasons this happens. Suggest questions to ask a clinician and when follow-up is sensible. Do not diagnose.
   - IMAGING: Do NOT interpret raw images (X-ray, CT, MRI, ultrasound). You may summarize and clarify a radiology REPORT's text. If the user uploads an image, politely decline interpretation and ask for the radiology report instead.

4) Care navigation:
   - When urgency is high, direct the user to local emergency services (or nearest ED/urgent care).
   - For routine issues, suggest appropriate care settings (e.g., primary care, dental, eye care, mental health, pharmacist consult).

5) Education & prevention:
   - Offer evidence-informed lifestyle guidance, vaccine/general preventive care info (country-aware), and "what to watch for" checklists.

OUT OF SCOPE — WHAT YOU DON'T DO
- No diagnosis, no prescriptions, no individualized dosing for prescription medications, no medical imaging interpretation, no treatment plans for emergencies, no claims to be a clinician.
- Do not provide instructions that are likely unsafe without in-person evaluation (e.g., starting/adjusting Rx, using leftover antibiotics, off-label use).

INTAKE (ALWAYS ASK THE ESSENTIALS IF NOT PROVIDED)
- Age; sex at birth; pregnancy/breastfeeding status.
- Country/region (to align OTC availability and guidance).
- Major conditions; allergies (esp. drug allergies).
- Current medications/supplements (name + dose if known).
- For symptoms: onset, triggers, severity, location, pattern, associated symptoms, what they've tried, vitals if available.
- For lab reports: exact test names, values, units, reference ranges, date, and whether fasting.

TRIAGE & RED FLAGS (ALWAYS CHECK)
- Immediate emergency guidance if any of the following are present: severe chest pain; signs of stroke (face droop, arm weakness, speech difficulty); severe trouble breathing; blue/gray lips/skin; severe allergic reaction; severe head injury; uncontrolled bleeding; suicidal thoughts or intent; severe dehydration or confusion; pregnancy emergencies; high fever with stiff neck; new weakness/numbness.
- Output a clear urgency level: "emergency_now", "urgent_24_48h", "routine", or "self_care_ok", and explain why.

STYLE
- Empathetic, plain language (aim ~8th-grade reading level). Avoid alarmism. Be concise but complete. Use short paragraphs and small lists. Avoid medical jargon or explain it.
- If uncertain, say so and propose next-best steps.

OUTPUT FORMAT
Always respond with both human-readable text AND a JSON object with structured data.

IMPORTANT: Include disclaimer in first reply: "I'm not a medical professional; this is educational information, not a diagnosis. If you need urgent help, seek emergency care."`;

/* ---------- Types ---------- */
export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  structuredData?: any;
}

export interface PatientProfile {
  age: number | null;
  sex_at_birth: string | null;
  pregnancy: string | null;
  country: string | null;
  allergies: string[];
  conditions: string[];
  meds: string[];
}

export interface HealthResponse {
  text: string;
  structuredData: {
    urgency?: string;
    red_flags?: string[];
    patient_profile?: Partial<PatientProfile>;
    chief_complaint?: string;
    next_steps?: string[];
    otc_suggestions?: any[];
    rx_education?: any[];
    labs_summary?: any[];
    care_navigation?: {
      setting: string;
      rationale: string;
    };
  };
}

/* ---------- Public API ---------- */
/**
 * generateHealthResponse is async so you can easily replace internals with an API call.
 * For now it runs the local logic and returns a Promise that resolves to HealthResponse.
 */
export async function generateHealthResponse(
  userInput: string,
  conversationHistory: Message[],
  patientProfile: PatientProfile
): Promise<HealthResponse> {
  // For offline behaviour, call the synchronous logic below and wrap in Promise.resolve
  const resp = _generateHealthResponseSync(userInput, conversationHistory, patientProfile);
  return Promise.resolve(resp);
}

/* ---------- Implementation (kept mostly as provided) ---------- */
/* The large body of helper functions and generators is included below.
   I preserved your original logic and responses.
*/

function extractPatientInfo(input: string, currentProfile: PatientProfile): Partial<PatientProfile> {
  const updates: Partial<PatientProfile> = {};
  const lowerInput = input.toLowerCase();

  // Extract age
  const ageMatch = input.match(/(\d+)\s*(years?|y\.?o\.?|yr)/i);
  if (ageMatch) {
    updates.age = parseInt(ageMatch[1]);
  }

  // Extract sex
  if (lowerInput.includes("male") && !lowerInput.includes("female")) {
    updates.sex_at_birth = "male";
  } else if (lowerInput.includes("female")) {
    updates.sex_at_birth = "female";
  }

  // Extract pregnancy status
  if (lowerInput.includes("pregnant") || lowerInput.includes("pregnancy")) {
    updates.pregnancy = "yes";
  } else if (lowerInput.includes("not pregnant") || lowerInput.includes("breastfeeding")) {
    updates.pregnancy = lowerInput.includes("breastfeeding") ? "breastfeeding" : "no";
  }

  // Extract country
  const countries = ["usa", "us", "united states", "uk", "canada", "australia", "india"];
  for (const country of countries) {
    if (lowerInput.includes(country)) {
      updates.country = country;
      break;
    }
  }

  // Extract allergies
  if (lowerInput.includes("allergic to") || lowerInput.includes("allergy to")) {
    const allergyMatch = input.match(/allergic to ([^,.\n]+)/i);
    if (allergyMatch) {
      updates.allergies = [...(currentProfile.allergies || []), allergyMatch[1].trim()];
    }
  }

  return updates;
}

function containsEmergencyKeywords(input: string): boolean {
  const emergencyKeywords = [
    "chest pain", "can't breathe", "cannot breathe", "difficulty breathing",
    "stroke", "face droop", "slurred speech", "severe headache",
    "suicidal", "kill myself", "blue lips", "unconscious",
    "severe bleeding", "uncontrolled bleeding", "seizure", "overdose"
  ];
  return emergencyKeywords.some(keyword => input.includes(keyword));
}

function containsSymptomKeywords(input: string): boolean {
  const symptomKeywords = [
    "symptom", "fever", "pain", "ache", "hurt", "cough", "cold",
    "headache", "nausea", "vomit", "diarrhea", "rash", "dizzy",
    "sore throat", "runny nose", "fatigue", "tired"
  ];
  return symptomKeywords.some(keyword => input.includes(keyword));
}

function containsMedicationKeywords(input: string): boolean {
  const medKeywords = [
    "medication", "medicine", "drug", "pill", "ibuprofen", "tylenol",
    "acetaminophen", "aspirin", "antibiotic", "prescription", "dosage",
    "side effect", "take", "advil", "motrin", "aleve"
  ];
  return medKeywords.some(keyword => input.includes(keyword));
}

function containsLabKeywords(input: string): boolean {
  const labKeywords = [
    "lab", "test result", "blood work", "cbc", "cholesterol",
    "glucose", "thyroid", "tsh", "hemoglobin", "white blood",
    "platelet", "creatinine", "liver enzyme"
  ];
  return labKeywords.some(keyword => input.includes(keyword));
}

function containsPreventionKeywords(input: string): boolean {
  const preventionKeywords = [
    "prevent", "prevention", "vaccine", "vaccination", "screening",
    "healthy", "wellness", "exercise", "diet", "nutrition"
  ];
  return preventionKeywords.some(keyword => input.includes(keyword));
}

function generateEmergencyResponse(input: string, profile: Partial<PatientProfile>): HealthResponse {
  return {
    text: `🚨 **EMERGENCY - CALL 911 IMMEDIATELY** 🚨

Based on what you've described, this could be a medical emergency that requires immediate professional care.

**DO NOT WAIT - CALL 911 OR GO TO THE NEAREST EMERGENCY ROOM NOW**

While waiting for help:
• Stay calm and sit or lie down
• Do not drive yourself
• If you're having chest pain and not allergic to aspirin, chew one adult aspirin (325mg)
• Unlock your door if you're alone
• Have someone stay with you if possible

**Call 911 immediately. Emergency services can provide life-saving care during transport.**

---
*Reminder: I'm not a medical professional. This is a medical emergency requiring immediate professional care.*`,
    structuredData: {
      urgency: "emergency_now",
      red_flags: ["Potential life-threatening emergency"],
      patient_profile: profile,
      care_navigation: {
        setting: "emergency_department",
        rationale: "Symptoms suggest potential emergency requiring immediate evaluation"
      },
      next_steps: [
        "Call 911 or local emergency services immediately",
        "Do not drive yourself to hospital",
        "Stay on phone with dispatcher",
        "Have someone with you if possible"
      ]
    }
  };
}

function generateSymptomResponse(input: string, profile: Partial<PatientProfile>, fullProfile: PatientProfile): HealthResponse {
  const lowerInput = input.toLowerCase();
  const needsMoreInfo = !fullProfile.age || !fullProfile.sex_at_birth;

  if (needsMoreInfo) {
    return {
      text: `Thank you for sharing your symptoms. To provide the most accurate guidance, I need a bit more information:

**Essential Information:**
${!fullProfile.age ? "• What is your age?" : ""}
${!fullProfile.sex_at_birth ? "• Sex at birth (male/female)?" : ""}
${!fullProfile.pregnancy && fullProfile.sex_at_birth === "female" ? "• Are you pregnant or breastfeeding?" : ""}
${!fullProfile.country ? "• What country are you in?" : ""}
${!fullProfile.allergies?.length ? "• Do you have any medication allergies?" : ""}
${!fullProfile.conditions?.length ? "• Do you have any ongoing medical conditions?" : ""}
${!fullProfile.meds?.length ? "• Are you currently taking any medications?" : ""}

**About Your Symptoms:**
• When did the symptoms start?
• How severe are they (1-10 scale)?
• What makes them better or worse?
• Have you tried anything to treat them?
• Do you have any other symptoms (fever, nausea, etc.)?

This information helps me give you safer, more personalized guidance.

---
*Reminder: I'm not a medical professional; this is educational information, not a diagnosis. If you need urgent help, seek emergency care.*`,
      structuredData: {
        urgency: "pending_information",
        patient_profile: profile,
        next_steps: [
          "Provide age and basic demographic information",
          "Describe symptom timeline and severity",
          "List any current medications or conditions"
        ]
      }
    };
  }

  // Fever response
  if (lowerInput.includes("fever") || lowerInput.includes("temperature")) {
    const isChild = fullProfile.age && fullProfile.age < 18;
    const isInfant = fullProfile.age && fullProfile.age < 1;

    return {
      text: `**Understanding Your Fever**

**What is Fever?**
Fever is your body's natural response to infection or illness. It's usually not dangerous by itself.

**Temperature Ranges:**
• Normal: 97°F-99°F (36.1°C-37.2°C)
• Low-grade fever: 100.4°F-102°F (38°C-38.9°C)
• High fever: Above 102°F (39°C)

**Urgency Assessment:**
${isInfant ? "🚨 **URGENT - See a doctor within hours**\n• Fever in infants under 3 months requires immediate medical evaluation\n• Call your pediatrician or go to urgent care/ED now" : ""}
${!isInfant && fullProfile.age && fullProfile.age < 3 ? "⚠️ **Urgent if:**\n• Fever above 102°F (39°C) in child under 3 years\n• Fever lasting more than 24 hours in child under 2\n• Child appears very ill, lethargic, or not responding normally" : ""}
${!isChild ? "⚠️ **Seek medical care within 24-48 hours if:**\n• Fever above 103°F (39.4°C)\n• Fever lasting more than 3 days\n• Fever with severe headache, stiff neck, or confusion\n• Fever with rash, severe sore throat, or ear pain\n• Fever with urinary symptoms" : ""}

**Self-Care for Mild Fever:**
${!isInfant ? `
✓ **Rest and Hydration:**
  • Drink plenty of fluids (water, clear broths, electrolyte drinks)
  • Rest - your body needs energy to fight infection

✓ **Fever Reducers (if needed):**
  ${isChild ? `• Acetaminophen (Tylenol): Follow pediatric dosing on label based on weight
  • Ibuprofen (Advil/Motrin): For children 6+ months, follow label dosing
  • NEVER give aspirin to children (risk of Reye's syndrome)` : `• Acetaminophen (Tylenol): 325-650mg every 4-6 hours (max 3000mg/day)
  • Ibuprofen (Advil): 200-400mg every 4-6 hours with food (max 1200mg/day OTC)
  • Do NOT combine multiple fever reducers without medical guidance`}

✓ **Comfort Measures:**
  • Dress in light, breathable clothing
  • Keep room comfortably cool
  • Lukewarm sponge bath if very uncomfortable (NOT cold water)
` : ""}

**Red Flags - Seek Emergency Care If:**
🚨 Fever with severe headache and stiff neck
🚨 Difficulty breathing or blue lips
🚨 Severe confusion or difficulty waking
🚨 Seizure
🚨 Severe abdominal pain
${fullProfile.pregnancy === "yes" ? "🚨 Fever during pregnancy (call OB immediately)" : ""}

**Follow-Up Questions:**
• What is your current temperature?
• When did the fever start?
• Do you have other symptoms (cough, sore throat, body aches, etc.)?
• Have you taken any medication for it?

---
*This is educational information only, not a diagnosis. Always follow medication labels and consult a healthcare provider if concerned.*`,
      structuredData: {
        urgency: isInfant ? "urgent_24_48h" : "self_care_ok",
        red_flags: isInfant ? ["Fever in infant requires medical evaluation"] : [],
        patient_profile: profile,
        chief_complaint: "fever",
        otc_suggestions: !isInfant ? [
          {
            name: "Acetaminophen (Tylenol)",
            when_to_use: "For fever and discomfort",
            label_dose_summary: isChild ? "Follow pediatric dosing based on weight" : "325-650mg every 4-6 hours",
            max_daily: isChild ? "See label" : "3000mg",
            who_should_avoid: "Those with liver disease or heavy alcohol use",
            common_side_effects: "Generally well tolerated; rare nausea"
          },
          {
            name: "Ibuprofen (Advil, Motrin)",
            when_to_use: "For fever and pain (ages 6mo+)",
            label_dose_summary: isChild ? "Follow pediatric dosing based on weight, ages 6mo+" : "200-400mg every 4-6 hours with food",
            max_daily: "1200mg (OTC without doctor)",
            who_should_avoid: "Stomach ulcers, kidney disease, pregnancy 3rd trimester, children under 6 months",
            common_side_effects: "Upset stomach, heartburn (take with food)"
          }
        ] : [],
        care_navigation: {
          setting: isInfant ? "urgent_care" : "self_care",
          rationale: isInfant ? "Fever in infant requires medical evaluation" : "Mild fever can be managed at home with monitoring"
        },
        next_steps: [
          "Monitor temperature regularly",
          "Stay hydrated",
          isChild ? "Use age-appropriate fever reducer if needed" : "Use OTC fever reducer if uncomfortable",
          "Watch for red flag symptoms",
          "Seek care if fever persists beyond 3 days or worsens"
        ]
      }
    };
  }

  // Headache response
  if (lowerInput.includes("headache") || lowerInput.includes("head pain")) {
    return {
      text: `**Understanding Your Headache**

**Common Types of Headaches:**

**1. Tension Headache** (most common)
• Feels like a tight band around head
• Both sides of head
• Mild to moderate pain
• No nausea/vomiting usually

**2. Migraine**
• Throbbing, pulsating pain
• Often one-sided
• Moderate to severe
• May have nausea, light/sound sensitivity
• May have visual disturbances (aura)

**3. Sinus Headache**
• Pain/pressure in forehead, cheeks, around eyes
• Often with nasal congestion
• Worse when bending forward

**Urgency Assessment:**

🚨 **EMERGENCY - Call 911 if:**
• Sudden, severe "thunderclap" headache (worst of your life)
• Headache with fever AND stiff neck
• Headache after head injury
• With confusion, vision loss, weakness, or slurred speech
• With difficulty walking or loss of balance
• Sudden headache during pregnancy (especially with vision changes)

⚠️ **Seek medical care within 24-48 hours if:**
• New type of headache that's different from usual
• Headache that's progressively worsening over days/weeks
• Headache with high fever
• Persistent headache after starting new medication
• Headache that wakes you from sleep
• Headache with nausea/vomiting that won't stop

✓ **Self-Care Appropriate If:**
• Familiar headache pattern
• Mild to moderate severity
• No red flag symptoms
• Responding to usual remedies

**Self-Care Steps:**

✓ **Immediate Relief:**
  • Rest in quiet, dark room
  • Apply cold or warm compress to head/neck
  • Gentle head and neck massage
  • Stay hydrated (dehydration can worsen headaches)

✓ **OTC Medications:**
  • **Acetaminophen (Tylenol):** 325-650mg every 4-6 hours (max 3000mg/day)
  • **Ibuprofen (Advil):** 200-400mg every 4-6 hours with food (max 1200mg/day OTC)
  • **Naproxen (Aleve):** 220mg every 8-12 hours (max 660mg/day OTC)
  
  ⚠️ **Warning:** Don't overuse pain relievers - can cause "rebound headaches"
  • Use no more than 2-3 days per week
  • If needing pain relief more frequently, see a doctor

✓ **Lifestyle Measures:**
  • Reduce screen time
  • Practice stress management
  • Maintain regular sleep schedule
  • Avoid known triggers (certain foods, alcohol, lack of sleep)
  • Stay well-hydrated throughout day

**For Migraines Specifically:**
• Early treatment works best
• Avoid bright lights and loud sounds
• OTC combination products (acetaminophen + aspirin + caffeine) may help
• Consider keeping a headache diary to identify triggers

**Prevention Tips:**
• Regular sleep schedule
• Regular meals (don't skip)
• Manage stress
• Regular exercise
• Limit caffeine (but don't stop suddenly if regular user)
• Good posture, especially if desk work

**I need more details to help better:**
• How long have you had this headache?
• On a scale of 1-10, how severe is the pain?
• Where exactly is the pain located?
• Is it throbbing, sharp, dull, or pressure-like?
• Do you have any other symptoms (nausea, vision changes, fever)?
• Have you tried any treatments? Did they help?
• Is this a new type of headache for you, or similar to ones you've had before?

---
*This is educational information only. If you have any red flag symptoms, seek immediate medical care.*`,
      structuredData: {
        urgency: "self_care_ok",
        red_flags: [
          "Sudden severe 'thunderclap' headache",
          "Headache with fever and stiff neck",
          "After head injury",
          "With neurological symptoms"
        ],
        patient_profile: profile,
        chief_complaint: "headache",
        otc_suggestions: [
          {
            name: "Acetaminophen (Tylenol)",
            when_to_use: "For mild to moderate headache pain",
            label_dose_summary: "325-650mg every 4-6 hours",
            max_daily: "3000mg",
            who_should_avoid: "Liver disease, heavy alcohol use",
            common_side_effects: "Generally well tolerated"
          },
          {
            name: "Ibuprofen (Advil, Motrin)",
            when_to_use: "For headache with inflammation component",
            label_dose_summary: "200-400mg every 4-6 hours with food",
            max_daily: "1200mg (OTC)",
            who_should_avoid: "Stomach ulcers, kidney disease, pregnancy 3rd trimester",
            common_side_effects: "Upset stomach (take with food)"
          }
        ],
        care_navigation: {
          setting: "self_care",
          rationale: "Common headache can typically be managed at home unless red flags present"
        },
        next_steps: [
          "Try OTC pain reliever as directed",
          "Rest in quiet, dark room",
          "Apply cold/warm compress",
          "Stay hydrated",
          "Monitor for red flag symptoms",
          "See doctor if headaches frequent or worsening"
        ]
      }
    };
  }

  // Generic symptom response
  return {
    text: `**Symptom Evaluation**

Thank you for sharing your symptoms. To give you the most helpful guidance, I need more specific information:

**Tell me more about your symptoms:**
• What specific symptoms are you experiencing?
• When did they start?
• How severe are they on a scale of 1-10?
• What makes them better or worse?
• Have you tried any treatments? What happened?

**Associated symptoms:**
• Do you have fever or chills?
• Any difficulty breathing?
• Chest pain or pressure?
• Severe headache?
• Nausea or vomiting?
• Rash or skin changes?

**Recent history:**
• Any recent injuries or accidents?
• Possible exposure to illness?
• Recent travel?
• New medications or foods?

**Current status:**
${fullProfile.age ? `• Age: ${fullProfile.age}` : "• Age: (please provide)"}
${fullProfile.sex_at_birth ? `• Sex: ${fullProfile.sex_at_birth}` : ""}
${fullProfile.pregnancy === "yes" ? "• Pregnancy: Yes (please inform your OB immediately if symptoms worsen)" : ""}

Once you provide more details, I can help you understand:
• What your symptoms might indicate (educational information)
• How urgent the situation is
• Safe self-care steps if appropriate
• When and where to seek professional care
• What questions to ask your healthcare provider

**Remember:**
🚨 If you have any of these, seek emergency care immediately:
• Severe chest pain or pressure
• Severe difficulty breathing
• Signs of stroke (face droop, arm weakness, slurred speech)
• Severe bleeding
• Severe allergic reaction
• Loss of consciousness

---
*I'm not a medical professional; this is educational guidance. For diagnosis and treatment, consult a healthcare provider.*`,
    structuredData: {
      urgency: "pending_information",
      patient_profile: profile,
      next_steps: [
        "Describe specific symptoms in detail",
        "Provide timeline and severity",
        "List any treatments tried",
        "Note any associated symptoms"
      ]
    }
  };
}

function generateMedicationResponse(input: string, profile: Partial<PatientProfile>, fullProfile: PatientProfile): HealthResponse {
  const lowerInput = input.toLowerCase();

  // Ibuprofen
  if (lowerInput.includes("ibuprofen") || lowerInput.includes("advil") || lowerInput.includes("motrin")) {
    return {
      text: `**Ibuprofen (Brand names: Advil, Motrin)**
*Educational information only - not personal medical advice*

**What It Is:**
• Nonsteroidal anti-inflammatory drug (NSAID)
• Reduces pain, fever, and inflammation
• Available over-the-counter

**Common Uses:**
• Headaches, muscle aches, arthritis
• Menstrual cramps
• Toothaches
• Minor injuries and inflammation
• Fever reduction
• Back pain

**How It Works:**
• Blocks enzymes (COX-1 and COX-2) that make prostaglandins
• Prostaglandins cause pain, inflammation, and fever
• Effect typically begins within 30-60 minutes

**OTC Dosing Guidelines (Adults):**
• **Usual dose:** 200-400mg every 4-6 hours
• **Maximum:** 1200mg per day (without doctor supervision)
• **Take with food or milk** to reduce stomach upset
• Use lowest effective dose for shortest time needed

**Dosing for Children (ages 6 months+):**
• Based on weight - follow package label carefully
• Typical: 5-10mg per kg of body weight every 6-8 hours
• Do NOT use in infants under 6 months without doctor approval

**Important Warnings:**

🚨 **DO NOT take if you have:**
• History of stomach ulcers or GI bleeding
• Kidney disease or reduced kidney function
• Heart disease or heart failure (discuss with doctor first)
• Allergy to aspirin or other NSAIDs
• Currently taking blood thinners
• Pregnancy (especially 3rd trimester)
• Asthma triggered by aspirin

⚠️ **Use caution if:**
• You drink 3+ alcoholic beverages daily
• You're over 60 years old
• You have high blood pressure
• You're dehydrated
• Taking other medications (see interactions)

**Common Side Effects:**
• Upset stomach, nausea, heartburn (take with food)
• Dizziness
• Headache (paradoxically)
• Mild rash

**Serious Side Effects (rare - seek medical care):**
• Severe stomach pain or black/bloody stools
• Allergic reaction (hives, swelling, difficulty breathing)
• Chest pain or shortness of breath
• Weakness on one side
• Sudden weight gain or swelling

**Drug Interactions:**
⚠️ **Do NOT combine with:**
• Other NSAIDs (aspirin, naproxen) - increases risk
• Blood thinners (warfarin) - increases bleeding risk
• High-dose aspirin

⚠️ **May interact with:**
• Blood pressure medications (may reduce effectiveness)
• Lithium, methotrexate (may increase levels)
• Certain antidepressants (SSRIs, SNRIs)

**Maximum Duration:**
• For fever: No more than 3 days without medical advice
• For pain: No more than 10 days without medical advice
• If symptoms persist or worsen, see a healthcare provider

**Tips for Safe Use:**
✓ Take with food or milk
✓ Stay well hydrated
✓ Use lowest effective dose
✓ Don't exceed maximum daily dose
✓ Don't take if allergic to NSAIDs
✓ Tell doctors/dentists you're taking it
✓ Stop 1 week before surgery (unless instructed otherwise)

**Missed Dose:**
• If taking regularly, take missed dose when remembered
• If almost time for next dose, skip missed dose
• Don't double up

**Overdose:**
• Signs: Severe stomach pain, vomiting, drowsiness, black stools
• Action: Call Poison Control (1-800-222-1222) or seek emergency care

**Storage:**
• Room temperature
• Away from moisture and heat
• Keep out of reach of children

**Alternative Options:**
• Acetaminophen (Tylenol) - for pain/fever without inflammation
• Naproxen (Aleve) - longer-lasting NSAID
• Aspirin (except in children - risk of Reye's syndrome)

---
**Do you have specific questions about:**
• Using ibuprofen for a particular condition?
• Interactions with your current medications?
• Appropriate dosing for your situation?
• When to use ibuprofen vs. other pain relievers?

*Remember: This is educational information. Always read the medication label. For personalized medical advice, consult your healthcare provider or pharmacist.*`,
      structuredData: {
        patient_profile: profile,
        rx_education: [
          {
            name: "Ibuprofen (Advil, Motrin)",
            what_it_does: "NSAID that reduces pain, fever, and inflammation",
            typical_uses: "Headaches, muscle aches, arthritis, menstrual cramps, fever",
            common_dose_ranges_note: "OTC: 200-400mg every 4-6 hours, max 1200mg/day (education only - follow label)",
            major_warnings: "Stomach ulcers/bleeding, kidney issues, heart disease, pregnancy 3rd trimester, aspirin allergy",
            not_for: "Under 6 months age, active stomach ulcers, severe kidney disease, aspirin-allergic asthma"
          }
        ],
        otc_suggestions: [
          {
            name: "Ibuprofen",
            when_to_use: "Pain, fever, inflammation",
            label_dose_summary: "200-400mg every 4-6 hours with food",
            max_daily: "1200mg (OTC)",
            who_should_avoid: "Stomach ulcers, kidney disease, pregnancy 3rd trimester, NSAID allergy",
            common_side_effects: "Upset stomach, heartburn, nausea"
          }
        ]
      }
    };
  }

  // Acetaminophen
  if (lowerInput.includes("acetaminophen") || lowerInput.includes("tylenol") || lowerInput.includes("paracetamol")) {
    return {
      text: `**Acetaminophen (Brand names: Tylenol, Paracetamol)**
*Educational information only - not personal medical advice*

**What It Is:**
• Pain reliever and fever reducer (analgesic and antipyretic)
• NOT an anti-inflammatory (unlike NSAIDs)
• Available over-the-counter
• One of the most commonly used medications worldwide

**Common Uses:**
• Headaches
• Muscle aches
• Arthritis pain
• Backaches
• Toothaches
• Menstrual cramps
• Fever reduction
• Colds and flu symptoms

**How It Works:**
• Works in the brain to reduce pain signals and lower fever
• Exact mechanism not fully understood
• Does NOT reduce inflammation (key difference from NSAIDs)

**OTC Dosing Guidelines (Adults):**
• **Regular strength:** 325-650mg every 4-6 hours as needed
• **Extra strength:** 1000mg every 6-8 hours as needed
• **ABSOLUTE MAXIMUM:** 3000-4000mg per day (many experts now recommend max 3000mg)
• Doses higher than 4000mg per day can cause serious liver damage

**Dosing for Children:**
• Based on weight - use pediatric formulations
• Typical: 10-15mg per kg of body weight every 4-6 hours
• Maximum: 5 doses in 24 hours
• Use dosing syringe/cup provided - never use kitchen spoons
• Many formulations available: liquid, chewable, dissolving tablets

**Critical Safety Warnings:**

🚨 **LIVER DAMAGE RISK:**
• Exceeding 4000mg per day can cause **severe liver damage or death**
• Risk is higher with alcohol use, liver disease, fasting
• Many medications contain "hidden" acetaminophen:
  - Cold/flu medicines (Nyquil, Theraflu, Dayquil)
  - Pain combinations (Excedrin, Midol)
  - Prescription pain meds (Percocet, Vicodin, Norco)
  - Always check labels - don't double up!

⚠️ **DO NOT take or use with caution if you:**
• Have liver disease or cirrhosis
• Drink 3+ alcoholic beverages daily
• Are fasting or malnourished
• Take other medications containing acetaminophen
• Have severe kidney disease

**Advantages Over NSAIDs:**
✓ Gentler on stomach (no ulcer risk)
✓ No bleeding risk
✓ Generally safe in pregnancy (when used as directed)
✓ Safe with blood thinners (usually)
✓ Can use in children of all ages (with proper dosing)

**Common Side Effects:**
• Generally very well tolerated
• Rare: mild nausea, rash, headache

**Serious Side Effects (RARE but serious):**
• Skin rash with blisters (stop immediately)
• Liver damage symptoms:
  - Yellowing of skin/eyes (jaundice)
  - Dark urine
  - Severe fatigue
  - Severe nausea/vomiting
  - Upper right abdominal pain
• Seek immediate medical care if these occur

**Drug Interactions:**
⚠️ **Important interactions:**
• Warfarin (blood thinner) - high doses may increase bleeding risk
• Alcohol - greatly increases liver damage risk
• Other acetaminophen-containing products - risk of overdose
• Isoniazid (TB medication) - increased liver risk

**Pregnancy & Breastfeeding:**
✓ Generally considered safe during pregnancy when used as directed
✓ Use lowest effective dose for shortest time
✓ Safe during breastfeeding (small amounts pass to milk)
✓ Always consult OB/GYN if unsure

**Maximum Duration:**
• For fever: No more than 3 days without medical advice
• For pain: No more than 10 days without medical advice (5 days in children)
• If symptoms persist, see healthcare provider

**Tips for Safe Use:**
✓ Read ALL medication labels - check for acetaminophen
✓ Never exceed maximum daily dose
✓ Don't take with alcohol
✓ Use measuring device provided - not kitchen spoons
✓ Keep track of all acetaminophen sources
✓ Tell healthcare providers you're taking it
✓ Store safely away from children

**Missed Dose:**
• Acetaminophen is taken as needed, not on a schedule
• If taking regularly, take missed dose when remembered unless close to next dose
• Never double dose to catch up

**Overdose:**
🚨 **Acetaminophen overdose is a medical emergency**
• Even if person feels fine initially
• Liver damage may not show for 24-48 hours
• Signs: Nausea, vomiting, stomach pain, sweating, confusion, extreme tiredness
• **Action:** Call Poison Control (1-800-222-1222) or go to ER immediately
• Early treatment with N-acetylcysteine can prevent liver damage

**When to Choose Acetaminophen vs. Ibuprofen:**

**Choose Acetaminophen if:**
• You have stomach ulcers or GI issues
• You're taking blood thinners
• You have kidney disease
• You're in 3rd trimester of pregnancy
• You have aspirin-sensitive asthma

**Choose Ibuprofen if:**
• You have inflammation (arthritis, injuries)
• You need longer-lasting relief
• Acetaminophen hasn't worked for you
• You have liver disease (but healthy kidneys)

**Storage:**
• Room temperature
• Dry place
• Original container
• Out of reach of children

---
**Questions I can help with:**
• Comparing acetaminophen to other pain relievers?
• Safe use with your current medications?
• Dosing for children?
• When to see a doctor instead of using OTC?

*This is educational information. Always read medication labels carefully. Check with your healthcare provider or pharmacist if you have questions about your specific situation.*`,
      structuredData: {
        patient_profile: profile,
        rx_education: [
          {
            name: "Acetaminophen (Tylenol)",
            what_it_does: "Pain reliever and fever reducer (NOT anti-inflammatory)",
            typical_uses: "Pain, fever, headaches, arthritis",
            common_dose_ranges_note: "OTC: 325-650mg every 4-6 hours, ABSOLUTE MAX 3000-4000mg/day (education only)",
            major_warnings: "Liver damage risk above 4000mg/day; dangerous with alcohol; many products contain it",
            not_for: "Severe liver disease, heavy alcohol use"
          }
        ],
        otc_suggestions: [
          {
            name: "Acetaminophen (Tylenol)",
            when_to_use: "Pain and fever without inflammation",
            label_dose_summary: "325-650mg every 4-6 hours",
            max_daily: "3000-4000mg (NEVER exceed)",
            who_should_avoid: "Liver disease, heavy alcohol use (3+ drinks/day)",
            common_side_effects: "Generally well tolerated; rare nausea"
          }
        ]
      }
    };
  }

  // Generic medication response
  return {
    text: `**Medication Information Request**

I can provide educational information about medications, including:
• What the medicine does
• Common uses
• How to take it safely
• Side effects and warnings
• Who should avoid it
• Drug interactions
• OTC dosing guidance (based on package labels)

**For Prescription Medications:**
I can explain what they're typically used for and safety information, but I **cannot**:
❌ Prescribe medications
❌ Tell you what dose you should take
❌ Adjust your current prescriptions
❌ Recommend stopping or starting prescription drugs

**To help you, please tell me:**
• What medication are you asking about? (specific name)
• Is it over-the-counter or prescription?
• What would you like to know? (uses, side effects, dosing, interactions, etc.)
• Are you currently taking it, or considering it?
${!fullProfile.age ? "• Your age?" : ""}
${!fullProfile.meds?.length ? "• Any other medications you're currently taking?" : ""}
${!fullProfile.allergies?.length ? "• Any known drug allergies?" : ""}
${!fullProfile.conditions?.length ? "• Any medical conditions?" : ""}

**Common Medications I'm Often Asked About:**
• Pain/Fever: Ibuprofen, Acetaminophen, Naproxen, Aspirin
• Cold/Flu: Decongestants, Antihistamines, Cough suppressants
• Stomach: Antacids, Acid reducers, Anti-nausea
• Antibiotics: General education (cannot prescribe or dose)
• Blood pressure, diabetes, cholesterol medications (education only)

**Important Reminders:**
• Always read medication labels and package inserts
• Check with a pharmacist about drug interactions
• Never use leftover antibiotics or someone else's prescription
• Tell all your healthcare providers about ALL medications you take (including supplements, vitamins, and OTC products)

What medication would you like to learn about?

---
*Educational information only. For personalized medical advice about medications, consult your healthcare provider or pharmacist.*`,
    structuredData: {
      patient_profile: profile,
      next_steps: [
        "Specify medication name",
        "Indicate if OTC or prescription",
        "Ask specific questions about the medication"
      ]
    }
  };
}

function generateLabResponse(input: string, profile: Partial<PatientProfile>, fullProfile: PatientProfile): HealthResponse {
  return {
    text: `**Lab Report Interpretation Assistance**

I can help you understand your lab results! To give you the most helpful explanation, I need:

**Essential Information:**
📋 **For each test result:**
• Exact test name (e.g., "Hemoglobin," "TSH," "Glucose")
• Your value
• Units (e.g., mg/dL, mmol/L, g/dL)
• Reference range (the "normal" range your lab provides)
• Any flags (H for high, L for low)
• Date of test
• Whether you were fasting

**Example format:**
"Glucose: 110 mg/dL (Reference: 70-100) - H flag, fasting test, done 2 days ago"

**What I Can Do:**
✓ Explain what each test measures
✓ Clarify what "high" or "low" generally means
✓ Suggest common, non-disease reasons values change
✓ Help you prepare questions for your doctor
✓ Explain medical terminology

**What I Cannot Do:**
❌ Diagnose conditions
❌ Interpret trends without context
❌ Replace your doctor's interpretation
❌ Interpret medical images (X-rays, CT, MRI)
❌ Recommend treatment

**Common Lab Tests I Can Explain:**

**Complete Blood Count (CBC):**
• Red blood cells (RBC), White blood cells (WBC)
• Hemoglobin, Hematocrit
• Platelets, MCV, MCH, MCHC

**Metabolic Panel (BMP/CMP):**
• Glucose (blood sugar)
• Electrolytes (sodium, potassium, chloride, CO2)
• Kidney function (BUN, creatinine, eGFR)
• Calcium

**Lipid Panel:**
• Total cholesterol
• LDL ("bad" cholesterol)
• HDL ("good" cholesterol)
• Triglycerides

**Liver Function:**
• ALT, AST (liver enzymes)
• Bilirubin
• Albumin, Total Protein
• Alkaline Phosphatase

**Thyroid:**
• TSH (thyroid stimulating hormone)
• Free T4, Free T3

**Hemoglobin A1c:**
• 3-month average blood sugar
• Diabetes screening/monitoring

**Other Common Tests:**
• Vitamin D, B12
• Iron studies (ferritin, iron, TIBC)
• PSA (prostate)
• Urinalysis

**Important Context:**
Many factors affect lab results:
• Fasting status
• Time of day
• Medications
• Supplements
• Recent illness
• Hydration status
• Exercise
• Stress
• Menstrual cycle

**Single results don't tell the whole story** - your doctor considers:
• Your symptoms
• Physical exam
• Medical history
• Trends over time
• Multiple test results together

**Please share your results and I'll help you understand them!**

Format like: "TSH: 2.5 mIU/L (Ref: 0.4-4.0), tested last week while fasting"

---
*This is educational information to help you understand your results. Always discuss lab results with the healthcare provider who ordered them. They have your complete medical context.*`,
    structuredData: {
      patient_profile: profile,
      next_steps: [
        "Provide test name, value, units, and reference range",
        "Include any H/L flags from the lab",
        "Note if fasting and when test was done",
        "List all abnormal results from the report"
      ]
    }
  };
}

function generatePreventionResponse(input: string, profile: Partial<PatientProfile>, fullProfile: PatientProfile): HealthResponse {
  return {
    text: `**Health Prevention & Wellness Guide**

Great question! Prevention is key to long-term health. Let me provide evidence-based guidance:

**Core Preventive Health Pillars:**

**1. Nutrition 🥗**
✓ Eat variety of colorful fruits and vegetables (5+ servings/day)
✓ Choose whole grains over refined grains
✓ Include lean proteins (fish 2x/week, poultry, beans, nuts)
✓ Healthy fats (olive oil, avocados, nuts)
✓ Limit: processed foods, added sugars, sodium, red/processed meat
✓ Stay hydrated (8 glasses water/day minimum)

**2. Physical Activity 🏃**
✓ 150 minutes moderate exercise per week (brisk walking, cycling)
  OR 75 minutes vigorous exercise (running, swimming laps)
✓ Strength training 2+ days per week (all major muscle groups)
✓ Include flexibility and balance exercises
✓ Break up prolonged sitting - move every hour
✓ Find activities you enjoy for long-term adherence

**3. Sleep 😴**
✓ 7-9 hours per night for adults
✓ Consistent sleep schedule (even weekends)
✓ Dark, cool (60-67°F), quiet bedroom
✓ Limit screens 1 hour before bed
✓ Avoid large meals, caffeine, alcohol close to bedtime
✓ Regular exercise (but not within 3 hours of bed)

**4. Stress Management 🧘**
✓ Regular physical activity
✓ Mindfulness, meditation, deep breathing
✓ Social connections and support
✓ Hobbies and enjoyable activities
✓ Time in nature
✓ Limit news/social media consumption
✓ Seek professional help if overwhelmed

**5. Avoid Risky Behaviors 🚭**
✓ Don't smoke or vape (if you do, ask about quitting resources)
✓ Limit alcohol (if any): ≤1 drink/day women, ≤2 drinks/day men
✓ Never drink and drive
✓ Practice safe sex
✓ Wear seatbelts, helmets
✓ Sun protection: sunscreen SPF 30+, hats, protective clothing
✓ Practice good hand hygiene

**Preventive Screenings (General Guidelines):**
${fullProfile.age ? `\n**Based on your age (${fullProfile.age}):**` : "\n**Age-specific screenings:**"}

**Adults 18-39:**
✓ Blood pressure: Every 2 years (or annually if risk factors)
✓ Cholesterol: Age 35+ (earlier if risk factors)
✓ Diabetes screening: Age 35+ or if overweight with risk factors
✓ Dental: Every 6-12 months
✓ Eye exam: Every 2 years
✓ Skin check: Annual self-exam, doctor if concerns
${fullProfile.sex_at_birth === "female" ? "✓ Pap smear: Every 3 years (ages 21-65)\n✓ HPV testing: Can combine with Pap age 30+\n✓ Consider HPV vaccine if not done (up to age 45)" : ""}
${fullProfile.sex_at_birth === "male" ? "✓ Testicular self-exam: Monthly\n✓ Discuss PSA screening with doctor age 45-50+" : ""}

**Adults 40-64:**
✓ All the above, plus:
✓ Blood pressure: Annually
✓ Cholesterol: Every 4-6 years (more if abnormal)
✓ Diabetes: Every 3 years (or annually if prediabetes)
✓ Colorectal cancer screening: Starting age 45
  - Colonoscopy every 10 years, or
  - Stool-based tests annually/every 1-3 years, or
  - CT colonography every 5 years
${fullProfile.sex_at_birth === "female" ? "✓ Mammogram: Discuss age 40-50, then every 1-2 years\n✓ Bone density (DEXA): Age 65+ or earlier with risk factors" : ""}
${fullProfile.sex_at_birth === "male" ? "✓ Prostate cancer discussion: Age 50 (45 if high risk)" : ""}

**Adults 65+:**
✓ All the above, plus:
✓ Annual wellness visit
✓ Falls risk assessment
✓ Hearing test
✓ Vision exam annually
✓ Bone density scan (especially women)
✓ Shingles vaccine
✓ Pneumonia vaccines
✓ Annual flu shot

**Vaccinations (Adults):**
✓ **COVID-19:** Updated vaccines as recommended
✓ **Influenza (flu):** Annual, every fall
✓ **Tdap/Td:** Td booster every 10 years; Tdap once in adulthood
✓ **Shingles (Shingrix):** Age 50+, 2 doses
✓ **Pneumococcal:** Age 65+ (or earlier with certain conditions)
✓ **HPV:** Ages 11-26 recommended (catch-up to 45)
✓ **Hepatitis A & B:** Based on risk factors
✓ **MMR, Varicella:** If not immune

**Infection Prevention:**
✓ Hand washing: 20 seconds with soap, frequently
  - Before eating
  - After bathroom
  - After coughing/sneezing
  - After touching public surfaces
✓ Food safety:
  - Cook meats to safe temperatures
  - Wash fruits and vegetables
  - Avoid raw/undercooked eggs, meat, seafood
  - Refrigerate promptly
✓ Stay home when sick
✓ Cover coughs and sneezes
✓ Keep vaccines up to date

**Mental Health:**
✓ Regular social connections
✓ Purpose and meaning in life
✓ Stress management techniques
✓ Seek help for persistent sadness, anxiety, or other concerns
✓ Limit substance use
✓ Get adequate sleep

**Know Your Numbers:**
✓ Blood pressure
✓ Cholesterol levels
✓ Blood sugar/A1c
✓ Body mass index (BMI)
✓ Waist circumference

**Family Health History:**
✓ Know your family history of:
  - Heart disease, stroke
  - Cancer
  - Diabetes
  - Mental health conditions
  - Other hereditary conditions
✓ Share this with your healthcare providers
✓ May affect screening recommendations

**Regular Healthcare:**
✓ Establish relationship with primary care provider
✓ Annual checkups
✓ Dental care every 6 months
✓ Vision care
✓ Keep medication list updated
✓ Discuss preventive care schedule with your doctor

**What area would you like to focus on?**
• Nutrition and healthy eating
• Exercise and fitness
• Specific screening recommendations for your age/sex
• Vaccination schedule
• Stress management techniques
• Sleep improvement
• Other wellness topics

---
*This is general preventive health guidance. Individual recommendations may vary based on your personal and family health history. Discuss your preventive care plan with your healthcare provider.*`,
    structuredData: {
      patient_profile: profile,
      next_steps: [
        "Review recommended screenings for your age",
        "Schedule preventive care appointments",
        "Establish healthy lifestyle habits",
        "Discuss family history with provider",
        "Keep vaccinations up to date"
      ]
    }
  };
}

function generateDefaultResponse(input: string, profile: Partial<PatientProfile>, fullProfile: PatientProfile): HealthResponse {
  const needsProfile = !fullProfile.age || !fullProfile.sex_at_birth || !fullProfile.country;

  return {
    text: `Thank you for reaching out. I'm here to help with health information and guidance!

${needsProfile ? `**To give you the most personalized and safe guidance, I need some basic information:**
${!fullProfile.age ? "\n• What is your age?" : ""}
${!fullProfile.sex_at_birth ? "\n• Sex at birth (male/female)?" : ""}
${fullProfile.sex_at_birth === "female" && !fullProfile.pregnancy ? "\n• Are you pregnant or breastfeeding?" : ""}
${!fullProfile.country ? "\n• What country are you in?" : ""}
${!fullProfile.allergies?.length ? "\n• Do you have any medication allergies?" : ""}
${!fullProfile.conditions?.length ? "\n• Do you have any ongoing medical conditions?" : ""}
${!fullProfile.meds?.length ? "\n• Are you currently taking any medications?" : ""}
` : ""}

**I can help you with:**

**🩺 Symptom Checking:**
• Understand what symptoms might mean
• Estimate urgency (emergency, urgent, routine, or self-care)
• Safe self-care steps when appropriate
• When and where to seek professional care
• Red flag warnings

**💊 Medication Information:**
• How medicines work
• Common uses and dosing (OTC label-based)
• Side effects and warnings
• Drug interactions
• Who should avoid certain medications
• Education about prescription medications (not prescribing)

**🔬 Lab Results:**
• What lab tests measure
• Understanding reference ranges
• Common reasons values change
• Questions to ask your doctor
• No diagnosis, just education

**🛡️ Prevention & Wellness:**
• Healthy lifestyle guidance
• Vaccination information
• Screening recommendations
• Disease prevention strategies

**🏥 Care Navigation:**
• When to go to ER vs. urgent care vs. primary care
• Finding appropriate care for your situation

**What would you like help with today?**

You can:
• Describe symptoms you're experiencing
• Ask about a specific medication
• Share lab results you want explained
• Ask about preventive health
• Get general health education

---
**Remember:**
• 🚨 If this is an emergency (chest pain, difficulty breathing, stroke signs, severe bleeding, etc.), call 911 immediately
• I'm not a medical professional - I provide educational information, not diagnosis or treatment
• For personalized medical advice, consult your healthcare provider

*How can I assist you with your health question?*`,
    structuredData: {
      patient_profile: profile,
      next_steps: needsProfile ? [
        "Provide age and demographic information",
        "Share current medications and conditions",
        "Ask your specific health question"
      ] : [
        "Describe your health concern or question",
        "Share relevant symptoms or information",
        "Specify what type of help you need"
      ]
    }
  };
}

function _generateHealthResponseSync(userInput: string, conversationHistory: Message[], patientProfile: PatientProfile): HealthResponse {
  // Use the logic you already wrote: route to different generators.
  const lowerInput = userInput.toLowerCase();

  const extractedProfile = extractPatientInfo(userInput, patientProfile);

  if (containsEmergencyKeywords(lowerInput)) {
    return generateEmergencyResponse(userInput, extractedProfile as any);
  }
  if (containsSymptomKeywords(lowerInput)) {
    return generateSymptomResponse(userInput, extractedProfile as any, patientProfile);
  }
  if (containsMedicationKeywords(lowerInput)) {
    return generateMedicationResponse(userInput, extractedProfile as any, patientProfile);
  }
  if (containsLabKeywords(lowerInput)) {
    return generateLabResponse(userInput, extractedProfile as any, patientProfile);
  }
  if (containsPreventionKeywords(lowerInput)) {
    return generatePreventionResponse(userInput, extractedProfile as any, patientProfile);
  }
  return generateDefaultResponse(userInput, extractedProfile as any, patientProfile);
}

/* ---------- NOTE ----------
 This file is intentionally verbose so you can later replace the synchronous pipeline
 with an external AI call. If you want, I can compress it or extract just the response templates.
*/
