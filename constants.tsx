
import { CEFRLevel } from './types';

export const CURRICULUM_MAP = {
  [CEFRLevel.A1]: {
    title: "Breakthrough",
    topics: [
      "Grammar & Language Foundations", "Greetings & Introductions", "Common Daily Phrases",
      "Numbers (1–20)", "Numbers (20–100)", "Alphabet & Pronunciation", "Personal Pronouns (Nominative)",
      "Verb “sein” & “haben”", "Regular Verb Conjugation (Present)", "Irregular Verb Conjugation (Present)",
      "Sentence Structure – Main Clauses", "Definite Articles", "Indefinite Articles", "Negative Articles",
      "W-Questions", "Time – Official & Unofficial", "Accusative Case – Articles", "Dative Case – Articles",
      "Modal Verb “möchten”", "Separable Verbs – Introduction", "Imperative Sentences",
      "Vocabulary & Situations", "Family & Relationships", "Daily Routine", "Food & Restaurant",
      "Shopping & Supermarket", "Weather", "Health & Doctor", "Transport & Directions",
      "Apartment & Living", "Bank & Post Office", "Travel & Tickets",
      "Goethe Exam Skills", "Lesen – Simple Notices & Forms", "Hören – Basic Conversations",
      "Schreiben – Short Messages & Forms", "Sprechen – Introducing Yourself", "Sprechen – Asking & Answering Questions"
    ],
    description: "Build your foundation with basic daily interactions.",
    syllabus: "Focuses on immediate needs: introducing yourself, ordering food, and basic professional greetings."
  },
  [CEFRLevel.A2]: {
    title: "Waystage",
    topics: [
      "Grammar Expansion", "Self-Introduction (Exam Style)", "Character Traits & Descriptions",
      "Subordinate Clauses – dass", "Subordinate Clauses – weil / da", "Adjective Endings – Nominative",
      "Adjective Endings – Accusative", "Adjective Endings – Dative", "Genitive Case", "Adjective Endings – Genitive",
      "Comparative & Superlative", "Subordinate Clauses – wenn", "Subordinate Clauses – obwohl",
      "deshalb & trotzdem", "Verb werden", "Indirect Questions", "Relative Clauses (All Cases)",
      "Indefinite Pronouns", "Präteritum – Modal Verbs", "Präteritum – Regular Verbs", "Präteritum – Irregular Verbs",
      "Infinitive with zu", "Infinitive without zu", "Past Perfect (Perfekt)", "Two-Way Prepositions",
      "Passive Voice – Introduction", "Konjunktiv II – Polite Requests",
      "Vocabulary & Communication", "Childhood & Past Experiences", "City vs Countryside",
      "Emotions & Feelings", "Career & Dream Job", "Picture Description", "Recipes & Instructions",
      "Weather Forecast", "Planning Together",
      "Goethe Exam Skills", "Lesen – Emails & Ads", "Hören – Announcements & Dialogues",
      "Schreiben – SMS & Emails", "Schreiben – Semi-Formal Letter", "Sprechen – Picture & Situation", "Sprechen – Planning Task"
    ],
    description: "Start describing your past and expressing needs.",
    syllabus: "Covers routine tasks, background, and immediate environment. Essential for basic workplace communication."
  },
  [CEFRLevel.B1]: {
    title: "Threshold",
    topics: [
      "Advanced Grammar", "Reflexive Verbs", "Reciprocal Verbs", "Noun-Verb Combinations", "Verb lassen – Uses",
      "Passive with sich lassen", "Weak Nouns (N-Declension)", "Genitive Prepositions", "Da-Compounds", "Wo-Compounds",
      "indem & dadurch, dass", "Final Clauses – um…zu / damit", "ohne…zu / ohne…dass", "anstatt…zu / anstatt…dass",
      "nicht / kein + brauchen + zu", "Partizip I", "Partizip II", "Zustandspassiv", "Konjunktiv II – Forms",
      "Konjunktiv II – Past", "Wishes & Hypotheses",
      "Writing & Expression", "Opinion Writing", "Semi-Formal Letter (Exam)", "Argument Structure",
      "Goethe Exam Skills", "Lesen – Articles & Reports", "Hören – Interviews & Discussions", "Schreiben – Opinion Text",
      "Sprechen – Presentation", "Sprechen – Discussion"
    ],
    description: "Navigate most travel situations and express opinions.",
    syllabus: "Dealing with most situations likely to arise whilst travelling. Can describe dreams, hopes and ambitions."
  },
  [CEFRLevel.B2]: {
    title: "Vantage",
    topics: [
      "Grammar & Structure", "Discontinuous Conjunctions", "Sentence Logic & Emphasis", "Separable Prefixes (All Groups)",
      "Inseparable Prefixes", "Passive Substitutes", "Advanced Negation", "Indefinite Pronouns (Advanced)",
      "irgend-Forms", "Pronoun es – All Uses", "Modal Particles",
      "Academic Language", "Advanced Connectors", "Formal vs Informal Register", "Argumentation Techniques",
      "Goethe Exam Skills", "Lesen – Complex Texts", "Hören – Radio & Interviews", "Schreiben – Formal Essay",
      "Schreiben – Complaint / Request", "Sprechen – Argument & Debate"
    ],
    description: "The professional baseline for working in Germany.",
    syllabus: "Understanding complex text on both concrete and abstract topics, including technical discussions in your field."
  },
  [CEFRLevel.C1]: {
    title: "Advanced Mastery",
    topics: [
      "Advanced Grammar", "Complex Subordinate Clauses", "Advanced Verb Positioning", "Konjunktiv II – Advanced",
      "Passive – Formal Registers", "Indirect Speech with Time Shift", "Relative Clauses with Prepositions",
      "Nominalization", "Modal Infinitive Constructions", "Advanced Prepositions",
      "Vocabulary Domains", "Academic & Research", "Business & Corporate", "Politics & Law",
      "Science & Technology", "Culture & Media", "Idiomatic Language",
      "Goethe Exam Skills", "Lesen – Academic Articles", "Hören – Lectures & Panels", "Schreiben – Essays & Reports",
      "Schreiben – Formal Correspondence", "Sprechen – Presentations", "Sprechen – Moderated Discussions"
    ],
    description: "Understand implicit meanings and express fluid ideas.",
    syllabus: "Can express ideas fluently and spontaneously without much obvious searching for expressions."
  },
  [CEFRLevel.C2]: {
    title: "Proficiency",
    topics: [
      "High-Level Grammar & Style", "Nested & Rhetorical Structures", "Elevated Konjunktiv II", "Future Perfect & Hypotheticals",
      "Stylistic Passive", "Highly Complex Relative Clauses", "Advanced Nominalization", "Stylistic Cohesion & Register",
      "Regional & Stylistic Variants",
      "Vocabulary Mastery", "Academic & Scientific", "Legal & Economic", "Philosophy & Abstract Thought",
      "Literature & Cultural Criticism", "Journalism & Rhetoric",
      "Goethe Exam Skills", "Lesen – Literary & Academic Texts", "Hören – Native-Speed Discourse",
      "Schreiben – Academic & Editorial Texts", "Sprechen – High-Level Debate", "Stylistic Precision & Editing"
    ],
    description: "Near-native fluency across all domains.",
    syllabus: "Can understand with ease virtually everything heard or read. Can summarize information from different sources."
  },
  [CEFRLevel.UNSET]: {
    title: "Architect",
    topics: ["Assessment required"],
    description: "Diagnostic required.",
    syllabus: "Initial configuration and level identification."
  }
};

