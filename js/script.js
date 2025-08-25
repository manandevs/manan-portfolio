// =================================================================
// SCRIPT.JS FOR ABDUL MANAN PORTFOLIO
// =================================================================

// Wait for the DOM to be fully loaded before running any scripts
document.addEventListener("DOMContentLoaded", () => {
  // 🔒 Lock body height & disable scroll during preloader
  document.body.classList.add("loading");

  // 1. Preloader Animation
  const preloaderText = [
    "MANAN_DEVS::INITIALIZING",
    "CORE::REACT.JS",
    "FRAMEWORK::NEXT.JS",
    "STYLING::TAILWIND.CSS",
    "ANIMATION::GSAP",
    "EXPERIENCE::9+ MONTHS",
    "MISSION::CRAFTING DIGITAL REALITIES",
    "SYSTEMS::ONLINE",
    "READY_TO_BUILD",
  ];

  const preloader = document.querySelector(".preloader");
  const preloaderDisplay = preloader.querySelector("div");

  // This function will be called after the preloader finishes
  const onReady = () => {
    gsap.to(preloader, {
      opacity: 0,
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
        preloader.style.display = "none";

        // ✅ Unlock body height/scroll when preloader done
        document.body.classList.remove("loading");

        // Initialize all other animations now that the page is visible
        initPageAnimations();
      },
    });
  };

  let textIndex = 0;
  preloaderDisplay.textContent = preloaderText[textIndex]; // Set initial text

  const updatePreloaderText = () => {
    textIndex++;
    if (textIndex < preloaderText.length) {
      gsap.to(preloaderDisplay, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          preloaderDisplay.textContent = preloaderText[textIndex];
          gsap.to(preloaderDisplay, { opacity: 1, duration: 0.2 });
        },
      });
    } else {
      clearInterval(textInterval);
      setTimeout(onReady, 500); // Wait a moment before fading out
    }
  };

  const textInterval = setInterval(updatePreloaderText, 300);

  // =================================================================
  // 2. Mobile Menu
  // =================================================================
  const hamburger = document.querySelector(".hamburger-menu");
  const mobilePanel = document.querySelector(".mobile-nav-panel");
  const allMobileLinks = mobilePanel.querySelectorAll("a");

  const toggleMenu = () => {
    hamburger.classList.toggle("active");
    mobilePanel.classList.toggle("-right-full");
    mobilePanel.classList.toggle("right-0");
    document.body.classList.toggle("no-scroll");
  };

  hamburger.addEventListener("click", toggleMenu);
  allMobileLinks.forEach((link) => link.addEventListener("click", toggleMenu));
  // Select cursor elements
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  // Hide custom cursor on touch devices
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouch) {
    // Move cursor
    window.addEventListener('mousemove', (e) => {
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: 'power3.out',
      });
      gsap.to(cursorOutline, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'power3.out',
      });
    });

    document.body.addEventListener('mouseleave', (ev) => {
      // Only hide when truly leaving window (not moving between elements)
      if (!ev.relatedTarget && !ev.toElement) {
        gsap.to([cursorDot, cursorOutline], {
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out'
        });
      }
    });

    document.body.addEventListener('mouseenter', () => {
      gsap.to([cursorDot, cursorOutline], {
        opacity: 1,
        duration: 0.3,
        ease: 'power3.in'
      });
    });


    // Hover effects on interactive elements
    const interactives = document.querySelectorAll('a, button, input, textarea');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursorDot, { backgroundColor: '#011533', duration: 0.2 });
        gsap.to(cursorOutline, {
          borderColor: '#00a8ff',
          scale: 1.67,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursorDot, { backgroundColor: '#00a8ff', duration: 0.2 });
        gsap.to(cursorOutline, {
          borderColor: '#00a8ff',
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }

  // =================================================================
  // 4. Magnetic Button
  // =================================================================
  document.querySelectorAll(".magnetic-button").forEach((button) => {
    const txt = button.querySelector(".button-text");
    button.addEventListener("mousemove", (e) => {
      const { offsetX, offsetY, target } = e;
      const { clientWidth, clientHeight } = target;
      gsap.to(txt, {
        x: (offsetX / clientWidth - 0.5) * 30,
        y: (offsetY / clientHeight - 0.5) * 30,
        duration: 0.4,
        ease: "power2.out",
      });
    });
    button.addEventListener("mouseleave", () =>
      gsap.to(txt, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" })
    );
  });

  // =================================================================
  // 5. CORRECTED Contact Form Popup Logic
  // =================================================================
  const openBtns = document.querySelectorAll(".open-form-btn");
  const closeBtn = document.getElementById("closeFormBtn");
  const popup = document.getElementById("popupForm");
  const popupContent = popup.querySelector('div'); // Get the inner content div
  const contactForm = document.getElementById("contactForm");

  const openPopup = () => {
    popup.classList.remove("hidden");
    gsap.to(popupContent, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: "power3.out"
    });
    contactForm.querySelector("input, select, textarea").focus();
  };

  const closePopup = () => {
    gsap.to(popupContent, {
      scale: 0.675,
      opacity: 0,
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => {
        popup.classList.add("hidden"); // Hide the parent container AFTER the animation finishes
      },
    });
  };

  // Add listener to all open buttons
  openBtns.forEach(btn => {
    btn.addEventListener("click", openPopup);
  });

  // Add listener to the single close button
  closeBtn.addEventListener("click", closePopup);

  // Add listener to close when clicking the backdrop
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      closePopup();
    }
  });

  // =================================================================
  //  FORM SUBMISSION LOGIC
  // =================================================================
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const messageInput = document.getElementById("message");

    const userName = nameInput.value.trim();
    const userEmail = emailInput.value.trim();
    const userPhone = phoneInput.value.trim();
    const userMessage = messageInput.value.trim();

    const params = new URLSearchParams();
    params.append("name", userName);
    params.append("email", userEmail);
    params.append("phone", userPhone);
    params.append("message", userMessage);

    // This logic is for a custom success page, you may want to change it
    // to a proper AJAX submission later.
    window.location.href = `success.html?${params.toString()}`;
  });

  // 6. GSAP Page Animations
  function initPageAnimations() {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // Hero Entrance
    gsap
      .timeline({ delay: 0.2 })
      .to(".hero-content", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      })
      .from(
        ".hero-title .char",
        {
          y: 100,
          opacity: 0,
          stagger: 0.05,
          duration: 1,
          ease: "power4.out",
        },
        "-=0.8"
      );

    // Manifesto Text Reveal
    gsap.from(".manifesto-text span", {
      y: 50,
      opacity: 0,
      stagger: 0.05,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#manifesto",
        start: "top 70%",
      },
    });

    // Horizontal Scroll Timeline
    if (window.innerWidth > 768) {
      const timelineWrapper = document.querySelector(".timeline-wrapper");
      gsap.to(timelineWrapper, {
        x: () => -(timelineWrapper.scrollWidth - window.innerWidth) + "px",
        ease: "none",
        scrollTrigger: {
          trigger: "#process",
          pin: true,
          scrub: 1,
          end: () => `+=${timelineWrapper.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        },
      });
    }

    // Generic Fade-in for sections
    gsap.utils.toArray(".fade-in").forEach((elem) => {
      gsap.fromTo(
        elem,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
          },
        }
      );
    });
  }
});