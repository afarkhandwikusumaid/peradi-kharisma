// ===== NAVBAR MOBILE =====
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navBackdrop = document.getElementById('navBackdrop');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // Fungsi buka menu
    function openMenu() {
        navMenu.classList.add('active');
        navBackdrop.classList.add('active');
        document.body.classList.add('menu-open');
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    }
    
    // Fungsi tutup menu
    function closeMenu() {
        navMenu.classList.remove('active');
        navBackdrop.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Tutup semua dropdown saat menu ditutup
        document.querySelectorAll('.dropdown-container.active').forEach(item => {
            item.classList.remove('active');
        });
    }
    
    // Toggle menu
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
    
    // Tutup menu dengan backdrop
    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMenu);
    }
    
    // Handle dropdown di mobile
    function setupMobileDropdowns() {
        if (window.innerWidth <= 1023) {
            dropdownToggles.forEach(toggle => {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    const parent = this.closest('.dropdown-container');
                    
                    // Tutup dropdown lain
                    document.querySelectorAll('.dropdown-container.active').forEach(item => {
                        if (item !== parent) {
                            item.classList.remove('active');
                        }
                    });
                    
                    // Toggle dropdown saat ini
                    parent.classList.toggle('active');
                });
            });
        } else {
            // Hapus active class di desktop
            document.querySelectorAll('.dropdown-container.active').forEach(item => {
                item.classList.remove('active');
            });
        }
    }
    
    // Panggil setup dropdown
    setupMobileDropdowns();
    
    // Handle resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1023 && navMenu.classList.contains('active')) {
            closeMenu();
        }
        setupMobileDropdowns();
    });
    
    // Tutup menu saat klik link (kecuali dropdown)
    document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 1023) {
                setTimeout(closeMenu, 150);
            }
        });
    });
    
    // Tutup dengan tombol Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});

// ===== MODAL BERITA =====
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalBerita');
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const modalImage = document.getElementById('modalImage');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    
    if (!modal) return;
    
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
        document.body.style.overflow = 'hidden';
    }
    
    // Fungsi tutup modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
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
    
    // Tombol Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href !== "#" && href !== "#!" && href !== "#") {
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});