'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>

      {/* ── Nav ─────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(24px, 4vw, 64px)', height: 64,
        background: scrolled ? 'rgba(18,17,16,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent',
        transition: 'all 0.5s ease',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 28, color: '#f0ece4', letterSpacing: '0.06em',
          textDecoration: 'none',
        }}>ALPKOLL</Link>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {[
            { label: 'Resorts', href: '/#resorts' },
            { label: 'Plan a Trip', href: '/plan' },
            { label: 'About', href: '/about' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
              color: item.href === '/about' ? '#D4A574' : 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              transition: 'color 0.25s',
            }}>{item.label}</Link>
          ))}
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────── */}
      <header style={{
        paddingTop: 'clamp(140px, 20vh, 200px)',
        paddingBottom: 'clamp(60px, 10vh, 100px)',
        paddingLeft: 'clamp(24px, 4vw, 64px)',
        paddingRight: 'clamp(24px, 4vw, 64px)',
        maxWidth: 900,
        margin: '0 auto',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
          color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 24,
        }}>About Alpkoll</p>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 400, lineHeight: 0.95,
          color: '#f0ece4', letterSpacing: '0.02em',
          marginBottom: 32,
        }}>
          Built For Skiers<br />
          Who Do Their <span style={{ color: '#D4A574' }}>Homework.</span>
        </h1>
        <div style={{
          width: 48, height: 2, background: '#D4A574', marginBottom: 32, borderRadius: 1,
        }} />
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(15px, 1.4vw, 18px)',
          fontWeight: 300, color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.7, maxWidth: 600,
        }}>
          Planning a ski trip shouldn't mean drowning in browser tabs. 
          Alpkoll puts the data you actually need in one place — so you spend 
          less time researching and more time on the mountain.
        </p>
      </header>

      {/* ── Divider ─────────────────────────── */}
      <div style={{
        maxWidth: 900, margin: '0 auto',
        padding: '0 clamp(24px, 4vw, 64px)',
      }}>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
      </div>

      {/* ── The Story ────────────────────────── */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: 'clamp(60px, 8vh, 100px) clamp(24px, 4vw, 64px)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
          color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 20,
        }}>The Story</p>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 400, color: '#f0ece4', letterSpacing: '0.02em',
          marginBottom: 28, lineHeight: 1.05,
        }}>Twenty Tabs Open. Zero Answers.</h2>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 20,
          maxWidth: 620,
        }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300,
            color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
          }}>
            Every ski trip starts the same way. You open one resort website, 
            then another, then a weather forecast, then a flight search, then a 
            forum thread from 2019. Before you know it, you've got twenty tabs open 
            and you still can't compare Val Thorens to Åre in any meaningful way.
          </p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300,
            color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
          }}>
            Alpkoll was born out of that frustration. It's a tool that gathers the 
            data that actually matters — snow reliability, terrain, price, 
            accessibility, altitude, piste kilometers — and lets you compare resorts 
            side by side. No guesswork. No sponsored placements. Just data.
          </p>
        </div>
      </section>

      {/* ── Divider ─────────────────────────── */}
      <div style={{
        maxWidth: 900, margin: '0 auto',
        padding: '0 clamp(24px, 4vw, 64px)',
      }}>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
      </div>

      {/* ── How It Works ─────────────────────── */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: 'clamp(60px, 8vh, 100px) clamp(24px, 4vw, 64px)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
          color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 20,
        }}>How It Works</p>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 400, color: '#f0ece4', letterSpacing: '0.02em',
          marginBottom: 40, lineHeight: 1.05,
        }}>Data, Not Opinions.</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
        }}>
          {[
            {
              number: '01',
              title: 'Real Data',
              text: 'Every resort is profiled across 30+ data points — altitude, piste kilometers, snow reliability, price range, terrain split, lift count, season dates, and more.',
            },
            {
              number: '02',
              title: 'Weighted Scoring',
              text: 'Tell us what matters to you. The scoring formula weighs each factor according to your preferences and ranks resorts from best to worst match.',
            },
            {
              number: '03',
              title: 'Honest Results',
              text: 'No resort pays to rank higher. No hidden sponsorships. The results are driven purely by data and your preferences.',
            },
          ].map((step) => (
            <div key={step.number} style={{
              background: '#1c1a17',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: 6,
              padding: 'clamp(24px, 3vw, 32px)',
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 32, color: 'rgba(212,165,116,0.2)',
                letterSpacing: '0.02em',
                display: 'block', marginBottom: 16,
              }}>{step.number}</span>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 20, fontWeight: 400, color: '#f0ece4',
                letterSpacing: '0.03em', marginBottom: 12,
              }}>{step.title}</h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300,
                color: 'rgba(255,255,255,0.4)', lineHeight: 1.7,
              }}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ─────────────────────────── */}
      <div style={{
        maxWidth: 900, margin: '0 auto',
        padding: '0 clamp(24px, 4vw, 64px)',
      }}>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
      </div>

      {/* ── Who's Behind It ──────────────────── */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: 'clamp(60px, 8vh, 100px) clamp(24px, 4vw, 64px)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
          color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 20,
        }}>Who&apos;s Behind It</p>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 400, color: '#f0ece4', letterSpacing: '0.02em',
          marginBottom: 28, lineHeight: 1.05,
        }}>One Skier. One Problem.</h2>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 20,
          maxWidth: 620,
        }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300,
            color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
          }}>
            Alpkoll is built by a skier based in Stockholm who got tired of 
            planning trips the hard way. What started as a personal project to 
            organise resort data turned into something that might be useful 
            to others too.
          </p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300,
            color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
          }}>
            This is an independent project. No venture capital. No corporate 
            backing. Just one person trying to make ski trip planning a little 
            less painful.
          </p>
        </div>
      </section>

      {/* ── Divider ─────────────────────────── */}
      <div style={{
        maxWidth: 900, margin: '0 auto',
        padding: '0 clamp(24px, 4vw, 64px)',
      }}>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
      </div>

      {/* ── What's Coming ────────────────────── */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: 'clamp(60px, 8vh, 100px) clamp(24px, 4vw, 64px)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
          color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 20,
        }}>What&apos;s Coming</p>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 400, color: '#f0ece4', letterSpacing: '0.02em',
          marginBottom: 40, lineHeight: 1.05,
        }}>This Is Just The Beginning.</h2>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: 16,
          maxWidth: 620,
        }}>
          {[
            { label: 'Swedish version', desc: 'Full Swedish-language support — resort descriptions, planner, everything.' },
            { label: 'Live flight search', desc: 'See actual flights and prices to your chosen resort, right inside Alpkoll.' },
            { label: 'More resorts', desc: 'Expanding beyond 38 to cover more of the Alps, Scandinavia, and beyond.' },
            { label: 'Snow & weather data', desc: 'Real-time snow depth and forecasts to help you pick the right week.' },
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              padding: '20px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#D4A574', flexShrink: 0,
                marginTop: 8,
              }} />
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18, fontWeight: 400, color: '#f0ece4',
                  letterSpacing: '0.03em', marginBottom: 6,
                }}>{item.label}</h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)', lineHeight: 1.65,
                }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ─────────────────────────── */}
      <div style={{
        maxWidth: 900, margin: '0 auto',
        padding: '0 clamp(24px, 4vw, 64px)',
      }}>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
      </div>

      {/* ── Contact ──────────────────────────── */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: 'clamp(60px, 8vh, 100px) clamp(24px, 4vw, 64px)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
          color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 20,
        }}>Get In Touch</p>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 400, color: '#f0ece4', letterSpacing: '0.02em',
          marginBottom: 28, lineHeight: 1.05,
        }}>Questions? Ideas? Found a bug?</h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300,
          color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
          marginBottom: 32, maxWidth: 620,
        }}>
          Alpkoll is a work in progress and feedback makes it better. Whether 
          you&apos;ve got a resort suggestion, spotted an error, or just want to 
          say hello — reach out.
        </p>
        <a href="mailto:hello@alpkoll.com" style={{
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#121110', background: '#D4A574',
          border: 'none', borderRadius: 3, padding: '15px 32px',
          cursor: 'pointer', textDecoration: 'none',
          display: 'inline-block',
          transition: 'background 0.25s',
        }}>hello@alpkoll.com</a>
      </section>

      {/* ── Footer spacer ────────────────────── */}
      <div style={{ height: 'clamp(40px, 6vh, 80px)' }} />
    </div>
  );
}