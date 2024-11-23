// Fonction d'interprétation du score
function getScoreInterpretation(score) {
    if (score >= 80) {
        return `<div class="score-interpretation high">
            <p>Très forte probabilité de texte généré par IA</p>
            <p>Ce texte présente de nombreux marqueurs caractéristiques d'un contenu généré par intelligence artificielle.</p>
        </div>`;
    } else if (score >= 60) {
        return `<div class="score-interpretation medium">
            <p>Probabilité modérée de texte généré par IA</p>
            <p>Ce texte contient plusieurs éléments qui pourraient indiquer une génération par IA, mais n'est pas concluant.</p>
        </div>`;
    } else if (score >= 40) {
        return `<div class="score-interpretation low">
            <p>Faible probabilité de texte généré par IA</p>
            <p>Quelques marqueurs sont présents mais le texte semble majoritairement d'origine humaine.</p>
        </div>`;
    } else {
        return `<div class="score-interpretation very-low">
            <p>Très faible probabilité de texte généré par IA</p>
            <p>Ce texte présente les caractéristiques naturelles d'un texte écrit par un humain.</p>
        </div>`;
    }
}

// Gestion des onglets
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// Analyse simple
const analyzeBtn = document.querySelector('#analyzeBtn');
const textInput = document.querySelector('#textInput');
const result = document.querySelector('#result');
const wordCount = document.querySelector('#wordCount');
const charCount = document.querySelector('#charCount');

// Historique des analyses
let analysisHistory = JSON.parse(localStorage.getItem('analysisHistory') || '[]');

function updateHistory(analysis, text) {
    const entry = {
        date: new Date().toLocaleString(),
        text: text.substring(0, 100) + '...',
        score: analysis.score,
        indicators: analysis.indicators
    };
    analysisHistory.unshift(entry);
    if (analysisHistory.length > 10) analysisHistory.pop();
    localStorage.setItem('analysisHistory', JSON.stringify(analysisHistory));
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = analysisHistory.map(entry => `
        <div class="history-entry">
            <div class="history-header">
                <span class="history-date">${entry.date}</span>
                <span class="history-score">Score: ${entry.score}%</span>
            </div>
            <p class="history-text">${entry.text}</p>
            <div class="history-indicators">
                ${entry.indicators.map(i => `<span class="indicator-tag">${i}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Mise à jour des statistiques en temps réel
textInput.addEventListener('input', () => {
    const text = textInput.value;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    wordCount.textContent = `${words.length} mots`;
    charCount.textContent = `${text.length} caractères`;
});

// Fonction d'analyse
function analyze() {
    const text = textInput.value.trim();
    
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyser le texte';
    
    if (!text) {
        result.style.display = 'block';
        result.innerHTML = '<p class="warning">Veuillez entrer du texte à analyser</p>';
        return;
    }

    if (text.length < 50) {
        result.style.display = 'block';
        result.innerHTML = '<p class="warning">Le texte doit contenir au moins 50 caractères pour une analyse pertinente</p>';
        return;
    }

    const analysis = analyzeText(text);
    updateHistory(analysis, text);
    
    result.style.display = 'block';
    result.innerHTML = `
        <h3>Résultats de l'analyse</h3>
        <div class="score-box">
            <p>Probabilité IA: <strong>${analysis.score}%</strong></p>
            <div class="probability-bar">
                <div class="probability-fill" style="width: ${analysis.score}%"></div>
            </div>
        </div>
        ${getScoreInterpretation(analysis.score)}
        <div class="detailed-stats">
            <h4>Statistiques détaillées</h4>
            <ul>
                <li>Mots uniques: ${analysis.stats.uniqueWords}</li>
                <li>Longueur moyenne des mots: ${analysis.stats.avgWordLength.toFixed(2)} caractères</li>
                <li>Complexité lexicale: ${analysis.stats.lexicalDiversity.toFixed(2)}</li>
                <li>Marqueurs IA détectés: ${analysis.stats.aiMarkers}</li>
            </ul>
        </div>
        <ul class="indicators">
            ${analysis.indicators.map(i => `<li>${i}</li>`).join('')}
        </ul>
    `;
}

// Comparaison de textes
const compareBtn = document.querySelector('#compareBtn');
const text1Input = document.querySelector('#text1');
const text2Input = document.querySelector('#text2');
const compareResult = document.querySelector('#compareResult');

compareBtn.addEventListener('click', () => {
    const text1 = text1Input.value.trim();
    const text2 = text2Input.value.trim();

    if (!text1 || !text2) {
        compareResult.style.display = 'block';
        compareResult.innerHTML = '<p class="warning">Veuillez remplir les deux zones de texte</p>';
        return;
    }

    const comparison = compareTexts(text1, text2);
    
    compareResult.style.display = 'block';
    compareResult.innerHTML = `
        <h3>Résultats de la comparaison</h3>
        <div class="comparison-results">
            <div class="comparison-column">
                <h4>Texte 1</h4>
                <div class="score-box">
                    <p>Probabilité IA: <strong>${comparison.text1.score}%</strong></p>
                    <div class="probability-bar">
                        <div class="probability-fill" style="width: ${comparison.text1.score}%"></div>
                    </div>
                </div>
            </div>
            <div class="comparison-column">
                <h4>Texte 2</h4>
                <div class="score-box">
                    <p>Probabilité IA: <strong>${comparison.text2.score}%</strong></p>
                    <div class="probability-bar">
                        <div class="probability-fill" style="width: ${comparison.text2.score}%"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="similarity-score">
            <h4>Similarité entre les textes</h4>
            <p>Indice de similarité: <strong>${comparison.similarity.toFixed(2)}%</strong></p>
        </div>
    `;
});

// Gestionnaire d'événement pour le bouton d'analyse
analyzeBtn.addEventListener('click', () => {
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyse en cours...';
    setTimeout(analyze, 300);
});

// Initialisation
renderHistory();