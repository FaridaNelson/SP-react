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
    {
      title: "Fireworks Minuet (HWV 351)",
      composer: "G.F. Handel",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Melody in F (Op. 190, No. 27)",
      composer: "Louis Köhler",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Muss i denn",
      composer: "Traditional German",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Sonatina primo part",
      composer: "Dennis Alexander",
      publication:
        "Dennis Alexander: Alfred's Basic Piano Library, Duet Book 2 (Alfred Music)",
    },
    {
      title: "Choral 'Deal with Me, Lord', BWV 514 ",
      composer: "attributed to J.S.Bach",
      publication: "My First Bach (Schott)",
    },
    {
      title: "Climbing High",
      composer: "Allan Bullard",
      publication: "Pauline Hall: Piano Time Pieces 2 (OUP)",
    },
    {
      title:
        "The Chase/The Hunt (No. 15 from First Lessons for the Piano, Op. 117)",
      composer: "Gurlitt",
      publication:
        "Music Pathways: Repertoire, Level 3B (Carl Fischer) or Classics to Moderns, Book 1 (Yorktown Music Press) or Studio 21 (1st Series), Vol. 1 (Universal)",
    },
    {
      title: "Gavotte in C ornaments optional",
      composer: "G.F. Handel",
      publication:
        "My First Concert for Piano (Schott) or Classics to Moderns, Book 1 (Yorktown Music Press) or Studio 21 (1st Series), Vol. 1 (Universal)",
    },
    {
      title: "Haymaking (from The Greenwood Tree)",
      composer: "M.I. Helyer",
      publication: "M.Helyer: The Greenwood Tree (Stainer & Bell)",
    },
    {
      title: "Gavotte in C (No. 3 from 24 Progressive Lessons, Op. 81)",
      composer: "G.F. Handel",
      publication:
        "My First Concert for Piano (Schott) or Classics to Moderns, Book 1 (Yorktown Music Press) or Studio 21 (1st Series), Vol. 1 (Universal)",
    },
    {
      title: "Minuet in F (No. 6 from Nannerl-Notenbuch)",
      composer: "L.Mozart",
      publication: " L.Mozart: Notebook for Nannerl (Schott)",
    },
    {
      title: "Allegro (No. 8 from 12 Duos, K. 487), arr. Blackwell",
      composer: "W.A. Mozart",
      publication: "Piano Star: Grade 1 (ABRSM)",
    },
    {
      title: "Minuet in A minor, Z. 649",
      composer: "Henry Purcell",
      publication: "Music Through Time: Piano Book 1 (OUP)",
    },
    {
      title: "Comical Cat (from Copycat Copycat)",
      composer: "Teresa Richert",
      publication: "Teresa Richert: Copycat Copycat (Richert Music)",
    },
    {
      title: "Arioso in F (No. 1 from 12 Handstücke)",
      composer: "Türk",
      publication:
        "Clavierstücke für Anfänger (Schott) or Music Pathways: Repertoire, Level 3A (Carl Fischer) or Pianissimo: Piano Piccolo (Schott)",
    },
    {
      title: "Courante primo part",
      composer: "Elisie Wells",
      publication: "Mixed Doubles: Piano Time Duets, Book 2 (OUP)",
    },
  ],
  B: [
    {
      title: "A Song of Erin (No. 8 from First Year Pieces)",
      composer: "Thomas Dunhill",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Remember Me (from Coco), arr. L'Estrange",
      composer: "K.Anderson & R.Lopez",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Winter (from Allsorts)",
      composer: "Bernadette Marmion",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Reflections (from Just for You and Me, Book 1)",
      composer: "Dennis Alexander",
      publication: "Dennis Alexander: Just for You and Me, Book 1 (Alfred)",
    },
    {
      title: "The Trees are Heavy with Snow",
      composer: "Alwyn",
      publication: "Five by Ten, Grade 1 (Lengnick)",
    },
    {
      title: "Friday (from Seven Days a Week)",
      composer: "R. R. Bennett",
      publication:
        "R. R. Bennett: Seven Days a Week (Alfred) or The Young Pianist's Repertoire, Book 1 (Faber)",
    },
    {
      title: "The Little White Cloud",
      composer: "Jessie Blake",
      publication: "Grade by Grade, Piano Grade 1 (Boosey & Hawkes)",
    },
    {
      title: "Fairy Tale (No. 1 from Children's Album, Op. 98)",
      composer: "Grechaninov",
      publication:
        "ABRSM or More Romantic Pieces for Piano, Book 1 (ABRSM) or My First Concert for Piano (Schott)",
    },
    {
      title: "Fountain(from Little Stories)",
      composer: "Agnieszka Lasko",
      publication: "Agnieszka Lasko: Little Stories (Euterpe)",
    },
    {
      title: "Imagine (from Imagine), arr. Önaç",
      composer: "John Lennon",
      publication: "Pop Performer, Grades Initial-3 (ABRSM)",
    },
    {
      title: "The Forgotten Forest secondo part",
      composer: "Helen Madden",
      publication: "Piano Star: Grade 1 (ABRSM)",
    },
    {
      title: "Beauty and the Beast (from Beauty and the Beast), arr. Hussey",
      composer: "Alan Menken",
      publication: "Gradebusters Grade 1 Piano (Hal Leonard)",
    },
    {
      title: "Silver Lining (from Piano Grades Are Go! Initial-Grade 1)",
      composer: "Victoria Proudler",
      publication:
        "Victoria Proudler: Piano Grades Are Go! Initial-Grade 1 (EVC)",
    },
    {
      title: "Song of the Dark Woods",
      composer: "Siegmeister",
      publication: "Music Pathways: Repertoire, Level 3B (Carl Fischer)",
    },
    {
      title: "Song without Words",
      composer: "Spindler",
      publication: "Easy Concert Pieces for Piano, Vol. 1 (Schott)",
    },
    {
      title: "Small Valse with repeat",
      composer: "Borislava Taneva",
      publication: "Mosaic, Vol. 2 (Editions Musica Ferrum)",
    },
  ],
  C: [
    {
      title: "Cyberspace Detective",
      composer: "Amit Anand",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "The Wind",
      composer: "Chee-Hwa Tan",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Berry's Smoothie",
      composer: "Nikki Yeoh",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Let It Go (from Frozen), arr. Thomson",
      composer: "Kristen AndersonLopez & Robert Lopez",
      publication: "Pop Performer, Grades Initial-3 (ABRSM)",
    },
    {
      title: "Can't Stop the Feeling!",
      composer: "Justin Timberlake, Max Martin & Shellback",
      publication: "Pop Performer, Grades Initial-3 (ABRSM)",
    },
    {
      title: "Can't Stop the Feeling!",
      composer: "Justin Timberlake, Max Martin & Shellback",
      publication: "Pop Performer, Grades Initial-3 (ABRSM)",
    },
    {
      title: "Sunlight Through the Trees",
      composer: "June Armstrong",
      publication: "Piano Star: Grade 1 (ABRSM)",
    },
    {
      title: "Cheesecake-Walk (from Get It Together!)",
      composer: "Carol Barratt",
      publication: "Carol Barratt: Get It Together! (Chester)",
    },
    {
      title: "The Frog (from The Gift of Music)",
      composer: "Elias Davidsson",
      publication: "{Elias Davidsson: The Gift of Music (Clifton Edition)}",
    },

    {
      title: "Swinging Beat",
      composer: "Gillock",
      publication: "Gillock: Swinging Beat (Willis)",
    },
    {
      title: "Dotty's Nightmare (from All Cooped Up Halloween)",
      composer: "Diane Hidy",
      publication: "Diane Hidy: All Cooped Up Halloween (ComposeCreate.com)",
    },
    {
      title: "Woodland Folk Song primo part",
      composer: "Alison Mathews",
      publication: "Piano Star Duets (ABRSM)",
    },

    {
      title: "Tu tu Gbovi, arr. Chapman Nyaho primo part",
      composer: "Traditional Ewe (Ghanaian)",
      publication: "Piano Star Duets (ABRSM)",
    },
    {
      title: "Latin Laughter primo part; play the 6ths in bb. 10 & 28",
      composer: "Jane Sebba",
      publication: "Piano Magic Duets, Book 2 (Collins Music)",
    },
    {
      title: "Jazzy Dragon (from Animal Jazz)",
      composer: "Barbara Snow",
      publication: ":Barbara Snow: Animal Jazz (Edition HH)",
    },
    {
      title: "At the Seaside (from A Child's Garden of Verses)",
      composer: "Chee-Hwa Tan",
      publication: "Chee-Hwa Tan: A Child's Garden of Verses (Piano Safari)}",
    },
    {
      title: "Mango Walk, arr. Cornick",
      composer: "Trad. Jamaican",
      publication: "Piano Repertoire, Level 1 (Universal)",
    },
  ],
};

