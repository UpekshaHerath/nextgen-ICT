import { classes, faqs, isOL, site } from "@/lib/site";
import { siteUrl } from "@/lib/siteUrl";

/**
 * Every SEO surface in one place: the copy search engines read, the keyword
 * set, and the schema.org graph. All of it is derived from `site.ts`, so class
 * times and contact details never drift between the page and its metadata.
 */

/** How the tutor's name is actually typed into search — both transliterations. */
export const tutorNames = [
  "Subhashana Karunanayake",
  "Subhashana Karunanayaka",
  "සුභාෂණ කරුණානායක",
  "Subhashana sir ICT",
  "Chamindu Subhashana",
] as const;

export const seoTitle = "NextGen ICT with Subhashana Karunanayake";

/** Short enough that a search result shows the whole title. */
export const seoTitleShort = `${seoTitle} | උසස් පෙළ ICT පන්ති`;

/** Social cards have room for the longer line. */
export const seoTagline =
  "A/L ICT classes in Sinhala medium | උසස් පෙළ ICT පන්ති";

/** ~155 characters, the most a result snippet will show. */
export const seoDescription =
  "සුභාෂණ කරුණානායක සමඟ උසස් පෙළ ICT තියරි, Revision සහ Paper පන්ති. මාකඳුර සහ කුලියාපිටිය භෞතික පන්ති, දිවයින පුරා Online පන්ති. A/L & O/L ICT classes in Sinhala medium with Subhashana Karunanayake.";

/** Longer form for Open Graph and social cards, where there is room. */
export const seoSocialDescription =
  "12 සහ 13 ශ්‍රේණි සඳහා උසස් පෙළ ICT තියරි, Revision සහ Paper පන්ති — සිංහල මාධ්‍යයෙන්. මාකඳුර සහ කුලියාපිටිය භෞතික පන්ති සහ දිවයින පුරා Online පන්ති. Sinhala-medium A/L ICT with Subhashana Karunanayake.";

export const seoKeywords = [
  ...tutorNames,
  "NextGen ICT",
  "NextGen ICT with Subhashana",
  "A/L ICT",
  "A/L ICT class",
  "උසස් පෙළ ICT",
  "උසස් පෙළ ICT පන්ති",
  "ICT පන්ති",
  "ICT පන්ති කුලියාපිටිය",
  "ICT පන්ති මාකඳුර",
  "Kuliyapitiya ICT class",
  "Makandura ICT class",
  "ICT class Sri Lanka",
  "ICT online class Sri Lanka",
  "A/L ICT online class",
  "O/L ICT class",
  "Sinhala medium ICT class",
  "ICT theory class",
  "ICT revision class",
  "ICT paper class",
  "2027 A/L ICT",
  "2026 A/L ICT",
  "2026 O/L ICT",
  "ICT tuition Sri Lanka",
  "ICT ගුරුවරයා",
];

const id = (hash: string) => `${siteUrl}/#${hash}`;

/** schema.org courseMode values for the three ways a class runs. */
const COURSE_MODE: Record<string, string | string[]> = {
  physical: "Onsite",
  online: "Online",
  hybrid: ["Onsite", "Online"],
};

/**
 * One @graph so the organization, the tutor, the classes and the FAQ all
 * cross-reference each other by @id instead of repeating themselves.
 */
export function jsonLdGraph() {
  const organization = {
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": id("organization"),
    name: `${site.brand.en} with ${site.tutor.name.en}`,
    alternateName: ["NextGen ICT", "NextGen ICT with Subhashana"],
    description: seoDescription,
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    image: `${siteUrl}/opengraph-image`,
    telephone: `+${site.whatsappNumber}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kuliyapitiya",
      addressRegion: "North Western Province",
      addressCountry: "LK",
    },
    areaServed: { "@type": "Country", name: "Sri Lanka" },
    availableLanguage: ["si", "en"],
    founder: { "@id": id("tutor") },
    employee: { "@id": id("tutor") },
    sameAs: [site.facebook, site.tiktok],
  };

  const tutor = {
    "@type": "Person",
    "@id": id("tutor"),
    name: site.tutor.name.en,
    alternateName: [site.tutor.name.si, "Subhashana Karunanayaka"],
    jobTitle: site.tutor.role.en,
    description: `${site.tutor.role.en} · ${site.tutor.qualification.en}`,
    image: `${siteUrl}/images/tutor-1.jpg`,
    url: siteUrl,
    worksFor: { "@id": id("organization") },
    knowsAbout: [
      "Information & Communication Technology",
      "GCE Advanced Level ICT",
      "Programming",
      "Database Management",
      "Computer Networking",
      "Web Development",
      "System Analysis and Design",
    ],
    knowsLanguage: ["si", "en"],
    sameAs: [site.facebook, site.tiktok],
  };

  const website = {
    "@type": "WebSite",
    "@id": id("website"),
    url: siteUrl,
    name: seoTitle,
    description: seoDescription,
    inLanguage: ["si-LK", "en"],
    publisher: { "@id": id("organization") },
  };

  const courses = classes.map((c) => ({
    "@type": "Course",
    "@id": id(`course-${c.id}`),
    name: c.title.en,
    description: c.desc.en,
    inLanguage: "si-LK",
    educationalLevel: isOL(c) ? "GCE Ordinary Level" : "GCE Advanced Level",
    teaches: "Information & Communication Technology",
    provider: { "@id": id("organization") },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: COURSE_MODE[c.mode],
      courseSchedule: {
        "@type": "Schedule",
        repeatFrequency: "Weekly",
        byDay: c.day.en,
      },
      instructor: { "@id": id("tutor") },
      ...(c.mode === "online"
        ? {}
        : {
            location: {
              "@type": "Place",
              name: c.institute.en,
              address: {
                "@type": "PostalAddress",
                addressLocality: c.town.en,
                addressCountry: "LK",
              },
            },
          }),
    },
  }));

  const faqPage = {
    "@type": "FAQPage",
    "@id": id("faq"),
    // the same questions and answers the page renders in its FAQ section
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q.en,
      acceptedAnswer: { "@type": "Answer", text: f.a.en },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, tutor, website, ...courses, faqPage],
  };
}
