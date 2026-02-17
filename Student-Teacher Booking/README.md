# Student-Teacher Booking Appoinment 🗓️:-

## i. Project Overview 📌
The Student-Teacher Booking Appointment System is a modular web application designed to optimize the scheduling process in educational environments. By moving from traditional queueing to a digital BaaS (Backend-as-a-Service) model, this system reduces wait times and enhances communication between students and faculty.

## ii. Technologies Used 🛠️
* **Frontend**: HTML5, CSS3 (Glassmorphism), JavaScript (ES6 Modules)
* **Backend**: Google Firebase (Cloud Firestore)
* **Auth**: Firebase Authentication
* **Logging**: Custom JS Logging Library

## iii. Low-Level Design(LLD) & Data Models 📐

<img width="500" height="346" alt="Image" src="https://github.com/user-attachments/assets/fbfdc33f-c131-4819-a740-122311d2f5ad" />

## iv. System Architecture 🏗️
The project follows a **Three-Tier Architecture** optimised for scalability and speed.
* **Presentation Layer(Client)**: A responsive Single Page Application (SPA) built with vanilla JS and modular CSS.
* **Sevice Layer(Firebase)**: Handles authentication and real-time database listeners.
* **Data Layer(Firestore)**: A NoSQL database stuctured for fast retrieval and low latency.

<img width="330" height="381" alt="Image" src="https://github.com/user-attachments/assets/3797fd1e-eaa2-4b45-a381-2a59b786d852" />

## v. System Modules & Workflow 🔄️
1. **Authentication Module**
   * Users (Admins/Students/Teachers) can loggin by using their credentials.
   * Loggin fails if they put wrong credentials.
   * [User Login](Auth.html)
   * [Authentication Logic](auth.js)
   * [Rejistration](Rejister.html)
   * [Rejistration Logic](register.js)
2. **Admin Module**
   * Manage Teacher profiles (Add/Update/Delete)
   * Moderate Student registrations for security.
   * [Admin Control Panel](Admin.html)
   * [Admin Operations Logic](admin.js)
3. **Teacher Module**
   * Manage schedule availability.
   * Approve or Cancel pending student appointments.
   * View student messages and full appointment history.
   * [Teacher Panel](Teacher.html)
   * [Teacher Operations Logic](teacher.js)
4. **Student Module**
   * Real-time search for mentors by name or subject.
   * Book slots with specific purposes.
   * Direct messaging to faculty.
   * [Student Panel](Student.html)
   * [Student Operations Logic](student.js)
  
## vi. Execution Instuctions 🚀
1. **Repository**: Clone the public repo: git clone https://github.com/AbhiGit70161/My-Projects.....git
2. **Configuration**: Insert the Firebase SDK in fb-config.js.
3. **Run**: Open Auth.html using a local server (e.g., VS Code Live Server).

## vii. Optimisation Strategies ⚡
* **Code Level**: Implemented **Local Caching** for the teacher search. Instead of querying the
  database on every keystroke, the system fetches the list once and filters the array locally,
  reducing Firestore read costs by ~90%.
* **Architecture Level**: Used **Asynchronous JS** (Async/Await) to prevent UI blocking during
  operations.
* **UI Level**: CSS **Glassmorphism** and **Backdrop-filters** are used to create a modern
  interface without the heavy weight of external image assets.

## viii. Test Cases 🧪

| **ID** | **Feature** | **Test Description** | **Expected Result** |
| :--- | :--- | :--- | :--- |
| TC01 | Auth | Login with invalid credentials | System shows error, no redirect |
| TC02 | Sidebar | Click toggle button | Sidebar collapses, text labels hide |
| TC03 | Booking | Book without date/time | Alert pops up: "Fill all fields" |
| TC04 | Search	| Type teacher name in search |	Grid updates instantly via local filter |
| TC05 | Teacher | Cancel an appointment | Status changes to 'cancelled' in real-time |