// ── Grade 2 (representative repertoire) ──
PRACTICAL[2] = {
  A: [
    {
      title: "Sparkling Splashes & Smooth Water",
      composer: "Barbara Arens",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Moderato (WoO Anh.5)",
      composer: "Ludwig van Beethoven",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Suite de la rejouissance",
      composer: "Louis-Claude Daquin",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Corranto (from Fitzwilliam Virginal Book)",
      composer: "Annonimous",
      publication: "Grade by Grade, Piano Grade 2 (Boosey & Hawkes)",
    },
    {
      title:
        "Dance (No. 7 from Progressive Duets for Pianists, Book 1) primo part",
      composer: "Carse Rustic",
      publication:
        "Carse: Progressive Duets for Pianists, Book 1 (Stainer & Bell)",
    },
    {
      title: "Étude in A minor, Op. 36 No. 13",
      composer: "Goedicke",
      publication: "Piano Time Pieces 3 (OUP)",
    },
    {
      title: "Allegro in C, arr. Hall",
      composer: "Türk",
      publication: "Piano Time Pieces 3 (OUP)",
    },
    {
      title: "Rondino (Theme from Cello Concerto in D), arr. Agay primo part",
      composer: "Haydn",
      publication: "The Joy of Piano Duets (Yorktown Music Press)",
    },
    {
      title: "Galop/Hopping (No. 18 from 24 Little Pieces, Op. 39)",
      composer: "Kabalevsky",
      publication:
        "Kabalevsky: 24 Little Pieces, Op. 39 (Boosey & Hawkes) or More Romantic Pieces for Piano, Book 1 (ABRSM)",
    },
    {
      title: "Bourlesq (from The Wolfgang Notebook) with first repeat",
      composer: "attributed L. Mozart",
      publication:
        "L. Mozart: Notenbuch für Wolfgang (Schott) or The Young Pianist's Repertoire, Book 1 (Faber)",
    },

    {
      title: "Minuet in D, K. 7",
      composer: "Mozart",
      publication: "My First Mozart (Schott)",
    },
    {
      title: "Kowalczyki (Apprentice Smiths) (from Easy Pieces)",
      composer: "Prószyński",
      publication: "Prószyński: Easy Pieces for Piano (PWM)",
    },
    {
      title: "Air in D minor, Z. T676",
      composer: "Purcell",
      publication:
        "Pianissimo: Piano Piccolo (Schott) or Piano Repertoire, Level 1 (Universal) or Piano Lessons, Book 1 (Faber)",
    },
    {
      title:
        "Rondo (from Quartet for Harpischord and Strings), arr. Talbot-Howard",
      composer: "Chevalier de Saint-Georges",
      publication:
        "Chevalier de Saint-Georges: Rondo from the Quartet for Harpsichord and Strings (ABRSM)",
    },
    {
      title: "Gavotte",
      composer: "Telemann",
      publication: "Piano Progress, Book 1 (Faber)",
    },
    {
      title: "Haggis Hunt (from Celtic Piano Music - Initial to Grade 2)",
      composer: "Donald Thomson",
      composer: "Donald Thomson: Celtic Piano Music - Initial to Grade 2 (EVC)",
    },
  ],
  B: [
    {
      title: "The Singing Swan",
      composer: "Alexis Ffrench",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "A Little Song",
      composer: "D.B.Kabalevsky",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Cloudy Day",
      composer: "Christopher Norton",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },

    {
      title: "Sorrow (No. 7 from For Children, Vol. 2)",
      composer: "Bartók",
      publication:
        "Bartók: For Children, Vol. 2 (Boosey & Hawkes) or Grade by Grade, Piano Grade 2 (Boosey & Hawkes)",
    },
    {
      title: "Make You Feel My Love, arr. Baker",
      composer: "Bob Dylan",
      publication: "Pop Performer, Grades Initial-3 (ABRSM)",
    },
    {
      title: "The Joker and the Queen, arr. Önaç",
      composer:
        "Ed Sheeran, Samuel Roman, Johnny McDaid, Taylor Swift & Fred Gibson",
      publication: "Pop Performer, Grades Initial-3 (ABRSM)",
    },
    {
      title: "Soufiane (from Mekta' in the Art of Kita', Book 2)",
      composer: "El-Dabh",
      publication:
        "Piano Music of Africa and the African Diaspora, Vol. 1 (OUP)",
    },
    {
      title: "Farewell (No. 4 from Children's Album, Op. 98)",
      composer: "Grechaninov",
      publication:
        "Grechaninov: Children's Book, Op. 98 (ABRSM) or A Romantic Sketchbook for Piano, Book 1 (ABRSM) or Pianissimo: Piano Piccolo (Schott)",
    },
    {
      title: "Raindrop Reflections primo part",
      composer: "Heather Hammond",
      publication: "Piano Star Duets (ABRSM)",
    },
    {
      title:
        "Pavane de la belle au bois dormant (No. 1 fromn Ma mère l'oye)-secondo part",
      composer: "Ravel",
      publication: "Ravel: Ma mère l'oye (Durand)",
    },
    {
      title: "Waltz in A minor",
      composer: "Spindler",
      publication: "Pathways to Artistry: Masterworks, Book 3 (Alfred)",
    },

    {
      title: "Adagio in A minor (from Sonatina in C)",
      composer: "Steibelt",
      publication:
        "A Keyboard Anthology, 2nd Series, Book 1 (ABRSM) or Core Classics, Grades 1-2 (ABRSM) or Pianoworks Collection 2 (OUP) or Pianissimo: Piano Piccolo (Schott) or My First Concert for Piano (Schott)",
    },
    {
      title: "The Moon (from A Child's Garden of Verses)",
      composer: "Chee-Hwa Tan",
      publication: "Chee-Hwa Tan: A Child's Garden of Verses (Piano Safari)",
    },
    {
      title: "Waltz (from The Sleeping Beauty), arr. J. & A. Bullard",
      composer: "Tchaikovsky",
      publication: "Pianoworks, Collection 1 (OUP)",
    },
    {
      title: "Postcard from Paris (from Razzamajazz Repertoire Piano)",
      composer: "Sarah Watts",
      publication: "Sarah Watts: Razzamajazz Repertoire Piano (Kevin Mayhew)",
    },
    {
      title:
        "Hedwig's Theme (from Harry Potter and the Sorcerer's/Philosopher's Stone), arr. Harris",
      composer: "John Williams",
      publication: "The Essential Film Collection - Piano Solo (Faber)",
    },
  ],
  C: [
    {
      title: "Spooky Wood Hollow",
      composer: "Heather Hammond",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Way Out West",
      composer: "Pete Letanka",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Sipkova Ruzenka",
      composer: "Ivana Loudova",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },

    {
      title: "In My Spot",
      composer: "Ben Crosland",
      publication: "Mosaic, Vol. 2 (Editions Musica Ferrum)",
    },
    {
      title: "Dinosaur, Don't!",
      composer: "Sarah Konecsni",
      publication: "Mosaic, Vol. 2 (Editions Musica Ferrum)",
    },
    {
      title: "The Snow Prelude No. 3 this edition only",
      composer: "Ludovico Einaudi",
      publication:
        "Ludovico Einaudi: Graded Pieces for Piano, Preparatory to Grade 2 (Chester)",
    },
    {
      title:
        "Brigands' Dance (from Let's Play a Piano Duet, Op. 37) primo part",
      composer: "Garścia",
      publication: "Garścia: Let's Play a Piano Duet, Op. 37 Vol. 2 (PWM)",
    },
    {
      title: "Kukułka I",
      composer: "Mirosław Gąsieniec",
      publication: "Mirosław Gąsieniec: Album for Children (PWM)",
    },
    {
      title: "Norwegian Dance No. 2, arr. Hall primo part",
      composer: "Grieg",
      publication: "Mixed Doubles: Piano Time Duets, Book 2 (OUP)",
    },
    {
      title: "The Cheshire Cat (from Piano Tales for Alice)",
      composer: "Nikki Iles",
      publication: "Nikki Iles: Piano Tales for Alice (EVC)",
    },
    {
      title: "Sweet Pea primo part",
      composer: "Nikki Iles",
      publication: "Piano Star Duets (ABRSM)",
    },
    {
      title: "My Girl, arr. Iles",
      composer: "Smokey Robinson & Ronald White",
      publication: "Pop Performer, Grades Initial-3 (ABRSM)",
    },
    {
      title: "Singing Sun (No. 6 from A Little Book of Hours)",
      composer: "Sculthorpe",
      publication: "Sculthorpe: A Little Book of Hours (Faber)",
    },
    {
      title: "Tango II (Habanera) (from Leichte Tänze I)",
      composer: "Seiber",
      publication: "Seiber: Leichte Tänze (Easy Dances), Book 1 (Schott)",
    },
    {
      title: "Whistling Tune",
      composer: "Giles Swayne",
      publication: "Spectrum 4 (ABRSM)",
    },
    {
      title: "Champagne Rag (No. 11 from Easy Jazzin' About Piano)",
      composer: "Pam Wedgwood",
      publication: "Pam Wedgwood: Easy Jazzin' About for Piano (Faber)",
    },
  ],
};

