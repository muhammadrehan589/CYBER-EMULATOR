# Cyber Game — Full Build Plan

A gamified cybersecurity-awareness training platform. Employees log in, build an avatar, and learn to spot phishing and security threats through MCQs, live leaderboards, side quests, and (safely staged) "gotcha" moments — with a full admin panel behind it all.

---

## 0. What You're Building, In Plain Words

Think of it as **Kahoot + Duolingo + a phishing simulator**, wrapped around your company's actual security policies.

- Employees log in, make a little avatar, and answer security questions.
- They climb a live leaderboard, earn points/coins, and spend them in a shop.
- Some questions are traps — click the wrong QR code or popup, and it "punishes" you (flash, sound, a short animated video showing what a real attacker would have just done to you).
- Admins (you) can see everyone's activity, add or remove players, and manage the whole thing from a control panel.

Nothing here is unusual for a corporate security-training tool — this is the same idea platforms like KnowBe4 use, just wrapped in your own game.

---

## 1. Recommended Tech Stack

You can swap any of these, but this is a solid, well-supported default for what you're describing:

| Layer | Choice | Why |
|---|---|---|
| Frontend | React (Vite) | Component-based, huge ecosystem for animations/avatars |
| Real-time (leaderboard, reactions, drag-drop sync) | Socket.io | Simplest way to push live score/emoji updates to everyone |
| Backend | Node.js + Express | Pairs naturally with Socket.io |
| Database | PostgreSQL | Relational data (users, questions, scores, purchases) fits better than NoSQL here |
| Auth | JWT + bcrypt (or company SSO later) | Simple to start, upgradeable to SSO for company rollout |
| Avatar rendering | SVG layers or a library like Rive/Lottie for animated parts | Cheap to build, easy to add new accessories later |
| Video hosting (consequence clips) | Self-hosted MP4s via CDN, or a private Vimeo/S3 bucket | Keep them private — not for public YouTube |
| Sound effects | Freesound.org (CC-licensed) — flagged for you in Phase 7 | Free, legal to use in internal tools |
| Hosting | Company's own domain/server, or a VPS (DigitalOcean/AWS) behind your company VPN | You mentioned hosting on the company domain |

---

## 2. Roles & Permissions

Two roles to start — you can split further later (e.g. department admins):

**Player**
- Log in, build avatar, play, view leaderboard, shop, side quests.

**Admin (you)**
- Full player management: **add, remove, or suspend any player**
- View every player's **activity/status**: last login, questions attempted, pass/fail rate on phishing-style questions, points/coins, time spent
- Add/edit/remove questions from the bank
- Configure game settings (timers, difficulty curve, shop prices)
- Trigger or schedule live events (pairing rounds, wager rounds)
- Export reports (e.g. "who clicked the fake payment link 3+ times")
- Reset a player's progress or password

This is confirmed as its own build phase below (Phase 1) so it's not an afterthought bolted on later.

---

## 3. Build Phases

Each phase has a goal, what gets built, and a clear "done" checkpoint — so you always know what's next.

### Phase 0 — Decisions Before Any Code
**Goal:** Lock down the things that are expensive to change later.
- Confirm tech stack (Section 1) or your preferred alternative
- Decide: will this run on the open internet, company intranet, or VPN-only?
- Decide data retention rules for employee activity data (HR/legal input needed — see Section 5)
- Collect your ~1000 MCQs source material, or agree on a content-writing timeline
- **Done when:** you can answer "where does this live and who officially owns the data" in one sentence.

### Phase 1 — Accounts, Login & Admin Panel
**Goal:** Get people in the door, and get you in control.
- Login page: employee ID (optional), name (required), username (required)
- Backend user table: employee ID, name, department, username, role (player/admin)
- Password/PIN or magic-link login (decide based on company IT policy)
- **Admin panel v1:**
  - Player list (search, filter by department)
  - Add / remove / suspend a player
  - View a single player's activity log (logins, scores, questions answered, flags)
