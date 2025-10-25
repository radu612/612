function saveQuestion() {
  const chapter = document.getElementById("chapter").value;
  const question = document.getElementById("question").value;
  const a = document.getElementById("a").value;
  const b = document.getElementById("b").value;
  const c = document.getElementById("c").value;
  const d = document.getElementById("d").value;
  const correct = document.getElementById("correct").value.toLowerCase();

  if (!chapter || !question || !a || !b || !c || !d || !correct) {
    alert("Completează toate câmpurile!");
    return;
  }

  const newQuestion = { chapter, question, a, b, c, d, correct };

  let questions = JSON.parse(localStorage.getItem("questions")) || [];
  questions.push(newQuestion);
  localStorage.setItem("questions", JSON.stringify(questions));

  alert("Întrebare salvată!");
  showQuestions();
}

function showQuestions() {
  let questions = JSON.parse(localStorage.getItem("questions")) || [];
  const list = document.getElementById("questionList");
  list.innerHTML = "";

  questions.forEach((q, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. [${q.chapter}] ${q.question}`;
    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", showQuestions);
// --- Functii pentru creare test ---

function getUniqueChapters() {
  const questions = JSON.parse(localStorage.getItem("questions")) || [];
  const chapters = [...new Set(questions.map(q => q.chapter))];
  return chapters;
}

function populateChapterSelect() {
  const select = document.getElementById("chapterSelect");
  if (!select) return; // dacă suntem pe altă pagină

  const chapters = getUniqueChapters();
  select.innerHTML = "";

  chapters.forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = ch;
    select.appendChild(opt);
  });
}

function loadQuestions() {
  const selectedChapter = document.getElementById("chapterSelect").value;
  const questions = JSON.parse(localStorage.getItem("questions")) || [];
  const filtered = questions.filter(q => q.chapter === selectedChapter);
  const container = document.getElementById("questionsContainer");

  container.innerHTML = `<h3>Întrebări din ${selectedChapter}</h3>`;

  filtered.forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <input type="checkbox" id="q${i}" value="${i}">
      ${q.question}
    `;
    container.appendChild(div);
  });
}

function saveTest() {
  const selectedChapter = document.getElementById("chapterSelect").value;
  const allQuestions = JSON.parse(localStorage.getItem("questions")) || [];
  const filtered = allQuestions.filter(q => q.chapter === selectedChapter);

  const selected = [];
  const checkboxes = document.querySelectorAll("#questionsContainer input[type='checkbox']");
  checkboxes.forEach((box, i) => {
    if (box.checked) selected.push(filtered[i]);
  });

  if (selected.length === 0) {
    alert("Selectează cel puțin o întrebare!");
    return;
  }

  localStorage.setItem("currentTest", JSON.stringify(selected));
  alert("Testul a fost salvat! Poți merge să-l rezolvi.");
}

document.addEventListener("DOMContentLoaded", populateChapterSelect);
// --- Functii pentru rezolvare test ---

function loadQuiz() {
  const test = JSON.parse(localStorage.getItem("currentTest")) || [];
  const container = document.getElementById("quizContainer");
  if (!container) return;

  if (test.length === 0) {
    container.innerHTML = "<p>Nu există niciun test salvat. Creează unul mai întâi.</p>";
    return;
  }

  test.forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${i + 1}. ${q.question}</h3>
      <label><input type="radio" name="q${i}" value="a"> A. ${q.a}</label><br>
      <label><input type="radio" name="q${i}" value="b"> B. ${q.b}</label><br>
      <label><input type="radio" name="q${i}" value="c"> C. ${q.c}</label><br>
      <label><input type="radio" name="q${i}" value="d"> D. ${q.d}</label><br><br>
    `;
    container.appendChild(div);
  });
}

function submitQuiz() {
  const test = JSON.parse(localStorage.getItem("currentTest")) || [];
  let score = 0;
  let feedback = "";

  test.forEach((q, i) => {
    const radios = document.getElementsByName(`q${i}`);
    let selected = "";
    for (const r of radios) {
      if (r.checked) selected = r.value;
    }

    if (selected === q.correct) {
      score++;
      feedback += `<p><b>${i + 1}.</b> Corect ✅</p>`;
    } else {
      feedback += `<p><b>${i + 1}.</b> Greșit ❌ — Răspuns corect: <b>${q.correct.toUpperCase()}</b></p>`;
    }
  });

  const result = document.getElementById("resultContainer");
  const total = test.length;
  const percent = Math.round((score / total) * 100);

  result.innerHTML = `
    <h2>Rezultatul tău:</h2>
    <p>Ai ${score} răspunsuri corecte din ${total} (${percent}%)</p>
    <hr>
    ${feedback}
  `;
}

document.addEventListener("DOMContentLoaded", loadQuiz);
