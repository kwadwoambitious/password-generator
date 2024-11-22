class PasswordGenerator {
  constructor() {
    // Select DOM elements
    this.copyBtn = document.querySelector(".copy-btn");
    this.lengthValue = document.querySelector(".length-value");
    this.slider = document.querySelector(".slider");
    this.includeUppercase = document.querySelector(".include-uppercase");
    this.includeLowercase = document.querySelector(".include-lowercase");
    this.includeNumbers = document.querySelector(".include-numbers");
    this.includeSymbols = document.querySelector(".include-symbols");
    this.generateButton = document.querySelector(".generate-btn");
    this.passwordDisplay = document.querySelector(".password-output");
    this.copiedText = document.querySelector(".copy-text");
    this.strengthContainer = document.querySelector(".bars");

    // Define character sets
    this.UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    this.NUMBERS = "0123456789";
    this.SYMBOLS = "!@#$%^&*()_+[]{}|;:,.<>?/~`=-";

    // Add event listeners
    this.initEventListeners();
  }

  initEventListeners() {
    // Listen for button clicks and slider input
    this.generateButton.addEventListener("click", () => this.handleGenerate());
    this.copyBtn.addEventListener("click", () => this.handleCopy());
    this.slider.addEventListener("input", ({ target: { value } }) =>
      this.updateSlider(value)
    );
  }

  handleGenerate() {
    // Validate inputs before generating password
    if (this.lengthValue.textContent <= "0") {
      alert("Password length cannot be zero");
    } else if (
      !(
        this.includeUppercase.checked ||
        this.includeLowercase.checked ||
        this.includeNumbers.checked ||
        this.includeSymbols.checked
      )
    ) {
      alert("Select at least one checkbox");
    } else {
      // Generate and display password
      const password = this.generatePassword();
      this.passwordDisplay.value = password;
      this.passwordDisplay.style.color = "#e6e5ea";
      this.updatePasswordStrength(password);
    }
  }

  handleCopy() {
    // Copy generated password to clipboard
    const passwordToCopy = this.passwordDisplay.value;
    if (passwordToCopy) {
      navigator.clipboard
        .writeText(passwordToCopy)
        .then(() => {
          this.copiedText.textContent = "COPIED";
          setTimeout(() => {
            this.copiedText.textContent = "";
          }, 2000);
        })
        .catch((err) => {
          alert("Failed to copy: ", err);
        });
    } else {
      alert("No password to copy.");
    }
  }

  updateSlider(value) {
    // Update slider display and background gradient
    this.lengthValue.textContent = value;
    const percentage = (value / this.slider.max) * 100;
    this.slider.style.background = `linear-gradient(to right, #A4FFAF ${percentage}%, #08070B ${percentage}%)`;
  }

  updatePasswordStrength(password) {
    // Update strength indicator based on password quality
    const strengthLabel = document.querySelector(".strength-label");
    const colors = ["#f64a4a", "#fb7c58", "#f8cd65", "#a4ffaf"];
    const strength = this.calculatePasswordStrength(password);
    const levels = {
      "Too Weak": 1,
      Weak: 2,
      Medium: 3,
      Strong: 4,
    };

    strengthLabel.textContent = strength.toUpperCase();
    const strengthIndex = levels[strength] || 0;

    this.strengthContainer.innerHTML = [...Array(4)]
      .map((_, index) => {
        const filled = index < strengthIndex;
        const color = filled ? colors[strengthIndex - 1] : "#08070B";
        return `<div class="bar" style="background-color: ${color};"></div>`;
      })
      .join("");
  }

  calculatePasswordStrength(password) {
    // Determine password strength based on length and character variety
    const tests = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*()_+\[\]{}|;:,.<>?/~`=-]/.test(password),
    ];

    const length = password.length;
    const typesCount = tests.filter(Boolean).length;

    if (length < 8) return "Too Weak";
    if (length >= 8 && typesCount === 1) return "Weak";
    if (length >= 12 && typesCount >= 3) return "Strong";
    if (length >= 8 && typesCount >= 2) return "Medium";
    return "Weak";
  }

  generatePassword() {
    // Generate password using selected options
    const options = [
      [this.includeUppercase.checked, this.UPPERCASE],
      [this.includeLowercase.checked, this.LOWERCASE],
      [this.includeNumbers.checked, this.NUMBERS],
      [this.includeSymbols.checked, this.SYMBOLS],
    ];

    let allCharacters = "";
    let password = "";
    const mandatoryCharacters = options.reduce((acc, [isChecked, chars]) => {
      if (isChecked) {
        allCharacters += chars;
        acc += this.getRandomCharacter(chars);
      }
      return acc;
    }, "");

    const length = parseInt(this.slider.value, 10);
    for (let i = 0; i < length - mandatoryCharacters.length; i++) {
      password += this.getRandomCharacter(allCharacters);
    }

    password += mandatoryCharacters;
    return this.shufflePassword(password);
  }

  getRandomCharacter(chars = "") {
    // Get random character from a string
    const randomIndex = Math.floor(Math.random() * chars.length);
    return chars[randomIndex];
  }

  shufflePassword(password = "") {
    // Shuffle characters in a string
    return [...password].sort(() => Math.random() - 0.5).join("");
  }
}

// Initialize Password Generator
new PasswordGenerator();
