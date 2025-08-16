let phrases = [];

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    phrases = data;
    if (!localStorage.getItem('bestTimes')) {
      localStorage.setItem('bestTimes', JSON.stringify(phrases));
    }
    updateMiniTable();
  });

const btnStart = document.getElementById("start");
const phraseEl = document.getElementById("phrase");
const squaresEl = document.getElementById("squares");
const input = document.getElementById("input");
const result = document.getElementById("result");
const miniTableEl = document.getElementById("mini-table");

let currentPhrase = "";
let startTime = 0;

btnStart.onclick = () => {
  const stored = JSON.parse(localStorage.getItem('bestTimes'));
  const randomIndex = Math.floor(Math.random() * stored.length);
  currentPhrase = stored[randomIndex].phrase;
  phraseEl.textContent = currentPhrase;
  squaresEl.innerHTML = "";
  input.value = "";
  input.disabled = false;
  input.focus();
  result.textContent = "";

  startTime = Date.now();

  for (let i = 0; i < currentPhrase.length; i++) {
    const div = document.createElement("div");
    div.classList.add("square");
    squaresEl.appendChild(div);
  }

  const regex = new RegExp(currentPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const match = stored.find(p => regex.test(p.phrase));
  if (match && match.bestTime) {
    result.textContent = `Melhor tempo desta frase: ${match.bestTime} segundos`;
  }

  updateMiniTable();
};

input.addEventListener("input", () => {
  const chars = input.value.split("");
  const squares = squaresEl.querySelectorAll(".square");

  squares.forEach((sq, i) => {
    if (!chars[i]) sq.className = "square";
    else if (chars[i] === currentPhrase[i]) sq.className = "square correct";
    else sq.className = "square wrong";
  });

  if (input.value === currentPhrase) {
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    const stored = JSON.parse(localStorage.getItem('bestTimes'));
    const regex = new RegExp(currentPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const index = stored.findIndex(p => regex.test(p.phrase));

    if (index !== -1) {
      if (!stored[index].bestTime || timeTaken < stored[index].bestTime) {
        stored[index].bestTime = timeTaken;
        localStorage.setItem('bestTimes', JSON.stringify(stored));
      }
    }

    result.textContent = `Você terminou em ${timeTaken} segundos. Melhor tempo: ${stored[index].bestTime} segundos.`;
    input.disabled = true;

    updateMiniTable();
  }
});

// Função para atualizar a mini tabela
function updateMiniTable() {
  const stored = JSON.parse(localStorage.getItem('bestTimes')) || phrases;
  miniTableEl.innerHTML = '';

  stored.forEach(p => {
    const div = document.createElement('div');
    const firstWords = p.phrase.split(' ').slice(0, 2).join(' '); // apenas primeiras 2 palavras
    div.innerHTML = `<span>${firstWords}…</span> <span>${p.bestTime ? `🏆 ${p.bestTime}s` : ''}</span>`;
    miniTableEl.appendChild(div);
  });
}
