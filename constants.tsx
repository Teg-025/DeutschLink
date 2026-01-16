
import { CEFRLevel } from './types';

export const CURRICULUM_MAP = {
  [CEFRLevel.A1]: {
    title: "Breakthrough",
    topics: ["Greetings & Intro", "Present Tense", "Nominative Case", "Accusative Case", "Basic Word Order", "Numbers 1-100", "Family Vocab"],
    description: "Build your foundation with basic daily interactions.",
    syllabus: "Focuses on immediate needs: introducing yourself, ordering food, and basic professional greetings."
  },
  [CEFRLevel.A2]: {
    title: "Waystage",
    topics: ["Perfect Tense (Past)", "Dative Case", "Modal Verbs", "Reflexive Verbs", "Connectors", "Job Interviews", "Daily Routine"],
    description: "Start describing your past and expressing needs.",
    syllabus: "Covers routine tasks, background, and immediate environment. Essential for basic workplace communication."
  },
  [CEFRLevel.B1]: {
    title: "Threshold",
    topics: ["Preterite Tense", "Genitive Case", "Subordinate Clauses", "Future I", "Passive Voice", "Negotiations", "Travel Plans"],
    description: "Navigate most travel situations and express opinions.",
    syllabus: "Dealing with most situations likely to arise whilst travelling. Can describe dreams, hopes and ambitions."
  },
  [CEFRLevel.B2]: {
    title: "Vantage",
    topics: ["Advanced Passive", "Nominalization", "Subjunctive II", "Professional Emailing", "Client Pitching", "Abstract Discussions"],
    description: "The professional baseline for working in Germany.",
    syllabus: "Understanding complex text on both concrete and abstract topics, including technical discussions in your field."
  },
  [CEFRLevel.C1]: {
    title: "Advanced Mastery",
    topics: ["Complex Syntax", "Nuance & Irony", "Academic Writing", "Dialect Awareness", "Strategic Marketing Vocab"],
    description: "Understand implicit meanings and express fluid ideas.",
    syllabus: "Can express ideas fluently and spontaneously without much obvious searching for expressions."
  },
  [CEFRLevel.C2]: {
    title: "Proficiency",
    topics: ["Literary Analysis", "Philology", "Native Spontaneity", "Specialist Vocab", "Philosophical Discourse"],
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
