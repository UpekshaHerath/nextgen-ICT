/**
 * Single source of truth for every piece of content on the site.
 *
 * Edit THIS file to update class times, institutes, fees, photos and contact
 * details — no component changes needed.
 *
 * `verified: true`  -> taken from the official Facebook page posters.
 * `verified: false` -> placeholder, please confirm the real details.
 */

export type Bi = { si: string; en: string };

export type Mode = "physical" | "online" | "hybrid";

export type ClassInfo = {
  id: string;
  /** School grade the class targets. */
  grade: "12" | "13" | "11" | "all";
  /** A/L or O/L exam year the batch sits for. */
  examYear: number;
  kind: Bi;
  title: Bi;
  desc: Bi;
  institute: Bi;
  town: Bi;
  day: Bi;
  time: Bi;
  mode: Mode;
  highlights: Bi[];
  verified: boolean;
};

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

export const classes: ClassInfo[] = [
  {
    id: "al-2027-revision",
    grade: "13",
    examYear: 2027,
    kind: { si: "Revision + Paper", en: "Revision + Paper" },
    title: {
      si: "2027 A/L ICT - Revision සහ Paper පන්තිය",
      en: "2027 A/L ICT - Revision & Paper Class",
    },
    desc: {
      si: "සම්පූර්ණ syllabus එක නැවත ගැඹුරින්, සෑම පාඩමකටම structured paper සාකච්ඡාවක් සමඟ. A සාමාර්ථයක් ඉලක්ක කරන සිසුන්ට අනිවාර්ය පන්තියකි.",
      en: "The full syllabus revisited in depth, with a structured paper discussion after every unit. Built for students targeting an A pass.",
    },
    institute: { si: "සමාධි උසස් අධ්‍යාපන ආයතනය", en: "Samadhi Higher Education Institute" },
    town: { si: "මාකඳුර", en: "Makandura" },
    day: { si: "අඟහරුවාදා", en: "Tuesday" },
    time: { si: "පෙ.ව. 9.00 – ප.ව. 2.00", en: "9.00 a.m. – 2.00 p.m." },
    mode: "physical",
    highlights: [
      { si: "සෑම පාඩමකටම past paper සාකච්ඡාව", en: "Past paper discussion per unit" },
      { si: "Model paper + marking scheme", en: "Model papers + marking schemes" },
      { si: "නොමිලේ short note", en: "Free short notes" },
    ],
    verified: true,
  },
  {
    id: "ol-2026-paper",
    grade: "11",
    examYear: 2026,
    kind: { si: "ප්‍රශ්න පත්‍ර සාකච්ඡාව", en: "Paper Discussion" },
    title: {
      si: "2026 O/L ICT - ප්‍රශ්න පත්‍ර සාකච්ඡාව",
      en: "2026 O/L ICT - Paper Discussion",
    },
    desc: {
      si: "සාමාන්‍ය පෙළ ICT විෂයට A සාමාර්ථයක් සඳහා අවශ්‍ය ප්‍රශ්න පත්‍ර පුහුණුව, කෙටි සටහන් සහ පිළිතුරු ලිවීමේ ක්‍රම.",
      en: "Exam-focused paper practice, short notes and answer-writing technique for O/L ICT.",
    },
    institute: { si: "Science Center", en: "Science Center" },
    town: { si: "කුලියාපිටිය", en: "Kuliyapitiya" },
    day: { si: "සඳුදා", en: "Monday" },
    time: { si: "ප.ව. 4.00 – ප.ව. 9.00", en: "4.00 p.m. – 9.00 p.m." },
    mode: "physical",
    highlights: [
      { si: "Past paper 15+ ක් අවසන් කිරීම", en: "15+ past papers completed" },
      { si: "පිළිතුරු ලිවීමේ ක්‍රමවේදය", en: "Answer-writing method" },
      { si: "ගාස්තුව රු. 250/=", en: "Fee Rs. 250/=" },
    ],
    verified: true,
  },
  {
    id: "al-2027-theory",
    grade: "12",
    examYear: 2027,
    kind: { si: "Theory", en: "Theory" },
    title: {
      si: "12 ශ්‍රේණිය - 2027 A/L ICT තියරි පන්තිය",
      en: "Grade 12 - 2027 A/L ICT Theory Class",
    },
    desc: {
      si: "මුල සිට පියවරෙන් පියවර. ප්‍රායෝගික උදාහරණ, Python කේතන සහ මාසික tute සමඟ සම්පූර්ණ විෂය නිර්දේශය.",
      en: "From the very first lesson, step by step. Full syllabus coverage with practical examples, Python coding and monthly tutes.",
    },
    institute: { si: "සමාධි උසස් අධ්‍යාපන ආයතනය", en: "Samadhi Higher Education Institute" },
    town: { si: "මාකඳුර", en: "Makandura" },
    day: { si: "සති අන්තයේ", en: "Weekend" },
    time: { si: "කාලය තහවුරු කර ගන්න", en: "Please confirm the time" },
    mode: "physical",
    highlights: [
      { si: "මුල සිට ඉගැන්වීම", en: "Taught from scratch" },
      { si: "මාසික tute සහ පරීක්ෂණ", en: "Monthly tutes & tests" },
    ],
    verified: false,
  },
  {
    id: "online-island",
    grade: "all",
    examYear: 2027,
    kind: { si: "Online", en: "Online" },
    title: {
      si: "Online පන්තිය - දිවයින පුරා",
      en: "Online Class - Island-wide",
    },
    desc: {
      si: "Zoom හරහා සජීවීව. පන්තියේ recording එක සතියක් බලන්න පුළුවන්, ඕනෑම දිස්ත්‍රික්කයක සිට සම්බන්ධ විය හැක.",
      en: "Live over Zoom. Recordings available for a week, so students from any district can follow along.",
    },
    institute: { si: "Zoom සජීවී පන්තිය", en: "Live on Zoom" },
    town: { si: "දිවයින පුරා", en: "Island-wide" },
    day: { si: "සතියේ දිනයක", en: "Weekday" },
    time: { si: "කාලය තහවුරු කර ගන්න", en: "Please confirm the time" },
    mode: "online",
    highlights: [
      { si: "පන්ති recording", en: "Class recordings" },
      { si: "WhatsApp group support", en: "WhatsApp group support" },
    ],
    verified: false,
  },
];

