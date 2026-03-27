export interface Article {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  readingTime: string;
  content: string; // plain paragraphs separated by \n\n
  relatedProduct?: { label: string; href: string };
}

export const ARTICLES: Article[] = [
  {
    slug: 'best-gifts-for-annoying-kids',
    title: 'Best Gifts for Kids Who Have Too Much Energy (and Too Many Ideas)',
    date: '2026-03-27',
    category: 'Gift Guides',
    excerpt: 'Shopping for a kid who does everything at full volume? Here\'s what actually works — and what ends up forgotten under the bed.',
    readingTime: '4 min read',
    relatedProduct: { label: 'Browse the merch →', href: '/products' },
    content: `Shopping for a kid who is basically a human tornado is harder than it sounds. You want something they\'ll actually use. Something that matches their energy. Something that won\'t be forgotten by Tuesday.

Here\'s what actually works.

**1. Merch That Matches Their Personality**
A kid who has opinions — loud, frequent, well-argued opinions — deserves a wardrobe that matches. Bold graphic tees, hoodies with personality, something that says "I\'m here and I have thoughts." It gets worn. Every day. Sometimes twice.

**2. A Creative Outlet That Can\'t Break**
Sketchbooks, sticker sets, blank notebooks. Give an energetic kid a place to put their ideas and they\'ll fill it in a week. These are the gifts that stay in use for months, not days.

**3. Anything They Can Build, Break, or Reassemble**
LEGO, robotics kits, puzzle-adjacent toys. If it has pieces and instructions they can ignore, you\'ve found the sweet spot. The goal isn\'t the finished product — it\'s the ninety minutes of focused chaos in the middle.

**4. A Game They Can Play Right Now**
Browser games, card games, anything that starts in under thirty seconds. High-energy kids don\'t have patience for setup. If they\'re playing within two minutes of unwrapping, you\'ve won.

**5. Something That Makes Them the Main Character**
Custom items. Personalised gear. Anything with their name, their face, or their vibe on it. Kids who feel like the star of the room tend to light up when a gift reflects that back at them.

**6. An Experience, Not a Thing**
Escape rooms. Trampoline parks. Pottery classes. Comedy clubs for kids. These are the gifts they\'ll talk about for a year. Harder to wrap, but worth it.

**7. The Gift They Didn\'t Know They Wanted**
The best kid gifts are often slightly unexpected. Not the most popular thing. Not what everyone else is getting. Something that makes them go "wait — this is amazing" after a two-second pause. That pause is gold.

The common thread: match the gift to the kid, not to what you think kids like. A kid who loves chaos deserves a gift that embraces it.`,
  },
  {
    slug: 'why-annoying-kids-succeed',
    title: 'Why the Most Annoying Kid in the Room Usually Wins Later',
    date: '2026-03-27',
    category: 'Personality & Identity',
    excerpt: 'The kid who asks too many questions, argues every point, and refuses to sit still? They\'re building skills adults spend years trying to develop.',
    readingTime: '5 min read',
    relatedProduct: { label: 'Merch for the main character →', href: '/products' },
    content: `There is a certain kind of kid who exhausts every adult in the room. They ask why after every answer. They argue rules they don\'t agree with. They have opinions about everything and share all of them, constantly, at volume.

Adults call them a handful. History calls them founders, scientists, and comedians.

Here\'s what\'s actually happening when an annoying kid does the thing they do.

**1. Questioning Everything = Critical Thinking**
The kid who won\'t accept "because I said so" is not being difficult. They are building the habit of demanding evidence. This is the foundation of good decision-making, scientific reasoning, and not getting scammed as an adult. Annoying now. Valuable later.

**2. Arguing Every Point = Persuasion Skills**
A kid who argues is a kid who is learning to construct a case, anticipate counterarguments, and hold their ground under pressure. The ones who can do this comfortably at age ten are the ones running meetings at thirty-five.

**3. Refusing to Sit Still = High Drive**
Restlessness isn\'t a malfunction. It\'s a signal that the environment isn\'t keeping up with them. The kids who can\'t sit through boring things are often the ones who, when they find something they love, go after it completely.

**4. Too Many Ideas = Creative Output**
A kid who can\'t stop suggesting things — games, plans, schemes, experiments — is a kid whose brain is running fast. The filtering comes later. The raw volume of ideas is the engine. You want that engine.

**5. Talking Too Much = Communication Confidence**
The kid who never stops talking is, structurally, practicing communication constantly. They\'re learning how to hold a room, how to tell a story, how to keep people engaged. That\'s not nothing. That\'s a skill most people wish they had.

**6. Taking Up Space = Self-Belief**
A kid who walks into a room like they belong there — who takes up space, who introduces themselves, who doesn\'t apologise for existing — has something a lot of adults work very hard to rebuild. Don\'t fix it.

**7. Making Chaos = Risk Tolerance**
The kid who tries things, breaks things, and tries again has a relationship with failure that most adults never develop. They know things go wrong. They do it anyway. That\'s not recklessness. That\'s resilience.

The annoying kid in the room is usually the most interesting person in it. They just need time, direction, and ideally — a wardrobe that matches the energy.`,
  },
  {
    slug: 'how-to-get-what-you-want-without-nagging',
    title: 'How to Get What You Want — Without Nagging (A Guide for Kids)',
    date: '2026-03-27',
    category: 'School Survival',
    excerpt: 'Asking once and getting ignored. Asking again and being told "we\'ll see." There\'s a better way — and it actually works.',
    readingTime: '4 min read',
    relatedProduct: { label: 'Dress like you mean it →', href: '/products' },
    content: `You want something. You\'ve asked. You\'ve been told "maybe." You\'ve asked again. You\'ve been told "we\'ll see." You\'ve asked a third time and now you\'re in trouble for asking too much.

There is a better way.

**1. Make the Case Before You Ask**
Adults respond well to reasoning. Before you ask, think about: why do you want it? Why is now a good time? What\'s your plan if they say no? Walking in with answers to these questions already prepared is more effective than just asking louder.

**2. Pick the Right Moment**
Timing is everything. Asking when someone is stressed, tired, or mid-conversation is setting yourself up to fail. Find a calm moment. After dinner. On a weekend morning. When everyone is in a good mood. The same request lands completely differently depending on when you make it.

**3. Ask Once, Clearly**
Vague requests get vague answers. "Can I maybe possibly get..." is not a request. "I\'d really like X because Y, and here\'s how I\'d make it work" is a request. Be specific. Be calm. Be clear.

**4. Give It Time**
After asking, stop asking. Give it a day or two. Adults often need to think things through without pressure. Following up too quickly makes it feel like nagging and puts them on the defensive. Patient waiting is a power move.

**5. Show You\'re Ready for the Responsibility**
If you want more independence, demonstrate it somewhere else first. If you want something expensive, show you look after your existing things. Adults are much more likely to say yes to someone who\'s already proving they can handle it.

**6. Offer Something in Return**
Not a bribe — a trade. "If you let me do X, I\'ll do Y without being asked." This shows maturity and gives them something to work with. It also usually works.

**7. Accept No Gracefully**
This one is the hardest and the most important. When the answer is no, accepting it calmly — without arguing, sulking, or disappearing dramatically — builds trust faster than almost anything else. The next ask will go better because of how you handled this one.

The secret is that none of this is manipulation. It\'s just communication. The adults in your life are more reasonable than they sometimes seem — they just need the request framed in a way they can work with.`,
  },
  {
    slug: 'greatest-school-pranks-actually-allowed',
    title: '10 School Pranks That Are Actually Allowed',
    date: '2026-03-25',
    category: 'Pranks & Chaos',
    excerpt: 'Want to be legendary at school without getting detention? These pranks are technically within the rules — barely.',
    readingTime: '5 min read',
    relatedProduct: { label: 'Shop the chaos merch →', href: '/products' },
    content: `Want to be the most legendary kid in school without ending up in the headteacher's office? It's a fine line. But it exists. Here are ten pranks that are completely, technically, almost certainly allowed.

**1. The Upside-Down Cup**
Fill a plastic cup with water, slide a piece of card underneath, flip it on someone's desk, then slide the card out. Congratulations — you've created a problem that is completely their fault to solve. You touched nothing.

**2. Autocorrect Chaos**
If someone leaves their phone unlocked, add a custom autocorrect entry so "the" becomes "THE CHAOS BEGINS". Childish? Yes. Against the rules? Surprisingly hard to argue.

**3. The Googly Eye Invasion**
Buy 200 googly eyes. Stick them on everything in the art room over the course of a month. By the end of term, every pencil case, plant, and stapler will appear to be watching. Nobody gets in trouble for making things look more alive.

**4. Sticky Note Mosaic**
Cover a friend's locker entirely in sticky notes forming a giant pixelated image. Takes planning. Takes commitment. Takes approximately 400 sticky notes. Worth it.

**5. The Chair That Moved Slightly**
Move someone's chair back exactly 15 centimetres before they sit down. They'll stand up confused, look around, sit back down. You've done nothing. You're innocent. This is just physics.

**6. Fake Homework Panic**
Walk into class looking absolutely terrified. Whisper to your friend "did you do the homework?" Watch the panic spread across the room. Sit back. There is no homework. There never was.

**7. The Name Switch**
Before class, swap the name tags on everyone's trays, folders, or pegs. Nothing is lost. Everything is slightly wrong. The teacher will spend five minutes confused before laughing.

**8. Silent Disco in the Library**
Get three friends. Enter the library. Start dancing with headphones in. Maintain eye contact with anyone watching. Say nothing. Leave after 90 seconds. You have not broken a single rule.

**9. The Inspirational Poster Remix**
Print a completely normal motivational quote but with one word subtly wrong. Frame it. Donate it to the school. Watch it go up on the wall. Wait.

**10. The Reverse April Fools**
Tell everyone it's April Fools Day on a completely normal Tuesday in November. Watch people spend all day questioning everything. The best prank is the one that requires zero props.

The golden rule: the best prank makes everyone — including the target — laugh in the end. If someone's upset, it wasn't a prank. It was just mean. Chaos should be fun for everyone.`,
  },
  {
    slug: 'survive-most-boring-lesson-ever',
    title: 'How to Survive a Boring Lesson Without Getting Caught',
    date: '2026-03-25',
    category: 'School Survival',
    excerpt: 'It\'s double geography. The clock has stopped. The teacher is reading from a slide. Here\'s how to survive.',
    readingTime: '4 min read',
    relatedProduct: { label: 'Dress like you mean it →', href: '/products' },
    content: `It's 2pm on a Wednesday. The subject is something involving plate tectonics. The projector is slightly blurry. You have forty-five minutes left and the clock appears to have stopped working.

You are in the most boring lesson ever. Here's how to survive.

**Stage 1: Accept the situation**
The first step is to stop fighting it. You are here. The lesson is happening. Resistance only makes time slower. Take a breath. You've survived worse. (Have you? Possibly not. But tell yourself that.)

**Stage 2: Turn it into a game**
Count how many times the teacher says their favourite filler word. "Essentially." "Basically." "So..." Make a tally. Set a personal record. If you get to 20, you've created an unofficial world championship and you're winning it.

**Stage 3: Become a secret observer**
Pretend you're a nature documentary presenter. Observe the classroom. "Here we see the Year 7 in its natural habitat, slowly fossilising. Note the glazed expression, the pen clicking, the quiet desperation." David Attenborough never got bored. You won't either.

**Stage 4: Plan something enormous**
Use the time to plan something genuinely ambitious. A business. A movie. A prank so intricate it requires a three-page flowchart. The boring lesson becomes a creative studio. Nobody can stop your thoughts.

**Stage 5: Master the art of looking interested**
Tilt your head 12 degrees. Maintain eye contact with the board. Nod very slowly every 90 seconds. You can be completely elsewhere in your mind while appearing to be the most engaged student in the room. This is a skill that will serve you for life.

**Stage 6: The doodle spiral**
Start with a small shape in the corner of your page. Add to it. Connect it. Make it grow. By the end of the lesson, you'll have created something that looks like it belongs in an art gallery. Label it with a fake Latin title for extra points.

**Stage 7: Count down cleverly**
Don't watch the clock — that makes it worse. Instead, calculate: at this rate, how many breaths until the bell? How many blinks? Turn time into maths. Maths into a mission. A mission into survival.

The bell will ring. It always does. And when it does, you'll walk out having mastered patience, creativity, and the fine art of appearing present while being entirely somewhere else. These are, genuinely, useful life skills.`,
  },
  {
    slug: '9-types-of-annoying-kids',
    title: 'The 9 Types of Annoying Kids — Which One Are You?',
    date: '2026-03-25',
    category: 'Personality & Identity',
    excerpt: 'From the Chaos Gremlin to the Stealth Operator — every annoying kid has a type. Find yours.',
    readingTime: '5 min read',
    relatedProduct: { label: 'Rep your chaos →', href: '/products' },
    content: `Every classroom, every family, every playground has a cast of characters. Some cause chaos loudly. Some do it quietly. Some do it by accident and some do it as a fully planned operation.

Here are the 9 types of annoying kid. Read carefully. You'll recognise yourself.

**1. The Chaos Gremlin**
Doesn't plan anything. Doesn't need to. Chaos follows them naturally, like a shadow, like a smell, like a perfectly timed loud noise during an important phone call. If something goes wrong in a room, the Chaos Gremlin is probably involved and definitely didn't mean it.

**2. The Stealth Operator**
Appears completely innocent at all times. Gets away with everything. Adults trust them implicitly. Their room is tidy. Their voice is calm. Their mind is running seventeen schemes simultaneously. The most dangerous type.

**3. The Question Machine**
Not trying to be annoying — genuinely curious about everything. "But why?" "What if?" "Has anyone ever tested that?" The teacher has answered four questions this lesson. Three were from the Question Machine. They're not finished.

**4. The Competitive One**
Everything is a competition. Finishing their worksheet. Walking to lunch. Breathing. They don't want to win because winning matters. They want to win because losing, even at something completely pointless, is simply not an option.

**5. The Loud One**
No indoor voice. No concept that an indoor voice is a thing that exists. Volume has one setting: MAXIMUM. Not aggressive — genuinely just enthusiastic about everything at a volume that rattles windows.

**6. The Arguer**
Not doing this to be difficult. Doing this because they are, statistically, often correct and want everyone to know it. Will argue about the rules of a game they've never played before with the confidence of someone who wrote the rulebook. Often right. Always certain.

**7. The One Who Knows Everything**
Different from the Arguer. The Arguer argues. This one simply... informs. "Actually, dolphins sleep with one eye open." "Actually, that film came out two years earlier than everyone thinks." "Actually—" They are aware this is annoying. They continue anyway.

**8. The One Who Asks to Go to the Bathroom at the Worst Possible Moment**
Not strategic. Just has terrible timing. Every single time.

**9. The Loveable Disaster**
Means well. Tries hard. Knocks things over, loses things, forgets things, arrives slightly late for everything. Nobody is ever actually annoyed at them because their heart is so obviously in the right place. The chaos they create is so accidental it becomes endearing.

So — which one are you? Be honest. Most people are a combination of two or three. The rare and powerful ones are all nine at different times of day.`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug);
}
