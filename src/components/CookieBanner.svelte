<script>
  import { onMount } from 'svelte';

  let visible = $state(false);

  onMount(() => {
    const consent = localStorage.getItem('ascentia_cookie_consent');
    if (!consent) {
      visible = true;
    }
  });

  function acceptCookies() {
    localStorage.setItem('ascentia_cookie_consent', 'accepted');
    visible = false;
  }

  function declineCookies() {
    localStorage.setItem('ascentia_cookie_consent', 'declined');
    visible = false;
  }
</script>

{#if visible}
  <div class="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-8 duration-300">
    <div class="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col gap-4 backdrop-blur-md">
      <div class="flex items-start gap-3">
        <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 text-xs font-bold">🍪</span>
        <div>
          <h4 class="text-sm font-bold text-zinc-100">Nastavenia súborov cookies</h4>
          <p class="text-xs text-zinc-400 leading-relaxed mt-1">
            Naša platforma využíva cookies pre optimálne fungovanie nákupného procesu a integráciu s Meta API (WhatsApp podpora). Prečítajte si viac v sekcii <a href="/gdpr" class="text-violet-400 hover:underline">Ochrana osobných údajov</a>.
          </p>
        </div>
      </div>
      <div class="flex gap-3 justify-end text-xs font-bold">
        <button 
          onclick={declineCookies}
          class="px-4 py-2 border border-zinc-800 rounded-xl hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
        >
          Odmietnuť
        </button>
        <button 
          onclick={acceptCookies}
          class="px-4 py-2 bg-violet-600 hover:bg-violet-750 text-zinc-50 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] cursor-pointer"
        >
          Prijať všetko
        </button>
      </div>
    </div>
  </div>
{/if}
