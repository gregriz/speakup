 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/index.html b/index.html
new file mode 100644
index 0000000000000000000000000000000000000000..7d44bdb0b748d736821972424f2d7b8fa99b4b0b
--- /dev/null
+++ b/index.html
@@ -0,0 +1,191 @@
+<!DOCTYPE html>
+<html lang="en">
+<head>
+  <meta charset="UTF-8" />
+  <meta name="viewport" content="width=device-width, initial-scale=1" />
+  <title>SpeakUp AUEB Gen</title>
+  <link rel="preconnect" href="https://fonts.googleapis.com" />
+  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
+  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
+  <link rel="stylesheet" href="styles.css" />
+</head>
+<body>
+  <a class="skip-link" href="#main">Skip to content</a>
+
+  <header class="top-bar" role="banner">
+    <button class="icon-button" type="button" aria-label="Open menu" data-menu-open>
+      <span></span>
+      <span></span>
+      <span></span>
+    </button>
+    <div class="top-bar__logo" aria-hidden="true">
+      <span class="arrow"></span>
+    </div>
+    <nav class="top-bar__social" aria-label="Social links">
+      <a href="https://www.linkedin.com" aria-label="LinkedIn">in</a>
+      <a href="https://www.instagram.com" aria-label="Instagram">◎</a>
+    </nav>
+  </header>
+
+  <div class="menu" role="dialog" aria-modal="true" aria-hidden="true" data-menu>
+    <div class="menu__panel">
+      <button class="menu__close" type="button" aria-label="Close menu" data-menu-close>×</button>
+      <h2>Menu</h2>
+      <nav class="menu__nav" aria-label="Main navigation">
+        <a href="#home">Home</a>
+        <a href="#events">Events</a>
+        <a href="#about">About</a>
+        <a href="#contact">Contact</a>
+      </nav>
+    </div>
+  </div>
+
+  <main id="main">
+    <section id="home" class="hero">
+      <div class="hero__logo">
+        <div class="globe"></div>
+        <div class="hero__mark">
+          <span class="mark-title">Speak<span>UP</span></span>
+          <span class="mark-subtitle">AUEB GEN</span>
+        </div>
+      </div>
+      <p class="hero__tagline">
+        Helping young people develop their communication and public speaking skills
+      </p>
+      <nav class="hero__social" aria-label="Social links">
+        <a href="https://www.linkedin.com" aria-label="LinkedIn">in</a>
+        <a href="https://www.instagram.com" aria-label="Instagram">◎</a>
+      </nav>
+    </section>
+
+    <section class="sponsors" aria-label="Sponsors">
+      <div class="sponsor">Korpi</div>
+      <div class="sponsor">NESCAFÉ</div>
+      <div class="sponsor">Γρηγόρης</div>
+      <div class="sponsor">ΠΛΑΙΣΙΟ</div>
+    </section>
+
+    <section class="carousel" aria-label="Highlights">
+      <button class="carousel__nav" type="button" aria-label="Scroll left" data-carousel-prev>‹</button>
+      <div class="carousel__track" data-carousel-track>
+        <article class="carousel__card">
+          <div class="card__image card__image--team"></div>
+          <h3>Meet the <strong>Team</strong></h3>
+        </article>
+        <article class="carousel__card">
+          <div class="card__image card__image--events"></div>
+          <h3>Upcoming <strong>Events</strong></h3>
+        </article>
+      </div>
+      <button class="carousel__nav" type="button" aria-label="Scroll right" data-carousel-next>›</button>
+    </section>
+
+    <section id="about" class="about">
+      <div class="about__content">
+        <h2>About us</h2>
+        <p>
+          Speak Up is a student organization based at the Athens University of Economics and Business (AUEB) that
+          helps young people develop their communication and public speaking skills. Through interactive workshops,
+          events, and collaborative projects, we empower students to express their ideas confidently and authentically.
+        </p>
+        <p>
+          Our mission is to create a supportive community where every voice is valued, heard, and encouraged to grow.
+          At Speak Up, we believe that effective communication is not just a skill; it is the foundation of leadership,
+          connection, and meaningful impact.
+        </p>
+        <div class="about__chips">
+          <span>Since 2025</span>
+          <span>25+ members</span>
+          <div class="about__social">
+            <a href="https://www.linkedin.com" aria-label="LinkedIn">in</a>
+            <a href="https://www.instagram.com" aria-label="Instagram">◎</a>
+          </div>
+        </div>
+      </div>
+      <div class="about__logo" aria-hidden="true"></div>
+    </section>
+
+    <section id="events" class="events">
+      <h2>What’s next?</h2>
+      <div class="events__grid">
+        <article class="event-card">
+          <div class="event-card__poster event-card__poster--pitch"></div>
+          <div class="event-card__details">
+            <h3>December 12th</h3>
+            <p>18:00 - 21:00</p>
+            <a class="button" href="#contact">Sign up here</a>
+          </div>
+        </article>
+        <article class="event-card">
+          <div class="event-card__poster event-card__poster--you"></div>
+          <div class="event-card__details">
+            <h3>January 21st</h3>
+            <p>18:00 - 21:00</p>
+            <a class="button" href="#contact">Sign up here</a>
+          </div>
+        </article>
+      </div>
+    </section>
+
+    <section class="calendar" aria-labelledby="calendar-title">
+      <h2 id="calendar-title">Event calendar</h2>
+      <div class="timer" aria-live="polite">
+        <span class="timer__value" data-days>00</span>
+        <span class="timer__label">Days</span>
+        <span class="timer__value" data-hours>00</span>
+        <span class="timer__label">Hours</span>
+        <span class="timer__value" data-minutes>00</span>
+        <span class="timer__label">Mins</span>
+      </div>
+      <a class="calendar__link" href="#contact">Be the first to know</a>
+      <button class="back-to-top" type="button" aria-label="Back to top" data-back-to-top>↑</button>
+    </section>
+
+    <section class="team" aria-labelledby="team-title">
+      <h2 id="team-title">Meet the team</h2>
+      <div class="team__grid">
+        <article class="team__card">
+          <h3>Partnerships Manager</h3>
+        </article>
+        <article class="team__card">
+          <h3>Marketing Manager</h3>
+        </article>
+        <article class="team__card">
+          <h3>Community Manager</h3>
+        </article>
+        <article class="team__card">
+          <h3>Graphic Design Manager</h3>
+        </article>
+      </div>
+    </section>
+  </main>
+
+  <footer id="contact" class="footer">
+    <div class="footer__logo">
+      <span>SpeakUP</span>
+      <span>AUEB</span>
+    </div>
+    <div class="footer__links">
+      <a href="#contact">Become a member</a>
+      <a href="#about">Who we are</a>
+      <a href="#">FAQ</a>
+      <a href="#contact">Contact</a>
+      <a href="#">Blog</a>
+    </div>
+    <form class="footer__newsletter" aria-label="Newsletter">
+      <label for="newsletter-email">Sign up for our newsletter</label>
+      <div class="footer__input">
+        <input id="newsletter-email" type="email" name="email" placeholder="john.doe@gmail.com" required />
+        <button type="submit">Join</button>
+      </div>
+    </form>
+    <div class="footer__social" aria-label="Social links">
+      <a href="https://www.linkedin.com" aria-label="LinkedIn">in</a>
+      <a href="https://www.instagram.com" aria-label="Instagram">◎</a>
+    </div>
+    <div class="footer__legal">Copyright © 2025 SpeakUp - All rights reserved. | Terms & Conditions</div>
+  </footer>
+
+  <script src="script.js"></script>
+</body>
+</html>
 
EOF
)
