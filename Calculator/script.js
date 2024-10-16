class Calculator {
    constructor(displayCalculator, buttonCalculator) {
        this.displayCalculator = displayCalculator;
        this.buttonCalculator = buttonCalculator;
        this.memory = 0;
        this.result = false;
        this.trigerTrg = false;
        this.trigerLog = false;
        this.trigerPoint = true;
    }

    clearDisplay() {
        this.displayCalculator.innerText = "0";
        this.result = false;
        this.trigerPoint = true;
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

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    toHex() {
        const num = Number(this.displayCalculator.innerText);

        if (!(isNaN(num))) {
            this.displayCalculator.innerText = num.toString(16).toUpperCase();
            this.result = true;
        } else {
            this.displayCalculator.innerText = "Error";
        }
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
                        if (this.displayCalculator.innerText.includes("/0")) {
                            this.displayCalculator.innerText = "Error";
                            this.result = true;
                        }
                        else if (this.displayCalculator.innerText.indexOf("%") > 0) {
                            this.calculateProcent();
                        }
                        else if (this.displayCalculator.innerText.indexOf("^") > 0) {
                            this.calculateExtent();
                        }
                        else if (this.displayCalculator.innerText.indexOf("√") === 0) {
                            this.calculateRoot();
                        }
                        else {
                            try {
                                this.displayCalculator.innerText = eval(this.displayCalculator.innerText);
                                this.result = true;
                            } catch (e) {
                                this.displayCalculator.innerText = "Error";
                                this.result = false;
                            }
                        }
                        break;
                    case "Back":
                        this.displayCalculator.innerText = this.displayCalculator.innerText.slice(0, -1);
                        break;
                    case "trg":
                        const btmTrg = document.querySelectorAll(".rightBt");

                        btmTrg.forEach((button) => {
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
                                case "ctg":
                                    button.textContent = this.trigerTrg ? "/" : "ctg";
                                    break;
                            }
                        })

                        this.trigerTrg = !(this.trigerTrg);
                        break;
                    case "HEX":
                        this.toHex();
                        break;
                    case "log":
                        const btmLog = document.querySelectorAll(".log");
                        const btmRoot = document.querySelector(".log.root");

                        if (this.trigerLog) {
                            btmRoot?.classList.add("root");
                        } else {
                            btmRoot?.classList.remove("root");
                        }

                        btmLog.forEach((button) => {
                            switch (button.textContent) {
                                case "√":
                                case "ln":
                                    button.textContent = this.trigerLog ? "√" : "ln";
                                    break;
                                case "%":
                                case "lg":
                                    button.textContent = this.trigerLog ? "%" : "lg";
                                    break;
                                case "^":
                                case "log2":
                                    button.textContent = this.trigerLog ? "^" : "log2";
                                    break;
                            }
                        })

                        this.trigerLog = !(this.trigerLog);
                        break;
                    case "ln":
                        if (Number(this.displayCalculator.innerText) <= 0) {
                            this.displayCalculator.innerText = "Error";
                        } else {
                            this.displayCalculator.innerText = Math.log(Number(this.displayCalculator.innerText));
                        }
                        this.result = true;
                        break;
                    case "lg":
                        if (Number(this.displayCalculator.innerText) <= 0) {
                            this.displayCalculator.innerText = "Error";
                        } else {
                            this.displayCalculator.innerText = Math.log10(Number(this.displayCalculator.innerText));
                        }
                        this.result = true;
                        break;
                    case "log2":
                        if (Number(this.displayCalculator.innerText) <= 0) {
                            this.displayCalculator.innerText = "Error";
                        } else {
                            this.displayCalculator.innerText = Math.log2(Number(this.displayCalculator.innerText));
                        }
                        this.result = true;
                        break;
                    case "sin":
                        this.displayCalculator.innerText = Math.sin(this.toRadians(Number(this.displayCalculator.innerText)));
                        this.result = true;
                        break;
                    case "cos":
                        this.displayCalculator.innerText = Math.cos(this.toRadians(Number(this.displayCalculator.innerText)));
                        this.result = true;
                        break;
                    case "tan":
                        this.displayCalculator.innerText = Math.tan(this.toRadians(Number(this.displayCalculator.innerText)));
                        this.result = true;
                        break;
                    case "ctg":
                        const numCtg = Math.tan(this.toRadians(Number(this.displayCalculator.innerText)));

                        if (numCtg === 0) {
                            this.displayCalculator.innerText = "Infinity";
                        } else {
                            this.displayCalculator.innerText = 1 / numCtg;
                        }
                        this.result = true;
                        break;
                    default:
                        if (this.result) {
                            this.displayCalculator.innerText = e.target.innerText;
                            this.result = false;
                        }
                        else if (e.target.innerText === ".") {
                            const lastOperatorIndex = Math.max(
                                this.displayCalculator.innerText.lastIndexOf("+"),
                                this.displayCalculator.innerText.lastIndexOf("-"),
                                this.displayCalculator.innerText.lastIndexOf("*"),
                                this.displayCalculator.innerText.lastIndexOf("/")
                            );

                            const currentNumber = this.displayCalculator.innerText.slice(lastOperatorIndex + 1);

                            if (currentNumber === "" || currentNumber.includes(".")) {
                                break;
                            } else {
                                this.displayCalculator.innerText += ".";
                            }
                        }
                        else if (isNaN(e.target.innerText) && isNaN(this.displayCalculator.innerText.slice(-1))) {
                            break;
                        }
                        else if (this.displayCalculator.innerText === "Error") {
                            this.displayCalculator.innerText = e.target.innerText;
                        }
                        else if (this.displayCalculator.innerText === "0" && e.target.innerText !== ".") {
                            this.displayCalculator.innerText = e.target.innerText;
                        } else {

                            if (e.target.innerText === "+" || e.target.innerText === "-" || e.target.innerText === "*" || e.target.innerText === "/") {
                                this.trigerPoint = true;
                            }
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
                        if (this.displayCalculator.innerText.includes("/0")) { 
                            this.displayCalculator.innerText = "Error";
                            this.result = true;
                        }
                        else if (this.displayCalculator.innerText.indexOf("%") > 0) {
                            this.calculateProcent();
                        }
                        else if (this.displayCalculator.innerText.indexOf("^") > 0) {
                            this.calculateExtent();
                        }
                        else if (this.displayCalculator.innerText.indexOf("√") >= 0) {
                            this.calculateRoot();
                        }
                        else {
                            try {
                                this.displayCalculator.innerText = eval(this.displayCalculator.innerText);
                                this.result = true;
                            } catch (e) {
                                this.displayCalculator.innerText = "Error";
                                this.result = false;
                            }
                        }
                        break;
                    case "Backspace":
                        this.displayCalculator.innerText = this.displayCalculator.innerText.slice(0, -1);
                        break;
                    case ".":
                        const lastOperatorIndex = Math.max(
                            this.displayCalculator.innerText.lastIndexOf("+"),
                            this.displayCalculator.innerText.lastIndexOf("-"),
                            this.displayCalculator.innerText.lastIndexOf("*"),
                            this.displayCalculator.innerText.lastIndexOf("/")
                        );

                        const currentNumber = this.displayCalculator.innerText.slice(lastOperatorIndex + 1);

                        if (currentNumber === "" || currentNumber.includes(".")) {
                            break;
                        } else {
                            this.displayCalculator.innerText += ".";
                        }
                        break;
                    default:
                        if (this.result) {
                            this.displayCalculator.innerText = e.key;
                            this.result = false;
                        }
                        else if (isNaN(e.key) && isNaN(this.displayCalculator.innerText.slice(-1))) {
                            break;
                        }
                        else if (this.displayCalculator.innerText === "Error") {
                            this.displayCalculator.innerText = e.key;
                        }
                        else if (this.displayCalculator.innerText === "0" && e.key !== ".") {
                            this.displayCalculator.innerText = e.key;
                        } else {
                            if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
                                this.trigerPoint = true;
                            }
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

