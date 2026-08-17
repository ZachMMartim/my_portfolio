// PrivacyPolicy.jsx — what the site collects, in the terminal vocabulary
//
// This page previously declared a navigate() it never used and had no return
// statement at all. React 18 tolerates an undefined return rather than
// throwing, so it rendered a blank page silently while the footer linked to it
// from every route.
//
// Everything below is checked against the code rather than boilerplate: the
// ask bar posts to /api/chat, which forwards to Anthropic and persists no
// transcript, and the only recorded data comes from the two tools the model
// can call.

import TermNav from "../../components/Navigation/TermNav";
import "./PrivacyPolicy.css";

const UPDATED = "14 August 2026";

const PrivacyPolicy = () => {
  return (
    <div className="privacy">
      <div className="term-window">
        <header className="term-header">
          <div className="term-dots" aria-hidden="true">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="term-title">zach@portfolio — cat PRIVACY.md</span>
          <TermNav />
        </header>

        <div className="privacy-body">
          <p className="prompt">
            <span className="prompt-sigil">$</span> cat PRIVACY.md
          </p>
          <h1 className="privacy-title">Privacy</h1>
          <p className="privacy-lede">
            This is a personal portfolio. It sets no cookies, runs no analytics,
            and stores nothing in your browser. The short version: unless you
            type into the ask bar, nothing about you is recorded.
          </p>
          <p className="privacy-updated">Last updated {UPDATED}</p>

          <section className="privacy-section">
            <h2 className="privacy-head">
              <span className="privacy-label">browsing</span>
              <span className="privacy-rule" />
            </h2>
            <p>
              The site is static files on Firebase Hosting. Google records
              standard request logs for it — IP address, user agent, the page
              requested — the same as any web server. I do not add tracking of
              my own, and there is no cookie banner because there are no
              cookies.
            </p>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-head">
              <span className="privacy-label">the ask bar</span>
              <span className="privacy-rule" />
            </h2>
            <p>
              Messages you send go to a function I run, which forwards them to{" "}
              <a
                href="https://www.anthropic.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Anthropic
              </a>{" "}
              to generate a reply. Your conversation is <strong>not</strong>{" "}
              stored — there is no database behind it, and the transcript exists
              only in your browser tab until you close it.
            </p>
            <p>
              Two things are recorded, and only when they happen:
            </p>
            <ul className="privacy-list">
              <li>
                <span className="privacy-key">your email</span> — if you offer
                one because you want to get in touch, so that I can reply. Any
                name or context you give comes with it.
              </li>
              <li>
                <span className="privacy-key">unanswered questions</span> — the
                text of a question the assistant could not answer, so I can fill
                the gap. This is the question only, not the rest of the
                conversation.
              </li>
            </ul>
            <p>
              Both go to Google Cloud Logging on my project, which retains them
              for 30 days by default. Nobody but me can read them.
            </p>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-head">
              <span className="privacy-label">other people's servers</span>
              <span className="privacy-rule" />
            </h2>
            <p>
              Loading the site makes requests to a few third parties, each of
              which sees your IP address as a result:
            </p>
            <ul className="privacy-list">
              <li>
                <span className="privacy-key">fonts.googleapis.com</span> and{" "}
                <span className="privacy-key">fonts.gstatic.com</span> — the
                typefaces
              </li>
              <li>
                <span className="privacy-key">cdnjs.cloudflare.com</span> — a
                CSS reset
              </li>
              <li>
                <span className="privacy-key">androidauthority.com</span> — the
                desktop wallpaper behind the opening terminal
              </li>
            </ul>
            <p>
              Anthropic is deliberately not on that list. Your browser talks
              only to this site; the call to Anthropic is made by my server
              afterwards, so they receive what you typed but never your IP
              address.
            </p>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-head">
              <span className="privacy-label">removing your data</span>
              <span className="privacy-rule" />
            </h2>
            <p>
              If you gave me your email through the ask bar and want it gone,
              write to{" "}
              <a href="mailto:zachmartim101@gmail.com">
                zachmartim101@gmail.com
              </a>{" "}
              and I will delete it. There is not much to delete — an email
              address and whatever context came with it.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
