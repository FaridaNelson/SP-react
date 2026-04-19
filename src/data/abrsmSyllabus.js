// ABRSM_PIECES[examType][grade] = { A: [...], B: [...], C: [...], D?: [...] }
// examType keys: "ABRSM - Practical" | "ABRSM - Performance"
// grade keys: 1–8 (numbers)
// Each piece: { title: string, composer: string }
// TODO: Replace placeholders with official 2025–2026 ABRSM syllabus data

function placeholder(list, grade, count = 3) {
  return Array.from({ length: count }, (_, i) => ({
    title: `${list} List ${list} – Grade ${grade} Piece ${i + 1} (placeholder)`,
    composer: `Composer ${list}${i + 1}`,
  }));
}

const PRACTICAL = {};

// ── Grade 1 (representative repertoire) ──
PRACTICAL[1] = {
  A: [
    { title: "Fireworks Minuet (HWV 351)", composer: "G.F. Handel" },
    { title: "Melody in F (Op. 190, No. 27)", composer: "Louis Köhler" },
    { title: "Muss i denn", composer: "Trad. German" },
  ],
  B: [
    { title: "A Song of Erin", composer: "Thomas Dunhill" },
    { title: "Remember Me", composer: "K.Anderson & R.Lopez" },
    { title: "Winter", composer: "Bernadette Marmion" },
  ],
  C: [
    { title: "Cyberspace Detective", composer: "Amit Anand" },
    { title: "The Wind", composer: "Chee-Hwa Tan" },
    { title: "Berry's Smoothie", composer: "Nikki Yeoh" },
  ],
};

// ── Grade 2 (representative repertoire) ──
PRACTICAL[2] = {
  A: [
    { title: "Sparkling Splashes & Smooth Water", composer: "Barbara Arens" },
    { title: "Moderato (WoO Anh.5)", composer: "Ludwig van Beethoven" },
    { title: "Suite de la rejouissance", composer: "Louis-Claude Daquin" },
  ],
  B: [
    { title: "The Singing Swan", composer: "Alexis Ffrench" },
    { title: "A Little Song", composer: "D.B.Kabalevsky" },
    { title: "Cloudy Day", composer: "Christopher Norton" },
  ],
  C: [
    { title: "Spooky Wood Hollow", composer: "Heather Hammond" },
    { title: "Way Out West", composer: "Pete Letanka" },
    { title: "Sipkova Ruzenka", composer: "Ivana Loudova" },
  ],
};

// ── Grade 3 (representative repertoire) ──
PRACTICAL[3] = {
  A: [
    { title: "Allegro moderato", composer: "Louis Köhler" },
    { title: "Allegro in F", composer: "W.A. Mozart" },
    { title: "Tarantella Twist", composer: "Victoria Proudler" },
  ],
  B: [
    { title: "Where is love?", composer: "Lionel Bart" },
    { title: "Douce amie", composer: "Melanie Bonis" },
    { title: "Always with Me", composer: "Youmi Kimura" },
  ],
  C: [
    { title: "Allegretto", composer: "Bela Bartok" },
    { title: "The Muppet Show Theme", composer: "Jim Henson & Sam Pottle" },
    { title: "The Quiet of the Night", composer: "Shruthi Rajesekar" },
  ],
};

PRACTICAL[4] = {
  A: [
    { title: "Allegro assai", composer: "Georg Benda" },
    { title: "Sonata in G, C. 34", composer: "Domenico Cimarosa" },
    {
      title: "Menuet and Trio from Sonata in C, Hob. XVI:1",
      composer: "Joseph Haydn",
    },
  ],
  B: [
    { title: "Waltz: No.2", composer: "Edward Grieg" },
    { title: "Sunsets in Savannah", composer: "Randal Hartsell" },
    { title: "Cloudscapes", composer: "Ailbhe McDonagh" },
  ],
  C: [
    { title: "Danse du cocher: No.15", composer: "Jacques Ibert" },
    { title: "Wallace and Gromit Theme", composer: "Julian Nott" },
    { title: "Canzonetta", composer: "Raymond Yiu" },
  ],
};
// ── Grades 5–8 (placeholders) ──
for (let g = 5; g <= 8; g++) {
  PRACTICAL[g] = {
    A: placeholder("A", g),
    B: placeholder("B", g),
    C: placeholder("C", g),
  };
}

// ── Performance ──
const PERFORMANCE = {};

for (let g = 1; g <= 8; g++) {
  const A =
    g <= 3 && PRACTICAL[g]
      ? PRACTICAL[g].A.map((p) => ({ ...p }))
      : placeholder("A", g);
  const B =
    g <= 3 && PRACTICAL[g]
      ? PRACTICAL[g].B.map((p) => ({ ...p }))
      : placeholder("B", g);
  const C =
    g <= 3 && PRACTICAL[g]
      ? PRACTICAL[g].C.map((p) => ({ ...p }))
      : placeholder("C", g);

  PERFORMANCE[g] = {
    A,
    B,
    C,
    D: [...A, ...B, ...C],
  };
}

export const ABRSM_PIECES = {
  "ABRSM - Practical": PRACTICAL,
  "ABRSM - Performance": PERFORMANCE,
};
