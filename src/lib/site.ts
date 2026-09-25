/**
 * Single source of truth for every piece of content on the site.
 *
 * Edit THIS file to update class times, institutes, fees, photos and contact
 * details — no component changes needed.
 */

export type Bi = { si: string; en: string };

export const site = {
  brand: {
    si: "NextGen ICT",
    en: "NextGen ICT",
  },
  tutor: {
    name: { si: "සුභාෂණ කරුණානායක", en: "Subhashana Karunanayake" },
    role: {
      si: "උසස් පෙළ තොරතුරු හා සන්නිවේදන තාක්ෂණය (ICT) ගුරුවරයා",
      en: "GCE A/L Information & Communication Technology Teacher",
    },
    /** Same line without the "teacher" word — used under the hero portrait. */
    subject: {
      si: "උසස් පෙළ තොරතුරු හා සන්නිවේදන තාක්ෂණය (ICT)",
      en: "GCE A/L Information & Communication Technology",
    },
    /** Printed on the official class posters. */
    qualification: { si: "BET (Hons) WUSL", en: "BET (Hons) WUSL" },
    tagline: {
      si: "හීනය A එකක් නම් - ගමන මෙතනින් පටන් ගන්න.",
      en: "If the dream is an A - the journey starts here.",
    },
  },
  phone: "0761140551",
  phoneDisplay: "076 114 0551",
  /** International format used for WhatsApp deep links. */
  whatsappNumber: "94761140551",
  facebook:
    "https://web.facebook.com/people/NextGen-ICT-with-Subhashana/61579961380323/",
  tiktok: "https://www.tiktok.com/@chamindu_subhashana",
  tiktokHandle: "chamindu_subhashana",
  location: { si: "කුලියාපිටිය, ශ්‍රී ලංකාව", en: "Kuliyapitiya, Sri Lanka" },
  medium: { si: "සිංහල මාධ්‍යය", en: "Sinhala medium" },
};

/** Builds a WhatsApp deep link with a pre-filled message. */
export function waLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const telLink = `tel:+${site.whatsappNumber}`;

/* ------------------------------------------------------------------ */
/*  Classes                                                            */
/*                                                                     */
/*  The weekly timetable is built from three lists: batches (who),     */
/*  venues (where) and sessions (when). To change a class time, edit   */
/*  its row in `sessions` - every section on the page follows.         */
/* ------------------------------------------------------------------ */

/** Monday = 0 … Sunday = 6. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type BatchId = "al-2027" | "al-2028" | "ol-11" | "ol-10";

export type Batch = {
  id: BatchId;
  level: "al" | "ol";
  /** Short name for chips, calendar blocks and the legend. */
  name: Bi;
  kind: Bi;
  title: Bi;
  desc: Bi;
  highlights: Bi[];
};

export type VenueId = "science-center" | "samadhi" | "vidupiyasa" | "dakma";

export type Venue = { id: VenueId; institute: Bi; town: Bi };

/** One weekly session, with its display strings already worked out. */
export type ClassInfo = {
  id: string;
  batch: Batch;
  venue: Venue;
  /** Extra tag inside a batch, e.g. "Group 1" or "Paper class". */
  label?: Bi;
  dayIndex: Weekday;
  /** Minutes from midnight. */
  start: number;
  end: number;
  title: Bi;
  institute: Bi;
  town: Bi;
  day: Bi;
  time: Bi;
};

export const days: { short: Bi; long: Bi }[] = [
  { short: { si: "සඳු", en: "Mon" }, long: { si: "සඳුදා", en: "Monday" } },
  { short: { si: "අඟ", en: "Tue" }, long: { si: "අඟහරුවාදා", en: "Tuesday" } },
  { short: { si: "බදා", en: "Wed" }, long: { si: "බදාදා", en: "Wednesday" } },
  {
    short: { si: "බ්‍රහ", en: "Thu" },
    long: { si: "බ්‍රහස්පතින්දා", en: "Thursday" },
  },
  { short: { si: "සිකු", en: "Fri" }, long: { si: "සිකුරාදා", en: "Friday" } },
  { short: { si: "සෙන", en: "Sat" }, long: { si: "සෙනසුරාදා", en: "Saturday" } },
  { short: { si: "ඉරි", en: "Sun" }, long: { si: "ඉරිදා", en: "Sunday" } },
];

