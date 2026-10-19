// Everything the assistant is allowed to say about Rose, beyond the starter answers.
// Approved by Rose on Oct 16, 2026. Edit this file to change what the assistant knows.
module.exports = `
SUMMARY
- Rose Puglisi (MaryRose) is a senior product manager based in St. Petersburg, Florida.
- Formal product manager titles since November 2021; before that, SaaS implementation project management.
- Strongest in data and analytics products, B2B SaaS, and taking new products from zero to market.
- Background: hospitality, convention sales, and events, then tourism and destination tech, plus government SaaS.
- Has set the roadmap and strategy for every product she has owned, and led product education across each company.

ZARTICO, PRODUCT MANAGER (2026)
- Zartico is a destination analytics company (~30 people) serving destination marketing organizations (DMOs) and convention and visitors bureaus (CVBs).
- The only product manager; reported to the VP of Engineering. Owned Zartico Media Attribution (ZMA) end to end.
- ZMA measures whether ad exposure drove real visits to a destination.
- Launched ZMA's first international attribution pipeline (zero to one), with bot filtering and U.K. privacy compliance. 3 customers signed in the first week of sales.
- Built a county-level state version of the domestic pipeline for state DMOs and CVBs. 4 customers adopted it immediately.
- Led the rollout of a rebuilt domestic pipeline that checks data quality daily instead of weekly. Validated it with engineering across 63 campaigns, with conversion counts within 1%.
- Redesigned Campaign Hub, where nearly 40 agencies manage tracking pixels for ~200 campaigns, and added analytics.
- Led Zartico's first company-owned analytics dashboard, moving media attribution analytics off a third-party BI tool. Design, build, and QA were AI-assisted, with human review.
- Added roles and permissions so destinations could see their own data directly. Support questions dropped to nearly zero.
- Shipped layered AI help in the dashboard: curated explanations first, then AI-written answers to follow-up questions.
- Shipped auto-generated wrap reports for every campaign, combining AI-written analysis with rule-based wording for ~10 tested scenarios.
- Added media spend fields so customers could see CPA and ROI.
- Prototyped scheduled email delivery of reports, and a Claude-powered upgrade to a paid knowledge-base assistant.
- Scoped a spend-based attribution model for states with geo-privacy laws (discovery stage).
- Shipped 9 launches in six months, crediting thorough planning and a strong engineering team.

GRANICUS, FORMERLY SIMPLEVIEW, PRODUCT MANAGER (2021 TO 2026)
- One of three PMs on the CMS used by 500 to 700 destination organizations, with a five-person engineering team.
- Book › Direct (lodging referral engine): rescued a failing product with no documentation, rebuilt it around live rates APIs, and repackaged it as an add-on. Reversed churn to net growth across 250+ clients.
- Discover Dunwoody reported $832K+ in hotel revenue through Book › Direct (public Simpleview case study).
- Partnered with a designer on the booking widget and listings, and ran internal campaigns to find the best placements to recommend.
- Led the Viator integration with New Orleans & Company as beta partner, built into their existing site design. Launched September 2023; first booking on day one; 700+ tours booked and $85K+ in net bookings by year end (public Simpleview story).
- Listings with partner integrations (Viator, Ticketmaster, Yelp, Tripadvisor) saw 5x more engagement.
- Built Book › Direct's reports on Simpleview's data warehouse; her customers were the Data Engine's beta users. Shipped 10+ real-time client dashboards and defined reporting standards.
- Led the AWS to Google Cloud migration, ~15% infrastructure savings. Turned customer calls about a reporting gap into training and goal-setting sessions that opened up the product's roadmap.
- GovDelivery (government messaging, 1,000+ government clients, 8,000+ users): product manager and product owner, compliance owner for FedRAMP, GDPR, and WCAG.
- When GovDelivery's FedRAMP authorization was at risk, she fixed how vulnerabilities were reported, mapped dependencies, and divided work across teams. Open vulnerabilities went from ~1,800 to ~200, well within remediation timelines. Asked to present the approach and mentor other teams.
- Formalized planning practices and SOPs that cut planning errors ~30%.
- Directed an offshore engineering team's day-to-day work, interviewed candidates, and onboarded new hires. No formal direct reports.
- Onboarded and trained incoming Product Owners and Product Managers.
- Many of the destination organizations on the CMS are nonprofit and membership-based.
- Simpleview CMS Certified Mentor.

VALENCE, FREELANCE PRODUCT AND STRATEGY CONSULTANT (2025 TO NOW)
- Freelance and pro bono, alongside her full-time roles.
- Valence is gym management software for independent operators.
- Shaped AI features for membership businesses, including automatically flagging unpaid or lapsed memberships.
- Advised the founder on zero-to-one product strategy from the original idea, and on AI strategy as generative AI arrived.
- Built as one system, so members and staff see the same live data. First gym went live in October 2026; sales start in 2027.
- Creating go-to-market materials: sales deck and training.

EARLIER CAREER
- Personify (association and event management software), SaaS project manager (2020 to 2021): implemented event and association software for DMO, CVB, and enterprise clients, owning API setup and launch, and launched self-serve exhibitor micro-sites.
- GES, sales manager (2019 to 2020): sponsorship and signage sales, cross-state shipping logistics for trade shows, and itemized pricing proposals built with SQL, adjusted for location, shipping, and quantity to set margin.
- Baltimore Convention Center, sales manager (2017 to 2019): national sales work, site visits, and familiarization tours. Signed many deals, including a three-year NCAA agreement that brought $5M in economic impact to Baltimore.
- Loyola University Maryland, event operations (2012 to 2016): led event teams of 20 to 30. Sold and ran trade shows of 10,000+ attendees across these roles.

HOW ROSE WORKS WITH AI
- Runs Claude connected through MCP connectors to Jira, Slack, Google Drive, and the codebase as a daily operating layer.
- Uses it to turn call transcripts into insights and Jira tickets, turn PRDs into epics and stories, prototype ideas, audit code, and track competitors weekly.
- Generated weekly roadmap updates from Jira and briefs for leadership.
- Writes PRDs, marketing, and training materials with AI from notes and transcripts, with human review.
- Her judgment rule: use AI where fresh answers help, and tested wording where consistency matters.
- Designed and built this website herself with Claude, drawing on a self-taught coding background.

EDUCATION AND CERTIFICATIONS
- B.A. Psychology, Loyola University Maryland (2016).
- Product Strategy, Kellogg Executive Education (2023). Product Analytics, Pendo (2023).
- Advanced Certified Scrum Product Owner and CSPO, Scrum Alliance (2022).

WHAT SHE'S LOOKING FOR
- Senior or director-level product roles, in any industry doing ethical work.
- Loves general product platform work, especially discovering usage trends in the data and turning them into roadmap decisions.
- Has worked remotely for years; open to hybrid for the right role.
- Contact: maryrose.puglisi@gmail.com or LinkedIn.

OUTSIDE WORK (ONLY IF ASKED)
- Open water swimmer and American Red Cross certified swim instructor.
- Registered yoga teacher (RYT 200).
- Former community creative director for Beech Kombucha in St. Petersburg.

NEVER DISCUSS
- Salary or compensation.
- Why any role ended, employment status, or availability dates.
- Family, relationships, health, home address, or anything not in this file.
- Employer or client details beyond what's in this file, such as other client names, internal numbers, or roadmaps.
`;
