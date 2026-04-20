"use client";
import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane, FaTrash, FaDownload, FaHistory } from "react-icons/fa";

const FAQ = [
  { q: "Quelles sont vos offres d'emploi ?", a: "Consultez notre page Offres Emploi pour voir toutes les opportunités disponibles dans plusieurs secteurs en Tunisie et à l'international." },
  { q: "Comment voir les offres disponibles ?", a: "Rendez-vous sur la page Offres Emploi de notre site pour consulter toutes les offres en cours." },
  { q: "Avez-vous des offres en informatique ?", a: "Oui, nous avons régulièrement des offres dans le secteur IT : développeurs, chefs de projet, data analysts et plus encore." },
  { q: "Avez-vous des offres en marketing ?", a: "Oui, nous recrutons dans le marketing digital, communication, SEO, et gestion de contenu." },
  { q: "Avez-vous des offres en finance ?", a: "Oui, nous avons des offres en comptabilité, audit, contrôle de gestion et finance d'entreprise." },
  { q: "Avez-vous des offres en RH ?", a: "Oui, nous recrutons des responsables RH, recruteurs, gestionnaires de paie et consultants RH." },
  { q: "Avez-vous des offres en vente ?", a: "Oui, nous avons des postes de commerciaux, account managers et directeurs des ventes." },
  { q: "Avez-vous des offres en BTP ?", a: "Oui, nous recrutons dans le bâtiment : ingénieurs, conducteurs de travaux, techniciens et architectes." },
  { q: "Avez-vous des offres en santé ?", a: "Oui, nous recrutons des médecins, infirmiers, pharmaciens et personnel médical." },
  { q: "Avez-vous des offres en logistique ?", a: "Oui, nous avons des postes de responsables logistique, supply chain et transport." },
  { q: "Avez-vous des offres à Tunis ?", a: "Oui, nous avons de nombreuses offres basées à Tunis et sa région." },
  { q: "Avez-vous des offres à Sfax ?", a: "Oui, nous recrutons également dans la région de Sfax." },
  { q: "Avez-vous des offres à Sousse ?", a: "Oui, nous avons des offres disponibles dans la région de Sousse." },
  { q: "Avez-vous des offres à l'international ?", a: "Oui, nous proposons des opportunités à l'international notamment en Europe et dans les pays du Golfe." },
  { q: "Avez-vous des offres en remote ?", a: "Oui, nous avons des postes en télétravail total ou partiel selon les entreprises partenaires." },
  { q: "Avez-vous des offres en CDI ?", a: "Oui, la majorité de nos offres sont des CDI. Consultez la page offres pour filtrer par type de contrat." },
  { q: "Avez-vous des offres en CDD ?", a: "Oui, nous avons aussi des missions en CDD selon les besoins de nos partenaires." },
  { q: "Avez-vous des offres en freelance ?", a: "Oui, nous proposons des missions freelance dans plusieurs domaines notamment l'IT et le conseil." },
  { q: "Avez-vous des offres pour les débutants ?", a: "Oui, nous avons des offres pour les profils juniors et les jeunes diplômés sans expérience." },
  { q: "Avez-vous des offres pour les seniors ?", a: "Oui, nous recrutons tous les profils, y compris les profils seniors avec beaucoup d'expérience." },
  { q: "Comment postuler ?", a: "Créez un compte, trouvez une offre qui vous intéresse et cliquez sur Postuler. Remplissez le formulaire et envoyez votre CV." },
  { q: "Comment créer un compte ?", a: "Cliquez sur login en haut de la page puis sur s'inscrire. Remplissez vos informations et validez." },
  { q: "Est-ce que postuler est gratuit ?", a: "Oui, postuler via Staffing Tunisia est totalement gratuit pour les candidats." },
  { q: "Quel format de CV acceptez-vous ?", a: "Nous acceptons les CV en format PDF, Word (.doc ou .docx). Le PDF est recommandé." },
  { q: "Comment suivre ma candidature ?", a: "Connectez-vous à votre espace candidat pour voir le statut de vos candidatures : En attente, Acceptée ou Refusée." },
  { q: "Combien de temps pour avoir une réponse ?", a: "Nous traitons les candidatures sous 48 à 72 heures ouvrables. Vous serez notifié par email." },
  { q: "Puis-je postuler à plusieurs offres ?", a: "Oui, vous pouvez postuler à autant d'offres que vous souhaitez." },
  { q: "Ma candidature a été refusée, que faire ?", a: "Ne vous découragez pas ! Consultez les autres offres disponibles et postulez à celles qui correspondent à votre profil." },
  { q: "Acceptez-vous les candidatures spontanées ?", a: "Oui, vous pouvez nous envoyer une candidature spontanée via la page Contact en joignant votre CV." },
  { q: "Quels sont vos services ?", a: "Nous proposons : Recrutement, Services EOR, Externalisation de la Paie et Conseil RH." },
  { q: "Qu'est-ce que le service EOR ?", a: "L'EOR (Employer of Record) vous permet d'embaucher des employés en Tunisie sans créer de société. Nous gérons tout légalement." },
  { q: "Qu'est-ce que l'externalisation de la paie ?", a: "Nous gérons entièrement la paie de vos employés : calcul des salaires, déclarations sociales et fiscales." },
  { q: "Combien coûtent vos services ?", a: "Nos tarifs varient selon le service et le volume. Contactez-nous pour obtenir un devis personnalisé gratuit." },
  { q: "C'est quoi Staffing Tunisia ?", a: "Staffing Tunisia est une agence de recrutement basée en Tunisie, spécialisée dans la mise en relation entre candidats et entreprises." },
  { q: "Dans quels secteurs intervenez-vous ?", a: "Nous intervenons dans tous les secteurs : IT, Finance, Marketing, BTP, Santé, Logistique, RH et bien d'autres." },
  { q: "Comment vous contacter ?", a: "Rendez-vous sur notre page Contact ou envoyez-nous un email. Notre équipe répond sous 24h ouvrables." },
  { q: "Quels sont vos horaires ?", a: "Nous sommes disponibles du lundi au vendredi de 8h à 17h. Notre chatbot répond 24h/24." },
  { q: "J'ai oublié mon mot de passe", a: "Cliquez sur Mot de passe oublié sur la page de connexion et suivez les instructions envoyées par email." },
  { q: "Mes données sont-elles sécurisées ?", a: "Oui, vos données personnelles sont protégées et ne sont jamais partagées sans votre consentement." },
  { q: "Comment préparer un bon CV ?", a: "Votre CV doit être clair, concis (1-2 pages), avec vos expériences en ordre chronologique inversé et vos compétences clés." },
  { q: "Comment se préparer pour un entretien ?", a: "Renseignez-vous sur l'entreprise, préparez vos réponses aux questions classiques et soignez votre présentation." },
  { q: "Comment recruter via Staffing Tunisia ?", a: "Contactez-nous via la page Contact ou demandez un devis. Nous vous proposerons des candidats qualifiés rapidement." },
  { q: "Combien de temps pour trouver un candidat ?", a: "Selon le profil recherché, nous présentons des candidats qualifiés sous 5 à 15 jours ouvrables." },
];

