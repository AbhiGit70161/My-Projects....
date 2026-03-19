# My-Projects....

## 1. Basic Calculator 📅:-
This project serves as an excellent starting point for beginners to understand core web development concepts, including:
* **HTML Structure:** The HTML defines the calculator's layout, including an input field (display screen) and various buttons for numbers (0-9), operators (+, -, *, /), and actions (like clear 'C' and equals '=').
* **CSS Styling:** CSS is used to create a user-friendly and visually appealing interface. This involves arranging the buttons in a grid format, setting colors, defining sizes, and ensuring the calculator is responsive across different devices.
* **JavaScript Functionality:** JavaScript is the core logic engine. It handles all user interactions, manages button clicks through event listeners, performs the necessary calculations, and updates the display screen dynamically with the results.

Note:-
I have used java script functions in the HTML file for Basic Calculator Project. Pleace check it.

## 2. Tic-Tac-Toe ⭕ ✖️:-
1. **Game Concept:** Tic Tac Toe is a simple two-player game played on a 3x3 grid. Players take turns marking a cell with their assigned symbol, "X" or "O", with the objective of being the first to get three marks in a horizontal, vertical, or diagonal row. If all nine cells are filled without a winner, the game ends in a draw.

2. **Technologies Used:** The project leverages the core front-end web development stack:-
   * HTML: Provides the necessary structure for the game board (typically a grid of nine clickable div elements or buttons), status displays, and control buttons (like a reset button).
   * CSS: Styles the game to make it visually appealing and responsive. This includes defining the grid layout, the appearance of the "X" and "O" markers, hover effects, and messages for game status (e.g., winner announcement or a tie message).
   * JavaScript: Implements the core game logic, handling user interactions through event listeners, managing player turns, checking for winning combinations or ties after each move, and dynamically updating the HTML and CSS as the game progresses.

3. **Learning Value:** This project is ideal for reinforcing core programming concepts like arrays (to represent the board state), functions, conditional statements, and DOM manipulation. It provides a practical, hands-on experience in creating a fully functional, interactive web application that runs directly in any web browser.

## 3. Recipe Book 🗒️✏️:-
1. **Core Components**
   * HTML: Defines the structural skeleton, including the input form, search bar, recipe display grid, and the hidden modal for viewing details.
   * CSS: Governs the visual layer. It uses the Box Model (padding, margin, border) for spacing and Grid/Flexbox for a responsive gallery layout. It also manages layer priority via z-index for the modal.
   * JavaScript: The functional engine that coordinates the CRUD (Create, Read, Update, Delete) lifecycle.

2. **Technical Mechanisms**
   * State Management: A JavaScript array of objects [{id, name, ingredients: [], steps: []}] serves as the single source of truth for the application.
   * Data Persistence: Employs localStorage to serialize the JavaScript array into a JSON string, ensuring data persists after browser refreshes.
   * DOM Manipulation: The script listens for user events (form submission, button clicks, search input) and dynamically reconstructs the innerHTML of the page sections.
   * Array Processing:
     * filter(): Used to execute search queries and remove recipes during deletion.
     * map(): Converts raw data arrays into HTML list items (li) for formatted display.

## 4. Virtual Pet Simulator 🐶:-
1. **Project Overview 🚀**
This simulator features a fully CSS-rendered Dog. Unlike basic simulators, this project uses a complex "State Machine" to transition the pet’s physical appearance based on its internal needs.

2. **Technologies Used 🛠️**
   * HTML5: Semantic structure for game layout and attribute tracking.
   * CSS3: Advanced positioning, @keyframes animations, and glassmorphism UI.
   * JavaScript (ES6): Logic engine for attribute decay, interaction handling, and DOM manipulation.

3. **Key Features ✨**
   * Dynamic Visual Assets: A multi-layered pet character featuring a head, body, ears, paws, and a wagging tail.
   * Intelligent State Transitions:-
     * Happy State: Triggered when happiness is > 80%. Dog perks up his ears, wags his tail faster, and sticks his tongue out.
     * Sad State: Triggered by low happiness or high hunger. Ears droop and the tail stops wagging.
     * Starving (Critical) State: Triggered when hunger hits 0%. Dog will physically cry with animated falling tears.
   * Sleep State: Goldie closes his eyes and becomes semi-transparent to indicate resting.
   * Real-Time Attribute Decay: Stats (Hunger, Happiness, Energy) decrease every 3 seconds, requiring constant user engagement.
   * Immersive UI: Features a "Frosted Glass" (Glassmorphism) interface set against a high-definition nature background.

4. **How to Interact 🎮**
   * Feed 🍖: Reduces hunger. If Goldie is "Starving" (crying), feeding him will stop the tears.
   * Play 🎾: Increases happiness but consumes energy. When playing, Goldie will perform a "Jump" animation.
   * Sleep 😴: Fully restores energy but causes a small increase in hunger. Goldie's eyes will close during this state.

## 5. Student-Teacher Booking Appoinment 🗓️:-
The Student-Teacher Booking Appointment System is a modular web application designed to optimize the scheduling process in educational environments. By moving from traditional queueing to a digital BaaS (Backend-as-a-Service) model, this system reduces wait times and enhances communication between students and faculty.

## 6. Sports Buddy 🏏⚽🏀:-

