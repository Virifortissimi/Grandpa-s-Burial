import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Heart,
  Image as ImageIcon,
  MapPin,
  Menu,
  Music,
  Pause,
  Play,
  Send,
  Settings,
  Users,
  X
} from 'lucide-react';
import { memorialImages } from './memorialImages';

const backgroundAudioSrc = '/audio/our-joy-eternally.mp3';
const zoomMeetingUrl =
  'https://us06web.zoom.us/j/83071682622?pwd=RgcmA8otBkC9RuAp2NKovocWs5n4Kw.1';
const zoomChatUrl = 'https://us06web.zoom.us/launch/jc/83071682622';
const zoomInstructionsUrl =
  'https://us06web.zoom.us/meetings/83071682622/invitations?signature=ysXP6QFpFHPC4AQsDvkGThsdXVYOmBAMTNWa_VZ3aCI';
const imagesPerGalleryPage = 20;
const fallbackHeroImages = [
  '/images/memorial-bible.png',
  '/images/memorial-hall.png',
  '/images/memorial-family.png'
];
const heroImageUrl =
  'https://res.cloudinary.com/virifortissimi/image/upload/v1782161472/Gramps/ChatGPT_Image_Jun_22_2026_09_48_54_PM.png';

const heroSlides = [
  {
    image: heroImageUrl,
    eyebrow: 'In Loving Memory of',
    title: 'Julius Oladimeji Omowaye',
    text: 'October 20, 1951 - February 21, 2026'
  },
  {
    image: heroImageUrl,
    eyebrow: 'Burial Talk',
    title: 'Saturday, August 15, 2026',
    text: '11:00 AM Nigeria / 11:00 AM UK / 5:00 AM US Central / 8:00 PM Australia'
  },
  {
    image: heroImageUrl,
    eyebrow: 'A Legacy of Faith',
    title: 'Remembered With Love',
    text: 'A husband, father, shepherd, mentor, and loyal servant of Jehovah.'
  }
];

const navItems = [
  ['watch', 'Watch'],
  ['life-story', 'Life Story'],
  ['pictures', 'Pictures'],
  ['acknowledgments', 'Acknowledgments']
];

const serviceDetails = [
  {
    icon: CalendarDays,
    title: 'Burial Talk',
    lines: [
      'Saturday, August 15, 2026',
      '11:00 AM Nigeria / 11:00 AM UK / 5:00 AM US Central / 8:00 PM Australia (AEST)'
    ]
  },
  {
    icon: MapPin,
    title: 'Kingdom Hall of Jehovah\'s Witnesses',
    lines: ['Mowe, Ogun State, Nigeria']
  },
  {
    icon: Clock,
    title: 'Virtual Attendance',
    lines: ['Zoom access details are provided below.']
  }
];

const orderOfService = [
  'Chairman',
  'Opening Song: Song #158 "It Will Not Be Late!"',
  'Opening Prayer',
  'Discourse',
  'Acknowledgments & Announcements',
  'Closing Song: Song #151 "He Will Call"',
  'Closing Prayer'
];

const children = [
  'Olufunmilayo Adepoju',
  'Folusho Jayeola',
  'Olatunde Omowaiye',
  'Love Ojo',
  'Faith George',
  'Peace Ahens',
  'Taiye Omowaiye (deceased)',
  'Kehinde Okondo',
  'Samuel Omowaiye',
  'Oladapo Omowaiye'
];

const familyDescendants = [
  'Grandchildren: Olawale Damilare, Olabisi Temidayo, Ibiyinka Jayeola, Oluwafemi Jayeola, Oluwafunmilayo Jayeola, Mercy Gabriel, Oluwagbenga Jayeola, Praise Adepoju, Williams Okondo, Jedidiah Omowaye, Russel Omowaye, Harrison Okondo, Michael Ahens, Daniela Omowaye, Treasure Oladapo-Omowaye, Richard Oladapo-Omowaye, Ryan Omowaye',
  'Great-grandchildren: Oreoluwa Precious, Blessing Anike, Emmanuel Damilare, Talwo Ayegbusi, Kehinde Ayegbusi, Tofunmi Damilare, Ayomide Jayeola, Olamide Jayeola, Ayomiposi Damilare, Testimony Ayegbusi, Eliana Gabriel, Iremide Jayeola, Olumide Jayeola',
  'Great-great-grandchildren: Firefunmi Idowu, Adura Adegoke'
];

