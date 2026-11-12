# Dallas United FC: website

The full club website plus the club admin. Plain HTML, CSS and JavaScript:
no installs and no build step.

## Open it in Visual Studio Code

1. Unzip the folder and open it in VS Code (**File → Open Folder…**).
2. Install the **Live Server** extension (VS Code will suggest it).
3. Right-click `index.html` → **Open with Live Server**.
   The site opens at http://127.0.0.1:5500 and reloads every time you save a file.

You can also double-click `index.html` to open it in a browser. Everything works
that way too, except "install as an app", which needs Live Server or real hosting.

## The admin

Open **admin.html** (or click "Staff login" at the bottom of any page).

- Email: `alcino@dallasunitedfc.com`
- Code: `482913`

Change the codes in **Team & access**. Each person gets their own email + code and
only sees the sections they're allowed to use.

How saving works right now:

- Changes save by themselves as a **draft**. Press **Preview** to see the site with them,
  and **Publish** to put them live.
- **Live match mode** and visitor data (founders, tryout sign-ups, orders, questions…)
  go live straight away.
- Everything is stored **in your browser** (localStorage). That's perfect for building and
  testing, but each browser has its own copy. The next step (database) fixes that, so
  the whole team and every visitor share the same data.
- **Settings → Reset all content** puts the example content back.

## Folders

```
index.html … 404.html     one file per page
admin.html                the club admin
assets/css/site.css       the look of the whole site (colours at the top)
assets/css/admin.css      the admin's look
assets/js/data.js         the starting content (news, fixtures, squad, shop…)
assets/js/store.js        saving + loading  ← the only file that changes for the database
assets/js/i18n.js         English / Español words
assets/js/ui.js           menu, footer, cookie notice, shared pieces
assets/js/pages/*.js      one file per page
assets/js/admin/*.js      the admin (core + every section)
assets/js/qr.js           QR code maker
assets/js/registry.js     list of editable texts/pictures (made by tools/build_registry.py)
assets/brand/             the crest, DU letters, app icons, link-preview image
assets/img/               photos and product pictures
manifest.webmanifest, sw.js   "add to home screen" (install as an app)
```

## Colours

| Name | Hex | Used for |
|---|---|---|
| Dallas Navy | `#0A1628` | main dark colour, text |
| Lone Star Gold | `#F5B700` | buttons, highlights |
| Trinity Blue | `#1452D9` | links, labels |
| Deep blue | `#0F2A5E` | footer |
| Limestone | `#F1F0EC` | page background |

## Turn things on and off (Admin → Website switches)

Every page and home page section has an on/off switch: Shop, Tryouts, DU TV, Founders wall, The 214 Club, Our story, the countdown, the next-match bar, partner logos, the newsletter box, fan accounts and more.

- **Off** hides it everywhere: the menu, the footer, the home page, the fan account and its own page (anyone with an old link lands on the home page).
- **On** brings it back exactly as it was. Nothing is deleted.
- **DU TV paid passes** is off: DU TV is free for everyone. Turn it on and the audio and video passes come back with the same design.
- Press **Publish** after switching.

## Launch mode (the big switch)

Admin → Website switches → **Launch** puts the whole site in "we just started" mode with one switch:

- **Hidden:** standings, the next-match bar, the matchday block, the shop bag and the home page store section, and home slides that point to pages not open yet. The "Dallas United is here" slide loses its "See fixtures" button.
- **Coming soon page** (crest, short text, an email box for updates, Home and Tryouts buttons): DU TV, Shop, Match Centre, Ask the squad, Sign in and My account. The DU TV section on the home page stays.
- **Countdown page:** Matches shows the countdown to the first kickoff (Admin → Countdown sets the date).
- **Works as normal:** Home, News, Team, Tryouts, Founders, Our story, Partners, Volunteer, Support and Legal.
- Emails left in the coming-soon boxes go to Admin → Fans → Subscribers, tagged with the page they came from.
- All coming-soon texts can be changed like any other text.
- Turn Launch **off** when the season starts: everything comes back, nothing is lost. You can still look at a hidden page as an admin by adding `?asFan` to its address.

## Change any text, picture, icon or colour