// ── Grade 3 (representative repertoire) ──
PRACTICAL[3] = {
  A: [
    {
      title: "Allegro moderato",
      composer: "Louis Köhler",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Allegro in F",
      composer: "W.A. Mozart",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Tarantella Twist",
      composer: "Victoria Proudler",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },

    {
      title: "Allegro moderato (No. 3 from Fem smärretonbilder, Op. 7)",
      composer: "Andrée",
      publication: "Women Composers, Book 1 (Schott)",
    },
    {
      title: "Shadows (from Night Time Impressions)",
      composer: "Sarah Baker",
      publication: "Sarah Baker: Night Time Impressions (Forsyth)",
    },
    {
      title: "2nd movt (from Sonatina in C)",
      composer: "Haslinger",
      publication:
        "P. 4 from Giraffe Piano, Book 1 (EMB Zeneműkiadó) or P. 25 from Easy Concert Pieces for Piano, Vol. 3 (Schott)",
    },
    {
      title: "Hornpipe Rondo primo part",
      composer: "A. Hedges",
      publication: "A. Hedges: Hornpipe Rondo for Piano Duet (Roberton)",
    },
    {
      title: "Toccata, arr. Hall",
      composer: "I. Holst",
      publication: "Piano Time Pieces 3 (OUP)",
    },
    {
      title: "Angloise (from Notebook for Wolfgang)",
      composer: "L. Mozart",
      publication:
        "L. Mozart: Notenbuch für Wolfgang (Schott) or The Young Pianist's Repertoire, Book 1 (Faber)",
    },
    {
      title: "Allegro in B♭, K. 3",
      composer: "Mozart",
      publication:
        "Mozart: 25 Early Pieces (ABRSM) or Essential Keyboard Repertoire, Vol. 6 (Alfred)",
    },
    {
      title: "Moody Gigue (from Piano Sketches, Book 1)",
      composer: "Vitalij Neugasimov",
      publication: "Vitalij Neugasimov: Piano Sketches, Book 1 (OUP)",
    },
    {
      title:
        "Gavotte (from Classical Symphony, Op. 25), arr. Agay primo part; with repeat - playing little note",
      composer: "Prokofiev",
      publication: "The Joy of Piano Duets (Yorktown Music Press)",
    },
    {
      title: "Vivace (4th movt from Sonatina in A minor, Op. 136 No. 4)",
      composer: "Reinecke",
      publication:
        "Reinecke: Six Miniature Sonatinas, Op. 136 (Breitkopf & Härtel) or Sonatinas for Piano, Book 1 (PWM)",
    },
    {
      title:
        "Wilder Reiter (The Wild Horseman) (No. 8 from Album für die Jugend, Op. 68)",
      composer: "Schumann",
      publication:
        "Schumann: Album für die Jugend, Op. 68 (ABRSM) or A Romantic Sketchbook for Piano, Book 1 (ABRSM) or Piano Literature for a Dark and Stormy Night, Vol. 1 (Faber Piano Adventures)",
    },
    {
      title: "Jazz Etudiette (from Easy Dances II)",
      composer: "Seiber",
      publication: "The Young Pianist's Repertoire, Book 1 (Faber)",
    },
    {
      title: "Scherzo",
      composer: "Weber",
      publication:
        "The Classical Spirit, Book 1 (Alfred) or Pathways to Artistry: Masterworks, Book 3 (Alfred)",
    },
  ],
  B: [
    {
      title: "Where is love?",
      composer: "Lionel Bart",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Douce amie",
      composer: "Melanie Bonis",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Always with Me",
      composer: "Youmi Kimura",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },

    {
      title: "Autumn Serenade primo part",
      composer: "Dennis Alexander",
      publication:
        "Dennis Alexander: Alfred's Basic Piano Library, Duet Book 4 (Alfred)",
    },
    {
      title: "Arioso, arr. Agay primo part",
      composer: "J. S. Bach",
      publication: "The Joy of Piano Duets (Yorktown Music Press)",
    },
    {
      title: "Andante (No. 2 from For Children, Vol. 2)",
      composer: "Bartók",
      publication: "Bartók: For Children, Vol. 2 (Boosey & Hawkes)",
    },
    {
      title: "Thames Sunrise",
      composer: "Janet & Alan Bullard",
      publication: "Janet & Alan Bullard: Pianoworks: Popular Styles (OUP)",
    },
    {
      title: "Spraymist (No. 3 from In Southern Seas)",
      composer: "W. Carroll",
      publication: "W. Carroll: In Southern Seas (Forsyth)",
    },
    {
      title: "Song, Op. 172 No. 1",
      composer: "Gurlitt",
      publication: "More Romantic Pieces for Piano, Book 2 (ABRSM)",
    },
    {
      title: "Indigo (No. 6 from Rainbow)",
      composer: "Paul Harris",
      publication: "Paul Harris: Rainbow (Boosey & Hawkes)",
    },
    {
      title: "Melodie (No. 5 from Skizzen, Op. 77)",
      composer: "H. Hofmann",
      publication: "H. Hofmann: 17 Miscellaneous Pieces (ABRSM)",
    },
    {
      title: "Romance",
      composer: "Mendelssohn",
      publication: "Studio 21 (1st Series), Vol. 1 (Universal)",
    },
    {
      title: "Both Sides Now, arr. White",
      composer: "Joni Mitchell",
      publication: "Pop Performer, Grades Initial-3 (ABRSM)",
    },
    {
      title: "Chanson italienne (No. 15 from Album pour enfants, Op. 39)",
      composer: "Tchaikovsky",
      publication: "Tchaikovsky: Album for the Young, Op. 39 (ABRSM)",
    },
    {
      title: "She Moved Through the Fair, arr. Hall",
      composer: "Traditional Irish",
      publication: "Eighteen Easy Escapes for Piano (Clifton Edition)",
    },
    {
      title: "Sakura, arr. Goto",
      composer: "Traditional Japanese",
      publication: "Japanese Folk Songs Collection (Hal Leonard)",
    },
  ],
  C: [
    {
      title: "Allegretto",
      composer: "Bela Bartok",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "The Muppet Show Theme",
      composer: "Jim Henson & Sam Pottle",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "The Quiet of the Night",
      composer: "Shruthi Rajesekar",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },

    {
      title: "Little Rhapsody on Hungarian Themes primo part",
      composer: "Agay",
      publication: "The Joy of Piano Duets (Yorktown Music Press)",
    },
    {
      title: "Rushing River",
      composer: "M. Bober & G. Goranson",
      publication:
        "Melody Bober & Glori Goranson: Rushing River (FJH Music Company Inc)",
    },
    {
      title: "Ella Scats the Little Lamb (No. 1 from Portraits in Jazz)",
      composer: "Valerie Capers",
      publication:
        "Valerie Capers: Portraits in Jazz (OUP) Carse Csardas primo part Carse: Progressive Duets for Pianists, Book 2 (Stainer & Bell)",
    },
    {
      title: "The Waltz of the Elephants (from Clever Cat Goes on Safari)",
      composer: "Mike Cornick",
      publication: "Mike Cornick: Clever Cat Goes on Safari (Universal)",
    },
    {
      title: "Locked On Latin (from Hands On Jazz) primo part",
      composer: "Mark Goddard",
      publication: "Mark Goddard: Hands On Jazz (Clifton Edition)",
    },
    {
      title: "Waldvöglein (No. 15 from Skizzen, Op. 77)",
      composer: "H. Hofmann",
      publication: "Encore, Book 2 (ABRSM)",
    },
    {
      title:
        "Can You Feel the Love Tonight? (from The Lion King), arr. N. & R. Faber octaves optional",
      composer: "Elton John & Tim Rice",
      publication:
        "Faber Studio Collection: Selections from BigTime Piano, Level 4 (Faber Piano Adventures)",
    },
    {
      title: "Moon River (from Breakfast at Tiffany's) arr. Miller",
      composer: "H. Mancini & J. Mercer",
      publication: "A Dozen a Day Songbook, Book 2 (Willis)",
    },
    {
      title: "No Time to Die, arr. Önaç",
      composer: "Billie Eilish & Finneas O'Connell",
      publication: "Pop Performer, Grades Initial-3 (ABRSM)",
    },
    {
      title: "I'll Take Les, arr. Iles",
      composer: "John Scofield",
      publication: "Nikki Iles & Friends, Easy to Intermediate (ABRSM)",
    },
    {
      title: "Northern Lights",
      composer: "Karen Tanaka",
      publication: "Spectrum 4 (ABRSM)",
    },
    {
      title: "Groovin’ Grasshopper (from Adventures and Accolades)",
      composer: "James Welburn ",
      publication:
        "James Welburn: Adventures and Accolades (Editions Musica Ferrum)",
    },
  ],
};