export const stats: { value: string; label: Bi }[] = [
  { value: "1000+", label: { si: "උගන්වා ඇති සිසුන්", en: "Students taught" } },
  { value: "8+", label: { si: "වසරක අත්දැකීම්", en: "Years of experience" } },
  { value: "4", label: { si: "පන්ති ආයතන", en: "Class locations" } },
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
    title: { si: "පරිගණක පද්ධතියේ මූලිකාංග", en: "Fundamentals of a computer system" },
    points: {
      si: "දෘඩාංග, මෘදුකාංග, මතක ධුරාවලිය, CPU ක්‍රියාවලිය",
      en: "Hardware, software, memory hierarchy, CPU operation",
    },
  },
  {
    no: "03",
    title: { si: "දත්ත නිරූපණය", en: "Data representation" },
    points: {
      si: "සංඛ්‍යා පද්ධති, පරිවර්තන, ද්විමය අංක ගණිතය",
      en: "Number systems, conversions, binary arithmetic",
    },
  },
  {
    no: "04",
    title: { si: "තර්ක ද්වාර හා බූලීය වීජ ගණිතය", en: "Logic gates & Boolean algebra" },
    points: {
      si: "Truth tables, K-map, combinational පරිපථ",
      en: "Truth tables, K-maps, combinational circuits",
    },
  },
  {
    no: "05",
    title: { si: "මෙහෙයුම් පද්ධති", en: "Operating systems" },
    points: {
      si: "ක්‍රියාවලි කළමනාකරණය, මතක කළමනාකරණය, ගොනු පද්ධති",
      en: "Process management, memory management, file systems",
    },
  },
  {
    no: "06",
    title: { si: "පරිගණක ජාල", en: "Computer networks" },
    points: {
      si: "OSI/TCP-IP, IP ලිපින, subnetting, ජාල උපාංග",
      en: "OSI/TCP-IP, IP addressing, subnetting, network devices",
    },
  },
  {
    no: "07",
    title: { si: "ක්‍රමලේඛනය (Python & C)", en: "Programming (Python & C)" },
    points: {
      si: "Algorithm, flowchart, පාලන ව්‍යුහ, ශ්‍රිත",
      en: "Algorithms, flowcharts, control structures, functions",
    },
  },
  {
    no: "08",
    title: { si: "දත්ත සමුදාය", en: "Database management" },
    points: {
      si: "ER රූප, සාමාන්‍යකරණය, SQL විමසුම්",
      en: "ER diagrams, normalisation, SQL queries",
    },
  },
  {
    no: "09",
    title: { si: "වෙබ් සංවර්ධනය", en: "Web development" },
    points: { si: "HTML, CSS, PHP මූලිකාංග", en: "HTML, CSS, PHP basics" },
  },
  {
    no: "10",
    title: { si: "පද්ධති විශ්ලේෂණය හා නිර්මාණය", en: "System analysis & design" },
    points: {
      si: "SDLC, DFD, පද්ධති පරීක්ෂාව හා නඩත්තුව",
      en: "SDLC, DFDs, testing and maintenance",
    },
  },
  {
    no: "11",
    title: { si: "ව්‍යාපාරයේ ICT", en: "ICT in business" },
    points: {
      si: "e-commerce, ගෙවීම් ක්‍රම, ව්‍යාපාර ක්‍රියාවලි",
      en: "e-commerce, payment methods, business processes",
    },
  },
  {
    no: "12",
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
    title: { si: "සරලව කියන Programming", en: "Programming made simple" },
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
    title: { si: "Online සහ භෞතික පන්ති", en: "Online & physical classes" },
    desc: {
      si: "මාකඳුර, කුලියාපිටිය පන්ති සහ දිවයින පුරා Zoom පන්ති.",
      en: "Classes in Makandura and Kuliyapitiya, plus island-wide Zoom classes.",
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
      si: "පුළුවන්. 12 ශ්‍රේණියේ පන්තිය මුල සිටම ආරම්භ වේ. O/L වලදී ICT නොකළ සිසුන්ටත් පහසුවෙන් අනුගමනය කළ හැක.",
      en: "Absolutely. The Grade 12 class starts from the basics, so students who did not do ICT for O/L can follow easily.",
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
      si: "Online පන්ති recording ලබා දේ. භෞතික පන්තියක් මඟ හැරුණොත් එම පාඩමේ tute සහ recording එක ලබා ගත හැක.",
      en: "Recordings are provided for online classes. If you miss a physical class you can get that lesson's tute and recording.",
    },
  },
  {
    q: {
      si: "Paper class එක වෙනම තියෙනවද?",
      en: "Is the paper class separate?",
    },
    a: {
      si: "2027 A/L Revision පන්තියට paper සාකච්ඡාව ඇතුළත් වේ. වෙනම paper class සඳහා විමසන්න.",
      en: "Paper discussion is included in the 2027 A/L revision class. Contact us about standalone paper classes.",
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
