class Calculator {
    constructor(displayCalculator, buttonCalculator) {
        this.displayCalculator = displayCalculator;
        this.buttonCalculator = buttonCalculator;
        this.memory = 0;
        this.result = false;
        this.trigerTrg = false;
    }

    clearDisplay() {
        this.displayCalculator.innerText = "0";
        this.result = false;
    }

    calculateRoot() {
        let num = this.displayCalculator.innerText.substring(1);
        num = eval(num);
        num = Number(num);
        this.displayCalculator.innerText = Math.sqrt(num);
        this.result = true;
    }

    calculateProcent() {
        const pozition = this.displayCalculator.innerText.indexOf("%");
        const firstNum = this.displayCalculator.innerText.substring(0, pozition);
        const secondNum = this.displayCalculator.innerText.substring(pozition + 1);

        this.displayCalculator.innerText = (+firstNum * secondNum) / 100;
        this.result = true;
    }

    calculateExtent() {
        const pozition = this.displayCalculator.innerText.indexOf("^");
        const firstNum = this.displayCalculator.innerText.substring(0, pozition);
        const secondNum = this.displayCalculator.innerText.substring(pozition + 1);

        this.displayCalculator.innerText = (+firstNum) ** (+secondNum);
        this.result = true;
    }

    pressToButton() {
        this.buttonCalculator.map((button) => {
            button.addEventListener("click", (e) => {
                switch (e.target.innerText) {
                    case "MC":
                        this.memory = 0;
                        break;
                    case "MR":
                        this.displayCalculator.innerText = this.memory;
                        break;
                    case "M+":
                        this.memory = Number(this.memory) + Number(this.displayCalculator.innerText);
                        break;
                    case "M-":
                        this.memory = Number(this.memory) - Number(this.displayCalculator.innerText);
                        break;
                    case "C":
                        this.clearDisplay();
                        break;
                    case "=":
                        if (this.displayCalculator.innerText.indexOf("%") > 0) {
                            this.calculateProcent();
                        }
                        else if (this.displayCalculator.innerText.indexOf("^") > 0) {
                            this.calculateExtent();
                        }
                        else if (this.displayCalculator.innerText.indexOf("√") === 0) {
                            this.calculateRoot();
                        }
                        try {
                            this.displayCalculator.innerText = eval(this.displayCalculator.innerText);
                            this.result = true;
                        } catch (e) {
                            this.displayCalculator.innerText = "Error";
                            this.result = false;
                        }
                        break;
                    case "Back":
                        this.displayCalculator.innerText = this.displayCalculator.innerText.slice(0, -1);
                        break;
                    case "trg":
                        let btm = document.querySelectorAll(".rightBt");

                        btm.forEach((button) => {
                            switch (button.textContent) {
                                case "+":
                                case "sin":
                                    button.textContent = this.trigerTrg ? "+" : "sin";
                                    break;
                                case "-":
                                case "cos":
                                    button.textContent = this.trigerTrg ? "-" : "cos";
                                    break;
                                case "*":
                                case "tan":
                                    button.textContent = this.trigerTrg ? "*" : "tan";
                                    break;
                                case "/":
                                case "ctag":
                                    button.textContent = this.trigerTrg ? "/" : "ctag";
                                    break;
                            }
                        })

                        this.trigerTrg = !(this.trigerTrg);
                        break;
                    case "sin":

                        break;
                    default:
                        if (this.result) {
                            this.displayCalculator.innerText = e.target.innerText;
                            this.result = false;
                        }
                        else if (this.displayCalculator.innerText === "0" && e.target.innerText !== ".") {
                            this.displayCalculator.innerText = e.target.innerText;
                        } else {
                            this.displayCalculator.innerText += e.target.innerText;
                        }
                }
            });
        });
    }

    pressToButtonKeyboard() {
        document.addEventListener("keydown", (e) => {
            const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.', 'Enter', 'Escape', "Backspace"];

            if (allowedKeys.includes(e.key)) {
                switch (e.key) {
                    case "Escape":
                        this.clearDisplay();
                        break;
                    case "Enter":
                        if (this.displayCalculator.innerText.indexOf("%") > 0) {
                            this.calculateProcent();
                        }
                        else if (this.displayCalculator.innerText.indexOf("^") > 0) {
                            this.calculateExtent();
                        }
                        else if (this.displayCalculator.innerText.indexOf("√") >= 0) {
                            this.calculateRoot();
                        }
                        try {
                            this.displayCalculator.innerText = eval(this.displayCalculator.innerText);
                            this.result = true;
                        } catch (e) {
                            this.displayCalculator.innerText = "Error";
                            this.result = false;
                        }
                        break;
                    case "Backspace":
                        this.displayCalculator.innerText = this.displayCalculator.innerText.slice(0, -1);
                        break;
                    default:
                        if (this.result) {
                            this.displayCalculator.innerText = e.key;
                            this.result = false;
                        }
                        else if (this.displayCalculator.innerText === "0" && e.key !== ".") {
                            this.displayCalculator.innerText = e.key;
                        } else {
                            this.displayCalculator.innerText += e.key;
                        }
                }
            }
        });
    }
}


const display = document.querySelector(".interface");
const buttons = Array.from(document.querySelectorAll(".displayButton"));

const calculatorLab = new Calculator(display, buttons);

calculatorLab.pressToButton();
calculatorLab.pressToButtonKeyboard();

