(function() {
            // Navbar Mobile
            const menuToggle = document.getElementById('menuToggle');
            const navMenu = document.getElementById('navMenu');
            const navBackdrop = document.getElementById('navBackdrop');
            
            if (menuToggle && navMenu && navBackdrop) {
                menuToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    if (!navMenu.classList.contains('active')) {
                        navMenu.classList.add('active');
                        navBackdrop.classList.add('active');
                        document.body.classList.add('menu-open');
                        this.innerHTML = '<i class="fas fa-times"></i>';
                    } else {
                        navMenu.classList.remove('active');
                        navBackdrop.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        this.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
                
                navBackdrop.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    navBackdrop.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                });
                
                // Dropdown mobile
                document.querySelectorAll('.nav-item > .nav-link').forEach(link => {
                    link.addEventListener('click', function(e) {
                        if (window.innerWidth <= 768) {
                            const parent = this.closest('.nav-item');
                            const hasSubmenu = parent.querySelector('.dropdown, .mega-menu');
                            
                            if (hasSubmenu) {
                                e.preventDefault();
                                parent.classList.toggle('active');
                            }
                        }
                    });
                });
                
                // Tutup menu saat klik link
                document.querySelectorAll('.nav-menu a[href^="#"]').forEach(link => {
                    link.addEventListener('click', function() {
                        if (window.innerWidth <= 768) {
                            setTimeout(() => {
                                navMenu.classList.remove('active');
                                navBackdrop.classList.remove('active');
                                document.body.classList.remove('menu-open');
                                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                            }, 100);
                        }
                    });
                });
                
                // Handle resize
                window.addEventListener('resize', function() {
                    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navBackdrop.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
            }
            
            // Modal Berita
            const modal = document.getElementById('modalBerita');
            const modalTitle = document.getElementById('modalTitle');
            const modalMeta = document.getElementById('modalMeta');
            const modalImage = document.getElementById('modalImage');
            const modalContent = document.getElementById('modalContent');
            const modalClose = document.getElementById('modalClose');
            
            if (modal) {
                document.querySelectorAll('.btn-berita').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        const card = this.closest('.berita-card');
                        if (card) {
                            const img = card.querySelector('.berita-poster img');
                            const title = card.querySelector('.berita-content h3');
                            const metaSpans = card.querySelectorAll('.berita-meta span');
                            const desc = card.querySelector('.berita-content p');
                            
                            if (title) modalTitle.textContent = title.textContent;
                            if (metaSpans.length) {
                                modalMeta.textContent = Array.from(metaSpans).map(s => s.textContent.trim()).join(' • ');
                            }
                            if (desc) modalContent.textContent = desc.textContent;
                            if (img && img.src) {
                                modalImage.src = img.src;
                                modalImage.alt = img.alt;
                                modalImage.style.display = 'block';
                            } else {
                                modalImage.style.display = 'none';
                            }
                            
                            modal.classList.add('active');
                        }
                    });
                });
                
                if (modalClose) {
                    modalClose.addEventListener('click', () => {
                        modal.classList.remove('active');
                    });
                }
                
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                    }
                });
                
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && modal.classList.contains('active')) {
                        modal.classList.remove('active');
                    }
                });
            }
        })();