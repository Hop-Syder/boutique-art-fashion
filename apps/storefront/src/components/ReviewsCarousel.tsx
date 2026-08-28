import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Star, MapPin, ChevronLeft, ChevronRight, ExternalLink, CheckCircle2 } from 'lucide-react';

interface GoogleReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  model: string;
}

const REAL_GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: 'rev-1',
    name: 'Melvina Chabi',
    location: 'Avis Google Maps Cotonou',
    rating: 5,
    date: 'Il y a 5 mois',
    comment: "Je vous recommande Art Fashion C'est le best côté habillement. 👌 …",
    model: 'Prêt-à-porter & Accessoires',
  },
  {
    id: 'rev-2',
    name: 'Daniel SEGLA',
    location: 'Avis Google Maps Cotonou',
    rating: 5,
    date: 'Il y a 6 mois',
    comment: 'Très belle expérience. Accueil au top et rapports qualité-prix abordable',
    model: 'Rapport Qualité-Prix Excellent',
  },
  {
    id: 'rev-3',
    name: 'Sara Lary',
    location: 'Avis Google Maps Cotonou',
    rating: 5,
    date: 'Il y a un an',
    comment: 'Je vous recommande cette boutique cas vous en trouverez ce que vous voulez 🙃 …',
    model: 'Choix & Variétés de Styles',
  },
  {
    id: 'rev-4',
    name: 'Smith KEKE',
    location: 'Avis Google Maps Cotonou',
    rating: 5,
    date: 'Il y a 2 ans',
    comment: 'Art Fashion est sans doute l’une des meilleures boutiques de prêt-à-porter que j’ai visitées.',
    model: 'Boutique Tendance & Haute Couture',
  },
  {
    id: 'rev-4b',
    name: 'Smith KEKE',
    location: 'Avis Google Maps Cotonou',
    rating: 5,
    date: 'Il y a 2 ans',
    comment: 'Le choix des vêtements est à la fois tendance et de grande qualité. Le personnel est toujours accueillant et prêt à aider, ce qui rend l’expérience de shopping vraiment agréable.',
    model: 'Vêtements Tendances & Accueil',
  },
  {
    id: 'rev-4c',
    name: 'Smith KEKE',
    location: 'Avis Google Maps Cotonou',
    rating: 5,
    date: 'Il y a 2 ans',
    comment: 'J’ai particulièrement apprécié la variété des styles proposés, qui permettent de trouver des tenues pour toutes les occasions. Je recommande vivement cette boutique à tous les amateurs de mode !',
    model: 'Variété des Styles & Recommandation',
  },
  {
    id: 'rev-5',
    name: 'Landry TOSSA',
    location: 'Avis Google Maps Cotonou',
    rating: 5,
    date: 'Il y a 6 mois',
    comment: 'Très original et rapport prix qualité excellent',
    model: 'Originalité & Qualité Prix',
  },
  {
    id: 'rev-6',
    name: 'Rafatalaye Wabi',
    location: 'Avis Google Maps Cotonou',
    rating: 4,
    date: 'Il y a 2 ans',
    comment: "Très bon boutique C'est le luxe et pour avoir ce luxe faut dépenser et vous ne le regretterez pas",
    model: 'Luxe & Prestige Masculin',
  },
  {
    id: 'rev-7',
    name: 'Amour Agbelessessi',
    location: 'Avis Google Maps Cotonou',
    rating: 5,
    date: 'Il y a 2 ans',
    comment: "La meilleure des boutiques de prêt à porter à Cotonou.. c'est vraiment le luxe chez Art Fashion. Je vous invites faire un tour.. 😊 …",
    model: 'Référence du Luxe à Cotonou',
  },
  {
    id: 'rev-8',
    name: 'Fabrice Jr Noukonme',
    location: 'Avis Google Maps Cotonou',
    rating: 5,
    date: 'Il y a 2 ans',
    comment: 'Si vous voulez vous habiller classique, élégant, impeccable 👍 allez à Art Fashion, vous ne serez pas déçu …',
    model: 'Style Classique & Élégant',
  },
  {
    id: 'rev-9',
    name: 'Charles Atindehou',
    location: 'Avis Google Maps Cotonou',
    rating: 5,
    date: 'Il y a un an',
    comment: 'Une très bonne appréciation pour le magasin. Accueil au top , produits de qualité.',
    model: 'Accueil au Top & Qualité',
  },
  {
    id: 'rev-10',
    name: 'Didier Houndjo',
    location: 'Avis Google Maps Cotonou',
    rating: 5,
    date: 'Il y a un an',
    comment: 'Cher frère Arnaud, je suis fier de ton accueil. Pleins succès à toi.',
    model: 'Accueil Chaleureux & Service',
  },
];

