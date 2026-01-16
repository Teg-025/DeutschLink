
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CEFRLevel, Industry, UserProfile, Message, GroundingSource, AssessmentResult } from './types';
import { chatWithGemini, generateSpeech, analyzeAudioInput, explainGrammarDeep } from './services/geminiService';
import { playAudioBase64 } from './services/audioService';
import { CURRICULUM_MAP } from './constants';
import { 
  Trophy, 
  Flame, 
  Mic, 
  Send,
  Loader2,
  ChevronRight,
  Brain, 
  StopCircle,
  Volume2,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  CheckCircle,
  Lock,
  MessageSquare,
  Award,
  ArrowRight,
  Target,
  Save,
  Play,
  ExternalLink,
  History,
  Zap,
  Info,
  MousePointer2,
  Globe,
  Columns,
  Activity,
  BarChart3,
  MonitorPlay,
  PlayCircle
} from 'lucide-react';

const STORAGE_KEY = 'deutschlink_autosave_v5';

// Helper component to render text with an optional play button if it looks like German
const AudioText: React.FC<{ text: string; onPlay: (t: string) => void; isGerman?: boolean }> = ({ text, onPlay, isGerman }) => {
  return (
    <div className="flex items-center gap-2 group/text">
      <span className={isGerman ? "font-mono font-bold text-indigo-300" : ""}>{text}</span>
      {isGerman && (
        <button 
          onClick={(e) => { e.stopPropagation(); onPlay(text); }}
          className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 opacity-0 group-hover/text:opacity-100 transition-opacity hover:bg-indigo-500 hover:text-white"
          title="Play Pronunciation"
        >
          <Play size={10} fill="currentColor" />
        </button>
      )}
    </div>
  );
};