- **Website text**: every word on every page. Pick a page or search for the words you see. Leave a box empty to go back to the original.
- **Website pictures & icons**: every big picture, the crest and the Instagram / TikTok / X / YouTube / Facebook icons. Upload your own PNG or paste a link.
- **Colors & Christmas**: change the club colours (or go back to the originals) and turn on **Christmas mode** with one click: a red and white banner on top, falling snow, green and red touches and a Christmas motto in the footer. Navy and gold stay.
- Partner names and logos are in **Partners**, everything else (news, players, matches, products, slides, tryouts, Our story) in its own section.

## Fan accounts (My Dallas United)

Fans sign up on **login.html** and land on **account.html**: next match, favourite player, founder card, 214 Club card, orders with tracking, donations, questions to the squad, profile and email/text settings. Sections follow the switches (shop off = no Orders tab, and so on).

In Admin → **Fan accounts** you see everyone who signed up (download as CSV), and **See the site as a fan** opens the account page as a test fan or as any fan by email. Nothing you click there is saved.

## For developers: the text registry

Texts and pictures in the page scripts are written as `DU.x('page.key', 'Default text')` and `DU.pic('page.key', 'assets/img/…')`. If you add new ones, run this from the folder above `site/` so they show up in the admin:

```
python3 tools/build_registry.py site
```

After changing page titles or descriptions in `tools/seo.py`, run `python3 tools/seo.py site` the same way.

## Showing up on Google (SEO)

Already done in the code:

- **Titles and descriptions** for every page, written with the words people search: "soccer club in Dallas", "soccer tryouts in Dallas, TX", "Dallas United FC". This is what Google shows in its results.
- **Club information for Google** (structured data): name, other names (Dallas United, DUFC), logo, city, the areas we serve (Dallas, Irving, Fort Worth, Arlington, Plano and more) and the five social accounts. This helps Google show the club box with the logo when someone types our name.
- **Tryout sessions and upcoming matches** are sent to Google as events, straight from the admin, so they can show up with their date and place.
- **sitemap.xml and robots.txt**: the list of pages for Google.
- A **plain-text version** of every page for search engines and link previews that don't run JavaScript.
- Link previews (WhatsApp, iMessage, Facebook, X) show the crest picture, the title and the description.
- The admin, sign-in and fan account pages are hidden from Google.

To change the titles, descriptions, areas or social links, edit the top of `tools/seo.py` and run `python3 tools/seo.py .` from the website folder. If the website address is not dallasunitedfc.com, change `SITE` there first.

**Before going live, replace the example content** (example matches, tryout dates, news, players). Google reads everything on the site as real.

Things only you can do (in this order, once the site is online):

1. **Google Business Profile** (business.google.com). The most important one for "near me" searches and Google Maps. Category: Soccer club. Use the home ground's address if the club has one; if not, hide the address and add the service areas (Dallas, Irving, Fort Worth, Arlington, Plano…). Add the logo, photos, website, phone and hours, and ask players and fans for reviews.
2. **Google Search Console** (search.google.com/search-console). Add the domain (it gives you a code to paste at the domain company), then send `https://dallasunitedfc.com/sitemap.xml`. Use "URL inspection → Request indexing" for the home page and tryouts page.
3. **Bing Webmaster Tools** (bing.com/webmasters). Import from Search Console in one click. Covers Bing, Yahoo and DuckDuckGo.
4. **Apple Business Connect** (businessconnect.apple.com) for Apple Maps and Siri. Safari itself uses Google.
5. **Get other sites to link to us**: the league, local news, sponsors, Dallas soccer groups, the parks where tryouts happen. Each link tells Google the club is real.
6. **Keep the site fresh**: a news post every week and real tryout dates.

Brand searches ("Dallas United FC") usually show up within days to a few weeks. Searches like "soccer tryouts near me" take longer, because bigger clubs compete for them; the Google Business Profile, reviews and links are what move it.

## League (UPSL) and the top of the site

