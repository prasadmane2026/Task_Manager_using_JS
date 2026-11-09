# 🚀 TaskFlow — Modern 3D Kanban Board & SaaS Landing Page

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3_3D_Transforms-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Storage](https://img.shields.io/badge/LocalStorage-Offline_First-success?style=for-the-badge)

<p align="center">
  <b>A tactile, high-performance task management application featuring an isometric 3D card stacking landing page, fluid mouse follower animation, precision drag-and-drop with glowing indicator lines, and complete local persistence.</b>
</p>

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Technical Architecture](#-technical-architecture)

</div>

---

## 📸 Overview

**TaskFlow** combines modern SaaS visual design principles with an interactive project workflow. It delivers a full-featured Kanban workspace paired with a high-end 3D landing page inspired by modern developer-first platforms like Linear, Stripe, and Notion.

---

## ✨ Key Features

### 🌟 1. Modern SaaS Landing Page (`index.html`)
- **Isometric 3D Card Stack**: A 3D perspective stage (`perspective: 1300px`) featuring tilted task cards.
- **Sequential Entrance Stacking Animation**: Cards fly in from distinct 3D angles one after the other and snap into an overlapping stack.
- **Continuous 3D Floating Motion**: The entire card deck gently breathes and floats in 3D space (`floatStackMotion`).
- **Interactive Exploded View on Hover**: Hovering over the card stack causes the layers to separate in 3D depth (`translateZ`), allowing users to inspect all cards underneath.
- **Fluid Custom Mouse Follower**: A trailing glowing circular follower powered by linear interpolation (LERP) physics with dynamic expansion on hoverable elements.
- **Replay Animation Trigger**: A dedicated replay button to re-trigger the fly-in stacking sequence anytime.

### 📋 2. Interactive Kanban Workspace (`board.html`)
- **Minimalist White Theme**: Clean off-white canvas (`#f6f8fa`) with high-contrast slate cards and crisp rounded columns.
- **3-Stage Workflow Columns**:
  - 📋 **To Do** (Indigo pill icon + live task count badge)
  - ⚡ **In Progress** (Amber activity pulse icon + live task count badge)
  - ✓ **Done** (Emerald checkmark icon + live task count badge)
- **Precision Drag & Drop with Glowing Indicator**:
  - Dynamically calculates closest card position based on cursor Y coordinate (`getDragAfterElement`).
  - Renders a luminous glowing drop indicator line (`linear-gradient(90deg, #6366f1, #38bdf8, #10b981)`) right between cards before dropping.
  - Cards snap exactly into the indicated position.
- **Full In-Place Task Editing**:
  - Edit button smoothly fades in on card hover.
  - Pre-populates title, description, column, color theme, assignee initials, and due date.
  - Updates cards in-place and immediately syncs changes.
- **Task Deletion & Undo Notification**:
  - Animated card removal with scale and opacity transitions.
- **LocalStorage Data Persistence**:
  - Instant offline sync. Every task creation, edit, drag reordering, and deletion is automatically saved in `localStorage`.
- **Reset Demo Data**:
  - 1-click restore button in the navbar to reload initial sample cards at any time.

---

## 🛠️ Tech Stack

- **Frontend Core**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (CDN) + Custom 3D Keyframe Animations
- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Google Fonts)
- **Icons**: Custom inline SVGs (zero external dependencies, 100% offline-ready)
- **Storage**: Browser `localStorage` API

---

## 📁 Project Structure

```text
task_manager_kanban_board/
├── index.html        # Landing page with 3D isometric stacking cards & mouse follower
├── board.html        # Full-featured Kanban task manager workspace
├── landing.html      # Redirect alias pointing to index.html
├── script.js         # Kanban logic, drag-and-drop, localStorage sync, edit/delete modal
├── style.css         # 3D transforms, card depth, glowing drop line animations, scrollbars
└── README.md         # Comprehensive project documentation
```

---

## 🚀 Getting Started

No build tools, npm packages, or bundlers required! The project runs natively in any modern web browser.

### Option 1: Live Server / Direct Browser
1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/TaskFlow-Kanban-Board.git
   cd TaskFlow-Kanban-Board
   ```
2. Double-click `index.html` or open it with VS Code's **Live Server** extension.

### Option 2: Local Python Server
```bash
# Navigate to the project directory
cd task_manager_kanban_board

# Start a local HTTP server
python -m http.server 8000

# Open in browser:
# http://localhost:8000
```

---

## 🧠 Technical Highlights

### 1. 3D Isometric Transform Pipeline
The card cluster utilizes CSS 3D hardware acceleration:
```css
.stage-3d {
    perspective: 1300px;
    transform-style: preserve-3d;
}
.card-stack {
    transform: rotateX(15deg) rotateY(-18deg) rotateZ(4deg);
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 2. Fluid LERP Cursor Follower
The trailing circular div follows the mouse using linear interpolation for inertia:
```javascript
function renderFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;

    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    requestAnimationFrame(renderFollower);
}
```

### 3. Dynamic Drop Indicator Line Calculation
Calculates the closest vertical card boundary while dragging:
```javascript
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).
