document.addEventListener('DOMContentLoaded', function() {
    console.log('🍔 Campus Bite Professional - Loaded Successfully!');

    // Initialize all functionality
    initializeNavbar();
    initializeMenuCards();
    initializeCollegeSelector();
    initializeModals();
    initializeScrollEffects();
    initializeAnimations();
    initializeFloatingElements();
    addScrollToTop();
    
    // Navbar functionality
    function initializeNavbar() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scrolling for anchor links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // Update active nav link
                        navLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');

                        // Close mobile menu if open
                        const navbarCollapse = document.querySelector('.navbar-collapse');
                        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                                toggle: true
                            });
                        }
                    }
                }
            });
        });

        // Update active nav on scroll
        window.addEventListener('scroll', updateActiveNav);
    }

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // Menu cards functionality
    function initializeMenuCards() {
        const menuCards = document.querySelectorAll('.menu-card');
        
        menuCards.forEach(card => {
            // Add hover sound effect (optional)
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                
                // Add ripple effect
                const ripple = document.createElement('div');
                ripple.classList.add('ripple');
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });

            // Click functionality
            card.addEventListener('click', function() {
                const category = this.dataset.category;
                showNotification(`Loading ${category} menu...`, 'info');
                
                // Add loading animation
                this.classList.add('loading');
                
                setTimeout(() => {
                    this.classList.remove('loading');
                    // Here you would normally navigate to category page
                    console.log(`Navigate to ${category} category`);
                }, 1500);
            });
        });
    }

    // College selector functionality
    function initializeCollegeSelector() {
        const collegeDropdowns = document.querySelectorAll('#collegeDropdown, #college');
        
        collegeDropdowns.forEach(dropdown => {
            dropdown.addEventListener('change', function() {
                const selectedCollege = this.value;
                const selectedText = this.options[this.selectedIndex].text;
                
                if (selectedCollege) {
                    showNotification(`Selected: ${selectedText}`, 'success');
                    
                    // Update other dropdowns
                    collegeDropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== this) {
                            otherDropdown.value = selectedCollege;
                        }
                    });
                    
                    // Store selection in localStorage
                    localStorage.setItem('selectedCollege', selectedCollege);
                }
            });
        });

        // Load saved college selection
        const savedCollege = localStorage.getItem('selectedCollege');
        if (savedCollege) {
            collegeDropdowns.forEach(dropdown => {
                dropdown.value = savedCollege;
            });
        }
    }

    // Modal functionality
    function initializeModals() {
        const loginForm = document.querySelector('#loginModal form');
        const signupForm = document.querySelector('#signupModal form');

        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                if (email && password) {
                    showNotification('Logging you in...', 'info');
                    
                    // Simulate login process
                    setTimeout(() => {
                        showNotification('Welcome back! 🎉', 'success');
                        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                        this.reset();
                    }, 2000);
                }
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const fullName = document.getElementById('fullName').value;
                const email = document.getElementById('emailSignup').value;
                const college = document.getElementById('college').value;
                const password = document.getElementById('passwordSignup').value;

                if (fullName && email && college && password) {
                    showNotification('Creating your account...', 'info');
                    
                    // Simulate signup process
                    setTimeout(() => {
                        showNotification(`Welcome to Campus Bite, ${fullName}! 🎉`, 'success');
                        bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
                        this.reset();
                    }, 2000);
                }
            });
        }
    }

    // Scroll effects
    function initializeScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Staggered animation for menu cards
                    if (entry.target.classList.contains('menu-card')) {
                        const cards = Array.from(document.querySelectorAll('.menu-card'));
                        const index = cards.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const animatedElements = document.querySelectorAll('.menu-card, .feature-card, .section-header');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Initialize animations
    function initializeAnimations() {
        // Add CSS for scroll animations
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: slideInUp 0.8s ease-out forwards;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .ripple {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: translate(-50%, -50%);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
            
            .pulse {
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Floating elements interaction
    function initializeFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-food');
        
        floatingElements.forEach((element, index) => {
            element.addEventListener('click', function() {
                this.style.animation = 'none';
                this.style.transform = 'scale(1.5) rotate(360deg)';
                
                // Create food particles
                createFoodParticles(this);
                
                setTimeout(() => {
                    this.style.animation = `float 6s ease-in-out infinite`;
                    this.style.animationDelay = `${index * 1.5}s`;
                    this.style.transform = '';
                }, 1000);
                
                showNotification('Yummy! 😋', 'success');
            });
        });
    }

    function createFoodParticles(element) {
        const rect = element.getBoundingClientRect();
        const particles = ['✨', '🎉', '💫', '⭐'];
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 9999;
                animation: particle-explosion 1s ease-out forwards;
            `;
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 100;
            const endX = rect.left + rect.width / 2 + Math.cos(angle) * distance;
            const endY = rect.top + rect.height / 2 + Math.sin(angle) * distance;
            
            particle.style.setProperty('--end-x', endX + 'px');
            particle.style.setProperty('--end-y', endY + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
        
        // Add particle animation CSS
        if (!document.querySelector('#particle-style')) {
            const particleStyle = document.createElement('style');
            particleStyle.id = 'particle-style';
            particleStyle.textContent = `
                @keyframes particle-explosion {
                    0% {
                        opacity: 1;
                        transform: scale(1) translate(0, 0);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.5) translate(
                            calc(var(--end-x) - 50vw),
                            calc(var(--end-y) - 50vh)
                        );
                    }
                }
            `;
            document.head.appendChild(particleStyle);
        }
    }

    // Add scroll to top button
    function addScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollBtn);

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'info', duration = 3000) {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification');
        existing.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type]}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            transform: translateX(400px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 350px;
            font-weight: 500;
        `;

        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: auto;
            opacity: 0.8;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        const autoRemove = setTimeout(() => {
            removeNotification(notification);
        }, duration);

        // Manual close
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeNotification(notification);
        });

        function removeNotification(notif) {
            notif.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notif.parentNode) {
                    notif.remove();
                }
            }, 300);
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key to close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                bootstrap.Modal.getInstance(modal)?.hide();
            });
        }
        
        // Ctrl/Cmd + K for search (future feature)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showNotification('Search feature coming soon! 🔍', 'info');
        }
    });

    // Performance optimization
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate animations on resize
            initializeAnimations();
        }, 250);
    });

    // Welcome message
    setTimeout(() => {
        showNotification('Welcome to Campus Bite! 🍔', 'success', 4000);
    }, 1000);

    console.log('🚀 All Campus Bite functionality loaded successfully!');
});