- **Top bar (home page):** on computers it shows the UPSL logo, "UPSL · Division 1", the next match, kick-off time and the countdown. On phones it is one short line: UPSL logo · Next match · date · vs opponent.
- **Footer:** "Proud member club of the [UPSL logo] United Premier Soccer League" on every page.
- Turn both off with **Admin › Website switches › League logo**. Change the names in **Admin › Settings** (league short name, division, full name) and the logo file in **Admin › Website pictures** (use the official file the UPSL sends).
- **Language:** English and Español. The flag button shows the language you switch to (Mexican flag on the English site, US flag on the Spanish site).
- **Bag:** the shopping bag next to sign-in shows how many items are in the bag and opens it. It disappears when the shop is switched off.
- On phones the menu bar shows only the crest, flag, bag, sign-in and menu.

## The Matches page

- **Match day** tab: a navy top like every page head, with latest results and a short table on the left, the big match card in the middle, and the line-up, match stats and DU TV on the right. Under it, on the limestone background: upcoming fixtures, the full standings and match highlights.
- The big match card changes by itself: **before kickoff** (countdown, Add to calendar, fan vote "Who will win?"), **live** (LIVE and the minute, score, scorers, a 0–90 timeline of goals and cards) and **full time** (final score, highlights, Match Centre).
- **Fixtures**, **Results** and **Standings** tabs work like before (competition and month filters).
- **Sync to my calendar** downloads every match (or home matches only) in one calendar file, with an optional reminder 1 hour before. It works with Apple Calendar, Outlook and Google Calendar (Settings → Import). A link that updates by itself comes with the database.
- The fan vote counts one vote per device for now. Shared totals for everyone come with the database. Match stats only show when the match reporter enters them.
- The background picture of the match card is in Admin → Change texts and pictures (`matches.heroBg`).

## The line-up editor (Admin → Line-ups)

- **Formation:** tap 4-3-3, 4-4-2, 4-2-3-1 and the rest, or a formation you saved.
- **Click a player on the pitch:** set as captain, penalty taker, free kick taker, corner taker (left or right), Substitute, or Move to bench. The menu stays open so you can set several things at once.
- **Substitute:** players for the same position come first. If the captain comes off, you pick who gets the armband.
- **Drag with the mouse:** bench → a player on the pitch makes the substitution; a player on the pitch → the bench asks who comes on; pitch → pitch swaps two players.
- **Custom formation:** press Custom, then press and hold a player and move them (they snap to a grid). Name it and press Save formation: it shows next to the other formations from then on.
- **Set pieces**, **Unavailable** (the reason comes from Player availability) and **Rest of the squad** (Add to bench) are on the right.
- **Forward:** makes a one-page team sheet PDF (starting 11 with numbers, subs, captain and set-piece takers, unavailable players and the reason, staff, signature line) and opens an email to the people you choose. Save the referee, league, opponent and coaches emails once in Admin → Settings. Attach the PDF you downloaded; sending with the PDF attached automatically comes with the club email service.

## Match day: how live mode works

1. Before the game, set the team in Admin → **Line-ups** (see "The line-up editor" below).
2. At the stadium, open Admin → **Live match mode** on your phone and press **Kick-off**.
3. Tap what happens: goals, penalties, own goals, cards, subs. The home page Match Day section, the Matches page and the Match Centre switch to LIVE and update by themselves every few seconds.
4. The match keeps running if you close the page or go back to the website. Staff login (footer) takes you straight back. Only **Full time** ends it.

## Founder cards

Fans must follow the club (Instagram, TikTok or YouTube) to claim a number. Their number is reserved straight away; check them in Admin → Founders → **Approve**, then **Send card**. Turn the rule off with "Follow to claim".

## Things that are switched off for now

- **Tickets**: every ticket button is hidden. Turn them back on in Admin → Settings → "Ticket buttons". The ticket links on each fixture are kept.
- **Texting cards**: when a founder types their phone number, it is saved and shows in Admin → Founders. Real texts go out automatically once a text service (e.g. Twilio) is connected. Until then, use "Send card" → "Text it" in the admin: it opens Messages on your phone with the card link ready.
- **Wallet passes**: the Apple / Google Wallet buttons show a message until the passes are set up with Apple and Google.

## The promo video (home page)

The full-width video plays muted, on a loop, and can't be paused or clicked. The file is `assets/video/club-loop.mp4` (a placeholder made from the club pictures). To use your own: drop an .mp4 in `assets/video/`, then put its name in Admin → Homepage → "Video file". Keep it short (10 to 30 seconds) and under about 10 MB so it loads fast on phones.