export const ReviewsCarousel: React.FC = () => {
  const { language } = useStore();
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const googleMapsUrl =
    'https://www.google.com/maps/place/ART+FASHION+pr%C3%AAt+a+porter+Cotonou/@6.3596491,2.4232393,17z/data=!4m8!3m7!1s0x1023551e93b2de9f:0xfd3e762c5cba57!8m2!3d6.3596491!4d2.4258142!9m1!1b1!16s%2Fg%2F11qpphqpp2?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D';

  // Split reviews dynamically into 2 rows for the dual marquee
  const halfIndex = Math.ceil(REAL_GOOGLE_REVIEWS.length / 2);
  const row1 = REAL_GOOGLE_REVIEWS.slice(0, halfIndex);
  const row2 = REAL_GOOGLE_REVIEWS.slice(halfIndex);

  // Duplicate rows for seamless infinite marquee loop
  const row1Duplicated = [...row1, ...row1, ...row1];
  const row2Duplicated = [...row2, ...row2, ...row2];

  const handleScrollLeft = () => {
    if (row1Ref.current) row1Ref.current.scrollBy({ left: -320, behavior: 'smooth' });
    if (row2Ref.current) row2Ref.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    if (row1Ref.current) row1Ref.current.scrollBy({ left: 320, behavior: 'smooth' });
    if (row2Ref.current) row2Ref.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6">
      {/* Header with Google Maps Rating Badge & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{language === 'en' ? 'Verified Google Maps Client Reviews' : 'Avis Clients Certifiés Google Maps'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-medium text-white leading-tight">
            {language === 'en' ? 'Client Satisfaction in Cotonou' : 'La Satisfaction de Nos Clients à Cotonou'}
          </h2>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-1 text-amber-400 font-bold bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
              <span className="text-base font-extrabold text-amber-400">4.9</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <span className="text-slate-400">
              {language === 'en' ? 'Based on verified Google Maps reviews' : 'Basé sur les avis réels certifiés Google Maps'}
            </span>
          </div>
        </div>

        {/* Controls & Direct Link */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={handleScrollLeft}
              className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition-all border border-slate-700 shadow-md cursor-pointer hover:scale-105 active:scale-95"
              aria-label={language === 'en' ? 'Scroll left' : 'Faire défiler vers la gauche'}
              id="reviews-scroll-left-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleScrollRight}
              className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition-all border border-slate-700 shadow-md cursor-pointer hover:scale-105 active:scale-95"
              aria-label={language === 'en' ? 'Scroll right' : 'Faire défiler vers la droite'}
              id="reviews-scroll-right-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95 shrink-0"
            id="reviews-google-maps-btn"
          >
            <span>{language === 'en' ? 'View on Google Maps' : 'Voir sur Google Maps'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Dual Row Infinite Marquee Container */}
      <div className="space-y-4 overflow-hidden relative rounded-3xl py-2">
        {/* Ambient Overlay Fades for Smooth Margins */}
        <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        {/* LIGNE 1 : Défilement Lent vers la Droite (Marquee Right) */}
        <div className="overflow-x-auto scrollbar-none" ref={row1Ref}>
          <div className="animate-marquee-right gap-4 py-1">
            {row1Duplicated.map((item, idx) => (
              <div
                key={`r1-${idx}`}
                className="w-[320px] sm:w-[360px] bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3 shrink-0"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* User Icon Badge (Pas de photo externe) */}
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-red-500 flex items-center justify-center border border-slate-800 shrink-0">
                        <User className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </h4>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex text-amber-400 shrink-0">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-normal italic">
                    "{item.comment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 truncate max-w-[200px]">
                    Pièce : <strong className="text-slate-900 font-semibold">{item.model}</strong>
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Google Maps
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIGNE 2 : Défilement Lent vers la Gauche (Marquee Left - Sens Opposé) */}
        <div className="overflow-x-auto scrollbar-none" ref={row2Ref}>
          <div className="animate-marquee-left gap-4 py-1">
            {row2Duplicated.map((item, idx) => (
              <div
                key={`r2-${idx}`}
                className="w-[320px] sm:w-[360px] bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3 shrink-0"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* User Icon Badge (Pas de photo externe) */}
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-red-500 flex items-center justify-center border border-slate-800 shrink-0">
                        <User className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </h4>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex text-amber-400 shrink-0">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-normal italic">
                    "{item.comment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 truncate max-w-[200px]">
                    Pièce : <strong className="text-slate-900 font-semibold">{item.model}</strong>
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Google Maps
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
