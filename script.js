
document.addEventListener("DOMContentLoaded", () => {
  // Initialize icons
  if (window.lucide) {
    lucide.createIcons();
  }

  document.body.classList.add("js-ready");

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.innerHTML = isOpen
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';

    if (window.lucide) lucide.createIcons();
  });

  document.querySelectorAll(".nav-link, .nav-appointment").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
      if (window.lucide) lucide.createIcons();
    });
  });

  // Set minimum appointment date to today
  const dateInput = document.getElementById("date");

  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  dateInput.min = localToday;

  // Preselect a service from the service cards
  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      document.getElementById("service").value = link.dataset.service;
    });
  });

  // Appointment form validation and demo submission
  const appointmentForm = document.getElementById("appointmentForm");
  const formNotice = document.getElementById("formNotice");
  const phoneInput = document.getElementById("phone");

  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
  });

  appointmentForm.addEventListener("submit", event => {
    event.preventDefault();

    formNotice.textContent = "";
    formNotice.className = "form-notice";

    if (!appointmentForm.checkValidity()) {
      appointmentForm.reportValidity();
      return;
    }

    // This is a front-end demo. No patient data is transmitted.
    const appointment = {
      name: document.getElementById("fullName").value.trim(),
      phone: phoneInput.value,
      service: document.getElementById("service").value,
      date: dateInput.value,
      time: document.getElementById("time").value
    };

    if (appointment.name.length < 2) {
      formNotice.textContent = "Please enter your full name.";
      formNotice.classList.add("error");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(appointment.phone)) {
      formNotice.textContent = "Please enter a valid 10-digit Indian mobile number.";
      formNotice.classList.add("error");
      return;
    }

    // Show a confirmation without falsely claiming a booking was made.
    formNotice.textContent =
      "Your form passed validation! To submit this request to the clinic, connect a booking backend or an authorized form service.";
    formNotice.classList.add("success");

    // Do not store or transmit medical or contact details.
    // A real booking system should send the request securely to its backend.
  });

  // Testimonial slider
  const reviewTrack = document.getElementById("reviewTrack");
  const reviewCards = Array.from(
    reviewTrack.querySelectorAll(".review-card")
  );

  const prevReview = document.getElementById("prevReview");
  const nextReview = document.getElementById("nextReview");

  let reviewIndex = 0;

  function updateReviewSlider() {
    if (!reviewCards.length) return;

    const isMobile = window.matchMedia("(max-width: 520px)").matches;
    const isTablet = window.matchMedia(
      "(min-width: 521px) and (max-width: 800px)"
    ).matches;

    let visibleCards = isMobile ? 1 : isTablet ? 2 : 3;
    visibleCards = Math.min(visibleCards, reviewCards.length);

    const maxIndex = Math.max(0, reviewCards.length - visibleCards);
    reviewIndex = Math.min(reviewIndex, maxIndex);

    if (isMobile) {
      reviewTrack.style.transform =
        `translateX(-${reviewIndex * 100}%)`;
    } else {
      const gap = parseFloat(getComputedStyle(reviewTrack).columnGap) || 0;
      const cardWidth = reviewCards[0].getBoundingClientRect().width;
      reviewTrack.style.transform =
        `translateX(-${reviewIndex * (cardWidth + gap)}px)`;
    }

    prevReview.disabled = reviewIndex === 0;
    nextReview.disabled = reviewIndex >= maxIndex;

    prevReview.style.opacity = prevReview.disabled ? "0.5" : "1";
    nextReview.style.opacity = nextReview.disabled ? "0.5" : "1";
  }

  prevReview.addEventListener("click", () => {
    reviewIndex = Math.max(0, reviewIndex - 1);
    updateReviewSlider();
  });

  nextReview.addEventListener("click", () => {
    const isMobile = window.matchMedia("(max-width: 520px)").matches;
    const isTablet = window.matchMedia(
      "(min-width: 521px) and (max-width: 800px)"
    ).matches;

    const visibleCards = isMobile ? 1 : isTablet ? 2 : 3;
    const maxIndex = Math.max(0, reviewCards.length - visibleCards);

    reviewIndex = Math.min(maxIndex, reviewIndex + 1);
    updateReviewSlider();
  });

  window.addEventListener("resize", updateReviewSlider);
  updateReviewSlider();

  // Floating chat widget
  const chatButton = document.getElementById("chatButton");
  const chatPanel = document.getElementById("chatPanel");
  const closeChat = document.getElementById("closeChat");
  const chatMessages = document.getElementById("chatMessages");

  function toggleChat(open) {
    chatPanel.hidden = !open;
    chatButton.setAttribute("aria-expanded", String(open));
    chatButton.innerHTML = open
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="message-circle"></i>';

    if (window.lucide) lucide.createIcons();
  }

  chatButton.addEventListener("click", () => {
    toggleChat(chatPanel.hidden);
  });

  closeChat.addEventListener("click", () => toggleChat(false));

  const chatReplies = {
    hours: "Sample clinic hours: Monday to Saturday, 10 AM to 6 PM. Please confirm the actual clinic schedule before visiting.",
    services: "We list acne treatment, skin rejuvenation, hair loss care, eczema and psoriasis care, mole and wart checks, and skin cancer screening.",
    booking: "You can fill out the appointment request form on this page. This demo does not send your request to the clinic or confirm a booking."
  };

  document.querySelectorAll("[data-chat]").forEach(button => {
    button.addEventListener("click", () => {
      const reply = chatReplies[button.dataset.chat];

      const message = document.createElement("p");
      message.className = "chat-bubble";
      message.textContent = reply;

      chatMessages.appendChild(message);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  });

  // Close chat when Escape is pressed
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !chatPanel.hidden) {
      toggleChat(false);
    }
  });

  // Back-to-top button
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 450);
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Active navigation link while scrolling
  const sections = document.querySelectorAll(
    "main section[id]"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        document.querySelectorAll(".nav-link").forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    }, {
      rootMargin: "-25% 0px -60% 0px"
    });

    sections.forEach(section => observer.observe(section));
  }

  // Reveal cards and sections as they enter the viewport
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    document.querySelectorAll(
      ".service-card, .about-content, .appointment-form, .review-card"
    ).forEach(element => revealObserver.observe(element));
  } else {
    document.querySelectorAll(
      ".service-card, .about-content, .appointment-form, .review-card"
    ).forEach(element => element.classList.add("is-visible"));
  }

  // Dynamic copyright year
  document.getElementById("year").textContent =
    new Date().getFullYear();
});
