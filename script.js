document.addEventListener("DOMContentLoaded", () => {
    new TeamGenerator();
});

class TeamGenerator {
    constructor() {
        this.currentCount = 4;
        this.MAX_NAME_LENGTH = 20;
        this.nameFields = document.getElementById('nameFields');
        this.addBtn = document.getElementById('addBtn');
        this.generateBtn = document.getElementById('generateBtn');
        this.newEntryBtn = document.getElementById('newEntryBtn');
        this.resultContainer = document.getElementById('result');
        this.loadingBar = document.getElementById('loadingBar');
        this.fillLoremBtn = document.getElementById('fillLoremBtn');
        this.footerText = document.getElementById('footerText');

        this.init();
    }

    init() {
        this.setupTyped();
        this.changeBackgroundImage();
        this.addEventListeners();
        this.adjustFontSize();
        window.addEventListener('resize', this.adjustFontSize.bind(this));
        this.fillLoremBtn.addEventListener('click', this.fillLoremIpsum.bind(this));
        this.footerText.addEventListener('click', this.fillLoremIpsum.bind(this));
    }

    setupTyped() {
        const options = {
            strings: ["Team Generator", "Teamauswahl", "Erstelle dein Team jetzt!"],
            typeSpeed: 90,
            backSpeed: 30,
            loop: false,
            cursorChar: '|',
            showCursor: true
        };
        new Typed("#typed-output", options);
    }

    generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    generateGradientBackground() {
        const color1 = this.generateRandomColor();
        const color2 = this.generateRandomColor();
        const color3 = this.generateRandomColor();
        const angle1 = Math.floor(Math.random() * 360);
        const angle2 = Math.floor(Math.random() * 360);
        return `linear-gradient(${angle1}deg, ${color1}, ${color2}), linear-gradient(${angle2}deg, ${color2}, ${color3})`;
    }

    changeBackgroundImage() {
        document.body.style.backgroundImage = this.generateGradientBackground();
    }

    addEventListeners() {
        this.addBtn.addEventListener('click', this.addFields.bind(this));
        this.generateBtn.addEventListener('click', this.generateTeams.bind(this));
        this.newEntryBtn.addEventListener('click', this.resetForm.bind(this));
    }

    addFields() {
        if (this.currentCount < 10) {
            for (let i = 0; i < 2; i++) {
                this.currentCount++;
                const input = document.createElement('input');
                input.type = 'text';
                input.id = 'name' + this.currentCount;
                input.placeholder = 'Name ' + this.currentCount;
                input.required = true;
                input.maxLength = this.MAX_NAME_LENGTH;
                input.addEventListener('focus', this.handleInputFocus);
                input.addEventListener('blur', this.handleInputBlur);
                this.nameFields.appendChild(input);
            }
            if (this.currentCount >= 10) {
                this.addBtn.style.display = 'none';
            }

            this.addBtn.classList.add('pulse-animation');
            setTimeout(() => {
                this.addBtn.classList.remove('pulse-animation');
            }, 500);

            const newInputs = this.nameFields.querySelectorAll('input:nth-last-child(-n+2)');
            newInputs.forEach(input => {
                input.style.animation = 'slideInFromRight 0.5s ease-out';
            });
        }
    }

