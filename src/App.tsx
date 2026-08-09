import { ChangeEvent, FormEvent, useMemo, useState } from "react";

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

type Section = "home" | "contribute" | "museum" | "census";

const asset = (name: string) => `/assets/${name}`;

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
  if (source.match(/home|belong|room|door|key|place/)) return "Belonging";
  if (source.match(/mother|father|grand|child|family|friend|dog/)) return "Family";
  if (source.match(/survive|hard|grief|safe|carry|lost/)) return "Survival";
  if (source.match(/remember|memory|past|old|photo|handwriting/)) return "Memory";
  if (source.match(/work|study|make|build|job/)) return "Work & Purpose";
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

function createExhibit(
  objectName: string,
  userMeaning: string,
  location: string,
  imageUrl: string,
): Exhibit {
  const theme = chooseTheme(`${objectName} ${userMeaning}`);
  const category = inferCategory(objectName);
  const cleanName = objectName.trim() || "Unnamed object";
  const titleMap: Record<string, string> = {
    Belonging: `${cleanName} of the First Place`,
    Family: `${cleanName} for Keeping Someone Near`,
    Survival: `${cleanName} That Carried the Body`,
    Memory: `${cleanName} Against Forgetting`,
    "Work & Purpose": `${cleanName} for Making a Day`,
    Care: `${cleanName} of Ordinary Care`,
  };

  return {
    id: `exhibit-${Date.now()}`,
    objectName: cleanName,
    originalImageUrl: imageUrl,
    userMeaning: userMeaning.trim(),
    futureTitle: titleMap[theme],
    futureInterpretation: `Cataloged in 2526, this ${cleanName.toLowerCase()} is understood as evidence that people in 2026 placed memory inside useful things. The contributor's sentence, "${userMeaning.trim()}", suggests an object valued less for rarity than for the life it quietly held together.`,
    theme,
    category,
    material: "Mixed material",
    location: location.trim() || undefined,
    createdAt: new Date().toISOString(),
    views: 1,
    reactions: 0,
  };
}

