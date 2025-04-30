# EducationBox – A Smart Toolbox for Kindergarten Teachers 🎓

**EducationBox** is a full-stack web application designed specifically to support kindergarten teachers, with a special dedication to my sister, who is one herself.  
The platform simplifies daily tasks like managing materials, planning activities, tracking events, and collaborating with fellow teachers.

---

## ✨ Features

### 👩‍🏫 For Kindergarten Teachers (Client-side)

#### Personal Space  
Each teacher has their own profile where they can:
- Upload educational materials to Firebase Firestore.
- **Add descriptions** to uploaded materials to give context or usage tips.
- **Organize files using custom tags** – Easily add one or more tags to each file and search by tag later to quickly find what you need.
- Manage, view, and organize files — no need to save them locally!
- Choose to **share or unshare** any uploaded file with others.

#### Personal Calendar  
Track and manage:
- Activities  
- Important events  
- Birthdays  
- Holidays

#### To-Do List  
Add and manage daily tasks in a simple, intuitive checklist.

#### Shared Area  
Collaborate by sharing resources with other kindergarten teachers.

#### Forum  
- Ask questions, get answers, and exchange ideas with fellow educators.
- **Reply to answers** – threaded conversations like a regular forum.
- Receive **email notifications** when:
  - A question is submitted (confirmation).
  - Someone answers your question.
  - Someone replies to your comment.

#### Chatbot Assistant  
Chat with a smart assistant that suggests fun and educational activity ideas.

#### Authentication  
- **Register and log in with Google** via Firebase Authentication.  
- Auth state is managed with `AuthContext`, supporting protected routes.

#### Account Management  
- Users can delete their account (excluding content they posted in the forum).
- A **confirmation email** is sent upon account deletion.

#### Responsive Design  
The application is fully responsive and mobile-friendly.

---

## ⚙️ Server-side (Node.js, Express)

Built using a modular structure with:
- Controllers  
- Routes  
- Models  

MongoDB is used to:
- Store user data  
- Save forum questions and answers  
- Manage each user’s to-do list and calendar events  

RESTful API endpoints handle:
- User operations  
- Forum discussions  
- Calendar/task management  

---

## 🔐 Authentication
- Login is supported via **Google Sign-In**.

---

## ☁️ Storage

- **Firebase Firestore** – For uploading and storing educational materials and associated metadata (descriptions, tags, etc.).
- **Firebase Storage** – For storing the actual files (e.g., PDFs, WORDs) that are uploaded by the users.
- **MongoDB** – For storing application data such as user info, forum content, tasks, and events.

---

## 🧰 Tech Stack

- **Frontend**: React, Firebase, Context API  
- **Backend**: Node.js, Express.js, MongoDB, Mongoose  
- **Authentication**: Firebase Authentication (Google Sign-In)  
- **UI Styling**: Custom CSS  
- **Icons**: react-icons

---

## 🚀 Deployment

You can access the live application at [**https://educationbox.onrender.com/**](https://educationbox.onrender.com/)  
This project is deployed using **Render**, a cloud platform for hosting full-stack applications.  
Thanks to an external **cron job**, the server is pinged regularly to keep it awake and responsive at all times.

---

## 🧠 About This Project

This project was created as a personal challenge to improve my full-stack development skills while building something meaningful for the education community.  
I hope EducationBox makes the work of kindergarten teachers easier, more organized, and more collaborative. 💛
