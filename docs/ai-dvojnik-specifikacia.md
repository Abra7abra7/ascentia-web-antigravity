# Špecifikácia AI dvojníka – Ascentia

## Verzia: 1.0 | Stav: Návrh

---

## Prehľad

Cieľ: vytvoriť **AI dvojníka**, ktorý:
- Vyzerá a znie ako ty
- Predáva tvoje kurzy
- Vzdeláva študentov
- Odpovedá na otázky 24/7
- Komunikuje cez web, WhatsApp a telefonicky

---

## FÁZA 1: AI Chatbot Predajca (1–2 týždne)

### 1.1 Výber platformy

| Platforma | Výhody | Nevýhody | Cena |
|-----------|--------|----------|------|
| **Voiceflow** | Drag-drop, jednoduchý, integrovaný s mnohými API | Obmedzená customizácia | Free / $30/mes. |
| **Botpress** | Open-source, full custom, vlastný hosting | Vyžaduje technické know-how | Free (self-host) |
| **Custom (LangChain + Streamlit)** | Plná kontrola, RAG, vlastné dáta | Najviac práce | $20/mes. (hosting) |

**Odporúčanie pre teba:** Botpress (open-source, self-host na Vercel / Railway) alebo Voiceflow (rýchly štart, ak nechceš kódovať).

### 1.2 Dátová príprava

```
📁 asistent-data/
├── kurzy/
│   ├── kurz1-automatizacia-ai-agentov.yaml
│   ├── kurz2-masterclass-kodovanie.yaml
│   └── pripravovane-kurzy.yaml
├── faq/
│   ├── vseobecne.yaml        (30+ otázok)
│   ├── technicke.yaml         (10+ otázok)
│   └── platba-pristup.yaml    (15+ otázok)
├── osobny-styl/
│   ├── tvoj-hlas.yaml        (tón, frázy, slovník)
│   ├── story.yaml            (tvoja cesta, prečo)
│   └── hodnoty.yaml          (čo učíš a prečo)
└── sales/
    ├── cennik.yaml
    ├── upsell-scenare.yaml
    └── objection-handling.yaml
```

### 1.3 Štruktúra konverzácie (flow)

```
👤 Používateľ príde na web
   │
   ▼
🤖 Bot: "Čau, ja som [tvoje meno], AI dvojník zakladateľa Ascentie.
        Na čo sa ťažia tvoje otázky? 😎"
   │
   ├── "Čo ponúkate?" → Bot vysvetlí kurzy + odporučí
   ├── "Koľko to stojí?" → Bot ukáže ceny + zvýrazní bestseller
   ├── "Pre koho je kurz?" → Bot zistí pozadie + odporučí
   └── "Mám otázku k obsahu" → Bot odpovie z databázy
   │
   ▼
   Kvalifikácia leada:
   ├── "Aká je tvoja skúsenosť s AI?"
   ├── "Čo by si chcel dosiahnuť?"
   └── "Máš tím / firmu, alebo ideš sólo?"
   │
   ▼
   Návrh produktu:
   ├── Začiatočník → "AI pre začiatočníkov" (49€)
   ├── Stredne pokročilý → "Automatizácia firiem" (297€)
   ├── Programátor → "Masterclass kódovania" (497€)
   └── Firma → "Firemný balík" (997€+)
   │
   ▼
   🔥 Sales push:
   ├── "Kurz je teraz v akcii za [cena]"
   ├── "Dostaneš bonus [šablóny / konzultácia]"
   └── "Klikni nižšie a začni ešte dnes 🚀"
   │
   ▼
   📧 Zber emailu → Poslanie odkazu na checkout
```

### 1.4 Tvoj hlas – tón komunikácie

```
tón: "kámošovský profík"
          |
          ├── Tyka
          ├── Používa slang: "kámo", "pohoda", "v poho"
          ├── Hovorí pravdu: "Toto nie je magický pill, budeš makať"
          ├── Občas sarkastický / vtipný
          ├── Používa emoji: 🚀🔥💪😎
          └── Konkrétny: "Pozri, v 3. lekcii spravíme tvojho prvého agenta"
```

