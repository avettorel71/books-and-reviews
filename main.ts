import {
	App,
	FuzzySuggestModal,
	ItemView,
	Menu,
	Modal,
	moment,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	SettingPage,
	setIcon,
	type SettingDefinitionItem,
	type SliderComponent,
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
	ultimoSet: string; // ultimo set scelto in «Valuta libro»
	obiettiviAttivi: boolean; // pulsante Obiettivi e calcolo dei progressi
	obiettiviContatore: boolean; // mostra sul pulsante gli obiettivi di oggi completati (es. 1/2)
	obiettiviFesta: boolean; // finestra di festeggiamento con i fuochi d'artificio
	obiettiviSuono: boolean; // suono di festeggiamento
	sfideInLibreria: boolean; // barra delle sfide nella libreria
	sfideOrdine: string[]; // ordine scelto dall'utente per le sfide nella barra (id obiettivi)
	sfideFont: number; // dimensione del testo della barra delle sfide (px)
	sfideChiuse: boolean; // barra delle sfide chiusa dall'utente
	obiettiviTolleranza: number; // giorni in cui un periodo appena finito può ancora dare la medaglia (letture inserite in ritardo)
	obiettivi: StatoObiettivi;
	schermoPieno: boolean; // all'apertura nasconde le barre laterali di Obsidian
	coloreBarra: string; // colore della barra di lettura (di partenza se sfumata)
	coloreBarraFine: string; // colore di arrivo della barra sfumata
	barraSfumata: boolean;
	lingua: Lingua;
	valuta: string; // codice della valuta dei prezzi (vedi VALUTE) o "altra"
	valutaAltra: string; // simbolo libero, usato con valuta "altra"
	simboloDopo: boolean; // true: 12,50 €; false: € 12,50
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
	ultimoSet: "",
	obiettiviAttivi: true,
	obiettiviContatore: true,
	obiettiviFesta: true,
	obiettiviSuono: true,
	obiettiviTolleranza: 7,
	sfideInLibreria: true,
	sfideChiuse: false,
	sfideFont: 13,
	sfideOrdine: [],
	obiettivi: { obiettivi: [], premi: {}, copie: {} },
	schermoPieno: false,
	coloreBarra: "#4caf50",
	coloreBarraFine: "#2196f3",
	barraSfumata: false,
	lingua: "it",
	valuta: "EUR",
	valutaAltra: "",
	simboloDopo: false,
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
/** Valute proposte nelle opzioni: simbolo, nome e decimali. */
const VALUTE: Record<string, { simbolo: string; nome: string; decimali: number }> = {
	EUR: { simbolo: "€", nome: "Euro (EUR)", decimali: 2 },
	USD: { simbolo: "$", nome: "Dollaro USA (USD)", decimali: 2 },
	GBP: { simbolo: "£", nome: "Sterlina (GBP)", decimali: 2 },
	JPY: { simbolo: "¥", nome: "Yen (JPY)", decimali: 0 },
	CHF: { simbolo: "CHF", nome: "Franco svizzero (CHF)", decimali: 2 },
	CAD: { simbolo: "CA$", nome: "Dollaro canadese (CAD)", decimali: 2 },
	AUD: { simbolo: "A$", nome: "Dollaro australiano (AUD)", decimali: 2 },
	CNY: { simbolo: "CN¥", nome: "Yuan cinese (CNY)", decimali: 2 },
	INR: { simbolo: "₹", nome: "Rupia indiana (INR)", decimali: 2 },
	BRL: { simbolo: "R$", nome: "Real brasiliano (BRL)", decimali: 2 },
};
/** Valuta corrente (impostata all'avvio e dalle opzioni). */
let VALUTA: { simbolo: string; decimali: number; dopo: boolean } = { simbolo: "€", decimali: 2, dopo: false };

function impostaValuta(st: { valuta: string; valutaAltra: string; simboloDopo: boolean }) {
	const v = VALUTE[st.valuta];
	VALUTA = v
		? { simbolo: v.simbolo, decimali: v.decimali, dopo: st.simboloDopo }
		: { simbolo: st.valutaAltra.trim() || "€", decimali: 2, dopo: st.simboloDopo };
}

function parsePrezzo(testo: string): number | null {
	let t = testo.replace(/[€$£¥₹]/g, "");
	if (VALUTA.simbolo) t = t.split(VALUTA.simbolo).join("");
	t = t.replace(/\s/g, "").replace(",", ".");
	if (t === "") return null;
	if (!/^\d+(\.\d{1,2})?$/.test(t)) return NaN;
	return Math.round(parseFloat(t) * 100) / 100;
}

function formatNumeroEuro(n: number): string {
	return n.toLocaleString(LINGUA === "en" ? "en-US" : "it-IT", {
		minimumFractionDigits: VALUTA.decimali,
		maximumFractionDigits: VALUTA.decimali,
	});
}

function formatEuro(n: number): string {
	const num = formatNumeroEuro(n);
	return VALUTA.dopo ? `${num} ${VALUTA.simbolo}` : `${VALUTA.simbolo} ${num}`;
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
	"Valuta dei prezzi": "Price currency",
	"Simbolo usato per i prezzi dei libri. Cambia solo la visualizzazione: i numeri nelle note restano gli stessi, senza conversione.": "Symbol used for book prices. It only changes the display: the numbers in your notes stay the same, with no conversion.",
	"Anteprima": "Preview",
	"Simbolo dopo l'importo": "Symbol after the amount",
	"Attivo: 12,50 €. Disattivo: € 12,50.": "On: 12.50 €. Off: € 12.50.",
	"Altra…": "Other…",
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
	"Obiettivi": "Goals",
	"Nuovo obiettivo": "New goal",
	"Modifica obiettivo": "Edit goal",
	"Oggi": "Today",
	"Settimana": "Week",
	"Mese": "Month",
	"Anno": "Year",
	"Medaglie": "Medals",
	"Primati": "Records",
	"Gestisci": "Manage",
	"Chiudi": "Close",
	"Crea obiettivo": "Create goal",
	"Nome (facoltativo)": "Name (optional)",
	"Cosa": "What",
	"Libri finiti": "Books finished",
	"Giorni di lettura": "Reading days",
	"Quante pagine?": "How many pages?",
	"Quanti libri?": "How many books?",
	"Quanti giorni?": "How many days?",
	"Periodo": "Period",
	"Giorno": "Day",
	"Tutti i generi": "All genres",
	"Tutti": "All",
	"al giorno": "per day",
	"alla settimana": "per week",
	"al mese": "per month",
	"all'anno": "per year",
	"Premi di nuovo per eliminare": "Press again to delete",
	"Tutti gli obiettivi di oggi completati!": "All of today's goals completed!",
	"Ultimo giorno!": "Last day!",
	"Nessun obiettivo in questo periodo. Premi «Nuovo obiettivo» per crearne uno.": "No goals in this period. Press «New goal» to create one.",
	"Elimina gli obiettivi di questa scheda": "Delete the goals in this tab",
	"Elimina tutti gli obiettivi": "Delete all goals",
	"Azzera medaglie e serie": "Reset medals and streak",
	"Azzera tutto": "Reset everything",
	"Azzerare tutte le medaglie e la serie? Gli obiettivi restano.": "Reset all medals and the streak? Your goals stay.",
	"Eliminare tutti gli obiettivi, le medaglie e la serie? Non si può annullare.": "Delete all goals, medals and the streak? This cannot be undone.",
	"Sì, procedi": "Yes, proceed",
	"Bronzo · giorni": "Bronze · days",
	"Argento · settimane": "Silver · weeks",
	"Oro · mesi": "Gold · months",
	"Trofeo · anni": "Trophy · years",
	"Traguardi": "Milestones",
	"Primo obiettivo": "First goal",
	"10 obiettivi completati": "10 goals completed",
	"100 obiettivi completati": "100 goals completed",
	"Serie di 3 giorni": "3-day streak",
	"Serie di 7 giorni": "7-day streak",
	"Serie di 30 giorni": "30-day streak",
	"Le medaglie restano anche se elimini o modifichi un obiettivo.": "Medals are kept even if you delete or change a goal.",
	"Pagine lette (tutta la libreria)": "Pages read (whole library)",
	"Questa settimana": "This week",
	"Questo mese": "This month",
	"Quest'anno": "This year",
	"Totale": "Total",
	"Media al giorno di lettura": "Average per reading day",
	"Media al mese di lettura": "Average per reading month",
	"Giorno record": "Record day",
	"Primati sui libri letti": "Records on books read",
	"Nessun libro letto in questo periodo.": "No books read in this period.",
	"Il secondo genere più letto": "The second most read genre",
	"Il terzo genere più letto": "The third most read genre",
	"Il libro con più stelle": "The book with the most stars",
	"Il libro con il punteggio ARL più alto": "The book with the highest ARL score",
	"Il libro più brutto (ARL più basso)": "The worst book (lowest ARL)",
	"Primati calcolati sui libri letti (con data di fine o già valutati).": "Records are calculated on books read (with an end date or already rated).",
	"Obiettivo raggiunto!": "Goal reached!",
	"Obiettivi raggiunti!": "Goals reached!",
	"Congratulazioni": "Congratulations",
	"Obiettivi di lettura (pagine, libri finiti, giorni di lettura) con medaglie e festeggiamento. Si calcolano solo quando un libro cambia o apri la finestra: nessun processo in background.": "Reading goals (pages, books finished, reading days) with medals and celebration. They are calculated only when a book changes or you open the window: no background process.",
	"Attiva gli obiettivi": "Enable goals",
	"Mostra il pulsante Obiettivi dopo «Set di valutazione» e calcola i progressi. Spento: nessun calcolo.": "Shows the Goals button after «Evaluation sets» and calculates progress. Off: nothing is calculated.",
	"Contatore sul pulsante": "Counter on the button",
	"Mostra sul pulsante quanti obiettivi giornalieri sono completati (es. 1/2).": "Shows on the button how many daily goals are completed (e.g. 1/2).",
	"Finestra di festeggiamento": "Celebration window",
	"Quando raggiungi un obiettivo si apre una finestra con i fuochi d'artificio.": "When you reach a goal a window with fireworks opens.",
	"Suono di festeggiamento": "Celebration sound",
	"Un breve suono quando raggiungi un obiettivo.": "A short sound when you reach a goal.",
	"Medaglie di bronzo · giorni": "Bronze medals · days",
	"Medaglie d'argento · settimane": "Silver medals · weeks",
	"Medaglie d'oro · mesi": "Gold medals · months",
	"Trofei · anni": "Trophies · years",
	"Obiettivo non più disponibile": "Goal no longer available",
	"Obiettivo eliminato": "Goal deleted",
	"Clicca una medaglia per vedere gli obiettivi che l'hanno data.": "Click a medal to see the goals that earned it.",
	"Giorni di tolleranza": "Grace days",
	"Se inserisci una lettura in ritardo, un periodo finito da non più di questi giorni dà ancora la medaglia (0 = solo il periodo in corso).": "If you log a reading late, a period that ended no more than this many days ago still earns the medal (0 = current period only).",
	"Il tuo anno di lettura": "Your reading year",
	"Anno di lettura": "Reading year",
	"Anno precedente": "Previous year",
	"Anno successivo": "Next year",
	"Salva come nota": "Save as note",
	"Libri letti": "Books read",
	"ARL medio": "Average ARL",
	"Spesa": "Spent",
	"Pagine per mese": "Pages per month",
	"Libri per mese": "Books per month",
	"Mese migliore": "Best month",
	"Altri": "Others",
	"Autori più letti": "Most read authors",
	"I momenti dell'anno": "Highlights of the year",
	"Il migliore": "The best",
	"Il peggiore": "The worst",
	"Il più lungo": "The longest",
	"Il più corto": "The shortest",
	"Letto più velocemente": "Read fastest",
	"Letto più lentamente": "Read slowest",
	"Serie di lettura più lunga": "Longest reading streak",
	"Nessuna lettura in questo anno.": "No reading in this year.",
	"Esiste già una nota con questo nome, non generata dal plugin: non l'ho sovrascritta.": "A note with this name already exists and was not generated by the plugin: it was not overwritten.",
	"Impossibile salvare la nota.": "Unable to save the note.",
	"Nota salvata": "Note saved",
	"Rispetto al": "Compared with",
	"libri": "books",
	"pagine": "pages",
	"Sfide": "Challenges",
	"Mostra le sfide nella libreria": "Show challenges in the library",
	"Una barra sotto il titolo di Libreria e Libreria virtuale con gli obiettivi mensili e annuali che hai scelto di tenere in vista.": "A bar under the title of Library and Virtual library with the monthly and yearly goals you chose to keep in view.",
	"Mostra nella barra della libreria": "Show in the library bar",
	"Tiene l'obiettivo in vista sotto il titolo della libreria.": "Keeps the goal in view under the library title.",
	"Resta visibile anche quando è completato": "Stays visible when completed",
	"Spento: appena lo completi sparisce dalla barra.": "Off: as soon as you complete it, it disappears from the bar.",
	"Mostra nella barra delle sfide": "Show in the challenges bar",
	"Nascondi dalla barra delle sfide": "Hide from the challenges bar",
	"Mostra o nascondi le sfide": "Show or hide the challenges",
	"Dimensione del testo delle sfide": "Challenges text size",
	"Grandezza del testo nella barra delle sfide della libreria (da 10 a 20 px).": "Text size in the library challenges bar (10 to 20 px).",
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
	obiettivo: ["goal", "goals"], obiettivi: ["goal", "goals"],
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
	[/^Prezzo \((.+)\)$/, (m) => `Price (${m[1]})`],
	[/^Oggi: (\d+) su (\d+) completati$/, (m) => `Today: ${m[1]} of ${m[2]} completed`],
	[/^Raggiunto il (.+) alle (.+)$/, (m) => `Reached on ${m[1]} at ${m[2]}`],
	[/^Risultato: (.+) su (\d+)$/, (m) => `Result: ${m[1]} of ${m[2]}`],
	[/^Settimana (\d+) · (.+)$/, (m) => `Week ${m[1]} · ${m[2]}`],
	[/^(.+) senza data di fine non conteggiati\.$/, (m) => `${m[1]} without an end date not counted.`],
	[/^Rispetto al (\d{4})$/, (m) => `Compared with ${m[1]}`],
	[/^Serie: (.+)$/, (m) => `Streak: ${m[1]}`],
	[/^Migliore: (.+)$/, (m) => `Best: ${m[1]}`],
	[/^Mancano (.+)$/, (m) => `${m[1]} left`],
	[/^Eliminare (.+)\?$/, (m) => `Delete ${m[1]}?`],
	[/^Indica un numero da 1 a (\d+)\.$/, (m) => `Enter a number from 1 to ${m[1]}.`],
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

		this.addCommand({
			id: "obiettivi",
			name: tr("Obiettivi"),
			callback: () => new ObiettiviModal(this.app, this).open(),
		});

		this.addCommand({
			id: "anno-di-lettura",
			name: tr("Il tuo anno di lettura"),
			callback: () => new AnnoLetturaModal(this.app, this).open(),
		});

		// un libro cambia (letture, data di fine, valutazione…): gli obiettivi si ricontrollano una volta sola, poco dopo
		this.registerEvent(
			this.app.metadataCache.on("changed", (file) => {
				if (!this.settings.obiettiviAttivi || this.settings.obiettivi.obiettivi.length === 0) return;
				if (leggiLibro(this.app, file) !== null) this.pianificaObiettivi();
			})
		);

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
		if (this.obiettiviTimer !== null) window.clearTimeout(this.obiettiviTimer);
		this.obiettiviTimer = null;
		this.festa?.close();
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
				loc = moment.locale();
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
		s.valuta = typeof s.valuta === "string" && (s.valuta in VALUTE || s.valuta === "altra") ? s.valuta : "EUR";
		s.valutaAltra = typeof s.valutaAltra === "string" ? s.valutaAltra : "";
		s.simboloDopo = s.simboloDopo === true;
		s.obiettiviAttivi = s.obiettiviAttivi !== false;
		s.obiettiviContatore = s.obiettiviContatore !== false;
		s.obiettiviFesta = s.obiettiviFesta !== false;
		s.obiettiviSuono = s.obiettiviSuono !== false;
		s.sfideInLibreria = s.sfideInLibreria !== false;
		s.sfideChiuse = s.sfideChiuse === true;
		s.sfideOrdine = Array.isArray(s.sfideOrdine) ? s.sfideOrdine.filter((x): x is string => typeof x === "string") : [];
		s.sfideFont = Number.isFinite(Number(s.sfideFont)) ? Math.min(20, Math.max(10, Math.round(Number(s.sfideFont)))) : 13;
		s.obiettiviTolleranza = Number.isFinite(Number(s.obiettiviTolleranza)) ? Math.min(30, Math.max(0, Math.round(Number(s.obiettiviTolleranza)))) : 7;
		s.obiettivi = normalizzaObiettivi(d.obiettivi);
		impostaValuta(s);
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

	/* ---- Obiettivi ---- */

	private obiettiviTimer: number | null = null;
	private festa: FestaObiettiviModal | null = null;
	barreSfide = new Set<BarraSfide>();

	/** Nome dell'obiettivo: quello scelto dall'utente, altrimenti «Pagine lette: 30 al giorno». */
	nomeObiettivo(ob: Obiettivo): string {
		return ob.nome || `${tr(TESTO_AZIONE_OB[ob.azione])}: ${ob.target} ${tr(TESTO_OGNI_OB[ob.periodo])}`;
	}

	/** Raggruppa più modifiche ravvicinate (es. salvare più letture) in un solo controllo. */
	pianificaObiettivi() {
		if (this.obiettiviTimer !== null) return;
		this.obiettiviTimer = window.setTimeout(() => {
			this.obiettiviTimer = null;
			this.controllaObiettiviOra();
		}, 800);
	}

	/** Controlla gli obiettivi nel periodo in corso e festeggia quelli appena raggiunti. */
	controllaObiettiviOra() {
		const st = this.settings;
		if (!st.obiettiviAttivi || st.obiettivi.obiettivi.length === 0) return;
		const libri = this.tuttiILibri();
		const premiati = valutaObiettivi(st.obiettivi, libri, Date.now(), st.obiettiviTolleranza);
		if (premiati.length === 0) {
			// nessun premio nuovo, ma i progressi nella barra delle sfide sono cambiati
			this.aggiornaSfide(libri);
			return;
		}
		void this.salvaImpostazioni();
		this.aggiornaObiettiviVista(libri);
		if (st.obiettiviFesta) {
			const voci = premiati.map((p) => ({ nome: this.nomeObiettivo(p.ob), periodo: p.ob.periodo, quando: p.passato ? etichettaPeriodoOb(p.chiavePeriodo, p.ob.periodo) : "" }));
			if (this.festa) this.festa.aggiungi(voci);
			else {
				this.festa = new FestaObiettiviModal(this.app, voci, () => (this.festa = null));
				this.festa.open();
			}
		}
		if (st.obiettiviSuono) suonoObiettivo();
	}

	/** Aggiorna pulsante e contatore di Obiettivi in tutte le schermate aperte. */
	aggiornaObiettiviVista(libri?: readonly Libro[]) {
		for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
			if (leaf.view instanceof MainView) leaf.view.aggiornaObiettivi();
		}
		this.aggiornaSfide(libri);
	}

	/** Ridisegna le barre delle sfide aperte (nessun lavoro se non ce ne sono). */
	aggiornaSfide(libri?: readonly Libro[]) {
		if (this.barreSfide.size === 0) return;
		for (const b of [...this.barreSfide]) b.disegna(libri);
	}

	async salvaObiettivi(lista: Obiettivo[]) {
		this.settings.obiettivi.obiettivi = lista;
		await this.salvaImpostazioni();
		this.controllaObiettiviOra();
		this.aggiornaObiettiviVista();
	}

	/** Elimina gli obiettivi di un periodo (o tutti, con null). Le medaglie già ottenute restano. */
	async eliminaObiettivi(periodo: PeriodoObiettivo | null) {
		await this.salvaObiettivi(periodo ? this.settings.obiettivi.obiettivi.filter((o) => o.periodo !== periodo) : []);
	}

	async azzeraMedaglie() {
		azzeraPremi(this.settings.obiettivi, this.tuttiILibri(), Date.now(), this.settings.obiettiviTolleranza);
		await this.salvaImpostazioni();
		this.aggiornaObiettiviVista();
	}

	async azzeraTuttiObiettivi() {
		this.settings.obiettivi = statoObiettiviVuoto();
		await this.salvaImpostazioni();
		this.aggiornaObiettiviVista();
	}

	/** Salva il riepilogo dell'anno come nota nella cartella dei libri; sovrascrive solo una nota generata da noi. */
	async salvaNotaAnno(anno: number, testo: string) {
		const cartella = normalizePath(this.settings.cartella.trim() || DEFAULTS.cartella);
		await this.assicuraCartella(cartella);
		const percorso = normalizePath(`${cartella}/${tr("Anno di lettura")} ${anno}.md`);
		const esistente = this.app.vault.getAbstractFileByPath(percorso);
		try {
			if (esistente instanceof TFile) {
				const attuale = await this.app.vault.read(esistente);
				if (!attuale.startsWith("<!-- Generato da Books and Reviews")) {
					new NoticeT("Esiste già una nota con questo nome, non generata dal plugin: non l'ho sovrascritta.");
					return;
				}
				await this.app.vault.modify(esistente, testo);
			} else {
				await this.app.vault.create(percorso, testo);
			}
			new Notice(`${tr("Nota salvata")}: ${percorso}`);
		} catch {
			new NoticeT("Impossibile salvare la nota.");
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

	async assicuraCartella(percorso: string) {
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

/* ------------------------------------------------------------------ */
/*  Obiettivi: pagine lette, libri finiti, giorni di lettura          */
/*  Motore puro (nessun timer): il progresso si calcola solo quando    */
/*  un libro cambia o si apre la finestra, partendo dalle note.       */
/* ------------------------------------------------------------------ */

type AzioneObiettivo = "pagine" | "libri" | "giorni";
type PeriodoObiettivo = "day" | "week" | "month" | "year";

const AZIONI_OB: readonly AzioneObiettivo[] = ["pagine", "libri", "giorni"];
const PERIODI_OB: readonly PeriodoObiettivo[] = ["day", "week", "month", "year"];
const OB_MAX = 9999999;

interface Obiettivo {
	id: string;
	nome: string; // vuoto = nome automatico
	azione: AzioneObiettivo;
	target: number;
	periodo: PeriodoObiettivo;
	genere: string; // vuoto = tutti i generi
	creato: string; // giorno di creazione «AAAA-MM-GG»; i periodi finiti prima non danno medaglie (vuoto = nessun limite)
	inBarra: boolean; // solo obiettivi mensili e annuali: mostrato nella barra delle sfide della libreria
	restaVisibile: boolean; // nella barra: resta visibile anche quando è completato
}

/** Copia dell'obiettivo al momento del premio: la medaglia resta spiegata anche se l'obiettivo viene poi cambiato o eliminato. */
interface CopiaObiettivo {
	nome: string;
	azione: AzioneObiettivo;
	target: number;
	genere: string;
}

interface StatoObiettivi {
	obiettivi: Obiettivo[];
	/** "idObiettivo|chiavePeriodo" → istante (ms); 0 = raggiunto ma senza medaglia (dopo un azzeramento). */
	premi: Record<string, number>;
	/** Copia dell'obiettivo per ogni premio ottenuto (i premi più vecchi possono non averla). */
	copie: Record<string, CopiaObiettivo>;
}

function statoObiettiviVuoto(): StatoObiettivi {
	return { obiettivi: [], premi: {}, copie: {} };
}

const TESTO_AZIONE_OB: Record<AzioneObiettivo, string> = {
	pagine: "Pagine lette",
	libri: "Libri finiti",
	giorni: "Giorni di lettura",
};
const TESTO_PERIODO_OB: Record<PeriodoObiettivo, string> = {
	day: "Giorno",
	week: "Settimana",
	month: "Mese",
	year: "Anno",
};
const TESTO_OGNI_OB: Record<PeriodoObiettivo, string> = {
	day: "al giorno",
	week: "alla settimana",
	month: "al mese",
	year: "all'anno",
};

function dueCifre(n: number): string {
	return String(n).padStart(2, "0");
}

/** Giorno locale «AAAA-MM-GG». */
function chiaveGiorno(ts: number | Date): string {
	const d = typeof ts === "number" ? new Date(ts) : ts;
	return `${d.getFullYear()}-${dueCifre(d.getMonth() + 1)}-${dueCifre(d.getDate())}`;
}

interface IntervalloOb {
	chiave: string;
	inizioMs: number;
	fineMs: number; // esclusa
	primoGiorno: string;
	ultimoGiorno: string;
}

/** Il periodo (giorno, settimana ISO da lunedì, mese, anno) che contiene `ts`. */
function intervalloOb(periodo: PeriodoObiettivo, ts: number): IntervalloOb {
	const d = new Date(ts);
	const y = d.getFullYear();
	const m = d.getMonth();
	const g = d.getDate();
	let inizio: Date;
	let fineEscl: Date;
	let chiave: string;
	if (periodo === "day") {
		inizio = new Date(y, m, g);
		fineEscl = new Date(y, m, g + 1);
		chiave = chiaveGiorno(inizio);
	} else if (periodo === "week") {
		const indietro = (d.getDay() + 6) % 7;
		inizio = new Date(y, m, g - indietro);
		fineEscl = new Date(y, m, g - indietro + 7);
		// la settimana ISO appartiene all'anno del suo giovedì
		const gio = new Date(y, m, g - indietro + 3);
		const gen1 = new Date(gio.getFullYear(), 0, 1);
		const doy = Math.round((new Date(gio.getFullYear(), gio.getMonth(), gio.getDate()).getTime() - gen1.getTime()) / 86400000);
		chiave = `${gio.getFullYear()}-W${dueCifre(Math.floor(doy / 7) + 1)}`;
	} else if (periodo === "month") {
		inizio = new Date(y, m, 1);
		fineEscl = new Date(y, m + 1, 1);
		chiave = `${y}-${dueCifre(m + 1)}`;
	} else {
		inizio = new Date(y, 0, 1);
		fineEscl = new Date(y + 1, 0, 1);
		chiave = String(y);
	}
	const ultimo = new Date(fineEscl.getFullYear(), fineEscl.getMonth(), fineEscl.getDate() - 1);
	return { chiave, inizioMs: inizio.getTime(), fineMs: fineEscl.getTime(), primoGiorno: chiaveGiorno(inizio), ultimoGiorno: chiaveGiorno(ultimo) };
}

function periodoDiChiave(chiave: string): PeriodoObiettivo | null {
	if (/^\d{4}-\d{2}-\d{2}$/.test(chiave)) return "day";
	if (/^\d{4}-W\d{2}$/.test(chiave)) return "week";
	if (/^\d{4}-\d{2}$/.test(chiave)) return "month";
	if (/^\d{4}$/.test(chiave)) return "year";
	return null;
}

function chiavePremio(id: string, chiavePeriodo: string): string {
	return `${id}|${chiavePeriodo}`;
}

function stessoGenere(a: string, b: string): boolean {
	return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Progresso dell'obiettivo nel periodo: tutto derivato dalle letture e dalle date di fine dei libri. */
function progressoObiettivo(ob: Obiettivo, r: IntervalloOb, libri: readonly Libro[]): number {
	const scelti = ob.genere ? libri.filter((l) => stessoGenere(l.genere, ob.genere)) : libri;
	if (ob.azione === "libri") {
		return scelti.filter((l) => l.fine && l.fine >= r.primoGiorno && l.fine <= r.ultimoGiorno).length;
	}
	let pagine = 0;
	const giorni = new Set<string>();
	for (const l of scelti) {
		for (const x of l.letture) {
			if (x.data < r.primoGiorno || x.data > r.ultimoGiorno) continue;
			pagine += Math.max(0, pagineLette(x));
			giorni.add(x.data);
		}
	}
	return ob.azione === "pagine" ? pagine : giorni.size;
}

interface ObiettivoPremiato {
	ob: Obiettivo;
	chiavePeriodo: string;
	/** True se il periodo premiato non è quello in corso (lettura inserita in ritardo). */
	passato: boolean;
}

/** Periodi in cui un obiettivo può ancora dare la medaglia: quello in corso e quelli finiti da non più di `tolleranza` giorni
 * (e non finiti prima della creazione dell'obiettivo). Servono per le letture inserite il giorno dopo. */
function periodiValutabili(ob: Obiettivo, ora: number, tolleranza: number): IntervalloOb[] {
	const visti = new Map<string, IntervalloOb>();
	for (let i = 0; i <= tolleranza; i++) {
		const d = new Date(ora);
		const r = intervalloOb(ob.periodo, new Date(d.getFullYear(), d.getMonth(), d.getDate() - i, 12).getTime());
		if (ob.creato && r.ultimoGiorno < ob.creato) continue;
		visti.set(r.chiave, r);
	}
	return [...visti.values()];
}

/** Controlla gli obiettivi nel periodo in corso e in quelli appena passati; assegna il premio a quelli raggiunti. */
function valutaObiettivi(stato: StatoObiettivi, libri: readonly Libro[], ora: number, tolleranza: number): ObiettivoPremiato[] {
	const premiati: ObiettivoPremiato[] = [];
	for (const ob of stato.obiettivi) {
		const corrente = intervalloOb(ob.periodo, ora).chiave;
		for (const r of periodiValutabili(ob, ora, tolleranza)) {
			const k = chiavePremio(ob.id, r.chiave);
			if (k in stato.premi) continue;
			if (progressoObiettivo(ob, r, libri) >= ob.target) {
				stato.premi[k] = ora;
				stato.copie[k] = { nome: ob.nome, azione: ob.azione, target: ob.target, genere: ob.genere };
				premiati.push({ ob, chiavePeriodo: r.chiave, passato: r.chiave !== corrente });
			}
		}
	}
	return premiati;
}

/** Azzera medaglie e serie; gli obiettivi già raggiunti nei periodi valutabili restano segnati come fatti, senza medaglia. */
function azzeraPremi(stato: StatoObiettivi, libri: readonly Libro[], ora: number, tolleranza: number) {
	stato.premi = {};
	stato.copie = {};
	for (const ob of stato.obiettivi) {
		for (const r of periodiValutabili(ob, ora, tolleranza)) {
			if (progressoObiettivo(ob, r, libri) >= ob.target) stato.premi[chiavePremio(ob.id, r.chiave)] = 0;
		}
	}
}

/** Etichetta leggibile di un periodo: «25/10/2026», «Settimana 43 · 19/10/2026 – 25/10/2026», «ottobre 2026», «2026». */
function etichettaPeriodoOb(chiave: string, periodo: PeriodoObiettivo): string {
	const r = intervalloDaChiave(chiave, periodo);
	if (!r) return chiave;
	const lingua = LINGUA === "en" ? "en-GB" : "it-IT";
	const dataBreve = (d: Date) => d.toLocaleDateString(lingua, { day: "2-digit", month: "2-digit", year: "numeric" });
	const primo = new Date(r.inizioMs);
	const ultimo = new Date(r.fineMs - 1);
	if (periodo === "day") return dataBreve(primo);
	if (periodo === "week") return `Settimana ${Number(chiave.slice(-2))} · ${dataBreve(primo)} – ${dataBreve(ultimo)}`;
	if (periodo === "month") return primo.toLocaleDateString(lingua, { month: "long", year: "numeric" });
	return chiave;
}

interface RiepilogoOb {
	conteggi: Record<PeriodoObiettivo, number>;
	totale: number;
	serie: number;
	serieMigliore: number;
}

function giornoPrima(chiave: string): string {
	const [y, m, d] = chiave.split("-").map(Number);
	return chiaveGiorno(new Date(y, m - 1, d - 1));
}

function riepilogaObiettivi(stato: StatoObiettivi, ora: number): RiepilogoOb {
	const conteggi: Record<PeriodoObiettivo, number> = { day: 0, week: 0, month: 0, year: 0 };
	const giorni = new Set<string>();
	let totale = 0;
	for (const k of Object.keys(stato.premi)) {
		if (!stato.premi[k]) continue;
		const chiave = k.slice(k.indexOf("|") + 1);
		const p = periodoDiChiave(chiave);
		if (!p) continue;
		conteggi[p]++;
		totale++;
		if (p === "day") giorni.add(chiave);
	}
	let serie = 0;
	let cursore = chiaveGiorno(ora);
	if (!giorni.has(cursore)) cursore = giornoPrima(cursore);
	while (giorni.has(cursore)) {
		serie++;
		cursore = giornoPrima(cursore);
	}
	let migliore = 0;
	let corsa = 0;
	let ultimo = "";
	for (const g of [...giorni].sort()) {
		corsa = ultimo && giornoPrima(g) === ultimo ? corsa + 1 : 1;
		if (corsa > migliore) migliore = corsa;
		ultimo = g;
	}
	return { conteggi, totale, serie, serieMigliore: migliore };
}

const TRAGUARDI_OB: readonly { testo: string; tipo: "totale" | "serie"; serve: number }[] = [
	{ testo: "Primo obiettivo", tipo: "totale", serve: 1 },
	{ testo: "10 obiettivi completati", tipo: "totale", serve: 10 },
	{ testo: "100 obiettivi completati", tipo: "totale", serve: 100 },
	{ testo: "Serie di 3 giorni", tipo: "serie", serve: 3 },
	{ testo: "Serie di 7 giorni", tipo: "serie", serve: 7 },
	{ testo: "Serie di 30 giorni", tipo: "serie", serve: 30 },
];

/** Obiettivi giornalieri di oggi: quanti completati e quanti in tutto. */
function statoOggiOb(stato: StatoObiettivi, ora: number): { fatti: number; totale: number } {
	const oggi = chiaveGiorno(ora);
	let fatti = 0;
	let totale = 0;
	for (const ob of stato.obiettivi) {
		if (ob.periodo !== "day") continue;
		totale++;
		if (premioEsiste(stato, ob.id, oggi)) fatti++;
	}
	return { fatti, totale };
}

function premioEsiste(stato: StatoObiettivi, id: string, chiavePeriodo: string): boolean {
	return chiavePremio(id, chiavePeriodo) in stato.premi;
}

/** Rende utilizzabili i dati letti da data.json: scarta ciò che non è valido, senza errori. */
function normalizzaObiettivi(raw: unknown): StatoObiettivi {
	const stato = statoObiettiviVuoto();
	if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return stato;
	const r = raw as Record<string, unknown>;
	if (Array.isArray(r.obiettivi)) {
		const ids = new Set<string>();
		for (const g of r.obiettivi as unknown[]) {
			if (typeof g !== "object" || g === null) continue;
			const o = g as Record<string, unknown>;
			if (typeof o.id !== "string" || !o.id || ids.has(o.id)) continue;
			if (!AZIONI_OB.includes(o.azione as AzioneObiettivo) || !PERIODI_OB.includes(o.periodo as PeriodoObiettivo)) continue;
			const target = Math.round(Number(o.target));
			if (!Number.isFinite(target) || target < 1) continue;
			ids.add(o.id);
			stato.obiettivi.push({
				id: o.id,
				nome: typeof o.nome === "string" ? o.nome : "",
				azione: o.azione as AzioneObiettivo,
				periodo: o.periodo as PeriodoObiettivo,
				target: Math.min(target, OB_MAX),
				genere: typeof o.genere === "string" ? o.genere : "",
				creato: typeof o.creato === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.creato) ? o.creato : "",
				inBarra: o.inBarra === true && (o.periodo === "month" || o.periodo === "year"),
				restaVisibile: o.restaVisibile !== false,
			});
		}
	}
	if (typeof r.premi === "object" && r.premi !== null && !Array.isArray(r.premi)) {
		for (const [k, v] of Object.entries(r.premi as Record<string, unknown>)) {
			if (typeof v === "number" && Number.isFinite(v)) stato.premi[k] = v;
		}
	}
	if (typeof r.copie === "object" && r.copie !== null && !Array.isArray(r.copie)) {
		for (const [k, v] of Object.entries(r.copie as Record<string, unknown>)) {
			if (typeof v !== "object" || v === null || !(k in stato.premi)) continue;
			const c = v as Record<string, unknown>;
			const target = Math.round(Number(c.target));
			if (!AZIONI_OB.includes(c.azione as AzioneObiettivo) || !Number.isFinite(target) || target < 1) continue;
			stato.copie[k] = {
				nome: typeof c.nome === "string" ? c.nome : "",
				azione: c.azione as AzioneObiettivo,
				target: Math.min(target, OB_MAX),
				genere: typeof c.genere === "string" ? c.genere : "",
			};
		}
	}
	return stato;
}

/** Il periodo (giorno, settimana, mese, anno) che corrisponde a una chiave di periodo. */
function intervalloDaChiave(chiave: string, periodo: PeriodoObiettivo): IntervalloOb | null {
	let ts: number;
	if (periodo === "day") {
		const [y, m, d] = chiave.split("-").map(Number);
		ts = new Date(y, m - 1, d, 12).getTime();
	} else if (periodo === "week") {
		const m = /^(\d{4})-W(\d{2})$/.exec(chiave);
		if (!m) return null;
		// il 4 gennaio cade sempre nella settimana 1 ISO
		const quattro = new Date(Number(m[1]), 0, 4, 12);
		const lunedi1 = new Date(Number(m[1]), 0, 4 - ((quattro.getDay() + 6) % 7), 12);
		ts = new Date(lunedi1.getFullYear(), lunedi1.getMonth(), lunedi1.getDate() + (Number(m[2]) - 1) * 7, 12).getTime();
	} else if (periodo === "month") {
		const [y, mo] = chiave.split("-").map(Number);
		ts = new Date(y, mo - 1, 15, 12).getTime();
	} else {
		ts = new Date(Number(chiave), 5, 15, 12).getTime();
	}
	return Number.isFinite(ts) ? intervalloOb(periodo, ts) : null;
}

function nuovoIdObiettivo(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ---- Fuochi d'artificio (solo con la finestra di festeggiamento aperta) ---- */

interface Scintilla {
	x: number;
	y: number;
	vx: number;
	vy: number;
	vita: number;
	vitaMax: number;
	tinta: number;
	dim: number;
}

interface Razzo {
	x: number;
	y: number;
	vy: number;
	yFine: number;
	tinta: number;
}

const FUOCHI_GRAVITA = 140;
const FUOCHI_MAX_SCINTILLE = 420;
const FUOCHI_LANCI_MS = 9000;

class FuochiArtificio {
	private ctx: CanvasRenderingContext2D | null;
	private scintille: Scintilla[] = [];
	private razzi: Razzo[] = [];
	private raf = 0;
	private ultimo = 0;
	private trascorso = 0;
	private prossimo = 0;
	private attivo = false;
	private larghezza = 0;
	private altezza = 0;

	constructor(private canvas: HTMLCanvasElement) {
		this.ctx = canvas.getContext("2d");
	}

	avvia() {
		if (this.attivo || !this.ctx) return;
		const ridotto = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		this.larghezza = this.canvas.clientWidth;
		this.altezza = this.canvas.clientHeight;
		this.canvas.width = Math.max(1, Math.round(this.larghezza * dpr));
		this.canvas.height = Math.max(1, Math.round(this.altezza * dpr));
		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		this.attivo = true;
		if (ridotto) {
			// chi preferisce meno movimento vede un solo scoppio, senza animazione continua
			this.scoppio(this.larghezza / 2, this.altezza * 0.35, 200);
			this.disegna(1 / 60, true);
			this.attivo = false;
			return;
		}
		this.ultimo = performance.now();
		this.raf = window.requestAnimationFrame((t) => this.fotogramma(t));
	}

	ferma() {
		this.attivo = false;
		window.cancelAnimationFrame(this.raf);
		this.scintille = [];
		this.razzi = [];
	}

	private fotogramma(ora: number) {
		if (!this.attivo) return;
		const dt = Math.min(0.05, (ora - this.ultimo) / 1000);
		this.ultimo = ora;
		this.trascorso += dt * 1000;
		const lancia = this.trascorso < FUOCHI_LANCI_MS;
		if (lancia && this.trascorso >= this.prossimo) {
			this.razzi.push({
				x: this.larghezza * (0.15 + Math.random() * 0.7),
				y: this.altezza,
				vy: -(this.altezza * (0.9 + Math.random() * 0.3)),
				yFine: this.altezza * (0.12 + Math.random() * 0.35),
				tinta: Math.floor(Math.random() * 360),
			});
			this.prossimo = this.trascorso + 350 + Math.random() * 450;
		}
		this.disegna(dt, false);
		// finito di lanciare e di disegnare: il ciclo si ferma da solo
		if (!lancia && this.razzi.length === 0 && this.scintille.length === 0) {
			this.attivo = false;
			this.ctx?.clearRect(0, 0, this.larghezza, this.altezza);
			return;
		}
		this.raf = window.requestAnimationFrame((t) => this.fotogramma(t));
	}

	private scoppio(x: number, y: number, n: number, tinta = Math.floor(Math.random() * 360)) {
		const posto = FUOCHI_MAX_SCINTILLE - this.scintille.length;
		const quante = Math.min(n, Math.max(0, posto));
		for (let i = 0; i < quante; i++) {
			const angolo = Math.random() * Math.PI * 2;
			const velocita = 40 + Math.random() * 150;
			this.scintille.push({
				x,
				y,
				vx: Math.cos(angolo) * velocita,
				vy: Math.sin(angolo) * velocita,
				vita: 0,
				vitaMax: 0.9 + Math.random() * 0.9,
				tinta: (tinta + Math.random() * 40 - 20 + 360) % 360,
				dim: 1.5 + Math.random() * 1.5,
			});
		}
	}

	private disegna(dt: number, fermo: boolean) {
		const ctx = this.ctx;
		if (!ctx) return;
		// dissolvenza leggera al posto della pulizia completa: lascia la scia dietro le scintille
		ctx.globalCompositeOperation = "destination-out";
		ctx.fillStyle = fermo ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.22)";
		ctx.fillRect(0, 0, this.larghezza, this.altezza);
		ctx.globalCompositeOperation = "source-over";

		for (let i = this.razzi.length - 1; i >= 0; i--) {
			const r = this.razzi[i];
			r.y += r.vy * dt;
			if (r.y <= r.yFine) {
				this.scoppio(r.x, r.y, 55 + Math.floor(Math.random() * 25), r.tinta);
				this.razzi.splice(i, 1);
				continue;
			}
			ctx.fillStyle = `hsl(${r.tinta} 100% 75%)`;
			ctx.fillRect(r.x - 1, r.y, 2, 6);
		}
		for (let i = this.scintille.length - 1; i >= 0; i--) {
			const p = this.scintille[i];
			p.vita += dt;
			if (p.vita >= p.vitaMax) {
				this.scintille.splice(i, 1);
				continue;
			}
			p.vy += FUOCHI_GRAVITA * dt;
			p.vx *= 0.992;
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			ctx.globalAlpha = 1 - p.vita / p.vitaMax;
			ctx.fillStyle = `hsl(${p.tinta} 100% 62%)`;
			ctx.fillRect(p.x, p.y, p.dim, p.dim);
		}
		ctx.globalAlpha = 1;
	}
}

/** Suono «obiettivo raggiunto» (MP3 in base64: Obsidian installa solo main.js, manifest.json e styles.css). */
const SUONO_OBIETTIVO_MP3 =
	"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pTkY//twZOeAAj4f3WnsOuQ86JutMaViiijhc6eU+NEEpW609BU6Z//6/iT+4ffpdQb+rf///EPo/qf4kE0jadttgJIME9cahGSJi13+f/IirSsuY2fqCNyLuHhiiv69UlfFZXjDrWeNJp1mjM2gWO1txej///t7/b/b/////Dn0/7/IBv9KMYrIC20QBAAPkQtQmEeF7SpFPlIgx3+hV5ejkFskOH+uytmwZCLd/1IC3+tf//W/VPyb+pn9f///oQ//0/JGploGKtsFgATTYAUvwSsK7rJCg1rmqaM9im5F8mBZGBIjtONzIhv/QK3tqCZP//vbS/xfe6gg+/Qr/n/wed/5ZJibLSsskBICC0/EdY+gtAmgFXZZK5UIexzpT9IPzIG1B5SATF14Sgk9FYDhUyVbyAx/UTKQ///7cmTmgAIfNNtp7C0EPcKrvWEmKomFFWnntK8BJ6KutYeVOm4XP1o6P//PW/+XIeXP/oMjRbENbZSABUlcXZVtUI9FArpVjFky3KWrrH65omW+VBYD8SpcHY/Kgl0foP/RTFNb/TX5V0vSenPAOayKtCSt////+U5n+pAud/9YZno5KrLNWyQCo65ymEJj7QqN/YVJb87JX8aXA2esKIKKpLfwyunlL+55WzNE+C6fNa22jqa2/Rv/tf5r+cfV7////V+r5RWySubX2pwgjgMyC8SnEyFChCT68QG3fp6DJ98dDKT4gI4+sV1bc8K70J6bFb9Bf1W1mX/1+dk4gGD+xxzfoKsi0fT/11+p//yarVTScdbIABIGgz7LcbqijpglZCEpVwZ0SYkGbGRh1beFJpZub7KveaIo//twZOWAAfNE2mmJUfBAxouNMaJqiKyBcaYw59E1Ji309p3awOOnr+UttRX7auvUd////7PrZ6DQsdKSacbIABHpcXCasUmwpFDSqUNVUmZXCuu8H7tikOdXK2SKATdd/f73mzP//Icj3///7LvI/Uj1O/oqfutscm10TCUCLjEixRu7eQyHLhxnjOePE7sFPDhFcNh2eOShjsLDAol0cuixFG1BWzay4h5K/TH4KfpJvoc6/I9B1uz//9X4I/KxyR1luqVBAA3UMY92USjEo1naPyAjCCm4aNFvCtUiQ7YRgNGp4CRFN6J+bQm3BWvjXwbjuuwXvnNHe///lavU/4q3xQd7CoKe2gMAEYQr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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7cmS5j/L8ZKwQQEtwKov2IQQCbkAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

function suonoObiettivo(volume = 0.6) {
	try {
		const audio = new Audio(`data:audio/mpeg;base64,${SUONO_OBIETTIVO_MP3}`);
		audio.volume = volume;
		// alcuni ambienti bloccano la riproduzione automatica: non è un problema
		audio.play().catch(() => undefined);
	} catch {
		// nessun audio disponibile: si continua senza suono
	}
}

function iconaMedaglia(parent: HTMLElement, periodo: PeriodoObiettivo, extra = ""): HTMLElement {
	const el = parent.createSpan({ cls: `arl-ob-medaglia arl-ob-${periodo} ${extra}`.trim() });
	setIcon(el, periodo === "year" ? "trophy" : "medal");
	return el;
}

/** Finestra di festeggiamento con i fuochi d'artificio; si chiude con «Congratulazioni». */
class FestaObiettiviModal extends Modal {
	private fuochi: FuochiArtificio | null = null;
	private elenco!: HTMLElement;
	private icona!: HTMLElement;
	private titolo!: HTMLElement;

	constructor(
		app: App,
		private voci: { nome: string; periodo: PeriodoObiettivo; quando: string }[],
		private alChiudere: () => void
	) {
		super(app);
	}

	onOpen() {
		this.modalEl.addClass("arl-festa");
		const c = this.contentEl;
		c.empty();
		collegaTraduzione(c);
		const canvas = this.modalEl.createEl("canvas", { cls: "arl-festa-canvas" });
		this.modalEl.prepend(canvas);
		const corpo = c.createDiv({ cls: "arl-festa-corpo" });
		this.icona = corpo.createDiv({ cls: "arl-festa-icona" });
		this.titolo = corpo.createDiv({ cls: "arl-festa-titolo" });
		this.elenco = corpo.createDiv({ cls: "arl-festa-elenco" });
		this.disegna();
		corpo.createEl("button", { cls: "mod-cta", text: "Congratulazioni" }).onclick = () => this.close();
		this.fuochi = new FuochiArtificio(canvas);
		this.fuochi.avvia();
	}

	aggiungi(voci: { nome: string; periodo: PeriodoObiettivo; quando: string }[]) {
		this.voci.push(...voci);
		this.disegna();
	}

	private disegna() {
		const peso: Record<PeriodoObiettivo, number> = { day: 0, week: 1, month: 2, year: 3 };
		const top = this.voci.reduce<PeriodoObiettivo>((m, v) => (peso[v.periodo] > peso[m] ? v.periodo : m), "day");
		this.icona.className = `arl-festa-icona arl-ob-${top}`;
		this.icona.empty();
		setIcon(this.icona, top === "year" ? "trophy" : "medal");
		this.titolo.setText(this.voci.length > 1 ? "Obiettivi raggiunti!" : "Obiettivo raggiunto!");
		this.elenco.empty();
		for (const v of this.voci) {
			const riga = this.elenco.createDiv({ cls: "arl-festa-voce" });
			iconaMedaglia(riga, v.periodo, "is-presa");
			riga.createSpan({ text: v.nome });
			if (v.quando) riga.createSpan({ cls: "arl-festa-quando", text: `(${v.quando})` });
		}
	}

	onClose() {
		this.fuochi?.ferma();
		this.fuochi = null;
		scollegaTraduzione(this.contentEl);
		this.contentEl.empty();
		this.alChiudere();
	}
}

/** Conferma prima di eliminare o azzerare. */
class ConfermaObiettiviModal extends Modal {
	constructor(
		app: App,
		private messaggio: string,
		private conferma: () => void
	) {
		super(app);
	}

	onOpen() {
		const c = this.contentEl;
		c.empty();
		collegaTraduzione(c);
		new Setting(c).setName("Conferma").setHeading();
		c.createEl("p", { text: this.messaggio });
		new Setting(c)
			.addButton((b) => b.setButtonText("Annulla").onClick(() => this.close()))
			.addButton((b) =>
				b
					.setButtonText("Sì, procedi")
					.setDestructive()
					.onClick(() => {
						this.close();
						this.conferma();
					})
			);
	}

	onClose() {
		scollegaTraduzione(this.contentEl);
		this.contentEl.empty();
	}
}

/** Creazione e modifica di un obiettivo. */
class ModificaObiettivoModal extends Modal {
	private bozza: Obiettivo;
	private nuovo: boolean;
	private anteprima!: HTMLElement;
	private errore!: HTMLElement;
	private rigaQuanti!: Setting;
	private rigaBarra!: Setting;
	private rigaResta!: Setting;

	constructor(
		app: App,
		private plugin: BooksAndReviewsPlugin,
		ob: Obiettivo | null,
		private alSalvataggio: (ob: Obiettivo) => void
	) {
		super(app);
		this.nuovo = !ob;
		this.bozza = ob ? { ...ob } : { id: nuovoIdObiettivo(), nome: "", azione: "pagine", target: 30, periodo: "day", genere: "", creato: chiaveGiorno(Date.now()), inBarra: false, restaVisibile: true };
	}

	private domandaQuanti(): string {
		return this.bozza.azione === "pagine" ? "Quante pagine?" : this.bozza.azione === "libri" ? "Quanti libri?" : "Quanti giorni?";
	}

	onOpen() {
		this.modalEl.addClass("arl-ob-edit");
		const c = this.contentEl;
		c.empty();
		collegaTraduzione(c);
		new Setting(c).setName(this.nuovo ? "Nuovo obiettivo" : "Modifica obiettivo").setHeading();

		new Setting(c).setName("Nome (facoltativo)").addText((t) =>
			t.setValue(this.bozza.nome).onChange((v) => {
				this.bozza.nome = v.trim();
				this.aggiornaAnteprima();
			})
		);
		new Setting(c).setName("Cosa").addDropdown((d) => {
			for (const a of AZIONI_OB) d.addOption(a, TESTO_AZIONE_OB[a]);
			d.setValue(this.bozza.azione).onChange((v) => {
				this.bozza.azione = v as AzioneObiettivo;
				this.rigaQuanti.setName(this.domandaQuanti());
				this.aggiornaAnteprima();
			});
		});
		this.rigaQuanti = new Setting(c).setName(this.domandaQuanti()).addText((t) => {
			t.inputEl.type = "number";
			t.inputEl.min = "1";
			t.inputEl.max = String(OB_MAX);
			t.setValue(String(this.bozza.target)).onChange((v) => {
				const n = Math.round(Number(v));
				this.bozza.target = Number.isFinite(n) ? n : 0;
				this.aggiornaAnteprima();
			});
			t.inputEl.addEventListener("keydown", (e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					this.salva();
				}
			});
		});
		new Setting(c).setName("Periodo").addDropdown((d) => {
			for (const p of PERIODI_OB) d.addOption(p, TESTO_PERIODO_OB[p]);
			d.setValue(this.bozza.periodo).onChange((v) => {
				this.bozza.periodo = v as PeriodoObiettivo;
				this.mostraRigheBarra();
				this.aggiornaAnteprima();
			});
		});
		new Setting(c).setName("Genere").addDropdown((d) => {
			d.addOption("", tr("Tutti i generi"));
			const visti = new Set<string>();
			for (const l of this.plugin.tuttiILibri()) {
				const g = l.genere.trim();
				if (g && !visti.has(g.toLowerCase())) {
					visti.add(g.toLowerCase());
					d.addOption(g, g);
				}
			}
			// un genere poi scomparso dalla libreria non deve far sparire il valore salvato
			if (this.bozza.genere && !visti.has(this.bozza.genere.toLowerCase())) d.addOption(this.bozza.genere, this.bozza.genere);
			d.setValue(this.bozza.genere).onChange((v) => {
				this.bozza.genere = v;
				this.aggiornaAnteprima();
			});
		});

		this.rigaBarra = new Setting(c)
			.setName("Mostra nella barra della libreria")
			.setDesc("Tiene l'obiettivo in vista sotto il titolo della libreria.")
			.addToggle((t) =>
				t.setValue(this.bozza.inBarra).onChange((v) => {
					this.bozza.inBarra = v;
					this.mostraRigheBarra();
				})
			);
		this.rigaResta = new Setting(c)
			.setName("Resta visibile anche quando è completato")
			.setDesc("Spento: appena lo completi sparisce dalla barra.")
			.addToggle((t) =>
				t.setValue(this.bozza.restaVisibile).onChange((v) => {
					this.bozza.restaVisibile = v;
				})
			);
		this.mostraRigheBarra();

		this.anteprima = c.createEl("p", { cls: "setting-item-description" });
		this.errore = c.createEl("p", { cls: "arl-ob-errore" });
		this.aggiornaAnteprima();

		new Setting(c)
			.addButton((b) => b.setButtonText("Annulla").onClick(() => this.close()))
			.addButton((b) =>
				b
					.setButtonText(this.nuovo ? "Crea obiettivo" : "Salva")
					.setCta()
					.onClick(() => this.salva())
			);
	}

	/** La barra delle sfide è per gli obiettivi mensili e annuali. */
	private mostraRigheBarra() {
		const adatto = this.bozza.periodo === "month" || this.bozza.periodo === "year";
		this.rigaBarra.settingEl.toggleClass("arl-oculto", !adatto);
		this.rigaResta.settingEl.toggleClass("arl-oculto", !adatto || !this.bozza.inBarra);
	}

	private aggiornaAnteprima() {
		const nome = this.plugin.nomeObiettivo(this.bozza);
		const ambito = this.bozza.genere ? ` · ${this.bozza.genere}` : "";
		this.anteprima.setText(`${tr("Anteprima")}: ${nome}${ambito}`);
		this.errore.setText("");
	}

	private salva() {
		const target = Math.round(this.bozza.target);
		if (!Number.isFinite(target) || target < 1 || target > OB_MAX) {
			this.errore.setText(tr(`Indica un numero da 1 a ${OB_MAX}.`));
			return;
		}
		const adatto = this.bozza.periodo === "month" || this.bozza.periodo === "year";
		this.alSalvataggio({ ...this.bozza, target, inBarra: adatto && this.bozza.inBarra });
		this.close();
	}

	onClose() {
		scollegaTraduzione(this.contentEl);
		this.contentEl.empty();
	}
}

/** Barra delle sfide: gli obiettivi mensili e annuali scelti dall'utente, sempre in vista sopra la libreria. */
class BarraSfide {
	private el: HTMLElement;

	constructor(
		private plugin: BooksAndReviewsPlugin,
		host: HTMLElement,
		libri?: readonly Libro[]
	) {
		this.el = host.createDiv({ cls: "arl-sfide" });
		plugin.barreSfide.add(this);
		this.disegna(libri);
	}

	/** Trascina una cella per cambiare l'ordine; l'ordine scelto viene salvato. */
	private rendiTrascinabile(cella: HTMLElement, id: string, griglia: HTMLElement, visibili: string[]) {
		cella.draggable = true;
		cella.addEventListener("dragstart", (e) => {
			e.dataTransfer?.setData("text/plain", id);
			if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
			cella.addClass("is-trascinata");
		});
		cella.addEventListener("dragend", () => {
			cella.removeClass("is-trascinata");
			griglia.querySelectorAll(".is-prima, .is-dopo").forEach((x) => x.removeClasses(["is-prima", "is-dopo"]));
		});
		const dopo = (e: DragEvent) => {
			const r = cella.getBoundingClientRect();
			return e.clientX > r.left + r.width / 2;
		};
		cella.addEventListener("dragover", (e) => {
			e.preventDefault();
			const d = dopo(e);
			cella.toggleClass("is-dopo", d);
			cella.toggleClass("is-prima", !d);
		});
		cella.addEventListener("dragleave", () => cella.removeClasses(["is-prima", "is-dopo"]));
		cella.addEventListener("drop", (e) => {
			e.preventDefault();
			const da = e.dataTransfer?.getData("text/plain");
			if (!da || da === id || !visibili.includes(da)) return;
			const ordine = visibili.filter((x) => x !== da);
			ordine.splice(ordine.indexOf(id) + (dopo(e) ? 1 : 0), 0, da);
			const st = this.plugin.settings;
			st.sfideOrdine = [...ordine, ...st.sfideOrdine.filter((x) => !ordine.includes(x))];
			void this.plugin.salvaImpostazioni();
			this.plugin.aggiornaSfide();
		});
	}

	/** Ridisegna la barra. `libri` evita di rileggere la libreria quando il chiamante l'ha già. */
	disegna(libri?: readonly Libro[]) {
		if (!this.el.isConnected) {
			this.plugin.barreSfide.delete(this);
			return;
		}
		const st = this.plugin.settings;
		this.el.style.setProperty("--arl-sfide-font", `${st.sfideFont}px`);
		const candidati = st.obiettiviAttivi && st.sfideInLibreria ? st.obiettivi.obiettivi.filter((o) => o.inBarra && (o.periodo === "month" || o.periodo === "year")) : [];
		this.el.empty();
		this.el.toggleClass("arl-oculto", candidati.length === 0);
		if (candidati.length === 0) return;

		const tutti = libri ?? this.plugin.tuttiILibri();
		const ora = Date.now();
		const voci: { ob: Obiettivo; valore: number; fatto: boolean }[] = [];
		// ordine scelto dall'utente; le sfide mai spostate seguono, dalle più brevi alle più lunghe
		const posizione = (o: Obiettivo) => {
			const i = st.sfideOrdine.indexOf(o.id);
			return i >= 0 ? i : st.sfideOrdine.length + PERIODI_OB.indexOf(o.periodo);
		};
		candidati.sort((a, b) => posizione(a) - posizione(b));
		for (const ob of candidati) {
			const r = intervalloOb(ob.periodo, ora);
			const valore = progressoObiettivo(ob, r, tutti);
			const fatto = premioEsiste(st.obiettivi, ob.id, r.chiave) || valore >= ob.target;
			if (fatto && !ob.restaVisibile) continue;
			voci.push({ ob, valore, fatto });
		}
		this.el.toggleClass("arl-oculto", voci.length === 0);
		if (voci.length === 0) return;

		const toggle = this.el.createEl("button", { cls: "arl-sfide-toggle", attr: { "aria-label": "Mostra o nascondi le sfide" } });
		setIcon(toggle.createSpan({ cls: "arl-sfide-freccia" }), st.sfideChiuse ? "chevron-right" : "chevron-down");
		toggle.createSpan({ text: "Sfide" });
		toggle.onclick = () => {
			st.sfideChiuse = !st.sfideChiuse;
			void this.plugin.salvaImpostazioni();
			this.plugin.aggiornaSfide();
		};
		if (st.sfideChiuse) return;

		const griglia = this.el.createDiv({ cls: "arl-sfide-griglia" });
		for (const { ob, valore, fatto } of voci) {
			const cella = griglia.createDiv({ cls: "arl-sfida" + (fatto ? " is-fatta" : "") });
			const dettagli = [tr(TESTO_AZIONE_OB[ob.azione]), `${ob.target} ${tr(TESTO_OGNI_OB[ob.periodo])}`];
			if (ob.genere) dettagli.push(ob.genere);
			cella.setAttribute("title", `${this.plugin.nomeObiettivo(ob)} · ${dettagli.join(" · ")} · ${valore}/${ob.target}`);
			const alto = cella.createDiv({ cls: "arl-sfida-alto" });
			iconaMedaglia(alto, ob.periodo, fatto ? "is-presa" : "");
			alto.createSpan({ cls: "arl-sfida-nome", text: this.plugin.nomeObiettivo(ob) });
			alto.createSpan({ cls: "arl-sfida-conta", text: `${fatto ? "✓ " : ""}${valore}/${ob.target}` });
			const barra = cella.createDiv({ cls: "arl-ob-barra" });
			barra.createDiv({ cls: "arl-ob-pieno" }).style.setProperty("--arl-ob-perc", `${Math.min(100, Math.round((valore / ob.target) * 100))}%`);
			cella.onclick = () => new ObiettiviModal(this.plugin.app, this.plugin, ob.periodo).open();
			this.rendiTrascinabile(cella, ob.id, griglia, voci.map((v) => v.ob.id));
		}
	}
}

type SchedaOb = PeriodoObiettivo | "medaglie" | "primati";

/** Finestra Obiettivi: elenco per periodo, medaglie e primati. Si calcola solo all'apertura o al cambio scheda. */
class ObiettiviModal extends Modal {
	private scheda: SchedaOb;
	private corpo!: HTMLElement;
	private bottoni = new Map<SchedaOb, HTMLElement>();
	private annoPrimati = "";
	private medagliaAperta: PeriodoObiettivo | null = null;
	private armato: string | null = null;
	private timerArmato: number | null = null;

	constructor(
		app: App,
		private plugin: BooksAndReviewsPlugin,
		scheda: SchedaOb = "day"
	) {
		super(app);
		this.scheda = scheda;
	}

	onOpen() {
		this.modalEl.addClass("arl-ob-modal");
		const c = this.contentEl;
		c.empty();
		collegaTraduzione(c);
		// mette al passo gli obiettivi con le letture già registrate, prima di mostrarli
		this.plugin.controllaObiettiviOra();

		const testa = c.createDiv({ cls: "arl-ob-testa" });
		testa.createEl("h2", { text: "Obiettivi" });
		const nuovo = testa.createEl("button", { cls: "mod-cta", text: "Nuovo obiettivo" });
		nuovo.onclick = () => this.modifica(null);

		const schede = c.createDiv({ cls: "arl-ob-schede" });
		const elenco: [SchedaOb, string][] = [
			["day", "Oggi"],
			["week", "Settimana"],
			["month", "Mese"],
			["year", "Anno"],
			["medaglie", "Medaglie"],
			["primati", "Primati"],
		];
		for (const [id, testo] of elenco) {
			const b = schede.createEl("button", { text: testo });
			b.onclick = () => {
				this.scheda = id;
				this.medagliaAperta = null;
				this.disegna();
			};
			this.bottoni.set(id, b);
		}
		this.corpo = c.createDiv({ cls: "arl-ob-corpo" });
		const piede = c.createDiv({ cls: "arl-ob-piede" });
		piede.createEl("button", { text: "Gestisci" }).onclick = (e) => this.menuGestisci(e);
		piede.createEl("button", { text: "Chiudi" }).onclick = () => this.close();
		this.disegna();
	}

	onClose() {
		if (this.timerArmato !== null) window.clearTimeout(this.timerArmato);
		scollegaTraduzione(this.contentEl);
		this.contentEl.empty();
	}

	private disegna() {
		for (const [id, b] of this.bottoni) b.toggleClass("is-active", id === this.scheda);
		this.corpo.empty();
		this.armato = null;
		if (this.scheda === "medaglie") this.disegnaMedaglie();
		else if (this.scheda === "primati") this.disegnaPrimati();
		else this.disegnaElenco(this.scheda);
	}

	private disegnaElenco(periodo: PeriodoObiettivo) {
		const ora = Date.now();
		const stato = this.plugin.settings.obiettivi;
		const r = intervalloOb(periodo, ora);
		const libri = this.plugin.tuttiILibri();
		const lista = stato.obiettivi.filter((o) => o.periodo === periodo);

		const sommario = this.corpo.createDiv({ cls: "arl-ob-sommario" });
		if (periodo === "day") {
			const st = statoOggiOb(stato, ora);
			sommario.createSpan({
				text: st.totale > 0 && st.fatti === st.totale ? "Tutti gli obiettivi di oggi completati!" : `Oggi: ${st.fatti} su ${st.totale} completati`,
			});
			sommario.createSpan({ cls: "arl-ob-forte", text: `Serie: ${plurale(riepilogaObiettivi(stato, ora).serie, "giorno", "giorni")}` });
		} else {
			const giorni = Math.ceil((r.fineMs - ora) / 86400000);
			sommario.createSpan({ text: giorni <= 1 ? "Ultimo giorno!" : `Mancano ${plurale(giorni - 1, "giorno", "giorni")}` });
		}

		if (lista.length === 0) {
			this.corpo.createEl("p", { cls: "setting-item-description", text: "Nessun obiettivo in questo periodo. Premi «Nuovo obiettivo» per crearne uno." });
			return;
		}
		const box = this.corpo.createDiv({ cls: "arl-ob-lista" });
		for (const ob of lista) {
			const valore = progressoObiettivo(ob, r, libri);
			const fatto = premioEsiste(stato, ob.id, r.chiave) || valore >= ob.target;
			const riga = box.createDiv({ cls: "arl-ob-riga" + (fatto ? " is-fatto" : "") });
			setIcon(riga.createSpan({ cls: "arl-ob-stato" }), fatto ? "check-circle-2" : "circle");
			const centro = riga.createDiv({ cls: "arl-ob-centro" });
			centro.createDiv({ cls: "arl-ob-nome", text: this.plugin.nomeObiettivo(ob) });
			const dettagli = [tr(TESTO_AZIONE_OB[ob.azione]), `${ob.target} ${tr(TESTO_OGNI_OB[ob.periodo])}`];
			if (ob.genere) dettagli.push(ob.genere);
			if (ob.nome || ob.genere) centro.createDiv({ cls: "arl-ob-dettagli", text: dettagli.join(" · ") });
			const barra = centro.createDiv({ cls: "arl-ob-barra" });
			const pieno = barra.createDiv({ cls: "arl-ob-pieno" });
			pieno.style.setProperty("--arl-ob-perc", `${Math.min(100, Math.round((valore / ob.target) * 100))}%`);
			riga.createSpan({ cls: "arl-ob-conta", text: `${valore}/${ob.target}` });
			iconaMedaglia(riga, ob.periodo, fatto ? "is-presa" : "");
			const az = riga.createDiv({ cls: "arl-ob-azioni" });
			if (ob.periodo === "month" || ob.periodo === "year") {
				const occhio = az.createEl("button", {
					cls: "clickable-icon" + (ob.inBarra ? " is-attivo" : ""),
					attr: { "aria-label": ob.inBarra ? "Nascondi dalla barra delle sfide" : "Mostra nella barra delle sfide" },
				});
				setIcon(occhio, ob.inBarra ? "eye" : "eye-off");
				occhio.onclick = () => {
					const lista = this.plugin.settings.obiettivi.obiettivi.map((o) => (o.id === ob.id ? { ...o, inBarra: !o.inBarra } : o));
					void this.plugin.salvaObiettivi(lista).then(() => this.disegna());
				};
			}
			const mod = az.createEl("button", { cls: "clickable-icon", attr: { "aria-label": "Modifica obiettivo" } });
			setIcon(mod, "pencil");
			mod.onclick = () => this.modifica(ob);
			const del = az.createEl("button", { cls: "clickable-icon", attr: { "aria-label": "Elimina" } });
			setIcon(del, "trash-2");
			del.onclick = () => this.elimina(ob, del);
		}
	}

	/** Due pressioni ravvicinate su «Elimina» per evitare cancellazioni per errore. */
	private elimina(ob: Obiettivo, bottone: HTMLElement) {
		if (this.armato !== ob.id) {
			this.armato = ob.id;
			bottone.addClass("is-armato");
			bottone.setAttribute("aria-label", tr("Premi di nuovo per eliminare"));
			if (this.timerArmato !== null) window.clearTimeout(this.timerArmato);
			this.timerArmato = window.setTimeout(() => {
				this.armato = null;
				this.timerArmato = null;
				bottone.removeClass("is-armato");
				bottone.setAttribute("aria-label", tr("Elimina"));
			}, 3000);
			return;
		}
		void this.plugin.salvaObiettivi(this.plugin.settings.obiettivi.obiettivi.filter((o) => o.id !== ob.id)).then(() => this.disegna());
	}

	private modifica(ob: Obiettivo | null) {
		new ModificaObiettivoModal(this.app, this.plugin, ob, (salvato) => {
			const lista = this.plugin.settings.obiettivi.obiettivi.slice();
			const i = lista.findIndex((o) => o.id === salvato.id);
			if (i >= 0) {
				// obiettivo modificato: è in configurazione, quindi il periodo in corso riparte da zero
				// (medaglia e stato «fatto» tolti; tornano solo se il nuovo traguardo è davvero raggiunto)
				const stato = this.plugin.settings.obiettivi;
				for (const periodo of new Set([lista[i].periodo, salvato.periodo])) {
					const k = chiavePremio(salvato.id, intervalloOb(periodo, Date.now()).chiave);
					delete stato.premi[k];
					delete stato.copie[k];
				}
				lista[i] = salvato;
			} else lista.push(salvato);
			this.scheda = salvato.periodo;
			void this.plugin.salvaObiettivi(lista).then(() => this.disegna());
		}).open();
	}

	private menuGestisci(evt: MouseEvent) {
		const stato = this.plugin.settings.obiettivi;
		const rie = riepilogaObiettivi(stato, Date.now());
		const inScheda = this.scheda === "medaglie" || this.scheda === "primati" ? 0 : stato.obiettivi.filter((o) => o.periodo === this.scheda).length;
		const menu = new Menu();
		if (this.scheda !== "medaglie" && this.scheda !== "primati") {
			const periodo = this.scheda;
			menu.addItem((it) =>
				it
					.setTitle(tr("Elimina gli obiettivi di questa scheda"))
					.setIcon("trash-2")
					.setDisabled(inScheda === 0)
					.onClick(() => this.conferma(`Eliminare ${plurale(inScheda, "obiettivo", "obiettivi")}?`, () => this.plugin.eliminaObiettivi(periodo)))
			);
		}
		menu.addItem((it) =>
			it
				.setTitle(tr("Elimina tutti gli obiettivi"))
				.setIcon("trash-2")
				.setDisabled(stato.obiettivi.length === 0)
				.onClick(() => this.conferma(`Eliminare ${plurale(stato.obiettivi.length, "obiettivo", "obiettivi")}?`, () => this.plugin.eliminaObiettivi(null)))
		);
		menu.addSeparator();
		menu.addItem((it) =>
			it
				.setTitle(tr("Azzera medaglie e serie"))
				.setIcon("rotate-ccw")
				.setDisabled(rie.totale === 0)
				.onClick(() => this.conferma("Azzerare tutte le medaglie e la serie? Gli obiettivi restano.", () => this.plugin.azzeraMedaglie()))
		);
		menu.addItem((it) =>
			it
				.setTitle(tr("Azzera tutto"))
				.setIcon("eraser")
				.setDisabled(stato.obiettivi.length === 0 && rie.totale === 0)
				.onClick(() => this.conferma("Eliminare tutti gli obiettivi, le medaglie e la serie? Non si può annullare.", () => this.plugin.azzeraTuttiObiettivi()))
		);
		menu.showAtMouseEvent(evt);
	}

	private conferma(messaggio: string, azione: () => Promise<void>) {
		new ConfermaObiettiviModal(this.app, tr(messaggio), () => void azione().then(() => this.disegna())).open();
	}

	private disegnaMedaglie() {
		const rie = riepilogaObiettivi(this.plugin.settings.obiettivi, Date.now());
		const tessere = this.corpo.createDiv({ cls: "arl-ob-tessere" });
		const nomi: Record<PeriodoObiettivo, string> = {
			day: "Bronzo · giorni",
			week: "Argento · settimane",
			month: "Oro · mesi",
			year: "Trofeo · anni",
		};
		for (const p of PERIODI_OB) {
			const vinte = rie.conteggi[p] > 0;
			const t = tessere.createDiv({ cls: "arl-ob-tessera" + (vinte ? " is-cliccabile" : "") + (this.medagliaAperta === p ? " is-scelta" : "") });
			if (vinte) {
				t.setAttribute("role", "button");
				t.tabIndex = 0;
				const apri = () => {
					this.medagliaAperta = this.medagliaAperta === p ? null : p;
					this.disegna();
				};
				t.onclick = apri;
				t.onkeydown = (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						apri();
					}
				};
			}
			iconaMedaglia(t, p, vinte ? "is-presa" : "");
			t.createDiv({ cls: "arl-ob-numero", text: String(rie.conteggi[p]) });
			t.createDiv({ cls: "arl-ob-etichetta", text: nomi[p] });
		}
		if (this.medagliaAperta && rie.conteggi[this.medagliaAperta] > 0) this.dettaglioMedaglie(this.medagliaAperta);
		else this.corpo.createEl("p", { cls: "setting-item-description", text: "Clicca una medaglia per vedere gli obiettivi che l'hanno data." });
		const serie = this.corpo.createDiv({ cls: "arl-ob-sommario" });
		serie.createSpan({ text: `Serie: ${plurale(rie.serie, "giorno", "giorni")}` });
		serie.createSpan({ cls: "arl-ob-forte", text: `Migliore: ${plurale(rie.serieMigliore, "giorno", "giorni")}` });

		this.corpo.createEl("h4", { text: "Traguardi" });
		const griglia = this.corpo.createDiv({ cls: "arl-ob-traguardi" });
		for (const t of TRAGUARDI_OB) {
			const preso = (t.tipo === "totale" ? rie.totale : rie.serieMigliore) >= t.serve;
			const cella = griglia.createDiv({ cls: "arl-ob-traguardo" + (preso ? " is-preso" : "") });
			setIcon(cella.createSpan(), preso ? (t.tipo === "serie" ? "flame" : "award") : "lock");
			cella.createSpan({ text: t.testo });
		}
		this.corpo.createEl("p", { cls: "setting-item-description", text: "Le medaglie restano anche se elimini o modifichi un obiettivo." });
	}

	/** Elenco delle medaglie di un tipo, dalla più recente, con l'obiettivo che le ha date. */
	private dettaglioMedaglie(periodo: PeriodoObiettivo) {
		const stato = this.plugin.settings.obiettivi;
		const libri = this.plugin.tuttiILibri();
		const lingua = LINGUA === "en" ? "en-GB" : "it-IT";
		const dataBreve = (d: Date) => d.toLocaleDateString(lingua, { day: "2-digit", month: "2-digit", year: "numeric" });
		const titoli: Record<PeriodoObiettivo, string> = {
			day: "Medaglie di bronzo · giorni",
			week: "Medaglie d'argento · settimane",
			month: "Medaglie d'oro · mesi",
			year: "Trofei · anni",
		};
		const voci = Object.keys(stato.premi)
			.filter((k) => stato.premi[k] > 0 && periodoDiChiave(k.slice(k.indexOf("|") + 1)) === periodo)
			.sort((a, b) => stato.premi[b] - stato.premi[a]);

		const box = this.corpo.createDiv({ cls: "arl-ob-dettaglio" });
		box.createEl("h4", { text: titoli[periodo] });
		for (const k of voci) {
			const id = k.slice(0, k.indexOf("|"));
			const chiave = k.slice(k.indexOf("|") + 1);
			const attuale = stato.obiettivi.find((o) => o.id === id);
			const copia = stato.copie[k] ?? (attuale ? { nome: attuale.nome, azione: attuale.azione, target: attuale.target, genere: attuale.genere } : null);
			const r = intervalloDaChiave(chiave, periodo);

			const quando = etichettaPeriodoOb(chiave, periodo);

			const riga = box.createDiv({ cls: "arl-ob-premio" });
			iconaMedaglia(riga, periodo, "is-presa");
			const testo = riga.createDiv({ cls: "arl-ob-premio-testo" });
			testo.createDiv({ cls: "arl-ob-premio-quando", text: quando });
			testo.createDiv({ cls: "arl-ob-nome", text: copia ? (copia.nome || `${tr(TESTO_AZIONE_OB[copia.azione])}: ${copia.target} ${tr(TESTO_OGNI_OB[periodo])}`) : "Obiettivo non più disponibile" });
			if (copia) {
				const det = [tr(TESTO_AZIONE_OB[copia.azione]), `${copia.target} ${tr(TESTO_OGNI_OB[periodo])}`];
				if (copia.genere) det.push(copia.genere);
				if (!attuale) det.push(tr("Obiettivo eliminato"));
				testo.createDiv({ cls: "arl-ob-dettagli", text: det.join(" · ") });
			}
			const quandoPreso = new Date(stato.premi[k]);
			testo.createDiv({
				cls: "arl-ob-dettagli",
				text: `Raggiunto il ${dataBreve(quandoPreso)} alle ${quandoPreso.toLocaleTimeString(lingua, { hour: "2-digit", minute: "2-digit" })}`,
			});
			if (copia && r) {
				const valore = progressoObiettivo({ id, nome: copia.nome, azione: copia.azione, target: copia.target, periodo, genere: copia.genere, creato: "", inBarra: false, restaVisibile: true }, r, libri);
				const unita = copia.azione === "pagine" ? plurale(valore, "pagina", "pagine") : copia.azione === "libri" ? plurale(valore, "libro", "libri") : plurale(valore, "giorno", "giorni");
				testo.createDiv({ cls: "arl-ob-dettagli", text: `Risultato: ${unita} su ${copia.target}` });
			}
		}
	}

	/** Pagine lette nel tempo e record della libreria, calcolati sui libri letti. */
	private disegnaPrimati() {
		const plugin = this.plugin;
		const libri = plugin.tuttiILibri();
		const ora = Date.now();

		// pagine lette per giorno, su tutta la libreria
		const perGiorno = new Map<string, number>();
		for (const l of libri) {
			for (const x of l.letture) perGiorno.set(x.data, (perGiorno.get(x.data) ?? 0) + Math.max(0, pagineLette(x)));
		}
		const somma = (da: string, a: string) => {
			let n = 0;
			for (const [g, p] of perGiorno) if (g >= da && g <= a) n += p;
			return n;
		};
		const oggi = chiaveGiorno(ora);
		const sett = intervalloOb("week", ora);
		const mese = intervalloOb("month", ora);
		const anno = intervalloOb("year", ora);
		let totale = 0;
		let record = { data: "", pagine: 0 };
		const mesi = new Set<string>();
		for (const [g, p] of perGiorno) {
			totale += p;
			mesi.add(g.slice(0, 7));
			if (p > record.pagine) record = { data: g, pagine: p };
		}

		let tab: HTMLElement = this.corpo;
		const sezione = (titolo: string) => {
			tab = this.corpo.createEl("table", { cls: "arl-info-tab" });
			tab.createEl("tr", { cls: "arl-info-sez" }).createEl("th", { text: titolo, attr: { colSpan: "2" } });
		};
		const riga = (etichetta: string, ...valori: string[]) => {
			const r = tab.createEl("tr");
			r.createEl("th", { text: etichetta });
			const td = r.createEl("td");
			valori.filter(Boolean).forEach((v, i) => td.createSpan({ text: i === 0 ? v : ` · ${v}` }));
		};

		sezione("Pagine lette (tutta la libreria)");
		riga("Oggi", plurale(perGiorno.get(oggi) ?? 0, "pagina", "pagine"));
		riga("Questa settimana", plurale(somma(sett.primoGiorno, sett.ultimoGiorno), "pagina", "pagine"));
		riga("Questo mese", plurale(somma(mese.primoGiorno, mese.ultimoGiorno), "pagina", "pagine"));
		riga("Quest'anno", plurale(somma(anno.primoGiorno, anno.ultimoGiorno), "pagina", "pagine"));
		riga("Totale", plurale(totale, "pagina", "pagine"));
		const media = (n: number, d: number) => (d > 0 ? String(Math.round((n / d) * 10) / 10).replace(".", ",") : "0");
		riga("Media al giorno di lettura", `${media(totale, perGiorno.size)} ${tr("pagine")}`);
		riga("Media al mese di lettura", `${media(totale, mesi.size)} ${tr("pagine")}`);
		riga("Giorno record", record.data ? fmtData(record.data) : "—", record.data ? plurale(record.pagine, "pagina", "pagine") : "");

		// filtro per anno dei primati sui libri
		const letti = libri.filter((l) => l.fine || l.valutato);
		const anni = [...new Set(letti.filter((l) => l.fine).map((l) => l.fine.slice(0, 4)))].sort().reverse();
		const filtro = this.corpo.createDiv({ cls: "arl-ob-filtro" });
		new Setting(filtro).setName("Primati sui libri letti").addDropdown((d) => {
			d.addOption("", tr("Tutti"));
			for (const a of anni) d.addOption(a, a);
			d.setValue(anni.includes(this.annoPrimati) ? this.annoPrimati : "").onChange((v) => {
				this.annoPrimati = v;
				this.disegna();
			});
		});
		const scelti = this.annoPrimati ? letti.filter((l) => l.fine.startsWith(this.annoPrimati)) : letti;
		if (scelti.length === 0) {
			this.corpo.createEl("p", { cls: "setting-item-description", text: "Nessun libro letto in questo periodo." });
			return;
		}

		const titoli = (lista: Libro[]) => {
			const ord = lista.slice().sort((p, q) => p.titolo.localeCompare(q.titolo, "it"));
			return ord.slice(0, 3).map((l) => l.titolo).join(", ") + (ord.length > 3 ? ` +${ord.length - 3}` : "");
		};
		const estremo = (lista: Libro[], valore: (l: Libro) => number, alto: boolean) => {
			if (lista.length === 0) return [] as Libro[];
			const t = lista.map(valore).reduce((m, v) => (alto ? Math.max(m, v) : Math.min(m, v)));
			return lista.filter((l) => valore(l) === t);
		};

		sezione("Libri");
		const conPagine = scelti.filter((l) => l.pagine > 0);
		const piu = estremo(conPagine, (l) => l.pagine, true);
		const meno = estremo(conPagine, (l) => l.pagine, false);
		riga("Il libro con più pagine", piu.length ? titoli(piu) : "—", piu.length ? plurale(piu[0].pagine, "pagina", "pagine") : "");
		riga("Il libro con meno pagine", meno.length ? titoli(meno) : "—", meno.length ? plurale(meno[0].pagine, "pagina", "pagine") : "");

		const generi = new Map<string, { nome: string; n: number }>();
		for (const l of scelti) {
			const g = l.genere.trim();
			if (!g) continue;
			const e = generi.get(g.toLowerCase()) ?? { nome: g, n: 0 };
			e.n++;
			generi.set(g.toLowerCase(), e);
		}
		const classifica = [...generi.values()].sort((p, q) => q.n - p.n || p.nome.localeCompare(q.nome, "it"));
		const posti = ["Il genere più letto", "Il secondo genere più letto", "Il terzo genere più letto"];
		posti.forEach((etichetta, i) => {
			const g = classifica[i];
			riga(etichetta, g ? g.nome : "—", g ? plurale(g.n, "libro", "libri") : "");
		});

		const conPrezzo = scelti.filter((l) => l.prezzo !== null);
		const caro = estremo(conPrezzo, (l) => l.prezzo ?? 0, true);
		riga("Il libro più costoso", caro.length ? titoli(caro) : "—", caro.length ? formatEuro(caro[0].prezzo ?? 0) : "");

		const valutati = scelti.filter((l) => l.valutato);
		const stelle = (l: Libro) => plugin.stelleDi(l.arl, l.set);
		const piuStelle = estremo(valutati, stelle, true);
		riga("Il libro con più stelle", piuStelle.length ? titoli(piuStelle) : "—", piuStelle.length ? stringaStelle(stelle(piuStelle[0])) : "");
		const arlAlto = estremo(valutati, (l) => Math.round(l.arl * 10), true);
		riga("Il libro con il punteggio ARL più alto", arlAlto.length ? titoli(arlAlto) : "—", arlAlto.length ? `ARL ${fmt(arlAlto[0].arl)}` : "");
		const arlBasso = estremo(valutati, (l) => Math.round(l.arl * 10), false);
		riga("Il libro più brutto (ARL più basso)", arlBasso.length ? titoli(arlBasso) : "—", arlBasso.length ? `ARL ${fmt(arlBasso[0].arl)}` : "");

		this.corpo.createEl("p", { cls: "setting-item-description", text: "Primati calcolati sui libri letti (con data di fine o già valutati)." });
	}
}

/* ------------------------------------------------------------------ */
/*  Il tuo anno di lettura                                            */
/*  Riepilogo calcolato al momento sui libri finiti nell'anno e sulle  */
/*  letture registrate giorno per giorno. Nessun dato salvato.         */
/* ------------------------------------------------------------------ */

interface RiepilogoAnno {
	anno: number;
	libri: Libro[];
	pagine: number;
	giorniLettura: number;
	arlMedio: number | null;
	spesa: number;
	conPrezzo: number;
	pagineMese: number[];
	libriMese: number[];
	stelle: number[]; // indice = numero di stelle
	valutati: number;
	generi: { nome: string; n: number }[];
	autori: { nome: string; n: number }[];
	migliore: Libro[];
	peggiore: Libro[];
	piuLungo: Libro[];
	piuCorto: Libro[];
	piuVeloce: Libro[];
	piuLento: Libro[];
	record: { data: string; pagine: number } | null;
	serieLettura: number;
	medaglie: Record<PeriodoObiettivo, number>;
	senzaData: number;
	precedente: { nLibri: number; pagine: number } | null;
}

function libriFinitiNellAnno(libri: readonly Libro[], anno: number): Libro[] {
	return libri.filter((l) => l.fine.startsWith(`${anno}-`));
}

function pagineNellAnno(libri: readonly Libro[], anno: number): number {
	let n = 0;
	for (const l of libri) for (const x of l.letture) if (x.data.startsWith(`${anno}-`)) n += Math.max(0, pagineLette(x));
	return n;
}

/** Anni in cui c'è qualcosa da mostrare (libri finiti o letture), dal più vecchio al più recente. */
function anniDisponibili(libri: readonly Libro[]): number[] {
	const anni = new Set<number>();
	for (const l of libri) {
		const f = parseInt(l.fine.slice(0, 4), 10);
		if (Number.isFinite(f)) anni.add(f);
		for (const x of l.letture) {
			const a = parseInt(x.data.slice(0, 4), 10);
			if (Number.isFinite(a)) anni.add(a);
		}
	}
	return [...anni].sort((p, q) => p - q);
}

function calcolaAnnoLettura(
	tutti: readonly Libro[],
	anno: number,
	totStelle: number,
	stelleDi: (l: Libro) => number,
	stato: StatoObiettivi
): RiepilogoAnno {
	const libri = libriFinitiNellAnno(tutti, anno);
	const pagineMese = new Array<number>(12).fill(0);
	const libriMese = new Array<number>(12).fill(0);
	const giorni = new Map<string, number>();
	for (const l of tutti) {
		for (const x of l.letture) {
			if (!x.data.startsWith(`${anno}-`)) continue;
			const p = Math.max(0, pagineLette(x));
			const m = parseInt(x.data.slice(5, 7), 10) - 1;
			if (m >= 0 && m < 12) pagineMese[m] += p;
			giorni.set(x.data, (giorni.get(x.data) ?? 0) + p);
		}
	}
	for (const l of libri) {
		const m = parseInt(l.fine.slice(5, 7), 10) - 1;
		if (m >= 0 && m < 12) libriMese[m]++;
	}
	let record: { data: string; pagine: number } | null = null;
	for (const [data, pagine] of giorni) if (pagine > 0 && (!record || pagine > record.pagine)) record = { data, pagine };
	// serie più lunga di giorni consecutivi con almeno una lettura
	let serieLettura = 0;
	let corsa = 0;
	let ultimo = "";
	for (const g of [...giorni.keys()].sort()) {
		corsa = ultimo && giornoPrima(g) === ultimo ? corsa + 1 : 1;
		if (corsa > serieLettura) serieLettura = corsa;
		ultimo = g;
	}

	const valutatiLista = libri.filter((l) => l.valutato);
	const stelle = new Array<number>(totStelle + 1).fill(0);
	for (const l of valutatiLista) stelle[Math.min(totStelle, Math.max(0, stelleDi(l)))]++;
	const arlMedio = valutatiLista.length ? valutatiLista.reduce((a, l) => a + l.arl, 0) / valutatiLista.length : null;
	const conPrezzoLista = libri.filter((l) => l.prezzo !== null);

	const conta = (nome: (l: Libro) => string) => {
		const m = new Map<string, { nome: string; n: number }>();
		for (const l of libri) {
			const v = nome(l).trim();
			if (!v) continue;
			const e = m.get(v.toLowerCase()) ?? { nome: v, n: 0 };
			e.n++;
			m.set(v.toLowerCase(), e);
		}
		return [...m.values()].sort((p, q) => q.n - p.n || p.nome.localeCompare(q.nome, "it"));
	};
	const estremo = (lista: Libro[], valore: (l: Libro) => number, alto: boolean) => {
		if (lista.length === 0) return [] as Libro[];
		const t = lista.map(valore).reduce((m, v) => (alto ? Math.max(m, v) : Math.min(m, v)));
		return lista.filter((l) => valore(l) === t).sort((p, q) => p.titolo.localeCompare(q.titolo, "it"));
	};
	const arl10 = (l: Libro) => Math.round(l.arl * 10);
	const conPagine = libri.filter((l) => l.pagine > 0);
	const conGiorni = libri.filter((l) => l.giorni > 0);

	const medaglie: Record<PeriodoObiettivo, number> = { day: 0, week: 0, month: 0, year: 0 };
	for (const k of Object.keys(stato.premi)) {
		const quando = stato.premi[k];
		if (!quando || new Date(quando).getFullYear() !== anno) continue;
		const p = periodoDiChiave(k.slice(k.indexOf("|") + 1));
		if (p) medaglie[p]++;
	}

	const precedenti = libriFinitiNellAnno(tutti, anno - 1);
	const pagPrec = pagineNellAnno(tutti, anno - 1);
	return {
		anno,
		libri,
		pagine: pagineMese.reduce((a, b) => a + b, 0),
		giorniLettura: giorni.size,
		arlMedio,
		spesa: conPrezzoLista.reduce((a, l) => a + (l.prezzo ?? 0), 0),
		conPrezzo: conPrezzoLista.length,
		pagineMese,
		libriMese,
		stelle,
		valutati: valutatiLista.length,
		generi: conta((l) => l.genere),
		autori: conta((l) => l.autore),
		migliore: estremo(valutatiLista, arl10, true),
		peggiore: estremo(valutatiLista, arl10, false),
		piuLungo: estremo(conPagine, (l) => l.pagine, true),
		piuCorto: estremo(conPagine, (l) => l.pagine, false),
		piuVeloce: estremo(conGiorni, (l) => l.giorni, false),
		piuLento: estremo(conGiorni, (l) => l.giorni, true),
		record,
		serieLettura,
		medaglie,
		senzaData: tutti.filter((l) => l.valutato && !l.fine).length,
		precedente: precedenti.length > 0 || pagPrec > 0 ? { nLibri: precedenti.length, pagine: pagPrec } : null,
	};
}

function titoliElenco(lista: Libro[]): string {
	return lista.slice(0, 3).map((l) => l.titolo).join(", ") + (lista.length > 3 ? ` +${lista.length - 3}` : "");
}

function nomiMesi(): string[] {
	const lingua = LINGUA === "en" ? "en-GB" : "it-IT";
	return Array.from({ length: 12 }, (_x, m) => {
		const nome = new Date(2026, m, 1).toLocaleDateString(lingua, { month: "short" }).replace(".", "");
		return nome.charAt(0).toUpperCase() + nome.slice(1);
	});
}

/** Barra di testo per la nota: «████░░░░». */
function barraTesto(valore: number, massimo: number, larghezza = 20): string {
	const pieni = massimo > 0 ? Math.round((valore / massimo) * larghezza) : 0;
	return "█".repeat(pieni) + "░".repeat(larghezza - pieni);
}

/** Il riepilogo come nota Markdown (testi nella lingua dell'interfaccia). */
function notaAnnoLettura(r: RiepilogoAnno, valuta: (n: number) => string, totStelle: number): string {
	const mesi = nomiMesi();
	const num = (n: number) => n.toLocaleString(LINGUA === "en" ? "en-US" : "it-IT");
	const righe: string[] = [];
	righe.push("<!-- Generato da Books and Reviews: le modifiche manuali verranno sovrascritte -->");
	righe.push(`# ${tr("Il tuo anno di lettura")} ${r.anno}`, "");
	righe.push(`| ${tr("Libri letti")} | ${tr("Pagine lette")} | ${tr("Giorni di lettura")} | ${tr("ARL medio")} | ${tr("Spesa")} |`);
	righe.push("|---|---|---|---|---|");
	righe.push(`| ${r.libri.length} | ${num(r.pagine)} | ${r.giorniLettura} | ${r.arlMedio !== null ? fmt(r.arlMedio) : "—"} | ${r.conPrezzo ? valuta(r.spesa) : "—"} |`, "");
	if (r.precedente) {
		const d1 = r.libri.length - r.precedente.nLibri;
		const d2 = r.pagine - r.precedente.pagine;
		righe.push(`${tr("Rispetto al")} ${r.anno - 1}: ${tr("libri")} ${d1 >= 0 ? "+" : ""}${d1} · ${tr("pagine")} ${d2 >= 0 ? "+" : ""}${num(d2)}`, "");
	}
	righe.push(`## ${tr("Pagine per mese")}`, "", "```");
	const maxP = Math.max(...r.pagineMese, 0);
	mesi.forEach((m, i) => righe.push(`${m.padEnd(4)} ${barraTesto(r.pagineMese[i], maxP)} ${r.pagineMese[i]}`));
	righe.push("```", "", `## ${tr("Libri per mese")}`, "", `| ${mesi.join(" | ")} |`, `|${mesi.map(() => "---").join("|")}|`, `| ${r.libriMese.join(" | ")} |`, "");
	if (r.valutati > 0) {
		righe.push(`## ${tr("Stelle")}`, "", "```");
		const maxS = Math.max(...r.stelle, 0);
		for (let k = totStelle; k >= 1; k--) righe.push(`${stringaStelle(k).padEnd(totStelle + 1)} ${barraTesto(r.stelle[k], maxS, 15)} ${r.stelle[k]}`);
		righe.push("```", "");
	}
	if (r.generi.length) {
		righe.push(`## ${tr("Generi")}`, "");
		for (const g of r.generi.slice(0, 5)) righe.push(`- ${g.nome}: ${g.n}`);
		righe.push("");
	}
	if (r.autori.length) {
		righe.push(`## ${tr("Autori più letti")}`, "");
		for (const a of r.autori.slice(0, 5)) righe.push(`- ${a.nome}: ${a.n}`);
		righe.push("");
	}
	righe.push(`## ${tr("I momenti dell'anno")}`, "");
	const mom = (et: string, lista: Libro[], extra: string) => {
		if (lista.length) righe.push(`- **${tr(et)}**: ${titoliElenco(lista)} (${extra})`);
	};
	mom("Il migliore", r.migliore, `ARL ${r.migliore[0] ? fmt(r.migliore[0].arl) : ""}`);
	mom("Il peggiore", r.peggiore, `ARL ${r.peggiore[0] ? fmt(r.peggiore[0].arl) : ""}`);
	mom("Il più lungo", r.piuLungo, r.piuLungo[0] ? tr(plurale(r.piuLungo[0].pagine, "pagina", "pagine")) : "");
	mom("Il più corto", r.piuCorto, r.piuCorto[0] ? tr(plurale(r.piuCorto[0].pagine, "pagina", "pagine")) : "");
	mom("Letto più velocemente", r.piuVeloce, r.piuVeloce[0] ? tr(plurale(r.piuVeloce[0].giorni, "giorno", "giorni")) : "");
	mom("Letto più lentamente", r.piuLento, r.piuLento[0] ? tr(plurale(r.piuLento[0].giorni, "giorno", "giorni")) : "");
	if (r.record) righe.push(`- **${tr("Giorno record")}**: ${fmtData(r.record.data)} (${tr(plurale(r.record.pagine, "pagina", "pagine"))})`);
	if (r.serieLettura > 0) righe.push(`- **${tr("Serie di lettura più lunga")}**: ${tr(plurale(r.serieLettura, "giorno", "giorni"))}`);
	const totMed = r.medaglie.day + r.medaglie.week + r.medaglie.month + r.medaglie.year;
	if (totMed > 0) {
		righe.push("", `## ${tr("Obiettivi")}`, "", `🥉 ${r.medaglie.day} · 🥈 ${r.medaglie.week} · 🥇 ${r.medaglie.month} · 🏆 ${r.medaglie.year}`);
	}
	righe.push("");
	return righe.join("\n");
}

/** Finestra «Il tuo anno di lettura»: si calcola all'apertura e al cambio di anno. */
class AnnoLetturaModal extends Modal {
	private anno: number;
	private anni: number[];
	private corpo!: HTMLElement;
	private etichettaAnno!: HTMLElement;
	private bPrima!: HTMLButtonElement;
	private bDopo!: HTMLButtonElement;
	private tutti: Libro[] = [];
	private riepilogo: RiepilogoAnno | null = null;

	constructor(
		app: App,
		private plugin: BooksAndReviewsPlugin
	) {
		super(app);
		this.anno = new Date().getFullYear();
		this.anni = [];
	}

	onOpen() {
		this.modalEl.addClass("arl-an-modal");
		const c = this.contentEl;
		c.empty();
		collegaTraduzione(c);
		this.tutti = this.plugin.tuttiILibri();
		this.anni = anniDisponibili(this.tutti);
		const corrente = new Date().getFullYear();
		if (!this.anni.includes(corrente)) this.anni.push(corrente);
		this.anni.sort((p, q) => p - q);

		const testa = c.createDiv({ cls: "arl-an-testa" });
		testa.createEl("h2", { text: "Il tuo anno di lettura" });
		const nav = testa.createDiv({ cls: "arl-an-nav" });
		this.bPrima = nav.createEl("button", { text: "◄", attr: { "aria-label": "Anno precedente" } });
		this.etichettaAnno = nav.createSpan({ cls: "arl-an-anno" });
		this.bDopo = nav.createEl("button", { text: "►", attr: { "aria-label": "Anno successivo" } });
		this.bPrima.onclick = () => this.vai(-1);
		this.bDopo.onclick = () => this.vai(1);

		this.corpo = c.createDiv({ cls: "arl-an-corpo" });
		const piede = c.createDiv({ cls: "arl-ob-piede" });
		piede.createEl("button", { text: "Salva come nota" }).onclick = () => void this.salvaNota();
		piede.createEl("button", { text: "Chiudi" }).onclick = () => this.close();
		this.disegna();
	}

	onClose() {
		scollegaTraduzione(this.contentEl);
		this.contentEl.empty();
	}

	private vai(passo: number) {
		const i = this.anni.indexOf(this.anno) + passo;
		if (i < 0 || i >= this.anni.length) return;
		this.anno = this.anni[i];
		this.disegna();
	}

	private async salvaNota() {
		if (!this.riepilogo) return;
		const r = this.riepilogo;
		const testo = notaAnnoLettura(r, formatEuro, this.plugin.settings.stelleTotali);
		await this.plugin.salvaNotaAnno(r.anno, testo);
	}

	private disegna() {
		const i = this.anni.indexOf(this.anno);
		this.bPrima.disabled = i <= 0;
		this.bDopo.disabled = i >= this.anni.length - 1;
		this.etichettaAnno.setText(String(this.anno));
		this.corpo.empty();
		const plugin = this.plugin;
		const r = calcolaAnnoLettura(this.tutti, this.anno, plugin.settings.stelleTotali, (l) => plugin.stelleDi(l.arl, l.set), plugin.settings.obiettivi);
		this.riepilogo = r;
		let c = this.corpo; // le sezioni successive vanno nelle due colonne

		if (r.libri.length === 0 && r.pagine === 0) {
			c.createEl("p", { cls: "setting-item-description", text: "Nessuna lettura in questo anno." });
			if (r.senzaData > 0) c.createEl("p", { cls: "setting-item-description", text: `${plurale(r.senzaData, "libro", "libri")} senza data di fine non conteggiati.` });
			return;
		}

		// numeri principali
		const tessere = c.createDiv({ cls: "arl-an-tessere" });
		const tessera = (valore: string, etichetta: string) => {
			const t = tessere.createDiv({ cls: "arl-an-tessera" });
			t.createDiv({ cls: "arl-ob-numero", text: valore });
			t.createDiv({ cls: "arl-ob-etichetta", text: etichetta });
		};
		const lingua = LINGUA === "en" ? "en-US" : "it-IT";
		tessera(String(r.libri.length), "Libri letti");
		tessera(r.pagine.toLocaleString(lingua), "Pagine lette");
		tessera(String(r.giorniLettura), "Giorni di lettura");
		tessera(r.arlMedio !== null ? fmt(r.arlMedio) : "—", "ARL medio");
		tessera(r.conPrezzo ? formatEuro(r.spesa) : "—", "Spesa");

		if (r.precedente) {
			const conf = c.createDiv({ cls: "arl-an-confronto" });
			conf.createSpan({ text: `Rispetto al ${r.anno - 1}` });
			const delta = (n: number, unita: string) => {
				const s = conf.createSpan({ cls: n > 0 ? "arl-an-su" : n < 0 ? "arl-an-giu" : "" });
				s.setText(`${unita} ${n > 0 ? "+" : ""}${n.toLocaleString(lingua)} ${n > 0 ? "▲" : n < 0 ? "▼" : "="}`);
			};
			delta(r.libri.length - r.precedente.nLibri, tr("libri"));
			delta(r.pagine - r.precedente.pagine, tr("pagine"));
		}

		const colonne = this.corpo.createDiv({ cls: "arl-an-colonne" });
		const sinistra = colonne.createDiv({ cls: "arl-an-colonna" });
		const destra = colonne.createDiv({ cls: "arl-an-colonna" });
		c = sinistra;

		const mesi = nomiMesi();
		const barre = (titolo: string, voci: { etichetta: string; valore: number; extra?: string }[], marca = false) => {
			c.createEl("h4", { text: titolo });
			const box = c.createDiv({ cls: "arl-an-barre" });
			const max = Math.max(...voci.map((v) => v.valore), 0);
			for (const v of voci) {
				const riga = box.createDiv({ cls: "arl-an-riga" });
				riga.createSpan({ cls: "arl-an-et", text: v.etichetta });
				const b = riga.createDiv({ cls: "arl-ob-barra" });
				b.createDiv({ cls: "arl-ob-pieno" }).style.setProperty("--arl-ob-perc", `${max > 0 ? Math.round((v.valore / max) * 100) : 0}%`);
				riga.createSpan({ cls: "arl-an-val", text: String(v.valore.toLocaleString(lingua)) });
				if (marca && max > 0 && v.valore === max) riga.createSpan({ cls: "arl-ob-forte", text: "Mese migliore" });
			}
		};
		barre("Pagine per mese", mesi.map((m, i) => ({ etichetta: m, valore: r.pagineMese[i] })), true);

		c.createEl("h4", { text: "Libri per mese" });
		const tab = c.createEl("table", { cls: "arl-an-mesi" });
		const intest = tab.createEl("tr");
		const valori = tab.createEl("tr");
		mesi.forEach((m, i) => {
			intest.createEl("th", { text: m });
			valori.createEl("td", { text: String(r.libriMese[i]) });
		});

		if (r.valutati > 0) {
			const voci: { etichetta: string; valore: number }[] = [];
			for (let k = plugin.settings.stelleTotali; k >= 1; k--) voci.push({ etichetta: stringaStelle(k), valore: r.stelle[k] });
			barre("Stelle", voci);
		}
		c = destra;
		if (r.generi.length) {
			const primi = r.generi.slice(0, 5).map((g) => ({ etichetta: g.nome, valore: g.n }));
			const altri = r.generi.slice(5).reduce((a, g) => a + g.n, 0);
			if (altri > 0) primi.push({ etichetta: tr("Altri"), valore: altri });
			barre("Generi", primi);
		}
		if (r.autori.length) {
			c.createEl("h4", { text: "Autori più letti" });
			c.createDiv({ cls: "arl-an-elenco", text: r.autori.slice(0, 5).map((a) => `${a.nome} (${a.n})`).join(" · ") });
		}

		c.createEl("h4", { text: "I momenti dell'anno" });
		const tm = c.createEl("table", { cls: "arl-info-tab" });
		const riga = (etichetta: string, ...valori: string[]) => {
			const tr0 = tm.createEl("tr");
			tr0.createEl("th", { text: etichetta });
			const td = tr0.createEl("td");
			valori.filter(Boolean).forEach((v, k) => td.createSpan({ text: k === 0 ? v : ` · ${v}` }));
		};
		const libro = (etichetta: string, lista: Libro[], extra: string) => {
			if (lista.length) riga(etichetta, titoliElenco(lista), extra);
		};
		libro("Il migliore", r.migliore, r.migliore[0] ? `ARL ${fmt(r.migliore[0].arl)}` : "");
		libro("Il peggiore", r.peggiore, r.peggiore[0] ? `ARL ${fmt(r.peggiore[0].arl)}` : "");
		libro("Il più lungo", r.piuLungo, r.piuLungo[0] ? plurale(r.piuLungo[0].pagine, "pagina", "pagine") : "");
		libro("Il più corto", r.piuCorto, r.piuCorto[0] ? plurale(r.piuCorto[0].pagine, "pagina", "pagine") : "");
		libro("Letto più velocemente", r.piuVeloce, r.piuVeloce[0] ? plurale(r.piuVeloce[0].giorni, "giorno", "giorni") : "");
		libro("Letto più lentamente", r.piuLento, r.piuLento[0] ? plurale(r.piuLento[0].giorni, "giorno", "giorni") : "");
		if (r.record) riga("Giorno record", fmtData(r.record.data), plurale(r.record.pagine, "pagina", "pagine"));
		if (r.serieLettura > 0) riga("Serie di lettura più lunga", plurale(r.serieLettura, "giorno", "giorni"));

		const totMed = r.medaglie.day + r.medaglie.week + r.medaglie.month + r.medaglie.year;
		if (totMed > 0) {
			c.createEl("h4", { text: "Obiettivi" });
			const m = c.createDiv({ cls: "arl-an-medaglie" });
			for (const p of PERIODI_OB) {
				const s = m.createSpan({ cls: "arl-an-medaglia" });
				iconaMedaglia(s, p, "is-presa");
				s.createSpan({ text: String(r.medaglie[p]) });
			}
		}
		if (r.senzaData > 0) this.corpo.createEl("p", { cls: "setting-item-description", text: `${plurale(r.senzaData, "libro", "libri")} senza data di fine non conteggiati.` });
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
		new Setting(c).setName(`Prezzo (${VALUTA.simbolo})`).addText((t) =>
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
		this.set =
			this.plugin.trovaSet(this.libro.set) ??
			this.plugin.trovaSet(this.plugin.settings.ultimoSet) ??
			this.plugin.setIniziale();
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
					this.plugin.settings.ultimoSet = nuovo.nome;
					void this.plugin.salvaImpostazioni();
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

		// le sfide stanno nella testata fissa: restano in vista mentre la lista scorre
		if (this.modo === "libreria") new BarraSfide(this.plugin, testa, this.libri);

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
		const misura = () => c.style.setProperty("--arl-testa-h", `${testa.getBoundingClientRect().height}px`);
		misura();
		window.requestAnimationFrame(misura);
		if (typeof ResizeObserver !== "undefined") {
			this.roTesta?.disconnect();
			this.roTesta = new ResizeObserver(misura);
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
		const postoSfide = c.createDiv({ cls: "arl-sfide-fisse" });
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
		new BarraSfide(this.plugin, postoSfide, this.libri);
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
	private bottoneOb: HTMLButtonElement | null = null;
	private badgeOb: HTMLElement | null = null;

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
				menu.createEl("button", { text: "Anno di lettura" }).onclick = () => new AnnoLetturaModal(this.app, this.plugin).open();
			}
			if (id === "set") {
				const ob = menu.createEl("button");
				ob.createSpan({ text: "Obiettivi" });
				this.badgeOb = ob.createSpan({ cls: "arl-ob-badge" });
				ob.onclick = () => new ObiettiviModal(this.app, this.plugin).open();
				this.bottoneOb = ob;
			}
		}
		this.aggiornaObiettivi();
		this.corpo = c.createDiv({ cls: "arl-corpo" });

		await this.mostraArchivio();
	}

	async onClose() {
		this.plugin.ripristinaBarre();
		scollegaTraduzione(this.contentEl);
		this.contentEl.empty();
	}

	/** Mostra o nasconde il pulsante Obiettivi e aggiorna il contatore di oggi (es. «1/2»). */
	aggiornaObiettivi() {
		const st = this.plugin.settings;
		this.bottoneOb?.toggleClass("arl-oculto", !st.obiettiviAttivi);
		if (!this.badgeOb) return;
		const oggi = statoOggiOb(st.obiettivi, Date.now());
		const mostra = st.obiettiviAttivi && st.obiettiviContatore && oggi.totale > 0;
		this.badgeOb.setText(mostra ? `${oggi.fatti === oggi.totale ? "✓ " : ""}${oggi.fatti}/${oggi.totale}` : "");
		this.badgeOb.toggleClass("arl-oculto", !mostra);
		this.bottoneOb?.toggleClass("is-completo", mostra && oggi.fatti === oggi.totale);
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

/** Dalla 1.13 il valore è sempre mostrato accanto al cursore da Obsidian stesso. */
function conTooltip(sl: SliderComponent): SliderComponent {
	return sl;
}

function contenitoreScorrevole(da: HTMLElement): HTMLElement | null {
	let e: HTMLElement | null = da;
	while (e) {
		const o = getComputedStyle(e).overflowY;
		if ((o === "auto" || o === "scroll") && e.scrollHeight > e.clientHeight) return e;
		e = e.parentElement;
	}
	return null;
}

class ARLSettingTab extends PluginSettingTab {
	private fontAltro: boolean | undefined;

	constructor(app: App, private plugin: BooksAndReviewsPlugin) {
		super(app, plugin);
	}

	/**
	 * Le opzioni compaiono nella ricerca delle impostazioni, una pagina per sezione.
	 */
	getSettingDefinitions(): SettingDefinitionItem[] {
		return this.sezioni().map((sez) => ({
			type: "page",
			name: tr(sez.nome),
			page: () => this.creaPagina(sez.nome, sez.disegna),
		}));
	}

	private creaPagina(nome: string, disegna: (c: HTMLElement, rinnova: () => void) => void): SettingPage {
		class PaginaOpzioni extends SettingPage {
			display() {
				this.title = tr(nome);
				collegaTraduzione(this.containerEl);
				this.disegnaContenuto();
			}
			/** Ridisegna la pagina mantenendo la posizione di scorrimento. */
			private disegnaContenuto() {
				const el = contenitoreScorrevole(this.containerEl);
				const top = el ? el.scrollTop : 0;
				this.containerEl.empty();
				disegna(this.containerEl, () => this.disegnaContenuto());
				if (el && top > 0) {
					el.scrollTop = top;
					window.requestAnimationFrame(() => {
						el.scrollTop = top;
					});
				}
			}
			hide() {
				scollegaTraduzione(this.containerEl);
				super.hide();
			}
		}
		return new PaginaOpzioni();
	}

	private sezioni(): { nome: string; disegna: (containerEl: HTMLElement, rinnova: () => void) => void }[] {
		return [
			{
				nome: "Generale",
				disegna: (containerEl, rinnova) => {
					const s = this.plugin.settings;
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
								rinnova();
							})
					);

				const anteprimaValuta = new Setting(containerEl)
					.setName("Valuta dei prezzi")
					.setDesc("Simbolo usato per i prezzi dei libri. Cambia solo la visualizzazione: i numeri nelle note restano gli stessi, senza conversione.");
				const aggiornaAnteprima = () => {
					impostaValuta(s);
					anteprimaValuta.setDesc(
						`${tr("Simbolo usato per i prezzi dei libri. Cambia solo la visualizzazione: i numeri nelle note restano gli stessi, senza conversione.")} ${tr("Anteprima")}: ${formatEuro(12.5)}`
					);
				};
				anteprimaValuta.addDropdown((d) => {
					const opzioni: Record<string, string> = {};
					for (const [k, v] of Object.entries(VALUTE)) opzioni[k] = `${v.simbolo} ${v.nome}`;
					opzioni.altra = "Altra…";
					d.addOptions(opzioni)
						.setValue(s.valuta)
						.onChange(async (v) => {
							s.valuta = v;
							aggiornaAnteprima();
							await this.plugin.salvaImpostazioni();
							rinnova();
						});
				});
				if (s.valuta === "altra") {
					anteprimaValuta.addText((t) =>
						t
							.setPlaceholder("R$")
							.setValue(s.valutaAltra)
							.onChange(async (v) => {
								s.valutaAltra = v;
								aggiornaAnteprima();
								await this.plugin.salvaImpostazioni();
							})
					);
				}
				aggiornaAnteprima();

				new Setting(containerEl)
					.setName("Simbolo dopo l'importo")
					.setDesc("Attivo: 12,50 €. Disattivo: € 12,50.")
					.addToggle((tg) =>
						tg.setValue(s.simboloDopo).onChange(async (v) => {
							s.simboloDopo = v;
							aggiornaAnteprima();
							await this.plugin.salvaImpostazioni();
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
							rinnova();
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
										rinnova();
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
						conTooltip(sl)
							.setLimits(600, 2400, 50)
							.setValue(s.larghezza > 0 ? s.larghezza : 2400)
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
								rinnova();
							})
					);
				},
			},
			{
				nome: "Barra dei totali della lista",
				disegna: (containerEl, rinnova) => {
					const s = this.plugin.settings;
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
				},
			},
			{
				nome: "Colonne della lista",
				disegna: (containerEl, rinnova) => {
					const s = this.plugin.settings;
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
				},
			},
			{
				nome: "Testo",
				disegna: (containerEl, rinnova) => {
					const s = this.plugin.settings;
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
						conTooltip(sl)
							.setLimits(10, 32, 1)
							.setValue(s.fontDimensione || 16)
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
								rinnova();
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
								rinnova();
							})
					);
				},
			},
			{
				nome: "Obiettivi",
				disegna: (containerEl) => {
					const s = this.plugin.settings;
					new Setting(containerEl).setName("Obiettivi").setHeading();
					containerEl.createDiv({
						cls: "setting-item-description",
						text: "Obiettivi di lettura (pagine, libri finiti, giorni di lettura) con medaglie e festeggiamento. Si calcolano solo quando un libro cambia o apri la finestra: nessun processo in background.",
					});
					const voce = (nome: string, desc: string, chiave: "obiettiviAttivi" | "obiettiviContatore" | "obiettiviFesta" | "obiettiviSuono" | "sfideInLibreria") =>
						new Setting(containerEl)
							.setName(nome)
							.setDesc(desc)
							.addToggle((t) =>
								t.setValue(s[chiave]).onChange(async (v) => {
									s[chiave] = v;
									await this.plugin.salvaImpostazioni();
									this.plugin.aggiornaObiettiviVista();
								})
							);
					voce("Attiva gli obiettivi", "Mostra il pulsante Obiettivi dopo «Set di valutazione» e calcola i progressi. Spento: nessun calcolo.", "obiettiviAttivi");
					voce("Contatore sul pulsante", "Mostra sul pulsante quanti obiettivi giornalieri sono completati (es. 1/2).", "obiettiviContatore");
					voce("Finestra di festeggiamento", "Quando raggiungi un obiettivo si apre una finestra con i fuochi d'artificio.", "obiettiviFesta");
					voce("Suono di festeggiamento", "Un breve suono quando raggiungi un obiettivo.", "obiettiviSuono");
					voce("Mostra le sfide nella libreria", "Una barra sotto il titolo di Libreria e Libreria virtuale con gli obiettivi mensili e annuali che hai scelto di tenere in vista.", "sfideInLibreria");
					new Setting(containerEl)
						.setName("Dimensione del testo delle sfide")
						.setDesc("Grandezza del testo nella barra delle sfide della libreria (da 10 a 20 px).")
						.addSlider((sl) =>
							conTooltip(sl)
								.setLimits(10, 20, 1)
								.setValue(s.sfideFont)
								.onChange(async (v) => {
									s.sfideFont = v;
									await this.plugin.salvaImpostazioni();
									this.plugin.aggiornaSfide();
								})
						);
					new Setting(containerEl)
						.setName("Giorni di tolleranza")
						.setDesc("Se inserisci una lettura in ritardo, un periodo finito da non più di questi giorni dà ancora la medaglia (0 = solo il periodo in corso).")
						.addSlider((sl) =>
							conTooltip(sl)
								.setLimits(0, 30, 1)
								.setValue(s.obiettiviTolleranza)
								.onChange(async (v) => {
									s.obiettiviTolleranza = v;
									await this.plugin.salvaImpostazioni();
								})
						);
				},
			},
			{
				nome: "Libreria virtuale",
				disegna: (containerEl, rinnova) => {
					const s = this.plugin.settings;
				new Setting(containerEl).setName("Libreria virtuale").setHeading();
				new Setting(containerEl)
					.setName("Libri per ripiano")
					.setDesc("Quanti libri stanno su ogni ripiano (da 5 a 40). Cambiandolo, i libri si ridistribuiscono nell'ordine salvato.")
					.addSlider((sl) =>
						conTooltip(sl)
							.setLimits(5, 40, 1)
							.setValue(s.vlPerRipiano)
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
							rinnova();
						})
					);
				if (!s.vlAdatta) {
					new Setting(containerEl)
						.setName("Larghezza della libreria")
						.setDesc("In pixel (da 500 a 2400).")
						.addSlider((sl) =>
							conTooltip(sl)
								.setLimits(500, 2400, 50)
								.setValue(s.vlLarghezza)
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
						rinnova();
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
							rinnova();
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
								conTooltip(sl)
									.setLimits(0, 70, 5)
									.setValue(s.vlImgOscura)
									.onChange(async (v) => {
										s.vlImgOscura = v;
										await this.plugin.salvaImpostazioni();
									})
							);
						new Setting(containerEl)
							.setName("Sfocatura")
							.setDesc("Effetto fuori fuoco (da 0 a 20 px) per non distrarre dai libri.")
							.addSlider((sl) =>
								conTooltip(sl)
									.setLimits(0, 20, 1)
									.setValue(s.vlImgSfoca)
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
								rinnova();
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
										rinnova();
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
				},
			},
			{
				nome: "Copertina",
				disegna: (containerEl, rinnova) => {
					const s = this.plugin.settings;
				new Setting(containerEl).setName("Copertina").setHeading();

				new Setting(containerEl)
					.setName("Altezza della copertina")
					.setDesc("Altezza massima dell'immagine nel dettaglio del libro, in pixel (da 80 a 600). Il pulsante a destra riporta il valore predefinito (240).")
					.addSlider((sl) =>
						conTooltip(sl)
							.setLimits(80, 600, 10)
							.setValue(s.altezzaCopertina)
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
								rinnova();
							})
					);
				},
			},
			{
				nome: "Galleria immagini",
				disegna: (containerEl, rinnova) => {
					const s = this.plugin.settings;
				new Setting(containerEl).setName("Galleria immagini").setHeading();
				new Setting(containerEl)
					.setName("Dimensione delle anteprime")
					.setDesc("Larghezza in pixel delle anteprime nella galleria immagini (da 120 a 600). Il pulsante a destra riporta il valore predefinito (260).")
					.addSlider((sl) =>
						conTooltip(sl)
							.setLimits(120, 600, 10)
							.setValue(s.galleriaMiniatura)
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
								rinnova();
							})
					);
				},
			},
			{
				nome: "Barra di lettura",
				disegna: (containerEl, rinnova) => {
					const s = this.plugin.settings;
				new Setting(containerEl).setName("Barra di lettura").setHeading();

				new Setting(containerEl)
					.setName("Spessore della barra")
					.setDesc("Altezza in pixel della barra di avanzamento nella sezione Lettura del dettaglio libro.")
					.addSlider((sl) =>
						conTooltip(sl)
							.setLimits(6, 40, 1)
							.setValue(s.spessoreBarra)
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
							rinnova();
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
								rinnova();
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
				},
			},
			{
				nome: "Grafico di lettura",
				disegna: (containerEl, rinnova) => {
					const s = this.plugin.settings;
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
						conTooltip(sl)
							.setLimits(1, 10, 1)
							.setValue(s.spessoreGrafico)
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
							rinnova();
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
								rinnova();
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
									rinnova();
								})
						);
				}
				aggiornaAnteprimaGrafico();
				},
			},
			{
				nome: "Colori del voto",
				disegna: (containerEl, rinnova) => {
					const s = this.plugin.settings;
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
						conTooltip(sl)
							.setLimits(4, 30, 1)
							.setValue(s.spessoreTemi)
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
				},
			},
			{
				nome: "Stelle",
				disegna: (containerEl, rinnova) => {
					const s = this.plugin.settings;
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
								rinnova();
							});
					});

				containerEl.createDiv({
					cls: "setting-item-description",
					text: "Le soglie per assegnare le stelle si impostano in ogni set di valutazione (Set di valutazione → Modifica).",
				});
				},
			},
		];
	}
}
