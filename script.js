// ==========================================================
// KANBAN BOARD - ULTRA MODERN WHITE THEME CONTROLLER
// ==========================================================

const todoCol = document.querySelector("#todo");
const progressCol = document.querySelector("#progress");
const doneCol = document.querySelector("#done");
const columns = [todoCol, progressCol, doneCol];

let dragElem = null;
let editingTaskId = null;

// Modal Elements
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal-bg");
const modalHeading = document.querySelector("#modal-heading");
const modalSubmitText = document.querySelector("#modal-submit-text");
const closeModalBtn = document.querySelector("#close-modal-btn");
const cancelModalBtn = document.querySelector("#cancel-modal-btn");
const toggleModalBtn = document.querySelector("#toggle-modal");
const resetBoardBtn = document.querySelector("#reset-board-btn");

// Form inputs
const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskDescInput = document.querySelector("#task-description");
const taskStatusSelect = document.querySelector("#task-status");
const taskColorSelect = document.querySelector("#task-color");
const taskAssigneeInput = document.querySelector("#task-assignee");
const taskDateInput = document.querySelector("#task-date");

// Color configurations matching the reference design
const COLOR_CONFIG = {
    purple: {
        bar: "bg-indigo-500",
        iconBg: "bg-indigo-50 text-indigo-600",
        avatarBg: "bg-indigo-100 text-indigo-700",
        defaultIcon: "document"
    },
    blue: {
        bar: "bg-sky-500",
        iconBg: "bg-sky-50 text-sky-600",
        avatarBg: "bg-sky-100 text-sky-700",
        defaultIcon: "search"
    },
    emerald: {
        bar: "bg-emerald-500",
        iconBg: "bg-emerald-50 text-emerald-600",
        avatarBg: "bg-emerald-100 text-emerald-700",
        defaultIcon: "user"
    },
    amber: {
        bar: "bg-amber-400",
        iconBg: "bg-amber-50 text-amber-600",
        avatarBg: "bg-amber-100 text-amber-700",
        defaultIcon: "pen"
    },
    rose: {
        bar: "bg-rose-500",
        iconBg: "bg-rose-50 text-rose-600",
        avatarBg: "bg-rose-100 text-rose-700",
        defaultIcon: "code"
    }
};

