# Sports Buddy 🏏 ⚽ 🏀

## 1. Project Overview 📌

**Sports Buddy** is a real-time, modular web application designed to bridge the gap between sports enthusiasts. By moving away from fragmented group chats to a structured **BaaS (Backend-as-a-Service)** model, this platform allows users to host, discover, and join sports matches in their local areas with real-time updates and role-based access.

## 2. Technologies Used 🛠️
* **Frontend:** HTML5, CSS3 (Glassmorphism UI), JavaScript (ES6 Modules)
* **Backend:** Google Firebase (Cloud Firestore)
* **Auth:** Firebase Authentication (Role-Based)
* **Design:** Custom Mesh Gradients & Backdrop-filters for high-performance visuals

## 4. System Architecture 🏗️
The project follows a **Three-Tier Architecture** optimized for scalability and speed.
* **Presentation Layer (Client):** A responsive Single Page Application (SPA) built with vanilla JS and modular CSS.
* **Service Layer (Firebase):** Handles real-time data streams, authentication triggers, and security rules.
* **Data Layer (Firestore):** A NoSQL database structured for fast retrieval and low latency.

## 5. System Modules & Workflow 🔄
**1. Authentication Module**
* Secure login/registration using Firebase Auth.
* Automatic redirection based on user roles (Admin vs. Standard User).

**2. Admin Module**
* **Category Management:** Add, update, or delete sports (e.g., Cricket, Football).
* **Location Management:** Control the geographical scope of the app by managing cities and specific local areas.

**3. User (Host) Module**
* **Event Creation:** Host matches with specific details like ability level and precise timing.
* **Dashboard:** View and manage personal "Scheduled Events."
* **Dynamic Filtering:** Location dropdowns that update in real-time based on the selected city.