type Message = {
  role: "user" | "bot";
  text: string;
  timestamp: Date;
};

type Session = {
  sessionId: string;
  preview: string;
  date: string;
  messages: Message[];
};

const STORAGE_KEY = "staffing-sessions";
const CURRENT_KEY = "staffing-current-session";

const INITIAL_MESSAGE: Message = {
  role: "bot",
  text: "👋 Bonjour ! Je suis l'assistant Staffing Tunisia. Comment puis-je vous aider ?",
  timestamp: new Date(),
};

// ── Helpers localStorage ──
const getSessions = (): Session[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveSession = (sessionId: string, messages: Message[]) => {
  if (messages.length <= 1) return;
  const sessions = getSessions().filter((s) => s.sessionId !== sessionId);
  const preview = messages.find((m) => m.role === "user")?.text || "Nouvelle conversation";
  const session: Session = {
    sessionId,
    preview: preview.slice(0, 60),
    date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    messages,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([session, ...sessions].slice(0, 20)));
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(FAQ.slice(0, 3));
  const [sessionId, setSessionId] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Init session ──
  useEffect(() => {
    let sid = localStorage.getItem(CURRENT_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(CURRENT_KEY, sid);
    }
    setSessionId(sid);
    const existing = getSessions().find((s) => s.sessionId === sid);
    if (existing && existing.messages.length > 1) {
      setMessages(existing.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })));
    }
  }, []);

  // ── Sauvegarde automatique ──
  useEffect(() => {
    if (sessionId && messages.length > 1) {
      saveSession(sessionId, messages);
    }
  }, [messages, sessionId]);

  // ── Scroll automatique ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── FAQ par score ──
  const findFAQ = (text: string) => {
    const lower = text.toLowerCase();
    let best = { faq: null as (typeof FAQ)[0] | null, score: 0 };
    for (const f of FAQ) {
      const words = f.q.toLowerCase().split(" ").filter((w) => w.length > 3);
      const score = words.filter((w) => lower.includes(w)).length / words.length;
      if (score > best.score) best = { faq: f, score };
    }
    return best.score >= 0.5 ? best.faq : null;
  };

  // ── Suggestions dynamiques ──
  const handleInput = (val: string) => {
    setInput(val);
    if (val.length > 2) {
      const filtered = FAQ.filter((f) =>
        f.q.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 3);
      setSuggestions(filtered.length ? filtered : FAQ.slice(0, 3));
    } else {
      setSuggestions(FAQ.slice(0, 3));
    }
  };

  // ── Ouvrir historique ──
  const openHistory = () => {
    setSessions(getSessions());
    setShowHistory(true);
  };

  // ── Charger une session ──
  const loadSession = (s: Session) => {
    setMessages(s.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })));
    localStorage.setItem(CURRENT_KEY, s.sessionId);
    setSessionId(s.sessionId);
    setShowHistory(false);
  };

  // ── Supprimer une session ──
  const deleteSession = (e: React.MouseEvent, sid: string) => {
    e.stopPropagation();
    const updated = getSessions().filter((s) => s.sessionId !== sid);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSessions(updated);
  };

  // ── Nouvelle conversation ──
  const newConversation = () => {
    const newId = crypto.randomUUID();
    localStorage.setItem(CURRENT_KEY, newId);
    setSessionId(newId);
    setMessages([INITIAL_MESSAGE]);
    setShowHistory(false);
  };

  // ── Clear affichage ──
  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  // ── Download chat ──
  const downloadChat = () => {
    const content =
      `=== Conversation Staffing Tunisia ===\n` +
      `Date : ${new Date().toLocaleDateString("fr-FR")}\n\n` +
      messages
        .map((m) => `[${formatTime(m.timestamp)}] ${m.role === "user" ? "Vous" : "Assistant"} :\n${m.text}`)
        .join("\n\n") +
      `\n\n=== Fin de conversation ===`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-staffing-${new Date().toLocaleDateString("fr-FR").replace(/\//g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Envoyer message ──
  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMessage: Message = { role: "user", text: msg, timestamp: new Date() };
    setInput("");
    setSuggestions(FAQ.slice(0, 3));
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const faq = findFAQ(msg);
    if (faq) {
      setTimeout(() => {
        const botMsg: Message = { role: "bot", text: faq.a, timestamp: new Date() };
        setMessages((prev) => [...prev, botMsg]);
        setLoading(false);
      }, 600);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      const botMsg: Message = { role: "bot", text: data.reply, timestamp: new Date() };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: Message = {
        role: "bot",
        text: "Désolé, une erreur est survenue. Réessayez.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-5 z-50 w-17 h-17 bg-red-700 rounded-full shadow-2xl flex items-center justify-center hover:bg-red-800 transition-all hover:scale-110"
      >
        {open ? <FaTimes className="text-white text-xl" /> : <FaRobot className="text-white text-xl" />}
      </button>

      {/* Fenêtre chat */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ width: "360px", height: "520px" }}
        >
          {/* Header */}
          <div className="bg-red-700 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <FaRobot className="text-red-700 text-lg" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Assistant Staffing Tunisia</p>
              <p className="text-red-200 text-xs">En ligne · Répond instantanément</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button onClick={openHistory} title="Historique" className="text-red-200 hover:text-white transition">
                <FaHistory className="text-sm" />
              </button>
              <button onClick={downloadChat} title="Télécharger" className="text-red-200 hover:text-white transition">
                <FaDownload className="text-sm" />
              </button>
              <button onClick={clearChat} title="Effacer affichage" className="text-red-200 hover:text-white transition">
                <FaTrash className="text-sm" />
              </button>
            </div>
          </div>

          {/* Panneau Historique */}
          {showHistory && (
            <div className="absolute top-16 left-0 right-0 bottom-0 bg-white z-10 flex flex-col rounded-b-2xl">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <p className="text-sm font-semibold text-gray-700">Conversations précédentes</p>
                <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes className="text-sm" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 gap-2">
                    <FaHistory className="text-gray-300 text-3xl" />
                    <p className="text-center text-gray-400 text-sm">Aucune conversation sauvegardée</p>
                  </div>
                ) : (
                  sessions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => loadSession(s)}
                      className="w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-red-50 transition group flex items-center justify-between"
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm text-gray-800 truncate group-hover:text-red-700">{s.preview}</p>
                        <p className="text-xs text-gray-400 mt-1">{s.date}</p>
                      </div>
                      <span
                        onClick={(e) => deleteSession(e, s.sessionId)}
                        className="ml-2 text-gray-300 hover:text-red-500 transition flex-shrink-0"
                        title="Supprimer"
                      >
                        <FaTrash className="text-xs" />
                      </span>
                    </button>
                  ))
                )}
              </div>
              <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={newConversation}
                  className="w-full py-2 bg-red-700 text-white text-sm rounded-xl hover:bg-red-800 transition"
                >
                  + Nouvelle conversation
                </button>
              </div>
            </div>
          )}

          {/* Suggestions */}
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex gap-2 overflow-x-auto flex-shrink-0">
            {suggestions.map((f, i) => (
              <button
                key={i}
                onClick={() => handleSend(f.q)}
                className="whitespace-nowrap text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:border-red-400 hover:text-red-600 transition flex-shrink-0"
              >
                {f.q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-red-700 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-xs text-gray-400 mt-1 px-1">
                  {m.timestamp ? formatTime(m.timestamp) : ""}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Posez votre question..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-red-700 rounded-xl flex items-center justify-center hover:bg-red-800 transition disabled:opacity-50 flex-shrink-0"
            >
              <FaPaperPlane className="text-white text-sm" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}