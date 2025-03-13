// Book data
const books = [
  {
    id: 1,
    title: "1 Сұрақ",
    color: "book-1",
    question: "Ұлықбек Есдәулет кім?",
    answer: "Ұлықбек Есдаулет - қазақтың ақыны, журналист.",
  },
  {
    id: 2,
    title: "2 Сұрақ",
    color: "book-2",
    question: "Ол қай жерде, қашан дүниеге келген?",
    answer:
      "Ол 1954 жылы 29 сәуірде Шығыс Қазақстан облысы Зайсан ауданында дүниеге келген.",
  },
  {
    id: 3,
    title: "3 Сұрақ",
    color: "book-3",
    question: "Ұлықбек Есдәулет еңбек жолын қай жерде бастаған?",
    answer:
      "Ұлықбек Есдаулет еңбек жолын 1971жылы облыстық “Коммунизм туы” газетінде бастаған.",
  },
  {
    id: 4,
    title: "4 Сұрақ",
    color: "book-4",
    question: "Ол қандай университетті бітірген?",
    answer:
      "Ол 1977 жылы Қазақ Мемлекеттік университетінің журналистика факультетін бітірген.",
  },
  {
    id: 5,
    title: "5 Сұрақ",
    color: "book-5",
    question: "Ұлықбек Есдәулет қай жерлерде жұмыс істеген?",
    answer:
      "Ол “Қазақстан пионері” газетінде, “Жазушы” баспасында қызмет істеген.",
  },
  {
    id: 6,
    title: "6 Сұрақ",
    color: "book-6",
    question: "Ол қашан Қазақстан жазушылар одағының төрағасы болып сайланды",
    answer:
      "Ол 2018 жылы Қазақстан Жазушылар Одағының төрағасы болып сайланды.",
  },
];

// DOM Elements
const bookshelf = document.getElementById("bookshelf");
const bookshelfBooks = document.querySelector(".bookshelf-books");
const bookTransition = document.getElementById("bookTransition");
const bookOverlay = document.getElementById("bookOverlay");
const openBook = document.querySelector(".open-book");
const bookTitle = document.getElementById("bookTitle");
const bookQuestion = document.getElementById("bookQuestion");
const bookAnswer = document.getElementById("bookAnswer");
const revealButton = document.getElementById("revealButton");
const closeButton = document.getElementById("closeButton");

// State
let selectedBook = null;
let animationState = "idle"; // idle, opening, open, closing

// Initialize books
function initializeBooks() {
  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.className = `book ${book.color}`;
    bookElement.setAttribute("data-id", book.id);

    const titleElement = document.createElement("div");
    titleElement.className = "book-title";
    titleElement.textContent = book.title;

    bookElement.appendChild(titleElement);
    bookshelfBooks.appendChild(bookElement);

    // Add click event
    bookElement.addEventListener("click", () => handleBookClick(book));
  });
}

// Handle book click
function handleBookClick(book) {
  selectedBook = book;
  animationState = "opening";

  // Get position of the clicked book
  const bookElement = document.querySelector(`.book[data-id="${book.id}"]`);
  const rect = bookElement.getBoundingClientRect();

  // Set up transition element
  bookTransition.className = `book-transition ${book.color}`;
  bookTransition.style.top = `${rect.top}px`;
  bookTransition.style.left = `${rect.left}px`;
  bookTransition.style.width = `${rect.width}px`;
  bookTransition.style.height = `${rect.height}px`;
  bookTransition.style.opacity = "1";
  bookTransition.style.transform = "rotateY(0deg)";

  // Add title to transition element
  bookTransition.innerHTML = `<div class="book-transition-title">${book.title}</div>`;

  // Fade out bookshelf
  bookshelf.classList.add("fade-out");

  // Start animation after a small delay
  setTimeout(() => {
    // Calculate center position
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const finalWidth = Math.min(800, viewportWidth * 0.8);
    const finalHeight = 500;
    const centerX = (viewportWidth - finalWidth) / 2;
    const centerY = (viewportHeight - finalHeight) / 2;

    // Animate to center
    bookTransition.style.top = `${centerY}px`;
    bookTransition.style.left = `${centerX}px`;
    bookTransition.style.width = `${finalWidth}px`;
    bookTransition.style.height = `${finalHeight}px`;
    bookTransition.style.transform = "rotateY(180deg)";

    // Show open book after transition completes
    setTimeout(() => {
      animationState = "open";

      // Set book content
      bookTitle.textContent = book.title;
      bookQuestion.textContent = book.question;
      bookAnswer.textContent = book.answer;

      // Reset answer state
      bookAnswer.classList.add("hidden");
      revealButton.classList.remove("hidden");

      // Show overlay and book
      bookOverlay.style.opacity = "1";
      bookOverlay.style.pointerEvents = "auto";

      // Animate book opening
      openBook.classList.add("book-opening", "book-visible");

      // Hide transition element
      bookTransition.style.opacity = "0";
    }, 1000);
  }, 50);
}

// Handle close button click
function handleCloseBook() {
  animationState = "closing";

  // Hide open book
  openBook.classList.remove("book-visible");
  bookOverlay.style.opacity = "0";
  bookOverlay.style.pointerEvents = "none";

  // Get position of the original book
  const bookElement = document.querySelector(
    `.book[data-id="${selectedBook.id}"]`
  );
  const rect = bookElement.getBoundingClientRect();

  // Show transition element again
  bookTransition.style.opacity = "1";
  bookTransition.style.transform = "rotateY(180deg)";

  // Start closing animation
  setTimeout(() => {
    // Animate back to original position
    bookTransition.style.top = `${rect.top}px`;
    bookTransition.style.left = `${rect.left}px`;
    bookTransition.style.width = `${rect.width}px`;
    bookTransition.style.height = `${rect.height}px`;
    bookTransition.style.transform = "rotateY(0deg)";

    // Show bookshelf after animation completes
    setTimeout(() => {
      animationState = "idle";
      bookshelf.classList.remove("fade-out");
      bookTransition.style.opacity = "0";
      openBook.classList.remove("book-opening");
      selectedBook = null;
    }, 1000);
  }, 300);
}

// Handle reveal button click
function handleRevealAnswer() {
  revealButton.classList.add("hidden");
  bookAnswer.classList.remove("hidden");
}

// Event listeners
revealButton.addEventListener("click", handleRevealAnswer);
closeButton.addEventListener("click", handleCloseBook);

// Initialize
document.addEventListener("DOMContentLoaded", initializeBooks);
