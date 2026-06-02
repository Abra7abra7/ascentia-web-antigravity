<script>
  let step = $state(1);
  let userGoal = $state("");
  let experience = $state("");
  let recommendation = $state("");
  let price = $state(0);
  let isWaiverChecked = $state(false);
  let isCheckingOut = $state(false);

  function processGoal(goal) {
    userGoal = goal;
    step = 2;
  }

  function processExperience(exp) {
    experience = exp;
    if (userGoal === 'automation') {
      recommendation = "Kurz: Automatizácia firiem pomocou AI agentov v roku 2026";
      price = 249;
    } else {
      recommendation = "Kurz: Masterclass efektívneho kódovania a LLM integrácií";
      price = 299;
    }
    step = 3;
  }

  async function handleCheckout(e) {
    e.preventDefault();
    if (!isWaiverChecked) {
      alert("Pre pokračovanie musíte súhlasiť s digitálnym vzdaním sa práva na vrátenie.");
      return;
    }
    isCheckingOut = true;

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName: recommendation,
          price: price
        })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Chyba pri vytváraní platobnej relácie: " + (data.error || "Neznáma chyba"));
        isCheckingOut = false;
      }
    } catch (err) {
      console.error(err);
      alert("Chyba pripojenia k platobnému systému.");
      isCheckingOut = false;
    }
  }
</script>

