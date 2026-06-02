# Schema.org JSON-LD — Štruktúrované dáta pre Ascentia

Tieto JSON-LD bloky vlož do `<head>` svojho Astro webu (napr. do `src/layouts/Layout.astro` v rámci `<script type="application/ld+json">`).

---

## 1. ORGANIZATION — Identifikácia tvojej organizácie

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://ascentia-web-antigravity.vercel.app/#organization",
  "name": "Ascentia",
  "alternateName": "Ascentia - AI-First & Jamstack Platforma",
  "description": "Prémiové online kurzy zamerané na AI automatizáciu a pokročilý vývoj v roku 2026.",
  "url": "https://ascentia-web-antigravity.vercel.app/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://ascentia-web-antigravity.vercel.app/logo.svg",
    "width": 120,
    "height": 120
  },
  "sameAs": [
    "https://www.facebook.com/[doplň]",
    "https://www.instagram.com/[doplň]",
    "https://www.linkedin.com/company/[doplň]"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "[doplň telefón]",
    "contactType": "customer service",
    "email": "[doplň e-mail]",
    "availableLanguage": ["Slovak", "Czech", "English"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "SK",
    "addressLocality": "[doplň mesto]",
    "postalCode": "[doplň PSČ]",
    "streetAddress": "[doplň adresa]"
  },
  "foundingDate": "2026",
  "legalName": "[doplň obchodné meno]",
  "vatID": "[doplň IČ DPH, ak existuje]"
}
```

---

## 2. WEBSITE — Hlavné informácie o webe

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://ascentia-web-antigravity.vercel.app/#website",
  "url": "https://ascentia-web-antigravity.vercel.app/",
  "name": "Ascentia",
  "description": "AI-First vzdelávacia platforma pre prémiové online kurzy o AI agentoch a modernom vývoji.",
  "publisher": {
    "@id": "https://ascentia-web-antigravity.vercel.app/#organization"
  },
  "inLanguage": "sk",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://ascentia-web-antigravity.vercel.app/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

## 3. KURZ 1 — Automatizácia firiem pomocou AI agentov

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://ascentia-web-antigravity.vercel.app/#course-ai-automatizacia",
  "name": "Automatizácia firiem pomocou AI agentov",
  "description": "Kompletný systém nasadenia autonómnych AI agentov, prepojenia podnikových databáz a integrácie multi-agentových tímov, ktoré ušetria tisíce hodín manuálnej práce.",
  "url": "https://ascentia-web-antigravity.vercel.app/",
  "provider": {
    "@type": "Organization",
    "@id": "https://ascentia-web-antigravity.vercel.app/#organization",
    "name": "Ascentia",
    "sameAs": "https://ascentia-web-antigravity.vercel.app/"
  },
  "inLanguage": "sk",
  "educationalCredentialAwarded": "Certifikát o absolvovaní kurzu",
  "teaches": [
    "Autonómne AI agenty",
    "LLM orchestrácia a frameworky",
    "Vektorové databázy (Pinecone, Supabase)",
    "RAG (Retrieval-Augmented Generation)",
    "Integrácia s n8n, Make.com a Node.js",
    "Nasadenie AI do e-shopov a zákazníckej podpory"
  ],
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": ["Online", "ONLINE_PLACEHOLDER"],
    "courseWorkload": "PT24H",
    "inLanguage": "sk",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": "[doplň cenu, napr. 297.00]",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "url": "https://ascentia-web-antigravity.vercel.app/",
      "validFrom": "2026-01-01",
      "category": "Digital educational course",
      "itemCondition": "https://schema.org/NewCondition"
    }
  },
  "timeRequired": "P24H",
  "totalHistoricalEnrollment": [doplň počet študentov, ak existuje],
  "numberOfCredits": [doplň počet kreditov, ak relevantné]
}
```

---

