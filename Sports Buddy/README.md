# Sports Buddy 🏏 ⚽ 🏀

## 1. Project Overview 📌

**Sports Buddy** is a real-time, modular web application designed to bridge the gap between sports enthusiasts. By moving away from fragmented group chats to a structured **BaaS (Backend-as-a-Service)** model, this platform allows users to host, discover, and join sports matches in their local areas with real-time updates and role-based access.

## 2. Technologies Used 🛠️
* **Frontend:** HTML5, CSS3 (Glassmorphism UI), JavaScript (ES6 Modules)
* **Backend:** Google Firebase (Cloud Firestore)
* **Auth:** Firebase Authentication (Role-Based)
* **Design:** Custom Mesh Gradients & Backdrop-filters for high-performance visuals

## 3. Low-Level Design (LLD) & Data Models 📐



## 4. System Architecture 🏗️
The project follows a **Three-Tier Architecture** optimized for scalability and speed.
* **Presentation Layer (Client):** A responsive Single Page Application (SPA) built with vanilla JS and modular CSS.
* **Service Layer (Firebase):** Handles real-time data streams, authentication triggers, and security rules.
* **Data Layer (Firestore):** A NoSQL database structured for fast retrieval and low latency.

## 5. System Modules & Workflow 🔄
1. **Authentication Module**
   * Secure login/registration using Firebase Auth.
   * Automatic redirection based on user roles (Admin vs. Standard User).
2. **Admin Module**
   * **Category Management:** Add, update, or delete sports (e.g., Cricket, Football).
   * **Location Management:** Control the geographical scope of the app by managing cities and specific local areas.
3. **User (Host) Module**
   * **Event Creation:** Host matches with specific details like ability level and precise timing.
   * **Dashboard:** View and manage personal "Scheduled Events."
   * **Dynamic Filtering:** Location dropdowns that update in real-time based on the selected city.

## 6. Execution Instuctions 🚀
1. **Repository**: Clone the public repo: git clone https://github.com/AbhiGit70161/My-Projects.....git
2. **Configuration**: Insert the Firebase SDK in fb-con.js.
3. **Run**: Open Login.html using a local server (e.g., VS Code Live Server).
4. **Credentials**: Open Sports Buddy.xlsx using any spread sheet app (e.g., MS Excel, Google Sheets etc.) for using credentials.

## 7. Optimisation Strategies ⚡
* **Code Level**: Implemented **Real-time Snapshots** (onSnapshot) ensuring users see new matches instantly without refreshing the page.
* **Architecture Level**: Used **Asynchronous JS** (Async/Await) to prevent UI blocking during database writes.
* **UI Level**: Utilized **CSS Glassmorphism** and hardware-accelerated animations for a premium look without the weight of heavy image assets.

## 8. Test Cases 🧪

| **ID** | **Feature** | **Test Description** | **Expected Result** |
| :--- | :--- | :--- | :--- |
| TC01 | Auth | Login with invalid credentials | System shows error, no redirect |
| TC02 | Filter | Select "Kolkata" in City dropdown | Area dropdown populates only Kolkata areas |
| TC03 | Host | Create match without Event Name | Alert pops up: "Fill all fields" |
| TC04 | Admin	| Delete a Sport Category |	Category disappears from User Host form instantly |
| TC05 | User | Click "Delete" on owned event | Event is removed from Firestore and UI |
