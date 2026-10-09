# AGENTS.md: cryptodokter.nl

> **Taking over from the Grok Bot agents?** Read [`docs/HANDOFF-JULES.md`](https://github.com/rickvdwiel/CRYPTODOKTER/blob/main/docs/HANDOFF-JULES.md) first: what runs where, current state, open items and the safe change procedure.

> **Quick brief for Jules and other coding agents (English). The full Dutch briefing is below; follow both.**
>
> - **What this is:** the public showcase of a **paper-only** crypto trading bot. It uses real Bitvavo prices but places no real orders. The site shows everything honestly, including losses. The site language is **Dutch**.
> - **Hosting:** static GitHub Pages (`CNAME` = cryptodokter.nl). There is no backend and no PHP. `index.html` is a single self-contained page that `fetch`es JSON files.
> - **You may edit:** `index.html` (all UI work), plus carefully `404.html`, `assets/` and icons.
> - **Never edit:**
>   - `paper-live.json`, `paper-public-snapshot.json`, `equity.json` (an automated job rewrites these every 10 min)
>   - `benchmark.json`, `h4-forward.json`, `desk-digest.json`, `bulletin.json`
>   - `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`
> - **Hard rules (a PR is rejected if any fails):**
>   1. Paper-only. No real trading, API keys, wallet connections, "invest now" or financial advice.
>   2. The brand appears **once**, written as `cryptodokter.nl`. No emoji in the brand.
>   3. Exactly **one** primary CTA (`btn-primary`) per view.
>   4. Never write `loca.lt`, `trycloudflare`, `xo.je`, `hits.php` or `login.html` anywhere in `index.html`, not even in comments. If you do, publishing is blocked.
>   5. Keep the donation section (`#doneer`) byte-identical. That covers all crypto addresses, the PayPal link and the IBAN.
>   6. Keep the GoatCounter visitor counter working. Add no new external scripts, fonts, CDNs or trackers.
>   7. **Never invent data.** Show only fields that exist in the JSON, with no placeholder or fake text. If a field is missing, degrade gracefully (show "—" or hide it, never `NaN`, `undefined` or `[object Object]`).
>   8. Quality:
>      - works at 375px wide
>      - full keyboard support: Esc closes overlays, focus returns to the element that opened them, Enter and Space activate, visible focus
>      - ARIA roles
>      - respects `prefers-reduced-motion`
>      - `rel="noopener noreferrer"` on external links
>      - uses the existing CSS variables, no hardcoded colors
>      - correct formatting of tiny prices (< €0.0001)
>      - no console errors
>   9. Small, focused PRs (one topic each). Rebase on the latest `main` before you finish.
> - **Test locally:** `python3 -m http.server 8080` in the repo root, then open http://localhost:8080/.

---

Dit is de briefing voor Google Jules en andere coding-agents die aan deze repo werken. Eigenaar: Titan (GitHub `rickvdwiel`). Hij is designer, schrijft Nederlands en verwacht strak, trots werk zonder verontschuldigende demo-toon.

## Wat is cryptodokter.nl
cryptodokter.nl is een publieke etalage van een **crypto-tradingbot die alleen op papier handelt**. Hij gebruikt echte Bitvavo-koersen, maar zet nooit een echte order. Het idee is "een tradingbot die alles laat zien": winst, verlies, fees, open posities en elke trade staan openbaar. Ook als het tegenzit.

Belangrijke eerlijkheid: de bot staat sinds 15 september op verlies, vooral door Bitvavo-fees (ongeveer 0,5–0,7% per round trip). De site toont dat open, met een vergelijking tegen buy-and-hold (BTC en een top-10-mand). Verberg verlies nooit en maak het niet mooier dan het is. De site verkoopt zichzelf juist met die transparantie.

## Hosting en hoe data binnenkomt
- **GitHub Pages**, statisch, met custom domain via `CNAME` (`cryptodokter.nl`). Er is geen server-side code: PHP en backends werken hier niet.
- De bot draait op een aparte machine (repo `rickvdwiel/CRYPTODOKTER`). Een publish-loop commit **elke 10 minuten** automatisch ververste data naar deze repo, als `rickvdwiel`. De meeste commits in de historie zijn dus "Paper-data verversen …". Die zijn normaal.
- `index.html` is één zelfstandige pagina (HTML + CSS + JS inline) die de JSON-bestanden hieronder met `fetch` laadt.

## Bestanden
| Bestand | Eigenaar | Mag Jules het aanpassen? |
|---|---|---|
| `index.html` | ontwerp/UI | **Ja**, de enige plek voor UI-werk |
| `404.html`, `assets/`, favicons, `og-image.png` | ontwerp | Ja, voorzichtig |
| `paper-live.json`, `paper-public-snapshot.json`, `equity.json` | publish-loop (elke 10 min) | **Nee**: wordt overschreven, gesaneerd via whitelist |
| `benchmark.json`, `h4-forward.json`, `desk-digest.json` | Trading Desk / Strategie Lab | **Nee** |
| `bulletin.json` | Newsbronnen (dagelijks) | **Nee** |
| `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml` | site-beheer | Nee, tenzij expliciet gevraagd |

Lees het formaat van de JSON's uit de bestaande bestanden en schrijf de UI zo dat ontbrekende of lege velden netjes degraderen ("—" of verbergen, nooit `NaN`, `undefined` of een crash).

## Secties in index.html (in volgorde)
- `#analyse`: kern-KPI's en rendement
- `#resultaten`: equity-curve met koop/verkoop-markers
- `#forward-test`: de aparte H4-trendpot (Strategie Lab)
- `#open-posities`: huidige paper-posities
- `#hoe-het-werkt`: uitleg
- `#marktbulletin`: nieuwsbulletin uit `bulletin.json`
- `#bezoekers`: bezoekersteller (GoatCounter, `cryptodokter.goatcounter.com`)
- `#doneer`: donaties via crypto-adressen, PayPal (`paypal.me/rickvdwiel`) en IBAN (iDEAL/Wero)

## Harde regels (acceptatiecriteria voor elke PR)
1. **Alleen paper.** Nooit code, teksten of knoppen die echte orders, exchange-API-keys, wallets koppelen of "nu investeren" suggereren. Geen beleggingsadvies.
2. **Merknaam staat er één keer, voluit `cryptodokter.nl`.** Niet zowel een logo als een grote kop "CryptoDokter". Geen emoji in het merk.
3. **Eén primaire CTA** per scherm. Geen concurrerende knoppen.
4. **Geen ops-, tunnel- of beheerlabels in de UI.** De publish-loop **weigert te publiceren** als `index.html` een van deze strings bevat: `loca.lt`, `trycloudflare`, `xo.je`, `hits.php`, `login.html`. Gebruik ze nergens, ook niet in commentaar.
5. **Doneersectie onaangetast.** Elk crypto-adres, de PayPal-link en het IBAN moeten byte-voor-byte gelijk blijven. Een verificatiescript controleert dit (244 checks). Verander geen adres, ook niet "voor de opmaak".
6. **GoatCounter blijft werken.** Er komen geen nieuwe externe scripts, trackers, fonts of CDN's zonder expliciete vraag.
7. **Eerlijke cijfers.** Geen nep-tellers, geen verzonnen "+1", geen gesimuleerde live-activiteit. Toon alleen wat in de JSON staat.
8. **Kwaliteit:**
   - mobiel netjes op 375px breed
   - toetsenbord-bedienbaar (focus zichtbaar, Esc sluit overlays, de focus keert terug)
   - externe links met `rel="noopener"`
   - kleine tokenprijzen (< €0,0001) correct en leesbaar
   - geen console-errors
9. **Klein en gericht.** Eén onderwerp per PR, met een duidelijke beschrijving. Raak geen data-bestanden aan. Twee PR's die allebei `index.html` wijzigen moeten na elkaar te mergen zijn zonder conflict.

## Stijl en toon
- Taal op de site: **Nederlands**.
- Toon: zelfverzekerd, levend, deelbaar. Geen "dit is maar een demo"-excuses, maar ook geen hype of winstbeloftes.
- Visueel: strak en rustig ("Spectrum-clean"). Gebruik de bestaande CSS-variabelen en het bestaande thema, geen hardcoded kleuren.

## Lokaal testen
Statisch serveren volstaat: `python3 -m http.server 8080` in de repo-root en open `http://localhost:8080/`. De JSON-bestanden in de repo zijn echte, recente data.