## 4. KURZ 2 — Masterclass efektívneho kódovania a LLM

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://ascentia-web-antigravity.vercel.app/#course-masterclass-kodovanie",
  "name": "Masterclass efektívneho kódovania a LLM",
  "description": "Zvládnite Next.js, Astro, LLM API integrácie, vektorové databázy a deployment moderných AI-driven aplikácií v roku 2026.",
  "url": "https://ascentia-web-antigravity.vercel.app/",
  "provider": {
    "@type": "Organization",
    "@id": "https://ascentia-web-antigravity.vercel.app/#organization",
    "name": "Ascentia",
    "sameAs": "https://ascentia-web-antigravity.vercel.app/"
  },
  "inLanguage": "sk",
  "educationalCredentialAwarded": "Certifikát o absolvovaní kurzu",
  "teaches": [
    "Next.js a Astro frameworky",
    "LLM API integrácie (OpenAI, Anthropic, OpenRouter)",
    "Vektorové databázy a embeddingy",
    "Moderný deployment v roku 2026",
    "Vývoj AI-driven aplikácií"
  ],
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": ["Online", "ONLINE_PLACEHOLDER"],
    "courseWorkload": "PT[doplň hodín napr. 16]H",
    "inLanguage": "sk",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": "[doplň cenu, napr. 497.00]",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "url": "https://ascentia-web-antigravity.vercel.app/",
      "validFrom": "2026-01-01",
      "category": "Digital educational course",
      "itemCondition": "https://schema.org/NewCondition"
    }
  },
  "timeRequired": "PT[doplň napr. 16]H",
  "totalHistoricalEnrollment": [doplň počet študentov, ak existuje]
}
```

---

## 5. PRODUCT — Alternatívna schéma (ak chceš mať kurzy aj ako Product)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://ascentia-web-antigravity.vercel.app/#product-ai-automatizacia",
  "name": "Automatizácia firiem pomocou AI agentov – Online kurz",
  "description": "Kompletný online kurz o nasadení AI agentov pre firmy. 24+ hodín videa, 15+ praktických šablón.",
  "image": "https://ascentia-web-antigravity.vercel.app/course-thumb.svg",
  "brand": {
    "@type": "Brand",
    "name": "Ascentia"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://ascentia-web-antigravity.vercel.app/",
    "priceCurrency": "EUR",
    "price": "[doplň cenu]",
    "priceValidUntil": "2026-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "@id": "https://ascentia-web-antigravity.vercel.app/#organization"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[doplň hodnotenie, napr. 4.8]",
    "reviewCount": "[doplň počet recenzií]",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```

---

## 6. FAQPage — Štruktúrované FAQ (dôležité pre Google AI Overviews!)

Toto vlož na stránku, kde sú otázky a odpovede (alebo ako samostatnú sekciu). **Google AI Overviews a ChatGPT často citujú práve FAQPage schému.**

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://ascentia-web-antigravity.vercel.app/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Pre koho sú kurzy Ascentie vhodné?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kurzy Ascentie sú určené pre majiteľov firiem, manažérov, podnikateľov a vývojárov, ktorí chcú prakticky využiť AI na automatizáciu a vývoj moderných aplikácií. Niektoré kurzy sú vhodné aj pre úplných začiatočníkov."
      }
    },
    {
      "@type": "Question",
      "name": "Potrebujem vedieť programovať, aby som absolvoval kurz?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pre kurz Automatizácia firiem pomocou AI agentov nie je potrebné vedieť programovať – je navrhnutý pre biznis používateľov. Pre Masterclass kódovania a LLM sa odporúča aspoň základná znalosť programovania."
      }
    },
    {
      "@type": "Question",
      "name": "Ako dlho mám prístup ku kurzu?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Po zakúpení kurzu získavate doživotný prístup ku všetkým materiálom vrátane budúcich aktualizácií. Môžete študovať vlastným tempom."
      }
    },
    {
      "@type": "Question",
      "name": "Môžem vrátiť peniaze, ak mi kurz nebude vyhovovať?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ak neudelíte súhlas s okamžitým dodaním digitálneho obsahu pred uplynutím 14-dňovej lehoty na odstúpenie, máte 14 dní na odstúpenie od zmluvy bez udania dôvodu. V opačnom prípade strácate právo na odstúpenie v súlade s čl. 16 písm. m) Smernice 2011/83/EÚ."
      }
    },
    {
      "@type": "Question",
      "name": "Dostanem certifikát po absolvovaní kurzu?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Áno, po úspešnom absolvovaní kurzu získate certifikát o absolvovaní, ktorý môžete použiť vo svojom CV alebo na LinkedIn."
      }
    },
    {
      "@type": "Question",
      "name": "V akej forme sú kurzy dodávané?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Všetky kurzy sú výhradne online. Po zakúpení získate prístup k video lekciám, PDF materiálom, šablónam a bonusovým zdrojom cez svoje používateľské konto."
      }
    },
    {
      "@type": "Question",
      "name": "Čo je to RAG a naučím sa to v kurze?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "RAG (Retrieval-Augmented Generation) je technika, ktorá umožňuje LLM modelom pracovať s vašimi vlastnými dátami. V kurze Automatizácia firiem pomocou AI agentov sa naučíte vytvárať RAG pipelines s Pinecone a Supabase v reálnom čase."
      }
    }
  ]
}
```

---

## 7. BREADCRUMBLIST — Navigačná drobečková cesta

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://ascentia-web-antigravity.vercel.app/#breadcrumb",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Domov",
      "item": "https://ascentia-web-antigravity.vercel.app/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Kurzy",
      "item": "https://ascentia-web-antigravity.vercel.app/#courses"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Automatizácia firiem pomocou AI agentov",
      "item": "https://ascentia-web-antigravity.vercel.app/"
    }
  ]
}
```

