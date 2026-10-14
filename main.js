var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => BooksAndReviewsPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// sets/it/Recensione Romanzi.md
var Recensione_Romanzi_default = "---\ntipo: set-domande-arl\nnome: Romanzi\nsoglie: 3 / 5 / 7 / 9\ncolori: #e5484d / #f08c3a / #f5d142 / #8bc34a / #2e9e5b\n---\n\n## Trama\npeso: 20\ndescrizione: Originalit\xE0, coerenza, ritmo\n- La premessa si distingue da storie simili che conosco?\n- L'inizio mi ha agganciato entro i primi capitoli?\n- Gli eventi nascono l'uno dall'altro, senza coincidenze di comodo?\n- La trama \xE8 priva di buchi logici o contraddizioni?\n- C'\xE8 un conflitto centrale chiaro, con una posta in gioco concreta?\n- La storia procede senza parti inutili, ripetitive o allungate?\n- Le svolte sono preparate da indizi seminati prima, e non arrivano dal nulla?\n- La storia \xE8 riuscita a non essere prevedibile per me?\n- Le vicende rimaste in sospeso trovano una risposta entro la fine del libro?\n- Il finale \xE8 coerente con le premesse della storia?\n\n## Personaggi\npeso: 20\ndescrizione: Profondit\xE0, evoluzione, relazioni\n- Il protagonista ha una personalit\xE0 che ricorder\xF2?\n- Le scelte dei personaggi hanno motivazioni comprensibili?\n- I personaggi si comportano in modo coerente con ci\xF2 che sono?\n- Il protagonista \xE8 cambiato in modo credibile rispetto all'inizio?\n- I personaggi principali hanno difetti veri, che pesano sulle loro scelte?\n- Almeno un personaggio affronta un conflitto interiore?\n- I personaggi secondari hanno una vita propria e non sono solo funzionali?\n- Chi o cosa si oppone al protagonista ha ragioni comprensibili?\n- I rapporti tra i personaggi cambiano nel corso della storia?\n- Nei dialoghi riconoscerei chi parla anche senza l'indicazione del nome?\n\n## Stile di scrittura\nid: stile\npeso: 20\ndescrizione: Qualit\xE0 del linguaggio, leggibilit\xE0, creativit\xE0\n- La voce dell'autore \xE8 riconoscibile?\n- Il lessico \xE8 preciso, senza ripetizioni o parole generiche?\n- Ho capito tutto senza dover rileggere per chiarezza?\n- La prosa \xE8 priva di ridondanze e spiegazioni superflue?\n- Emozioni e caratteri vengono mostrati con fatti e gesti, anzich\xE9 dichiarati?\n- Le immagini e le metafore sono originali e non stereotipate?\n- Il tono resta coerente con il tipo di storia?\n- Il ritmo delle frasi si adatta alla scena (serrato nell'azione, disteso nella riflessione)?\n- Il punto di vista narrativo \xE8 gestito senza salti confusi?\n- Ho trovato almeno una frase che vorrei sottolineare o citare?\n\n## Ambientazione\npeso: 20\ndescrizione: Dettagli, atmosfera, immersione\n- Luogo ed epoca sono chiari fin da subito?\n- I luoghi sono resi con dettagli concreti e sensoriali, non generici?\n- L'ambientazione \xE8 credibile, per ricerca storica o per coerenza delle regole del mondo?\n- Riesco a immaginare dove si trovano i personaggi in ogni scena?\n- Ogni luogo ha un'atmosfera che percepisco?\n- Le informazioni sul contesto arrivano dentro la storia, senza blocchi descrittivi che la fermano?\n- L'ambiente influenza concretamente eventi e decisioni?\n- Il contesto sociale e culturale plasma il modo di essere dei personaggi?\n- I luoghi riflettono temi o stati d'animo della storia?\n- La storia perderebbe qualcosa se fosse ambientata altrove?\n\n## Emozioni\npeso: 20\ndescrizione: Capacit\xE0 di coinvolgere, emozionare e sorprendere\n- Ho sentito il bisogno di continuare a leggere?\n- Mi \xE8 importato davvero cosa succedeva ai personaggi?\n- Ho avuto una reazione fisica leggendo (riso, commozione, tensione, rabbia)?\n- C'\xE8 almeno una scena che ricorder\xF2 a lungo?\n- Il libro mi ha fatto provare emozioni diverse?\n- Le emozioni sono state guadagnate dalla storia, senza melodramma o forzature?\n- Ho ritrovato nella storia qualcosa di vicino alla mia esperienza?\n- Il libro mi ha fatto riflettere o cambiare punto di vista su qualcosa?\n- Il finale mi ha lasciato un'emozione forte?\n- Il libro non mi ha mai annoiato?\n";

// sets/it/Recensione Saggi.md
var Recensione_Saggi_default = "---\ntipo: set-domande-arl\nnome: Saggi\nsoglie: 3 / 5 / 7 / 9\ncolori: #e5484d / #f08c3a / #f5d142 / #8bc34a / #2e9e5b\n---\n\n## Contenuto e originalit\xE0\npeso: 20\ndescrizione: Tesi, originalit\xE0, completezza, attualit\xE0\n- La tesi principale del libro \xE8 chiara?\n- Il tema \xE8 trattato da un punto di vista originale?\n- Il libro affronta un tema importante?\n- Il libro aggiunge qualcosa rispetto ad altri testi sullo stesso tema?\n- L'autore evita banalit\xE0 e luoghi comuni?\n- Il contenuto corrisponde a ci\xF2 che promettono titolo e sottotitolo?\n- Il libro resta sul tema, senza divagazioni inutili?\n- L'autore propone una sua interpretazione, non solo una raccolta di informazioni?\n- L'argomento \xE8 trattato senza lacune importanti?\n- Il contenuto \xE8 ancora attuale?\n\n## Rigore e fonti\npeso: 20\ndescrizione: Prove, fonti, ragionamento\n- L'autore dimostra di conoscere a fondo l'argomento?\n- Le affermazioni importanti sono sostenute da prove o fonti?\n- Le fonti citate sono affidabili?\n- \xC8 facile risalire alle fonti (note, bibliografia)?\n- Dati e statistiche sono usati correttamente?\n- L'autore distingue chiaramente i fatti dalle sue opinioni?\n- Le obiezioni alla tesi vengono prese in considerazione?\n- Le posizioni diverse sono presentate in modo corretto?\n- Il ragionamento procede senza salti logici?\n- L'autore evita generalizzazioni non dimostrate?\n\n## Struttura e chiarezza\npeso: 20\ndescrizione: Organizzazione, spiegazioni, esempi\n- L'ordine dei capitoli segue una logica chiara?\n- Si capisce sempre in che punto del discorso ci si trova?\n- I capitoli sono proporzionati tra loro?\n- Ogni capitolo ha un obiettivo chiaro?\n- I concetti complessi sono spiegati in modo comprensibile?\n- I termini tecnici vengono spiegati quando servono?\n- Ci sono esempi concreti che aiutano a capire?\n- Il libro evita ripetizioni inutili?\n- La conclusione riprende i punti principali?\n- Indice e titoli aiutano a ritrovare gli argomenti?\n\n## Stile e qualit\xE0 del testo\npeso: 20\ndescrizione: Leggibilit\xE0, tono, cura editoriale\n- La lettura scorre senza fatica?\n- Il tono \xE8 adatto al tema, n\xE9 troppo accademico n\xE9 troppo superficiale?\n- L'autore evita un tono pretenzioso o autocelebrativo?\n- Le frasi sono chiare, senza giri di parole?\n- La lunghezza del libro \xE8 adeguata al contenuto?\n- Il testo \xE8 privo di errori di battitura e di grammatica?\n- L'impaginazione rende la lettura comoda?\n- Il libro ha mantenuto il mio interesse fino alla fine?\n- L'autore rende interessanti anche le parti pi\xF9 tecniche?\n- Lo stile dell'autore \xE8 personale e riconoscibile?\n\n## Utilit\xE0 e impatto\npeso: 20\ndescrizione: Utilit\xE0 pratica, spunti, soddisfazione\n- Ora capisco l'argomento meglio di prima?\n- Mi ha dato spunti da applicare nella vita o nel lavoro?\n- Mi ha fatto venire voglia di approfondire il tema?\n- Le idee principali mi sono rimaste impresse?\n- Lo consiglierei a chi \xE8 interessato al tema?\n- Tornerei a consultarlo come testo di riferimento?\n- Mi ha fatto mettere in discussione qualcosa che davo per scontato?\n- Il tempo dedicato alla lettura \xE8 stato ben speso?\n- Mi ha dato strumenti per farmi un'opinione mia sull'argomento?\n- Nel complesso, il libro mi ha soddisfatto?\n";

// sets/en/Review Novels.md
var Review_Novels_default = "---\ntipo: set-domande-arl\nnome: Novels\nsoglie: 3 / 5 / 7 / 9\ncolori: #e5484d / #f08c3a / #f5d142 / #8bc34a / #2e9e5b\n---\n\n## Plot\npeso: 20\ndescrizione: Originality, coherence, pacing\n- Does the premise stand out from similar stories I know?\n- Did the beginning hook me within the first chapters?\n- Do events arise from one another, without convenient coincidences?\n- Is the plot free of logical holes or contradictions?\n- Is there a clear central conflict with concrete stakes?\n- Does the story move along without useless, repetitive or padded parts?\n- Are the twists prepared by clues planted earlier, rather than coming out of nowhere?\n- Did the story manage not to be predictable for me?\n- Are the open threads resolved by the end of the book?\n- Is the ending consistent with the story's premises?\n\n## Characters\npeso: 20\ndescrizione: Depth, development, relationships\n- Does the protagonist have a personality I will remember?\n- Do the characters' choices have understandable motivations?\n- Do the characters behave consistently with who they are?\n- Does the protagonist change credibly from the beginning?\n- Do the main characters have real flaws that weigh on their choices?\n- Does at least one character face an inner conflict?\n- Do the secondary characters have a life of their own and are not merely functional?\n- Do those who oppose the protagonist have understandable reasons?\n- Do the relationships between characters change over the course of the story?\n- In the dialogues, would I recognise who is speaking even without the name?\n\n## Writing style\npeso: 20\ndescrizione: Quality of language, readability, creativity\n- Is the author's voice recognisable?\n- Is the vocabulary precise, without repetition or generic words?\n- Did I understand everything without having to reread for clarity?\n- Is the prose free of redundancy and superfluous explanation?\n- Are emotions and character shown through facts and gestures rather than stated?\n- Are the images and metaphors original and not stereotyped?\n- Does the tone stay consistent with the kind of story?\n- Does the rhythm of the sentences fit the scene (tight in action, relaxed in reflection)?\n- Is the narrative point of view handled without confusing jumps?\n- Did I find at least one sentence I would like to underline or quote?\n\n## Setting\npeso: 20\ndescrizione: Details, atmosphere, immersion\n- Are place and period clear from the start?\n- Are the places rendered with concrete, sensory details, not generic ones?\n- Is the setting credible, through historical research or consistency of the world's rules?\n- Can I picture where the characters are in every scene?\n- Does every place have an atmosphere I can perceive?\n- Does information about the context arrive within the story, without descriptive blocks that stop it?\n- Does the environment concretely influence events and decisions?\n- Does the social and cultural context shape the way the characters are?\n- Do the places reflect the themes or moods of the story?\n- Would the story lose something if it were set elsewhere?\n\n## Emotions\npeso: 20\ndescrizione: Ability to engage, move and surprise\n- Did I feel the need to keep reading?\n- Did I really care what happened to the characters?\n- Did I have a physical reaction while reading (laughter, being moved, tension, anger)?\n- Is there at least one scene I will remember for a long time?\n- Did the book make me feel different emotions?\n- Were the emotions earned by the story, without melodrama or forcing?\n- Did I find in the story something close to my own experience?\n- Did the book make me reflect or change my point of view on something?\n- Did the ending leave me with a strong emotion?\n- Was I never bored by the book?\n";

// sets/en/Review Essays.md
var Review_Essays_default = "---\ntipo: set-domande-arl\nnome: Essays\nsoglie: 3 / 5 / 7 / 9\ncolori: #e5484d / #f08c3a / #f5d142 / #8bc34a / #2e9e5b\n---\n\n## Content and originality\npeso: 20\ndescrizione: Thesis, originality, completeness, relevance\n- Is the book's main thesis clear?\n- Is the topic treated from an original point of view?\n- Does the book tackle an important subject?\n- Does the book add something compared with other texts on the same subject?\n- Does the author avoid banalities and clich\xE9s?\n- Does the content match what the title and subtitle promise?\n- Does the book stay on topic, without useless digressions?\n- Does the author offer their own interpretation, not just a collection of information?\n- Is the subject treated without important gaps?\n- Is the content still current?\n\n## Rigour and sources\npeso: 20\ndescrizione: Evidence, sources, reasoning\n- Does the author show a thorough knowledge of the subject?\n- Are the important claims supported by evidence or sources?\n- Are the cited sources reliable?\n- Is it easy to trace the sources (notes, bibliography)?\n- Are data and statistics used correctly?\n- Does the author clearly distinguish facts from opinions?\n- Are objections to the thesis taken into account?\n- Are differing positions presented fairly?\n- Does the reasoning proceed without logical leaps?\n- Does the author avoid unproven generalisations?\n\n## Structure and clarity\npeso: 20\ndescrizione: Organisation, explanations, examples\n- Does the order of the chapters follow a clear logic?\n- Is it always clear where you are in the argument?\n- Are the chapters proportioned to one another?\n- Does each chapter have a clear goal?\n- Are complex concepts explained in an understandable way?\n- Are technical terms explained when needed?\n- Are there concrete examples that help understanding?\n- Does the book avoid useless repetition?\n- Does the conclusion pick up the main points?\n- Do the index and headings help find topics again?\n\n## Style and quality of the text\npeso: 20\ndescrizione: Readability, tone, editorial care\n- Does the reading flow without effort?\n- Is the tone suited to the subject, neither too academic nor too superficial?\n- Does the author avoid a pretentious or self-celebratory tone?\n- Are the sentences clear, without circumlocutions?\n- Is the length of the book appropriate to the content?\n- Is the text free of typos and grammar errors?\n- Does the layout make reading comfortable?\n- Did the book hold my interest until the end?\n- Does the author make even the more technical parts interesting?\n- Is the author's style personal and recognisable?\n\n## Usefulness and impact\npeso: 20\ndescrizione: Practical usefulness, insights, satisfaction\n- Do I now understand the subject better than before?\n- Did it give me ideas to apply in life or work?\n- Did it make me want to explore the subject further?\n- Did the main ideas stay with me?\n- Would I recommend it to people interested in the subject?\n- Would I go back to it as a reference text?\n- Did it make me question something I took for granted?\n- Was the time spent reading well spent?\n- Did it give me the tools to form my own opinion on the subject?\n- Overall, did the book satisfy me?\n";