- **Done when:** you can log in as admin, add a test player, and see them appear.

### Phase 2 — Avatar / Character Creator
**Goal:** The fun, personal-ownership moment right after login.
- Base body + gender selection
- Hairstyle + hair color picker
- Clothing sets
- Skin color options
- Accessories: some free, some locked behind a point cost (shop wiring comes in Phase 6, but the "locked" UI goes in now)
- Save avatar to player profile, render it anywhere the player appears (leaderboard, reactions, etc.)
- **Done when:** a player can build and save a full avatar, and it reloads correctly next login.

### Phase 3 — Core Dashboard & Leaderboard
**Goal:** The main screen people live in.
- Layout: questions/game area on the left, leaderboard on the right
- Leaderboard shows every player's avatar + score
- Drag-and-drop leaderboard positioning/interaction
- Click any player to view their score + avatar
- Live emoji reactions players can fire at each other (real-time via Socket.io)
- **Done when:** two test accounts can see each other's live score changes and send each other an emoji without refreshing.

### Phase 4 — Question Bank & Quiz Engine
**Goal:** The actual content.
- Question schema: text, options, correct answer, difficulty, category (company-specific vs generic), format (standard MCQ, drag-and-drop ordering, spot-the-difference, timed reflex, branching scenario, vishing audio clip)
- Content build-out: ~1000 questions, 60%+ tied to your company/IT policies (e.g. the vendor-impersonation payment scam), rest generic security awareness
- "No repeat question per user" logic — track which questions each user has already seen
- Question delivery engine (serves next question, records answer, updates score)
- **Done when:** a player can complete a 20-question round with zero repeats, and answers are logged correctly.

### Phase 5 — Scoring, Timers & Adaptive Difficulty
**Goal:** Make the quiz feel alive, not static.
- Points/coins awarded per correct answer
- Random per-question timer (10–60s)
- Random multipliers for answer streaks
- Adaptive difficulty: track a rolling accuracy score per player; serve easier questions if they're struggling, harder ones if they're excelling
- **Done when:** a deliberately-bad test run gets easier questions, and a deliberately-good run gets harder ones, within the same session.