export const batches: Batch[] = [
  {
    id: "al-2027",
    level: "al",
    name: { si: "2027 A/L", en: "2027 A/L" },
    kind: { si: "Revision + Paper", en: "Revision + Paper" },
    title: { si: "2027 A/L ICT", en: "2027 A/L ICT" },
    desc: {
      si: "සම්පූර්ණ syllabus එක නැවත ගැඹුරින්, සෑම පාඩමකටම structured paper සාකච්ඡාවක් සමඟ. A සාමාර්ථයක් ඉලක්ක කරන සිසුන්ට අනිවාර්ය පන්තියකි.",
      en: "The full syllabus revisited in depth, with a structured paper discussion after every unit. Built for students targeting an A pass.",
    },
    highlights: [
      { si: "සෑම පාඩමකටම past paper සාකච්ඡාව", en: "Past paper discussion per unit" },
      { si: "Model paper + marking scheme", en: "Model papers + marking schemes" },
      { si: "නොමිලේ short note", en: "Free short notes" },
    ],
  },
  {
    id: "al-2028",
    level: "al",
    name: { si: "2028 A/L", en: "2028 A/L" },
    kind: { si: "Theory", en: "Theory" },
    title: { si: "2028 A/L ICT", en: "2028 A/L ICT" },
    desc: {
      si: "මුල සිට පියවරෙන් පියවර. ප්‍රායෝගික උදාහරණ, Python කේතන සහ මාසික tute සමඟ සම්පූර්ණ විෂය නිර්දේශය.",
      en: "From the very first lesson, step by step. Full syllabus coverage with practical examples, Python coding and monthly tutes.",
    },
    highlights: [
      { si: "මුල සිට ඉගැන්වීම", en: "Taught from scratch" },
      { si: "මාසික tute සහ පරීක්ෂණ", en: "Monthly tutes & tests" },
    ],
  },
  {
    id: "ol-11",
    level: "ol",
    name: { si: "O/L 11 ශ්‍රේණිය", en: "O/L Grade 11" },
    kind: { si: "Theory + Paper", en: "Theory + Paper" },
    title: { si: "11 ශ්‍රේණිය - O/L ICT", en: "Grade 11 - O/L ICT" },
    desc: {
      si: "සතිය මැද තියරි කණ්ඩායම් දෙකක් සහ සඳුදා ප්‍රශ්න පත්‍ර පන්තිය. සාමාන්‍ය පෙළ ICT විෂයට A සාමාර්ථයක් සඳහා අවශ්‍ය පුහුණුව, කෙටි සටහන් සහ පිළිතුරු ලිවීමේ ක්‍රම.",
      en: "Two weekday theory groups plus a Monday paper class. Exam-focused practice, short notes and answer-writing technique for O/L ICT.",
    },
    highlights: [
      { si: "Past paper 15+ ක් අවසන් කිරීම", en: "15+ past papers completed" },
      { si: "පිළිතුරු ලිවීමේ ක්‍රමවේදය", en: "Answer-writing method" },
      { si: "Paper පන්ති ගාස්තුව රු. 250/=", en: "Paper class fee Rs. 250/=" },
    ],
  },
  {
    id: "ol-10",
    level: "ol",
    name: { si: "O/L 10 ශ්‍රේණිය", en: "O/L Grade 10" },
    kind: { si: "Theory", en: "Theory" },
    title: { si: "10 ශ්‍රේණිය - O/L ICT", en: "Grade 10 - O/L ICT" },
    desc: {
      si: "සාමාන්‍ය පෙළ ICT මුල සිටම නිවැරදිව. සෑම පාඩමකටම පැහැදිලි පදනමක් සහ tute සමඟ 11 ශ්‍රේණියට සූදානම් වීම.",
      en: "O/L ICT started the right way. Clear foundations for every unit, with tutes, ready for Grade 11.",
    },
    highlights: [
      { si: "මුල සිට ඉගැන්වීම", en: "Taught from scratch" },
      { si: "සෑම පාඩමකටම tute", en: "A tute for every unit" },
    ],
  },
];