function App() {
  const [section, setSection] = useState<Section>("home");
  const [exhibits, setExhibits] = useState<Exhibit[]>(loadExhibits);
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit>(exhibits[0]);
  const [generatedExhibit, setGeneratedExhibit] = useState<Exhibit>(exhibits[0]);
  const [objectName, setObjectName] = useState("House key");
  const [meaning, setMeaning] = useState("This opened my first home.");
  const [location, setLocation] = useState("");
  const [imagePreview, setImagePreview] = useState(asset("upload-key.png"));
  const [isPublished, setIsPublished] = useState(false);

  const themeCounts = useMemo(() => getTopCounts(exhibits, "theme"), [exhibits]);
  const categoryCounts = useMemo(
    () => getTopCounts(exhibits, "category"),
    [exhibits],
  );
  const maxThemeCount = Math.max(...themeCounts.map(([, count]) => count), 1);

  const publishExhibit = (event: FormEvent) => {
    event.preventDefault();
    const next = createExhibit(objectName, meaning, location, imagePreview);
    const nextExhibits = [next, ...exhibits];
    setGeneratedExhibit(next);
    setSelectedExhibit(next);
    setExhibits(nextExhibits);
    saveExhibits(nextExhibits);
    setIsPublished(true);
    setSection("museum");
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resetDemo = () => {
    const next = seedExhibits;
    setExhibits(next);
    setGeneratedExhibit(next[0]);
    setSelectedExhibit(next[0]);
    saveExhibits(next);
    setObjectName("House key");
    setMeaning("This opened my first home.");
    setLocation("");
    setImagePreview(asset("upload-key.png"));
    setIsPublished(false);
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => setSection("home")}>
          <span>AFTER US</span>
          <small>The Museum of Now</small>
        </button>
        <nav aria-label="Primary navigation">
          {(["home", "contribute", "museum", "census"] as Section[]).map(
            (item) => (
              <button
                className={section === item ? "active" : ""}
                key={item}
                onClick={() => setSection(item)}
              >
                {item === "home"
                  ? "Home"
                  : item === "museum"
                    ? "Museum"
                    : item === "census"
                      ? "Census"
                      : "Contribute"}
              </button>
            ),
          )}
        </nav>
        <button className="header-action" onClick={() => setSection("contribute")}>
          Contribute an Object
        </button>
      </header>

      <main>
        <section className="hero-grid" id="home">
          <div className="premise">
            <h1>The Museum of Now</h1>
            <p>
              Photograph one ordinary object. Preserve what it meant to be human
              in 2026.
            </p>
          </div>

          <ContributionPanel
            handleImage={handleImage}
            imagePreview={imagePreview}
            isPublished={isPublished}
            meaning={meaning}
            objectName={objectName}
            onSubmit={publishExhibit}
            setLocation={setLocation}
            setMeaning={setMeaning}
            setObjectName={setObjectName}
            location={location}
          />

          <ExhibitCase exhibit={generatedExhibit} />

          <CensusPanel
            categoryCounts={categoryCounts}
            exhibits={exhibits}
            maxThemeCount={maxThemeCount}
            setSection={setSection}
            themeCounts={themeCounts}
          />
        </section>

        <section className="collection-rail" id="museum">
          <div className="section-heading">
            <div>
              <h2>Newest in the collection</h2>
              <p>Every object enters the same public institution.</p>
            </div>
            <button onClick={resetDemo}>Reset demo collection</button>
          </div>
          <div className="gallery-row">
            {exhibits.map((exhibit) => (
              <button
                className={
                  selectedExhibit.id === exhibit.id
                    ? "gallery-item selected"
                    : "gallery-item"
                }
                key={exhibit.id}
                onClick={() => {
                  setSelectedExhibit(exhibit);
                  setSection("museum");
                }}
              >
                <img src={exhibit.originalImageUrl} alt="" />
                <span>{exhibit.objectName}</span>
                <small>{exhibit.theme}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="detail-and-census">
          <ExhibitDetail exhibit={selectedExhibit} />
          <CensusHall
            categoryCounts={categoryCounts}
            exhibits={exhibits}
            themeCounts={themeCounts}
          />
        </section>
      </main>
    </div>
  );
}

function ContributionPanel({
  handleImage,
  imagePreview,
  isPublished,
  location,
  meaning,
  objectName,
  onSubmit,
  setLocation,
  setMeaning,
  setObjectName,
}: {
  handleImage: (event: ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string;
  isPublished: boolean;
  location: string;
  meaning: string;
  objectName: string;
  onSubmit: (event: FormEvent) => void;
  setLocation: (value: string) => void;
  setMeaning: (value: string) => void;
  setObjectName: (value: string) => void;
}) {
  return (
    <form className="contribution-panel" id="contribute" onSubmit={onSubmit}>
      <div className="panel-title">
        <h2>Contribute an Object</h2>
        <div className="steps" aria-label="Contribution steps">
          <span>1 Photograph</span>
          <span>2 Describe</span>
          <span>3 Publish</span>
        </div>
      </div>

      <div className="contribution-body">
        <label className="photo-drop">
          <img src={imagePreview} alt="Object preview" />
          <input accept="image/*" onChange={handleImage} type="file" />
          <span>Upload photo</span>
        </label>

        <div className="field-stack">
          <label>
            What is it?
            <input
              onChange={(event) => setObjectName(event.target.value)}
              required
              value={objectName}
            />
          </label>
          <label>
            What did it mean in 2026?
            <textarea
              maxLength={140}
              onChange={(event) => setMeaning(event.target.value)}
              required
              value={meaning}
            />
          </label>
          <label>
            Location, optional
            <input
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City or campus"
              value={location}
            />
          </label>
        </div>
      </div>

      <button className="primary-button wide" type="submit">
        Generate and Publish
      </button>
      <p className="public-note">
        Your submission is public and permanent inside the shared museum.
        {isPublished ? " The Census of Us has updated." : ""}
      </p>
    </form>
  );
}

function ExhibitCase({ exhibit }: { exhibit: Exhibit }) {
  return (
    <article className="exhibit-case" aria-label="Generated exhibit">
      <div className="artifact-window">
        <img src={asset("artifact-key-case.png")} alt="" />
      </div>
      <div className="catalog-card">
        <div className="catalog-line">AFTER US CATALOG - 2526.17.8841</div>
        <h2>{exhibit.futureTitle}</h2>
        <div className="catalog-meta">
          <span>
            Year 2526
            <small>Cataloged</small>
          </span>
          <span>
            {exhibit.objectName}
            <small>Object</small>
          </span>
          <span>
            {exhibit.theme}
            <small>Theme</small>
          </span>
        </div>
        <blockquote>"{exhibit.userMeaning}"</blockquote>
      </div>
    </article>
  );
}

function CensusPanel({
  categoryCounts,
  exhibits,
  maxThemeCount,
  setSection,
  themeCounts,
}: {
  categoryCounts: [string, number][];
  exhibits: Exhibit[];
  maxThemeCount: number;
  setSection: (section: Section) => void;
  themeCounts: [string, number][];
}) {
  return (
    <aside className="census-panel" id="census">
      <h2>Census of Us</h2>
      <div className="orbital-map" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="stat-label">Objects preserved</p>
      <strong>{exhibits.length.toLocaleString()}</strong>
      <p className="stat-caption">From every place. By everyday people.</p>
      <div className="mini-bars">
        {themeCounts.slice(0, 6).map(([theme, count]) => (
          <div className="bar-line" key={theme}>
            <span>{theme}</span>
            <div>
              <i style={{ width: `${(count / maxThemeCount) * 100}%` }} />
            </div>
            <b>{Math.round((count / exhibits.length) * 100)}%</b>
          </div>
        ))}
      </div>
      <p className="category-note">
        Top category: {categoryCounts[0]?.[0] ?? "Awaiting first object"}
      </p>
      <button className="outline-button" onClick={() => setSection("census")}>
        Explore Census
      </button>
    </aside>
  );
}

function ExhibitDetail({ exhibit }: { exhibit: Exhibit }) {
  return (
    <article className="detail-panel">
      <div>
        <p className="catalog-line">Single exhibit detail</p>
        <h2>{exhibit.futureTitle}</h2>
        <p>{exhibit.futureInterpretation}</p>
      </div>
      <div className="detail-media">
        <img src={exhibit.originalImageUrl} alt={exhibit.objectName} />
        <div>
          <h3>{exhibit.objectName}</h3>
          <p>"{exhibit.userMeaning}"</p>
          <dl>
            <div>
              <dt>Theme</dt>
              <dd>{exhibit.theme}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{exhibit.category}</dd>
            </div>
            <div>
              <dt>Material</dt>
              <dd>{exhibit.material}</dd>
            </div>
            {exhibit.location ? (
              <div>
                <dt>Location</dt>
                <dd>{exhibit.location}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </article>
  );
}

function CensusHall({
  categoryCounts,
  exhibits,
  themeCounts,
}: {
  categoryCounts: [string, number][];
  exhibits: Exhibit[];
  themeCounts: [string, number][];
}) {
  const maxCategoryCount = Math.max(...categoryCounts.map(([, count]) => count), 1);

  return (
    <section className="census-hall">
      <p className="catalog-line">Census of Us</p>
      <h2>What people choose to preserve</h2>
      <div className="census-number">
        <strong>{exhibits.length}</strong>
        <span>objects preserved</span>
      </div>
      <div className="census-columns">
        <div>
          <h3>Emotional themes</h3>
          {themeCounts.map(([theme, count]) => (
            <p key={theme}>
              <span>{theme}</span>
              <b>{count}</b>
            </p>
          ))}
        </div>
        <div>
          <h3>Categories</h3>
          {categoryCounts.map(([category, count]) => (
            <p key={category}>
              <span>{category}</span>
              <i style={{ width: `${(count / maxCategoryCount) * 100}%` }} />
              <b>{count}</b>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default App;