// SVG Icon Generator
function getIconSvg(iconName) {
    switch (iconName) {
        case "search":
            return `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`;
        case "user":
            return `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`;
        case "pen":
            return `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>`;
        case "code":
            return `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`;
        case "folder":
            return `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>`;
        case "layout":
            return `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>`;
        case "check-circle":
            return `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
        case "document":
        default:
            return `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`;
    }
}

// Reference mock data matching the user's reference image exactly
const DEFAULT_TASKS = {
    todo: [
        {
            id: "task-1",
            taskTitle: "Design landing page",
            taskDescription: "Create a clean and modern landing page for the website.",
            color: "purple",
            assignee: "AK",
            date: "May 20",
            icon: "document"
        },
        {
            id: "task-2",
            taskTitle: "Research competitors",
            taskDescription: "Analyze top 5 competitors and note key takeaways.",
            color: "blue",
            assignee: "SP",
            date: "May 21",
            icon: "search"
        },
        {
            id: "task-3",
            taskTitle: "Write project brief",
            taskDescription: "Define the scope, goals, and deliverables.",
            color: "emerald",
            assignee: "MJ",
            date: "May 22",
            icon: "user"
        }
    ],
    progress: [
        {
            id: "task-4",
            taskTitle: "Build homepage",
            taskDescription: "Develop the homepage according to the design.",
            color: "amber",
            assignee: "RS",
            date: "May 23",
            icon: "pen"
        },
        {
            id: "task-5",
            taskTitle: "Implement features",
            taskDescription: "Add core features and functionality to the site.",
            color: "rose",
            assignee: "TD",
            date: "May 24",
            icon: "code"
        }
    ],
    done: [
        {
            id: "task-6",
            taskTitle: "Project kick-off",
            taskDescription: "Initial meeting with the team and stakeholders.",
            color: "emerald",
            assignee: "AK",
            date: "May 10",
            icon: "check-circle"
        },
        {
            id: "task-7",
            taskTitle: "Collect requirements",
            taskDescription: "Gather and document all project requirements.",
            color: "emerald",
            assignee: "SP",
            date: "May 12",
            icon: "folder"
        },
        {
            id: "task-8",
            taskTitle: "Create wireframes",
            taskDescription: "Design low-fidelity wireframes for key pages.",
            color: "emerald",
            assignee: "MJ",
            date: "May 14",
            icon: "layout"
        }
    ]
};

// ==========================================================
// 1. CREATE TASK CARD COMPONENT
// ==========================================================
function createTaskElement(task) {
    const div = document.createElement("div");
    div.classList.add("task-card", "group", "relative", "p-4", "flex", "flex-col", "gap-3");
    div.setAttribute("draggable", "true");
    div.dataset.id = task.id || ("task-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4));
    div.dataset.color = task.color || "purple";
    div.dataset.assignee = task.assignee || "AK";
    div.dataset.date = task.date || "Today";
    div.dataset.icon = task.icon || "document";

    renderCardContent(div, task);

    // Drag start listener
    div.addEventListener("dragstart", (e) => {
        dragElem = div;
        div.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", div.dataset.id);
    });

    // Drag end listener
    div.addEventListener("dragend", () => {
        div.classList.remove("dragging");
        dragElem = null;
        removeDropIndicator();
        columns.forEach(col => col.classList.remove("hover-over"));
    });

    return div;
}

// Render or Update Card HTML
function renderCardContent(cardDiv, task) {
    const colorKey = task.color || cardDiv.dataset.color || "purple";
    const colorCfg = COLOR_CONFIG[colorKey] || COLOR_CONFIG.purple;
    const isDone = cardDiv.closest("#done") !== null;
    const iconType = task.icon || (isDone ? "check-circle" : (colorCfg.defaultIcon || "document"));

    cardDiv.innerHTML = `
        <!-- Left 3D Accent Pill -->
        <div class="absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${colorCfg.bar} transition-colors"></div>

        <!-- Top Row: Icon + Title/Desc + Actions / Checkmark -->
        <div class="flex items-start gap-3 pl-1.5">
            <!-- Icon Container -->
            <div class="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${colorCfg.iconBg} transition-colors">
                ${getIconSvg(iconType)}
            </div>

            <!-- Title & Description -->
            <div class="flex-1 min-w-0 pr-1">
                <h4 class="text-sm font-bold text-slate-800 leading-snug break-words">${task.taskTitle}</h4>
                <p class="text-xs text-slate-500 font-normal mt-1 leading-relaxed break-words">${task.taskDescription || ''}</p>
            </div>

            <!-- Right Controls: Done badge + Edit / Delete buttons -->
            <div class="flex items-center gap-1 flex-shrink-0">
                ${isDone ? `
                    <span class="done-check-badge w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm" title="Completed">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                ` : ''}

                <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" draggable="false" class="edit-btn p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Edit task">
                        <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button type="button" draggable="false" class="delete-btn p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Delete task">
                        <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Bottom Row: Assignee Avatar + Calendar Date -->
        <div class="flex items-center justify-between pt-2.5 border-t border-slate-100/80 pl-1.5 mt-0.5 select-none">
            <!-- User Avatar -->
            <div class="w-6 h-6 rounded-full ${colorCfg.avatarBg} flex items-center justify-center text-[10px] font-bold tracking-tight">
                ${task.assignee || 'AK'}
            </div>

            <!-- Due Date -->
            <div class="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>${task.date || 'Today'}</span>
            </div>
        </div>
    `;
}

// ==========================================================
// 2. SAVE STATE & UPDATE COUNTS
// ==========================================================
function saveTasksAndCounts() {
    const tasksData = {};

    columns.forEach(col => {
        if (!col) return;
        const tasksContainer = col.querySelector(".tasks-container");
        const cards = tasksContainer.querySelectorAll(".task-card");
        const badge = col.querySelector(".count-badge");

        tasksData[col.id] = Array.from(cards).map(card => {
            return {
                id: card.dataset.id,
                taskTitle: card.querySelector("h4").innerText,
                taskDescription: card.querySelector("p").innerText,
                color: card.dataset.color || "purple",
                assignee: card.dataset.assignee || "AK",
                date: card.dataset.date || "Today",
                icon: card.dataset.icon || "document"
            };
        });

        if (badge) {
            badge.innerText = cards.length;
        }
    });

    localStorage.setItem("kanban_tasks_v2", JSON.stringify(tasksData));
}

// ==========================================================
// 3. LOAD TASKS ON STARTUP
// ==========================================================
function loadTasks() {
    let savedData = null;
    const stored = localStorage.getItem("kanban_tasks_v2");
    
    if (stored) {
        try {
            savedData = JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse saved tasks", e);
        }
    }

    // Fallback: migrate from v1 if present
    if (!savedData && localStorage.getItem("task")) {
        try {
            const v1Data = JSON.parse(localStorage.getItem("task"));
            savedData = {};
            for (const col in v1Data) {
                savedData[col] = v1Data[col].map((item, i) => ({
                    id: "task-migrated-" + i + "-" + Date.now(),
                    taskTitle: item.taskTitle,
                    taskDescription: item.taskDescription,
                    color: ["purple", "blue", "emerald", "amber", "rose"][i % 5],
                    assignee: "AK",
                    date: "May 20",
                    icon: "document"
                }));
            }
        } catch (e) {}
    }

    // Default to the reference image tasks if fresh
    const dataToLoad = savedData || DEFAULT_TASKS;

    columns.forEach(col => {
        if (!col) return;
        const container = col.querySelector(".tasks-container");
        container.innerHTML = "";

        const taskList = dataToLoad[col.id] || [];
        taskList.forEach(taskObj => {
            const card = createTaskElement(taskObj);
            container.appendChild(card);
        });
    });

    saveTasksAndCounts();
}

// ==========================================================
// 4. PRECISION DRAG & DROP WITH ANIMATED DROP INDICATOR LINE
// ==========================================================
function getOrCreateDropIndicator() {
    let indicator = document.getElementById("drop-indicator");
    if (!indicator) {
        indicator = document.createElement("div");
        indicator.id = "drop-indicator";
        indicator.className = "drop-indicator-line";
    }
    return indicator;
}

function removeDropIndicator() {
    const indicator = document.getElementById("drop-indicator");
    if (indicator) {
        indicator.remove();
    }
}

// Calculates element after which the card should be inserted
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

function initDragAndDrop() {
    columns.forEach(column => {
        const container = column.querySelector(".tasks-container");

        column.addEventListener("dragover", (e) => {
            e.preventDefault();
            column.classList.add("hover-over");

            if (!dragElem) return;

            const afterElement = getDragAfterElement(container, e.clientY);
            const indicator = getOrCreateDropIndicator();

            if (afterElement == null) {
                container.appendChild(indicator);
            } else {
                container.insertBefore(indicator, afterElement);
            }
        });

        column.addEventListener("dragleave", (e) => {
            // Only remove highlight if actually leaving column bounds
            const rect = column.getBoundingClientRect();
            if (e.clientX < rect.left || e.clientX >= rect.right || e.clientY < rect.top || e.clientY >= rect.bottom) {
                column.classList.remove("hover-over");
            }
        });

        column.addEventListener("drop", (e) => {
            e.preventDefault();
            column.classList.remove("hover-over");

            if (dragElem) {
                const indicator = document.getElementById("drop-indicator");
                if (indicator && indicator.parentNode === container) {
                    container.insertBefore(dragElem, indicator);
                } else {
                    container.appendChild(dragElem);
                }

                removeDropIndicator();

                // If task dropped in 'done' column or moved out, refresh card state
                const taskObj = {
                    id: dragElem.dataset.id,
                    taskTitle: dragElem.querySelector("h4").innerText,
                    taskDescription: dragElem.querySelector("p").innerText,
                    color: dragElem.dataset.color,
                    assignee: dragElem.dataset.assignee,
                    date: dragElem.dataset.date,
                    icon: dragElem.dataset.icon
                };
                renderCardContent(dragElem, taskObj);

                saveTasksAndCounts();
            }
        });
    });
}

// ==========================================================
// 5. MODAL LOGIC (ADD & EDIT)
// ==========================================================
function openAddModal(targetStatus = "todo") {
    editingTaskId = null;
    modalHeading.innerText = "Add New Task";
    modalSubmitText.innerText = "Add Task";
    taskForm.reset();
    taskStatusSelect.value = targetStatus;
    taskColorSelect.value = targetStatus === "done" ? "emerald" : (targetStatus === "progress" ? "amber" : "purple");
    taskAssigneeInput.value = "AK";
    taskDateInput.value = "May 25";
    
    modal.classList.add("active");
    taskTitleInput.focus();
}

function openEditModal(card) {
    editingTaskId = card.dataset.id;
    const parentColumn = card.closest(".task-column");

    modalHeading.innerText = "Edit Task";
    modalSubmitText.innerText = "Update Task";

    taskTitleInput.value = card.querySelector("h4").innerText;
    taskDescInput.value = card.querySelector("p").innerText;
    taskStatusSelect.value = parentColumn ? parentColumn.id : "todo";
    taskColorSelect.value = card.dataset.color || "purple";
    taskAssigneeInput.value = card.dataset.assignee || "AK";
    taskDateInput.value = card.dataset.date || "Today";

    modal.classList.add("active");
    taskTitleInput.focus();
}

function closeModal() {
    modal.classList.remove("active");
    editingTaskId = null;
    taskForm.reset();
}

// ==========================================================
// 6. EVENT LISTENERS
// ==========================================================

// Global Nav Add Button
toggleModalBtn.addEventListener("click", () => openAddModal("todo"));

// Column-level "+ Add task" Buttons
document.querySelectorAll(".column-add-task-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const status = btn.getAttribute("data-status") || "todo";
        openAddModal(status);
    });
});

// Modal Close Triggers
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);
modalBg.addEventListener("click", closeModal);

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
    }
});

// Reset Demo Data Button
resetBoardBtn.addEventListener("click", () => {
    if (confirm("Reset Kanban board to reference sample tasks?")) {
        localStorage.removeItem("kanban_tasks_v2");
        localStorage.removeItem("task");
        loadTasks();
    }
});

// Form Submit (Add or Edit)
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    const desc = taskDescInput.value.trim();
    const targetStatus = taskStatusSelect.value || "todo";
    const color = taskColorSelect.value || "purple";
    const assignee = (taskAssigneeInput.value.trim() || "AK").toUpperCase();
    const date = taskDateInput.value.trim() || "May 25";

    if (!title) {
        alert("Please enter a task title!");
        taskTitleInput.focus();
        return;
    }

    if (editingTaskId) {
        // Find existing card
        const existingCard = document.querySelector(`[data-id="${editingTaskId}"]`);
        if (existingCard) {
            existingCard.dataset.color = color;
            existingCard.dataset.assignee = assignee;
            existingCard.dataset.date = date;

            const updatedData = {
                id: editingTaskId,
                taskTitle: title,
                taskDescription: desc,
                color: color,
                assignee: assignee,
                date: date
            };

            const currentColumn = existingCard.closest(".task-column");
            const targetColumn = document.querySelector(`#${targetStatus}`);

            // Move to new column if status changed
            if (currentColumn && targetColumn && currentColumn.id !== targetStatus) {
                targetColumn.querySelector(".tasks-container").appendChild(existingCard);
            }

            renderCardContent(existingCard, updatedData);
        }
    } else {
        // Add new card
        const newCardData = {
            id: "task-" + Date.now(),
            taskTitle: title,
            taskDescription: desc,
            color: color,
            assignee: assignee,
            date: date,
            icon: COLOR_CONFIG[color]?.defaultIcon || "document"
        };

        const newCard = createTaskElement(newCardData);
        const targetCol = document.querySelector(`#${targetStatus}`) || todoCol;
        targetCol.querySelector(".tasks-container").appendChild(newCard);
    }

    saveTasksAndCounts();
    closeModal();
});

// Delegated click for Edit and Delete buttons on cards
document.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-btn");
    if (editBtn) {
        const card = editBtn.closest(".task-card");
        if (card) openEditModal(card);
        return;
    }

    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
        const card = deleteBtn.closest(".task-card");
        if (card) {
            card.style.transform = "scale(0.9) translateY(10px)";
            card.style.opacity = "0";
            setTimeout(() => {
                card.remove();
                saveTasksAndCounts();
            }, 200);
        }
        return;
    }
});

// ==========================================================
// 7. INITIALIZE ON LOAD
// ==========================================================
loadTasks();
initDragAndDrop();
