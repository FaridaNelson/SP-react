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
    { title: "Minuet in G", composer: "J.S. Bach" },
    { title: "Allegretto in C", composer: "Diabelli" },
    { title: "Ecossaise in G", composer: "Beethoven" },
  ],
  B: [
    { title: "Lullaby", composer: "Brahms" },
    { title: "Andante in C", composer: "Gurlitt" },
    { title: "Morning Prayer", composer: "Gurlitt" },
  ],
  C: [
    { title: "The Entertainer (simplified)", composer: "Joplin" },
    { title: "Coconut Rag", composer: "Norton" },
    { title: "Sailing Boat", composer: "Bullard" },
  ],
};

// ── Grade 2 (representative repertoire) ──
PRACTICAL[2] = {
  A: [
    { title: "March in D", composer: "J.S. Bach" },
    { title: "Minuet in F", composer: "Mozart" },
    { title: "Ecossaise in E-flat", composer: "Beethoven" },
  ],
  B: [
    { title: "The Wild Rider", composer: "Schumann" },
    { title: "Melody", composer: "Schumann" },
    { title: "Arietta", composer: "Grieg" },
  ],
  C: [
    { title: "Calypso Time", composer: "Wedgwood" },
    { title: "Jazz Waltz", composer: "Norton" },
    { title: "Cool Cat", composer: "Cornick" },
  ],
};

// ── Grade 3 (representative repertoire) ──
PRACTICAL[3] = {
  A: [
    { title: "Sonatina in C, 1st movt", composer: "Clementi" },
    { title: "Musette in D", composer: "J.S. Bach" },
    { title: "Sonatina in G, 1st movt", composer: "Beethoven" },
  ],
  B: [
    { title: "Soldier's March", composer: "Schumann" },
    { title: "Waltz in A minor", composer: "Grieg" },
    { title: "Little Prelude in C minor", composer: "J.S. Bach" },
  ],
  C: [
    { title: "Boogie Woogie", composer: "Norton" },
    { title: "Stamping Dance", composer: "Kabalevsky" },
    { title: "Cat Walk", composer: "Cornick" },
  ],
};

// ── Grades 4–8 (placeholders) ──
for (let g = 4; g <= 8; g++) {
  PRACTICAL[g] = {
    A: placeholder("A", g),
    B: placeholder("B", g),
    C: placeholder("C", g),
  };
}

// ── Performance ──
const PERFORMANCE = {};

for (let g = 1; g <= 8; g++) {
  const A = g <= 3 && PRACTICAL[g]
    ? PRACTICAL[g].A.map((p) => ({ ...p }))
    : placeholder("A", g);
  const B = g <= 3 && PRACTICAL[g]
    ? PRACTICAL[g].B.map((p) => ({ ...p }))
    : placeholder("B", g);
  const C = g <= 3 && PRACTICAL[g]
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
