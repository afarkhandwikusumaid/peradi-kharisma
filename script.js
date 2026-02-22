// ===== SCRIPT.JS - PERADI KHARISMA (TERINTEGRASI) =====
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
                    link.removeEventListener('click', dropdownClickHandler);
                    link.addEventListener('click', dropdownClickHandler);
                }
            });
        } else {
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    }
    
    function dropdownClickHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const parent = this.closest('.dropdown');
        
        dropdownItems.forEach(item => {
            if (item !== parent) {
                item.classList.remove('active');
            }
        });
        
        parent.classList.toggle('active');
    }
    
    handleDropdowns();
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1023 && navMenu.classList.contains('active')) {
            closeMenu();
        }
        handleDropdowns();
    });
    
    document.querySelectorAll('.nav-list a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1023) {
                closeMenu();
            }
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
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
        
        function closeModal() {
            modal.classList.remove('active');
            body.style.overflow = '';
        }
        
        document.querySelectorAll('.btn-berita').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const card = this.closest('.berita-card');
                if (card) {
                    openModal(card);
                }
            });
        });
        
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        const modalCard = modal.querySelector('.modal-card');
        if (modalCard) {
            modalCard.addEventListener('wheel', function(e) {
                e.stopPropagation();
            });
        }
    }
    
    // ===== MODAL LEGALITAS — PREMIUM =====
    const modalLegal = document.getElementById('modalLegal');
    const modalTitleLegal = document.getElementById('modalTitleLegal');
    const modalImageLegal = document.getElementById('modalImageLegal');
    const modalCloseLegal = document.getElementById('modalCloseLegal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const downloadFromModalBtn = document.getElementById('downloadFromModal');
    const shareFromModalBtn = document.getElementById('shareFromModal');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');
    const modalImgContainer = document.getElementById('modalImgContainer');
    const toastNotif = document.getElementById('toastNotif');
    const modalTabDokumen = document.getElementById('modalTabDokumen');
    
    let currentZoom = 1;
    let currentImageUrl = '';
    let currentFilename = '';
    
    function showToast(msg, icon = 'fas fa-check-circle') {
        if (!toastNotif) return;
        toastNotif.innerHTML = '<i class="' + icon + '"></i> ' + msg;
        toastNotif.classList.add('show');
        setTimeout(() => toastNotif.classList.remove('show'), 3000);
    }
    
    function setZoom(level) {
        currentZoom = Math.max(0.5, Math.min(3, level));
        if (modalImgContainer) {
            modalImgContainer.style.transform = 'scale(' + currentZoom + ')';
            modalImgContainer.classList.toggle('zoomed', currentZoom > 1);
        }
    }
    
    if (modalLegal) {
        function openModalLegal(imageUrl, title, extraData) {
            currentImageUrl = imageUrl;
            currentFilename = title.replace(/\s+/g, '-').toLowerCase();
            
            if (modalTitleLegal) modalTitleLegal.textContent = title;
            if (modalImageLegal) {
                modalImageLegal.src = imageUrl;
                modalImageLegal.alt = title;
            }
            
            // Isi meta
            const metaEl = document.getElementById('modalMetaLegal');
            if (metaEl && extraData) {
                metaEl.innerHTML = (extraData.date ? '<span><i class="far fa-calendar"></i> ' + extraData.date + '</span>' : '') +
                    (extraData.location ? '<span><i class="fas fa-map-marker-alt"></i> ' + extraData.location + '</span>' : '');
            }
            
            setZoom(1);
            modalLegal.classList.add('active');
            body.style.overflow = 'hidden';
        }
        
        function closeModalLegal() {
            modalLegal.classList.remove('active');
            body.style.overflow = '';
            setZoom(1);
            currentImageUrl = '';
            currentFilename = '';
        }
        
        // Zoom controls
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => { setZoom(currentZoom + 0.35); });
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { setZoom(currentZoom - 0.35); });
        if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => { setZoom(1); });
        
        // Click image to zoom
        if (modalImgContainer) {
            modalImgContainer.addEventListener('click', () => {
                setZoom(currentZoom > 1 ? 1 : 2);
            });
        }
        
        // Scroll wheel zoom
        if (modalTabDokumen) {
            modalTabDokumen.addEventListener('wheel', function(e) {
                e.preventDefault();
                setZoom(currentZoom + (e.deltaY < 0 ? 0.15 : -0.15));
            }, { passive: false });
        }
        
        // Event listener untuk btn-view
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const imageUrl = this.getAttribute('data-image');
                const title = this.getAttribute('data-title');
                const extraData = {
                    date: this.getAttribute('data-date'),
                    location: this.getAttribute('data-location'),
                    nomor: this.getAttribute('data-nomor')
                };
                if (imageUrl && title) {
                    openModalLegal(imageUrl, title, extraData);
                }
            });
        });
        
        // Close
        if (modalCloseLegal) modalCloseLegal.addEventListener('click', closeModalLegal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModalLegal);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalLegal.classList.contains('active')) closeModalLegal();
        });
        
        // Download dari modal
        if (downloadFromModalBtn) {
            downloadFromModalBtn.addEventListener('click', function() {
                if (currentImageUrl) {
                    downloadImage(currentImageUrl, currentFilename || 'dokumen');
                    showToast('Mengunduh dokumen...', 'fas fa-download');
                }
            });
        }
        
        // Share dari modal
        if (shareFromModalBtn) {
            shareFromModalBtn.addEventListener('click', function() {
                const shareData = {
                    title: 'PERADI Kharisma — Legalitas Resmi',
                    text: modalTitleLegal ? modalTitleLegal.textContent : 'Dokumen Legalitas PERADI Kharisma',
                    url: window.location.href
                };
                if (navigator.share) {
                    navigator.share(shareData).catch(() => {});
                } else {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        showToast('Link disalin ke clipboard!', 'fas fa-link');
                    }).catch(() => {
                        showToast('Gunakan tombol Unduh untuk menyimpan dokumen', 'fas fa-info-circle');
                    });
                }
            });
        }
    }
    
    // ===== FUNGSI DOWNLOAD IMAGE =====
    function downloadImage(imageUrl, filename = 'download') {
        // Tambah .jpg jika belum ada extension
        if (!filename.includes('.')) {
            filename += '.jpg';
        }
        
        // Buat temporary anchor element
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        
        // Append ke body, click, dan remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Alternative method untuk CORS images
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob(function(blob) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 'image/jpeg', 0.95);
        };
        img.onerror = function() {
            console.warn('Cross-origin image, menggunakan metode fallback');
        };
        img.src = imageUrl;
    }
    
    // Event listener untuk btn-download
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const imageUrl = this.getAttribute('data-image');
            const filename = this.getAttribute('data-filename');
            
            if (imageUrl) {
                downloadImage(imageUrl, filename);
            }
        });
    });
    
    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href !== "#" && href !== "#!" && href !== "javascript:void(0)") {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
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
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
    });
    
    window.addEventListener('scroll', checkFade);
    window.addEventListener('load', checkFade);
    
    // ===== ORIENTATION CHANGE =====
    window.addEventListener('orientationchange', function() {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    

    // ===== MODAL SURAT PERNYATAAN =====
    const modalSurat = document.getElementById('modalSurat');
    const modalCloseSurat = document.getElementById('modalCloseSurat');
    const modalOverlaySurat = modalSurat ? modalSurat.querySelector('.modal-overlay-surat') : null;

    function openModalSurat() {
        if (!modalSurat) return;
        modalSurat.classList.add('active');
        body.style.overflow = 'hidden';
    }
    function closeModalSurat() {
        if (!modalSurat) return;
        modalSurat.classList.remove('active');
        body.style.overflow = '';
    }
    document.querySelectorAll('.btn-preview-surat').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModalSurat();
        });
    });
    if (modalCloseSurat) modalCloseSurat.addEventListener('click', closeModalSurat);
    if (modalOverlaySurat) modalOverlaySurat.addEventListener('click', closeModalSurat);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalSurat && modalSurat.classList.contains('active')) closeModalSurat();
    });

    console.log('PERADI Kharisma website loaded successfully!');
});
// ===== SCROLL REVEAL =====
(function() {
    'use strict';

    // Navbar scroll shadow
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // Intersection Observer for reveal
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!revealEls.length) return;

    const io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(function(el) { io.observe(el); });
})();