export const venues: Venue[] = [
  {
    id: "science-center",
    institute: { si: "Science Center", en: "Science Center" },
    town: { si: "කුලියාපිටිය", en: "Kuliyapitiya" },
  },
  {
    id: "samadhi",
    institute: { si: "සමාධි උසස් අධ්‍යාපන ආයතනය", en: "Samadhi Higher Education Institute" },
    town: { si: "මාකඳුර", en: "Makandura" },
  },
  {
    id: "vidupiyasa",
    institute: { si: "විදුපියස", en: "Vidupiyasa" },
    town: { si: "නාත්තණ්ඩිය", en: "Naththandiya" },
  },
  {
    id: "dakma",
    institute: { si: "දක්ම", en: "Dakma" },
    town: { si: "පන්නල", en: "Pannala" },
  },
];

/** The finalised weekly timetable. Times are 24-hour "HH:MM". */
const sessions: {
  batch: BatchId;
  venue: VenueId;
  day: Weekday;
  from: string;
  to: string;
  label?: Bi;
}[] = [
  // Monday
  { batch: "al-2027", venue: "science-center", day: 0, from: "08:00", to: "15:00" },
  {
    batch: "ol-11",
    venue: "science-center",
    day: 0,
    from: "16:00",
    to: "21:00",
    label: { si: "Paper පන්තිය", en: "Paper class" },
  },
  // Tuesday
  { batch: "al-2028", venue: "vidupiyasa", day: 1, from: "15:00", to: "17:30" },
  { batch: "al-2027", venue: "samadhi", day: 1, from: "18:00", to: "23:00" },
  // Wednesday
  { batch: "ol-10", venue: "dakma", day: 2, from: "15:30", to: "18:00" },
  {
    batch: "ol-11",
    venue: "science-center",
    day: 2,
    from: "18:30",
    to: "20:30",
    label: { si: "2 කණ්ඩායම", en: "Group 2" },
  },
  // Thursday
  {
    batch: "ol-11",
    venue: "science-center",
    day: 3,
    from: "16:00",
    to: "18:00",
    label: { si: "1 කණ්ඩායම", en: "Group 1" },
  },
  // Friday
  { batch: "al-2028", venue: "samadhi", day: 4, from: "16:00", to: "18:30" },
  // Saturday - no classes
  // Sunday
  { batch: "al-2028", venue: "science-center", day: 6, from: "09:00", to: "11:30" },
  { batch: "ol-10", venue: "science-center", day: 6, from: "11:30", to: "13:30" },
];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** 900 -> { si: "ප.ව. 3.00", en: "3.00 p.m." } */
export function clockLabel(minutes: number): Bi {
  const h = Math.floor(minutes / 60) % 24;
  const m = String(minutes % 60).padStart(2, "0");
  const h12 = h % 12 || 12;
  const am = h < 12;
  return {
    si: `${am ? "පෙ.ව." : "ප.ව."} ${h12}.${m}`,
    en: `${h12}.${m} ${am ? "a.m." : "p.m."}`,
  };
}

export const classes: ClassInfo[] = sessions.map((s) => {
  const batch = batches.find((b) => b.id === s.batch)!;
  const venue = venues.find((v) => v.id === s.venue)!;
  const start = toMinutes(s.from);
  const end = toMinutes(s.to);
  const from = clockLabel(start);
  const to = clockLabel(end);
  return {
    id: `${s.batch}-${s.venue}-${s.day}-${s.from.replace(":", "")}`,
    batch,
    venue,
    label: s.label,
    dayIndex: s.day,
    start,
    end,
    title: {
      si: s.label ? `${batch.title.si} - ${s.label.si}` : batch.title.si,
      en: s.label ? `${batch.title.en} - ${s.label.en}` : batch.title.en,
    },
    institute: venue.institute,
    town: venue.town,
    day: days[s.day].long,
    time: { si: `${from.si} - ${to.si}`, en: `${from.en} - ${to.en}` },
  };
});

/** Sessions of one batch, in week order. */
export function sessionsOf(batch: BatchId) {
  return classes.filter((c) => c.batch.id === batch);
}

export const stats: { value: string; label: Bi }[] = [
  { value: "1000+", label: { si: "උගන්වා ඇති සිසුන්", en: "Students taught" } },
  { value: "4+", label: { si: "වසරක අත්දැකීම්", en: "Years of experience" } },
  { value: String(venues.length), label: { si: "පන්ති ආයතන", en: "Class locations" } },
  { value: "100%", label: { si: "Syllabus ආවරණය", en: "Syllabus coverage" } },
];