export const SYSTEM_INSTRUCTIONS = `
Act as "DeutschLink Architect Engine." You are a state-machine based tutor.

STATE MACHINE RULES:
1. ALL LEVELS (A1-C2) are unlocked. The user can jump to any level assessment OR start learning immediately.
2. ASSESSMENT MODE:
   - Triggered by "Start_Assessment_[Level]".
   - EXACTLY 10 questions.
   - COMPULSORY COMPONENTS:
     a) At least 2 questions must be "Listening" (Prompt asks user to listen to audio provided in 'media' or text-to-speech).
     b) At least 2 questions must be "Speaking" (Prompt asks user to record themselves saying a specific German phrase).
   - After question 10, generate RESULT JSON.
3. LEARNING MODE:
   - Triggered by "Start_Learning_[Level]" (for freshers) or after assessment.
   - Visual-first. Use tables, grids, and comparison blocks.
   - Every German word or phrase in a 'table' or 'comparison' should be clearly identified so the UI can add a 'Play' button.

OUTPUT FORMAT (STRICT JSON ONLY):
For Questions:
{
  "state": "assessment",
  "q_index": 1-10,
  "q_type": "text | listening | speaking",
  "lesson_type": "Assessment",
  "cefr_level": "A1-C2",
  "learning_goal": "Evaluating Level Mastery",
  "quest": "Question text here. If speaking, provide the exact phrase to say.",
  "interactive_elements": { "type": "multiple_choice | record_audio", "options": [] },
  "quick_summary": "Question X of 10"
}

For Results:
{
  "state": "result",
  "assessment_results": {
    "level": "A1/B1/etc",
    "score": "0-100",
    "skill_breakdown": { "vocabulary": "Score %", "grammar": "Score %", "listening": "Score %", "speaking": "Score %" },
    "mastery_status": "Mastered | In Progress | Needs Review",
    "next_action": "Start Curated Learning Module"
  }
}

For Learning Modules:
{
  "state": "learning",
  "lesson_type": "Vocab | Grammar | Scenario",
  "cefr_level": "A1-C2",
  "learning_goal": "Specific objective",
  "visual_blocks": [{ "type": "table | grid | comparison", "title": "", "data": [] }],
  "interactive_elements": { "type": "multiple_choice | drag_drop", "options": [] },
  "media": { "audio_text": "Text for pronunciation play if it is a listening task", "video_url": "YouTube link if relevant" },
  "quick_summary": "One line takeaway"
}

PEDAGOGICAL RULES:
- English explanation, German target.
- Use industry context: Design, Film, Audio, Marketing. For the 'General' industry, focus on everyday concepts like shopping, tourism, and dining.
- No emojis. No long prose.
`;