const congregations = [
  'Olorunshogo Congregation (Orimerunmu)',
  'Waigbo Congregation (Mushin)',
  'Mile 12 Congregation (Lagos)',
  'Bata Congregation (Lagos)',
  'Unity Congregation (Orimerunmu)'
];

const spiritualDaughters = [
  'Mojisola Ekpenyong',
  'Nehocia Jacquet, whom he lovingly gave the Yoruba name Arinola Omopariola'
];

const songs = [
  {
    title: 'The New World to Come',
    subtitle: 'Original Song',
    src: '/audio/the-new-world-to-come.mp3'
  },
  {
    title: 'Our Joy Eternally',
    subtitle: 'Original Song',
    src: '/audio/our-joy-eternally.mp3'
  },
  {
    title: 'With Eyes of Faith',
    subtitle: 'Original Song',
    src: '/audio/with-eyes-of-faith.mp3'
  },
  {
    title: 'You Will See',
    subtitle: 'Original Song',
    src: '/audio/you-will-see.mp3'
  }
];

const galleryImages =
  memorialImages.length > 3 ? memorialImages.slice(3) : memorialImages;

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [galleryPage, setGalleryPage] = useState(1);
  const [navOpen, setNavOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem('themeMode') || 'system';
    } catch {
      return 'system';
    }
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [accessibility, setAccessibility] = useState({
    largeText: false,
    highContrast: false,
    reduceMotion: false
  });
  const [guestEntries, setGuestEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('guestEntries') || '[]');
    } catch {
      return [];
    }
  });
  const audioRef = useRef(null);
  const songRefs = useRef([]);

  useEffect(() => {
    if (accessibility.reduceMotion) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [accessibility.reduceMotion]);

  useEffect(() => {
    const selectors = [
      '.intro-band',
      '.section',
      '.detail-card',
      '.watch-panel',
      '.quote-panel',
      '.story-block',
      '.gallery-item',
      '.song-card',
      '.guest-form',
      '.entries',
      '.acknowledgments',
      '.site-footer'
    ].join(',');
    const targets = Array.from(document.querySelectorAll(selectors));

    if (accessibility.reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-visible'));
      return undefined;
    }

    targets.forEach((target) => target.classList.add('reveal-target'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [accessibility.reduceMotion, galleryPage, guestEntries.length]);

  useEffect(() => {
    localStorage.setItem('guestEntries', JSON.stringify(guestEntries));
  }, [guestEntries]);

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (!navOpen && !accessOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setNavOpen(false);
        setAccessOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navOpen, accessOpen]);

  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeGallery();
      if (event.key === 'ArrowRight') nextGalleryImage();
      if (event.key === 'ArrowLeft') previousGalleryImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;
    const tryPlayBackground = () => {
      if (songRefs.current.some((songAudio) => songAudio && !songAudio.paused)) return;

      const playAttempt = audio.play();

      if (playAttempt?.catch) {
        playAttempt
          .then(() => {
            setIsPlaying(true);
            setAudioBlocked(false);
          })
          .catch(() => {
            setAudioBlocked(true);
            setIsPlaying(false);
          });
      }
    };

    tryPlayBackground();

    const interactionEvents = ['pointerdown', 'keydown', 'touchstart'];
    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, tryPlayBackground, { once: true });
    });

    return () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, tryPlayBackground);
      });
    };
  }, []);

  const currentSlide = heroSlides[activeSlide];
  const selectedImage =
    selectedImageIndex === null ? null : galleryImages[selectedImageIndex];
  const totalGalleryPages = Math.max(1, Math.ceil(galleryImages.length / imagesPerGalleryPage));
  const safeGalleryPage = Math.min(galleryPage, totalGalleryPages);
  const visibleGalleryImages = galleryImages.slice(
    (safeGalleryPage - 1) * imagesPerGalleryPage,
    safeGalleryPage * imagesPerGalleryPage
  );

  const nextSlide = () => setActiveSlide((current) => (current + 1) % heroSlides.length);
  const previousSlide = () =>
    setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  const closeGallery = () => setSelectedImageIndex(null);
  const nextGalleryImage = () =>
    setSelectedImageIndex((current) =>
      current === null ? 0 : (current + 1) % galleryImages.length
    );
  const previousGalleryImage = () =>
    setSelectedImageIndex((current) =>
      current === null ? galleryImages.length - 1 : (current - 1 + galleryImages.length) % galleryImages.length
    );
  const goToGalleryPage = (page) => {
    setGalleryPage(Math.min(Math.max(page, 1), totalGalleryPages));
  };

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        songRefs.current.forEach((songAudio) => {
          if (songAudio && !songAudio.paused) songAudio.pause();
        });
        await audio.play();
        setIsPlaying(true);
        setAudioBlocked(false);
      } catch {
        setAudioBlocked(true);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSongPlay = (activeIndex) => {
    const backgroundAudio = audioRef.current;
    if (backgroundAudio && !backgroundAudio.paused) {
      backgroundAudio.pause();
      setIsPlaying(false);
    }

    songRefs.current.forEach((songAudio, index) => {
      if (songAudio && index !== activeIndex && !songAudio.paused) {
        songAudio.pause();
        songAudio.currentTime = 0;
      }
    });
  };

  const toggleAccessibility = (setting) => {
    setAccessibility((current) => ({
      ...current,
      [setting]: !current[setting]
    }));
  };

  const activeAccessibilityCount =
    Object.values(accessibility).filter(Boolean).length + (themeMode === 'system' ? 0 : 1);

  const handleGuestSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!name || !message) return;

    setGuestEntries((entries) => [
      {
        name,
        message,
        date: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      },
      ...entries
    ]);

    event.currentTarget.reset();
  };

  return (
    <div
      className={[
        'site-shell',
        accessibility.largeText ? 'large-text' : '',
        accessibility.highContrast ? 'high-contrast' : '',
        accessibility.reduceMotion ? 'reduced-motion' : '',
        `theme-${themeMode}`
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <audio
        ref={audioRef}
        src={backgroundAudioSrc}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Julius Oladimeji Omowaye memorial home">
          <span className="brand-mark">JO</span>
          <span>Julius Omowaye</span>
        </a>
        <nav
          id="main-navigation"
          className={navOpen ? 'nav-links open' : 'nav-links'}
          aria-label="Main navigation"
        >
          {navItems.map(([href, label]) => (
            <a key={href} href={`#${href}`} onClick={() => setNavOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <div className="access-menu">
            <button
              className="access-toggle"
              type="button"
              onClick={() => {
                setAccessOpen((current) => !current);
                setNavOpen(false);
              }}
              aria-expanded={accessOpen}
              aria-controls="accessibility-menu"
              aria-label="Open accessibility options"
            >
              <Settings size={18} />
              <span>Access</span>
              {activeAccessibilityCount > 0 && <small>{activeAccessibilityCount}</small>}
            </button>
            <div
              id="accessibility-menu"
              className={accessOpen ? 'accessibility-panel open' : 'accessibility-panel'}
              aria-label="Accessibility options"
            >
              <div>
                <Settings size={18} />
                <strong>Accessibility</strong>
              </div>
              <fieldset className="theme-options">
                <legend>Theme</legend>
                {['light', 'dark', 'system'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={themeMode === mode ? 'active' : ''}
                    onClick={() => setThemeMode(mode)}
                    aria-pressed={themeMode === mode}
                  >
                    {mode[0].toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </fieldset>
              <button
                type="button"
                className={accessibility.largeText ? 'active' : ''}
                onClick={() => toggleAccessibility('largeText')}
                aria-pressed={accessibility.largeText}
              >
                Larger Text
              </button>
              <button
                type="button"
                className={accessibility.highContrast ? 'active' : ''}
                onClick={() => toggleAccessibility('highContrast')}
                aria-pressed={accessibility.highContrast}
              >
                High Contrast
              </button>
              <button
                type="button"
                className={accessibility.reduceMotion ? 'active' : ''}
                onClick={() => toggleAccessibility('reduceMotion')}
                aria-pressed={accessibility.reduceMotion}
              >
                Reduce Motion
              </button>
            </div>
          </div>
          <button
            className="nav-toggle"
            type="button"
            onClick={() => {
              setNavOpen((current) => !current);
              setAccessOpen(false);
            }}
            aria-expanded={navOpen}
            aria-controls="main-navigation"
            aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {navOpen ? <X size={22} /> : <Menu size={22} />}
            <span>Menu</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" style={{ backgroundImage: `url(${currentSlide.image})` }}>
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow">{currentSlide.eyebrow}</p>
            <h1>{currentSlide.title}</h1>
            <p className="hero-dates">{currentSlide.text}</p>
            <div className="hero-actions">
              <a className="button primary" href="#watch">
                <Play size={18} />
                Watch Live
              </a>
              <a className="button secondary" href="#guest-book">
                <Heart size={18} />
                Sign Guest Book
              </a>
              <button className="button glass" type="button" onClick={toggleAudio}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isPlaying ? 'Pause Music' : 'Play Music'}
              </button>
            </div>
            {audioBlocked && (
              <p className="audio-note">
                Your browser paused autoplay. Use Play Music once to start the background audio.
              </p>
            )}
          </div>
          <div className="slide-controls" aria-label="Slideshow controls">
            <button type="button" onClick={previousSlide} aria-label="Previous slide">
              <ChevronLeft size={22} />
            </button>
            <div className="slide-dots">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={index === activeSlide ? 'active' : ''}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
            <button type="button" onClick={nextSlide} aria-label="Next slide">
              <ChevronRight size={22} />
            </button>
          </div>
        </section>

        <section className="intro-band">
          <div>
            <p className="eyebrow">Julius Oladimeji Omowaye</p>
            <h2>A life remembered for faith, generosity, and loyal love.</h2>
          </div>
          <p>
            Fondly remembered by family and friends, he was a trusted friend, adviser,
            caring shepherd, mentor, husband, father, grandfather, and faithful servant
            of Jehovah.
          </p>
        </section>

        <section id="watch" className="section">
          <div className="section-heading">
            <p className="eyebrow">Burial Talk</p>
            <h2>Burial Details</h2>
          </div>
          <div className="detail-grid">
            {serviceDetails.map((detail) => {
              const Icon = detail.icon;
              return (
                <article className="detail-card" key={detail.title}>
                  <Icon size={24} />
                  <h3>{detail.title}</h3>
                  {detail.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </article>
              );
            })}
          </div>
          <div className="watch-panel">
            <div>
              <p className="eyebrow">Available Virtual On</p>
              <h3>Zoom Live Stream</h3>
              <p>
                The family of the Omowayes invite you to the Burial Talk of their husband,
                father, brother, grandfather, and great grandfather.
              </p>
              <dl className="zoom-details">
                <div>
                  <dt>Meeting ID</dt>
                  <dd>830 7168 2622</dd>
                </div>
                <div>
                  <dt>Passcode</dt>
                  <dd>877114</dd>
                </div>
                <div>
                  <dt>SIP</dt>
                  <dd>83071682622@zoomcrc.com</dd>
                </div>
              </dl>
            </div>
            <div className="zoom-actions">
              <a className="button primary" href={zoomMeetingUrl} target="_blank" rel="noreferrer">
                <Play size={18} />
                Join Zoom Meeting
              </a>
              <a className="button secondary" href={zoomChatUrl} target="_blank" rel="noreferrer">
                Meeting Chat
              </a>
              <a className="button secondary" href={zoomInstructionsUrl} target="_blank" rel="noreferrer">
                Join Instructions
              </a>
            </div>
          </div>
        </section>

        <section className="section two-column">
          <div>
            <p className="eyebrow">Order of Services</p>
            <h2>A program of comfort and hope</h2>
            <ol className="service-list">
              {orderOfService.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
          <div className="quote-panel">
            <BookOpen size={30} />
            <blockquote>
              "No greater joy do I have than this: that I should hear that my children go
              on walking in the truth."
            </blockquote>
            <cite>3 John 4</cite>
          </div>
        </section>

        <section id="life-story" className="section story-section">
          <div className="section-heading">
            <p className="eyebrow">Life Story</p>
            <h2>Julius Oladimeji Omowaiye</h2>
            <p>August 2, 1934 - February 15, 2026</p>
          </div>

          <div className="story-flow">
            <StoryBlock title="Early Life">
              <p>
                Julius Oladimeji Omowaiye was born on August 2, 1934, in Akure, Ondo State,
                Nigeria, into a family deeply rooted in service to Jehovah. He was the second
                child of Pa Ebenezer Omowaiye and Mrs. XXX Omowaiye, a devoted servant of
                Jehovah who served as a city overseer in Akure and was among those who brought
                the truth to the town.
              </p>
              <p>
                His mother was blessed with three children: Omotola Adeboye (deceased),
                Obafemi Omowaiye (deceased), and Joseph Omowaiye (deceased). After the
                passing of his mother, his father remarried and the family grew; he is
                survived by * Number of Siblings*. These experiences helped shape him into a
                resilient, responsible, and deeply compassionate person who valued family and
                unity.
              </p>
            </StoryBlock>

            <StoryBlock title="Work and Accomplishments">
              <p>
                From a young age, Julius Omowaiye showed a natural gift and interest in
                building construction. After his basic education, he went on to learn civil
                and structural construction at Awomolo Construction Company in Ibadan. He
                became well known for his ability to look at complex building plans, understand
                them deeply, and explain clearly what needed to be done to ensure strong and
                safe building structures.
              </p>
              <p>
                Julius Omowaiye began his career working alongside expatriates from Germany in
                the construction industry for about three years. In 1973, with courage and
                determination, he started his own company. Through diligence, dedication, and
                tenacity, he became the CEO of J. Ola Omowaiye &amp; Brothers Limited and J.
                Ola Omowaiye &amp; Sons Limited. His work was marked by excellence, integrity,
                and a strong sense of accomplishment.
              </p>
            </StoryBlock>

            <StoryBlock title="Marriage and Family">
              <p>
                Julius Omowaiye was survived by the love of his life, whom he married on June
                15, 1969, Mojisola Omowaiye (nee Salako), the daughter of Pa Johnson Salako of
                Imashai, Ogun State. Their marriage was filled with love, friendship, respect,
                joy, and a shared dedication and loyalty to Jehovah.
              </p>
              <p>
                As a loving husband, Julius Omowaiye was hardworking, humble, loving, and
                deeply caring. He was a generous provider who always put his family first, and
                he was known for his hospitality and willingness to help others. He was
                intelligent, thoughtful, and always ready to teach and guide.
              </p>
              <List title="Children" items={children} />
              <List title="Family Descendants" items={familyDescendants} />
            </StoryBlock>

            <StoryBlock title="A Loving Father and Friend">
              <p>
                His children describe him as approachable, loving, protective, and a good
                listener who always tried to understand things from their point of view. Daddy,
                as he is fondly called by his children, was firm when needed and not afraid to
                speak the truth, but he was always kind, discerning, and fair to all.
              </p>
              <p>
                In addition, he lovingly cared for many family members, including cousins,
                nieces, and nephews, just like his own children. They fondly describe him as
                XXXXXXXXXXXXXXXX.
              </p>
              <List title="Spiritual Daughters" items={spiritualDaughters} />
            </StoryBlock>

            <StoryBlock title="His Character">
              <p>
                Julius Omowaiye had a gentle way about him. He was soft-spoken, empathetic,
                friendly, and had a great sense of humor. He was also very knowledgeable and
                always willing to learn new things. He believed that life is beautiful, should
                be cherished as a gift from Jehovah, and should be enjoyed.
              </p>
              <p>
                He treated everyone equally, regardless of background or status, and he
                strongly believed in unity. He disliked prejudice and always encouraged peace
                and unity. He also had a warm relationship with people in his community and was
                always ready to guide, support, and uplift others.
              </p>
            </StoryBlock>

            <StoryBlock title="His Spiritual Life">
              <p>
                Above all, Julius Omowaiye loved Jehovah. His life reflected a deep and
                genuine appreciation for the truth. Like some faithful servants, he experienced
                moments in life where he stepped away from the truth, but what stood out was
                his humility and honesty in finding his way back to Jehovah's organization.
              </p>
              <p>
                From that point onward, his love for Jehovah and his dedication to spiritual
                things became even more evident to all who knew him. Until his death, he served
                faithfully as an elder in Olorunshogo Congregation (Orimerunmu) and supported
                many congregations over the years.
              </p>
              <List title="Congregations Served" items={congregations} />
            </StoryBlock>

            <StoryBlock title="Faithful Service and Hope">
              <p>
                Pa Julius Omowaiye was admired for his strong faith, dedication, and the way
                he encouraged others spiritually. He also participated in convention dramas,
                including the "Love Never Fails" convention in 2019, and handled several
                convention assignments.
              </p>
              <p>
                One of the things he often said was, "Never leave Jehovah. Serve Him with a
                complete heart full of obedience." On Sunday, February 15, 2026, Pa Julius
                Omowaiye fell asleep in death. Although he will be deeply missed and mourned by
                friends and relatives, his family holds on to the resurrection hope and comfort
                that Jehovah gives.
              </p>
              <p>
                His family and friends derive comfort from one of his favourite scriptures,
                James 4:8, which says, "Draw close to God, and he will draw close to you."
                With this hope, they look forward to the beautiful time when they will welcome
                him back in Paradise.
              </p>
            </StoryBlock>
          </div>
        </section>

        <section id="pictures" className="section gallery-section">
          <div className="section-heading">
            <p className="eyebrow">Pictures to Remember</p>
            <h2>Memories of Julius</h2>
            <p>Click any image for a full view.</p>
          </div>
          <div className="gallery-grid">
            {visibleGalleryImages.map((image, index) => {
              const imageIndex = (safeGalleryPage - 1) * imagesPerGalleryPage + index;
              return (
                <button
                  className="gallery-item"
                  key={`${image.title}-${imageIndex}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(imageIndex)}
                >
                  <img src={image.src} alt={image.title} />
                  <span>
                    <ImageIcon size={16} />
                    View Photo
                  </span>
                </button>
              );
            })}
          </div>
          {totalGalleryPages > 1 && (
            <div className="pagination" aria-label="Gallery pagination">
              <button
                type="button"
                onClick={() => goToGalleryPage(safeGalleryPage - 1)}
                disabled={safeGalleryPage === 1}
              >
                Previous
              </button>
              <span>
                Page {safeGalleryPage} of {totalGalleryPages}
              </span>
              <button
                type="button"
                onClick={() => goToGalleryPage(safeGalleryPage + 1)}
                disabled={safeGalleryPage === totalGalleryPages}
              >
                Next
              </button>
            </div>
          )}
        </section>

        <section className="section songs-section">
          <div className="section-heading">
            <p className="eyebrow">Songs of Comfort</p>
            <h2>Music for reflection</h2>
          </div>
          <div className="song-grid">
            {songs.map((song, index) => (
              <article className="song-card" key={song.src}>
                <div>
                  <Music size={20} />
                  <span>
                    <strong>{song.title}</strong>
                    <small>{song.subtitle}</small>
                  </span>
                </div>
                <audio
                  ref={(element) => {
                    songRefs.current[index] = element;
                  }}
                  controls
                  preload="metadata"
                  src={song.src}
                  onPlay={() => handleSongPlay(index)}
                >
                  <a href={song.src}>Play {song.title}</a>
                </audio>
              </article>
            ))}
          </div>
        </section>

        <section id="acknowledgments" className="section acknowledgments">
          <div>
            <p className="eyebrow">Acknowledgments</p>
            <h2>With deep appreciation</h2>
          </div>
          <p>
            The Omowaye family would like to thank each of you for all the support,
            encouragement, empathy, calls, and love you have shown during this very difficult
            time.
          </p>
          <p>
            We truly feel Jehovah has blessed us with such loving friends and used you to
            comfort and sustain us. Thank you for every act of care and kindness, every
            expression of sympathy, and most especially, every prayer on our behalf.
          </p>
          <p>We appreciate you more than words can say.</p>
        </section>
      </main>

      <footer className="site-footer">
        <p>In Loving Memory of Julius Oladimeji Omowaye</p>
        <a href="#top">Back to top</a>
      </footer>

      {selectedImage && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={selectedImage.title}>
          <button className="modal-backdrop" type="button" onClick={closeGallery} />
          <div className="modal-content">
            <button
              className="gallery-nav previous"
              type="button"
              onClick={previousGalleryImage}
              aria-label="Previous picture"
            >
              <ChevronLeft size={26} />
            </button>
            <img src={selectedImage.src} alt={selectedImage.title} />
            <button
              className="gallery-nav next"
              type="button"
              onClick={nextGalleryImage}
              aria-label="Next picture"
            >
              <ChevronRight size={26} />
            </button>
            <div className="modal-actions">
              <div>
                <h3>Photo Memory</h3>
                <p>
                  Picture {(selectedImageIndex ?? 0) + 1} of {galleryImages.length}.{' '}
                  {selectedImage.note}
                </p>
              </div>
              <a className="button secondary" href={selectedImage.src} download>
                <Download size={18} />
                Download
              </a>
              <button className="button primary" type="button" onClick={closeGallery}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StoryBlock({ title, children }) {
  return (
    <article className="story-block">
      <h3>{title}</h3>
      {children}
    </article>
  );
}

function List({ title, items }) {
  const splitItems = useMemo(() => items, [items]);

  return (
    <div className="compact-list">
      <h4>{title}</h4>
      <ul>
        {splitItems.map((item) => {
          const separatorIndex = item.indexOf(':');

          if (separatorIndex === -1) {
            return <li key={item}>{item}</li>;
          }

          const label = item.slice(0, separatorIndex);
          const value = item.slice(separatorIndex + 1).trim();

          return (
            <li key={item}>
              <strong>{label}:</strong> {value}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