### 1.5 Príklady otázok z FAQ databázy

```
Q: "Nestíham, môžem pozastaviť kurz?"
A: "Jasné, kámo. Život sa deje. Pozastavíš kedykoľvek v nastaveniach a vrátiš sa,
     keď budeš ready. Prístup máš doživotný, takže pohoda. 🕊️"

Q: "Je to vhodné pre úplného začiatočníka?"
A: "Ak si ešte nikdy nespustil terminál, odporúčam začať základným kurzom.
     V 'AI pre začiatočníkov' ťa prevediem od nuly – čo je prompt, čo je LLM,
     ako spustiť prvého agenta za 10 minút. Žiaden stres. 👍"

Q: "Môžem vrátiť peniaze, ak sa mi kurz nebude páčiť?"
A: "Ak si nezaškrtol waiver na okamžité dodanie, máš 14 dní na rozmyslenie.
     Reálne ale kurz otvoríš, pozrieš prvú lekciu a uvidíš, či je to tvoj štýl.
     Ak nie, napíš a vybavíme refund. Bez otázok. 🤝"

Q: "Čo sa naučím v kurze o AI agentoch?"
A: "Počas 24+ hodín spravíš kompletného AI agenta pre firmu:
     - Vektorové databázy (Pinecone, Supabase)
     - RAG pipelines
     - Multi-agent orchestration
     - Integráciu s n8n a Make.com
     - Deployment do produkcie
     Na konci máš funkčného agenta, nie teóriu. 🔥"
```

### 1.6 Technická implementácia

```javascript
// 1. Vloženie na web (Astro komponent)
// /src/components/AIChat.astro

---
// Po inštalácii Botpress / Voiceflow widgetu
---

<script>
  window.botpressWebChat.init({
    botId: "ascentia-ai-twin",
    hostUrl: "https://cdn.botpress.cloud/webchat",
    messagingUrl: "https://messaging.botpress.cloud",
    clientId: "TVOJ_CLIENT_ID",
    stylesheet: "https://tvoj-web.com/chat-theme.css",
    extraStylesheet: "/chat-custom.css",
    useMessageList: true,
    showPoweredBy: false,
    botName: "[Tvoje meno]",
    botAvatar: "/tvoja-fotka.jpg",
    enableConversationDeletion: true,
    disableAnimations: false,
    hideWidget: false,
    showCloseButton: true,
    containerWidth: "380px",
    layoutWidth: "380px",
  });
</script>
```

---

## FÁZA 2: AI Voice / Video Dvojník (3–4 týždne)

### 2.1 Hlasový klon – ElevenLabs

**Nástroj:** https://elevenlabs.io (Voice Lab)

**Postup:**
1. **Nahraj 30 minút svojho hlasu:**
   - 10 minút rozprávania o kurzoch (akoby si vysvetľoval študentovi)
   - 10 minút bežnej konverzácie (rozhovor s kamošom)
   - 10 minút čítania textu (článok o AI, aby mal čistý sample)
   - **Formát:** WAV / MP3, 44.1kHz, mono, bez šumu
2. **Vytvor hlas v ElevenLabs:**
   - Voice Lab → Instant Voice Cloning
   - Nahraj samples
   - Nastav stability (nižšia = viac emócií) a similarity (vyššia = presnejší)
3. **Otestuj:**
   - "Ahoj, volám sa [tvoje meno] a som zakladateľ Ascentie. Poďme spolu na tvoj technologický vzostup. 🚀"
   - Pusti 5 ľuďom – spoznajú, že to nie si ty?

### 2.2 Video avatar – HeyGen

**Nástroj:** https://heygen.com

**Postup:**
1. **Nahraj 5-minútové referenčné video:**
   - Kamera na úrovni očí
   - Neutrálne pozadie (biele / sivé)
   - Prirodzené svetlo
   - Hovor priamo do kamery