const VisualBlock: React.FC<{ block: any; onPlay: (t: string) => void }> = ({ block, onPlay }) => {
  const { type, title, data } = block;

  switch (type) {
    case 'table':
      return (
        <div className="mb-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30">
          <div className="bg-slate-800/50 px-3 py-1.5 border-b border-slate-800 flex items-center gap-2">
            <Columns size={10} className="text-indigo-400" />
            <h6 className="text-[9px] font-black uppercase tracking-widest text-slate-400">{title}</h6>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/30">
                  {Object.keys(data[0] || {}).map(k => (
                    <th key={k} className="px-3 py-1.5 font-black uppercase tracking-tighter text-slate-500 border-b border-slate-800/50">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-slate-800/30 last:border-none hover:bg-white/5 transition-colors">
                    {Object.values(row).map((val: any, j) => (
                      <td key={j} className="px-3 py-2">
                        <AudioText text={String(val)} onPlay={onPlay} isGerman={j === 0 || String(val).includes(' ')} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case 'comparison':
      return (
        <div className="mb-4 grid grid-cols-2 gap-3">
          {data.map((item: any, i: number) => (
            <div key={i} className="p-3 rounded-xl border border-slate-800 bg-slate-900/20 group hover:border-indigo-500/30 transition-all">
              <span className="text-[8px] font-black uppercase text-slate-500 block mb-0.5">{item.label || (i === 0 ? 'EN' : 'DE')}</span>
              <AudioText text={item.text} onPlay={onPlay} isGerman={i === 1} />
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const ResultPlacard: React.FC<{ result: AssessmentResult; onProceed: () => void }> = ({ result, onProceed }) => {
  return (
    <div className="w-full animate-in fade-in zoom-in duration-500">
      <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-900/30 to-slate-900 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-indigo-500/10 rotate-12 pointer-events-none">
          <Award size={80} />
        </div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="px-3 py-1 bg-indigo-600 rounded-xl text-sm font-black text-white">{result.level}</div>
          <h3 className="text-xl font-black text-white tracking-tighter">Assessment Complete</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Score</span>
              <span className="text-xl font-black text-indigo-400">{result.score}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mastery Status</span>
              <span className="text-[11px] font-black text-emerald-400 uppercase">{result.mastery_status}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
             {Object.entries(result.skill_breakdown).map(([skill, value]) => (
               <div key={skill} className="p-2.5 bg-slate-800/30 rounded-lg border border-slate-700/30">
                 <span className="text-[7px] font-black text-slate-600 uppercase block mb-0.5">{skill}</span>
                 <span className="text-[10px] font-bold text-slate-300">{value}</span>
               </div>
             ))}
          </div>
        </div>

        <button 
          onClick={onProceed}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/10"
        >
          {result.next_action} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

const LearningPlacard: React.FC<{ data: any; onAction: (text: string) => void; onPlay: (t: string) => void; onRecord: () => void; isRecording: boolean }> = ({ data, onAction, onPlay, onRecord, isRecording }) => {
  const {
    state,
    lesson_type,
    cefr_level,
    learning_goal,
    visual_blocks,
    quest,
    interactive_elements,
    media,
    quick_summary,
    assessment_results,
    q_type
  } = data;

  if (state === 'result') {
    return <ResultPlacard result={assessment_results} onProceed={() => onAction("Start Learning Module")} />;
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded text-[8px] font-black uppercase tracking-widest">{lesson_type || state}</div>
          <div className="px-2 py-0.5 bg-slate-800 rounded text-[8px] font-black text-slate-400 uppercase tracking-widest">{cefr_level}</div>
          {q_type && <div className="px-2 py-0.5 bg-amber-600/20 text-amber-400 border border-amber-500/20 rounded text-[8px] font-black uppercase tracking-widest">{q_type} mode</div>}
        </div>
      </div>

      <h3 className="text-xl font-black text-white mb-1.5 tracking-tight leading-tight">{learning_goal}</h3>
      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-6">{quick_summary}</p>

      {visual_blocks?.map((block: any, i: number) => <VisualBlock key={i} block={block} onPlay={onPlay} />)}

      {media?.audio_text && (
        <button 
          onClick={() => onPlay(media.audio_text)}
          className="mb-6 flex items-center gap-4 p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all w-full group"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Play size={18} fill="currentColor" />
          </div>
          <div className="text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-white">Listening Task</span>
            <p className="text-sm font-bold">Play Audio Fragment</p>
          </div>
        </button>
      )}

      {quest && (
        <div className="p-6 rounded-[2rem] bg-[#0b1121] border border-slate-800 shadow-xl relative">
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><Zap size={14} className="text-white" /></div>
          <p className="text-base font-bold text-slate-200 mb-6 leading-relaxed">{quest}</p>

          {q_type === 'speaking' || (interactive_elements?.type === 'record_audio') ? (
             <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={onRecord}
                  className={`p-10 rounded-full transition-all shadow-2xl ${isRecording ? 'bg-red-500 animate-pulse scale-110' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                >
                  {isRecording ? <StopCircle size={40} /> : <Mic size={40} />}
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isRecording ? "Stop to Submit Recording" : "Tap to Speak Phrase"}</span>
             </div>
          ) : interactive_elements?.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {interactive_elements.options.map((opt: string, i: number) => (
                <button 
                  key={i}
                  onClick={() => onAction(opt)}
                  className="w-full text-left px-5 py-3 bg-slate-800/40 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-400 rounded-2xl text-[13px] font-bold text-slate-400 hover:text-white transition-all shadow-md active:scale-95 flex justify-between items-center group"
                >
                  {opt}
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    level: CEFRLevel.UNSET,
    xp: 0,
    streak: 1,
    industry: 'Design',
    name: 'Creative Learner',
    masteryScores: {}
  });
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Willkommen! 🇩🇪 Ready to launch your German journey?\n\n- **Complete Fresher?** Click 'Start Learning' on A1 to begin without a test.\n- **Already Know Some?** Take a 'Diagnostic Assessment' to find your place." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  const levels: CEFRLevel[] = [CEFRLevel.A1, CEFRLevel.A2, CEFRLevel.B1, CEFRLevel.B2, CEFRLevel.C1, CEFRLevel.C2];

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.messages) setMessages(parsed.messages);
      } catch (error) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, messages }));
  }, [profile, messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, showDashboard]);

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    setShowDashboard(false);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const { text: responseText, urls } = await chatWithGemini(text, history, profile);
      
      try {
        const jsonMatch = responseText.trim().match(/\{[\s\S]*\}/)?.[0];
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch);
          if (data.state === 'result') {
            const scoreVal = parseInt(data.assessment_results.score);
            setProfile(p => ({
              ...p,
              level: data.assessment_results.level as CEFRLevel,
              masteryScores: { ...p.masteryScores, [data.assessment_results.level]: scoreVal },
              xp: p.xp + 200
            }));
          }
        }
      } catch (e) {}

      setMessages(prev => [...prev, { role: 'model', content: responseText, groundingUrls: urls }]);
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.status === 429) {
         setMessages(prev => [...prev, { role: 'model', content: "⚠️ The AI Tutor is currently experiencing extremely high traffic (Rate Limit Exceeded). Please wait a few moments and try again." }]);
      } else {
         setMessages(prev => [...prev, { role: 'model', content: "Linguistic processor encountered an error. Retrying..." }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorder.current?.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const mimeTypes = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/aac'];
        const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || '';
        
        if (!mimeType) {
            alert("Your browser does not support standard audio recording formats.");
            return;
        }

        mediaRecorder.current = new MediaRecorder(stream, { mimeType });
        const chunks: Blob[] = [];
        mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.current.onstop = async () => {
          const blob = new Blob(chunks, { type: mimeType });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const base64 = (reader.result as string).split(',')[1];
            setLoading(true);
            try {
              // Extract the phrase from the last model message if it's a speaking task
              const lastModelMsg = messages.filter(m => m.role === 'model').pop();
              let contextPhrase = '';
              if (lastModelMsg) {
                try {
                   const data = JSON.parse(lastModelMsg.content.trim().match(/\{[\s\S]*\}/)?.[0] || '{}');
                   contextPhrase = data.quest || '';
                } catch(e) {}
              }
              
              const feedback = await analyzeAudioInput(base64, profile, mimeType, contextPhrase);
              setMessages(prev => [...prev, { role: 'model', content: feedback }]);
            } catch (err: any) {
              console.error(err);
              if (err?.message?.includes('429') || err?.status === 429) {
                setMessages(prev => [...prev, { role: 'model', content: "⚠️ Audio processing rate limit exceeded. Please try again in a moment." }]);
              } else {
                setMessages(prev => [...prev, { role: 'model', content: "Phonetic analysis failed. Please try again." }]);
              }
            } finally {
              setLoading(false);
            }
          };
        };
        mediaRecorder.current.start();
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = window.setInterval(() => {
          setRecordingSeconds(s => s + 1);
        }, 1000);
      } catch (err) { 
        console.error(err);
        alert("Microphone access is required for speaking tasks."); 
      }
    }
  };

  const playTTS = async (text: string) => {
    setLoading(true);
    try {
      const audio = await generateSpeech(text);
      if (audio) await playAudioBase64(audio);
    } catch (err: any) {
      if (err?.message?.includes('429') || err?.status === 429) {
        alert("Audio generation rate limit reached. Please wait.");
      }
    } finally { setLoading(false); }
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.role === 'user') return <div className="font-bold text-base">{msg.content}</div>;

    try {
      const jsonStr = msg.content.trim().match(/\{[\s\S]*\}/)?.[0];
      if (jsonStr) {
        const data = JSON.parse(jsonStr);
        return <LearningPlacard data={data} onAction={(t) => handleSend(t)} onPlay={playTTS} onRecord={toggleRecording} isRecording={isRecording} />;
      }
    } catch (e) {}

    return <div className="whitespace-pre-wrap leading-relaxed opacity-80 text-sm">{msg.content}</div>;
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans select-none selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-[#0b1121] border-r border-slate-800 flex flex-col p-5 space-y-6 z-30 shadow-2xl shrink-0">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setShowDashboard(false)}>
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
            <GraduationCap className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tighter text-white leading-none">DeutschLink</h1>
            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em]">Engine v5.2</span>
          </div>
        </div>

        <nav className="space-y-1">
          <button 
            onClick={() => setShowDashboard(false)}
            className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all text-xs font-black border ${!showDashboard ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'text-slate-500 border-transparent hover:bg-slate-800'}`}
          >
            <MessageSquare size={16} /> Tutor Lab
          </button>
          <button 
            onClick={() => setShowDashboard(true)}
            className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all text-xs font-black border ${showDashboard ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'text-slate-500 border-transparent hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={16} /> Mastery Map
          </button>
        </nav>

        <div className="space-y-3">
          <h3 className="text-[9px] uppercase font-black text-slate-600 tracking-widest px-1">Vertical focus</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Design', 'Film', 'Audio', 'Marketing'].map(ind => (
              <button 
                key={ind}
                onClick={() => setProfile(p => ({ ...p, industry: ind as Industry }))}
                className={`px-2 py-2 rounded-xl text-[8px] font-black border transition-all ${profile.industry === ind ? 'bg-slate-700 border-slate-500 text-white shadow-md' : 'bg-transparent border-slate-800 text-slate-600 hover:border-slate-700'}`}
              >
                {ind}
              </button>
            ))}
            <button 
              key="General"
              onClick={() => setProfile(p => ({ ...p, industry: 'General' as Industry }))}
              className={`col-span-2 px-2 py-2 rounded-xl text-[8px] font-black border transition-all ${profile.industry === 'General' ? 'bg-slate-700 border-slate-500 text-white shadow-md' : 'bg-transparent border-slate-800 text-slate-600 hover:border-slate-700'}`}
            >
              General
            </button>
          </div>
        </div>

        <div className="mt-auto bg-[#1a2235]/40 rounded-3xl p-5 border border-slate-800/50 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-3 relative z-10">
            <div className="flex items-center gap-1.5 text-orange-500 font-black text-[10px]">
              <Flame size={14} fill="currentColor" /> {profile.streak}
            </div>
            <div className="flex items-center gap-1.5 text-yellow-500 font-black text-[10px]">
              <Trophy size={14} fill="currentColor" /> {profile.xp}
            </div>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
             <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${Math.min((profile.xp % 1000) / 10, 100)}%` }} />
          </div>
          <p className="text-[10px] text-white font-black uppercase tracking-widest">{profile.level === CEFRLevel.UNSET ? 'Diagnostic Required' : profile.level}</p>
        </div>
      </aside>

      {/* Main Engine */}
      <main className="flex-1 flex flex-col h-full relative bg-[#020617] overflow-hidden">
        
        {/* Scrollable Content Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar p-5 md:p-8 lg:p-12">
          
          {showDashboard ? (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-800/50">
                <div className="max-w-xl">
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter leading-none">Mastery Map</h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed italic">Select 'Diagnostic' to find your level or 'Start Learning' to begin as a fresher.</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 shadow-xl">
                   <Activity className="text-indigo-400" size={20} />
                   <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Core Engine Online</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {levels.map((lvl) => {
                  const score = profile.masteryScores[lvl];
                  const curriculum = CURRICULUM_MAP[lvl];
                  const progress = score || 0;

                  return (
                    <div 
                      key={lvl} 
                      className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 bg-slate-900/30 border-slate-800 hover:border-indigo-500/40 hover:shadow-2xl hover:bg-slate-900/60 flex flex-col`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl transition-transform group-hover:scale-110 bg-slate-800 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white`}>
                          {lvl}
                        </div>
                        {score !== undefined && (
                          <div className="text-right">
                            <span className="text-xl font-black text-indigo-400">{score}%</span>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">Accuracy</span>
                          </div>
                        )}
                      </div>
                      
                      <h4 className="text-xl font-black text-white tracking-tighter mb-1 leading-none">{curriculum.title}</h4>
                      <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-4">CEFR Protocol {lvl}</p>
                      
                      <div className="flex-1 space-y-4 mb-8">
                        <div>
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Detailed Syllabus</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed italic">{curriculum.syllabus}</p>
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2">Key Modules</span>
                          <div className="flex flex-wrap gap-1.5">
                            {curriculum.topics.slice(0, 4).map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-slate-800 rounded text-[8px] text-slate-500 border border-slate-700">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-800">
                          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-600 mb-1.5">
                            <span>Mastery Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full transition-all" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button 
                          onClick={() => handleSend(`Start_Assessment_${lvl}`)}
                          className={`py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white shadow-lg`}
                        >
                          <Target size={12} /> Diagnostic
                        </button>
                        <button 
                          onClick={() => handleSend(`Start_Learning_${lvl}`)}
                          className={`py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20`}
                        >
                          <Zap size={12} /> Start Learning
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-12 w-full pb-12">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-500`}>
                  <div className={`group relative max-w-[95%] sm:max-w-[85%] rounded-[2.5rem] p-6 md:p-8 shadow-xl transition-all ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/10' 
                      : 'bg-[#111827] border border-slate-800/60 text-slate-100 rounded-tl-none'
                  }`}>
                    {renderMessageContent(msg)}
                    
                    {msg.role === 'model' && (
                      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-800/40">
                        <button 
                          onClick={() => playTTS(msg.content)}
                          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-all bg-indigo-500/5 px-4 py-2 rounded-xl border border-indigo-500/10 active:scale-95 shadow-sm"
                        >
                          <Volume2 size={14} /> Global Playback
                        </button>
                        <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest ml-auto italic">Architect Engine Protocol v5.2</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#111827] border border-slate-800 rounded-3xl rounded-tl-none p-6 flex items-center gap-6 animate-pulse">
                    <Loader2 className="animate-spin text-indigo-400" size={24} />
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">Linguistic Synthesis...</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Command Center */}
        <div className="p-4 md:p-6 bg-[#020617]/95 backdrop-blur-xl border-t border-slate-800/60 shrink-0 shadow-[0_-15px_35px_rgba(0,0,0,0.4)]">
          <div className="max-w-4xl mx-auto space-y-4">
            
            {isRecording && (
              <div className="flex items-center justify-between px-4 py-2 bg-red-500/5 border border-red-500/20 rounded-2xl animate-pulse">
                <div className="flex items-center gap-3 text-red-500">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Phonetic Capture Mode</span>
                </div>
                <span className="font-mono text-lg font-black text-red-400 tracking-tighter tabular-nums">{Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}</span>
              </div>
            )}

            <div className="flex items-end gap-3 md:gap-4">
              <button 
                onClick={toggleRecording}
                className={`p-4 md:p-5 rounded-2xl transition-all shadow-xl relative group shrink-0 ${
                  isRecording 
                    ? 'bg-red-500 text-white shadow-red-500/30 ring-8 ring-red-500/10 scale-105' 
                    : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {isRecording ? <StopCircle size={24} /> : <Mic size={24} />}
              </button>

              <div className="flex-1 relative">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  disabled={isRecording}
                  placeholder={showDashboard ? "Select a node to begin..." : (isRecording ? "Listening for accent accuracy..." : "Type command...")}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl px-6 py-4 text-base focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none shadow-inner min-h-[56px] max-h-32 disabled:opacity-30 font-medium placeholder:text-slate-800 placeholder:font-black placeholder:uppercase placeholder:tracking-widest"
                  rows={1}
                />
              </div>

              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || loading || isRecording}
                className="p-4 md:p-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-90 shrink-0"
              >
                <Send size={24} />
              </button>
            </div>
            
            <div className="flex justify-center gap-8 md:gap-12 text-[9px] font-black text-slate-700 uppercase tracking-widest">
               <button onClick={() => setInput('/explain ')} className="hover:text-indigo-400 transition-colors flex items-center gap-2 group"><Brain size={14} className="group-hover:scale-110 transition-transform opacity-30" /> Theory</button>
               <span className="opacity-10 text-white">|</span>
               <button onClick={() => handleSend("Gen_Exercises")} className="hover:text-indigo-400 transition-colors flex items-center gap-2 group"><Zap size={14} className="group-hover:scale-110 transition-transform opacity-30" /> Drills</button>
               <span className="opacity-10 text-white">|</span>
               <button onClick={() => setShowDashboard(!showDashboard)} className="hover:text-indigo-400 transition-colors flex items-center gap-2 group"><Target size={14} className="group-hover:scale-110 transition-transform opacity-30" /> Mastery</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