PRACTICAL[4] = {
  A: [
    {
      title: "Allegro assai",
      composer: "Georg Benda",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Sonata in G, C. 34",
      composer: "Domenico Cimarosa",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Menuet and Trio from Sonata in C, Hob. XVI:1",
      composer: "Joseph Haydn",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title:
        "(3rd movt from Suite No. 2 in B-) with ornaments in bb. 7, 23 & 31; all others optional",
      composer: "Alcock Gavot",
      publication:
        "Alcock: Six Suites of Easy lessons (ABRSM) or The Best of Grade 4 Piano (Faber) publication",
    },
    {
      title: "Allegro assai (1st movt from Sonatina in F, Anh. 5 No. 2)",
      composer: "Beethoven",
      publication: "The New Sonatina Book, Vol. 1 (Schott)",
    },
    {
      title: "Allegro (1st movt from Sonatina in C, Op. 3 No. 7)",
      composer: "G. Berg",
      publication: "G. Berg: Twelve Sonatinas, Op. 3, Vol. 2 (Edition HH)",
    },
    {
      title: "Ballade, Op. 100 No. 15",
      composer: "J. F. F. Burgmüller",
      publication:
        "Encore, Book 2 (ABRSM) or Lang Lang Piano Academy: Mastering the Piano, Level 4 (Faber)",
    },
    {
      title: "Saraband (from Suite in E minor, BuxWV 236)",
      composer: "Buxtehude",
      publication: "Baroque Keyboard Anthology, Vol. 1 (Schott)",
    },
    {
      title: "Scherzando (from 12 Pieces in the Form of Studies)",
      composer: "Dring",
      publication: "Dring: 12 Pieces in the Form of Studies (Weinberger)",
    },
    {
      title: "Grazioso (from Sonata No. 2)",
      composer: "Gambarini",
      publication: "HerStory: The Piano Collection (Faber)",
    },
    {
      title:
        "Allegretto scherzando (3rd movt from Sonatina in C, Op. 188 No. 4)",
      composer: "Gurlitt",
      publication: "No. 13 from Sonatinas for Piano, Book 1 (PWM)",
    },
    {
      title: "Allegro scherzando in F",
      composer: "Haydn",
      publication: "Essential Keyboard Repertoire, Vol. 6 (Alfred)",
    },
    {
      title: "Study in A minor, Op. 45 No. 2",
      composer: "S. Heller",
      publication:
        "S. Heller: 20 Miscellaneous Studies (ABRSM) or pp. 7-9 from Piano Literature for a Dark and Stormy Night, Vol. 1 (Faber Piano Adventures)",
    },
    {
      title: "A Town with an Ocean View (from Kiki’s Delivery Service)",
      composer: "Joe Hisaishi",
      publication: "Studio Ghibli Best Hits – Intermediate Level (Yamaha)",
    },
    {
      title: "Sledging Party (from Kinderfreund, Op. 243) with first repeat",
      composer: "L. Köhler",
      publication: "Splash! (Breitkopf & Härtel)",
    },
    {
      title: "Rondo in F, K. 15hh",
      composer: "Mozart",
      publication:
        "Core Classics, Grades 3-4 (ABRSM) or Mozart: 25 Early Pieces (ABRSM) or The Best of Grade 4 Piano (Faber)",
    },
  ],
  B: [
    {
      title: "Waltz: No.2",
      composer: "Edward Grieg",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Sunsets in Savannah",
      composer: "Randal Hartsell",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Cloudscapes",
      composer: "Ailbhe McDonagh",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },

    {
      title: "Easy on Me, arr. Dunlop",
      composer: "Adele Adkins & Greg Kurstin",
      publication: "Pop Performer, Grades 4-5 (ABRSM)",
    },

    {
      title: "All of Me, arr. Harnett",
      composer: "John Stephens & Toby Gad",
      publication: "Pop Performer, Grades 4-5 (ABRSM)",
    },
    {
      title: "Andante (arr.) Lang Lang",
      composer: "C. P. E. Bach",
      publication: "Piano Academy: Mastering the Piano, Level 4 (Faber)",
    },
    {
      title: "Sunrise (No. 7 from River and Rainbow)",
      composer: "W. Carroll",
      publication: "W. Carroll: River and Rainbow (Forsyth)",
    },
    {
      title:
        "A Dream is a Wish Your Heart Makes (fromCinderella), arr. Keveren",
      composer: "M. David, A. Hoffman & Livingston",
      publication:
        "The Phillip Keveren Series - Disney Songs For Classical Piano (Hal Leonard)",
    },
    {
      title: "Dedicatoria (No. 1 from Cuentos de las juventud, Op. 1)",
      composer: "Granados",
      publication:
        "Granados: Stories of the Young, Op. 1 (ABRSM) or More Romantic Pieces for Piano, Book 2 (ABRSM)",
    },
    {
      title: "Once Upon a Frozen Winter (from Ballads Without Words)",
      composer: "Heather Hammond",
      publication: "Heather Hammond: Ballads Without Words, Vol. 1 (EVC)",
    },

    {
      title: "Romance in G, Op. 52 No. 4",
      composer: "Hummel",
      publication: "Hummel: 16 Short Pieces (ABRSM)",
    },
    {
      title: "A Little Song (Andantino) (No. 1 from Pictures of Childhood)",
      composer: "Khachaturian",
      publication: "Khachaturian: Pictures of Childhood (Boosey & Hawkes)",
    },
    {
      title: "La cloche sonne, S. 238",
      composer: "Liszt",
      publication:
        "Chopin, Liszt, Hiller: Urtext Primo, Vol. 5 (Wiener Urtext)",
    },
    {
      title:
        "Andante (2nd movt from Violin Concerto in E minor, Op. 64), arr. Scott-Burt",
      composer: "Mendelssohn",
      publication: "Piano Mix 3 (ABRSM)",
    },
    {
      title: "Voyage of the Sampan, arr. Siagian with repeats",
      composer: "Trad. Malay",
      publication: "Malay Folk Songs Collection (Hal Leonard)",
    },
    {
      title: "Valse lente (from Six Teaching Pieces)",
      composer: "Vaughan Williams",
      publication: "Vaughan Williams: A Little Piano Book (OUP)",
    },
  ],
  C: [
    {
      title: "Danse du cocher: No.15",
      composer: "Jacques Ibert",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Wallace and Gromit Theme",
      composer: "Julian Nott",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },
    {
      title: "Canzonetta",
      composer: "Raymond Yiu",
      publication: "Piano Exam Pieces 2025 & 2026, Initial Grade (ABRSM)",
    },

    {
      title: "Dancing Queen, arr. Önaç",
      composer: "Benny Andersson, Björn Ulvaeus & Anderson",
      publication: "Pop Performer, Grades 4-5 (ABRSM)",
    },
    {
      title:
        "In the Hall of the Mountain King (from Peer Gynt, Suite No. 1, Op. 46), arr. White",
      composer: "Grieg",
      publication: "Piano Mix 3 (ABRSM)",
    },
    {
      title: "Toccatina (No. 12 from 30 Children's Pieces,Op. 27)",
      commposer: "Kabalevsky",
      publication:
        "Kabalevsky: 30 Children's Pieces, Op. 27(Boosey & Hawkes) orThe Best of Grade 4 Piano (Faber)",
    },
    {
      title: "At the Smithy, Op. 8 No. 5",
      composer: "Maikapar",
      publication: "A Romantic Sketchbook for Piano, Book 2 (ABRSM)",
    },

    {
      title: "Buried Rubies (No. 8 from Treasure Trove)",
      composer: "Alison Mathews",
      publication: "Alison Mathews: Treasure Trove (Editions Musica Ferrum)",
    },
    {
      title: "Worrisome Blues (from Jazz, Rags & Blues, Book 3)",
      composer: "Martha Mier",
      publication: "Martha Mier: Jazz, Rags & Blues, Book 3 (Alfred)",
    },
    {
      title: "Für Anna Maria fröhlich or nachdenklich",
      composer: "Arvo Pärt",
      publication: "Arvo Pärt: Für Anna Maria (Universal)",
    },
    {
      title: "The Goblin and the Mosquito",
      composer: "F. Price",
      publication: "Isata Kanneh-Mason - Piano Inspiration, Book 1 (ABRSM)",
    },
    {
      title: "Marche (No. 10 from Musiques d'enfants, Op. 65)",
      composer: "Prokofiev",
      publication: "Prokofiev: Musiques d'enfants, Op. 65 (Boosey & Hawkes)",
    },
    {
      title: "Bulgarian Peasant Dance",
      composer: "V. Stoyanov",
      publication: "The Joy of Modern Piano Music (Yorktown Music Press)",
    },
    {
      title: "Shenandoah, arr. Bennett",
      composer: "Traditional American",
      publication: "The Graded Piano Player, Grades 3-5 (Faber)",
    },
    {
      title: "Ain't Misbehavin', arr. Iles",
      composer: "Waller, Razaf & H. Brooks",
      publication: "Nikki Iles and Friends, Book 1 (ABRSM)",
    },
    {
      title: "Star Wars (Main Theme), arr. Turner",
      composer: "John Williams",
      publication: "Simply Film, Piano Grades 4-5 (Faber)",
    },
  ],
};