2. **HeyGen vytvorí tvoj digitálny avatar:**
   - Výber: Standard Avatar (stačí 5 min videa) alebo HD Avatar (viac detailov)
3. **Vygeneruj prvé video:**
   - Text: *"Ahoj, volám sa [tvoje meno]. Vitaj v Ascentii – mieste, kde sa meníš z človeka, čo len používa AI, na človeka, čo ju tvorí. Poďme na to."*
   - Hlas: tvoj ElevenLabs klon
   - Jazyk: Slovenčina

### 2.3 Použitie avatarov

| Umiestnenie | Dĺžka | Text |
|------------|-------|------|
| **Hero sekcia (nad foldom)** | 30–60s | "Ahoj, som [meno]. Ascentia je..." |
| **Každý kurz** | 2–3 min | Úvod k lekcii, zhrnutie |
| **E-maily** | 30s | "Ahoj [Meno], pozri čo je nové..." |
| **Sociálne siete** | 15–60s | Tipy, ukážky, teasery |
| **Predajnú stránku** | 60–90s | Celý sales pitch |

### 2.4 Generovanie hromadných videí – pipeline

```
1. Tvorba šablón v HeyGen
   ├── Šablóna: "úvod do lekcie"
   ├── Šablóna: "odpoveď na otázku"
   └── Šablóna: "sales pitch"

2. Batch generovanie
   ├── Scripty napíše ChatGPT v tvojom štýle
   ├── HeyGen API vygeneruje videá automaticky
   └── Nahrá na YouTube / Vimeo (súkromné linky)

3. Integrácia do kurzu
   ├── Každá lekcia začína tvojím avatarom
   └── Medzi sekciami tvoj avatar zhrnie
```

---

## FÁZA 3: Plne Autonómny AI Agent (1–2 mesiace)

### 3.1 Architektúra

```
┌─────────────────────────────────────────────────┐
│                  WEB (Astro)                     │
│  ┌──────────┐  ┌─────────────┐  ┌───────────┐  │
│  │ Chatbot  │  │ Video       │  │ Checkout  │  │
│  │ widget   │  │ dvojník     │  │ (Stripe)  │  │
│  └────┬─────┘  └─────────────┘  └───────────┘  │
└───────┼─────────────────────────────────────────┘
        │
┌───────▼─────────────────────────────────────────┐
│              BACKEND (Node.js)                   │
│  ┌────────────────┐  ┌──────────────────────┐   │
│  │ LangChain /    │  │ RAG Pipeline         │   │
│  │ LLM (Claude    │  │ Pinecone / Supabase  │   │
│  │ alebo GPT-4o)  │  │ vektorová databáza   │   │
│  └───────┬────────┘  └──────────┬───────────┘   │
│          │                      │               │
│  ┌───────▼──────────────────────▼───────────┐   │
│  │          Knowledge Base                   │   │
│  │  ┌────────────┐ ┌──────────┐ ┌────────┐  │   │
│  │  │ Kurzy      │ │ FAQ      │ │ Tvoj   │  │   │
│  │  │ (všetky)   │ │ (100+)   │ │ štýl   │  │   │
│  │  └────────────┘ └──────────┘ └────────┘  │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
        │
┌───────▼─────────────────────────────────────────┐
│           KOMUNIKAČNÉ KANÁLY                     │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐   │
│  │ WhatsApp │ │ Twilio   │ │ Email          │   │
│  │ API      │ │ (voice)  │ │ (Brevo/Resend) │   │
│  └──────────┘ └──────────┘ └────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 3.2 Technológie

| Komponent | Nástroj | Cena |
|-----------|---------|------|
| LLM | Claude Sonnet 4 / GPT-4o-mini | $20–50/mes. |
| Vektorová DB | Pinecone / Supabase | $0–30/mes. |
| Voice | ElevenLabs | $5–22/mes. |
| Video avatar | HeyGen | $24–72/mes. |
| Chat framework | Botpress / LangChain | $0–30/mes. |
| WhatsApp API | Meta Cloud API / Twilio | $0.005/správa |
| Telefonáty | Twilio | ~$0.10/min |
| Email | Resend / Brevo | $0–15/mes. |
| Hosting | Vercel (už máš) | $0–20/mes. |

**Odhad mesačných nákladov (v prevádzke):** $50–200/mes.

### 3.3 AI dvojník v WhatsApp

**Tok konverzácie:**

```
📱 Študent: "Ahoj, mám otázku k 3. lekcii o RAG."

