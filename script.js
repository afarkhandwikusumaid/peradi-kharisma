(function() {
    // ===== NAVBAR MOBILE =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navBackdrop = document.getElementById('navBackdrop');
    
    if (menuToggle && navMenu && navBackdrop) {
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
            document.querySelectorAll('.nav-item.active').forEach(item => {
                item.classList.remove('active');
            });
        }
        
        // Toggle menu saat tombol diklik
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Tutup menu saat backdrop diklik
        navBackdrop.addEventListener('click', closeMenu);
        
        // Handle dropdown di mobile
        function setupMobileDropdowns() {
            if (window.innerWidth <= 768) {
                document.querySelectorAll('.nav-item > .nav-link').forEach(link => {
                    link.addEventListener('click', function(e) {
                        const parent = this.closest('.nav-item');
                        const hasSubmenu = parent.querySelector('.dropdown, .mega-menu');
                        
                        if (hasSubmenu) {
                            e.preventDefault();
                            
                            // Tutup dropdown lain yang terbuka
                            document.querySelectorAll('.nav-item.active').forEach(item => {
                                if (item !== parent) {
                                    item.classList.remove('active');
                                }
                            });
                            
                            // Toggle dropdown saat ini
                            parent.classList.toggle('active');
                        }
                    });
                });
            }
        }
        
        // Panggil setup dropdown
        setupMobileDropdowns();
        
        // Tutup menu saat klik link (kecuali link dropdown)
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    const parent = this.closest('.nav-item');
                    const isInDropdown = this.closest('.dropdown, .mega-menu');
                    const hasSubmenu = parent?.querySelector('.dropdown, .mega-menu');
                    
                    // Jika link biasa (bukan parent dropdown) dan bukan di dalam dropdown
                    if (!hasSubmenu && !isInDropdown) {
                        setTimeout(closeMenu, 150);
                    }
                    
                    // Jika link di dalam dropdown, biarkan dropdown tetap terbuka
                    if (isInDropdown) {
                        e.stopPropagation();
                    }
                }
            });
        });
        
        // Handle resize window
        window.addEventListener('resize', function() {
            // Jika layar > 768px dan menu terbuka, tutup menu
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
            
            // Reset dropdown di desktop
            if (window.innerWidth > 768) {
                document.querySelectorAll('.nav-item.active').forEach(item => {
                    item.classList.remove('active');
                });
            } else {
                // Setup ulang dropdown jika resize ke mobile
                setupMobileDropdowns();
            }
        });
        
        // Tutup menu dengan tombol Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    // ===== MODAL BERITA =====
    // Pastikan DOM sudah siap
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModal);
    } else {
        initModal();
    }
    
    function initModal() {
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
            
            // Set konten modal
            if (title) modalTitle.textContent = title.textContent;
            
            if (metaSpans.length) {
                const metaText = Array.from(metaSpans).map(s => s.textContent.trim()).join(' • ');
                modalMeta.textContent = metaText;
            } else {
                modalMeta.textContent = '';
            }
            
            if (desc) modalContent.textContent = desc.textContent;
            
            // Set gambar
            if (img && img.src) {
                modalImage.src = img.src;
                modalImage.alt = img.alt || title?.textContent || 'Gambar Berita';
                modalImage.style.display = 'block';
            } else {
                modalImage.style.display = 'none';
            }
            
            // Tampilkan modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Fungsi tutup modal
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset konten modal (opsional)
            // setTimeout(() => {
            //     modalImage.src = '';
            //     modalTitle.textContent = 'Judul Berita';
            //     modalMeta.textContent = 'Tanggal • Penulis';
            //     modalContent.textContent = '';
            // }, 300);
        }
        
        // Event listener untuk semua tombol "Baca Selengkapnya"
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
        
        // Prevent scroll di dalam modal agar tidak mempengaruhi background
        const modalCard = modal.querySelector('.modal-card');
        if (modalCard) {
            modalCard.addEventListener('wheel', function(e) {
                e.stopPropagation();
            });
        }
    }
    
    // ===== UTILITY: Tutup dropdown saat klik di luar =====
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const isClickInsideNav = e.target.closest('.nav-menu');
            const isClickOnToggle = e.target.closest('.menu-toggle');
            
            if (!isClickInsideNav && !isClickOnToggle && navMenu?.classList.contains('active')) {
                // Tutup menu jika klik di luar
                if (navMenu && navBackdrop && menuToggle) {
                    navMenu.classList.remove('active');
                    navBackdrop.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    
                    // Tutup semua dropdown
                    document.querySelectorAll('.nav-item.active').forEach(item => {
                        item.classList.remove('active');
                    });
                }
            }
        }
    });
    
    // ===== CEK ORIENTASI LAYAR (untuk mobile landscape) =====
    window.addEventListener('orientationchange', function() {
        // Jika menu terbuka saat orientasi berubah, tutup menu
        if (navMenu?.classList.contains('active')) {
            setTimeout(() => {
                if (navMenu && navBackdrop && menuToggle) {
                    navMenu.classList.remove('active');
                    navBackdrop.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }, 200);
        }
    });
    
})();