import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Award,
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
  FileText,
  Flame,
  Heart,
  HelpCircle,
  Home,
  Info,
  Layers,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Navigation,
  Pill,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
  User,
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

const DEFAULT_TARGETS_MMOL = {
  fastingMin: 4.4,
  fastingMax: 7.2,
  postMealMax: 10.0,
  hypoThreshold: 3.9,
  hyperThreshold: 13.9,
  severeHyperThreshold: 16.7
};

const SAMPLE_GLUCOSE_LOGS = [
  { id: 'g1', timestamp: '2026-09-19T07:45:00', value: 104, unit: 'mg/dL', context: 'Fasting', mealRelation: 'before', tags: ['Waking', 'Restful sleep'], notes: 'Felt refreshed' },
  { id: 'g2', timestamp: '2026-09-19T13:30:00', value: 138, unit: 'mg/dL', context: 'After Lunch', mealRelation: 'after_2h', tags: ['Walked 15 min', 'Roti & Daal'], notes: 'Post-lunch walk' },
  { id: 'g3', timestamp: '2026-09-19T19:15:00', value: 112, unit: 'mg/dL', context: 'Before Dinner', mealRelation: 'before', tags: ['Routine'], notes: '' },
  { id: 'g4', timestamp: '2026-09-18T08:00:00', value: 108, unit: 'mg/dL', context: 'Fasting', mealRelation: 'before', tags: ['Waking'], notes: '' },
  { id: 'g5', timestamp: '2026-09-18T14:10:00', value: 142, unit: 'mg/dL', context: 'After Lunch', mealRelation: 'after_2h', tags: ['Desk work'], notes: '' },
  { id: 'g6', timestamp: '2026-09-18T21:40:00', value: 118, unit: 'mg/dL', context: 'Bedtime', mealRelation: 'bedtime', tags: ['Chamomile tea'], notes: 'Ready for sleep' },
  { id: 'g7', timestamp: '2026-09-17T07:50:00', value: 99, unit: 'mg/dL', context: 'Fasting', mealRelation: 'before', tags: ['Waking'], notes: '' }
];

const INITIAL_MEDICATIONS = [
  { id: 'm1', name: 'Metformin', dose: '500 mg', timing: 'Morning with breakfast', taken: true, prescribedFor: 'Insulin sensitivity' },
  { id: 'm2', name: 'Metformin', dose: '500 mg', timing: 'Evening with dinner', taken: false, prescribedFor: 'Insulin sensitivity' },
  { id: 'm3', name: 'Empagliflozin (Jardiance)', dose: '10 mg', timing: 'Morning', taken: true, prescribedFor: 'Cardiorenal & glucose support' }
];

const SAMPLE_MEALS = [
  { id: 'f1', mealType: 'Breakfast', name: 'Eggs, Whole Wheat Toast & Spinach', carbs: '28g', protein: '18g', plateBalanced: true, time: '8:15 AM' },
  { id: 'f2', mealType: 'Lunch', name: 'Lentil Daal, 1 Roti & Fresh Cucumber Salad', carbs: '45g', protein: '14g', plateBalanced: true, time: '1:10 PM' }
];

const SAMPLE_ACTIVITIES = [
  { id: 'a1', type: 'Post-Meal Walking', duration: 15, intensity: 'Moderate', preGlucose: 152, postGlucose: 128, notes: 'Felt energizing' },
  { id: 'a2', type: 'Gentle Mobility & Stretching', duration: 10, intensity: 'Low', preGlucose: null, postGlucose: null, notes: 'Morning joints warmup' }
];

const ACADEMY_LESSONS = [
  {
    id: 'l1',
    category: 'Foundations',
    title: 'Understanding Your Blood Glucose & Targets',
    readTime: '3 min read',
    summary: 'How glucose acts as fuel, why ranges vary, and how individualized targets protect your long-term health.',
    takeaway: 'Targets are personal. Consistent moderate ranges matter much more than single day-to-day spikes.',
    source: 'American Diabetes Association (ADA) 2026 Standards of Care',
    forTypes: ['type1', 'type2', 'gestational', 'prediabetes']
  },
  {
    id: 'l2',
    category: 'Nutrition',
    title: 'The Visual Plate Method: A No-Stress Eating Approach',
    readTime: '4 min read',
    summary: 'Divide your plate into ½ non-starchy vegetables, ¼ lean proteins, and ¼ quality complex carbohydrates for natural glucose smoothing.',
    takeaway: 'You do not need strict deprivation. Balancing carbohydrates with fiber and protein cushions post-meal rises.',
    source: 'National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK)',
    forTypes: ['type1', 'type2', 'gestational', 'prediabetes']
  },
  {
    id: 'l3',
    category: 'Safety',
    title: 'Hypoglycemia & The Rule of 15',
    readTime: '3 min read',
    summary: 'Recognize early signs of low glucose (<70 mg/dL or 3.9 mmol/L) and treat with 15 grams of fast-acting glucose, re-checking after 15 minutes.',
    takeaway: 'Treat lows gently with quick carbs (glucose tabs or 4oz juice), never high-fat chocolates that slow glucose absorption.',
    source: 'ADA 2026 Hypoglycemia Guidelines',
    forTypes: ['type1', 'type2', 'gestational']
  },
  {
    id: 'l4',
    category: 'Activity',
    title: 'Movement as Medicine: The 15-Minute Post-Meal Walk',
    readTime: '3 min read',
    summary: 'Muscles pull glucose directly from the bloodstream without requiring extra insulin when active after eating.',
    takeaway: 'Even 10 to 15 minutes of light walking right after your main meal significantly blunts glucose peaks.',
    source: 'ADA 2026 Physical Activity Recommendations',
    forTypes: ['type1', 'type2', 'prediabetes', 'gestational']
  },
  {
    id: 'l5',
    category: 'Preventive Care',
    title: 'Comprehensive Foot, Eye & Kidney Health',
    readTime: '5 min read',
    summary: 'Why daily 60-second foot checks, annual dilated eye exams, and eGFR/uACR urine tests keep you ahead of complications.',
    takeaway: 'Preventive screenings identify subtle shifts years before symptoms appear. Early detection protects nerve and vessel health.',
    source: 'ADA & CDC Diabetes Prevention & Care Network',
    forTypes: ['type1', 'type2']
  },
  {
    id: 'l6',
    category: 'Pregnancy',
    title: 'Managing Gestational Diabetes Safely',
    readTime: '4 min read',
    summary: 'Specific tighter targets during pregnancy support both baby development and maternal well-being.',
    takeaway: 'Gestational targets are naturally tighter. Regular coordination with your obstetric and endocrine team is key.',
    source: 'ACOG & ADA Gestational Care Consensus',
    forTypes: ['gestational']
  }
];

