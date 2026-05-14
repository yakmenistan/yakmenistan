import { useEffect, useRef, useState } from "react";
import "./App.css";

const SLIDE_COUNT = 5;
const U2_SLIDE_COUNT = 3;
const U3_SLIDE_COUNT = 4;
const U4_SLIDE_COUNT = 3;
const U5_SLIDE_COUNT = 4;
const U6_SLIDE_COUNT = 4;
const U7_SLIDE_COUNT = 3;
const SWIPE_THRESHOLD = 40;
const WHEEL_THRESHOLD = 30;
const TRANSITION_MS = 600;

const getAssetUrl = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const SLIDES = [
  {
    kicker: "Thinking geographically",
    title: "Where is Yakmenistan?",
    body: "Yakmenistan sits at 27.01° N, 66.37° E. Northwest of India, east of Iran, and south of Pakistan.",
    map: null,
  },
  {
    kicker: "Thinking geographically",
    title: "Political Boundaries",
    body: "The political map beside shows the defined borders of Yakmenistan and its position relative to neighbouring states.",
    map: "/political.png",
  },
  {
    kicker: "Thinking geographically",
    title: "Terrain & Landmarks",
    body: "Yakmenistan's physical geography includes key mountains, rivers, and other natural features that shaped where settlement and development occurred.",
    map: "/physical.png",
  },
  {
    kicker: "Thinking geographically",
    title: "Population Density",
    body: "This choropleth map shows the population density per kilometer in different regions of Yakmenistan.",
    map: "/choropleth.png",
  },
  {
    kicker: "Thinking geographically",
    title: "Immigration & Emigration",
    body: "This migration map tracks the patterns of immigration and emigration across regions of Yakmenistan.",
    map: "/migration.png",
  },
];

const U2_SLIDES = [
  {
    kicker: "Population & Migration",
    title: "Population distribution",
    body: "The population is dispersed in the northern region and clustered alongside the southern coast.",
    map: null,
  },
  {
    kicker: "Population & Migration",
    title: "People & Place",
    body: "This is a stage 4 civilization. Crude Birth Rate: 15, Crude Death Rate: 10. Birth and death rates are as such because of quality infrastructure, healthcare, and education.",
    map: "/pyramid.png",
  },
  {
    kicker: "Population & Migration",
    title: "Push and Pull Factors",
    body: "The intense heat averaging ~90-120 degrees Fahrenheit is a major push factor for people to leave the country. On the contrary, the country's abundant jobs in oil and gas are a major pull factor for people to stay. This influences migration by providing job opportunities but also causing people to leave due to the intense heat.",
    map: null,
  },
];

const U3_SLIDES = [
  {
    kicker: "Cultural Patterns & Processes",
    title: "Languages and religion",
    body: "Yakmenistan is an Islamic country, the majority of the population speaks Kurdish and minority groups speak Urdu, Hindi, and Dari.",
    map: null,
  },
  {
    kicker: "Cultural Patterns & Processes",
    title: "Folk and popular culture",
    body: "The country is primarily folk culture driven with the people practicing traditions passed down through generations.",
    map: null,
  },
  {
    kicker: "Cultural Patterns & Processes",
    title: "Food traditions",
    body: "Since it is an islamic country, food traditions consist of halal foods such as lamb, chicken, fish, and agricultural products such as rice, wheat, and vegetables.",
    map: null,
  },
  {
    kicker: "Cultural Patterns & Processes",
    title: "Architecture",
    body: "A unique architecture type in Yakmenistan is a tent like structure where the roof extends to the ground. This has contributed to how the culture has diffused with relocation diffusion of the architecture spreading Yakmenistan culture.",
    map: null,
  },
];

