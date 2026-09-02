export interface Character {
  slug: string;
  name: string;
  role: string;
  age: string;
  emoji: string;           // display emoji (with skin tone if applicable)
  color: string;           // neon hex
  colorClass: string;      // tailwind text class
  borderClass: string;     // tailwind border class
  bgClass: string;         // tailwind bg class
  tagline: string;
  metaDescription: string;  // 130-160 char meta description for the detail page
  origin: string;          // origin story — 2-3 paragraphs
  relationship: string;    // relationship with Guy — 1-2 paragraphs
  facts: string[];         // 4-6 fun facts
}

export const CHARACTERS: Character[] = [
  {
    slug: 'guy',
    name: 'Guy',
    role: 'The Kid',
    age: '10',
    emoji: '🧒🏽',
    color: '#ff2d78',
    colorClass: 'text-neon-pink',
    borderClass: 'border-neon-pink/40',
    bgClass: 'bg-neon-pink/10',
    tagline: 'Born to cause chaos. Certified main character.',
    metaDescription: "Meet Guy, the 10-year-old main character of Kid Chaos — born to cause chaos and certified in it. His origin story, six fun facts, and why adults never win.",
    origin: `Guy arrived at 3:17am on a Tuesday — twelve days late, already on his own schedule. The nurses described him as "spirited." The doctor said "energetic." Papu just looked at Mal and said "he's yours." He wasn't quiet for a single minute of his first year, and he's been making up for lost silence ever since.\n\nBy age three, Guy had independently discovered that: (1) the dog could be convinced to help with almost anything if cheese was involved, (2) grandparents are dramatically easier to negotiate with than parents, and (3) the phrase "I didn't know that would happen" works approximately six times before adults stop believing it. He's used it forty-seven times.\n\nGuy doesn't mean to be annoying. He genuinely doesn't. He's curious, creative, and running at a frequency that most humans can't quite tune into. He sees the world as a series of experiments, most of which involve seeing what happens when you do the thing you've just been told not to do. The results, he maintains, are always educational.`,
    relationship: `Guy's relationship with himself is his most important one, and he'd be the first to tell you that. He is, in his own words, "the main character" — and not in a bad way. In his head, there's always a soundtrack playing, always a crowd watching, always a moment that's about to become legendary.\n\nThe chasers — Papu, Mal, Mimi, Barry, and the occasional dinosaur — are not villains in Guy's story. They're the supporting cast. He loves them with his whole heart, which is exactly why he gives them so much to do.`,
    facts: [
      'Once convinced his entire class it was a snow day — in July. Three kids actually stayed home.',
      'Has a secret stash of snacks in a location no adult has ever found. The location is the inside of a stuffed bear named "Gerald." Gerald has been in plain sight since 2019.',
      'Can eat an entire bowl of cereal without making a single sound, but only when he\'s trying to be sneaky. At breakfast he sounds like a construction site.',
      'Buddy the dog responds to 14 commands. Twelve of them were taught by Guy. None of them are the commands Papu and Mal taught.',
      'Once stayed perfectly still for 47 minutes during hide and seek. This is the longest he has ever been still. It has never happened again.',
      'His school nickname is "The Question" because every lesson ends with a question only Guy could think to ask.',
    ],
  },
  {
    slug: 'buddy',
    name: 'Buddy',
    role: 'The Dog',
    age: '4 (28 in chaos years)',
    emoji: '🐕',
    color: '#f59e0b',
    colorClass: 'text-yellow-400',
    borderClass: 'border-yellow-400/40',
    bgClass: 'bg-yellow-400/10',
    tagline: 'Loyal to Guy. Neutral on the concept of rules.',
    metaDescription: "Meet Buddy, the golden retriever at the heart of Kid Chaos. Loyal to Guy, neutral on rules — his origin story, six fun facts, and the sock hoard nobody found.",
    origin: `Buddy arrived as a birthday surprise when Guy was six. Papu had wanted a goldfish. Mal had suggested a plant. Somehow they left the shelter with a four-month-old golden retriever who had already failed basic obedience twice and was described in his file as "enthusiastic beyond typical parameters."\n\nWithin 48 hours, Buddy had chewed through one shoe (Papu's, specifically), discovered that the kitchen bin was not actually secured, and learned to open the back door. The shelter had not mentioned the door thing.\n\nVet visits describe Buddy as "a healthy dog with an unusually strong sense of personal agency." Guy describes him as his best friend. Both are accurate.`,
    relationship: `Buddy and Guy operate as a unit. Where Guy goes, Buddy follows. Where Buddy goes, chaos follows. They have a communication system that no adult has been able to fully decode — a combination of eye contact, specific treat placements, and a particular bark that means "I will do this, but I want credit for it."\n\nBuddy is technically neutral in the chase — he doesn't go after Guy in the game, but he doesn't exactly help either. He's the wild card. The variable. The one nobody has planned for.`,
    facts: [
      'Has three separate hiding spots for stolen socks. Papu has found two of them. Buddy knows Papu hasn\'t found the third.',
      'Once barked continuously for 11 minutes at a decorative ceramic frog. The frog did not move. Buddy maintains it was about to.',
      'Responds to his name reliably about 60% of the time. The other 40% he clearly hears but has decided it isn\'t relevant to him right now.',
      'Has successfully communicated "I need to go outside" to Guy but will fake urgency to avoid bedtime at least three times a week.',
      'Technically knows "sit," "stay," and "leave it." Treats these as suggestions rather than instructions.',
      'Once caught a frisbee one-handed — sorry, one-pawed — from six feet in the air. No one had a camera. No one will ever believe it.',
    ],
  },
  {
    slug: 'pap',
    name: 'Papuu',
    role: 'The Dad',
    age: '42',
    emoji: '👨🏽',
    color: '#00f0ff',
    colorClass: 'text-neon-blue',
    borderClass: 'border-neon-blue/40',
    bgClass: 'bg-neon-blue/10',
    tagline: 'Was a perfectly well-behaved kid. Karma noticed.',
    metaDescription: "Meet Papuu, the dad in Kid Chaos. A perfectly well-behaved kid until karma noticed — his origin story, six fun facts, and life as Guy's most patient chaser.",
    origin: `Papu grew up as the responsible one. Middle child, never caused trouble, always handed homework in early, remembered to say thank you. He was, by all accounts, an excellent child. Teachers loved him. Neighbours trusted him with spare keys. His mum called him "the easy one."\n\nHe went to university, studied something sensible, got a job, bought a house. At no point in any of this did the universe give any indication of what was coming. He met Mal, they got married, they talked about having "a calm, organized household." This is funny now.\n\nPapu owns one hat. A blue one. It goes everywhere with him and appears to be physically attached to his head by forces science cannot explain. Guy has tried to knock it off approximately 200 times. It has never fallen. This is the one area of his life where Papu has complete, unassailable dominance.`,
    relationship: `Papu chases Guy because that is the job now. He accepted this somewhere around Guy's fourth birthday and has been running ever since — literally and figuratively. He's not slow, exactly. He just has to find his keys first.\n\nDeep down, Papu knows that a lot of Guy's chaos comes from him. The curiosity, the problem-solving, the complete refusal to accept "because I said so" as a satisfying answer. He sees himself in it. He just can't say that out loud or Guy will use it as evidence.`,
    facts: [
      'Has said "I\'m not angry, I\'m just disappointed" exactly once. Felt terrible about it immediately. Has not said it again.',
      'His blue hat has survived: a washing machine, a lake, a school play where it was used as a prop without his knowledge, and one incident involving Buddy that nobody discusses.',
      'Was the kind of kid who read instruction manuals for fun. Has not read an instruction manual since Guy was born because there is no manual for this.',
      'Makes the same three dinners on rotation. Guy has memorized the schedule and uses it to plan activities during "pasta night" when Papu is distracted.',
      'Once fixed the Wi-Fi in under two minutes. This is the most respect Guy has ever shown him in a single moment.',
      'Genuinely doesn\'t understand how Guy can lose things that are literally in his hand. Has spent 340 cumulative hours looking for things that were in Guy\'s hand.',
    ],
  },
  {
    slug: 'mal',
    name: 'Mal',
    role: 'The Mom',
    age: '40',
    emoji: '👩🏽',
    color: '#ff2d78',
    colorClass: 'text-neon-pink',
    borderClass: 'border-neon-pink/40',
    bgClass: 'bg-neon-pink/10',
    tagline: 'Runs the household. The household does not know this.',
    metaDescription: "Meet Mal, the mom in Kid Chaos. She runs the household and the household has no idea — her origin story, six fun facts, and how she stays three steps ahead.",
    origin: `Mal was the oldest of four siblings, which means she had been managing chaos professionally since age seven. By the time she was ten, she could mediate an argument, remember everyone's schedule, and locate any missing item in under ninety seconds. These are not skills she chose. They were installed by necessity.\n\nShe went into project management, which felt natural — everything had a plan, plans had owners, owners had deadlines. She was exceptional at it. She is still exceptional at it. The difference is that her current project (Guy) has never once stayed on schedule, has no respect for deadlines, and frequently introduces unplanned deliverables like "a lizard I found" or "a new rule about screen time that he has definitely not invented himself."\n\nThe pink bow is real and it is hers and it is not up for discussion.`,
    relationship: `Mal and Guy have an understanding. He knows she knows. She knows he knows she knows. Neither of them says it directly.\n\nShe is the fastest chaser in the game not because she runs fast — though she does — but because she always knows where Guy is going before he gets there. She doesn't chase him so much as she's already there when he arrives. It's unsettling in the best possible way.`,
    facts: [
      'Has a mental map of every hiding spot in the house. Updates it quarterly.',
      'Once found Gerald the stuffed bear suspicious but couldn\'t explain why. Still can\'t explain why. Is correct.',
      'Can tell by the quality of the silence in the house exactly what Guy is doing. Silence Type 7 means he\'s reading. Silence Type 12 means something is about to be very messy.',
      'Meal-preps on Sundays. Guy has, on three separate occasions, found this process "interesting" and contributed. These are the only Sundays where things have gone wrong.',
      'Has read every parenting book published between 2018 and 2023. None of them mentioned Guy specifically. She has checked.',
      'Her go-to phrase is "I\'m going to count to three." She has never reached three. She doesn\'t need to.',
    ],
  },
  {
    slug: 'mimi',
    name: 'Mimi',
    role: 'The Grandma',
    age: '68',
    emoji: '👵',
    color: '#a855f7',
    colorClass: 'text-purple-400',
    borderClass: 'border-purple-400/40',
    bgClass: 'bg-purple-400/10',
    tagline: 'Retired PE teacher. Still has the stamina. Do not underestimate.',
    metaDescription: "Meet Mimi, the grandma in Kid Chaos. Retired PE teacher, stamina fully intact — her origin story, six fun facts, and why Guy never outruns her for very long.",
    origin: `Mimi taught Physical Education for 38 years. This fact explains approximately everything about her. She is fast. She is strategic. She knows what you\'re going to do before you do it because she has seen 1,400 children try to do it first, and she hasn\'t forgotten a single one.\n\nShe raised Papu with warmth, discipline, and an approach she describes as "structured freedom," which meant you could do what you liked as long as you could explain why and handle the consequences. Papu turned out fine. She notes this proudly. She also notes, privately, that Guy is more interesting.\n\nThe white hair has been white since she was 56 and she considers it her best feature. She has been known to use it strategically — looking frail when it suits her, revealing she is absolutely not frail approximately 20 seconds later.`,
    relationship: `Mimi is Guy\'s favourite grown-up to visit. She plays games with him, always has snacks he\'s not supposed to have before dinner, and tells stories about Papu as a kid that Guy finds absolutely riveting. She is also the chaser he is most wary of — not because she\'s mean, but because she genuinely enjoys the chase and she is surprisingly, disturbingly, athletically competitive for a 68-year-old.\n\n"You can run," she has told him more than once, "but I taught cross country for twenty years." He runs anyway. She catches up.`,
    facts: [
      'Holds the unofficial neighbourhood record for fastest 100m in the over-65 category. Nobody organised this race. She timed herself.',
      'Has a cane that she uses approximately 10% of the time. The other 90% she just carries it because "it\'s useful."',
      'Calls Guy "trouble" exclusively. He answers to it without thinking.',
      'Makes biscuits that Guy has described as "the best thing that has ever happened to me." Has been making the same recipe since 1987. Will not share it. Not with anyone.',
      'Sends text messages in full sentences with correct punctuation. This is more unsettling to Guy than any of her other qualities.',
      'Once beat Guy at every single game they played in one afternoon. She didn\'t mention it at the time. She doesn\'t need to.',
    ],
  },
  {
    slug: 'barry',
    name: 'Barry',
    role: 'The Grandpa',
    age: '71',
    emoji: '👴',
    color: '#f59e0b',
    colorClass: 'text-yellow-400',
    borderClass: 'border-yellow-400/40',
    bgClass: 'bg-yellow-400/10',
    tagline: 'Slow on his feet. Zero percent slow in his thinking.',
    metaDescription: "Meet Barry, the grandpa in Kid Chaos. Slow on his feet, never slow in his thinking — his origin story, six fun facts, and the traps Guy still walks into.",
    origin: `Barry has never told anyone exactly what he did for work before he retired. He describes it as "problem-solving," which could mean anything. What it has clearly left him with is an almost supernatural ability to anticipate what people are going to do, a total calm under pressure, and a cigar that has not been lit since 1987 but which he carries everywhere because "it keeps me looking like I know what I\'m doing."\n\nHe raised Mal, and if you want to understand Mal, you start with Barry. The ability to know where someone is without being told them? Barry. The talent for appearing to be doing nothing while actually tracking everything? Barry. The phrase "I\'m not angry, I\'m just thinking"? All Barry.\n\nHe moves slowly now. Deliberately. Like someone who has decided that rushing is for people who haven\'t figured out shortcuts yet.`,
    relationship: `Barry and Guy have a relationship built on mutual respect and low-level competition. Barry knows every trick Guy knows because he either invented it or saw it before. Guy knows Barry is the one person he can\'t genuinely fool — and so he doesn\'t try. Instead, they sit together, say very little, and understand each other completely.\n\nIn the game, Barry is the slowest chaser. He knows this. He doesn\'t care. He knows where Guy is going to go long before Guy goes there, and he just walks to that spot and waits. It works more often than it should.`,
    facts: [
      'The cigar has been in his possession since 1987. He has no memory of where he got it. He will never get rid of it.',
      'Has beaten Guy at chess 23 times. Guy has beaten Barry twice. Barry remembers both games in detail and is genuinely, quietly proud.',
      'Once guessed exactly what Guy had hidden in Gerald the stuffed bear. Didn\'t say anything. Has been waiting for the right moment. The right moment hasn\'t come yet.',
      'Naps every day at 2pm. Allegedly. No one has ever actually seen him asleep.',
      'His advice to Guy, offered once and never repeated: "The best chaos is the kind that looks like an accident." Guy has been thinking about this ever since.',
      'Knows the full recipe for Mimi\'s biscuits. He is the only one. This is the most powerful secret in the family.',
    ],
  },
];

export function getCharacter(slug: string): Character | undefined {
  return CHARACTERS.find(c => c.slug === slug);
}
