// ===== SCRIPT.JS - PERADI KHARISMA =====
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ===== NAVBAR MOBILE =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navBackdrop = document.getElementById('navBackdrop');
    const dropdownItems = document.querySelectorAll('.dropdown');
    const body = document.body;
    
    // Fungsi buka menu
    function openMenu() {
        navMenu.classList.add('active');
        navBackdrop.classList.add('active');
        body.classList.add('menu-open');
        body.style.overflow = 'hidden';
        menuToggle.classList.add('active');
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    }
    
    // Fungsi tutup menu
    function closeMenu() {
        navMenu.classList.remove('active');
        navBackdrop.classList.remove('active');
        body.classList.remove('menu-open');
        body.style.overflow = '';
        menuToggle.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Tutup semua dropdown
        dropdownItems.forEach(item => {
            item.classList.remove('active');
        });
    }
    
    // Toggle menu saat hamburger diklik
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }
    
    // Tutup menu saat backdrop diklik
    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMenu);
    }
    
    // Handle dropdown di mobile
    function handleDropdowns() {
        if (window.innerWidth <= 1023) {
            dropdownItems.forEach(item => {
                const link = item.querySelector('.dropdown-toggle');
                
                if (link) {
                    // Hapus event listener lama
                    link.removeEventListener('click', dropdownClickHandler);
                    // Tambah event listener baru
                    link.addEventListener('click', dropdownClickHandler);
                }
            });
        } else {
            // Hapus class active di desktop
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    }
    
    function dropdownClickHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const parent = this.closest('.dropdown');
        
        // Tutup dropdown lain
        dropdownItems.forEach(item => {
            if (item !== parent) {
                item.classList.remove('active');
            }
        });
        
        // Toggle dropdown ini
        parent.classList.toggle('active');
    }
    
    // Panggil fungsi dropdown
    handleDropdowns();
    
    // Handle resize window
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1023 && navMenu.classList.contains('active')) {
            closeMenu();
        }
        handleDropdowns();
    });
    
    // Tutup menu saat klik link (kecuali dropdown toggle)
    document.querySelectorAll('.nav-list a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 1023) {
                // Cek apakah ini link biasa
                if (!this.closest('.dropdown-menu')) {
                    setTimeout(closeMenu, 200);
                } else {
                    // Link di dalam dropdown, tetap tutup menu setelah klik
                    setTimeout(closeMenu, 200);
                }
            }
        });
    });
    
    // Tutup dengan tombol Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Prevent scroll saat menu terbuka di mobile
    document.addEventListener('touchmove', function(e) {
        if (navMenu.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // ===== MODAL BERITA =====
    const modal = document.getElementById('modalBerita');
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const modalImage = document.getElementById('modalImage');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    
    if (modal) {
        // Fungsi buka modal
        function openModal(card) {
            if (!card) return;
            
            const img = card.querySelector('.berita-poster img');
            const title = card.querySelector('.berita-content h3');
            const metaSpans = card.querySelectorAll('.berita-meta span');
            const desc = card.querySelector('.berita-content p');
            
            if (title) modalTitle.textContent = title.textContent;
            
            if (metaSpans.length) {
                const metaText = Array.from(metaSpans).map(s => s.textContent.trim()).join(' • ');
                modalMeta.textContent = metaText;
            } else {
                modalMeta.textContent = '';
            }
            
            if (desc) modalContent.textContent = desc.textContent;
            
            if (img && img.src) {
                modalImage.src = img.src;
                modalImage.alt = img.alt || title?.textContent || 'Gambar Berita';
                modalImage.style.display = 'block';
            } else {
                modalImage.style.display = 'none';
            }
            
            modal.classList.add('active');
            body.style.overflow = 'hidden';
        }
        
        // Fungsi tutup modal
        function closeModal() {
            modal.classList.remove('active');
            body.style.overflow = '';
        }
        
        // Event listener untuk tombol "Baca Selengkapnya"
        document.querySelectorAll('.btn-berita').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const card = this.closest('.berita-card');
                if (card) {
                    openModal(card);
                }
            });
        });
        
        // Tombol close
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        // Click di luar modal
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Tombol Escape untuk modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Mencegah scroll di dalam modal
        const modalCard = modal.querySelector('.modal-card');
        if (modalCard) {
            modalCard.addEventListener('wheel', function(e) {
                e.stopPropagation();
            });
        }
    }
    
    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href !== "#" && href !== "#!" && href !== "#" && href !== "javascript:void(0)") {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    // Offset untuk navbar sticky
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Tutup menu mobile jika terbuka
                    if (window.innerWidth <= 1023 && navMenu.classList.contains('active')) {
                        closeMenu();
                    }
                }
            }
        });
    });
    
    // ===== ACTIVE LINK SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY < sectionBottom) {
                document.querySelectorAll('.nav-link[href*=' + sectionId + ']').forEach(link => {
                    link.style.color = 'var(--secondary)';
                });
            } else {
                document.querySelectorAll('.nav-link[href*=' + sectionId + ']').forEach(link => {
                    link.style.color = '';
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // ===== FADE IN ANIMATION =====
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial styles
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
    });
    
    window.addEventListener('scroll', checkFade);
    window.addEventListener('load', checkFade);
    
    // ===== ORIENTATION CHANGE =====
    window.addEventListener('orientationchange', function() {
        // Jika menu terbuka saat orientasi berubah, tutup menu
        if (navMenu.classList.contains('active')) {
            setTimeout(() => {
                closeMenu();
            }, 200);
        }
    });
    
    console.log('PERADI Kharisma website loaded successfully!');
});