const U4_SLIDES = [
  {
    kicker: "Political Geography",
    title: "Government & Voting System",
    body: "It is a federal government with 2 branches: executive and legislative. The person who leads the executive branch is determined by a 2 round voting system where the first round filters out the top 5 most voted and those people are moved to a 2nd round where the final decision is made.",
    map: null,
  },
  {
    kicker: "Political Geography",
    title: "International relations",
    body: "Yakmenistan regularly trades with the UAE for oil and also serves as a place for other countries to offsource jobs to: IT support, accounting, bookkeeping, etc.",
    map: null,
  },
  {
    kicker: "Political Geography",
    title: "Territorial dispute",
    body: "Due to Pakistan formerly controlling the coast across the Gulf of Oman then being taken over by Yakmenistan, there is an active territorial dispute with Pakistan wanting more direct access to the gulf. Pakistan has been unable to forge their own way because both countries are part of the UN and it consistently prevents Pakistan from enacting war.",
    map: null,
  },
];

const U5_SLIDES = [
  {
    kicker: "Agricultural and Rural land use",
    title: "Main sources of food",
    body: "The main sources of food are wheat, rice, and livestock. Crops are primarily cultivated with slash-and-burn techniques while livestock is usually grown via pastoral nomadism.",
    map: null,
  },
  {
    kicker: "Agricultural and Rural land use",
    title: "Von thunen application",
    body: "The Von Thunen model provides a foundation for how land is used relative to distance of markets: dairy and intensive practices most near, forests for fuel, crops and grain, then finally livestock and ranching. This can be shown qualitatively as livestock farmers are more out, and farmers who grow more perishable goods are closer.",
    map: "/von.jpg",
  },
  {
    kicker: "Agricultural and Rural land use",
    title: "Settlement patterns",
    body: "In the northern part of the country it is dispersed rural settlements due to increased farming in the region. In the southern part it is more nucleated near the Gulf of Oman primarily driven by the gas and oil industry.",
    map: null,
  },
  {
    kicker: "Agricultural and Rural land use",
    title: "Environmental issues",
    body: "The slash-and-burn technique allows for quick crop growth but also carries downsides. After doing slash-and-burn the soil degrades, mass deforestation occurs, and it contributes to greenhouse gases in the atmosphere.",
    map: null,
  },
];

const U6_SLIDES = [
  {
    kicker: "Cities and Urban Land-Use",
    title: "Urban model",
    body: "This Galactic city model represents Yakmenistan by providing a general structure to how cities are built",
    map: "/model.png",
  },
  {
    kicker: "Cities and Urban Land-Use",
    title: "Transportation systems",
    body: "As shown in the model there is a belt-way road that circles the city with roads coming from the central city connecting to the belt-way for transportation.",
    map: "/model.png",
  },
  {
    kicker: "Cities and Urban Land-Use",
    title: "Suburbs and zoning",
    body: "The suburbs are low density residential areas that provide space from industrial zones. Higher class suburbs is purposefully placed near the IT edge city and airport to avoid pollution, noise of processing plants, and quick access to the central city.",
    map: "/model.png",
  },
  {
    kicker: "Cities and Urban Land-Use",
    title: "Main infrastructure",
    body: "The main infrastructure consists of transportation systems, public institutions, utilities, and telecommunication.",
    map: null,
  },
];

const U7_SLIDES = [
  {
    kicker: "Industrial and Economic Development",
    title: "Economic sectors",
    body: "Distribution of economic sectors: Primary: 7% Secondary: 12% Tertiary: 68% Quaternary: 10% Quinary: 3%",
    map: null,
  },
  {
    kicker: "Industrial and Economic Development",
    title: "How trade functions",
    body: "Yakmenistan primarily trades through the Strait of Hormuz, mostly transporting textiles, oil, and agricultural products such as wheat and rice.",
    map: null,
  },
  {
    kicker: "Industrial and Economic Development",
    title: "Materials outsourced",
    body: "Alongside current oil production in Yakmenistan, they also regularly import from the United Arab Emirates for additional oil. They also outsource textile manufacturing, IT services, and software development. GDP is $3.7 trillion. ",
    map: null,
  },
];

function getActiveSection(sections) {
  let best = null;
  let bestRatio = -1;
  for (const el of sections) {
    const r = el.getBoundingClientRect();
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    const ratio = visible / window.innerHeight;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = el;
    }
  }
  return best;
}

