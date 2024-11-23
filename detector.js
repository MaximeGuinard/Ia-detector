// Fonction utilitaire pour calculer la similarité entre deux textes
function calculateSimilarity(text1, text2) {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    const intersection = Array.from(words1).filter(x => words2.has(x));
    const union = Array.from(new Set([...Array.from(words1), ...Array.from(words2)]));
    return (intersection.length / union.length) * 100;
}

function analyzeText(text) {
    const indicators = [];
    let score = 0;
    const stats = {};

    // Analyse de base
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    
    stats.uniqueWords = uniqueWords.size;
    stats.avgWordLength = words.join('').length / words.length;
    stats.lexicalDiversity = uniqueWords.size / words.length;
    
    if (stats.avgWordLength > 6) {
        score += 15;
        indicators.push("Longueur moyenne des mots élevée");
    }

    // Répétitions de structures
    const sentences = text.split(/[.!?]+/);
    const patterns = {};
    sentences.forEach(sentence => {
        const pattern = sentence.trim().split(' ').slice(0, 3).join(' ');
        patterns[pattern] = (patterns[pattern] || 0) + 1;
    });
    
    const repetitions = Object.values(patterns).filter(count => count > 2).length;
    if (repetitions > 0) {
        score += 20;
        indicators.push("Structures de phrases répétitives détectées");
    }

    // Variété du vocabulaire
    if (stats.lexicalDiversity < 0.4) {
        score += 25;
        indicators.push("Vocabulaire limité ou répétitif");
    }

    // Marqueurs linguistiques communs de l'IA
    const aiMarkers = [
        "dans cet article nous",
        "cet article nous allons",
        "article nous allons explorer",
        "comme mentionné précédemment",
        "il est important de noter",
        "il est important de",
        "en d'autres termes",
        "il est possible de",
        "il convient de",
        "il est essentiel de",
        "tout d'abord",
        "premièrement",
        "deuxièmement",
        "en premier lieu",
        "en second lieu",
        "d'une part",
        "d'autre part",
        "c'est-à-dire",
        "en effet",
        "par exemple",
        "notamment",
        "en particulier",
        "en conclusion",
        "pour conclure",
        "pour résumer",
        "en résumé",
        "en définitive",
        "dont vous avez besoin",
        "afin que vous puissiez",
        "fois que vous avez",
        "que ce soit pour",
        "les différents types de",
        "dans le cadre de",
        "il est à noter que",
        "dans le contexte de",
        "en ce qui concerne",
        "à cet égard"
    ];
    
    const markerCount = aiMarkers.filter(marker => 
        text.toLowerCase().includes(marker.toLowerCase())
    ).length;

    stats.aiMarkers = markerCount;
    
    if (markerCount > 1) {
        score += 20;
        indicators.push("Présence de marqueurs linguistiques typiques de l'IA");
    }

    // Limiter le score à 100%
    score = Math.min(score, 100);

    return {
        score: Math.round(score),
        indicators: indicators.length ? indicators : ["Aucun indicateur significatif détecté"],
        stats
    };
}

function compareTexts(text1, text2) {
    const analysis1 = analyzeText(text1);
    const analysis2 = analyzeText(text2);
    const similarity = calculateSimilarity(text1, text2);

    return {
        text1: analysis1,
        text2: analysis2,
        similarity
    };
}