## What's connected later (next steps)

| Feature | Today | Next step |
|---|---|---|
| Database (shared data, real sign-in) | saved in the browser | Supabase |
| Shop + donation payments | test checkout, no card charged | Stripe (or Shopify) |
| Newsletter, birthday & automatic emails | written and previewed in the admin | Mailchimp |
| Auto-posting to social media | settings saved | posting service |
| Visitor stats | club numbers only | privacy-friendly analytics |
| Apple / Google Wallet player cards | card designed, button shows a message | Wallet pass service |
| Tickets | links to Eventbrite / Ticketmaster | (already works) |
| Fan sign-in (Google / Apple) | email form only | Supabase Auth |

Before launch: have a lawyer review the text on `legal.html`, and replace the example
content (news, players, fixtures, partners) with the real club content.

## The 214 Club, Founders and the member cards

- **214-club.html** is the free supporters club. Fans follow us on social media (switch in Admin → Homepage → The 214 Club → "Follow to join"), fill in the form and get the blue card with their member number straight away. Fan of the Month is set in the same place.
- **founders.html**: the founder pass is now paid ($10 once, first 2,000, closes at the first kickoff, 5% to youth soccer). Price, closing date and the youth percentage are in Admin → Founders. There is no follow step any more. The page explains the Founders mark and the gold card.
- **The cards** (gold and blue) are pictures in `assets/img/card-*.jpg` with the number, name, area and month written on top live. Move the mouse to turn a card, click or tap to flip it. To change the art, re-run `cards/cards.py` from the card kit.
- Wallet buttons show a message until real Apple / Google Wallet passes are set up (needs an Apple Developer account and a Google Wallet issuer account).

## Shop: Founders shop, pre-orders, names and numbers

- **founders-shop.html** shows products marked "Founders only". Founders unlock it with their founder number and the email they paid with. Tees marked "Founder number" carry their number on the back of the neck.
- Products with a back picture show the back when the mouse is over them.
- **Pre-order**: tick "Pre-order" on a product and set the closing date in Admin → Shop & orders. Until then every size is open with a countdown; after it closes, enter stock per size and the shop shows "3 left" or "Sold out".
- **Name and number** (+$15, up to 12 letters) with a live preview. Custom items can't be returned. Every name waits in **Admin → Shop & orders → Names waiting for a check** (Approve / Fix spelling / Refuse). Rude words are flagged automatically.
- **Pre-order totals** by size and **Download factory order** give the jersey company a spreadsheet of every shirt (size, name, number) plus extra blanks.
- **Pickups**: "Text: it's ready" opens Messages with the text written, and marks the order Ready.
- **Shop address**: put `https://shop.dallasunitedfc.com` in Admin → Shop & orders → Shop address once that address exists. Shop links open in a new tab (switch in the same place). Until the shared database is live, a bag started on one address doesn't carry over to the other.

## Our story: the crest, one symbol per scroll

The crest stays pinned while each scroll lights up one part (`assets/brand/crest-steps/*.svg`). Titles, texts, photos and which part lights up are in Admin → Our story. Scrolling back up from below starts at the last symbol.

## Version 10 (November 2026)
- Founders: 500 spots at $25, no deadline. Date of birth required (birthday messages), phone optional.
- 214 Club: no perks list, date of birth on the form, phone-wallet picture (Admin → Website pictures → club.walletImg). Member cards turn with the mouse but no longer flip.
- Launch mode now also hides the shop and Partner with us. New switches: Stats in the Match Centre, “Watch live” button.
- Matches: one clean match card (no side panels, no fan poll). “Watch live” plays the YouTube link set on the fixture (Admin → Fixtures → Live stream link).
- Tryouts: step-by-step registration (welcome → player info → waivers with typed signature → review → confirmation). Fee, venue, age text and the waiver texts are in Admin → Tryouts. Have a Texas attorney review the waivers.
- Volunteer form: waiver + typed signature. Our Story: bigger pictures and an editable “Our story” section.
- No “Dallas Stadium” anywhere: home venue shows as “Home field (TBA)” until you set one.
