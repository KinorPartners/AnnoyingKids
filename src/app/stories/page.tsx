'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Story {
  id: number;
  title: string;
  emoji: string;
  teaser: string;
  content: string;
  moral: string;
  tag: string;
}

const STORIES: Story[] = [
  {
    id: 1,
    emoji: '✨',
    title: 'The Great Glitter Explosion',
    tag: 'art',
    teaser: 'Maya just wanted to make a birthday card. The entire kitchen had other plans.',
    content: `Maya was making her mum a birthday card — a simple one, with glitter. She shook the bottle. Then shook it harder. Then the lid popped off.

Glitter went everywhere. The table. The dog. The ceiling fan (which was spinning). Every surface in the kitchen sparkled like a disco ball.

Mum walked in and stopped dead. Maya braced herself.

Then Mum burst out laughing. "This is the most beautiful kitchen I have ever seen," she said, wiping a glittery tear.

They spent the afternoon sticking the glitter into an enormous mural on the kitchen wall — the entire family, in glitter, hugging.

It's still there. Dad calls it "the world's most expensive wallpaper."`,
    moral: 'Some messes are secretly masterpieces.',
  },
  {
    id: 2,
    emoji: '🍳',
    title: 'Operation Midnight Snack',
    tag: 'food',
    teaser: 'Theo snuck downstairs for biscuits. He came back up having made breakfast for six.',
    content: `It was 2am and Theo was starving. He crept downstairs like a ninja, silent on every step except the third one (which always creaked, and always would).

He found the biscuit tin empty. Someone — Dad, definitely Dad — had eaten the last ones.

Theo decided to make toast. Then scrambled eggs. Then he found the berries and made a smoothie. Then he thought, well, while I'm here, I might as well do the whole thing.

By 5am, the table was set for six. Pancakes, eggs, fruit, orange juice, the works.

When the family came downstairs, they thought they'd woken up in a hotel. Theo was asleep on the sofa, spatula in hand.

It became a tradition. Every Saturday, the family woke up wondering what Theo had made them at midnight.`,
    moral: 'If you\'re going to get caught, make it worth it.',
  },
  {
    id: 3,
    emoji: '🎵',
    title: 'The Neighbourhood Band',
    tag: 'music',
    teaser: 'The neighbours were going to file a noise complaint. Then they heard the song.',
    content: `Lily practiced drums in the garage. Every day. Loudly.

Her neighbour Mr. Kowalski knocked on the door three times in one week. Each time he looked more tired than the last.

On the fourth visit, Lily opened the door before he could knock. She handed him a pair of drumsticks.

"You look like you've got something to hit," she said.

He stared at them for a very long moment. Then he stepped inside.

Mr. Kowalski turned out to have been in a band in his twenties. He hadn't played in thirty years. He sat down at the kit and absolutely destroyed the intro to a song Lily had never heard.

By summer, they had a five-person neighbourhood band with three more recruits from the street. They played the block party and brought the house down.

Lily still plays loudly. Now everyone joins in.`,
    moral: 'Noise is just music waiting for the right audience.',
  },
  {
    id: 4,
    emoji: '🐸',
    title: 'The Secret Frog',
    tag: 'animals',
    teaser: 'Jake kept a frog in his sock drawer for two weeks. Then it saved the day.',
    content: `Jake found the frog in the garden during a rainstorm and named him Sir Reginald. He kept him in a shoebox under his bed, feeding him flies he caught at the window.

His parents knew something was up — Jake had started doing his own laundry, which had never happened before in recorded history.

Then one evening, Mum reached into the sock drawer to grab a pair and screamed loud enough to alarm the neighbours.

But before anyone could say anything, Sir Reginald hopped across the floor and ate a spider the size of a small country that had been living behind the radiator for months.

Dad, who had a known spider problem, went very quiet. Then he helped Jake set up a proper terrarium in the living room.

Sir Reginald lived on the bookshelf for two years and ate seventeen spiders. He was beloved by all.`,
    moral: 'The right solution sometimes arrives in a sock drawer.',
  },
  {
    id: 5,
    emoji: '🎨',
    title: 'The Wall',
    tag: 'art',
    teaser: 'Someone drew on the school wall. The principal was furious. Then she looked closer.',
    content: `Nobody admitted to drawing on the old wall by the gym doors. The principal called an assembly. Silence.

Then a kid named Sam raised a hand. Not to confess — to suggest that maybe they should look at what was actually drawn before deciding if it was vandalism.

The principal went and looked.

It was a mural, six metres wide, of every teacher in the school doing their secret hobby — Mr. Park windsurfing, Ms. Chen playing electric guitar, the lunch lady accepting an Olympic medal for competitive cheese rolling.

Every detail was accurate. The art had taken weeks of silent research.

The principal called another assembly. This time it was to announce that the mural would stay, the artist would be commissioned to paint the main hall, and that everyone should probably think twice before assuming something is trouble.

Sam got an A+ in art. And a formal apology from Mr. Park, who was very private about the windsurfing.`,
    moral: 'Look closer before you judge.',
  },
  {
    id: 6,
    emoji: '🚀',
    title: 'The Science Project That Launched',
    tag: 'science',
    teaser: 'Priya\'s rocket project wasn\'t supposed to actually fly. It flew.',
    content: `The science fair project was meant to be a model. Priya had other ideas.

She spent six weeks in the garage, woke up early, stayed up late, and ignored every suggestion to "make it simpler."

On the day of the fair, Priya set up in the car park. She wouldn't fit in the gym.

The rocket was 1.2 metres tall and painted neon pink with the school logo on the side.

The countdown was five seconds. Then four. Then three. Then a teacher said "surely it won't actually—" and then it launched.

The rocket cleared the school roof. It came down, via a small parachute Priya had also built, in the field behind the swimming pool.

Priya won first prize. She also won an email from a local aerospace engineer who had seen it from her garden three streets away and wanted to offer work experience.

Priya said she'd think about it. She had another idea she wanted to finish first.`,
    moral: 'The word "ambitious" is only an insult to people who gave up.',
  },
  {
    id: 7,
    emoji: '🍕',
    title: 'The Worst Dinner That Wasn\'t',
    tag: 'food',
    teaser: 'Oscar destroyed dinner. What he made instead became a family legend.',
    content: `Oscar was trying to make pizza for the family. He had four recipes, none of which he followed.

The dough was too thick. The tomato sauce tasted like ketchup because it was ketchup. The cheese was the wrong cheese. The oven was set to the wrong temperature. He didn't notice until the smoke alarm went off.

The pizza was, by any official measure, ruined.

Oscar panicked, scraped everything off, sliced the overcooked base into strips, fried them in butter, piled leftover pasta on top, added every herb from the cupboard, and put it on the table calling it "Italian confusion."

His dad had three helpings. His sister asked for the recipe.

Oscar said he didn't have one. They decided to write it down together so they could make it again. They still make it every Friday.`,
    moral: 'A recipe is just a suggestion.',
  },
  {
    id: 8,
    emoji: '🦸',
    title: 'The Prank That Fixed Everything',
    tag: 'school',
    teaser: 'Zoe planned the greatest prank in school history. It accidentally solved a real problem.',
    content: `Zoe's plan was to switch all the labels on the lost property bin so nobody could find anything. Harmless chaos. Classic.

She spent a week at it, carefully relabeling everything. In the process, she discovered that the bin was absolutely overflowing with things that had name tags — they just hadn't been returned because nobody had ever checked.

Zoe, now deeply inconvenienced by her own conscience, sorted the entire bin, matched items to students, and left labelled piles outside every classroom.

When the head of year found her at 7am surrounded by 200 pieces of lost property, she asked what on earth was going on.

Zoe explained about the prank. Then about the name tags. Then about the system she had invented to stop it happening again.

The school adopted the system. They also gave Zoe a certificate, which she accepted while looking vaguely offended.`,
    moral: 'Sometimes chaos accidentally does the right thing.',
  },
  {
    id: 9,
    emoji: '🌧️',
    title: 'The Rainy Day Channel',
    tag: 'creativity',
    teaser: 'Stuck inside all weekend, Cleo started a TV channel. It only had one viewer at first.',
    content: `It rained all weekend. Cleo's mum said no screens. Cleo decided this did not apply to screens you make yourself.

She built a TV frame out of cardboard, wrote a schedule ("Cleo TV — programming begins at 10am"), and started producing content.

First: a cooking show where she made sandwiches and explained each ingredient in a French accent.
Next: a nature documentary about the household plants ("the spider plant, unshaken by the chaos around it, continues to grow").
Then a live interview with the dog, who was a very good sport.

Her mum watched from behind the door for an hour before coming in to ask if she could be a guest.

By Sunday afternoon, the whole family was involved. Dad made a weather forecast. Grandma called in via video for the chat segment.

Cleo decided she might want to be a director. Her mum said she already was one.`,
    moral: 'Boredom is just creativity waiting for a spark.',
  },
  {
    id: 10,
    emoji: '🏆',
    title: 'The Kid Who Kept Losing',
    tag: 'sport',
    teaser: 'Felix lost every race for a year. Then something shifted — not what you\'d expect.',
    content: `Felix joined the running club in Year 5 and finished last in every race for the entire year.

Not almost last. Last. Every time.

He kept showing up. Every Tuesday, every Thursday, every Saturday. His parents quietly worried. His coach quietly admired him.

In the final race of the year, Felix finished last again. But thirty seconds behind him, one of the fastest kids on the team tripped and hurt her ankle.

Felix was the only one who went back.

He helped her off the track, found the first aider, stayed with her until her mum arrived. He missed the podium ceremony entirely.

He was given the Most Valuable Athlete award at the end-of-year dinner. Not for speed. For what his coach called "the only finish that actually mattered this year."

Felix still runs. He's faster now. But he says that's not really the point.`,
    moral: 'How you run the race matters more than where you finish.',
  },
];

