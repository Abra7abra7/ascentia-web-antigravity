import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load env variables manually from .env if needed
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const parts = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (parts) {
        const key = parts[1];
        let val = parts[2] || '';
        if (val.length > 0 && val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    });
  }
}

loadEnv();

const apiKey = process.env.GEMINI_API_KEY;

const TOPICS = [
  "autonómni AI agenti a ich nasadenie vo firmách",
  "ako správne integrovať LLM cez API",
  "vektorové databázy a RAG architektúra pre začiatočníkov",
  " low-code automatizácia pomocou n8n a Make",
  "AI-assisted coding s editorom Cursor a Claude Sonnet",
  "budúcnosť vzdelávania v ére umelej inteligencie",
  "automatizácia zákazníckej podpory pomocou multi-agentových systémov"
];

async function generatePost() {
  console.log("Spúšťam AI Autopilota pre blog...");
  
  if (!apiKey) {
    console.warn("UPOZORNENIE: GEMINI_API_KEY chýba. Generujem testovací článok.");
    createMockPost();
    return;
  }

  const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  const currentDate = new Date().toISOString().split('T')[0];

  const prompt = `Si špičkový technologický lúzer a expert na AI zo spoločnosti Ascentia. Tvojou úlohou je napísať pútavý a technicky presný blogový článok v slovenskom jazyku o: ${randomTopic}.
Článok by mal byť napísaný priateľským ale vysoko profesionálnym tónom (tykanie/vykanie podľa štýlu startupov).
Na konci článku nenápadne odporuč naše prémiové kurzy Ascentia (napr. Automatizácia firiem pomocou AI agentov alebo Masterclass efektívneho kódovania).

Odpoveď MUSÍ byť výhradne validný JSON objekt s nasledujúcou štruktúrou:
{
  "slug": "url-friendly-slug-clanku",
  "title": "Názov článku",
  "excerpt": "Stručný a pútavý úvodný popis článku (1-2 vety).",
  "date": "${currentDate}",
  "author": "Ascentia Autopilot",
  "readTime": "5 min",
  "content": "Celý text článku vo formáte Markdown. Používaj nadpisy druhej a tretej úrovne (## a ###), zoznamy odrážok (-), hrubé písmo (**text**) a odseky. Nepoužívaj H1 (#)!"
}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    const postData = JSON.parse(responseText);

    // Set thematic image dynamically
    if (randomTopic.includes("coding") || randomTopic.includes("kódovania") || randomTopic.includes("LLM") || randomTopic.includes("integrácie") || randomTopic.includes("kódovanie")) {
      postData.image = "/blog-coding.png";
    } else {
      postData.image = "/blog-agenti.png";
    }

    savePost(postData);
  } catch (error) {
    console.error("Chyba pri generovaní článku pomocou Gemini API:", error);
    createMockPost();
  }
}

function savePost(newPost) {
  const postsPath = path.join(__dirname, '../src/data/posts.json');
  let posts = [];

  if (fs.existsSync(postsPath)) {
    posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
  }

  // Check if post with the same slug already exists
  if (posts.some(p => p.slug === newPost.slug)) {
    newPost.slug = `${newPost.slug}-${Date.now()}`;
  }

  // Prepend new post
  posts.unshift(newPost);

  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`Článok "${newPost.title}" bol úspešne uložený.`);
}

function createMockPost() {
  const currentDate = new Date().toISOString().split('T')[0];
  const mockPost = {
    "slug": `rychle-tipy-pre-low-code-${Date.now()}`,
    "title": "5 rýchlych tipov pre efektívnu low-code automatizáciu",
    "excerpt": "Ako prepojiť vaše podnikové aplikácie rýchlo, lacno a bez zložitého programovania.",
    "date": currentDate,
    "author": "Ascentia Autopilot",
    "readTime": "3 min",
    "image": "/blog-agenti.png",
    "content": "## Low-Code mení biznis\n\nLow-code nástroje ako **n8n** a **Make** umožňujú komukoľvek automatizovať zložité procesy. Tu je 5 rýchlych tipov na začiatok:\n\n- **Začnite v malom**: Automatizujte najskôr jednoduché úlohy (napr. posielanie notifikácií o nových objednávkach do Slacku).\n- **Používajte jednotný formát dát**: JSON je priemyselný štandard, naučte sa s ním pracovať.\n- **Ošetrujte chyby**: Nastavte si e-mailové upozornenia v prípade zlyhania scenára.\n- **Bezpečnosť na prvom mieste**: Nikdy nevkladajte API kľúče priamo do kódových blokov, používajte premenné prostredia.\n- **Vzdelávajte sa kontinuálne**: low-code sa neustále vyvíja.\n\nAk sa chcete naučiť low-code automatizáciu na profesionálnej úrovni, navštívte náš kurz **Automatizácia firiem pomocou AI agentov**."
  };
  savePost(mockPost);
}

generatePost();