/** A/L ICT syllabus units (national syllabus, Sinhala medium). */
export const syllabus: { no: string; title: Bi; points: Bi }[] = [
  {
    no: "01",
    title: { si: "තොරතුරු හා සන්නිවේදන තාක්ෂණයේ සංකල්ප", en: "Concepts of ICT" },
    points: {
      si: "දත්ත හා තොරතුරු, තොරතුරු පද්ධති, ICT හි පරිණාමය",
      en: "Data & information, information systems, evolution of ICT",
    },
  },
  {
    no: "02",
    title: { si: "පරිගණක ඉතිහාසය", en: "Computer history" },
    points: {
      si: "ගණනය කිරීමේ උපාංගවල පරිණාමය, පරිගණක පරම්පරා, පරිගණක වර්ගීකරණය",
      en: "Evolution of computing devices, computer generations, classification of computers",
    },
  },
  {
    no: "03",
    title: { si: "පරිගණක පද්ධතියේ මූලිකාංග", en: "Fundamentals of a computer system" },
    points: {
      si: "දෘඩාංග, මෘදුකාංග, මතක ධුරාවලිය, CPU ක්‍රියාවලිය",
      en: "Hardware, software, memory hierarchy, CPU operation",
    },
  },
  {
    no: "04",
    title: { si: "දත්ත නිරූපණය", en: "Data representation" },
    points: {
      si: "සංඛ්‍යා පද්ධති, පරිවර්තන, ද්විමය අංක ගණිතය",
      en: "Number systems, conversions, binary arithmetic",
    },
  },
  {
    no: "05",
    title: { si: "තර්ක ද්වාර හා බූලීය වීජ ගණිතය", en: "Logic gates & Boolean algebra" },
    points: {
      si: "Truth tables, K-map, combinational පරිපථ",
      en: "Truth tables, K-maps, combinational circuits",
    },
  },
  {
    no: "06",
    title: { si: "මෙහෙයුම් පද්ධති", en: "Operating systems" },
    points: {
      si: "ක්‍රියාවලි කළමනාකරණය, මතක කළමනාකරණය, ගොනු පද්ධති",
      en: "Process management, memory management, file systems",
    },
  },
  {
    no: "07",
    title: { si: "පරිගණක ජාල", en: "Computer networks" },
    points: {
      si: "OSI/TCP-IP, IP ලිපින, subnetting, ජාල උපාංග",
      en: "OSI/TCP-IP, IP addressing, subnetting, network devices",
    },
  },
  {
    no: "08",
    title: { si: "ක්‍රමලේඛනය (Python & C)", en: "Programming (Python & C)" },
    points: {
      si: "Algorithm, flowchart, පාලන ව්‍යුහ, ශ්‍රිත",
      en: "Algorithms, flowcharts, control structures, functions",
    },
  },
  {
    no: "09",
    title: { si: "දත්ත සමුදාය", en: "Database management" },
    points: {
      si: "ER රූප, සාමාන්‍යකරණය, SQL විමසුම්",
      en: "ER diagrams, normalisation, SQL queries",
    },
  },
  {
    no: "10",
    title: { si: "වෙබ් සංවර්ධනය", en: "Web development" },
    points: { si: "HTML, CSS, PHP මූලිකාංග", en: "HTML, CSS, PHP basics" },
  },
  {
    no: "11",
    title: { si: "පද්ධති විශ්ලේෂණය හා නිර්මාණය", en: "System analysis & design" },
    points: {
      si: "SDLC, DFD, පද්ධති පරීක්ෂාව හා නඩත්තුව",
      en: "SDLC, DFDs, testing and maintenance",
    },
  },
  {
    no: "12",
    title: { si: "ව්‍යාපාරයේ ICT", en: "ICT in business" },
    points: {
      si: "e-commerce, ගෙවීම් ක්‍රම, ව්‍යාපාර ක්‍රියාවලි",
      en: "e-commerce, payment methods, business processes",
    },
  },
  {
    no: "13",
    title: { si: "නව ප්‍රවණතා හා ආරක්ෂාව", en: "New trends & ICT security" },
    points: {
      si: "Cloud, IoT, AI, cyber ආරක්ෂණය හා ආචාර ධර්ම",
      en: "Cloud, IoT, AI, cyber security and ethics",
    },
  },
];

