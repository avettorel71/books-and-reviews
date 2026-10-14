import {
	App,
	getLanguage,
	FuzzySuggestModal,
	ItemView,
	Menu,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
	WorkspaceLeaf,
	normalizePath,
} from "obsidian";

const VIEW_TYPE = "book-review-algorithm-view";

/* ------------------------------------------------------------------ */
/*  Dati: le domande del set predefinito Romanzi               */
/* ------------------------------------------------------------------ */

const TIPO = "recensione-arl";

import SET_IT_ROMANZI from "./sets/it/Recensione Romanzi.md";
import SET_IT_SAGGI from "./sets/it/Recensione Saggi.md";
import SET_EN_NOVELS from "./sets/en/Review Novels.md";
import SET_EN_ESSAYS from "./sets/en/Review Essays.md";


/* ------------------------------------------------------------------ */
/*  Tipi e impostazioni                                               */
/* ------------------------------------------------------------------ */

type Risposta = 0 | 1 | null;

interface ARLSettings {
	cartella: string; // dove vengono create le note dei libri
	cartellaSet: string; // dove stanno i set di domande
	cartellaCopertine: string; // dove si salvano le copertine caricate dal computer
	setPredefinitiCreati: boolean;
	domandePerSchermata: number;
	schermoPieno: boolean; // all'apertura nasconde le barre laterali di Obsidian
	coloreBarra: string; // colore della barra di lettura (di partenza se sfumata)
	coloreBarraFine: string; // colore di arrivo della barra sfumata
	barraSfumata: boolean;
	lingua: Lingua;
	fontFamiglia: string; // "" = font del tema
	fontDimensione: number; // px; 0 = dimensione del tema
	coloreTesto: string; // "" = colore del tema
	colonneOrdine: string[]; // ordine delle colonne della lista
	colonneNascoste: string[]; // colonne non mostrate (titolo e autore sono sempre visibili)
	coloreGrafico: string;
	coloreGraficoFine: string;
	graficoSfumato: boolean;
	votoColori: boolean; // colora barre dei temi, ARL e lista secondo le fasce del set
	votoSfumato: boolean; // sfumatura tra le fasce (altrimenti tinta unita)
	galleriaMiniatura: number; // larghezza in px delle anteprime della galleria immagini
	vlPerRipiano: number; // libreria virtuale: libri per ripiano
	vlLarghezza: number; // libreria virtuale: larghezza in px
	vlAdatta: boolean; // libreria virtuale: usa tutta la larghezza disponibile
	vlSfondo: string; // libreria virtuale: colore dello sfondo ("" = legno)
	vlMostra: "titolo" | "titoloAutore"; // testo sul dorso
	vlGeneri: Record<string, string>; // colore del dorso per genere (chiave: genere in minuscolo)
	vlOrdine: string[]; // percorsi delle note nell'ordine scelto dall'utente
	vlDisposizioni: { nome: string; ordine: string[] }[]; // disposizioni salvate con un nome
	vlCorrente: string; // disposizione caricata ("" = ordine libero)
	vlImmagine: string; // immagine di sfondo dietro la libreria virtuale (percorso nel vault)
	vlImgModo: "cover" | "contain" | "repeat";
	vlImgOscura: number; // velatura scura, 0-70 %
	vlImgSfoca: number; // sfocatura, 0-20 px
	vlCriterio: string; // ordinamento applicato con i tasti della barra ("" = posizioni scelte a mano)
	riepilogoNascosti: string[]; // voci della barra dei totali non mostrate
	evidenziaDomanda: boolean; // evidenzia la prossima domanda da rispondere
	evidenziaSfondo: string;
	evidenziaTesto: string;
	arlLive: boolean; // durante la valutazione mostra ARL e stelle in tempo reale
	spessoreTemi: number; // altezza in px delle barre dei temi nel dettaglio
	spessoreGrafico: number;
	altezzaCopertina: number; // altezza massima della copertina nel dettaglio, in px
	spessoreBarra: number; // altezza della barra in pixel
	larghezza: number; // larghezza massima del contenuto in px; 0 = tutta la finestra
	stelleTotali: number;
	pesi?: number[]; // solo per migrare le versioni precedenti (i pesi ora sono nei set)
}

const DEFAULTS: ARLSettings = {
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
	vlLarghezza: 1000,
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
	stelleTotali: 5,
};

/** Un tema di un set di domande, con il suo peso e le sue domande Sì/No. */
interface SetCategoria {
	id: string; // usato nelle chiavi della nota (risposte_<id>, punteggio_<id>)
	nome: string;
	descr: string;
	peso: number;
	domande: string[];
}

interface SetDomande {
	nome: string;
	categorie: SetCategoria[];
	soglie: number[]; // massimo ARL per 1, 2, 3 e 4 stelle (riferimento a 5 stelle); la quinta arriva a 10
	colori: string[]; // colore delle 5 fasce di voto delimitate dalle soglie
	file: TFile | null; // null = set predefinito non ancora salvato come file
}

interface SetNonValido {
	file: TFile;
	errori: string[];
}

interface DatiRecensione {
	set: string; // nome del set di domande
	codice: string; // testo digitato; progressivo numerico del libro
	copertina: string; // collegamento digitato, es. [[Copertine/dune.jpg]]; vuoto = nessuna
	titolo: string;
	autore: string;
	editore: string;
	genere: string;
	premio: string; // premio ricevuto dal libro (testo libero); vuoto = nessuno
	pagine: string; // testo digitato; vuoto = non indicato
	prezzo: string; // testo digitato, es. "9,90"; vuoto = non indicato
	restituzione: string; // data ISO; vuoto = nessuna scadenza
	restituito: boolean;
	inizio: string;
	fine: string;
	risposte: Risposta[][]; // una lista per ogni tema del set
}

interface Personaggio {
	nome: string;
	descrizione: string;
}

interface Lettura {
	data: string; // ISO
	da: number; // prima pagina letta
	a: number; // ultima pagina letta
}

interface Libro {
	file: TFile;
	letture: Lettura[];
	personaggi: Personaggio[];
	valutato: boolean; // ha già una valutazione (ARL)
	codice: number | null; // progressivo numerico; null = non assegnato
	copertina: string; // destinazione del collegamento alla copertina; vuoto = nessuna
	galleria: string[]; // collegamenti alle immagini della galleria
	galleriaTesti: string[]; // didascalie facoltative, nello stesso ordine di `galleria` (vuoto = nessuna)
	manuale: boolean; // valutazione inserita a mano (senza domande)
	set: string;
	titolo: string;
	autore: string;
	editore: string;
	genere: string;
	premio: string; // premio ricevuto dal libro; vuoto = nessuno
	pagine: number; // 0 = non indicato
	prezzo: number | null; // null = non indicato
	restituzione: string; // data ISO; vuoto = nessuna scadenza
	restituito: boolean;
	inizio: string;
	fine: string;
	giorni: number;
	arl: number;
	risposte: Record<string, string>; // id tema → "SNSS…"
	punteggi: Record<string, number>; // id tema → punteggio 0-10
}

/* ------------------------------------------------------------------ */
/*  Calcoli: punteggio ARL, soglie e stelle                           */
/* ------------------------------------------------------------------ */

function fmt(n: number): string {
	return n.toFixed(1).replace(".", ",");
}

function fmtData(iso: string): string {
	const [y, m, d] = iso.split("-");
	return `${d}/${m}/${y}`;
}

