import { useEffect, useRef, useState } from "react";
import "./App.css";

const SLIDE_COUNT = 5;
const U2_SLIDE_COUNT = 3;
const U3_SLIDE_COUNT = 4;
const U4_SLIDE_COUNT = 2;
const SWIPE_THRESHOLD = 40;
const WHEEL_THRESHOLD = 30;
const TRANSITION_MS = 600;

const SLIDES = [
  {
    kicker: "Absolute & Relative Location",
    title: "Where is Yakmenistan?",
    body: "Yakmenistan sits at 27.01° N, 66.37° E. Northwest of India, east of Iran, and south of Pakistan.",
    map: null,
  },
  {
    kicker: "Political Map",
    title: "Political Boundaries",
    body: "The political map beside shows the defined borders of Yakmenistan and its position relative to neighbouring states.",
    map: "/political.png",
  },
  {
    kicker: "Physical Map",
    title: "Terrain & Landmarks",
    body: "Yakmenistan's physical geography includes key mountains, rivers, and other natural features that shaped where settlement and development occurred.",
    map: "/physical.png",
  },
  {
    kicker: "Choropleth Map",
    title: "Population Density",
    body: "This choropleth map shows the population density per kilometer in different regions of Yakmenistan.",
    map: "/choropleth.png",
  },
  {
    kicker: "Migration Map",
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
    kicker: "Population pyramid",
    title: "People & Place",
    body: "This is a stage 4 civilization. Crude Birth Rate: 15, Crude Death Rate: 10. Birth and death rates are as such because of quality infrastructure, healthcare, and education.",
    map: "/pyramid.png",
  },
  {
    kicker: "Push & pull factors",
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
    title: "Type of government",
    body: "The country utilizes a democratic voting system .",
    map: null,
  },
  {
    kicker: "Your Kicker",
    title: "Your Title",
    body: "Your body text here.",
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
    if (ratio > bestRatio) { bestRatio = ratio; best = el; }
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
  const [hintOpacity, setHintOpacity] = useState(1);

  const s = useRef({
    slide: 0,
    slide2: 0,
    slide3: 0,
    slide4: 0,
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
    const el = unit2Ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("page-below--visible"); io.disconnect(); } },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
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
    if (!hero || !chapter || !track || !unit2 || !track2 || !unit3 || !track3 || !unit4 || !track4) return;

    const sections = [hero, chapter, unit2, unit3, unit4];

    const dots = chapter.querySelectorAll(".slide-dot");
    const updateDots = (index) => {
      dots.forEach((d, i) => d.classList.toggle("slide-dot--active", i === index));
    };

    const dots2 = unit2.querySelectorAll(".slide-dot");
    const updateDots2 = (index) => {
      dots2.forEach((d, i) => d.classList.toggle("slide-dot--active", i === index));
    };

    const dots3 = unit3.querySelectorAll(".slide-dot");
    const updateDots3 = (index) => {
      dots3.forEach((d, i) => d.classList.toggle("slide-dot--active", i === index));
    };

    const dots4 = unit4.querySelectorAll(".slide-dot");
    const updateDots4 = (index) => {
      dots4.forEach((d, i) => d.classList.toggle("slide-dot--active", i === index));
    };

    const setSlide = (index, instant = false) => {
      s.current.slide = index;
      updateDots(index);
      if (instant) {
        track.style.transition = "none";
        track.style.transform = `translate3d(${-index * 100}vw,0,0)`;
        requestAnimationFrame(() => requestAnimationFrame(() => { track.style.transition = ""; }));
      } else {
        track.style.transform = `translate3d(${-index * 100}vw,0,0)`;
      }
    };

    const setSlide2 = (index, instant = false) => {
      s.current.slide2 = index;
      updateDots2(index);
      if (instant) {
        track2.style.transition = "none";
        track2.style.transform = `translate3d(${-index * 100}vw,0,0)`;
        requestAnimationFrame(() => requestAnimationFrame(() => { track2.style.transition = ""; }));
      } else {
        track2.style.transform = `translate3d(${-index * 100}vw,0,0)`;
      }
    };

    const setSlide3 = (index, instant = false) => {
      s.current.slide3 = index;
      updateDots3(index);
      if (instant) {
        track3.style.transition = "none";
        track3.style.transform = `translate3d(${-index * 100}vw,0,0)`;
        requestAnimationFrame(() => requestAnimationFrame(() => { track3.style.transition = ""; }));
      } else {
        track3.style.transform = `translate3d(${-index * 100}vw,0,0)`;
      }
    };

    const setSlide4 = (index, instant = false) => {
      s.current.slide4 = index;
      updateDots4(index);
      if (instant) {
        track4.style.transition = "none";
        track4.style.transform = `translate3d(${-index * 100}vw,0,0)`;
        requestAnimationFrame(() => requestAnimationFrame(() => { track4.style.transition = ""; }));
      } else {
        track4.style.transform = `translate3d(${-index * 100}vw,0,0)`;
      }
    };

    const smoothScrollTo = (el) => el.scrollIntoView({ behavior: "smooth", block: "start" });

    const canGo = () => {
      if (s.current.transitioning) return false;
      if (performance.now() - s.current.lastTransition < TRANSITION_MS) return false;
      return true;
    };

    const go = (dir) => {
      if (!canGo()) return;
      s.current.transitioning = true;
      s.current.lastTransition = performance.now();
      setTimeout(() => { s.current.transitioning = false; }, TRANSITION_MS);

      const active = getActiveSection(sections);

      if (active === hero) {
        if (dir > 0) { setSlide(0, true); smoothScrollTo(chapter); }
        return;
      }
      if (active === chapter) {
        const next = s.current.slide + dir;
        if (next >= 0 && next < SLIDE_COUNT) {
          setSlide(next);
        } else if (dir > 0) {
          setSlide2(0, true);
          smoothScrollTo(unit2);
        } else {
          setSlide(0, true);
          smoothScrollTo(hero);
        }
        return;
      }
      if (active === unit2) {
        const next = s.current.slide2 + dir;
        if (next >= 0 && next < U2_SLIDE_COUNT) {
          setSlide2(next);
        } else if (dir > 0) {
          setSlide3(0, true);
          smoothScrollTo(unit3);
        } else {
          setSlide(SLIDE_COUNT - 1, true);
          smoothScrollTo(chapter);
        }
        return;
      }
      if (active === unit3) {
        const next = s.current.slide3 + dir;
        if (next >= 0 && next < U3_SLIDE_COUNT) {
          setSlide3(next);
        } else if (dir > 0) {
          setSlide4(0, true);
          smoothScrollTo(unit4);
        } else {
          setSlide2(U2_SLIDE_COUNT - 1, true);
          smoothScrollTo(unit2);
        }
        return;
      }
      if (active === unit4) {
        const next = s.current.slide4 + dir;
        if (next >= 0 && next < U4_SLIDE_COUNT) {
          setSlide4(next);
        } else if (dir < 0) {
          setSlide3(U3_SLIDE_COUNT - 1, true);
          smoothScrollTo(unit3);
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

    const onTouchStart = (e) => { s.current.touchStartY = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      if (s.current.touchStartY == null) return;
      const dy = s.current.touchStartY - e.changedTouches[0].clientY;
      s.current.touchStartY = null;
      if (Math.abs(dy) < SWIPE_THRESHOLD) return;
      go(dy > 0 ? 1 : -1);
    };

    const onKeyDown = (e) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(1); }
      else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(-1); }
    };

    const onResize = () => {
      setSlide(s.current.slide, true);
      setSlide2(s.current.slide2, true);
      setSlide3(s.current.slide3, true);
      setSlide4(s.current.slide4, true);
    };

    setSlide(0, true);
    setSlide2(0, true);
    setSlide3(0, true);
    setSlide4(0, true);

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
    if (trackRef.current) trackRef.current.style.transform = "translate3d(0,0,0)";
    chapterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <main ref={heroRef} className="hero" aria-label="Yakmenistan showcase">
        <div className="hero__glow" aria-hidden />
        <div className="hero__grain" aria-hidden />
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="hero__title-inner">Yakmenistan</span>
          </h1>
          <p className="hero__subtitle">Brody Scoggins</p>
          <div className="hero__rule" aria-hidden />
        </div>
        <a
          className="hero__scroll-hint"
          href="#unit-1-slides"
          onClick={goToChapter}
          aria-label="Scroll to Unit 1"
          tabIndex={hintOpacity < 0.04 ? -1 : undefined}
          style={{ opacity: hintOpacity, pointerEvents: hintOpacity < 0.04 ? "none" : "auto" }}
        >
          <span className="hero__scroll-label">Explore</span>
          <span className="hero__scroll-arrow" aria-hidden>
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
        aria-label="Unit 1 — Thinking Geographically"
      >
        <div className="horizontal-chapter__sticky">
          <div ref={trackRef} className="horizontal-chapter__track">
            {SLIDES.map((slide, i) => (
              <div
                key={slide.kicker}
                className={`horizontal-chapter__panel horizontal-chapter__panel--s${i + 1}`}
                aria-label={`Slide ${i + 1} of ${SLIDE_COUNT}`}
              >
                <div className={`horizontal-chapter__panel-inner${slide.map ? " has-map" : ""}`}>
                  <div className="horizontal-chapter__text-block">
                    <span className="horizontal-chapter__roman" aria-hidden>I</span>
                    <span className="horizontal-chapter__unit-label">Unit 1</span>
                    <span className="horizontal-chapter__eyebrow">{slide.kicker} · {i + 1}/{SLIDE_COUNT}</span>
                    <h2 className="horizontal-chapter__slide-title">{slide.title}</h2>
                    <p className="horizontal-chapter__copy">{slide.body}</p>
                  </div>
                  {slide.map && (
                    <div className="horizontal-chapter__map-frame">
                      <img src={slide.map} alt={`${slide.kicker} map`} className="horizontal-chapter__map-img" draggable={false} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="slide-dots" aria-hidden>
          {SLIDES.map((_, i) => (
            <span key={i} className={`slide-dot${i === 0 ? " slide-dot--active" : ""}`} data-index={i} />
          ))}
        </div>
      </section>

      <section
        id="unit-2-slides"
        ref={unit2Ref}
        className="horizontal-chapter"
        style={{ "--slide-count": U2_SLIDE_COUNT }}
        aria-label="Unit 2"
      >
        <div className="horizontal-chapter__sticky">
          <div ref={track2Ref} className="horizontal-chapter__track">
            {U2_SLIDES.map((slide, i) => (
              <div
                key={slide.kicker}
                className={`horizontal-chapter__panel horizontal-chapter__panel--s${(i % 5) + 1}`}
                aria-label={`Unit 2 Slide ${i + 1} of ${U2_SLIDE_COUNT}`}
              >
                <div className={`horizontal-chapter__panel-inner${slide.map ? " has-map" : ""}`}>
                  <div className="horizontal-chapter__text-block">
                    <span className="horizontal-chapter__roman" aria-hidden>II</span>
                    <span className="horizontal-chapter__unit-label">Unit 2</span>
                    <span className="horizontal-chapter__eyebrow">{slide.kicker} · {i + 1}/{U2_SLIDE_COUNT}</span>
                    <h2 className="horizontal-chapter__slide-title">{slide.title}</h2>
                    <p className="horizontal-chapter__copy">{slide.body}</p>
                  </div>
                  {slide.map && (
                    <div className="horizontal-chapter__map-frame">
                      <img src={slide.map} alt={`${slide.kicker} map`} className="horizontal-chapter__map-img" draggable={false} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="slide-dots" aria-hidden>
          {U2_SLIDES.map((_, i) => (
            <span key={i} className={`slide-dot${i === 0 ? " slide-dot--active" : ""}`} data-index={i} />
          ))}
        </div>
      </section>

      <section
        id="unit-3-slides"
        ref={unit3Ref}
        className="horizontal-chapter"
        style={{ "--slide-count": U3_SLIDE_COUNT }}
        aria-label="Unit 3"
      >
        <div className="horizontal-chapter__sticky">
          <div ref={track3Ref} className="horizontal-chapter__track">
            {U3_SLIDES.map((slide, i) => (
              <div
                key={slide.kicker}
                className={`horizontal-chapter__panel horizontal-chapter__panel--s${(i % 5) + 1}`}
                aria-label={`Unit 3 Slide ${i + 1} of ${U3_SLIDE_COUNT}`}
              >
                <div className={`horizontal-chapter__panel-inner${slide.map ? " has-map" : ""}`}>
                  <div className="horizontal-chapter__text-block">
                    <span className="horizontal-chapter__roman" aria-hidden>III</span>
                    <span className="horizontal-chapter__unit-label">Unit 3</span>
                    <span className="horizontal-chapter__eyebrow">{slide.kicker} · {i + 1}/{U3_SLIDE_COUNT}</span>
                    <h2 className="horizontal-chapter__slide-title">{slide.title}</h2>
                    <p className="horizontal-chapter__copy">{slide.body}</p>
                  </div>
                  {slide.map && (
                    <div className="horizontal-chapter__map-frame">
                      <img src={slide.map} alt={`${slide.kicker} map`} className="horizontal-chapter__map-img" draggable={false} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="slide-dots" aria-hidden>
          {U3_SLIDES.map((_, i) => (
            <span key={i} className={`slide-dot${i === 0 ? " slide-dot--active" : ""}`} data-index={i} />
          ))}
        </div>
      </section>

      <section
        id="unit-4-slides"
        ref={unit4Ref}
        className="horizontal-chapter"
        style={{ "--slide-count": U4_SLIDE_COUNT }}
        aria-label="Unit 4"
      >
        <div className="horizontal-chapter__sticky">
          <div ref={track4Ref} className="horizontal-chapter__track">
            {U4_SLIDES.map((slide, i) => (
              <div
                key={slide.kicker}
                className={`horizontal-chapter__panel horizontal-chapter__panel--s${(i % 5) + 1}`}
                aria-label={`Unit 4 Slide ${i + 1} of ${U4_SLIDE_COUNT}`}
              >
                <div className={`horizontal-chapter__panel-inner${slide.map ? " has-map" : ""}`}>
                  <div className="horizontal-chapter__text-block">
                    <span className="horizontal-chapter__roman" aria-hidden>IV</span>
                    <span className="horizontal-chapter__unit-label">Unit 4</span>
                    <span className="horizontal-chapter__eyebrow">{slide.kicker} · {i + 1}/{U4_SLIDE_COUNT}</span>
                    <h2 className="horizontal-chapter__slide-title">{slide.title}</h2>
                    <p className="horizontal-chapter__copy">{slide.body}</p>
                  </div>
                  {slide.map && (
                    <div className="horizontal-chapter__map-frame">
                      <img src={slide.map} alt={`${slide.kicker} map`} className="horizontal-chapter__map-img" draggable={false} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="slide-dots" aria-hidden>
          {U4_SLIDES.map((_, i) => (
            <span key={i} className={`slide-dot${i === 0 ? " slide-dot--active" : ""}`} data-index={i} />
          ))}
        </div>
      </section>
    </>
  );
}