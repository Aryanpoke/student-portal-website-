
const KEY = "learnly_learning_data";

let courses = [];
let toastTimer;

const $ = id => document.getElementById(id);

// Read LocalStorage
const readData = () => {
    try {
        return JSON.parse(localStorage.getItem(KEY)) || {
            enrolled: {}
        };
    } catch {
        return { enrolled: {} };
    }
};

// Save LocalStorage
const saveData = data => {
    localStorage.setItem(KEY, JSON.stringify(data));
};

// Prevent unsafe HTML output
const safe = value =>
    String(value).replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));

// Category symbols
const symbol = category => ({
    "Web Development": "</>",
    "Programming": "{ }",
    "Design": "✳",
    "Data Science": "▥",
    "Tools": "⌘"
}[category] || "✦");


// INITIALIZE APPLICATION
async function init() {

    try {

        const response = await fetch("courses.json");

        if (!response.ok) {
            throw new Error("Course data could not be loaded");
        }

        courses = await response.json();

        $("courseCount").textContent =
            String(courses.length).padStart(2, "0");

        // Generate category options
        [...new Set(courses.map(c => c.category))]
            .forEach(category => {

                const option = document.createElement("option");

                option.value = category;
                option.textContent = category;

                $("categoryFilter").appendChild(option);
            });

        renderCourses();
        renderDashboard();

    } catch (error) {

        $("courseGrid").innerHTML = `
            <p class="loading">
                Could not load courses.json.
                Please start the project with VS Code Live Server.
            </p>
        `;

        console.error(error);
    }
}


// SEARCH AND FILTER
function filteredCourses() {

    const term = $("searchInput").value.trim().toLowerCase();

    const category = $("categoryFilter").value;
    const level = $("levelFilter").value;

    return courses.filter(c => {

        const content = [
            c.title,
            c.category,
            c.description,
            c.instructor,
            ...c.topics
        ].join(" ").toLowerCase();

        return (
            (!term || content.includes(term)) &&
            (category === "all" || c.category === category) &&
            (level === "all" || c.level === level)
        );

    });
}


// DISPLAY COURSES
function renderCourses() {

    const list = filteredCourses();

    $("visibleCount").textContent = list.length;

    $("emptyState").classList.toggle(
        "hidden",
        list.length !== 0
    );

    $("courseGrid").innerHTML = list.map(c => `

        <article class="course-card">

            <div class="art ${safe(c.color)}">

                <span class="symbol">
                    ${symbol(c.category)}
                </span>

                <small>
                    ${safe(c.level.toUpperCase())} PATH
                </small>

            </div>

            <div class="card-body">

                <div class="meta">

                    <span class="pill">
                        ${safe(c.category)}
                    </span>

                    <span class="rating">
                        ★ ${Number(c.rating).toFixed(1)}
                    </span>

                </div>

                <h3>${safe(c.title)}</h3>

                <p class="desc">
                    ${safe(c.description)}
                </p>

                <div class="facts">
                    <span>◷ ${safe(c.duration)}</span>
                    <span>▤ ${c.lessons} lessons</span>
                    <span>Free</span>
                </div>

                <div class="card-footer">

                    <span class="teacher">
                        INSTRUCTOR
                        <b>${safe(c.instructor)}</b>
                    </span>

                    <button
                        class="details"
                        data-view="${c.id}"
                    >
                        View details ↗
                    </button>

                </div>

            </div>

        </article>

    `).join("");

}


// COURSE DETAILS
function openDetails(id) {

    const c = courses.find(
        item => item.id === Number(id)
    );

    if (!c) return;

    const enrolled = Boolean(readData().enrolled[c.id]);

    $("modalContent").innerHTML = `

        <span class="pill">
            ${safe(c.category)}
        </span>

        <h2 id="modalTitle">
            ${safe(c.title)}
        </h2>

        <p>
            ${safe(c.description)}
        </p>

        <div class="modal-facts">

            <span>◷ ${safe(c.duration)}</span>
            <span>▤ ${c.lessons} lessons</span>
            <span>★ ${c.rating}</span>
            <span>${safe(c.level)}</span>

        </div>

        <h3>What you'll learn</h3>

        <ul>
            ${c.topics.map(t => `<li>${safe(t)}</li>`).join("")}
        </ul>

        <p style="margin-top:12px">
            Instructor:
            <strong>${safe(c.instructor)}</strong>
        </p>

        <button
            class="enroll"
            id="enrollButton"
            data-enroll="${c.id}"
            ${enrolled ? "disabled" : ""}
        >
            ${enrolled
                ? "Already enrolled ✓"
                : "Enroll in this course →"}
        </button>

    `;

    $("enrollButton").style.opacity =
        enrolled ? ".6" : "1";

    $("courseModal").classList.remove("hidden");

}