export const whyUs: { icon: string; title: Bi; desc: Bi }[] = [
  {
    icon: "target",
    title: { si: "A ඉලක්ක කරගත් ඉගැන්වීම", en: "Teaching aimed at an A" },
    desc: {
      si: "සෑම පාඩමක්ම විභාග ප්‍රශ්න පත්‍රයට සෘජුවම සම්බන්ධ කරමින්, ලකුණු ලබා ගන්නා ක්‍රමය පැහැදිලිව.",
      en: "Every lesson is tied straight to the exam paper, showing exactly how marks are earned.",
    },
  },
  {
    icon: "code",
    title: { si: "Programming සරලව", en: "Programming made simple" },
    desc: {
      si: "Python, දත්ත සමුදාය සහ තර්ක ද්වාර - බය නැතිව, උදාහරණ සමඟ මුල සිට.",
      en: "Python, databases and logic gates - from scratch, with worked examples and no fear.",
    },
  },
  {
    icon: "notes",
    title: { si: "සම්පූර්ණ කෙටි සටහන්", en: "Complete short notes" },
    desc: {
      si: "සෑම පාඩමකටම මුද්‍රිත tute, mind map සහ අවසන් මොහොතේ revision sheet.",
      en: "Printed tutes for each unit, mind maps and last-minute revision sheets.",
    },
  },
  {
    icon: "chat",
    title: { si: "පන්තියෙන් පිටතත් සහය", en: "Support beyond class" },
    desc: {
      si: "WhatsApp group එකෙන් ප්‍රශ්න අසන්න පුළුවන් - පැය 24ක් ඇතුළත පිළිතුරු.",
      en: "Ask questions in the WhatsApp group - answers within 24 hours.",
    },
  },
  {
    icon: "chart",
    title: { si: "මාසික ප්‍රගති වාර්තා", en: "Monthly progress reports" },
    desc: {
      si: "සෑම මාසයකම පරීක්ෂණයක්, දෙමාපියන්ට ප්‍රතිඵල දැනුම් දීම.",
      en: "A test every month, with results shared directly with parents.",
    },
  },
  {
    icon: "globe",
    title: { si: "ඔබට ළඟම පන්තිය", en: "A class near you" },
    desc: {
      si: "කුලියාපිටිය, මාකඳුර, නාත්තණ්ඩිය සහ පන්නල - ස්ථාන හතරක පන්ති.",
      en: "Classes at four venues - Kuliyapitiya, Makandura, Naththandiya and Pannala.",
    },
  },
];

export const testimonials: { name: Bi; role: Bi; quote: Bi }[] = [
  {
    name: { si: "හසිනි ප්‍රනාන්දු", en: "Hasini Fernando" },
    role: { si: "2025 A/L - A සාමාර්ථය", en: "2025 A/L - A pass" },
    quote: {
      si: "Programming කියන්නේ මට බයක්. සර්ගේ පන්තියෙන් පස්සේ ඒක මගේ ලොකුම ලකුණු ගත්ත කොටස බවට පත් වුණා.",
      en: "Programming used to scare me. After sir's class it became the part I scored the highest in.",
    },
  },
  {
    name: { si: "දිනුක සමරසිංහ", en: "Dinuka Samarasinghe" },
    role: { si: "2026 A/L සිසුවා", en: "2026 A/L student" },
    quote: {
      si: "පාඩම කියලා දීලා ඉවර වෙලා ඒ පාඩමේම past paper ප්‍රශ්න කරනවා. ඒක නිසා මතක තියෙනවා.",
      en: "Right after each lesson we work past paper questions on it. That is why it sticks.",
    },
  },
  {
    name: { si: "නිරෝෂා මැණිකේ", en: "Nirosha Manike" },
    role: { si: "දෙමාපියෙක්", en: "Parent" },
    quote: {
      si: "මාසෙකට වතාවක් ප්‍රතිඵල අපිටත් කියනවා. දරුවගේ ප්‍රගතිය නිතරම දැනගන්න පුළුවන්.",
      en: "Results are shared with us every month, so we always know how our child is progressing.",
    },
  },
];

