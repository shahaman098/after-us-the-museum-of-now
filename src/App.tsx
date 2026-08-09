import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Exhibit = {
  id: string;
  objectName: string;
  originalImageUrl: string;
  userMeaning: string;
  futureTitle: string;
  futureInterpretation: string;
  theme: string;
  category: string;
  material: string;
  location?: string;
  createdAt: string;
  views: number;
  reactions: number;
};

type Section = "home" | "contribute" | "museum" | "census" | "detail";

const asset = (name: string) => `/assets/${name}`;

const DEMO_OBJECT = "House key";
const DEMO_MEANING = "This opened my first home.";
const DEMO_IMAGE = asset("upload-key.png");

const heroSlides = [
  { image: asset("hero-key-case.jpg") },
  { image: asset("hero-threshold.jpg") },
  { image: asset("hero-archive.jpg") },
];

const seedExhibits: Exhibit[] = [
  {
    id: "seed-key",
    objectName: "House key",
    originalImageUrl: asset("upload-key.png"),
    userMeaning: "This opened my first home.",
    futureTitle: "Key to the First Threshold",
    futureInterpretation:
      "Recovered from an early twenty-first century city dwelling, this brass key marked the fragile border between precarity and belonging. Its owner remembered it not as a tool, but as proof that a private room could become a life.",
    theme: "Belonging",
    category: "Home & Space",
    material: "Brass",
    createdAt: "2026-08-09T15:18:00.000Z",
    views: 8841,
    reactions: 626,
  },
  {
    id: "seed-mug",
    objectName: "Morning mug",
    originalImageUrl: asset("gallery-mug.png"),
    userMeaning: "Coffee. Every morning.",
    futureTitle: "Vessel for the Daily Return",
    futureInterpretation:
      "A small ceramic object used to restart the body and signal that another ordinary day was worth entering.",
    theme: "Rituals & Memory",
    category: "Care",
    material: "Ceramic",
    createdAt: "2026-08-08T10:24:00.000Z",
    views: 2219,
    reactions: 301,
  },
  {
    id: "seed-shoes",
    objectName: "Run club shoes",
    originalImageUrl: asset("gallery-shoes.png"),
    userMeaning: "Carried me through the hard days.",
    futureTitle: "Shoes for Staying",
    futureInterpretation:
      "Worn synthetic foot coverings, likely used in a collective practice of moving through grief until it became survivable.",
    theme: "Survival",
    category: "Movement & Travel",
    material: "Mesh, rubber",
    createdAt: "2026-08-07T19:02:00.000Z",
    views: 1930,
    reactions: 248,
  },
  {
    id: "seed-plush",
    objectName: "First dog plush",
    originalImageUrl: asset("gallery-plush.png"),
    userMeaning: "My childhood companion.",
    futureTitle: "Companion Without Pulse",
    futureInterpretation:
      "Soft animal facsimiles helped children rehearse attachment, repair fear, and carry tenderness into adulthood.",
    theme: "Family",
    category: "Play & Joy",
    material: "Cotton, polyester",
    createdAt: "2026-08-06T17:40:00.000Z",
    views: 1725,
    reactions: 332,
  },
  {
    id: "seed-card",
    objectName: "MetroCard",
    originalImageUrl: asset("gallery-card.png"),
    userMeaning: "Tapped into the city.",
    futureTitle: "Permission to Move",
    futureInterpretation:
      "Thin plastic tokens like this turned vast public systems into intimate routines of departure and return.",
    theme: "Independence",
    category: "Movement & Travel",
    material: "Plastic",
    createdAt: "2026-08-05T08:12:00.000Z",
    views: 1507,
    reactions: 184,
  },
  {
    id: "seed-note",
    objectName: "Recipe note",
    originalImageUrl: asset("gallery-note.png"),
    userMeaning: "Grandma's recipe, in her handwriting.",
    futureTitle: "Instructions for Remembering",
    futureInterpretation:
      "Handwritten food instructions preserved a voice, a body memory, and a method of care beyond its author.",
    theme: "Memory",
    category: "Family",
    material: "Paper, ink",
    createdAt: "2026-08-04T13:35:00.000Z",
    views: 2888,
    reactions: 514,
  },
  {
    id: "seed-headphones",
    objectName: "Study headphones",
    originalImageUrl: asset("gallery-headphones.png"),
    userMeaning: "Focus. Blocked out the world.",
    futureTitle: "Portable Room of Silence",
    futureInterpretation:
      "Noise-canceling devices created temporary privacy in shared, crowded environments where attention had become scarce.",
    theme: "Independence",
    category: "Work & Purpose",
    material: "Plastic, foam, copper",
    createdAt: "2026-08-03T21:08:00.000Z",
    views: 1336,
    reactions: 176,
  },
];

