// App JS Logic - Inked by Tife

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    // --- 2. MOBILE MENU ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Update active class on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 120; // offset for navbar height

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop && scrollPosition < (section.offsetTop + section.offsetHeight)) {
                const currentId = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // --- 3. REVEAL ON SCROLL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. GALLERY FILTER LOGIC ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemStyle = item.getAttribute('data-style');
                if (filterValue === 'all' || itemStyle === filterValue) {
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                }
            });
        });
    });

    // --- 5. LIGHTBOX MODAL ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxCat = document.getElementById('lightbox-cat');
    const lightboxTitle = document.getElementById('lightbox-title');
    const galleryImgWrappers = document.querySelectorAll('.gallery-img-wrapper');

    galleryImgWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const img = wrapper.querySelector('img');
            const cat = wrapper.querySelector('.item-category').textContent;
            const title = wrapper.querySelector('.item-title').textContent;

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCat.textContent = cat;
            lightboxTitle.textContent = title;

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scroll
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // --- 6. MULTI-STEP BOOKING FORM ---
    const form = document.getElementById('tattoo-booking-form');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.progress-step-indicator');
    const progressBar = document.getElementById('progress-bar');
    const successView = document.getElementById('success-view');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const resetFormBtn = document.getElementById('reset-form-btn');

    let currentStepIndex = 0;

    // Set date input min value to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    // Step navigation
    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStepIndex)) {
                stepIndicators[currentStepIndex].classList.add('completed');
                currentStepIndex++;
                showStep(currentStepIndex);
            }
        });
    });

    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStepIndex--;
            showStep(currentStepIndex);
        });
    });

    function showStep(index) {
        steps.forEach((step, i) => {
            if (i === index) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update progress indicators classes
        stepIndicators.forEach((indicator, i) => {
            if (i <= index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
                indicator.classList.remove('completed');
            }
        });

        // Update progress line bar width
        const totalSteps = steps.length;
        const progressPercentage = (index / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    // Step validations
    function validateStep(stepIndex) {
        let isValid = true;

        if (stepIndex === 0) {
            // Validate step 1 fields
            const desc = document.getElementById('concept-description');
            const placement = document.getElementById('placement');
            const size = document.getElementById('size');

            if (!desc.value.trim() || desc.value.trim().length < 10) {
                markInvalid(desc);
                isValid = false;
            } else {
                markValid(desc);
            }

            if (!placement.value.trim()) {
                markInvalid(placement);
                isValid = false;
            } else {
                markValid(placement);
            }

            if (!size.value.trim()) {
                markInvalid(size);
                isValid = false;
            } else {
                markValid(size);
            }
        } 
        else if (stepIndex === 1) {
            // Validate step 2 fields
            const dateVal = dateInput.value;
            if (!dateVal) {
                markInvalid(dateInput);
                isValid = false;
            } else {
                const selectedDate = new Date(dateVal);
                const today = new Date();
                today.setHours(0,0,0,0);
                if (selectedDate < today) {
                    markInvalid(dateInput);
                    isValid = false;
                } else {
                    markValid(dateInput);
                }
            }
        }

        return isValid;
    }

    function markInvalid(element) {
        const group = element.closest('.form-group');
        if (group) {
            group.classList.add('invalid');
        }
    }

    function markValid(element) {
        const group = element.closest('.form-group');
        if (group) {
            group.classList.remove('invalid');
        }
    }

    // Clear validation error on user typing
    const inputsToWatch = [
        document.getElementById('concept-description'),
        document.getElementById('placement'),
        document.getElementById('size'),
        document.getElementById('preferred-date'),
        document.getElementById('full-name'),
        document.getElementById('email'),
        document.getElementById('phone')
    ];

    inputsToWatch.forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                markValid(input);
            });
            input.addEventListener('change', () => {
                markValid(input);
            });
        }
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate final step contact info
        let isFinalStepValid = true;
        const name = document.getElementById('full-name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');

        if (!name.value.trim()) {
            markInvalid(name);
            isFinalStepValid = false;
        } else {
            markValid(name);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            markInvalid(email);
            isFinalStepValid = false;
        } else {
            markValid(email);
        }

        if (!phone.value.trim() || phone.value.trim().length < 7) {
            markInvalid(phone);
            isFinalStepValid = false;
        } else {
            markValid(phone);
        }

        if (isFinalStepValid) {
            // Complete last progress indicator
            stepIndicators[currentStepIndex].classList.add('completed');
            
            // Hide form and indicators, show success view
            form.style.display = 'none';
            document.querySelector('.form-progress').style.display = 'none';
            successView.classList.add('active');
        }
    });

    // Reset Form
    resetFormBtn.addEventListener('click', () => {
        form.reset();
        
        // Remove error classes
        inputsToWatch.forEach(input => {
            if (input) markValid(input);
        });

        // Reset step state
        currentStepIndex = 0;
        form.style.display = 'flex';
        document.querySelector('.form-progress').style.display = 'flex';
        successView.classList.remove('active');
        showStep(currentStepIndex);
    });

});
