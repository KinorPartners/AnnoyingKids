'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface IdeaCard {
  id: number;
  title: string;
  desc: string;
  by: string;
  age: number;
  votes: number;
  tags: string[];
  isNew?: boolean; // locally submitted
}

const MOCK_IDEAS: IdeaCard[] = [
  { id: 1, title: 'Glitch Face Hoodie', desc: 'A hoodie with a glitching pixelated face that looks different from every angle.', by: 'ChaosKid_99', age: 12, votes: 247, tags: ['hoodie', 'glitch'] },
  { id: 2, title: 'Pizza Planet Tee', desc: 'Astronaut kid delivering pizza in space. Extra cheese, zero gravity.', by: 'StarBoy_7', age: 10, votes: 189, tags: ['tee', 'space', 'food'] },
  { id: 3, title: 'WiFi is Life Cap', desc: 'Dad cap with WiFi signal bars but instead of bars it shows chaos levels.', by: 'TechGirl_X', age: 11, votes: 156, tags: ['cap', 'tech'] },
  { id: 4, title: 'Too Busy Gaming Mug', desc: 'A mug that says TOO BUSY with a controller graphic and RGB glow effect print.', by: 'ControllerKid', age: 9, votes: 134, tags: ['mug', 'gaming'] },
  { id: 5, title: 'Invisible Homework Sticker', desc: 'A sticker pack with invisible ink concept - the homework ate itself.', by: 'NinjaStudent', age: 13, votes: 98, tags: ['sticker', 'school'] },
  { id: 6, title: 'Boss Baby CEO Hoodie', desc: 'I run this playground. CEO printed with tiny stats like recess managed, snacks consumed.', by: 'MiniCEO', age: 8, votes: 87, tags: ['hoodie', 'boss'] },
];

// Palette of neon gradients for idea artwork placeholders
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #ff2d78 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #00f0ff 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #39ff14 0%, #00f0ff 100%)',
  'linear-gradient(135deg, #ff6b35 0%, #ff2d78 100%)',
  'linear-gradient(135deg, #fff200 0%, #ff6b35 100%)',
  'linear-gradient(135deg, #a855f7 0%, #39ff14 100%)',
];

const CARD_EMOJIS = ['👕', '🎮', '🧢', '☕', '🎨', '🚀', '⚡', '🌀', '💥', '🔥'];

const LS_KEY = 'ak_chaoslab_ideas';
let nextId = 100;

function loadLocalIdeas(): IdeaCard[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLocalIdeas(ideas: IdeaCard[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(ideas)); } catch {}
}

