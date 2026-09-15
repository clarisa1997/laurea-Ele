# Cartella Clinica di Ele 🎓

Sito goliardico per la laurea in Fisica Medica — tema medico + fisica + matematica, tutto in romanesco.
Sito statico multi-pagina, pronto per GitHub Pages.

## Struttura

```
index.html        Home (referto + countdown + reparti)
papiro.html       Il Papiro — verdetto goliardico / prescrizione
referto.html      Le Analisi — emocromo goliardico
percorso.html     Anamnesi — la storia clinica (timeline)
muro.html         Il Muro dei Messaggi Leggendari (con filtri)
galleria.html     Radiografie — galleria foto con lightbox
auguri.html       Prognosi — auguri finali
assets/
  style.css       Tutti gli stili (colori, tema chiaro/scuro)
  app.js          Navigazione, menu, tema, countdown, filtri, lightbox
```

## Come personalizzare

**Nome, corso, data della festa** → apri `assets/app.js` e modifica in cima l'oggetto `window.SITE`
(nome, titolo, città, dataFesta, labelData). Il nome si aggiorna in automatico su tutte le pagine.

**Messaggi del muro** → in `muro.html`, sostituisci i blocchi `<div class="note">...</div>` con quelli veri.
Il `data-cat` (uni / vita / classici) serve ai filtri.

**Foto** → metti le immagini nella cartella `assets/` e, in `galleria.html`, dentro ogni
`<div class="rx-frame">` scrivi `<img src="assets/nomefoto.jpg" alt="descrizione">`.

**Frasi e testi** → cerca i commenti `<!-- MODIFICA QUI -->` nelle pagine.

## Pubblicare su GitHub Pages

1. Crea un repository su GitHub (es. `laurea-ele`).
2. Carica tutti questi file nel repository.
3. Vai su **Settings → Pages**, sezione "Build and deployment":
   Source = *Deploy from a branch*, Branch = `main`, cartella `/ (root)`, poi **Save**.
4. Dopo qualche minuto il sito è online su `https://<tuo-utente>.github.io/laurea-ele/`.

Il file `.nojekyll` serve a far servire le pagine così come sono, senza elaborazioni.