---

## 8. PERSON — O lektorovi / zakladateľovi

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://ascentia-web-antigravity.vercel.app/#person",
  "name": "[tvoje meno]",
  "givenName": "[krstné meno]",
  "familyName": "[priezvisko]",
  "jobTitle": "Zakladateľ a lektor",
  "affiliation": {
    "@id": "https://ascentia-web-antigravity.vercel.app/#organization"
  },
  "knowsAbout": ["Artificial Intelligence", "Machine Learning", "Software Development", "AI Agents", "Automation"],
  "url": "https://ascentia-web-antigravity.vercel.app/"
}
```

---

## Ako implementovať v Astre

Vlož do súboru `src/layouts/Layout.astro` (alebo `BaseHead.astro`) v sekcii `<head>`:

```astro
---
// Toto je tvoj Astro Layout
---

<!doctype html>
<html lang="sk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ascentia - AI-First & JAMstack Platforma pre Prémiové Vzdelávanie</title>

    <!-- ===== SCHEMA.ORG ===== -->
    <!-- Organization -->
    <script type="application/ld+json">
      { "@context": "https://schema.org", "@type": "Organization", ... }
    </script>

    <!-- WebSite -->
    <script type="application/ld+json">
      { "@context": "https://schema.org", "@type": "WebSite", ... }
    </script>

    <!-- Course 1 -->
    <script type="application/ld+json">
      { "@context": "https://schema.org", "@type": "Course", ... }
    </script>

    <!-- Course 2 -->
    <script type="application/ld+json">
      { "@context": "https://schema.org", "@type": "Course", ... }
    </script>

    <!-- FAQ -->
    <script type="application/ld+json">
      { "@context": "https://schema.org", "@type": "FAQPage", ... }
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

## Otestovanie validity

Po implementácii otestuj na:
1. **Google Rich Results Test:** https://search.google.com/test/rich-results
2. **Schema.org Validator:** https://validator.schema.org/
3. **Google Search Console:** Po indexácii skontroluj v sekcii "Enhancements"

---

## Ktoré schémy sú najdôležitejšie?

| Priorita | Schéma | Prečo |
|----------|--------|-------|
| 🔴 **Kritická** | `Course` | Google zobrazí kurz priamo v search results |
| 🔴 **Kritická** | `FAQPage` | Google AI Overviews + ChatGPT ťa môžu citovať |
| 🟡 **Dôležitá** | `Organization` | Identifikácia v Google Knowledge Graph |
| 🟡 **Dôležitá** | `WebSite` | Sitelinks search box vo výsledkoch |
| 🟢 **Bonusová** | `Product` + `AggregateRating` | Nákupné výsledky a hviezdičkové hodnotenie |
| 🟢 **Bonusová** | `BreadcrumbList` | Drobečková navigácia v SERP |

---

*JSON-LD bloky sú pripravené. Stačí doplniť `[zástupné hodnoty]` a vložiť do Astro layoutu.*