export type IntensityLevel = 'mild' | 'medium' | 'savage';
export type InsultCategory = 'general' | 'work' | 'dating' | 'fitness' | 'intelligence' | 'appearance';

export const CATEGORIES: InsultCategory[] = ['general', 'work', 'dating', 'fitness', 'intelligence', 'appearance'];

export interface Insult {
  text: string;
  intensity: IntensityLevel;
  category: InsultCategory;
  premium: boolean;
}

export const insults: Insult[] = [
  // GENERAL - MILD
  { text: "You're not completely useless. You can always serve as a bad example.", intensity: 'mild', category: 'general', premium: false },
  { text: "I'd agree with you, but then we'd both be wrong.", intensity: 'mild', category: 'general', premium: false },
  { text: "You're like a cloud. When you disappear, it's a beautiful day.", intensity: 'mild', category: 'general', premium: false },
  { text: "I'm not saying I hate you, but I would unplug your life support to charge my phone.", intensity: 'mild', category: 'general', premium: false },
  { text: "You're proof that even evolution makes mistakes sometimes.", intensity: 'mild', category: 'general', premium: false },
  { text: "If you were any more mediocre, you'd be a participation trophy.", intensity: 'mild', category: 'general', premium: false },
  { text: "You're the human equivalent of a speed bump.", intensity: 'mild', category: 'general', premium: false },
  { text: "I've seen sharper wit on a butter knife.", intensity: 'mild', category: 'general', premium: false },
  { text: "You're not the dumbest person in the world, but you better hope they don't die.", intensity: 'mild', category: 'general', premium: false },
  { text: "Your secrets are always safe with me. I never even listen when you tell me them.", intensity: 'mild', category: 'general', premium: false },

  // GENERAL - MEDIUM
  { text: "You bring everyone so much joy... when you leave.", intensity: 'medium', category: 'general', premium: false },
  { text: "I'm jealous of people who don't know you.", intensity: 'medium', category: 'general', premium: false },
  { text: "You're impossible to underestimate.", intensity: 'medium', category: 'general', premium: false },
  { text: "If I wanted to kill myself, I'd climb your ego and jump to your IQ.", intensity: 'medium', category: 'general', premium: false },
  { text: "You're about as useful as a screen door on a submarine.", intensity: 'medium', category: 'general', premium: false },
  { text: "Somewhere out there, a tree is producing oxygen for you. Go apologize to it.", intensity: 'medium', category: 'general', premium: false },
  { text: "You're like a Monday morning. Nobody likes you.", intensity: 'medium', category: 'general', premium: false },
  { text: "If ignorance is bliss, you must be the happiest person alive.", intensity: 'medium', category: 'general', premium: false },
  { text: "I'd explain it to you, but I left my crayons at home.", intensity: 'medium', category: 'general', premium: false },
  { text: "Your gene pool could use a lifeguard.", intensity: 'medium', category: 'general', premium: false },

  // GENERAL - SAVAGE
  { text: "You're the reason God doesn't talk to us anymore.", intensity: 'savage', category: 'general', premium: true },
  { text: "I hope your day is as pleasant as your personality.", intensity: 'savage', category: 'general', premium: true },
  { text: "You're not just a disappointment to your parents, you're a disappointment to the entire human race.", intensity: 'savage', category: 'general', premium: true },
  { text: "If you were on fire and I had water, I'd drink it.", intensity: 'savage', category: 'general', premium: true },
  { text: "You're the human equivalent of a participation award.", intensity: 'savage', category: 'general', premium: true },
  { text: "I've met some pricks in my time, but you're a cactus.", intensity: 'savage', category: 'general', premium: true },
  { text: "You're like a software update. Every time I see you, I think 'not now.'", intensity: 'savage', category: 'general', premium: true },
  { text: "The last time I saw something like you, I flushed.", intensity: 'savage', category: 'general', premium: true },

  // WORK - MILD
  { text: "Your spreadsheets are as exciting as your personality.", intensity: 'mild', category: 'work', premium: false },
  { text: "You're the reason we have too many meetings.", intensity: 'mild', category: 'work', premium: false },
  { text: "Your emails could cure insomnia.", intensity: 'mild', category: 'work', premium: false },
  { text: "If procrastination was a skill, you'd still be behind.", intensity: 'mild', category: 'work', premium: false },
  { text: "You put the 'pro' in procrastination.", intensity: 'mild', category: 'work', premium: false },
  { text: "Your coffee breaks have breaks.", intensity: 'mild', category: 'work', premium: false },
  { text: "You work hard. At barely working.", intensity: 'mild', category: 'work', premium: false },
  { text: "Your to-do list has a to-do list.", intensity: 'mild', category: 'work', premium: false },

  // WORK - MEDIUM
  { text: "You're living proof that effort doesn't equal results.", intensity: 'medium', category: 'work', premium: false },
  { text: "Your career is like your browser history. Full of questionable decisions.", intensity: 'medium', category: 'work', premium: false },
  { text: "You're the reason they invented the mute button on Zoom.", intensity: 'medium', category: 'work', premium: false },
  { text: "Your resume is creative fiction.", intensity: 'medium', category: 'work', premium: false },
  { text: "Even your imposter syndrome thinks you're faking it.", intensity: 'medium', category: 'work', premium: false },
  { text: "Your workflow is more like a workstop.", intensity: 'medium', category: 'work', premium: false },
  { text: "You're the human equivalent of reply-all.", intensity: 'medium', category: 'work', premium: false },
  { text: "Your contributions are as valuable as a broken printer.", intensity: 'medium', category: 'work', premium: false },

  // WORK - SAVAGE
  { text: "Your boss keeps you around for the tax write-off.", intensity: 'savage', category: 'work', premium: true },
  { text: "LinkedIn rejected your profile for being too depressing.", intensity: 'savage', category: 'work', premium: true },
  { text: "Your productivity is measured in negative numbers.", intensity: 'savage', category: 'work', premium: true },
  { text: "The AI replacing your job is also an underperformer.", intensity: 'savage', category: 'work', premium: true },

  // DATING - MEDIUM
  { text: "Your dating life is like your wifi. No connection.", intensity: 'medium', category: 'dating', premium: true },
  { text: "Your love life is like a software update. Always postponed.", intensity: 'medium', category: 'dating', premium: true },
  { text: "Even Tinder thinks you should give up.", intensity: 'medium', category: 'dating', premium: true },
  { text: "Your relationship status is 'error 404: not found.'", intensity: 'medium', category: 'dating', premium: true },
  { text: "You're the reason people choose their phones over eye contact.", intensity: 'medium', category: 'dating', premium: true },
  { text: "Your flirting skills are on airplane mode.", intensity: 'medium', category: 'dating', premium: true },

  // DATING - SAVAGE
  { text: "Your dating profile is a national tragedy.", intensity: 'savage', category: 'dating', premium: true },
  { text: "Even your imaginary girlfriend friendzoned you.", intensity: 'savage', category: 'dating', premium: true },
  { text: "Your love life is like a desert. Dry and lifeless.", intensity: 'savage', category: 'dating', premium: true },
  { text: "Cupid looked at you and said 'nah.'", intensity: 'savage', category: 'dating', premium: true },

  // FITNESS - MEDIUM
  { text: "Your gym membership is the most unused thing you own.", intensity: 'medium', category: 'fitness', premium: true },
  { text: "You're in shape. Round is a shape.", intensity: 'medium', category: 'fitness', premium: true },
  { text: "Your fitness app thinks you're dead.", intensity: 'medium', category: 'fitness', premium: true },
  { text: "You get winded opening chip bags.", intensity: 'medium', category: 'fitness', premium: true },
  { text: "Your workout routine is scrolling through gym selfies.", intensity: 'medium', category: 'fitness', premium: true },
  { text: "Your step count is a cry for help.", intensity: 'medium', category: 'fitness', premium: true },

  // FITNESS - SAVAGE
  { text: "Your body is a temple. An ancient, crumbling one.", intensity: 'savage', category: 'fitness', premium: true },
  { text: "You're so out of shape, circles are jealous.", intensity: 'savage', category: 'fitness', premium: true },
  { text: "Your BMI is a phone number.", intensity: 'savage', category: 'fitness', premium: true },
  { text: "Even your shadow is trying to lose weight.", intensity: 'savage', category: 'fitness', premium: true },

  // INTELLIGENCE - MEDIUM
  { text: "You're not stupid. You just have bad luck when thinking.", intensity: 'medium', category: 'intelligence', premium: true },
  { text: "If brains were dynamite, you couldn't blow your nose.", intensity: 'medium', category: 'intelligence', premium: true },
  { text: "You're like a book. Closed and collecting dust.", intensity: 'medium', category: 'intelligence', premium: true },
  { text: "Your thoughts are like WiFi. Weak and constantly buffering.", intensity: 'medium', category: 'intelligence', premium: true },
  { text: "You're not the sharpest tool in the shed. You're the whole hardware store.", intensity: 'medium', category: 'intelligence', premium: true },
  { text: "Your IQ and shoe size are having a competition.", intensity: 'medium', category: 'intelligence', premium: true },

  // INTELLIGENCE - SAVAGE
  { text: "You're living proof that brain cells don't regenerate.", intensity: 'savage', category: 'intelligence', premium: true },
  { text: "If you had another brain cell, it would die of loneliness.", intensity: 'savage', category: 'intelligence', premium: true },
  { text: "You're proof that even automatic doors can't read everyone.", intensity: 'savage', category: 'intelligence', premium: true },
  { text: "A room temperature IQ. In Celsius.", intensity: 'savage', category: 'intelligence', premium: true },

  // APPEARANCE - MEDIUM
  { text: "You're not ugly. You're just aesthetically challenged.", intensity: 'medium', category: 'appearance', premium: true },
  { text: "Your face is like abstract art. Interesting, but confusing.", intensity: 'medium', category: 'appearance', premium: true },
  { text: "You're photogenic. As in, you should stay in photos.", intensity: 'medium', category: 'appearance', premium: true },
  { text: "Your fashion sense is stuck in the 'before' photo.", intensity: 'medium', category: 'appearance', premium: true },
  { text: "Mirror mirror on the wall... yeah, sorry.", intensity: 'medium', category: 'appearance', premium: true },
  { text: "You put the 'no' in makeover.", intensity: 'medium', category: 'appearance', premium: true },

  // APPEARANCE - SAVAGE
  { text: "Your face could make an onion cry.", intensity: 'savage', category: 'appearance', premium: true },
  { text: "You're not ugly, you're just... optimistically challenged.", intensity: 'savage', category: 'appearance', premium: true },
  { text: "Your beauty is on the inside. Way, way inside.", intensity: 'savage', category: 'appearance', premium: true },
  { text: "You're proof that God has a sense of humor.", intensity: 'savage', category: 'appearance', premium: true },
];

export function getRandomInsult(
  intensity: IntensityLevel,
  categories: InsultCategory[],
  isPremium: boolean
): Insult | null {
  const filtered = insults.filter(insult => {
    if (!categories.includes(insult.category)) return false;
    if (insult.premium && !isPremium) return false;
    if (intensity === 'mild' && insult.intensity !== 'mild') return false;
    if (intensity === 'medium' && insult.intensity === 'savage') return false;
    return true;
  });

  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}