PRACTICAL[5] = {
  A: [
    {
      title:
        "La tarantelle (No. 20 from 25 études faciles etprogressives, Op. 100)",
      composer: "J. F. F.Burgmüller",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 5 (ABRSM)",
    },
    {
      title: "Spiritoso (1st movt from Sonatina in C, Op. 36 No. 3)",
      composer: "Clementi",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 5 (ABRSM)",
    },
    {
      title: "Hook's Hornpipe (from Piano Tales for Peter Pan)",
      composer: "Nikki Iles",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 5 (ABRSM)",
    },
    {
      title: "Invention No. 8 in F, BWV 779",
      composer: "J.S.Bach",
      publication:
        "J. S. Bach: Two-part Inventions (ABRSM) or J. S. Bach: Inventions and Sinfonias (Henle) or Core Classics, Grades 5–6 (ABRSM) or Lang Lang Piano Academy: Mastering the Piano, Level 4 (Faber)",
    },
    {
      title: "Bagatelle in G minor, Op. 119 No. 1",
      composer: "Beethoven",
      publication:
        "A Keyboard Anthology, 1st Series, Book 3 (ABRSM) or Core Classics, Grades 4-5 (ABRSM) or Classics for the Developing Pianist, Book 3 (Alfred)",
    },
    {
      title: "Gavotte (No. 5 from Album des enfants, Op. 123)",
      composer: "Chaminade",
      publication: "Women Composers, Book 2 (Schott)",
    },
    {
      title: "Andante (from Pièces de clavecin, Op. 1)",
      composer: "J. H. Fiocco",
      publication: "J. H. Fiocco: Eight Keyboard Pieces (ABRSM)",
    },
    {
      title:
        "Ringeltanz (Boys' Merry-go-round) (No. 2 from Children's Christmas, Op. 36)",
      composer: "Gade",
      publication:
        "Gade: Aquarelles and Other Pieces (ABRSM) or More Romantic Pieces for Piano, Book 3 (ABRSM)",
    },
    {
      title: "Allegro (1st movt from Sonata in G, Hob. XVI:G1)",
      composer: "Haydn",
      publication:
        "Pp. 41-43 from Haydn: Selected Keyboard Sonatas, Book 1 (ABRSM) or Essential Keyboard Repertoire, Vol. 5 (Alfred)",
    },
    {
      title: "Study in E minor (No. 7 from 30 Progressive Studies, Op. 46)",
      composer: "S.Heller",
      publication: "S. Heller: 30 Progressive Studies (Universal)",
    },
    {
      title: "Allegro in C (No. 2 from Six pièces très faciles, Op. 52)",
      composer: "Hummel",
      publication: "Hummel: 16 Short Pieces (ABRSM)",
    },
    {
      title: "Toccata in E♭",
      composer: "J.L.Krebs",
      publication: "Essential Keyboard Repertoire, Vol. 6 (Alfred)",
    },
    {
      title: "Allegro con spirito (1st movt from Sonatina in C, Op. 55 No. 3)",
      composer: "Kuhlau",
      publication: "EPTA Teachers' Choice Piano Collection 1 (Faber)",
    },
    {
      title: "Toccata No. 3",
      composer: "Leo",
      publication: "The Advanced Pianist, Book 1 (Faber)",
    },
    {
      title:
        "Theme, Var. 1 and Var. 5 (from 12 Variations on “Ah vous dirai-je, maman”, K. 265)",
      composer: "Mozart",
      publication:
        "Mozart: 12 Variations on “Ah, vous dirai-je Maman”, K. 265 (Henle) or Mozart: “Ah, vous dirai-je Maman”, 12 Variations in C major, KV 265 (Bärenreiter)",
    },
    {
      title: "Rondo Scherzando",
      composer: "Jason Sifford",
      publication: "Mosaic, Vol. 4 (Editions Musica Ferrum)",
    },
  ],
  B: [
    {
      title: "Someone You Loved, arr. Iles",
      composer: "Capaldi, Kohn, Kelleher, Barnes & Roman",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 5 (ABRSM)",
    },
    {
      title: "Foggy Blues (from Naoko Ikeda: The Graded Collection)",
      composer: "Naoko Ikeda",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 5 (ABRSM)",
    },
    {
      title: "Waltz in B minor, D. 145 No. 6",
      composer: "Schubert",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 5 (ABRSM)",
    },
    {
      title: "Little Elegy",
      composer: "R. R. Bennett",
      publication: "R. R. Bennett: Little Elegy (Novello)",
    },
    {
      title: "Arabesque Sentimentale",
      composer: "Gillock",
      publication: "William Gillock: Arabesque Sentimentale (Willis)",
    },
    {
      title: "Evening (No. 5 from 8 Easy Pieces, Op. 43)",
      composer: "Glière",
      publication: "Glière: Eight Easy Pieces, Op. 43 (ABRSM)",
    },
    {
      title: "La huérfana (No. 9 from Cuentos de las juventud, Op. 1)",
      composer: "Granados",
      publication: "Granados: Stories of the Young, Op. 1 (ABRSM)",
    },
    {
      title: "Study in E minor, Op. 47 No. 15 with repeat",
      composer: "S.Heller",
      publication: "S. Heller: 20 Miscellaneous Studies (ABRSM)",
    },
    {
      title: "Andante (3rd movt from Sonatina in B-, Op. 70 No. 5)",
      composer: "T.Kirchner",
      publication: "Bärenreiter Sonatina Album, Vol. 2 (Bärenreiter)",
    },
    {
      title:
        "A Walk in the Park (No. 2 from Three Little Bites at the Big Apple)",
      composer: "Philip Lane",
      publication:
        "Philip Lane: Three Little Bites at the Big Apple (Goodmusic)",
    },
    {
      title: "Mélodie (No. 5 from 10 Pièces de genre, Op. 10)",
      composer: "Massenet",
      publication: "French Romantic Repertoire, Level 1 (Faber)",
    },
    {
      title: "La barca (from Impresiones íntimas)",
      composer: "Mompou",
      publication:
        "Mompou: Impresiones íntimas (Unión Musical Ediciones) or Mompou: Música para piano (Unión Musical Ediciones)",
    },
    {
      title: "Prelude in C minor, Op. 8 No. 1",
      composer: "Pachulski",
      publication: "A Romantic Sketchbook for Piano, Book 3 (ABRSM)",
    },
    {
      title:
        "Von fremden Ländern und Menschen (No. 1 from Kinderscenen, Op. 15)",
      composer: "Schumann",
      publication:
        "Schumann: Kinderscenen, Op. 15 (ABRSM) or Schumann: Scenes from Childhood, Op. 15 (Henle) or Lang Lang Piano Academy: Mastering the Piano, Level 4 (Faber)",
    },
    {
      title: "Arirang, arr. Bullard",
      composer: "Traditional Korean",
      publication:
        "Lang Lang Piano Academy: Mastering the Piano, Level 4 (Faber)",
    },
    {
      title: "Beauly Abbey (from Up-Grade! Piano Grades 4-5)",
      composer: "Pam Wedgwood",
      publication: "Pam Wedgwood: Up-Grade! Piano Grades 4-5 (Faber)",
    },
  ],
  C: [
    {
      title: "The Village in May (from My Neighbour Totoro), arr. Kawaura",
      composer: "Joe Hisaishi",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 5 (ABRSM)",
    },
    {
      title: "Jackson Street Blues (from Jazz, Rags & Blues, Book 4)",
      composer: "Martha Mier",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 5 (ABRSM)",
    },
    {
      title:
        "La pluie et l'arc-en-ciel (No. 8 from Musiques d'enfants, Op. 65)",
      composer: "Prokofiev",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 5 (ABRSM)",
    },
    {
      title: "Blue Waltz",
      composer: "Agay",
      publication: "The Joy of Boogie and Blues (Yorktown Music Press)",
    },
    {
      title: "The Sea is Angry",
      composer: "Alwyn",
      publication: "Pianoworks Collection 2 (OUP)",
    },
    {
      title: "Stormy Weather, arr. Iles",
      composer: "Arlen",
      publication: "Nikki Iles and Friends, Book 1 (ABRSM)",
    },
    {
      title: "King of Anything, arr. Baker",
      composer: "Sara Bareilles",
      publication: "Pop Performer, Grades 4-5 (ABRSM)",
    },
    {
      title: "King of Anything, arr. Baker",
      composer: "If I Ain’t Got You, arr. Önaç",
      publication: "Pop Performer, Grades 4-5 (ABRSM)",
    },
    {
      title: "Winter Solstice Song (No. 38 from For Children, Vol. 1)",
      composer: "Bartók",
      publication: "Bartók: For Children, Vol. 1 (Boosey & Hawkes)",
    },
    {
      title: "The Ghost Train (from All the Fun of the Fair)",
      composer: "Lindsey Berwin",
      publication: "Lindsey Berwin: All the Fun of the Fair (EVC)",
    },
    {
      title: "Silent Island",
      composer: "Victoria Borisova-Ollas",
      publication: "Spectrum 3 (ABRSM)",
    },
    {
      title: "Elegy for the Arctic this edition only",
      composer: "Ludovico Einaudi",
      publication: "Pp. 7–9 from Ludovico Einaudi: Extra Elements (Chester)",
    },
    {
      title: "Tuxedo Jazz (from Jazz, Rags & Blues, Book 4)",
      composer: "Martha Mier",
      publication: "Martha Mier: Jazz, Rags & Blues, Book 4 (Alfred)",
    },
    {
      title:
        "March, Little Soldier! (No. 3 from Scenas infantis) gliss. optional",
      composer: "Pinto",
      publication: "Pinto: Scenas infantis (G. Schirmer)",
    },
    {
      title: "Love Theme (from Lyric Moments, Book 2)",
      composer: "Catherine Rollin",
      publication: "Catherine Rollin: Lyric Moments, Book 2 (Alfred)",
    },
    {
      title: "Bright Orange (from Sketches in Colour, Set One)",
      composer: "Starer",
      publication: "Starer: Sketches in Colour, Set One (Hal Leonard)",
    },
  ],
};