export default function ChaosLabPage() {
  const [submitted, setSubmitted] = useState(false);
  const [localIdeas, setLocalIdeas] = useState<IdeaCard[]>([]);
  const [votes, setVotes] = useState<Record<number, number>>(
    Object.fromEntries(MOCK_IDEAS.map((idea) => [idea.id, idea.votes]))
  );

  useEffect(() => {
    const saved = loadLocalIdeas();
    if (saved.length) {
      setLocalIdeas(saved);
      setVotes(prev => ({
        ...prev,
        ...Object.fromEntries(saved.map((i: IdeaCard) => [i.id, i.votes])),
      }));
    }
  }, []);

  const allIdeas = [...localIdeas, ...MOCK_IDEAS];
  const sortedIdeas = [...allIdeas].sort((a, b) => (votes[b.id] ?? b.votes) - (votes[a.id] ?? a.votes));
  const topId = sortedIdeas[0]?.id;

  const handleVote = (id: number) => {
    setVotes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const title = (data.get('idea_title') as string) || 'Untitled Idea';
    const desc = (data.get('description') as string) || '';
    const by = (data.get('handle') as string) || 'Anonymous';
    const age = parseInt(data.get('age') as string) || 0;

    const newIdea: IdeaCard = {
      id: nextId++,
      title,
      desc,
      by,
      age,
      votes: 0,
      tags: [],
      isNew: true,
    };

    const updated = [newIdea, ...localIdeas];
    setLocalIdeas(updated);
    setVotes(prev => ({ ...prev, [newIdea.id]: 0 }));
    saveLocalIdeas(updated);

    setSubmitted(true);
    form.reset();
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-bungee text-5xl sm:text-7xl text-white mb-4 leading-tight">
          CHAOS{' '}
          <span className="text-neon-pink" style={{ textShadow: '0 0 20px rgba(255,45,120,0.6)' }}>
            LAB
          </span>
        </h1>
        <p className="font-space text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
          Got a sick idea for a design? Submit it. If it gets enough chaos votes,{' '}
          <span className="text-neon-green">we&apos;ll make it real.</span>
        </p>
      </section>

      {/* Disclaimer banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-start gap-3 bg-neon-yellow/5 border border-neon-yellow/30 rounded-xl px-5 py-4">
          <span className="text-neon-yellow text-lg flex-shrink-0">⚠️</span>
          <p className="font-space text-gray-400 text-sm leading-relaxed">
            <span className="text-neon-yellow font-bold">For illustration purposes only.</span>{' '}
            Ideas submitted through this tool appear in the gallery below as concept entries.
            Artwork placeholders are generated automatically and do not represent final products.
            Submitted ideas may be reviewed before appearing publicly.
          </p>
        </div>
      </section>

      {/* Submission Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
          <h2 className="font-bungee text-2xl text-white mb-6">
            DROP YOUR IDEA
          </h2>

          {submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <p className="font-bungee text-xl text-neon-green mb-2">
                IDEA DROPPED!
              </p>
              <p className="font-space text-gray-400 mb-1">
                Your idea has been added to the gallery below!
              </p>
              <p className="font-space text-gray-600 text-xs">
                It appears for illustration purposes. We&apos;ll review it shortly 🎉
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-6 py-2 border border-neon-pink/50 text-neon-pink font-space text-sm rounded-lg hover:bg-neon-pink/10 transition-all"
              >
                Submit another idea
              </button>
            </div>
          ) : (
            <form
              action="https://formsubmit.co/hello@annoyingkids.com"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <input type="hidden" name="_subject" value="New Chaos Lab Idea" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://annoyingkids.com/chaos-lab" />

              <div>
                <label className="block font-bungee text-sm text-gray-400 mb-2">
                  IDEA TITLE <span className="text-neon-pink">*</span>
                </label>
                <input
                  type="text"
                  name="idea_title"
                  required
                  placeholder="e.g. Laser Shark Hoodie"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 font-space text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink/50 focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all"
                />
              </div>

              <div>
                <label className="block font-bungee text-sm text-gray-400 mb-2">
                  DESCRIPTION <span className="text-neon-pink">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Describe your chaotic vision. The weirder the better."
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 font-space text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink/50 focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all resize-none"
                />
              </div>

              <div>
                <label className="block font-bungee text-sm text-gray-400 mb-2">
                  YOUR NAME / HANDLE <span className="text-neon-pink">*</span>
                </label>
                <input
                  type="text"
                  name="handle"
                  required
                  placeholder="e.g. ChaosKid_99"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 font-space text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink/50 focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all"
                />
              </div>

              <div>
                <label className="block font-bungee text-sm text-gray-400 mb-2">
                  AGE <span className="text-gray-600 font-space text-xs normal-case">(optional, 6–16)</span>
                </label>
                <input
                  type="number"
                  name="age"
                  min={6}
                  max={16}
                  placeholder="e.g. 12"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 font-space text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink/50 focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-neon-pink text-white font-bungee text-lg uppercase rounded-lg
                  shadow-[0_0_20px_rgba(255,45,120,0.4)] hover:shadow-[0_0_30px_rgba(255,45,120,0.7)]
                  hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                DROP THE IDEA 💡
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-4">
          <h2 className="font-bungee text-3xl sm:text-4xl text-white">
            THE CHAOS GALLERY 🔥
          </h2>
          <p className="font-space text-gray-500 mt-2">
            Vote for the ideas you want to see become real merch.
          </p>
        </div>

        {/* Gallery disclaimer */}
        <p className="text-center font-space text-gray-600 text-xs mb-10 italic">
          All gallery entries and artwork are for illustration purposes only.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedIdeas.map((idea, idx) => {
            const gradient = CARD_GRADIENTS[idea.id % CARD_GRADIENTS.length];
            const emoji = CARD_EMOJIS[idea.id % CARD_EMOJIS.length];
            return (
              <div
                key={idea.id}
                className="relative bg-dark-card border border-dark-border rounded-2xl overflow-hidden flex flex-col
                  hover:border-neon-pink/50 hover:shadow-[0_0_20px_rgba(255,45,120,0.15)] transition-all duration-300 group"
              >
                {/* Artwork placeholder */}
                <div
                  className="h-36 flex items-center justify-center relative overflow-hidden flex-shrink-0"
                  style={{ background: gradient }}
                >
                  <div className="absolute inset-0 opacity-20"
                    style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.15) 8px, rgba(0,0,0,0.15) 9px)' }}
                  />
                  <span className="text-5xl relative z-10 select-none drop-shadow-lg">{emoji}</span>
                  {idea.isNew && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-neon-green text-dark-bg font-bungee text-xs rounded-full z-10">
                      NEW
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col gap-4 flex-1">
                  {/* Top chaos badge */}
                  {idea.id === topId && (
                    <div className="absolute top-2 left-4">
                      <span className="px-3 py-1 bg-neon-yellow text-dark-bg font-bungee text-xs rounded-full shadow-[0_0_10px_rgba(255,242,0,0.5)]">
                        🏆 TOP CHAOS
                      </span>
                    </div>
                  )}

                  <h3 className="font-bungee text-lg text-white group-hover:text-neon-pink transition-colors leading-tight">
                    {idea.title}
                  </h3>

                  <p className="font-space text-gray-400 text-sm leading-relaxed flex-1">
                    {idea.desc}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-dark-surface border border-dark-border rounded-full font-space text-xs text-gray-500">
                      by {idea.by}{idea.age ? `, age ${idea.age}` : ''}
                    </span>
                  </div>

                  {idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-neon-green/10 border border-neon-green/30 rounded-full text-neon-green text-xs font-space"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleVote(idea.id)}
                    className="w-full py-3 bg-dark-surface border border-dark-border rounded-lg font-bungee text-sm text-gray-400
                      hover:border-neon-pink/50 hover:text-neon-pink hover:shadow-[0_0_10px_rgba(255,45,120,0.2)]
                      active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    🔥 {votes[idea.id] ?? idea.votes} votes
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block px-6 py-3 border border-neon-blue/50 text-neon-blue font-space text-sm rounded-lg hover:bg-neon-blue/10 transition-all"
          >
            ← Back to Shop
          </Link>
        </div>
      </section>
    </div>
  );
}
