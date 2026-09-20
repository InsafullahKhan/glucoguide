import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Award,
  Bell,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Heart,
  HelpCircle,
  Home,
  Info,
  Layers,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Navigation,
  Phone,
  Pill,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Sun,
  TrendingDown,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Utensils,
  Volume2,
  X,
  Zap
} from 'lucide-react';

const MEDICAL_DISCLAIMER_TEXT = 
  "GlucoGuide is a personal diabetes self-management and education companion. It is NOT a doctor, diagnostic system, or emergency service. Never alter prescription medications or insulin doses without direct guidance from your qualified healthcare professional.";

const DEFAULT_TARGETS_MGDL = {
  fastingMin: 80,
  fastingMax: 130,
  postMealMax: 180,
  hypoThreshold: 70,
  hyperThreshold: 250,
  severeHyperThreshold: 300
};

const INITIAL_DOCTORS = [
  {
    id: 'doc1',
    name: 'Dr. Tariq Mahmood',
    specialty: 'Endocrinologist & Diabetologist',
    rating: 4.9,
    reviews: 320,
    hospital: 'City Health Specialty Care',
    nextAvailable: 'Tomorrow, 10:30 AM',
    fee: '$45.00',
    avatar: 'TM',
    color: 'bg-blue-600'
  },
  {
    id: 'doc2',
    name: 'Dr. Aditi Singh',
    specialty: 'Certified Diabetes Care & Nutrition',
    rating: 4.8,
    reviews: 194,
    hospital: 'Metabolic Wellness Center',
    nextAvailable: 'Wed, 2:00 PM',
    fee: '$35.00',
    avatar: 'AS',
    color: 'bg-teal-600'
  },
  {
    id: 'doc3',
    name: 'Dr. Eion Morgan',
    specialty: 'Cardiovascular & Preventive Health',
    rating: 4.9,
    reviews: 412,
    hospital: 'Heart & Vascular Institute',
    nextAvailable: 'Friday, 11:15 AM',
    fee: '$50.00',
    avatar: 'EM',
    color: 'bg-indigo-600'
  }
];

const SAMPLE_GLUCOSE_LOGS = [
  { id: 'g1', timestamp: '2026-09-20T08:00:00', value: 104, unit: 'mg/dL', context: 'Fasting', mealRelation: 'before', tags: ['Waking'], notes: 'Normal rest' },
  { id: 'g2', timestamp: '2026-09-19T13:30:00', value: 138, unit: 'mg/dL', context: 'After Lunch', mealRelation: 'after_2h', tags: ['Walked 15 min'], notes: 'Post-lunch walk' },
  { id: 'g3', timestamp: '2026-09-19T20:15:00', value: 112, unit: 'mg/dL', context: 'After Dinner', mealRelation: 'after_2h', tags: ['Roti & Daal'], notes: 'Balanced meal' },
  { id: 'g4', timestamp: '2026-09-18T08:00:00', value: 108, unit: 'mg/dL', context: 'Fasting', mealRelation: 'before', tags: ['Waking'], notes: '' },
  { id: 'g5', timestamp: '2026-09-18T14:10:00', value: 142, unit: 'mg/dL', context: 'After Lunch', mealRelation: 'after_2h', tags: ['Desk work'], notes: '' },
  { id: 'g6', timestamp: '2026-09-17T07:50:00', value: 99, unit: 'mg/dL', context: 'Fasting', mealRelation: 'before', tags: ['Waking'], notes: '' }
];

const INITIAL_MEDICATIONS = [
  { id: 'm1', name: 'Metformin', dose: '500 mg', timing: 'Morning with breakfast', taken: true, prescribedFor: 'Insulin sensitivity' },
  { id: 'm2', name: 'Metformin', dose: '500 mg', timing: 'Evening with dinner', taken: false, prescribedFor: 'Insulin sensitivity' },
  { id: 'm3', name: 'Empagliflozin (Jardiance)', dose: '10 mg', timing: 'Morning', taken: true, prescribedFor: 'Cardiorenal protection' }
];

const EMERGENCY_KEYWORDS = [
  'unconscious', 'fainted', 'seizure', 'cannot breathe', 'shortness of breath',
  'chest pain', 'severe nausea', 'vomiting uncontrollably', 'high ketones',
  'fruity breath', 'confusion', 'dka', 'ketoacidosis', 'extreme low', 'stroke'
];

