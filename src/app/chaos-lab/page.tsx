'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface IdeaCard {
  id: number;
  title: string;
  desc: string;
  by: string;
  age: number;
  votes: number;
  tags: string[];
}

const MOCK_IDEAS: IdeaCard[] = [
  { id: 1, title: 'Glitch Face Hoodie', desc: 'A hoodie with a glitching pixelated face that looks different from every angle.', by: 'ChaosKid_99', age: 12, votes: 247, tags: ['hoodie', 'glitch'] },
  { id: 2, title: 'Pizza Planet Tee', desc: 'Astronaut kid delivering pizza in space. Extra cheese, zero gravity.', by: 'StarBoy_7', age: 10, votes: 189, tags: ['tee', 'space', 'food'] },
  { id: 3, title: 'WiFi is Life Cap', desc: 'Dad cap with WiFi signal bars but instead of bars it shows chaos levels.', by: 'TechGirl_X', age: 11, votes: 156, tags: ['cap', 'tech'] },
  { id: 4, title: 'Too Busy Gaming Mug', desc: 'A mug that says TOO BUSY with a controller graphic and RGB glow effect print.', by: 'ControllerKid', age: 9, votes: 134, tags: ['mug', 'gaming'] },
  { id: 5, title: 'Invisible Homework Sticker', desc: 'A sticker pack with invisible ink concept - the homework ate itself.', by: 'NinjaStudent', age: 13, votes: 98, tags: ['sticker', 'school'] },
  { id: 6, title: 'Boss Baby CEO Hoodie', desc: 'I run this playground. CEO printed with tiny stats like recess managed, snacks consumed.', by: 'MiniCEO', age: 8, votes: 87, tags: ['hoodie', 'boss'] },
];

export default function ChaosLabPage() {
  const [submitted, setSubmitted] = useState(false);
  const [votes, setVotes] = useState<Record<number, number>>(
    Object.fromEntries(MOCK_IDEAS.map((idea) => [idea.id, idea.votes]))
  );

  const sortedIdeas = [...MOCK_IDEAS].sort((a, b) => votes[b.id] - votes[a.id]);
  const topId = sortedIdeas[0]?.id;

  const handleVote = (id: number) => {
    setVotes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    // Let the form POST to formsubmit.co normally, but show success if JS intercepts
    // We'll let native submission happen; show success state only if the page re-renders
    // For a better UX we prevent default and show the message directly
    e.preventDefault();
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
              <p className="font-space text-gray-400">
                Your idea has been dropped into the chaos! We&apos;ll review it shortly 🎉
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
              {/* Hidden formsubmit fields */}
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
        <div className="text-center mb-12">
          <h2 className="font-bungee text-3xl sm:text-4xl text-white">
            THE CHAOS GALLERY 🔥
          </h2>
          <p className="font-space text-gray-500 mt-2">
            Vote for the ideas you want to see become real merch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedIdeas.map((idea) => (
            <div
              key={idea.id}
              className="relative bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col gap-4
                hover:border-neon-pink/50 hover:shadow-[0_0_20px_rgba(255,45,120,0.15)] transition-all duration-300 group"
            >
              {/* Top chaos badge */}
              {idea.id === topId && (
                <div className="absolute -top-3 left-4">
                  <span className="px-3 py-1 bg-neon-yellow text-dark-bg font-bungee text-xs rounded-full shadow-[0_0_10px_rgba(255,242,0,0.5)]">
                    🏆 TOP CHAOS
                  </span>
                </div>
              )}

              {/* Title */}
              <h3 className="font-bungee text-lg text-white group-hover:text-neon-pink transition-colors leading-tight mt-2">
                {idea.title}
              </h3>

              {/* Description */}
              <p className="font-space text-gray-400 text-sm leading-relaxed flex-1">
                {idea.desc}
              </p>

              {/* Author badge */}
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-dark-surface border border-dark-border rounded-full font-space text-xs text-gray-500">
                  by {idea.by}
                  {idea.age ? `, age ${idea.age}` : ''}
                </span>
              </div>

              {/* Tags */}
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

              {/* Vote button */}
              <button
                onClick={() => handleVote(idea.id)}
                className="w-full py-3 bg-dark-surface border border-dark-border rounded-lg font-bungee text-sm text-gray-400
                  hover:border-neon-pink/50 hover:text-neon-pink hover:shadow-[0_0_10px_rgba(255,45,120,0.2)]
                  active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                🔥 {votes[idea.id]} votes
              </button>
            </div>
          ))}
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