// main.ts
var VIEW_TYPE = "book-review-algorithm-view";
var TIPO = "recensione-arl";
var DEFAULTS = {
  cartella: "Libri/ARL",
  cartellaSet: "Libri/ARL/Set",
  cartellaCopertine: "Libri/ARL/Copertine",
  setPredefinitiCreati: false,
  domandePerSchermata: 5,
  schermoPieno: false,
  coloreBarra: "#4caf50",
  coloreBarraFine: "#2196f3",
  barraSfumata: false,
  lingua: "it",
  fontFamiglia: "",
  fontDimensione: 0,
  coloreTesto: "",
  colonneOrdine: ["codice", "titolo", "autore", "editore", "genere", "set", "pagine", "prezzo", "fine", "giorni", "arl", "valutazione", "restituzione", "trascorso", "premio"],
  colonneNascoste: [],
  coloreGrafico: "#8b5cf6",
  coloreGraficoFine: "#22d3ee",
  graficoSfumato: false,
  votoColori: true,
  votoSfumato: true,
  spessoreTemi: 12,
  evidenziaDomanda: true,
  evidenziaSfondo: "#2e9e5b",
  evidenziaTesto: "#ffffff",
  arlLive: false,
  riepilogoNascosti: [],
  galleriaMiniatura: 260,
  vlPerRipiano: 14,
  vlLarghezza: 1e3,
  vlAdatta: false,
  vlSfondo: "",
  vlMostra: "titoloAutore",
  vlGeneri: {},
  vlOrdine: [],
  vlCriterio: "",
  vlImmagine: "",
  vlImgModo: "cover",
  vlImgOscura: 20,
  vlImgSfoca: 0,
  vlDisposizioni: [],
  vlCorrente: "",
  spessoreGrafico: 3,
  altezzaCopertina: 240,
  spessoreBarra: 16,
  larghezza: 900,
  stelleTotali: 5
};
function fmt(n) {
  return n.toFixed(1).replace(".", ",");
}
function fmtData(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
function contrasto(a, b) {
  const lum = (c) => {
    const v = [1, 3, 5].map((i) => {
      const x = parseInt(c.slice(i, i + 2), 16) / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  };
  const la = lum(a);
  const lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
function giorniTra(inizio, fine) {
  const parse = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  const diff = Math.round((parse(fine) - parse(inizio)) / 864e5) + 1;
  return Number.isFinite(diff) ? diff : 0;
}
function etichettaGiorni(n) {
  return n === 1 ? "1 giorno" : `${n} giorni`;
}
function parsePrezzo(testo) {
  const t = testo.replace(/€/g, "").replace(/\s/g, "").replace(",", ".");
  if (t === "") return null;
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return NaN;
  return Math.round(parseFloat(t) * 100) / 100;
}
function formatNumeroEuro(n) {
  return n.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function formatEuro(n) {
  return `\u20AC ${formatNumeroEuro(n)}`;
}
function plurale(n, singolare, pluraleStr) {
  return `${n} ${n === 1 ? singolare : pluraleStr}`;
}
function calcolaScadenza(restituzione, restituito, adesso) {
  if (restituito) return { testo: "Restituito", classe: "arl-restituito" };
  if (!restituzione) return { testo: "\u2014", classe: "" };
  const [y, m, d] = restituzione.split("-").map(Number);
  const fine = new Date(y, m - 1, d + 1, 0, 0, 0);
  const MIN = 6e4;
  const ORA = 60 * MIN;
  const GIORNO = 24 * ORA;
  const diff = fine.getTime() - adesso.getTime();
  if (diff <= 0) {
    const n = Math.floor(-diff / GIORNO) + 1;
    return { testo: `Scaduto da ${plurale(n, "giorno", "giorni")}`, classe: "arl-scaduto" };
  }
  let mesi = (fine.getFullYear() - adesso.getFullYear()) * 12 + fine.getMonth() - adesso.getMonth();
  if (new Date(adesso.getFullYear(), adesso.getMonth() + mesi, adesso.getDate(), adesso.getHours(), adesso.getMinutes()) > fine) {
    mesi--;
  }
  if (mesi >= 1) return { testo: plurale(mesi, "mese", "mesi"), classe: "" };
  const giorni = Math.floor(diff / GIORNO);
  const ore = Math.floor(diff % GIORNO / ORA);
  if (giorni > 0) {
    return {
      testo: `${plurale(giorni, "giorno", "giorni")} e ${plurale(ore, "ora", "ore")}`,
      classe: ""
    };
  }
  return { testo: ore > 0 ? plurale(ore, "ora", "ore") : "meno di 1 ora", classe: "" };
}
function punteggioCategoria(risposte) {
  if (risposte.length === 0) return 0;
  const si = risposte.reduce((somma, r) => somma + (r === 1 ? 1 : 0), 0);
  return si * 10 / risposte.length;
}
function arrotonda1(n) {
  return Math.round(n * 10) / 10;
}
function fmtP(n) {
  const r = arrotonda1(n);
  return Number.isInteger(r) ? String(r) : fmt(r);
}
function calcolaArl(punteggi, pesi) {
  let p = pesi;
  let somma = p.reduce((a, b) => a + b, 0);
  if (!(somma > 0)) {
    p = punteggi.map(() => 1);
    somma = p.length;
  }
  const totale = punteggi.reduce((s, v, i) => s + v * p[i], 0) / somma;
  return Math.round(totale * 10) / 10;
}
var SOGLIE_STANDARD = [3, 5, 7, 9];
var COLORI_FASCE = ["#e5484d", "#f08c3a", "#f5d142", "#8bc34a", "#2e9e5b"];
function coloriValidi(v) {
  if (!Array.isArray(v) || v.length !== 5) return [...COLORI_FASCE];
  return v.map((c, i) => typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c.trim()) ? c.trim() : COLORI_FASCE[i]);
}
function estremiFasce(sg) {
  return [0, ...sg, 10];
}
function fasciaDi(v, sg) {
  const e = estremiFasce(sg);
  for (let i = 0; i < 5; i++) if (v <= e[i + 1]) return i;
  return 4;
}
function coloreVoto(v, sg, colori) {
  return colori[fasciaDi(v, sg)];
}
function sfondoVoto(v, sg, colori, sfumato) {
  const fin = colori[fasciaDi(v, sg)];
  if (!sfumato || v <= 0) return fin;
  const e = estremiFasce(sg);
  const fino = fasciaDi(v, sg);
  if (fino === 0) return fin;
  const stops = [];
  for (let i = 0; i <= fino; i++) {
    const lo = e[i];
    const hi = Math.min(e[i + 1], v);
    const pos = i === fino ? 100 : Math.max(0, Math.min(100, (lo + hi) / 2 / v * 100));
    stops.push(`${colori[i]} ${pos.toFixed(1)}%`);
  }
  return `linear-gradient(90deg, ${stops.join(", ")})`;
}
var PRESET_SOGLIE = [
  { nome: "Scala ARL", valori: [3, 5, 7, 9] },
  { nome: "Lineare", valori: [2, 4, 6, 8] },
  { nome: "Severa", valori: [5, 7, 8.5, 9.5] }
];
function soglieValide(v) {
  const msg = "Le soglie delle stelle devono essere 4 valori crescenti tra 0 e 10 (per esempio 3 / 5 / 7 / 9).";
  if (!Array.isArray(v) || v.length !== 4) return msg;
  for (let i = 0; i < 4; i++) {
    if (!Number.isFinite(v[i]) || v[i] <= 0 || v[i] >= 10) return msg;
    if (i > 0 && v[i] <= v[i - 1]) return msg;
  }
  return null;
}
function valoreCurva(x, rif) {
  const curva = [
    [0, 0],
    [0.2, rif[0]],
    [0.4, rif[1]],
    [0.6, rif[2]],
    [0.8, rif[3]],
    [1, 10]
  ];
  for (let i = 1; i < curva.length; i++) {
    if (x <= curva[i][0] + 1e-9) {
      const [x0, y0] = curva[i - 1];
      const [x1, y1] = curva[i];
      return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    }
  }
  return 10;
}
function soglie(totale, rif) {
  const out = [];
  for (let k = 1; k <= totale; k++) {
    out.push(Math.round(valoreCurva(k / totale, rif) * 10) / 10);
  }
  out[totale - 1] = 10;
  return out;
}
function stelleAssegnate(arl, totale, rif) {
  const s = soglie(totale, rif);
  const a = Math.round(arl * 10) / 10;
  for (let k = 0; k < totale; k++) {
    if (a <= s[k] + 1e-9) return k + 1;
  }
  return totale;
}
function stringaStelle(k) {
  return "\u2605".repeat(k);
}
var TIPO_SET = "set-domande-arl";
var SET_PREDEFINITI_MD = {
  it: { prefisso: "Recensione", testi: [Recensione_Romanzi_default, Recensione_Saggi_default] },
  en: { prefisso: "Review", testi: [Review_Novels_default, Review_Essays_default] }
};
function setPredefiniti(lingua, pesiRomanzi) {
  return SET_PREDEFINITI_MD[lingua].testi.map((testo, k) => {
    const r = parseSet(testo);
    if (k === 0 && lingua === "it" && pesiRomanzi && pesiRomanzi.length === r.categorie.length) {
      r.categorie.forEach((c, i) => {
        if (Number.isFinite(pesiRomanzi[i]) && pesiRomanzi[i] >= 0) c.peso = pesiRomanzi[i];
      });
    }
    return { nome: r.nome, categorie: r.categorie };
  });
}
function slug(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function idUnico(nome, usati) {
  const base = slug(nome) || "tema";
  let id = base;
  let n = 2;
  while (usati.has(id)) id = `${base}_${n++}`;
  return id;
}
function pulisciValore(v) {
  const t = v.trim();
  if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) {
    try {
      return String(JSON.parse(t));
    } catch (e) {
      return t.slice(1, -1);
    }
  }
  if (t.length >= 2 && t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1);
  return t;
}
function contenutoNormalizzato(testo) {
  return testo.replace(/\r\n?/g, "\n");
}
function eUnSet(testo) {
  const fm = /^---\n([\s\S]*?)\n---/.exec(contenutoNormalizzato(testo));
  return !!fm && /^tipo\s*:\s*set-domande-arl\s*$/m.test(fm[1]);
}
function parseSet(testo) {
  const errori = [];
  const t = contenutoNormalizzato(testo);
  let corpo = t;
  let nome = "";
  let soglieSet = [...SOGLIE_STANDARD];
  let coloriSet = [...COLORI_FASCE];
  const fm = /^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(t);
  if (fm) {
    corpo = t.slice(fm[0].length);
    const m = /^nome\s*:\s*(.+)$/im.exec(fm[1]);
    if (m) nome = pulisciValore(m[1]);
    const sg = /^soglie\s*:\s*(.+)$/im.exec(fm[1]);
    if (sg) {
      const valori = pulisciValore(sg[1]).split(/[/;]|,(?=\s)/).map((x) => parseFloat(x.trim().replace(",", ".")));
      if (soglieValide(valori) === null) soglieSet = valori;
      else errori.push("le soglie delle stelle non sono valide (servono 4 valori crescenti tra 0 e 10, per esempio \xAB3 / 5 / 7 / 9\xBB)");
    }
    const co = /^colori\s*:\s*(.+)$/im.exec(fm[1]);
    if (co) coloriSet = coloriValidi(pulisciValore(co[1]).split(/[/;,]/).map((x) => x.trim()));
  }
  const categorie = [];
  const idEspliciti = /* @__PURE__ */ new Map();
  let corrente = null;
  for (const riga of corpo.split("\n")) {
    const r = riga.trim();
    const titolo = /^##\s+(.+)$/.exec(r);
    if (titolo) {
      corrente = { id: "", nome: titolo[1].trim(), descr: "", peso: NaN, domande: [] };
      categorie.push(corrente);
      continue;
    }
    if (!corrente || !r) continue;
    const peso = /^peso\s*:\s*(.*)$/i.exec(r);
    if (peso) {
      const n = parseFloat(peso[1].replace("%", "").replace(",", ".").trim());
      if (Number.isFinite(n) && n >= 0) corrente.peso = n;
      else errori.push(`il peso del tema \xAB${corrente.nome}\xBB non \xE8 valido`);
      continue;
    }
    const descr = /^descrizione\s*:\s*(.*)$/i.exec(r);
    if (descr) {
      corrente.descr = descr[1].trim();
      continue;
    }
    const id = /^id\s*:\s*(.+)$/i.exec(r);
    if (id) {
      idEspliciti.set(corrente, id[1].trim());
      continue;
    }
    const domanda = /^(?:[-*]|\d+[.)])\s+(.+)$/.exec(r);
    if (domanda) corrente.domande.push(domanda[1].trim());
  }
  if (!nome) errori.push("manca il nome (propriet\xE0 \xABnome\xBB in cima alla nota)");
  if (categorie.length === 0) errori.push("non c'\xE8 nessun tema (ogni tema inizia con \xAB## Nome\xBB)");
  const idVisti = /* @__PURE__ */ new Set();
  const nomiVisti = /* @__PURE__ */ new Set();
  categorie.forEach((c, i) => {
    if (nomiVisti.has(c.nome.toLowerCase())) errori.push(`il tema \xAB${c.nome}\xBB \xE8 ripetuto`);
    nomiVisti.add(c.nome.toLowerCase());
    if (c.domande.length === 0) errori.push(`il tema \xAB${c.nome}\xBB non ha domande`);
    if (Number.isNaN(c.peso)) c.peso = 20;
    const esplicito = idEspliciti.get(c);
    let id = slug(esplicito != null ? esplicito : c.nome);
    if (!id) id = `tema_${i + 1}`;
    if (idVisti.has(id)) errori.push(`l'identificativo \xAB${id}\xBB \xE8 usato da pi\xF9 temi`);
    idVisti.add(id);
    c.id = id;
  });
  if (categorie.length > 0 && categorie.every((c) => c.peso === 0)) {
    errori.push("tutti i pesi sono zero");
  }
  return { nome, categorie, soglie: soglieSet, colori: coloriSet, errori };
}
function serializzaSet(nome, categorie, soglieSet = SOGLIE_STANDARD, coloriSet = COLORI_FASCE) {
  const semplice = /^[\p{L}\p{N} ._'()-]+$/u.test(nome);
  const righe = [
    "---",
    `tipo: ${TIPO_SET}`,
    `nome: ${semplice ? nome : JSON.stringify(nome)}`,
    `soglie: ${soglieSet.join(" / ")}`,
    `colori: ${coloriValidi(coloriSet).join(" / ")}`,
    "---",
    ""
  ];
  for (const c of categorie) {
    righe.push(`## ${c.nome.replace(/\s+/g, " ").trim()}`);
    if (c.id !== slug(c.nome)) righe.push(`id: ${c.id}`);
    righe.push(`peso: ${c.peso}`);
    if (c.descr.trim()) righe.push(`descrizione: ${c.descr.replace(/\s+/g, " ").trim()}`);
    for (const d of c.domande) righe.push(`- ${d.replace(/\s+/g, " ").trim()}`);
    righe.push("");
  }
  return righe.join("\n");
}
function totaleDomande(set) {
  return set.categorie.reduce((somma, c) => somma + c.domande.length, 0);
}
function riassuntoSet(set) {
  return `${plurale(set.categorie.length, "tema", "temi")} \xB7 ${plurale(
    totaleDomande(set),
    "domanda",
    "domande"
  )}`;
}
function etichettaLivello(l) {
  if (l < 3) return "Facile";
  if (l < 5) return "Accessibile";
  if (l < 7) return "Impegnativo";
  if (l < 9) return "Difficile";
  return "Molto difficile";
}
function binomiale50(n) {
  const out = [];
  let logC = 0;
  for (let k = 0; k <= n; k++) {
    if (k > 0) logC += Math.log((n - k + 1) / k);
    out.push(Math.exp(logC - n * Math.LN2));
  }
  return out;
}
var cacheLivello = /* @__PURE__ */ new Map();
function calcolaLivello(cats, stelleTotali, rif) {
  const temi = cats.map((c) => ({ peso: Math.max(0, c.peso), n: c.domande.length })).filter((t) => t.n > 0);
  if (temi.length === 0 || stelleTotali < 2) return null;
  const somma = temi.reduce((a, t) => a + t.peso, 0);
  const pesi = somma > 0 ? temi.map((t) => t.peso / somma) : temi.map(() => 1 / temi.length);
  const chiave = JSON.stringify([temi.map((t, i) => [t.n, Math.round(pesi[i] * 1e6)]), stelleTotali, rif]);
  const inCache = cacheLivello.get(chiave);
  if (inCache) return inCache;
  const MAX = 1e4;
  let dist = new Float64Array(MAX + 1);
  dist[0] = 1;
  temi.forEach((t, i) => {
    const bin = binomiale50(t.n);
    const quote = bin.map((_, k) => Math.round(10 * k / t.n * pesi[i] * 1e3));
    const nuova = new Float64Array(MAX + 1);
    for (let a = 0; a <= MAX; a++) {
      const pa = dist[a];
      if (!pa) continue;
      for (let k = 0; k < bin.length; k++) {
        nuova[Math.min(MAX, a + quote[k])] += pa * bin[k];
      }
    }
    dist = nuova;
  });
  const sg = soglie(stelleTotali, rif);
  const perStella = new Array(stelleTotali).fill(0);
  for (let a = 0; a <= MAX; a++) {
    if (!dist[a]) continue;
    const x = Math.round(a / 100) / 10;
    let k = 0;
    while (k < stelleTotali - 1 && x > sg[k] + 1e-9) k++;
    perStella[k] += dist[a];
  }
  const probabilita = new Array(stelleTotali).fill(0);
  let resto = 0;
  for (let k = stelleTotali - 1; k >= 0; k--) {
    resto += perStella[k];
    probabilita[k] = Math.min(1, resto);
  }
  let r = 0;
  for (let k = 1; k < stelleTotali; k++) {
    r += Math.min(1, -Math.log10(Math.max(probabilita[k], 1e-12)) / 3);
  }
  r /= stelleTotali - 1;
  const livello = arrotonda1(Math.min(10, Math.max(1, 11 * r - 0.72)));
  const esito = { livello, etichetta: etichettaLivello(livello), probabilita };
  cacheLivello.set(chiave, esito);
  return esito;
}
var LIVELLI = [
  { nome: "Facile", significato: "le stelle si prendono con facilit\xE0, anche con un libro cos\xEC cos\xEC" },
  { nome: "Accessibile", significato: "le stelle alte richiedono un libro buono, ma non eccezionale" },
  { nome: "Impegnativo", significato: "per le stelle alte serve un libro davvero bello" },
  { nome: "Difficile", significato: "le stelle alte sono rare, anche per chi risponde bene" },
  { nome: "Molto difficile", significato: "le stelle alte sono quasi irraggiungibili" }
];
function creaTabellaLivelli(parent, evidenziati) {
  const tabella = parent.createEl("table", { cls: "arl-livelli" });
  const testa = tabella.createEl("thead").createEl("tr");
  testa.createEl("th", { text: "Livello" });
  testa.createEl("th", { text: "Significato" });
  testa.createEl("th", { text: "" });
  const corpo = tabella.createEl("tbody");
  for (const l of LIVELLI) {
    const tr2 = corpo.createEl("tr");
    const nota = evidenziati.get(l.nome);
    if (nota !== void 0) tr2.addClass("is-current");
    tr2.createEl("td", { text: l.nome, cls: "arl-titolo-cell arl-nowrap" });
    tr2.createEl("td", { text: l.significato });
    tr2.createEl("td", { text: nota != null ? nota : "", cls: "arl-nowrap arl-livelli-nota" });
  }
}
function fmtPerc(p) {
  if (p < 1e-4) return "<0,01%";
  const v = p * 100;
  if (v >= 99.5) return "100%";
  const dec = v >= 10 ? 0 : v >= 1 ? 1 : 2;
  return `${v.toFixed(dec).replace(".", ",")}%`;
}
function testoLivello(l) {
  return l ? l.etichetta : "\u2014";
}
var SPIEGAZIONE_LIVELLO = "Il livello dice quanto \xE8 difficile ottenere stelle con questo set (Facile, Accessibile, Impegnativo, Difficile, Molto difficile): pi\xF9 le stelle sono rare per chi risponde a caso, pi\xF9 il livello \xE8 alto. Dipende dalle domande, dai pesi e dalle soglie delle stelle di questo set.";
function rispostePerSet(set) {
  return set.categorie.map((c) => c.domande.map(() => null));
}
function risposteDaStringa(s, lunghezza) {
  return Array.from(
    { length: lunghezza },
    (_, i) => s[i] === "S" ? 1 : s[i] === "N" ? 0 : null
  );
}
var SEP_PERSONAGGIO = " | ";
var TITOLO_ANNOTAZIONI = "Estratti e annotazioni";
var TITOLO_PERSONAGGI = "Personaggi";
function trovaSezione(righe, titolo) {
  const i = righe.findIndex((r) => r.trim().toLowerCase() === `## ${titolo}`.toLowerCase());
  if (i < 0) return null;
  let f = righe.length;
  for (let j = i + 1; j < righe.length; j++) {
    if (/^#{1,2}\s/.test(righe[j])) {
      f = j;
      break;
    }
  }
  return [i, f];
}
function leggiSezione(testo, titolo) {
  const righe = testo.split("\n");
  const t = trovaSezione(righe, titolo);
  if (!t) return "";
  return righe.slice(t[0] + 1, t[1]).join("\n").trim();
}
function impostaSezione(testo, titolo, contenuto) {
  const righe = testo.replace(/\s+$/, "").split("\n");
  const t = trovaSezione(righe, titolo);
  const nuovo = contenuto.trim() ? [`## ${titolo}`, "", ...contenuto.trim().split("\n"), ""] : [];
  if (t) {
    righe.splice(t[0], t[1] - t[0], ...nuovo);
  } else if (nuovo.length) {
    righe.push("", ...nuovo);
  }
  return righe.join("\n").replace(/\s+$/, "") + "\n";
}
function personaggiDaFm(v) {
  if (!Array.isArray(v)) return [];
  const out = [];
  for (const x of v) {
    const t = String(x != null ? x : "");
    const i = t.indexOf(SEP_PERSONAGGIO);
    const nome = (i < 0 ? t : t.slice(0, i)).trim();
    const descrizione = i < 0 ? "" : t.slice(i + SEP_PERSONAGGIO.length).trim();
    if (nome) out.push({ nome, descrizione });
  }
  return out;
}
function codiceDaFm(v) {
  if (v === void 0 || v === null || v === "") return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isInteger(n) && n > 0 ? n : null;
}
var TITOLO_LETTURE = "Letture";
var TITOLO_GALLERIA = "Galleria";
function dividiVoceGalleria(x) {
  const s = String(x != null ? x : "").replace(/^!/, "");
  const m = /^(.*?\]\])\s*\|\s*([\s\S]*)$/.exec(s);
  return { d: copertinaDaFm(m ? m[1] : s), t: m ? m[2].trim() : "" };
}
function galleriaVociDaFm(v) {
  if (!Array.isArray(v)) return [];
  return v.map(dividiVoceGalleria).filter((x) => x.d);
}
function galleriaDaFm(v) {
  return galleriaVociDaFm(v).map((x) => x.d);
}
function pulisciDidascalia(t) {
  return t.replace(/\s+/g, " ").trim().slice(0, 200);
}
function pagineLette(r) {
  return r.a - r.da + 1;
}
function lettureDaFm(v) {
  if (!Array.isArray(v)) return [];
  const out = [];
  for (const x of v) {
    const m = /^\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(\d+)\s*\|\s*(\d+)\s*$/.exec(String(x != null ? x : ""));
    if (!m) continue;
    const da = parseInt(m[2], 10);
    const a = parseInt(m[3], 10);
    if (da >= 1 && a >= da) out.push({ data: m[1], da, a });
  }
  return out.sort((p, q) => p.data.localeCompare(q.data) || p.da - q.da);
}
function isoLocale(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
var ESTENSIONI_IMMAGINE = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "avif"];
function copertinaDaFm(v) {
  let t = v;
  while (Array.isArray(t)) t = t[0];
  const testo = String(t != null ? t : "").trim();
  if (!testo) return "";
  const m = /\[\[([^\]|#]+)/.exec(testo);
  return (m ? m[1] : testo).trim();
}
function normalizzaCopertina(testo) {
  const t = testo.trim();
  if (!t) return "";
  return /^\[\[.+\]\]$/.test(t) ? t : `[[${t.replace(/^\[\[|\]\]$/g, "")}]]`;
}
function leggiLibro(app, file) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const fm = (_a = app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
  if (!fm || fm.tipo !== TIPO) return null;
  const risposte = {};
  const punteggi = {};
  for (const k of Object.keys(fm)) {
    if (k.startsWith("risposte_")) {
      risposte[k.slice("risposte_".length)] = String((_b = fm[k]) != null ? _b : "");
    } else if (k.startsWith("punteggio_")) {
      const n = Number(String(fm[k]).replace(",", "."));
      if (Number.isFinite(n)) punteggi[k.slice("punteggio_".length)] = n;
    }
  }
  const inizio = String((_c = fm.inizio_lettura) != null ? _c : "").slice(0, 10);
  const fine = String((_d = fm.fine_lettura) != null ? _d : "").slice(0, 10);
  const pagine = Math.round(Number(fm.pagine));
  const prezzoGrezzo = fm.prezzo === void 0 || fm.prezzo === null || fm.prezzo === "" ? NaN : Number(String(fm.prezzo).replace(",", "."));
  const restituzione = String((_e = fm.restituzione) != null ? _e : "").slice(0, 10);
  const haArl = fm.arl !== void 0 && fm.arl !== null && fm.arl !== "" && Number.isFinite(Number(fm.arl));
  const valutato = haArl || Object.keys(punteggi).length > 0;
  let arl = haArl ? Number(fm.arl) : 0;
  if (!haArl && valutato) {
    const v = Object.values(punteggi);
    arl = arrotonda1(v.reduce((a, b) => a + b, 0) / v.length);
  }
  return {
    file,
    personaggi: personaggiDaFm(fm.personaggi),
    valutato,
    codice: codiceDaFm(fm.codice),
    copertina: copertinaDaFm(fm.copertina),
    galleria: galleriaDaFm(fm.galleria),
    galleriaTesti: galleriaVociDaFm(fm.galleria).map((x) => pulisciDidascalia(x.t)),
    letture: lettureDaFm(fm.letture),
    manuale: fm.valutazione_tipo === "manuale",
    // i libri valutati prima dell'introduzione dei set sono recensioni di romanzi
    set: String((_f = fm.set) != null ? _f : "").trim() || (valutato ? "Romanzi" : ""),
    titolo: String((_g = fm.titolo) != null ? _g : file.basename),
    autore: String((_h = fm.autore) != null ? _h : ""),
    editore: String((_i = fm.editore_anno) != null ? _i : ""),
    genere: String((_j = fm.genere) != null ? _j : "").trim(),
    premio: String((_k = fm.premio) != null ? _k : "").trim(),
    pagine: Number.isFinite(pagine) && pagine > 0 ? pagine : 0,
    prezzo: Number.isFinite(prezzoGrezzo) && prezzoGrezzo >= 0 ? prezzoGrezzo : null,
    restituzione: /^\d{4}-\d{2}-\d{2}$/.test(restituzione) ? restituzione : "",
    restituito: fm.restituito === true || fm.restituito === "true",
    inizio,
    fine,
    giorni: inizio && fine ? giorniTra(inizio, fine) : 0,
    arl,
    risposte,
    punteggi
  };
}
function libroCompatibile(l, set) {
  if (Object.keys(l.risposte).length !== set.categorie.length) return false;
  return set.categorie.every((c) => {
    const r = l.risposte[c.id];
    return typeof r === "string" && r.length === c.domande.length && /^[SN]+$/.test(r);
  });
}
function nomeTema(id, set) {
  var _a;
  const dalSet = (_a = set == null ? void 0 : set.categorie.find((c) => c.id === id)) == null ? void 0 : _a.nome;
  if (dalSet) return dalSet;
  const t = id.replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}
function datiVuoti(set) {
  return {
    set: set.nome,
    codice: "",
    copertina: "",
    titolo: "",
    autore: "",
    editore: "",
    genere: "",
    premio: "",
    pagine: "",
    prezzo: "",
    restituzione: "",
    restituito: false,
    inizio: "",
    fine: "",
    risposte: rispostePerSet(set)
  };
}
function datiDaLibro(l, set) {
  return {
    set: l.set || set.nome,
    codice: l.codice !== null ? String(l.codice) : "",
    copertina: l.copertina ? `[[${l.copertina}]]` : "",
    titolo: l.titolo,
    autore: l.autore,
    editore: l.editore,
    genere: l.genere,
    premio: l.premio,
    pagine: l.pagine ? String(l.pagine) : "",
    prezzo: l.prezzo !== null ? formatNumeroEuro(l.prezzo) : "",
    restituzione: l.restituzione,
    restituito: l.restituito,
    inizio: l.inizio,
    fine: l.fine,
    risposte: set.categorie.map((c) => {
      var _a;
      return risposteDaStringa((_a = l.risposte[c.id]) != null ? _a : "", c.domande.length);
    })
  };
}
var LINGUA = "it";
var EN = {
  // barra e comandi
  "Apri Books and Reviews": "Open Books and Reviews",
  "? Guida": "? Guide",
  "Guida ai set": "Guide to sets",
  "Nessun libro ancora.": "No books yet.",
  "1. Premi \xABNuovo libro\xBB e inserisci i dati del libro.": "1. Press \xABNew book\xBB and enter the book's details.",
  "2. A lettura finita, premi \xABValuta libro\xBB e rispondi alle domande.": "2. When you finish reading, press \xABRate book\xBB and answer the questions.",
  "I libri li inserisci tu; i set di valutazione sono gi\xE0 pronti.": "You add the books yourself; the evaluation sets are already there.",
  "Nuovo libro": "New book",
  "Libreria": "Library",
  "Valuta libro": "Rate book",
  "Set di valutazione": "Evaluation sets",
  // livelli e soglie
  "Scala ARL": "ARL scale",
  "Lineare": "Linear",
  "Severa": "Strict",
  "Facile": "Easy",
  "Accessibile": "Accessible",
  "Impegnativo": "Demanding",
  "Difficile": "Hard",
  "Molto difficile": "Very hard",
  "Livello": "Level",
  "Significato": "Meaning",
  "le stelle si prendono con facilit\xE0, anche con un libro cos\xEC cos\xEC": "stars are easy to get, even with a so-so book",
  "le stelle alte richiedono un libro buono, ma non eccezionale": "high stars need a good book, but not an exceptional one",
  "per le stelle alte serve un libro davvero bello": "high stars need a really great book",
  "le stelle alte sono rare, anche per chi risponde bene": "high stars are rare, even for those who answer well",
  "le stelle alte sono quasi irraggiungibili": "high stars are almost unreachable",
  "Il livello dice quanto \xE8 difficile ottenere stelle con questo set (Facile, Accessibile, Impegnativo, Difficile, Molto difficile): pi\xF9 le stelle sono rare per chi risponde a caso, pi\xF9 il livello \xE8 alto. ": "The level tells how hard it is to earn stars with this set (Easy, Accessible, Demanding, Hard, Very hard): the rarer the stars are for someone answering at random, the higher the level. ",
  "Dipende dalle domande, dai pesi e dalle soglie delle stelle di questo set.": "It depends on the questions, the weights and the star thresholds of this set.",
  "Le soglie delle stelle devono essere 4 valori crescenti tra 0 e 10 (per esempio 3 / 5 / 7 / 9).": "Star thresholds must be 4 increasing values between 0 and 10 (for example 3 / 5 / 7 / 9).",
  // libro
  "Restituito": "Returned",
  "meno di 1 ora": "less than 1 hour",
  "Inserisci il titolo del libro.": "Enter the book title.",
  "Il codice deve essere un numero intero maggiore di zero.": "The code must be a whole number greater than zero.",
  "Le pagine devono essere un numero intero maggiore di zero.": "Pages must be a whole number greater than zero.",
  "Il prezzo deve essere un importo come 9,90.": "The price must be an amount such as 9.90.",
  "Inserisci anche la data di inizio lettura.": "Also enter the reading start date.",
  "La data di fine non pu\xF2 precedere quella di inizio.": "The end date cannot be before the start date.",
  "Modifica dati del libro": "Edit book details",
  "Censisci il libro con i suoi dati. La valutazione si fa dopo, quando lo hai finito, da \xABValuta libro\xBB.": "Register the book with its details. The rating comes later, once you have finished it, from \xABRate book\xBB.",
  "Codice": "Code",
  "Numero progressivo del libro: proposto in automatico (il pi\xF9 alto + 1), puoi cambiarlo.": "Sequential book number: suggested automatically (highest + 1), you can change it.",
  "Titolo": "Title",
  "Autore": "Author",
  "Editore, anno": "Publisher, year",
  "Genere": "Genre",
  "Premio": "Award",
  "Colonne della lista": "List columns",
  "Scegli quali colonne mostrare e in che ordine: trascina \u22EE\u22EE per spostare. Titolo e Autore sono sempre visibili. Vale per Libreria e Valuta libro.": "Choose which columns to show and in what order: drag \u22EE\u22EE to move. Title and Author are always visible. Applies to Library and Rate book.",
  "sempre visibile": "always visible",
  "Ripristina colonne predefinite": "Restore default columns",
  "Facoltativo: premio o riconoscimento ricevuto dal libro.": "Optional: award or prize won by the book.",
  "Fantascienza, Fantasy, Thriller\u2026": "Sci-fi, Fantasy, Thriller\u2026",
  "Pagine totali": "Total pages",
  "Prezzo (\u20AC)": "Price (\u20AC)",
  "Copertina": "Cover",
  "Immagine non trovata nel vault.": "Image not found in the vault.",
  "Collegamento a un'immagine, per esempio [[Copertine/dune.jpg]].": "Link to an image, for example [[Covers/dune.jpg]].",
  "Scegli\u2026": "Choose\u2026",
  "Nel vault non ci sono immagini.": "There are no images in the vault.",
  "Dal computer\u2026": "From computer\u2026",
  "Copertina aggiunta al vault.": "Cover added to the vault.",
  "Rimuovi": "Remove",
  "La data di fine \xE8 precedente alla data di inizio.": "The end date is before the start date.",
  "Inizio lettura": "Reading start",
  "Facoltativa: puoi inserirla anche pi\xF9 tardi.": "Optional: you can enter it later.",
  "Fine lettura": "Reading end",
  "Restituzione": "Return date",
  "Facoltativa. Il tempo rimanente compare nella libreria.": "Optional. The remaining time appears in the library.",
  "Ferma il conto alla rovescia.": "Stops the countdown.",
  "Annulla": "Cancel",
  "Immagine dietro la libreria": "Image behind the bookshelf",
  "Nessuna. Una parete o una stanza dietro lo scaffale (meglio sotto i 2000 px di larghezza).": "None. A wall or a room behind the shelves (better under 2000 px wide).",
  "Nessuna": "None",
  "Adattamento dell'immagine": "Image fit",
  "Copri tutto riempie l'area (tagliando i bordi), Adatta mostra l'immagine intera, Ripeti la ripete come un tappeto.": "Cover fills the area (cropping the edges), Fit shows the whole image, Repeat tiles it like a carpet.",
  "Copri tutto": "Cover",
  "Ripeti": "Repeat",
  "Oscura l'immagine": "Darken the image",
  "Velatura scura (da 0 a 70 %) per far risaltare i libri.": "Dark veil (0 to 70 %) to make the books stand out.",
  "Sfocatura": "Blur",
  "Effetto fuori fuoco (da 0 a 20 px) per non distrarre dai libri.": "Out-of-focus effect (0 to 20 px) so it does not distract from the books.",
  "Disposizione:": "Arrangement:",
  "Ordine libero (non salvato)": "Free order (not saved)",
  "\u25CF modificata": "\u25CF modified",
  "Salva come\u2026": "Save as\u2026",
  "Ripristina": "Restore",
  "Altre azioni": "More actions",
  "Rinomina": "Rename",
  "Salva la disposizione come": "Save the arrangement as",
  "Rinomina la disposizione": "Rename the arrangement",
  "Duplica la disposizione": "Duplicate the arrangement",
  "Nome della disposizione": "Arrangement name",
  "Scrivi un nome.": "Enter a name.",
  "Esiste gi\xE0 una disposizione con questo nome.": "An arrangement with this name already exists.",
  "Codice: dal pi\xF9 alto al pi\xF9 basso": "Code: from highest to lowest",
  "Codice: dal pi\xF9 basso al pi\xF9 alto": "Code: from lowest to highest",
  "Lettura: dalla pi\xF9 recente alla pi\xF9 vecchia": "Reading: from most recent to oldest",
  "Lettura: dalla pi\xF9 vecchia alla pi\xF9 recente": "Reading: from oldest to most recent",
  "Pagine: dal libro con pi\xF9 pagine a quello con meno": "Pages: from the book with most pages to the one with fewest",
  "Pagine: dal libro con meno pagine a quello con pi\xF9": "Pages: from the book with fewest pages to the one with most",
  "Codice:": "Code:",
  "Lettura:": "Reading:",
  "Pagine:": "Pages:",
  "Libreria virtuale": "Virtual bookshelf",
  "Trascina i libri per cambiarne la posizione. Clic su un libro per aprirlo.": "Drag the books to change their position. Click a book to open it.",
  "Libri per ripiano": "Books per shelf",
  "Quanti libri stanno su ogni ripiano (da 5 a 40). Cambiandolo, i libri si ridistribuiscono nell'ordine salvato.": "How many books fit on each shelf (5 to 40). Changing it redistributes the books in the saved order.",
  "La libreria occupa tutta la larghezza della finestra, ignorando la larghezza scelta qui sotto.": "The bookshelf takes the whole window width, ignoring the width chosen below.",
  "Larghezza della libreria": "Bookshelf width",
  "In pixel (da 500 a 2400).": "In pixels (500 to 2400).",
  "Testo sul dorso": "Text on the spine",
  "Cosa si legge sul dorso di ogni libro. Il carattere si riduce da solo per far stare tutto il testo.": "What is written on each book's spine. The font shrinks by itself so that all the text fits.",
  "Titolo e autore": "Title and author",
  "Solo titolo": "Title only",
  "Sfondo della libreria": "Bookshelf background",
  "Predefinito: legno. Scegliendo un colore, lo sfondo diventa una tinta unita.": "Default: wood. Choosing a colour makes the background a solid colour.",
  "Usa il legno": "Use wood",
  "Colori per genere": "Colours by genre",
  "Colore del dorso dei libri di ogni genere. Senza una scelta, il genere ha una tinta automatica sempre uguale.": "Spine colour of the books of each genre. Without a choice, the genre gets an automatic tint that never changes.",
  "Usa la tinta automatica": "Use the automatic tint",
  "Ordine dei libri": "Book order",
  "Cancella le posizioni scelte trascinando e riporta i libri in ordine di codice, dal pi\xF9 alto al pi\xF9 basso.": "Clears the positions chosen by dragging and puts the books back in code order, from highest to lowest.",
  "Ripristina l'ordine per codice": "Restore the order by code",
  "Ripristina ordine per codice": "Restore the order by code",
  "Premi ancora per confermare": "Press again to confirm",
  "Ordine ripristinato.": "Order restored.",
  "Evidenzia la domanda": "Highlight the question",
  "Durante la valutazione una barra colorata mette in risalto la domanda corrente.": "While rating, a coloured bar highlights the current question.",
  "Colore dello sfondo della domanda evidenziata": "Background colour of the highlighted question",
  "Colore del testo della domanda evidenziata": "Text colour of the highlighted question",
  "Predefinito: verde.": "Default: green.",
  "Predefinito: bianco.": "Default: white.",
  "2. La trama \xE8 originale?": "2. Is the plot original?",
  "Attenzione: i due colori sono troppo simili, il testo potrebbe essere poco leggibile.": "Warning: the two colours are too similar, the text may be hard to read.",
  "Modifica didascalia": "Edit caption",
  "Didascalia (facoltativa)": "Caption (optional)",
  "Salva": "Save",
  "Salva libro": "Save book",
  "Dati salvati.": "Details saved.",
  "Libro aggiunto alla libreria.": "Book added to the library.",
  "Cerca un'immagine nel vault\u2026": "Search for an image in the vault\u2026",
  // valutazione
  "Indietro": "Back",
  "Aggiorna valutazione": "Update rating",
  "Scegli il set di valutazione: domande mirate, suddivise per tematiche.": "Choose the evaluation set: targeted questions grouped by theme.",
  "\u2190 questo set": "\u2190 this set",
  "Inizia valutazione": "Start rating",
  "Avanti": "Next",
  "S\xEC": "Yes",
  "No": "No",
  "Risultato": "Result",
  "Punteggio ARL": "ARL score",
  "Salva valutazione": "Save rating",
  "Valutazione salvata.": "Rating saved.",
  "Valutazione manuale": "Manual rating",
  "Inserisci direttamente il punteggio ARL (da 0 a 10), senza rispondere alle domande: le stelle si calcolano da sole. Sostituisce l'eventuale valutazione gi\xE0 presente.": "Enter the ARL score directly (0 to 10), without answering the questions: stars are computed automatically. It replaces any existing rating.",
  "Inserisci un numero da 0 a 10, per esempio 7,0.": "Enter a number from 0 to 10, for example 7.0.",
  "Salva valutazione manuale": "Save manual rating",
  "Il punteggio ARL deve essere un numero da 0 a 10, per esempio 7,0.": "The ARL score must be a number from 0 to 10, for example 7.0.",
  "Valutazione manuale salvata.": "Manual rating saved.",
  "Impossibile salvare la valutazione.": "Unable to save the rating.",
  "Valutazione manuale: il punteggio ARL \xE8 stato inserito direttamente, senza le domande.": "Manual rating: the ARL score was entered directly, without the questions.",
  "Da valutare: quando hai finito il libro premi \xABValuta\xBB.": "To rate: when you finish the book press \xABRate\xBB.",
  "Valuta con le domande": "Rate with questions",
  "Rivedi valutazione": "Review rating",
  "Valuta": "Rate",
  "Lavoro in corso: premi di nuovo per abbandonarlo.": "Work in progress: press again to discard it.",
  // libreria
  "Cod.": "No.",
  "Set": "Set",
  "Pagine": "Pages",
  "Prezzo": "Price",
  "Lettura": "Reading",
  "Giorni": "Days",
  "Valutazione": "Rating",
  "Scegli il libro da valutare: in alto quelli ancora senza valutazione, poi quelli gi\xE0 valutati (di cui puoi aggiornare la valutazione).": "Choose the book to rate: unrated books on top, then already rated ones (whose rating you can update).",
  "Cerca per titolo, autore, editore, genere o set": "Search by title, author, publisher, genre or set",
  "Tutti i libri": "All books",
  "Da valutare": "To rate",
  "Valutati": "Rated",
  "Nessun libro in libreria. Usa \xABNuovo libro\xBB per aggiungere il primo.": "No books in the library. Use \xABNew book\xBB to add the first one.",
  "Nessun libro corrisponde alla ricerca.": "No book matches the search.",
  // lettura
  "Andamento della lettura": "Reading progress",
  "Registra le pagine lette giorno per giorno. Da 10 a 20 contano 11 pagine (estremi inclusi).": "Record the pages read day by day. From 10 to 20 counts as 11 pages (both ends included).",
  "Nessuna lettura registrata.": "No reading recorded.",
  "Nessuna lettura: aggiungine una.": "No readings: add one.",
  "Data": "Date",
  "Da pag.": "From p.",
  "A pag.": "To p.",
  "Pagine lette": "Pages read",
  "Elimina lettura": "Delete reading",
  "+ Aggiungi lettura": "+ Add reading",
  "Salva letture": "Save readings",
  "Ogni lettura deve avere una data e pagine intere maggiori di zero.": "Every reading needs a date and whole pages greater than zero.",
  "La pagina finale non pu\xF2 essere minore di quella iniziale.": "The last page cannot be lower than the first page.",
  "Letture salvate.": "Readings saved.",
  "Impossibile salvare le letture.": "Unable to save the readings.",
  // personaggi e annotazioni
  "Nessun personaggio: aggiungine uno.": "No characters: add one.",
  "Nome (es. Attila)": "Name (e.g. Attila)",
  "Descrizione (es. il guerriero, personaggio principale)": "Description (e.g. the warrior, main character)",
  "Elimina personaggio": "Delete character",
  "+ Aggiungi personaggio": "+ Add character",
  "Salva personaggi": "Save characters",
  "Personaggi salvati.": "Characters saved.",
  "Impossibile salvare i personaggi.": "Unable to save the characters.",
  "Personaggi": "Characters",
  "Estratti e annotazioni": "Excerpts and notes",
  "Scrivi qui estratti, citazioni, note e impressioni sul libro\u2026": "Write excerpts, quotes, notes and impressions about the book here\u2026",
  "Salva annotazioni": "Save notes",
  "Impossibile leggere la nota.": "Unable to read the note.",
  "Annotazioni salvate nella nota.": "Notes saved in the note.",
  "Impossibile salvare le annotazioni.": "Unable to save the notes.",
  // dettaglio
  "Modifica dati": "Edit details",
  "Segna come restituito": "Mark as returned",
  "Andamento lettura": "Reading progress",
  "Apri nota": "Open note",
  "Elimina": "Delete",
  "Conferma eliminazione": "Confirm deletion",
  "Libro eliminato.": "Book deleted.",
  // set
  "Un set di valutazione serve a valutare un libro attraverso domande mirate, suddivise per tematiche (per esempio Trama, Personaggi, Stile). ": "An evaluation set rates a book through targeted questions grouped by theme (for example Plot, Characters, Style). ",
  "Ogni domanda ha risposta S\xEC o No: i S\xEC determinano il punteggio del tema (da 0 a 10) e la media dei temi, secondo i pesi, d\xE0 il punteggio ARL da cui derivano le stelle. ": "Each question is answered Yes or No: the Yes answers set the theme score (0 to 10) and the weighted average of the themes gives the ARL score, from which the stars derive. ",
  "Il set si sceglie quando valuti un libro: Romanzi e Saggi sono gi\xE0 pronti, e puoi crearne di tuoi.": "You pick the set when you rate a book: Novels and Essays are ready-made, and you can create your own.",
  "Mostra il livello del set:": "Show the set level:",
  "+ Nuovo set": "+ New set",
  "Nuovo set": "New set",
  "Ripristina Romanzi e Saggi predefiniti": "Restore default Novels and Essays",
  "Sovrascrive le tue modifiche: premi di nuovo": "Overwrites your changes: press again",
  "Set Romanzi e Saggi ripristinati.": "Novels and Essays sets restored.",
  "Nome": "Name",
  "Temi": "Themes",
  "Domande": "Questions",
  "Libri": "Books",
  "File": "File",
  "Azioni": "Actions",
  "Modifica": "Edit",
  "Duplica": "Duplicate",
  "Apri file": "Open file",
  "Conferma": "Confirm",
  "Set eliminato.": "Set deleted.",
  "File da correggere": "Files to fix",
  "Modifica set di valutazione": "Edit evaluation set",
  "Nuovo set di valutazione": "New evaluation set",
  "Nome del set": "Set name",
  "Livello del set": "Set level",
  "Soglie delle stelle": "Star thresholds",
  "Ogni casella indica fino a quale punteggio ARL si ottengono 1, 2, 3 e 4 stelle. La quinta stella non ha una casella: comincia subito dopo il limite delle 4 stelle e arriva fino a 10. Per questo l'ultima casella pu\xF2 arrivare al massimo a 9,9 (con 9,9 la quinta stella si ottiene solo con 10,0). Con un numero di stelle diverso da 5 le soglie si ridistribuiscono in proporzione. Pi\xF9 sono alte, pi\xF9 il set \xE8 severo.": "Each box shows up to which ARL score you get 1, 2, 3 and 4 stars. The fifth star has no box: it starts right after the 4-star limit and goes up to 10. That is why the last box can be at most 9.9 (with 9.9 the fifth star is only earned with 10.0). With a number of stars other than 5 the thresholds are redistributed proportionally. The higher they are, the stricter the set.",
  "Parti da": "Start from",
  "Fino a ARL": "Up to ARL",
  "Peso %": "Weight %",
  "Elimina tema": "Delete theme",
  "Serve almeno un tema.": "At least one theme is needed.",
  "Sicuro?": "Sure?",
  "+ Aggiungi tema": "+ Add theme",
  "Totale pesi: 100%": "Total weights: 100%",
  "Descrizione": "Description",
  "Facoltativa, appare sopra le domande": "Optional, shown above the questions",
  "Domanda a cui si risponde S\xEC o No": "Question answered Yes or No",
  "Elimina domanda": "Delete question",
  "Serve almeno una domanda per tema.": "At least one question per theme is needed.",
  "+ Aggiungi domanda": "+ Add question",
  "Set salvato.": "Set saved.",
  "Sposta su": "Move up",
  "Sposta gi\xF9": "Move down",
  "Scrivi il nome del set.": "Enter the set name.",
  "Ogni tema deve avere un nome.": "Every theme must have a name.",
  "Almeno un tema deve avere un peso maggiore di zero.": "At least one theme must have a weight greater than zero.",
  "Impossibile aggiungere la copertina": "Unable to add the cover",
  // convalida file set
  "le soglie delle stelle non sono valide (servono 4 valori crescenti tra 0 e 10, per esempio \xAB3 / 5 / 7 / 9\xBB)": "the star thresholds are not valid (4 increasing values between 0 and 10 are needed, for example \xAB3 / 5 / 7 / 9\xBB)",
  "manca il nome (propriet\xE0 \xABnome\xBB in cima alla nota)": "the name is missing (\xABnome\xBB property at the top of the note)",
  "non c'\xE8 nessun tema (ogni tema inizia con \xAB## Nome\xBB)": "there is no theme (each theme starts with \xAB## Name\xBB)",
  "tutti i pesi sono zero": "all weights are zero",
  "il file non \xE8 un'immagine supportata": "the file is not a supported image",
  // opzioni
  "Lingua / Language": "Lingua / Language",
  "Lingua dell'interfaccia": "Interface language",
  "Lingua dei menu e dei messaggi del plugin. Non modifica i tuoi set n\xE9 le note gi\xE0 scritte.": "Language of the plugin's menus and messages. It does not change your sets or notes already written.",
  "Cartella di salvataggio": "Save folder",
  "Le nuove recensioni vengono create qui come note.": "New reviews are created here as notes.",
  "Cartella dei set di valutazione": "Evaluation sets folder",
  "Qui si trovano le note dei set di valutazione: \xABRecensione Romanzi\xBB, \xABRecensione Saggi\xBB e i tuoi.": "This is where the evaluation set notes live: \xABRecensione Romanzi\xBB, \xABRecensione Saggi\xBB and your own.",
  "Cartella delle copertine": "Covers folder",
  "Qui vengono copiate le copertine che carichi dal computer.": "Covers you upload from your computer are copied here.",
  "Domande per schermata": "Questions per screen",
  "Ogni tema viene diviso in schermate di questa dimensione.": "Each theme is split into screens of this size.",
  "Apri a schermo pieno": "Open full screen",
  "Quando apri il plugin nasconde le barre laterali di Obsidian; quando esci (chiudi la scheda o passi a un'altra) tornano com'erano prima.": "When you open the plugin it hides Obsidian's sidebars; when you leave (close the tab or switch to another) they return as they were.",
  "Larghezza dell'interfaccia": "Interface width",
  "Larghezza massima del contenuto in pixel (da 600 a 2400). Se la imposti a 0 usa tutta la finestra.": "Maximum content width in pixels (600 to 2400). Set to 0 to use the whole window.",
  "Usa tutta la larghezza": "Use full width",
  "Testo": "Text",
  "Font": "Font",
  "Carattere dei testi del plugin.": "Typeface of the plugin's text.",
  "Predefinito del tema": "Theme default",
  "Sans-serif (sistema)": "Sans-serif (system)",
  "Personalizzato\u2026": "Custom\u2026",
  "Nome del font": "Font name",
  "Per esempio: Palatino Linotype, Calibri. Deve essere installato sul tuo computer.": "For example: Palatino Linotype, Calibri. It must be installed on your computer.",
  "Dimensione del testo": "Text size",
  "In pixel (da 10 a 32). Il pulsante a destra torna alla dimensione del tema.": "In pixels (10 to 32). The button on the right goes back to the theme size.",
  "Usa la dimensione del tema": "Use the theme size",
  "Colore del testo": "Text colour",
  "Colore principale dei testi. I testi secondari (grigi) restano quelli del tema.": "Main text colour. Secondary (grey) text keeps the theme colour.",
  "Usa il colore del tema": "Use the theme colour",
  "Grafico": "Chart",
  "Pagine lette per giorno": "Pages read per day",
  "Grafico di lettura": "Reading chart",
  "Spessore della linea": "Line thickness",
  "Spessore della linea del grafico (da 1 a 10).": "Thickness of the chart line (1 to 10).",
  "Grafico sfumato": "Gradient chart",
  "Se attivo, la linea passa da un colore di partenza a uno di arrivo.": "When on, the line goes from a start colour to an end colour.",
  "Colore del grafico": "Chart colour",
  "Colore di partenza del grafico": "Chart start colour",
  "Colore di arrivo del grafico": "Chart end colour",
  "Altezza della copertina": "Cover height",
  "Altezza massima dell'immagine nel dettaglio del libro, in pixel (da 80 a 600). Il pulsante a destra riporta il valore predefinito (240).": "Maximum height of the image in the book details, in pixels (80 to 600). The button on the right restores the default (240).",
  "Ripristina la dimensione predefinita": "Restore the default size",
  "Barra di lettura": "Reading bar",
  "Spessore della barra": "Bar thickness",
  "Altezza in pixel della barra di avanzamento nella sezione Lettura del dettaglio libro.": "Height in pixels of the progress bar in the Reading section of the book details.",
  "Barra sfumata": "Gradient bar",
  "Se attiva, la barra passa da un colore di partenza a uno di arrivo.": "When on, the bar goes from a start colour to an end colour.",
  "Colore di partenza": "Start colour",
  "Colore della barra": "Bar colour",
  "Ripristina il colore predefinito": "Restore default colour",
  "Colore di arrivo": "End colour",
  "Stelle": "Stars",
  "Stelle totali": "Total stars",
  "Il punteggio ARL resta da 0 a 10; cambia solo la conversione in stelle.": "The ARL score stays 0 to 10; only the conversion into stars changes.",
  "Colori delle fasce di voto": "Score band colours",
  "Le barre dei temi, il punteggio ARL e la lista prendono il colore della fascia in cui cade il voto. Le fasce sono delimitate dalle soglie delle stelle.": "Theme bars, the ARL score and the list take the colour of the band the score falls in. Bands are delimited by the star thresholds.",
  "Molto basso": "Very low",
  "Basso": "Low",
  "Medio": "Medium",
  "Buono": "Good",
  "Eccellente": "Excellent",
  "Prova con voto": "Try with score",
  "Ripristina colori predefiniti": "Restore default colours",
  "Colori del voto": "Score colours",
  "Tempo trascorso": "Time elapsed",
  "Dopo": "After",
  "Informazioni libreria": "Library information",
  "In generale": "Overview",
  "Libri in libreria": "Books in the library",
  "Il libro con pi\xF9 pagine": "The book with the most pages",
  "Il libro con meno pagine": "The book with the fewest pages",
  "Il libro pi\xF9 costoso": "The most expensive book",
  "Il libro che costa meno": "The cheapest book",
  "Tempi di lettura": "Reading times",
  "Pausa massima tra due libri": "Longest break between two books",
  "Pausa minima tra due libri": "Shortest break between two books",
  "Il periodo di lettura pi\xF9 lungo": "The longest reading period",
  "Il periodo di lettura pi\xF9 breve": "The shortest reading period",
  "Generi": "Genres",
  "Il genere pi\xF9 letto": "The most read genre",
  "Il genere meno letto": "The least read genre",
  "Senza genere": "No genre",
  "Barra dei totali della lista": "List totals bar",
  "Numero di libri e totale in euro": "Number of books and total in euros",
  "Quanti libri sono mostrati e la somma dei prezzi.": "How many books are shown and the sum of their prices.",
  "Libri per numero di stelle": "Books per star rating",
  "Quanti libri hanno 5, 4, 3\u2026 stelle, pi\xF9 quelli ancora da valutare.": "How many books have 5, 4, 3\u2026 stars, plus those still to be rated.",
  "Libro con pi\xF9 pagine": "Book with the most pages",
  "Il libro pi\xF9 lungo tra quelli mostrati.": "The longest book among those shown.",
  "Libro con meno pagine": "Book with the fewest pages",
  "Il libro pi\xF9 corto tra quelli mostrati.": "The shortest book among those shown.",
  "Generi letti": "Genres read",
  "I primi 5 generi per numero di libri letti.": "The top 5 genres by number of books read.",
  "Libro con pi\xF9 pagine:": "Book with the most pages:",
  "Libro con meno pagine:": "Book with the fewest pages:",
  "Generi letti:": "Genres read:",
  "Galleria immagini": "Image gallery",
  "Dimensione delle anteprime": "Thumbnail size",
  "Larghezza in pixel delle anteprime nella galleria immagini (da 120 a 600). Il pulsante a destra riporta il valore predefinito (260).": "Width in pixels of the thumbnails in the image gallery (120 to 600). The button on the right restores the default (260).",
  "Le immagini tematiche del libro (per esempio create con l'IA). Clicca su un'anteprima per vederla a grandezza naturale.": "The book's themed images (for example created with AI). Click a thumbnail to see it at full size.",
  "Nessuna immagine: aggiungine una.": "No images: add one.",
  "Immagini": "Images",
  "Aggiungi immagini dal vault o dal computer. Rimuovere un'immagine dalla galleria non cancella il file.": "Add images from the vault or from your computer. Removing an image from the gallery does not delete the file.",
  "Adatta": "Fit",
  "Grandezza naturale": "Actual size",
  "Impossibile aggiungere l'immagine": "Unable to add the image",
  "ARL e stelle in tempo reale": "Live ARL and stars",
  "Durante la valutazione mostra in alto a destra il punteggio ARL e le stelle, che si aggiornano a ogni risposta.": "While rating, shows the ARL score and the stars at the top right, updated at every answer.",
  "Spessore delle barre dei temi": "Theme bar thickness",
  "Altezza in pixel delle barre dei temi nel dettaglio del libro.": "Height in pixels of the theme bars in the book detail.",
  "Colora in base al voto": "Colour by score",
  "Barre dei temi, punteggio ARL e lista prendono il colore della fascia di voto. I colori si scelgono in ogni set (Set di valutazione \u2192 Modifica).": "Theme bars, ARL score and list take the colour of the score band. Colours are chosen in each set (Evaluation sets \u2192 Edit).",
  "Barre sfumate tra le fasce": "Gradient bars across bands",
  "Se attivo, la barra passa gradualmente dal colore delle fasce pi\xF9 basse a quello della fascia raggiunta; altrimenti \xE8 tinta unita.": "When on, the bar moves gradually from the colour of the lowest bands to that of the band reached; otherwise it is a solid colour.",
  "Le soglie per assegnare le stelle si impostano in ogni set di valutazione (Set di valutazione \u2192 Modifica).": "Star thresholds are set in each evaluation set (Evaluation sets \u2192 Edit)."
};
var UNITA = {
  giorno: ["day", "days"],
  giorni: ["day", "days"],
  ora: ["hour", "hours"],
  ore: ["hour", "hours"],
  mese: ["month", "months"],
  mesi: ["month", "months"],
  libro: ["book", "books"],
  libri: ["book", "books"],
  tema: ["theme", "themes"],
  temi: ["theme", "themes"],
  domanda: ["question", "questions"],
  domande: ["question", "questions"],
  stella: ["star", "stars"],
  stelle: ["star", "stars"],
  pagina: ["page", "pages"],
  pagine: ["page", "pages"]
};
var PLUR = (n, w) => {
  const u = UNITA[w];
  return `${n} ${n === "1" ? u[0] : u[1]}`;
};
var REGOLE = [
  [/^Scaduto da (.+)$/, (m) => `Overdue by ${m[1]}`],
  [/^Tema (\d+)$/, (m) => `Theme ${m[1]}`],
  [/^Tema (\d+) di (\d+) · domande (\d+)–(\d+) di (\d+)$/, (m) => `Theme ${m[1]} of ${m[2]} \xB7 questions ${m[3]}\u2013${m[4]} of ${m[5]}`],
  [/^Punteggio (.+): (.+ \/ 10)$/, (m) => `Score ${m[1]}: ${m[2]}`],
  [/^· (\d+) da rispondere$/, (m) => `\xB7 ${m[1]} to answer`],
  [/^peso (.+)%$/, (m) => `weight ${m[1]}%`],
  [/^(\d+) su (\d+) stelle$/, (m) => `${m[1]} of ${m[2]} stars`],
  [/^Codice (\d+)$/, (m) => `Code ${m[1]}`],
  [/^Set di valutazione: (.+)$/, (m) => `Evaluation set: ${m[1]}`],
  [/^Prezzo: (.+)$/, (m) => `Price: ${m[1]}`],
  [/^Premio: (.+)$/, (m) => `Award: ${m[1]}`],
  [/^Restituzione: (.+) ·$/, (m) => `Return date: ${m[1]} \xB7`],
  [/^Durata: (.+)$/, (m) => `Duration: ${m[1]}`],
  [/^Copertina di (.+)$/, (m) => `Cover of ${m[1]}`],
  [
    /^Totale: (\d+) pagine(?: su (\d+) · (\d+) pagine rimanenti)? · (\d+) giorn[io] di lettura · media (.+) pagine al giorno$/,
    (m) => `Total: ${PLUR(m[1], "pagine")}${m[2] ? ` out of ${m[2]} \xB7 ${m[3]} pages remaining` : ""} \xB7 ${m[4]} reading ${m[4] === "1" ? "day" : "days"} \xB7 average ${m[5].replace(",", ".")} pages per day`
  ],
  [/^Attenzione: una lettura supera le (\d+) pagine del libro\.$/, (m) => `Warning: a reading exceeds the book's ${m[1]} pages.`],
  [/^Da valutare (\d+)$/, (m) => `To rate ${m[1]}`],
  [/^(.+) · Totale (.+)$/, (m) => `${tr(m[1])} \xB7 Total ${m[2]}`],
  [/^Ha già una valutazione \(ARL (.+)\): proseguendo la aggiornerai\. (.+)$/, (m) => `It already has a rating (ARL ${m[1]}): continuing will update it. ${tr(m[2])}`],
  [/^(.+) · Livello (.+)\.$/, (m) => `${tr(m[1])} \xB7 Level ${tr(m[2])}.`],
  [/^Personaggi \((\d+)\)$/, (m) => `Characters (${m[1]})`],
  [/^Andamento lettura \((\d+)\)$/, (m) => `Reading progress (${m[1]})`],
  [/^Domande \((\d+)\)$/, (m) => `Questions (${m[1]})`],
  [/^Domande del tema «(.+)»$/, (m) => `Questions of theme \xAB${m[1]}\xBB`],
  [/^Con (\d+) stell[ae]$/, (m) => `With ${PLUR(m[1], "stelle")}`],
  [/^Risposte a caso, probabilità di ottenere almeno: (.+)$/, (m) => `Random answers, chance of getting at least: ${m[1]}`],
  [/^(★+) da (.+) a 10$/, (m) => `${m[1]} from ${m[2]} to 10`],
  [/^Totale pesi: (.+)% \(vengono riportati a 100\)$/, (m) => `Total weights: ${m[1]}% (scaled to 100)`],
  [/^(.+) · punteggio del tema da 0 a 10$/, (m) => `${tr(m[1])} \xB7 theme score from 0 to 10`],
  [/^(.+) \(predefinito, non ancora salvato\)$/, (m) => `${m[1]} (default, not saved yet)`],
  [
    /^(\d+) (?:libro usa|libri usano) questo set\. I loro punteggi non cambiano; se modifichi le domande, le loro risposte non si potranno più rivedere\.$/,
    (m) => `${PLUR(m[1], "libro")} ${m[1] === "1" ? "uses" : "use"} this set. Their scores do not change; if you edit the questions, their answers can no longer be reviewed.`
  ],
  [/^(\d+) libr[io] aggiornat[io] con il nuovo nome del set\.$/, (m) => `${PLUR(m[1], "libro")} updated with the new set name.`],
  [/^Il codice (\d+) è già usato da «(.+)»\.$/, (m) => `Code ${m[1]} is already used by \xAB${m[2]}\xBB.`],
  [/^Impossibile aggiungere l'immagine: (.+)$/, (m) => `Unable to add the image: ${m[1]}`],
  [/^Galleria immagini \((\d+)\)$/, (m) => `Image gallery (${m[1]})`],
  [/^Galleria immagini — (.+)$/, (m) => `Image gallery \u2014 ${m[1]}`],
  [/^Impossibile aggiungere la copertina: (.+)$/, (m) => `Unable to add the cover: ${m[1]}`],
  [/^Salvataggio non riuscito: (.+)$/, (m) => `Save failed: ${m[1]}`],
  [/^Esiste già un set chiamato «(.+)»\.$/, (m) => `A set named \xAB${m[1]}\xBB already exists.`],
  [/^[Ee]siste già un altro set chiamato «(.+)»$/, (m) => `another set named \xAB${m[1]}\xBB already exists`],
  [/^Il tema «(.+)» è ripetuto\.?$/, (m) => `The theme \xAB${m[1]}\xBB is repeated.`],
  [/^Il tema «(.+)» non ha domande\.?$/, (m) => `The theme \xAB${m[1]}\xBB has no questions.`],
  [/^il tema «(.+)» è ripetuto$/, (m) => `the theme \xAB${m[1]}\xBB is repeated`],
  [/^il tema «(.+)» non ha domande$/, (m) => `the theme \xAB${m[1]}\xBB has no questions`],
  [/^il peso del tema «(.+)» non è valido$/, (m) => `the weight of theme \xAB${m[1]}\xBB is not valid`],
  [/^l'identificativo «(.+)» è usato da più temi$/, (m) => `the identifier \xAB${m[1]}\xBB is used by more than one theme`],
  [
    /^Il set «(.+)» è stato modificato dopo questa valutazione: i punteggi restano, ma le risposte non si possono più rivedere\.$/,
    (m) => `The set \xAB${m[1]}\xBB was modified after this rating: the scores stay, but the answers can no longer be reviewed.`
  ],
  [
    /^Il set di valutazione «(.+)» non esiste più: i punteggi restano, ma le risposte non si possono più rivedere\.$/,
    (m) => `The evaluation set \xAB${m[1]}\xBB no longer exists: the scores stay, but the answers can no longer be reviewed.`
  ],
  [/^il set «(.+)» non esiste$/, (m) => `the set \xAB${m[1]}\xBB does not exist`],
  [/^Ogni set è una nota nella cartella «(.+)»\.$/, (m) => `Each set is a note in the folder \xAB${m[1]}\xBB.`],
  [/^Ora: (.+)\.$/, (m) => `Now: ${m[1]}.`],
  [/^(.+) — meglio sotto i 2000 px di larghezza\.$/, (m) => `${m[1]} \u2014 better under 2000 px wide.`],
  [/^Immagine non trovata nel vault: (.+)$/, (m) => `Image not found in the vault: ${m[1]}`],
  [/^Eliminare la disposizione «(.+)»\? I libri restano come sono ora\.$/, (m) => `Delete the arrangement \xAB${m[1]}\xBB? The books stay as they are now.`]
];
var RE_NUM = /\b(\d+) (giorni|giorno|ore|ora|mesi|mese|libri|libro|temi|tema|domande|domanda|stelle|stella|pagine|pagina)\b/g;
var CHIAVI_LUNGHE = null;
function chiaviLunghe() {
  if (!CHIAVI_LUNGHE) CHIAVI_LUNGHE = Object.keys(EN).filter((k) => k.length >= 40);
  return CHIAVI_LUNGHE;
}
function trTesto(s) {
  if (EN[s] !== void 0) return EN[s];
  for (const [re, fn] of REGOLE) {
    const m = s.match(re);
    if (m) {
      s = fn(m);
      break;
    }
  }
  for (const k of chiaviLunghe()) {
    if (s.includes(k)) s = s.split(k).join(EN[k]);
  }
  s = s.replace(RE_NUM, (_x, n, w) => PLUR(n, w));
  s = s.replace(/(\d+ (?:days?)) e (?=\d+ hours?)/g, "$1 and ");
  s = s.replace(/ Ora: /g, " Now: ");
  return s;
}
function tr(s) {
  if (LINGUA !== "en" || !s) return s;
  const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!m || !m[2]) return s;
  return m[1] + trTesto(m[2]) + m[3];
}
var RADICI = /* @__PURE__ */ new Map();
var REC_TESTO = /* @__PURE__ */ new WeakMap();
var REC_ATTR = /* @__PURE__ */ new WeakMap();
var ATTR_TRAD = ["placeholder", "aria-label", "title", "alt"];
function trNodo(n) {
  const r = REC_TESTO.get(n);
  const o = r && n.data === r.s ? r.o : n.data;
  const s = tr(o);
  if (s !== n.data) n.data = s;
  REC_TESTO.set(n, { o, s });
}
function trAttributi(el) {
  for (const a of ATTR_TRAD) {
    const v = el.getAttribute(a);
    if (v === null) continue;
    let mappa = REC_ATTR.get(el);
    if (!mappa) {
      mappa = /* @__PURE__ */ new Map();
      REC_ATTR.set(el, mappa);
    }
    const r = mappa.get(a);
    const o = r && v === r.s ? r.o : v;
    const s = tr(o);
    if (s !== v) el.setAttribute(a, s);
    mappa.set(a, { o, s });
  }
}
function trAlbero(radice) {
  if (radice.nodeType === Node.TEXT_NODE) {
    trNodo(radice);
    return;
  }
  if (radice.nodeType !== Node.ELEMENT_NODE) return;
  const el = radice;
  trAttributi(el);
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n = w.nextNode();
  while (n) {
    if (n.nodeType === Node.TEXT_NODE) trNodo(n);
    else trAttributi(n);
    n = w.nextNode();
  }
}
function collegaTraduzione(radice) {
  if (RADICI.has(radice)) return;
  const obs = new MutationObserver((muts) => {
    for (const mu of muts) {
      if (mu.type === "characterData") trNodo(mu.target);
      else if (mu.type === "attributes") trAttributi(mu.target);
      else mu.addedNodes.forEach((x) => trAlbero(x));
    }
  });
  obs.observe(radice, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTR_TRAD
  });
  RADICI.set(radice, obs);
  trAlbero(radice);
}
function scollegaTraduzione(radice) {
  var _a;
  (_a = RADICI.get(radice)) == null ? void 0 : _a.disconnect();
  RADICI.delete(radice);
}
function impostaLingua(l) {
  LINGUA = l === "en" ? "en" : "it";
  for (const [r, obs] of [...RADICI]) {
    if (!r.isConnected) {
      obs.disconnect();
      RADICI.delete(r);
    } else trAlbero(r);
  }
}
var NoticeT = class extends import_obsidian.Notice {
  constructor(messaggio, durata) {
    super(tr(messaggio), durata);
  }
};
function paginePerGiorno(letture) {
  var _a, _b;
  if (!letture.length) return [];
  const somme = /* @__PURE__ */ new Map();
  for (const r of letture) somme.set(r.data, ((_a = somme.get(r.data)) != null ? _a : 0) + pagineLette(r));
  const date = [...somme.keys()].sort();
  const out = [];
  const t = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  const fine = t(date[date.length - 1]);
  for (let x = t(date[0]); x <= fine; x += 864e5) {
    const iso = new Date(x).toISOString().slice(0, 10);
    out.push({ data: iso, pagine: (_b = somme.get(iso)) != null ? _b : 0 });
  }
  return out;
}
function percorsoCurva(p) {
  const n = p.length;
  if (n === 0) return "";
  if (n === 1) return `M${p[0][0]},${p[0][1]}`;
  const dx = [];
  const m = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(p[i + 1][0] - p[i][0]);
    m.push((p[i + 1][1] - p[i][1]) / dx[i]);
  }
  const t = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  t.push(m[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${p[i][0] + h},${p[i][1] + t[i] * h} ${p[i + 1][0] - h},${p[i + 1][1] - t[i + 1] * h} ${p[i + 1][0]},${p[i + 1][1]}`;
  }
  return d;
}
var CONTA_GRAFICI = 0;
function disegnaGrafico(box, punti, stile, conTooltip2 = true) {
  box.empty();
  box.addClass("arl-grafico");
  const NS = "http://www.w3.org/2000/svg";
  const el = (nome, attr, padre) => {
    const e = document.createElementNS(NS, nome);
    for (const k in attr) e.setAttribute(k, String(attr[k]));
    if (padre) padre.appendChild(e);
    return e;
  };
  const W = 700;
  const H = 300;
  const L = 44;
  const R = 28;
  const T = 16;
  const B = 34;
  const base = H - B;
  const id = `arl-gr-${++CONTA_GRAFICI}`;
  const max = Math.max(1, ...punti.map((p) => p.pagine));
  const passi = [1, 2, 5, 10];
  let passo = 1;
  outer: for (let mag = 1; mag < 1e7; mag *= 10) {
    for (const s of passi) {
      if (max * 1.08 / (s * mag) <= 5) {
        passo = s * mag;
        break outer;
      }
    }
  }
  const top = Math.ceil(max * 1.05 / passo) * passo;
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
  const defs = el("defs", {}, svg);
  const grad = el("linearGradient", { id: `${id}-g`, gradientUnits: "userSpaceOnUse", x1: L, y1: 0, x2: W - R, y2: 0 }, defs);
  el("stop", { offset: "0%", "stop-color": stile.c1 }, grad);
  el("stop", { offset: "100%", "stop-color": stile.sfumato ? stile.c2 : stile.c1 }, grad);
  for (let v = 0; v <= top; v += passo) {
    const y = base - v / top * (base - T);
    el("line", { x1: L, x2: W - R, y1: y, y2: y, class: "arl-gr-griglia" }, svg);
    const tx = el("text", { x: L - 8, y: y + 4, "text-anchor": "end", class: "arl-gr-testo" }, svg);
    tx.textContent = String(v);
  }
  const n = punti.length;
  const xDi = (i) => n === 1 ? (L + W - R) / 2 : L + i / (n - 1) * (W - R - L);
  const yDi = (v) => base - v / top * (base - T);
  const pts = punti.map((p, i) => [xDi(i), yDi(p.pagine)]);
  const passoX = Math.max(1, Math.ceil(n / 8));
  for (let i = 0; i < n; i += passoX) {
    const [, m, d] = punti[i].data.split("-");
    const tx = el("text", { x: xDi(i), y: H - 10, "text-anchor": "middle", class: "arl-gr-testo" }, svg);
    tx.textContent = `${d}/${m}`;
  }
  if (n > 0) {
    const linea = percorsoCurva(pts);
    if (n > 1) {
      el("path", { d: `${linea} L${pts[n - 1][0]},${base} L${pts[0][0]},${base} Z`, fill: `url(#${id}-g)`, "fill-opacity": 0.2, stroke: "none" }, svg);
    }
    el("path", { d: linea, fill: "none", stroke: `url(#${id}-g)`, "stroke-width": stile.sp, "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
    if (n === 1 || n <= 31) {
      for (const [x, y] of pts) el("circle", { cx: x, cy: y, r: Math.max(2, stile.sp * 0.8), fill: stile.c1, class: "arl-gr-punto" }, svg);
    }
  }
  const marcatore = el("circle", { r: Math.max(4, stile.sp * 1.6), fill: stile.c1, stroke: "var(--background-primary)", "stroke-width": 2, class: "arl-gr-marc" }, svg);
  marcatore.setAttribute("visibility", "hidden");
  box.appendChild(svg);
  if (conTooltip2 && n > 0) {
    const tip = box.createDiv({ cls: "arl-gr-tip" });
    tip.addClass("arl-oculto");
    svg.addEventListener("mousemove", (ev) => {
      const r = svg.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width * W;
      let k = 0;
      let dMin = Infinity;
      pts.forEach(([px2], i) => {
        const dd = Math.abs(px2 - x);
        if (dd < dMin) {
          dMin = dd;
          k = i;
        }
      });
      marcatore.setAttribute("cx", String(pts[k][0]));
      marcatore.setAttribute("cy", String(pts[k][1]));
      marcatore.setAttribute("visibility", "visible");
      tip.setText(`${fmtData(punti[k].data)} \xB7 ${plurale(punti[k].pagine, "pagina", "pagine")}`);
      tip.removeClass("arl-oculto");
      const px = pts[k][0] / W * r.width;
      const py = pts[k][1] / H * r.height;
      tip.style.left = `${Math.min(Math.max(px, 60), r.width - 60)}px`;
      tip.style.top = `${Math.max(py - 34, 0)}px`;
    });
    svg.addEventListener("mouseleave", () => {
      marcatore.setAttribute("visibility", "hidden");
      tip.addClass("arl-oculto");
    });
  }
}
var BooksAndReviewsPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULTS };
    this.sets = [];
    this.statoListe = {};
    this.setNonValidi = [];
    /* ---- Schermo pieno: barre laterali ---- */
    this.barrePrecedenti = null;
  }
  async onload() {
    await this.caricaImpostazioni();
    this.registerView(VIEW_TYPE, (leaf) => new MainView(leaf, this));
    this.addRibbonIcon("book-open", "Books and Reviews", () => {
      void this.apri();
    });
    this.addCommand({
      id: "apri",
      name: tr("Apri Books and Reviews"),
      callback: () => void this.apri()
    });
    this.addCommand({
      id: "nuovo-libro",
      name: tr("Nuovo libro"),
      callback: () => void this.apri("nuovo")
    });
    this.addCommand({
      id: "apri-archivio",
      name: tr("Libreria"),
      callback: () => void this.apri("libreria")
    });
    this.addCommand({
      id: "libreria-virtuale",
      name: tr("Libreria virtuale"),
      callback: () => void this.apri("virtuale")
    });
    this.addCommand({
      id: "nuova-recensione",
      name: tr("Valuta libro"),
      callback: () => void this.apri("valuta")
    });
    this.addCommand({
      id: "set-di-domande",
      name: tr("Set di valutazione"),
      callback: () => void this.apri("set")
    });
    this.addSettingTab(new ARLSettingTab(this.app, this));
    this.app.workspace.onLayoutReady(() => {
      void this.inizializzaSet();
    });
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (!leaf) return;
        if (leaf.view instanceof MainView) this.nascondiBarre();
        else if (leaf.getRoot() === this.app.workspace.rootSplit) this.ripristinaBarre();
      })
    );
  }
  onunload() {
    this.ripristinaBarre();
  }
  async caricaImpostazioni() {
    var _a;
    const d = (_a = await this.loadData()) != null ? _a : {};
    const s = { ...DEFAULTS, ...d };
    if (Array.isArray(d.pesi) && d.pesi.length === 5) {
      s.pesi = d.pesi.map((p) => Number.isFinite(Number(p)) ? Number(p) : 0);
    } else {
      delete s.pesi;
    }
    if (![1, 2, 5, 10].includes(s.domandePerSchermata)) {
      s.domandePerSchermata = 5;
    }
    s.larghezza = Number.isFinite(Number(s.larghezza)) ? Math.round(Number(s.larghezza)) === 0 ? 0 : Math.min(2400, Math.max(600, Math.round(Number(s.larghezza)))) : DEFAULTS.larghezza;
    s.spessoreBarra = Math.min(40, Math.max(6, Math.round(Number(s.spessoreBarra)) || DEFAULTS.spessoreBarra));
    s.stelleTotali = Math.min(10, Math.max(3, Math.round(s.stelleTotali) || 5));
    if (d.lingua !== "it" && d.lingua !== "en") {
      let loc = "";
      try {
        loc = import_obsidian.moment.locale();
      } catch (e) {
      }
      s.lingua = loc.toLowerCase().startsWith("it") || loc === "" ? "it" : "en";
    }
    s.fontFamiglia = typeof s.fontFamiglia === "string" ? s.fontFamiglia.trim() : "";
    s.fontDimensione = Number(s.fontDimensione) > 0 ? Math.min(32, Math.max(10, Math.round(Number(s.fontDimensione)))) : 0;
    s.coloreTesto = /^#[0-9a-f]{6}$/i.test(s.coloreTesto) ? s.coloreTesto : "";
    s.vlPerRipiano = Math.min(40, Math.max(5, Math.round(Number(s.vlPerRipiano)) || DEFAULTS.vlPerRipiano));
    s.vlLarghezza = Math.min(2400, Math.max(500, Math.round(Number(s.vlLarghezza)) || DEFAULTS.vlLarghezza));
    s.vlAdatta = s.vlAdatta === true;
    s.vlSfondo = /^#[0-9a-f]{6}$/i.test(s.vlSfondo) ? s.vlSfondo : "";
    s.vlMostra = s.vlMostra === "titolo" ? "titolo" : "titoloAutore";
    {
      const g = {};
      if (s.vlGeneri && typeof s.vlGeneri === "object") {
        for (const [k, v] of Object.entries(s.vlGeneri)) if (/^#[0-9a-f]{6}$/i.test(String(v))) g[k] = String(v);
      }
      s.vlGeneri = g;
    }
    {
      const visti = /* @__PURE__ */ new Set();
      const out = [];
      for (const d2 of Array.isArray(s.vlDisposizioni) ? s.vlDisposizioni : []) {
        const nome = typeof (d2 == null ? void 0 : d2.nome) === "string" ? d2.nome.trim() : "";
        if (!nome || visti.has(nome.toLowerCase())) continue;
        visti.add(nome.toLowerCase());
        out.push({ nome, ordine: Array.isArray(d2.ordine) ? d2.ordine.filter((p) => typeof p === "string") : [] });
      }
      s.vlDisposizioni = out;
      s.vlCorrente = out.some((d2) => d2.nome === s.vlCorrente) ? s.vlCorrente : "";
    }
    s.vlImmagine = typeof s.vlImmagine === "string" ? s.vlImmagine : "";
    s.vlImgModo = s.vlImgModo === "contain" || s.vlImgModo === "repeat" ? s.vlImgModo : "cover";
    s.vlImgOscura = Math.min(70, Math.max(0, Math.round(Number(s.vlImgOscura))) || 0);
    s.vlImgSfoca = Math.min(20, Math.max(0, Math.round(Number(s.vlImgSfoca))) || 0);
    s.vlCriterio = ["codice-desc", "codice-asc", "lettura-desc", "lettura-asc", "pagine-desc", "pagine-asc"].includes(s.vlCriterio) ? s.vlCriterio : "";
    s.vlOrdine = Array.isArray(s.vlOrdine) ? s.vlOrdine.filter((p) => typeof p === "string") : [];
    s.evidenziaDomanda = s.evidenziaDomanda !== false;
    s.evidenziaSfondo = /^#[0-9a-f]{6}$/i.test(s.evidenziaSfondo) ? s.evidenziaSfondo : DEFAULTS.evidenziaSfondo;
    s.evidenziaTesto = /^#[0-9a-f]{6}$/i.test(s.evidenziaTesto) ? s.evidenziaTesto : DEFAULTS.evidenziaTesto;
    {
      const note = new Set(COLONNE.map((c) => c.chiave));
      const ordine = (Array.isArray(s.colonneOrdine) ? s.colonneOrdine : []).filter(
        (k, i, a) => note.has(k) && a.indexOf(k) === i
      );
      COLONNE.forEach((c, i) => {
        if (ordine.includes(c.chiave)) return;
        const dopo = COLONNE.slice(i + 1).find((x) => ordine.includes(x.chiave));
        if (dopo) ordine.splice(ordine.indexOf(dopo.chiave), 0, c.chiave);
        else ordine.push(c.chiave);
      });
      s.colonneOrdine = ordine;
      s.colonneNascoste = (Array.isArray(s.colonneNascoste) ? s.colonneNascoste : []).filter(
        (k) => note.has(k) && !COLONNE_OBBLIGATORIE.includes(k)
      );
    }
    s.spessoreGrafico = Math.min(10, Math.max(1, Math.round(Number(s.spessoreGrafico)) || DEFAULTS.spessoreGrafico));
    s.altezzaCopertina = Math.min(600, Math.max(80, Math.round(Number(s.altezzaCopertina)) || DEFAULTS.altezzaCopertina));
    s.lingua = s.lingua === "en" ? "en" : "it";
    impostaLingua(s.lingua);
    delete s.metodo;
    if (!s.cartellaSet || !s.cartellaSet.trim()) s.cartellaSet = DEFAULTS.cartellaSet;
    this.settings = s;
  }
  async salvaImpostazioni() {
    await this.saveData(this.settings);
  }
  /** Con «Apri a schermo pieno» attivo, chiude le barre ricordando com'erano. */
  nascondiBarre() {
    if (!this.settings.schermoPieno || this.barrePrecedenti) return;
    const { leftSplit, rightSplit } = this.app.workspace;
    this.barrePrecedenti = { sx: !leftSplit.collapsed, dx: !rightSplit.collapsed };
    leftSplit.collapse();
    rightSplit.collapse();
  }
  /** Riporta le barre laterali com'erano prima dell'apertura del plugin. */
  ripristinaBarre() {
    const p = this.barrePrecedenti;
    if (!p) return;
    this.barrePrecedenti = null;
    const { leftSplit, rightSplit } = this.app.workspace;
    if (p.sx) leftSplit.expand();
    if (p.dx) rightSplit.expand();
  }
  /** Riempimento (colore o sfumatura) e spessore della barra di lettura. */
  stileBarra() {
    const ok = (c, d) => /^#[0-9a-f]{6}$/i.test(c) ? c : d;
    const c1 = ok(this.settings.coloreBarra, DEFAULTS.coloreBarra);
    const c2 = ok(this.settings.coloreBarraFine, DEFAULTS.coloreBarraFine);
    return {
      fill: this.settings.barraSfumata ? `linear-gradient(90deg, ${c1}, ${c2})` : c1,
      sp: this.settings.spessoreBarra
    };
  }
  /** Applica la larghezza scelta a tutte le schede del plugin aperte. */
  applicaLarghezza() {
    const l = this.settings.larghezza;
    const { fill, sp } = this.stileBarra();
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      const el = leaf.view.contentEl;
      if (!el) continue;
      el.style.setProperty("--arl-larghezza", l > 0 ? `${l}px` : "none");
      el.style.setProperty("--arl-barra-fill", fill);
      el.style.setProperty("--arl-barra-sp", `${sp}px`);
      el.style.setProperty("--arl-gal-w", `${this.settings.galleriaMiniatura}px`);
      el.style.setProperty("--arl-ev-sfondo", this.settings.evidenziaSfondo);
      el.style.setProperty("--arl-ev-testo", this.settings.evidenziaTesto);
      el.style.setProperty("--arl-tema-sp", `${this.settings.spessoreTemi}px`);
      el.style.setProperty("--arl-cop-h", `${this.settings.altezzaCopertina}px`);
      el.style.setProperty("--arl-cop-w", `${Math.round(this.settings.altezzaCopertina * 170 / 240)}px`);
      this.applicaTesto(el);
    }
  }
  /** Colonne della lista da mostrare, nell'ordine scelto nelle opzioni. */
  colonneAttive() {
    const nascoste = new Set(this.settings.colonneNascoste);
    const out = [];
    for (const k of this.settings.colonneOrdine) {
      const c = COLONNE.find((x) => x.chiave === k);
      if (c && (COLONNE_OBBLIGATORIE.includes(k) || !nascoste.has(k))) out.push(c);
    }
    return out;
  }
  stileGrafico() {
    const ok = (c, d) => /^#[0-9a-f]{6}$/i.test(c) ? c : d;
    return {
      c1: ok(this.settings.coloreGrafico, DEFAULTS.coloreGrafico),
      c2: ok(this.settings.coloreGraficoFine, DEFAULTS.coloreGraficoFine),
      sfumato: this.settings.graficoSfumato,
      sp: this.settings.spessoreGrafico
    };
  }
  /** Font, dimensione e colore del testo del plugin (vuoto/0 = quelli del tema). */
  applicaTesto(el) {
    const { fontFamiglia: f, fontDimensione: d, coloreTesto: c } = this.settings;
    const imposta = (nome, valore) => {
      if (valore) el.style.setProperty(nome, valore);
      else el.style.removeProperty(nome);
    };
    imposta("--font-interface", f || null);
    imposta("--font-text", f || null);
    imposta("font-family", f || null);
    imposta("--font-ui-medium", d ? `${d}px` : null);
    imposta("--font-ui-small", d ? `${Math.round(d * 0.8125 * 10) / 10}px` : null);
    imposta("--font-ui-smaller", d ? `${Math.round(d * 0.75 * 10) / 10}px` : null);
    imposta("font-size", d ? `${d}px` : null);
    imposta("--text-normal", c || null);
    imposta("color", c || null);
  }
  /* ---- Set di domande ---- */
  cartellaSetEff() {
    return (0, import_obsidian.normalizePath)(this.settings.cartellaSet.trim() || DEFAULTS.cartellaSet);
  }
  /** Al primo avvio crea i file di Romanzi e Saggi, poi legge tutti i set. */
  async inizializzaSet() {
    if (!this.settings.setPredefinitiCreati) {
      await this.scriviSetPredefiniti(false);
      this.settings.setPredefinitiCreati = true;
      await this.salvaImpostazioni();
    }
    await this.caricaSet();
  }
  /** Crea (o, con `sovrascrivi`, ripristina) i file dei set predefiniti. */
  async scriviSetPredefiniti(sovrascrivi) {
    const cartella = this.cartellaSetEff();
    await this.assicuraCartella(cartella);
    const lingua = this.settings.lingua;
    for (const p of setPredefiniti(lingua, sovrascrivi ? void 0 : this.settings.pesi)) {
      const percorso = (0, import_obsidian.normalizePath)(`${cartella}/${SET_PREDEFINITI_MD[lingua].prefisso} ${p.nome}.md`);
      const contenuto = serializzaSet(p.nome, p.categorie, SOGLIE_STANDARD);
      const esistente = this.app.vault.getAbstractFileByPath(percorso);
      if (esistente instanceof import_obsidian.TFile) {
        if (sovrascrivi) await this.app.vault.modify(esistente, contenuto);
      } else if (!esistente) {
        await this.app.vault.create(percorso, contenuto);
      }
    }
  }
  async caricaSet() {
    const prefisso = this.cartellaSetEff() + "/";
    const validi = [];
    const nonValidi = [];
    const files = this.app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(prefisso)).sort((a, b) => a.path.localeCompare(b.path, "it"));
    for (const f of files) {
      const testo = await this.app.vault.cachedRead(f);
      if (!eUnSet(testo)) continue;
      const r = parseSet(testo);
      if (r.nome && validi.some((s) => s.nome.toLowerCase() === r.nome.toLowerCase())) {
        r.errori.push(`esiste gi\xE0 un altro set chiamato \xAB${r.nome}\xBB`);
      }
      if (r.errori.length > 0) nonValidi.push({ file: f, errori: r.errori });
      else validi.push({ nome: r.nome, categorie: r.categorie, soglie: r.soglie, colori: r.colori, file: f });
    }
    if (validi.length === 0) {
      for (const p of setPredefiniti(this.settings.lingua, this.settings.pesi)) {
        validi.push({ nome: p.nome, categorie: p.categorie, soglie: [...SOGLIE_STANDARD], colori: [...COLORI_FASCE], file: null });
      }
    }
    const ordine = (nome) => {
      const i = ["romanzi", "saggi", "novels", "essays"].indexOf(nome.toLowerCase());
      return i === -1 ? 99 : i;
    };
    validi.sort((a, b) => ordine(a.nome) - ordine(b.nome) || a.nome.localeCompare(b.nome, "it"));
    this.sets = validi;
    this.setNonValidi = nonValidi;
  }
  /** Livello di difficoltà con le impostazioni attuali delle stelle. */
  livelloDi(cats, rif) {
    return calcolaLivello(cats, this.settings.stelleTotali, rif);
  }
  /** Soglie delle stelle del set indicato (quelle standard se il set non esiste più). */
  soglieDelSet(nome) {
    var _a, _b;
    return (_b = (_a = this.trovaSet(nome)) == null ? void 0 : _a.soglie) != null ? _b : SOGLIE_STANDARD;
  }
  /** Colori delle fasce del set indicato. */
  coloriDelSet(nome) {
    var _a, _b;
    return (_b = (_a = this.trovaSet(nome)) == null ? void 0 : _a.colori) != null ? _b : COLORI_FASCE;
  }
  /** Colore del testo per un voto, secondo le fasce del set (stringa vuota se la funzione è disattivata). */
  coloreVotoDi(v, setNome) {
    if (!this.settings.votoColori) return "";
    return coloreVoto(v, this.soglieDelSet(setNome), this.coloriDelSet(setNome));
  }
  /** Sfondo di una barra per un voto, secondo le fasce del set (stringa vuota se disattivata). */
  sfondoVotoDi(v, setNome) {
    if (!this.settings.votoColori) return "";
    return sfondoVoto(v, this.soglieDelSet(setNome), this.coloriDelSet(setNome), this.settings.votoSfumato);
  }
  /** Stelle di un punteggio ARL, secondo le soglie del set. */
  stelleDi(arl, setNome) {
    return stelleAssegnate(arl, this.settings.stelleTotali, this.soglieDelSet(setNome));
  }
  trovaSet(nome) {
    const n = nome.trim().toLowerCase();
    return this.sets.find((s) => s.nome.toLowerCase() === n);
  }
  /** Set proposto per una nuova recensione. */
  setIniziale() {
    var _a;
    return (_a = this.trovaSet("Romanzi")) != null ? _a : this.sets[0];
  }
  async salvaSet(bozza, file, nomeOriginale) {
    const contenuto = serializzaSet(bozza.nome, bozza.categorie, bozza.soglie, bozza.colori);
    let f = file;
    if (f) {
      await this.app.vault.modify(f, contenuto);
    } else {
      const cartella = this.cartellaSetEff();
      await this.assicuraCartella(cartella);
      const base = `Recensione ${this.nomeSicuro(bozza.nome, "Set")}`;
      let n = 1;
      for (; ; ) {
        const p = (0, import_obsidian.normalizePath)(`${cartella}/${n === 1 ? base : `${base} (${n})`}.md`);
        if (!this.app.vault.getAbstractFileByPath(p)) {
          f = await this.app.vault.create(p, contenuto);
          break;
        }
        n++;
      }
    }
    if (nomeOriginale && nomeOriginale.toLowerCase() !== bozza.nome.toLowerCase()) {
      await this.rinominaSetNeiLibri(nomeOriginale, bozza.nome);
    }
    await this.caricaSet();
    return f;
  }
  async eliminaSet(file) {
    await this.app.fileManager.trashFile(file);
    await this.caricaSet();
  }
  /** Se un set cambia nome, i libri già recensiti con quel set lo seguono. */
  async rinominaSetNeiLibri(vecchio, nuovo) {
    let n = 0;
    for (const l of this.tuttiILibri()) {
      if (l.set.toLowerCase() !== vecchio.toLowerCase()) continue;
      await this.app.fileManager.processFrontMatter(l.file, (f) => {
        f.set = nuovo;
      });
      n++;
    }
    if (n > 0) {
      new NoticeT(`${plurale(n, "libro aggiornato", "libri aggiornati")} con il nuovo nome del set.`);
    }
  }
  /* ---- Libri ---- */
  tuttiILibri() {
    return this.app.vault.getMarkdownFiles().map((f) => leggiLibro(this.app, f)).filter((l) => l !== null);
  }
  libriConSet(nome) {
    return this.tuttiILibri().filter((l) => l.set.toLowerCase() === nome.toLowerCase()).length;
  }
  /** File immagine della copertina di un libro, se il collegamento è valido. */
  fileCopertina(destinazione, percorsoNota) {
    if (!destinazione) return null;
    const f = this.app.metadataCache.getFirstLinkpathDest(destinazione, percorsoNota);
    return f && ESTENSIONI_IMMAGINE.includes(f.extension.toLowerCase()) ? f : null;
  }
  urlImmagine(f) {
    return this.app.vault.getResourcePath(f);
  }
  imgDelVault() {
    return this.app.vault.getFiles().filter((f) => ESTENSIONI_IMMAGINE.includes(f.extension.toLowerCase())).sort((a, b) => a.path.localeCompare(b.path, "it"));
  }
  /** Copia nel vault un'immagine scelta dal computer e restituisce il file creato. */
  async importaCopertina(file) {
    const cartella = (0, import_obsidian.normalizePath)(this.settings.cartellaCopertine.trim() || DEFAULTS.cartellaCopertine);
    await this.assicuraCartella(cartella);
    const punto = file.name.lastIndexOf(".");
    const estensione = punto > 0 ? file.name.slice(punto + 1).toLowerCase() : "";
    if (!ESTENSIONI_IMMAGINE.includes(estensione)) throw new Error("il file non \xE8 un'immagine supportata");
    const base = this.nomeSicuro(file.name.slice(0, punto), "copertina");
    let n = 1;
    for (; ; ) {
      const p = (0, import_obsidian.normalizePath)(`${cartella}/${base}${n === 1 ? "" : ` (${n})`}.${estensione}`);
      if (!this.app.vault.getAbstractFileByPath(p)) {
        return await this.app.vault.createBinary(p, await file.arrayBuffer());
      }
      n++;
    }
  }
  /** Copia nel vault un'immagine della galleria (stessa cartella delle copertine). */
  async importaImmagine(file) {
    return this.importaCopertina(file);
  }
  /** Salva la galleria: proprietà `galleria` (collegamenti) e immagini incorporate nel testo della nota. */
  async salvaGalleria(file, lista, testi = []) {
    const tt = lista.map((_, i) => {
      var _a;
      return pulisciDidascalia((_a = testi[i]) != null ? _a : "");
    });
    await this.app.fileManager.processFrontMatter(file, (f) => {
      if (lista.length) f.galleria = lista.map((x, i) => tt[i] ? `[[${x}]] | ${tt[i]}` : `[[${x}]]`);
      else delete f.galleria;
    });
    const incorporate = lista.map((x, i) => tt[i] ? `![[${x}]]

*${tt[i]}*` : `![[${x}]]`).join("\n\n");
    await this.app.vault.process(file, (t) => impostaSezione(t, TITOLO_GALLERIA, incorporate));
  }
  /**
   * Salva le letture (proprietà `letture` e tabella nel testo della nota).
   * Se mancano, imposta l'inizio dalla prima data e, se il libro risulta finito, la fine dall'ultima.
   * Restituisce le date eventualmente impostate.
   */
  async salvaLetture(file, lista, pagineTotali, inizioAttuale, fineAttuale) {
    const ord = [...lista].sort((p, q) => p.data.localeCompare(q.data) || p.da - q.da);
    let inizio = inizioAttuale;
    let fine = fineAttuale;
    if (ord.length) {
      if (!inizio) inizio = ord[0].data;
      const ultima = ord.reduce((m, r) => Math.max(m, r.a), 0);
      if (!fine && pagineTotali > 0 && ultima >= pagineTotali) fine = ord[ord.length - 1].data;
    }
    await this.app.fileManager.processFrontMatter(file, (f) => {
      if (ord.length) f.letture = ord.map((r) => `${r.data} | ${r.da} | ${r.a}`);
      else delete f.letture;
      if (inizio && !inizioAttuale) f.inizio_lettura = inizio;
      if (fine && !fineAttuale) f.fine_lettura = fine;
      if (inizio && fine && (!inizioAttuale || !fineAttuale)) f.giorni = giorniTra(inizio, fine);
    });
    const totale = ord.reduce((somma, r) => somma + pagineLette(r), 0);
    const tabella = ord.length ? [
      "| Data | Da pag. | A pag. | Pagine |",
      "|---|---|---|---|",
      ...ord.map((r) => `| ${fmtData(r.data)} | ${r.da} | ${r.a} | ${pagineLette(r)} |`),
      "",
      `Totale: ${totale} pagine`
    ].join("\n") : "";
    await this.app.vault.process(file, (t) => impostaSezione(t, TITOLO_LETTURE, tabella));
    return { inizio, fine };
  }
  /** Prossimo codice libero: il più alto già usato più uno. */
  prossimoCodice() {
    let max = 0;
    for (const l of this.tuttiILibri()) if (l.codice !== null && l.codice > max) max = l.codice;
    return max + 1;
  }
  /** Generi suggeriti: quelli di base più quelli già usati nella libreria. */
  generiNoti() {
    const mappa = /* @__PURE__ */ new Map();
    for (const g of ["Fantascienza", "Fantasy", "Thriller"]) {
      mappa.set(g.toLowerCase(), g);
    }
    for (const l of this.tuttiILibri()) {
      if (l.genere && !mappa.has(l.genere.toLowerCase())) {
        mappa.set(l.genere.toLowerCase(), l.genere);
      }
    }
    return [...mappa.values()].sort((a, b) => a.localeCompare(b, "it"));
  }
  /**
   * Apre la scheda del plugin (o la riporta in primo piano se esiste già).
   * Senza `sezione` non cambia ciò che stai guardando; una scheda nuova parte dalla libreria.
   */
  async apri(sezione) {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = workspace.getLeaf("tab");
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    await workspace.revealLeaf(leaf);
    this.nascondiBarre();
    if (sezione && leaf.view instanceof MainView) leaf.view.vai(sezione);
  }
  /* ---- Salvataggio dei libri ---- */
  /** Campi comuni a ogni salvataggio; `rimuovi` elenca quelli facoltativi lasciati vuoti. */
  metadati(d) {
    const fm = {
      tipo: TIPO,
      titolo: d.titolo.trim(),
      autore: d.autore.trim(),
      editore_anno: d.editore.trim()
    };
    const rimuovi = [];
    if (d.inizio) fm.inizio_lettura = d.inizio;
    else rimuovi.push("inizio_lettura");
    if (d.fine) fm.fine_lettura = d.fine;
    else rimuovi.push("fine_lettura");
    if (d.inizio && d.fine) fm.giorni = giorniTra(d.inizio, d.fine);
    else rimuovi.push("giorni");
    const copertina = normalizzaCopertina(d.copertina);
    if (copertina) fm.copertina = copertina;
    else rimuovi.push("copertina");
    const codice = parseInt(d.codice, 10);
    if (Number.isInteger(codice) && codice > 0) fm.codice = codice;
    else rimuovi.push("codice");
    const genere = d.genere.trim();
    if (genere) fm.genere = genere;
    else rimuovi.push("genere");
    const premio = d.premio.trim().replace(/\s+/g, " ");
    if (premio) fm.premio = premio;
    else rimuovi.push("premio");
    const pagine = parseInt(d.pagine, 10);
    if (Number.isFinite(pagine) && pagine > 0) fm.pagine = pagine;
    else rimuovi.push("pagine");
    const prezzo = parsePrezzo(d.prezzo);
    if (prezzo !== null && !Number.isNaN(prezzo)) fm.prezzo = prezzo;
    else rimuovi.push("prezzo");
    if (d.restituzione) fm.restituzione = d.restituzione;
    else rimuovi.push("restituzione");
    if (d.restituito) fm.restituito = true;
    else rimuovi.push("restituito");
    return { fm, rimuovi };
  }
  async scrivi(file, fm, rimuovi) {
    await this.app.fileManager.processFrontMatter(file, (f) => {
      Object.assign(f, fm);
      for (const k of rimuovi) delete f[k];
    });
    await this.attendiIndicizzazione(file, fm, rimuovi);
  }
  /** Crea o aggiorna la nota del libro (dati, risposte e punteggi). */
  async salva(d, esistente) {
    const set = this.trovaSet(d.set);
    if (!set) throw new Error(`il set \xAB${d.set}\xBB non esiste`);
    const esatti = d.risposte.map(punteggioCategoria);
    const arl = calcolaArl(
      esatti,
      set.categorie.map((c) => c.peso)
    );
    const { fm, rimuovi } = this.metadati(d);
    fm.set = set.nome;
    fm.arl = arl;
    fm.valutazione_tipo = "domande";
    set.categorie.forEach((c, i) => {
      fm[`punteggio_${c.id}`] = arrotonda1(esatti[i]);
      fm[`risposte_${c.id}`] = d.risposte[i].map((r) => r === 1 ? "S" : "N").join("");
    });
    let file = esistente;
    if (!file) {
      const percorso = await this.percorsoLibero(d);
      file = await this.app.vault.create(percorso, `# ${d.titolo.trim()}

## Note

`);
    }
    await this.scrivi(file, fm, rimuovi);
    return file;
  }
  /** Crea la nota di un libro appena censito (ancora senza valutazione). */
  async creaLibro(d) {
    const { fm, rimuovi } = this.metadati(d);
    const percorso = await this.percorsoLibero(d);
    const file = await this.app.vault.create(percorso, `# ${d.titolo.trim()}

## Note

`);
    await this.scrivi(file, fm, rimuovi);
    return file;
  }
  /** Aggiorna solo i dati del libro, lasciando intatti risposte, punteggi e ARL. */
  async salvaSoloDati(d, file) {
    const { fm, rimuovi } = this.metadati(d);
    await this.scrivi(file, fm, rimuovi);
    return file;
  }
  /** Salva l'elenco dei personaggi del libro (elenco di testi «Nome | Descrizione»). */
  async salvaPersonaggi(file, lista) {
    const righe = lista.map((p) => ({ nome: p.nome.trim().replace(/\s+/g, " "), descrizione: p.descrizione.trim().replace(/\s+/g, " ") })).filter((p) => p.nome).map((p) => p.descrizione ? `${p.nome}${SEP_PERSONAGGIO}${p.descrizione}` : p.nome);
    await this.app.fileManager.processFrontMatter(file, (f) => {
      if (righe.length) f.personaggi = righe;
      else delete f.personaggi;
    });
    const elenco = lista.filter((p) => p.nome.trim()).map((p) => `- **${p.nome.trim()}**${p.descrizione.trim() ? ` \u2014 ${p.descrizione.trim()}` : ""}`).join("\n");
    await this.app.vault.process(file, (t) => impostaSezione(t, TITOLO_PERSONAGGI, elenco));
  }
  async leggiAnnotazioni(file) {
    return leggiSezione(await this.app.vault.read(file), TITOLO_ANNOTAZIONI);
  }
  async salvaAnnotazioni(file, testo) {
    await this.app.vault.process(file, (t) => impostaSezione(t, TITOLO_ANNOTAZIONI, testo));
  }
  /** Valutazione manuale: imposta set e ARL direttamente, senza domande. */
  async salvaManuale(file, setNome, arl) {
    await this.app.fileManager.processFrontMatter(file, (f) => {
      for (const k of Object.keys(f)) {
        if (k.startsWith("risposte_") || k.startsWith("punteggio_")) delete f[k];
      }
      f.set = setNome;
      f.arl = arl;
      f.valutazione_tipo = "manuale";
    });
    await this.attendiIndicizzazione(file, { set: setNome, arl, valutazione_tipo: "manuale" });
  }
  /** Segna un libro come restituito (o di nuovo in prestito). */
  async impostaRestituito(file, restituito) {
    await this.app.fileManager.processFrontMatter(file, (f) => {
      if (restituito) f.restituito = true;
      else delete f.restituito;
    });
    await this.attendiIndicizzazione(
      file,
      restituito ? { restituito: "true" } : {},
      restituito ? [] : ["restituito"]
    );
  }
  async assicuraCartella(percorso) {
    let corrente = "";
    for (const parte of (0, import_obsidian.normalizePath)(percorso).split("/").filter(Boolean)) {
      corrente = corrente ? `${corrente}/${parte}` : parte;
      if (!this.app.vault.getAbstractFileByPath(corrente)) {
        await this.app.vault.createFolder(corrente);
      }
    }
  }
  nomeSicuro(testo, predefinito) {
    return testo.replace(/[\\/:*?"<>|#^[\]]/g, "").trim().slice(0, 120) || predefinito;
  }
  async percorsoLibero(d) {
    const cartella = this.settings.cartella.trim();
    if (cartella) await this.assicuraCartella(cartella);
    const titolo = d.titolo.trim();
    const autore = d.autore.trim();
    const base = this.nomeSicuro(autore ? `${titolo} - ${autore}` : titolo, "Recensione");
    let n = 1;
    for (; ; ) {
      const nome = n === 1 ? base : `${base} (${n})`;
      const p = (0, import_obsidian.normalizePath)(cartella ? `${cartella}/${nome}.md` : `${nome}.md`);
      if (!this.app.vault.getAbstractFileByPath(p)) return p;
      n++;
    }
  }
  /** Aspetta che la cache dei metadati rifletta i dati appena scritti. */
  async attendiIndicizzazione(file, fm, assenti = []) {
    var _a;
    for (let i = 0; i < 30; i++) {
      const c = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
      if (c && Object.keys(fm).every((k) => String(c[k]) === String(fm[k])) && assenti.every((k) => c[k] === void 0 || c[k] === null)) {
        return;
      }
      await new Promise((r) => window.setTimeout(r, 100));
    }
  }
};
var InfoLibreriaModal = class extends import_obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    var _a, _b, _c, _d;
    this.modalEl.addClass("arl-info-modal");
    const c = this.contentEl;
    c.empty();
    collegaTraduzione(c);
    c.createEl("h2", { text: "Informazioni libreria" });
    const libri = this.plugin.tuttiILibri();
    if (libri.length === 0) {
      c.createDiv({ cls: "arl-vuoto", text: "Nessun libro in libreria. Usa \xABNuovo libro\xBB per aggiungere il primo." });
      return;
    }
    const colonne = c.createDiv({ cls: "arl-info-colonne" });
    const sx = colonne.createDiv({ cls: "arl-info-col" });
    const dx = colonne.createDiv({ cls: "arl-info-col" });
    let tab = sx.createEl("table", { cls: "arl-info-tab" });
    const riga = (etichetta, ...valori) => {
      const tr2 = tab.createEl("tr");
      tr2.createEl("th", { text: etichetta });
      const td = tr2.createEl("td");
      valori.filter(Boolean).forEach((v, i) => td.createSpan({ text: i === 0 ? v : ` \xB7 ${v}` }));
      return tr2;
    };
    const sezione = (titolo, colonna = sx) => {
      tab = colonna.createEl("table", { cls: "arl-info-tab" });
      const tr2 = tab.createEl("tr", { cls: "arl-info-sez" });
      tr2.createEl("th", { text: titolo, attr: { colSpan: "2" } });
    };
    const ordTitolo = (p, q) => p.titolo.localeCompare(q.titolo, "it");
    const estremi = (lista, valore, alto) => {
      if (lista.length === 0) return [];
      const t = lista.map(valore).reduce((m, v) => alto ? Math.max(m, v) : Math.min(m, v));
      return lista.filter((l) => valore(l) === t).sort(ordTitolo);
    };
    const elenco = (lista) => lista.map((l) => l.titolo).join(", ");
    sezione("In generale");
    const conPrezzo = libri.filter((l) => l.prezzo !== null);
    const totale = conPrezzo.reduce((a, l) => {
      var _a2;
      return a + ((_a2 = l.prezzo) != null ? _a2 : 0);
    }, 0);
    riga("Libri in libreria", plurale(libri.length, "libro", "libri"), conPrezzo.length ? `Totale ${formatEuro(totale)}` : "");
    sezione("Pagine");
    const conPagine = libri.filter((l) => l.pagine > 0);
    const piu = estremi(conPagine, (l) => l.pagine, true);
    const meno = estremi(conPagine, (l) => l.pagine, false);
    riga("Il libro con pi\xF9 pagine", piu.length ? elenco(piu) : "\u2014", piu.length ? plurale(piu[0].pagine, "pagina", "pagine") : "");
    riga("Il libro con meno pagine", meno.length ? elenco(meno) : "\u2014", meno.length ? plurale(meno[0].pagine, "pagina", "pagine") : "");
    sezione("Prezzo");
    const caro = estremi(conPrezzo, (l) => {
      var _a2;
      return (_a2 = l.prezzo) != null ? _a2 : 0;
    }, true);
    const economico = estremi(conPrezzo, (l) => {
      var _a2;
      return (_a2 = l.prezzo) != null ? _a2 : 0;
    }, false);
    riga("Il libro pi\xF9 costoso", caro.length ? elenco(caro) : "\u2014", caro.length ? formatEuro((_a = caro[0].prezzo) != null ? _a : 0) : "");
    riga("Il libro che costa meno", economico.length ? elenco(economico) : "\u2014", economico.length ? formatEuro((_b = economico[0].prezzo) != null ? _b : 0) : "");
    sezione("Tempi di lettura");
    const conGiorni = libri.filter((l) => l.giorni > 0);
    const lungo = estremi(conGiorni, (l) => l.giorni, true);
    const breve = estremi(conGiorni, (l) => l.giorni, false);
    riga("Il periodo di lettura pi\xF9 lungo", lungo.length ? elenco(lungo) : "\u2014", lungo.length ? plurale(lungo[0].giorni, "giorno", "giorni") : "");
    riga("Il periodo di lettura pi\xF9 breve", breve.length ? elenco(breve) : "\u2014", breve.length ? plurale(breve[0].giorni, "giorno", "giorni") : "");
    const datati = libri.filter((l) => l.inizio && l.fine).sort((p, q) => p.inizio.localeCompare(q.inizio) || p.fine.localeCompare(q.fine));
    const pause = [];
    for (let i = 1; i < datati.length; i++) {
      const diff = giorniTra(datati[i - 1].fine, datati[i].inizio) - 1;
      pause.push({ giorni: Math.max(0, diff), da: datati[i - 1], a: datati[i] });
    }
    if (pause.length) {
      const pMax = pause.reduce((m, p) => p.giorni > m.giorni ? p : m);
      const pMin = pause.reduce((m, p) => p.giorni < m.giorni ? p : m);
      riga("Pausa massima tra due libri", plurale(pMax.giorni, "giorno", "giorni"), `${pMax.da.titolo} \u2192 ${pMax.a.titolo}`);
      riga("Pausa minima tra due libri", plurale(pMin.giorni, "giorno", "giorni"), `${pMin.da.titolo} \u2192 ${pMin.a.titolo}`);
    } else {
      riga("Pausa massima tra due libri", "\u2014");
      riga("Pausa minima tra due libri", "\u2014");
    }
    sezione("Stelle", dx);
    const totStelle = this.plugin.settings.stelleTotali;
    const perStelle = new Array(totStelle + 1).fill(0);
    let daValutare = 0;
    for (const l of libri) {
      if (!l.valutato) daValutare++;
      else perStelle[Math.min(totStelle, Math.max(0, this.plugin.stelleDi(l.arl, l.set)))]++;
    }
    for (let k = totStelle; k >= 1; k--) {
      (_c = riga(stringaStelle(k), plurale(perStelle[k], "libro", "libri")).querySelector("th")) == null ? void 0 : _c.addClass("arl-stelle");
    }
    if (daValutare > 0) riga("Da valutare", plurale(daValutare, "libro", "libri"));
    sezione("Generi", dx);
    const generi = /* @__PURE__ */ new Map();
    for (const l of libri) {
      const g = l.genere.trim();
      if (!g) continue;
      const e = (_d = generi.get(g.toLowerCase())) != null ? _d : { nome: g, tutti: 0, letti: 0 };
      e.tutti++;
      if (l.fine || l.valutato) e.letti++;
      generi.set(g.toLowerCase(), e);
    }
    const tuttiGeneri = [...generi.values()].sort((p, q) => q.tutti - p.tutti || p.nome.localeCompare(q.nome, "it"));
    const letti = tuttiGeneri.filter((g) => g.letti > 0);
    const nomiConN = (n) => letti.filter((g) => g.letti === n).map((g) => g.nome).join(", ");
    if (letti.length) {
      const nMax = Math.max(...letti.map((g) => g.letti));
      const nMin = Math.min(...letti.map((g) => g.letti));
      riga("Il genere pi\xF9 letto", nomiConN(nMax), plurale(nMax, "libro", "libri"));
      riga("Il genere meno letto", nomiConN(nMin), plurale(nMin, "libro", "libri"));
    } else {
      riga("Il genere pi\xF9 letto", "\u2014");
      riga("Il genere meno letto", "\u2014");
    }
    if (tuttiGeneri.length) {
      for (const g of tuttiGeneri) riga(g.nome, plurale(g.tutti, "libro", "libri"));
    }
    const senzaGenere = libri.filter((l) => !l.genere.trim()).length;
    if (senzaGenere > 0) riga("Senza genere", plurale(senzaGenere, "libro", "libri"));
  }
  onClose() {
    this.contentEl.empty();
  }
};
var VisoreImmagini = class extends import_obsidian.Modal {
  constructor(app, urls, indice, salvaTesto) {
    super(app);
    this.urls = urls;
    this.indice = indice;
    this.salvaTesto = salvaTesto;
  }
  onOpen() {
    this.modalEl.addClass("arl-visore");
    this.contentEl.empty();
    const barra = this.contentEl.createDiv({ cls: "arl-visore-barra" });
    const prec = barra.createEl("button", { text: "\u2039" });
    const info = barra.createDiv({ cls: "arl-visore-info" });
    const succ = barra.createEl("button", { text: "\u203A" });
    const adatta = barra.createEl("button", { text: "Adatta" });
    const area = this.contentEl.createDiv({ cls: "arl-visore-area" });
    const img = area.createEl("img");
    const sotto = this.contentEl.createDiv({ cls: "arl-visore-didascalia" });
    const mostraDid = () => {
      sotto.empty();
      const x = this.urls[this.indice];
      if (x.testo) sotto.createSpan({ cls: "arl-visore-testo", text: x.testo });
      if (!this.salvaTesto) return;
      const mod = sotto.createEl("button", { text: "\u270E", cls: "arl-gal-mod" });
      mod.setAttr("aria-label", "Modifica didascalia");
      mod.onclick = () => {
        sotto.empty();
        const inp = sotto.createEl("input", { type: "text", cls: "arl-gal-input" });
        inp.maxLength = 200;
        inp.value = x.testo;
        inp.placeholder = "Didascalia (facoltativa)";
        const ok = sotto.createEl("button", { text: "Salva", cls: "mod-cta" });
        const no = sotto.createEl("button", { text: "Annulla" });
        const salva = async () => {
          var _a;
          x.testo = pulisciDidascalia(inp.value);
          await ((_a = this.salvaTesto) == null ? void 0 : _a.call(this, x.indice, x.testo));
          mostraDid();
        };
        ok.onclick = () => void salva();
        no.onclick = mostraDid;
        inp.addEventListener("keydown", (ev) => {
          ev.stopPropagation();
          if (ev.key === "Enter") void salva();
          else if (ev.key === "Escape") mostraDid();
        });
        inp.focus();
      };
    };
    let adattata = false;
    const mostra = () => {
      const x = this.urls[this.indice];
      img.src = x.url;
      img.alt = x.nome;
      info.setText(`${this.indice + 1} / ${this.urls.length} \xB7 ${x.nome}`);
      prec.disabled = succ.disabled = this.urls.length < 2;
      area.scrollTo(0, 0);
      mostraDid();
    };
    const vai = (d) => {
      this.indice = (this.indice + d + this.urls.length) % this.urls.length;
      mostra();
    };
    const alterna = () => {
      adattata = !adattata;
      img.toggleClass("is-adattata", adattata);
      adatta.setText(adattata ? "Grandezza naturale" : "Adatta");
    };
    prec.onclick = () => vai(-1);
    succ.onclick = () => vai(1);
    adatta.onclick = alterna;
    img.onclick = alterna;
    this.scope.register([], "ArrowLeft", () => (vai(-1), false));
    this.scope.register([], "ArrowRight", () => (vai(1), false));
    mostra();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var ImmagineModal = class extends import_obsidian.FuzzySuggestModal {
  constructor(app, immagini, scelta) {
    super(app);
    this.immagini = immagini;
    this.scelta = scelta;
    this.setPlaceholder("Cerca un'immagine nel vault\u2026");
  }
  getItems() {
    return this.immagini;
  }
  getItemText(f) {
    return f.path;
  }
  onChooseItem(f) {
    this.scelta(f);
  }
};
var BookFormView = class {
  constructor(plugin, host, libro, dopo, annulla) {
    this.plugin = plugin;
    this.host = host;
    this.libro = libro;
    this.dopo = dopo;
    this.annulla = annulla;
    this.sporco = false;
    var _a;
    this.dati = libro ? datiDaLibro(libro, (_a = plugin.trovaSet(libro.set)) != null ? _a : plugin.setIniziale()) : datiVuoti(plugin.setIniziale());
    if (!libro) this.dati.codice = String(plugin.prossimoCodice());
  }
  inCorso() {
    return this.sporco;
  }
  avvia() {
    this.render();
  }
  datiValidi() {
    const d = this.dati;
    if (!d.titolo.trim()) {
      new NoticeT("Inserisci il titolo del libro.");
      return false;
    }
    if (d.codice.trim()) {
      if (!/^[1-9]\d*$/.test(d.codice.trim())) {
        new NoticeT("Il codice deve essere un numero intero maggiore di zero.");
        return false;
      }
      const n = parseInt(d.codice, 10);
      const altro = this.plugin.tuttiILibri().find((x) => {
        var _a;
        return x.codice === n && x.file.path !== ((_a = this.libro) == null ? void 0 : _a.file.path);
      });
      if (altro) {
        new NoticeT(`Il codice ${n} \xE8 gi\xE0 usato da \xAB${altro.titolo}\xBB.`);
        return false;
      }
    }
    if (d.pagine.trim() && !/^[1-9]\d*$/.test(d.pagine.trim())) {
      new NoticeT("Le pagine devono essere un numero intero maggiore di zero.");
      return false;
    }
    if (Number.isNaN(parsePrezzo(d.prezzo))) {
      new NoticeT("Il prezzo deve essere un importo come 9,90.");
      return false;
    }
    if (d.fine && !d.inizio) {
      new NoticeT("Inserisci anche la data di inizio lettura.");
      return false;
    }
    if (d.inizio && d.fine && giorniTra(d.inizio, d.fine) < 1) {
      new NoticeT("La data di fine non pu\xF2 precedere quella di inizio.");
      return false;
    }
    return true;
  }
  render() {
    this.host.empty();
    this.host.scrollTop = 0;
    const c = this.host.createDiv({ cls: "arl-stretto" });
    const d = this.dati;
    const tocca = () => this.sporco = true;
    c.createEl("h2", { text: this.libro ? "Modifica dati del libro" : "Nuovo libro" });
    c.createDiv({
      cls: "arl-meta",
      text: "Censisci il libro con i suoi dati. La valutazione si fa dopo, quando lo hai finito, da \xABValuta libro\xBB."
    });
    new import_obsidian.Setting(c).setName("Codice").setDesc("Numero progressivo del libro: proposto in automatico (il pi\xF9 alto + 1), puoi cambiarlo.").addText((t) => {
      t.inputEl.type = "number";
      t.inputEl.min = "1";
      t.inputEl.step = "1";
      t.setValue(d.codice).onChange((v) => {
        d.codice = v;
        tocca();
      });
    });
    new import_obsidian.Setting(c).setName("Titolo").addText(
      (t) => t.setValue(d.titolo).onChange((v) => {
        d.titolo = v;
        tocca();
      })
    );
    new import_obsidian.Setting(c).setName("Autore").addText(
      (t) => t.setValue(d.autore).onChange((v) => {
        d.autore = v;
        tocca();
      })
    );
    new import_obsidian.Setting(c).setName("Editore, anno").addText(
      (t) => t.setPlaceholder("Einaudi, 2019").setValue(d.editore).onChange((v) => {
        d.editore = v;
        tocca();
      })
    );
    new import_obsidian.Setting(c).setName("Genere").addText((t) => {
      t.inputEl.setAttr("list", "arl-generi");
      t.setPlaceholder("Fantascienza, Fantasy, Thriller\u2026").setValue(d.genere).onChange((v) => {
        d.genere = v;
        tocca();
      });
    });
    const elenco = c.createEl("datalist", { attr: { id: "arl-generi" } });
    for (const g of this.plugin.generiNoti()) {
      elenco.createEl("option", { attr: { value: g } });
    }
    new import_obsidian.Setting(c).setName("Premio").setDesc("Facoltativo: premio o riconoscimento ricevuto dal libro.").addText(
      (t) => t.setPlaceholder("Premio Strega 2019").setValue(d.premio).onChange((v) => {
        d.premio = v;
        tocca();
      })
    );
    new import_obsidian.Setting(c).setName("Pagine totali").addText((t) => {
      t.inputEl.type = "number";
      t.inputEl.min = "1";
      t.inputEl.step = "1";
      t.setPlaceholder("455").setValue(d.pagine).onChange((v) => {
        d.pagine = v;
        tocca();
      });
    });
    new import_obsidian.Setting(c).setName("Prezzo (\u20AC)").addText(
      (t) => t.setPlaceholder("9,90").setValue(d.prezzo).onChange((v) => {
        d.prezzo = v;
        tocca();
      })
    );
    const percorsoNota = this.libro ? this.libro.file.path : "";
    let testoCopertina = null;
    const anteprimaCop = c.createDiv({ cls: "arl-cop-anteprima" });
    const aggiornaCop = () => {
      anteprimaCop.empty();
      const dest = copertinaDaFm(normalizzaCopertina(d.copertina));
      if (!dest) return;
      const f = this.plugin.fileCopertina(dest, percorsoNota);
      if (f) anteprimaCop.createEl("img", { attr: { src: this.plugin.urlImmagine(f), alt: "Copertina" } });
      else anteprimaCop.createDiv({ cls: "arl-meta", text: "Immagine non trovata nel vault." });
    };
    const impostaCop = (f) => {
      d.copertina = f ? `[[${this.plugin.app.metadataCache.fileToLinktext(f, percorsoNota)}]]` : "";
      if (testoCopertina) testoCopertina.value = d.copertina;
      tocca();
      aggiornaCop();
    };
    const rigaCop = new import_obsidian.Setting(c).setName("Copertina").setDesc("Collegamento a un'immagine, per esempio [[Copertine/dune.jpg]].").addText((t) => {
      testoCopertina = t.inputEl;
      t.setPlaceholder("[[immagine]]").setValue(d.copertina).onChange((v) => {
        d.copertina = v;
        tocca();
        aggiornaCop();
      });
    }).addButton(
      (b) => b.setButtonText("Scegli\u2026").onClick(() => {
        const imm = this.plugin.imgDelVault();
        if (!imm.length) {
          new NoticeT("Nel vault non ci sono immagini.");
          return;
        }
        new ImmagineModal(this.plugin.app, imm, (f) => impostaCop(f)).open();
      })
    ).addButton(
      (b) => b.setButtonText("Dal computer\u2026").onClick(() => {
        const sel = createEl("input");
        sel.type = "file";
        sel.accept = "image/*";
        sel.onchange = async () => {
          var _a;
          const file = (_a = sel.files) == null ? void 0 : _a[0];
          if (!file) return;
          try {
            impostaCop(await this.plugin.importaCopertina(file));
            new NoticeT("Copertina aggiunta al vault.");
          } catch (e) {
            new NoticeT(`Impossibile aggiungere la copertina: ${e.message}`);
          }
        };
        sel.click();
      })
    ).addButton((b) => b.setButtonText("Rimuovi").onClick(() => impostaCop(null)));
    c.appendChild(anteprimaCop);
    aggiornaCop();
    const durata = c.createDiv({ cls: "arl-durata" });
    const aggiornaDurata = () => {
      if (d.inizio && d.fine) {
        const g = giorniTra(d.inizio, d.fine);
        durata.setText(
          g >= 1 ? `Durata: ${etichettaGiorni(g)}` : "La data di fine \xE8 precedente alla data di inizio."
        );
      } else {
        durata.setText("");
      }
    };
    new import_obsidian.Setting(c).setName("Inizio lettura").setDesc("Facoltativa: puoi inserirla anche pi\xF9 tardi.").addText((t) => {
      t.inputEl.type = "date";
      t.setValue(d.inizio).onChange((v) => {
        d.inizio = v;
        tocca();
        aggiornaDurata();
      });
    });
    new import_obsidian.Setting(c).setName("Fine lettura").addText((t) => {
      t.inputEl.type = "date";
      t.setValue(d.fine).onChange((v) => {
        d.fine = v;
        tocca();
        aggiornaDurata();
      });
    });
    c.appendChild(durata);
    aggiornaDurata();
    new import_obsidian.Setting(c).setName("Restituzione").setDesc("Facoltativa. Il tempo rimanente compare nella libreria.").addText((t) => {
      t.inputEl.type = "date";
      t.setValue(d.restituzione).onChange((v) => {
        d.restituzione = v;
        tocca();
      });
    });
    new import_obsidian.Setting(c).setName("Restituito").setDesc("Ferma il conto alla rovescia.").addToggle(
      (t) => t.setValue(d.restituito).onChange((v) => {
        d.restituito = v;
        tocca();
      })
    );
    const footer = c.createDiv({ cls: "arl-footer" });
    footer.createDiv({ cls: "arl-info" });
    const azioni = footer.createDiv({ cls: "arl-azioni" });
    azioni.createEl("button", { text: "Annulla" }).onclick = () => this.annulla();
    const salva = azioni.createEl("button", {
      text: this.libro ? "Salva" : "Salva libro",
      cls: "mod-cta"
    });
    salva.onclick = async () => {
      if (!this.datiValidi()) return;
      salva.disabled = true;
      try {
        const f = this.libro ? await this.plugin.salvaSoloDati(d, this.libro.file) : await this.plugin.creaLibro(d);
        this.sporco = false;
        new NoticeT(this.libro ? "Dati salvati." : "Libro aggiunto alla libreria.");
        this.dopo(f);
      } catch (e) {
        new NoticeT(`Salvataggio non riuscito: ${e.message}`);
        salva.disabled = false;
      }
    };
  }
};
var ReviewView = class {
  /**
   * @param libro libro da valutare (o da rivedere/aggiornare)
   * @param passo 0 = scelta del set, 1..N = pagine di domande
   * @param tornaIndietro azione del link «Indietro» nella scelta del set
   * @param dopoSalvataggio funzione chiamata a salvataggio riuscito (o all'annullamento della revisione)
   */
  constructor(plugin, host, libro, passo, dopoSalvataggio, tornaIndietro) {
    this.plugin = plugin;
    this.host = host;
    this.libro = libro;
    this.passo = passo;
    this.dopoSalvataggio = dopoSalvataggio;
    this.tornaIndietro = tornaIndietro;
    this.pagine = [];
  }
  /** True se c'è qualcosa che andrebbe perso uscendo dalla procedura. */
  inCorso() {
    return this.passo > 0 && this.dati.risposte.some((r) => r.some((x) => x !== null));
  }
  avvia() {
    var _a;
    this.set = (_a = this.plugin.trovaSet(this.libro.set)) != null ? _a : this.plugin.setIniziale();
    this.caricaLibro(this.libro);
    this.costruisciPagine();
    this.render();
  }
  /** Prepara i dati della valutazione per il libro scelto e il set corrente. */
  caricaLibro(l) {
    this.libro = l;
    this.dati = datiDaLibro(l, this.set);
    this.dati.set = this.set.nome;
    const stessoSet = l.set.toLowerCase() === this.set.nome.toLowerCase();
    if (!stessoSet || !libroCompatibile(l, this.set)) this.dati.risposte = rispostePerSet(this.set);
  }
  costruisciPagine() {
    const pp = this.plugin.settings.domandePerSchermata;
    this.pagine = [];
    this.set.categorie.forEach((cat, c) => {
      for (let da = 0; da < cat.domande.length; da += pp) {
        this.pagine.push({ c, da, a: Math.min(da + pp, cat.domande.length) });
      }
    });
  }
  render() {
    this.host.empty();
    this.host.scrollTop = 0;
    this.contentEl = this.host.createDiv({ cls: "arl-stretto" });
    if (this.passo === 0) this.renderScelta();
    else if (this.passo <= this.pagine.length) this.renderDomande();
    else this.renderRiepilogo();
  }
  /* ---- Passo 0: scelta del set ---- */
  renderScelta() {
    const c = this.contentEl;
    const libro = this.libro;
    const indietro = c.createEl("button", { text: "Indietro", cls: "arl-link" });
    indietro.onclick = () => this.tornaIndietro();
    c.createEl("h2", { text: libro.valutato ? "Aggiorna valutazione" : "Valuta libro" });
    c.createDiv({ cls: "arl-sub", text: libro.titolo });
    if (libro.autore) c.createDiv({ cls: "arl-meta", text: libro.autore });
    c.createDiv({
      cls: "arl-meta",
      text: libro.valutato ? `Ha gi\xE0 una valutazione (ARL ${fmt(libro.arl)}): proseguendo la aggiornerai. Scegli il set di valutazione: domande mirate, suddivise per tematiche.` : "Scegli il set di valutazione: domande mirate, suddivise per tematiche."
    });
    const rigaSet = new import_obsidian.Setting(c).setName("Set di valutazione");
    const descrizioneSet = (st) => `${riassuntoSet(st)} \xB7 Livello ${testoLivello(this.plugin.livelloDi(st.categorie, st.soglie))}.`;
    rigaSet.setDesc(descrizioneSet(this.set));
    const boxLiv = c.createDiv({ cls: "arl-livello-box" });
    const mostraLivelli = () => {
      boxLiv.empty();
      const lv = this.plugin.livelloDi(this.set.categorie, this.set.soglie);
      creaTabellaLivelli(boxLiv, new Map(lv ? [[lv.etichetta, "\u2190 questo set"]] : []));
    };
    rigaSet.addDropdown((dd) => {
      const opzioni = {};
      for (const st of this.plugin.sets) opzioni[st.nome] = st.nome;
      dd.addOptions(opzioni).setValue(this.set.nome).onChange((v) => {
        const nuovo = this.plugin.trovaSet(v);
        if (!nuovo) return;
        this.set = nuovo;
        this.caricaLibro(libro);
        rigaSet.setDesc(descrizioneSet(nuovo));
        mostraLivelli();
      });
    });
    mostraLivelli();
    const footer = c.createDiv({ cls: "arl-footer" });
    footer.createDiv({ cls: "arl-info" });
    const azioni = footer.createDiv({ cls: "arl-azioni" });
    const avanti = azioni.createEl("button", {
      text: libro.valutato ? "Aggiorna valutazione" : "Inizia valutazione",
      cls: "mod-cta"
    });
    avanti.onclick = () => {
      this.costruisciPagine();
      this.passo = 1;
      this.render();
    };
  }
  /* ---- Passi 1..N: domande ---- */
  renderDomande() {
    const c = this.contentEl;
    const pg = this.pagine[this.passo - 1];
    const cat = this.set.categorie[pg.c];
    const ris = this.dati.risposte[pg.c];
    let aggiornaLive = () => {
    };
    if (this.plugin.settings.arlLive) {
      const live = c.createDiv({ cls: "arl-live" });
      const liveArl = live.createDiv({ cls: "arl-live-arl" });
      const liveStelle = live.createDiv({ cls: "arl-live-stelle" });
      aggiornaLive = () => {
        const st = this.plugin.settings;
        const arlL = calcolaArl(
          this.dati.risposte.map(punteggioCategoria),
          this.set.categorie.map((x) => x.peso)
        );
        const kL = stelleAssegnate(arlL, st.stelleTotali, this.set.soglie);
        liveArl.setText(`ARL ${fmt(arlL)}`);
        liveStelle.setText(stringaStelle(kL));
        const col = st.votoColori ? coloreVoto(arlL, this.set.soglie, this.set.colori) : "";
        liveArl.style.color = col;
        liveStelle.style.color = col;
      };
    }
    c.createEl("h2", { text: cat.nome });
    if (cat.descr) c.createDiv({ cls: "arl-sub", text: cat.descr });
    c.createDiv({
      cls: "arl-meta",
      text: `Tema ${pg.c + 1} di ${this.set.categorie.length} \xB7 domande ${pg.da + 1}\u2013${pg.a} di ${cat.domande.length}`
    });
    const barra = c.createDiv({ cls: "arl-progress" });
    barra.createDiv({ cls: "arl-progress-fill" }).style.width = `${Math.round(
      this.passo / (this.pagine.length + 1) * 100
    )}%`;
    const lista = c.createDiv({ cls: "arl-domande" });
    const footer = c.createDiv({ cls: "arl-footer" });
    const info = footer.createDiv({ cls: "arl-info" });
    const azioni = footer.createDiv({ cls: "arl-azioni" });
    const revisione = this.passo === 1 && this.libro.valutato && !this.libro.manuale;
    const indietro = azioni.createEl("button", { text: revisione ? "Annulla" : "Indietro" });
    const avanti = azioni.createEl("button", { text: "Avanti", cls: "mod-cta" });
    const righe = [];
    let evidenziata = -1;
    let primo = true;
    const aggiorna = () => {
      let prossima = -1;
      if (this.plugin.settings.evidenziaDomanda) {
        for (let i = pg.da; i < pg.a; i++) {
          if (ris[i] === null) {
            prossima = i;
            break;
          }
        }
      }
      if (prossima !== evidenziata) {
        righe.forEach((r2, k) => r2.toggleClass("arl-prossima", pg.da + k === prossima));
        evidenziata = prossima;
        const r = righe[prossima - pg.da];
        if (r && !primo) r.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      primo = false;
      const mancanti = ris.slice(pg.da, pg.a).filter((r) => r === null).length;
      let testo = `Punteggio ${cat.nome}: ${fmtP(punteggioCategoria(ris))} / 10`;
      if (mancanti > 0) testo += ` \xB7 ${mancanti} da rispondere`;
      info.setText(testo);
      avanti.disabled = mancanti > 0;
      aggiornaLive();
    };
    for (let i = pg.da; i < pg.a; i++) {
      const riga = lista.createDiv({ cls: "arl-domanda" });
      righe.push(riga);
      riga.createDiv({ cls: "arl-testo", text: `${i + 1}. ${cat.domande[i]}` });
      const yn = riga.createDiv({ cls: "arl-yn" });
      const si = yn.createEl("button", { text: "S\xEC" });
      const no = yn.createEl("button", { text: "No" });
      const mostra = () => {
        si.toggleClass("is-active", ris[i] === 1);
        no.toggleClass("is-active", ris[i] === 0);
        si.setAttr("aria-pressed", String(ris[i] === 1));
        no.setAttr("aria-pressed", String(ris[i] === 0));
      };
      si.onclick = () => {
        ris[i] = 1;
        mostra();
        aggiorna();
      };
      no.onclick = () => {
        ris[i] = 0;
        mostra();
        aggiorna();
      };
      mostra();
    }
    indietro.onclick = () => {
      if (revisione) {
        this.dopoSalvataggio(this.libro.file);
        return;
      }
      this.passo--;
      this.render();
    };
    avanti.onclick = () => {
      this.passo++;
      this.render();
    };
    aggiorna();
  }
  /* ---- Ultimo passo: riepilogo ---- */
  renderRiepilogo() {
    const c = this.contentEl;
    const s = this.plugin.settings;
    const esatti = this.dati.risposte.map(punteggioCategoria);
    const pesi = this.set.categorie.map((cat) => cat.peso);
    const arl = calcolaArl(esatti, pesi);
    const k = stelleAssegnate(arl, s.stelleTotali, this.set.soglie);
    const sommaPesi = pesi.reduce((a, b) => a + b, 0);
    c.createEl("h2", { text: "Risultato" });
    c.createDiv({
      cls: "arl-sub",
      text: this.dati.autore.trim() ? `${this.dati.titolo.trim()}, ${this.dati.autore.trim()}` : this.dati.titolo.trim()
    });
    c.createDiv({ cls: "arl-meta", text: `Set: ${this.set.nome}` });
    const tabella = c.createEl("table", { cls: "arl-riepilogo" });
    this.set.categorie.forEach((cat, i) => {
      const tr2 = tabella.createEl("tr");
      tr2.createEl("td", { text: cat.nome });
      tr2.createEl("td", { text: `${fmtP(esatti[i])} / 10`, cls: "arl-num-cell" });
      const peso = sommaPesi > 0 ? cat.peso / sommaPesi * 100 : 100 / this.set.categorie.length;
      tr2.createEl("td", { text: `peso ${Math.round(peso * 10) / 10}%`, cls: "arl-peso" });
    });
    const ris = c.createDiv({ cls: "arl-risultato" });
    const colonna = ris.createDiv();
    colonna.createDiv({ cls: "arl-etichetta", text: "Punteggio ARL" });
    colonna.createDiv({ cls: "arl-grande", text: fmt(arl) });
    const stelle = ris.createDiv({ cls: "arl-stelle-box" });
    stelle.createDiv({ cls: "arl-stelle arl-stelle-grandi", text: stringaStelle(k) });
    stelle.createDiv({ cls: "arl-etichetta", text: `${k} su ${s.stelleTotali} stelle` });
    const footer = c.createDiv({ cls: "arl-footer" });
    footer.createDiv({ cls: "arl-info" });
    const azioni = footer.createDiv({ cls: "arl-azioni" });
    const indietro = azioni.createEl("button", { text: "Indietro" });
    const salva = azioni.createEl("button", {
      text: "Salva valutazione",
      cls: "mod-cta"
    });
    indietro.onclick = () => {
      this.passo--;
      this.render();
    };
    salva.onclick = async () => {
      salva.disabled = true;
      try {
        const f = await this.plugin.salva(this.dati, this.libro.file);
        new NoticeT("Valutazione salvata.");
        this.dopoSalvataggio(f);
      } catch (e) {
        new NoticeT(`Salvataggio non riuscito: ${e.message}`);
        salva.disabled = false;
      }
    };
  }
};
var traduci = (t) => tr(t);
function calcolaPause(libri) {
  const out = /* @__PURE__ */ new Map();
  const datati = libri.filter((l) => l.inizio && l.fine).sort((p, q) => p.inizio.localeCompare(q.inizio) || p.fine.localeCompare(q.fine));
  for (let i = 1; i < datati.length; i++) {
    const giorni = Math.max(0, giorniTra(datati[i - 1].fine, datati[i].inizio) - 1);
    out.set(datati[i].file.path, { giorni, prec: datati[i - 1] });
  }
  return out;
}
var COLONNE = [
  { chiave: "codice", titolo: "Cod.", centro: true },
  { chiave: "titolo", titolo: "Titolo" },
  { chiave: "autore", titolo: "Autore" },
  { chiave: "editore", titolo: "Editore, anno" },
  { chiave: "genere", titolo: "Genere" },
  { chiave: "set", titolo: "Set" },
  { chiave: "pagine", titolo: "Pagine", centro: true },
  { chiave: "prezzo", titolo: "Prezzo", centro: true },
  { chiave: "fine", titolo: "Lettura" },
  { chiave: "giorni", titolo: "Giorni", centro: true },
  { chiave: "arl", titolo: "ARL" },
  { chiave: "valutazione", titolo: "Valutazione" },
  { chiave: "restituzione", titolo: "Restituzione" },
  { chiave: "trascorso", titolo: "Tempo trascorso", centro: true },
  { chiave: "premio", titolo: "Premio" }
];
var COLONNE_OBBLIGATORIE = ["titolo", "autore"];
function antenatoScorrevole(el) {
  let e = el.parentElement;
  while (e) {
    const o = getComputedStyle(e).overflowY;
    if ((o === "auto" || o === "scroll" || o === "overlay") && e.scrollHeight > e.clientHeight + 1) return e;
    e = e.parentElement;
  }
  return null;
}
var ArchiveView = class {
  constructor(app, plugin, host, main, aperto, modo = "libreria") {
    this.app = app;
    this.plugin = plugin;
    this.host = host;
    this.main = main;
    this.aperto = aperto;
    this.modo = modo;
    this.libri = [];
    this.contenitoreTabella = null;
    this.roTesta = null;
    this.pause = /* @__PURE__ */ new Map();
    var _a, _b;
    this.st = (_b = (_a = plugin.statoListe)[modo]) != null ? _b : _a[modo] = {
      ricerca: "",
      stato: "tutti",
      ordine: { chiave: "codice", asc: false },
      ancora: null,
      ripristina: false
    };
  }
  get ordine() {
    return this.st.ordine;
  }
  set ordine(v) {
    this.st.ordine = v;
  }
  get ricerca() {
    return this.st.ricerca;
  }
  set ricerca(v) {
    this.st.ricerca = v;
  }
  get stato() {
    return this.st.stato;
  }
  set stato(v) {
    this.st.stato = v;
  }
  avvia() {
    this.carica();
    const l = this.aperto ? this.libri.find((x) => x.file.path === this.aperto) : void 0;
    if (l) this.renderDettaglio(l);
    else this.renderLista();
  }
  carica() {
    this.libri = this.plugin.tuttiILibri();
  }
  stelle(l) {
    return stringaStelle(this.plugin.stelleDi(l.arl, l.set));
  }
  /* ---- Lista ---- */
  renderLista() {
    var _a;
    this.host.empty();
    this.host.scrollTop = 0;
    const c = this.host;
    const riprendi = this.st.ripristina;
    this.st.ripristina = false;
    const testa = c.createDiv({ cls: "arl-lista-testa" });
    testa.createEl("h2", { text: this.modo === "valuta" ? "Valuta libro" : "Libreria" });
    const barra = testa.createDiv({ cls: "arl-toolbar" });
    const cerca = barra.createEl("input", {
      type: "text",
      placeholder: "Cerca per titolo, autore, editore, genere o set",
      cls: "arl-cerca"
    });
    cerca.value = this.ricerca;
    cerca.addEventListener("input", () => {
      this.ricerca = cerca.value;
      this.disegnaTabella();
    });
    const filtro = barra.createEl("select", { cls: "dropdown" });
    for (const [v, t] of [
      ["tutti", "Tutti i libri"],
      ["da", "Da valutare"],
      ["val", "Valutati"]
    ]) {
      filtro.createEl("option", { text: t, attr: { value: v } });
    }
    filtro.value = this.stato;
    filtro.onchange = () => {
      this.stato = filtro.value;
      this.disegnaTabella();
    };
    if (this.modo === "valuta") {
      c.createDiv({
        cls: "arl-meta",
        text: "Scegli il libro da valutare: in alto quelli ancora senza valutazione, poi quelli gi\xE0 valutati (di cui puoi aggiornare la valutazione)."
      });
    }
    this.contenitoreTabella = c.createDiv();
    this.disegnaTabella();
    const ancora = this.st.ancora;
    if (riprendi && ancora) {
      const riposiziona = () => {
        const riga = Array.from(c.querySelectorAll("tr.arl-riga")).find(
          (r) => r.dataset.percorso === ancora.percorso
        );
        if (!riga) return;
        const sc = antenatoScorrevole(riga);
        if (!sc) return;
        const delta = riga.getBoundingClientRect().top - ancora.top;
        if (Math.abs(delta) > 0.5) sc.scrollTop += delta;
      };
      riposiziona();
      window.requestAnimationFrame(riposiziona);
      window.setTimeout(riposiziona, 80);
    }
    const misura = () => c.style.setProperty("--arl-testa-h", `${testa.offsetHeight}px`);
    misura();
    window.requestAnimationFrame(misura);
    if (typeof ResizeObserver !== "undefined") {
      (_a = this.roTesta) == null ? void 0 : _a.disconnect();
      this.roTesta = new ResizeObserver(() => window.requestAnimationFrame(misura));
      this.roTesta.observe(testa);
    }
  }
  ordina(lista) {
    const { chiave, asc } = this.ordine;
    const dir = asc ? 1 : -1;
    const ordinata = [...lista].sort((a, b) => {
      var _a, _b, _c, _d;
      let r = 0;
      switch (chiave) {
        case "giorni":
          r = a.giorni - b.giorni;
          break;
        case "trascorso": {
          const pa = (_a = this.pause.get(a.file.path)) == null ? void 0 : _a.giorni;
          const pb = (_b = this.pause.get(b.file.path)) == null ? void 0 : _b.giorni;
          r = pa === void 0 && pb === void 0 ? 0 : pa === void 0 ? 1 : pb === void 0 ? -1 : pa - pb;
          break;
        }
        case "pagine":
          r = a.pagine - b.pagine;
          break;
        case "prezzo":
          r = ((_c = a.prezzo) != null ? _c : -1) - ((_d = b.prezzo) != null ? _d : -1);
          break;
        case "codice":
          r = a.codice === null || b.codice === null ? (a.codice === null ? 1 : -1) * dir * Number(a.codice !== b.codice) : a.codice - b.codice;
          break;
        case "restituzione":
          r = (a.restituzione || "9999-99-99").localeCompare(b.restituzione || "9999-99-99");
          break;
        case "genere":
          r = a.genere.localeCompare(b.genere, "it");
          break;
        case "premio":
          r = a.premio === b.premio ? 0 : !a.premio ? 1 : !b.premio ? -1 : a.premio.localeCompare(b.premio, "it");
          break;
        case "set":
          r = a.set.localeCompare(b.set, "it");
          break;
        case "arl":
        case "valutazione":
          r = (a.valutato ? a.arl : -1) - (b.valutato ? b.arl : -1);
          break;
        case "fine":
          r = a.fine.localeCompare(b.fine);
          break;
        case "titolo":
          r = a.titolo.localeCompare(b.titolo, "it");
          break;
        case "autore":
          r = a.autore.localeCompare(b.autore, "it");
          break;
        case "editore":
          r = a.editore.localeCompare(b.editore, "it");
          break;
      }
      return r * dir;
    });
    if (this.modo === "valuta") ordinata.sort((a, b) => Number(a.valutato) - Number(b.valutato));
    return ordinata;
  }
  disegnaTabella() {
    const box = this.contenitoreTabella;
    if (!box) return;
    box.empty();
    this.pause = calcolaPause(this.libri);
    const colonne = this.plugin.colonneAttive();
    if (!colonne.some((c) => c.chiave === this.ordine.chiave)) this.ordine = { chiave: "titolo", asc: true };
    const q = this.ricerca.trim().toLowerCase();
    const filtrati = this.ordina(
      this.libri.filter(
        (l) => (this.stato === "tutti" || this.stato === "val" === l.valutato) && (!q || l.codice !== null && String(l.codice) === q || l.titolo.toLowerCase().includes(q) || l.autore.toLowerCase().includes(q) || l.editore.toLowerCase().includes(q) || l.genere.toLowerCase().includes(q) || l.premio.toLowerCase().includes(q) || l.set.toLowerCase().includes(q))
      )
    );
    if (this.libri.length === 0) {
      const v = box.createDiv({ cls: "arl-vuoto arl-benvenuto" });
      v.createEl("h3", { text: "Nessun libro ancora." });
      v.createEl("p", { text: "1. Premi \xABNuovo libro\xBB e inserisci i dati del libro." });
      v.createEl("p", { text: "2. A lettura finita, premi \xABValuta libro\xBB e rispondi alle domande." });
      v.createEl("p", { text: "I libri li inserisci tu; i set di valutazione sono gi\xE0 pronti." });
      const az = v.createDiv({ cls: "arl-nome-azioni" });
      const b1 = az.createEl("button", { text: "Nuovo libro", cls: "mod-cta" });
      b1.onclick = () => this.main.mostraNuovoLibro(null);
      const b2 = az.createEl("button", { text: "Guida ai set" });
      b2.onclick = () => new GuidaSetModal(this.app, this.plugin.settings.lingua).open();
      return;
    }
    if (filtrati.length === 0) {
      box.createDiv({ cls: "arl-vuoto", text: "Nessun libro corrisponde alla ricerca." });
      return;
    }
    const wrap = box.createDiv({ cls: "arl-table-wrap arl-lista-wrap" });
    const table = wrap.createEl("table", { cls: "arl-table" });
    const tr2 = table.createEl("thead").createEl("tr");
    for (const col of colonne) {
      const th = tr2.createEl("th", { cls: col.centro ? "arl-sortable arl-centro" : "arl-sortable" });
      const attiva = this.ordine.chiave === col.chiave;
      th.setText(col.titolo + (attiva ? this.ordine.asc ? " \u25B2" : " \u25BC" : ""));
      th.onclick = () => {
        this.ordine = {
          chiave: col.chiave,
          asc: attiva ? !this.ordine.asc : col.chiave === "titolo" || col.chiave === "autore"
        };
        this.disegnaTabella();
      };
    }
    const adesso = /* @__PURE__ */ new Date();
    const celle = {
      codice: (r, l) => void r.createEl("td", { text: l.codice !== null ? String(l.codice) : "", cls: "arl-centro" }),
      titolo: (r, l) => void r.createEl("td", { text: l.titolo, cls: "arl-titolo-cell" }),
      autore: (r, l) => void r.createEl("td", { text: l.autore }),
      editore: (r, l) => void r.createEl("td", { text: l.editore }),
      genere: (r, l) => void r.createEl("td", { text: l.genere }),
      set: (r, l) => void r.createEl("td", { text: l.set || "\u2014" }),
      pagine: (r, l) => void r.createEl("td", { text: l.pagine ? String(l.pagine) : "", cls: "arl-centro" }),
      prezzo: (r, l) => void r.createEl("td", { text: l.prezzo !== null ? formatEuro(l.prezzo) : "\u2014", cls: "arl-centro arl-nowrap" }),
      fine: (r, l) => void r.createEl("td", {
        text: l.inizio && l.fine ? `${fmtData(l.inizio)} \u2013 ${fmtData(l.fine)}` : "",
        cls: "arl-nowrap"
      }),
      giorni: (r, l) => void r.createEl("td", { text: l.giorni ? String(l.giorni) : "", cls: "arl-centro" }),
      arl: (r, l) => {
        const td = r.createEl("td", { text: l.valutato ? fmt(l.arl) + (l.manuale ? " \u270E" : "") : "\u2014", cls: "arl-nowrap" });
        const col = l.valutato ? this.plugin.coloreVotoDi(l.arl, l.set) : "";
        if (col) {
          td.style.color = col;
          td.addClass("arl-forte");
        }
      },
      valutazione: (r, l) => {
        const td = r.createEl("td", { cls: "arl-nowrap" });
        if (l.valutato) td.createSpan({ text: this.stelle(l), cls: "arl-stelle" });
        else td.createSpan({ text: "Da valutare", cls: "arl-meta" });
      },
      trascorso: (r, l) => {
        const p = this.pause.get(l.file.path);
        const td = r.createEl("td", { text: p ? plurale(p.giorni, "giorno", "giorni") : "\u2014", cls: "arl-centro arl-nowrap" });
        if (p) td.setAttr("title", `${traduci("Dopo")}: ${p.prec.titolo}`);
      },
      restituzione: (r, l) => {
        const sc = calcolaScadenza(l.restituzione, l.restituito, adesso);
        r.createEl("td", { text: sc.testo, cls: `arl-nowrap ${sc.classe}`.trim() });
      },
      premio: (r, l) => void r.createEl("td", { text: l.premio })
    };
    const body = table.createEl("tbody");
    for (const l of filtrati) {
      const riga = body.createEl("tr", { cls: "arl-riga" });
      for (const col of colonne) celle[col.chiave](riga, l);
      riga.dataset.percorso = l.file.path;
      riga.onclick = () => {
        this.st.ancora = { percorso: l.file.path, top: riga.getBoundingClientRect().top };
        this.st.ripristina = true;
        if (this.modo === "valuta") {
          void this.main.mostraValutazione(l, 0, () => void this.main.mostraListaValutazione());
        } else {
          this.renderDettaglio(l);
        }
      };
    }
    const conPrezzo = filtrati.filter((l) => l.prezzo !== null);
    const totale = conPrezzo.reduce((somma, l) => {
      var _a;
      return somma + ((_a = l.prezzo) != null ? _a : 0);
    }, 0);
    let riepilogo = `${filtrati.length} ${filtrati.length === 1 ? "libro" : "libri"}`;
    if (conPrezzo.length > 0) riepilogo += ` \xB7 Totale ${formatEuro(totale)}`;
    const foot = box.createDiv({ cls: "arl-conteggio" });
    const voce = (testo, cls = "") => foot.createSpan({ text: testo, cls });
    const mostra = (k) => !this.plugin.settings.riepilogoNascosti.includes(k);
    if (mostra("totali")) voce(riepilogo);
    const totStelle = this.plugin.settings.stelleTotali;
    const perStelle = new Array(totStelle + 1).fill(0);
    let daValutare = 0;
    for (const l of filtrati) {
      if (!l.valutato) daValutare++;
      else perStelle[Math.min(totStelle, Math.max(0, this.plugin.stelleDi(l.arl, l.set)))]++;
    }
    if (mostra("stelle")) {
      for (let k = totStelle; k >= 1; k--) {
        const v = foot.createSpan({ cls: perStelle[k] === 0 ? "arl-voce-zero" : "" });
        v.createSpan({ text: stringaStelle(k), cls: "arl-stelle" });
        v.createSpan({ text: ` ${perStelle[k]}` });
      }
      if (daValutare > 0) voce(`Da valutare ${daValutare}`);
    }
    const conPagine = filtrati.filter((l) => l.pagine > 0);
    if (conPagine.length > 0) {
      const max = conPagine.reduce((m, l) => l.pagine > m.pagine ? l : m);
      const min = conPagine.reduce((m, l) => l.pagine < m.pagine ? l : m);
      if (mostra("piu")) {
        const vMax = foot.createSpan();
        vMax.createSpan({ text: "Libro con pi\xF9 pagine:" });
        vMax.createSpan({ text: ` ${max.titolo} (${max.pagine})` });
      }
      if (mostra("meno")) {
        const vMin = foot.createSpan();
        vMin.createSpan({ text: "Libro con meno pagine:" });
        vMin.createSpan({ text: ` ${min.titolo} (${min.pagine})` });
      }
    }
    const generi = /* @__PURE__ */ new Map();
    for (const l of filtrati) {
      const g = l.genere.trim();
      if (!g || !(l.fine || l.valutato)) continue;
      const chiave = g.toLowerCase();
      const e = generi.get(chiave);
      if (e) e.n++;
      else generi.set(chiave, { nome: g, n: 1 });
    }
    const primi = [...generi.values()].sort((p, q2) => q2.n - p.n || p.nome.localeCompare(q2.nome, "it")).slice(0, 5);
    if (primi.length > 0 && mostra("generi")) {
      const vG = foot.createSpan();
      vG.createSpan({ text: "Generi letti:" });
      vG.createSpan({ text: ` ${primi.map((g) => `${g.nome} ${g.n}`).join(", ")}` });
    }
  }
  /* ---- Dettaglio ---- */
  /** Pagina con le immagini tematiche del libro: anteprime grandi, clic per vederle a grandezza naturale. */
  renderGalleria(l) {
    this.host.empty();
    this.host.scrollTop = 0;
    const c = this.host.createDiv({ cls: "arl-stretto arl-galleria" });
    const torna = () => {
      this.carica();
      const agg = this.libri.find((x) => x.file.path === l.file.path);
      if (agg) this.renderDettaglio(agg);
      else this.renderLista();
    };
    c.createEl("button", { text: "Indietro", cls: "arl-link" }).onclick = torna;
    c.createEl("h2", { text: `Galleria immagini \u2014 ${l.titolo}` });
    c.createDiv({
      cls: "arl-meta",
      text: "Le immagini tematiche del libro (per esempio create con l'IA). Clicca su un'anteprima per vederla a grandezza naturale."
    });
    let lista = [...l.galleria];
    let testi = lista.map((_, i) => {
      var _a;
      return (_a = l.galleriaTesti[i]) != null ? _a : "";
    });
    const griglia = c.createDiv({ cls: "arl-gal-griglia" });
    const salvaTesto = async (i, t) => {
      testi[i] = pulisciDidascalia(t);
      await this.plugin.salvaGalleria(l.file, lista, testi);
    };
    const disegna = () => {
      var _a;
      griglia.empty();
      const voci = lista.map((d) => ({ d, f: this.plugin.fileCopertina(d, l.file.path) })).map((v, i) => ({ ...v, i }));
      if (voci.length === 0) {
        griglia.createDiv({ cls: "arl-vuoto", text: "Nessuna immagine: aggiungine una." });
        return;
      }
      const visibili = voci.filter((v) => v.f instanceof import_obsidian.TFile);
      const urls = [];
      for (const v of visibili) {
        if (v.f instanceof import_obsidian.TFile) {
          urls.push({ url: this.plugin.urlImmagine(v.f), nome: v.f.name, testo: (_a = testi[v.i]) != null ? _a : "", indice: v.i });
        }
      }
      for (const v of voci) {
        const cella = griglia.createDiv({ cls: "arl-gal-cella" });
        if (v.f) {
          const k = visibili.indexOf(v);
          const im = cella.createEl("img", {
            attr: { src: this.plugin.urlImmagine(v.f), alt: v.f.name, loading: "lazy", decoding: "async" }
          });
          im.onclick = () => new VisoreImmagini(this.app, urls, k, salvaTesto).open();
        } else {
          cella.createDiv({ cls: "arl-meta", text: "Immagine non trovata nel vault." });
        }
        const sotto = cella.createDiv({ cls: "arl-gal-didascalia" });
        const mostraTesto = () => {
          var _a2;
          sotto.empty();
          const t = (_a2 = testi[v.i]) != null ? _a2 : "";
          if (t) sotto.createSpan({ cls: "arl-gal-testo", text: t });
          const mod = sotto.createEl("button", { text: "\u270E", cls: "arl-gal-mod" });
          mod.setAttr("aria-label", "Modifica didascalia");
          mod.onclick = () => {
            sotto.empty();
            const inp = sotto.createEl("input", { type: "text", cls: "arl-gal-input" });
            inp.maxLength = 200;
            inp.value = t;
            inp.placeholder = "Didascalia (facoltativa)";
            const ok = sotto.createEl("button", { text: "Salva", cls: "mod-cta" });
            const no = sotto.createEl("button", { text: "Annulla" });
            const salva = async () => {
              await salvaTesto(v.i, inp.value);
              disegna();
            };
            ok.onclick = () => void salva();
            no.onclick = mostraTesto;
            inp.addEventListener("keydown", (ev) => {
              if (ev.key === "Enter") void salva();
              else if (ev.key === "Escape") {
                ev.stopPropagation();
                mostraTesto();
              }
            });
            inp.focus();
          };
        };
        mostraTesto();
        const rimuovi = cella.createEl("button", { text: "\u2715", cls: "arl-gal-x" });
        rimuovi.setAttr("aria-label", "Rimuovi dalla galleria");
        rimuovi.onclick = async () => {
          lista = lista.filter((_, j) => j !== v.i);
          testi = testi.filter((_, j) => j !== v.i);
          await this.plugin.salvaGalleria(l.file, lista, testi);
          disegna();
        };
      }
    };
    const aggiungi = async (f) => {
      const dest = this.plugin.app.metadataCache.fileToLinktext(f, l.file.path);
      if (lista.includes(dest)) return;
      lista.push(dest);
      testi.push("");
      await this.plugin.salvaGalleria(l.file, lista, testi);
      disegna();
    };
    new import_obsidian.Setting(c).setName("Immagini").setDesc("Aggiungi immagini dal vault o dal computer. Rimuovere un'immagine dalla galleria non cancella il file.").addButton(
      (b) => b.setButtonText("Scegli\u2026").onClick(() => {
        const imm = this.plugin.imgDelVault();
        if (!imm.length) {
          new NoticeT("Nel vault non ci sono immagini.");
          return;
        }
        new ImmagineModal(this.plugin.app, imm, (f) => void aggiungi(f)).open();
      })
    ).addButton(
      (b) => b.setButtonText("Dal computer\u2026").onClick(() => {
        const sel = createEl("input");
        sel.type = "file";
        sel.accept = "image/*";
        sel.multiple = true;
        sel.onchange = async () => {
          var _a;
          for (const file of Array.from((_a = sel.files) != null ? _a : [])) {
            try {
              await aggiungi(await this.plugin.importaImmagine(file));
            } catch (e) {
              new NoticeT(`Impossibile aggiungere l'immagine: ${e.message}`);
            }
          }
        };
        sel.click();
      })
    );
    c.appendChild(griglia);
    disegna();
  }
  renderLetture(box, l, btn) {
    box.empty();
    box.createEl("h3", { text: "Andamento della lettura" });
    const barraBox = box.createDiv({ cls: "arl-let-barra-box" });
    box.createDiv({
      cls: "arl-meta",
      text: "Registra le pagine lette giorno per giorno. Da 10 a 20 contano 11 pagine (estremi inclusi)."
    });
    const righe = l.letture.map((r) => ({ data: r.data, da: String(r.da), a: String(r.a) }));
    const intero = (t) => /^[1-9]\d*$/.test(t.trim()) ? parseInt(t, 10) : null;
    const valide = () => {
      const out = [];
      for (const r of righe) {
        const da = intero(r.da);
        const a = intero(r.a);
        if (r.data && da !== null && a !== null && a >= da) out.push({ data: r.data, da, a });
      }
      return out;
    };
    const tabella = box.createDiv({ cls: "arl-let-tabella" });
    const riepilogo = box.createDiv({ cls: "arl-let-riepilogo" });
    const aggiornaRiepilogo = () => {
      riepilogo.empty();
      barraBox.empty();
      const v = valide();
      const totale = v.reduce((s2, r) => s2 + pagineLette(r), 0);
      if (l.pagine > 0) {
        const perc = Math.min(100, Math.round(totale / l.pagine * 100));
        const riga = barraBox.createDiv({ cls: "arl-let-barra" });
        const barra = riga.createDiv({ cls: "arl-progress arl-progress-lettura" });
        barra.createDiv({ cls: "arl-progress-fill" }).style.width = `${perc}%`;
        riga.createSpan({ cls: "arl-let-perc", text: `${perc}%` });
      }
      if (!v.length) {
        riepilogo.createDiv({ cls: "arl-meta", text: "Nessuna lettura registrata." });
        return;
      }
      const giorni = new Set(v.map((r) => r.data)).size;
      const media = Math.round(totale / giorni * 10) / 10;
      let testo = `Totale: ${totale} pagine`;
      if (l.pagine > 0) {
        const raggiunta = v.reduce((m, r) => Math.max(m, r.a), 0);
        testo += ` su ${l.pagine} \xB7 ${Math.max(0, l.pagine - raggiunta)} pagine rimanenti`;
      }
      testo += ` \xB7 ${plurale(giorni, "giorno", "giorni")} di lettura \xB7 media ${String(media).replace(".", ",")} pagine al giorno`;
      riepilogo.createDiv({ cls: "arl-info", text: testo });
      if (l.pagine > 0 && v.some((r) => r.a > l.pagine)) {
        riepilogo.createDiv({ cls: "arl-meta", text: `Attenzione: una lettura supera le ${l.pagine} pagine del libro.` });
      }
    };
    const disegna = () => {
      tabella.empty();
      if (!righe.length) {
        tabella.createDiv({ cls: "arl-meta", text: "Nessuna lettura: aggiungine una." });
      } else {
        const testa = tabella.createDiv({ cls: "arl-let-riga arl-let-testa" });
        for (const t of ["Data", "Da pag.", "A pag.", "Pagine lette", ""]) testa.createSpan({ text: t });
      }
      righe.forEach((r, i) => {
        const riga = tabella.createDiv({ cls: "arl-let-riga" });
        const data = riga.createEl("input", { type: "date" });
        data.value = r.data;
        const da = riga.createEl("input", { type: "number", cls: "arl-let-num" });
        da.min = "1";
        da.value = r.da;
        const a = riga.createEl("input", { type: "number", cls: "arl-let-num" });
        a.min = "1";
        a.value = r.a;
        const calc = riga.createSpan({ cls: "arl-let-calc" });
        const aggiornaCalc = () => {
          const d1 = intero(r.da);
          const a1 = intero(r.a);
          calc.setText(d1 !== null && a1 !== null && a1 >= d1 ? String(pagineLette({ da: d1, a: a1 })) : "\u2014");
          calc.toggleClass("arl-scaduto", d1 !== null && a1 !== null && a1 < d1);
        };
        data.oninput = () => {
          r.data = data.value;
          aggiornaRiepilogo();
        };
        da.oninput = () => {
          r.da = da.value;
          aggiornaCalc();
          aggiornaRiepilogo();
        };
        a.oninput = () => {
          r.a = a.value;
          aggiornaCalc();
          aggiornaRiepilogo();
        };
        aggiornaCalc();
        const del = riga.createEl("button", { text: "\u2715", cls: "arl-ed-btn" });
        del.setAttr("aria-label", "Elimina lettura");
        del.onclick = () => {
          righe.splice(i, 1);
          disegna();
          aggiornaRiepilogo();
        };
      });
    };
    disegna();
    box.appendChild(riepilogo);
    aggiornaRiepilogo();
    const az = box.createDiv({ cls: "arl-azioni arl-azioni-dettaglio" });
    az.createEl("button", { text: "+ Aggiungi lettura" }).onclick = () => {
      var _a;
      const v = valide().sort((p, q) => p.data.localeCompare(q.data) || p.a - q.a);
      const ultima = v.length ? v[v.length - 1].a : 0;
      righe.push({ data: isoLocale(/* @__PURE__ */ new Date()), da: String(ultima + 1), a: "" });
      disegna();
      aggiornaRiepilogo();
      (_a = tabella.querySelectorAll(".arl-let-riga:last-child input.arl-let-num")[1]) == null ? void 0 : _a.focus();
    };
    const salva = az.createEl("button", { text: "Salva letture", cls: "mod-cta" });
    salva.onclick = async () => {
      for (const r of righe) {
        const vuota = !r.da.trim() && !r.a.trim();
        if (vuota) continue;
        const da = intero(r.da);
        const a = intero(r.a);
        if (!r.data || da === null || a === null) {
          new NoticeT("Ogni lettura deve avere una data e pagine intere maggiori di zero.");
          return;
        }
        if (a < da) {
          new NoticeT("La pagina finale non pu\xF2 essere minore di quella iniziale.");
          return;
        }
      }
      salva.disabled = true;
      try {
        const lista = valide();
        const date = await this.plugin.salvaLetture(l.file, lista, l.pagine, l.inizio, l.fine);
        l.letture = lista.sort((p, q) => p.data.localeCompare(q.data) || p.da - q.da);
        if (date.inizio) l.inizio = date.inizio;
        if (date.fine) l.fine = date.fine;
        if (l.inizio && l.fine) l.giorni = giorniTra(l.inizio, l.fine);
        new NoticeT("Letture salvate.");
        this.renderDettaglio(l, true);
      } catch (e) {
        new NoticeT("Impossibile salvare le letture.");
        console.error(e);
        salva.disabled = false;
      }
    };
  }
  renderManuale(box, l) {
    var _a;
    box.empty();
    box.createEl("h3", { text: "Valutazione manuale" });
    box.createDiv({
      cls: "arl-meta",
      text: "Inserisci direttamente il punteggio ARL (da 0 a 10), senza rispondere alle domande: le stelle si calcolano da sole. Sostituisce l'eventuale valutazione gi\xE0 presente."
    });
    let setNome = ((_a = this.plugin.trovaSet(l.set)) != null ? _a : this.plugin.setIniziale()).nome;
    let testoArl = l.valutato ? fmt(l.arl) : "";
    new import_obsidian.Setting(box).setName("Set di valutazione").addDropdown((dd) => {
      const opzioni = {};
      for (const st of this.plugin.sets) opzioni[st.nome] = st.nome;
      dd.addOptions(opzioni).setValue(setNome).onChange((v) => {
        setNome = v;
        aggiorna();
      });
    });
    const anteprima = box.createDiv({ cls: "arl-stelle-box" });
    const valore = () => {
      const t = testoArl.trim().replace(",", ".");
      if (!/^\d+(\.\d+)?$/.test(t)) return null;
      const n = Number(t);
      return n >= 0 && n <= 10 ? arrotonda1(n) : null;
    };
    const aggiorna = () => {
      anteprima.empty();
      const v = valore();
      if (v === null) {
        anteprima.createDiv({ cls: "arl-etichetta", text: "Inserisci un numero da 0 a 10, per esempio 7,0." });
        return;
      }
      const s = this.plugin.settings;
      const k = stelleAssegnate(v, s.stelleTotali, this.plugin.soglieDelSet(setNome));
      const stelleP = anteprima.createDiv({ cls: "arl-stelle arl-stelle-grandi", text: stringaStelle(k) });
      const colP = this.plugin.coloreVotoDi(v, setNome);
      if (colP) stelleP.style.color = colP;
      anteprima.createDiv({ cls: "arl-etichetta", text: `${k} su ${s.stelleTotali} stelle` });
    };
    new import_obsidian.Setting(box).setName("Punteggio ARL").addText((t) => {
      t.setPlaceholder("7,0").setValue(testoArl).onChange((v) => {
        testoArl = v;
        aggiorna();
      });
    });
    box.appendChild(anteprima);
    aggiorna();
    const az = box.createDiv({ cls: "arl-azioni arl-azioni-dettaglio" });
    const salva = az.createEl("button", { text: "Salva valutazione manuale", cls: "mod-cta" });
    salva.onclick = async () => {
      const v = valore();
      if (v === null) {
        new NoticeT("Il punteggio ARL deve essere un numero da 0 a 10, per esempio 7,0.");
        return;
      }
      salva.disabled = true;
      try {
        await this.plugin.salvaManuale(l.file, setNome, v);
        new NoticeT("Valutazione manuale salvata.");
        this.carica();
        const agg = this.libri.find((x) => x.file.path === l.file.path);
        if (agg) this.renderDettaglio(agg);
        else this.renderLista();
      } catch (e) {
        new NoticeT("Impossibile salvare la valutazione.");
        console.error(e);
        salva.disabled = false;
      }
    };
  }
  renderPersonaggi(box, l, btn) {
    box.empty();
    box.createEl("h3", { text: "Personaggi" });
    const bozza = l.personaggi.map((p) => ({ ...p }));
    const elenco = box.createDiv({ cls: "arl-pers-elenco" });
    const disegna = () => {
      elenco.empty();
      if (!bozza.length) {
        elenco.createDiv({ cls: "arl-meta", text: "Nessun personaggio: aggiungine uno." });
      }
      bozza.forEach((p, i) => {
        const riga = elenco.createDiv({ cls: "arl-pers-riga" });
        const nome = riga.createEl("input", {
          type: "text",
          cls: "arl-pers-nome",
          placeholder: "Nome (es. Attila)"
        });
        nome.value = p.nome;
        nome.oninput = () => p.nome = nome.value;
        const descr = riga.createEl("input", {
          type: "text",
          cls: "arl-pers-descr",
          placeholder: "Descrizione (es. il guerriero, personaggio principale)"
        });
        descr.value = p.descrizione;
        descr.oninput = () => p.descrizione = descr.value;
        const del = riga.createEl("button", { text: "\u2715", cls: "arl-ed-btn" });
        del.setAttr("aria-label", "Elimina personaggio");
        del.onclick = () => {
          bozza.splice(i, 1);
          disegna();
        };
      });
    };
    disegna();
    const az = box.createDiv({ cls: "arl-azioni arl-azioni-dettaglio" });
    az.createEl("button", { text: "+ Aggiungi personaggio" }).onclick = () => {
      var _a;
      bozza.push({ nome: "", descrizione: "" });
      disegna();
      (_a = elenco.querySelectorAll(".arl-pers-nome")[bozza.length - 1]) == null ? void 0 : _a.focus();
    };
    const salva = az.createEl("button", { text: "Salva personaggi", cls: "mod-cta" });
    salva.onclick = async () => {
      salva.disabled = true;
      try {
        await this.plugin.salvaPersonaggi(l.file, bozza);
        l.personaggi = bozza.filter((p) => p.nome.trim()).map((p) => ({
          nome: p.nome.trim(),
          descrizione: p.descrizione.trim()
        }));
        btn.setText(l.personaggi.length ? `Personaggi (${l.personaggi.length})` : "Personaggi");
        new NoticeT("Personaggi salvati.");
      } catch (e) {
        new NoticeT("Impossibile salvare i personaggi.");
        console.error(e);
      }
      salva.disabled = false;
    };
  }
  renderAnnotazioni(box, l) {
    box.empty();
    box.createEl("h3", { text: TITOLO_ANNOTAZIONI });
    const area = box.createEl("textarea", {
      cls: "arl-annotazioni",
      placeholder: "Scrivi qui estratti, citazioni, note e impressioni sul libro\u2026"
    });
    area.rows = 10;
    area.disabled = true;
    const az = box.createDiv({ cls: "arl-azioni arl-azioni-dettaglio" });
    const salva = az.createEl("button", { text: "Salva annotazioni", cls: "mod-cta" });
    salva.disabled = true;
    let caricato = false;
    void this.plugin.leggiAnnotazioni(l.file).then((t) => {
      area.value = t;
      area.disabled = false;
      salva.disabled = false;
      caricato = true;
    }).catch(() => new NoticeT("Impossibile leggere la nota."));
    salva.onclick = async () => {
      if (!caricato) return;
      salva.disabled = true;
      try {
        await this.plugin.salvaAnnotazioni(l.file, area.value);
        new NoticeT("Annotazioni salvate nella nota.");
      } catch (e) {
        new NoticeT("Impossibile salvare le annotazioni.");
        console.error(e);
      }
      salva.disabled = false;
    };
  }
  renderDettaglio(l, apriLettura = false) {
    this.host.empty();
    this.host.scrollTop = 0;
    const c = this.host.createDiv({ cls: "arl-stretto" });
    const indietro = c.createEl("button", { text: "Indietro", cls: "arl-link" });
    indietro.onclick = () => {
      this.carica();
      this.renderLista();
    };
    const testa = c.createDiv({ cls: "arl-testa" });
    const fCop = this.plugin.fileCopertina(l.copertina, l.file.path);
    if (fCop) {
      testa.createDiv({ cls: "arl-copertina" }).createEl("img", {
        attr: { src: this.plugin.urlImmagine(fCop), alt: `Copertina di ${l.titolo}`, decoding: "async" }
      });
    }
    const info = testa.createDiv({ cls: "arl-testa-info" });
    info.createEl("h2", { text: l.titolo });
    if (l.codice !== null) info.createDiv({ cls: "arl-meta", text: `Codice ${l.codice}` });
    if (l.autore) info.createDiv({ cls: "arl-sub", text: l.autore });
    if (l.editore) info.createDiv({ cls: "arl-meta", text: l.editore });
    if (l.valutato) info.createDiv({ cls: "arl-meta", text: `Set di valutazione: ${l.set}` });
    const extra = [l.genere, l.pagine ? `${l.pagine} pagine` : ""].filter(Boolean);
    if (extra.length) info.createDiv({ cls: "arl-meta", text: extra.join(" \xB7 ") });
    if (l.prezzo !== null) {
      info.createDiv({ cls: "arl-meta", text: `Prezzo: ${formatEuro(l.prezzo)}` });
    }
    if (l.restituzione || l.restituito) {
      const sc = calcolaScadenza(l.restituzione, l.restituito, /* @__PURE__ */ new Date());
      const riga = info.createDiv({ cls: "arl-meta" });
      riga.createSpan({
        text: l.restituzione ? `Restituzione: ${fmtData(l.restituzione)} \xB7 ` : ""
      });
      riga.createSpan({ text: sc.testo, cls: sc.classe });
    }
    if (l.inizio && l.fine) {
      info.createDiv({
        cls: "arl-meta",
        text: `${fmtData(l.inizio)} \u2013 ${fmtData(l.fine)} (${etichettaGiorni(l.giorni)})`
      });
    }
    if (l.premio) info.createDiv({ cls: "arl-meta", text: `Premio: ${l.premio}` });
    const set = this.plugin.trovaSet(l.set);
    const compat = l.valutato && !!set && libroCompatibile(l, set);
    if (l.valutato) {
      const s = this.plugin.settings;
      const k = this.plugin.stelleDi(l.arl, l.set);
      const ris = c.createDiv({ cls: "arl-risultato" });
      const colonna = ris.createDiv();
      colonna.createDiv({ cls: "arl-etichetta", text: "Punteggio ARL" });
      const grande = colonna.createDiv({ cls: "arl-grande", text: fmt(l.arl) });
      const colArl = this.plugin.coloreVotoDi(l.arl, l.set);
      if (colArl) grande.style.color = colArl;
      const stelle = ris.createDiv({ cls: "arl-stelle-box" });
      stelle.createDiv({ cls: "arl-stelle arl-stelle-grandi", text: stringaStelle(k) });
      stelle.createDiv({ cls: "arl-etichetta", text: `${k} su ${s.stelleTotali} stelle` });
      const cats = c.createDiv({ cls: "arl-categorie" });
      const nelSet = set ? set.categorie.map((x) => x.id).filter((id) => id in l.punteggi) : [];
      const altri = Object.keys(l.punteggi).filter((id) => !nelSet.includes(id));
      for (const id of [...nelSet, ...altri]) {
        const p = l.punteggi[id];
        const riga = cats.createDiv({ cls: "arl-cat" });
        riga.createDiv({ cls: "arl-cat-nome", text: nomeTema(id, set) });
        const bar = riga.createDiv({ cls: "arl-progress" });
        const fillTema = bar.createDiv({ cls: "arl-progress-fill" });
        fillTema.style.width = `${p * 10}%`;
        const sfondo = this.plugin.sfondoVotoDi(p, l.set);
        if (sfondo) fillTema.style.background = sfondo;
        riga.createDiv({ cls: "arl-cat-val", text: `${fmtP(p)} / 10` });
      }
      if (l.manuale) {
        c.createDiv({
          cls: "arl-meta",
          text: "Valutazione manuale: il punteggio ARL \xE8 stato inserito direttamente, senza le domande."
        });
      } else if (!compat) {
        c.createDiv({
          cls: "arl-meta",
          text: set ? `Il set \xAB${set.nome}\xBB \xE8 stato modificato dopo questa valutazione: i punteggi restano, ma le risposte non si possono pi\xF9 rivedere.` : `Il set di valutazione \xAB${l.set}\xBB non esiste pi\xF9: i punteggi restano, ma le risposte non si possono pi\xF9 rivedere.`
        });
      }
    } else {
      c.createDiv({
        cls: "arl-meta",
        text: "Da valutare: quando hai finito il libro premi \xABValuta\xBB."
      });
    }
    const azioni = c.createDiv({ cls: "arl-azioni arl-azioni-dettaglio" });
    const rivedibile = l.valutato && !l.manuale;
    const valuta = azioni.createEl("button", {
      text: l.manuale ? "Valuta con le domande" : l.valutato ? "Rivedi valutazione" : "Valuta",
      cls: l.valutato ? void 0 : "mod-cta"
    });
    valuta.disabled = rivedibile && !compat;
    valuta.onclick = () => void this.main.mostraValutazione(l, rivedibile ? 1 : 0, () => void this.main.mostraArchivio(l.file.path));
    const boxMan = c.createDiv({ cls: "arl-personaggi" });
    boxMan.addClass("arl-oculto");
    const btnMan = azioni.createEl("button", { text: "Valutazione manuale" });
    btnMan.onclick = () => {
      if (!boxMan.hasClass("arl-oculto")) {
        boxMan.addClass("arl-oculto");
        btnMan.classList.remove("mod-cta");
      } else {
        this.renderManuale(boxMan, l);
        boxMan.removeClass("arl-oculto");
        btnMan.classList.add("mod-cta");
      }
    };
    azioni.createEl("button", { text: "Modifica dati" }).onclick = () => this.main.mostraNuovoLibro(l);
    if (l.restituzione && !l.restituito) {
      const rest = azioni.createEl("button", { text: "Segna come restituito" });
      rest.onclick = async () => {
        rest.disabled = true;
        await this.plugin.impostaRestituito(l.file, true);
        this.carica();
        const aggiornato = this.libri.find((x) => x.file.path === l.file.path);
        if (aggiornato) this.renderDettaglio(aggiornato);
        else this.renderLista();
      };
    }
    const boxPers = c.createDiv({ cls: "arl-personaggi" });
    boxPers.addClass("arl-oculto");
    const btnPers = azioni.createEl("button", {
      text: l.personaggi.length ? `Personaggi (${l.personaggi.length})` : "Personaggi"
    });
    btnPers.onclick = () => {
      if (!boxPers.hasClass("arl-oculto")) {
        boxPers.addClass("arl-oculto");
        btnPers.classList.remove("mod-cta");
      } else {
        this.renderPersonaggi(boxPers, l, btnPers);
        boxPers.removeClass("arl-oculto");
        btnPers.classList.add("mod-cta");
      }
    };
    const boxAnn = c.createDiv({ cls: "arl-personaggi" });
    boxAnn.addClass("arl-oculto");
    const btnAnn = azioni.createEl("button", { text: "Estratti e annotazioni" });
    btnAnn.onclick = () => {
      if (!boxAnn.hasClass("arl-oculto")) {
        boxAnn.addClass("arl-oculto");
        btnAnn.classList.remove("mod-cta");
      } else {
        this.renderAnnotazioni(boxAnn, l);
        boxAnn.removeClass("arl-oculto");
        btnAnn.classList.add("mod-cta");
      }
    };
    const boxLet = c.createDiv({ cls: "arl-personaggi" });
    boxLet.addClass("arl-oculto");
    const btnLet = azioni.createEl("button", {
      text: l.letture.length ? `Andamento lettura (${l.letture.length})` : "Andamento lettura"
    });
    btnLet.onclick = () => {
      if (!boxLet.hasClass("arl-oculto")) {
        boxLet.addClass("arl-oculto");
        btnLet.classList.remove("mod-cta");
      } else {
        this.renderLetture(boxLet, l, btnLet);
        boxLet.removeClass("arl-oculto");
        btnLet.classList.add("mod-cta");
      }
    };
    if (apriLettura) btnLet.click();
    if (l.letture.length) {
      const boxGraf = c.createDiv({ cls: "arl-personaggi" });
      boxGraf.addClass("arl-oculto");
      const btnGraf = azioni.createEl("button", { text: "Grafico" });
      btnGraf.onclick = () => {
        if (!boxGraf.hasClass("arl-oculto")) {
          boxGraf.addClass("arl-oculto");
          btnGraf.classList.remove("mod-cta");
          return;
        }
        boxGraf.empty();
        boxGraf.createEl("h3", { text: "Pagine lette per giorno" });
        const punti = paginePerGiorno(l.letture);
        disegnaGrafico(boxGraf.createDiv(), punti, this.plugin.stileGrafico());
        const totale = punti.reduce((a, p) => a + p.pagine, 0);
        const giorni = punti.filter((p) => p.pagine > 0).length;
        const media = Math.round(totale / Math.max(1, giorni) * 10) / 10;
        const raggiunta = l.letture.reduce((m, r) => Math.max(m, r.a), 0);
        const parteLibro = l.pagine > 0 ? ` su ${l.pagine} \xB7 ${Math.max(0, l.pagine - raggiunta)} pagine rimanenti` : "";
        boxGraf.createDiv({
          cls: "arl-info",
          text: `Totale: ${totale} pagine${parteLibro} \xB7 ${plurale(giorni, "giorno", "giorni")} di lettura \xB7 media ${String(media).replace(".", ",")} pagine al giorno`
        });
        boxGraf.removeClass("arl-oculto");
        btnGraf.classList.add("mod-cta");
      };
    }
    azioni.createEl("button", {
      text: l.galleria.length ? `Galleria immagini (${l.galleria.length})` : "Galleria immagini"
    }).onclick = () => this.renderGalleria(l);
    azioni.createEl("button", { text: "Apri nota" }).onclick = () => {
      void this.app.workspace.getLeaf("tab").openFile(l.file);
    };
    const elimina = azioni.createEl("button", { text: "Elimina" });
    let confermato = false;
    elimina.onclick = async () => {
      if (!confermato) {
        confermato = true;
        elimina.setText("Conferma eliminazione");
        elimina.addClass("mod-warning");
        return;
      }
      await this.app.fileManager.trashFile(l.file);
      this.libri = this.libri.filter((x) => x !== l);
      new NoticeT("Libro eliminato.");
      this.renderLista();
    };
  }
};
function copiaBozza(set) {
  return {
    nome: set.nome,
    soglie: [...set.soglie],
    colori: [...set.colori],
    categorie: set.categorie.map((c) => ({ ...c, domande: [...c.domande] }))
  };
}
var SetManagerView = class {
  constructor(app, plugin, host, main) {
    this.app = app;
    this.plugin = plugin;
    this.host = host;
    this.main = main;
    this.sets_sel = null;
  }
  avvia() {
    this.render();
  }
  render() {
    var _a, _b;
    const c = this.host;
    c.empty();
    c.scrollTop = 0;
    c.createEl("h2", { text: "Set di valutazione" });
    c.createDiv({
      cls: "arl-meta",
      text: "Un set di valutazione serve a valutare un libro attraverso domande mirate, suddivise per tematiche (per esempio Trama, Personaggi, Stile). Ogni domanda ha risposta S\xEC o No: i S\xEC determinano il punteggio del tema (da 0 a 10) e la media dei temi, secondo i pesi, d\xE0 il punteggio ARL da cui derivano le stelle. Il set si sceglie quando valuti un libro: Romanzi e Saggi sono gi\xE0 pronti, e puoi crearne di tuoi."
    });
    c.createDiv({ cls: "arl-meta", text: SPIEGAZIONE_LIVELLO });
    if (this.sets_sel === null || !this.plugin.sets.some((x) => x.nome === this.sets_sel)) {
      this.sets_sel = (_b = (_a = this.plugin.sets[0]) == null ? void 0 : _a.nome) != null ? _b : null;
    }
    const selRiga = c.createDiv({ cls: "arl-toolbar" });
    selRiga.createSpan({ text: "Mostra il livello del set:" });
    const menu = selRiga.createEl("select", { cls: "dropdown" });
    for (const st of this.plugin.sets) {
      menu.createEl("option", { text: st.nome, attr: { value: st.nome } });
    }
    if (this.sets_sel) menu.value = this.sets_sel;
    const boxTab = c.createDiv();
    const mostra = () => {
      boxTab.empty();
      const st = this.plugin.sets.find((x) => x.nome === this.sets_sel);
      const lv = st ? this.plugin.livelloDi(st.categorie, st.soglie) : null;
      creaTabellaLivelli(boxTab, new Map(lv ? [[lv.etichetta, `\u2190 ${st.nome}`]] : []));
    };
    menu.onchange = () => {
      this.sets_sel = menu.value;
      mostra();
    };
    mostra();
    c.createDiv({
      cls: "arl-meta",
      text: `Ogni set \xE8 una nota nella cartella \xAB${this.plugin.cartellaSetEff()}\xBB.`
    });
    const barra = c.createDiv({ cls: "arl-toolbar" });
    const nuovo = barra.createEl("button", { text: "+ Nuovo set", cls: "mod-cta" });
    nuovo.onclick = () => this.main.mostraEditorSet(
      {
        nome: "Nuovo set",
        soglie: [...SOGLIE_STANDARD],
        colori: [...COLORI_FASCE],
        categorie: [{ id: "", nome: "Tema 1", descr: "", peso: 20, domande: [""] }]
      },
      null,
      null
    );
    const guida = barra.createEl("button", { text: "? Guida" });
    guida.onclick = () => new GuidaSetModal(this.app, this.plugin.settings.lingua).open();
    const ripristina = barra.createEl("button", { text: "Ripristina Romanzi e Saggi predefiniti" });
    let confermaRipristino = false;
    ripristina.onclick = async () => {
      if (!confermaRipristino) {
        confermaRipristino = true;
        ripristina.setText("Sovrascrive le tue modifiche: premi di nuovo");
        ripristina.addClass("mod-warning");
        return;
      }
      await this.plugin.scriviSetPredefiniti(true);
      await this.plugin.caricaSet();
      new NoticeT("Set Romanzi e Saggi ripristinati.");
      this.render();
    };
    const libri = this.plugin.tuttiILibri();
    const wrap = c.createDiv({ cls: "arl-table-wrap" });
    const table = wrap.createEl("table", { cls: "arl-table" });
    const tr2 = table.createEl("thead").createEl("tr");
    for (const t of ["Nome", "Temi", "Domande", "Livello", "Libri", "File", "Azioni"]) {
      tr2.createEl("th", { text: t, cls: ["Temi", "Domande", "Livello", "Libri"].includes(t) ? "arl-centro" : "" });
    }
    const body = table.createEl("tbody");
    for (const s of this.plugin.sets) {
      const riga = body.createEl("tr");
      riga.createEl("td", {
        text: s.file ? s.nome : `${s.nome} (predefinito, non ancora salvato)`,
        cls: "arl-titolo-cell"
      });
      riga.createEl("td", { text: String(s.categorie.length), cls: "arl-centro" });
      riga.createEl("td", { text: String(totaleDomande(s)), cls: "arl-centro" });
      riga.createEl("td", {
        text: testoLivello(this.plugin.livelloDi(s.categorie, s.soglie)),
        cls: "arl-centro arl-nowrap"
      });
      riga.createEl("td", {
        text: String(libri.filter((l) => l.set.toLowerCase() === s.nome.toLowerCase()).length),
        cls: "arl-centro"
      });
      riga.createEl("td", { text: s.file ? s.file.name : "\u2014" });
      const azioni = riga.createEl("td").createDiv({ cls: "arl-azioni-riga" });
      azioni.createEl("button", { text: "Modifica" }).onclick = () => this.main.mostraEditorSet(copiaBozza(s), s.file, s.nome);
      azioni.createEl("button", { text: "Duplica" }).onclick = () => {
        const b = copiaBozza(s);
        let nome = `${s.nome} (copia)`;
        let n = 2;
        while (this.plugin.trovaSet(nome)) nome = `${s.nome} (copia ${n++})`;
        b.nome = nome;
        this.main.mostraEditorSet(b, null, null);
      };
      if (s.file) {
        const file = s.file;
        azioni.createEl("button", { text: "Apri file" }).onclick = () => {
          void this.app.workspace.getLeaf("tab").openFile(file);
        };
        const elimina = azioni.createEl("button", { text: "Elimina" });
        let confermato = false;
        elimina.onclick = async () => {
          if (!confermato) {
            confermato = true;
            elimina.setText("Conferma");
            elimina.addClass("mod-warning");
            return;
          }
          await this.plugin.eliminaSet(file);
          new NoticeT("Set eliminato.");
          this.render();
        };
      }
    }
    if (this.plugin.setNonValidi.length > 0) {
      c.createEl("h3", { text: "File da correggere" });
      for (const nv of this.plugin.setNonValidi) {
        const box = c.createDiv({ cls: "arl-errore-set" });
        box.createDiv({ cls: "arl-titolo-cell", text: nv.file.name });
        for (const e of nv.errori) box.createDiv({ cls: "arl-meta", text: `\u2022 ${e}` });
        const file = nv.file;
        box.createEl("button", { text: "Apri file" }).onclick = () => {
          void this.app.workspace.getLeaf("tab").openFile(file);
        };
      }
    }
  }
};
var SetEditorView = class {
  constructor(plugin, host, main, bozza, file, nomeOriginale) {
    this.plugin = plugin;
    this.host = host;
    this.main = main;
    this.bozza = bozza;
    this.file = file;
    this.nomeOriginale = nomeOriginale;
    this.sel = 0;
    this.modificato = false;
    this.focusDomanda = null;
  }
  inCorso() {
    return this.modificato;
  }
  avvia() {
    this.render();
  }
  render() {
    var _a;
    const b = this.bozza;
    const scroll = this.host.scrollTop;
    this.host.empty();
    const c = this.host.createDiv({ cls: "arl-stretto arl-editor" });
    c.createEl("h2", { text: this.nomeOriginale || this.file ? "Modifica set di valutazione" : "Nuovo set di valutazione" });
    const nomeRiga = c.createDiv({ cls: "arl-ed-riga" });
    nomeRiga.createSpan({ text: "Nome del set", cls: "arl-ed-etichetta" });
    const nomeInput = nomeRiga.createEl("input", { type: "text" });
    nomeInput.value = b.nome;
    nomeInput.addEventListener("input", () => {
      b.nome = nomeInput.value;
      this.modificato = true;
    });
    const boxLivello = c.createDiv({ cls: "arl-livello" });
    const aggiornaLivello = () => {
      boxLivello.empty();
      const cats = b.categorie.map((x) => ({
        peso: x.peso,
        domande: x.domande.filter((d) => d.trim() !== "")
      }));
      const l = this.plugin.livelloDi(cats, soglieValide(b.soglie) ? SOGLIE_STANDARD : b.soglie);
      const s = this.plugin.settings;
      boxLivello.createDiv({ cls: "arl-etichetta", text: "Livello del set" });
      boxLivello.createDiv({ cls: "arl-livello-valore", text: testoLivello(l) });
      if (l) {
        const riga = l.probabilita.map((p, k) => [k + 1, p]).filter(([k]) => k >= 2).map(([k, p]) => `${"\u2605".repeat(k)} ${fmtPerc(p)}`).join(" \xB7 ");
        boxLivello.createDiv({ cls: "arl-meta", text: `Risposte a caso, probabilit\xE0 di ottenere almeno: ${riga}` });
      }
      boxLivello.createDiv({
        cls: "arl-meta",
        text: `${SPIEGAZIONE_LIVELLO} Ora: ${plurale(s.stelleTotali, "stella", "stelle")}.`
      });
      creaTabellaLivelli(boxLivello, new Map(l ? [[l.etichetta, "\u2190 questo set"]] : []));
    };
    if (this.nomeOriginale) {
      const n = this.plugin.libriConSet(this.nomeOriginale);
      if (n > 0) {
        c.createDiv({
          cls: "arl-meta",
          text: `${plurale(n, "libro usa", "libri usano")} questo set. I loro punteggi non cambiano; se modifichi le domande, le loro risposte non si potranno pi\xF9 rivedere.`
        });
      }
    }
    const sezStelle = c.createDiv({ cls: "arl-ed-sezione" });
    sezStelle.createEl("h3", { text: "Soglie delle stelle" });
    sezStelle.createDiv({
      cls: "arl-meta",
      text: "Ogni casella indica fino a quale punteggio ARL si ottengono 1, 2, 3 e 4 stelle. La quinta stella non ha una casella: comincia subito dopo il limite delle 4 stelle e arriva fino a 10. Per questo l'ultima casella pu\xF2 arrivare al massimo a 9,9 (con 9,9 la quinta stella si ottiene solo con 10,0). Con un numero di stelle diverso da 5 le soglie si ridistribuiscono in proporzione. Pi\xF9 sono alte, pi\xF9 il set \xE8 severo."
    });
    const rigaPreset = sezStelle.createDiv({ cls: "arl-ed-riga" });
    rigaPreset.createSpan({ text: "Parti da", cls: "arl-ed-etichetta" });
    const rigaSoglie = sezStelle.createDiv({ cls: "arl-ed-riga" });
    rigaSoglie.createSpan({ text: "Fino a ARL", cls: "arl-ed-etichetta" });
    const anteprimaStelle = sezStelle.createDiv({ cls: "arl-anteprima" });
    const avvisoSoglie = sezStelle.createDiv({ cls: "arl-meta" });
    const inputSoglie = [];
    const ultimaStella = rigaSoglie.createSpan({ cls: "arl-info" });
    const aggiornaAnteprimaStelle = () => {
      anteprimaStelle.empty();
      const err = soglieValide(b.soglie);
      avvisoSoglie.setText(err != null ? err : "");
      const q = b.soglie[3];
      ultimaStella.setText(
        Number.isFinite(q) && q < 10 ? `\u2605\u2605\u2605\u2605\u2605 da ${fmt(Math.round((q + 0.1) * 10) / 10)} a 10` : "\u2605\u2605\u2605\u2605\u2605 da \u2026 a 10"
      );
      if (err) return;
      anteprimaStelle.createDiv({
        cls: "arl-etichetta",
        text: `Con ${plurale(this.plugin.settings.stelleTotali, "stella", "stelle")}`
      });
      const sg = soglie(this.plugin.settings.stelleTotali, b.soglie);
      sg.forEach((max, k) => {
        const min = k === 0 ? 0 : sg[k - 1] + 0.1;
        const riga = anteprimaStelle.createDiv({ cls: "arl-anteprima-riga" });
        riga.createSpan({ text: "\u2605".repeat(k + 1), cls: "arl-stelle" });
        riga.createSpan({ text: `${fmt(min)} \u2013 ${fmt(max)}` });
      });
    };
    const disegnaSoglie = () => {
      inputSoglie.forEach((inp, i) => inp.value = String(b.soglie[i]));
      aggiornaAnteprimaStelle();
      aggiornaLivello();
    };
    for (const p of PRESET_SOGLIE) {
      rigaPreset.createEl("button", { text: p.nome }).onclick = () => {
        b.soglie = [...p.valori];
        this.modificato = true;
        disegnaSoglie();
      };
    }
    b.soglie.forEach((v, i) => {
      rigaSoglie.createSpan({ text: "\u2605".repeat(i + 1), cls: "arl-stelle" });
      const inp = rigaSoglie.createEl("input", { type: "number", cls: "arl-ed-peso" });
      inp.step = "0.1";
      inp.min = "0";
      inp.max = "9.9";
      inp.value = String(v);
      inp.addEventListener("input", () => {
        const n = parseFloat(inp.value.replace(",", "."));
        b.soglie[i] = Number.isFinite(n) ? n : NaN;
        this.modificato = true;
        aggiornaAnteprimaStelle();
        aggiornaLivello();
      });
      inputSoglie.push(inp);
    });
    rigaSoglie.appendChild(ultimaStella);
    aggiornaAnteprimaStelle();
    const sezColori = c.createDiv({ cls: "arl-ed-sezione" });
    sezColori.createEl("h3", { text: "Colori delle fasce di voto" });
    sezColori.createDiv({
      cls: "arl-meta",
      text: "Le barre dei temi, il punteggio ARL e la lista prendono il colore della fascia in cui cade il voto. Le fasce sono delimitate dalle soglie delle stelle."
    });
    const righeFasce = [];
    const nomiFasce = ["Molto basso", "Basso", "Medio", "Buono", "Eccellente"];
    const rigaProva = sezColori.createDiv({ cls: "arl-ed-riga" });
    rigaProva.createSpan({ text: "Prova con voto", cls: "arl-ed-etichetta" });
    const slider = rigaProva.createEl("input", { type: "range" });
    slider.min = "0";
    slider.max = "10";
    slider.step = "0.1";
    slider.value = "6";
    const valProva = rigaProva.createSpan({ cls: "arl-info" });
    const barraProva = sezColori.createDiv({ cls: "arl-progress arl-progress-lettura" });
    const riempProva = barraProva.createDiv({ cls: "arl-progress-fill" });
    const aggiornaFasce = () => {
      const ok = soglieValide(b.soglie) === null;
      const e = ok ? estremiFasce(b.soglie) : estremiFasce(SOGLIE_STANDARD);
      righeFasce.forEach((r, i) => {
        const t = r.querySelector(".arl-fascia-range");
        if (t) t.setText(`${fmt(e[i])} \u2013 ${fmt(e[i + 1])}`);
      });
      const v = parseFloat(slider.value);
      const col = coloriValidi(b.colori);
      valProva.setText(fmt(v));
      riempProva.style.width = `${v * 10}%`;
      riempProva.style.background = sfondoVoto(v, e.slice(1, 5), col, this.plugin.settings.votoSfumato);
    };
    slider.addEventListener("input", aggiornaFasce);
    const inputColori = [];
    b.colori = coloriValidi(b.colori);
    nomiFasce.forEach((nome, i) => {
      const r = sezColori.createDiv({ cls: "arl-ed-riga" });
      righeFasce.push(r);
      r.createSpan({ text: nome, cls: "arl-ed-etichetta" });
      r.createSpan({ cls: "arl-fascia-range" });
      const inp = r.createEl("input", { type: "color" });
      inp.value = b.colori[i];
      inp.addEventListener("input", () => {
        b.colori[i] = inp.value;
        this.modificato = true;
        aggiornaFasce();
      });
      inputColori.push(inp);
    });
    const rigaReset = sezColori.createDiv({ cls: "arl-ed-riga" });
    rigaReset.createEl("button", { text: "Ripristina colori predefiniti" }).onclick = () => {
      b.colori = [...COLORI_FASCE];
      inputColori.forEach((inp, i) => inp.value = b.colori[i]);
      this.modificato = true;
      aggiornaFasce();
    };
    inputSoglie.forEach((inp) => inp.addEventListener("input", aggiornaFasce));
    rigaPreset.querySelectorAll("button").forEach((bt) => bt.addEventListener("click", aggiornaFasce));
    aggiornaFasce();
    const sezTemi = c.createDiv({ cls: "arl-ed-sezione" });
    const testaTemi = sezTemi.createDiv({ cls: "arl-ed-testa" });
    testaTemi.createSpan({ text: "Temi", cls: "arl-etichetta" });
    testaTemi.createSpan({ text: "Peso %", cls: "arl-etichetta" });
    b.categorie.forEach((cat2, i) => {
      const riga = sezTemi.createDiv({ cls: "arl-ed-riga" });
      riga.toggleClass("is-selected", i === this.sel);
      riga.createSpan({ text: `${i + 1}.`, cls: "arl-ed-num" });
      const nome = riga.createEl("input", { type: "text" });
      nome.value = cat2.nome;
      nome.addEventListener("input", () => {
        cat2.nome = nome.value;
        this.modificato = true;
      });
      const peso = riga.createEl("input", { type: "number", cls: "arl-ed-peso" });
      peso.min = "0";
      peso.value = String(cat2.peso);
      peso.addEventListener("input", () => {
        const n = parseFloat(peso.value.replace(",", "."));
        cat2.peso = Number.isFinite(n) && n >= 0 ? n : 0;
        this.modificato = true;
        aggiornaTotale();
        aggiornaLivello();
      });
      const sel = riga.createEl("button", {
        text: `Domande (${cat2.domande.length})`,
        cls: i === this.sel ? "mod-cta" : ""
      });
      sel.onclick = () => {
        this.sel = i;
        this.render();
      };
      this.pulsantiOrdine(riga, b.categorie, i, (nuovoIndice) => {
        if (this.sel === i) this.sel = nuovoIndice;
        else if (this.sel === nuovoIndice) this.sel = i;
      });
      const elimina = riga.createEl("button", { text: "\xD7", cls: "arl-ed-btn" });
      elimina.setAttr("aria-label", "Elimina tema");
      let confermato = false;
      elimina.onclick = () => {
        if (b.categorie.length === 1) {
          new NoticeT("Serve almeno un tema.");
          return;
        }
        if (!confermato) {
          confermato = true;
          elimina.setText("Sicuro?");
          elimina.addClass("mod-warning");
          return;
        }
        b.categorie.splice(i, 1);
        this.sel = Math.min(this.sel, b.categorie.length - 1);
        this.modificato = true;
        this.render();
      };
    });
    const piedeTemi = sezTemi.createDiv({ cls: "arl-ed-testa" });
    const aggiungiTema = piedeTemi.createEl("button", { text: "+ Aggiungi tema" });
    aggiungiTema.onclick = () => {
      b.categorie.push({
        id: "",
        nome: `Tema ${b.categorie.length + 1}`,
        descr: "",
        peso: 20,
        domande: [""]
      });
      this.sel = b.categorie.length - 1;
      this.modificato = true;
      this.render();
    };
    const totale = piedeTemi.createSpan({ cls: "arl-info" });
    const aggiornaTotale = () => {
      const somma = b.categorie.reduce((a, x) => a + x.peso, 0);
      totale.setText(
        somma === 100 ? "Totale pesi: 100%" : `Totale pesi: ${Math.round(somma * 10) / 10}% (vengono riportati a 100)`
      );
    };
    aggiornaTotale();
    aggiornaLivello();
    const cat = b.categorie[this.sel];
    const sezDomande = c.createDiv({ cls: "arl-ed-sezione" });
    sezDomande.createEl("h3", { text: `Domande del tema \xAB${cat.nome}\xBB` });
    const descRiga = sezDomande.createDiv({ cls: "arl-ed-riga" });
    descRiga.createSpan({ text: "Descrizione", cls: "arl-ed-etichetta" });
    const desc = descRiga.createEl("input", { type: "text" });
    desc.placeholder = "Facoltativa, appare sopra le domande";
    desc.value = cat.descr;
    desc.addEventListener("input", () => {
      cat.descr = desc.value;
      this.modificato = true;
    });
    const inputs = [];
    cat.domande.forEach((dom, i) => {
      const riga = sezDomande.createDiv({ cls: "arl-ed-riga" });
      riga.createSpan({ text: `${i + 1}.`, cls: "arl-ed-num" });
      const input = riga.createEl("input", { type: "text" });
      input.value = dom;
      input.placeholder = "Domanda a cui si risponde S\xEC o No";
      input.addEventListener("input", () => {
        cat.domande[i] = input.value;
        this.modificato = true;
        aggiornaLivello();
      });
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          cat.domande.splice(i + 1, 0, "");
          this.focusDomanda = i + 1;
          this.modificato = true;
          this.render();
        }
      });
      inputs.push(input);
      this.pulsantiOrdine(riga, cat.domande, i, () => void 0);
      const elimina = riga.createEl("button", { text: "\xD7", cls: "arl-ed-btn" });
      elimina.setAttr("aria-label", "Elimina domanda");
      elimina.onclick = () => {
        if (cat.domande.length === 1) {
          new NoticeT("Serve almeno una domanda per tema.");
          return;
        }
        cat.domande.splice(i, 1);
        this.modificato = true;
        this.render();
      };
    });
    const piedeDomande = sezDomande.createDiv({ cls: "arl-ed-testa" });
    piedeDomande.createEl("button", { text: "+ Aggiungi domanda" }).onclick = () => {
      cat.domande.push("");
      this.focusDomanda = cat.domande.length - 1;
      this.modificato = true;
      this.render();
    };
    piedeDomande.createSpan({
      cls: "arl-info",
      text: `${plurale(cat.domande.length, "domanda", "domande")} \xB7 punteggio del tema da 0 a 10`
    });
    const footer = c.createDiv({ cls: "arl-footer" });
    footer.createDiv({ cls: "arl-info" });
    const azioni = footer.createDiv({ cls: "arl-azioni" });
    azioni.createEl("button", { text: "Annulla" }).onclick = () => this.main.vai("set");
    const salva = azioni.createEl("button", { text: "Salva", cls: "mod-cta" });
    salva.onclick = async () => {
      const errore = this.valida();
      if (errore) {
        new NoticeT(errore);
        return;
      }
      salva.disabled = true;
      try {
        await this.plugin.salvaSet(this.pulita(), this.file, this.nomeOriginale);
        this.modificato = false;
        new NoticeT("Set salvato.");
        void this.main.mostraSet();
      } catch (e) {
        new NoticeT(`Salvataggio non riuscito: ${e.message}`);
        salva.disabled = false;
      }
    };
    this.host.scrollTop = scroll;
    if (this.focusDomanda !== null) {
      (_a = inputs[this.focusDomanda]) == null ? void 0 : _a.focus();
      this.focusDomanda = null;
    }
  }
  /** Aggiunge i pulsanti ↑ ↓ a una riga di una lista modificabile. */
  pulsantiOrdine(riga, lista, i, dopoSpostamento) {
    const sposta = (da, a) => {
      if (a < 0 || a >= lista.length) return;
      const [x] = lista.splice(da, 1);
      lista.splice(a, 0, x);
      dopoSpostamento(a);
      this.modificato = true;
      this.render();
    };
    const su = riga.createEl("button", { text: "\u2191", cls: "arl-ed-btn" });
    su.setAttr("aria-label", "Sposta su");
    su.disabled = i === 0;
    su.onclick = () => sposta(i, i - 1);
    const giu = riga.createEl("button", { text: "\u2193", cls: "arl-ed-btn" });
    giu.setAttr("aria-label", "Sposta gi\xF9");
    giu.disabled = i === lista.length - 1;
    giu.onclick = () => sposta(i, i + 1);
  }
  valida() {
    const b = this.bozza;
    if (!b.nome.trim()) return "Scrivi il nome del set.";
    const errSoglie = soglieValide(b.soglie);
    if (errSoglie) return errSoglie;
    const altro = this.plugin.sets.find(
      (s) => {
        var _a;
        return s.nome.toLowerCase() === b.nome.trim().toLowerCase() && s.nome.toLowerCase() !== ((_a = this.nomeOriginale) != null ? _a : "").toLowerCase();
      }
    );
    if (altro) return `Esiste gi\xE0 un set chiamato \xAB${altro.nome}\xBB.`;
    const nomi = /* @__PURE__ */ new Set();
    for (const c of b.categorie) {
      const n = c.nome.trim().toLowerCase();
      if (!n) return "Ogni tema deve avere un nome.";
      if (nomi.has(n)) return `Il tema \xAB${c.nome.trim()}\xBB \xE8 ripetuto.`;
      nomi.add(n);
      if (c.domande.every((d) => !d.trim())) return `Il tema \xAB${c.nome.trim()}\xBB non ha domande.`;
    }
    if (b.categorie.every((c) => c.peso === 0)) return "Almeno un tema deve avere un peso maggiore di zero.";
    return null;
  }
  /** Copia ripulita (spazi, domande vuote, id assegnati) pronta per essere salvata. */
  pulita() {
    const usati = new Set(this.bozza.categorie.map((c) => c.id).filter(Boolean));
    return {
      nome: this.bozza.nome.trim(),
      soglie: this.bozza.soglie.map((x) => Math.round(x * 10) / 10),
      colori: coloriValidi(this.bozza.colori),
      categorie: this.bozza.categorie.map((c) => {
        const id = c.id || idUnico(c.nome, usati);
        usati.add(id);
        return {
          id,
          nome: c.nome.trim(),
          descr: c.descr.trim(),
          peso: c.peso,
          domande: c.domande.map((d) => d.trim()).filter(Boolean)
        };
      })
    };
  }
};
var CACHE_SFONDO = { chiave: "", url: "" };
var LEGNO = "repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 2px, rgba(0,0,0,0) 2px 9px), linear-gradient(180deg, #c8a06b, #b58650)";
function hashTesto(t) {
  let h = 0;
  for (let i = 0; i < t.length; i++) h = h * 31 + t.charCodeAt(i) >>> 0;
  return h;
}
function hslHex(h, sat, lum) {
  const a = sat * Math.min(lum, 1 - lum);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = lum - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function coloreGenere(st, genere) {
  var _a;
  const g = genere.trim().toLowerCase();
  if (!g) return "#8a8f98";
  return (_a = st.vlGeneri[g]) != null ? _a : hslHex(hashTesto(g) % 360, 0.5, 0.4);
}
function testoSu(sfondo) {
  return contrasto(sfondo, "#ffffff") >= contrasto(sfondo, "#1b1b1b") ? "#ffffff" : "#1b1b1b";
}
function adattaTutti(testi, cache) {
  if (testi.length === 0) return;
  const MAX = 18;
  const MIN = 4;
  const chiavi = testi.map((t) => {
    var _a;
    return `${(_a = t.dataset.k) != null ? _a : ""}|${t.clientWidth}x${t.clientHeight}`;
  });
  const da = [];
  testi.forEach((t, i) => {
    const noto = cache.get(chiavi[i]);
    if (noto !== void 0) t.style.fontSize = `${noto}px`;
    else da.push(i);
  });
  if (da.length === 0) return;
  const entra = (t) => t.scrollWidth <= t.clientWidth + 1 && t.scrollHeight <= t.clientHeight + 1;
  const lo = /* @__PURE__ */ new Map();
  const hi = /* @__PURE__ */ new Map();
  for (const i of da) testi[i].style.fontSize = `${MAX}px`;
  let aperti = [];
  for (const i of da) {
    if (entra(testi[i])) cache.set(chiavi[i], MAX);
    else {
      lo.set(i, MIN);
      hi.set(i, MAX);
      aperti.push(i);
    }
  }
  while (aperti.length > 0) {
    for (const i of aperti) testi[i].style.fontSize = `${(lo.get(i) + hi.get(i)) / 2}px`;
    const ancora = [];
    for (const i of aperti) {
      const mid = (lo.get(i) + hi.get(i)) / 2;
      if (entra(testi[i])) lo.set(i, mid);
      else hi.set(i, mid);
      if (hi.get(i) - lo.get(i) > 0.4) ancora.push(i);
    }
    aperti = ancora;
  }
  for (const i of lo.keys()) {
    const v = lo.get(i);
    testi[i].style.fontSize = `${v}px`;
    cache.set(chiavi[i], v);
  }
}
var NomeModal = class extends import_obsidian.Modal {
  constructor(app, titolo, iniziale, esiste, ok) {
    super(app);
    this.titolo = titolo;
    this.iniziale = iniziale;
    this.esiste = esiste;
    this.ok = ok;
  }
  onOpen() {
    const c = this.contentEl;
    collegaTraduzione(c);
    c.createEl("h3", { text: this.titolo });
    const inp = c.createEl("input", { type: "text", cls: "arl-nome-input" });
    inp.value = this.iniziale;
    inp.placeholder = "Nome della disposizione";
    const msg = c.createDiv({ cls: "arl-meta arl-nome-msg" });
    const azioni = c.createDiv({ cls: "arl-nome-azioni" });
    const ok = azioni.createEl("button", { text: "Salva", cls: "mod-cta" });
    const no = azioni.createEl("button", { text: "Annulla" });
    const conferma = () => {
      const n = inp.value.trim().replace(/\s+/g, " ");
      if (!n) {
        msg.setText("Scrivi un nome.");
        return;
      }
      if (this.esiste(n)) {
        msg.setText("Esiste gi\xE0 una disposizione con questo nome.");
        return;
      }
      this.close();
      void this.ok(n);
    };
    ok.onclick = conferma;
    no.onclick = () => this.close();
    inp.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") conferma();
    });
    window.setTimeout(() => {
      inp.focus();
      inp.select();
    }, 0);
  }
  onClose() {
    scollegaTraduzione(this.contentEl);
    this.contentEl.empty();
  }
};
var GuidaSetModal = class extends import_obsidian.Modal {
  constructor(app, lingua) {
    super(app);
    this.lingua = lingua;
  }
  onOpen() {
    this.modalEl.addClass("arl-guida");
    const c = this.contentEl;
    c.empty();
    const it = this.lingua !== "en";
    const T = (a, b) => it ? a : b;
    c.createEl("h2", { text: T("Guida ai set di valutazione", "Guide to evaluation sets") });
    const sez = (titolo, righe) => {
      c.createEl("h4", { text: titolo });
      for (const r of righe) c.createEl("p", { text: r });
    };
    sez(T("1. Cos'\xE8 un set", "1. What a set is"), [
      T(
        "Un set \xE8 il questionario con cui valuti un libro. \xC8 diviso in temi (per esempio Trama, Personaggi, Stile); ogni tema ha domande a cui rispondi S\xEC o No.",
        "A set is the questionnaire you rate a book with. It is divided into themes (for example Plot, Characters, Style); each theme has questions you answer Yes or No."
      ),
      T(
        "I S\xEC danno il punteggio del tema (0\u201310); la media dei temi, secondo i pesi, \xE8 il punteggio ARL (0\u201310) da cui derivano le stelle.",
        "The Yes answers give the theme score (0\u201310); the weighted average of the themes is the ARL score (0\u201310), from which the stars derive."
      )
    ]);
    sez(T("2. Come crearne uno", "2. How to create one"), [
      T(
        "Nella schermata \xABSet di valutazione\xBB premi \xAB+ Nuovo set\xBB, oppure \xABDuplica\xBB su un set esistente e modificalo: \xE8 il modo pi\xF9 rapido.",
        "On the \xABEvaluation sets\xBB screen press \xAB+ New set\xBB, or \xABDuplicate\xBB an existing set and edit it: this is the quickest way."
      ),
      T(
        "Romanzi e Saggi sono gi\xE0 pronti: puoi usarli cos\xEC o prenderli come esempio. \xABRipristina\xBB li riporta all'originale.",
        "Novels and Essays are ready-made: use them as they are or as a model. \xABRestore\xBB brings them back to the original."
      )
    ]);
    sez(T("3. Come si compone", "3. What it is made of"), [
      T(
        "Temi: dai a ciascuno un nome, una breve descrizione e un peso (quanto conta nella media).",
        "Themes: give each one a name, a short description and a weight (how much it counts in the average)."
      ),
      T(
        "Domande: formulale in modo che \xABS\xEC\xBB sia sempre la risposta positiva (per esempio \xABLa trama \xE8 priva di buchi logici?\xBB).",
        "Questions: word them so that \xABYes\xBB is always the positive answer (for example \xABIs the plot free of logical holes?\xBB)."
      ),
      T(
        "Soglie: i quattro punteggi ARL oltre i quali scattano 2, 3, 4 e 5 stelle. Colori delle fasce: i colori del punteggio.",
        "Thresholds: the four ARL scores above which 2, 3, 4 and 5 stars are earned. Band colours: the colours of the score."
      )
    ]);
    sez(T("4. Il livello di difficolt\xE0", "4. The difficulty level"), [
      T(
        "Il plugin calcola quanto \xE8 raro ottenere le stelle rispondendo a caso: Facile, Accessibile, Impegnativo, Difficile, Molto difficile. Dipende da domande, pesi e soglie.",
        "The plugin works out how rare it is to earn stars by answering at random: Easy, Accessible, Demanding, Hard, Very hard. It depends on questions, weights and thresholds."
      )
    ]);
    sez(T("5. Consigli", "5. Tips"), [
      T(
        "Usa lo stesso numero di domande per ogni tema (per esempio 5 temi da 10 domande): i punteggi restano confrontabili.",
        "Use the same number of questions for every theme (for example 5 themes of 10 questions): scores stay comparable."
      ),
      T(
        "Non cambiare un set gi\xE0 usato se vuoi confrontare i libri: duplicalo e modifica la copia.",
        "Do not change a set you have already used if you want to compare books: duplicate it and edit the copy."
      )
    ]);
    sez(T("6. Il file del set", "6. The set file"), [
      T(
        "Ogni set \xE8 una nota Markdown nella cartella dei set (impostabile nelle opzioni): la modifichi anche a mano. Un tema \xE8 un titolo \xAB## Nome\xBB, le domande sono un elenco numerato sotto di esso.",
        "Each set is a Markdown note in the sets folder (configurable in the settings): you can edit it by hand too. A theme is a \xAB## Name\xBB heading, the questions are a numbered list under it."
      )
    ]);
    const az = c.createDiv({ cls: "arl-nome-azioni" });
    const ok = az.createEl("button", { text: T("Chiudi", "Close"), cls: "mod-cta" });
    ok.onclick = () => this.close();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var SiNoModal = class extends import_obsidian.Modal {
  constructor(app, domanda, si) {
    super(app);
    this.domanda = domanda;
    this.si = si;
  }
  onOpen() {
    const c = this.contentEl;
    collegaTraduzione(c);
    c.createEl("h3", { text: "Conferma eliminazione" });
    c.createDiv({ text: this.domanda });
    const azioni = c.createDiv({ cls: "arl-nome-azioni" });
    const ok = azioni.createEl("button", { text: "Elimina", cls: "mod-warning" });
    const no = azioni.createEl("button", { text: "Annulla" });
    ok.onclick = () => {
      this.close();
      void this.si();
    };
    no.onclick = () => this.close();
  }
  onClose() {
    scollegaTraduzione(this.contentEl);
    this.contentEl.empty();
  }
};
var LibreriaVirtualeView = class {
  constructor(plugin, host, main) {
    this.plugin = plugin;
    this.host = host;
    this.main = main;
    this.ord = [];
    this.libri = [];
    this.barraDisp = null;
    this.trascinato = -1;
    this.dest = -1;
    this.ultimaLarghezza = 0;
    this.sopra = null;
    // dorso sotto il puntatore
    this.marcato = null;
    // elemento con il segno di inserimento
    this.inTrascinamento = null;
    this.cacheFont = /* @__PURE__ */ new Map();
    this.tipW = 0;
    this.tipH = 0;
    this.puntatore = { x: 0, y: 0 };
    this.rafTip = 0;
  }
  inCorso() {
    return false;
  }
  avvia() {
    this.host.empty();
    this.host.scrollTop = 0;
    const c = this.host.createDiv({ cls: "arl-vl-pagina" });
    c.createEl("h2", { text: "Libreria virtuale" });
    c.createDiv({
      cls: "arl-meta",
      text: "Trascina i libri per cambiarne la posizione. Clic su un libro per aprirlo."
    });
    const barra = c.createDiv({ cls: "arl-vl-barra" });
    this.barraDisp = barra.createDiv({ cls: "arl-vl-disp" });
    const gruppi = [
      ["Codice", "codice", "dal pi\xF9 alto al pi\xF9 basso", "dal pi\xF9 basso al pi\xF9 alto"],
      ["Lettura", "lettura", "dalla pi\xF9 recente alla pi\xF9 vecchia", "dalla pi\xF9 vecchia alla pi\xF9 recente"],
      ["Pagine", "pagine", "dal libro con pi\xF9 pagine a quello con meno", "dal libro con meno pagine a quello con pi\xF9"]
    ];
    for (const [nome, chiave, giu, su] of gruppi) {
      const g = barra.createDiv({ cls: "arl-vl-gruppo" });
      g.createSpan({ cls: "arl-vl-etichetta", text: `${nome}:` });
      for (const [dir, freccia, spiega] of [
        ["desc", "\u2193", giu],
        ["asc", "\u2191", su]
      ]) {
        const b = g.createEl("button", { text: freccia, cls: "arl-vl-ordina" });
        b.dataset.criterio = `${chiave}-${dir}`;
        b.setAttr("aria-label", `${nome}: ${spiega}`);
        b.setAttr("title", `${nome}: ${spiega}`);
        b.onclick = () => void this.applicaCriterio(`${chiave}-${dir}`);
      }
    }
    const parete = c.createDiv({ cls: "arl-vl-parete" });
    this.disegnaParete(parete);
    this.scaffale = parete.createDiv({ cls: "arl-vl" });
    this.tip = c.createDiv({ cls: "arl-vl-tip" });
    this.collegaEventi();
    this.libri = this.plugin.tuttiILibri();
    this.ord = this.ordina(this.libri);
    this.disegna();
    this.evidenziaCriterio();
    if (typeof ResizeObserver !== "undefined") {
      let t = 0;
      const ro = new ResizeObserver(() => {
        if (!this.scaffale.isConnected) {
          ro.disconnect();
          window.clearTimeout(t);
          return;
        }
        if (this.scaffale.clientWidth === this.ultimaLarghezza) return;
        window.clearTimeout(t);
        t = window.setTimeout(() => this.dimensiona(), 120);
      });
      ro.observe(this.scaffale);
    }
  }
  /** Immagine dietro la libreria: sta nella parete intorno allo scaffale. */
  disegnaParete(parete) {
    const st = this.plugin.settings;
    const f = st.vlImmagine ? this.plugin.app.vault.getAbstractFileByPath(st.vlImmagine) : null;
    if (!(f instanceof import_obsidian.TFile)) return;
    parete.addClass("ha-immagine");
    const img = parete.createDiv({ cls: "arl-vl-sfondo" });
    const vel = parete.createDiv({ cls: "arl-vl-velo" });
    vel.style.background = `rgba(0, 0, 0, ${st.vlImgOscura / 100})`;
    const modo = st.vlImgModo;
    const sf = st.vlImgSfoca;
    const mostra = (url, sfocaCss) => {
      if (!img.isConnected) return;
      img.style.backgroundImage = `url("${url}")`;
      img.style.backgroundSize = modo === "repeat" ? "auto" : modo;
      img.style.backgroundRepeat = modo === "repeat" ? "repeat" : "no-repeat";
      img.style.filter = sfocaCss > 0 ? `blur(${sfocaCss}px)` : "";
      img.style.inset = sfocaCss > 0 ? `-${sfocaCss * 2}px` : "0";
      img.addClass("is-pronto");
    };
    const originale = () => mostra(this.plugin.urlImmagine(f), sf);
    if (modo === "repeat") {
      originale();
      return;
    }
    void this.sfondoLeggero(f, modo, sf, parete.clientWidth).then((url) => mostra(url, 0)).catch(originale);
  }
  async sfondoLeggero(f, modo, sfoca, larghVista) {
    const chiave = `${f.path}|${f.stat.mtime}|${f.stat.size}|${modo}|${sfoca}`;
    if (CACHE_SFONDO.chiave === chiave) return CACHE_SFONDO.url;
    const dati = await this.plugin.app.vault.readBinary(f);
    const bmp = await createImageBitmap(new Blob([dati]));
    try {
      const MAXLATO = 1600;
      const scala = Math.min(1, MAXLATO / Math.max(bmp.width, bmp.height));
      if (scala === 1 && sfoca === 0) return this.plugin.urlImmagine(f);
      const cw = Math.max(1, Math.round(bmp.width * scala));
      const ch = Math.max(1, Math.round(bmp.height * scala));
      const cv = createEl("canvas");
      cv.width = cw;
      cv.height = ch;
      const ctx = cv.getContext("2d");
      if (!ctx || sfoca > 0 && !("filter" in ctx)) throw new Error("canvas non adatto");
      const raggio = sfoca * cw / Math.max(400, larghVista || 1200);
      const m = Math.ceil(raggio * 2);
      if (raggio > 0) ctx.filter = `blur(${raggio}px)`;
      ctx.drawImage(bmp, -m, -m, cw + 2 * m, ch + 2 * m);
      const blob = await new Promise((ok) => cv.toBlob(ok, "image/jpeg", 0.85));
      if (!blob) throw new Error("immagine non creata");
      if (CACHE_SFONDO.url.startsWith("blob:")) URL.revokeObjectURL(CACHE_SFONDO.url);
      CACHE_SFONDO.chiave = chiave;
      CACHE_SFONDO.url = URL.createObjectURL(blob);
      return CACHE_SFONDO.url;
    } finally {
      bmp.close();
    }
  }
  criterioAttivo() {
    const st = this.plugin.settings;
    return st.vlCriterio || (st.vlOrdine.length === 0 ? "codice-desc" : "");
  }
  disposizione() {
    const st = this.plugin.settings;
    return st.vlDisposizioni.find((d) => d.nome === st.vlCorrente);
  }
  percorsiAttuali() {
    return this.ord.map((l) => l.file.path);
  }
  /** La disposizione caricata è stata cambiata (a mano o con i tasti) senza salvare. */
  modificata() {
    const d = this.disposizione();
    if (!d) return false;
    const salvata = this.ordina(this.libri, d.ordine).map((l) => l.file.path);
    const attuale = this.percorsiAttuali();
    return salvata.length !== attuale.length || salvata.some((p, i) => p !== attuale[i]);
  }
  async carica(nome) {
    const st = this.plugin.settings;
    if (nome === "") {
      st.vlCorrente = "";
    } else {
      const d = st.vlDisposizioni.find((x) => x.nome === nome);
      if (!d) return;
      this.ord = this.ordina(this.libri, d.ordine);
      st.vlOrdine = this.percorsiAttuali();
      st.vlCorrente = d.nome;
      st.vlCriterio = "";
    }
    this.disegna();
    this.evidenziaCriterio();
    await this.plugin.salvaImpostazioni();
  }
  async salvaCorrente() {
    const d = this.disposizione();
    if (!d) return;
    d.ordine = this.percorsiAttuali();
    await this.plugin.salvaImpostazioni();
    this.evidenziaCriterio();
  }
  nomeEsiste(nome, tranne = "") {
    const n = nome.trim().toLowerCase();
    return this.plugin.settings.vlDisposizioni.some((d) => d.nome.toLowerCase() === n && d.nome !== tranne);
  }
  salvaCome() {
    new NomeModal(this.plugin.app, "Salva la disposizione come", "", (nome) => this.nomeEsiste(nome), async (nome) => {
      const st = this.plugin.settings;
      st.vlDisposizioni.push({ nome, ordine: this.percorsiAttuali() });
      st.vlCorrente = nome;
      st.vlOrdine = this.percorsiAttuali();
      await this.plugin.salvaImpostazioni();
      this.evidenziaCriterio();
    }).open();
  }
  altreAzioni(ev) {
    const d = this.disposizione();
    if (!d) return;
    const st = this.plugin.settings;
    const m = new import_obsidian.Menu();
    m.addItem(
      (i) => i.setTitle(tr("Rinomina")).setIcon("pencil").onClick(
        () => new NomeModal(this.plugin.app, "Rinomina la disposizione", d.nome, (n) => this.nomeEsiste(n, d.nome), async (nome) => {
          st.vlCorrente = nome;
          d.nome = nome;
          await this.plugin.salvaImpostazioni();
          this.evidenziaCriterio();
        }).open()
      )
    );
    m.addItem(
      (i) => i.setTitle(tr("Duplica")).setIcon("copy").onClick(
        () => new NomeModal(this.plugin.app, "Duplica la disposizione", `${d.nome} (copia)`, (n) => this.nomeEsiste(n), async (nome) => {
          st.vlDisposizioni.push({ nome, ordine: [...d.ordine] });
          await this.carica(nome);
        }).open()
      )
    );
    m.addItem(
      (i) => i.setTitle(tr("Elimina")).setIcon("trash").onClick(
        () => new SiNoModal(this.plugin.app, `Eliminare la disposizione \xAB${d.nome}\xBB? I libri restano come sono ora.`, async () => {
          st.vlDisposizioni = st.vlDisposizioni.filter((x) => x !== d);
          st.vlCorrente = "";
          await this.plugin.salvaImpostazioni();
          this.evidenziaCriterio();
        }).open()
      )
    );
    m.showAtMouseEvent(ev);
  }
  disegnaDisposizioni() {
    const b = this.barraDisp;
    if (!b) return;
    const st = this.plugin.settings;
    b.empty();
    b.createSpan({ cls: "arl-vl-etichetta", text: "Disposizione:" });
    const sel = b.createEl("select", { cls: "dropdown" });
    for (const d of st.vlDisposizioni) sel.createEl("option", { text: d.nome, attr: { value: d.nome } });
    sel.createEl("option", { text: "Ordine libero (non salvato)", attr: { value: "" } });
    sel.value = this.disposizione() ? st.vlCorrente : "";
    sel.onchange = () => void this.carica(sel.value);
    const mod = this.modificata();
    if (mod) b.createSpan({ cls: "arl-vl-modificata", text: "\u25CF modificata" });
    const salva = b.createEl("button", { text: "Salva" });
    salva.disabled = !!this.disposizione() && !mod;
    salva.onclick = () => {
      if (this.disposizione()) void this.salvaCorrente();
      else this.salvaCome();
    };
    b.createEl("button", { text: "Salva come\u2026" }).onclick = () => this.salvaCome();
    if (mod) b.createEl("button", { text: "Ripristina" }).onclick = () => void this.carica(st.vlCorrente);
    const piu = b.createEl("button", { text: "\u22EF" });
    piu.setAttr("aria-label", "Altre azioni");
    piu.disabled = !this.disposizione();
    piu.onclick = (ev) => this.altreAzioni(ev);
  }
  evidenziaCriterio() {
    this.disegnaDisposizioni();
    const attivo = this.criterioAttivo();
    this.host.querySelectorAll(".arl-vl-ordina").forEach((b) => {
      b.toggleClass("is-active", b.dataset.criterio === attivo);
    });
  }
  /** Riordina tutti i libri con il criterio scelto e salva il risultato. */
  async applicaCriterio(criterio) {
    const [chiave, dir] = criterio.split("-");
    const segno = dir === "desc" ? -1 : 1;
    const valore = (l) => {
      if (chiave === "codice") return l.codice;
      if (chiave === "pagine") return l.pagine > 0 ? l.pagine : null;
      return l.fine || null;
    };
    this.ord.sort((a, b) => {
      var _a, _b;
      const va = valore(a);
      const vb = valore(b);
      if (va === null || vb === null) {
        if (va !== vb) return va === null ? 1 : -1;
      } else if (va !== vb) {
        return (va < vb ? -1 : 1) * segno;
      }
      return (a.codice === null ? 1 : 0) - (b.codice === null ? 1 : 0) || ((_a = b.codice) != null ? _a : 0) - ((_b = a.codice) != null ? _b : 0);
    });
    this.plugin.settings.vlOrdine = this.ord.map((l) => l.file.path);
    this.plugin.settings.vlCriterio = criterio;
    this.disegna();
    this.evidenziaCriterio();
    await this.plugin.salvaImpostazioni();
  }
  /** Ordine scelto dall'utente; senza scelta, per codice dal più alto al più basso. */
  ordina(libri, lista = this.plugin.settings.vlOrdine) {
    const perPercorso = new Map(libri.map((l) => [l.file.path, l]));
    const visti = /* @__PURE__ */ new Set();
    const out = [];
    for (const p of lista) {
      const l = perPercorso.get(p);
      if (l && !visti.has(p)) {
        visti.add(p);
        out.push(l);
      }
    }
    const resto = libri.filter((l) => !visti.has(l.file.path)).sort(
      (a, b) => {
        var _a, _b;
        return (a.codice === null ? 1 : 0) - (b.codice === null ? 1 : 0) || ((_a = b.codice) != null ? _a : 0) - ((_b = a.codice) != null ? _b : 0) || a.titolo.localeCompare(b.titolo, "it");
      }
    );
    return resto.concat(out);
  }
  disegna() {
    const st = this.plugin.settings;
    const n = st.vlPerRipiano;
    const el = this.scaffale;
    this.nascondiTip();
    this.sopra = null;
    this.marcato = null;
    this.inTrascinamento = null;
    el.style.background = st.vlSfondo || LEGNO;
    el.style.maxWidth = st.vlAdatta ? "none" : `${st.vlLarghezza}px`;
    if (this.ord.length === 0) {
      el.empty();
      el.createDiv({ cls: "arl-vuoto", text: "Nessun libro in libreria. Usa \xABNuovo libro\xBB per aggiungere il primo." });
      return;
    }
    const nuovo = createDiv();
    const colori = /* @__PURE__ */ new Map();
    const ripiani = Math.ceil(this.ord.length / n);
    for (let r = 0; r < ripiani; r++) {
      const ripiano = nuovo.createDiv({ cls: "arl-vl-ripiano" });
      const riga = ripiano.createDiv({ cls: "arl-vl-riga" });
      const inizio = r * n;
      const fine = Math.min(this.ord.length, inizio + n);
      riga.dataset.fine = String(fine);
      for (let i = inizio; i < fine; i++) this.creaLibro(riga, this.ord[i], i, colori);
      if (fine - inizio < n) riga.createDiv({ cls: "arl-vl-vuoto" }).style.flexGrow = String((n - (fine - inizio)) * 2);
      ripiano.createDiv({ cls: "arl-vl-asse" });
    }
    el.replaceChildren(...Array.from(nuovo.childNodes));
    this.dimensiona();
  }
  /** Solo struttura e stile: gli eventi sono gestiti una volta sola dallo scaffale (collegaEventi). */
  creaLibro(riga, l, i, colori) {
    const st = this.plugin.settings;
    const chiaveGenere = l.genere.trim().toLowerCase();
    let c = colori.get(chiaveGenere);
    if (!c) {
      const bg = coloreGenere(st, l.genere);
      c = { bg, fg: testoSu(bg) };
      colori.set(chiaveGenere, c);
    }
    const b = riga.createDiv({ cls: "arl-vl-libro" });
    b.dataset.i = String(i);
    b.draggable = true;
    b.style.flexGrow = String(l.pagine > 0 ? 1 + Math.min(l.pagine, 1e3) / 400 : 1.8);
    b.style.height = `${82 + hashTesto(l.titolo) % 18}%`;
    b.style.background = c.bg;
    b.style.color = c.fg;
    const t = b.createDiv({ cls: "arl-vl-testo" });
    const autore = st.vlMostra === "titoloAutore" && l.autore ? l.autore : "";
    t.dataset.k = `${l.titolo}${autore}`;
    if (l.codice !== null) {
      b.createDiv({ cls: "arl-vl-codice", text: String(l.codice).padStart(2, "0") });
      t.addClass("ha-codice");
    }
    t.createDiv({ cls: "arl-vl-titolo", text: l.titolo });
    if (autore) t.createDiv({ cls: "arl-vl-autore", text: autore });
  }
  /** Un solo gruppo di ascoltatori per tutta la libreria, invece di cinque per ogni libro. */
  collegaEventi() {
    const el = this.scaffale;
    const libroDa = (t) => t instanceof Element ? t.closest(".arl-vl-libro") : null;
    const indiceDi = (b) => Number(b.dataset.i);
    el.addEventListener("mouseover", (ev) => {
      const b = libroDa(ev.target);
      if (b === this.sopra) return;
      this.sopra = b;
      if (!b || this.trascinato >= 0) this.nascondiTip();
      else this.mostraTip(this.ord[indiceDi(b)], ev.clientX, ev.clientY);
    });
    el.addEventListener("mousemove", (ev) => {
      if (this.sopra && this.trascinato < 0) this.posizionaTip(ev.clientX, ev.clientY);
    });
    el.addEventListener("mouseleave", () => {
      this.sopra = null;
      this.nascondiTip();
    });
    el.addEventListener("click", (ev) => {
      const b = libroDa(ev.target);
      if (b && this.ord[indiceDi(b)]) void this.main.mostraArchivio(this.ord[indiceDi(b)].file.path);
    });
    el.addEventListener("dragstart", (ev) => {
      const b = libroDa(ev.target);
      if (!b) return;
      this.trascinato = indiceDi(b);
      this.nascondiTip();
      if (ev.dataTransfer) {
        ev.dataTransfer.effectAllowed = "move";
        ev.dataTransfer.setData("text/plain", String(this.trascinato));
      }
      this.inTrascinamento = b;
      b.addClass("is-trascinato");
    });
    el.addEventListener("dragend", () => {
      var _a;
      (_a = this.inTrascinamento) == null ? void 0 : _a.removeClass("is-trascinato");
      this.inTrascinamento = null;
      this.pulisciSegni();
      this.trascinato = -1;
    });
    el.addEventListener("dragover", (ev) => {
      if (this.trascinato < 0) return;
      const b = libroDa(ev.target);
      let bersaglio;
      let cls;
      let dest;
      if (b) {
        const r = b.getBoundingClientRect();
        const dopo = ev.clientX > r.left + r.width / 2;
        bersaglio = b;
        cls = dopo ? "ins-dopo" : "ins-prima";
        dest = indiceDi(b) + (dopo ? 1 : 0);
      } else {
        const riga = ev.target instanceof Element ? ev.target.closest(".arl-vl-riga") : null;
        if (!riga) return;
        bersaglio = riga;
        cls = "is-dest";
        dest = Number(riga.dataset.fine);
      }
      ev.preventDefault();
      this.dest = dest;
      if (this.marcato === bersaglio && bersaglio.hasClass(cls)) return;
      this.pulisciSegni();
      bersaglio.addClass(cls);
      this.marcato = bersaglio;
    });
    el.addEventListener("drop", (ev) => {
      if (this.trascinato < 0) return;
      ev.preventDefault();
      void this.sposta(this.trascinato, this.dest);
    });
  }
  pulisciSegni() {
    if (!this.marcato) return;
    this.marcato.removeClasses(["ins-prima", "ins-dopo", "is-dest"]);
    this.marcato = null;
  }
  async sposta(da, dest) {
    this.trascinato = -1;
    if (da < 0 || dest < 0 || da >= this.ord.length) {
      this.disegna();
      return;
    }
    const [x] = this.ord.splice(da, 1);
    if (dest > da) dest--;
    this.ord.splice(Math.max(0, Math.min(dest, this.ord.length)), 0, x);
    this.plugin.settings.vlOrdine = this.ord.map((l) => l.file.path);
    this.plugin.settings.vlCriterio = "";
    this.disegna();
    this.evidenziaCriterio();
    await this.plugin.salvaImpostazioni();
  }
  nascondiTip() {
    this.tip.removeClass("is-visibile");
    if (this.rafTip) {
      window.cancelAnimationFrame(this.rafTip);
      this.rafTip = 0;
    }
  }
  /** Il contenuto cambia solo quando cambia il libro; muovere il mouse sposta soltanto la scheda. */
  mostraTip(l, x, y) {
    if (!l) return;
    const tip = this.tip;
    tip.empty();
    tip.createDiv({ cls: "arl-vl-tip-titolo", text: l.titolo });
    const sotto = [l.autore, l.genere].filter(Boolean).join(" \xB7 ");
    if (sotto) tip.createDiv({ cls: "arl-meta", text: sotto });
    if (l.valutato) {
      tip.createDiv({
        text: `ARL ${fmt(l.arl)}  ${stringaStelle(this.plugin.stelleDi(l.arl, l.set))}`
      });
    } else tip.createDiv({ cls: "arl-meta", text: "Da valutare" });
    tip.addClass("is-visibile");
    this.tipW = tip.offsetWidth;
    this.tipH = tip.offsetHeight;
    this.posizionaTip(x, y);
  }
  /** Al massimo un aggiornamento per fotogramma, con transform: nessun ricalcolo del layout. */
  posizionaTip(x, y) {
    this.puntatore.x = x;
    this.puntatore.y = y;
    if (this.rafTip) return;
    this.rafTip = window.requestAnimationFrame(() => {
      this.rafTip = 0;
      const { x: px, y: py } = this.puntatore;
      let tx = px + 14;
      let ty = py + 16;
      if (tx + this.tipW > window.innerWidth - 8) tx = px - this.tipW - 14;
      if (ty + this.tipH > window.innerHeight - 8) ty = py - this.tipH - 12;
      this.tip.style.transform = `translate(${Math.max(4, tx)}px, ${Math.max(4, ty)}px)`;
    });
  }
  /** Altezza dei ripiani in proporzione alla larghezza, poi adatta il carattere di ogni dorso. */
  dimensiona() {
    const el = this.scaffale;
    const w = el.clientWidth;
    this.ultimaLarghezza = w;
    const h = Math.max(150, Math.min(300, Math.round(w / this.plugin.settings.vlPerRipiano * 5)));
    el.style.setProperty("--arl-vl-h", `${h}px`);
    const codici = Array.from(el.querySelectorAll(".arl-vl-codice"));
    const larghezze = codici.map((c) => {
      var _a, _b;
      return (_b = (_a = c.parentElement) == null ? void 0 : _a.clientWidth) != null ? _b : 30;
    });
    codici.forEach((c, i) => {
      var _a, _b;
      c.style.fontSize = `${Math.max(7, Math.min(13, larghezze[i] / (((_b = (_a = c.textContent) == null ? void 0 : _a.length) != null ? _b : 2) * 0.62 + 0.8)))}px`;
    });
    adattaTutti(Array.from(el.querySelectorAll(".arl-vl-testo")), this.cacheFont);
  }
};
var MainView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.bottoni = /* @__PURE__ */ new Map();
    this.corrente = null;
    this.abbandono = false;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "Books and Reviews";
  }
  getIcon() {
    return "book-open";
  }
  /** Il focus resta nel plugin: Esc non deve passare a un'altra nota. */
  preparaFocus() {
    const el = this.contentEl;
    el.setAttr("tabindex", "-1");
    this.registerDomEvent(el, "keydown", (evt) => {
      if (evt.key !== "Escape") return;
      evt.stopPropagation();
      const attivo = el.ownerDocument.activeElement;
      if (attivo && attivo !== el && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(attivo.tagName)) {
        this.focusSchermata(true);
      }
    });
    this.registerDomEvent(
      el,
      "mousedown",
      () => {
        if (!el.contains(el.ownerDocument.activeElement)) this.focusSchermata();
      },
      { capture: true }
    );
    let inAttesa = false;
    const riprendi = () => {
      if (inAttesa) return;
      inAttesa = true;
      window.setTimeout(() => {
        inAttesa = false;
        const doc = el.ownerDocument;
        const foglia = el.closest(".workspace-leaf");
        if (!el.isConnected || !(foglia == null ? void 0 : foglia.classList.contains("mod-active"))) return;
        if (!doc.activeElement || doc.activeElement === doc.body) this.focusSchermata(true);
      }, 0);
    };
    this.registerDomEvent(el, "focusout", riprendi);
    const osservatore = new MutationObserver(riprendi);
    osservatore.observe(el, { childList: true, subtree: true });
    this.register(() => osservatore.disconnect());
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (leaf === this.leaf) this.focusSchermata();
      })
    );
  }
  focusSchermata(forza = false) {
    const el = this.contentEl;
    if (!forza && el.contains(el.ownerDocument.activeElement)) return;
    el.focus({ preventScroll: true });
  }
  async onOpen() {
    const c = this.contentEl;
    c.empty();
    c.addClass("arl-view");
    this.plugin.statoListe = {};
    collegaTraduzione(c);
    this.plugin.applicaLarghezza();
    this.preparaFocus();
    window.setTimeout(() => this.focusSchermata(), 0);
    const menu = c.createDiv({ cls: "arl-menubar" });
    const voci = [
      ["nuovo", "Nuovo libro"],
      ["libreria", "Libreria"],
      ["virtuale", "Libreria virtuale"],
      ["valuta", "Valuta libro"],
      ["set", "Set di valutazione"]
    ];
    for (const [id, testo] of voci) {
      const b = menu.createEl("button", { text: testo });
      b.onclick = () => this.vai(id);
      this.bottoni.set(id, b);
      if (id === "virtuale") {
        menu.createEl("button", { text: "Informazioni libreria" }).onclick = () => new InfoLibreriaModal(this.app, this.plugin).open();
      }
    }
    this.corpo = c.createDiv({ cls: "arl-corpo" });
    await this.mostraArchivio();
  }
  async onClose() {
    this.plugin.ripristinaBarre();
    scollegaTraduzione(this.contentEl);
    this.contentEl.empty();
  }
  evidenzia(s) {
    this.bottoni.forEach((b, id) => b.toggleClass("is-active", id === s));
  }
  /** Cambio sezione, con protezione se c'è un lavoro non salvato. */
  vai(dove) {
    var _a;
    if (((_a = this.corrente) == null ? void 0 : _a.inCorso()) && !this.abbandono) {
      new NoticeT("Lavoro in corso: premi di nuovo per abbandonarlo.");
      this.abbandono = true;
      window.setTimeout(() => this.abbandono = false, 4e3);
      return;
    }
    for (const k of ["libreria", "valuta"]) {
      const st = this.plugin.statoListe[k];
      if (st) st.ripristina = false;
    }
    if (dove === "nuovo") this.mostraNuovoLibro(null);
    else if (dove === "valuta") void this.mostraListaValutazione();
    else if (dove === "set") void this.mostraSet();
    else if (dove === "virtuale") this.mostraVirtuale();
    else void this.mostraArchivio();
  }
  async mostraArchivio(aperto) {
    this.abbandono = false;
    this.corrente = null;
    this.evidenzia("libreria");
    await this.plugin.caricaSet();
    new ArchiveView(this.app, this.plugin, this.corpo, this, aperto).avvia();
  }
  mostraVirtuale() {
    this.abbandono = false;
    this.corrente = null;
    this.evidenzia("virtuale");
    new LibreriaVirtualeView(this.plugin, this.corpo, this).avvia();
  }
  /** Form dei dati del libro: `libro` null = nuovo libro, altrimenti modifica. */
  mostraNuovoLibro(libro) {
    this.abbandono = false;
    this.corrente = null;
    this.evidenzia(libro ? "libreria" : "nuovo");
    const v = new BookFormView(
      this.plugin,
      this.corpo,
      libro,
      (f) => void this.mostraArchivio(f.path),
      () => void this.mostraArchivio(libro == null ? void 0 : libro.file.path)
    );
    this.corrente = v;
    v.avvia();
  }
  /** Elenco dei libri tra cui scegliere quello da valutare. */
  async mostraListaValutazione() {
    this.abbandono = false;
    this.corrente = null;
    this.evidenzia("valuta");
    await this.plugin.caricaSet();
    new ArchiveView(this.app, this.plugin, this.corpo, this, void 0, "valuta").avvia();
  }
  /** Valutazione (o aggiornamento) di un libro; `indietro` è l'azione del link nella scelta del set. */
  async mostraValutazione(libro, passo, indietro) {
    this.abbandono = false;
    this.corrente = null;
    this.evidenzia(libro.valutato && passo > 0 ? "libreria" : "valuta");
    await this.plugin.caricaSet();
    const v = new ReviewView(
      this.plugin,
      this.corpo,
      libro,
      passo,
      (f) => void this.mostraArchivio(f.path),
      indietro != null ? indietro : () => void this.mostraListaValutazione()
    );
    this.corrente = v;
    v.avvia();
  }
  async mostraSet() {
    this.abbandono = false;
    this.corrente = null;
    this.evidenzia("set");
    await this.plugin.caricaSet();
    new SetManagerView(this.app, this.plugin, this.corpo, this).avvia();
  }
  mostraEditorSet(bozza, file, nomeOriginale) {
    this.abbandono = false;
    this.evidenzia("set");
    const v = new SetEditorView(this.plugin, this.corpo, this, bozza, file, nomeOriginale);
    this.corrente = v;
    v.avvia();
  }
};
function conTooltip(sl) {
  return sl;
}
var ARLSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  /** Ridisegna le opzioni mantenendo la posizione di scorrimento. */
  display() {
    const el = this.contenitoreScorrevole();
    const top = el ? el.scrollTop : 0;
    this.disegna();
    if (el && top > 0) {
      el.scrollTop = top;
      window.requestAnimationFrame(() => {
        el.scrollTop = top;
      });
    }
  }
  contenitoreScorrevole() {
    let e = this.containerEl;
    while (e) {
      const o = getComputedStyle(e).overflowY;
      if ((o === "auto" || o === "scroll") && e.scrollHeight > e.clientHeight) return e;
      e = e.parentElement;
    }
    return null;
  }
  disegna() {
    const { containerEl } = this;
    containerEl.empty();
    collegaTraduzione(containerEl);
    for (const sez of this.sezioni()) sez.disegna(containerEl, () => this.display());
  }
  /**
   * Obsidian 1.13+: le opzioni compaiono nella ricerca delle impostazioni, una pagina per sezione.
   * Il contenuto di ogni pagina è lo stesso di display(), che resta per le versioni precedenti.
   */
  getSettingDefinitions() {
    return this.sezioni().map((sez) => ({
      type: "page",
      name: tr(sez.nome),
      page: () => this.creaPagina(sez.nome, sez.disegna)
    }));
  }
  /** La classe di base esiste solo dalla 1.13: si definisce al momento dell'uso, non al caricamento. */
  creaPagina(nome, disegna) {
    class PaginaOpzioni extends import_obsidian.SettingPage {
      display() {
        this.title = tr(nome);
        this.containerEl.empty();
        collegaTraduzione(this.containerEl);
        disegna(this.containerEl, () => this.display());
      }
      hide() {
        scollegaTraduzione(this.containerEl);
        super.hide();
      }
    }
    return new PaginaOpzioni();
  }
  sezioni() {
    return [
      {
        nome: "Generale",
        disegna: (containerEl, rinnova) => {
          const s = this.plugin.settings;
          new import_obsidian.Setting(containerEl).setName("Lingua dell'interfaccia").setDesc("Lingua dei menu e dei messaggi del plugin. Non modifica i tuoi set n\xE9 le note gi\xE0 scritte.").addDropdown(
            (d) => d.addOptions({ it: "Italiano", en: "English" }).setValue(s.lingua).onChange(async (v) => {
              s.lingua = v === "en" ? "en" : "it";
              impostaLingua(s.lingua);
              await this.plugin.salvaImpostazioni();
              await this.plugin.scriviSetPredefiniti(false);
              await this.plugin.caricaSet();
            })
          );
          new import_obsidian.Setting(containerEl).setName("Cartella di salvataggio").setDesc("Le nuove recensioni vengono create qui come note.").addText(
            (t) => t.setPlaceholder("Libri/ARL").setValue(s.cartella).onChange(async (v) => {
              s.cartella = v.trim();
              await this.plugin.salvaImpostazioni();
            })
          );
          new import_obsidian.Setting(containerEl).setName("Cartella dei set di valutazione").setDesc("Qui si trovano le note dei set di valutazione: \xABRecensione Romanzi\xBB, \xABRecensione Saggi\xBB e i tuoi.").addText(
            (t) => t.setPlaceholder("Libri/ARL/Set").setValue(s.cartellaSet).onChange(async (v) => {
              s.cartellaSet = v.trim() || DEFAULTS.cartellaSet;
              await this.plugin.salvaImpostazioni();
              await this.plugin.caricaSet();
            })
          );
          new import_obsidian.Setting(containerEl).setName("Cartella delle copertine").setDesc("Qui vengono copiate le copertine che carichi dal computer.").addText(
            (t) => t.setPlaceholder("Libri/ARL/Copertine").setValue(s.cartellaCopertine).onChange(async (v) => {
              s.cartellaCopertine = v.trim() || DEFAULTS.cartellaCopertine;
              await this.plugin.salvaImpostazioni();
            })
          );
          new import_obsidian.Setting(containerEl).setName("Domande per schermata").setDesc("Ogni tema viene diviso in schermate di questa dimensione.").addDropdown(
            (d) => d.addOptions({ "1": "1", "2": "2", "5": "5", "10": "10" }).setValue(String(s.domandePerSchermata)).onChange(async (v) => {
              s.domandePerSchermata = parseInt(v, 10);
              await this.plugin.salvaImpostazioni();
            })
          );
          new import_obsidian.Setting(containerEl).setName("ARL e stelle in tempo reale").setDesc("Durante la valutazione mostra in alto a destra il punteggio ARL e le stelle, che si aggiornano a ogni risposta.").addToggle(
            (t) => t.setValue(s.arlLive).onChange(async (v) => {
              s.arlLive = v;
              await this.plugin.salvaImpostazioni();
            })
          );
          new import_obsidian.Setting(containerEl).setName("Evidenzia la domanda").setDesc("Durante la valutazione una barra colorata mette in risalto la domanda corrente.").addToggle(
            (t) => t.setValue(s.evidenziaDomanda).onChange(async (v) => {
              s.evidenziaDomanda = v;
              await this.plugin.salvaImpostazioni();
              rinnova();
            })
          );
          if (s.evidenziaDomanda) {
            const anteprima = containerEl.createDiv({ cls: "arl-ev-anteprima", text: "2. La trama \xE8 originale?" });
            const avviso = containerEl.createDiv({ cls: "arl-meta arl-ev-avviso" });
            const aggAnteprima = () => {
              anteprima.style.background = s.evidenziaSfondo;
              anteprima.style.color = s.evidenziaTesto;
              avviso.setText(
                contrasto(s.evidenziaSfondo, s.evidenziaTesto) < 3 ? "Attenzione: i due colori sono troppo simili, il testo potrebbe essere poco leggibile." : ""
              );
              this.plugin.applicaLarghezza();
            };
            const colore = (nome, desc, chiave) => new import_obsidian.Setting(containerEl).setName(nome).setDesc(desc).addColorPicker(
              (cp) => cp.setValue(s[chiave]).onChange(async (v) => {
                s[chiave] = v;
                await this.plugin.salvaImpostazioni();
                aggAnteprima();
              })
            ).addExtraButton(
              (b) => b.setIcon("reset").setTooltip("Ripristina il colore predefinito").onClick(async () => {
                s[chiave] = DEFAULTS[chiave];
                await this.plugin.salvaImpostazioni();
                this.plugin.applicaLarghezza();
                rinnova();
              })
            );
            colore("Colore dello sfondo della domanda evidenziata", "Predefinito: verde.", "evidenziaSfondo");
            colore("Colore del testo della domanda evidenziata", "Predefinito: bianco.", "evidenziaTesto");
            aggAnteprima();
          }
          new import_obsidian.Setting(containerEl).setName("Apri a schermo pieno").setDesc("Quando apri il plugin nasconde le barre laterali di Obsidian; quando esci (chiudi la scheda o passi a un'altra) tornano com'erano prima.").addToggle(
            (t) => t.setValue(s.schermoPieno).onChange(async (v) => {
              s.schermoPieno = v;
              await this.plugin.salvaImpostazioni();
              if (!v) this.plugin.ripristinaBarre();
            })
          );
          new import_obsidian.Setting(containerEl).setName("Larghezza dell'interfaccia").setDesc("Larghezza massima del contenuto in pixel (da 600 a 2400). Se la imposti a 0 usa tutta la finestra.").addSlider(
            (sl) => conTooltip(sl).setLimits(600, 2400, 50).setValue(s.larghezza > 0 ? s.larghezza : 2400).onChange(async (v) => {
              s.larghezza = v;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
            })
          ).addToggle(
            (t) => t.setTooltip("Usa tutta la larghezza").setValue(s.larghezza === 0).onChange(async (v) => {
              s.larghezza = v ? 0 : 1200;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
              rinnova();
            })
          );
        }
      },
      {
        nome: "Barra dei totali della lista",
        disegna: (containerEl, rinnova) => {
          const s = this.plugin.settings;
          new import_obsidian.Setting(containerEl).setName("Barra dei totali della lista").setHeading();
          const VOCI_RIEPILOGO = [
            ["totali", "Numero di libri e totale in euro", "Quanti libri sono mostrati e la somma dei prezzi."],
            ["stelle", "Libri per numero di stelle", "Quanti libri hanno 5, 4, 3\u2026 stelle, pi\xF9 quelli ancora da valutare."],
            ["piu", "Libro con pi\xF9 pagine", "Il libro pi\xF9 lungo tra quelli mostrati."],
            ["meno", "Libro con meno pagine", "Il libro pi\xF9 corto tra quelli mostrati."],
            ["generi", "Generi letti", "I primi 5 generi per numero di libri letti."]
          ];
          for (const [chiave, nome, desc] of VOCI_RIEPILOGO) {
            new import_obsidian.Setting(containerEl).setName(nome).setDesc(desc).addToggle(
              (t) => t.setValue(!s.riepilogoNascosti.includes(chiave)).onChange(async (v) => {
                s.riepilogoNascosti = s.riepilogoNascosti.filter((x) => x !== chiave);
                if (!v) s.riepilogoNascosti.push(chiave);
                await this.plugin.salvaImpostazioni();
              })
            );
          }
        }
      },
      {
        nome: "Colonne della lista",
        disegna: (containerEl, rinnova) => {
          const s = this.plugin.settings;
          new import_obsidian.Setting(containerEl).setName("Colonne della lista").setHeading();
          containerEl.createDiv({
            cls: "setting-item-description",
            text: "Scegli quali colonne mostrare e in che ordine: trascina \u22EE\u22EE per spostare. Titolo e Autore sono sempre visibili. Vale per Libreria e Valuta libro."
          });
          const boxColonne = containerEl.createDiv({ cls: "arl-colonne" });
          const disegnaColonne = () => {
            boxColonne.empty();
            let da = -1;
            const pulisci = () => boxColonne.querySelectorAll(".arl-col-sopra, .arl-col-sotto, .arl-col-trascinata").forEach(
              (e) => e.classList.remove("arl-col-sopra", "arl-col-sotto", "arl-col-trascinata")
            );
            s.colonneOrdine.forEach((k, i) => {
              const col = COLONNE.find((c) => c.chiave === k);
              if (!col) return;
              const obbligatoria = COLONNE_OBBLIGATORIE.includes(k);
              const visibile = obbligatoria || !s.colonneNascoste.includes(k);
              const riga = boxColonne.createDiv({ cls: "arl-col-riga" });
              riga.draggable = true;
              riga.createSpan({ cls: "arl-col-maniglia", text: "\u22EE\u22EE" });
              const sw = riga.createDiv({
                cls: "checkbox-container" + (visibile ? " is-enabled" : "") + (obbligatoria ? " arl-col-bloccata" : "")
              });
              sw.createEl("input", { type: "checkbox" });
              if (!obbligatoria) {
                sw.onclick = async () => {
                  const nascoste = new Set(s.colonneNascoste);
                  if (nascoste.has(k)) nascoste.delete(k);
                  else nascoste.add(k);
                  s.colonneNascoste = [...nascoste];
                  await this.plugin.salvaImpostazioni();
                  disegnaColonne();
                };
              }
              riga.createSpan({ cls: "arl-col-nome", text: col.titolo });
              if (obbligatoria) riga.createSpan({ cls: "arl-col-nota", text: "sempre visibile" });
              riga.addEventListener("dragstart", (ev) => {
                var _a;
                da = i;
                (_a = ev.dataTransfer) == null ? void 0 : _a.setData("text/plain", String(i));
                if (ev.dataTransfer) ev.dataTransfer.effectAllowed = "move";
                riga.classList.add("arl-col-trascinata");
              });
              riga.addEventListener("dragend", pulisci);
              riga.addEventListener("dragover", (ev) => {
                if (da < 0) return;
                ev.preventDefault();
                const r = riga.getBoundingClientRect();
                const sotto = ev.clientY > r.top + r.height / 2;
                boxColonne.querySelectorAll(".arl-col-sopra, .arl-col-sotto").forEach(
                  (e) => e.classList.remove("arl-col-sopra", "arl-col-sotto")
                );
                riga.classList.add(sotto ? "arl-col-sotto" : "arl-col-sopra");
              });
              riga.addEventListener("drop", (ev) => {
                void (async () => {
                  if (da < 0) return;
                  ev.preventDefault();
                  const r = riga.getBoundingClientRect();
                  let a = i + (ev.clientY > r.top + r.height / 2 ? 1 : 0);
                  const ordine = [...s.colonneOrdine];
                  const [spostata] = ordine.splice(da, 1);
                  if (da < a) a--;
                  ordine.splice(a, 0, spostata);
                  s.colonneOrdine = ordine;
                  da = -1;
                  await this.plugin.salvaImpostazioni();
                  disegnaColonne();
                })();
              });
            });
          };
          disegnaColonne();
          new import_obsidian.Setting(containerEl).addButton(
            (b) => b.setButtonText("Ripristina colonne predefinite").onClick(async () => {
              s.colonneOrdine = [...DEFAULTS.colonneOrdine];
              s.colonneNascoste = [];
              await this.plugin.salvaImpostazioni();
              disegnaColonne();
            })
          );
        }
      },
      {
        nome: "Testo",
        disegna: (containerEl, rinnova) => {
          var _a;
          const s = this.plugin.settings;
          new import_obsidian.Setting(containerEl).setName("Testo").setHeading();
          const FONT = [
            ["", "Predefinito del tema"],
            ["system-ui, -apple-system, 'Segoe UI', sans-serif", "Sans-serif (sistema)"],
            ["Georgia, 'Times New Roman', serif", "Serif (Georgia)"],
            ["'Times New Roman', Times, serif", "Times New Roman"],
            ["Arial, Helvetica, sans-serif", "Arial"],
            ["Verdana, Geneva, sans-serif", "Verdana"],
            ["'Trebuchet MS', sans-serif", "Trebuchet MS"],
            ["'Courier New', monospace", "Courier New"],
            ["ui-monospace, Consolas, monospace", "Monospace"],
            ["__altro", "Personalizzato\u2026"]
          ];
          const predefinito = FONT.some(([v]) => v === s.fontFamiglia);
          const personalizzato = (_a = this.fontAltro) != null ? _a : !predefinito;
          new import_obsidian.Setting(containerEl).setName("Font").setDesc("Carattere dei testi del plugin.").addDropdown((d) => {
            for (const [v, n] of FONT) d.addOption(v, n);
            d.setValue(personalizzato ? "__altro" : s.fontFamiglia).onChange(async (v) => {
              if (v === "__altro") {
                this.fontAltro = true;
                rinnova();
                return;
              }
              this.fontAltro = false;
              s.fontFamiglia = v;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
              rinnova();
            });
          });
          if (personalizzato) {
            new import_obsidian.Setting(containerEl).setName("Nome del font").setDesc("Per esempio: Palatino Linotype, Calibri. Deve essere installato sul tuo computer.").addText(
              (t) => t.setPlaceholder("Calibri").setValue(s.fontFamiglia).onChange(async (v) => {
                s.fontFamiglia = v.trim();
                await this.plugin.salvaImpostazioni();
                this.plugin.applicaLarghezza();
              })
            );
          }
          new import_obsidian.Setting(containerEl).setName("Dimensione del testo").setDesc("In pixel (da 10 a 32). Il pulsante a destra torna alla dimensione del tema.").addSlider(
            (sl) => conTooltip(sl).setLimits(10, 32, 1).setValue(s.fontDimensione || 16).onChange(async (v) => {
              s.fontDimensione = v;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
            })
          ).addExtraButton(
            (b) => b.setIcon("reset").setTooltip("Usa la dimensione del tema").onClick(async () => {
              s.fontDimensione = 0;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
              rinnova();
            })
          );
          new import_obsidian.Setting(containerEl).setName("Colore del testo").setDesc("Colore principale dei testi. I testi secondari (grigi) restano quelli del tema.").addColorPicker(
            (cp) => cp.setValue(s.coloreTesto || "#808080").onChange(async (v) => {
              s.coloreTesto = v;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
            })
          ).addExtraButton(
            (b) => b.setIcon("reset").setTooltip("Usa il colore del tema").onClick(async () => {
              s.coloreTesto = "";
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
              rinnova();
            })
          );
        }
      },
      {
        nome: "Libreria virtuale",
        disegna: (containerEl, rinnova) => {
          const s = this.plugin.settings;
          new import_obsidian.Setting(containerEl).setName("Libreria virtuale").setHeading();
          new import_obsidian.Setting(containerEl).setName("Libri per ripiano").setDesc("Quanti libri stanno su ogni ripiano (da 5 a 40). Cambiandolo, i libri si ridistribuiscono nell'ordine salvato.").addSlider(
            (sl) => conTooltip(sl).setLimits(5, 40, 1).setValue(s.vlPerRipiano).onChange(async (v) => {
              s.vlPerRipiano = v;
              await this.plugin.salvaImpostazioni();
            })
          );
          new import_obsidian.Setting(containerEl).setName("Usa tutta la larghezza").setDesc("La libreria occupa tutta la larghezza della finestra, ignorando la larghezza scelta qui sotto.").addToggle(
            (t) => t.setValue(s.vlAdatta).onChange(async (v) => {
              s.vlAdatta = v;
              await this.plugin.salvaImpostazioni();
              rinnova();
            })
          );
          if (!s.vlAdatta) {
            new import_obsidian.Setting(containerEl).setName("Larghezza della libreria").setDesc("In pixel (da 500 a 2400).").addSlider(
              (sl) => conTooltip(sl).setLimits(500, 2400, 50).setValue(s.vlLarghezza).onChange(async (v) => {
                s.vlLarghezza = v;
                await this.plugin.salvaImpostazioni();
              })
            );
          }
          new import_obsidian.Setting(containerEl).setName("Testo sul dorso").setDesc("Cosa si legge sul dorso di ogni libro. Il carattere si riduce da solo per far stare tutto il testo.").addDropdown(
            (d) => d.addOptions({ titoloAutore: "Titolo e autore", titolo: "Solo titolo" }).setValue(s.vlMostra).onChange(async (v) => {
              s.vlMostra = v === "titolo" ? "titolo" : "titoloAutore";
              await this.plugin.salvaImpostazioni();
            })
          );
          {
            const f = s.vlImmagine ? this.plugin.app.vault.getAbstractFileByPath(s.vlImmagine) : null;
            const esiste = f instanceof import_obsidian.TFile;
            const imp = new import_obsidian.Setting(containerEl).setName("Immagine dietro la libreria").setDesc(
              s.vlImmagine ? esiste ? `${s.vlImmagine} \u2014 meglio sotto i 2000 px di larghezza.` : `Immagine non trovata nel vault: ${s.vlImmagine}` : "Nessuna. Una parete o una stanza dietro lo scaffale (meglio sotto i 2000 px di larghezza)."
            );
            const scelta = async (file) => {
              s.vlImmagine = file.path;
              await this.plugin.salvaImpostazioni();
              rinnova();
            };
            imp.addButton(
              (b) => b.setButtonText("Scegli\u2026").onClick(() => {
                const imm = this.plugin.imgDelVault();
                if (!imm.length) {
                  new NoticeT("Nel vault non ci sono immagini.");
                  return;
                }
                new ImmagineModal(this.plugin.app, imm, (x) => void scelta(x)).open();
              })
            );
            imp.addButton(
              (b) => b.setButtonText("Dal computer\u2026").onClick(() => {
                const sel = createEl("input");
                sel.type = "file";
                sel.accept = "image/*";
                sel.onchange = async () => {
                  var _a;
                  const file = (_a = sel.files) == null ? void 0 : _a[0];
                  if (!file) return;
                  try {
                    await scelta(await this.plugin.importaImmagine(file));
                  } catch (e) {
                    new NoticeT(`Impossibile aggiungere l'immagine: ${e.message}`);
                  }
                };
                sel.click();
              })
            );
            imp.addButton(
              (b) => b.setButtonText("Nessuna").onClick(async () => {
                s.vlImmagine = "";
                await this.plugin.salvaImpostazioni();
                rinnova();
              })
            );
            if (esiste) {
              new import_obsidian.Setting(containerEl).setName("Adattamento dell'immagine").setDesc("Copri tutto riempie l'area (tagliando i bordi), Adatta mostra l'immagine intera, Ripeti la ripete come un tappeto.").addDropdown(
                (d) => d.addOptions({ cover: "Copri tutto", contain: "Adatta", repeat: "Ripeti" }).setValue(s.vlImgModo).onChange(async (v) => {
                  s.vlImgModo = v === "contain" || v === "repeat" ? v : "cover";
                  await this.plugin.salvaImpostazioni();
                })
              );
              new import_obsidian.Setting(containerEl).setName("Oscura l'immagine").setDesc("Velatura scura (da 0 a 70 %) per far risaltare i libri.").addSlider(
                (sl) => conTooltip(sl).setLimits(0, 70, 5).setValue(s.vlImgOscura).onChange(async (v) => {
                  s.vlImgOscura = v;
                  await this.plugin.salvaImpostazioni();
                })
              );
              new import_obsidian.Setting(containerEl).setName("Sfocatura").setDesc("Effetto fuori fuoco (da 0 a 20 px) per non distrarre dai libri.").addSlider(
                (sl) => conTooltip(sl).setLimits(0, 20, 1).setValue(s.vlImgSfoca).onChange(async (v) => {
                  s.vlImgSfoca = v;
                  await this.plugin.salvaImpostazioni();
                })
              );
            }
          }
          new import_obsidian.Setting(containerEl).setName("Sfondo della libreria").setDesc("Predefinito: legno. Scegliendo un colore, lo sfondo diventa una tinta unita.").addColorPicker(
            (cp) => cp.setValue(s.vlSfondo || "#b58650").onChange(async (v) => {
              s.vlSfondo = v;
              await this.plugin.salvaImpostazioni();
            })
          ).addExtraButton(
            (b) => b.setIcon("reset").setTooltip("Usa il legno").onClick(async () => {
              s.vlSfondo = "";
              await this.plugin.salvaImpostazioni();
              rinnova();
            })
          );
          {
            const generi = /* @__PURE__ */ new Map();
            for (const l of this.plugin.tuttiILibri()) {
              const g = l.genere.trim();
              if (g && !generi.has(g.toLowerCase())) generi.set(g.toLowerCase(), g);
            }
            new import_obsidian.Setting(containerEl).setName("Colori per genere").setDesc("Colore del dorso dei libri di ogni genere. Senza una scelta, il genere ha una tinta automatica sempre uguale.");
            for (const [chiave, nome] of [...generi].sort((p, q) => p[1].localeCompare(q[1], "it"))) {
              new import_obsidian.Setting(containerEl).setName(nome).addColorPicker(
                (cp) => cp.setValue(coloreGenere(s, nome)).onChange(async (v) => {
                  s.vlGeneri[chiave] = v;
                  await this.plugin.salvaImpostazioni();
                })
              ).addExtraButton(
                (b) => b.setIcon("reset").setTooltip("Usa la tinta automatica").onClick(async () => {
                  delete s.vlGeneri[chiave];
                  await this.plugin.salvaImpostazioni();
                  rinnova();
                })
              );
            }
          }
          {
            let conferma = false;
            new import_obsidian.Setting(containerEl).setName("Ordine dei libri").setDesc("Cancella le posizioni scelte trascinando e riporta i libri in ordine di codice, dal pi\xF9 alto al pi\xF9 basso.").addButton(
              (b) => b.setButtonText("Ripristina l'ordine per codice").onClick(async () => {
                if (!conferma) {
                  conferma = true;
                  b.setButtonText("Premi ancora per confermare");
                  window.setTimeout(() => {
                    conferma = false;
                    b.setButtonText("Ripristina l'ordine per codice");
                  }, 4e3);
                  return;
                }
                s.vlOrdine = [];
                s.vlCriterio = "";
                await this.plugin.salvaImpostazioni();
                new NoticeT("Ordine ripristinato.");
                conferma = false;
                b.setButtonText("Ripristina l'ordine per codice");
              })
            );
          }
        }
      },
      {
        nome: "Copertina",
        disegna: (containerEl, rinnova) => {
          const s = this.plugin.settings;
          new import_obsidian.Setting(containerEl).setName("Copertina").setHeading();
          new import_obsidian.Setting(containerEl).setName("Altezza della copertina").setDesc("Altezza massima dell'immagine nel dettaglio del libro, in pixel (da 80 a 600). Il pulsante a destra riporta il valore predefinito (240).").addSlider(
            (sl) => conTooltip(sl).setLimits(80, 600, 10).setValue(s.altezzaCopertina).onChange(async (v) => {
              s.altezzaCopertina = v;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
            })
          ).addExtraButton(
            (b) => b.setIcon("reset").setTooltip("Ripristina la dimensione predefinita").onClick(async () => {
              s.altezzaCopertina = DEFAULTS.altezzaCopertina;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
              rinnova();
            })
          );
        }
      },
      {
        nome: "Galleria immagini",
        disegna: (containerEl, rinnova) => {
          const s = this.plugin.settings;
          new import_obsidian.Setting(containerEl).setName("Galleria immagini").setHeading();
          new import_obsidian.Setting(containerEl).setName("Dimensione delle anteprime").setDesc("Larghezza in pixel delle anteprime nella galleria immagini (da 120 a 600). Il pulsante a destra riporta il valore predefinito (260).").addSlider(
            (sl) => conTooltip(sl).setLimits(120, 600, 10).setValue(s.galleriaMiniatura).onChange(async (v) => {
              s.galleriaMiniatura = v;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
            })
          ).addExtraButton(
            (b) => b.setIcon("rotate-ccw").setTooltip("Ripristina la dimensione predefinita").onClick(async () => {
              s.galleriaMiniatura = DEFAULTS.galleriaMiniatura;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
              rinnova();
            })
          );
        }
      },
      {
        nome: "Barra di lettura",
        disegna: (containerEl, rinnova) => {
          const s = this.plugin.settings;
          new import_obsidian.Setting(containerEl).setName("Barra di lettura").setHeading();
          new import_obsidian.Setting(containerEl).setName("Spessore della barra").setDesc("Altezza in pixel della barra di avanzamento nella sezione Lettura del dettaglio libro.").addSlider(
            (sl) => conTooltip(sl).setLimits(6, 40, 1).setValue(s.spessoreBarra).onChange(async (v) => {
              s.spessoreBarra = v;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
              aggiornaAnteprimaBarra();
            })
          );
          new import_obsidian.Setting(containerEl).setName("Barra sfumata").setDesc("Se attiva, la barra passa da un colore di partenza a uno di arrivo.").addToggle(
            (t) => t.setValue(s.barraSfumata).onChange(async (v) => {
              s.barraSfumata = v;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
              rinnova();
            })
          );
          new import_obsidian.Setting(containerEl).setName(s.barraSfumata ? "Colore di partenza" : "Colore della barra").addColorPicker(
            (cp) => cp.setValue(s.coloreBarra).onChange(async (v) => {
              s.coloreBarra = v;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
              aggiornaAnteprimaBarra();
            })
          ).addExtraButton(
            (b) => b.setIcon("reset").setTooltip("Ripristina il colore predefinito").onClick(async () => {
              s.coloreBarra = DEFAULTS.coloreBarra;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
              rinnova();
            })
          );
          if (s.barraSfumata) {
            new import_obsidian.Setting(containerEl).setName("Colore di arrivo").addColorPicker(
              (cp) => cp.setValue(s.coloreBarraFine).onChange(async (v) => {
                s.coloreBarraFine = v;
                await this.plugin.salvaImpostazioni();
                this.plugin.applicaLarghezza();
                aggiornaAnteprimaBarra();
              })
            ).addExtraButton(
              (b) => b.setIcon("reset").setTooltip("Ripristina il colore predefinito").onClick(async () => {
                s.coloreBarraFine = DEFAULTS.coloreBarraFine;
                await this.plugin.salvaImpostazioni();
                this.plugin.applicaLarghezza();
                rinnova();
              })
            );
          }
          const anteprimaBarra = containerEl.createDiv({ cls: "arl-progress arl-progress-lettura arl-barra-anteprima" });
          const riempimento = anteprimaBarra.createDiv({ cls: "arl-progress-fill" });
          riempimento.addClass("arl-progress-anteprima");
          const aggiornaAnteprimaBarra = () => {
            const { fill, sp } = this.plugin.stileBarra();
            anteprimaBarra.style.height = `${sp}px`;
            anteprimaBarra.style.borderRadius = `${sp / 2}px`;
            riempimento.style.background = fill;
          };
          aggiornaAnteprimaBarra();
        }
      },
      {
        nome: "Grafico di lettura",
        disegna: (containerEl, rinnova) => {
          const s = this.plugin.settings;
          new import_obsidian.Setting(containerEl).setName("Grafico di lettura").setHeading();
          const anteprimaGrafico = containerEl.createDiv();
          const aggiornaAnteprimaGrafico = () => {
            const esempio = [12, 30, 22, 0, 41, 18, 55, 35, 20, 44];
            const punti = esempio.map((pg, i) => ({ data: `2026-01-${String(i + 1).padStart(2, "0")}`, pagine: pg }));
            disegnaGrafico(anteprimaGrafico, punti, this.plugin.stileGrafico(), false);
          };
          new import_obsidian.Setting(containerEl).setName("Spessore della linea").setDesc("Spessore della linea del grafico (da 1 a 10).").addSlider(
            (sl) => conTooltip(sl).setLimits(1, 10, 1).setValue(s.spessoreGrafico).onChange(async (v) => {
              s.spessoreGrafico = v;
              await this.plugin.salvaImpostazioni();
              aggiornaAnteprimaGrafico();
            })
          );
          new import_obsidian.Setting(containerEl).setName("Grafico sfumato").setDesc("Se attivo, la linea passa da un colore di partenza a uno di arrivo.").addToggle(
            (t) => t.setValue(s.graficoSfumato).onChange(async (v) => {
              s.graficoSfumato = v;
              await this.plugin.salvaImpostazioni();
              rinnova();
            })
          );
          new import_obsidian.Setting(containerEl).setName(s.graficoSfumato ? "Colore di partenza del grafico" : "Colore del grafico").addColorPicker(
            (cp) => cp.setValue(s.coloreGrafico).onChange(async (v) => {
              s.coloreGrafico = v;
              await this.plugin.salvaImpostazioni();
              aggiornaAnteprimaGrafico();
            })
          ).addExtraButton(
            (b) => b.setIcon("reset").setTooltip("Ripristina il colore predefinito").onClick(async () => {
              s.coloreGrafico = DEFAULTS.coloreGrafico;
              await this.plugin.salvaImpostazioni();
              rinnova();
            })
          );
          if (s.graficoSfumato) {
            new import_obsidian.Setting(containerEl).setName("Colore di arrivo del grafico").addColorPicker(
              (cp) => cp.setValue(s.coloreGraficoFine).onChange(async (v) => {
                s.coloreGraficoFine = v;
                await this.plugin.salvaImpostazioni();
                aggiornaAnteprimaGrafico();
              })
            ).addExtraButton(
              (b) => b.setIcon("reset").setTooltip("Ripristina il colore predefinito").onClick(async () => {
                s.coloreGraficoFine = DEFAULTS.coloreGraficoFine;
                await this.plugin.salvaImpostazioni();
                rinnova();
              })
            );
          }
          aggiornaAnteprimaGrafico();
        }
      },
      {
        nome: "Colori del voto",
        disegna: (containerEl, rinnova) => {
          const s = this.plugin.settings;
          new import_obsidian.Setting(containerEl).setName("Colori del voto").setHeading();
          new import_obsidian.Setting(containerEl).setName("Colora in base al voto").setDesc("Barre dei temi, punteggio ARL e lista prendono il colore della fascia di voto. I colori si scelgono in ogni set (Set di valutazione \u2192 Modifica).").addToggle(
            (t) => t.setValue(s.votoColori).onChange(async (v) => {
              s.votoColori = v;
              await this.plugin.salvaImpostazioni();
            })
          );
          new import_obsidian.Setting(containerEl).setName("Spessore delle barre dei temi").setDesc("Altezza in pixel delle barre dei temi nel dettaglio del libro.").addSlider(
            (sl) => conTooltip(sl).setLimits(4, 30, 1).setValue(s.spessoreTemi).onChange(async (v) => {
              s.spessoreTemi = v;
              await this.plugin.salvaImpostazioni();
              this.plugin.applicaLarghezza();
            })
          );
          new import_obsidian.Setting(containerEl).setName("Barre sfumate tra le fasce").setDesc("Se attivo, la barra passa gradualmente dal colore delle fasce pi\xF9 basse a quello della fascia raggiunta; altrimenti \xE8 tinta unita.").addToggle(
            (t) => t.setValue(s.votoSfumato).onChange(async (v) => {
              s.votoSfumato = v;
              await this.plugin.salvaImpostazioni();
            })
          );
        }
      },
      {
        nome: "Stelle",
        disegna: (containerEl, rinnova) => {
          const s = this.plugin.settings;
          new import_obsidian.Setting(containerEl).setName("Stelle").setHeading();
          new import_obsidian.Setting(containerEl).setName("Stelle totali").setDesc("Il punteggio ARL resta da 0 a 10; cambia solo la conversione in stelle.").addDropdown((d) => {
            const opzioni = {};
            for (let n = 3; n <= 10; n++) opzioni[String(n)] = String(n);
            d.addOptions(opzioni).setValue(String(s.stelleTotali)).onChange(async (v) => {
              s.stelleTotali = parseInt(v, 10);
              await this.plugin.salvaImpostazioni();
              rinnova();
            });
          });
          containerEl.createDiv({
            cls: "setting-item-description",
            text: "Le soglie per assegnare le stelle si impostano in ogni set di valutazione (Set di valutazione \u2192 Modifica)."
          });
        }
      }
    ];
  }
};