PRACTICAL[6] = {
  A: [
    {
      title: "Invention No. 14 in B flat, BWV 785",
      composer: "J. S. Bach",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 6 (ABRSM)",
    },
    {
      title: "Sonata alla Scarlatti",
      composer: "Tailleferre",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 6 (ABRSM)",
    },
    {
      title: "Spilleværket (No. 6 from Humoreske-Bagateller, Op. 11)",
      composer: "C. Nielsen",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 6 (ABRSM)",
    },
    {
      title: "Solfeggietto in C minor, Wq. 117/2",
      composer: " C. P. E. Bach",
      publication:
        "C. P. E. Bach: Selected Keyboard Works, Book 2 (ABRSM) or Classics to Moderns, Book 6 (Yorktown Music Press)",
    },
    {
      title: "Invention No. 6 in E, BWV 777",
      composer: "J. S. Bach",
      publication:
        "J. S. Bach: Two-part Inventions (ABRSM) or J. S. Bach: Inventions and Sinfonias (Henle)",
    },
    {
      title: "Velocity, Op. 109 No. 10",
      composer: "J. F. F. Burgmüller",
      publication: "J. F. F. Burgmüller: Studies, Op. 109 (Peters)",
    },
    {
      title: "Allegro (1st movt from Sonata No. 6 in G)",
      composer: "Cimarosa",
      publication: "The Classical Spirit, Book 2 (Alfred)",
    },
    {
      title: "Fantasia in A",
      composer: "Handel",
      publication: "Classics to Moderns, Book 6 (Yorktown Music Press)",
    },
    {
      title: "Finale: Allegro molto (4th movt from Sonata in G, Hob. XVI:6)",
      composer: "Haydn",
      publication:
        "Haydn: Selected Keyboard Sonatas, Book 1 (ABRSM) or Haydn: Complete Piano Sonatas, Vol. 1 (Wiener Urtext)",
    },
    {
      title: "Rondo in C, Op. 52 No. 6",
      composer: "Hummel",
      publication: "Hummel: 16 Short Pieces (ABRSM)",
    },
    {
      title: "Village Dance (No. 5 from In the Country, Op. 26)",
      composer: "Knowles Paine",
      publication: "Masters of American Piano Music (Alfred)",
    },
    {
      title: "Allegretto (from Character Pieces)",
      composer: "Lindeman",
      publication: "Women Composers, Book 2 (Schott)",
    },
    {
      title: "Presto (2nd movt from Sonata in G)",
      composer: "B. Marcello",
      publication: "A Keyboard Anthology, 3rd Series, Book 4 (ABRSM)",
    },
    {
      title: "Sonata in A, Kp. 208, L. 238",
      composer: "D. Scarlatti",
      publication: "D. Scarlatti: 200 Sonatas, Vol. 2 (EMB Zeneműkiadó)",
    },
    {
      title: "Moment musical in F minor (No. 3 from Moments musicaux, D. 780)",
      composer: "Schubert",
      publication:
        "Schubert: Moments musicaux, D. 780 (ABRSM) or Schubert: Impromptus and Moments musicaux (Henle)",
    },
    {
      title: "Allegro (1st movt from Fantasia No. 1 in D, 1st Dozen, TWV 33:1)",
      composer: "Telemann",
      publication: "Telemann: Fantasias, 1st Dozen (ABRSM)",
    },
  ],
  B: [
    {
      title: "Bagatelle in F (No. 1 from Two Bagatelles)",
      composer: "Hensel",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 6 (ABRSM)",
    },
    {
      title: "Esquisse in D (No. 9 from 12 esquisses, Op. 47)",
      composer: "Glière",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 6 (ABRSM)",
    },
    {
      title: "Last Song (from The Secret Piano)",
      composer: "Alexis Ffrench",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 6 (ABRSM)",
    },
    {
      title: "Tango (No. 2 from España, Op. 165)",
      composer: "Albéniz",
      publication: "Core Classics, Grades 5-6 (ABRSM)",
    },
    {
      title: "Interlude (from Interlude et Valse lente, Op. 38) ending b. 53",
      composer: "Mel Bonis",
      publication: "Mel Bonis: Piano Music Volume 5 - Dances A (Furore Verlag)",
    },
    {
      title: "A Pastel",
      composer: "Y. Bowen",
      publication: "Y. Bowen: A Pastel (Chester)",
    },
    {
      title: "Waltz in A minor, KK. IVb No. 11, with first repeat",
      composer: "Chopin",
      publication:
        "Chopin: Waltzes for Piano (Henle) or More Romantic Pieces for Piano, Book 4 (ABRSM ",
    },
    {
      title: "Prayer of the Matador (No. 2 from Lyric Pieces for the Young)",
      composer: "Dello Joio",
      publication:
        "The Boosey & Hawkes 20th-Century Piano Collection: from 1945 (Boosey & Hawkes)",
    },
    {
      title: "Prelude in D♭ (No. 1 from 8 Easy Pieces, Op. 43)",
      composer: "Glière",
      publication:
        "Glière: Eight Easy Pieces, Op. 43 (ABRSM) or A Romantic Sketchbook for Piano, Book 4 (ABRSM)",
    },
    {
      title:
        "Cantilena No. 1 'Santa Fe para Ilorar' (from 10 Cantilenas Argentinas)",
      composer: "Guastavino",
      publication: "Guastavino: 10 Cantilenas Argentinas (Melos)",
    },
    {
      title: "Nocturne",
      composer: "C. Hartmann",
      publication: "C. Hartmann: Two Piano Pieces (Edition HH)",
    },
    {
      title: "Little Lullaby (4th movt from Suite R-B)",
      composer: "Stephen Hough",
      publication: "Stephen Hough: Suite R-B and Other Enigmas (Weinberger)",
    },
    {
      title: "There Was a Most Beautiful Lady (No. 3 from Country Pageant)",
      composer: "Howells",
      publication:
        "Howells: Country Pageant & A Little Book of Dances (ABRSM) or Core Classics, Grades 5–6 (ABRSM)",
    },
    {
      title: "Legend (No. 6 from Pictures of Childhood)",
      composer: "Khachaturian",
      publication: "Khachaturian: Pictures of Childhood (Boosey & Hawkes)",
    },
    {
      title: "Einsame Blumen (No. 3 from Waldscenen, Op. 82)",
      composer: "Schumann",
      publication: "Schumann: Waldscenen, Op. 82 (ABRSM)",
    },
    {
      title: "Empty Rooms (from Sam Wedgwood’s Project, Book 1)",
      composer: "Sam Wedgwood",
      publication: "Sam Wedgwood’s Project, Book 1 (EVC)",
    },
  ],
  C: [
    {
      title: "Stamping Dance (No. 128 from Mikrokosmos, Vol. 5)",
      composer: "Bartók",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 6 (ABRSM)",
    },
    {
      title: "The Bounce",
      composer: "Zoe Rahman",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 6 (ABRSM)",
    },
    {
      title: "Shushiki (No. 4 from Dances)",
      composer: "Komitas Vardapet",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 6 (ABRSM)",
    },
    {
      title: "Cool (from West Side Story), arr. Klose ",
      composer: "L. Bernstein",
      publication: "Broadway Piano Solos (Boosey & Hawkes)",
    },
    {
      title: "For Stephen Sondheim (No. 3 from 13 Anniversaries)",
      composer: "L. Bernstein",
      publication: "L. Bernstein: 13 Anniversaries (Boosey & Hawkes)",
    },
    {
      title: "Mr “Satchmo” (from Portraits in Jazz)",
      composer: "Valerie Capers",
      publication: "Valerie Capers: Portraits in Jazz (OUP)",
    },
    {
      title: "Galop Final (No. 11 from 11 Children's Pieces, Op. 35)",
      composer: "Casella",
      publication: "Casella: 11 Children's Pieces (Universal)",
    },
    {
      title: "View from a Window (No. 12 from Cool Beans!, Vol. 1)",
      composer: "Ben Crosland",
      publication:
        "Pp. 24-27 from Ben Crosland: Cool Beans!, Vol. 1 (Editions Musica Ferrum)",
    },
    {
      title: "Rumba Toccata",
      composer: "Paul Harvey",
      publication: "Paul Harvey: Rumba Toccata (Ricordi)",
    },
    {
      title: "East Coast Blues",
      composer: "Nikki Iles",
      publication: "Jazz on a Summer's Day (OUP)",
    },
    {
      title: "Somebody to Love, arr. Keveren",
      composer: "Freddie Mercury",
      publication: "Queen for Classical Piano (Hal Leonard)",
    },
    {
      title: "Tsunami",
      composer: "Stephen Montague",
      publication: "Spectrum 2 (ABRSM)",
    },
    {
      title: "Cortège de sauterelles (No. 7 from Musiques d'enfants, Op. 65)",
      composer: "Prokofiev",
      publication: "Prokofiev: Musiques d'enfants, Op. 65 (Boosey & Hawkes)",
    },
    {
      title: "Dancing Barefoot in the Rain (from African Sketches)",
      composer: "Nkeiru Okoye",
      publication:
        "Piano Music of Africa and the African Diaspora, Vol. 1 (OUP)",
    },
    {
      title: "Shooting Stars",
      composer: "Poul Ruders",
      publication: "Spectrum 3 (ABRSM)",
    },
    {
      title: "I wish I knew how it would feel to be free, arr. Churchill",
      composer: "Billy Taylor",
      publication: "Nikki Iles and Friends, Book 1 (ABRSM)",
    },
  ],
};

