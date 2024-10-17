class textRedactor {
    constructor(textSpace, buttonTextEditor, fontSelector, fontSizeInput, boldButton, italicButton, underlineButton, colorText, colorBackground, uppercaseButton, lowercaseButton) {
        this.textSpace = textSpace;
        this.buttonTextEditor = buttonTextEditor;
        this.fontSelector = fontSelector;
        this.fontSizeInput = fontSizeInput;
        this.boldButton = boldButton;
        this.italicButton = italicButton;
        this.underlineButton = underlineButton;
        this.colorText = colorText;
        this.colorBackground = colorBackground;
        this.uppercaseButton = uppercaseButton;
        this.lowercaseButton = lowercaseButton;
        
        this.currentFont = "Arial";
        this.currentFontSize = 12;

        this.addEventListeners();
    }

    addEventListeners() {
        this.fontSelector.addEventListener("change", () => this.changeFontFamalyTextInDocument());
        this.fontSizeInput.addEventListener("change", () => this.changeFontSizeTextInDocument());
        this.boldButton.addEventListener("click", () => this.toggleBoldText());
        this.italicButton.addEventListener("click", () => this.toggleItalicText());
        this.underlineButton.addEventListener("click", () => this.toggleUnderlineText());
        this.colorText.addEventListener("input", () => this.changeTextColor());
        this.colorBackground.addEventListener("input", () => this.changeBackgroundColor());
        this.uppercaseButton.addEventListener("click", () => this.changeToUppercase());
        this.lowercaseButton.addEventListener("click", () => this.changeToLowercase());
    }

    saveFile() {
        const text = this.textSpace.innerHTML;
        const blob = new Blob([text], { type: "application/msword" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = "document.doc";
        link.click();
        URL.revokeObjectURL(link.href);
    }

    openFile() {
        const input = document.querySelector(".fileInput");
        input.click();

        input.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    this.textSpace.innerHTML = reader.result;
                };
            }
        });
    }

    pressToButton() {
        this.buttonTextEditor.forEach((button) => {
            button.addEventListener("click", (e) => {
                switch (e.target.innerText) {
                    case "Open File":
                        this.openFile();
                        break;
                    case "Save File":
                        this.saveFile();
                        break;
                }
            });
        });
    }

    changeFontFamalyTextInDocument() {
        this.applyStyleToSelection("fontFamily", this.fontSelector.value);
    }

    changeFontSizeTextInDocument() {
        this.applyStyleToSelection("fontSize", this.fontSizeInput.value);
    }

    toggleBoldText() {
        document.execCommand("bold");
    }

    toggleItalicText() {
        document.execCommand("italic");
    }

    toggleUnderlineText() {
        document.execCommand("underline");
    }

    changeTextColor() {
        this.applyStyleToSelection("color", this.colorText.value);
    }

    changeBackgroundColor() {
        this.applyStyleToSelection("backgroundColor", this.colorBackground.value);
    }

    changeToUppercase() {
        this.changeTextCase("uppercase");
    }

    changeToLowercase() {
        this.changeTextCase("lowercase");
    }

    changeTextCase(caseType) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const text = range.toString();
            const transformedText = caseType === "uppercase" ? text.toUpperCase() : text.toLowerCase();
            
            document.execCommand("insertText", false, transformedText);
        }
    }

    applyStyleToSelection(style, value) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement("span");
            span.style[style] = value;
            range.surroundContents(span);
        }
    }
}

const textSpace = document.querySelector(".textArea");
const buttonTextEditor = document.querySelectorAll(".button");
const fontSelector = document.querySelector(".fontsFamily");
const fontSizeInput = document.querySelector(".fontSize");
const boldButton = document.querySelector(".bolt");
const italicButton = document.querySelector(".cursiv");
const underlineButton = document.querySelector(".line");
const colorText = document.querySelector(".colorText");
const colorBackground = document.querySelector(".colorBackground");
const uppercaseButton = document.querySelector(".registorHight");
const lowercaseButton = document.querySelector(".registor");

const textEditor = new textRedactor(
    textSpace, buttonTextEditor, fontSelector, fontSizeInput, 
    boldButton, italicButton, underlineButton, 
    colorText, colorBackground, uppercaseButton, lowercaseButton
);

textEditor.pressToButton();
