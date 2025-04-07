document.addEventListener("DOMContentLoaded", () => {
    const words = 'i love india india is my motherland and its a secular country all indians anre my brothers and sisters '.split(' '),
          wordsCount = words.length;
    const gameTime = 60; // Game duration in seconds
    window.timer = null;
    window.gameStart = null;
    window.remainingTime = gameTime;
    let typedCharacters = 0; // Counter for typed characters

    const addClass = (el, name) => el?.classList.add(name),
          removeClass = (el, name) => el?.classList.remove(name),
          randomWord = () => words[Math.floor(Math.random() * wordsCount)],
          formatWord = word => `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;

    function newGame() {
        const wordsContainer = document.getElementById('words');
        const infoContainer = document.getElementById('info');

        if (!wordsContainer || !infoContainer) {
            console.error("Required elements not found! Check your HTML.");
            return;
        }

        wordsContainer.innerHTML = '';
        infoContainer.innerHTML = gameTime; // Display starting time

        for (let i = 0; i < 200; i++) {
            wordsContainer.innerHTML += formatWord(randomWord());
        }

        addClass(document.querySelector('.word'), 'active');
        document.querySelector('.letter')?.classList.add('current');

        window.timer = null;
        window.remainingTime = gameTime; 
        typedCharacters = 0; // Reset character count
    }

    const gameElement = document.getElementById('game');

    if (gameElement) {
        gameElement.addEventListener('keyup', ev => {
            const key = ev.key, 
                  currentLetter = document.querySelector('.letter.current'),
                  currentWord = currentLetter?.closest('.word');

            if (!currentLetter) return;

            const expected = currentLetter.innerHTML, 
                  isLetter = key.length === 1 && key !== ' ',
                  isBackspace = key === 'Backspace',
                  isFirstLetter = currentLetter === currentWord?.firstElementChild;

            if (!window.timer) {
                window.timer = setInterval(() => {
                    if (window.remainingTime > 0) {
                        window.remainingTime -= 1;
                        document.getElementById('info').innerHTML = window.remainingTime;
                    } 
                    
                    if (window.remainingTime <= 0) {
                        clearInterval(window.timer);
                        calculateWPM(); // Calculate Words Per Minute when time is up
                        alert("Time's up! Game Over.");
                    }
                }, 1000);
            }

            if (isLetter) {
                typedCharacters++; // Count typed characters

                if (key === expected) {
                    addClass(currentLetter, 'correct');
                    removeClass(currentLetter, 'incorrect');
                } else {
                    addClass(currentLetter, 'incorrect');
                    removeClass(currentLetter, 'correct');
                }

                removeClass(currentLetter, 'current');

                const nextLetter = currentLetter.nextElementSibling 
                                || currentWord?.nextElementSibling?.querySelector('.letter');

                addClass(nextLetter, 'current');
            }

            if (isBackspace) {
                if (typedCharacters > 0) typedCharacters--; // Adjust count on backspace

                if (currentLetter && isFirstLetter && currentWord?.previousElementSibling) {
                    removeClass(currentWord, 'current');
                    addClass(currentWord.previousElementSibling, 'current');

                    const prevWord = currentWord.previousElementSibling;
                    const lastLetter = prevWord?.lastElementChild;

                    removeClass(currentLetter, 'current');
                    addClass(lastLetter, 'current');

                    removeClass(lastLetter, 'incorrect');
                    removeClass(lastLetter, 'correct');
                } else {
                    const prevLetter = currentLetter.previousElementSibling;
                    if (prevLetter) {
                        removeClass(currentLetter, 'current');
                        addClass(prevLetter, 'current');
                        removeClass(prevLetter, 'incorrect');
                        removeClass(prevLetter, 'correct');
                    }
                }
            }

            if (currentWord?.getBoundingClientRect().top > 250) {
                const words = document.getElementById('words');
                if (words) {
                    const margin = parseInt(words.style.marginTop || '0px');
                    words.style.marginTop = (margin - 35) + 'px';
                }
            }

            const nextLetter = document.querySelector('.letter.current'),
                  nextWord = document.querySelector('.word.current'),
                  cursor = document.getElementById('cursor');

            if (cursor) {
                const rect = (nextLetter || nextWord)?.getBoundingClientRect();
                if (rect) {
                    cursor.style.top = rect.top + 2 + 'px';
                    cursor.style.left = rect.left + 'px';
                }
            }
        });
    } else {
        console.error("Element with ID 'game' not found! Ensure it exists in the HTML.");
    }

    function calculateWPM() {
        const wordsTyped = typedCharacters / 5; // Assuming an average word length of 5 characters
        const wpm = Math.round(wordsTyped / (gameTime / 60)); // Words per minute calculation
        const infoElement = document.getElementById('info');

        if (infoElement) {
            infoElement.innerHTML = `WPM: ${wpm}`; // Display WPM after game ends
        }
        
        console.log(`Words Per Minute: ${wpm}`);
    }

    newGame(); // Start the game
});
