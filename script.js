// NITA CC Interactive Scripts
document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 1.5 Mobile Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking any nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // 2. Scroll Reveal Animations uses Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Counter Animation for Stats Section
    const counters = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCounter();
            });
        }
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // 4. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]:not(.btn-apply-trigger)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    // 5. Interactive MECE Issue Tree Inspector
    const treeNodes = document.querySelectorAll('.tree-node');
    const inspectorTitle = document.getElementById('inspector-title');
    const inspectorDesc = document.getElementById('inspector-desc');

    if (treeNodes.length > 0 && inspectorTitle && inspectorDesc) {
        treeNodes.forEach(node => {
            node.addEventListener('click', () => {
                treeNodes.forEach(n => n.classList.remove('active'));
                node.classList.add('active');

                // Mobile Accordion Logic
                if (window.innerWidth <= 768) {
                    if (node.classList.contains('node-branch')) {
                        const branch = node.closest('.tree-branch');
                        if (branch.classList.contains('expanded')) {
                            branch.classList.remove('expanded');
                        } else {
                            document.querySelectorAll('.tree-branch').forEach(b => b.classList.remove('expanded'));
                            branch.classList.add('expanded');
                        }
                    } else if (node.classList.contains('node-root')) {
                        document.querySelectorAll('.tree-branch').forEach(b => b.classList.remove('expanded'));
                    }
                }

                const title = node.getAttribute('data-title') || node.querySelector('h3, h4, h5')?.innerText;
                const detail = node.getAttribute('data-detail') || 'Deep dive analytical framework node for case problem solving.';

                inspectorTitle.style.opacity = '0';
                inspectorDesc.style.opacity = '0';

                setTimeout(() => {
                    inspectorTitle.innerText = title;
                    inspectorDesc.innerText = detail;
                    inspectorTitle.style.transition = 'opacity 0.2s ease';
                    inspectorDesc.style.transition = 'opacity 0.2s ease';
                    inspectorTitle.style.opacity = '1';
                    inspectorDesc.style.opacity = '1';
                }, 150);
            });
        });
    }

    // 6. Application Modal Control
    const modalOverlay = document.getElementById('apply-modal');
    const modalClose = document.getElementById('modal-close');
    const applyTriggers = document.querySelectorAll('.btn-apply-trigger');
    const iframe = document.getElementById('apply-iframe');
    const loader = document.getElementById('modal-loader');

    const openModal = () => {
        if (!modalOverlay) return;
        modalOverlay.classList.add('active');
        document.body.classList.add('modal-open');
        
        if (iframe) {
            // Lazy-load the Google Form on first open to keep initial page load fast
            if (iframe.dataset.src && !iframe.src) {
                iframe.src = iframe.dataset.src;
            }
            if (iframe.dataset.loaded === 'true') {
                if (loader) loader.classList.add('hidden');
                iframe.classList.add('loaded');
            } else {
                if (loader) loader.classList.remove('hidden');
                iframe.classList.remove('loaded');
            }
        }
    };

    const closeModal = () => {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    };

    if (applyTriggers.length > 0 && modalOverlay) {
        applyTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    if (iframe) {
        iframe.addEventListener('load', () => {
            if (loader) {
                loader.classList.add('hidden');
            }
            iframe.classList.add('loaded');
            iframe.dataset.loaded = 'true';
        });
    }

    // ==========================================================================
    // Explore Work & Instagram Integration Scripts
    // ==========================================================================
    const postsData = {
        1: {
            title: "Case-Comp: Case Study Challenge Event Summary",
            badge: "COMPETITION",
            date: "March 2026",
            likes: "48 Likes",
            caption: "🏆 A successful execution of the flagship Case-Comp Case Study Challenge!\n\nThis event brought together NITA's sharpest analytical minds to tackle complex business cases. Over 2 days, teams presented their strategic recommendations to our panel of judges.\n\nKey Highlights:\n- 250+ teams registered across branches.\n- Top solutions focused on unit economic improvements and pricing optimization.\n- Live Q&A rounds simulated real management consulting presentations.\n\nThank you to our participants, core organizers, and judges for making it a massive success. Stay tuned for details on the next cohort's recruitment!",
            slides: [
                {
                    tag: "EVENT RECAP",
                    title: "Case-Comp 2026: Closing the Flagship Competition",
                    content: `
                        <div class="slide-stats-banner">
                            <div class="slide-stat-box">
                                <h4>250+</h4>
                                <p>TEAMS REGISTERED</p>
                            </div>
                            <div class="slide-stat-box">
                                <h4>₹15K</h4>
                                <p>PRIZE POOL DISBURSED</p>
                            </div>
                            <div class="slide-stat-box">
                                <h4>2 Days</h4>
                                <p>EXECUTIVE RESOLUTION</p>
                            </div>
                        </div>
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>High Engagement:</strong> 700+ students participated, creating case solutions across mechanical, computer science, and core engineering tracks.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Executive Panel:</strong> Final decks evaluated by McKinsey alumni and senior industry consultants.</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "PARTICIPATION METRICS",
                    title: "Diverse Participation Across Regions and Disciplines",
                    content: `
                        <div class="slide-diagram-grid">
                            <div class="slide-diagram-box">
                                <h5>ENGINEERING MAJORS</h5>
                                <p>CSE/ECE: 45% of registrants<br>ME/EE/CE: 38% of registrants<br>Others: 17% of registrants<br><br>Strong cross-departmental collaboration observed in winning teams.</p>
                            </div>
                            <div class="slide-diagram-box">
                                <h5>GEOGRAPHIC REACH</h5>
                                <p>Participants registered from 12+ states, bringing diverse structural perspectives to the regional logistics problem statement.</p>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "STRATEGIC SOLUTIONS",
                    title: "Winning Decks Isolated Real Margin Sourcing Spikes",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Battery Sourcing:</strong> Winner team identified 3 alternative local cell manufacturers, reducing variable cost by 8.5%.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>B2B Logistics:</strong> Recommended dynamic leasing for regional warehouse networks, lowering fixed cost projections by 12%.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Pricing Strategy:</strong> Proposed tiered subscription plans for fleet customers, maximizing customer lifetime value (LTV).</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "JUDGES FEEDBACK",
                    title: "Executive Jury Observations and Recommendations",
                    content: `
                        <div class="slide-diagram-grid">
                            <div class="slide-diagram-box">
                                <h5>WHAT WENT WELL</h5>
                                <p>✔ Rigorous MECE structure in profit breakdown.<br>✔ Realistic cost implementation timelines.<br>✔ Exceptional presentation delivery.</p>
                            </div>
                            <div class="slide-diagram-box">
                                <h5>AREAS TO IMPROVE</h5>
                                <p>⚠ Sensitivity analyses on raw material risks were omitted.<br>⚠ Competitor response strategies need deeper detailing.</p>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "THE NEXT STEPS",
                    title: "NITA Consulting Club: Calendar of Upcoming Events",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Apr 2026:</strong> Alumni Case Prep Webinars (focused on McKinsey Case Structuring).</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>May 2026:</strong> Core Member Recruitment drive.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Jul 2026:</strong> Launch of the Summer Mentorship Cohort.</span>
                            </div>
                        </div>
                        <div class="slide-footer-footnote">NIT Agartala Consulting Club • Strategic Growth Plan</div>
                    `
                }
            ]
        },
        2: {
            title: "Case-Comp: Case Study Challenge Launch",
            badge: "EVENT ANNOUNCEMENT",
            date: "February 2026",
            likes: "55 Likes",
            caption: "📢 Calling all strategists and problem solvers!\n\nNIT Agartala Consulting Club presents Case-Comp, the ultimate case study challenge designed to test your business acumen, analytical capability, and slide deck structuring skills.\n\nKey Rules:\n- Teams of 1-3 members.\n- Open to all branches and years.\n- Cash Prize Pool of ₹15,000 + certificates of merit.\n\nRegister via the link in our bio. Registration deadline: 4th March. Let's solve some real-world business challenges!",
            slides: [
                {
                    tag: "COMPETITION PREVIEW",
                    title: "Are You Ready to Act as a Management Consultant?",
                    content: `
                        <div class="slide-stats-banner">
                            <div class="slide-stat-box">
                                <h4>₹15,000</h4>
                                <p>CASH PRIZE POOL</p>
                            </div>
                            <div class="slide-stat-box">
                                <h4>1 to 3</h4>
                                <p>TEAM SIZE</p>
                            </div>
                            <div class="slide-stat-box">
                                <h4>Open</h4>
                                <p>TO ALL BATCHES</p>
                            </div>
                        </div>
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Objective:</strong> Deconstruct a real-world enterprise problem, outline strategy, and build a management-ready slide deck.</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "THE CASE STATEMENT",
                    title: "EV Mobility Startup Margin Erosion Challenge",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>The Client:</strong> An early-stage EV two-wheeler mobility startup in India.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>The Problem:</strong> Operating profit margins have declined by 15% over the past three quarters despite a 30% rise in top-line units sold.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Deliverables:</strong> 7-Slide presentation dissecting the cost drivers, proposing pricing remedies, and forecasting dynamic unit margins.</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "TIMELINE",
                    title: "Key Dates and Case Submission Gates",
                    content: `
                        <div class="slide-diagram-grid">
                            <div class="slide-diagram-box">
                                <h5>PHASE 1</h5>
                                <p><strong>Feb 15 - Mar 4:</strong> Team registration open.<br><strong>Mar 5:</strong> Case prompt release.</p>
                            </div>
                            <div class="slide-diagram-box">
                                <h5>PHASE 2</h5>
                                <p><strong>Mar 7:</strong> Submission of case decks.<br><strong>Mar 8:</strong> Executive presentation board.</p>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "REWARDS",
                    title: "Compensation, Incentives and Mentoring Gates",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Winner:</strong> Cash award of ₹8,000 + 1-on-1 resume feedback from MBB advisors.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Runner Up:</strong> Cash award of ₹5,000 + access to Case Interview Masterclass.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Second Runner Up:</strong> Cash award of ₹2,000.</span>
                            </div>
                        </div>
                    `
                }
            ]
        },
        3: {
            title: "Speaker Session: Suryajeet Jha (Senior Consultant, McKinsey & Company)",
            badge: "ALUMNI SPEAKER",
            date: "April 2025",
            likes: "62 Likes",
            caption: "🎓 SARC NIT Agartala, in collaboration with NITA Consulting Club, presents an exclusive Speaker Session with Suryajeet Jha, Senior Consultant at McKinsey & Company!\n\nSuryajeet, a proud NITA Mechanical Engineering Alumnus (Batch of 2018), will share his journey, consulting experiences, and prep advice for top-tier consulting firms.\n\nTopics Covered:\n- Preparing for case interviews & guesstimates.\n- Life as a Senior Consultant at McKinsey.\n- Skillsets required for MBB recruitment.\n\nDate: Saturday, 5th April, 9:00 PM on Google Meet. Register now!",
            slides: [
                {
                    tag: "ALUMNI PROFILE",
                    title: "Meet Suryajeet Jha: Mechanical Engineer to McKinsey",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>NITA Background:</strong> B.Tech in Mechanical Engineering (Class of 2018).</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Current Role:</strong> Senior Consultant at McKinsey & Company, leading digital strategy and operations cases.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Track Record:</strong> Advised top logistics, energy, and retail firms on margin expansion.</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "CASE PREPARATION",
                    title: "Decoding the McKinsey Case Interview",
                    content: `
                        <div class="slide-stats-banner">
                            <div class="slide-stat-box">
                                <h4>MECE</h4>
                                <p>PROBLEM STRUCTURING</p>
                            </div>
                            <div class="slide-stat-box">
                                <h4>80/20</h4>
                                <p>PARETO FOCUS</p>
                            </div>
                            <div class="slide-stat-box">
                                <h4>Fit</h4>
                                <p>BEHAVIORAL RIGOR</p>
                            </div>
                        </div>
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>The Core Framework:</strong> Focus on structuring, mental arithmetic correctness, business judgment, and logical storytelling.</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "MCKINSEY CULTURE",
                    title: "Life Inside McKinsey & Company",
                    content: `
                        <div class="slide-diagram-grid">
                            <div class="slide-diagram-box">
                                <h5>TYPICAL WEEK</h5>
                                <p>Client site alignment, internal brainstorming with partners, structured analysis, and drafting presentation decks.</p>
                            </div>
                            <div class="slide-diagram-box">
                                <h5>KEY ADVANTAGE</h5>
                                <p>Exposure to strategic decisions of Fortune 100 CEOs within weeks of joining.</p>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "CAREER ACTION PATH",
                    title: "Roadmap for NIT Agartala Undergraduates",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>1. Quantitative Projects:</strong> Take data-heavy internships or operations research.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>2. Core Case Prep:</strong> Complete 40+ mock case interviews with a dedicated partner.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>3. Narrative Control:</strong> Learn to pitch ideas using structure (e.g., Pyramid Principle).</span>
                            </div>
                        </div>
                    `
                }
            ]
        },
        4: {
            title: "Management & Consulting Camp (MC Camp)",
            badge: "TRAINING CAMP",
            date: "October 2025",
            likes: "40 Likes",
            caption: "🚀 Introducing MC Camp - an intensive training series for members of the Consulting Club!\n\nThis camp aims to build core skills in business analysis, problem decomposition, and structured communication.\n\nWhat we will cover:\n- Structuring frameworks (MECE, Profitability, Market Entry).\n- Cracking guesstimates (Top-down and bottom-up approaches).\n- Structuring high-impact business presentations.\n\nEquipping our members with McKinsey-level analytical standards!",
            slides: [
                {
                    tag: "CAMP SYLLABUS",
                    title: "MC Camp: Transforming Engineers into Analysts",
                    content: `
                        <div class="slide-stats-banner">
                            <div class="slide-stat-box">
                                <h4>4 Weeks</h4>
                                <p>DURATION</p>
                            </div>
                            <div class="slide-stat-box">
                                <h4>6 Cases</h4>
                                <p>DISSECTED LIVE</p>
                            </div>
                            <div class="slide-stat-box">
                                <h4>100%</h4>
                                <p>MEMBERS ALIGNED</p>
                            </div>
                        </div>
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Goal:</strong> Establishing solid problem-solving foundations through rigorous case solving.</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "CASE DECONSTRUCTION",
                    title: "Dissecting the Core Consulting Frameworks",
                    content: `
                        <div class="slide-diagram-grid">
                            <div class="slide-diagram-box">
                                <h5>PROFITABILITY</h5>
                                <p>Profits = Revenue - Cost. Deconstructing revenues into volume/mix/price, and costs into fixed/variable elements.</p>
                            </div>
                            <div class="slide-diagram-box">
                                <h5>MARKET ENTRY</h5>
                                <p>Analyzing market size, market growth, competition, entry mode, financial feasibility, and exit strategy.</p>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "GUESSTIMATE SYSTEMS",
                    title: "Mastering the Art of Estimation",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Top-Down Approach:</strong> Start with general population (e.g., 1.4B in India), segment by filters (age, income, urban) to reach target size.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Bottom-Up Approach:</strong> Start with unit constraints (e.g., number of seats in a cafe, average time spent, capacity utilization) to calculate total market revenue.</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "COMMUNICATION",
                    title: "Structured Slide Writing & Storyboarding",
                    content: `
                        <div class="slide-diagram-grid">
                            <div class="slide-diagram-box">
                                <h5>PYRAMID PRINCIPLE</h5>
                                <p>Start with the recommendation first, followed by supporting arguments, and back them up with raw data.</p>
                            </div>
                            <div class="slide-diagram-box">
                                <h5>ACTION TITLES</h5>
                                <p>Every slide title must express a key takeaway, not just a description (e.g., 'Margins fell 15%' vs 'Cost Report').</p>
                            </div>
                        </div>
                    `
                }
            ]
        },
        5: {
            title: "Discover Consulting: Open Webinar & Q&A Session",
            badge: "OPEN WEBINAR",
            date: "September 2025",
            likes: "45 Likes",
            caption: "💻 Wondering what consulting is and if it's the right career for you?\n\nJoin our 'Discover Consulting' webinar designed to simplify the landscape of strategy consulting for engineering undergraduates.\n\nWe cover:\n- What consultants actually do.\n- Management vs Technology vs Operations consulting.\n- Key skills (Excel modeling, case analysis, PowerPoint storytelling).\n- Recruiting schedules, salaries, and exit options.\n\nOpen to all students. Save your spot now!",
            slides: [
                {
                    tag: "WEBINAR SUMMARY",
                    title: "Demystifying the Consulting Landscape",
                    content: `
                        <div class="slide-stats-banner">
                            <div class="slide-stat-box">
                                <h4>MBB</h4>
                                <p>STRATEGY FOCUS</p>
                            </div>
                            <div class="slide-stats-card" style="display:none;"></div>
                            <div class="slide-stat-box">
                                <h4>Big 4</h4>
                                <p>ADVISORY / IMPLEMENTATION</p>
                            </div>
                            <div class="slide-stat-box">
                                <h4>Boutique</h4>
                                <p>SPECIALIZED INDUSTRIES</p>
                            </div>
                        </div>
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Objective:</strong> Help undergraduates identify which vertical aligns best with their technical backgrounds and career goals.</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "KEY SKILLSETS",
                    title: "Primary Tools and Skill Verticals for Recruitment",
                    content: `
                        <div class="slide-diagram-grid">
                            <div class="slide-diagram-box">
                                <h5>ANALYTICAL RIGOR</h5>
                                <p>- Financial modeling in Excel.<br>- Data visualization.<br>- Structured mental math.</p>
                            </div>
                            <div class="slide-diagram-box">
                                <h5>SOFT SKILLS</h5>
                                <p>- Stakeholder communication.<br>- Hypothesis formulation.<br>- Client management.</p>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "CAREER OUTCOMES",
                    title: "Comp, Progression and Strategic Exit Options",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Promotion Ladder:</strong> Business Analyst ➔ Associate ➔ Engagement Manager ➔ Partner.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Exit Opportunities:</strong> Venture Capital, Corporate Strategy, Founder's Office, Tech Product Management.</span>
                            </div>
                        </div>
                    `
                }
            ]
        },
        6: {
            title: "Tribute to Ratan Tata: Legacy of Leadership",
            badge: "LEADERSHIP TRIBUTE",
            date: "October 2024",
            likes: "67 Likes",
            caption: "🤍 Honoring the life and legacy of a legendary industrialist, visionary leader, and philanthropist, Shri Ratan Tata.\n\nHis strategic leadership transformed the Tata Group into a global powerhouse while maintaining an unwavering commitment to ethics, society, and nation-building.\n\nLessons in Strategy & Leadership:\n- Courage to take bold global acquisitions (Corus, Jaguar Land Rover).\n- Innovation for masses (Tata Nano, Tata Swach).\n- Prioritizing value over margins.\n\nHis legacy will continue to guide generations of future leaders.",
            slides: [
                {
                    tag: "THE VISIONARY",
                    title: "Ratan Tata: A Life of Scale and Ethics",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>The Mandate:</strong> Appointed Chairman of Tata Sons in 1991, during India's economic liberalization.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Scale Growth:</strong> Group revenues multiplied 40x, and profits multiplied 50x during his 21-year tenure.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Ethical Focus:</strong> Over 65% of Tata Sons' equity remains held by philanthropic trusts, prioritizing societal development.</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "GLOBAL ACQUISITIONS",
                    title: "Courage in Strategic Global M&A",
                    content: `
                        <div class="slide-diagram-grid">
                            <div class="slide-diagram-box">
                                <h5>TETLEY TEA (2000)</h5>
                                <p>Tata Tea acquired Tetley (UK) for $450M, establishing a global beverage distribution network.</p>
                            </div>
                            <div class="slide-diagram-box">
                                <h5>JAGUAR LAND ROVER (2008)</h5>
                                <p>Acquired JLR from Ford for $2.3B during the financial crisis. Tata turned it profitable within 3 years via operational synergies.</p>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "LEADERSHIP LESSONS",
                    title: "Strategic Principles for Future Corporate Leaders",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>1. Bold Long-Term Bets:</strong> Focus on strategic positioning rather than short-term quarterly gains.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>2. Crisis Management:</strong> Leading from the front during critical organizational challenges.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>3. Value-First Branding:</strong> Trust and social license are an enterprise's most valuable assets.</span>
                            </div>
                        </div>
                        <div class="slide-footer-footnote">NIT Agartala Consulting Club • Leadership Tribute Series</div>
                    `
                }
            ]
        },
        7: {
            title: "What is Consulting? Decoding Strategy",
            badge: "CONSULTING 101",
            date: "August 2024",
            likes: "49 Likes",
            caption: "📚 Demystifying the core question: What is Management Consulting?\n\nAt its heart, consulting is structured problem-solving. Companies face complex business dilemmas and bring in consultants to obtain objective analysis, industry best practices, and implementation roadmaps.\n\nKey Areas:\n- Growth & Entry (How to expand sales, launch products).\n- Cost & Efficiency (How to optimize supply chains, streamline overheads).\n- M&A (Valuations, synergy assessments, post-merger integration).\n\nFollow us to learn how MBB consultants deconstruct these problems!",
            slides: [
                {
                    tag: "THE MANDATE",
                    title: "The Definition: What is Management Consulting?",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Core Definition:</strong> Advising top executives on complex, high-stakes business choices.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Key Output:</strong> Analytical models, strategic recommendations, and change management strategies.</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "WHY CLIENTS HIRE MBB",
                    title: "Three Drivers of External Strategic Advice",
                    content: `
                        <div class="slide-diagram-grid">
                            <div class="slide-diagram-box">
                                <h5>OBJECTIVITY</h5>
                                <p>Providing an unbiased, outside-in perspective free of internal corporate politics.</p>
                            </div>
                            <div class="slide-diagram-box">
                                <h5>EXPERTISE</h5>
                                <p>Accessing global industry specialists and proprietary methodologies immediately.</p>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "PROBLEM TYPES",
                    title: "Three Main Pillars of Strategic Case Engagements",
                    content: `
                        <div class="slide-stats-banner">
                            <div class="slide-stat-box">
                                <h4>Growth</h4>
                                <p>MARKET SHARE EXPANSION</p>
                            </div>
                            <div class="slide-stat-box">
                                <h4>Efficiency</h4>
                                <p>COST & BASELINE REDUCTION</p>
                            </div>
                            <div class="slide-stat-box">
                                <h4>Turnaround</h4>
                                <p>POST-MERGER INTEGRATION</p>
                            </div>
                        </div>
                    `
                }
            ]
        },
        8: {
            title: "Case Interview Frameworks: Core Methodologies",
            badge: "FRAMEWORKS",
            date: "July 2024",
            likes: "52 Likes",
            caption: "🛠️ Want to crack a consulting case? You need structured frameworks.\n\nFrameworks help you break down complex, open-ended business problems into manageable, mutually exclusive parts.\n\nOur post covers the three vital pillars:\n1. Profitability (Dissecting revenues and costs).\n2. Market Entry (Sizing, competition, financials, operations).\n3. Pricing (Cost-plus, competitor match, value-based).\n\nSwipe to see how to structure your next case analysis!",
            slides: [
                {
                    tag: "PROFITABILITY",
                    title: "Dissecting Profit Decline in Case Interviews",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>First Split:</strong> Profits = Revenue - Cost.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Revenue Split:</strong> Units Sold (Volume) × Average Price. Check product mix.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Cost Split:</strong> Fixed Costs (overhead, rent) + Variable Costs (COGS, distribution).</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "MARKET ENTRY",
                    title: "Four Pillars of Market Entry Decision Gateways",
                    content: `
                        <div class="slide-diagram-grid">
                            <div class="slide-diagram-box">
                                <h5>1. THE MARKET</h5>
                                <p>Market size, growth rate, margins, barrier trends.</p>
                            </div>
                            <div class="slide-diagram-box">
                                <h5>2. THE ECONOMICS</h5>
                                <p>Capex required, break-even timeline, expected ROI.</p>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "PRICING CASE",
                    title: "Three Methodologies for Unit Pricing Models",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>1. Cost-Plus Pricing:</strong> Sum total manufacturing cost + add desired markup percentage. (Floor Price)</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>2. Competitor Pricing:</strong> Benchmark against existing industry substitutes.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>3. Value-Based Pricing:</strong> Assess customer willingness to pay based on economic utility. (Ceiling Price)</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "SUMMARY",
                    title: "Which Framework to Select?",
                    content: `
                        <div class="slide-diagram-grid">
                            <div class="slide-diagram-box">
                                <h5>DO NOT FORCELIT</h5>
                                <p>Custom frameworks that combine profitability splits and market dynamics always outperform rigid structures.</p>
                            </div>
                            <div class="slide-diagram-box">
                                <h5>MECE CRITICALITY</h5>
                                <p>Ensure branches do not overlap, but cover the entire solution space.</p>
                            </div>
                        </div>
                    `
                }
            ]
        },
        9: {
            title: "The Genesis: Founding of NITA Consulting Club",
            badge: "CLUB FOUNDING",
            date: "June 2024",
            likes: "58 Likes",
            caption: "✨ Welcome to the official page of the Consulting Club of NIT Agartala!\n\nOur mission is to establish an intellectual hub at NITA that bridges technical academic rigor with strategic business foresight. We prepare students for careers in strategy, analytics, management consulting, and business development.\n\nWhat to expect:\n- Weekly case prep cohorts.\n- Guesstimate challenges.\n- Alumni speaker webinars.\n- Real corporate consulting support projects.\n\nLet's embark on this journey where strategy meets impact!",
            slides: [
                {
                    tag: "OUR VISION",
                    title: "NIT Agartala Consulting Club: The Mission",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>The Gap:</strong> NIT Agartala has exceptional technical minds, but limited paths into strategic business advisory careers.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>The Solution:</strong> A focused strategy cell teaching case interviews, business writing, and client advisory.</span>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "LEARNING ROADMAP",
                    title: "Core Cohort Curriculum: Weekly Modules",
                    content: `
                        <div class="slide-diagram-grid">
                            <div class="slide-diagram-box">
                                <h5>WEEKLY MEETUPS</h5>
                                <p>Live deconstruction of McKinsey, BCG, and Bain case interviews.</p>
                            </div>
                            <div class="slide-diagram-box">
                                <h5>GUESSTIMATE SESSIONS</h5>
                                <p>Sizing consumer and industrial markets in India using structured estimation.</p>
                            </div>
                        </div>
                    `
                },
                {
                    tag: "CLUB VALUES",
                    title: "Establishing Professional Standards",
                    content: `
                        <div class="slide-bullet-list">
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Rigorous Pedagogy:</strong> Standard MBB case methodologies.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Intellectual Integrity:</strong> Open debate, structure-first approaches, and logic.</span>
                            </div>
                            <div class="slide-bullet-item">
                                <div class="slide-bullet-dot"></div>
                                <span><strong>Impact Orientation:</strong> Helping students land top-tier consulting and strategy placements.</span>
                            </div>
                        </div>
                    `
                }
            ]
        }
    };

    // Filter Logic
    const filterTabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.explore-card-item');

    if (filterTabs.length > 0 && cards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Toggle active state
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filterVal = tab.getAttribute('data-filter');

                cards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterVal === 'all' || cardCategory === filterVal) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // Modal Presentation Slider Logic
    const slideModal = document.getElementById('slide-modal');
    const modalCloseBtn = document.getElementById('explore-modal-close');
    const cardsToTrigger = document.querySelectorAll('.explore-card-item');
    const slidesWrapper = document.getElementById('slides-wrapper');
    
    const modalBadge = document.getElementById('modal-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalLikes = document.getElementById('modal-likes');
    const modalCaption = document.getElementById('modal-caption');

    const prevBtn = document.getElementById('slide-prev');
    const nextBtn = document.getElementById('slide-next');
    const slideIndicator = document.getElementById('slide-indicator');

    let currentSlideIndex = 0;
    let currentSlides = [];

    const updateSlideView = () => {
        if (!slidesWrapper) return;
        const slideElements = slidesWrapper.querySelectorAll('.slide-card-instance');
        
        slideElements.forEach((slide, idx) => {
            slide.classList.remove('active', 'prev-slide');
            if (idx === currentSlideIndex) {
                slide.classList.add('active');
            } else if (idx < currentSlideIndex) {
                slide.classList.add('prev-slide');
            }
        });

        // Update indicator
        if (slideIndicator) {
            slideIndicator.innerText = `Slide ${currentSlideIndex + 1} of ${currentSlides.length}`;
        }
    };

    const modalEmbedHolder = document.getElementById('modal-embed-holder');

    const renderInstaEmbed = (shortcode, postId) => {
        const post = postsData[postId];
        if (!modalEmbedHolder) return;

        // Set metadata
        if (modalBadge) modalBadge.innerText = post ? post.badge : "INSTAGRAM POST";
        if (modalTitle) modalTitle.innerText = post ? post.title : "Official Instagram Post";
        if (modalDate) modalDate.innerText = post ? post.date : "NITA Consulting Club";
        if (modalCaption) modalCaption.innerText = post ? post.caption : "Check out this post on our official Instagram page!";
        
        const instaLinkBtn = document.getElementById('modal-insta-link');
        if (instaLinkBtn && shortcode) {
            instaLinkBtn.href = `https://www.instagram.com/p/${shortcode}/`;
        }

        // Render live Instagram embed iframe
        if (shortcode) {
            modalEmbedHolder.innerHTML = `
                <iframe src="https://www.instagram.com/p/${shortcode}/embed" width="100%" height="560" frameborder="0" scrolling="no" allowtransparency="true" class="modal-insta-iframe" loading="eager"></iframe>
            `;
        }
    };

    if (cardsToTrigger.length > 0 && slideModal) {
        cardsToTrigger.forEach(card => {
            card.addEventListener('click', (e) => {
                // If user didn't click inside an active iframe link directly
                const shortcode = card.getAttribute('data-shortcode');
                const postId = card.getAttribute('data-post-id');
                
                renderInstaEmbed(shortcode, postId);
                slideModal.classList.add('active');
                document.body.classList.add('modal-open');
            });
        });
    }

    const closeExploreModal = () => {
        if (!slideModal) return;
        slideModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        if (modalEmbedHolder) {
            modalEmbedHolder.innerHTML = '';
        }
    };

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeExploreModal);
    }

    if (slideModal) {
        slideModal.addEventListener('click', (e) => {
            if (e.target === slideModal) {
                closeExploreModal();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (slideModal && slideModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeExploreModal();
            }
        }
    });
});


