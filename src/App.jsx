import React, { useEffect, useMemo, useRef, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
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
const optimizeCloudinaryImage = (url, width) =>
  url.replace('/image/upload/', `/image/upload/f_auto,q_auto:good,w_${width},c_limit/`);
const optimizedHeroImageUrl = optimizeCloudinaryImage(heroImageUrl, 1800);

const heroSlides = [
  {
    image: optimizedHeroImageUrl,
    eyebrow: 'In Loving Memory of',
    title: 'Julius Oladimeji Omowaye',
    text: 'August 2, 1934 - February 15, 2026'
  },
  {
    image: optimizedHeroImageUrl,
    eyebrow: 'Burial Talk',
    title: 'Saturday, August 15, 2026',
    text: '11:00 AM Nigeria / 11:00 AM UK / 5:00 AM US Central / 8:00 PM Australia'
  },
  {
    image: optimizedHeroImageUrl,
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
  'Taiwo Omowaye (deceased)',
  'Kehinde Okondo',
  'Samuel Omowaiye',
  'Oladapo Omowaiye'
];

const familyDescendants = [
  'Grandchildren: Olawale Damilare, Olabisi Temidayo, Ibiyinka Jayeola, Oluwafemi Jayeola, Oluwafunmilayo Jayeola, Mercy Gabriel, Oluwagbenga Jayeola, Praise Adepoju, Williams Okondo, Jedidiah Omowaye, Russell Omowaye, Harrison Okondo, Michael Ahens, Daniela Omowaye, Treasure Oladapo-Omowaye, Richard Oladapo-Omowaye, Ryan Omowaye',
  'Great-grandchildren: Oreoluwa Precious, Blessing Anike, Emmanuel Damilare, Talwo Ayegbusi, Kehinde Ayegbusi, Tofunmi Damilare, Ayomide Jayeola, Olamide Jayeola, Ayomiposi Damilare, Testimony Ayegbusi, Eliana Gabriel, Iremide Jayeola, Olumide Jayeola',
  'Great-great-grandchildren: Firefunmi Idowu, Adura Adegoke'
];

const congregations = [
  'Olorunshogo Congregation (Ibafo)',
  'Unity Congregation (Orimerunmu)',
  'Bata Congregation (Ojota)',
  'Mile 12 Congregation (Mile 12)',
  'Waigbo Congregation (Mushin)',
];

const spiritualDaughters = [
  'Titilayo Joel (née Salako)',
  'Tosin Adekunle (née Salako)',
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
const memorialSlug = 'julius-omowaye';
const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:5012' : 'https://foodbot-api-latest.onrender.com')
).replace(/\/$/, '');
const guestBookApiUrl = `${apiBaseUrl}/api/v1/guest-book/${memorialSlug}`;

function MemorialPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeSection, setActiveSection] = useState('watch');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [galleryPage, setGalleryPage] = useState(1);
  const [navOpen, setNavOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [guestFormOpen, setGuestFormOpen] = useState(false);
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

    if (accessibility.reduceMotion) {
      targets.forEach((target) => {
        target.classList.add('aos-init', 'aos-animate');
      });
      return undefined;
    }

    const refreshTimer = window.setTimeout(() => {
      AOS.init({
        duration: 2600,
        easing: 'ease-out-quart',
        offset: 72,
        once: true,
        mirror: false,
        disableMutationObserver: true,
        throttleDelay: 120,
        debounceDelay: 80
      });
      AOS.refresh();
    }, 60);

    return () => window.clearTimeout(refreshTimer);
  }, [accessibility.reduceMotion, galleryPage]);

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
    const sections = navItems
      .map(([id]) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-22% 0px -60% 0px', threshold: [0, 0.15, 0.4] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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
    return undefined;
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
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <header className="site-header">
        <a className="brand" href="/" aria-label="Memorial Service home">
          <span className="brand-mark">JO</span>
          <span className="brand-copy">
            <strong>Julius Omowaye</strong>
            <small>In loving memory</small>
          </span>
        </a>
        <nav
          id="main-navigation"
          className={navOpen ? 'nav-links open' : 'nav-links'}
          aria-label="Main navigation"
        >
          {navItems.map(([href, label]) => (
            <a
              key={href}
              href={`#${href}`}
              className={activeSection === href ? 'active' : ''}
              aria-current={activeSection === href ? 'location' : undefined}
              onClick={() => {
                setActiveSection(href);
                setNavOpen(false);
              }}
            >
              {label}
            </a>
          ))}
          <a href={`/${memorialSlug}/guest-book`}>Guest Book</a>
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
              <button
                className="button secondary"
                type="button"
                onClick={() => setGuestFormOpen(true)}
              >
                <Heart size={18} />
                Sign Guest Book
              </button>
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

        <section className="intro-band" data-aos="smooth-up">
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
          <div className="detail-grid" data-aos="smooth-up">
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
          <div className="watch-panel" data-aos="smooth-up">
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
          <div className="quote-panel" data-aos="smooth-up">
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
                Julius Oladimeji Omowaiye, fondly known as “Daddy Ojota” or “Baba,” was born
                on August 2, 1934, in Akure, Ondo State, Nigeria, into a family deeply rooted
                in service to Jehovah. He was the second child of Pa Ebenezer and Mrs. Ebenezer
                Omowaiye. They were both devoted and dedicated servants of Jehovah, with the
                late Pa Ebenezer Omowaiye serving as a city overseer in Akure and among the
                pioneers who brought the truth according to God’s Word, the Bible, to Akure.
              </p>
              <p>
                Pa Julius Omowaiye’s father and mother were blessed with three children:
                Omotola Adeboye (deceased), Obafemi Omowaiye (deceased), and Joseph Omowaiye
                (deceased). After the passing of his mother, his father remarried and the
                family grew. Baba’s upbringing and experiences helped shape him into a
                resilient, responsible, and deeply compassionate person who deeply valued
                spiritual things, family, and unity.
              </p>
            </StoryBlock>

            <StoryBlock title="Work and Accomplishments">
              <p>
                From a young age, Julius Omowaiye showed a natural gift and interest in
                building construction. After his basic education, he went on to learn civil
                and structural construction at Awomolo Construction Company in Ibadan. He
                became well known for his ability to look at complex building plans,
                understand them deeply, and deduce how to build a strong and safe structure.
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
                Pa Julius Omowaiye married the love of his life, Mojisola Omowaiye, on June
                15, 1969. Their marriage was filled with love, friendship, respect, joy, and
                a shared dedication and loyalty to Jehovah.
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
                Pa Julius Omowaiye’s children describe him as approachable, loving,
                protective, and a good listener who always tried to understand things from
                their point of view. “Daddy,” as he was fondly called by his children, was
                firm when needed and not afraid to speak the truth. He was always kind,
                discerning, and fair to all.
              </p>
              <p>
                Baba also lovingly cared for many family members, including cousins, nieces,
                and nephews, just like his own children. They fondly describe him as a mentor,
                a pillar of support, and a good father with a good heart. He also adopted
                spiritual daughters who describe him as a very understanding and caring
                father who offered advice with compassion.
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
                Pa Julius Omowaiye was baptized as one of Jehovah’s Witnesses in 1968 while
                attending Waigbo Congregation. He attended several congregations in the Lagos
                area. Congregation members described him as a kind, wise, and spiritually
                mature Christian who always strove to show loving concern and help others
                learn about Jehovah, His Son Christ Jesus, God’s Kingdom, and His purpose for
                obedient mankind.
              </p>
              <p>
                Above all, Pa Julius Omowaiye loved Jehovah. His life reflected a deep and
                genuine appreciation for the truth according to God’s Word, the Bible. Like
                some faithful servants of Jehovah, Baba experienced moments in life when he
                stepped away from the truth, but what stood out was his humility and honesty
                in finding his way back to Jehovah’s organization. From that point onward,
                his love for Jehovah and dedication to spiritual things became even more
                evident to all who knew him.
              </p>
              <p>
                Even after it became increasingly difficult to walk from door to door or
                stand and offer literature, he joined his wife, Mojisola Omowaiye, in telling
                others about the Bible using the witnessing cart. Drawing strength from their
                faith and love for God, they spent hours preaching with the cart and making
                return visits to those interested in learning about the hope for a new world.
              </p>
              <p>
                To be close to Pa Julius Omowaiye was to witness a skilled conversationalist
                with an unparalleled ability to connect with anyone he met. His hospitality
                and infectious laughter matched his welcoming discussions. Regardless of how
                a conversation began, it usually ended the same way: with the hope of a future
                perfect Paradise with no sin, pain, or death. Until his death, he served
                faithfully as an elder in Olorunshogo Congregation (Ibafo) and supported many
                congregations over the years.
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
                Omowaiye fell asleep in death.
              </p>
              <p>
                He leaves to cherish his memory his beloved wife, Mrs. Mojisola Omowaiye; nine
                children; seventeen grandchildren; thirteen great-grandchildren; two
                great-great-grandchildren; seven siblings—Gideon Omowaye, Kike Omakun, Oluwole
                Titus Omowaye (also known as Jeje City), Isaac Omowaye, Taye Omowaye, Kehinde
                Timothy Ale, and Idowu Omowaye Adeniji—and a host of nephews, nieces, cousins,
                in-laws, other relatives, and dear friends.
              </p>
              <p>
                His family and friends derive comfort from one of his favourite scriptures,
                Acts 24:15: “I have hope toward God, which hope these men also look forward
                to, that there is going to be a resurrection.” With this hope, they look
                forward to the beautiful time when they will welcome him back in Paradise.
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
          <div className="gallery-grid" data-aos="smooth-up">
            {visibleGalleryImages.map((image, index) => {
              const imageIndex = (safeGalleryPage - 1) * imagesPerGalleryPage + index;
              return (
                <button
                  className="gallery-item"
                  key={`${image.title}-${imageIndex}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(imageIndex)}
                >
                  <img
                    src={optimizeCloudinaryImage(image.src, 640)}
                    alt={image.title}
                    loading="lazy"
                    decoding="async"
                    width="640"
                    height="640"
                  />
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
          <div className="song-grid" data-aos="smooth-up">
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

        <section id="acknowledgments" className="section acknowledgments" data-aos="smooth-up">
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

      <footer className="site-footer" data-aos="smooth-up">
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

      {guestFormOpen && (
        <GuestBookForm
          onClose={() => setGuestFormOpen(false)}
          onSubmitted={() => {
            window.location.href = `/${memorialSlug}/guest-book`;
          }}
        />
      )}
    </div>
  );
}

function LandingPage() {
  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      AOS.init({
        duration: 2600,
        easing: 'ease-out-quart',
        offset: 64,
        once: true,
        mirror: false,
        disableMutationObserver: true,
        throttleDelay: 120,
        debounceDelay: 80
      });
      AOS.refresh();
    }, 60);
    return () => window.clearTimeout(refreshTimer);
  }, []);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <a className="brand" href="/" aria-label="Memorial Service home">
          <span className="brand-mark landing-brand-mark">
            <Heart size={19} fill="currentColor" />
          </span>
          <span className="brand-copy">
            <strong>Memorial Service</strong>
            <small>Honouring lives, preserving stories</small>
          </span>
        </a>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-glow" aria-hidden="true" />
          <div className="landing-intro" data-aos="smooth-up">
            <p className="eyebrow">A place to remember</p>
            <h1>Celebrating lives that continue to inspire us.</h1>
            <p>
              Memorial Service creates thoughtful spaces where families and friends can
              gather, remember, and preserve the stories of those they love.
            </p>
            <a className="button primary" href="/julius-omowaye">
              View featured memorial
              <ChevronRight size={18} />
            </a>
          </div>

          <a
            className="featured-memorial"
            href="/julius-omowaye"
            data-aos="smooth-up"
            data-aos-delay="120"
          >
            <div className="featured-image-wrap">
              <img
                src={optimizeCloudinaryImage(heroImageUrl, 900)}
                alt="Julius Oladimeji Omowaye"
                decoding="async"
                fetchPriority="high"
                width="900"
                height="1100"
              />
              <span>Featured memorial</span>
            </div>
            <div className="featured-copy">
              <p>In loving memory of</p>
              <h2>Julius Oladimeji Omowaye</h2>
              <p>August 2, 1934 — February 15, 2026</p>
              <span className="featured-link">
                Visit memorial <ChevronRight size={17} />
              </span>
            </div>
          </a>
        </section>
      </main>

      <footer className="landing-footer">
        <p>Memorial Service</p>
        <span>A quiet place for remembrance.</span>
      </footer>
    </div>
  );
}

function GuestBookForm({ onClose, onSubmitted }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(guestBookApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name')?.toString().trim(),
          message: formData.get('message')?.toString().trim(),
          website: formData.get('website')?.toString()
        })
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.errors?.[0] || 'Unable to submit your message right now.');
      }

      onSubmitted(payload.data);
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to submit your message right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal guest-book-modal" role="dialog" aria-modal="true" aria-labelledby="guest-form-title">
      <button className="modal-backdrop" type="button" onClick={onClose} aria-label="Close guest-book form" />
      <div className="guest-book-modal-card">
        <div className="guest-book-modal-heading">
          <div>
            <p className="eyebrow">Share a memory</p>
            <h2 id="guest-form-title">Sign the Guest Book</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>
        <p className="guest-book-intro">
          Leave a message of comfort, a memory, or a few words for the Omowaiye family.
        </p>
        <form className="guest-form" onSubmit={handleSubmit}>
          <label>
            Your name
            <input name="name" type="text" minLength="2" maxLength="120" required autoFocus />
          </label>
          <label>
            Your message
            <textarea name="message" rows="6" minLength="2" maxLength="2000" required />
          </label>
          <label className="form-honeypot" aria-hidden="true">
            Website
            <input name="website" type="text" tabIndex="-1" autoComplete="off" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="guest-form-actions">
            <button className="button secondary" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button className="button primary" type="submit" disabled={isSubmitting}>
              <Send size={18} />
              {isSubmitting ? 'Submitting…' : 'Submit message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GuestBookPage() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadEntries = async () => {
      try {
        const response = await fetch(`${guestBookApiUrl}?page=1&pageSize=100`, {
          signal: controller.signal
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.errors?.[0] || 'Unable to load the guest book.');
        setEntries(payload.data || []);
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load the guest book.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadEntries();
    return () => controller.abort();
  }, []);

  return (
    <div className="guest-book-page">
      <header className="guest-book-header">
        <a className="brand" href={`/${memorialSlug}`} aria-label="Return to Julius Omowaiye memorial">
          <span className="brand-mark">JO</span>
          <span className="brand-copy">
            <strong>Julius Omowaiye</strong>
            <small>Guest book</small>
          </span>
        </a>
        <a className="button secondary" href={`/${memorialSlug}`}>Back to memorial</a>
      </header>

      <main className="guest-book-main">
        <div className="guest-book-hero">
          <div>
            <p className="eyebrow">Messages of love</p>
            <h1>Guest Book</h1>
            <p>Memories and messages shared by family and friends.</p>
          </div>
          <button className="button primary" type="button" onClick={() => setFormOpen(true)}>
            <Heart size={18} />
            Sign the Guest Book
          </button>
        </div>

        {isLoading && <div className="guest-book-status">Loading messages…</div>}
        {error && <div className="guest-book-status error" role="alert">{error}</div>}
        {!isLoading && !error && entries.length === 0 && (
          <div className="guest-book-status">Be the first to leave a message for the family.</div>
        )}
        <div className="guest-book-entries">
          {entries.map((entry) => (
            <article key={entry.id}>
              <p>{entry.message}</p>
              <footer>
                <strong>{entry.name}</strong>
                <time dateTime={entry.createdAt}>
                  {new Date(entry.createdAt).toLocaleDateString(undefined, {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </time>
              </footer>
            </article>
          ))}
        </div>
      </main>

      {formOpen && (
        <GuestBookForm
          onClose={() => setFormOpen(false)}
          onSubmitted={(entry) => {
            setEntries((current) => [entry, ...current]);
            setFormOpen(false);
          }}
        />
      )}
    </div>
  );
}

function App() {
  const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const lowerPath = normalizedPath.toLowerCase();
  const isAlternateSpelling = lowerPath === '/julius-omowaiye';
  const isAlternateGuestBook = lowerPath === '/julius-omowaiye/guest-book';
  const isGuestBook = lowerPath === `/${memorialSlug}/guest-book` || isAlternateGuestBook;
  const isMemorial =
    lowerPath === `/${memorialSlug}` || isAlternateSpelling;

  useEffect(() => {
    if (isAlternateSpelling) {
      window.history.replaceState(null, '', `/${memorialSlug}`);
    } else if (isAlternateGuestBook) {
      window.history.replaceState(null, '', `/${memorialSlug}/guest-book`);
    }

    document.title = isGuestBook
      ? 'Guest Book | Julius Oladimeji Omowaye'
      : isMemorial
        ? 'In Loving Memory of Julius Oladimeji Omowaye'
        : 'Memorial Service | Honouring Lives, Preserving Stories';

    const description = isGuestBook
      ? 'Messages and memories shared in honour of Julius Oladimeji Omowaye.'
      : isMemorial
      ? 'The memorial website of Julius Oladimeji Omowaye, lovingly remembered by family and friends.'
      : 'Thoughtful online memorials that help families honour lives, share memories, and preserve stories.';
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [isAlternateGuestBook, isAlternateSpelling, isGuestBook, isMemorial]);

  if (isGuestBook) return <GuestBookPage />;
  return isMemorial ? <MemorialPage /> : <LandingPage />;
}

function StoryBlock({ title, children }) {
  return (
    <article className="story-block" data-aos="smooth-up">
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
