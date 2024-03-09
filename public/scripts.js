// toggle icon navbar
let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menuIcon.onclick = () => {
  menuIcon.classList.toggle("bxs-x-circle");
  navbar.classList.toggle("active");
};

// scroll sections active link
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector(`header nav a[href*=` + id + `]`)
          .classList.add("active");
      });
    }
  });
  // sticky header
  let header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 100);

  // remove toggle icon and navbar when click navbar links (scroll)
  menuIcon.classList.remove("bx-x-circle");
  navbar.classList.remove("active");
};


// animation on scroll
document.addEventListener("DOMContentLoaded", function() {
  // Global configuration for ScrollReveal
  ScrollReveal({
      reset: true,
      distance: "80px",
      duration: 2000,
      delay: 200,
  });

  // ScrollReveal configurations for individual elements
  ScrollReveal().reveal(".home-content, .heading", { origin: "top" });
  ScrollReveal().reveal(".home-img, .services-container, .portfolio-box, .contact form", { origin: "bottom" });
  ScrollReveal().reveal(".home-content h1, .about-img", { origin: "left" });
  ScrollReveal().reveal(".home-content p, .portfolio p, .about-content", { origin: "right" });
});

var typed = new Typed(".multiple-text", {
  strings: ["Full-Stack Developer", "&", "Data Analyst"],
  typeSpeed: 100,
  backSpeed: 100,
  backDelay: 1000,
  loop: true,
});


// Dynamic Copyright Year function
window.addEventListener("load", function () {
  document
    .getElementById("copyright-year")
    .appendChild(document.createTextNode(new Date().getFullYear()));
});


// Handle the theme toggle
const userPrefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
if (userPrefersDark) {
  setTheme("dark");
} else {
  setTheme("light");
}

const themeToggleBtn = document.getElementById("theme-toggle-btn");
themeToggleBtn.addEventListener("click", toggleTheme);

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("light-mode");
}

function setTheme(theme) {
  const body = document.body;
  if (theme === "dark") {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }
}


// Function to auto cap after ".!?"
function autoCapitalize(inputId) {
  var input = document.getElementById(inputId);
  var value = input.value;

  input.value = value.replace(/(?<=(?:^|[.?!])\s*)[a-z]/g, function (match) {
    return match.toUpperCase();
  });
}



document.addEventListener("DOMContentLoaded", function () {
  const boxes = document.querySelectorAll(".services-box");

  boxes.forEach(function (box) {
    const textElement = box.querySelector(".text");
    const readMoreBtn = box.querySelector(".read-more-btn");

    const fullText = textElement.innerText;
    const shortText =
      fullText.substring(0, 100) + (fullText.length > 100 ? "..." : "");

    textElement.innerText = shortText;

    if (fullText.length > 100) {
      readMoreBtn.addEventListener("click", function () {
        if (textElement.innerText === shortText) {
          textElement.innerText = fullText; 
          readMoreBtn.textContent = "Read less";
        } else {
          textElement.innerText = shortText;
          readMoreBtn.textContent = "Read more";
        }
      });
    } else {
      readMoreBtn.style.display = "none";
    }
  });
});



document.addEventListener("DOMContentLoaded", function () {
  const textElement = document.getElementById("text");
  const readMoreBtn = document.getElementById("read-more-btn");

  const fullText = textElement.innerHTML;
  const shortText =
    fullText.substring(0, 300) + (fullText.length > 300 ? "..." : "");

  textElement.innerHTML = shortText;

  if (fullText.length > 300) {
    readMoreBtn.addEventListener("click", function () {
      if (textElement.innerHTML === shortText) {
        textElement.innerHTML = fullText; 
        readMoreBtn.textContent = "Read less";
      } else {
        textElement.innerHTML = shortText; 
        readMoreBtn.textContent = "Read more";
      }
    });
  } else {
    readMoreBtn.style.display = "none"; 
  }
});