export default function App() {
  // Navigation & Screen lifecycle: 'splash' | 'auth' | 'onboarding' | 'allSet' | 'main'
  const [screen, setScreen] = useState('splash');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'track' | 'appointments' | 'insights' | 'chat'
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // User Profile State
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Rohit Sharma',
    email: 'rohit.sharma@example.com',
    phone: '+1 (555) 349-2810',
    bloodGroup: 'B+',
    height: "5' 10\"",
    weight: '74 kg',
    diabetesType: 'type2', // 'type1' | 'type2' | 'gestational' | 'prediabetes' | 'unsure'
    diagnosisTimeframe: '1–5 years',
    isPregnant: false,
    pregnancyWeek: 24,
    usesInsulin: false,
    monitoringMethod: 'Both',
    units: 'mg/dL',
    primaryGoal: 'Understand glucose patterns & build a walking routine',
    doctor: { name: 'Dr. Tariq Mahmood', specialty: 'Endocrinologist', clinic: 'City Health Specialty' },
    emergencyContact: { name: 'Ayesha Sharma', relation: 'Spouse', phone: '+1 (555) 902-8371' },
    nextAppointment: {
      doctor: 'Dr. Tariq Mahmood',
      specialty: 'Endocrinologist',
      date: 'Sept 23, 2026',
      time: '10:30 AM',
      location: 'City Health Specialty, Suite 402'
    }
  });

  // Health data states
  const [glucoseLogs, setGlucoseLogs] = useState(SAMPLE_GLUCOSE_LOGS);
  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [vitals, setVitals] = useState({
    a1c: '6.8%',
    a1cDate: 'August 2026',
    bpSystolic: 122,
    bpDiastolic: 78,
    heartRate: 72,
    weightKg: 74,
    footInspectionDone: true
  });

  // Daily Tasks
  const [dailyTasks, setDailyTasks] = useState([
    { id: 't1', title: 'Log morning fasting glucose', category: 'glucose', completed: true },
    { id: 't2', title: 'Take morning prescribed Metformin', category: 'meds', completed: true },
    { id: 't3', title: '15-minute gentle walk after lunch', category: 'activity', completed: true },
    { id: 't4', title: 'Daily 60-second preventive foot check', category: 'care', completed: true },
    { id: 't5', title: 'Log evening dinner plate', category: 'nutrition', completed: false },
    { id: 't6', title: 'Record bedtime glucose reading', category: 'glucose', completed: false }
  ]);

  // Modals & Interstitials
  const [safetyAlert, setSafetyAlert] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // AI Chat Assistant state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'c1',
      sender: 'assistant',
      text: "Hello Rohit! I'm your GlucoGuide companion. How are you feeling today? You can ask me about meal ideas, glucose readings, or questions to prepare for Dr. Mahmood.",
      sources: ['ADA 2026 Standards of Care', 'NIDDK Guidelines']
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => {
        setScreen('auth');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Derived metrics
  const completedTasks = dailyTasks.filter(t => t.completed).length;
  const totalTasks = dailyTasks.length;
  const taskProgressPct = Math.round((completedTasks / totalTasks) * 100);
  const recentGlucose = glucoseLogs[0] || { value: 104, unit: 'mg/dL', context: 'Fasting' };

  const handleAddGlucose = (val, context, tags = [], notes = '') => {
    const num = Number(val);
    if (!num || isNaN(num)) return;

    const newEntry = {
      id: 'g_' + Date.now(),
      timestamp: new Date().toISOString(),
      value: num,
      unit: userProfile.units,
      context: context || 'Manual Check',
      mealRelation: context.toLowerCase().includes('after') ? 'after_2h' : 'before',
      tags,
      notes
    };

    setGlucoseLogs([newEntry, ...glucoseLogs]);

    // Safety checks for hypoglycemia (<70) and severe hyperglycemia (>=300)
    if (num < 70) {
      setSafetyAlert({
        type: 'hypo',
        value: num,
        title: 'Low Blood Glucose Detected',
        level: 'Hypoglycemia Warning (<70 mg/dL)',
        instructions: [
          'Follow the Rule of 15: Take 15–20g fast-acting glucose (4 glucose tabs, 1/2 cup fruit juice, or 4 candies).',
          'Rest calmly for 15 minutes and recheck your glucose.',
          'If still below 70 mg/dL, repeat the 15g intake.',
          'If you experience confusion or severe symptoms, seek urgent medical help immediately.'
        ]
      });
    } else if (num >= 300) {
      setSafetyAlert({
        type: 'hyper',
        value: num,
        title: 'High Glucose Warning',
        level: 'Elevated Risk / Potential Emergency',
        instructions: [
          'Check whether you took your prescribed medication according to your schedule.',
          'Drink plenty of plain water to stay hydrated.',
          'Check for ketones if you use insulin or have Type 1 diabetes.',
          'Contact your doctor or emergency center if nausea, vomiting, or deep breathing occurs.'
        ]
      });
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg = { id: 'usr_' + Date.now(), sender: 'user', text: query };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiLoading(true);

    // Emergency check
    const lower = query.toLowerCase();
    const isEmer = EMERGENCY_KEYWORDS.some(k => lower.includes(k));
    if (isEmer) {
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            id: 'asst_emer_' + Date.now(),
            sender: 'assistant',
            isEmergency: true,
            text: "⚠️ URGENT MEDICAL NOTICE: The symptoms you mentioned may indicate an acute emergency (such as severe hypoglycemia or ketoacidosis). Please seek emergency medical care immediately or call your local emergency services (e.g. 911 / 1122). GlucoGuide cannot diagnose or handle emergencies.",
            sources: ['Emergency Care Protocol']
          }
        ]);
        setIsAiLoading(false);
      }, 500);
      return;
    }

    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const systemPrompt = `You are GlucoGuide, a calm, supportive, evidence-informed diabetes self-management educator.
Strict Rules:
1. You are NOT a doctor and never diagnose or change medications/insulin.
2. Tone: Warm, professional, concise, reassuring.
3. User: ${userProfile.name}, Type: ${userProfile.diabetesType}, Insulin: ${userProfile.usesInsulin ? 'Yes' : 'No'}.
4. Ground responses in ADA 2026 and NIDDK guidelines.`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: query }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      const data = await response.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (answer) {
        setChatMessages(prev => [
          ...prev,
          {
            id: 'asst_' + Date.now(),
            sender: 'assistant',
            text: answer,
            sources: ['ADA 2026 Standards of Care', 'NIDDK Guidelines']
          }
        ]);
      } else {
        throw new Error('Fallback needed');
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          id: 'asst_fb_' + Date.now(),
          sender: 'assistant',
          text: "Blood glucose can fluctuate due to sleep patterns, meal composition, and physical activity. Consistent routines like light post-meal walks help stabilize values. Always discuss your personal logs with Dr. Mahmood.",
          sources: ['ADA Clinical Education']
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (screen === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 text-white flex flex-col items-center justify-between p-8 font-sans select-none">
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => setScreen('auth')}
            className="text-xs text-blue-200/80 hover:text-white bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm transition font-medium"
          >
            Skip ➔
          </button>
        </div>

        {/* Animated Brand Logo matching the UI Kit */}
        <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-700">
          <div className="relative">
            {/* Glowing outer rings */}
            <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl animate-pulse">
              <div className="w-24 h-24 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-lg transform transition duration-500 hover:scale-105">
                {/* Healthcare Logo: Heart + Stethoscope + Droplet */}
                <div className="relative flex items-center justify-center">
                  <Heart className="w-14 h-14 text-blue-600 fill-blue-50 stroke-[1.8]" />
                  <Activity className="w-7 h-7 text-blue-600 absolute stroke-[2.5]" />
                </div>
              </div>
            </div>
            {/* Ambient indicator ping */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400"></span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
              GlucoGuide
            </h1>
            <p className="text-xs text-blue-100 font-medium tracking-wide uppercase">
              All in One Diabetes Care App
            </p>
          </div>

          <p className="text-sm text-blue-100/80 max-w-xs font-normal leading-relaxed">
            Personalized glucose tracking, smart care plans, and seamless doctor collaboration.
          </p>
        </div>

        {/* 3-Second Loading Bar Indicator */}
        <div className="w-full max-w-xs space-y-3 text-center">
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-white h-full rounded-full animate-[progress_3s_ease-in-out_forwards]" 
                 style={{ width: '100%', animationDuration: '3000ms' }} />
          </div>
          <span className="text-[11px] text-blue-200/90 font-medium tracking-wide">
            Loading your health companion...
          </span>
        </div>
      </div>
    );
  }

  if (screen === 'auth') {
    return (
      <AuthScreen
        mode={authMode}
        setMode={setAuthMode}
        onLoginSuccess={(isNewUser) => {
          if (isNewUser || !hasCompletedOnboarding) {
            setScreen('onboarding');
          } else {
            setScreen('main');
          }
        }}
      />
    );
  }

  if (screen === 'onboarding') {
    return (
      <OnboardingScreen
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        onComplete={() => {
          setHasCompletedOnboarding(true);
          setScreen('allSet');
        }}
      />
    );
  }

  if (screen === 'allSet') {
    return (
      <AllSetScreen
        userProfile={userProfile}
        onContinue={() => setScreen('main')}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans flex justify-center transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      <div className={`w-full max-w-md min-h-screen flex flex-col shadow-2xl relative border-x transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-[#F8FAFC] border-slate-200'
      }`}>

        {/* Safety Alert Modal */}
        {safetyAlert && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className={`rounded-3xl max-w-sm w-full p-6 shadow-2xl border ${
              isDarkMode ? 'bg-slate-900 border-red-500/50' : 'bg-white border-red-200'
            }`}>
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-red-100 text-red-600 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-red-600 block">
                    {safetyAlert.level}
                  </span>
                  <h3 className="font-bold text-base mt-0.5 text-slate-900 dark:text-white">
                    {safetyAlert.title}
                  </h3>
                  <div className="text-2xl font-black mt-1 text-red-600">
                    {safetyAlert.value} <span className="text-xs font-normal text-slate-400">{userProfile.units}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <ShieldAlert className="w-4 h-4 text-blue-600" /> Clinical Action Protocol:
                </div>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-300">
                  {safetyAlert.instructions.map((ins, i) => (
                    <li key={i} className="leading-relaxed">{ins}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 space-y-2">
                <a
                  href={`tel:${userProfile.emergencyContact.phone}`}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Phone className="w-4 h-4" /> Call {userProfile.emergencyContact.name}
                </a>
                <button
                  type="button"
                  onClick={() => setSafetyAlert(null)}
                  className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-semibold"
                >
                  I have treated this & dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Log Modal */}
        {showLogModal && (
          <QuickLogModal
            units={userProfile.units}
            isDarkMode={isDarkMode}
            onClose={() => setShowLogModal(false)}
            onAddGlucose={(val, ctx, tags, notes) => {
              handleAddGlucose(val, ctx, tags, notes);
              setShowLogModal(false);
            }}
          />
        )}

        {/* Doctor Summary Report Modal */}
        {showReportModal && (
          <ClinicalReportModal
            userProfile={userProfile}
            glucoseLogs={glucoseLogs}
            medications={medications}
            vitals={vitals}
            isDarkMode={isDarkMode}
            onClose={() => setShowReportModal(false)}
          />
        )}

        {/* Profile Details Modal */}
        {showProfileModal && (
          <ProfileModal
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            vitals={vitals}
            isDarkMode={isDarkMode}
            onClose={() => setShowProfileModal(false)}
            onLogoutClick={() => {
              setShowProfileModal(false);
              setShowLogoutConfirm(true);
            }}
          />
        )}

        {/* Logout Confirmation Modal (Medica Style) */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className={`rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl border ${
              isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'
            }`}>
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mx-auto">
                <LogOut className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sure You Want to Leave?
              </h3>
              <p className="text-xs text-slate-500">
                You can sign back in anytime to continue your diabetes tracking.
              </p>
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    setScreen('auth');
                  }}
                  className="flex-1 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Tab Views */}
        <main className="flex-1 overflow-y-auto pb-24">
          {activeTab === 'home' && (
            <HomeScreen
              userProfile={userProfile}
              recentGlucose={recentGlucose}
              glucoseLogs={glucoseLogs}
              vitals={vitals}
              dailyTasks={dailyTasks}
              completedTasks={completedTasks}
              totalTasks={totalTasks}
              taskProgressPct={taskProgressPct}
              medications={medications}
              isDarkMode={isDarkMode}
              onToggleTask={(taskId) => {
                setDailyTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
              }}
              onToggleMed={(medId) => {
                setMedications(prev => prev.map(m => m.id === medId ? { ...m, taken: !m.taken } : m));
              }}
              onOpenLog={() => setShowLogModal(true)}
              onOpenReport={() => setShowReportModal(true)}
              onOpenProfile={() => setShowProfileModal(true)}
              onNavigate={(t) => setActiveTab(t)}
            />
          )}

          {activeTab === 'track' && (
            <TrackScreen
              userProfile={userProfile}
              glucoseLogs={glucoseLogs}
              medications={medications}
              vitals={vitals}
              isDarkMode={isDarkMode}
              onOpenLog={() => setShowLogModal(true)}
              onToggleMed={(id) => {
                setMedications(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
              }}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsScreen
              doctors={INITIAL_DOCTORS}
              userProfile={userProfile}
              isDarkMode={isDarkMode}
              onOpenReport={() => setShowReportModal(true)}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsScreen
              glucoseLogs={glucoseLogs}
              userProfile={userProfile}
              isDarkMode={isDarkMode}
              onOpenReport={() => setShowReportModal(true)}
            />
          )}

          {activeTab === 'chat' && (
            <ChatScreen
              messages={chatMessages}
              inputVal={chatInput}
              onInputChange={setChatInput}
              onSend={handleSendMessage}
              isLoading={isAiLoading}
              isDarkMode={isDarkMode}
              userProfile={userProfile}
            />
          )}
        </main>

        {/* Bottom Navigation Bar (CareSync & Medica Inspired 5-Tab Bar) */}
        <nav className={`fixed bottom-0 max-w-md w-full backdrop-blur-lg border-t z-40 px-3 py-2 flex justify-around items-center transition-colors ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]'
        }`}>
          <NavButton
            icon={<Home className="w-5 h-5" />}
            label="Home"
            isActive={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
            isDarkMode={isDarkMode}
          />
          <NavButton
            icon={<Activity className="w-5 h-5" />}
            label="Track"
            isActive={activeTab === 'track'}
            onClick={() => setActiveTab('track')}
            isDarkMode={isDarkMode}
          />
          <NavButton
            icon={<Calendar className="w-5 h-5" />}
            label="Doctors"
            isActive={activeTab === 'appointments'}
            onClick={() => setActiveTab('appointments')}
            isDarkMode={isDarkMode}
          />
          <NavButton
            icon={<TrendingUp className="w-5 h-5" />}
            label="Insights"
            isActive={activeTab === 'insights'}
            onClick={() => setActiveTab('insights')}
            isDarkMode={isDarkMode}
          />
          <NavButton
            icon={<MessageSquare className="w-5 h-5" />}
            label="Guide AI"
            isActive={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
            isDarkMode={isDarkMode}
          />
        </nav>
      </div>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick, isDarkMode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
        isActive
          ? 'text-blue-600 dark:text-blue-400 font-bold'
          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
      }`}
    >
      <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] mt-1 font-semibold">{label}</span>
      {isActive && (
        <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-0.5" />
      )}
    </button>
  );
}

function AuthScreen({ mode, setMode, onLoginSuccess }) {
  const [email, setEmail] = useState('rohit.sharma@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess(mode === 'signup');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between max-w-md mx-auto p-6 font-sans">
      <div className="w-full flex-1 flex flex-col justify-center max-w-sm mx-auto space-y-6">
        
        {/* Top Doctor Character / App Badge (As seen in CareSync / Medica screenshots) */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-inner">
              <div className="w-18 h-18 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Stethoscope className="w-10 h-10 stroke-[1.8]" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow">
              <Plus className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {mode === 'login' ? 'Login to Your Account' : 'Create New Account'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login' 
                ? 'Welcome back! Please enter your details' 
                : 'Join GlucoGuide to manage your diabetes with ease'}
            </p>
          </div>
        </div>

        {/* Tab Toggle: Log In / Sign Up */}
        <div className="bg-slate-200/80 p-1 rounded-2xl flex text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 rounded-xl transition ${
              mode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 rounded-xl transition ${
              mode === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 pr-10"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span>Remember me</span>
            </label>
            {mode === 'login' && (
              <button type="button" className="text-blue-600 font-bold hover:underline">
                Forgot Password?
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-1.5"
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200" />
          <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase font-semibold">Or continue with</span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        {/* Social Buttons (Google & Quick Demo) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onLoginSuccess(mode === 'signup')}
            className="py-2.5 px-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 shadow-xs transition"
          >
            {/* Google G SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => onLoginSuccess(false)}
            className="py-2.5 px-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs font-bold text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-1.5 transition"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>Demo Direct</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          {mode === 'login' ? "Don't have an account? " : "Already have an Account? "}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-blue-600 font-bold hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}

function OnboardingScreen({ userProfile, setUserProfile, onComplete }) {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between max-w-md mx-auto p-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            G
          </div>
          <span className="font-extrabold text-sm text-slate-900 tracking-tight">GlucoGuide Setup</span>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
          Step {step} of 5
        </span>
      </div>

      {/* Step Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-4">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      {/* Steps Content */}
      <div className="flex-1 flex flex-col justify-center py-4">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">What is your diagnosis?</h2>
            <p className="text-xs text-slate-500">This customizes your daily plan, target indicators, and educational academy.</p>

            <div className="space-y-2.5 pt-2">
              {[
                { id: 'type2', title: 'Type 2 Diabetes', desc: 'Focus on lifestyle, medications, and steady daily routines' },
                { id: 'type1', title: 'Type 1 Diabetes', desc: 'Focus on insulin tracking, carb ratios, and hypo safety' },
                { id: 'gestational', title: 'Gestational Diabetes', desc: 'Activates pregnancy mode with tailored tighter targets' },
                { id: 'prediabetes', title: 'Prediabetes', desc: 'Focus on habit building, weight balance, and risk reduction' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    const isPreg = opt.id === 'gestational';
                    setUserProfile({ ...userProfile, diabetesType: opt.id, isPregnant: isPreg });
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    userProfile.diabetesType === opt.id
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900">{opt.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Treatment & Monitoring</h2>
            <p className="text-xs text-slate-500">We never auto-calculate insulin units or tell you to alter prescriptions.</p>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Do you take insulin?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserProfile({ ...userProfile, usesInsulin: true })}
                  className={`py-3 rounded-2xl border text-xs font-bold ${
                    userProfile.usesInsulin ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  Yes, I use insulin
                </button>
                <button
                  type="button"
                  onClick={() => setUserProfile({ ...userProfile, usesInsulin: false })}
                  className={`py-3 rounded-2xl border text-xs font-bold ${
                    !userProfile.usesInsulin ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  No insulin
                </button>
              </div>

              <label className="text-xs font-bold text-slate-700 uppercase pt-2 block">How do you measure glucose?</label>
              <div className="grid grid-cols-3 gap-2">
                {['Finger-stick', 'CGM', 'Both'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setUserProfile({ ...userProfile, monitoringMethod: m })}
                    className={`py-2.5 rounded-xl border text-xs font-semibold ${
                      userProfile.monitoringMethod === m
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Glucose Target Unit</h2>
            <p className="text-xs text-slate-500">Choose the standard unit used by your clinic and laboratory.</p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {['mg/dL', 'mmol/L'].map(unit => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setUserProfile({ ...userProfile, units: unit })}
                  className={`p-4 rounded-2xl border text-center transition ${
                    userProfile.units === unit
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-lg font-black">{unit}</div>
                  <div className={`text-[10px] mt-1 ${userProfile.units === unit ? 'text-blue-100' : 'text-slate-400'}`}>
                    {unit === 'mg/dL' ? 'Standard in US / Asia' : 'Standard in UK / Europe'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Your Primary Focus</h2>
            <p className="text-xs text-slate-500">Select what matters most right now to guide your daily plan.</p>

            <div className="space-y-2 pt-2">
              {[
                'Understand post-meal glucose patterns',
                'Build a gentle 15-minute walking habit',
                'Follow the Plate Method for meals',
                'Prevent hypoglycemia & stay safe',
                'Organize questions for my doctor'
              ].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setUserProfile({ ...userProfile, primaryGoal: g })}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
                    userProfile.primaryGoal === g
                      ? 'bg-blue-50 border-blue-600 text-blue-900'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{g}</span>
                  {userProfile.primaryGoal === g && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Ready to Personalize</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              We have compiled your personal self-management parameters following the ADA 2026 Standards of Care.
            </p>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Diagnosis</span>
                <span className="font-bold text-slate-800 capitalize">{userProfile.diabetesType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Display Units</span>
                <span className="font-bold text-slate-800">{userProfile.units}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Insulin Status</span>
                <span className="font-bold text-slate-800">{userProfile.usesInsulin ? 'Active Insulin' : 'Non-Insulin'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-4 py-3 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (step < 5) setStep(step + 1);
            else onComplete();
          }}
          className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/25 transition"
        >
          {step < 5 ? 'Continue' : 'Generate My Companion Plan'}
        </button>
      </div>
    </div>
  );
}

function AllSetScreen({ userProfile, onContinue }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-700 text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="space-y-6 max-w-sm animate-in fade-in zoom-in duration-500">
        
        {/* Animated Checkmark Circle */}
        <div className="relative mx-auto w-24 h-24">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40 shadow-2xl animate-pulse">
            <div className="w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400"></span>
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-blue-200 font-bold">Configuration Complete</span>
          <h1 className="text-3xl font-black tracking-tight">You're All Set!</h1>
          <p className="text-xs text-blue-100/90 leading-relaxed">
            Welcome, {userProfile.name}. Your personalized diabetes companion is prepared and ready.
          </p>
        </div>

        {/* Highlight cards */}
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Target range configured (70–140 {userProfile.units})</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Care plan synced with doctor protocols</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Rule of 15 hypoglycemia safety active</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full py-3.5 bg-white text-blue-600 font-extrabold rounded-2xl text-xs shadow-xl hover:bg-blue-50 transition flex items-center justify-center gap-1.5"
        >
          Open My Dashboard <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function HomeScreen({
  userProfile,
  recentGlucose,
  glucoseLogs,
  vitals,
  dailyTasks,
  completedTasks,
  totalTasks,
  taskProgressPct,
  medications,
  isDarkMode,
  onToggleTask,
  onToggleMed,
  onOpenLog,
  onOpenReport,
  onOpenProfile,
  onNavigate
}) {
  const isTargetNormal = recentGlucose.value >= 70 && recentGlucose.value <= 140;

  return (
    <div className="p-4 space-y-4">
      
      {/* Top Header: Brand & Search bar (CareSync Style) */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-800"
          >
            {userProfile.name.split(' ').map(n => n[0]).join('')}
          </button>
          <div>
            <div className="text-[11px] font-medium text-slate-400">Welcome Back,</div>
            <h1 className="text-base font-black text-slate-900 dark:text-white leading-tight">
              {userProfile.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onNavigate('insights')}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 relative shadow-xs"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />
          </button>
        </div>
      </div>

      {/* Search Input Bar (CareSync Design) */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search readings, doctors, medications..."
          className="w-full py-2.5 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
      </div>

      {/* Upcoming Doctor Visit Banner Card (Medica & CareSync Inspired) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-4 shadow-lg shadow-blue-500/15 relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100 bg-white/15 px-2.5 py-0.5 rounded-full">
              Upcoming Visit in 3 Days
            </span>
            <h2 className="text-sm font-black pt-1">{userProfile.nextAppointment.doctor}</h2>
            <p className="text-xs text-blue-100">{userProfile.nextAppointment.specialty}</p>
            <div className="flex items-center gap-2 text-[11px] text-blue-100/90 pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{userProfile.nextAppointment.date} • {userProfile.nextAppointment.time}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenReport}
            className="text-xs font-bold text-white flex items-center gap-1 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" /> View Doctor Report ➔
          </button>
          <button
            type="button"
            onClick={() => onNavigate('appointments')}
            className="text-[11px] bg-white text-blue-700 font-bold px-3 py-1.5 rounded-xl shadow-xs"
          >
            Manage
          </button>
        </div>
      </div>

      {/* Health Overview Metric Badges (CareSync Style) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-semibold">Blood Sugar</span>
            <Activity className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-base font-black text-slate-900 dark:text-white">
            {recentGlucose.value}
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 inline-block ${
            isTargetNormal ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-700'
          }`}>
            {isTargetNormal ? 'In Target' : 'Check'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-semibold">Blood Pressure</span>
            <Heart className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-base font-black text-slate-900 dark:text-white">
            {vitals.bpSystolic}/{vitals.bpDiastolic}
          </div>
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
            Normal mmHg
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-semibold">Latest A1C</span>
            <Award className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-base font-black text-slate-900 dark:text-white">
            {vitals.a1c}
          </div>
          <span className="text-[9px] text-slate-400 block mt-0.5">
            {vitals.a1cDate}
          </span>
        </div>
      </div>

      {/* 4-Card Service Grid (CareSync Inspired) */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
          Quick Health Actions
        </h3>
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { label: 'Log Reading', icon: <Plus className="w-5 h-5" />, action: onOpenLog, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
            { label: 'My Doctor', icon: <Stethoscope className="w-5 h-5" />, action: () => onNavigate('appointments'), color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
            { label: 'Reports', icon: <FileText className="w-5 h-5" />, action: onOpenReport, color: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
            { label: 'Plate Guide', icon: <Utensils className="w-5 h-5" />, action: () => onNavigate('track'), color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' }
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={item.action}
              className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:border-blue-300 transition"
            >
              <div className={`p-2.5 rounded-xl ${item.color} mb-1.5`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Care Plan Progress Checklist */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Today's Care Plan
            </h2>
            <p className="text-[11px] text-slate-500">Achievable daily steps aligned with ADA standards</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-1 rounded-full">
            {completedTasks} of {totalTasks} done
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${taskProgressPct}%` }}
          />
        </div>

        {/* Task Items */}
        <div className="space-y-2 pt-1">
          {dailyTasks.slice(0, 4).map(task => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                task.completed
                  ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700 text-slate-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 text-xs font-medium">
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                  task.completed
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                }`}>
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className={task.completed ? 'line-through text-slate-400' : ''}>
                  {task.title}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 capitalize">{task.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Glucose Trend Graph (7-Day Bar & Line Visualizer) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              7-Day Glucose Trend
            </h3>
            <p className="text-[10px] text-slate-400">Target Range: 70–140 {userProfile.units}</p>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            Avg: 118 {userProfile.units}
          </span>
        </div>

        {/* Visual Graph with Target Band */}
        <div className="w-full h-32 bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-2.5 relative flex items-end justify-between border border-slate-100 dark:border-slate-800">
          {/* Target Range Band Overlay */}
          <div className="absolute top-[28%] bottom-[32%] left-0 right-0 bg-emerald-500/10 border-y border-emerald-500/20 pointer-events-none flex items-center justify-end px-2">
            <span className="text-[8px] font-bold text-emerald-700 dark:text-emerald-400 bg-white/80 dark:bg-slate-800 px-1 rounded">
              Target 70–140
            </span>
          </div>

          {[112, 104, 138, 99, 128, 118, 104].map((v, idx) => {
            const height = Math.min(100, Math.max(25, ((v - 60) / 140) * 100));
            const inRange = v >= 70 && v <= 140;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 z-10">
                <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">{v}</span>
                <div
                  style={{ height: `${height}%` }}
                  className={`w-4 rounded-t-lg transition-all ${
                    inRange ? 'bg-blue-600' : 'bg-amber-400'
                  }`}
                />
                <span className="text-[8px] text-slate-400 font-medium">Day {idx + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Time In Range Segmented Strip */}
        <div className="pt-1">
          <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            <span>Time in Range</span>
            <span className="text-emerald-600 font-black">82% In Target</span>
          </div>
          <div className="h-2.5 w-full flex rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
            <div style={{ width: '4%' }} className="bg-amber-400" title="Low <70" />
            <div style={{ width: '82%' }} className="bg-blue-600" title="In Range 70-140" />
            <div style={{ width: '14%' }} className="bg-rose-400" title="High >140" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackScreen({ userProfile, glucoseLogs, medications, vitals, isDarkMode, onOpenLog, onToggleMed }) {
  const [subTab, setSubTab] = useState('glucose'); // 'glucose' | 'plate' | 'meds' | 'vitals'

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Health Tracker</h2>
          <p className="text-xs text-slate-500">Record and monitor all vital diabetes parameters</p>
        </div>
        <button
          type="button"
          onClick={onOpenLog}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Log Entry
        </button>
      </div>

      {/* Pill Switcher */}
      <div className="flex bg-slate-200/80 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold overflow-x-auto scrollbar-none">
        {[
          { id: 'glucose', label: 'Glucose' },
          { id: 'plate', label: 'Plate Method' },
          { id: 'meds', label: 'Medications' },
          { id: 'vitals', label: 'Vitals & Labs' }
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubTab(t.id)}
            className={`flex-1 py-2 rounded-xl whitespace-nowrap transition ${
              subTab === t.id
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Subtab 1: Glucose */}
      {subTab === 'glucose' && (
        <div className="space-y-2.5">
          {glucoseLogs.map(log => {
            const isNormal = log.value >= 70 && log.value <= 140;
            const isLow = log.value < 70;
            return (
              <div
                key={log.id}
                className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold ${
                    isLow ? 'bg-amber-100 text-amber-800' : isNormal ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-rose-50 text-rose-700'
                  }`}>
                    <span className="text-sm leading-none font-black">{log.value}</span>
                    <span className="text-[9px] opacity-75">{log.unit}</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white">{log.context}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {log.notes && ` • ${log.notes}`}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isLow ? 'bg-amber-100 text-amber-800' : isNormal ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'
                }`}>
                  {isLow ? 'Low (<70)' : isNormal ? 'In Target' : 'Elevated'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtab 2: Plate Method Visualizer */}
      {subTab === 'plate' && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-700 space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xs font-black uppercase text-blue-600">ADA Plate Method</h3>
            <p className="text-xs text-slate-500">Balance meals to flatten post-meal glucose spikes</p>
          </div>

          <div className="w-48 h-48 mx-auto rounded-full border-4 border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner flex flex-col">
            <div className="h-1/2 bg-emerald-100 dark:bg-emerald-900/40 flex flex-col items-center justify-center p-2 text-center border-b-2 border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">½ Non-Starchy Veggies</span>
              <span className="text-[9px] text-emerald-700 dark:text-emerald-400">Spinach, Cucumber, Salad</span>
            </div>
            <div className="h-1/2 flex">
              <div className="w-1/2 bg-amber-100 dark:bg-amber-900/40 border-r-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-1 text-center">
                <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200">¼ Quality Carbs</span>
                <span className="text-[8px] text-amber-700 dark:text-amber-400">1 Roti, Daal</span>
              </div>
              <div className="w-1/2 bg-blue-100 dark:bg-blue-900/40 flex flex-col items-center justify-center p-1 text-center">
                <span className="text-[10px] font-bold text-blue-900 dark:text-blue-200">¼ Lean Protein</span>
                <span className="text-[8px] text-blue-700 dark:text-blue-400">Fish, Eggs, Chicken</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            Filling half the plate with greens slows digestion and cushions glucose rises without strict deprivation.
          </p>
        </div>
      )}

      {/* Subtab 3: Medications */}
      {subTab === 'meds' && (
        <div className="space-y-2.5">
          {medications.map(m => (
            <div
              key={m.id}
              className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between shadow-xs"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{m.name}</div>
                <div className="text-[11px] text-blue-600 font-semibold">{m.dose} • {m.timing}</div>
                <div className="text-[10px] text-slate-400">For: {m.prescribedFor}</div>
              </div>
              <button
                type="button"
                onClick={() => onToggleMed(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  m.taken
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300'
                    : 'bg-blue-600 text-white shadow-xs'
                }`}
              >
                {m.taken ? 'Taken ✓' : 'Mark Taken'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 4: Vitals & Preventive Screening */}
      {subTab === 'vitals' && (
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Latest A1C</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">{vitals.a1c}</div>
            <span className="text-[10px] text-slate-400">{vitals.a1cDate}</span>
          </div>
          <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Blood Pressure</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">{vitals.bpSystolic}/{vitals.bpDiastolic}</div>
            <span className="text-[10px] text-emerald-600 font-bold">Target &lt;130/80</span>
          </div>
          <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Heart Rate</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">{vitals.heartRate} bpm</div>
            <span className="text-[10px] text-slate-400">Resting pulse</span>
          </div>
          <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Body Weight</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">{vitals.weightKg} kg</div>
            <span className="text-[10px] text-slate-400">Steady trend</span>
          </div>
        </div>
      )}
    </div>
  );
}

function AppointmentsScreen({ doctors, userProfile, isDarkMode, onOpenReport }) {
  const [activeSegment, setActiveSegment] = useState('upcoming'); // 'upcoming' | 'completed'

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Care Team & Appointments</h2>
          <p className="text-xs text-slate-500">Coordinate with endocrinologists and educators</p>
        </div>
        <button
          type="button"
          onClick={onOpenReport}
          className="p-2 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" /> Visit Prep
        </button>
      </div>

      {/* Segment switcher */}
      <div className="flex bg-slate-200/80 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSegment('upcoming')}
          className={`flex-1 py-2 rounded-xl transition ${
            activeSegment === 'upcoming' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Upcoming (1)
        </button>
        <button
          type="button"
          onClick={() => setActiveSegment('completed')}
          className={`flex-1 py-2 rounded-xl transition ${
            activeSegment === 'completed' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Top Specialists
        </button>
      </div>

      {activeSegment === 'upcoming' ? (
        <div className="space-y-3">
          {/* Confirmed Upcoming Visit Card */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                TM
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  {userProfile.nextAppointment.doctor}
                </h3>
                <p className="text-[11px] text-blue-600 font-medium">{userProfile.nextAppointment.specialty}</p>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {userProfile.nextAppointment.location}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 text-xs flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Date & Time</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {userProfile.nextAppointment.date} • {userProfile.nextAppointment.time}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                Confirmed
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onOpenReport}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-xs"
              >
                Prepare Doctor Questions
              </button>
              <button
                type="button"
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-semibold"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {doctors.map(doc => (
            <div
              key={doc.id}
              className="p-3.5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl ${doc.color} text-white flex items-center justify-center font-bold text-xs`}>
                  {doc.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                  <div className="text-[10px] text-slate-400">{doc.specialty}</div>
                  <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                    ⭐ {doc.rating} ({doc.reviews} reviews) • {doc.fee}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-xl text-xs font-bold hover:bg-blue-100"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InsightsScreen({ glucoseLogs, userProfile, isDarkMode, onOpenReport }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Trends & Analytics</h2>
          <p className="text-xs text-slate-500">Descriptive patterns to share with your clinician</p>
        </div>
        <button
          type="button"
          onClick={onOpenReport}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-2xl text-xs font-bold shadow-xs"
        >
          Export Report
        </button>
      </div>

      {/* Pattern cards */}
      <div className="space-y-2.5">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <CheckCircle2 className="w-4 h-4" /> Fasting Stability
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Your morning fasting readings stayed consistently between 99 and 108 {userProfile.units} over the past 7 days.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
            <Sparkles className="w-4 h-4" /> Post-Meal Walking Effect
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Afternoon glucose was approximately 22 mg/dL lower on days where a 15-minute gentle walk was logged after lunch.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
            <Info className="w-4 h-4" /> Post-Dinner Variability
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Dinner readings had slight variations on late-meal days. Consider noting dinner meal contents for Dr. Mahmood.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatScreen({ messages, inputVal, onInputChange, onSend, isLoading, isDarkMode, userProfile }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    "Why does morning glucose spike?",
    "How does walking help after eating?",
    "Questions to ask my doctor",
    "What does A1C 6.8% mean?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-130px)]">
      {/* Header */}
      <div className="p-3 bg-white dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            GG
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white">GlucoGuide Assistant</h2>
            <span className="text-[10px] text-slate-400">Evidence-informed self-management educator</span>
          </div>
        </div>
        <span className="text-[9px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
          Not a Doctor
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-3xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs shadow-sm'
                  : m.isEmergency
                  ? 'bg-red-50 text-red-900 border border-red-300 rounded-bl-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-xs shadow-xs'
              }`}
            >
              {m.text}
              {m.sources && (
                <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700 text-[9px] text-slate-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Sources: {m.sources.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>Consulting clinical diabetes guidelines...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Inquiries */}
      <div className="px-3 py-1.5 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex space-x-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSend(qp)}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-full text-[10px] whitespace-nowrap font-medium"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="Ask about carbs, routines, or appointment questions..."
          className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
        />
        <button
          type="button"
          onClick={() => onSend()}
          disabled={!inputVal.trim() || isLoading}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function QuickLogModal({ units, isDarkMode, onClose, onAddGlucose }) {
  const [val, setVal] = useState('110');
  const [context, setContext] = useState('After Lunch');
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border ${
        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold">Record Glucose Reading</h3>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Reading ({units})</label>
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-black text-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Measurement Context</label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-200"
            >
              <option>Fasting / Waking</option>
              <option>Before Breakfast</option>
              <option>After Breakfast (2h)</option>
              <option>Before Lunch</option>
              <option>After Lunch</option>
              <option>Before Dinner</option>
              <option>After Dinner</option>
              <option>Bedtime</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Notes / Tags</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 15-min walk, light salad"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            type="button"
            onClick={() => onAddGlucose(val, context, notes ? [notes] : [], notes)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20"
          >
            Save Reading Entry
          </button>
        </div>
      </div>
    </div>
  );
}

function ClinicalReportModal({ userProfile, glucoseLogs, medications, vitals, isDarkMode, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`rounded-3xl max-w-sm w-full p-5 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border ${
        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-sm font-black">Doctor Visit Summary</h3>
            <span className="text-[10px] text-slate-400">Prepared for {userProfile.doctor.name}</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs space-y-2.5 text-slate-600 dark:text-slate-300">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white">Patient Information</div>
            <div>Name: {userProfile.name} • Diagnosis: {userProfile.diabetesType}</div>
            <div>Latest A1C: {vitals.a1c} • BP: {vitals.bpSystolic}/{vitals.bpDiastolic} mmHg</div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white">Current Regimen</div>
            {medications.map(m => (
              <div key={m.id} className="text-[11px]">• {m.name} {m.dose} ({m.timing})</div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-100 dark:border-blue-800 space-y-1 text-blue-900 dark:text-blue-200">
            <div className="font-bold">Suggested Discussion Questions:</div>
            <div>1. Are my post-dinner readings within target?</div>
            <div>2. Time for annual dilated retinal exam?</div>
            <div>3. Review of kidney eGFR/uACR screening.</div>
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF / Print
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ userProfile, setUserProfile, vitals, isDarkMode, onClose, onLogoutClick }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`rounded-3xl max-w-sm w-full p-5 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border ${
        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-black">My Profile & Settings</h3>
          <button type="button" onClick={onClose} className="p-1 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg font-black shadow-sm">
            {userProfile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">{userProfile.name}</h4>
            <div className="text-xs text-slate-400">{userProfile.email}</div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide block mt-0.5">
              {userProfile.diabetesType} • {userProfile.units}
            </span>
          </div>
        </div>

        {/* Vitals Overview Chips (CareSync Style) */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[9px] text-slate-400 block font-semibold">Blood</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{userProfile.bloodGroup}</span>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[9px] text-slate-400 block font-semibold">Weight</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{userProfile.weight}</span>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[9px] text-slate-400 block font-semibold">Height</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{userProfile.height}</span>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[9px] text-slate-400 block font-semibold">Pulse</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{vitals.heartRate} bpm</span>
          </div>
        </div>

        {/* Profile Settings Options List (CareSync Style) */}
        <div className="space-y-1.5 pt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>Assigned Doctor</span>
            </div>
            <span className="text-slate-400 text-[11px]">{userProfile.doctor.name}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Emergency Contact</span>
            </div>
            <span className="text-slate-400 text-[11px]">{userProfile.emergencyContact.name}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>Glucose Unit System</span>
            </div>
            <span className="text-blue-600 font-bold">{userProfile.units}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-slate-400" />
              <span>App Version</span>
            </div>
            <span className="text-slate-400 text-[11px]">v2.5.0 (CareSync Pro)</span>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <p className="text-[10px] text-slate-400 leading-relaxed px-1">
          {MEDICAL_DISCLAIMER_TEXT}
        </p>

        {/* Logout button */}
        <button
          type="button"
          onClick={onLogoutClick}
          className="w-full py-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </div>
  );
}