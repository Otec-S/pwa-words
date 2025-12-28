import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./src/data/cards2.json', 'utf8'));

const allWords = [];
const allMovies = [];
const cardIds = [];
const wordOccurrences = {};
const movieOccurrences = {};

data.cards.forEach(card => {
  cardIds.push(card.id);
  
  card.groups.forEach(group => {
    group.words.forEach(word => {
      if (word) {
        allWords.push({ word, cardId: card.id });
        wordOccurrences[word] = wordOccurrences[word] || [];
        wordOccurrences[word].push(card.id);
        
        // Отдельная проверка для фильмов (группа с points: 5)
        if (group.points === 5) {
          allMovies.push({ movie: word, cardId: card.id });
          movieOccurrences[word] = movieOccurrences[word] || [];
          movieOccurrences[word].push(card.id);
        }
      }
    });
  });
});

console.log('=== ПРОВЕРКА ДУБЛИКАТОВ ===\n');

// Проверка ID карточек
const duplicateIds = cardIds.filter((id, index) => cardIds.indexOf(id) !== index);
if (duplicateIds.length > 0) {
  console.log('❌ ДУБЛИКАТЫ ID КАРТОЧЕК:');
  console.log(duplicateIds);
} else {
  console.log('✅ ID карточек уникальны');
}

// Проверка дубликатов слов
console.log('\n=== ДУБЛИКАТЫ СЛОВ ===');
const duplicateWords = Object.entries(wordOccurrences).filter(([word, cards]) => cards.length > 1);
if (duplicateWords.length > 0) {
  console.log(`❌ Найдено ${duplicateWords.length} дублирующихся слов:\n`);
  duplicateWords.forEach(([word, cards]) => {
    console.log(`"${word}" - встречается в карточках: ${cards.join(', ')}`);
  });
} else {
  console.log('✅ Все слова уникальны');
}

// Проверка дубликатов фильмов
console.log('\n=== ДУБЛИКАТЫ ФИЛЬМОВ ===');
const duplicateMovies = Object.entries(movieOccurrences).filter(([movie, cards]) => cards.length > 1);
if (duplicateMovies.length > 0) {
  console.log(`❌ Найдено ${duplicateMovies.length} дублирующихся фильмов:\n`);
  duplicateMovies.forEach(([movie, cards]) => {
    console.log(`"${movie}" - встречается в карточках: ${cards.join(', ')}`);
  });
} else {
  console.log('✅ Все фильмы уникальны');
}

// Статистика
console.log('\n=== СТАТИСТИКА ===');
console.log(`Всего карточек: ${data.cards.length}`);
console.log(`Всего уникальных слов: ${Object.keys(wordOccurrences).length}`);
console.log(`Всего слов (с повторениями): ${allWords.length}`);
console.log(`Всего фильмов: ${allMovies.length}`);
