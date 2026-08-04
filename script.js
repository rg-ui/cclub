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
    // 5. Interactive Case Teaser
    const revealBtn = document.getElementById('reveal-btn');
    const teaserSolution = document.getElementById('teaser-solution');
    
    if (revealBtn && teaserSolution) {
        revealBtn.addEventListener('click', () => {
            if (teaserSolution.style.display === 'none' || teaserSolution.style.display === '') {
                teaserSolution.style.display = 'block';
                revealBtn.innerText = 'Hide The Framework';
                
                // Simple fade-in effect
                teaserSolution.style.opacity = 0;
                setTimeout(() => {
                    teaserSolution.style.transition = 'opacity 0.4s ease';
                    teaserSolution.style.opacity = 1;
                }, 10);
            } else {
                teaserSolution.style.opacity = 0;
                setTimeout(() => {
                    teaserSolution.style.display = 'none';
                    revealBtn.innerText = 'Reveal The Framework';
                }, 400);
            }
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
});