PRACTICAL[7] = {
  A: [
    {
      title: "Scherzo (3rd movt from Sonata in A, Op. 2 No. 2)",
      composer: "Beethoven",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 7 (ABRSM)",
    },
    {
      title: "Pop Corn (No. 18 from Confections: A Piano Sweet)",
      composer: "Akira Yuyama",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 7 (ABRSM)",
    },
    {
      title: "Le coucou (Rondeau: 1st movt from Troisième suite)",
      composer: "Daquin",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 7 (ABRSM)",
    },
    {
      title: "Allegro di molto (1st movt from Sonata in F minor, Wq. 63/6)",
      composer: "C. P. E. Bach",
      publication:
        "Pp. 40-43 from C. P. E. Bach: Selected Keyboard Works, Book 4 (ABRSM) or The Classical Spirit, Book 2 (Alfred)",
    },
    {
      title: "Gigue (7th movt from French Suite No. 3 in B minor, BWV 814)",
      composer: "J.S.Bach",
      publication: "J. S. Bach: French Suites (ABRSM)",
    },
    {
      title: "Menuetto and Trio (3rd movt from Sonata in D, Op. 10 No. 3)",
      composer: "Beethoven",
      publication:
        "Beethoven: Sonata in D, Op. 10 No. 3 (ABRSM) or Beethoven: The 35 Piano Sonatas, Vol. 1 (ABRSM) or Beethoven: Complete Pianoforte Sonatas, Vol. 1 (ABRSM)",
    },
    {
      title: "Rigaudon (5th movt from Holberg Suite, Op. 40) with first repeat",
      composer: "Grieg",
      publication: "Grieg: Piano Works, Vol. 3 (Peters)",
    },
    {
      title:
        "Allemande and Courante (2nd and 3rd movts from Suite in D minor, HWV 437)",
      composer: "Handel",
      publication: "Handel: Keyboard Works, Vol. 2 (Bärenreiter)",
    },
    {
      title: "Moderato (1st movt from Sonata in E, Hob. XVI:31)",
      composer: "Haydn",
      publication:
        "Haydn: Selected Keyboard Sonatas, Book 3 (ABRSM) or Haydn: Complete Piano Sonatas, Vol. 3 (Wiener Urtext)",
    },
    {
      title: "Allegro con spirito (1st movt from Sonatina in A, Op. 60 No. 2)",
      composer: "Kuhlau",
      publication: "Kuhlau: Sonatinas, Vol. 2 (Peters)",
    },
    {
      title: "Gigue in G, K. 574",
      composer: "Mozart",
      publication:
        "Pp. 11-12 from A Keyboard Anthology, 2nd Series, Book 5 (ABRSM) or Mozart: Mature Piano Pieces (ABRSM) or Mozart: Piano Pieces, Selection (Henle)",
    },
    {
      title: "Allegro (2nd movt from Sonata No. 6 in A)",
      composer: "Paradies",
      publication:
        "Pp. 45-47 from Paradies: Sonate di Gravicembalo, Vol. 1 (Schott)",
    },
    {
      title: "Les sauvages (from Pièces de clavecin)",
      composer: "Rameau",
      publication:
        "Rameau: Les cyclopes / Les sauvages (Bärenreiter) or pp. 96-97 from Rameau: Pièces de clavecin (Heugel)",
    },
    {
      title: "Sonata in E, Kp. 380, L. 23",
      composer: " D. Scarlatti",
      publication:
        "Pp. 30-33 from D. Scarlatti: Keyboard Pieces and Sonatas, Book 3 (ABRSM) or D. Scarlatti: 200 Sonatas, Vol. 3 (EMB Zeneműkiadó)",
    },
    {
      title:
        " Scherzo (No. 4 from Quatre pièces fugitives, Op. 15) with first repeat",
      composer: "C. Schumann",
      publication:
        "C. Schumann: Quatre pièces fugitives Op. 15 (Breitkopf & Härtel)",
    },
    {
      title: "El mercado (No. 5 from Miniaturas, Op. 52)",
      composer: "Joaquín Turina",
      publication: "Joaquín Turina: Miniaturas (Schott)",
    },
  ],
  B: [
    {
      title: "*** (No. 30 from Album für die Jugend, Op. 68)",
      composer: "Schumann",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 7 (ABRSM)",
    },
    {
      title:
        "Adagietto pianissimo (No. 1 from Suite de danzas criollas, Op. 15)",
      composer: "Ginastera",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 7 (ABRSM)",
    },
    {
      title: "Musical Sketch in B flat (No. 1 from Two Musical Sketches)",
      composer: "Mendelssohn",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 7 (ABRSM)",
    },
    {
      title: "Prelude No. 9 (from 12 or 13 Preludes for Piano Solo, Set One)",
      composer: "Alan Bullard",
      publication:
        "Alan Bullard: Prelude No. 9 from 12 or 13 Preludes for Piano Solo, Set One (Colne Edition) or Alan Bullard: 12 or 13 Preludes for Piano Solo, Set One (Colne Edition)",
    },
    {
      title: "The Little Shepherd (No. 5 from Children's Corner)",
      composer: "Debussy ",
      publication: "A Keyboard Anthology, 1st Series, Book 5 (ABRSM)",
    },
    {
      title:
        "Children's Song (No. 11 from Bunte Reihen kurzer Klavierstücke, Op. 6)",
      composer: "Görres",
      publication: "Women Composers, Book 2 (Schott)",
    },
    {
      title: "Mélodie, Op. 4 No. 2",
      composer: "Hensel",
      publication:
        "At the Piano with Women Composers (Alfred) or Piano Music by Female Composers (4th revised edition 2011) (Schott)",
    },
    {
      title: "Berceuse (No. 7 from Noure et Anitra, Op. 13)",
      composer: "Ilyinsky",
      publication:
        "Core Classics, Grades 6-7 (ABRSM) or A Keyboard Anthology, 3rd Series, Book 5 (ABRSM)",
    },
    {
      title: "Consolation No. 5 in E (from Consolations, S. 172)",
      composer: "Liszt",
      publication:
        "Liszt: 21 Short Piano Pieces (ABRSM) or Liszt: Consolations (Wiener Urtext)",
    },
    {
      title: "Mazurka in F minor (No. 3 from Trois morceaux, Op. 57)",
      composer: "Lyadov",
      publication:
        "Lyadov: Preludes, Trifles and Other Pieces (ABRSM) or A Romantic Sketchbook for Piano, Book 4 (ABRSM)",
    },
    {
      title: "Song without Words, Op. 19 No. 1",
      composer: "Mendelssohn",
      publication: "Mendelssohn: Songs without Words (ABRSM)",
    },
    {
      title: "Lento moderato (2nd movt from Sonatina in F, Op. 27)",
      composer: "A. Richardson",
      publication: "A. Richardson: Sonatina in F, Op. 27 (Weinberger)",
    },
    {
      title: "Romance (No. 1 from Soirées à Saint-Petersbourg, Op. 44)",
      composer: "Rubinstein",
      publication: "Short Romantic Pieces for Piano, Book 5 (ABRSM)",
    },
    {
      title: "Jamaican Dance No. 2 (from Three Jamaican Dances)",
      composer: "O. Russell",
      publication:
        "Piano Music of Africa and the African Diaspora, Vol. 3 (OUP)",
    },
    {
      title: "Kind im Einschlummern (No. 12 from Kinderscenen, Op. 15)",
      composer: "Schumann",
      publication:
        "Schumann: Kinderscenen, Op. 15 (ABRSM) or Schumann: Scenes from Childhood, Op. 15 (Henle) or Night and Dreams (Schott)",
    },
    {
      title:
        "Nostalgia (Vágyódás) (No. 4 from Jazz Preludes Wolf-temperiertes Klavier 2)",
      composer: "P. E. Wolf",
      publication:
        "Jazz Preludes Wolf-temperiertes Klavier 2 (EMB Zeneműkiadó)",
    },
  ],
  C: [
    {
      title: "The Watermill",
      composer: "Kahn",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 7 (ABRSM)",
    },
    {
      title: "Lowside Blues",
      composer: " Joanna MacGregor",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 7 (ABRSM)",
    },
    {
      title: "Allegretto (No. 1 from Three Fantastic Dances, Op. 5)",
      composer: "Shostakovich",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 7 (ABRSM)",
    },
    {
      title: "Bagpipers: Allegretto (1st movt from Sonatina)",
      composer: "Bartók",
      publication: "Bartók: Sonatina (EMB Zeneműkiadó or Henle)",
    },
    {
      title: "Bamboo Dance II",
      composer: "Chen Yi",
      publication: "Spectrum 5 (ABRSM)",
    },
    {
      title:
        "Tribute to Roberto Garcia Morillo (No. 6 from 12 American Preludes, Op. 12)",
      composer: "Ginastera",
      publication: "Ginastera: 12 American Preludes, Op. 12 (Carl Fischer)",
    },
    {
      title: "Butterfly (No. 1 from Lyric Pieces, Book 3, Op. 43)",
      composer: "Grieg",
      publication: "Grieg: 38 Pianoforte Pieces, Book 2 (ABRSM)",
    },
    {
      title: "Chanson du chasseur (No. 4 from L'Almanach aux images)",
      composer: "Grovlez",
      publication:
        "Grovlez: L’Almanach aux images (Stainer & Bell) or Beyond the Romantic Spirit, Book 2 (Alfred)",
    },
    {
      title: "Fly Me to the Moon, arr. Iles",
      composer: "Bart Howard",
      publication: "Nikki Iles and Friends, Book 2 (ABRSM)",
    },
    {
      title: "Smoke Gets in Your Eyes (from Roberta), arr. Evans",
      composer: "Kern",
      publication: "Lee Evans Arranges Jerome Kern (Hal Leonard)",
    },
    {
      title: "Prélude No. 14 (from 24 Préludes pour piano, Op. 38)",
      composer: "Florentine Mulsant",
      publication:
        "Florentine Mulsant: 24 Préludes pour piano, Op. 38 (Furore Verlag)",
    },
    {
      title: "Pop Bossa (No. 5 from Latin Preludes 2)",
      composer: "Christopher Norton",
      publication:
        "Christopher Norton: Latin Preludes Collection (Boosey & Hawkes)",
    },
    {
      title: "Milonga del ánge",
      composer: "Piazzolla",
      publication: "Piazzolla: Piazzolla: Ángel for piano (Tonos)",
    },
    {
      title: "Nigerian Dance No. 1 (from Four Nigerian Dances)",
      composer: "Uzoigwe",
      publication:
        "Piano Music of Africa and the African Diaspora, Vol. 2 (OUP)",
    },
    {
      title: "El Choclo, arr. Korn with repeat",
      composer: "Villoldo",
      publication: "Tango Meets Jazz (Schott)",
    },
    {
      title: "Spartacus",
      composer: "Carl Vine",
      publication: "Carl Vine: Red Blues (Faber)",
    },
  ],
};