### Phase 6 — Shop, Boosters & Sabotage
**Goal:** Give points somewhere to go.
- Shop UI: avatar accessories + boosters, priced in points/coins
- Boosters: self-use (e.g. extra time, 50/50, skip) and sabotage (e.g. shrink an opponent's timer, freeze their screen briefly)
- Wallet/transaction system (spend, refund rules, anti-negative-balance checks)
- **Done when:** a player can buy an accessory and a booster, and use the booster against another live player.

### Phase 7 — QR Codes, Popups & "Gotcha" Effects
**Goal:** The core phishing-simulation moment — teaching by (safely) getting people to fall for it.
- QR code popups that enlarge on click
- Scanning routes to a separate, clearly-sandboxed internal page (never a real external site)
- On that page: bright screen-flash effect
- Sound effect on trigger — **flagging this for you now as promised:** free, legally-usable sound effects (CC0/CC-BY) are available on Freesound.org; we'll pick and license-check specific clips when we reach this phase
- Bogus (non-QR) popups trigger the same flash/sound
- **Accessibility guardrail (important, see Section 5):** flash effect must have an intensity cap and a way for photosensitive users to opt into a non-flashing alternative (e.g. a color-fade instead of a strobe)
- **Done when:** clicking a decoy QR/popup reliably triggers the effect, and the accessibility toggle works.

### Phase 8 — Consequence Videos
**Goal:** Turn a wrong answer on a critical question into a real lesson, not just a "wrong!" buzzer.
- Trigger condition: wrong answer on a flagged "critical" question (e.g. phishing-specific)
- Disclaimer screen shown first ("You're about to see what would have happened...")
- 10–30s simple animated clip showing the real-world consequence of that mistake
- Video library tagged to question categories, so the right clip plays for the right mistake
- **Done when:** failing a tagged critical question reliably shows disclaimer → correct clip → returns to quiz.

### Phase 9 — Special Modes & Side Quests
**Goal:** Variety, so the game doesn't get stale.
- Wager rounds: player stakes points on a hard question, doubles or loses them
- Pairing modes: 1v1 or 2v2, scored by most questions answered correctly
- Anonymous peer voting popups (shown to confuse/add social pressure, no real identity attached)
- Side quests: password-strength challenge, spot-the-phishing-email/link, plus room to add more later
- **Done when:** each mode can be started, played, and scored end-to-end by two test accounts.

### Phase 10 — Admin Analytics & Reporting
**Goal:** Turn raw activity into something you can act on.
- Dashboard: company-wide pass/fail rates on phishing-style questions, department breakdowns, most-failed questions
- Per-player drill-down: full activity/status history
- Export to CSV/PDF for HR or security team reporting
- Alerts: flag repeat offenders (e.g. clicked 3+ decoy links) for follow-up training
- **Done when:** you can generate a report answering "which department is most at-risk" in one click.

### Phase 11 — Testing, Accessibility & Security Review
**Goal:** Make sure the "fun" parts don't cause real problems.
- Accessibility pass: flash/strobe limits, screen-reader support on core flows, color-contrast check
- Security review: this app will store employee activity data and simulate attacks — get IT/security sign-off on data handling
- Legal/HR sign-off: simulated phishing + "punishment" videos should be reviewed and disclosed to staff before launch (standard practice for phishing-simulation tools)
- Load test the real-time leaderboard with a realistic concurrent-user count
- **Done when:** you have written sign-off from IT/security and HR, plus a passed accessibility checklist.

### Phase 12 — Pilot Launch & Iteration
**Goal:** Ship to a small group first, not the whole company at once.
- Pilot with one department (small blast radius if something's off)
- Collect feedback + bug reports
- Watch the admin analytics for anything unexpected (e.g. a question everyone gets wrong — might be a bad question, not bad security awareness)
- Full company rollout once the pilot is clean
- **Done when:** pilot group completes a full week with no P1 bugs, and feedback is net positive.

---

## 4. Important Guardrails (Read Before Phase 7–8)

A few things worth deciding early because they're cheap to build in now and expensive to bolt on later:

- **Photosensitivity risk:** bright flashing effects can trigger seizures in a small percentage of people. Build the accessibility toggle from Phase 7 in from day one, not as a patch later.
- **Consent & disclosure:** since this simulates real phishing attempts against your own staff, most companies disclose (at a high level) that security-awareness simulations will occur, without giving away specifics that would defeat the test.
- **Data handling:** you'll be storing who clicked what and who failed which questions — get an explicit answer from IT/security on retention period and who can see individual (not just aggregate) results.

None of this blocks you from starting — just sequence Phase 0 and Phase 11 with these in mind so you're not redoing work.

---

## 5. Reference Points (Inspiration, Not Copying)

Worth a look for UX ideas, not for copying content:
- **KnowBe4** — the closest existing product to what you're building (phishing simulation + training)
- **Kahoot** — live quiz pacing, timers, and leaderboard energy
- **Duolingo** — streaks, adaptive difficulty, shop/points loop
- **Among Us** — simple, expressive avatar customization on a budget

---

## 6. Suggested Build Order Summary

```
Phase 0  → Decisions
Phase 1  → Login + Admin Panel        ─┐
Phase 2  → Avatar Creator             │  Can build in parallel
Phase 3  → Dashboard + Leaderboard    ─┘
Phase 4  → Question Bank + Engine
Phase 5  → Scoring + Adaptive Difficulty
Phase 6  → Shop + Boosters
Phase 7  → QR/Popup Effects
Phase 8  → Consequence Videos
Phase 9  → Special Modes + Side Quests
Phase 10 → Admin Analytics
Phase 11 → Testing + Accessibility + Sign-off
Phase 12 → Pilot → Full Launch
```

Next step: pick a starting point (Phase 0 or straight into Phase 1), and we build it piece by piece.
