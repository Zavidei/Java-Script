class textRedactor {
    constructor(textSpace, buttonTextEditor, fontSelector, fontSizeInput) {
        this.textSpace = textSpace;
        this.buttonTextEditor = buttonTextEditor;
        this.fontSelector = fontSelector;
        this.currentFont = "Arial";
        this.fontSizeInput = fontSizeInput;
        this.currentFontSize = 12;
        this.fontSelector.addEventListener("change", () => {
            this.changeFontFamalyTextInDocument();
        });
        this.fontSizeInput.addEventListener("change", () => {
            this.changeFontSizeTextInDocument();

        });

    }

    

    saveFile() {
        const text = this.textSpace.innerText;
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
                    this.textSpace.innerText = reader.result;
                }
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

    changeFontFamalyTextInDocument () {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const font = this.fontSelector.value;
            const span = document.createElement("span");
            span.style.fontFamily = font; 

            range.surroundContents(span);
        }
    }  
    
    changeFontSizeTextInDocument () {
        const input = window.getSelection();
        if (input.rangeCount > 0) {
            const range = input.getRangeAt(0);
            const size = this.fontSizeInput.value;
            const span = document.createElement("span");
            span.style.fontSize = size;

            range.surroundContents(span);
        }
    }
}

const textSpace = document.querySelector(".textArea");
const buttonTextEditor = document.querySelectorAll(".button");
const fontSelector = document.querySelector(".fontsFamily");
const fontSizeInput = document.querySelector(".fontSize");

const textEditor = new textRedactor(textSpace, buttonTextEditor, fontSelector, fontSizeInput);

textEditor.pressToButton();
