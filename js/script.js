// Navegação responsiva
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle do menu mobile
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Navegação suave
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Destacar link ativo na navegação
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Atualizar link ativo no scroll
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Executar uma vez no carregamento

    // Animação de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.feature-card, .practice-card, .result-card, .advisor-card, .guideline-phase');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Contador animado para estatísticas
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target') || counter.textContent.replace(/[^\d]/g, ''));
            const duration = 2000; // 2 segundos
            const increment = target / (duration / 16); // 60 FPS
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (counter.textContent.includes('%')) {
                        counter.textContent = Math.ceil(current) + '%';
                    } else if (counter.textContent.includes('milhões')) {
                        counter.textContent = (current / 1000000).toFixed(1) + ' milhões';
                    } else {
                        counter.textContent = Math.ceil(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = counter.getAttribute('data-original') || counter.textContent;
                }
            };
            
            // Salvar texto original
            counter.setAttribute('data-original', counter.textContent);
            counter.setAttribute('data-target', target);
            
            // Observar quando o elemento entra na tela
            const counterObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            counterObserver.observe(counter);
        });
    }

    // Inicializar contadores
    animateCounters();

    // Tooltip para imagens
    const images = document.querySelectorAll('.responsive-image');
    images.forEach(img => {
        img.addEventListener('mouseenter', function() {
            const caption = this.nextElementSibling;
            if (caption && caption.classList.contains('image-caption')) {
                caption.style.opacity = '1';
                caption.style.transform = 'translateY(0)';
            }
        });
    });

    // Lazy loading para imagens
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // Aplicar lazy loading se necessário
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));

    // Botão de voltar ao topo
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    `;

    document.body.appendChild(backToTopButton);

    // Mostrar/esconder botão de voltar ao topo
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    // Funcionalidade do botão de voltar ao topo
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Efeito hover para cards
    const cards = document.querySelectorAll('.feature-card, .practice-card, .result-card, .advisor-card, .guideline-phase');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px)';
        });
    });

    // Copiar texto ao clicar (para citações)
    const citationElements = document.querySelectorAll('.research-title, .author-title');
    citationElements.forEach(element => {
        element.addEventListener('click', function() {
            navigator.clipboard.writeText(this.textContent).then(() => {
                // Feedback visual
                const originalText = this.textContent;
                this.textContent = 'Copiado!';
                this.style.color = '#22c55e';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 1500);
            });
        });
        
        // Adicionar cursor pointer
        element.style.cursor = 'pointer';
        element.title = 'Clique para copiar';
    });

    // Expandir/contrair seções longas
    const expandableElements = document.querySelectorAll('.research-abstract, .discovery-content');
    expandableElements.forEach(element => {
        if (element.scrollHeight > 300) {
            element.style.maxHeight = '300px';
            element.style.overflow = 'hidden';
            element.style.position = 'relative';
            
            const expandButton = document.createElement('button');
            expandButton.textContent = 'Ler mais';
            expandButton.className = 'expand-button';
            expandButton.style.cssText = `
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                cursor: pointer;
                margin-top: 1rem;
                font-size: 0.9rem;
                transition: all 0.3s ease;
            `;
            
            element.parentNode.insertBefore(expandButton, element.nextSibling);
            
            expandButton.addEventListener('click', function() {
                if (element.style.maxHeight === '300px') {
                    element.style.maxHeight = 'none';
                    this.textContent = 'Ler menos';
                } else {
                    element.style.maxHeight = '300px';
                    this.textContent = 'Ler mais';
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    });

    // Busca simples no conteúdo
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar no conteúdo...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        padding: 1rem;
        border: 2px solid #22c55e;
        border-radius: 0.5rem;
        font-size: 1rem;
        z-index: 2000;
        display: none;
        background: white;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(searchInput);

    // Atalho de teclado para busca (Ctrl+F ou Cmd+F)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.style.display = 'block';
            searchInput.focus();
        }
        
        if (e.key === 'Escape') {
            searchInput.style.display = 'none';
            searchInput.value = '';
            // Remover highlights
            document.querySelectorAll('.search-highlight').forEach(el => {
                el.outerHTML = el.innerHTML;
            });
        }
    });

    // Funcionalidade de busca
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Remover highlights anteriores
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });
        
        if (searchTerm.length > 2) {
            const textNodes = [];
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            let node;
            while (node = walker.nextNode()) {
                if (node.parentElement.tagName !== 'SCRIPT' && 
                    node.parentElement.tagName !== 'STYLE' &&
                    node.textContent.toLowerCase().includes(searchTerm)) {
                    textNodes.push(node);
                }
            }
            
            textNodes.forEach(node => {
                const text = node.textContent;
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                const highlightedText = text.replace(regex, '<span class="search-highlight" style="background: #fef3c7; padding: 0.2rem;">$1</span>');
                
                if (highlightedText !== text) {
                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = highlightedText;
                    node.parentNode.replaceChild(wrapper, node);
                    wrapper.outerHTML = wrapper.innerHTML;
                }
            });
        }
    });

    console.log('Site Qualidade de Vida carregado com sucesso!');
    console.log('Desenvolvido por Anderson Pignata - Práticas Integrativas no Ambiente Escolar');
});

// Função para imprimir página
function printPage() {
    window.print();
}

// Função para compartilhar (se suportado pelo navegador)
function shareContent() {
    if (navigator.share) {
        navigator.share({
            title: 'Qualidade de Vida - Anderson Pignata',
            text: 'Práticas Integrativas Mediadas por Tecnologias Digitais no Ambiente Escolar',
            url: window.location.href
        });
    } else {
        // Fallback: copiar URL
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copiado para a área de transferência!');
        });
    }
}

// Adicionar botões de ação se necessário
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar botão de impressão no footer
    const footer = document.querySelector('.footer-bottom');
    if (footer) {
        const actionButtons = document.createElement('div');
        actionButtons.style.cssText = 'margin-top: 1rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;';
        
        const printButton = document.createElement('button');
        printButton.textContent = '🖨️ Imprimir';
        printButton.onclick = printPage;
        printButton.style.cssText = `
            background: #374151;
            color: white;
            border: 1px solid #6b7280;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 0.875rem;
            transition: background 0.3s ease;
        `;
        
        const shareButton = document.createElement('button');
        shareButton.textContent = '📤 Compartilhar';
        shareButton.onclick = shareContent;
        shareButton.style.cssText = printButton.style.cssText;
        
        actionButtons.appendChild(printButton);
        actionButtons.appendChild(shareButton);
        footer.appendChild(actionButtons);
        
        // Hover effects
        [printButton, shareButton].forEach(btn => {
            btn.addEventListener('mouseenter', () => btn.style.background = '#4b5563');
            btn.addEventListener('mouseleave', () => btn.style.background = '#374151');
        });
    }
});

