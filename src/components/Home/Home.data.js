export const featureItems = [
  {
    icon: "👩‍🏫",
    iconClass: "sp-feature-icon--gold",
    title: "Teacher Assigns",
    description:
      "Teachers create and assign homework tasks to students with clear instructions, deadlines, and ABRSM-specific practice goals.",
  },
  {
    icon: "🎵",
    iconClass: "sp-feature-icon--sage",
    title: "Student Completes",
    description:
      "Students access their assignments, complete tasks, and submit their work through the platform with built-in practice tracking.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    iconClass: "sp-feature-icon--rose",
    title: "Parent Monitors",
    description:
      "Parents stay informed with real-time progress updates, detailed performance insights, and visual reports after each lesson.",
  },
];

export const skillItems = [
  {
    name: "Scales & Arpeggios",
    status: "PASS",
    value: "87%",
    pct: 87,
    fail: false,
  },
  {
    name: "Pieces",
    status: "PASS",
    value: "74%",
    pct: 74,
    fail: false,
  },
  {
    name: "Sight Reading",
    status: "FAIL",
    value: "52%",
    pct: 52,
    fail: true,
  },
  {
    name: "Aural Skills",
    status: "FAIL",
    value: "48%",
    pct: 48,
    fail: true,
  },
];

export const practiceItems = [
  {
    time: "20",
    unit: "Minutes Daily",
    result: "10 Years to Mastery",
    details: ["121 hours per year", "Achievable for everyone"],
    featured: false,
  },
  {
    time: "40",
    unit: "Minutes Daily",
    result: "5 Years to Mastery",
    details: ["243 hours per year", "Accelerated progress"],
    featured: true,
  },
  {
    time: "60",
    unit: "Minutes Daily",
    result: "3.3 Years to Mastery",
    details: ["365 hours per year", "Rapid mastery track"],
    featured: false,
  },
];

export const testimonialItems = [
  {
    text: "StudioPulse has revolutionized how I manage ABRSM preparation. I can track each student's progress in real-time and parents are always informed. The visual reports after lessons are incredible!",
    initials: "Ms. O",
    name: "Ms. Okafor",
    role: "Piano Teacher, ABRSM Specialist",
  },
  {
    text: "Finally, a platform that keeps me connected to Emma's piano progress! I can see exactly what she's working on for her Grade 4 exam and communicate directly with her teacher.",
    initials: "S",
    name: "Sarah Chen",
    role: "Mother of Emma (Grade 4 Piano)",
  },
  {
    text: "As a violin teacher, StudioPulse saves me hours each week. Creating assignments is effortless, and the progress tracking helps me prepare students more efficiently for their ABRSM exams.",
    initials: "D",
    name: "David Martinez",
    role: "Violin Teacher & Examiner",
  },
  {
    text: "The homework tracking has been a game-changer. Sophie actually reminds ME about her practice time now! She loves checking off completed exercises and seeing her ABRSM progress.",
    initials: "A",
    name: "Amanda Thompson",
    role: "Mother of Sophie (Grade 2 Piano)",
  },
];

export const pricingItems = [
  {
    plan: "Essentials",
    price: "$15",
    period: "per child / month",
    featured: false,
    features: [
      "Progress tracking dashboard",
      "Basic homework assignments",
      "Monthly progress reports",
      "Email teacher communication",
      "Practice reminders",
    ],
  },
  {
    plan: "Professional",
    price: "$25",
    period: "per child / month",
    featured: true,
    features: [
      "Everything in Essentials",
      "Interactive practice tools",
      "Real-time messaging",
      "Detailed skill assessments",
      "Parent-teacher video calls",
      "Custom learning goals",
      "Priority support",
    ],
  },
  {
    plan: "Family",
    price: "$40",
    period: "up to 3 children / month",
    featured: false,
    features: [
      "Everything in Professional",
      "Multi-child dashboard",
      "Family progress insights",
      "Shared calendar",
      "Bulk homework management",
      "Family practice challenges",
    ],
  },
];