    handleInputFocus(event) {
        event.target.style.borderColor = 'var(--primary-color)';
        event.target.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.1)';
        event.target.style.background = 'rgba(255, 255, 255, 0.12)';
    }

    handleInputBlur(event) {
        event.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        event.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.1)';
        event.target.style.background = 'rgba(255, 255, 255, 0.08)';
    }

    generateTeams() {
        try {
            const names = [];
            for (let i = 1; i <= this.currentCount; i++) {
                const nameInput = document.getElementById('name' + i);
                if (nameInput && this.validateInput(nameInput.value)) {
                    names.push(nameInput.value.trim());
                }
            }

            if (names.length < 4) {
                alert('Bitte gib mindestens 4 gültige Namen ein.');
                return;
            }

            this.loadingBar.classList.remove('hidden');
            let width = 0;
            const loadingInterval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(loadingInterval);
                    this.loadingBar.classList.add('hidden');
                    this.displayTeams(names);
                    this.nameFields.style.opacity = '0';
                    setTimeout(() => {
                        this.nameFields.style.display = 'none';
                    }, 500);
                } else {
                    width++;
                    this.loadingBar.style.width = width + '%';
                }
            }, 40);
        } catch (error) {
            console.error('Fehler beim Generieren der Teams:', error);
            alert('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
        }
    }

    resetForm() {
        document.getElementById('teamForm').reset();
        this.resultContainer.innerHTML = '';
        this.currentCount = 4;
        this.nameFields.innerHTML = `
            <input type="text" id="name1" placeholder="Name 1" required>
            <input type="text" id="name2" placeholder="Name 2" required>
            <input type="text" id="name3" placeholder="Name 3" required>
            <input type="text" id="name4" placeholder="Name 4" required>
        `;
        this.addBtn.style.display = 'inline-block';
        this.newEntryBtn.classList.remove('show');
        this.changeBackgroundImage();
        this.nameFields.style.display = 'flex';
        setTimeout(() => {
            this.nameFields.style.opacity = '1';
        }, 10);

        // Re-add event listeners for new input fields
        const inputs = this.nameFields.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', this.handleInputFocus);
            input.addEventListener('blur', this.handleInputBlur);
        });
    }

    validateInput(input) {
        return input.trim().length > 0 &&
               input.trim().length <= this.MAX_NAME_LENGTH &&
               /^[a-zA-Z0-9\s]+$/.test(input);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    triggerConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            duration: 1000
        });
    }

    displayTeams(names) {
        this.shuffleArray(names);
        const teams = [];
        for (let i = 0; i < names.length; i += 2) {
            if (i + 1 < names.length) {
                teams.push([names[i], names[i + 1]]);
            } else {
                teams.push([names[i]]);
            }
        }

        this.resultContainer.innerHTML = '';

        this.triggerConfetti();

        setTimeout(() => {
            const teamColors = ['team-red', 'team-green', 'team-blue', 'team-yellow', 'team-purple'];
            teams.forEach((team, i) => {
                const colorClass = teamColors[i % teamColors.length];
                const teamContainer = document.createElement('div');
                teamContainer.className = 'team-container';
                teamContainer.style.opacity = '0';

                const teamItem = document.createElement('div');
                teamItem.className = `${colorClass} team-item`;
                teamItem.innerHTML = '<span></span>';

                teamContainer.appendChild(teamItem);
                this.resultContainer.appendChild(teamContainer);

                teamContainer.addEventListener('mouseover', function() {
                    this.classList.add('revealed');
                }, { once: true });

                teamContainer.addEventListener('mousemove', function(e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;

                    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(50px)`;
                    this.style.boxShadow = `
                        ${rotateY / 2}px ${rotateX / 2}px 24px rgba(0, 0, 0, 0.2),
                        ${rotateY}px ${rotateX}px 40px rgba(0, 0, 0, 0.15)
                    `;
                });

                teamContainer.addEventListener('mouseleave', function() {
                    this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(50px)';
                    this.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2), 0 16px 40px rgba(0, 0, 0, 0.15)';
                });

                gsap.to(teamContainer, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: i * 0.3, // Verzögerung für jede Animation
                    ease: "power2.out",
                    from: { y: 20 }
                });

                let teamText = team.length === 2 ? `${team[0]} & ${team[1]}` : team[0];
                gsap.to(teamItem.querySelector('span'), {
                    duration: 1.2,
                    text: {
                        value: teamText,
                        delimiter: ""
                    },
                    ease: "power1.inOut",
                    delay: i * 0.3 + 0.3 // Verzögerung für den Text
                });
            });

            this.newEntryBtn.classList.add('show');
        }, 1000);
    }

    fillLoremIpsum() {
        const loremWords = ["Lorem", "Ipsum", "Dolor", "Sit", "Amet", "Consectetur", "Adipiscing", "Elit", "Sed", "Do"];
        const inputs = this.nameFields.querySelectorAll('input[type="text"]');
        inputs.forEach((input, index) => {
            input.value = loremWords[index % loremWords.length];
        });
    }

    adjustFontSize() {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        document.documentElement.style.setProperty('--typed-font-size', `${Math.max(1.5, Math.min(2.5, vw / 30))}rem`);
        document.documentElement.style.setProperty('--input-font-size', `${Math.max(0.8, Math.min(1, vw / 50))}rem`);
        document.documentElement.style.setProperty('--button-font-size', `${Math.max(0.7, Math.min(0.9, vw / 55))}rem`);
    }
}