export default function App() {
  const heroRef = useRef(null);
  const chapterRef = useRef(null);
  const trackRef = useRef(null);
  const unit2Ref = useRef(null);
  const track2Ref = useRef(null);
  const unit3Ref = useRef(null);
  const track3Ref = useRef(null);
  const unit4Ref = useRef(null);
  const track4Ref = useRef(null);
  const unit5Ref = useRef(null);
  const track5Ref = useRef(null);
  const unit6Ref = useRef(null);
  const track6Ref = useRef(null);
  const unit7Ref = useRef(null);
  const track7Ref = useRef(null);
  const endRef = useRef(null);
  const [hintOpacity, setHintOpacity] = useState(1);

  const s = useRef({
    slide: 0,
    slide2: 0,
    slide3: 0,
    slide4: 0,
    slide5: 0,
    slide6: 0,
    slide7: 0,
    transitioning: false,
    wheelAcc: 0,
    touchStartY: null,
    lastTransition: 0,
  });

  useEffect(() => {
    const update = () => {
      const vh = heroRef.current?.offsetHeight ?? window.innerHeight;
      setHintOpacity(Math.max(0, 1 - window.scrollY / (vh * 0.4)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const refs = [
      unit2Ref,
      unit3Ref,
      unit4Ref,
      unit5Ref,
      unit6Ref,
      unit7Ref,
      endRef,
    ];
    refs.forEach((ref) => {
      const el = ref.current;
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("page-below--visible");
            io.disconnect();
          }
        },
        { threshold: 0.05 },
      );
      io.observe(el);
    });
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const chapter = chapterRef.current;
    const track = trackRef.current;
    const unit2 = unit2Ref.current;
    const track2 = track2Ref.current;
    const unit3 = unit3Ref.current;
    const track3 = track3Ref.current;
    const unit4 = unit4Ref.current;
    const track4 = track4Ref.current;
    const unit5 = unit5Ref.current;
    const track5 = track5Ref.current;
    const unit6 = unit6Ref.current;
    const track6 = track6Ref.current;
    const unit7 = unit7Ref.current;
    const track7 = track7Ref.current;
    const end = endRef.current;

    if (
      !hero ||
      !chapter ||
      !track ||
      !unit2 ||
      !track2 ||
      !unit3 ||
      !track3 ||
      !unit4 ||
      !track4 ||
      !unit5 ||
      !track5 ||
      !unit6 ||
      !track6 ||
      !unit7 ||
      !track7 ||
      !end
    )
      return;

    const sections = [
      hero,
      chapter,
      unit2,
      unit3,
      unit4,
      unit5,
      unit6,
      unit7,
      end,
    ];

    const dots = chapter.querySelectorAll(".slide-dot");
    const dots2 = unit2.querySelectorAll(".slide-dot");
    const dots3 = unit3.querySelectorAll(".slide-dot");
    const dots4 = unit4.querySelectorAll(".slide-dot");
    const dots5 = unit5.querySelectorAll(".slide-dot");
    const dots6 = unit6.querySelectorAll(".slide-dot");
    const dots7 = unit7.querySelectorAll(".slide-dot");

    const updateDots = (i) =>
      dots.forEach((d, j) => d.classList.toggle("slide-dot--active", j === i));
    const updateDots2 = (i) =>
      dots2.forEach((d, j) => d.classList.toggle("slide-dot--active", j === i));
    const updateDots3 = (i) =>
      dots3.forEach((d, j) => d.classList.toggle("slide-dot--active", j === i));
    const updateDots4 = (i) =>
      dots4.forEach((d, j) => d.classList.toggle("slide-dot--active", j === i));
    const updateDots5 = (i) =>
      dots5.forEach((d, j) => d.classList.toggle("slide-dot--active", j === i));
    const updateDots6 = (i) =>
      dots6.forEach((d, j) => d.classList.toggle("slide-dot--active", j === i));
    const updateDots7 = (i) =>
      dots7.forEach((d, j) => d.classList.toggle("slide-dot--active", j === i));

    const setSlideGeneric = (
      slideKey,
      index,
      trackEl,
      updateFn,
      instant = false,
    ) => {
      s.current[slideKey] = index;
      updateFn(index);
      if (instant) {
        trackEl.style.transition = "none";
        trackEl.style.transform = `translate3d(${-index * 100}vw,0,0)`;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            trackEl.style.transition = "";
          }),
        );
      } else {
        trackEl.style.transform = `translate3d(${-index * 100}vw,0,0)`;
      }
    };

    const smoothScrollTo = (el) =>
      el.scrollIntoView({ behavior: "smooth", block: "start" });

    const canGo = () => {
      if (s.current.transitioning) return false;
      if (performance.now() - s.current.lastTransition < TRANSITION_MS)
        return false;
      return true;
    };

    const go = (dir) => {
      if (!canGo()) return;
      s.current.transitioning = true;
      s.current.lastTransition = performance.now();
      setTimeout(() => {
        s.current.transitioning = false;
      }, TRANSITION_MS);

      const active = getActiveSection(sections);

      if (active === hero) {
        if (dir > 0) {
          setSlideGeneric("slide", 0, track, updateDots, true);
          smoothScrollTo(chapter);
        }
        return;
      }
      if (active === chapter) {
        const next = s.current.slide + dir;
        if (next >= 0 && next < SLIDE_COUNT) {
          setSlideGeneric("slide", next, track, updateDots);
        } else if (dir > 0) {
          setSlideGeneric("slide2", 0, track2, updateDots2, true);
          smoothScrollTo(unit2);
        } else {
          setSlideGeneric("slide", 0, track, updateDots, true);
          smoothScrollTo(hero);
        }
        return;
      }
      if (active === unit2) {
        const next = s.current.slide2 + dir;
        if (next >= 0 && next < U2_SLIDE_COUNT) {
          setSlideGeneric("slide2", next, track2, updateDots2);
        } else if (dir > 0) {
          setSlideGeneric("slide3", 0, track3, updateDots3, true);
          smoothScrollTo(unit3);
        } else {
          setSlideGeneric("slide", SLIDE_COUNT - 1, track, updateDots, true);
          smoothScrollTo(chapter);
        }
        return;
      }
      if (active === unit3) {
        const next = s.current.slide3 + dir;
        if (next >= 0 && next < U3_SLIDE_COUNT) {
          setSlideGeneric("slide3", next, track3, updateDots3);
        } else if (dir > 0) {
          setSlideGeneric("slide4", 0, track4, updateDots4, true);
          smoothScrollTo(unit4);
        } else {
          setSlideGeneric(
            "slide2",
            U2_SLIDE_COUNT - 1,
            track2,
            updateDots2,
            true,
          );
          smoothScrollTo(unit2);
        }
        return;
      }
      if (active === unit4) {
        const next = s.current.slide4 + dir;
        if (next >= 0 && next < U4_SLIDE_COUNT) {
          setSlideGeneric("slide4", next, track4, updateDots4);
        } else if (dir > 0) {
          setSlideGeneric("slide5", 0, track5, updateDots5, true);
          smoothScrollTo(unit5);
        } else {
          setSlideGeneric(
            "slide3",
            U3_SLIDE_COUNT - 1,
            track3,
            updateDots3,
            true,
          );
          smoothScrollTo(unit3);
        }
        return;
      }
      if (active === unit5) {
        const next = s.current.slide5 + dir;
        if (next >= 0 && next < U5_SLIDE_COUNT) {
          setSlideGeneric("slide5", next, track5, updateDots5);
        } else if (dir > 0) {
          setSlideGeneric("slide6", 0, track6, updateDots6, true);
          smoothScrollTo(unit6);
        } else {
          setSlideGeneric(
            "slide4",
            U4_SLIDE_COUNT - 1,
            track4,
            updateDots4,
            true,
          );
          smoothScrollTo(unit4);
        }
        return;
      }
      if (active === unit6) {
        const next = s.current.slide6 + dir;
        if (next >= 0 && next < U6_SLIDE_COUNT) {
          setSlideGeneric("slide6", next, track6, updateDots6);
        } else if (dir > 0) {
          setSlideGeneric("slide7", 0, track7, updateDots7, true);
          smoothScrollTo(unit7);
        } else {
          setSlideGeneric(
            "slide5",
            U5_SLIDE_COUNT - 1,
            track5,
            updateDots5,
            true,
          );
          smoothScrollTo(unit5);
        }
        return;
      }
      if (active === unit7) {
        const next = s.current.slide7 + dir;
        if (next >= 0 && next < U7_SLIDE_COUNT) {
          setSlideGeneric("slide7", next, track7, updateDots7);
        } else if (dir > 0) {
          smoothScrollTo(end);
        } else {
          setSlideGeneric(
            "slide6",
            U6_SLIDE_COUNT - 1,
            track6,
            updateDots6,
            true,
          );
          smoothScrollTo(unit6);
        }
        return;
      }
      if (active === end) {
        if (dir < 0) {
          setSlideGeneric(
            "slide7",
            U7_SLIDE_COUNT - 1,
            track7,
            updateDots7,
            true,
          );
          smoothScrollTo(unit7);
        }
        return;
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      s.current.wheelAcc += e.deltaY;
      if (Math.abs(s.current.wheelAcc) < WHEEL_THRESHOLD) return;
      const dir = s.current.wheelAcc > 0 ? 1 : -1;
      s.current.wheelAcc = 0;
      go(dir);
    };

    const onTouchStart = (e) => {
      s.current.touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      if (s.current.touchStartY == null) return;
      const dy = s.current.touchStartY - e.changedTouches[0].clientY;
      s.current.touchStartY = null;
      if (Math.abs(dy) < SWIPE_THRESHOLD) return;
      go(dy > 0 ? 1 : -1);
    };

    const onKeyDown = (e) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      }
    };

    const onResize = () => {
      setSlideGeneric("slide", s.current.slide, track, updateDots, true);
      setSlideGeneric("slide2", s.current.slide2, track2, updateDots2, true);
      setSlideGeneric("slide3", s.current.slide3, track3, updateDots3, true);
      setSlideGeneric("slide4", s.current.slide4, track4, updateDots4, true);
      setSlideGeneric("slide5", s.current.slide5, track5, updateDots5, true);
      setSlideGeneric("slide6", s.current.slide6, track6, updateDots6, true);
      setSlideGeneric("slide7", s.current.slide7, track7, updateDots7, true);
    };

    onResize();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const goToChapter = (e) => {
    e.preventDefault();
    s.current.slide = 0;
    if (trackRef.current)
      trackRef.current.style.transform = "translate3d(0,0,0)";
    chapterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderSlides = (slides, unitLabel, roman, trackRef, slideCount) => (
    <div className="horizontal-chapter__sticky">
      <div ref={trackRef} className="horizontal-chapter__track">
        {slides.map((slide, i) => (
          <div
            key={slide.kicker + i}
            className={`horizontal-chapter__panel horizontal-chapter__panel--s${(i % 5) + 1}`}
          >
            <div
              className={`horizontal-chapter__panel-inner${slide.map ? " has-map" : ""}`}
            >
              <div className="horizontal-chapter__text-block">
                <span className="horizontal-chapter__roman" aria-hidden>
                  {roman}
                </span>
                <span className="horizontal-chapter__unit-label">
                  {unitLabel}
                </span>
                <span className="horizontal-chapter__eyebrow">
                  {slide.kicker} · {i + 1}/{slideCount}
                </span>
                <h2 className="horizontal-chapter__slide-title">
                  {slide.title}
                </h2>
                <p className="horizontal-chapter__copy">{slide.body}</p>
              </div>
              {slide.map && (
                <div className="horizontal-chapter__map-frame">
                  <img
                    src={getAssetUrl(slide.map)}
                    alt={`${slide.kicker} map`}
                    className="horizontal-chapter__map-img"
                    draggable={false}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDots = (slides) => (
    <div className="slide-dots" aria-hidden>
      {slides.map((_, i) => (
        <span
          key={i}
          className={`slide-dot${i === 0 ? " slide-dot--active" : ""}`}
          data-index={i}
        />
      ))}
    </div>
  );

  return (
    <>
      <main ref={heroRef} className="hero" aria-label="Yakmenistan showcase">
        <div className="hero__glow" aria-hidden />
        <div className="hero__grain" aria-hidden />
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="hero__title-inner">Yakmenistan</span>
          </h1>
          <p className="hero__subtitle">Brody scoggins</p>
          <div className="hero__rule" aria-hidden />
        </div>
        <a
          className="hero__scroll-hint"
          href="#unit-1-slides"
          onClick={goToChapter}
          style={{ opacity: hintOpacity }}
        >
          <span className="hero__scroll-label">Explore</span>
          <span className="hero__scroll-arrow">
            <svg width="12" height="18" viewBox="0 0 20 28" fill="currentColor">
              <path d="M9.35 1h1.3v14.5h3.15L10 24.5 6.2 15.5h3.15V1Z" />
            </svg>
          </span>
        </a>
      </main>

      <section
        id="unit-1-slides"
        ref={chapterRef}
        className="horizontal-chapter"
        style={{ "--slide-count": SLIDE_COUNT }}
      >
        {renderSlides(SLIDES, "Unit 1", "I", trackRef, SLIDE_COUNT)}
        {renderDots(SLIDES)}
      </section>

      <section
        id="unit-2-slides"
        ref={unit2Ref}
        className="horizontal-chapter"
        style={{ "--slide-count": U2_SLIDE_COUNT }}
      >
        {renderSlides(U2_SLIDES, "Unit 2", "II", track2Ref, U2_SLIDE_COUNT)}
        {renderDots(U2_SLIDES)}
      </section>

      <section
        id="unit-3-slides"
        ref={unit3Ref}
        className="horizontal-chapter"
        style={{ "--slide-count": U3_SLIDE_COUNT }}
      >
        {renderSlides(U3_SLIDES, "Unit 3", "III", track3Ref, U3_SLIDE_COUNT)}
        {renderDots(U3_SLIDES)}
      </section>

      <section
        id="unit-4-slides"
        ref={unit4Ref}
        className="horizontal-chapter"
        style={{ "--slide-count": U4_SLIDE_COUNT }}
      >
        {renderSlides(U4_SLIDES, "Unit 4", "IV", track4Ref, U4_SLIDE_COUNT)}
        {renderDots(U4_SLIDES)}
      </section>

      <section
        id="unit-5-slides"
        ref={unit5Ref}
        className="horizontal-chapter"
        style={{ "--slide-count": U5_SLIDE_COUNT }}
      >
        {renderSlides(U5_SLIDES, "Unit 5", "V", track5Ref, U5_SLIDE_COUNT)}
        {renderDots(U5_SLIDES)}
      </section>

      <section
        id="unit-6-slides"
        ref={unit6Ref}
        className="horizontal-chapter"
        style={{ "--slide-count": U6_SLIDE_COUNT }}
      >
        {renderSlides(U6_SLIDES, "Unit 6", "VI", track6Ref, U6_SLIDE_COUNT)}
        {renderDots(U6_SLIDES)}
      </section>

      <section
        id="unit-7-slides"
        ref={unit7Ref}
        className="horizontal-chapter"
        style={{ "--slide-count": U7_SLIDE_COUNT }}
      >
        {renderSlides(U7_SLIDES, "Unit 7", "VII", track7Ref, U7_SLIDE_COUNT)}
        {renderDots(U7_SLIDES)}
      </section>

      <main ref={endRef} className="hero" aria-label="The End">
        <div className="hero__glow" aria-hidden />
        <div className="hero__grain" aria-hidden />
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="hero__title-inner">The End</span>
          </h1>
          <div className="hero__rule" aria-hidden />
        </div>
      </main>
    </>
  );
}