PRACTICAL[8] = {
  A: [
    {
      title:
        "Alla Turca (3rd movt from Sonata in A, K. 331) with first, third and final repeat",
      composer: "Mozart",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 8 (ABRSM)",
    },
    {
      title: "Il pleut",
      composer: "Mel Bonis",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 8 (ABRSM)",
    },
    {
      title: "Sonata in C, Kp. 513",
      composer: "D. Scarlatti",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 8 (ABRSM)",
    },
    {
      title: "Prelude and Fugue in G, BWV 884",
      composer: "J. S. Bach",
      publication: "J. S. Bach: The Well-Tempered Clavier, Part 2 (ABRSM)",
    },
    {
      title:
        "Sarabande and Rondeaux (4th and 5th movts from Partita No. 2 in C minor, BWV 826)",
      composer: "J. S. Bach",
      publication: "J. S. Bach: Partitas Nos. 1-3 (ABRSM)",
    },
    {
      title: "Allegro (1st movt from Sonata in E, Op. 14 No. 1)",
      composer: "Beethoven",
      publication:
        "Beethoven: Sonata in E, Op. 14 No. 1 (ABRSM) or Beethoven: The 35 Piano Sonatas, Vol. 1 (ABRSM) or Beethoven: Complete Pianoforte Sonatas, Vol. 1 (ABRSM)",
    },
    {
      title:
        "Prelude and Allegro (Fuga) (1st and 2nd movts from Suite No. 8 in F minor, HWV 433)",
      composer: "Handel",
      publication:
        "Handel: Eight Great Suites, Book 2 (ABRSM) or Handel: Keyboard Works, Vol. 1 (Bärenreiter)",
    },
    {
      title: "Allegro con brio (1st movt from Sonata in D, Hob. XVI:37)",
      composer: "Haydn",
      publication:
        "Haydn: Selected Keyboard Sonatas, Book 3 (ABRSM) or Haydn: Complete Piano Sonatas, Vol. 3 (Wiener Urtext)",
    },
    {
      title: "Allegro (1st movt from Sonata in E♭, Hob. XVI:49)",
      composer: "Haydn",
      publication: "Haydn: Complete Piano Sonatas Volume III (Henle)",
    },
    {
      title: "Toccatina (5th movt from Suite R-B)",
      composer: "Stephen Hough",
      publication: "Stephen Hough: Suite R-B and Other Enigmas (Weinberger)",
    },
    {
      title: "Allegro/Moderato (1st movt from Sonata in A)",
      composer: "Martínez",
      publication:
        "Piano Music by Female Composers (4th revised edition 2011) (Schott) or Core Classics, Grades 7-8 (ABRSM)",
    },
    {
      title: "Scherzino, Op. 77 No. 2",
      composer: "Moszkowski",
      publication: "Moszkowski: Music for Piano (G. Schirmer)",
    },
    {
      title:
        "Andante grazioso and Vars. 1-6 (1st movt from Sonata in A, K. 331)",
      composer: "Mozart",
      publication:
        "Mozart: Sonata in A, K. 331 (ABRSM) or Mozart: Sonatas for Pianoforte, Vol. 2 (ABRSM)",
    },
    {
      title: "Les cyclopes (from Pièces de clavecin)",
      composer: "Rameau",
      publication:
        "Rameau: Les cyclopes / Les sauvages (Bärenreiter) or Rameau: Pièces de clavecin (Heugel)",
    },
    {
      title: "Sonata in D, Kp. 443, L. 418",
      composer: "D. Scarlatti",
      publication:
        "Pp. 4-7 from D. Scarlatti: Selected Keyboard Sonatas, Book 1 (ABRSM) or D. Scarlatti: 200 Sonatas, Vol. 4 (EMB Zeneműkiadó)",
    },
    {
      title: "Un poco agitato (No. 2 from Quatre pièces fugitives, Op. 15)",
      composer: "C. Schumann",
      publication:
        "C. Schumann: Romantic Piano Music (Vol. 2) (Bärenreiter) or C. Schumann: Quatre pièces fugitives Op. 15 (Breitkopf & Härtel)",
    },
  ],
  B: [
    {
      title: "La fille aux cheveux de lin (No. 8 from Préludes, Book 1)",
      composer: "Debussy",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 8 (ABRSM)",
    },
    {
      title: "il porco rosso (from Porco Rosso)",
      composer: "Joe Hisaishi ",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 8 (ABRSM)",
    },
    {
      title: "Consolation in E (No. 2 from Consolations, S. 172)",
      composer: "Liszt",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 8 (ABRSM)",
    },
    {
      title: "Nocturne in D- (No. 3 from 24 Characteristic Pieces, Op. 36)",
      composer: "Arensky",
      publication:
        "Arensky: 24 Characteristic Pieces, Op. 36 (Prhythm) or Arensky: 24 Morceau characteristiques, Op. 36 (Alfred)",
    },
    {
      title: "A Hermit Thrush at Morn, Op. 92 No. 2",
      composer: " A. Beach",
      publication: "",
    },
    {
      title:
        "Adagio cantabile (2nd movt from Sonata in C minor 'Pathétique', Op. 13)",
      composer: "Beethoven",
      publication:
        "Beethoven: Sonata in C minor, Op. 13 (Pathétique) (ABRSM) or Beethoven: The 35 Piano Sonatas, Vol. 1 (ABRSM) or Beethoven: Complete Pianoforte Sonatas, Vol. 1 (ABRSM)",
    },
    {
      title: "Mazurka in A minor, Op. 17 No. 4",
      composer: "Chopin",
      publication: "Chopin: Mazurkas (Henle)",
    },
    {
      title: "Andante cantabile in D♭",
      composer: "Hensel",
      publication: "Hensel: Selected Piano Works (Henle)",
    },
    {
      title: "Columbine",
      composer: "Ireland",
      publication:
        "Ireland: The Collected Piano Works, Vol. 4 (Stainer & Bell)",
    },
    {
      title: "Andante (No. 1 from In the Mists)",
      composer: "Janáček",
      publication: "Janáček: In the Mists (Bärenreiter)",
    },
    {
      title: "Moment musical in D♭, Op. 16 No. 5",
      composer: "S.Rachmaninof",
      publication: "Rachmaninoff: Six moments musicaux, Op. 16 (Simrock)",
    },
    {
      title: "Impromptu in A♭ (No. 2 from Four Impromptus, Op. 142, D. 935)",
      composer: "Schubert",
      publication:
        "Schubert: Impromptus, Op. 142 (ABRSM) or Schubert: Impromptus and Moments musicaux (Henle) or Core Classics, Grades 7–8 (ABRSM)",
    },
    {
      title: "Romanze in F♯ (No. 2 from Drei Romanzen, Op. 28)",
      composer: "Schumann",
      publication: "Schumann: Drei Romanzen, Op. 28 (ABRSM)",
    },
    {
      title: "Impromptu",
      composer: "Tailleferre",
      publication: "Tailleferre: Impromptu (Editions Jobert)",
    },
    {
      title: "Janvier 'Au coin du feu' (No. 1 from The Seasons, Op. 37bis)",
      composer: "Tchaikovsky",
      publication: "Tchaikovsky: The Seasons (Henle)",
    },
    {
      title:
        "Hiding Rainbow (Bujkáló szivárvárny) (No. 22 from Jazz Preludes Wolf-temperiertes Klavier 2)",
      composer: "P. E. Wolf ",
      publication:
        "Jazz Preludes Wolf-temperiertes Klavier 2 (EMB Zeneműkiadó)",
    },
  ],
  C: [
    {
      title: "In the Dew, a Homage to Janáček (from Homages, Book 1)",
      composer: "Cheryl Frances-Hoad",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 8 (ABRSM)",
    },
    {
      title: "Maple Leaf Rag",
      composer: "Joplin",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 8 (ABRSM)",
    },
    {
      title: "A Nightingale Sang in Berkeley Square, arr. Iles",
      composer: "Sherwin & Maschwitz",
      publication: "Piano Exam Pieces 2025 & 2026, Grade 8 (ABRSM)",
    },
    {
      title: "If the Silver Bird Could Speak",
      composer: "4 Eleanor Alberga",
      publication: "Spectrum (ABRSM)",
    },
    {
      title: "Dance in Bulgarian Rhythm No. 6 (No.153 from Mikrokosmos)",
      composer: "Bartók",
      publication:
        "Bartók: Six Dances in Bulgarian Rhythm (Henle) or Bartók: Mikrokosmos, Vol. 6 (Boosey & Hawkes)",
    },
    {
      title: "Pierrette (Air de Ballet), Op. 41",
      composer: "Chaminade",
      publication:
        "Piano Music by Female Composers (4th revised edition 2011) (Schott)",
    },
    {
      title: "Thunder in Drought Season",
      composer: "Chen Peixun",
      publication:
        "100 Years of Chinese Piano Music: Vol. III Works in Traditional Style, Book II Instrumental Music (Shanghai Conservatory of Music Press)",
    },
    {
      title: "Rêverie",
      composer: "Debussy",
      publication:
        "Debussy: Rêverie (Editions Jobert) or Night and Dreams (Schott)",
    },
    {
      title: "Eco Warrior",
      composer: "Tim Garland",
      publication: "Nikki Iles and Friends, Book 2 (ABRSM)",
    },
    {
      title: "Go with the Flow",
      composer: "Zoe Rahman",
      publication: "Nikki Iles and Friends, Book 2 (ABRSM)",
    },
    {
      title: "Toccata",
      composer: "Khachaturian",
      publication: "Khachaturian: Toccata (Boosey & Hawkes)",
    },
    {
      title: "Caballos Españoles",
      composer: "Uwe Korn",
      publication: "Tango Meets Jazz (Schott)",
    },
    {
      title: "Vespers in Venice (from Four Piano Solos)",
      composer: "Cecilia McDowall",
      publication: "Cecilia McDowall: Four Piano Solos (Hunt Edition)",
    },
    {
      title: "On the Sunny Side of the Street, arr. Iles",
      composer: "McHugh",
      publication: "Jazz on a Summer's Day (OUP)",
    },
    {
      title: "Danny Boy, arr. Iles",
      composer: "Trad. Irish",
      publication: "Jazz in Autumn (OUP)",
    },
    {
      title: "O polichinelo (from A prole do bebê no.1)",
      composer: "Villa-Lobos",
      publication:
        "Villa-Lobos: O polichinelo (Eschig) or Beyond the Romantic Spirit, Book 2 (Alfred)",
    },
  ],
};

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