const themesOnView = [
  "Belonging",
  "Independence",
  "Family",
  "Survival",
  "Memory",
  "Care",
  "Work & Purpose",
  "Play & Joy",
];

const ritualSteps = [
  {
    n: "01",
    title: "Photograph",
    copy: "Capture one ordinary object that still carries meaning.",
  },
  {
    n: "02",
    title: "Transform",
    copy: "AFTER US catalogs it as a future museum exhibit from 2526.",
  },
  {
    n: "03",
    title: "Accumulate",
    copy: "It enters the gallery and updates the Census of Us.",
  },
];

function loadExhibits() {
  try {
    const saved = window.localStorage.getItem("after-us-exhibits");
    return saved ? (JSON.parse(saved) as Exhibit[]) : seedExhibits;
  } catch {
    return seedExhibits;
  }
}

function saveExhibits(next: Exhibit[]) {
  window.localStorage.setItem("after-us-exhibits", JSON.stringify(next));
}

function getTopCounts(exhibits: Exhibit[], key: "theme" | "category") {
  const counts = exhibits.reduce<Record<string, number>>((acc, exhibit) => {
    acc[exhibit[key]] = (acc[exhibit[key]] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function chooseTheme(text: string) {
  const source = text.toLowerCase();
  if (source.match(/home|belong|room|door|key|place|threshold/))
    return "Belonging";
  if (source.match(/mother|father|grand|child|family|friend|dog/))
    return "Family";
  if (source.match(/survive|hard|grief|safe|carry|lost/)) return "Survival";
  if (source.match(/remember|memory|past|old|photo|handwriting|recipe/))
    return "Memory";
  if (source.match(/work|study|make|build|job/)) return "Work & Purpose";
  if (source.match(/city|move|independen|alone|focus|self|freedom/))
    return "Independence";
  if (source.match(/care|love|hold|comfort|heal/)) return "Care";
  return "Care";
}

function inferCategory(objectName: string) {
  const source = objectName.toLowerCase();
  if (source.match(/key|mug|blanket|lamp|chair/)) return "Home & Space";
  if (source.match(/shoe|card|ticket|bike|bag/)) return "Movement & Travel";
  if (source.match(/note|letter|photo|recipe|book/)) return "Family";
  if (source.match(/headphone|laptop|pen|tool/)) return "Work & Purpose";
  if (source.match(/plush|toy|game|ball/)) return "Play & Joy";
  return "Everyday Tools";
}

function inferMaterial(objectName: string) {
  const source = objectName.toLowerCase();
  if (source.includes("key")) return "Brass";
  if (source.includes("mug")) return "Ceramic";
  if (source.includes("shoe")) return "Mesh, rubber";
  if (source.includes("plush") || source.includes("toy"))
    return "Cotton, polyester";
  if (source.includes("card")) return "Plastic";
  if (source.includes("note") || source.includes("recipe")) return "Paper, ink";
  if (source.includes("headphone")) return "Plastic, foam, copper";
  return "Mixed material";
}

function createExhibit(
  objectName: string,
  userMeaning: string,
  location: string,
  imageUrl: string,
): Exhibit {
  const cleanName = objectName.trim() || "Unnamed object";
  const meaning = userMeaning.trim();
  const isDemoKey =
    cleanName.toLowerCase() === "house key" &&
    meaning.toLowerCase() === DEMO_MEANING.toLowerCase();

  if (isDemoKey) {
    return {
      id: `exhibit-${Date.now()}`,
      objectName: cleanName,
      originalImageUrl: imageUrl,
      userMeaning: meaning,
      futureTitle: "Key to the First Threshold",
      futureInterpretation:
        "Recovered from an early twenty-first century city dwelling, this brass key marked the fragile border between precarity and belonging. Its owner remembered it not as a tool, but as proof that a private room could become a life.",
      theme: "Belonging",
      category: "Home & Space",
      material: "Brass",
      location: location.trim() || undefined,
      createdAt: new Date().toISOString(),
      views: 1,
      reactions: 0,
    };
  }

  const theme = chooseTheme(`${cleanName} ${meaning}`);
  const category = inferCategory(cleanName);
  const titleMap: Record<string, string> = {
    Belonging: `Relic of the First ${cleanName}`,
    Family: `${cleanName} Kept Close`,
    Survival: `${cleanName} That Endured`,
    Memory: `${cleanName} Against Forgetting`,
    "Work & Purpose": `${cleanName} for Making a Day`,
    Independence: `${cleanName} for Moving Alone`,
    Care: `${cleanName} of Ordinary Care`,
    "Rituals & Memory": `Vessel of Daily Return`,
  };

  return {
    id: `exhibit-${Date.now()}`,
    objectName: cleanName,
    originalImageUrl: imageUrl,
    userMeaning: meaning,
    futureTitle: titleMap[theme] ?? `${cleanName}, Cataloged`,
    futureInterpretation: `Cataloged in the year 2526, this ${cleanName.toLowerCase()} is read as evidence that people in 2026 stored memory inside useful things. The contributor wrote, "${meaning}" — a sentence that turns utility into biography.`,
    theme,
    category,
    material: inferMaterial(cleanName),
    location: location.trim() || undefined,
    createdAt: new Date().toISOString(),
    views: 1,
    reactions: 0,
  };
}

function formatCatalogDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function App() {
  const [section, setSection] = useState<Section>("home");
  const [navOpen, setNavOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [exhibits, setExhibits] = useState<Exhibit[]>(loadExhibits);
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit>(exhibits[0]);
  const [generatedExhibit, setGeneratedExhibit] = useState<Exhibit>(exhibits[0]);
  const [objectName, setObjectName] = useState(DEMO_OBJECT);
  const [meaning, setMeaning] = useState(DEMO_MEANING);
  const [location, setLocation] = useState("");
  const [imagePreview, setImagePreview] = useState(DEMO_IMAGE);
  const [isPublished, setIsPublished] = useState(false);
  const [isCataloging, setIsCataloging] = useState(false);
  const [justPublishedId, setJustPublishedId] = useState<string | null>(null);

  const themeCounts = useMemo(() => getTopCounts(exhibits, "theme"), [exhibits]);
  const categoryCounts = useMemo(
    () => getTopCounts(exhibits, "category"),
    [exhibits],
  );
  const maxThemeCount = Math.max(...themeCounts.map(([, count]) => count), 1);
  const maxCategoryCount = Math.max(
    ...categoryCounts.map(([, count]) => count),
    1,
  );
  const recentExhibits = exhibits.slice(0, 4);
  const visitorContributions = exhibits.filter((item) =>
    item.id.startsWith("exhibit-"),
  ).length;
  const isDemoLoaded =
    objectName === DEMO_OBJECT &&
    meaning === DEMO_MEANING &&
    imagePreview === DEMO_IMAGE;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % heroSlides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const goTo = (next: Section) => {
    setSection(next);
    setNavOpen(false);
    const id =
      next === "home"
        ? "home"
        : next === "contribute"
          ? "contribute"
          : next === "museum"
            ? "museum"
            : next === "census"
              ? "census"
              : "detail";
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const loadDemoObject = () => {
    setObjectName(DEMO_OBJECT);
    setMeaning(DEMO_MEANING);
    setLocation("");
    setImagePreview(DEMO_IMAGE);
    setIsPublished(false);
    goTo("contribute");
  };

  const publishExhibit = (event: FormEvent) => {
    event.preventDefault();
    if (!objectName.trim() || !meaning.trim() || isCataloging) return;

    setIsCataloging(true);

    window.setTimeout(() => {
      const next = createExhibit(objectName, meaning, location, imagePreview);
      const nextExhibits = [next, ...exhibits];
      setGeneratedExhibit(next);
      setSelectedExhibit(next);
      setExhibits(nextExhibits);
      saveExhibits(nextExhibits);
      setIsPublished(true);
      setJustPublishedId(next.id);
      setIsCataloging(false);
      goTo("detail");
    }, 900);
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
        setIsPublished(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetDemo = () => {
    const next = seedExhibits;
    setExhibits(next);
    setGeneratedExhibit(next[0]);
    setSelectedExhibit(next[0]);
    saveExhibits(next);
    setObjectName(DEMO_OBJECT);
    setMeaning(DEMO_MEANING);
    setLocation("");
    setImagePreview(DEMO_IMAGE);
    setIsPublished(false);
    setJustPublishedId(null);
  };

  return (
    <div className={`page-wrapper ${navOpen ? "visible-sidebar" : ""}`}>
      <aside className="hidden-bar" aria-label="Museum navigation">
        <div className="nav-toggler">
          <button
            aria-expanded={navOpen}
            aria-label="Open menu"
            className="hidden-bar-opener"
            onClick={() => setNavOpen(true)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="hidden-bar-closer">
          <button
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="hidden-bar-wrapper">
          <button className="logo-box" onClick={() => goTo("home")} type="button">
            <strong>AFTER US</strong>
            <small>The Museum of Now</small>
          </button>

          <nav className="side-menu">
            <ul>
              {(
                [
                  ["home", "Home"],
                  ["contribute", "Contribute"],
                  ["museum", "Gallery"],
                  ["census", "Census of Us"],
                  ["detail", "Exhibit"],
                ] as const
              ).map(([id, label]) => (
                <li className={section === id ? "current" : ""} key={id}>
                  <button onClick={() => goTo(id)} type="button">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <p className="side-note">
            One object. One sentence. One public museum from the year 2526.
          </p>
          <button className="side-demo" onClick={loadDemoObject} type="button">
            Try the demo object →
          </button>
        </div>
      </aside>

      {navOpen ? (
        <button
          aria-label="Close navigation overlay"
          className="nav-backdrop"
          onClick={() => setNavOpen(false)}
          type="button"
        />
      ) : null}

      <main>
        <section className="main-slider" id="home">
          {heroSlides.map((slide, index) => (
            <div
              className={`slide ${index === slideIndex ? "active" : ""}`}
              key={slide.image}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}
          <div className="slide-veil" />
          <div className="slide-content">
            <p className="hero-eyebrow">Catalog year 2526</p>
            <h1>AFTER US</h1>
            <p className="hero-product">The Museum of Now</p>
            <p className="hero-support">
              Photograph one ordinary object. Turn it into a museum exhibit from
              2526 — then watch it join the public collection.
            </p>
            <div className="cta-row">
              <button
                className="theme-btn btn-style-one"
                onClick={loadDemoObject}
                type="button"
              >
                Try the Ready Demo
              </button>
              <button
                className="theme-btn btn-style-four"
                onClick={() => goTo("museum")}
                type="button"
              >
                Enter the Gallery
              </button>
            </div>
            <p className="hero-hint">
              Demo loaded: house key · “This opened my first home.”
            </p>
          </div>
          <div className="slide-dots" aria-label="Hero slides">
            {heroSlides.map((slide, index) => (
              <button
                aria-label={`Show slide ${index + 1}`}
                className={index === slideIndex ? "active" : ""}
                key={slide.image}
                onClick={() => setSlideIndex(index)}
                type="button"
              />
            ))}
          </div>
        </section>

        <section className="info-banner">
          <div className="auto-container">
            <h3>
              AFTER US is a public museum where one ordinary object from your life
              becomes an exhibit from the year 2526.
            </h3>
          </div>
        </section>

        <section className="ritual-section" aria-label="How AFTER US works">
          <div className="auto-container ritual-grid">
            {ritualSteps.map((step) => (
              <article className="ritual-card" key={step.n}>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="history-section">
          <div className="history-grid">
            <div className="content-column">
              <div className="sec-title">
                <span className="title">The Premise</span>
                <h2>History of the Present</h2>
              </div>
              <p>
                Most people never get preserved by institutions. Their ordinary
                objects disappear with them. AFTER US reframes one meaningful
                object from an ordinary person as future history — not as an AI
                novelty, but as evidence of what it meant to be human in 2026.
              </p>
              <p>
                Contribute one photograph and one sentence. The museum transforms
                it into a cataloged exhibit, then publishes it into the growing
                collection and Census of Us.
              </p>
              <button
                className="theme-btn btn-style-two"
                onClick={loadDemoObject}
                type="button"
              >
                Begin with the Demo Object
              </button>
            </div>
            <div className="image-column">
              <img
                alt="Catalog rendering of a preserved house key"
                src={asset("artifact-key-case.png")}
              />
            </div>
          </div>
        </section>

        <section className="feature-section">
          <div className="auto-container feature-grid">
            <div>
              <div className="sec-title">
                <span className="title">Halls</span>
                <h2>On View</h2>
              </div>
              <p>
                The museum organizes contributions by emotional theme — the
                reasons people choose to preserve what they preserve.
              </p>
            </div>
            <ul className="features-list">
              {themesOnView.map((theme) => (
                <li key={theme}>
                  <button onClick={() => goTo("museum")} type="button">
                    {theme}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="contribute-section" id="contribute">
          <div className="auto-container">
            <div className="sec-title-two text-center">
              <span className="title">Contribute</span>
              <h2>Preserve One Object</h2>
              <p>
                A house key is already loaded for a fast walkthrough. Press
                Generate and Publish — or replace it with your own object.
              </p>
            </div>

            <div className="demo-callout">
              <div>
                <strong>
                  {isDemoLoaded ? "Demo object ready" : "Custom object loaded"}
                </strong>
                <p>
                  {isDemoLoaded
                    ? "House key · “This opened my first home.” Click Generate and Publish to see the transformation."
                    : "Your photo and sentence will become a 2526 exhibit, then enter the gallery and Census."}
                </p>
              </div>
              {!isDemoLoaded ? (
                <button onClick={loadDemoObject} type="button">
                  Reload demo object
                </button>
              ) : null}
            </div>

            <ol className="contribute-steps">
              <li className="is-active">1 · Photograph</li>
              <li className={isCataloging || isPublished ? "is-active" : ""}>
                2 · Transform
              </li>
              <li className={isPublished ? "is-active" : ""}>3 · Publish</li>
            </ol>

            <form className="contribute-form" onSubmit={publishExhibit}>
              <label className="photo-drop">
                <img alt="Object preview" src={imagePreview} />
                <input
                  accept="image/*"
                  disabled={isCataloging}
                  onChange={handleImage}
                  type="file"
                />
                <span>{isCataloging ? "Cataloging…" : "Upload photo"}</span>
              </label>

              <div className="field-stack">
                <label>
                  What is it?
                  <input
                    disabled={isCataloging}
                    onChange={(event) => {
                      setObjectName(event.target.value);
                      setIsPublished(false);
                    }}
                    required
                    value={objectName}
                  />
                </label>
                <label>
                  What did it mean in 2026?
                  <textarea
                    disabled={isCataloging}
                    maxLength={140}
                    onChange={(event) => {
                      setMeaning(event.target.value);
                      setIsPublished(false);
                    }}
                    required
                    value={meaning}
                  />
                  <span className="char-count">{meaning.length}/140</span>
                </label>
                <label>
                  Location, optional
                  <input
                    disabled={isCataloging}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="City or campus"
                    value={location}
                  />
                </label>
                <button
                  className="theme-btn btn-style-one wide"
                  disabled={isCataloging}
                  type="submit"
                >
                  {isCataloging
                    ? "Cataloging into 2526…"
                    : isPublished
                      ? "Publish Another Object"
                      : "Generate and Publish"}
                </button>
                <p className={`public-note ${isPublished ? "is-published" : ""}`}>
                  {isPublished
                    ? "Published. Your exhibit is in the gallery below and the Census of Us has updated."
                    : "Your contribution is preserved in this museum catalog and updates the public Census as you explore."}
                </p>
                {isPublished ? (
                  <div className="post-publish-actions">
                    <button
                      className="text-link"
                      onClick={() => goTo("detail")}
                      type="button"
                    >
                      View transformed exhibit →
                    </button>
                    <button
                      className="text-link"
                      onClick={() => goTo("census")}
                      type="button"
                    >
                      See Census update →
                    </button>
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </section>

        <section className="event-section" id="museum">
          <div className="auto-container">
            <div className="sec-title-two text-center">
              <span className="title">Exhibitions</span>
              <h2>Newest in the Collection</h2>
              <p>
                {visitorContributions > 0
                  ? `${visitorContributions} visitor contribution${visitorContributions === 1 ? "" : "s"} added to the opening collection.`
                  : "Opening collection on view. Your contribution will appear at the top."}
              </p>
            </div>

            <div className="event-grid">
              {exhibits.map((exhibit) => (
                <article
                  className={
                    selectedExhibit.id === exhibit.id
                      ? "event-block selected"
                      : "event-block"
                  }
                  key={exhibit.id}
                >
                  <button
                    className="event-trigger"
                    onClick={() => {
                      setSelectedExhibit(exhibit);
                      goTo("detail");
                    }}
                    type="button"
                  >
                    {justPublishedId === exhibit.id ? (
                      <span className="new-badge">Just cataloged</span>
                    ) : null}
                    <div className="image-box">
                      <img
                        alt={exhibit.objectName}
                        src={exhibit.originalImageUrl}
                      />
                    </div>
                    <div className="lower-content">
                      <div className="info">
                        <span aria-hidden="true">◆</span>
                        Theme <em>{exhibit.theme}</em>
                      </div>
                      <h3>{exhibit.futureTitle}</h3>
                      <span className="read-more">
                        View Exhibit <i>→</i>
                      </span>
                    </div>
                  </button>
                </article>
              ))}
            </div>

            <div className="btn-box">
              <button
                className="theme-btn btn-style-two"
                onClick={resetDemo}
                type="button"
              >
                Restore Opening Collection
              </button>
            </div>
          </div>
        </section>

        <section
          className="testimonial-section"
          style={{ backgroundImage: "url(/template/bg/2.png)" }}
        >
          <div className="auto-container">
            <div className="sec-title-two text-center light">
              <span className="title">Curatorial Voice</span>
              <h2>Featured Exhibit, 2526</h2>
            </div>
            <article className="featured-exhibit">
              <img
                alt={generatedExhibit.objectName}
                src={generatedExhibit.originalImageUrl}
              />
              <div>
                <p className="catalog-line">
                  AFTER US CATALOG · {formatCatalogDate(generatedExhibit.createdAt)}
                </p>
                <h3>{generatedExhibit.futureTitle}</h3>
                <blockquote>“{generatedExhibit.userMeaning}”</blockquote>
                <p>{generatedExhibit.futureInterpretation}</p>
                <dl>
                  <div>
                    <dt>Object</dt>
                    <dd>{generatedExhibit.objectName}</dd>
                  </div>
                  <div>
                    <dt>Theme</dt>
                    <dd>{generatedExhibit.theme}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{generatedExhibit.category}</dd>
                  </div>
                </dl>
              </div>
            </article>
          </div>
        </section>

        <section className="fun-fact-section" id="census">
          <div className="auto-container census-layout">
            <div>
              <div className="sec-title">
                <span className="title">Census of Us</span>
                <h2>What People Choose to Preserve</h2>
              </div>
              <p>
                A public data hall inside the museum. These counts update live as
                contributions enter the collection — patterns of belonging, care,
                memory, and survival made visible.
              </p>
              <div className="census-number">
                <strong>{exhibits.length}</strong>
                <span>objects preserved</span>
              </div>
              {visitorContributions > 0 ? (
                <p className="census-live">
                  Including {visitorContributions} added in this visit.
                </p>
              ) : null}
            </div>

            <div className="fact-grid">
              {themeCounts.slice(0, 4).map(([theme, count]) => (
                <div className="fact-column" key={theme}>
                  <div className="inner">
                    <div className="icon-box" aria-hidden="true">
                      {Math.round((count / exhibits.length) * 100)}%
                    </div>
                    <h4>{theme}</h4>
                    <p>
                      {count} exhibit{count === 1 ? "" : "s"}
                    </p>
                    <div className="meter">
                      <i style={{ width: `${(count / maxThemeCount) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="category-panel">
              <h3>Categories</h3>
              {categoryCounts.map(([category, count]) => (
                <p key={category}>
                  <span>{category}</span>
                  <i style={{ width: `${(count / maxCategoryCount) * 100}%` }} />
                  <b>{count}</b>
                </p>
              ))}
              <h3 className="recent-heading">Recent additions</h3>
              <ul className="recent-list">
                {recentExhibits.map((exhibit) => (
                  <li key={exhibit.id}>
                    <button
                      onClick={() => {
                        setSelectedExhibit(exhibit);
                        goTo("detail");
                      }}
                      type="button"
                    >
                      <strong>{exhibit.futureTitle}</strong>
                      <span>{exhibit.theme}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="detail-section" id="detail">
          <div className="auto-container">
            <div className="sec-title">
              <span className="title">
                {justPublishedId === selectedExhibit.id
                  ? "Just Cataloged"
                  : "Single Exhibit"}
              </span>
              <h2>{selectedExhibit.futureTitle}</h2>
            </div>

            {justPublishedId === selectedExhibit.id ? (
              <div className="transform-banner">
                Transformation complete — ordinary object from 2026, reframed as a
                museum exhibit from 2526.
              </div>
            ) : null}

            <div className="transform-compare">
              <article>
                <p className="compare-label">2026 · As contributed</p>
                <img
                  alt={selectedExhibit.objectName}
                  src={selectedExhibit.originalImageUrl}
                />
                <h3>{selectedExhibit.objectName}</h3>
                <blockquote>“{selectedExhibit.userMeaning}”</blockquote>
              </article>
              <article className="compare-future">
                <p className="compare-label">2526 · As cataloged</p>
                <p className="catalog-line">
                  AFTER US CATALOG · {formatCatalogDate(selectedExhibit.createdAt)}
                </p>
                <h3>{selectedExhibit.futureTitle}</h3>
                <p>{selectedExhibit.futureInterpretation}</p>
                <dl>
                  <div>
                    <dt>Theme</dt>
                    <dd>{selectedExhibit.theme}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{selectedExhibit.category}</dd>
                  </div>
                  <div>
                    <dt>Material</dt>
                    <dd>{selectedExhibit.material}</dd>
                  </div>
                  {selectedExhibit.location ? (
                    <div>
                      <dt>Location</dt>
                      <dd>{selectedExhibit.location}</dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            </div>

            <div className="detail-next">
              <button
                className="theme-btn btn-style-one"
                onClick={() => goTo("census")}
                type="button"
              >
                Explore Census of Us
              </button>
              <button
                className="theme-btn btn-style-two"
                onClick={() => goTo("museum")}
                type="button"
              >
                Back to Gallery
              </button>
              <button
                className="theme-btn btn-style-two"
                onClick={loadDemoObject}
                type="button"
              >
                Contribute Again
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="main-footer">
        <div className="auto-container footer-grid">
          <div>
            <strong>AFTER US</strong>
            <p>The Museum of Now · Catalog year 2526</p>
          </div>
          <div>
            <button onClick={loadDemoObject} type="button">
              Try Demo
            </button>
            <button onClick={() => goTo("museum")} type="button">
              Gallery
            </button>
            <button onClick={() => goTo("census")} type="button">
              Census
            </button>
          </div>
          <p>
            A living archive of ordinary human life — contribute one object and
            watch the museum grow.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
