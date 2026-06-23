/**
 * Nia Syahfitri - Portfolio Website JavaScript
 * Universal Mobile Navbar, Certificate Lightbox, validated form feedback, and Interactive IT Ethics Quiz.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. NAV TOGGLE (MOBILE) & SCROLL NAVBAR EFFECT
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const navMenu = document.getElementById('navMenu');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navMenu) {
        // Toggle menu mobile
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Add scrolled class on scroll (mostly for transparent home navbar)
    const checkScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll();

    /* ==========================================================================
       2. INTERSECTION OBSERVER (SCROLL REVEALS)
       ========================================================================== */
    const revealSections = document.querySelectorAll('.reveal-section');

    if (revealSections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        revealSections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    /* ==========================================================================
       3. CERTIFICATE LIGHTBOX PREVIEW (Only on about.html)
       ========================================================================== */
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    const certCards = document.querySelectorAll('.cert-card');

    if (lightboxModal && certCards.length > 0) {
        // Open lightbox
        certCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('.cert-image');
                const title = card.querySelector('.cert-title').innerText;
                const issuer = card.querySelector('.cert-issuer').innerText;

                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxCaption.innerHTML = `${title} <br><span style="font-size: 0.8rem; font-weight: 400; opacity: 0.8;">${issuer}</span>`;

                lightboxModal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Stop page scrolling
            });
        });

        // Close lightbox
        const closeLightbox = () => {
            lightboxModal.classList.remove('show');
            document.body.style.overflow = 'auto'; // Resume page scrolling
        };

        if (lightboxCloseBtn) {
            lightboxCloseBtn.addEventListener('click', closeLightbox);
        }
        
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-content-wrapper')) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('show')) {
                closeLightbox();
            }
        });
    }

    /* ==========================================================================
       4. CONTACT FORM VALIDATION & SIMULATION (Only on contact.html)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const btnSubmit = contactForm ? contactForm.querySelector('.btn-submit') : null;
    const toast = document.getElementById('toastNotification');

    if (contactForm && btnSubmit) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formspreeID = 'xnjknpla'; 

            const nameVal = document.getElementById('formName').value;
            const emailVal = document.getElementById('formEmail').value;
            const messageVal = document.getElementById('formMessage').value;

            // Animate Button state to Loading
            const originalBtnContent = btnSubmit.innerHTML;
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `
                <span>Mengirim...</span>
                <i class="fa-solid fa-spinner fa-spin"></i>
            `;

            if (formspreeID === 'YOUR_FORMSPREE_ID' || !formspreeID) {
                alert("Formulir belum aktif. Silakan masukkan Formspree ID Anda di dalam berkas script.js terlebih dahulu.");
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalBtnContent;
                return;
            }

            // Submit form using Formspree AJAX endpoint
            fetch(`https://formspree.io/f/${formspreeID}`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: nameVal,
                    email: emailVal,
                    message: messageVal
                })
            })
            .then(response => response.json())
            .then(data => {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalBtnContent;

                if (data.ok) {
                    // Trigger success toast feedback
                    if (toast) {
                        toast.classList.add('show');
                        setTimeout(() => {
                            toast.classList.remove('show');
                        }, 4000);
                    } else {
                        alert("Pesan berhasil terkirim!");
                    }

                    // Clear input fields
                    contactForm.reset();
                } else {
                    alert("Gagal mengirim pesan: " + (data.error || "Silakan coba lagi."));
                }
            })
            .catch(error => {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalBtnContent;
                console.error('Error:', error);
                alert("Terjadi kesalahan jaringan. Pastikan Anda terhubung ke internet dan coba lagi.");
            });
        });
    }

    /* ==========================================================================
       5. Q&A ACCORDION MODULE (Only on ethics.html)
       ========================================================================== */
    const qnaItems = document.querySelectorAll('.qna-item');
    if (qnaItems.length > 0) {
        qnaItems.forEach(item => {
            const questionBtn = item.querySelector('.qna-question');
            if (questionBtn) {
                questionBtn.addEventListener('click', () => {
                    // Close other open items
                    qnaItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                    // Toggle current item
                    item.classList.toggle('active');
                });
            }
        });
    }

    /* ==========================================================================
       6. DYNAMIC LIGHT/DARK THEME SWITCHER
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (savedTheme === 'dark') {
            if (icon) icon.classList.replace('fa-moon', 'fa-sun');
        }

        themeToggleBtn.addEventListener('click', () => {
            let newTheme = 'light';
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                newTheme = 'dark';
                if (icon) icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                if (icon) icon.classList.replace('fa-sun', 'fa-moon');
            }
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // (Catatan: Hobi musik, film, dan bernyanyi saat ini menggunakan desain murni statis yang bersih)

    /* ==========================================================================
       7. SCROLL PROGRESS BAR & BACK TO TOP BUTTON
       ========================================================================== */
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        // Scroll Progress Bar calculation
        if (scrollProgress) {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll > 0) {
                const scrolled = (window.scrollY / totalScroll) * 100;
                scrollProgress.style.width = scrolled + '%';
            }
        }

        // Back to Top Button visibility
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