const EMERGENCY_KEYWORDS = [
  'unconscious', 'fainted', 'seizure', 'cannot breathe', 'shortness of breath',
  'chest pain', 'severe nausea', 'vomiting uncontrollably', 'high ketones',
  'fruity breath', 'confusion', 'dka', 'ketoacidosis', 'extreme low', 'stroke'
];

const REGIONAL_FOOD_DB = [
  { name: 'Roti / Chapati (Whole wheat, 1 medium)', carbLevel: 'Moderate (15-20g)', note: 'Higher fiber; pair with protein & greens' },
  { name: 'Brown or Basmati Rice (1/2 cup cooked)', carbLevel: 'Moderate (22g)', note: 'Portion-sensitive; pair with lentils & salad' },
  { name: 'Daal (Lentils / Chana / Moong, 1 cup)', carbLevel: 'Carb + High Fiber & Protein (20g net)', note: 'Excellent plant protein & steady release' },
  { name: 'Grilled Chicken Tikka / Kebab', carbLevel: 'Low carb (<3g)', note: 'High lean protein; supports satiety' },
  { name: 'Palak / Mixed Sabzi (Vegetable curry)', carbLevel: 'Low-to-moderate carb', note: 'Rich in micronutrients and dietary fiber' },
  { name: 'Plain Greek Yogurt / Dahi (1 cup)', carbLevel: 'Low carb (6-8g)', note: 'Probiotics and quality protein' },
  { name: 'Naan / Paratha (Refined flour)', carbLevel: 'High carbohydrate & fat', note: 'Consider smaller portion & eat with fiber' }
];