export const faqs: { q: Bi; a: Bi }[] = [
  {
    q: {
      si: "පන්තිය සිංහල මාධ්‍යයෙන්ද?",
      en: "Are the classes in Sinhala medium?",
    },
    a: {
      si: "ඔව්. පන්ති සිංහල මාධ්‍යයෙන් පවත්වන අතර, technical terms ඉංග්‍රීසියෙන් ද පැහැදිලි කරනු ලැබේ.",
      en: "Yes. Classes are conducted in Sinhala, with technical terms also explained in English.",
    },
  },
  {
    q: {
      si: "ICT කලින් ඉගෙන ගෙන නැත්නම් සම්බන්ධ වෙන්න පුළුවන්ද?",
      en: "Can I join without any prior ICT knowledge?",
    },
    a: {
      si: "පුළුවන්. 2028 A/L පන්තිය මුල සිටම ආරම්භ වේ. O/L වලදී ICT නොකළ සිසුන්ටත් පහසුවෙන් අනුගමනය කළ හැක.",
      en: "Absolutely. The 2028 A/L class starts from the basics, so students who did not do ICT for O/L can follow easily.",
    },
  },
  {
    q: {
      si: "පන්තියට එක් වෙන්නේ කොහොමද?",
      en: "How do I register for a class?",
    },
    a: {
      si: "WhatsApp හරහා පණිවුඩයක් එවන්න, නැතහොත් 076 114 0551 අංකයට කතා කරන්න. පන්තිය, ශ්‍රේණිය සහ ඔබේ නම සඳහන් කරන්න.",
      en: "Send a WhatsApp message or call 076 114 0551 with your name, grade and the class you want to join.",
    },
  },
  {
    q: {
      si: "පන්තියට සහභාගී වීමට නොහැකි වුණොත්?",
      en: "What if I miss a class?",
    },
    a: {
      si: "පන්තියක් මඟ හැරුණොත් එම පාඩමේ tute සහ recording එක ලබා ගත හැක.",
      en: "If you miss a class you can get that lesson's tute and recording.",
    },
  },
  {
    q: {
      si: "Paper class එක වෙනම තියෙනවද?",
      en: "Is the paper class separate?",
    },
    a: {
      si: "O/L 11 ශ්‍රේණියට වෙනම paper පන්තියක් සඳුදා ප.ව. 4.00 - 9.00 කුලියාපිටිය Science Center හි පැවැත්වේ. 2027 A/L පන්තියට paper සාකච්ඡාව ඇතුළත් වේ.",
      en: "O/L Grade 11 has a separate paper class on Mondays, 4.00 - 9.00 p.m. at Science Center, Kuliyapitiya. Paper discussion is built into the 2027 A/L class.",
    },
  },
];

/**
 * Photos. Drop image files into `public/images/` and set `src` below
 * (e.g. "/images/class-01.jpg"). Items without a `src` render as a
 * styled placeholder tile, so the site looks complete until then.
 */
export const gallery: { id: string; src?: string; wide?: boolean; caption: Bi }[] = [
  {
    id: "g9",
    src: "/images/group-batch-full.jpg",
    wide: true,
    caption: {
      si: "2026 සැමරුමේ මුළු කණ්ඩායම",
      en: "The whole batch at the 2026 celebration",
    },
  },
  {
    id: "g1",
    src: "/images/group-01.jpg",
    wide: true,
    caption: { si: "2026 A/L කණ්ඩායම", en: "The 2026 A/L batch" },
  },
  {
    id: "g2",
    src: "/images/group-03.jpg",
    caption: { si: "2026 සැමරුමේදී", en: "At the 2026 celebration" },
  },
  {
    id: "g3",
    src: "/images/group-02.jpg",
    caption: { si: "පන්තියේ මිතුරන්", en: "Classmates" },
  },
  {
    id: "g4",
    src: "/images/group-06.jpg",
    wide: true,
    caption: { si: "සැමරුමේ මිහිරි මොහොතක්", en: "A sweet moment at the celebration" },
  },
  {
    id: "g5",
    src: "/images/group-08.jpg",
    caption: { si: "සැමරුමට පැමිණි සිසුන්", en: "Students at the celebration" },
  },
  {
    id: "g6",
    src: "/images/class-01.jpg",
    caption: { si: "පාඩම අතරතුර", en: "During the lesson" },
  },
  {
    id: "g7",
    src: "/images/class-03.jpg",
    caption: { si: "සිසුන් පාඩමට සවන් දෙමින්", en: "Students following the lesson" },
  },
  {
    id: "g8",
    src: "/images/class-05.jpg",
    caption: { si: "පන්ති කාමරය තුළ", en: "Inside the classroom" },
  },
];

/** Hero portrait — teaching with a mic, from the page's profile-pictures album. */
export const tutorPhoto: string | undefined = "/images/tutor-1.jpg";