🤖 AI dvojník: "Čau! 3. lekcia je jedna z najlepších – tam sa naučíš
    prepájať Pinecone s LLM. Čo presne ťa trápi?"

📱 Študent: "Nechodí mi embedding."

🤖 AI dvojník: "Väčšinou je problém v API kľúči alebo dimenzii.
    Pošli error log, pozriem sa na to. Ak chceš, môžeme to dať
    spolu na 5-minútovom hovore. Volám ťa? 📞"

📱 Študent: "Pošli radšej link, pozriem sa na to."

🤖 AI dvojník: "Tu je návod krok po kroku 👇
    🔗 https://ascentia.app/help/embedding-fix
    Daj vedieť, či to pomohlo. Ak nie, zavoláme sa. 💪"
```

### 3.4 AI dvojník – telefonát

**Pomocou:** Twilio + ElevenLabs + OpenAI/Claude

**Postup:**
1. Študent klikne na "Zavolaj mi" na webe
2. Zadá svoje číslo
3. AI dvojník mu zavolá do 30 sekúnd
4. Prebehne konverzácia v reálnom čase (hlas tvoj, myseľ AI)

**Scenár volania:**
```
🤖: "Ahoj [Meno], tu [tvoje meno] z Ascentie. Počul som, že
     máš otázky ku kurzu. Pýtaj sa, som tu pre teba."

👤: "Zaujíma ma, či kurz naozaj pomôže mojej firme..."

🤖: "Skvelá otázka! Poďme na to. Akú firmu vedieš a čo by si
     chcel zautomatizovať ako prvé?"

[... 5-10 minút konverzácie, AI odpovedá na základe databázy]

🤖: "Super, znie to, že presne toto potrebuješ. Pošlem ti link
     na checkout s tvojou osobnou zľavou. Máš ho v SMS aj emaile.
     Ak budeš niečo potrebovať, ozvi sa. Maj sa! 🚀"
```

### 3.5 Implementačný harmonogram

| Týždeň | Úloha |
|--------|-------|
| **Týždeň 1** | Vytvoriť FAQ databázu (50+ otázok) + definovať tvoj tón |
| **Týždeň 2** | Nasadiť chatbot (Voiceflow / Botpress) na web |
| **Týždeň 3** | Nahrať hlasové samples + vytvoriť ElevenLabs klon |
| **Týždeň 4** | Vytvoriť prvý video avatar (HeyGen) + otestovať |
| **Týždeň 5** | WhatsApp API integrácia + testovanie |
| **Týždeň 6** | Twilio voice integrácia + testovacie hovory |
| **Týždeň 7** | RAG pipeline + vektorová databáza |
| **Týždeň 8** | Plná integrácia + ostrá prevádzka |

---

## FÁZA 4: Budúci rozvoj

- **Multijazyčnosť:** AI dvojník po anglicky, nemecky, česky
- **Video generovanie v reálnom čase:** D-ID / Synthesia real-time API
- **Proaktívny outreach:** AI volá leadom, ktorí si pozreli kurz ale nezaplatili
- **Personalizácia:** AI si pamätá každého študenta, jeho pokrok, slabé miesta
- **Automatický content:** AI tvorí LinkedIn posty, blogy, videá v tvojom štýle

---

*Táto špecifikácia je živý dokument – upravuj podľa toho, čo funguje a čo nie.*