export default function App() {
  // Navigation: 'onboarding' | 'home' | 'track' | 'insights' | 'learn' | 'chat' | 'settings' | 'reportModal'
  const [activeTab, setActiveTab] = useState('home');
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedTrackTab, setSelectedTrackTab] = useState('glucose'); // 'glucose' | 'food' | 'meds' | 'activity' | 'vitals'

  // User Profile state
  const [userProfile, setUserProfile] = useState({
    name: 'Insafullah',
    email: 'insaf@example.com',
    diabetesType: 'type2', // 'type1' | 'type2' | 'gestational' | 'prediabetes' | 'unsure'
    diagnosisTimeframe: '1–5 years',
    isPregnant: false,
    pregnancyWeek: 24,
    usesInsulin: false,
    insulinType: '',
    monitoringMethod: 'Both', // 'Finger-stick', 'CGM', 'Both'
    units: 'mg/dL', // 'mg/dL' | 'mmol/L'
    activityLevel: 'Lightly active',
    primaryGoal: 'Understand glucose patterns & build a walking routine',
    healthConditions: ['High blood pressure'],
    targets: { ...DEFAULT_TARGETS_MGDL },
    emergencyContact: { name: 'Ayesha Khan', relation: 'Spouse', phone: '+92 300 1234567' },
    doctor: { name: 'Dr. Tariq Mahmood (Endocrinologist)', clinic: 'City Health Medical' }
  });

  // Health data states
  const [glucoseLogs, setGlucoseLogs] = useState(SAMPLE_GLUCOSE_LOGS);
  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [meals, setMeals] = useState(SAMPLE_MEALS);
  const [activities, setActivities] = useState(SAMPLE_ACTIVITIES);
  const [footCheckDoneToday, setFootCheckDoneToday] = useState(true);
  const [vitals, setVitals] = useState({
    a1c: '6.8%',
    a1cDate: 'August 12, 2026',
    bpSystolic: 122,
    bpDiastolic: 78,
    weightKg: 74.5,
    lastEyeExam: 'March 2026',
    egfr: 98
  });

  // Daily Tasks state
  const [dailyTasks, setDailyTasks] = useState([
    { id: 't1', title: 'Log morning fasting glucose', category: 'glucose', completed: true },
    { id: 't2', title: 'Take morning prescribed Metformin', category: 'meds', completed: true },
    { id: 't3', title: '15-minute gentle walk after lunch', category: 'activity', completed: true },
    { id: 't4', title: 'Perform daily 60-second foot check', category: 'preventive', completed: true },
    { id: 't5', title: 'Log evening dinner plate', category: 'nutrition', completed: false },
    { id: 't6', title: 'Record bedtime glucose reading', category: 'glucose', completed: false }
  ]);

  // Safety Alerts Modal
  const [safetyAlert, setSafetyAlert] = useState(null); // { type: 'hypo' | 'hyper' | 'emergency', value: 64, title, instructions }

  // Quick Log Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [logType, setLogType] = useState('glucose'); // 'glucose' | 'food' | 'activity'

  // AI Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'c1',
      sender: 'assistant',
      text: "Hello Insafullah. I am your GlucoGuide companion. How can I support your routine today? You can ask about meal planning, glucose patterns, or preparing questions for your doctor.",
      sources: ['ADA 2026 Guidelines', 'NIDDK Self-Care Principles']
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Filter for Academy
  const [selectedAcademyCategory, setSelectedAcademyCategory] = useState('All');

  // Interactive Plate Builder State
  const [plateComposition, setPlateComposition] = useState({
    vegetables: 'Cucumber & Steamed Spinach',
    protein: 'Grilled Herb Chicken',
    carbs: '1 Whole Wheat Roti'
  });

  const completedTasksCount = dailyTasks.filter(t => t.completed).length;
  const totalTasksCount = dailyTasks.length;
  const taskProgressPct = Math.round((completedTasksCount / totalTasksCount) * 100);

  const recentGlucose = glucoseLogs[0] || { value: 104, unit: 'mg/dL', context: 'Fasting' };

  // Calculate TIR statistics from logs
  const tirStats = useMemo(() => {
    if (!glucoseLogs.length) return { inRange: 82, low: 4, high: 14, avg: 118 };
    let lowCount = 0;
    let inRangeCount = 0;
    let highCount = 0;
    let totalVal = 0;

    glucoseLogs.forEach(l => {
      totalVal += l.value;
      if (l.value < 70) lowCount++;
      else if (l.value > 180) highCount++;
      else inRangeCount++;
    });

    const total = glucoseLogs.length;
    return {
      inRange: Math.round((inRangeCount / total) * 100),
      low: Math.round((lowCount / total) * 100),
      high: Math.round((highCount / total) * 100),
      avg: Math.round(totalVal / total)
    };
  }, [glucoseLogs]);

  const handleAddGlucose = (valueNum, context, tags = [], notes = '') => {
    const val = Number(valueNum);
    if (!val || isNaN(val)) return;

    const newLog = {
      id: 'g_' + Date.now(),
      timestamp: new Date().toISOString(),
      value: val,
      unit: userProfile.units,
      context: context || 'Manual Check',
      mealRelation: context.toLowerCase().includes('after') ? 'after_2h' : 'before',
      tags: tags,
      notes: notes
    };

    setGlucoseLogs([newLog, ...glucoseLogs]);

    // Safety checks according to 2026 ADA guidelines
    if (val < 70) {
      setSafetyAlert({
        type: 'hypo',
        value: val,
        title: 'Low Blood Glucose Reading Detected',
        level: 'Hypoglycemia Warning',
        instructions: [
          'Follow the Rule of 15: Consume 15–20 grams of fast-acting glucose (e.g., 4 glucose tablets, 1/2 cup fruit juice, or 4 jelly candies).',
          'Rest calmly for 15 minutes.',
          'Re-check your blood glucose.',
          'If still under 70 mg/dL, repeat the 15g intake.',
          'If you experience severe confusion, dizziness, or cannot safely swallow, seek immediate emergency help.'
        ]
      });
    } else if (val >= 300) {
      setSafetyAlert({
        type: 'hyper',
        value: val,
        title: 'Very High Blood Glucose Reading',
        level: 'Elevated Risk / Potential Emergency',
        instructions: [
          'Review whether you took your prescribed medication according to your schedule.',
          'Drink plenty of plain water to stay well-hydrated.',
          'If you have Type 1 diabetes, check for urinary or blood ketones immediately.',
          'Look for urgent symptoms: nausea, vomiting, stomach pain, heavy breathing, or fruity-smelling breath.',
          'If ketone levels are elevated or nausea/vomiting is present, contact your healthcare provider or emergency services immediately.'
        ]
      });
    }
  };

  const handleSendMessage = async (textToSend) => {
    const userQuery = textToSend || chatInput;
    if (!userQuery.trim()) return;

    const newMsg = { id: 'usr_' + Date.now(), sender: 'user', text: userQuery };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsAiLoading(true);

    // 1. Critical safety emergency classifier
    const lowerQuery = userQuery.toLowerCase();
    const hasEmergencyWord = EMERGENCY_KEYWORDS.some(k => lowerQuery.includes(k));

    if (hasEmergencyWord) {
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            id: 'asst_emer_' + Date.now(),
            sender: 'assistant',
            isEmergency: true,
            text: "⚠️ URGENT SAFETY NOTICE: The symptoms you described may represent a medical emergency (such as severe hypoglycemia, ketoacidosis, or acute distress).\n\nPlease stop using this app and seek immediate in-person emergency medical care or call your local emergency services (such as 911 or 1122). GlucoGuide cannot diagnose or manage acute health emergencies.",
            sources: ['Emergency Medical Protocol', 'ADA / CDC Crisis Care Guidelines']
          }
        ]);
        setIsAiLoading(false);
      }, 400);
      return;
    }

    // 2. Query Gemini API with health context and safety instructions
    try {
      const apiKey = ""; // Canvas provides runtime API key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const systemPrompt = `You are "GlucoGuide", an empathetic, respectful, and evidence-informed diabetes self-management educator.
Important Rules:
1. You are NOT a doctor and do NOT diagnose conditions.
2. NEVER calculate or recommend specific insulin dosage adjustments or tell the user to stop medications.
3. Advise that individual medical questions must always be discussed with their healthcare professional.
4. Tone: Calm, warm, clear, professional, non-judgmental. Avoid exclamation marks and cheesy emojis.
5. User Context: ${userProfile.name}, Diabetes: ${userProfile.diabetesType}, Uses Insulin: ${userProfile.usesInsulin ? 'Yes' : 'No'}, Glucose Units: ${userProfile.units}.
6. Ground your answers in standards from the American Diabetes Association (ADA 2026), NIDDK, and CDC. Include a brief mention of the educational source.`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        setChatMessages(prev => [
          ...prev,
          {
            id: 'asst_' + Date.now(),
            sender: 'assistant',
            text: generatedText,
            sources: ['ADA 2026 Standards of Care', 'NIDDK Guidelines']
          }
        ]);
      } else {
        throw new Error('Fallback needed');
      }
    } catch (err) {
      // Robust clinical fallback when offline or API call is restrained
      let fallbackText = "Morning glucose can be influenced by multiple factors including the dawn phenomenon (natural hormone shifts), dinner composition, timing of evening medication, and sleep quality. Looking at your 7-day pattern can help uncover trends to discuss with your healthcare professional.";
      if (lowerQuery.includes('a1c')) {
        fallbackText = "An A1C test measures your average blood glucose over the past 2 to 3 months by gauging the percentage of glycated hemoglobin. For many non-pregnant adults, the ADA general guideline is under 7.0%, but personal targets must always be individualized with your doctor.";
      } else if (lowerQuery.includes('walk') || lowerQuery.includes('exercise')) {
        fallbackText = "A 10 to 15 minute walk after a meal helps skeletal muscles absorb glucose directly from the bloodstream without requiring higher insulin levels, effectively dampening post-meal glucose spikes.";
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: 'asst_fb_' + Date.now(),
          sender: 'assistant',
          text: fallbackText + "\n\nNote: Always review recurring patterns with your personal healthcare team before modifying your routine.",
          sources: ['ADA 2026 Clinical Education Series']
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleTask = (taskId) => {
    setDailyTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const toggleMedication = (medId) => {
    setMedications(prev =>
      prev.map(m => (m.id === medId ? { ...m, taken: !m.taken } : m))
    );
  };

  if (!isOnboardingCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-slate-200">
        {/* Onboarding Header */}
        <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              G
            </div>
            <span className="font-semibold text-slate-800 tracking-tight">GlucoGuide</span>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-100">
            Step {onboardingStep} of 6
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div 
            className="bg-teal-600 h-1 transition-all duration-300"
            style={{ width: `${(onboardingStep / 6) * 100}%` }}
          />
        </div>

        {/* Step Contents */}
        <div className="p-6 flex-1 flex flex-col justify-center">
          {onboardingStep === 1 && (
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Heart className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                Take control of your diabetes, one day at a time.
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track your health, understand personal glucose patterns, build sustainable daily routines, and stay closely connected with your care team.
              </p>
              
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex gap-3">
                <Shield className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <span>{MEDICAL_DISCLAIMER_TEXT}</span>
              </div>
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">About You & Units</h2>
              <p className="text-xs text-slate-500">Let's configure your display according to how your clinic tracks results.</p>
              
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Your First Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  className="mt-1 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Insafullah"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Preferred Glucose Unit</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['mg/dL', 'mmol/L'].map(unit => (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => setUserProfile({ ...userProfile, units: unit })}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                        userProfile.units === unit
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">You can change your preferred unit anytime in settings.</p>
              </div>
            </div>
          )}

          {onboardingStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">What best describes you?</h2>
              <p className="text-xs text-slate-500">This tailors your daily plan, target indicators, and educational academy.</p>

              <div className="space-y-2.5">
                {[
                  { id: 'type2', label: 'Type 2 Diabetes', desc: 'Focus on lifestyle, medications, and steady daily routines' },
                  { id: 'type1', label: 'Type 1 Diabetes', desc: 'Focus on insulin tracking, carb ratios, and hypoglycemia prevention' },
                  { id: 'gestational', label: 'Gestational Diabetes', desc: 'Activates Pregnancy Mode with dedicated tighter targets' },
                  { id: 'prediabetes', label: 'Prediabetes', desc: 'Focus on habit building, weight balance, and risk reduction' },
                  { id: 'unsure', label: "I'm not sure", desc: 'We do not diagnose you; we provide basic tracking' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const isPreg = item.id === 'gestational';
                      setUserProfile({ ...userProfile, diabetesType: item.id, isPregnant: isPreg });
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      userProfile.diabetesType === item.id
                        ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-sm text-slate-900">{item.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingStep === 4 && (
            <div className="space-y-5">
              {userProfile.diabetesType === 'gestational' ? (
                <>
                  <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl flex items-center gap-3">
                    <Heart className="w-5 h-5 text-pink-600 shrink-0" />
                    <span className="text-xs font-medium text-pink-800">
                      Pregnancy Mode Activated: Educational targets align with maternal care.
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Current Pregnancy Week</label>
                    <input
                      type="number"
                      min="1"
                      max="42"
                      value={userProfile.pregnancyWeek}
                      onChange={(e) => setUserProfile({ ...userProfile, pregnancyWeek: e.target.value })}
                      className="mt-1 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-900">How do you manage your care?</h2>
                  <p className="text-xs text-slate-500">We never auto-calculate insulin units or tell you to alter prescriptions.</p>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-700 uppercase">Do you use insulin?</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setUserProfile({ ...userProfile, usesInsulin: true })}
                        className={`p-3 rounded-xl border text-sm font-semibold ${
                          userProfile.usesInsulin ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Yes, I take insulin
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserProfile({ ...userProfile, usesInsulin: false })}
                        className={`p-3 rounded-xl border text-sm font-semibold ${
                          !userProfile.usesInsulin ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        No insulin
                      </button>
                    </div>

                    <label className="text-xs font-semibold text-slate-700 uppercase pt-2 block">How do you measure glucose?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Finger-stick', 'CGM', 'Both'].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setUserProfile({ ...userProfile, monitoringMethod: m })}
                          className={`p-2.5 rounded-xl border text-xs font-medium ${
                            userProfile.monitoringMethod === m ? 'bg-teal-50 border-teal-600 text-teal-800 font-semibold' : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {onboardingStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">What matters most right now?</h2>
              <p className="text-xs text-slate-500">Select your top goals to prioritize on your daily home screen.</p>
              
              <div className="space-y-2">
                {[
                  'Understanding my glucose patterns',
                  'Building a post-meal walking habit',
                  'Eating balanced plates without stress',
                  'Remembering my daily medications',
                  'Preparing questions for my doctor visits',
                  'Preventing low blood sugar (hypoglycemia)'
                ].map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setUserProfile({ ...userProfile, primaryGoal: goal })}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
                      userProfile.primaryGoal === goal
                        ? 'bg-teal-50 border-teal-600 text-teal-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{goal}</span>
                    {userProfile.primaryGoal === goal && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingStep === 6 && (
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your Personalized Plan is Ready</h2>
              
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Profile Type:</span>
                  <span className="font-semibold text-slate-800 capitalize">{userProfile.diabetesType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Monitoring Mode:</span>
                  <span className="font-semibold text-slate-800">{userProfile.monitoringMethod}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Units:</span>
                  <span className="font-semibold text-slate-800">{userProfile.units}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Primary Focus:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[180px]">{userProfile.primaryGoal}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                We have prepared today's plan with gentle habit check-ins and safety reminders. Remember to share your trends with Dr. Mahmood.
              </p>
            </div>
          )}
        </div>

        {/* Onboarding Bottom Buttons */}
        <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          {onboardingStep > 1 ? (
            <button
              type="button"
              onClick={() => setOnboardingStep(onboardingStep - 1)}
              className="px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {onboardingStep < 6 ? (
            <button
              type="button"
              onClick={() => setOnboardingStep(onboardingStep + 1)}
              className="flex-1 py-3 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-1 shadow-sm"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsOnboardingCompleted(true)}
              className="flex-1 py-3 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition shadow-sm"
            >
              Launch My Plan
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex justify-center selection:bg-teal-100 selection:text-teal-900">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative border-x border-slate-200">
        
        {/* Top App Header with Profile info & settings trigger */}
        <header className="px-5 py-3.5 bg-white border-b border-slate-100 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              G
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                GlucoGuide
                {userProfile.isPregnant && (
                  <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded font-normal">
                    Pregnancy Mode
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500">
                {userProfile.name} • {userProfile.units}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => {
                setShowLogModal(true);
                setLogType('glucose');
              }}
              className="p-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg text-xs font-medium flex items-center gap-1 border border-teal-200/60"
              title="Quick Log"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Log</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              title="Settings & Profile"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Safety Alert Modal Dialog */}
        {safetyAlert && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-red-200 animate-in fade-in zoom-in duration-200">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  safetyAlert.type === 'hypo' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 block">
                    {safetyAlert.level}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {safetyAlert.title}
                  </h3>
                  <div className="mt-1 text-2xl font-black text-slate-900">
                    {safetyAlert.value} <span className="text-xs font-normal text-slate-500">{userProfile.units}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-teal-600" /> Recommended Self-Care Action:
                </div>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
                  {safetyAlert.instructions.map((inst, idx) => (
                    <li key={idx} className="leading-relaxed">{inst}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={`tel:${userProfile.emergencyContact.phone}`}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition"
                >
                  <AlertCircle className="w-4 h-4" /> Call Emergency Contact ({userProfile.emergencyContact.name})
                </a>
                <button
                  type="button"
                  onClick={() => setSafetyAlert(null)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  I have taken action & dismissed
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Log Modal */}
        {showLogModal && (
          <QuickLogModal
            units={userProfile.units}
            onClose={() => setShowLogModal(false)}
            onAddGlucose={(val, ctx, tags, notes) => {
              handleAddGlucose(val, ctx, tags, notes);
              setShowLogModal(false);
            }}
            onAddMeal={(mealObj) => {
              setMeals([mealObj, ...meals]);
              setShowLogModal(false);
            }}
            onAddActivity={(actObj) => {
              setActivities([actObj, ...activities]);
              setShowLogModal(false);
            }}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24">
          {activeTab === 'home' && (
            <HomeScreen
              userProfile={userProfile}
              recentGlucose={recentGlucose}
              tirStats={tirStats}
              dailyTasks={dailyTasks}
              completedTasksCount={completedTasksCount}
              totalTasksCount={totalTasksCount}
              taskProgressPct={taskProgressPct}
              medications={medications}
              onToggleTask={toggleTask}
              onToggleMed={toggleMedication}
              onOpenLog={(type) => {
                setLogType(type);
                setShowLogModal(true);
              }}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'track' && (
            <TrackCenterScreen
              userProfile={userProfile}
              selectedSubTab={selectedTrackTab}
              onChangeSubTab={setSelectedTrackTab}
              glucoseLogs={glucoseLogs}
              medications={medications}
              meals={meals}
              activities={activities}
              vitals={vitals}
              footCheckDone={footCheckDoneToday}
              onToggleFootCheck={() => setFootCheckDoneToday(!footCheckDoneToday)}
              onToggleMed={toggleMedication}
              onOpenLog={(type) => {
                setLogType(type);
                setShowLogModal(true);
              }}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsScreen
              glucoseLogs={glucoseLogs}
              tirStats={tirStats}
              userProfile={userProfile}
              medications={medications}
              activities={activities}
              onOpenCareReport={() => setActiveTab('reportModal')}
            />
          )}

          {activeTab === 'learn' && (
            <LearnAcademyScreen
              userProfile={userProfile}
              lessons={ACADEMY_LESSONS}
              selectedCategory={selectedAcademyCategory}
              onSelectCategory={setSelectedAcademyCategory}
              onAskAssistant={(question) => {
                setActiveTab('chat');
                handleSendMessage(question);
              }}
            />
          )}

          {activeTab === 'chat' && (
            <ChatAssistantScreen
              messages={chatMessages}
              inputVal={chatInput}
              onInputChange={setChatInput}
              onSend={handleSendMessage}
              isLoading={isAiLoading}
              userProfile={userProfile}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              userProfile={userProfile}
              onUpdateProfile={setUserProfile}
              onBack={() => setActiveTab('home')}
              onResetOnboarding={() => {
                setIsOnboardingCompleted(false);
                setOnboardingStep(1);
              }}
            />
          )}

          {activeTab === 'reportModal' && (
            <ClinicalReportModal
              userProfile={userProfile}
              glucoseLogs={glucoseLogs}
              tirStats={tirStats}
              medications={medications}
              vitals={vitals}
              onClose={() => setActiveTab('insights')}
            />
          )}
        </main>

        {/* Bottom Persistent Navigation Bar */}
        <nav className="fixed bottom-0 max-w-md w-full bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-3 py-1.5 flex justify-around items-center">
          <NavButton
            icon={<Home className="w-5 h-5" />}
            label="Home"
            isActive={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavButton
            icon={<Activity className="w-5 h-5" />}
            label="Track"
            isActive={activeTab === 'track'}
            onClick={() => setActiveTab('track')}
          />
          <NavButton
            icon={<TrendingUp className="w-5 h-5" />}
            label="Insights"
            isActive={activeTab === 'insights'}
            onClick={() => setActiveTab('insights')}
          />
          <NavButton
            icon={<BookOpen className="w-5 h-5" />}
            label="Learn"
            isActive={activeTab === 'learn'}
            onClick={() => setActiveTab('learn')}
          />
          <NavButton
            icon={<MessageSquare className="w-5 h-5" />}
            label="Guide AI"
            isActive={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
          />
        </nav>
      </div>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
        isActive ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
      }`}
    >
      <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] mt-0.5 tracking-tight">{label}</span>
      {isActive && <div className="w-1 h-1 bg-teal-600 rounded-full mt-0.5" />}
    </button>
  );
}

function HomeScreen({
  userProfile,
  recentGlucose,
  tirStats,
  dailyTasks,
  completedTasksCount,
  totalTasksCount,
  taskProgressPct,
  medications,
  onToggleTask,
  onToggleMed,
  onOpenLog,
  onNavigate
}) {
  const isTargetGood = recentGlucose.value >= 70 && recentGlucose.value <= 140;

  return (
    <div className="p-4 space-y-4">
      {/* Personalized Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-medium block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {userProfile.name}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>4-Day Consistency</span>
        </div>
      </div>

      {/* Hero Glucose Status Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-lg relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Latest Glucose • {recentGlucose.context}</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight">{recentGlucose.value}</span>
              <span className="text-sm font-medium text-slate-300">{userProfile.units}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ml-1 ${
                isTargetGood ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {isTargetGood ? 'In Your Target' : 'Check Meal Notes'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenLog('glucose')}
            className="p-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Log
          </button>
        </div>

        {/* Mini 7-Day Sparkline / TIR Bar */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">7-Day TIR:</span>
            <span className="font-bold text-teal-300">{tirStats.inRange}% in range</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('insights')}
            className="text-[11px] text-teal-300 hover:text-white flex items-center gap-0.5"
          >
            View Trend <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Today's Plan Progress */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Today's Daily Plan</h2>
            <p className="text-[11px] text-slate-500">Achievable steps aligned with your care priorities</p>
          </div>
          <div className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
            {completedTasksCount} of {totalTasksCount} done
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-teal-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${taskProgressPct}%` }}
          />
        </div>

        {/* Task List */}
        <div className="space-y-1.5 pt-1">
          {dailyTasks.map(task => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                task.completed
                  ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-teal-300'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-medium">
                <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                  task.completed ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-800'}>
                  {task.title}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 capitalize">{task.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Attention & Insights Card */}
      <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-2xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-xs font-bold text-sky-900">Pattern Insight from Your Logs</div>
          <p className="text-[11px] text-sky-800 leading-relaxed">
            Your afternoon glucose was 24 mg/dL lower on days when a 15-minute walk was recorded after lunch. Keep up the gentle movement!
          </p>
        </div>
      </div>

      {/* Quick Medication Adherence Strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold text-slate-900">Medication Routine</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('track')}
            className="text-[11px] text-teal-600 font-semibold"
          >
            Manage
          </button>
        </div>
        <div className="space-y-2">
          {medications.map(med => (
            <div key={med.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="font-semibold text-slate-800">{med.name}</span>
                <span className="text-slate-500 ml-1.5">({med.dose})</span>
                <span className="block text-[10px] text-slate-400">{med.timing}</span>
              </div>
              <button
                type="button"
                onClick={() => onToggleMed(med.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  med.taken
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {med.taken ? 'Taken ✓' : 'Mark Taken'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preventive Foot Check Reminder */}
      <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Daily 60-Second Foot Check</div>
            <div className="text-[10px] text-slate-500">Inspect for cuts, redness, or pressure marks</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('track')}
          className="text-xs font-semibold px-2.5 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Check
        </button>
      </div>
    </div>
  );
}

function TrackCenterScreen({
  userProfile,
  selectedSubTab,
  onChangeSubTab,
  glucoseLogs,
  medications,
  meals,
  activities,
  vitals,
  footCheckDone,
  onToggleFootCheck,
  onToggleMed,
  onOpenLog
}) {
  return (
    <div className="p-4 space-y-4">
      {/* Sub-tab Pill Switcher */}
      <div className="flex space-x-1.5 p-1 bg-slate-200/80 rounded-xl overflow-x-auto text-xs font-medium scrollbar-none">
        {[
          { id: 'glucose', label: 'Glucose' },
          { id: 'food', label: 'Meals' },
          { id: 'meds', label: 'Meds' },
          { id: 'activity', label: 'Activity' },
          { id: 'vitals', label: 'Vitals & Care' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeSubTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedSubTab === tab.id
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tab 1: Glucose Logs & CGM metrics */}
      {selectedSubTab === 'glucose' && (
        <div className="space-y-4">
          {/* Header Action */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Glucose History</h2>
              <p className="text-[11px] text-slate-500">Target Range: 70–140 {userProfile.units}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenLog('glucose')}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Record Reading
            </button>
          </div>

          {/* Time In Range Visual Strip */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Time in Range (7 Days)</span>
              <span className="text-teal-700 font-bold">82% In Target</span>
            </div>
            <div className="h-3 w-full flex rounded-full overflow-hidden bg-slate-100">
              <div style={{ width: '4%' }} className="bg-amber-400" title="Low (<70)" />
              <div style={{ width: '82%' }} className="bg-emerald-500" title="In Range (70-140)" />
              <div style={{ width: '14%' }} className="bg-rose-400" title="High (>140)" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 pt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Low: 4%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> In Range: 82%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> High: 14%</span>
            </div>
          </div>

          {/* Reading Cards */}
          <div className="space-y-2">
            {glucoseLogs.map(log => {
              const isNormal = log.value >= 70 && log.value <= 140;
              const isLow = log.value < 70;
              return (
                <div key={log.id} className="p-3 bg-white rounded-xl border border-slate-200/90 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-bold ${
                      isLow ? 'bg-amber-100 text-amber-800' : isNormal ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                    }`}>
                      <span className="text-sm leading-none">{log.value}</span>
                      <span className="text-[9px] font-normal opacity-80">{log.unit}</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{log.context}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {log.notes && <span>• {log.notes}</span>}
                      </div>
                      {log.tags && log.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {log.tags.map((tg, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px]">
                              {tg}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isLow ? 'bg-amber-100 text-amber-800' : isNormal ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isLow ? 'Low (<70)' : isNormal ? 'In Target' : 'Elevated'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Food & Plate Method */}
      {selectedSubTab === 'food' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Visual Plate & Meal Log</h2>
              <p className="text-[11px] text-slate-500">Balance carbs with protein & non-starchy fiber</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenLog('food')}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Log Meal
            </button>
          </div>

          {/* Interactive Plate Method Visualizer */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-teal-600" /> ADA Plate Proportion Guide
            </h3>
            
            {/* Visual Plate Representation */}
            <div className="w-48 h-48 mx-auto rounded-full border-4 border-slate-200 relative overflow-hidden shadow-inner flex flex-col">
              {/* Half Non-Starchy Vegetables */}
              <div className="h-1/2 bg-emerald-100 border-b-2 border-slate-200 flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[11px] font-bold text-emerald-900">½ Vegetables</span>
                <span className="text-[9px] text-emerald-700">Spinach, Cucumber, Salad, Broccoli</span>
              </div>
              {/* Lower Half Split: Quarter Carbs, Quarter Protein */}
              <div className="h-1/2 flex">
                <div className="w-1/2 bg-amber-100 border-r-2 border-slate-200 flex flex-col items-center justify-center p-1 text-center">
                  <span className="text-[10px] font-bold text-amber-900">¼ Carbs</span>
                  <span className="text-[8px] text-amber-700">1 Roti, Daal, Brown Rice</span>
                </div>
                <div className="w-1/2 bg-sky-100 flex flex-col items-center justify-center p-1 text-center">
                  <span className="text-[10px] font-bold text-sky-900">¼ Protein</span>
                  <span className="text-[8px] text-sky-700">Eggs, Fish, Chicken, Tofu</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Filling half your plate with leafy greens slows carbohydrate digestion without extreme restriction.
            </p>
          </div>

          {/* Regional Pakistani & Global Food Search Context */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Regional Food Guidance (No Shaming)</h4>
            <div className="space-y-1.5">
              {REGIONAL_FOOD_DB.slice(0, 4).map((f, idx) => (
                <div key={idx} className="p-2 bg-white rounded-lg border border-slate-100 text-xs">
                  <div className="font-semibold text-slate-800">{f.name}</div>
                  <div className="text-[10px] text-teal-700 font-medium">{f.carbLevel}</div>
                  <div className="text-[10px] text-slate-500">{f.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Medications */}
      {selectedSubTab === 'meds' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Medication Schedule</h2>
              <p className="text-[11px] text-slate-500">Record adherence according to your doctor's prescription</p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Never change prescription dosages or insulin units on your own. Discuss schedule questions with Dr. Mahmood.</span>
          </div>

          <div className="space-y-2.5">
            {medications.map(med => (
              <div key={med.id} className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-sm font-bold text-slate-900">{med.name}</div>
                  <div className="text-xs text-teal-700 font-medium">{med.dose} • {med.timing}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Prescribed for: {med.prescribedFor}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleMed(med.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    med.taken
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                  }`}
                >
                  {med.taken ? 'Taken ✓' : 'Mark Taken'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 4: Activity & Exercise */}
      {selectedSubTab === 'activity' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Activity Tracker</h2>
              <p className="text-[11px] text-slate-500">Weekly Goal: 150 minutes moderate movement</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenLog('activity')}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Record Activity
            </button>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Movement helps muscles clear glucose independently of insulin. Stay well-hydrated and carry fast-acting glucose if taking medications with hypoglycemia risk.
            </span>
          </div>

          <div className="space-y-2">
            {activities.map(act => (
              <div key={act.id} className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{act.type}</div>
                  <div className="text-[11px] text-slate-500">{act.duration} minutes • Intensity: {act.intensity}</div>
                  {act.preGlucose && act.postGlucose && (
                    <div className="text-[10px] text-teal-700 mt-1 font-medium">
                      Pre: {act.preGlucose} → Post: {act.postGlucose} mg/dL (Effect: -{act.preGlucose - act.postGlucose})
                    </div>
                  )}
                </div>
                <div className="text-right text-xs font-bold text-slate-700">
                  {act.duration} min
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 5: Vitals, Labs & Preventive Screening */}
      {selectedSubTab === 'vitals' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Vitals, Labs & Care Screenings</h2>
            <p className="text-[11px] text-slate-500">Long-term benchmarks recommended by the ADA 2026 Standards</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Latest A1C</span>
              <div className="text-xl font-black text-slate-900">{vitals.a1c}</div>
              <span className="text-[10px] text-slate-400 block">{vitals.a1cDate}</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Blood Pressure</span>
              <div className="text-xl font-black text-slate-900">{vitals.bpSystolic}/{vitals.bpDiastolic}</div>
              <span className="text-[10px] text-emerald-600 font-semibold block">Clinician Target: &lt;130/80</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Body Weight</span>
              <div className="text-xl font-black text-slate-900">{vitals.weightKg} kg</div>
              <span className="text-[10px] text-slate-400 block">Steady over 30 days</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Kidney eGFR</span>
              <div className="text-xl font-black text-slate-900">{vitals.egfr}</div>
              <span className="text-[10px] text-emerald-600 font-semibold block">Normal filtration</span>
            </div>
          </div>

          {/* Preventive Foot Check Card */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900">Today's Foot Inspection</div>
              <p className="text-[10px] text-slate-500">Check for numbness, cuts, or calluses</p>
            </div>
            <button
              type="button"
              onClick={onToggleFootCheck}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                footCheckDone ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-teal-600 text-white'
              }`}
            >
              {footCheckDone ? 'Completed ✓' : 'Mark Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InsightsScreen({ glucoseLogs, tirStats, userProfile, medications, activities, onOpenCareReport }) {
  const [timeRange, setTimeRange] = useState('7D'); // '7D' | '14D' | '30D'

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-base font-extrabold text-slate-900">Trends & Insights</h1>
          <p className="text-xs text-slate-500">Descriptive patterns to review with your clinician</p>
        </div>
        <button
          type="button"
          onClick={onOpenCareReport}
          className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs"
        >
          <FileText className="w-3.5 h-3.5" /> Doctor Report
        </button>
      </div>

      {/* Time Filter Buttons */}
      <div className="flex space-x-2 bg-slate-200/80 p-1 rounded-xl text-xs font-medium">
        {['7D', '14D', '30D'].map(tr => (
          <button
            key={tr}
            type="button"
            onClick={() => setTimeRange(tr)}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              timeRange === tr ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            {tr === '7D' ? '7 Days' : tr === '14D' ? '14 Days' : '30 Days'}
          </button>
        ))}
      </div>

      {/* Descriptive Trend Chart Visual */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-800">Average Glucose</span>
          <span className="text-teal-700 font-extrabold text-sm">{tirStats.avg} {userProfile.units}</span>
        </div>

        {/* SVG Glucose Trend Line with Target Range Band */}
        <div className="w-full h-36 bg-slate-50 rounded-xl p-2 relative flex items-end justify-between border border-slate-100">
          {/* Target Zone Highlight */}
          <div className="absolute top-[30%] bottom-[30%] left-0 right-0 bg-emerald-500/10 border-y border-emerald-500/20 pointer-events-none flex items-center justify-end px-2">
            <span className="text-[9px] font-bold text-emerald-800 bg-white/80 px-1 rounded">Target 70–140</span>
          </div>

          {/* Simple Simulated Bar Chart of Recent Daily Averages */}
          {[112, 104, 138, 98, 126, 118, 108].map((val, idx) => {
            const heightPct = Math.min(100, Math.max(20, ((val - 60) / 140) * 100));
            const inRange = val >= 70 && val <= 140;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 z-10">
                <span className="text-[9px] font-semibold text-slate-600">{val}</span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-4 rounded-t-md transition-all ${
                    inRange ? 'bg-teal-600' : 'bg-amber-400'
                  }`}
                />
                <span className="text-[8px] text-slate-400">D{idx + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Descriptive Observation Cards (No shaming, non-causal) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Observed Patterns</h3>
        
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Fasting Stability</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Your morning readings over the past 7 days stayed between 98 and 108 {userProfile.units}. This demonstrates consistent overnight stability.
          </p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Info className="w-4 h-4 text-amber-600" />
            <span>Post-Dinner Variation</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Post-dinner readings exhibited more variability on days with later dinner times. Consider discussing this schedule timing with your dietitian.
          </p>
        </div>
      </div>
    </div>
  );
}

function LearnAcademyScreen({ userProfile, lessons, selectedCategory, onSelectCategory, onAskAssistant }) {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const categories = ['All', 'Foundations', 'Nutrition', 'Safety', 'Activity', 'Preventive Care'];

  const filteredLessons = lessons.filter(l => {
    if (selectedCategory !== 'All' && l.category !== selectedCategory) return false;
    return l.forTypes.includes(userProfile.diabetesType);
  });

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-base font-extrabold text-slate-900">Diabetes Academy</h1>
        <p className="text-xs text-slate-500">Short, evidence-based lessons citing ADA & NIDDK guidelines</p>
      </div>

      {/* Category Horizontal Filter */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs font-medium scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white font-bold'
                : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lesson List */}
      <div className="space-y-2.5">
        {filteredLessons.map(lesson => (
          <div
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson)}
            className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 cursor-pointer transition shadow-2xs space-y-1.5"
          >
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-bold text-teal-700 uppercase tracking-wider">{lesson.category}</span>
              <span className="text-slate-400">{lesson.readTime}</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 leading-snug">{lesson.title}</h3>
            <p className="text-[11px] text-slate-500 line-clamp-2">{lesson.summary}</p>
          </div>
        ))}
      </div>

      {/* Lesson Reader Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                {selectedLesson.category}
              </span>
              <button
                type="button"
                onClick={() => setSelectedLesson(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-base font-bold text-slate-900 leading-snug">{selectedLesson.title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{selectedLesson.summary}</p>

            <div className="p-3 bg-teal-50/80 border border-teal-200/80 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-teal-900 uppercase">Key Takeaway</span>
              <p className="text-xs text-teal-800 leading-relaxed">{selectedLesson.takeaway}</p>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Evidence Source: {selectedLesson.source}</span>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const q = `Can you explain more about ${selectedLesson.title}?`;
                  setSelectedLesson(null);
                  onAskAssistant(q);
                }}
                className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold"
              >
                Ask Assistant About This
              </button>
              <button
                type="button"
                onClick={() => setSelectedLesson(null)}
                className="py-2 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatAssistantScreen({ messages, inputVal, onInputChange, onSend, isLoading, userProfile }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    "Why is glucose often higher in the morning?",
    "How does a 15-minute walk help after eating?",
    "What should I ask my doctor at my next visit?",
    "Explain what A1C means in simple terms."
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] bg-slate-50">
      {/* Assistant Header Info */}
      <div className="p-3 bg-white border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
            GG
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">GlucoGuide Assistant</h2>
            <span className="text-[10px] text-slate-500">Evidence-informed self-management education</span>
          </div>
        </div>
        <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
          Not a Doctor
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-br-xs shadow-xs'
                  : msg.isEmergency
                  ? 'bg-red-50 text-red-900 border border-red-300 rounded-bl-xs shadow-sm font-medium'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
              }`}
            >
              {msg.text}

              {msg.sources && (
                <div className="mt-2 pt-1.5 border-t border-slate-100 text-[9px] text-slate-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-slate-400" />
                  <span>Sources: {msg.sources.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
            <span>Consulting clinical education guidelines...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Quick Inquiries */}
      <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex space-x-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSend(qp)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] whitespace-nowrap transition font-medium"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="Ask about routines, carbs, or doctor questions..."
          className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="button"
          onClick={() => onSend()}
          disabled={!inputVal.trim() || isLoading}
          className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function QuickLogModal({ units, onClose, onAddGlucose, onAddMeal, onAddActivity }) {
  const [logTab, setLogTab] = useState('glucose'); // 'glucose' | 'meal' | 'activity'

  // Glucose inputs
  const [glucoseVal, setGlucoseVal] = useState('115');
  const [context, setContext] = useState('After Lunch');
  const [notes, setNotes] = useState('');

  // Meal inputs
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('Lunch');

  // Activity inputs
  const [actType, setActType] = useState('Walking');
  const [duration, setDuration] = useState('15');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-900">Record Health Entry</h2>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['glucose', 'meal', 'activity'].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setLogTab(tab)}
              className={`flex-1 py-1.5 rounded-lg capitalize transition ${
                logTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {logTab === 'glucose' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Reading ({units})</label>
              <input
                type="number"
                value={glucoseVal}
                onChange={(e) => setGlucoseVal(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Context</label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
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
              <label className="text-xs font-semibold text-slate-700">Notes & Tags</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 15-min walk, light meal"
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <button
              type="button"
              onClick={() => onAddGlucose(glucoseVal, context, notes ? [notes] : [], notes)}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Save Glucose Entry
            </button>
          </div>
        )}

        {logTab === 'meal' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">What did you eat?</label>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g. 1 Roti, Daal & Cucumber Salad"
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!mealName.trim()) return;
                onAddMeal({
                  id: 'f_' + Date.now(),
                  mealType: mealType,
                  name: mealName,
                  carbs: 'Balanced',
                  plateBalanced: true,
                  time: 'Just now'
                });
              }}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold"
            >
              Save Meal
            </button>
          </div>
        )}

        {logTab === 'activity' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Activity Type</label>
              <select
                value={actType}
                onChange={(e) => setActType(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option>Post-Meal Walking</option>
                <option>Gentle Mobility / Stretching</option>
                <option>Cycling / Stationary Bike</option>
                <option>Resistance / Light Strength</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Duration (Minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                onAddActivity({
                  id: 'a_' + Date.now(),
                  type: actType,
                  duration: Number(duration) || 15,
                  intensity: 'Moderate',
                  preGlucose: null,
                  postGlucose: null,
                  notes: 'Recorded in quick log'
                });
              }}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold"
            >
              Save Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ClinicalReportModal({ userProfile, glucoseLogs, tirStats, medications, vitals, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Doctor Visit Summary</h2>
            <span className="text-[10px] text-slate-500">Prepared for {userProfile.doctor.name}</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs space-y-3 text-slate-700">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Patient Overview</div>
            <div>Name: {userProfile.name} • Diagnosis: {userProfile.diabetesType}</div>
            <div>Latest A1C: {vitals.a1c} ({vitals.a1cDate})</div>
            <div>Current BP: {vitals.bpSystolic}/{vitals.bpDiastolic} mmHg</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Glucose Metric Summary (7-Day)</div>
            <div>Time-In-Range (70-140): <span className="font-bold text-teal-700">{tirStats.inRange}%</span></div>
            <div>Time-Below-Range (&lt;70): <span className="font-bold text-amber-700">{tirStats.low}%</span></div>
            <div>Mean Glucose: {tirStats.avg} {userProfile.units}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Current Prescribed Regimen</div>
            {medications.map(m => (
              <div key={m.id} className="text-[11px]">• {m.name} {m.dose} ({m.timing})</div>
            ))}
          </div>

          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 space-y-1 text-[11px] text-teal-900">
            <div className="font-bold">Prepared Discussion Questions:</div>
            <div>1. Are my post-dinner glucose readings within our preferred range?</div>
            <div>2. Should we schedule the annual comprehensive dilated eye exam?</div>
            <div>3. Does my current physical activity program align with my cardiorenal plan?</div>
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={() => {
              window.print();
            }}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF / Print
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ userProfile, onUpdateProfile, onBack, onResetOnboarding }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onBack} className="p-1 text-slate-500 hover:text-slate-800">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-extrabold text-slate-900">Account & Profile Settings</h1>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Clinical Preferences</h2>
        
        <div>
          <label className="text-xs text-slate-600 block mb-1">Display Unit</label>
          <div className="grid grid-cols-2 gap-2">
            {['mg/dL', 'mmol/L'].map(u => (
              <button
                key={u}
                type="button"
                onClick={() => onUpdateProfile({ ...userProfile, units: u })}
                className={`py-2 rounded-xl text-xs font-bold border ${
                  userProfile.units === u ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-600 block mb-1">Assigned Healthcare Team</label>
          <input
            type="text"
            value={userProfile.doctor.name}
            onChange={(e) => onUpdateProfile({ ...userProfile, doctor: { ...userProfile.doctor, name: e.target.value } })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div>
          <label className="text-xs text-slate-600 block mb-1">Emergency Contact</label>
          <input
            type="text"
            value={userProfile.emergencyContact.name + ' (' + userProfile.emergencyContact.phone + ')'}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Medical Ethics & Safety</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {MEDICAL_DISCLAIMER_TEXT}
        </p>

        <button
          type="button"
          onClick={onResetOnboarding}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
        >
          Re-run Onboarding Survey
        </button>
      </div>
    </div>
  );
}