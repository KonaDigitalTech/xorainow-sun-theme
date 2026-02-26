// Xorai Futuristic - Main JavaScript

// Utility functions
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

// Shared header loader
function loadHeader() {
  const existingHeader = $('.site-header');
  if (!existingHeader) {
    return Promise.resolve();
  }

  const headerPath = '/includes/header.html';

  return fetch(headerPath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load header include');
      }
      return response.text();
    })
    .then(html => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html.trim();
      const newHeader = wrapper.querySelector('.site-header') || wrapper.firstElementChild;
      if (newHeader) {
        existingHeader.replaceWith(newHeader);
      }
    })
    .catch(error => {
      console.error(error);
    });
}

// Shared footer loader
function loadFooter() {
  const existingFooter = $('.site-footer');
  if (!existingFooter) {
    return Promise.resolve();
  }

  const footerPath = '/includes/footer.html';

  return fetch(footerPath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load footer include');
      }
      return response.text();
    })
    .then(html => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html.trim();
      const newFooter = wrapper.querySelector('.site-footer') || wrapper.firstElementChild;
      if (newFooter) {
        existingFooter.replaceWith(newFooter);
      }
    })
    .catch(error => {
      console.error(error);
    });
}

// Navigation functionality
function initNavigation() {
  const navToggle = $('.nav-toggle');
  const siteNav = $('.site-nav');
  const header = $('.site-header');
  
  // Mobile menu toggle
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      siteNav.classList.toggle('active');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });
  }
  
  // Dropdown menu functionality
  const navItems = $$('.nav-item.has-dropdown');
  navItems.forEach(item => {
    const button = $('button', item);
    const menu = $('.dropdown-menu', item);
    
    if (button && menu) {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        // Close all other dropdowns
        navItems.forEach(otherItem => {
          const otherButton = $('button', otherItem);
          if (otherButton && otherButton !== button) {
            otherButton.setAttribute('aria-expanded', 'false');
          }
        });
        
        button.setAttribute('aria-expanded', !isExpanded);
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!item.contains(e.target)) {
          button.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
  
  // Header elevation on scroll
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      header.setAttribute('data-elevate', currentScroll > 50);
      lastScroll = currentScroll;
    });
  }
}

// Tab functionality
function initTabs() {
  const tabContainers = $$('[data-tabs]');
  
  tabContainers.forEach(container => {
    const tabs = $$('.tab', container);
    const panels = $$('.tabpanel', container);
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Remove active state from all tabs and panels
        tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
        panels.forEach(p => p.classList.remove('active'));
        
        // Add active state to clicked tab and corresponding panel
        tab.setAttribute('aria-selected', 'true');
        if (panels[index]) {
          panels[index].classList.add('active');
        }
      });
    });
  });
}

// Scroll reveal animation
function initScrollReveal() {
  const reveals = $$('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
}

// Curriculum accordion
function initAccordion() {
  const accordions = $$('.accordion');
  if (!accordions.length) return;

  accordions.forEach(accordion => {
    const triggers = $$('[data-toggle="collapse"]', accordion);

    triggers.forEach(trigger => {
      const targetSelector = trigger.getAttribute('href');
      if (!targetSelector || !targetSelector.startsWith('#')) return;

      const target = document.querySelector(targetSelector);
      if (!target) return;

      trigger.addEventListener('click', (event) => {
        event.preventDefault();

        const isOpen = target.classList.contains('open');

        // Close all panels in this accordion
        triggers.forEach(otherTrigger => {
          const otherSelector = otherTrigger.getAttribute('href');
          if (!otherSelector || !otherSelector.startsWith('#')) return;

          const otherTarget = document.querySelector(otherSelector);
          if (!otherTarget) return;

          otherTarget.classList.remove('open');

          const otherPanel = otherTrigger.closest('.panel');
          if (otherPanel) {
            otherPanel.classList.remove('open');
          }
        });

        // Open the clicked panel if it was previously closed
        if (!isOpen) {
          target.classList.add('open');
          const panel = trigger.closest('.panel');
          if (panel) {
            panel.classList.add('open');
          }
        }
      });
    });
  });
}

// Hero canvas animation (particle network)
function initHeroCanvas() {
  const canvas = $('.hero-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initParticles();
  }
  
  function initParticles() {
    particles = [];
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }
  }
  
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    ctx.strokeStyle = 'rgba(255, 179, 0, 0.15)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.globalAlpha = 1 - distance / 150;
          ctx.stroke();
        }
      }
    }
    
    // Draw particles
    ctx.globalAlpha = 1;
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 213, 79, 0.6)';
      ctx.fill();
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
    });
    
    animationId = requestAnimationFrame(drawParticles);
  }
  
  resize();
  window.addEventListener('resize', resize);
  drawParticles();
  
  // Pause animation when page is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      drawParticles();
    }
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      // Ignore accordion toggles (handled separately)
      if (this.closest('.accordion')) {
        return;
      }
      
      const target = $(href);
      if (target) {
        e.preventDefault();
        const headerHeight = $('.site-header')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const navToggle = $('.nav-toggle');
        const siteNav = $('.site-nav');
        if (navToggle && siteNav) {
          navToggle.setAttribute('aria-expanded', 'false');
          siteNav.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });
}

// Update copyright year
function updateCopyrightYear() {
  const yearElements = $$('[data-year]');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
}

// Initialize all functionality
function init() {
  Promise.all([loadHeader(), loadFooter()]).then(() => {
    initNavigation();
    initTabs();
    initAccordion();
    initScrollReveal();
    initHeroCanvas();
    initSmoothScroll();
    updateCopyrightYear();
  });
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is hidden
  } else {
    // Resume animations when page is visible
  }
});


(function () {
  var modal = document.getElementById("modal_caller");
  var openBtn = document.querySelector(".btn_caller");
  var closeBtn = document.querySelector(".close_call_btn_caller");
  if (modal && openBtn) {
    openBtn.addEventListener("click", function () { modal.classList.add("active"); modal.setAttribute("aria-hidden", "false"); });
    openBtn.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); modal.classList.add("active"); modal.setAttribute("aria-hidden", "false"); } });
  }
  if (modal && closeBtn) {
    closeBtn.addEventListener("click", function () { modal.classList.remove("active"); modal.setAttribute("aria-hidden", "true"); });
  }
})();