# student-portal-website-
for the searching course 

# Learnly — Course Learning Platform

A responsive course browsing and student dashboard project built with **HTML5, CSS3, JavaScript, JSON, and LocalStorage**.

## Features

- Dynamically load course data from `courses.json`.
- Search by course title, category, instructor, description, or topic.
- Filter by category and difficulty level.
- View course details and learning topics.
- Enroll in courses.
- Student dashboard with enrolled courses.
- Track progress in 10% steps.
- Complete courses or remove enrollments.
- Save enrollment and progress using browser LocalStorage.
- Responsive layout for desktop, tablet, and mobile.

## Project Structure

```text
course-learning-platform/
├── index.html
├── style.css
├── script.js
├── courses.json
└── README.md
```

## Technologies Used

- HTML5
- CSS3
- JavaScript
- JSON
- LocalStorage
- Git
- GitHub

## How to Run

1. Download or clone this repository.
2. Open the folder in VS Code.
3. Install the Live Server extension.
4. Right-click `index.html`.
5. Select **Open with Live Server**.

**Important:** The application fetches course information from `courses.json`. Therefore, run it through Live Server instead of opening the HTML file directly.

## LocalStorage

Enrollment and progress are stored using this key:

```javascript
learnly_learning_data
```

To clear saved data, run this in the browser console:

```javascript
localStorage.removeItem("learnly_learning_data");
```

Then refresh the page.

## Project Scope

This is a front-end project. It does not include backend services, authentication, or server-side database syncing.

## Author

Developed as a front-end web development project.