// ENROLL IN COURSE
function enroll(id) {

    const data = readData();

    if (data.enrolled[id]) return;

    data.enrolled[id] = {
        progress: 0,
        enrolledAt: new Date().toISOString()
    };

    saveData(data);

    renderDashboard();

    $("courseModal").classList.add("hidden");

    showToast(
        "You're enrolled! Your learning journey starts now."
    );

}


// STUDENT DASHBOARD
function renderDashboard() {

    const enrolled = readData().enrolled;

    const ids = Object.keys(enrolled);

    $("enrolledCount").textContent = ids.length;

    if (!ids.length) {

        $("dashboardList").innerHTML = `
            <p class="dashboard-empty">
                You haven't enrolled in a course yet.
                Explore the courses above to get started.
            </p>
        `;

        return;
    }

    $("dashboardList").innerHTML = ids.map(id => {

        const c = courses.find(
            item => item.id === Number(id)
        );

        if (!c) return "";

        const progress = Math.max(
            0,
            Math.min(
                100,
                Number(enrolled[id].progress) || 0
            )
        );

        return `

            <article class="dashboard-item">

                <div>

                    <h3>${safe(c.title)}</h3>

                    <p>
                        ${safe(c.category)}
                        · ${c.lessons} lessons
                        · ${progress === 100
                            ? "Completed"
                            : "Keep learning at your pace"}
                    </p>

                </div>

                <div class="progress-area">

                    <div class="track">
                        <div
                            class="fill"
                            style="width:${progress}%"
                        ></div>
                    </div>

                    <span class="percent">
                        ${progress}%
                    </span>

                </div>

                <div class="actions">

                    <button
                        data-change="${c.id}"
                        data-step="-10"
                        ${progress === 0 ? "disabled" : ""}
                    >
                        − 10%
                    </button>

                    <button
                        data-change="${c.id}"
                        data-step="10"
                        ${progress === 100 ? "disabled" : ""}
                    >
                        + 10% progress
                    </button>

                    <button data-remove="${c.id}">
                        Remove course
                    </button>

                </div>

            </article>

        `;

    }).join("");

}


// CHANGE COURSE PROGRESS
function changeProgress(id, step) {

    const data = readData();

    if (!data.enrolled[id]) return;

    data.enrolled[id].progress = Math.max(
        0,
        Math.min(
            100,
            (Number(data.enrolled[id].progress) || 0) +
            Number(step)
        )
    );

    saveData(data);

    renderDashboard();

    if (data.enrolled[id].progress === 100) {
        showToast("Course completed — great work!");
    }

}


// REMOVE COURSE
function removeCourse(id) {

    const data = readData();

    delete data.enrolled[id];

    saveData(data);

    renderDashboard();

    showToast("Course removed from your dashboard.");

}


// TOAST NOTIFICATION
function showToast(message) {

    $("toast").textContent = message;

    $("toast").classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        $("toast").classList.remove("show");
    }, 2500);

}


// EVENT LISTENERS

$("searchInput").addEventListener(
    "input",
    renderCourses
);

$("categoryFilter").addEventListener(
    "change",
    renderCourses
);

$("levelFilter").addEventListener(
    "change",
    renderCourses
);


// Course details button
$("courseGrid").addEventListener("click", e => {

    const button = e.target.closest("[data-view]");

    if (button) {
        openDetails(button.dataset.view);
    }

});


// Enrollment button
$("modalContent").addEventListener("click", e => {

    const button = e.target.closest("[data-enroll]");

    if (button) {
        enroll(button.dataset.enroll);
    }

});


// Dashboard buttons
$("dashboardList").addEventListener("click", e => {

    const change = e.target.closest("[data-change]");

    const remove = e.target.closest("[data-remove]");

    if (change) {
        changeProgress(
            change.dataset.change,
            change.dataset.step
        );
    }

    if (remove) {
        removeCourse(remove.dataset.remove);
    }

});


// Close modal
$("modalClose").addEventListener("click", () => {
    $("courseModal").classList.add("hidden");
});

$("courseModal").addEventListener("click", e => {

    if (e.target === $("courseModal")) {
        $("courseModal").classList.add("hidden");
    }

});

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {
        $("courseModal").classList.add("hidden");
    }

});


// START APPLICATION
init();