/** Giorni di lettura, estremi inclusi (1 settembre → 14 settembre = 14). */
/** Rapporto di contrasto (1–21) tra due colori «#rrggbb». */
function contrasto(a: string, b: string): number {
	const lum = (c: string) => {
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

function giorniTra(inizio: string, fine: string): number {
	const parse = (s: string) => {
		const [y, m, d] = s.split("-").map(Number);
		return Date.UTC(y, m - 1, d);
	};
	const diff = Math.round((parse(fine) - parse(inizio)) / 86400000) + 1;
	return Number.isFinite(diff) ? diff : 0;
}

function etichettaGiorni(n: number): string {
	return n === 1 ? "1 giorno" : `${n} giorni`;
}

/** "9,90", "€ 9.90", "10" → numero; vuoto → null; non valido → NaN. */
function parsePrezzo(testo: string): number | null {
	const t = testo.replace(/€/g, "").replace(/\s/g, "").replace(",", ".");
	if (t === "") return null;
	if (!/^\d+(\.\d{1,2})?$/.test(t)) return NaN;
	return Math.round(parseFloat(t) * 100) / 100;
}

function formatNumeroEuro(n: number): string {
	return n.toLocaleString("it-IT", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

function formatEuro(n: number): string {
	return `€ ${formatNumeroEuro(n)}`;
}

interface Scadenza {
	testo: string;
	classe: string;
}

function plurale(n: number, singolare: string, pluraleStr: string): string {
	return `${n} ${n === 1 ? singolare : pluraleStr}`;
}

/**
 * Tempo che manca alla restituzione. La scadenza è la fine del giorno indicato
 * (le 24:00), perché il campo contiene solo la data.
 */
function calcolaScadenza(restituzione: string, restituito: boolean, adesso: Date): Scadenza {
	if (restituito) return { testo: "Restituito", classe: "arl-restituito" };
	if (!restituzione) return { testo: "—", classe: "" };

	const [y, m, d] = restituzione.split("-").map(Number);
	const fine = new Date(y, m - 1, d + 1, 0, 0, 0);
	const MIN = 60000;
	const ORA = 60 * MIN;
	const GIORNO = 24 * ORA;
	const diff = fine.getTime() - adesso.getTime();

	if (diff <= 0) {
		const n = Math.floor(-diff / GIORNO) + 1;
		return { testo: `Scaduto da ${plurale(n, "giorno", "giorni")}`, classe: "arl-scaduto" };
	}

	// mesi interi di calendario
	let mesi = (fine.getFullYear() - adesso.getFullYear()) * 12 + fine.getMonth() - adesso.getMonth();
	if (new Date(adesso.getFullYear(), adesso.getMonth() + mesi, adesso.getDate(), adesso.getHours(), adesso.getMinutes()) > fine) {
		mesi--;
	}
	if (mesi >= 1) return { testo: plurale(mesi, "mese", "mesi"), classe: "" };

	const giorni = Math.floor(diff / GIORNO);
	const ore = Math.floor((diff % GIORNO) / ORA);
	if (giorni > 0) {
		return {
			testo: `${plurale(giorni, "giorno", "giorni")} e ${plurale(ore, "ora", "ore")}`,
			classe: "",
		};
	}
	return { testo: ore > 0 ? plurale(ore, "ora", "ore") : "meno di 1 ora", classe: "" };
}

/** Punteggio di un tema da 0 a 10: quota di risposte Sì sul numero di domande. */
function punteggioCategoria(risposte: Risposta[]): number {
	if (risposte.length === 0) return 0;
	const si = risposte.reduce<number>((somma, r) => somma + (r === 1 ? 1 : 0), 0);
	return (si * 10) / risposte.length;
}

function arrotonda1(n: number): number {
	return Math.round(n * 10) / 10;
}

/** Punteggio di un tema: intero se possibile, altrimenti con una cifra decimale. */
function fmtP(n: number): string {
	const r = arrotonda1(n);
	return Number.isInteger(r) ? String(r) : fmt(r);
}

/** Media pesata dei 5 punteggi (0-10), arrotondata a 1 decimale. */
function calcolaArl(punteggi: number[], pesi: number[]): number {
	let p = pesi;
	let somma = p.reduce((a, b) => a + b, 0);
	if (!(somma > 0)) {
		p = punteggi.map(() => 1);
		somma = p.length;
	}
	const totale = punteggi.reduce((s, v, i) => s + v * p[i], 0) / somma;
	return Math.round(totale * 10) / 10;
}

/** Soglie della scala ARL originale (foglio Excel): massimo ARL per 1, 2, 3 e 4 stelle su 5. */
const SOGLIE_STANDARD = [3, 5, 7, 9];

/** Colori predefiniti delle 5 fasce di voto (dal più basso al più alto). */
const COLORI_FASCE = ["#e5484d", "#f08c3a", "#f5d142", "#8bc34a", "#2e9e5b"];

function coloriValidi(v: unknown): string[] {
	if (!Array.isArray(v) || v.length !== 5) return [...COLORI_FASCE];
	return v.map((c, i) => (typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c.trim()) ? c.trim() : COLORI_FASCE[i]));
}

/** Estremi delle 5 fasce: 0, soglie…, 10. */
function estremiFasce(sg: number[]): number[] {
	return [0, ...sg, 10];
}

function fasciaDi(v: number, sg: number[]): number {
	const e = estremiFasce(sg);
	for (let i = 0; i < 5; i++) if (v <= e[i + 1]) return i;
	return 4;
}

/** Colore (tinta unita) della fascia in cui cade il voto. */
function coloreVoto(v: number, sg: number[], colori: string[]): string {
	return colori[fasciaDi(v, sg)];
}

/** Sfondo di una barra riempita fino a v (0-10): sfumata attraverso le fasce attraversate, o tinta unita. */
function sfondoVoto(v: number, sg: number[], colori: string[], sfumato: boolean): string {
	const fin = colori[fasciaDi(v, sg)];
	if (!sfumato || v <= 0) return fin;
	const e = estremiFasce(sg);
	const fino = fasciaDi(v, sg);
	if (fino === 0) return fin;
	const stops: string[] = [];
	for (let i = 0; i <= fino; i++) {
		const lo = e[i];
		const hi = Math.min(e[i + 1], v);
		const pos = i === fino ? 100 : Math.max(0, Math.min(100, (((lo + hi) / 2) / v) * 100));
		stops.push(`${colori[i]} ${pos.toFixed(1)}%`);
	}
	return `linear-gradient(90deg, ${stops.join(", ")})`;
}

const PRESET_SOGLIE: { nome: string; valori: number[] }[] = [
	{ nome: "Scala ARL", valori: [3, 5, 7, 9] },
	{ nome: "Lineare", valori: [2, 4, 6, 8] },
	{ nome: "Severa", valori: [5, 7, 8.5, 9.5] },
];

/** Controlla le soglie di riferimento: 4 valori crescenti, tra 0 e 10 esclusi. */
function soglieValide(v: number[]): string | null {
	const msg = "Le soglie delle stelle devono essere 4 valori crescenti tra 0 e 10 (per esempio 3 / 5 / 7 / 9).";
	if (!Array.isArray(v) || v.length !== 4) return msg;
	for (let i = 0; i < 4; i++) {
		if (!Number.isFinite(v[i]) || v[i] <= 0 || v[i] >= 10) return msg;
		if (i > 0 && v[i] <= v[i - 1]) return msg;
	}
	return null;
}

/** Curva frazione delle stelle → punteggio massimo, ricavata dalle soglie di riferimento (5 stelle). */
function valoreCurva(x: number, rif: number[]): number {
	const curva: [number, number][] = [
		[0, 0],
		[0.2, rif[0]],
		[0.4, rif[1]],
		[0.6, rif[2]],
		[0.8, rif[3]],
		[1, 10],
	];
	for (let i = 1; i < curva.length; i++) {
		if (x <= curva[i][0] + 1e-9) {
			const [x0, y0] = curva[i - 1];
			const [x1, y1] = curva[i];
			return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
		}
	}
	return 10;
}

/** Limite superiore (incluso) del punteggio per ciascuna stella. */
function soglie(totale: number, rif: number[]): number[] {
	const out: number[] = [];
	for (let k = 1; k <= totale; k++) {
		out.push(Math.round(valoreCurva(k / totale, rif) * 10) / 10);
	}
	out[totale - 1] = 10;
	return out;
}

function stelleAssegnate(arl: number, totale: number, rif: number[]): number {
	const s = soglie(totale, rif);
	const a = Math.round(arl * 10) / 10;
	for (let k = 0; k < totale; k++) {
		if (a <= s[k] + 1e-9) return k + 1;
	}
	return totale;
}

/** Solo le stelle guadagnate, senza quelle vuote. */
function stringaStelle(k: number): string {
	return "★".repeat(k);
}

/* ------------------------------------------------------------------ */
/*  Set di domande: formato dei file, lettura e scrittura             */
/* ------------------------------------------------------------------ */

const TIPO_SET = "set-domande-arl";


/** Set predefiniti: file `.md` della cartella `sets/` del progetto, incorporati nel plugin. */
const SET_PREDEFINITI_MD: Record<Lingua, { prefisso: string; testi: string[] }> = {
	it: { prefisso: "Recensione", testi: [SET_IT_ROMANZI, SET_IT_SAGGI] },
	en: { prefisso: "Review", testi: [SET_EN_NOVELS, SET_EN_ESSAYS] },
};

/** I due set che il plugin crea al primo avvio, nella lingua indicata. */
function setPredefiniti(
	lingua: Lingua,
	pesiRomanzi?: number[]
): { nome: string; categorie: SetCategoria[] }[] {
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

function slug(s: string): string {
	return s
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "");
}

/** Id libero a partire dal nome di un tema (aggiunge _2, _3… se già usato). */
function idUnico(nome: string, usati: Set<string>): string {
	const base = slug(nome) || "tema";
	let id = base;
	let n = 2;
	while (usati.has(id)) id = `${base}_${n++}`;
	return id;
}

function pulisciValore(v: string): string {
	const t = v.trim();
	if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) {
		try {
			return String(JSON.parse(t));
		} catch {
			return t.slice(1, -1);
		}
	}
	if (t.length >= 2 && t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1);
	return t;
}

function contenutoNormalizzato(testo: string): string {
	return testo.replace(/\r\n?/g, "\n");
}

function eUnSet(testo: string): boolean {
	const fm = /^---\n([\s\S]*?)\n---/.exec(contenutoNormalizzato(testo));
	return !!fm && /^tipo\s*:\s*set-domande-arl\s*$/m.test(fm[1]);
}

interface EsitoParse {
	nome: string;
	categorie: SetCategoria[];
	soglie: number[];
	colori: string[];
	errori: string[];
}

/**
 * Legge un set da una nota:
 *   proprietà `nome`, poi per ogni tema un titolo `## Nome`, le righe
 *   `peso:`, `descrizione:` (e facoltativamente `id:`) e le domande come `- testo`.
 */
function parseSet(testo: string): EsitoParse {
	const errori: string[] = [];
	const t = contenutoNormalizzato(testo);
	let corpo = t;
	let nome = "";
	let soglieSet: number[] = [...SOGLIE_STANDARD];
	let coloriSet: string[] = [...COLORI_FASCE];
	const fm = /^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(t);
	if (fm) {
		corpo = t.slice(fm[0].length);
		const m = /^nome\s*:\s*(.+)$/im.exec(fm[1]);
		if (m) nome = pulisciValore(m[1]);
		const sg = /^soglie\s*:\s*(.+)$/im.exec(fm[1]);
		if (sg) {
			const valori = pulisciValore(sg[1])
				.split(/[/;]|,(?=\s)/)
				.map((x) => parseFloat(x.trim().replace(",", ".")));
			if (soglieValide(valori) === null) soglieSet = valori;
			else errori.push("le soglie delle stelle non sono valide (servono 4 valori crescenti tra 0 e 10, per esempio «3 / 5 / 7 / 9»)");
		}
		const co = /^colori\s*:\s*(.+)$/im.exec(fm[1]);
		if (co) coloriSet = coloriValidi(pulisciValore(co[1]).split(/[/;,]/).map((x) => x.trim()));
	}

	const categorie: SetCategoria[] = [];
	const idEspliciti = new Map<SetCategoria, string>();
	let corrente: SetCategoria | null = null;

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
			else errori.push(`il peso del tema «${corrente.nome}» non è valido`);
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

	if (!nome) errori.push("manca il nome (proprietà «nome» in cima alla nota)");
	if (categorie.length === 0) errori.push("non c'è nessun tema (ogni tema inizia con «## Nome»)");

	const idVisti = new Set<string>();
	const nomiVisti = new Set<string>();
	categorie.forEach((c, i) => {
		if (nomiVisti.has(c.nome.toLowerCase())) errori.push(`il tema «${c.nome}» è ripetuto`);
		nomiVisti.add(c.nome.toLowerCase());
		if (c.domande.length === 0) errori.push(`il tema «${c.nome}» non ha domande`);
		if (Number.isNaN(c.peso)) c.peso = 20;
		const esplicito = idEspliciti.get(c);
		let id = slug(esplicito ?? c.nome);
		if (!id) id = `tema_${i + 1}`;
		if (idVisti.has(id)) errori.push(`l'identificativo «${id}» è usato da più temi`);
		idVisti.add(id);
		c.id = id;
	});
	if (categorie.length > 0 && categorie.every((c) => c.peso === 0)) {
		errori.push("tutti i pesi sono zero");
	}
	return { nome, categorie, soglie: soglieSet, colori: coloriSet, errori };
}

function serializzaSet(
	nome: string,
	categorie: SetCategoria[],
	soglieSet: number[] = SOGLIE_STANDARD,
	coloriSet: string[] = COLORI_FASCE
): string {
	const semplice = /^[\p{L}\p{N} ._'()-]+$/u.test(nome);
	const righe = [
		"---",
		`tipo: ${TIPO_SET}`,
		`nome: ${semplice ? nome : JSON.stringify(nome)}`,
		`soglie: ${soglieSet.join(" / ")}`,
		`colori: ${coloriValidi(coloriSet).join(" / ")}`,
		"---",
		"",
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

function totaleDomande(set: { categorie: SetCategoria[] }): number {
	return set.categorie.reduce((somma, c) => somma + c.domande.length, 0);
}

function riassuntoSet(set: { categorie: SetCategoria[] }): string {
	return `${plurale(set.categorie.length, "tema", "temi")} · ${plurale(
		totaleDomande(set),
		"domanda",
		"domande"
	)}`;
}

/* ---- Livello di un set di valutazione ---- */

interface LivelloSet {
	livello: number; // da 1 a 10
	etichetta: string;
	probabilita: number[]; // probabilità (risposte a caso) di ottenere almeno la stella k+1
}

function etichettaLivello(l: number): string {
	if (l < 3) return "Facile";
	if (l < 5) return "Accessibile";
	if (l < 7) return "Impegnativo";
	if (l < 9) return "Difficile";
	return "Molto difficile";
}

/** Probabilità binomiali di k Sì su n domande, con Sì al 50%. */
function binomiale50(n: number): number[] {
	const out: number[] = [];
	let logC = 0;
	for (let k = 0; k <= n; k++) {
		if (k > 0) logC += Math.log((n - k + 1) / k);
		out.push(Math.exp(logC - n * Math.LN2));
	}
	return out;
}

const cacheLivello = new Map<string, LivelloSet>();

/**
 * Livello di difficoltà del set (1-10). Si immagina un lettore che risponde a caso
 * (Sì al 50%): si calcola la probabilità esatta di ogni punteggio ARL e, con le soglie
 * delle stelle in uso, la probabilità di raggiungere ogni stella dalla seconda in poi.
 * Più le stelle sono rare per quel lettore, più il livello è alto.
 */
function calcolaLivello(
	cats: { peso: number; domande: unknown[] }[],
	stelleTotali: number,
	rif: number[]
): LivelloSet | null {
	const temi = cats
		.map((c) => ({ peso: Math.max(0, c.peso), n: c.domande.length }))
		.filter((t) => t.n > 0);
	if (temi.length === 0 || stelleTotali < 2) return null;

	const somma = temi.reduce((a, t) => a + t.peso, 0);
	const pesi = somma > 0 ? temi.map((t) => t.peso / somma) : temi.map(() => 1 / temi.length);

	const chiave = JSON.stringify([temi.map((t, i) => [t.n, Math.round(pesi[i] * 1e6)]), stelleTotali, rif]);
	const inCache = cacheLivello.get(chiave);
	if (inCache) return inCache;

	// distribuzione del punteggio ARL su una griglia di 0,001
	const MAX = 10000;
	let dist = new Float64Array(MAX + 1);
	dist[0] = 1;
	temi.forEach((t, i) => {
		const bin = binomiale50(t.n);
		const quote = bin.map((_, k) => Math.round(((10 * k) / t.n) * pesi[i] * 1000));
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
	const perStella = new Array<number>(stelleTotali).fill(0);
	for (let a = 0; a <= MAX; a++) {
		if (!dist[a]) continue;
		const x = Math.round(a / 100) / 10;
		let k = 0;
		while (k < stelleTotali - 1 && x > sg[k] + 1e-9) k++;
		perStella[k] += dist[a];
	}
	const probabilita = new Array<number>(stelleTotali).fill(0);
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

	// taratura: Romanzi e Saggi (5 temi da 10 domande, scala ARL a 5 stelle) valgono 5
	const livello = arrotonda1(Math.min(10, Math.max(1, 11 * r - 0.72)));
	const esito = { livello, etichetta: etichettaLivello(livello), probabilita };
	cacheLivello.set(chiave, esito);
	return esito;
}

const LIVELLI: { nome: string; significato: string }[] = [
	{ nome: "Facile", significato: "le stelle si prendono con facilità, anche con un libro così così" },
	{ nome: "Accessibile", significato: "le stelle alte richiedono un libro buono, ma non eccezionale" },
	{ nome: "Impegnativo", significato: "per le stelle alte serve un libro davvero bello" },
	{ nome: "Difficile", significato: "le stelle alte sono rare, anche per chi risponde bene" },
	{ nome: "Molto difficile", significato: "le stelle alte sono quasi irraggiungibili" },
];

/** Tabella dei livelli; le righe in `evidenziati` (nome livello → nota) vengono colorate di verde. */
function creaTabellaLivelli(parent: HTMLElement, evidenziati: Map<string, string>) {
	const tabella = parent.createEl("table", { cls: "arl-livelli" });
	const testa = tabella.createEl("thead").createEl("tr");
	testa.createEl("th", { text: "Livello" });
	testa.createEl("th", { text: "Significato" });
	testa.createEl("th", { text: "" });
	const corpo = tabella.createEl("tbody");
	for (const l of LIVELLI) {
		const tr = corpo.createEl("tr");
		const nota = evidenziati.get(l.nome);
		if (nota !== undefined) tr.addClass("is-current");
		tr.createEl("td", { text: l.nome, cls: "arl-titolo-cell arl-nowrap" });
		tr.createEl("td", { text: l.significato });
		tr.createEl("td", { text: nota ?? "", cls: "arl-nowrap arl-livelli-nota" });
	}
}

function fmtPerc(p: number): string {
	if (p < 0.0001) return "<0,01%";
	const v = p * 100;
	if (v >= 99.5) return "100%";
	const dec = v >= 10 ? 0 : v >= 1 ? 1 : 2;
	return `${v.toFixed(dec).replace(".", ",")}%`;
}

function testoLivello(l: LivelloSet | null): string {
	return l ? l.etichetta : "—";
}

const SPIEGAZIONE_LIVELLO =
	"Il livello dice quanto è difficile ottenere stelle con questo set (Facile, Accessibile, Impegnativo, Difficile, Molto difficile): più le stelle sono rare per chi risponde a caso, più il livello è alto. " +
	"Dipende dalle domande, dai pesi e dalle soglie delle stelle di questo set.";

function rispostePerSet(set: { categorie: SetCategoria[] }): Risposta[][] {
	return set.categorie.map((c) => c.domande.map(() => null as Risposta));
}

/* ------------------------------------------------------------------ */
/*  Lettura dell'archivio dalle note                                  */
/* ------------------------------------------------------------------ */

function risposteDaStringa(s: string, lunghezza: number): Risposta[] {
	return Array.from({ length: lunghezza }, (_, i) =>
		s[i] === "S" ? 1 : s[i] === "N" ? 0 : null
	);
}

const SEP_PERSONAGGIO = " | ";
const TITOLO_ANNOTAZIONI = "Estratti e annotazioni";
const TITOLO_PERSONAGGI = "Personaggi";

/** Trova la sezione «## titolo» nel testo: indici di riga [inizio, fine) o null. */
function trovaSezione(righe: string[], titolo: string): [number, number] | null {
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

/** Contenuto della sezione (senza titolo), oppure "". */
function leggiSezione(testo: string, titolo: string): string {
	const righe = testo.split("\n");
	const t = trovaSezione(righe, titolo);
	if (!t) return "";
	return righe.slice(t[0] + 1, t[1]).join("\n").trim();
}

/** Sostituisce, crea o (se vuoto) rimuove la sezione «## titolo». */
function impostaSezione(testo: string, titolo: string, contenuto: string): string {
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

function personaggiDaFm(v: unknown): Personaggio[] {
	if (!Array.isArray(v)) return [];
	const out: Personaggio[] = [];
	for (const x of v) {
		const t = String(x ?? "");
		const i = t.indexOf(SEP_PERSONAGGIO);
		const nome = (i < 0 ? t : t.slice(0, i)).trim();
		const descrizione = i < 0 ? "" : t.slice(i + SEP_PERSONAGGIO.length).trim();
		if (nome) out.push({ nome, descrizione });
	}
	return out;
}

function codiceDaFm(v: unknown): number | null {
	if (v === undefined || v === null || v === "") return null;
	const n = Number(String(v).replace(",", "."));
	return Number.isInteger(n) && n > 0 ? n : null;
}

const TITOLO_LETTURE = "Letture";
const TITOLO_GALLERIA = "Galleria";

/** Immagini della galleria: da «[[x|alias]]» (o «![[x]]») a «x». */
function dividiVoceGalleria(x: unknown): { d: string; t: string } {
	const s = String(x ?? "").replace(/^!/, "");
	const m = /^(.*?\]\])\s*\|\s*([\s\S]*)$/.exec(s);
	return { d: copertinaDaFm(m ? m[1] : s), t: m ? m[2].trim() : "" };
}

function galleriaVociDaFm(v: unknown): { d: string; t: string }[] {
	if (!Array.isArray(v)) return [];
	return v.map(dividiVoceGalleria).filter((x) => x.d);
}

function galleriaDaFm(v: unknown): string[] {
	return galleriaVociDaFm(v).map((x) => x.d);
}

/** Didascalia su una riga sola, al massimo 200 caratteri. */
function pulisciDidascalia(t: string): string {
	return t.replace(/\s+/g, " ").trim().slice(0, 200);
}

/** Pagine lette in una lettura: da 10 a 20 sono 11 pagine (estremi inclusi). */
function pagineLette(r: { da: number; a: number }): number {
	return r.a - r.da + 1;
}

function lettureDaFm(v: unknown): Lettura[] {
	if (!Array.isArray(v)) return [];
	const out: Lettura[] = [];
	for (const x of v) {
		const m = /^\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(\d+)\s*\|\s*(\d+)\s*$/.exec(String(x ?? ""));
		if (!m) continue;
		const da = parseInt(m[2], 10);
		const a = parseInt(m[3], 10);
		if (da >= 1 && a >= da) out.push({ data: m[1], da, a });
	}
	return out.sort((p, q) => p.data.localeCompare(q.data) || p.da - q.da);
}

function isoLocale(d: Date): string {
	const p = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const ESTENSIONI_IMMAGINE = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "avif"];

/** Destinazione del collegamento alla copertina: da «[[x|alias]]» a «x». */
function copertinaDaFm(v: unknown): string {
	let t: unknown = v;
	while (Array.isArray(t)) t = t[0];
	const testo = String(t ?? "").trim();
	if (!testo) return "";
	const m = /\[\[([^\]|#]+)/.exec(testo);
	return (m ? m[1] : testo).trim();
}

/** Porta il testo digitato nella forma «[[destinazione]]» (vuoto se non c'è nulla). */
function normalizzaCopertina(testo: string): string {
	const t = testo.trim();
	if (!t) return "";
	return /^\[\[.+\]\]$/.test(t) ? t : `[[${t.replace(/^\[\[|\]\]$/g, "")}]]`;
}

function leggiLibro(app: App, file: TFile): Libro | null {
	const fm = app.metadataCache.getFileCache(file)?.frontmatter;
	if (!fm || fm.tipo !== TIPO) return null;

	const risposte: Record<string, string> = {};
	const punteggi: Record<string, number> = {};
	for (const k of Object.keys(fm)) {
		if (k.startsWith("risposte_")) {
			risposte[k.slice("risposte_".length)] = String(fm[k] ?? "");
		} else if (k.startsWith("punteggio_")) {
			const n = Number(String(fm[k]).replace(",", "."));
			if (Number.isFinite(n)) punteggi[k.slice("punteggio_".length)] = n;
		}
	}

	const inizio = String(fm.inizio_lettura ?? "").slice(0, 10);
	const fine = String(fm.fine_lettura ?? "").slice(0, 10);

	const pagine = Math.round(Number(fm.pagine));
	const prezzoGrezzo =
		fm.prezzo === undefined || fm.prezzo === null || fm.prezzo === ""
			? NaN
			: Number(String(fm.prezzo).replace(",", "."));
	const restituzione = String(fm.restituzione ?? "").slice(0, 10);

	const haArl = fm.arl !== undefined && fm.arl !== null && fm.arl !== "" && Number.isFinite(Number(fm.arl));
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
		set: String(fm.set ?? "").trim() || (valutato ? "Romanzi" : ""),
		titolo: String(fm.titolo ?? file.basename),
		autore: String(fm.autore ?? ""),
		editore: String(fm.editore_anno ?? ""),
		genere: String(fm.genere ?? "").trim(),
		premio: String(fm.premio ?? "").trim(),
		pagine: Number.isFinite(pagine) && pagine > 0 ? pagine : 0,
		prezzo: Number.isFinite(prezzoGrezzo) && prezzoGrezzo >= 0 ? prezzoGrezzo : null,
		restituzione: /^\d{4}-\d{2}-\d{2}$/.test(restituzione) ? restituzione : "",
		restituito: fm.restituito === true || fm.restituito === "true",
		inizio,
		fine,
		giorni: inizio && fine ? giorniTra(inizio, fine) : 0,
		arl,
		risposte,
		punteggi,
	};
}

/** Le risposte salvate corrispondono ancora, tema per tema, alle domande del set? */
function libroCompatibile(l: Libro, set: SetDomande): boolean {
	if (Object.keys(l.risposte).length !== set.categorie.length) return false;
	return set.categorie.every((c) => {
		const r = l.risposte[c.id];
		return typeof r === "string" && r.length === c.domande.length && /^[SN]+$/.test(r);
	});
}

function nomeTema(id: string, set: SetDomande | undefined): string {
	const dalSet = set?.categorie.find((c) => c.id === id)?.nome;
	if (dalSet) return dalSet;
	const t = id.replace(/_/g, " ");
	return t.charAt(0).toUpperCase() + t.slice(1);
}

function datiVuoti(set: SetDomande): DatiRecensione {
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
		risposte: rispostePerSet(set),
	};
}

function datiDaLibro(l: Libro, set: SetDomande): DatiRecensione {
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
		risposte: set.categorie.map((c) => risposteDaStringa(l.risposte[c.id] ?? "", c.domande.length)),
	};
}

/* ------------------------------------------------------------------ */
/*  Lingua dell'interfaccia (italiano / inglese)                      */
/* ------------------------------------------------------------------ */

type Lingua = "it" | "en";
let LINGUA: Lingua = "it";

/** Frasi intere (corrispondenza esatta) e frasi lunghe (anche dentro testi più grandi). */
const EN: Record<string, string> = {
	// barra e comandi
	"Apri Books and Reviews": "Open Books and Reviews",
	"? Guida": "? Guide",
	"Guida ai set": "Guide to sets",
	"Nessun libro ancora.": "No books yet.",
	"1. Premi «Nuovo libro» e inserisci i dati del libro.": "1. Press «New book» and enter the book's details.",
	"2. A lettura finita, premi «Valuta libro» e rispondi alle domande.": "2. When you finish reading, press «Rate book» and answer the questions.",
	"I libri li inserisci tu; i set di valutazione sono già pronti.": "You add the books yourself; the evaluation sets are already there.",
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
	"le stelle si prendono con facilità, anche con un libro così così": "stars are easy to get, even with a so-so book",
	"le stelle alte richiedono un libro buono, ma non eccezionale": "high stars need a good book, but not an exceptional one",
	"per le stelle alte serve un libro davvero bello": "high stars need a really great book",
	"le stelle alte sono rare, anche per chi risponde bene": "high stars are rare, even for those who answer well",
	"le stelle alte sono quasi irraggiungibili": "high stars are almost unreachable",
	"Il livello dice quanto è difficile ottenere stelle con questo set (Facile, Accessibile, Impegnativo, Difficile, Molto difficile): più le stelle sono rare per chi risponde a caso, più il livello è alto. ": "The level tells how hard it is to earn stars with this set (Easy, Accessible, Demanding, Hard, Very hard): the rarer the stars are for someone answering at random, the higher the level. ",
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
	"La data di fine non può precedere quella di inizio.": "The end date cannot be before the start date.",
	"Modifica dati del libro": "Edit book details",
	"Censisci il libro con i suoi dati. La valutazione si fa dopo, quando lo hai finito, da «Valuta libro».": "Register the book with its details. The rating comes later, once you have finished it, from «Rate book».",
	"Codice": "Code",
	"Numero progressivo del libro: proposto in automatico (il più alto + 1), puoi cambiarlo.": "Sequential book number: suggested automatically (highest + 1), you can change it.",
	"Titolo": "Title",
	"Autore": "Author",
	"Editore, anno": "Publisher, year",
	"Genere": "Genre",
	"Premio": "Award",
	"Colonne della lista": "List columns",
	"Scegli quali colonne mostrare e in che ordine: trascina ⋮⋮ per spostare. Titolo e Autore sono sempre visibili. Vale per Libreria e Valuta libro.": "Choose which columns to show and in what order: drag ⋮⋮ to move. Title and Author are always visible. Applies to Library and Rate book.",
	"sempre visibile": "always visible",
	"Ripristina colonne predefinite": "Restore default columns",
	"Facoltativo: premio o riconoscimento ricevuto dal libro.": "Optional: award or prize won by the book.",
	"Fantascienza, Fantasy, Thriller…": "Sci-fi, Fantasy, Thriller…",
	"Pagine totali": "Total pages",
	"Prezzo (€)": "Price (€)",
	"Copertina": "Cover",
	"Immagine non trovata nel vault.": "Image not found in the vault.",
	"Collegamento a un'immagine, per esempio [[Copertine/dune.jpg]].": "Link to an image, for example [[Covers/dune.jpg]].",
	"Scegli…": "Choose…",
	"Nel vault non ci sono immagini.": "There are no images in the vault.",
	"Dal computer…": "From computer…",
	"Copertina aggiunta al vault.": "Cover added to the vault.",
	"Rimuovi": "Remove",
	"La data di fine è precedente alla data di inizio.": "The end date is before the start date.",
	"Inizio lettura": "Reading start",
	"Facoltativa: puoi inserirla anche più tardi.": "Optional: you can enter it later.",
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
	"● modificata": "● modified",
	"Salva come…": "Save as…",
	"Ripristina": "Restore",
	"Altre azioni": "More actions",
	"Rinomina": "Rename",
	"Salva la disposizione come": "Save the arrangement as",
	"Rinomina la disposizione": "Rename the arrangement",
	"Duplica la disposizione": "Duplicate the arrangement",
	"Nome della disposizione": "Arrangement name",
	"Scrivi un nome.": "Enter a name.",
	"Esiste già una disposizione con questo nome.": "An arrangement with this name already exists.",
	"Codice: dal più alto al più basso": "Code: from highest to lowest",
	"Codice: dal più basso al più alto": "Code: from lowest to highest",
	"Lettura: dalla più recente alla più vecchia": "Reading: from most recent to oldest",
	"Lettura: dalla più vecchia alla più recente": "Reading: from oldest to most recent",
	"Pagine: dal libro con più pagine a quello con meno": "Pages: from the book with most pages to the one with fewest",
	"Pagine: dal libro con meno pagine a quello con più": "Pages: from the book with fewest pages to the one with most",
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
	"Cancella le posizioni scelte trascinando e riporta i libri in ordine di codice, dal più alto al più basso.": "Clears the positions chosen by dragging and puts the books back in code order, from highest to lowest.",
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
	"2. La trama è originale?": "2. Is the plot original?",
	"Attenzione: i due colori sono troppo simili, il testo potrebbe essere poco leggibile.": "Warning: the two colours are too similar, the text may be hard to read.",
	"Modifica didascalia": "Edit caption",
	"Didascalia (facoltativa)": "Caption (optional)",
	"Salva": "Save",
	"Salva libro": "Save book",
	"Dati salvati.": "Details saved.",
	"Libro aggiunto alla libreria.": "Book added to the library.",
	"Cerca un'immagine nel vault…": "Search for an image in the vault…",
	// valutazione
	"Indietro": "Back",
	"Aggiorna valutazione": "Update rating",
	"Scegli il set di valutazione: domande mirate, suddivise per tematiche.": "Choose the evaluation set: targeted questions grouped by theme.",
	"← questo set": "← this set",
	"Inizia valutazione": "Start rating",
	"Avanti": "Next",
	"Sì": "Yes",
	"No": "No",
	"Risultato": "Result",
	"Punteggio ARL": "ARL score",
	"Salva valutazione": "Save rating",
	"Valutazione salvata.": "Rating saved.",
	"Valutazione manuale": "Manual rating",
	"Inserisci direttamente il punteggio ARL (da 0 a 10), senza rispondere alle domande: le stelle si calcolano da sole. Sostituisce l'eventuale valutazione già presente.": "Enter the ARL score directly (0 to 10), without answering the questions: stars are computed automatically. It replaces any existing rating.",
	"Inserisci un numero da 0 a 10, per esempio 7,0.": "Enter a number from 0 to 10, for example 7.0.",
	"Salva valutazione manuale": "Save manual rating",
	"Il punteggio ARL deve essere un numero da 0 a 10, per esempio 7,0.": "The ARL score must be a number from 0 to 10, for example 7.0.",
	"Valutazione manuale salvata.": "Manual rating saved.",
	"Impossibile salvare la valutazione.": "Unable to save the rating.",
	"Valutazione manuale: il punteggio ARL è stato inserito direttamente, senza le domande.": "Manual rating: the ARL score was entered directly, without the questions.",
	"Da valutare: quando hai finito il libro premi «Valuta».": "To rate: when you finish the book press «Rate».",
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
	"Scegli il libro da valutare: in alto quelli ancora senza valutazione, poi quelli già valutati (di cui puoi aggiornare la valutazione).": "Choose the book to rate: unrated books on top, then already rated ones (whose rating you can update).",
	"Cerca per titolo, autore, editore, genere o set": "Search by title, author, publisher, genre or set",
	"Tutti i libri": "All books",
	"Da valutare": "To rate",
	"Valutati": "Rated",
	"Nessun libro in libreria. Usa «Nuovo libro» per aggiungere il primo.": "No books in the library. Use «New book» to add the first one.",
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
	"La pagina finale non può essere minore di quella iniziale.": "The last page cannot be lower than the first page.",
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
	"Scrivi qui estratti, citazioni, note e impressioni sul libro…": "Write excerpts, quotes, notes and impressions about the book here…",
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
	"Ogni domanda ha risposta Sì o No: i Sì determinano il punteggio del tema (da 0 a 10) e la media dei temi, secondo i pesi, dà il punteggio ARL da cui derivano le stelle. ": "Each question is answered Yes or No: the Yes answers set the theme score (0 to 10) and the weighted average of the themes gives the ARL score, from which the stars derive. ",
	"Il set si sceglie quando valuti un libro: Romanzi e Saggi sono già pronti, e puoi crearne di tuoi.": "You pick the set when you rate a book: Novels and Essays are ready-made, and you can create your own.",
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
	"Ogni casella indica fino a quale punteggio ARL si ottengono 1, 2, 3 e 4 stelle. La quinta stella non ha una casella: comincia subito dopo il limite delle 4 stelle e arriva fino a 10. Per questo l'ultima casella può arrivare al massimo a 9,9 (con 9,9 la quinta stella si ottiene solo con 10,0). Con un numero di stelle diverso da 5 le soglie si ridistribuiscono in proporzione. Più sono alte, più il set è severo.": "Each box shows up to which ARL score you get 1, 2, 3 and 4 stars. The fifth star has no box: it starts right after the 4-star limit and goes up to 10. That is why the last box can be at most 9.9 (with 9.9 the fifth star is only earned with 10.0). With a number of stars other than 5 the thresholds are redistributed proportionally. The higher they are, the stricter the set.",
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
	"Domanda a cui si risponde Sì o No": "Question answered Yes or No",
	"Elimina domanda": "Delete question",
	"Serve almeno una domanda per tema.": "At least one question per theme is needed.",
	"+ Aggiungi domanda": "+ Add question",
	"Set salvato.": "Set saved.",
	"Sposta su": "Move up",
	"Sposta giù": "Move down",
	"Scrivi il nome del set.": "Enter the set name.",
	"Ogni tema deve avere un nome.": "Every theme must have a name.",
	"Almeno un tema deve avere un peso maggiore di zero.": "At least one theme must have a weight greater than zero.",
	"Impossibile aggiungere la copertina": "Unable to add the cover",
	// convalida file set
	"le soglie delle stelle non sono valide (servono 4 valori crescenti tra 0 e 10, per esempio «3 / 5 / 7 / 9»)": "the star thresholds are not valid (4 increasing values between 0 and 10 are needed, for example «3 / 5 / 7 / 9»)",
	"manca il nome (proprietà «nome» in cima alla nota)": "the name is missing («nome» property at the top of the note)",
	"non c'è nessun tema (ogni tema inizia con «## Nome»)": "there is no theme (each theme starts with «## Name»)",
	"tutti i pesi sono zero": "all weights are zero",
	"il file non è un'immagine supportata": "the file is not a supported image",
	// opzioni
	"Lingua / Language": "Lingua / Language",
	"Lingua dell'interfaccia": "Interface language",
	"Lingua dei menu e dei messaggi del plugin. Non modifica i tuoi set né le note già scritte.": "Language of the plugin's menus and messages. It does not change your sets or notes already written.",
	"Cartella di salvataggio": "Save folder",
	"Le nuove recensioni vengono create qui come note.": "New reviews are created here as notes.",
	"Cartella dei set di valutazione": "Evaluation sets folder",
	"Qui si trovano le note dei set di valutazione: «Recensione Romanzi», «Recensione Saggi» e i tuoi.": "This is where the evaluation set notes live: «Recensione Romanzi», «Recensione Saggi» and your own.",
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
	"Personalizzato…": "Custom…",
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
	"Il libro con più pagine": "The book with the most pages",
	"Il libro con meno pagine": "The book with the fewest pages",
	"Il libro più costoso": "The most expensive book",
	"Il libro che costa meno": "The cheapest book",
	"Tempi di lettura": "Reading times",
	"Pausa massima tra due libri": "Longest break between two books",
	"Pausa minima tra due libri": "Shortest break between two books",
	"Il periodo di lettura più lungo": "The longest reading period",
	"Il periodo di lettura più breve": "The shortest reading period",
	"Generi": "Genres",
	"Il genere più letto": "The most read genre",
	"Il genere meno letto": "The least read genre",
	"Senza genere": "No genre",
	"Barra dei totali della lista": "List totals bar",
	"Numero di libri e totale in euro": "Number of books and total in euros",
	"Quanti libri sono mostrati e la somma dei prezzi.": "How many books are shown and the sum of their prices.",
	"Libri per numero di stelle": "Books per star rating",
	"Quanti libri hanno 5, 4, 3… stelle, più quelli ancora da valutare.": "How many books have 5, 4, 3… stars, plus those still to be rated.",
	"Libro con più pagine": "Book with the most pages",
	"Il libro più lungo tra quelli mostrati.": "The longest book among those shown.",
	"Libro con meno pagine": "Book with the fewest pages",
	"Il libro più corto tra quelli mostrati.": "The shortest book among those shown.",
	"Generi letti": "Genres read",
	"I primi 5 generi per numero di libri letti.": "The top 5 genres by number of books read.",
	"Libro con più pagine:": "Book with the most pages:",
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
	"Barre dei temi, punteggio ARL e lista prendono il colore della fascia di voto. I colori si scelgono in ogni set (Set di valutazione → Modifica).": "Theme bars, ARL score and list take the colour of the score band. Colours are chosen in each set (Evaluation sets → Edit).",
	"Barre sfumate tra le fasce": "Gradient bars across bands",
	"Se attivo, la barra passa gradualmente dal colore delle fasce più basse a quello della fascia raggiunta; altrimenti è tinta unita.": "When on, the bar moves gradually from the colour of the lowest bands to that of the band reached; otherwise it is a solid colour.",
	"Le soglie per assegnare le stelle si impostano in ogni set di valutazione (Set di valutazione → Modifica).": "Star thresholds are set in each evaluation set (Evaluation sets → Edit).",
};

/** Unità con numero davanti: "3 giorni" → "3 days". */
const UNITA: Record<string, [string, string]> = {
	giorno: ["day", "days"], giorni: ["day", "days"],
	ora: ["hour", "hours"], ore: ["hour", "hours"],
	mese: ["month", "months"], mesi: ["month", "months"],
	libro: ["book", "books"], libri: ["book", "books"],
	tema: ["theme", "themes"], temi: ["theme", "themes"],
	domanda: ["question", "questions"], domande: ["question", "questions"],
	stella: ["star", "stars"], stelle: ["star", "stars"],
	pagina: ["page", "pages"], pagine: ["page", "pages"],
};
const PLUR = (n: string, w: string): string => {
	const u = UNITA[w];
	return `${n} ${n === "1" ? u[0] : u[1]}`;
};

/** Frasi con parti variabili (corrispondenza dell'intero testo). */
const REGOLE: [RegExp, (m: RegExpMatchArray) => string][] = [
	[/^Scaduto da (.+)$/, (m) => `Overdue by ${m[1]}`],
	[/^Tema (\d+)$/, (m) => `Theme ${m[1]}`],
	[/^Tema (\d+) di (\d+) · domande (\d+)–(\d+) di (\d+)$/, (m) => `Theme ${m[1]} of ${m[2]} · questions ${m[3]}–${m[4]} of ${m[5]}`],
	[/^Punteggio (.+): (.+ \/ 10)$/, (m) => `Score ${m[1]}: ${m[2]}`],
	[/^· (\d+) da rispondere$/, (m) => `· ${m[1]} to answer`],
	[/^peso (.+)%$/, (m) => `weight ${m[1]}%`],
	[/^(\d+) su (\d+) stelle$/, (m) => `${m[1]} of ${m[2]} stars`],
	[/^Codice (\d+)$/, (m) => `Code ${m[1]}`],
	[/^Set di valutazione: (.+)$/, (m) => `Evaluation set: ${m[1]}`],
	[/^Prezzo: (.+)$/, (m) => `Price: ${m[1]}`],
	[/^Premio: (.+)$/, (m) => `Award: ${m[1]}`],
	[/^Restituzione: (.+) ·$/, (m) => `Return date: ${m[1]} ·`],
	[/^Durata: (.+)$/, (m) => `Duration: ${m[1]}`],
	[/^Copertina di (.+)$/, (m) => `Cover of ${m[1]}`],
	[/^Totale: (\d+) pagine(?: su (\d+) · (\d+) pagine rimanenti)? · (\d+) giorn[io] di lettura · media (.+) pagine al giorno$/,
		(m) => `Total: ${PLUR(m[1], "pagine")}${m[2] ? ` out of ${m[2]} · ${m[3]} pages remaining` : ""} · ${m[4]} reading ${m[4] === "1" ? "day" : "days"} · average ${m[5].replace(",", ".")} pages per day`],
	[/^Attenzione: una lettura supera le (\d+) pagine del libro\.$/, (m) => `Warning: a reading exceeds the book's ${m[1]} pages.`],
	[/^Da valutare (\d+)$/, (m) => `To rate ${m[1]}`],
	[/^(.+) · Totale (.+)$/, (m) => `${tr(m[1])} · Total ${m[2]}`],
	[/^Ha già una valutazione \(ARL (.+)\): proseguendo la aggiornerai\. (.+)$/, (m) => `It already has a rating (ARL ${m[1]}): continuing will update it. ${tr(m[2])}`],
	[/^(.+) · Livello (.+)\.$/, (m) => `${tr(m[1])} · Level ${tr(m[2])}.`],
	[/^Personaggi \((\d+)\)$/, (m) => `Characters (${m[1]})`],
	[/^Andamento lettura \((\d+)\)$/, (m) => `Reading progress (${m[1]})`],
	[/^Domande \((\d+)\)$/, (m) => `Questions (${m[1]})`],
	[/^Domande del tema «(.+)»$/, (m) => `Questions of theme «${m[1]}»`],
	[/^Con (\d+) stell[ae]$/, (m) => `With ${PLUR(m[1], "stelle")}`],
	[/^Risposte a caso, probabilità di ottenere almeno: (.+)$/, (m) => `Random answers, chance of getting at least: ${m[1]}`],
	[/^(★+) da (.+) a 10$/, (m) => `${m[1]} from ${m[2]} to 10`],
	[/^Totale pesi: (.+)% \(vengono riportati a 100\)$/, (m) => `Total weights: ${m[1]}% (scaled to 100)`],
	[/^(.+) · punteggio del tema da 0 a 10$/, (m) => `${tr(m[1])} · theme score from 0 to 10`],
	[/^(.+) \(predefinito, non ancora salvato\)$/, (m) => `${m[1]} (default, not saved yet)`],
	[/^(\d+) (?:libro usa|libri usano) questo set\. I loro punteggi non cambiano; se modifichi le domande, le loro risposte non si potranno più rivedere\.$/,
		(m) => `${PLUR(m[1], "libro")} ${m[1] === "1" ? "uses" : "use"} this set. Their scores do not change; if you edit the questions, their answers can no longer be reviewed.`],
	[/^(\d+) libr[io] aggiornat[io] con il nuovo nome del set\.$/, (m) => `${PLUR(m[1], "libro")} updated with the new set name.`],
	[/^Il codice (\d+) è già usato da «(.+)»\.$/, (m) => `Code ${m[1]} is already used by «${m[2]}».`],
	[/^Impossibile aggiungere l'immagine: (.+)$/, (m) => `Unable to add the image: ${m[1]}`],
	[/^Galleria immagini \((\d+)\)$/, (m) => `Image gallery (${m[1]})`],
	[/^Galleria immagini — (.+)$/, (m) => `Image gallery — ${m[1]}`],
	[/^Impossibile aggiungere la copertina: (.+)$/, (m) => `Unable to add the cover: ${m[1]}`],
	[/^Salvataggio non riuscito: (.+)$/, (m) => `Save failed: ${m[1]}`],
	[/^Esiste già un set chiamato «(.+)»\.$/, (m) => `A set named «${m[1]}» already exists.`],
	[/^[Ee]siste già un altro set chiamato «(.+)»$/, (m) => `another set named «${m[1]}» already exists`],
	[/^Il tema «(.+)» è ripetuto\.?$/, (m) => `The theme «${m[1]}» is repeated.`],
	[/^Il tema «(.+)» non ha domande\.?$/, (m) => `The theme «${m[1]}» has no questions.`],
	[/^il tema «(.+)» è ripetuto$/, (m) => `the theme «${m[1]}» is repeated`],
	[/^il tema «(.+)» non ha domande$/, (m) => `the theme «${m[1]}» has no questions`],
	[/^il peso del tema «(.+)» non è valido$/, (m) => `the weight of theme «${m[1]}» is not valid`],
	[/^l'identificativo «(.+)» è usato da più temi$/, (m) => `the identifier «${m[1]}» is used by more than one theme`],
	[/^Il set «(.+)» è stato modificato dopo questa valutazione: i punteggi restano, ma le risposte non si possono più rivedere\.$/,
		(m) => `The set «${m[1]}» was modified after this rating: the scores stay, but the answers can no longer be reviewed.`],
	[/^Il set di valutazione «(.+)» non esiste più: i punteggi restano, ma le risposte non si possono più rivedere\.$/,
		(m) => `The evaluation set «${m[1]}» no longer exists: the scores stay, but the answers can no longer be reviewed.`],
	[/^il set «(.+)» non esiste$/, (m) => `the set «${m[1]}» does not exist`],
	[/^Ogni set è una nota nella cartella «(.+)»\.$/, (m) => `Each set is a note in the folder «${m[1]}».`],
	[/^Ora: (.+)\.$/, (m) => `Now: ${m[1]}.`],
	[/^(.+) — meglio sotto i 2000 px di larghezza\.$/, (m) => `${m[1]} — better under 2000 px wide.`],
	[/^Immagine non trovata nel vault: (.+)$/, (m) => `Image not found in the vault: ${m[1]}`],
	[/^Eliminare la disposizione «(.+)»\? I libri restano come sono ora\.$/, (m) => `Delete the arrangement «${m[1]}»? The books stay as they are now.`],
];

const RE_NUM = /\b(\d+) (giorni|giorno|ore|ora|mesi|mese|libri|libro|temi|tema|domande|domanda|stelle|stella|pagine|pagina)\b/g;

let CHIAVI_LUNGHE: string[] | null = null;
function chiaviLunghe(): string[] {
	if (!CHIAVI_LUNGHE) CHIAVI_LUNGHE = Object.keys(EN).filter((k) => k.length >= 40);
	return CHIAVI_LUNGHE;
}

function trTesto(s: string): string {
	if (EN[s] !== undefined) return EN[s];
	for (const [re, fn] of REGOLE) {
		const m = s.match(re);
		if (m) {
			s = fn(m);
			break;
		}
	}
	// frasi lunghe dentro testi composti
	for (const k of chiaviLunghe()) {
		if (s.includes(k)) s = s.split(k).join(EN[k]);
	}
	s = s.replace(RE_NUM, (_x, n: string, w: string) => PLUR(n, w));
	s = s.replace(/(\d+ (?:days?)) e (?=\d+ hours?)/g, "$1 and ");
	s = s.replace(/ Ora: /g, " Now: ");
	return s;
}

/** Traduce un testo dell'interfaccia (da italiano) nella lingua scelta. */
function tr(s: string): string {
	if (LINGUA !== "en" || !s) return s;
	const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/);
	if (!m || !m[2]) return s;
	return m[1] + trTesto(m[2]) + m[3];
}

/** Traduzione automatica dei testi che le schermate scrivono nel DOM. */
const RADICI = new Map<HTMLElement, MutationObserver>();
const REC_TESTO = new WeakMap<Node, { o: string; s: string }>();
const REC_ATTR = new WeakMap<Element, Map<string, { o: string; s: string }>>();
const ATTR_TRAD = ["placeholder", "aria-label", "title", "alt"];

function trNodo(n: Text) {
	const r = REC_TESTO.get(n);
	const o = r && n.data === r.s ? r.o : n.data;
	const s = tr(o);
	if (s !== n.data) n.data = s;
	REC_TESTO.set(n, { o, s });
}

function trAttributi(el: Element) {
	for (const a of ATTR_TRAD) {
		const v = el.getAttribute(a);
		if (v === null) continue;
		let mappa = REC_ATTR.get(el);
		if (!mappa) {
			mappa = new Map();
			REC_ATTR.set(el, mappa);
		}
		const r = mappa.get(a);
		const o = r && v === r.s ? r.o : v;
		const s = tr(o);
		if (s !== v) el.setAttribute(a, s);
		mappa.set(a, { o, s });
	}
}

function trAlbero(radice: Node) {
	if (radice.nodeType === Node.TEXT_NODE) {
		trNodo(radice as Text);
		return;
	}
	if (radice.nodeType !== Node.ELEMENT_NODE) return;
	const el = radice as Element;
	trAttributi(el);
	const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
	let n: Node | null = w.nextNode();
	while (n) {
		if (n.nodeType === Node.TEXT_NODE) trNodo(n as Text);
		else trAttributi(n as Element);
		n = w.nextNode();
	}
}

function collegaTraduzione(radice: HTMLElement) {
	if (RADICI.has(radice)) return;
	const obs = new MutationObserver((muts) => {
		for (const mu of muts) {
			if (mu.type === "characterData") trNodo(mu.target as Text);
			else if (mu.type === "attributes") trAttributi(mu.target as Element);
			else mu.addedNodes.forEach((x) => trAlbero(x));
		}
	});
	obs.observe(radice, {
		childList: true,
		subtree: true,
		characterData: true,
		attributes: true,
		attributeFilter: ATTR_TRAD,
	});
	RADICI.set(radice, obs);
	trAlbero(radice);
}

function scollegaTraduzione(radice: HTMLElement) {
	RADICI.get(radice)?.disconnect();
	RADICI.delete(radice);
}

function impostaLingua(l: Lingua) {
	LINGUA = l === "en" ? "en" : "it";
	for (const [r, obs] of [...RADICI]) {
		if (!r.isConnected) {
			obs.disconnect();
			RADICI.delete(r);
		} else trAlbero(r);
	}
}

/** Notice che traduce il messaggio nella lingua scelta. */
class NoticeT extends Notice {
	constructor(messaggio: string, durata?: number) {
		super(tr(messaggio), durata);
	}
}

/* ------------------------------------------------------------------ */
/*  Grafico dell'andamento della lettura                               */
/* ------------------------------------------------------------------ */

interface StileGrafico {
	c1: string;
	c2: string;
	sfumato: boolean;
	sp: number;
}

/** Pagine lette per ogni giorno, dal primo all'ultimo (i giorni senza lettura valgono 0). */
function paginePerGiorno(letture: { data: string; da: number; a: number }[]): { data: string; pagine: number }[] {
	if (!letture.length) return [];
	const somme = new Map<string, number>();
	for (const r of letture) somme.set(r.data, (somme.get(r.data) ?? 0) + pagineLette(r));
	const date = [...somme.keys()].sort();
	const out: { data: string; pagine: number }[] = [];
	const t = (s: string) => {
		const [y, m, d] = s.split("-").map(Number);
		return Date.UTC(y, m - 1, d);
	};
	const fine = t(date[date.length - 1]);
	for (let x = t(date[0]); x <= fine; x += 86400000) {
		const iso = new Date(x).toISOString().slice(0, 10);
		out.push({ data: iso, pagine: somme.get(iso) ?? 0 });
	}
	return out;
}

/** Curva morbida che non scende sotto i punti (interpolazione monotona). */
function percorsoCurva(p: [number, number][]): string {
	const n = p.length;
	if (n === 0) return "";
	if (n === 1) return `M${p[0][0]},${p[0][1]}`;
	const dx: number[] = [];
	const m: number[] = [];
	for (let i = 0; i < n - 1; i++) {
		dx.push(p[i + 1][0] - p[i][0]);
		m.push((p[i + 1][1] - p[i][1]) / dx[i]);
	}
	const t: number[] = [m[0]];
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

let CONTA_GRAFICI = 0;

/** Disegna il grafico (SVG) delle pagine lette per giorno dentro `box`. */
function disegnaGrafico(
	box: HTMLElement,
	punti: { data: string; pagine: number }[],
	stile: StileGrafico,
	conTooltip = true
) {
	box.empty();
	box.addClass("arl-grafico");
	const NS = "http://www.w3.org/2000/svg";
	const el = (nome: string, attr: Record<string, string | number>, padre?: Element) => {
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

	// scala verticale "tonda"
	const max = Math.max(1, ...punti.map((p) => p.pagine));
	const passi = [1, 2, 5, 10];
	let passo = 1;
	outer: for (let mag = 1; mag < 1e7; mag *= 10) {
		for (const s of passi) {
			if ((max * 1.08) / (s * mag) <= 5) {
				passo = s * mag;
				break outer;
			}
		}
	}
	const top = Math.ceil((max * 1.05) / passo) * passo;

	const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
	const defs = el("defs", {}, svg);
	const grad = el("linearGradient", { id: `${id}-g`, gradientUnits: "userSpaceOnUse", x1: L, y1: 0, x2: W - R, y2: 0 }, defs);
	el("stop", { offset: "0%", "stop-color": stile.c1 }, grad);
	el("stop", { offset: "100%", "stop-color": stile.sfumato ? stile.c2 : stile.c1 }, grad);

	// griglia e valori verticali
	for (let v = 0; v <= top; v += passo) {
		const y = base - (v / top) * (base - T);
		el("line", { x1: L, x2: W - R, y1: y, y2: y, class: "arl-gr-griglia" }, svg);
		const tx = el("text", { x: L - 8, y: y + 4, "text-anchor": "end", class: "arl-gr-testo" }, svg);
		tx.textContent = String(v);
	}

	const n = punti.length;
	const xDi = (i: number) => (n === 1 ? (L + W - R) / 2 : L + (i / (n - 1)) * (W - R - L));
	const yDi = (v: number) => base - (v / top) * (base - T);
	const pts: [number, number][] = punti.map((p, i) => [xDi(i), yDi(p.pagine)]);

	// valori orizzontali (giorni)
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

	if (conTooltip && n > 0) {
		const tip = box.createDiv({ cls: "arl-gr-tip" });
		tip.addClass("arl-oculto");
		svg.addEventListener("mousemove", (ev: MouseEvent) => {
			const r = svg.getBoundingClientRect();
			const x = ((ev.clientX - r.left) / r.width) * W;
			let k = 0;
			let dMin = Infinity;
			pts.forEach(([px], i) => {
				const dd = Math.abs(px - x);
				if (dd < dMin) {
					dMin = dd;
					k = i;
				}
			});
			marcatore.setAttribute("cx", String(pts[k][0]));
			marcatore.setAttribute("cy", String(pts[k][1]));
			marcatore.setAttribute("visibility", "visible");
			tip.setText(`${fmtData(punti[k].data)} · ${plurale(punti[k].pagine, "pagina", "pagine")}`);
			tip.removeClass("arl-oculto");
			const px = (pts[k][0] / W) * r.width;
			const py = (pts[k][1] / H) * r.height;
			tip.style.left = `${Math.min(Math.max(px, 60), r.width - 60)}px`;
			tip.style.top = `${Math.max(py - 34, 0)}px`;
		});
		svg.addEventListener("mouseleave", () => {
			marcatore.setAttribute("visibility", "hidden");
			tip.addClass("arl-oculto");
		});
	}
}

/* ------------------------------------------------------------------ */
/*  Plugin                                                            */
/* ------------------------------------------------------------------ */

export default class BooksAndReviewsPlugin extends Plugin {
	settings: ARLSettings = { ...DEFAULTS };
	sets: SetDomande[] = [];
	statoListe: Partial<Record<"libreria" | "valuta", StatoLista>> = {};
	setNonValidi: SetNonValido[] = [];

	async onload() {
		await this.caricaImpostazioni();

		this.registerView(VIEW_TYPE, (leaf) => new MainView(leaf, this));

		this.addRibbonIcon("book-open", "Books and Reviews", () => {
			void this.apri();
		});

		this.addCommand({
			id: "apri",
			name: tr("Apri Books and Reviews"),
			callback: () => void this.apri(),
		});
		this.addCommand({
			id: "nuovo-libro",
			name: tr("Nuovo libro"),
			callback: () => void this.apri("nuovo"),
		});
		this.addCommand({
			id: "apri-archivio",
			name: tr("Libreria"),
			callback: () => void this.apri("libreria"),
		});
		this.addCommand({
			id: "libreria-virtuale",
			name: tr("Libreria virtuale"),
			callback: () => void this.apri("virtuale"),
		});
		this.addCommand({
			id: "nuova-recensione",
			name: tr("Valuta libro"),
			callback: () => void this.apri("valuta"),
		});
		this.addCommand({
			id: "set-di-domande",
			name: tr("Set di valutazione"),
			callback: () => void this.apri("set"),
		});

		this.addSettingTab(new ARLSettingTab(this.app, this));

		this.app.workspace.onLayoutReady(() => {
			void this.inizializzaSet();
		});

		// Entrando nel plugin le barre si chiudono, passando a un'altra scheda tornano come prima
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
		const d = ((await this.loadData()) ?? {}) as Partial<ARLSettings>;
		const s: ARLSettings = { ...DEFAULTS, ...d };
		if (Array.isArray(d.pesi) && d.pesi.length === 5) {
			s.pesi = d.pesi.map((p) => (Number.isFinite(Number(p)) ? Number(p) : 0));
		} else {
			delete s.pesi;
		}
		if (![1, 2, 5, 10].includes(s.domandePerSchermata)) {
			s.domandePerSchermata = 5;
		}
		s.larghezza = Number.isFinite(Number(s.larghezza))
			? Math.round(Number(s.larghezza)) === 0
				? 0
				: Math.min(2400, Math.max(600, Math.round(Number(s.larghezza))))
			: DEFAULTS.larghezza;
		s.spessoreBarra = Math.min(40, Math.max(6, Math.round(Number(s.spessoreBarra)) || DEFAULTS.spessoreBarra));
		s.stelleTotali = Math.min(10, Math.max(3, Math.round(s.stelleTotali) || 5));
		if (d.lingua !== "it" && d.lingua !== "en") {
			// primo avvio: usa la lingua di Obsidian
			let loc = "";
			try {
				loc = getLanguage();
			} catch {
				/* ignora */
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
			const g: Record<string, string> = {};
			if (s.vlGeneri && typeof s.vlGeneri === "object") {
				for (const [k, v] of Object.entries(s.vlGeneri)) if (/^#[0-9a-f]{6}$/i.test(String(v))) g[k] = String(v);
			}
			s.vlGeneri = g;
		}
		{
			const visti = new Set<string>();
			const out: { nome: string; ordine: string[] }[] = [];
			for (const d of Array.isArray(s.vlDisposizioni) ? s.vlDisposizioni : []) {
				const nome = typeof d?.nome === "string" ? d.nome.trim() : "";
				if (!nome || visti.has(nome.toLowerCase())) continue;
				visti.add(nome.toLowerCase());
				out.push({ nome, ordine: Array.isArray(d.ordine) ? d.ordine.filter((p) => typeof p === "string") : [] });
			}
			s.vlDisposizioni = out;
			s.vlCorrente = out.some((d) => d.nome === s.vlCorrente) ? s.vlCorrente : "";
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
			const note = new Set(COLONNE.map((c) => c.chiave as string));
			const ordine = (Array.isArray(s.colonneOrdine) ? s.colonneOrdine : []).filter(
				(k, i, a) => note.has(k) && a.indexOf(k) === i
			);
			COLONNE.forEach((c, i) => {
				if (ordine.includes(c.chiave)) return;
				// una colonna nuova va nella sua posizione abituale: prima della successiva già presente
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
		delete (s as unknown as Record<string, unknown>).metodo; // le soglie ora sono nei set
		if (!s.cartellaSet || !s.cartellaSet.trim()) s.cartellaSet = DEFAULTS.cartellaSet;
		this.settings = s;
	}

	async salvaImpostazioni() {
		await this.saveData(this.settings);
	}

	/* ---- Schermo pieno: barre laterali ---- */

	private barrePrecedenti: { sx: boolean; dx: boolean } | null = null;

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
	stileBarra(): { fill: string; sp: number } {
		const ok = (c: string, d: string) => (/^#[0-9a-f]{6}$/i.test(c) ? c : d);
		const c1 = ok(this.settings.coloreBarra, DEFAULTS.coloreBarra);
		const c2 = ok(this.settings.coloreBarraFine, DEFAULTS.coloreBarraFine);
		return {
			fill: this.settings.barraSfumata ? `linear-gradient(90deg, ${c1}, ${c2})` : c1,
			sp: this.settings.spessoreBarra,
		};
	}

	/** Applica la larghezza scelta a tutte le schede del plugin aperte. */
	applicaLarghezza() {
		const l = this.settings.larghezza;
		const { fill, sp } = this.stileBarra();
		for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
			const el = (leaf.view as { contentEl?: HTMLElement }).contentEl;
			if (!el) continue;
			el.style.setProperty("--arl-larghezza", l > 0 ? `${l}px` : "none");
			el.style.setProperty("--arl-barra-fill", fill);
			el.style.setProperty("--arl-barra-sp", `${sp}px`);
			el.style.setProperty("--arl-gal-w", `${this.settings.galleriaMiniatura}px`);
			el.style.setProperty("--arl-ev-sfondo", this.settings.evidenziaSfondo);
			el.style.setProperty("--arl-ev-testo", this.settings.evidenziaTesto);
			el.style.setProperty("--arl-tema-sp", `${this.settings.spessoreTemi}px`);
			el.style.setProperty("--arl-cop-h", `${this.settings.altezzaCopertina}px`);
			el.style.setProperty("--arl-cop-w", `${Math.round((this.settings.altezzaCopertina * 170) / 240)}px`);
			this.applicaTesto(el);
		}
	}

	/** Colonne della lista da mostrare, nell'ordine scelto nelle opzioni. */
	colonneAttive(): typeof COLONNE {
		const nascoste = new Set(this.settings.colonneNascoste);
		const out: typeof COLONNE = [];
		for (const k of this.settings.colonneOrdine) {
			const c = COLONNE.find((x) => x.chiave === k);
			if (c && (COLONNE_OBBLIGATORIE.includes(k) || !nascoste.has(k))) out.push(c);
		}
		return out;
	}

	stileGrafico(): StileGrafico {
		const ok = (c: string, d: string) => (/^#[0-9a-f]{6}$/i.test(c) ? c : d);
		return {
			c1: ok(this.settings.coloreGrafico, DEFAULTS.coloreGrafico),
			c2: ok(this.settings.coloreGraficoFine, DEFAULTS.coloreGraficoFine),
			sfumato: this.settings.graficoSfumato,
			sp: this.settings.spessoreGrafico,
		};
	}

	/** Font, dimensione e colore del testo del plugin (vuoto/0 = quelli del tema). */
	applicaTesto(el: HTMLElement) {
		const { fontFamiglia: f, fontDimensione: d, coloreTesto: c } = this.settings;
		const imposta = (nome: string, valore: string | null) => {
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

	cartellaSetEff(): string {
		return normalizePath(this.settings.cartellaSet.trim() || DEFAULTS.cartellaSet);
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
	async scriviSetPredefiniti(sovrascrivi: boolean) {
		const cartella = this.cartellaSetEff();
		await this.assicuraCartella(cartella);
		const lingua = this.settings.lingua;
		for (const p of setPredefiniti(lingua, sovrascrivi ? undefined : this.settings.pesi)) {
			const percorso = normalizePath(`${cartella}/${SET_PREDEFINITI_MD[lingua].prefisso} ${p.nome}.md`);
			const contenuto = serializzaSet(p.nome, p.categorie, SOGLIE_STANDARD);
			const esistente = this.app.vault.getAbstractFileByPath(percorso);
			if (esistente instanceof TFile) {
				if (sovrascrivi) await this.app.vault.modify(esistente, contenuto);
			} else if (!esistente) {
				await this.app.vault.create(percorso, contenuto);
			}
		}
	}

	async caricaSet() {
		const prefisso = this.cartellaSetEff() + "/";
		const validi: SetDomande[] = [];
		const nonValidi: SetNonValido[] = [];

		const files = this.app.vault
			.getMarkdownFiles()
			.filter((f) => f.path.startsWith(prefisso))
			.sort((a, b) => a.path.localeCompare(b.path, "it"));

		for (const f of files) {
			const testo = await this.app.vault.cachedRead(f);
			if (!eUnSet(testo)) continue;
			const r = parseSet(testo);
			if (r.nome && validi.some((s) => s.nome.toLowerCase() === r.nome.toLowerCase())) {
				r.errori.push(`esiste già un altro set chiamato «${r.nome}»`);
			}
			if (r.errori.length > 0) nonValidi.push({ file: f, errori: r.errori });
			else validi.push({ nome: r.nome, categorie: r.categorie, soglie: r.soglie, colori: r.colori, file: f });
		}

		// Se non c'è nessun set valido si usano quelli predefiniti, senza file
		if (validi.length === 0) {
			for (const p of setPredefiniti(this.settings.lingua, this.settings.pesi)) {
				validi.push({ nome: p.nome, categorie: p.categorie, soglie: [...SOGLIE_STANDARD], colori: [...COLORI_FASCE], file: null });
			}
		}

		const ordine = (nome: string) => {
			const i = ["romanzi", "saggi", "novels", "essays"].indexOf(nome.toLowerCase());
			return i === -1 ? 99 : i;
		};
		validi.sort((a, b) => ordine(a.nome) - ordine(b.nome) || a.nome.localeCompare(b.nome, "it"));

		this.sets = validi;
		this.setNonValidi = nonValidi;
	}

	/** Livello di difficoltà con le impostazioni attuali delle stelle. */
	livelloDi(cats: { peso: number; domande: unknown[] }[], rif: number[]): LivelloSet | null {
		return calcolaLivello(cats, this.settings.stelleTotali, rif);
	}

	/** Soglie delle stelle del set indicato (quelle standard se il set non esiste più). */
	soglieDelSet(nome: string): number[] {
		return this.trovaSet(nome)?.soglie ?? SOGLIE_STANDARD;
	}

	/** Colori delle fasce del set indicato. */
	coloriDelSet(nome: string): string[] {
		return this.trovaSet(nome)?.colori ?? COLORI_FASCE;
	}

	/** Colore del testo per un voto, secondo le fasce del set (stringa vuota se la funzione è disattivata). */
	coloreVotoDi(v: number, setNome: string): string {
		if (!this.settings.votoColori) return "";
		return coloreVoto(v, this.soglieDelSet(setNome), this.coloriDelSet(setNome));
	}

	/** Sfondo di una barra per un voto, secondo le fasce del set (stringa vuota se disattivata). */
	sfondoVotoDi(v: number, setNome: string): string {
		if (!this.settings.votoColori) return "";
		return sfondoVoto(v, this.soglieDelSet(setNome), this.coloriDelSet(setNome), this.settings.votoSfumato);
	}

	/** Stelle di un punteggio ARL, secondo le soglie del set. */
	stelleDi(arl: number, setNome: string): number {
		return stelleAssegnate(arl, this.settings.stelleTotali, this.soglieDelSet(setNome));
	}

	trovaSet(nome: string): SetDomande | undefined {
		const n = nome.trim().toLowerCase();
		return this.sets.find((s) => s.nome.toLowerCase() === n);
	}

	/** Set proposto per una nuova recensione. */
	setIniziale(): SetDomande {
		return this.trovaSet("Romanzi") ?? this.sets[0];
	}

	async salvaSet(
		bozza: { nome: string; categorie: SetCategoria[]; soglie: number[]; colori: string[] },
		file: TFile | null,
		nomeOriginale: string | null
	): Promise<TFile> {
		const contenuto = serializzaSet(bozza.nome, bozza.categorie, bozza.soglie, bozza.colori);
		let f = file;
		if (f) {
			await this.app.vault.modify(f, contenuto);
		} else {
			const cartella = this.cartellaSetEff();
			await this.assicuraCartella(cartella);
			const base = `Recensione ${this.nomeSicuro(bozza.nome, "Set")}`;
			let n = 1;
			for (;;) {
				const p = normalizePath(`${cartella}/${n === 1 ? base : `${base} (${n})`}.md`);
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

	async eliminaSet(file: TFile) {
		await this.app.fileManager.trashFile(file);
		await this.caricaSet();
	}

	/** Se un set cambia nome, i libri già recensiti con quel set lo seguono. */
	private async rinominaSetNeiLibri(vecchio: string, nuovo: string) {
		let n = 0;
		for (const l of this.tuttiILibri()) {
			if (l.set.toLowerCase() !== vecchio.toLowerCase()) continue;
			await this.app.fileManager.processFrontMatter(l.file, (f: Record<string, unknown>) => {
				f.set = nuovo;
			});
			n++;
		}
		if (n > 0) {
			new NoticeT(`${plurale(n, "libro aggiornato", "libri aggiornati")} con il nuovo nome del set.`);
		}
	}

	/* ---- Libri ---- */

	tuttiILibri(): Libro[] {
		return this.app.vault
			.getMarkdownFiles()
			.map((f) => leggiLibro(this.app, f))
			.filter((l): l is Libro => l !== null);
	}

	libriConSet(nome: string): number {
		return this.tuttiILibri().filter((l) => l.set.toLowerCase() === nome.toLowerCase()).length;
	}

	/** File immagine della copertina di un libro, se il collegamento è valido. */
	fileCopertina(destinazione: string, percorsoNota: string): TFile | null {
		if (!destinazione) return null;
		const f = this.app.metadataCache.getFirstLinkpathDest(destinazione, percorsoNota);
		return f && ESTENSIONI_IMMAGINE.includes(f.extension.toLowerCase()) ? f : null;
	}

	urlImmagine(f: TFile): string {
		return this.app.vault.getResourcePath(f);
	}

	imgDelVault(): TFile[] {
		return this.app.vault
			.getFiles()
			.filter((f) => ESTENSIONI_IMMAGINE.includes(f.extension.toLowerCase()))
			.sort((a, b) => a.path.localeCompare(b.path, "it"));
	}

	/** Copia nel vault un'immagine scelta dal computer e restituisce il file creato. */
	async importaCopertina(file: File): Promise<TFile> {
		const cartella = normalizePath(this.settings.cartellaCopertine.trim() || DEFAULTS.cartellaCopertine);
		await this.assicuraCartella(cartella);
		const punto = file.name.lastIndexOf(".");
		const estensione = punto > 0 ? file.name.slice(punto + 1).toLowerCase() : "";
		if (!ESTENSIONI_IMMAGINE.includes(estensione)) throw new Error("il file non è un'immagine supportata");
		const base = this.nomeSicuro(file.name.slice(0, punto), "copertina");
		let n = 1;
		for (;;) {
			const p = normalizePath(`${cartella}/${base}${n === 1 ? "" : ` (${n})`}.${estensione}`);
			if (!this.app.vault.getAbstractFileByPath(p)) {
				return await this.app.vault.createBinary(p, await file.arrayBuffer());
			}
			n++;
		}
	}

	/** Copia nel vault un'immagine della galleria (stessa cartella delle copertine). */
	async importaImmagine(file: File): Promise<TFile> {
		return this.importaCopertina(file);
	}

	/** Salva la galleria: proprietà `galleria` (collegamenti) e immagini incorporate nel testo della nota. */
	async salvaGalleria(file: TFile, lista: string[], testi: string[] = []) {
		const tt = lista.map((_, i) => pulisciDidascalia(testi[i] ?? ""));
		await this.app.fileManager.processFrontMatter(file, (f: Record<string, unknown>) => {
			if (lista.length) f.galleria = lista.map((x, i) => (tt[i] ? `[[${x}]] | ${tt[i]}` : `[[${x}]]`));
			else delete f.galleria;
		});
		const incorporate = lista.map((x, i) => (tt[i] ? `![[${x}]]\n\n*${tt[i]}*` : `![[${x}]]`)).join("\n\n");
		await this.app.vault.process(file, (t) => impostaSezione(t, TITOLO_GALLERIA, incorporate));
	}

	/**
	 * Salva le letture (proprietà `letture` e tabella nel testo della nota).
	 * Se mancano, imposta l'inizio dalla prima data e, se il libro risulta finito, la fine dall'ultima.
	 * Restituisce le date eventualmente impostate.
	 */
	async salvaLetture(
		file: TFile,
		lista: Lettura[],
		pagineTotali: number,
		inizioAttuale: string,
		fineAttuale: string
	): Promise<{ inizio: string; fine: string }> {
		const ord = [...lista].sort((p, q) => p.data.localeCompare(q.data) || p.da - q.da);
		let inizio = inizioAttuale;
		let fine = fineAttuale;
		if (ord.length) {
			if (!inizio) inizio = ord[0].data;
			const ultima = ord.reduce((m, r) => Math.max(m, r.a), 0);
			if (!fine && pagineTotali > 0 && ultima >= pagineTotali) fine = ord[ord.length - 1].data;
		}
		await this.app.fileManager.processFrontMatter(file, (f: Record<string, unknown>) => {
			if (ord.length) f.letture = ord.map((r) => `${r.data} | ${r.da} | ${r.a}`);
			else delete f.letture;
			if (inizio && !inizioAttuale) f.inizio_lettura = inizio;
			if (fine && !fineAttuale) f.fine_lettura = fine;
			if (inizio && fine && (!inizioAttuale || !fineAttuale)) f.giorni = giorniTra(inizio, fine);
		});
		const totale = ord.reduce((somma, r) => somma + pagineLette(r), 0);
		const tabella = ord.length
			? [
					"| Data | Da pag. | A pag. | Pagine |",
					"|---|---|---|---|",
					...ord.map((r) => `| ${fmtData(r.data)} | ${r.da} | ${r.a} | ${pagineLette(r)} |`),
					"",
					`Totale: ${totale} pagine`,
			  ].join("\n")
			: "";
		await this.app.vault.process(file, (t) => impostaSezione(t, TITOLO_LETTURE, tabella));
		return { inizio, fine };
	}

	/** Prossimo codice libero: il più alto già usato più uno. */
	prossimoCodice(): number {
		let max = 0;
		for (const l of this.tuttiILibri()) if (l.codice !== null && l.codice > max) max = l.codice;
		return max + 1;
	}

	/** Generi suggeriti: quelli di base più quelli già usati nella libreria. */
	generiNoti(): string[] {
		const mappa = new Map<string, string>();
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
	async apri(sezione?: Sezione) {
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
	private metadati(d: DatiRecensione) {
		const fm: Record<string, string | number | boolean> = {
			tipo: TIPO,
			titolo: d.titolo.trim(),
			autore: d.autore.trim(),
			editore_anno: d.editore.trim(),
		};
		const rimuovi: string[] = [];

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

	private async scrivi(
		file: TFile,
		fm: Record<string, string | number | boolean>,
		rimuovi: string[]
	) {
		await this.app.fileManager.processFrontMatter(file, (f: Record<string, unknown>) => {
			Object.assign(f, fm);
			for (const k of rimuovi) delete f[k];
		});
		await this.attendiIndicizzazione(file, fm, rimuovi);
	}

	/** Crea o aggiorna la nota del libro (dati, risposte e punteggi). */
	async salva(d: DatiRecensione, esistente: TFile | null): Promise<TFile> {
		const set = this.trovaSet(d.set);
		if (!set) throw new Error(`il set «${d.set}» non esiste`);

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
			fm[`risposte_${c.id}`] = d.risposte[i].map((r) => (r === 1 ? "S" : "N")).join("");
		});

		let file = esistente;
		if (!file) {
			const percorso = await this.percorsoLibero(d);
			file = await this.app.vault.create(percorso, `# ${d.titolo.trim()}\n\n## Note\n\n`);
		}
		await this.scrivi(file, fm, rimuovi);
		return file;
	}

	/** Crea la nota di un libro appena censito (ancora senza valutazione). */
	async creaLibro(d: DatiRecensione): Promise<TFile> {
		const { fm, rimuovi } = this.metadati(d);
		const percorso = await this.percorsoLibero(d);
		const file = await this.app.vault.create(percorso, `# ${d.titolo.trim()}\n\n## Note\n\n`);
		await this.scrivi(file, fm, rimuovi);
		return file;
	}

	/** Aggiorna solo i dati del libro, lasciando intatti risposte, punteggi e ARL. */
	async salvaSoloDati(d: DatiRecensione, file: TFile): Promise<TFile> {
		const { fm, rimuovi } = this.metadati(d);
		await this.scrivi(file, fm, rimuovi);
		return file;
	}

	/** Salva l'elenco dei personaggi del libro (elenco di testi «Nome | Descrizione»). */
	async salvaPersonaggi(file: TFile, lista: Personaggio[]) {
		const righe = lista
			.map((p) => ({ nome: p.nome.trim().replace(/\s+/g, " "), descrizione: p.descrizione.trim().replace(/\s+/g, " ") }))
			.filter((p) => p.nome)
			.map((p) => (p.descrizione ? `${p.nome}${SEP_PERSONAGGIO}${p.descrizione}` : p.nome));
		await this.app.fileManager.processFrontMatter(file, (f: Record<string, unknown>) => {
			if (righe.length) f.personaggi = righe;
			else delete f.personaggi;
		});
		// copia leggibile nel corpo della nota
		const elenco = lista
			.filter((p) => p.nome.trim())
			.map((p) => `- **${p.nome.trim()}**${p.descrizione.trim() ? ` — ${p.descrizione.trim()}` : ""}`)
			.join("\n");
		await this.app.vault.process(file, (t) => impostaSezione(t, TITOLO_PERSONAGGI, elenco));
	}

	async leggiAnnotazioni(file: TFile): Promise<string> {
		return leggiSezione(await this.app.vault.read(file), TITOLO_ANNOTAZIONI);
	}

	async salvaAnnotazioni(file: TFile, testo: string) {
		await this.app.vault.process(file, (t) => impostaSezione(t, TITOLO_ANNOTAZIONI, testo));
	}

	/** Valutazione manuale: imposta set e ARL direttamente, senza domande. */
	async salvaManuale(file: TFile, setNome: string, arl: number) {
		await this.app.fileManager.processFrontMatter(file, (f: Record<string, unknown>) => {
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
	async impostaRestituito(file: TFile, restituito: boolean) {
		await this.app.fileManager.processFrontMatter(file, (f: Record<string, unknown>) => {
			if (restituito) f.restituito = true;
			else delete f.restituito;
		});
		await this.attendiIndicizzazione(
			file,
			restituito ? { restituito: "true" } : {},
			restituito ? [] : ["restituito"]
		);
	}

	private async assicuraCartella(percorso: string) {
		let corrente = "";
		for (const parte of normalizePath(percorso).split("/").filter(Boolean)) {
			corrente = corrente ? `${corrente}/${parte}` : parte;
			if (!this.app.vault.getAbstractFileByPath(corrente)) {
				await this.app.vault.createFolder(corrente);
			}
		}
	}

	private nomeSicuro(testo: string, predefinito: string): string {
		return (
			testo
				.replace(/[\\/:*?"<>|#^[\]]/g, "")
				.trim()
				.slice(0, 120) || predefinito
		);
	}

	private async percorsoLibero(d: DatiRecensione): Promise<string> {
		const cartella = this.settings.cartella.trim();
		if (cartella) await this.assicuraCartella(cartella);

		const titolo = d.titolo.trim();
		const autore = d.autore.trim();
		const base = this.nomeSicuro(autore ? `${titolo} - ${autore}` : titolo, "Recensione");

		let n = 1;
		for (;;) {
			const nome = n === 1 ? base : `${base} (${n})`;
			const p = normalizePath(cartella ? `${cartella}/${nome}.md` : `${nome}.md`);
			if (!this.app.vault.getAbstractFileByPath(p)) return p;
			n++;
		}
	}

	/** Aspetta che la cache dei metadati rifletta i dati appena scritti. */
	private async attendiIndicizzazione(
		file: TFile,
		fm: Record<string, string | number | boolean>,
		assenti: string[] = []
	) {
		for (let i = 0; i < 30; i++) {
			const c = this.app.metadataCache.getFileCache(file)?.frontmatter;
			if (
				c &&
				Object.keys(fm).every((k) => String(c[k]) === String(fm[k])) &&
				assenti.every((k) => c[k] === undefined || c[k] === null)
			) {
				return;
			}
			await new Promise((r) => window.setTimeout(r, 100));
		}
	}
}

/* ------------------------------------------------------------------ */
/*  Nuovo libro: censimento dei dati                                  */
/* ------------------------------------------------------------------ */

/** Statistiche sull'intera libreria. */
class InfoLibreriaModal extends Modal {
	constructor(
		app: App,
		private plugin: BooksAndReviewsPlugin
	) {
		super(app);
	}

	onOpen() {
		this.modalEl.addClass("arl-info-modal");
		const c = this.contentEl;
		c.empty();
		collegaTraduzione(c);
		c.createEl("h2", { text: "Informazioni libreria" });

		const libri = this.plugin.tuttiILibri();
		if (libri.length === 0) {
			c.createDiv({ cls: "arl-vuoto", text: "Nessun libro in libreria. Usa «Nuovo libro» per aggiungere il primo." });
			return;
		}

		const colonne = c.createDiv({ cls: "arl-info-colonne" });
		const sx = colonne.createDiv({ cls: "arl-info-col" });
		const dx = colonne.createDiv({ cls: "arl-info-col" });
		let tab = sx.createEl("table", { cls: "arl-info-tab" });
		const riga = (etichetta: string, ...valori: string[]) => {
			const tr = tab.createEl("tr");
			tr.createEl("th", { text: etichetta });
			const td = tr.createEl("td");
			valori.filter(Boolean).forEach((v, i) => td.createSpan({ text: i === 0 ? v : ` · ${v}` }));
			return tr;
		};
		const sezione = (titolo: string, colonna: HTMLElement = sx) => {
			tab = colonna.createEl("table", { cls: "arl-info-tab" });
			const tr = tab.createEl("tr", { cls: "arl-info-sez" });
			tr.createEl("th", { text: titolo, attr: { colSpan: "2" } });
		};

		const ordTitolo = (p: Libro, q: Libro) => p.titolo.localeCompare(q.titolo, "it");
		const estremi = (lista: Libro[], valore: (l: Libro) => number, alto: boolean) => {
			if (lista.length === 0) return [] as Libro[];
			const t = lista.map(valore).reduce((m, v) => (alto ? Math.max(m, v) : Math.min(m, v)));
			return lista.filter((l) => valore(l) === t).sort(ordTitolo);
		};
		const elenco = (lista: Libro[]) => lista.map((l) => l.titolo).join(", ");

		sezione("In generale");
		const conPrezzo = libri.filter((l) => l.prezzo !== null);
		const totale = conPrezzo.reduce((a, l) => a + (l.prezzo ?? 0), 0);
		riga("Libri in libreria", plurale(libri.length, "libro", "libri"), conPrezzo.length ? `Totale ${formatEuro(totale)}` : "");

		sezione("Pagine");
		const conPagine = libri.filter((l) => l.pagine > 0);
		const piu = estremi(conPagine, (l) => l.pagine, true);
		const meno = estremi(conPagine, (l) => l.pagine, false);
		riga("Il libro con più pagine", piu.length ? elenco(piu) : "—", piu.length ? plurale(piu[0].pagine, "pagina", "pagine") : "");
		riga("Il libro con meno pagine", meno.length ? elenco(meno) : "—", meno.length ? plurale(meno[0].pagine, "pagina", "pagine") : "");

		sezione("Prezzo");
		const caro = estremi(conPrezzo, (l) => l.prezzo ?? 0, true);
		const economico = estremi(conPrezzo, (l) => l.prezzo ?? 0, false);
		riga("Il libro più costoso", caro.length ? elenco(caro) : "—", caro.length ? formatEuro(caro[0].prezzo ?? 0) : "");
		riga("Il libro che costa meno", economico.length ? elenco(economico) : "—", economico.length ? formatEuro(economico[0].prezzo ?? 0) : "");

		sezione("Tempi di lettura");
		const conGiorni = libri.filter((l) => l.giorni > 0);
		const lungo = estremi(conGiorni, (l) => l.giorni, true);
		const breve = estremi(conGiorni, (l) => l.giorni, false);
		riga("Il periodo di lettura più lungo", lungo.length ? elenco(lungo) : "—", lungo.length ? plurale(lungo[0].giorni, "giorno", "giorni") : "");
		riga("Il periodo di lettura più breve", breve.length ? elenco(breve) : "—", breve.length ? plurale(breve[0].giorni, "giorno", "giorni") : "");

		// pausa tra la fine di un libro e l'inizio del successivo (differenza di date; letture sovrapposte = 0)
		const datati = libri
			.filter((l) => l.inizio && l.fine)
			.sort((p, q) => p.inizio.localeCompare(q.inizio) || p.fine.localeCompare(q.fine));
		const pause: { giorni: number; da: Libro; a: Libro }[] = [];
		for (let i = 1; i < datati.length; i++) {
			const diff = giorniTra(datati[i - 1].fine, datati[i].inizio) - 1;
			pause.push({ giorni: Math.max(0, diff), da: datati[i - 1], a: datati[i] });
		}
		if (pause.length) {
			const pMax = pause.reduce((m, p) => (p.giorni > m.giorni ? p : m));
			const pMin = pause.reduce((m, p) => (p.giorni < m.giorni ? p : m));
			riga("Pausa massima tra due libri", plurale(pMax.giorni, "giorno", "giorni"), `${pMax.da.titolo} → ${pMax.a.titolo}`);
			riga("Pausa minima tra due libri", plurale(pMin.giorni, "giorno", "giorni"), `${pMin.da.titolo} → ${pMin.a.titolo}`);
		} else {
			riga("Pausa massima tra due libri", "—");
			riga("Pausa minima tra due libri", "—");
		}

		sezione("Stelle", dx);
		const totStelle = this.plugin.settings.stelleTotali;
		const perStelle = new Array<number>(totStelle + 1).fill(0);
		let daValutare = 0;
		for (const l of libri) {
			if (!l.valutato) daValutare++;
			else perStelle[Math.min(totStelle, Math.max(0, this.plugin.stelleDi(l.arl, l.set)))]++;
		}
		for (let k = totStelle; k >= 1; k--) {
			riga(stringaStelle(k), plurale(perStelle[k], "libro", "libri")).querySelector("th")?.addClass("arl-stelle");
		}
		if (daValutare > 0) riga("Da valutare", plurale(daValutare, "libro", "libri"));

		sezione("Generi", dx);
		const generi = new Map<string, { nome: string; tutti: number; letti: number }>();
		for (const l of libri) {
			const g = l.genere.trim();
			if (!g) continue;
			const e = generi.get(g.toLowerCase()) ?? { nome: g, tutti: 0, letti: 0 };
			e.tutti++;
			if (l.fine || l.valutato) e.letti++;
			generi.set(g.toLowerCase(), e);
		}
		const tuttiGeneri = [...generi.values()].sort((p, q) => q.tutti - p.tutti || p.nome.localeCompare(q.nome, "it"));
		const letti = tuttiGeneri.filter((g) => g.letti > 0);
		const nomiConN = (n: number) => letti.filter((g) => g.letti === n).map((g) => g.nome).join(", ");
		if (letti.length) {
			const nMax = Math.max(...letti.map((g) => g.letti));
			const nMin = Math.min(...letti.map((g) => g.letti));
			riga("Il genere più letto", nomiConN(nMax), plurale(nMax, "libro", "libri"));
			riga("Il genere meno letto", nomiConN(nMin), plurale(nMin, "libro", "libri"));
		} else {
			riga("Il genere più letto", "—");
			riga("Il genere meno letto", "—");
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
}

/** Immagine della galleria a grandezza naturale, con frecce per scorrere le altre. */
class VisoreImmagini extends Modal {
	constructor(
		app: App,
		private urls: { url: string; nome: string; testo: string; indice: number }[],
		private indice: number,
		private salvaTesto?: (i: number, t: string) => Promise<void>
	) {
		super(app);
	}

	onOpen() {
		this.modalEl.addClass("arl-visore");
		this.contentEl.empty();
		const barra = this.contentEl.createDiv({ cls: "arl-visore-barra" });
		const prec = barra.createEl("button", { text: "‹" });
		const info = barra.createDiv({ cls: "arl-visore-info" });
		const succ = barra.createEl("button", { text: "›" });
		const adatta = barra.createEl("button", { text: "Adatta" });
		const area = this.contentEl.createDiv({ cls: "arl-visore-area" });
		const img = area.createEl("img");
		const sotto = this.contentEl.createDiv({ cls: "arl-visore-didascalia" });
		const mostraDid = () => {
			sotto.empty();
			const x = this.urls[this.indice];
			if (x.testo) sotto.createSpan({ cls: "arl-visore-testo", text: x.testo });
			if (!this.salvaTesto) return;
			const mod = sotto.createEl("button", { text: "✎", cls: "arl-gal-mod" });
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
					x.testo = pulisciDidascalia(inp.value);
					await this.salvaTesto?.(x.indice, x.testo);
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
			info.setText(`${this.indice + 1} / ${this.urls.length} · ${x.nome}`);
			prec.disabled = succ.disabled = this.urls.length < 2;
			area.scrollTo(0, 0);
			mostraDid();
		};
		const vai = (d: number) => {
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
}

class ImmagineModal extends FuzzySuggestModal<TFile> {
	constructor(
		app: App,
		private immagini: TFile[],
		private scelta: (f: TFile) => void
	) {
		super(app);
		this.setPlaceholder("Cerca un'immagine nel vault…");
	}
	getItems(): TFile[] {
		return this.immagini;
	}
	getItemText(f: TFile): string {
		return f.path;
	}
	onChooseItem(f: TFile) {
		this.scelta(f);
	}
}

class BookFormView {
	private dati: DatiRecensione;
	private sporco = false;

	constructor(
		private plugin: BooksAndReviewsPlugin,
		private host: HTMLElement,
		private libro: Libro | null,
		private dopo: (f: TFile) => void,
		private annulla: () => void
	) {
		this.dati = libro
			? datiDaLibro(libro, plugin.trovaSet(libro.set) ?? plugin.setIniziale())
			: datiVuoti(plugin.setIniziale());
		if (!libro) this.dati.codice = String(plugin.prossimoCodice());
	}

	inCorso(): boolean {
		return this.sporco;
	}

	avvia() {
		this.render();
	}

	private datiValidi(): boolean {
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
			const altro = this.plugin
				.tuttiILibri()
				.find((x) => x.codice === n && x.file.path !== this.libro?.file.path);
			if (altro) {
				new NoticeT(`Il codice ${n} è già usato da «${altro.titolo}».`);
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
			new NoticeT("La data di fine non può precedere quella di inizio.");
			return false;
		}
		return true;
	}

	private render() {
		this.host.empty();
		this.host.scrollTop = 0;
		const c = this.host.createDiv({ cls: "arl-stretto" });
		const d = this.dati;
		const tocca = () => (this.sporco = true);

		c.createEl("h2", { text: this.libro ? "Modifica dati del libro" : "Nuovo libro" });
		c.createDiv({
			cls: "arl-meta",
			text: "Censisci il libro con i suoi dati. La valutazione si fa dopo, quando lo hai finito, da «Valuta libro».",
		});

		new Setting(c)
			.setName("Codice")
			.setDesc("Numero progressivo del libro: proposto in automatico (il più alto + 1), puoi cambiarlo.")
			.addText((t) => {
				t.inputEl.type = "number";
				t.inputEl.min = "1";
				t.inputEl.step = "1";
				t.setValue(d.codice).onChange((v) => {
					d.codice = v;
					tocca();
				});
			});
		new Setting(c).setName("Titolo").addText((t) =>
			t.setValue(d.titolo).onChange((v) => {
				d.titolo = v;
				tocca();
			})
		);
		new Setting(c).setName("Autore").addText((t) =>
			t.setValue(d.autore).onChange((v) => {
				d.autore = v;
				tocca();
			})
		);
		new Setting(c).setName("Editore, anno").addText((t) =>
			t
				.setPlaceholder("Einaudi, 2019")
				.setValue(d.editore)
				.onChange((v) => {
					d.editore = v;
					tocca();
				})
		);
		new Setting(c).setName("Genere").addText((t) => {
			t.inputEl.setAttr("list", "arl-generi");
			t.setPlaceholder("Fantascienza, Fantasy, Thriller…")
				.setValue(d.genere)
				.onChange((v) => {
					d.genere = v;
					tocca();
				});
		});
		const elenco = c.createEl("datalist", { attr: { id: "arl-generi" } });
		for (const g of this.plugin.generiNoti()) {
			elenco.createEl("option", { attr: { value: g } });
		}
		new Setting(c)
			.setName("Premio")
			.setDesc("Facoltativo: premio o riconoscimento ricevuto dal libro.")
			.addText((t) =>
				t
					.setPlaceholder("Premio Strega 2019")
					.setValue(d.premio)
					.onChange((v) => {
						d.premio = v;
						tocca();
					})
			);
		new Setting(c).setName("Pagine totali").addText((t) => {
			t.inputEl.type = "number";
			t.inputEl.min = "1";
			t.inputEl.step = "1";
			t.setPlaceholder("455")
				.setValue(d.pagine)
				.onChange((v) => {
					d.pagine = v;
					tocca();
				});
		});
		new Setting(c).setName("Prezzo (€)").addText((t) =>
			t
				.setPlaceholder("9,90")
				.setValue(d.prezzo)
				.onChange((v) => {
					d.prezzo = v;
					tocca();
				})
		);

		// Copertina: collegamento a un'immagine del vault
		const percorsoNota = this.libro ? this.libro.file.path : "";
		let testoCopertina: HTMLInputElement | null = null;
		const anteprimaCop = c.createDiv({ cls: "arl-cop-anteprima" });
		const aggiornaCop = () => {
			anteprimaCop.empty();
			const dest = copertinaDaFm(normalizzaCopertina(d.copertina));
			if (!dest) return;
			const f = this.plugin.fileCopertina(dest, percorsoNota);
			if (f) anteprimaCop.createEl("img", { attr: { src: this.plugin.urlImmagine(f), alt: "Copertina" } });
			else anteprimaCop.createDiv({ cls: "arl-meta", text: "Immagine non trovata nel vault." });
		};
		const impostaCop = (f: TFile | null) => {
			d.copertina = f ? `[[${this.plugin.app.metadataCache.fileToLinktext(f, percorsoNota)}]]` : "";
			if (testoCopertina) testoCopertina.value = d.copertina;
			tocca();
			aggiornaCop();
		};
		const rigaCop = new Setting(c)
			.setName("Copertina")
			.setDesc("Collegamento a un'immagine, per esempio [[Copertine/dune.jpg]].")
			.addText((t) => {
				testoCopertina = t.inputEl;
				t.setPlaceholder("[[immagine]]")
					.setValue(d.copertina)
					.onChange((v) => {
						d.copertina = v;
						tocca();
						aggiornaCop();
					});
			})
			.addButton((b) =>
				b.setButtonText("Scegli…").onClick(() => {
					const imm = this.plugin.imgDelVault();
					if (!imm.length) {
						new NoticeT("Nel vault non ci sono immagini.");
						return;
					}
					new ImmagineModal(this.plugin.app, imm, (f) => impostaCop(f)).open();
				})
			)
			.addButton((b) =>
				b.setButtonText("Dal computer…").onClick(() => {
					const sel = createEl("input");
					sel.type = "file";
					sel.accept = "image/*";
					sel.onchange = async () => {
						const file = sel.files?.[0];
						if (!file) return;
						try {
							impostaCop(await this.plugin.importaCopertina(file));
							new NoticeT("Copertina aggiunta al vault.");
						} catch (e) {
							new NoticeT(`Impossibile aggiungere la copertina: ${(e as Error).message}`);
						}
					};
					sel.click();
				})
			)
			.addButton((b) => b.setButtonText("Rimuovi").onClick(() => impostaCop(null)));
		void rigaCop;
		c.appendChild(anteprimaCop);
		aggiornaCop();

		const durata = c.createDiv({ cls: "arl-durata" });
		const aggiornaDurata = () => {
			if (d.inizio && d.fine) {
				const g = giorniTra(d.inizio, d.fine);
				durata.setText(
					g >= 1
						? `Durata: ${etichettaGiorni(g)}`
						: "La data di fine è precedente alla data di inizio."
				);
			} else {
				durata.setText("");
			}
		};
		new Setting(c)
			.setName("Inizio lettura")
			.setDesc("Facoltativa: puoi inserirla anche più tardi.")
			.addText((t) => {
				t.inputEl.type = "date";
				t.setValue(d.inizio).onChange((v) => {
					d.inizio = v;
					tocca();
					aggiornaDurata();
				});
			});
		new Setting(c).setName("Fine lettura").addText((t) => {
			t.inputEl.type = "date";
			t.setValue(d.fine).onChange((v) => {
				d.fine = v;
				tocca();
				aggiornaDurata();
			});
		});
		c.appendChild(durata);
		aggiornaDurata();

		new Setting(c)
			.setName("Restituzione")
			.setDesc("Facoltativa. Il tempo rimanente compare nella libreria.")
			.addText((t) => {
				t.inputEl.type = "date";
				t.setValue(d.restituzione).onChange((v) => {
					d.restituzione = v;
					tocca();
				});
			});
		new Setting(c)
			.setName("Restituito")
			.setDesc("Ferma il conto alla rovescia.")
			.addToggle((t) =>
				t.setValue(d.restituito).onChange((v) => {
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
			cls: "mod-cta",
		});
		salva.onclick = async () => {
			if (!this.datiValidi()) return;
			salva.disabled = true;
			try {
				const f = this.libro
					? await this.plugin.salvaSoloDati(d, this.libro.file)
					: await this.plugin.creaLibro(d);
				this.sporco = false;
				new NoticeT(this.libro ? "Dati salvati." : "Libro aggiunto alla libreria.");
				this.dopo(f);
			} catch (e) {
				new NoticeT(`Salvataggio non riuscito: ${(e as Error).message}`);
				salva.disabled = false;
			}
		};
	}
}

/* ------------------------------------------------------------------ */
/*  Valuta libro: procedura guidata                                   */
/* ------------------------------------------------------------------ */

interface Pagina {
	c: number; // indice del tema nel set
	da: number; // prima domanda (0-based)
	a: number; // fine esclusa
}

class ReviewView {
	private pagine: Pagina[] = [];
	private contentEl!: HTMLElement;
	private set!: SetDomande;
	private dati!: DatiRecensione;
	/**
	 * @param libro libro da valutare (o da rivedere/aggiornare)
	 * @param passo 0 = scelta del set, 1..N = pagine di domande
	 * @param tornaIndietro azione del link «Indietro» nella scelta del set
	 * @param dopoSalvataggio funzione chiamata a salvataggio riuscito (o all'annullamento della revisione)
	 */
	constructor(
		private plugin: BooksAndReviewsPlugin,
		private host: HTMLElement,
		private libro: Libro,
		private passo: number,
		private dopoSalvataggio: (f: TFile) => void,
		private tornaIndietro: () => void
	) {}

	/** True se c'è qualcosa che andrebbe perso uscendo dalla procedura. */
	inCorso(): boolean {
		return (
			this.passo > 0 &&
			this.dati.risposte.some((r) => r.some((x) => x !== null))
		);
	}

	avvia() {
		this.set = this.plugin.trovaSet(this.libro.set) ?? this.plugin.setIniziale();
		this.caricaLibro(this.libro);
		this.costruisciPagine();
		this.render();
	}

	/** Prepara i dati della valutazione per il libro scelto e il set corrente. */
	private caricaLibro(l: Libro) {
		this.libro = l;
		this.dati = datiDaLibro(l, this.set);
		this.dati.set = this.set.nome;
		// le risposte già date si riusano solo se il libro è stato valutato con le domande di questo stesso set
		const stessoSet = l.set.toLowerCase() === this.set.nome.toLowerCase();
		if (!stessoSet || !libroCompatibile(l, this.set)) this.dati.risposte = rispostePerSet(this.set);
	}

	private costruisciPagine() {
		const pp = this.plugin.settings.domandePerSchermata;
		this.pagine = [];
		this.set.categorie.forEach((cat, c) => {
			for (let da = 0; da < cat.domande.length; da += pp) {
				this.pagine.push({ c, da, a: Math.min(da + pp, cat.domande.length) });
			}
		});
	}

	private render() {
		this.host.empty();
		this.host.scrollTop = 0;
		this.contentEl = this.host.createDiv({ cls: "arl-stretto" });
		if (this.passo === 0) this.renderScelta();
		else if (this.passo <= this.pagine.length) this.renderDomande();
		else this.renderRiepilogo();
	}

	/* ---- Passo 0: scelta del set ---- */

	private renderScelta() {
		const c = this.contentEl;
		const libro = this.libro;
		const indietro = c.createEl("button", { text: "Indietro", cls: "arl-link" });
		indietro.onclick = () => this.tornaIndietro();

		c.createEl("h2", { text: libro.valutato ? "Aggiorna valutazione" : "Valuta libro" });
		c.createDiv({ cls: "arl-sub", text: libro.titolo });
		if (libro.autore) c.createDiv({ cls: "arl-meta", text: libro.autore });
		c.createDiv({
			cls: "arl-meta",
			text: libro.valutato
				? `Ha già una valutazione (ARL ${fmt(libro.arl)}): proseguendo la aggiornerai. Scegli il set di valutazione: domande mirate, suddivise per tematiche.`
				: "Scegli il set di valutazione: domande mirate, suddivise per tematiche.",
		});

		const rigaSet = new Setting(c).setName("Set di valutazione");
		const descrizioneSet = (st: SetDomande) =>
			`${riassuntoSet(st)} · Livello ${testoLivello(this.plugin.livelloDi(st.categorie, st.soglie))}.`;
		rigaSet.setDesc(descrizioneSet(this.set));
		const boxLiv = c.createDiv({ cls: "arl-livello-box" });
		const mostraLivelli = () => {
			boxLiv.empty();
			const lv = this.plugin.livelloDi(this.set.categorie, this.set.soglie);
			creaTabellaLivelli(boxLiv, new Map(lv ? [[lv.etichetta, "← questo set"]] : []));
		};
		rigaSet.addDropdown((dd) => {
			const opzioni: Record<string, string> = {};
			for (const st of this.plugin.sets) opzioni[st.nome] = st.nome;
			dd.addOptions(opzioni)
				.setValue(this.set.nome)
				.onChange((v) => {
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
			cls: "mod-cta",
		});
		avanti.onclick = () => {
			this.costruisciPagine();
			this.passo = 1;
			this.render();
		};
	}

	/* ---- Passi 1..N: domande ---- */

	private renderDomande() {
		const c = this.contentEl;
		const pg = this.pagine[this.passo - 1];
		const cat = this.set.categorie[pg.c];
		const ris = this.dati.risposte[pg.c];

		// ARL e stelle in tempo reale, in alto a destra (si attiva nelle opzioni)
		let aggiornaLive = () => {};
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
			text: `Tema ${pg.c + 1} di ${this.set.categorie.length} · domande ${pg.da + 1}–${pg.a} di ${cat.domande.length}`,
		});
		const barra = c.createDiv({ cls: "arl-progress" });
		barra.createDiv({ cls: "arl-progress-fill" }).style.width = `${Math.round(
			(this.passo / (this.pagine.length + 1)) * 100
		)}%`;

		const lista = c.createDiv({ cls: "arl-domande" });
		const footer = c.createDiv({ cls: "arl-footer" });
		const info = footer.createDiv({ cls: "arl-info" });
		const azioni = footer.createDiv({ cls: "arl-azioni" });
		const revisione = this.passo === 1 && this.libro.valutato && !this.libro.manuale;
		const indietro = azioni.createEl("button", { text: revisione ? "Annulla" : "Indietro" });
		const avanti = azioni.createEl("button", { text: "Avanti", cls: "mod-cta" });

		const righe: HTMLElement[] = [];
		let evidenziata = -1;
		let primo = true;
		const aggiorna = () => {
			// evidenzia la prima domanda ancora senza risposta
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
				righe.forEach((r, k) => r.toggleClass("arl-prossima", pg.da + k === prossima));
				evidenziata = prossima;
				const r = righe[prossima - pg.da];
				if (r && !primo) r.scrollIntoView({ block: "nearest", behavior: "smooth" });
			}
			primo = false;
			const mancanti = ris
				.slice(pg.da, pg.a)
				.filter((r) => r === null).length;
			let testo = `Punteggio ${cat.nome}: ${fmtP(punteggioCategoria(ris))} / 10`;
			if (mancanti > 0) testo += ` · ${mancanti} da rispondere`;
			info.setText(testo);
			avanti.disabled = mancanti > 0;
			aggiornaLive();
		};

		for (let i = pg.da; i < pg.a; i++) {
			const riga = lista.createDiv({ cls: "arl-domanda" });
			righe.push(riga);
			riga.createDiv({ cls: "arl-testo", text: `${i + 1}. ${cat.domande[i]}` });
			const yn = riga.createDiv({ cls: "arl-yn" });
			const si = yn.createEl("button", { text: "Sì" });
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

	private renderRiepilogo() {
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
			text: this.dati.autore.trim()
				? `${this.dati.titolo.trim()}, ${this.dati.autore.trim()}`
				: this.dati.titolo.trim(),
		});
		c.createDiv({ cls: "arl-meta", text: `Set: ${this.set.nome}` });

		const tabella = c.createEl("table", { cls: "arl-riepilogo" });
		this.set.categorie.forEach((cat, i) => {
			const tr = tabella.createEl("tr");
			tr.createEl("td", { text: cat.nome });
			tr.createEl("td", { text: `${fmtP(esatti[i])} / 10`, cls: "arl-num-cell" });
			const peso = sommaPesi > 0 ? (cat.peso / sommaPesi) * 100 : 100 / this.set.categorie.length;
			tr.createEl("td", { text: `peso ${Math.round(peso * 10) / 10}%`, cls: "arl-peso" });
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
			cls: "mod-cta",
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
				new NoticeT(`Salvataggio non riuscito: ${(e as Error).message}`);
				salva.disabled = false;
			}
		};
	}
}

/* ------------------------------------------------------------------ */
/*  Libreria                                                          */
/* ------------------------------------------------------------------ */

type ChiaveOrdine =
	| "codice"
	| "titolo"
	| "autore"
	| "editore"
	| "genere"
	| "premio"
	| "set"
	| "pagine"
	| "prezzo"
	| "fine"
	| "giorni"
	| "arl"
	| "valutazione"
	| "restituzione"
	| "trascorso";

const traduci = (t: string): string => tr(t);

/**
 * Giorni tra la fine del libro letto prima e l'inizio di ciascun libro (differenza di date,
 * letture sovrapposte = 0). Il «precedente» è il libro con la data di inizio anteriore.
 */
function calcolaPause(libri: Libro[]): Map<string, { giorni: number; prec: Libro }> {
	const out = new Map<string, { giorni: number; prec: Libro }>();
	const datati = libri
		.filter((l) => l.inizio && l.fine)
		.sort((p, q) => p.inizio.localeCompare(q.inizio) || p.fine.localeCompare(q.fine));
	for (let i = 1; i < datati.length; i++) {
		const giorni = Math.max(0, giorniTra(datati[i - 1].fine, datati[i].inizio) - 1);
		out.set(datati[i].file.path, { giorni, prec: datati[i - 1] });
	}
	return out;
}

const COLONNE: { chiave: ChiaveOrdine; titolo: string; centro?: boolean }[] = [
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
	{ chiave: "premio", titolo: "Premio" },
];

/** Colonne che non si possono nascondere. */
const COLONNE_OBBLIGATORIE: string[] = ["titolo", "autore"];

/** Stato della lista (ricerca, filtro, ordine, posizione): resta anche dopo aver aperto un libro. */
interface StatoLista {
	ricerca: string;
	stato: "tutti" | "da" | "val";
	ordine: { chiave: ChiaveOrdine; asc: boolean };
	ancora: { percorso: string; top: number } | null; // riga cliccata e sua distanza dal bordo della finestra
	ripristina: boolean;
}

/** Primo antenato che scorre davvero (quello che si muove quando si usa la rotellina). */
function antenatoScorrevole(el: HTMLElement): HTMLElement | null {
	let e: HTMLElement | null = el.parentElement;
	while (e) {
		const o = getComputedStyle(e).overflowY;
		if ((o === "auto" || o === "scroll" || o === "overlay") && e.scrollHeight > e.clientHeight + 1) return e;
		e = e.parentElement;
	}
	return null;
}

class ArchiveView {
	private libri: Libro[] = [];
	private st: StatoLista;
	private contenitoreTabella: HTMLElement | null = null;

	private get ordine() {
		return this.st.ordine;
	}
	private set ordine(v: { chiave: ChiaveOrdine; asc: boolean }) {
		this.st.ordine = v;
	}
	private get ricerca() {
		return this.st.ricerca;
	}
	private set ricerca(v: string) {
		this.st.ricerca = v;
	}
	private get stato() {
		return this.st.stato;
	}
	private set stato(v: "tutti" | "da" | "val") {
		this.st.stato = v;
	}

	constructor(
		private app: App,
		private plugin: BooksAndReviewsPlugin,
		private host: HTMLElement,
		private main: MainView,
		private aperto?: string,
		private modo: "libreria" | "valuta" = "libreria"
	) {
		this.st = plugin.statoListe[modo] ??= {
			ricerca: "",
			stato: "tutti",
			ordine: { chiave: "codice", asc: false },
			ancora: null,
			ripristina: false,
		};
	}

	avvia() {
		this.carica();
		const l = this.aperto
			? this.libri.find((x) => x.file.path === this.aperto)
			: undefined;
		if (l) this.renderDettaglio(l);
		else this.renderLista();
	}

	private carica() {
		this.libri = this.plugin.tuttiILibri();
	}

	private stelle(l: Libro): string {
		return stringaStelle(this.plugin.stelleDi(l.arl, l.set));
	}

	/* ---- Lista ---- */

	private renderLista() {
		this.host.empty();
		this.host.scrollTop = 0;
		const c = this.host;
		const riprendi = this.st.ripristina;
		this.st.ripristina = false;
		// titolo e barra di ricerca restano fissi in alto mentre si scorre la lista
		const testa = c.createDiv({ cls: "arl-lista-testa" });
		testa.createEl("h2", { text: this.modo === "valuta" ? "Valuta libro" : "Libreria" });
		const barra = testa.createDiv({ cls: "arl-toolbar" });
		const cerca = barra.createEl("input", {
			type: "text",
			placeholder: "Cerca per titolo, autore, editore, genere o set",
			cls: "arl-cerca",
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
			["val", "Valutati"],
		] as const) {
			filtro.createEl("option", { text: t, attr: { value: v } });
		}
		filtro.value = this.stato;
		filtro.onchange = () => {
			this.stato = filtro.value as "tutti" | "da" | "val";
			this.disegnaTabella();
		};

		if (this.modo === "valuta") {
			c.createDiv({
				cls: "arl-meta",
				text: "Scegli il libro da valutare: in alto quelli ancora senza valutazione, poi quelli già valutati (di cui puoi aggiornare la valutazione).",
			});
		}

		this.contenitoreTabella = c.createDiv();
		this.disegnaTabella();

		// tornando da un libro, la riga cliccata riprende esattamente la posizione di prima
		const ancora = this.st.ancora;
		if (riprendi && ancora) {
			const riposiziona = () => {
				const riga = Array.from(c.querySelectorAll<HTMLElement>("tr.arl-riga")).find(
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

		// l'intestazione delle colonne si ferma subito sotto titolo e ricerca
		const misura = () => c.style.setProperty("--arl-testa-h", `${testa.offsetHeight}px`);
		misura();
		window.requestAnimationFrame(misura);
		if (typeof ResizeObserver !== "undefined") {
			this.roTesta?.disconnect();
			this.roTesta = new ResizeObserver(() => window.requestAnimationFrame(misura));
			this.roTesta.observe(testa);
		}
	}

	private roTesta: ResizeObserver | null = null;
	private pause = new Map<string, { giorni: number; prec: Libro }>();

	private ordina(lista: Libro[]): Libro[] {
		const { chiave, asc } = this.ordine;
		const dir = asc ? 1 : -1;
		const ordinata = [...lista].sort((a, b) => {
			let r = 0;
			switch (chiave) {
				case "giorni":
					r = a.giorni - b.giorni;
					break;
				case "trascorso": {
					// i libri senza valore vanno in fondo
					const pa = this.pause.get(a.file.path)?.giorni;
					const pb = this.pause.get(b.file.path)?.giorni;
					r = pa === undefined && pb === undefined ? 0 : pa === undefined ? 1 : pb === undefined ? -1 : pa - pb;
					break;
				}
				case "pagine":
					r = a.pagine - b.pagine;
					break;
				case "prezzo":
					r = (a.prezzo ?? -1) - (b.prezzo ?? -1);
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
					// i libri senza premio vanno in fondo
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
		// in «Valuta libro» i libri senza valutazione vengono per primi
		if (this.modo === "valuta") ordinata.sort((a, b) => Number(a.valutato) - Number(b.valutato));
		return ordinata;
	}

	private disegnaTabella() {
		const box = this.contenitoreTabella;
		if (!box) return;
		box.empty();

		this.pause = calcolaPause(this.libri);
		const colonne = this.plugin.colonneAttive();
		// se la colonna usata per ordinare è stata nascosta, si ordina per titolo
		if (!colonne.some((c) => c.chiave === this.ordine.chiave)) this.ordine = { chiave: "titolo", asc: true };

		const q = this.ricerca.trim().toLowerCase();
		const filtrati = this.ordina(
			this.libri.filter(
				(l) =>
					(this.stato === "tutti" || (this.stato === "val") === l.valutato) &&
					(!q ||
						(l.codice !== null && String(l.codice) === q) ||
					l.titolo.toLowerCase().includes(q) ||
					l.autore.toLowerCase().includes(q) ||
					l.editore.toLowerCase().includes(q) ||
					l.genere.toLowerCase().includes(q) ||
					l.premio.toLowerCase().includes(q) ||
					l.set.toLowerCase().includes(q))
			)
		);

		if (this.libri.length === 0) {
			const v = box.createDiv({ cls: "arl-vuoto arl-benvenuto" });
			v.createEl("h3", { text: "Nessun libro ancora." });
			v.createEl("p", { text: "1. Premi «Nuovo libro» e inserisci i dati del libro." });
			v.createEl("p", { text: "2. A lettura finita, premi «Valuta libro» e rispondi alle domande." });
			v.createEl("p", { text: "I libri li inserisci tu; i set di valutazione sono già pronti." });
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
		const tr = table.createEl("thead").createEl("tr");
		for (const col of colonne) {
			const th = tr.createEl("th", { cls: col.centro ? "arl-sortable arl-centro" : "arl-sortable" });
			const attiva = this.ordine.chiave === col.chiave;
			th.setText(col.titolo + (attiva ? (this.ordine.asc ? " ▲" : " ▼") : ""));
			th.onclick = () => {
				this.ordine = {
					chiave: col.chiave,
					asc: attiva ? !this.ordine.asc : col.chiave === "titolo" || col.chiave === "autore",
				};
				this.disegnaTabella();
			};
		}

		const adesso = new Date();
		const celle: Record<ChiaveOrdine, (riga: HTMLElement, l: Libro) => void> = {
			codice: (r, l) => void r.createEl("td", { text: l.codice !== null ? String(l.codice) : "", cls: "arl-centro" }),
			titolo: (r, l) => void r.createEl("td", { text: l.titolo, cls: "arl-titolo-cell" }),
			autore: (r, l) => void r.createEl("td", { text: l.autore }),
			editore: (r, l) => void r.createEl("td", { text: l.editore }),
			genere: (r, l) => void r.createEl("td", { text: l.genere }),
			set: (r, l) => void r.createEl("td", { text: l.set || "—" }),
			pagine: (r, l) => void r.createEl("td", { text: l.pagine ? String(l.pagine) : "", cls: "arl-centro" }),
			prezzo: (r, l) =>
				void r.createEl("td", { text: l.prezzo !== null ? formatEuro(l.prezzo) : "—", cls: "arl-centro arl-nowrap" }),
			fine: (r, l) =>
				void r.createEl("td", {
					text: l.inizio && l.fine ? `${fmtData(l.inizio)} – ${fmtData(l.fine)}` : "",
					cls: "arl-nowrap",
				}),
			giorni: (r, l) => void r.createEl("td", { text: l.giorni ? String(l.giorni) : "", cls: "arl-centro" }),
			arl: (r, l) => {
				const td = r.createEl("td", { text: l.valutato ? fmt(l.arl) + (l.manuale ? " ✎" : "") : "—", cls: "arl-nowrap" });
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
				const td = r.createEl("td", { text: p ? plurale(p.giorni, "giorno", "giorni") : "—", cls: "arl-centro arl-nowrap" });
				if (p) td.setAttr("title", `${traduci("Dopo")}: ${p.prec.titolo}`);
			},
			restituzione: (r, l) => {
				const sc = calcolaScadenza(l.restituzione, l.restituito, adesso);
				r.createEl("td", { text: sc.testo, cls: `arl-nowrap ${sc.classe}`.trim() });
			},
			premio: (r, l) => void r.createEl("td", { text: l.premio }),
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
		const totale = conPrezzo.reduce((somma, l) => somma + (l.prezzo ?? 0), 0);
		let riepilogo = `${filtrati.length} ${filtrati.length === 1 ? "libro" : "libri"}`;
		if (conPrezzo.length > 0) riepilogo += ` · Totale ${formatEuro(totale)}`;
		const foot = box.createDiv({ cls: "arl-conteggio" });
		const voce = (testo: string, cls = "") => foot.createSpan({ text: testo, cls });

		const mostra = (k: string) => !this.plugin.settings.riepilogoNascosti.includes(k);

		// numero di libri e totale in euro
		if (mostra("totali")) voce(riepilogo);

		// libri per numero di stelle (solo quelli valutati nella lista mostrata)
		const totStelle = this.plugin.settings.stelleTotali;
		const perStelle = new Array<number>(totStelle + 1).fill(0);
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

		// libro con più e con meno pagine
		const conPagine = filtrati.filter((l) => l.pagine > 0);
		if (conPagine.length > 0) {
			const max = conPagine.reduce((m, l) => (l.pagine > m.pagine ? l : m));
			const min = conPagine.reduce((m, l) => (l.pagine < m.pagine ? l : m));
			if (mostra("piu")) {
				const vMax = foot.createSpan();
				vMax.createSpan({ text: "Libro con più pagine:" });
				vMax.createSpan({ text: ` ${max.titolo} (${max.pagine})` });
			}
			if (mostra("meno")) {
				const vMin = foot.createSpan();
				vMin.createSpan({ text: "Libro con meno pagine:" });
				vMin.createSpan({ text: ` ${min.titolo} (${min.pagine})` });
			}
		}

		// primi 5 generi per numero di libri letti (con data di fine lettura o già valutati)
		const generi = new Map<string, { nome: string; n: number }>();
		for (const l of filtrati) {
			const g = l.genere.trim();
			if (!g || !(l.fine || l.valutato)) continue;
			const chiave = g.toLowerCase();
			const e = generi.get(chiave);
			if (e) e.n++;
			else generi.set(chiave, { nome: g, n: 1 });
		}
		const primi = [...generi.values()].sort((p, q) => q.n - p.n || p.nome.localeCompare(q.nome, "it")).slice(0, 5);
		if (primi.length > 0 && mostra("generi")) {
			const vG = foot.createSpan();
			vG.createSpan({ text: "Generi letti:" });
			vG.createSpan({ text: ` ${primi.map((g) => `${g.nome} ${g.n}`).join(", ")}` });
		}
	}

	/* ---- Dettaglio ---- */

	/** Pagina con le immagini tematiche del libro: anteprime grandi, clic per vederle a grandezza naturale. */
	private renderGalleria(l: Libro) {
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
		c.createEl("h2", { text: `Galleria immagini — ${l.titolo}` });
		c.createDiv({
			cls: "arl-meta",
			text: "Le immagini tematiche del libro (per esempio create con l'IA). Clicca su un'anteprima per vederla a grandezza naturale.",
		});

		let lista = [...l.galleria];
		let testi = lista.map((_, i) => l.galleriaTesti[i] ?? "");
		const griglia = c.createDiv({ cls: "arl-gal-griglia" });
		const salvaTesto = async (i: number, t: string) => {
			testi[i] = pulisciDidascalia(t);
			await this.plugin.salvaGalleria(l.file, lista, testi);
		};
		const disegna = () => {
			griglia.empty();
			const voci = lista
				.map((d) => ({ d, f: this.plugin.fileCopertina(d, l.file.path) }))
				.map((v, i) => ({ ...v, i }));
			if (voci.length === 0) {
				griglia.createDiv({ cls: "arl-vuoto", text: "Nessuna immagine: aggiungine una." });
				return;
			}
			const visibili = voci.filter((v) => v.f instanceof TFile);
			const urls: { url: string; nome: string; testo: string; indice: number }[] = [];
			for (const v of visibili) {
				if (v.f instanceof TFile) {
					urls.push({ url: this.plugin.urlImmagine(v.f), nome: v.f.name, testo: testi[v.i] ?? "", indice: v.i });
				}
			}
			for (const v of voci) {
				const cella = griglia.createDiv({ cls: "arl-gal-cella" });
				if (v.f) {
					const k = visibili.indexOf(v);
					const im = cella.createEl("img", {
						attr: { src: this.plugin.urlImmagine(v.f), alt: v.f.name, loading: "lazy", decoding: "async" },
					});
					im.onclick = () => new VisoreImmagini(this.app, urls, k, salvaTesto).open();
				} else {
					cella.createDiv({ cls: "arl-meta", text: "Immagine non trovata nel vault." });
				}
				// didascalia facoltativa: se non c'è testo non si vede nessuna scritta
				const sotto = cella.createDiv({ cls: "arl-gal-didascalia" });
				const mostraTesto = () => {
					sotto.empty();
					const t = testi[v.i] ?? "";
					if (t) sotto.createSpan({ cls: "arl-gal-testo", text: t });
					const mod = sotto.createEl("button", { text: "✎", cls: "arl-gal-mod" });
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
				const rimuovi = cella.createEl("button", { text: "✕", cls: "arl-gal-x" });
				rimuovi.setAttr("aria-label", "Rimuovi dalla galleria");
				rimuovi.onclick = async () => {
					lista = lista.filter((_, j) => j !== v.i);
					testi = testi.filter((_, j) => j !== v.i);
					await this.plugin.salvaGalleria(l.file, lista, testi);
					disegna();
				};
			}
		};
		const aggiungi = async (f: TFile) => {
			const dest = this.plugin.app.metadataCache.fileToLinktext(f, l.file.path);
			if (lista.includes(dest)) return;
			lista.push(dest);
			testi.push("");
			await this.plugin.salvaGalleria(l.file, lista, testi);
			disegna();
		};

		new Setting(c)
			.setName("Immagini")
			.setDesc("Aggiungi immagini dal vault o dal computer. Rimuovere un'immagine dalla galleria non cancella il file.")
			.addButton((b) =>
				b.setButtonText("Scegli…").onClick(() => {
					const imm = this.plugin.imgDelVault();
					if (!imm.length) {
						new NoticeT("Nel vault non ci sono immagini.");
						return;
					}
					new ImmagineModal(this.plugin.app, imm, (f) => void aggiungi(f)).open();
				})
			)
			.addButton((b) =>
				b.setButtonText("Dal computer…").onClick(() => {
					const sel = createEl("input");
					sel.type = "file";
					sel.accept = "image/*";
					sel.multiple = true;
					sel.onchange = async () => {
						for (const file of Array.from(sel.files ?? [])) {
							try {
								await aggiungi(await this.plugin.importaImmagine(file));
							} catch (e) {
								new NoticeT(`Impossibile aggiungere l'immagine: ${(e as Error).message}`);
							}
						}
					};
					sel.click();
				})
			);
		c.appendChild(griglia);
		disegna();
	}

	private renderLetture(box: HTMLElement, l: Libro, btn: HTMLElement) {
		box.empty();
		box.createEl("h3", { text: "Andamento della lettura" });
		const barraBox = box.createDiv({ cls: "arl-let-barra-box" });
		box.createDiv({
			cls: "arl-meta",
			text: "Registra le pagine lette giorno per giorno. Da 10 a 20 contano 11 pagine (estremi inclusi).",
		});
		interface Riga {
			data: string;
			da: string;
			a: string;
		}
		const righe: Riga[] = l.letture.map((r) => ({ data: r.data, da: String(r.da), a: String(r.a) }));
		const intero = (t: string): number | null => (/^[1-9]\d*$/.test(t.trim()) ? parseInt(t, 10) : null);
		const valide = (): Lettura[] => {
			const out: Lettura[] = [];
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
				const perc = Math.min(100, Math.round((totale / l.pagine) * 100));
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
			const media = Math.round((totale / giorni) * 10) / 10;
			let testo = `Totale: ${totale} pagine`;
			if (l.pagine > 0) {
				const raggiunta = v.reduce((m, r) => Math.max(m, r.a), 0);
				testo += ` su ${l.pagine} · ${Math.max(0, l.pagine - raggiunta)} pagine rimanenti`;
			}
			testo += ` · ${plurale(giorni, "giorno", "giorni")} di lettura · media ${String(media).replace(".", ",")} pagine al giorno`;
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
					calc.setText(d1 !== null && a1 !== null && a1 >= d1 ? String(pagineLette({ da: d1, a: a1 })) : "—");
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
				const del = riga.createEl("button", { text: "✕", cls: "arl-ed-btn" });
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
			const v = valide().sort((p, q) => p.data.localeCompare(q.data) || p.a - q.a);
			const ultima = v.length ? v[v.length - 1].a : 0;
			righe.push({ data: isoLocale(new Date()), da: String(ultima + 1), a: "" });
			disegna();
			aggiornaRiepilogo();
			tabella.querySelectorAll<HTMLInputElement>(".arl-let-riga:last-child input.arl-let-num")[1]?.focus();
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
					new NoticeT("La pagina finale non può essere minore di quella iniziale.");
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

	private renderManuale(box: HTMLElement, l: Libro) {
		box.empty();
		box.createEl("h3", { text: "Valutazione manuale" });
		box.createDiv({
			cls: "arl-meta",
			text: "Inserisci direttamente il punteggio ARL (da 0 a 10), senza rispondere alle domande: le stelle si calcolano da sole. Sostituisce l'eventuale valutazione già presente.",
		});
		let setNome = (this.plugin.trovaSet(l.set) ?? this.plugin.setIniziale()).nome;
		let testoArl = l.valutato ? fmt(l.arl) : "";

		new Setting(box).setName("Set di valutazione").addDropdown((dd) => {
			const opzioni: Record<string, string> = {};
			for (const st of this.plugin.sets) opzioni[st.nome] = st.nome;
			dd.addOptions(opzioni)
				.setValue(setNome)
				.onChange((v) => {
					setNome = v;
					aggiorna();
				});
		});
		const anteprima = box.createDiv({ cls: "arl-stelle-box" });
		const valore = (): number | null => {
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
		new Setting(box).setName("Punteggio ARL").addText((t) => {
			t.setPlaceholder("7,0")
				.setValue(testoArl)
				.onChange((v) => {
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

	private renderPersonaggi(box: HTMLElement, l: Libro, btn: HTMLElement) {
		box.empty();
		box.createEl("h3", { text: "Personaggi" });
		const bozza: Personaggio[] = l.personaggi.map((p) => ({ ...p }));
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
					placeholder: "Nome (es. Attila)",
				});
				nome.value = p.nome;
				nome.oninput = () => (p.nome = nome.value);
				const descr = riga.createEl("input", {
					type: "text",
					cls: "arl-pers-descr",
					placeholder: "Descrizione (es. il guerriero, personaggio principale)",
				});
				descr.value = p.descrizione;
				descr.oninput = () => (p.descrizione = descr.value);
				const del = riga.createEl("button", { text: "✕", cls: "arl-ed-btn" });
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
			bozza.push({ nome: "", descrizione: "" });
			disegna();
			elenco.querySelectorAll<HTMLInputElement>(".arl-pers-nome")[bozza.length - 1]?.focus();
		};
		const salva = az.createEl("button", { text: "Salva personaggi", cls: "mod-cta" });
		salva.onclick = async () => {
			salva.disabled = true;
			try {
				await this.plugin.salvaPersonaggi(l.file, bozza);
				l.personaggi = bozza.filter((p) => p.nome.trim()).map((p) => ({
					nome: p.nome.trim(),
					descrizione: p.descrizione.trim(),
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

	private renderAnnotazioni(box: HTMLElement, l: Libro) {
		box.empty();
		box.createEl("h3", { text: TITOLO_ANNOTAZIONI });
		const area = box.createEl("textarea", {
			cls: "arl-annotazioni",
			placeholder: "Scrivi qui estratti, citazioni, note e impressioni sul libro…",
		});
		area.rows = 10;
		area.disabled = true;
		const az = box.createDiv({ cls: "arl-azioni arl-azioni-dettaglio" });
		const salva = az.createEl("button", { text: "Salva annotazioni", cls: "mod-cta" });
		salva.disabled = true;
		let caricato = false;
		void this.plugin
			.leggiAnnotazioni(l.file)
			.then((t) => {
				area.value = t;
				area.disabled = false;
				salva.disabled = false;
				caricato = true;
			})
			.catch(() => new NoticeT("Impossibile leggere la nota."));
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

	private renderDettaglio(l: Libro, apriLettura = false) {
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
				attr: { src: this.plugin.urlImmagine(fCop), alt: `Copertina di ${l.titolo}`, decoding: "async" },
			});
		}
		const info = testa.createDiv({ cls: "arl-testa-info" });
		info.createEl("h2", { text: l.titolo });
		if (l.codice !== null) info.createDiv({ cls: "arl-meta", text: `Codice ${l.codice}` });
		if (l.autore) info.createDiv({ cls: "arl-sub", text: l.autore });
		if (l.editore) info.createDiv({ cls: "arl-meta", text: l.editore });
		if (l.valutato) info.createDiv({ cls: "arl-meta", text: `Set di valutazione: ${l.set}` });
		const extra = [l.genere, l.pagine ? `${l.pagine} pagine` : ""].filter(Boolean);
		if (extra.length) info.createDiv({ cls: "arl-meta", text: extra.join(" · ") });
		if (l.prezzo !== null) {
			info.createDiv({ cls: "arl-meta", text: `Prezzo: ${formatEuro(l.prezzo)}` });
		}
		if (l.restituzione || l.restituito) {
			const sc = calcolaScadenza(l.restituzione, l.restituito, new Date());
			const riga = info.createDiv({ cls: "arl-meta" });
			riga.createSpan({
				text: l.restituzione ? `Restituzione: ${fmtData(l.restituzione)} · ` : "",
			});
			riga.createSpan({ text: sc.testo, cls: sc.classe });
		}
		if (l.inizio && l.fine) {
			info.createDiv({
				cls: "arl-meta",
				text: `${fmtData(l.inizio)} – ${fmtData(l.fine)} (${etichettaGiorni(l.giorni)})`,
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
					text: "Valutazione manuale: il punteggio ARL è stato inserito direttamente, senza le domande.",
				});
			} else if (!compat) {
				c.createDiv({
					cls: "arl-meta",
					text: set
						? `Il set «${set.nome}» è stato modificato dopo questa valutazione: i punteggi restano, ma le risposte non si possono più rivedere.`
						: `Il set di valutazione «${l.set}» non esiste più: i punteggi restano, ma le risposte non si possono più rivedere.`,
				});
			}
		} else {
			c.createDiv({
				cls: "arl-meta",
				text: "Da valutare: quando hai finito il libro premi «Valuta».",
			});
		}

		const azioni = c.createDiv({ cls: "arl-azioni arl-azioni-dettaglio" });
		const rivedibile = l.valutato && !l.manuale;
		const valuta = azioni.createEl("button", {
			text: l.manuale ? "Valuta con le domande" : l.valutato ? "Rivedi valutazione" : "Valuta",
			cls: l.valutato ? undefined : "mod-cta",
		});
		valuta.disabled = rivedibile && !compat;
		valuta.onclick = () =>
			void this.main.mostraValutazione(l, rivedibile ? 1 : 0, () => void this.main.mostraArchivio(l.file.path));

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
		azioni.createEl("button", { text: "Modifica dati" }).onclick = () =>
			this.main.mostraNuovoLibro(l);
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
			text: l.personaggi.length ? `Personaggi (${l.personaggi.length})` : "Personaggi",
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
			text: l.letture.length ? `Andamento lettura (${l.letture.length})` : "Andamento lettura",
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
				const media = Math.round((totale / Math.max(1, giorni)) * 10) / 10;
				const raggiunta = l.letture.reduce((m, r) => Math.max(m, r.a), 0);
				const parteLibro = l.pagine > 0 ? ` su ${l.pagine} · ${Math.max(0, l.pagine - raggiunta)} pagine rimanenti` : "";
				boxGraf.createDiv({
					cls: "arl-info",
					text: `Totale: ${totale} pagine${parteLibro} · ${plurale(giorni, "giorno", "giorni")} di lettura · media ${String(media).replace(".", ",")} pagine al giorno`,
				});
				boxGraf.removeClass("arl-oculto");
				btnGraf.classList.add("mod-cta");
			};
		}
		azioni.createEl("button", {
			text: l.galleria.length ? `Galleria immagini (${l.galleria.length})` : "Galleria immagini",
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
}

/* ------------------------------------------------------------------ */
/*  Set di domande: elenco ed editor                                  */
/* ------------------------------------------------------------------ */

interface Bozza {
	nome: string;
	categorie: SetCategoria[];
	soglie: number[];
	colori: string[];
}

function copiaBozza(set: { nome: string; categorie: SetCategoria[]; soglie: number[]; colori: string[] }): Bozza {
	return {
		nome: set.nome,
		soglie: [...set.soglie],
		colori: [...set.colori],
		categorie: set.categorie.map((c) => ({ ...c, domande: [...c.domande] })),
	};
}

class SetManagerView {
	private sets_sel: string | null = null;
	constructor(
		private app: App,
		private plugin: BooksAndReviewsPlugin,
		private host: HTMLElement,
		private main: MainView
	) {}

	avvia() {
		this.render();
	}

	private render() {
		const c = this.host;
		c.empty();
		c.scrollTop = 0;

		c.createEl("h2", { text: "Set di valutazione" });
		c.createDiv({
			cls: "arl-meta",
			text:
				"Un set di valutazione serve a valutare un libro attraverso domande mirate, suddivise per tematiche (per esempio Trama, Personaggi, Stile). " +
				"Ogni domanda ha risposta Sì o No: i Sì determinano il punteggio del tema (da 0 a 10) e la media dei temi, secondo i pesi, dà il punteggio ARL da cui derivano le stelle. " +
				"Il set si sceglie quando valuti un libro: Romanzi e Saggi sono già pronti, e puoi crearne di tuoi.",
		});
		c.createDiv({ cls: "arl-meta", text: SPIEGAZIONE_LIVELLO });
		if (this.sets_sel === null || !this.plugin.sets.some((x) => x.nome === this.sets_sel)) {
			this.sets_sel = this.plugin.sets[0]?.nome ?? null;
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
			creaTabellaLivelli(boxTab, new Map(lv ? [[lv.etichetta, `← ${st!.nome}`]] : []));
		};
		menu.onchange = () => {
			this.sets_sel = menu.value;
			mostra();
		};
		mostra();
		c.createDiv({
			cls: "arl-meta",
			text: `Ogni set è una nota nella cartella «${this.plugin.cartellaSetEff()}».`,
		});

		const barra = c.createDiv({ cls: "arl-toolbar" });
		const nuovo = barra.createEl("button", { text: "+ Nuovo set", cls: "mod-cta" });
		nuovo.onclick = () =>
			this.main.mostraEditorSet(
				{
					nome: "Nuovo set",
					soglie: [...SOGLIE_STANDARD],
					colori: [...COLORI_FASCE],
					categorie: [{ id: "", nome: "Tema 1", descr: "", peso: 20, domande: [""] }],
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
		const tr = table.createEl("thead").createEl("tr");
		for (const t of ["Nome", "Temi", "Domande", "Livello", "Libri", "File", "Azioni"]) {
			tr.createEl("th", { text: t, cls: ["Temi", "Domande", "Livello", "Libri"].includes(t) ? "arl-centro" : "" });
		}
		const body = table.createEl("tbody");

		for (const s of this.plugin.sets) {
			const riga = body.createEl("tr");
			riga.createEl("td", {
				text: s.file ? s.nome : `${s.nome} (predefinito, non ancora salvato)`,
				cls: "arl-titolo-cell",
			});
			riga.createEl("td", { text: String(s.categorie.length), cls: "arl-centro" });
			riga.createEl("td", { text: String(totaleDomande(s)), cls: "arl-centro" });
			riga.createEl("td", {
				text: testoLivello(this.plugin.livelloDi(s.categorie, s.soglie)),
				cls: "arl-centro arl-nowrap",
			});
			riga.createEl("td", {
				text: String(libri.filter((l) => l.set.toLowerCase() === s.nome.toLowerCase()).length),
				cls: "arl-centro",
			});
			riga.createEl("td", { text: s.file ? s.file.name : "—" });

			const azioni = riga.createEl("td").createDiv({ cls: "arl-azioni-riga" });
			azioni.createEl("button", { text: "Modifica" }).onclick = () =>
				this.main.mostraEditorSet(copiaBozza(s), s.file, s.nome);
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
				for (const e of nv.errori) box.createDiv({ cls: "arl-meta", text: `• ${e}` });
				const file = nv.file;
				box.createEl("button", { text: "Apri file" }).onclick = () => {
					void this.app.workspace.getLeaf("tab").openFile(file);
				};
			}
		}
	}
}

class SetEditorView {
	private sel = 0;
	private modificato = false;
	private focusDomanda: number | null = null;

	constructor(
		private plugin: BooksAndReviewsPlugin,
		private host: HTMLElement,
		private main: MainView,
		private bozza: Bozza,
		private file: TFile | null,
		private nomeOriginale: string | null
	) {}

	inCorso(): boolean {
		return this.modificato;
	}

	avvia() {
		this.render();
	}

	private render() {
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
				domande: x.domande.filter((d) => d.trim() !== ""),
			}));
			const l = this.plugin.livelloDi(cats, soglieValide(b.soglie) ? SOGLIE_STANDARD : b.soglie);
			const s = this.plugin.settings;
			boxLivello.createDiv({ cls: "arl-etichetta", text: "Livello del set" });
			boxLivello.createDiv({ cls: "arl-livello-valore", text: testoLivello(l) });
			if (l) {
				const riga = l.probabilita
					.map((p, k) => [k + 1, p] as const)
					.filter(([k]) => k >= 2)
					.map(([k, p]) => `${"★".repeat(k)} ${fmtPerc(p)}`)
					.join(" · ");
				boxLivello.createDiv({ cls: "arl-meta", text: `Risposte a caso, probabilità di ottenere almeno: ${riga}` });
			}
			boxLivello.createDiv({
				cls: "arl-meta",
				text: `${SPIEGAZIONE_LIVELLO} Ora: ${plurale(s.stelleTotali, "stella", "stelle")}.`,
			});
			creaTabellaLivelli(boxLivello, new Map(l ? [[l.etichetta, "← questo set"]] : []));
		};

		if (this.nomeOriginale) {
			const n = this.plugin.libriConSet(this.nomeOriginale);
			if (n > 0) {
				c.createDiv({
					cls: "arl-meta",
					text: `${plurale(n, "libro usa", "libri usano")} questo set. I loro punteggi non cambiano; se modifichi le domande, le loro risposte non si potranno più rivedere.`,
				});
			}
		}

		/* ---- Soglie delle stelle ---- */
		const sezStelle = c.createDiv({ cls: "arl-ed-sezione" });
		sezStelle.createEl("h3", { text: "Soglie delle stelle" });
		sezStelle.createDiv({
			cls: "arl-meta",
			text: "Ogni casella indica fino a quale punteggio ARL si ottengono 1, 2, 3 e 4 stelle. La quinta stella non ha una casella: comincia subito dopo il limite delle 4 stelle e arriva fino a 10. Per questo l'ultima casella può arrivare al massimo a 9,9 (con 9,9 la quinta stella si ottiene solo con 10,0). Con un numero di stelle diverso da 5 le soglie si ridistribuiscono in proporzione. Più sono alte, più il set è severo.",
		});
		const rigaPreset = sezStelle.createDiv({ cls: "arl-ed-riga" });
		rigaPreset.createSpan({ text: "Parti da", cls: "arl-ed-etichetta" });
		const rigaSoglie = sezStelle.createDiv({ cls: "arl-ed-riga" });
		rigaSoglie.createSpan({ text: "Fino a ARL", cls: "arl-ed-etichetta" });
		const anteprimaStelle = sezStelle.createDiv({ cls: "arl-anteprima" });
		const avvisoSoglie = sezStelle.createDiv({ cls: "arl-meta" });
		const inputSoglie: HTMLInputElement[] = [];
		const ultimaStella = rigaSoglie.createSpan({ cls: "arl-info" });
		const aggiornaAnteprimaStelle = () => {
			anteprimaStelle.empty();
			const err = soglieValide(b.soglie);
			avvisoSoglie.setText(err ?? "");
			const q = b.soglie[3];
			ultimaStella.setText(
				Number.isFinite(q) && q < 10 ? `★★★★★ da ${fmt(Math.round((q + 0.1) * 10) / 10)} a 10` : "★★★★★ da … a 10"
			);
			if (err) return;
			anteprimaStelle.createDiv({
				cls: "arl-etichetta",
				text: `Con ${plurale(this.plugin.settings.stelleTotali, "stella", "stelle")}`,
			});
			const sg = soglie(this.plugin.settings.stelleTotali, b.soglie);
			sg.forEach((max, k) => {
				const min = k === 0 ? 0 : sg[k - 1] + 0.1;
				const riga = anteprimaStelle.createDiv({ cls: "arl-anteprima-riga" });
				riga.createSpan({ text: "★".repeat(k + 1), cls: "arl-stelle" });
				riga.createSpan({ text: `${fmt(min)} – ${fmt(max)}` });
			});
		};
		const disegnaSoglie = () => {
			inputSoglie.forEach((inp, i) => (inp.value = String(b.soglie[i])));
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
			rigaSoglie.createSpan({ text: "★".repeat(i + 1), cls: "arl-stelle" });
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

		/* ---- Colori delle fasce ---- */
		const sezColori = c.createDiv({ cls: "arl-ed-sezione" });
		sezColori.createEl("h3", { text: "Colori delle fasce di voto" });
		sezColori.createDiv({
			cls: "arl-meta",
			text: "Le barre dei temi, il punteggio ARL e la lista prendono il colore della fascia in cui cade il voto. Le fasce sono delimitate dalle soglie delle stelle.",
		});
		const righeFasce: HTMLElement[] = [];
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
				const t = r.querySelector<HTMLElement>(".arl-fascia-range");
				if (t) t.setText(`${fmt(e[i])} – ${fmt(e[i + 1])}`);
			});
			const v = parseFloat(slider.value);
			const col = coloriValidi(b.colori);
			valProva.setText(fmt(v));
			riempProva.style.width = `${v * 10}%`;
			riempProva.style.background = sfondoVoto(v, e.slice(1, 5), col, this.plugin.settings.votoSfumato);
		};
		slider.addEventListener("input", aggiornaFasce);
		const inputColori: HTMLInputElement[] = [];
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
			inputColori.forEach((inp, i) => (inp.value = b.colori[i]));
			this.modificato = true;
			aggiornaFasce();
		};
		// le fasce seguono le soglie
		inputSoglie.forEach((inp) => inp.addEventListener("input", aggiornaFasce));
		rigaPreset.querySelectorAll("button").forEach((bt) => bt.addEventListener("click", aggiornaFasce));
		aggiornaFasce();

		/* ---- Temi ---- */
		const sezTemi = c.createDiv({ cls: "arl-ed-sezione" });
		const testaTemi = sezTemi.createDiv({ cls: "arl-ed-testa" });
		testaTemi.createSpan({ text: "Temi", cls: "arl-etichetta" });
		testaTemi.createSpan({ text: "Peso %", cls: "arl-etichetta" });

		b.categorie.forEach((cat, i) => {
			const riga = sezTemi.createDiv({ cls: "arl-ed-riga" });
			riga.toggleClass("is-selected", i === this.sel);
			riga.createSpan({ text: `${i + 1}.`, cls: "arl-ed-num" });
			const nome = riga.createEl("input", { type: "text" });
			nome.value = cat.nome;
			nome.addEventListener("input", () => {
				cat.nome = nome.value;
				this.modificato = true;
			});
			const peso = riga.createEl("input", { type: "number", cls: "arl-ed-peso" });
			peso.min = "0";
			peso.value = String(cat.peso);
			peso.addEventListener("input", () => {
				const n = parseFloat(peso.value.replace(",", "."));
				cat.peso = Number.isFinite(n) && n >= 0 ? n : 0;
				this.modificato = true;
				aggiornaTotale();
				aggiornaLivello();
			});

			const sel = riga.createEl("button", {
				text: `Domande (${cat.domande.length})`,
				cls: i === this.sel ? "mod-cta" : "",
			});
			sel.onclick = () => {
				this.sel = i;
				this.render();
			};
			this.pulsantiOrdine(riga, b.categorie, i, (nuovoIndice) => {
				if (this.sel === i) this.sel = nuovoIndice;
				else if (this.sel === nuovoIndice) this.sel = i;
			});

			const elimina = riga.createEl("button", { text: "×", cls: "arl-ed-btn" });
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
				domande: [""],
			});
			this.sel = b.categorie.length - 1;
			this.modificato = true;
			this.render();
		};
		const totale = piedeTemi.createSpan({ cls: "arl-info" });
		const aggiornaTotale = () => {
			const somma = b.categorie.reduce((a, x) => a + x.peso, 0);
			totale.setText(
				somma === 100
					? "Totale pesi: 100%"
					: `Totale pesi: ${Math.round(somma * 10) / 10}% (vengono riportati a 100)`
			);
		};
		aggiornaTotale();
		aggiornaLivello();

		/* ---- Domande del tema selezionato ---- */
		const cat = b.categorie[this.sel];
		const sezDomande = c.createDiv({ cls: "arl-ed-sezione" });
		sezDomande.createEl("h3", { text: `Domande del tema «${cat.nome}»` });

		const descRiga = sezDomande.createDiv({ cls: "arl-ed-riga" });
		descRiga.createSpan({ text: "Descrizione", cls: "arl-ed-etichetta" });
		const desc = descRiga.createEl("input", { type: "text" });
		desc.placeholder = "Facoltativa, appare sopra le domande";
		desc.value = cat.descr;
		desc.addEventListener("input", () => {
			cat.descr = desc.value;
			this.modificato = true;
		});

		const inputs: HTMLInputElement[] = [];
		cat.domande.forEach((dom, i) => {
			const riga = sezDomande.createDiv({ cls: "arl-ed-riga" });
			riga.createSpan({ text: `${i + 1}.`, cls: "arl-ed-num" });
			const input = riga.createEl("input", { type: "text" });
			input.value = dom;
			input.placeholder = "Domanda a cui si risponde Sì o No";
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
			this.pulsantiOrdine(riga, cat.domande, i, () => undefined);
			const elimina = riga.createEl("button", { text: "×", cls: "arl-ed-btn" });
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
			text: `${plurale(cat.domande.length, "domanda", "domande")} · punteggio del tema da 0 a 10`,
		});

		/* ---- Azioni ---- */
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
				new NoticeT(`Salvataggio non riuscito: ${(e as Error).message}`);
				salva.disabled = false;
			}
		};

		this.host.scrollTop = scroll;
		if (this.focusDomanda !== null) {
			inputs[this.focusDomanda]?.focus();
			this.focusDomanda = null;
		}
	}

	/** Aggiunge i pulsanti ↑ ↓ a una riga di una lista modificabile. */
	private pulsantiOrdine<T>(
		riga: HTMLElement,
		lista: T[],
		i: number,
		dopoSpostamento: (nuovoIndice: number) => void
	) {
		const sposta = (da: number, a: number) => {
			if (a < 0 || a >= lista.length) return;
			const [x] = lista.splice(da, 1);
			lista.splice(a, 0, x);
			dopoSpostamento(a);
			this.modificato = true;
			this.render();
		};
		const su = riga.createEl("button", { text: "↑", cls: "arl-ed-btn" });
		su.setAttr("aria-label", "Sposta su");
		su.disabled = i === 0;
		su.onclick = () => sposta(i, i - 1);
		const giu = riga.createEl("button", { text: "↓", cls: "arl-ed-btn" });
		giu.setAttr("aria-label", "Sposta giù");
		giu.disabled = i === lista.length - 1;
		giu.onclick = () => sposta(i, i + 1);
	}

	private valida(): string | null {
		const b = this.bozza;
		if (!b.nome.trim()) return "Scrivi il nome del set.";
		const errSoglie = soglieValide(b.soglie);
		if (errSoglie) return errSoglie;
		const altro = this.plugin.sets.find(
			(s) =>
				s.nome.toLowerCase() === b.nome.trim().toLowerCase() &&
				s.nome.toLowerCase() !== (this.nomeOriginale ?? "").toLowerCase()
		);
		if (altro) return `Esiste già un set chiamato «${altro.nome}».`;

		const nomi = new Set<string>();
		for (const c of b.categorie) {
			const n = c.nome.trim().toLowerCase();
			if (!n) return "Ogni tema deve avere un nome.";
			if (nomi.has(n)) return `Il tema «${c.nome.trim()}» è ripetuto.`;
			nomi.add(n);
			if (c.domande.every((d) => !d.trim())) return `Il tema «${c.nome.trim()}» non ha domande.`;
		}
		if (b.categorie.every((c) => c.peso === 0)) return "Almeno un tema deve avere un peso maggiore di zero.";
		return null;
	}

	/** Copia ripulita (spazi, domande vuote, id assegnati) pronta per essere salvata. */
	private pulita(): Bozza {
		const usati = new Set<string>(this.bozza.categorie.map((c) => c.id).filter(Boolean));
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
					domande: c.domande.map((d) => d.trim()).filter(Boolean),
				};
			}),
		};
	}
}

/* ------------------------------------------------------------------ */
/*  Scheda principale con barra dei menu                              */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Libreria virtuale                                                  */
/* ------------------------------------------------------------------ */

/** Ultimo sfondo ridotto e sfocato: si riusa finché l'immagine e le impostazioni non cambiano. */
const CACHE_SFONDO = { chiave: "", url: "" };

const LEGNO =
	"repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 2px, rgba(0,0,0,0) 2px 9px), linear-gradient(180deg, #c8a06b, #b58650)";

function hashTesto(t: string): number {
	let h = 0;
	for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
	return h;
}

function hslHex(h: number, sat: number, lum: number): string {
	const a = sat * Math.min(lum, 1 - lum);
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const c = lum - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
		return Math.round(255 * c)
			.toString(16)
			.padStart(2, "0");
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

/** Colore del dorso: quello scelto per il genere, altrimenti una tinta fissa ricavata dal nome del genere. */
function coloreGenere(st: ARLSettings, genere: string): string {
	const g = genere.trim().toLowerCase();
	if (!g) return "#8a8f98";
	return st.vlGeneri[g] ?? hslHex(hashTesto(g) % 360, 0.5, 0.4);
}

/** Bianco o quasi nero, a seconda di quale si legge meglio sul colore dato. */
function testoSu(sfondo: string): string {
	return contrasto(sfondo, "#ffffff") >= contrasto(sfondo, "#1b1b1b") ? "#ffffff" : "#1b1b1b";
}

/**
 * Rimpicciolisce il carattere di tutti i dorsi finché titolo e autore ci stanno.
 * Lavora «a blocchi»: scrive tutte le misure, poi le legge tutte, così il browser
 * ricalcola il layout poche volte invece di una volta per ogni libro e per ogni tentativo.
 * `cache` ricorda il risultato per testo e dimensione del dorso.
 */
function adattaTutti(testi: HTMLElement[], cache: Map<string, number>) {
	if (testi.length === 0) return;
	const MAX = 18;
	const MIN = 4;
	// le dimensioni del dorso non dipendono dal carattere: si leggono una volta sola
	const chiavi = testi.map((t) => `${t.dataset.k ?? ""}|${t.clientWidth}x${t.clientHeight}`);
	const da: number[] = [];
	testi.forEach((t, i) => {
		const noto = cache.get(chiavi[i]);
		if (noto !== undefined) t.style.fontSize = `${noto}px`;
		else da.push(i);
	});
	if (da.length === 0) return;
	const entra = (t: HTMLElement) => t.scrollWidth <= t.clientWidth + 1 && t.scrollHeight <= t.clientHeight + 1;
	const lo = new Map<number, number>();
	const hi = new Map<number, number>();
	for (const i of da) testi[i].style.fontSize = `${MAX}px`;
	let aperti: number[] = [];
	for (const i of da) {
		if (entra(testi[i])) cache.set(chiavi[i], MAX);
		else {
			lo.set(i, MIN);
			hi.set(i, MAX);
			aperti.push(i);
		}
	}
	while (aperti.length > 0) {
		for (const i of aperti) testi[i].style.fontSize = `${((lo.get(i) as number) + (hi.get(i) as number)) / 2}px`;
		const ancora: number[] = [];
		for (const i of aperti) {
			const mid = ((lo.get(i) as number) + (hi.get(i) as number)) / 2;
			if (entra(testi[i])) lo.set(i, mid);
			else hi.set(i, mid);
			if ((hi.get(i) as number) - (lo.get(i) as number) > 0.4) ancora.push(i);
		}
		aperti = ancora;
	}
	for (const i of lo.keys()) {
		const v = lo.get(i) as number;
		testi[i].style.fontSize = `${v}px`;
		cache.set(chiavi[i], v);
	}
}

/** Finestra che chiede un nome (per le disposizioni della libreria virtuale). */
class NomeModal extends Modal {
	constructor(
		app: App,
		private titolo: string,
		private iniziale: string,
		private esiste: (nome: string) => boolean,
		private ok: (nome: string) => void | Promise<void>
	) {
		super(app);
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
				msg.setText("Esiste già una disposizione con questo nome.");
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
}

/** Finestra di conferma con due pulsanti. */
/** Guida ai set di valutazione, in italiano o in inglese. */
class GuidaSetModal extends Modal {
	constructor(app: App, private lingua: Lingua) {
		super(app);
	}

	onOpen() {
		this.modalEl.addClass("arl-guida");
		const c = this.contentEl;
		c.empty();
		const it = this.lingua !== "en";
		const T = (a: string, b: string) => (it ? a : b);
		c.createEl("h2", { text: T("Guida ai set di valutazione", "Guide to evaluation sets") });
		const sez = (titolo: string, righe: string[]) => {
			c.createEl("h4", { text: titolo });
			for (const r of righe) c.createEl("p", { text: r });
		};
		sez(T("1. Cos'è un set", "1. What a set is"), [
			T(
				"Un set è il questionario con cui valuti un libro. È diviso in temi (per esempio Trama, Personaggi, Stile); ogni tema ha domande a cui rispondi Sì o No.",
				"A set is the questionnaire you rate a book with. It is divided into themes (for example Plot, Characters, Style); each theme has questions you answer Yes or No."
			),
			T(
				"I Sì danno il punteggio del tema (0–10); la media dei temi, secondo i pesi, è il punteggio ARL (0–10) da cui derivano le stelle.",
				"The Yes answers give the theme score (0–10); the weighted average of the themes is the ARL score (0–10), from which the stars derive."
			),
		]);
		sez(T("2. Come crearne uno", "2. How to create one"), [
			T(
				"Nella schermata «Set di valutazione» premi «+ Nuovo set», oppure «Duplica» su un set esistente e modificalo: è il modo più rapido.",
				"On the «Evaluation sets» screen press «+ New set», or «Duplicate» an existing set and edit it: this is the quickest way."
			),
			T(
				"Romanzi e Saggi sono già pronti: puoi usarli così o prenderli come esempio. «Ripristina» li riporta all'originale.",
				"Novels and Essays are ready-made: use them as they are or as a model. «Restore» brings them back to the original."
			),
		]);
		sez(T("3. Come si compone", "3. What it is made of"), [
			T(
				"Temi: dai a ciascuno un nome, una breve descrizione e un peso (quanto conta nella media).",
				"Themes: give each one a name, a short description and a weight (how much it counts in the average)."
			),
			T(
				"Domande: formulale in modo che «Sì» sia sempre la risposta positiva (per esempio «La trama è priva di buchi logici?»).",
				"Questions: word them so that «Yes» is always the positive answer (for example «Is the plot free of logical holes?»)."
			),
			T(
				"Soglie: i quattro punteggi ARL oltre i quali scattano 2, 3, 4 e 5 stelle. Colori delle fasce: i colori del punteggio.",
				"Thresholds: the four ARL scores above which 2, 3, 4 and 5 stars are earned. Band colours: the colours of the score."
			),
		]);
		sez(T("4. Il livello di difficoltà", "4. The difficulty level"), [
			T(
				"Il plugin calcola quanto è raro ottenere le stelle rispondendo a caso: Facile, Accessibile, Impegnativo, Difficile, Molto difficile. Dipende da domande, pesi e soglie.",
				"The plugin works out how rare it is to earn stars by answering at random: Easy, Accessible, Demanding, Hard, Very hard. It depends on questions, weights and thresholds."
			),
		]);
		sez(T("5. Consigli", "5. Tips"), [
			T(
				"Usa lo stesso numero di domande per ogni tema (per esempio 5 temi da 10 domande): i punteggi restano confrontabili.",
				"Use the same number of questions for every theme (for example 5 themes of 10 questions): scores stay comparable."
			),
			T(
				"Non cambiare un set già usato se vuoi confrontare i libri: duplicalo e modifica la copia.",
				"Do not change a set you have already used if you want to compare books: duplicate it and edit the copy."
			),
		]);
		sez(T("6. Il file del set", "6. The set file"), [
			T(
				"Ogni set è una nota Markdown nella cartella dei set (impostabile nelle opzioni): la modifichi anche a mano. Un tema è un titolo «## Nome», le domande sono un elenco numerato sotto di esso.",
				"Each set is a Markdown note in the sets folder (configurable in the settings): you can edit it by hand too. A theme is a «## Name» heading, the questions are a numbered list under it."
			),
		]);
		const az = c.createDiv({ cls: "arl-nome-azioni" });
		const ok = az.createEl("button", { text: T("Chiudi", "Close"), cls: "mod-cta" });
		ok.onclick = () => this.close();
	}

	onClose() {
		this.contentEl.empty();
	}
}

class SiNoModal extends Modal {
	constructor(
		app: App,
		private domanda: string,
		private si: () => void | Promise<void>
	) {
		super(app);
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
}

class LibreriaVirtualeView implements Vista {
	private ord: Libro[] = [];
	private libri: Libro[] = [];
	private barraDisp: HTMLElement | null = null;
	private scaffale!: HTMLElement;
	private tip!: HTMLElement;
	private trascinato = -1;
	private dest = -1;
	private ultimaLarghezza = 0;
	private sopra: HTMLElement | null = null; // dorso sotto il puntatore
	private marcato: HTMLElement | null = null; // elemento con il segno di inserimento
	private inTrascinamento: HTMLElement | null = null;
	private cacheFont = new Map<string, number>();
	private tipW = 0;
	private tipH = 0;
	private puntatore = { x: 0, y: 0 };
	private rafTip = 0;

	constructor(
		private plugin: BooksAndReviewsPlugin,
		private host: HTMLElement,
		private main: MainView
	) {}

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
			text: "Trascina i libri per cambiarne la posizione. Clic su un libro per aprirlo.",
		});
		const barra = c.createDiv({ cls: "arl-vl-barra" });
		this.barraDisp = barra.createDiv({ cls: "arl-vl-disp" });
		const gruppi: [string, string, string, string][] = [
			["Codice", "codice", "dal più alto al più basso", "dal più basso al più alto"],
			["Lettura", "lettura", "dalla più recente alla più vecchia", "dalla più vecchia alla più recente"],
			["Pagine", "pagine", "dal libro con più pagine a quello con meno", "dal libro con meno pagine a quello con più"],
		];
		for (const [nome, chiave, giu, su] of gruppi) {
			const g = barra.createDiv({ cls: "arl-vl-gruppo" });
			g.createSpan({ cls: "arl-vl-etichetta", text: `${nome}:` });
			for (const [dir, freccia, spiega] of [
				["desc", "↓", giu],
				["asc", "↑", su],
			] as const) {
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
					// la schermata è stata chiusa: niente più lavoro inutile
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
	private disegnaParete(parete: HTMLElement) {
		const st = this.plugin.settings;
		const f = st.vlImmagine ? this.plugin.app.vault.getAbstractFileByPath(st.vlImmagine) : null;
		if (!(f instanceof TFile)) return;
		parete.addClass("ha-immagine");
		const img = parete.createDiv({ cls: "arl-vl-sfondo" });
		const vel = parete.createDiv({ cls: "arl-vl-velo" });
		vel.style.background = `rgba(0, 0, 0, ${st.vlImgOscura / 100})`;
		const modo = st.vlImgModo;
		const sf = st.vlImgSfoca;
		const mostra = (url: string, sfocaCss: number) => {
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
		// foto grandi e sfocatura in tempo reale appesantiscono lo scorrimento:
		// l'immagine si riduce una volta sola, già sfocata, e il risultato resta in memoria
		void this.sfondoLeggero(f, modo, sf, parete.clientWidth)
			.then((url) => mostra(url, 0))
			.catch(originale);
	}

	private async sfondoLeggero(f: TFile, modo: string, sfoca: number, larghVista: number): Promise<string> {
		const chiave = `${f.path}|${f.stat.mtime}|${f.stat.size}|${modo}|${sfoca}`;
		if (CACHE_SFONDO.chiave === chiave) return CACHE_SFONDO.url;
		const dati = await this.plugin.app.vault.readBinary(f);
		const bmp = await createImageBitmap(new Blob([dati]));
		try {
			const MAXLATO = 1600;
			const scala = Math.min(1, MAXLATO / Math.max(bmp.width, bmp.height));
			if (scala === 1 && sfoca === 0) return this.plugin.urlImmagine(f); // già leggera
			const cw = Math.max(1, Math.round(bmp.width * scala));
			const ch = Math.max(1, Math.round(bmp.height * scala));
			const cv = createEl("canvas");
			cv.width = cw;
			cv.height = ch;
			const ctx = cv.getContext("2d");
			if (!ctx || (sfoca > 0 && !("filter" in ctx))) throw new Error("canvas non adatto");
			const raggio = (sfoca * cw) / Math.max(400, larghVista || 1200);
			const m = Math.ceil(raggio * 2); // bordo in più: ai lati la sfocatura non lascia aloni
			if (raggio > 0) ctx.filter = `blur(${raggio}px)`;
			ctx.drawImage(bmp, -m, -m, cw + 2 * m, ch + 2 * m);
			const blob = await new Promise<Blob | null>((ok) => cv.toBlob(ok, "image/jpeg", 0.85));
			if (!blob) throw new Error("immagine non creata");
			if (CACHE_SFONDO.url.startsWith("blob:")) URL.revokeObjectURL(CACHE_SFONDO.url);
			CACHE_SFONDO.chiave = chiave;
			CACHE_SFONDO.url = URL.createObjectURL(blob);
			return CACHE_SFONDO.url;
		} finally {
			bmp.close();
		}
	}

	private criterioAttivo(): string {
		const st = this.plugin.settings;
		return st.vlCriterio || (st.vlOrdine.length === 0 ? "codice-desc" : "");
	}

	private disposizione() {
		const st = this.plugin.settings;
		return st.vlDisposizioni.find((d) => d.nome === st.vlCorrente);
	}

	private percorsiAttuali(): string[] {
		return this.ord.map((l) => l.file.path);
	}

	/** La disposizione caricata è stata cambiata (a mano o con i tasti) senza salvare. */
	private modificata(): boolean {
		const d = this.disposizione();
		if (!d) return false;
		const salvata = this.ordina(this.libri, d.ordine).map((l) => l.file.path);
		const attuale = this.percorsiAttuali();
		return salvata.length !== attuale.length || salvata.some((p, i) => p !== attuale[i]);
	}

	private async carica(nome: string) {
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

	private async salvaCorrente() {
		const d = this.disposizione();
		if (!d) return;
		d.ordine = this.percorsiAttuali();
		await this.plugin.salvaImpostazioni();
		this.evidenziaCriterio();
	}

	private nomeEsiste(nome: string, tranne = ""): boolean {
		const n = nome.trim().toLowerCase();
		return this.plugin.settings.vlDisposizioni.some((d) => d.nome.toLowerCase() === n && d.nome !== tranne);
	}

	private salvaCome() {
		new NomeModal(this.plugin.app, "Salva la disposizione come", "", (nome) => this.nomeEsiste(nome), async (nome) => {
			const st = this.plugin.settings;
			st.vlDisposizioni.push({ nome, ordine: this.percorsiAttuali() });
			st.vlCorrente = nome;
			st.vlOrdine = this.percorsiAttuali();
			await this.plugin.salvaImpostazioni();
			this.evidenziaCriterio();
		}).open();
	}

	private altreAzioni(ev: MouseEvent) {
		const d = this.disposizione();
		if (!d) return;
		const st = this.plugin.settings;
		const m = new Menu();
		m.addItem((i) =>
			i
				.setTitle(tr("Rinomina"))
				.setIcon("pencil")
				.onClick(() =>
					new NomeModal(this.plugin.app, "Rinomina la disposizione", d.nome, (n) => this.nomeEsiste(n, d.nome), async (nome) => {
						st.vlCorrente = nome;
						d.nome = nome;
						await this.plugin.salvaImpostazioni();
						this.evidenziaCriterio();
					}).open()
				)
		);
		m.addItem((i) =>
			i
				.setTitle(tr("Duplica"))
				.setIcon("copy")
				.onClick(() =>
					new NomeModal(this.plugin.app, "Duplica la disposizione", `${d.nome} (copia)`, (n) => this.nomeEsiste(n), async (nome) => {
						st.vlDisposizioni.push({ nome, ordine: [...d.ordine] });
						await this.carica(nome);
					}).open()
				)
		);
		m.addItem((i) =>
			i
				.setTitle(tr("Elimina"))
				.setIcon("trash")
				.onClick(() =>
					new SiNoModal(this.plugin.app, `Eliminare la disposizione «${d.nome}»? I libri restano come sono ora.`, async () => {
						st.vlDisposizioni = st.vlDisposizioni.filter((x) => x !== d);
						st.vlCorrente = "";
						await this.plugin.salvaImpostazioni();
						this.evidenziaCriterio();
					}).open()
				)
		);
		m.showAtMouseEvent(ev);
	}

	private disegnaDisposizioni() {
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
		if (mod) b.createSpan({ cls: "arl-vl-modificata", text: "● modificata" });
		const salva = b.createEl("button", { text: "Salva" });
		salva.disabled = !!this.disposizione() && !mod;
		salva.onclick = () => {
			if (this.disposizione()) void this.salvaCorrente();
			else this.salvaCome();
		};
		b.createEl("button", { text: "Salva come…" }).onclick = () => this.salvaCome();
		if (mod) b.createEl("button", { text: "Ripristina" }).onclick = () => void this.carica(st.vlCorrente);
		const piu = b.createEl("button", { text: "⋯" });
		piu.setAttr("aria-label", "Altre azioni");
		piu.disabled = !this.disposizione();
		piu.onclick = (ev) => this.altreAzioni(ev);
	}

	private evidenziaCriterio() {
		this.disegnaDisposizioni();
		const attivo = this.criterioAttivo();
		this.host.querySelectorAll<HTMLElement>(".arl-vl-ordina").forEach((b) => {
			b.toggleClass("is-active", b.dataset.criterio === attivo);
		});
	}

	/** Riordina tutti i libri con il criterio scelto e salva il risultato. */
	private async applicaCriterio(criterio: string) {
		const [chiave, dir] = criterio.split("-");
		const segno = dir === "desc" ? -1 : 1;
		const valore = (l: Libro): number | string | null => {
			if (chiave === "codice") return l.codice;
			if (chiave === "pagine") return l.pagine > 0 ? l.pagine : null;
			return l.fine || null;
		};
		this.ord.sort((a, b) => {
			const va = valore(a);
			const vb = valore(b);
			if (va === null || vb === null) {
				if (va !== vb) return va === null ? 1 : -1; // senza dato: sempre in fondo
			} else if (va !== vb) {
				return (va < vb ? -1 : 1) * segno;
			}
			// parità: codice più alto per primo, senza codice in fondo
			return (a.codice === null ? 1 : 0) - (b.codice === null ? 1 : 0) || (b.codice ?? 0) - (a.codice ?? 0);
		});
		this.plugin.settings.vlOrdine = this.ord.map((l) => l.file.path);
		this.plugin.settings.vlCriterio = criterio;
		this.disegna();
		this.evidenziaCriterio();
		await this.plugin.salvaImpostazioni(); // prima si ridisegna, poi si scrive su disco
	}

	/** Ordine scelto dall'utente; senza scelta, per codice dal più alto al più basso. */
	private ordina(libri: Libro[], lista: string[] = this.plugin.settings.vlOrdine): Libro[] {
		const perPercorso = new Map(libri.map((l) => [l.file.path, l] as const));
		const visti = new Set<string>();
		const out: Libro[] = [];
		for (const p of lista) {
			const l = perPercorso.get(p);
			if (l && !visti.has(p)) {
				visti.add(p);
				out.push(l);
			}
		}
		// codice dal più alto al più basso (come la lista); i libri senza codice in fondo
		const resto = libri
			.filter((l) => !visti.has(l.file.path))
			.sort(
				(a, b) =>
					(a.codice === null ? 1 : 0) - (b.codice === null ? 1 : 0) ||
					(b.codice ?? 0) - (a.codice ?? 0) ||
					a.titolo.localeCompare(b.titolo, "it")
			);
		// i libri non ancora posizionati (per esempio quelli nuovi) vanno all'inizio, come in lista
		return resto.concat(out);
	}

	private disegna() {
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
			el.createDiv({ cls: "arl-vuoto", text: "Nessun libro in libreria. Usa «Nuovo libro» per aggiungere il primo." });
			return;
		}
		// si costruisce fuori dalla pagina e si inserisce in un colpo solo: un solo layout
		const nuovo = createDiv();
		const colori = new Map<string, { bg: string; fg: string }>();
		const ripiani = Math.ceil(this.ord.length / n);
		for (let r = 0; r < ripiani; r++) {
			const ripiano = nuovo.createDiv({ cls: "arl-vl-ripiano" });
			const riga = ripiano.createDiv({ cls: "arl-vl-riga" });
			const inizio = r * n;
			const fine = Math.min(this.ord.length, inizio + n);
			riga.dataset.fine = String(fine);
			for (let i = inizio; i < fine; i++) this.creaLibro(riga, this.ord[i], i, colori);
			// spazio vuoto in fondo all'ultimo ripiano, perché i libri non si allarghino
			if (fine - inizio < n) riga.createDiv({ cls: "arl-vl-vuoto" }).style.flexGrow = String((n - (fine - inizio)) * 2);
			ripiano.createDiv({ cls: "arl-vl-asse" });
		}
		el.replaceChildren(...Array.from(nuovo.childNodes));
		this.dimensiona();
	}

	/** Solo struttura e stile: gli eventi sono gestiti una volta sola dallo scaffale (collegaEventi). */
	private creaLibro(riga: HTMLElement, l: Libro, i: number, colori: Map<string, { bg: string; fg: string }>) {
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
		b.style.flexGrow = String(l.pagine > 0 ? 1 + Math.min(l.pagine, 1000) / 400 : 1.8);
		b.style.height = `${82 + (hashTesto(l.titolo) % 18)}%`;
		b.style.background = c.bg;
		b.style.color = c.fg;
		const t = b.createDiv({ cls: "arl-vl-testo" });
		const autore = st.vlMostra === "titoloAutore" && l.autore ? l.autore : "";
		t.dataset.k = `${l.titolo}\u0001${autore}`;
		if (l.codice !== null) {
			// il codice sta in basso, in orizzontale
			b.createDiv({ cls: "arl-vl-codice", text: String(l.codice).padStart(2, "0") });
			t.addClass("ha-codice");
		}
		t.createDiv({ cls: "arl-vl-titolo", text: l.titolo });
		if (autore) t.createDiv({ cls: "arl-vl-autore", text: autore });
	}

	/** Un solo gruppo di ascoltatori per tutta la libreria, invece di cinque per ogni libro. */
	private collegaEventi() {
		const el = this.scaffale;
		const libroDa = (t: EventTarget | null): HTMLElement | null =>
			t instanceof Element ? t.closest<HTMLElement>(".arl-vl-libro") : null;
		const indiceDi = (b: HTMLElement) => Number(b.dataset.i);

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
			this.inTrascinamento?.removeClass("is-trascinato");
			this.inTrascinamento = null;
			this.pulisciSegni();
			this.trascinato = -1;
		});
		el.addEventListener("dragover", (ev) => {
			if (this.trascinato < 0) return;
			const b = libroDa(ev.target);
			let bersaglio: HTMLElement | null;
			let cls: string;
			let dest: number;
			if (b) {
				const r = b.getBoundingClientRect();
				const dopo = ev.clientX > r.left + r.width / 2;
				bersaglio = b;
				cls = dopo ? "ins-dopo" : "ins-prima";
				dest = indiceDi(b) + (dopo ? 1 : 0);
			} else {
				const riga = ev.target instanceof Element ? ev.target.closest<HTMLElement>(".arl-vl-riga") : null;
				if (!riga) return;
				bersaglio = riga;
				cls = "is-dest";
				dest = Number(riga.dataset.fine);
			}
			ev.preventDefault();
			this.dest = dest;
			// il DOM si tocca solo quando il segno cambia davvero
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

	private pulisciSegni() {
		if (!this.marcato) return;
		this.marcato.removeClasses(["ins-prima", "ins-dopo", "is-dest"]);
		this.marcato = null;
	}

	private async sposta(da: number, dest: number) {
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
		await this.plugin.salvaImpostazioni(); // prima si ridisegna, poi si scrive su disco
	}

	private nascondiTip() {
		this.tip.removeClass("is-visibile");
		if (this.rafTip) {
			window.cancelAnimationFrame(this.rafTip);
			this.rafTip = 0;
		}
	}

	/** Il contenuto cambia solo quando cambia il libro; muovere il mouse sposta soltanto la scheda. */
	private mostraTip(l: Libro | undefined, x: number, y: number) {
		if (!l) return;
		const tip = this.tip;
		tip.empty();
		tip.createDiv({ cls: "arl-vl-tip-titolo", text: l.titolo });
		const sotto = [l.autore, l.genere].filter(Boolean).join(" · ");
		if (sotto) tip.createDiv({ cls: "arl-meta", text: sotto });
		if (l.valutato) {
			tip.createDiv({
				text: `ARL ${fmt(l.arl)}  ${stringaStelle(this.plugin.stelleDi(l.arl, l.set))}`,
			});
		} else tip.createDiv({ cls: "arl-meta", text: "Da valutare" });
		tip.addClass("is-visibile");
		this.tipW = tip.offsetWidth; // l'unica misura: una per libro, non una per movimento
		this.tipH = tip.offsetHeight;
		this.posizionaTip(x, y);
	}

	/** Al massimo un aggiornamento per fotogramma, con transform: nessun ricalcolo del layout. */
	private posizionaTip(x: number, y: number) {
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
	private dimensiona() {
		const el = this.scaffale;
		const w = el.clientWidth;
		this.ultimaLarghezza = w;
		const h = Math.max(150, Math.min(300, Math.round((w / this.plugin.settings.vlPerRipiano) * 5)));
		el.style.setProperty("--arl-vl-h", `${h}px`);
		// prima tutte le letture, poi tutte le scritture
		const codici = Array.from(el.querySelectorAll<HTMLElement>(".arl-vl-codice"));
		const larghezze = codici.map((c) => c.parentElement?.clientWidth ?? 30);
		codici.forEach((c, i) => {
			c.style.fontSize = `${Math.max(7, Math.min(13, larghezze[i] / ((c.textContent?.length ?? 2) * 0.62 + 0.8)))}px`;
		});
		adattaTutti(Array.from(el.querySelectorAll<HTMLElement>(".arl-vl-testo")), this.cacheFont);
	}
}

type Sezione = "nuovo" | "libreria" | "virtuale" | "valuta" | "set";

/** Una schermata che può avere lavoro non salvato. */
interface Vista {
	inCorso(): boolean;
}

class MainView extends ItemView {
	private corpo!: HTMLElement;
	private bottoni = new Map<Sezione, HTMLButtonElement>();
	private corrente: Vista | null = null;
	private abbandono = false;

	constructor(leaf: WorkspaceLeaf, private plugin: BooksAndReviewsPlugin) {
		super(leaf);
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
	private preparaFocus() {
		const el = this.contentEl;
		el.setAttr("tabindex", "-1"); // rende la schermata focalizzabile

		// Esc dentro la schermata lo gestisce la schermata: non arriva a Obsidian
		this.registerDomEvent(el, "keydown", (evt: KeyboardEvent) => {
			if (evt.key !== "Escape") return;
			evt.stopPropagation();
			const attivo = el.ownerDocument.activeElement;
			if (attivo && attivo !== el && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(attivo.tagName)) {
				this.focusSchermata(true);
			}
		});

		// Un click su una zona vuota riporta il focus alla schermata
		this.registerDomEvent(
			el,
			"mousedown",
			() => {
				if (!el.contains(el.ownerDocument.activeElement)) this.focusSchermata();
			},
			{ capture: true }
		);

		// Se l'elemento con il focus sparisce (es. il pulsante «Indietro» dopo il cambio di
		// schermata) il focus passerebbe al documento e Esc andrebbe a Obsidian: lo riprendo.
		let inAttesa = false;
		const riprendi = () => {
			if (inAttesa) return;
			inAttesa = true;
			window.setTimeout(() => {
				inAttesa = false;
				const doc = el.ownerDocument;
				const foglia = el.closest(".workspace-leaf");
				if (!el.isConnected || !foglia?.classList.contains("mod-active")) return;
				if (!doc.activeElement || doc.activeElement === doc.body) this.focusSchermata(true);
			}, 0);
		};
		this.registerDomEvent(el, "focusout", riprendi);
		// anche quando una schermata viene ridisegnata e l'elemento con il focus viene rimosso
		const osservatore = new MutationObserver(riprendi);
		osservatore.observe(el, { childList: true, subtree: true });
		this.register(() => osservatore.disconnect());

		// Tornando sulla scheda del plugin, il focus torna al plugin
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", (leaf) => {
				if (leaf === this.leaf) this.focusSchermata();
			})
		);
	}

	private focusSchermata(forza = false) {
		const el = this.contentEl;
		if (!forza && el.contains(el.ownerDocument.activeElement)) return;
		el.focus({ preventScroll: true });
	}

	async onOpen() {
		const c = this.contentEl;
		c.empty();
		c.addClass("arl-view");
		// ogni volta che si apre il plugin le liste ripartono ordinate per codice, dal più grande al più piccolo
		this.plugin.statoListe = {};
		collegaTraduzione(c);
		this.plugin.applicaLarghezza();
		this.preparaFocus();
		window.setTimeout(() => this.focusSchermata(), 0);

		const menu = c.createDiv({ cls: "arl-menubar" });
		const voci: [Sezione, string][] = [
			["nuovo", "Nuovo libro"],
			["libreria", "Libreria"],
			["virtuale", "Libreria virtuale"],
			["valuta", "Valuta libro"],
			["set", "Set di valutazione"],
		];
		for (const [id, testo] of voci) {
			const b = menu.createEl("button", { text: testo });
			b.onclick = () => this.vai(id);
			this.bottoni.set(id, b);
			if (id === "virtuale") {
				menu.createEl("button", { text: "Informazioni libreria" }).onclick = () =>
					new InfoLibreriaModal(this.app, this.plugin).open();
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

	private evidenzia(s: Sezione) {
		this.bottoni.forEach((b, id) => b.toggleClass("is-active", id === s));
	}

	/** Cambio sezione, con protezione se c'è un lavoro non salvato. */
	vai(dove: Sezione) {
		if (this.corrente?.inCorso() && !this.abbandono) {
			new NoticeT("Lavoro in corso: premi di nuovo per abbandonarlo.");
			this.abbandono = true;
			window.setTimeout(() => (this.abbandono = false), 4000);
			return;
		}
		for (const k of ["libreria", "valuta"] as const) {
			const st = this.plugin.statoListe[k];
			if (st) st.ripristina = false;
		}
		if (dove === "nuovo") this.mostraNuovoLibro(null);
		else if (dove === "valuta") void this.mostraListaValutazione();
		else if (dove === "set") void this.mostraSet();
		else if (dove === "virtuale") this.mostraVirtuale();
		else void this.mostraArchivio();
	}

	async mostraArchivio(aperto?: string) {
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
	mostraNuovoLibro(libro: Libro | null) {
		this.abbandono = false;
		this.corrente = null;
		this.evidenzia(libro ? "libreria" : "nuovo");
		const v = new BookFormView(
			this.plugin,
			this.corpo,
			libro,
			(f) => void this.mostraArchivio(f.path),
			() => void this.mostraArchivio(libro?.file.path)
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
		new ArchiveView(this.app, this.plugin, this.corpo, this, undefined, "valuta").avvia();
	}

	/** Valutazione (o aggiornamento) di un libro; `indietro` è l'azione del link nella scelta del set. */
	async mostraValutazione(libro: Libro, passo: number, indietro?: () => void) {
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
			indietro ?? (() => void this.mostraListaValutazione())
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

	mostraEditorSet(bozza: Bozza, file: TFile | null, nomeOriginale: string | null) {
		this.abbandono = false;
		this.evidenzia("set");
		const v = new SetEditorView(this.plugin, this.corpo, this, bozza, file, nomeOriginale);
		this.corrente = v;
		v.avvia();
	}
}

/* ------------------------------------------------------------------ */
/*  Impostazioni                                                      */
/* ------------------------------------------------------------------ */

class ARLSettingTab extends PluginSettingTab {
	private fontAltro: boolean | undefined;

	constructor(app: App, private plugin: BooksAndReviewsPlugin) {
		super(app, plugin);
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

	private contenitoreScorrevole(): HTMLElement | null {
		let e: HTMLElement | null = this.containerEl;
		while (e) {
			const o = getComputedStyle(e).overflowY;
			if ((o === "auto" || o === "scroll") && e.scrollHeight > e.clientHeight) return e;
			e = e.parentElement;
		}
		return null;
	}

	private disegna() {
		const { containerEl } = this;
		const s = this.plugin.settings;
		containerEl.empty();
		collegaTraduzione(containerEl);

		new Setting(containerEl)
			.setName("Lingua dell'interfaccia")
			.setDesc("Lingua dei menu e dei messaggi del plugin. Non modifica i tuoi set né le note già scritte.")
			.addDropdown((d) =>
				d
					.addOptions({ it: "Italiano", en: "English" })
					.setValue(s.lingua)
					.onChange(async (v) => {
						s.lingua = v === "en" ? "en" : "it";
						impostaLingua(s.lingua);
						await this.plugin.salvaImpostazioni();
						await this.plugin.scriviSetPredefiniti(false);
						await this.plugin.caricaSet();
					})
			);

		new Setting(containerEl)
			.setName("Cartella di salvataggio")
			.setDesc("Le nuove recensioni vengono create qui come note.")
			.addText((t) =>
				t
					.setPlaceholder("Libri/ARL")
					.setValue(s.cartella)
					.onChange(async (v) => {
						s.cartella = v.trim();
						await this.plugin.salvaImpostazioni();
					})
			);

		new Setting(containerEl)
			.setName("Cartella dei set di valutazione")
			.setDesc("Qui si trovano le note dei set di valutazione: «Recensione Romanzi», «Recensione Saggi» e i tuoi.")
			.addText((t) =>
				t
					.setPlaceholder("Libri/ARL/Set")
					.setValue(s.cartellaSet)
					.onChange(async (v) => {
						s.cartellaSet = v.trim() || DEFAULTS.cartellaSet;
						await this.plugin.salvaImpostazioni();
						await this.plugin.caricaSet();
					})
			);

		new Setting(containerEl)
			.setName("Cartella delle copertine")
			.setDesc("Qui vengono copiate le copertine che carichi dal computer.")
			.addText((t) =>
				t
					.setPlaceholder("Libri/ARL/Copertine")
					.setValue(s.cartellaCopertine)
					.onChange(async (v) => {
						s.cartellaCopertine = v.trim() || DEFAULTS.cartellaCopertine;
						await this.plugin.salvaImpostazioni();
					})
			);

		new Setting(containerEl)
			.setName("Domande per schermata")
			.setDesc("Ogni tema viene diviso in schermate di questa dimensione.")
			.addDropdown((d) =>
				d
					.addOptions({ "1": "1", "2": "2", "5": "5", "10": "10" })
					.setValue(String(s.domandePerSchermata))
					.onChange(async (v) => {
						s.domandePerSchermata = parseInt(v, 10);
						await this.plugin.salvaImpostazioni();
					})
			);

		new Setting(containerEl)
			.setName("ARL e stelle in tempo reale")
			.setDesc("Durante la valutazione mostra in alto a destra il punteggio ARL e le stelle, che si aggiornano a ogni risposta.")
			.addToggle((t) =>
				t.setValue(s.arlLive).onChange(async (v) => {
					s.arlLive = v;
					await this.plugin.salvaImpostazioni();
				})
			);

		new Setting(containerEl)
			.setName("Evidenzia la domanda")
			.setDesc("Durante la valutazione una barra colorata mette in risalto la domanda corrente.")
			.addToggle((t) =>
				t.setValue(s.evidenziaDomanda).onChange(async (v) => {
					s.evidenziaDomanda = v;
					await this.plugin.salvaImpostazioni();
					this.display();
				})
			);
		if (s.evidenziaDomanda) {
			const anteprima = containerEl.createDiv({ cls: "arl-ev-anteprima", text: "2. La trama è originale?" });
			const avviso = containerEl.createDiv({ cls: "arl-meta arl-ev-avviso" });
			const aggAnteprima = () => {
				anteprima.style.background = s.evidenziaSfondo;
				anteprima.style.color = s.evidenziaTesto;
				avviso.setText(
					contrasto(s.evidenziaSfondo, s.evidenziaTesto) < 3
						? "Attenzione: i due colori sono troppo simili, il testo potrebbe essere poco leggibile."
						: ""
				);
				this.plugin.applicaLarghezza();
			};
			const colore = (nome: string, desc: string, chiave: "evidenziaSfondo" | "evidenziaTesto") =>
				new Setting(containerEl)
					.setName(nome)
					.setDesc(desc)
					.addColorPicker((cp) =>
						cp.setValue(s[chiave]).onChange(async (v) => {
							s[chiave] = v;
							await this.plugin.salvaImpostazioni();
							aggAnteprima();
						})
					)
					.addExtraButton((b) =>
						b
							.setIcon("reset")
							.setTooltip("Ripristina il colore predefinito")
							.onClick(async () => {
								s[chiave] = DEFAULTS[chiave];
								await this.plugin.salvaImpostazioni();
								this.plugin.applicaLarghezza();
								this.display();
							})
					);
			colore("Colore dello sfondo della domanda evidenziata", "Predefinito: verde.", "evidenziaSfondo");
			colore("Colore del testo della domanda evidenziata", "Predefinito: bianco.", "evidenziaTesto");
			aggAnteprima();
		}

		new Setting(containerEl)
			.setName("Apri a schermo pieno")
			.setDesc("Quando apri il plugin nasconde le barre laterali di Obsidian; quando esci (chiudi la scheda o passi a un'altra) tornano com'erano prima.")
			.addToggle((t) =>
				t.setValue(s.schermoPieno).onChange(async (v) => {
					s.schermoPieno = v;
					await this.plugin.salvaImpostazioni();
					if (!v) this.plugin.ripristinaBarre();
				})
			);

		new Setting(containerEl)
			.setName("Larghezza dell'interfaccia")
			.setDesc("Larghezza massima del contenuto in pixel (da 600 a 2400). Se la imposti a 0 usa tutta la finestra.")
			.addSlider((sl) =>
				sl
					.setLimits(600, 2400, 50)
					.setValue(s.larghezza > 0 ? s.larghezza : 2400)
					.setDynamicTooltip()
					.onChange(async (v) => {
						s.larghezza = v;
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
					})
			)
			.addToggle((t) =>
				t
					.setTooltip("Usa tutta la larghezza")
					.setValue(s.larghezza === 0)
					.onChange(async (v) => {
						s.larghezza = v ? 0 : 1200;
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
						this.display();
					})
			);

		new Setting(containerEl).setName("Barra dei totali della lista").setHeading();
		const VOCI_RIEPILOGO: [string, string, string][] = [
			["totali", "Numero di libri e totale in euro", "Quanti libri sono mostrati e la somma dei prezzi."],
			["stelle", "Libri per numero di stelle", "Quanti libri hanno 5, 4, 3… stelle, più quelli ancora da valutare."],
			["piu", "Libro con più pagine", "Il libro più lungo tra quelli mostrati."],
			["meno", "Libro con meno pagine", "Il libro più corto tra quelli mostrati."],
			["generi", "Generi letti", "I primi 5 generi per numero di libri letti."],
		];
		for (const [chiave, nome, desc] of VOCI_RIEPILOGO) {
			new Setting(containerEl)
				.setName(nome)
				.setDesc(desc)
				.addToggle((t) =>
					t.setValue(!s.riepilogoNascosti.includes(chiave)).onChange(async (v) => {
						s.riepilogoNascosti = s.riepilogoNascosti.filter((x) => x !== chiave);
						if (!v) s.riepilogoNascosti.push(chiave);
						await this.plugin.salvaImpostazioni();
					})
				);
		}

		new Setting(containerEl).setName("Colonne della lista").setHeading();
		containerEl.createDiv({
			cls: "setting-item-description",
			text: "Scegli quali colonne mostrare e in che ordine: trascina ⋮⋮ per spostare. Titolo e Autore sono sempre visibili. Vale per Libreria e Valuta libro.",
		});
		const boxColonne = containerEl.createDiv({ cls: "arl-colonne" });
		const disegnaColonne = () => {
			boxColonne.empty();
			let da = -1;
			const pulisci = () =>
				boxColonne.querySelectorAll(".arl-col-sopra, .arl-col-sotto, .arl-col-trascinata").forEach((e) =>
					e.classList.remove("arl-col-sopra", "arl-col-sotto", "arl-col-trascinata")
				);
			s.colonneOrdine.forEach((k, i) => {
				const col = COLONNE.find((c) => c.chiave === k);
				if (!col) return;
				const obbligatoria = COLONNE_OBBLIGATORIE.includes(k);
				const visibile = obbligatoria || !s.colonneNascoste.includes(k);
				const riga = boxColonne.createDiv({ cls: "arl-col-riga" });
				riga.draggable = true;
				riga.createSpan({ cls: "arl-col-maniglia", text: "⋮⋮" });
				const sw = riga.createDiv({
					cls: "checkbox-container" + (visibile ? " is-enabled" : "") + (obbligatoria ? " arl-col-bloccata" : ""),
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
					da = i;
					ev.dataTransfer?.setData("text/plain", String(i));
					if (ev.dataTransfer) ev.dataTransfer.effectAllowed = "move";
					riga.classList.add("arl-col-trascinata");
				});
				riga.addEventListener("dragend", pulisci);
				riga.addEventListener("dragover", (ev) => {
					if (da < 0) return;
					ev.preventDefault();
					const r = riga.getBoundingClientRect();
					const sotto = ev.clientY > r.top + r.height / 2;
					boxColonne.querySelectorAll(".arl-col-sopra, .arl-col-sotto").forEach((e) =>
						e.classList.remove("arl-col-sopra", "arl-col-sotto")
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
		new Setting(containerEl).addButton((b) =>
			b.setButtonText("Ripristina colonne predefinite").onClick(async () => {
				s.colonneOrdine = [...DEFAULTS.colonneOrdine];
				s.colonneNascoste = [];
				await this.plugin.salvaImpostazioni();
				disegnaColonne();
			})
		);

		new Setting(containerEl).setName("Testo").setHeading();

		const FONT: [string, string][] = [
			["", "Predefinito del tema"],
			["system-ui, -apple-system, 'Segoe UI', sans-serif", "Sans-serif (sistema)"],
			["Georgia, 'Times New Roman', serif", "Serif (Georgia)"],
			["'Times New Roman', Times, serif", "Times New Roman"],
			["Arial, Helvetica, sans-serif", "Arial"],
			["Verdana, Geneva, sans-serif", "Verdana"],
			["'Trebuchet MS', sans-serif", "Trebuchet MS"],
			["'Courier New', monospace", "Courier New"],
			["ui-monospace, Consolas, monospace", "Monospace"],
			["__altro", "Personalizzato…"],
		];
		const predefinito = FONT.some(([v]) => v === s.fontFamiglia);
		const personalizzato = this.fontAltro ?? !predefinito;
		new Setting(containerEl)
			.setName("Font")
			.setDesc("Carattere dei testi del plugin.")
			.addDropdown((d) => {
				for (const [v, n] of FONT) d.addOption(v, n);
				d.setValue(personalizzato ? "__altro" : s.fontFamiglia).onChange(async (v) => {
					if (v === "__altro") {
						this.fontAltro = true;
						this.display();
						return;
					}
					this.fontAltro = false;
					s.fontFamiglia = v;
					await this.plugin.salvaImpostazioni();
					this.plugin.applicaLarghezza();
					this.display();
				});
			});
		if (personalizzato) {
			new Setting(containerEl)
				.setName("Nome del font")
				.setDesc("Per esempio: Palatino Linotype, Calibri. Deve essere installato sul tuo computer.")
				.addText((t) =>
					t
						.setPlaceholder("Calibri")
						.setValue(s.fontFamiglia)
						.onChange(async (v) => {
							s.fontFamiglia = v.trim();
							await this.plugin.salvaImpostazioni();
							this.plugin.applicaLarghezza();
						})
				);
		}

		new Setting(containerEl)
			.setName("Dimensione del testo")
			.setDesc("In pixel (da 10 a 32). Il pulsante a destra torna alla dimensione del tema.")
			.addSlider((sl) =>
				sl
					.setLimits(10, 32, 1)
					.setValue(s.fontDimensione || 16)
					.setDynamicTooltip()
					.onChange(async (v) => {
						s.fontDimensione = v;
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
					})
			)
			.addExtraButton((b) =>
				b
					.setIcon("reset")
					.setTooltip("Usa la dimensione del tema")
					.onClick(async () => {
						s.fontDimensione = 0;
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
						this.display();
					})
			);

		new Setting(containerEl)
			.setName("Colore del testo")
			.setDesc("Colore principale dei testi. I testi secondari (grigi) restano quelli del tema.")
			.addColorPicker((cp) =>
				cp.setValue(s.coloreTesto || "#808080").onChange(async (v) => {
					s.coloreTesto = v;
					await this.plugin.salvaImpostazioni();
					this.plugin.applicaLarghezza();
				})
			)
			.addExtraButton((b) =>
				b
					.setIcon("reset")
					.setTooltip("Usa il colore del tema")
					.onClick(async () => {
						s.coloreTesto = "";
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
						this.display();
					})
			);

		new Setting(containerEl).setName("Libreria virtuale").setHeading();
		new Setting(containerEl)
			.setName("Libri per ripiano")
			.setDesc("Quanti libri stanno su ogni ripiano (da 5 a 40). Cambiandolo, i libri si ridistribuiscono nell'ordine salvato.")
			.addSlider((sl) =>
				sl
					.setLimits(5, 40, 1)
					.setValue(s.vlPerRipiano)
					.setDynamicTooltip()
					.onChange(async (v) => {
						s.vlPerRipiano = v;
						await this.plugin.salvaImpostazioni();
					})
			);
		new Setting(containerEl)
			.setName("Usa tutta la larghezza")
			.setDesc("La libreria occupa tutta la larghezza della finestra, ignorando la larghezza scelta qui sotto.")
			.addToggle((t) =>
				t.setValue(s.vlAdatta).onChange(async (v) => {
					s.vlAdatta = v;
					await this.plugin.salvaImpostazioni();
					this.display();
				})
			);
		if (!s.vlAdatta) {
			new Setting(containerEl)
				.setName("Larghezza della libreria")
				.setDesc("In pixel (da 500 a 2400).")
				.addSlider((sl) =>
					sl
						.setLimits(500, 2400, 50)
						.setValue(s.vlLarghezza)
						.setDynamicTooltip()
						.onChange(async (v) => {
							s.vlLarghezza = v;
							await this.plugin.salvaImpostazioni();
						})
				);
		}
		new Setting(containerEl)
			.setName("Testo sul dorso")
			.setDesc("Cosa si legge sul dorso di ogni libro. Il carattere si riduce da solo per far stare tutto il testo.")
			.addDropdown((d) =>
				d
					.addOptions({ titoloAutore: "Titolo e autore", titolo: "Solo titolo" })
					.setValue(s.vlMostra)
					.onChange(async (v) => {
						s.vlMostra = v === "titolo" ? "titolo" : "titoloAutore";
						await this.plugin.salvaImpostazioni();
					})
			);
		{
			const f = s.vlImmagine ? this.plugin.app.vault.getAbstractFileByPath(s.vlImmagine) : null;
			const esiste = f instanceof TFile;
			const imp = new Setting(containerEl)
				.setName("Immagine dietro la libreria")
				.setDesc(
					s.vlImmagine
						? esiste
							? `${s.vlImmagine} — meglio sotto i 2000 px di larghezza.`
							: `Immagine non trovata nel vault: ${s.vlImmagine}`
						: "Nessuna. Una parete o una stanza dietro lo scaffale (meglio sotto i 2000 px di larghezza)."
				);
			const scelta = async (file: TFile) => {
				s.vlImmagine = file.path;
				await this.plugin.salvaImpostazioni();
				this.display();
			};
			imp.addButton((b) =>
				b.setButtonText("Scegli…").onClick(() => {
					const imm = this.plugin.imgDelVault();
					if (!imm.length) {
						new NoticeT("Nel vault non ci sono immagini.");
						return;
					}
					new ImmagineModal(this.plugin.app, imm, (x) => void scelta(x)).open();
				})
			);
			imp.addButton((b) =>
				b.setButtonText("Dal computer…").onClick(() => {
					const sel = createEl("input");
					sel.type = "file";
					sel.accept = "image/*";
					sel.onchange = async () => {
						const file = sel.files?.[0];
						if (!file) return;
						try {
							await scelta(await this.plugin.importaImmagine(file));
						} catch (e) {
							new NoticeT(`Impossibile aggiungere l'immagine: ${(e as Error).message}`);
						}
					};
					sel.click();
				})
			);
			imp.addButton((b) =>
				b.setButtonText("Nessuna").onClick(async () => {
					s.vlImmagine = "";
					await this.plugin.salvaImpostazioni();
					this.display();
				})
			);
			if (esiste) {
				new Setting(containerEl)
					.setName("Adattamento dell'immagine")
					.setDesc("Copri tutto riempie l'area (tagliando i bordi), Adatta mostra l'immagine intera, Ripeti la ripete come un tappeto.")
					.addDropdown((d) =>
						d
							.addOptions({ cover: "Copri tutto", contain: "Adatta", repeat: "Ripeti" })
							.setValue(s.vlImgModo)
							.onChange(async (v) => {
								s.vlImgModo = v === "contain" || v === "repeat" ? v : "cover";
								await this.plugin.salvaImpostazioni();
							})
					);
				new Setting(containerEl)
					.setName("Oscura l'immagine")
					.setDesc("Velatura scura (da 0 a 70 %) per far risaltare i libri.")
					.addSlider((sl) =>
						sl
							.setLimits(0, 70, 5)
							.setValue(s.vlImgOscura)
							.setDynamicTooltip()
							.onChange(async (v) => {
								s.vlImgOscura = v;
								await this.plugin.salvaImpostazioni();
							})
					);
				new Setting(containerEl)
					.setName("Sfocatura")
					.setDesc("Effetto fuori fuoco (da 0 a 20 px) per non distrarre dai libri.")
					.addSlider((sl) =>
						sl
							.setLimits(0, 20, 1)
							.setValue(s.vlImgSfoca)
							.setDynamicTooltip()
							.onChange(async (v) => {
								s.vlImgSfoca = v;
								await this.plugin.salvaImpostazioni();
							})
					);
			}
		}
		new Setting(containerEl)
			.setName("Sfondo della libreria")
			.setDesc("Predefinito: legno. Scegliendo un colore, lo sfondo diventa una tinta unita.")
			.addColorPicker((cp) =>
				cp.setValue(s.vlSfondo || "#b58650").onChange(async (v) => {
					s.vlSfondo = v;
					await this.plugin.salvaImpostazioni();
				})
			)
			.addExtraButton((b) =>
				b
					.setIcon("reset")
					.setTooltip("Usa il legno")
					.onClick(async () => {
						s.vlSfondo = "";
						await this.plugin.salvaImpostazioni();
						this.display();
					})
			);
		{
			const generi = new Map<string, string>();
			for (const l of this.plugin.tuttiILibri()) {
				const g = l.genere.trim();
				if (g && !generi.has(g.toLowerCase())) generi.set(g.toLowerCase(), g);
			}
			new Setting(containerEl)
				.setName("Colori per genere")
				.setDesc("Colore del dorso dei libri di ogni genere. Senza una scelta, il genere ha una tinta automatica sempre uguale.");
			for (const [chiave, nome] of [...generi].sort((p, q) => p[1].localeCompare(q[1], "it"))) {
				new Setting(containerEl)
					.setName(nome)
					.addColorPicker((cp) =>
						cp.setValue(coloreGenere(s, nome)).onChange(async (v) => {
							s.vlGeneri[chiave] = v;
							await this.plugin.salvaImpostazioni();
						})
					)
					.addExtraButton((b) =>
						b
							.setIcon("reset")
							.setTooltip("Usa la tinta automatica")
							.onClick(async () => {
								delete s.vlGeneri[chiave];
								await this.plugin.salvaImpostazioni();
								this.display();
							})
					);
			}
		}
		{
			let conferma = false;
			new Setting(containerEl)
				.setName("Ordine dei libri")
				.setDesc("Cancella le posizioni scelte trascinando e riporta i libri in ordine di codice, dal più alto al più basso.")
				.addButton((b) =>
					b.setButtonText("Ripristina l'ordine per codice").onClick(async () => {
						if (!conferma) {
							conferma = true;
							b.setButtonText("Premi ancora per confermare");
							window.setTimeout(() => {
								conferma = false;
								b.setButtonText("Ripristina l'ordine per codice");
							}, 4000);
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

		new Setting(containerEl).setName("Copertina").setHeading();

		new Setting(containerEl)
			.setName("Altezza della copertina")
			.setDesc("Altezza massima dell'immagine nel dettaglio del libro, in pixel (da 80 a 600). Il pulsante a destra riporta il valore predefinito (240).")
			.addSlider((sl) =>
				sl
					.setLimits(80, 600, 10)
					.setValue(s.altezzaCopertina)
					.setDynamicTooltip()
					.onChange(async (v) => {
						s.altezzaCopertina = v;
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
					})
			)
			.addExtraButton((b) =>
				b
					.setIcon("reset")
					.setTooltip("Ripristina la dimensione predefinita")
					.onClick(async () => {
						s.altezzaCopertina = DEFAULTS.altezzaCopertina;
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
						this.display();
					})
			);

		new Setting(containerEl).setName("Galleria immagini").setHeading();
		new Setting(containerEl)
			.setName("Dimensione delle anteprime")
			.setDesc("Larghezza in pixel delle anteprime nella galleria immagini (da 120 a 600). Il pulsante a destra riporta il valore predefinito (260).")
			.addSlider((sl) =>
				sl
					.setLimits(120, 600, 10)
					.setValue(s.galleriaMiniatura)
					.setDynamicTooltip()
					.onChange(async (v) => {
						s.galleriaMiniatura = v;
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
					})
			)
			.addExtraButton((b) =>
				b
					.setIcon("rotate-ccw")
					.setTooltip("Ripristina la dimensione predefinita")
					.onClick(async () => {
						s.galleriaMiniatura = DEFAULTS.galleriaMiniatura;
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
						this.display();
					})
			);

		new Setting(containerEl).setName("Barra di lettura").setHeading();

		new Setting(containerEl)
			.setName("Spessore della barra")
			.setDesc("Altezza in pixel della barra di avanzamento nella sezione Lettura del dettaglio libro.")
			.addSlider((sl) =>
				sl
					.setLimits(6, 40, 1)
					.setValue(s.spessoreBarra)
					.setDynamicTooltip()
					.onChange(async (v) => {
						s.spessoreBarra = v;
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
						aggiornaAnteprimaBarra();
					})
			);

		new Setting(containerEl)
			.setName("Barra sfumata")
			.setDesc("Se attiva, la barra passa da un colore di partenza a uno di arrivo.")
			.addToggle((t) =>
				t.setValue(s.barraSfumata).onChange(async (v) => {
					s.barraSfumata = v;
					await this.plugin.salvaImpostazioni();
					this.plugin.applicaLarghezza();
					this.display();
				})
			);

		new Setting(containerEl)
			.setName(s.barraSfumata ? "Colore di partenza" : "Colore della barra")
			.addColorPicker((cp) =>
				cp.setValue(s.coloreBarra).onChange(async (v) => {
					s.coloreBarra = v;
					await this.plugin.salvaImpostazioni();
					this.plugin.applicaLarghezza();
					aggiornaAnteprimaBarra();
				})
			)
			.addExtraButton((b) =>
				b
					.setIcon("reset")
					.setTooltip("Ripristina il colore predefinito")
					.onClick(async () => {
						s.coloreBarra = DEFAULTS.coloreBarra;
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
						this.display();
					})
			);

		if (s.barraSfumata) {
			new Setting(containerEl)
				.setName("Colore di arrivo")
				.addColorPicker((cp) =>
					cp.setValue(s.coloreBarraFine).onChange(async (v) => {
						s.coloreBarraFine = v;
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
						aggiornaAnteprimaBarra();
					})
				)
				.addExtraButton((b) =>
					b
						.setIcon("reset")
						.setTooltip("Ripristina il colore predefinito")
						.onClick(async () => {
							s.coloreBarraFine = DEFAULTS.coloreBarraFine;
							await this.plugin.salvaImpostazioni();
							this.plugin.applicaLarghezza();
							this.display();
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

		new Setting(containerEl).setName("Grafico di lettura").setHeading();

		const anteprimaGrafico = containerEl.createDiv();
		const aggiornaAnteprimaGrafico = () => {
			const esempio = [12, 30, 22, 0, 41, 18, 55, 35, 20, 44];
			const punti = esempio.map((pg, i) => ({ data: `2026-01-${String(i + 1).padStart(2, "0")}`, pagine: pg }));
			disegnaGrafico(anteprimaGrafico, punti, this.plugin.stileGrafico(), false);
		};

		new Setting(containerEl)
			.setName("Spessore della linea")
			.setDesc("Spessore della linea del grafico (da 1 a 10).")
			.addSlider((sl) =>
				sl
					.setLimits(1, 10, 1)
					.setValue(s.spessoreGrafico)
					.setDynamicTooltip()
					.onChange(async (v) => {
						s.spessoreGrafico = v;
						await this.plugin.salvaImpostazioni();
						aggiornaAnteprimaGrafico();
					})
			);

		new Setting(containerEl)
			.setName("Grafico sfumato")
			.setDesc("Se attivo, la linea passa da un colore di partenza a uno di arrivo.")
			.addToggle((t) =>
				t.setValue(s.graficoSfumato).onChange(async (v) => {
					s.graficoSfumato = v;
					await this.plugin.salvaImpostazioni();
					this.display();
				})
			);

		new Setting(containerEl)
			.setName(s.graficoSfumato ? "Colore di partenza del grafico" : "Colore del grafico")
			.addColorPicker((cp) =>
				cp.setValue(s.coloreGrafico).onChange(async (v) => {
					s.coloreGrafico = v;
					await this.plugin.salvaImpostazioni();
					aggiornaAnteprimaGrafico();
				})
			)
			.addExtraButton((b) =>
				b
					.setIcon("reset")
					.setTooltip("Ripristina il colore predefinito")
					.onClick(async () => {
						s.coloreGrafico = DEFAULTS.coloreGrafico;
						await this.plugin.salvaImpostazioni();
						this.display();
					})
			);

		if (s.graficoSfumato) {
			new Setting(containerEl)
				.setName("Colore di arrivo del grafico")
				.addColorPicker((cp) =>
					cp.setValue(s.coloreGraficoFine).onChange(async (v) => {
						s.coloreGraficoFine = v;
						await this.plugin.salvaImpostazioni();
						aggiornaAnteprimaGrafico();
					})
				)
				.addExtraButton((b) =>
					b
						.setIcon("reset")
						.setTooltip("Ripristina il colore predefinito")
						.onClick(async () => {
							s.coloreGraficoFine = DEFAULTS.coloreGraficoFine;
							await this.plugin.salvaImpostazioni();
							this.display();
						})
				);
		}
		aggiornaAnteprimaGrafico();

		new Setting(containerEl).setName("Colori del voto").setHeading();
		new Setting(containerEl)
			.setName("Colora in base al voto")
			.setDesc("Barre dei temi, punteggio ARL e lista prendono il colore della fascia di voto. I colori si scelgono in ogni set (Set di valutazione → Modifica).")
			.addToggle((t) =>
				t.setValue(s.votoColori).onChange(async (v) => {
					s.votoColori = v;
					await this.plugin.salvaImpostazioni();
				})
			);
		new Setting(containerEl)
			.setName("Spessore delle barre dei temi")
			.setDesc("Altezza in pixel delle barre dei temi nel dettaglio del libro.")
			.addSlider((sl) =>
				sl
					.setLimits(4, 30, 1)
					.setValue(s.spessoreTemi)
					.setDynamicTooltip()
					.onChange(async (v) => {
						s.spessoreTemi = v;
						await this.plugin.salvaImpostazioni();
						this.plugin.applicaLarghezza();
					})
			);
		new Setting(containerEl)
			.setName("Barre sfumate tra le fasce")
			.setDesc("Se attivo, la barra passa gradualmente dal colore delle fasce più basse a quello della fascia raggiunta; altrimenti è tinta unita.")
			.addToggle((t) =>
				t.setValue(s.votoSfumato).onChange(async (v) => {
					s.votoSfumato = v;
					await this.plugin.salvaImpostazioni();
				})
			);

		new Setting(containerEl).setName("Stelle").setHeading();

		new Setting(containerEl)
			.setName("Stelle totali")
			.setDesc("Il punteggio ARL resta da 0 a 10; cambia solo la conversione in stelle.")
			.addDropdown((d) => {
				const opzioni: Record<string, string> = {};
				for (let n = 3; n <= 10; n++) opzioni[String(n)] = String(n);
				d.addOptions(opzioni)
					.setValue(String(s.stelleTotali))
					.onChange(async (v) => {
						s.stelleTotali = parseInt(v, 10);
						await this.plugin.salvaImpostazioni();
						this.display();
					});
			});

		containerEl.createDiv({
			cls: "setting-item-description",
			text: "Le soglie per assegnare le stelle si impostano in ogni set di valutazione (Set di valutazione → Modifica).",
		});
	}
}