const TAG_COLORS: Record<string, string> = {
  art: 'text-neon-pink border-neon-pink/30 bg-neon-pink/10',
  food: 'text-neon-yellow border-neon-yellow/30 bg-neon-yellow/10',
  music: 'text-neon-blue border-neon-blue/30 bg-neon-blue/10',
  animals: 'text-neon-green border-neon-green/30 bg-neon-green/10',
  science: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  school: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  creativity: 'text-neon-pink border-neon-pink/30 bg-neon-pink/10',
  sport: 'text-neon-blue border-neon-blue/30 bg-neon-blue/10',
};

export default function StoriesPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-bungee text-5xl sm:text-7xl text-white mb-4 leading-tight">
          KID{' '}
          <span className="text-neon-pink" style={{ textShadow: '0 0 20px rgba(255,45,120,0.6)' }}>
            STORIES
          </span>
        </h1>
        <p className="font-space text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
          Naughty by nature. Good at heart.{' '}
          <span className="text-neon-green">Every story ends with a smile.</span>
        </p>
      </section>

      {/* Stories grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col gap-6">
          {STORIES.map((story) => {
            const isOpen = openId === story.id;
            return (
              <div
                key={story.id}
                className={`bg-dark-card border rounded-2xl overflow-hidden transition-all duration-300
                  ${isOpen ? 'border-neon-pink/50 shadow-[0_0_30px_rgba(255,45,120,0.15)]' : 'border-dark-border hover:border-neon-pink/30'}`}
              >
                {/* Header — always visible */}
                <button
                  className="w-full text-left px-6 py-5 flex items-start gap-4"
                  onClick={() => setOpenId(isOpen ? null : story.id)}
                >
                  <span className="text-4xl flex-shrink-0 mt-0.5">{story.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-space font-bold border ${TAG_COLORS[story.tag] || 'text-gray-400 border-gray-700'}`}>
                        #{story.tag}
                      </span>
                    </div>
                    <h2 className="font-bungee text-white text-xl sm:text-2xl leading-tight group-hover:text-neon-pink">
                      {story.title}
                    </h2>
                    <p className="font-space text-gray-400 text-sm mt-1 leading-relaxed">
                      {story.teaser}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 text-neon-pink text-xl transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Body — opens on click */}
                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="h-px bg-dark-border mb-5" />
                    <div className="font-space text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-5">
                      {story.content}
                    </div>
                    <div className="flex items-start gap-2 bg-neon-green/5 border border-neon-green/20 rounded-xl px-4 py-3">
                      <span className="text-neon-green text-lg flex-shrink-0">💡</span>
                      <p className="font-space text-neon-green text-sm leading-relaxed">
                        <span className="font-bold">Moral: </span>{story.moral}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block px-6 py-3 border border-neon-blue/50 text-neon-blue font-space text-sm rounded-lg hover:bg-neon-blue/10 transition-all"
          >
            ← Back Home
          </Link>
        </div>
      </section>
    </div>
  );
}