<div class="w-full max-w-2xl mx-auto p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl transition-all duration-300">
  <!-- Progress indicator -->
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center gap-2">
      <span class="text-xs font-bold uppercase tracking-widest text-zinc-500">AI Kvíz</span>
      <span class="h-1.5 w-12 rounded-full {step >= 1 ? 'bg-violet-600' : 'bg-zinc-800'}"></span>
      <span class="h-1.5 w-12 rounded-full {step >= 2 ? 'bg-violet-600' : 'bg-zinc-800'}"></span>
      <span class="h-1.5 w-12 rounded-full {step >= 3 ? 'bg-violet-600' : 'bg-zinc-800'}"></span>
    </div>
    <span class="text-xs font-mono text-zinc-500">Krok {step} z 3</span>
  </div>

  {#if step === 1}
    <div class="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 class="text-3xl font-black tracking-tight text-zinc-50 mb-6">Aké vedomosti potrebuješ pre svoj vzostup?</h2>
      <div class="space-y-4">
        <button
          onclick={() => processGoal('automation')}
          class="w-full text-left p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-violet-500 transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.1)] text-zinc-300 font-medium group"
        >
          <div class="flex items-center justify-between">
            <span class="text-lg group-hover:text-zinc-50 transition-colors">🚀 Chcem zautomatizovať svoje podnikanie a procesy</span>
            <span class="text-zinc-600 group-hover:text-violet-500 group-hover:translate-x-1 transition-all">&rarr;</span>
          </div>
          <p class="text-xs text-zinc-500 mt-2">Naučte sa vytvárať AI agentov, prepájať databázy a spravovať autonómne workflows.</p>
        </button>

        <button
          onclick={() => processGoal('code')}
          class="w-full text-left p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-violet-500 transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.1)] text-zinc-300 font-medium group"
        >
          <div class="flex items-center justify-between">
            <span class="text-lg group-hover:text-zinc-50 transition-colors">💻 Chcem sa naučiť vyvíjať moderné AI-driven aplikácie</span>
            <span class="text-zinc-600 group-hover:text-violet-500 group-hover:translate-x-1 transition-all">&rarr;</span>
          </div>
          <p class="text-xs text-zinc-500 mt-2">Zvládnite Next.js, Astro, LLM API integrácie, vektorové databázy a deployment v roku 2026.</p>
        </button>
      </div>
    </div>
  {:else if step === 2}
    <div class="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 class="text-3xl font-black tracking-tight text-zinc-50 mb-6">Aké sú vaše doterajšie skúsenosti s programovaním / AI?</h2>
      <div class="space-y-4">
        <button
          onclick={() => processExperience('beginner')}
          class="w-full text-left p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-violet-500 transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.1)] text-zinc-300 font-medium group"
        >
          <span class="text-lg group-hover:text-zinc-50 transition-colors">🌱 Som úplný začiatočník</span>
          <p class="text-xs text-zinc-500 mt-2">Vysvetlíme si základy od nuly, nepotrebujete žiadne predošlé skúsenosti.</p>
        </button>

        <button
          onclick={() => processExperience('intermediate')}
          class="w-full text-left p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-violet-500 transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.1)] text-zinc-300 font-medium group"
        >
          <span class="text-lg group-hover:text-zinc-50 transition-colors">⚡ Mám základy (HTML, JS, Python)</span>
          <p class="text-xs text-zinc-500 mt-2">Zameriame sa rovno na integrácie a pokročilé techniky tvorby aplikácií.</p>
        </button>

        <button
          onclick={() => processExperience('advanced')}
          class="w-full text-left p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-violet-500 transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.1)] text-zinc-300 font-medium group"
        >
          <span class="text-lg group-hover:text-zinc-50 transition-colors">🔥 Som seniorný programátor / konzultant</span>
          <p class="text-xs text-zinc-500 mt-2">Hlboký ponor do multi-agentových systémov, custom fine-tuning a orchestrácie.</p>
        </button>
      </div>
    </div>
  {:else if step === 3}
    <div class="animate-in fade-in duration-500">
      <span class="text-xs font-bold text-violet-500 tracking-widest uppercase">Tvoj osobný plán</span>
      <h3 class="text-3xl font-black text-zinc-50 mt-2 mb-4">{recommendation}</h3>
      
      <div class="mb-6 p-4 rounded-xl bg-zinc-950 border border-zinc-850">
        <p class="text-zinc-400 text-sm leading-relaxed mb-4">
          Na základe tvojich preferencií sme ti odomkli prístup k úvodnej video lekcii zdarma a možnosti zakúpiť si plný balík s WhatsApp podporou a certifikátom.
        </p>
        <div class="flex items-baseline justify-between border-t border-zinc-800 pt-4">
          <span class="text-zinc-500 text-sm font-medium">Akčná cena pre teba:</span>
          <div class="flex items-baseline gap-2">
            <span class="text-zinc-500 text-sm line-through">499 €</span>
            <span class="text-2xl font-black text-emerald-400">{price} €</span>
          </div>
        </div>
      </div>

      <form onsubmit={handleCheckout} class="space-y-4">
        <!-- Embedded Legal Waiver Checkbox (Required by 2026 EU law for instant access) -->
        <div class="p-4 bg-zinc-950 border border-zinc-850 rounded-xl">
          <label class="flex items-start cursor-pointer select-none">
            <input
              type="checkbox"
              bind:checked={isWaiverChecked}
              required
              class="mt-1 mr-3 w-4 h-4 rounded text-violet-600 bg-zinc-900 border-zinc-800 focus:ring-violet-500 focus:ring-offset-zinc-950 cursor-pointer"
              id="eu-digital-waiver-quiz"
            />
            <span class="text-xs text-zinc-400 leading-relaxed">
              Výslovne súhlasím s poskytovaním digitálneho plnenia (okamžitý prístup k video kurzom) pred uplynutím zákonnej lehoty na odstúpenie od zmluvy. Vyjadrením tohto súhlasu beriem na vedomie, že <strong>strácam právo na odstúpenie od zmluvy</strong> v lehote 14 dní podľa platnej legislatívy o ochrane spotrebiteľa.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isCheckingOut}
          class="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 text-zinc-50 font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-violet-600/20 text-center block cursor-pointer flex items-center justify-center gap-3"
        >
          {#if isCheckingOut}
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Spracovávam objednávku...
          {:else}
            Spustiť kurz teraz za {price} €
          {/if}
        </button>
      </form>
    </div>
  {/if}
</div>
