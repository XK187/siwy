// ============================
// Glitch text (titlu)
// ============================
const glitchText = document.getElementById('glitch-text');
const originalText = glitchText.textContent;
const specialChars = "!@#$%^&*()_+-=[]{}|;:',.<>/?~";

// Împachetăm fiecare literă într-un <span>
function wrapLetters() {
  const wrappedText = originalText.split('').map(char => {
    if (char === ' ') return ' ';
    return `<span class="glitch-letter" data-original="${char}">${char}</span>`;
  }).join('');
  glitchText.innerHTML = wrappedText;
}
wrapLetters();

function getRandomSpecialChar() {
  return specialChars.charAt(Math.floor(Math.random() * specialChars.length));
}

// Clonare colorată (roșu + albastru) pentru efect glitch
function createColorClone(letter, offsetX, color) {
  const clone = letter.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.transform = `translate(${offsetX}px, 0)`;
  clone.style.color = color;
  clone.style.opacity = '0.8';
  clone.style.pointerEvents = 'none';
  letter.appendChild(clone);

  gsap.to(clone, {
    duration: 0.5,
    opacity: 0,
    ease: "power2.out",
    onComplete: () => {
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
    }
  });
}

// Creează acele "fantome" colorate pe fiecare literă
function createColorGhosts() {
  const letters = document.querySelectorAll('.glitch-letter');
  letters.forEach(letter => {
    const clonesCount = 3; // numărul de clone per culoare pentru un efect mai intens
    for (let i = 0; i < clonesCount; i++) {
      // Generăm un offset aleatoriu pentru roșu (stânga)
      const offsetLeft = -Math.floor(Math.random() * 10 + 5); // între -5 și -14
      createColorClone(letter, offsetLeft, 'white');
      
      // Generăm un offset aleatoriu pentru albastru (dreapta)
      const offsetRight = Math.floor(Math.random() * 10 + 5); // între 5 și 14
      createColorClone(letter, offsetRight, 'white');
    }
  });
}


let glitchActive = false;
function triggerGlitch() {
  if (glitchActive) return;
  glitchActive = true;

  createColorGhosts();
  const letters = document.querySelectorAll('.glitch-letter');
  const iterations = 15;         // Mai multe iterații pentru un glitch mai "brutal"
  const glitchDuration = 0.05;
  const tl = gsap.timeline({
    onComplete: () => {
      letters.forEach(letter => {
        letter.textContent = letter.dataset.original;
        gsap.set(letter, { x: 0, rotation: 0, filter: "blur(0px)" });
      });
      glitchActive = false;
    }
  });

  for (let i = 0; i < iterations; i++) {
    tl.call(() => {
      letters.forEach(letter => {
        // 50% din litere devin caractere speciale random
        if (Math.random() < 0.5) {
          letter.textContent = getRandomSpecialChar();
          let offsetX = Math.random() * 30 - 15;    // Mai mare pentru un efect mai agresiv
          let rotation = Math.random() * 20 - 10;   // Un unghi mai mare
          let blur = Math.random() * 4;             // Blur mai puternic
          gsap.set(letter, { x: offsetX, rotation: rotation, filter: `blur(${blur}px)` });
        } else {
          letter.textContent = letter.dataset.original;
          gsap.set(letter, { x: 0, rotation: 0, filter: "blur(0px)" });
        }
      });
    }, null, i * glitchDuration);
  }
}

// Glitch automat la fiecare 2 secunde (mai des, deci mai agresiv)
setInterval(triggerGlitch, 2000);

// Glitch la hover (maxim o dată la 1s)
let hoverTimeout;
glitchText.addEventListener('mousemove', () => {
  if (hoverTimeout) return;
  triggerGlitch();
  hoverTimeout = setTimeout(() => {
    hoverTimeout = null;
  }, 1000);
});

// ============================
// Sistem simplu de login
// ============================
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');
  const successMessage = document.getElementById('success-message');

  // Resetăm mesajele anterioare
  errorMessage.textContent = '';
  errorMessage.classList.remove('show');
  successMessage.textContent = '';
  successMessage.classList.remove('show');

  // Exemplu demo: "admin" / "admin"
  if (usernameInput.value === 'admin' && passwordInput.value === 'admin') {
    successMessage.textContent = 'ACCESS GRANTED';
    successMessage.style.visibility = 'visible';
    successMessage.style.opacity = '1';
    successMessage.classList.add('show');

    gsap.fromTo(successMessage, { opacity: 0, scale: 0.8 }, { duration: 0.5, opacity: 1, scale: 1 });

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  } else {
    // Parola greșită => resetăm câmpul
    passwordInput.value = '';

    errorMessage.textContent = 'ACCESS DENIED';
    errorMessage.style.visibility = 'visible';
    errorMessage.style.opacity = '1';
    errorMessage.classList.add('show');

    gsap.fromTo(errorMessage, { opacity: 0, scale: 1.2 }, { duration: 0.3, opacity: 1, scale: 1 });
  }
});
