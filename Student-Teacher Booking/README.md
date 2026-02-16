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
