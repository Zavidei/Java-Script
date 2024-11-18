

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

        this.tabs = [];
        this.activeTab = null;
        this.currentFont = "Arial";
        this.currentFontSize = 12;
        this.lastSearchIndex = -1; 

        this.addEventListeners();
        this.initTabs();
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

    initTabs() {
        const addTabButton = document.querySelector(".add-tab");

        addTabButton.addEventListener("click", () => this.addNewTab());

        this.addNewTab();
    }

    addNewTab() {
        const newTabIndex = this.tabs.length;
        const tabButton = document.createElement("button");
        tabButton.textContent = `List ${newTabIndex + 1}`;
        tabButton.classList.add("tab-button");
        tabButton.addEventListener("click", () => this.switchTab(newTabIndex));

        const tabButtonsContainer = document.querySelector(".tab-buttons");
        tabButtonsContainer.appendChild(tabButton);

        const tabContent = document.createElement("div");
        tabContent.classList.add("textArea");
        tabContent.setAttribute("contenteditable", "true");
        tabContent.style.display = "none";

        const tabContentContainer = document.querySelector(".tab-content");
        tabContentContainer.appendChild(tabContent);

        this.tabs.push({ button: tabButton, content: tabContent });
        this.switchTab(newTabIndex);
    }

    switchTab(index) {
        this.tabs.forEach((tab, i) => {
            tab.button.classList.toggle("active", i === index);
            tab.content.style.display = i === index ? "block" : "none";
        });
    
        this.activeTab = index;
    }

    applyStyleToSelection(style, value) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement("span");
            span.style[style] = value;
    
            // Если размер шрифта, нужно его умножить на 2
            if (style === "fontSize") {
                value *= 2;
            }
    
            span.style[style] = value; // Устанавливаем стиль
            range.surroundContents(span);
        }
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
        const color = this.colorText.value;
        document.execCommand("foreColor", false, color);
    }

    changeBackgroundColor() {
        const color = this.colorBackground.value;
        document.execCommand("hiliteColor", false, color);
    }

    changeToUppercase() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            const uppercaseText = selectedText.toUpperCase();
            document.execCommand("insertText", false, uppercaseText);
        }
    }

    changeToLowercase() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            const lowercaseText = selectedText.toLowerCase();
            document.execCommand("insertText", false, lowercaseText);
        }
    }

    getCurrentTabContent() {
        return this.tabs[this.activeTab].content; 
    }

    
       
    htmlToRtf(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let rtf = '{\\rtf1\\ansi\\deff0 {\\fonttbl{\\f0 Arial;}}\n';
    let colorTable = '{\\colortbl ;'; 
    let colors = [];
    let fontTable = '{\\fonttbl'; // Таблица шрифтов

    const addColorToTable = (hex) => {
        if (!hex) return '';
        if (!colors.includes(hex)) {
            colors.push(hex);
        }
        const index = colors.indexOf(hex) + 1; 
        return index; 
    };

    const colorToRtf = (hex) => {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return `\\red${r}\\green${g}\\blue${b};`;
    };

    const addFontToTable = (fontName) => {
        const fontIndex = fontTable.split('{').length - 1; // Определяем индекс шрифта
        fontTable += `{\\f${fontIndex} ${fontName};}`; // Добавляем шрифт в таблицу
        return fontIndex; // Возвращаем индекс
    };

    const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            rtf += node.nodeValue; 
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            switch (node.tagName.toLowerCase()) {
                case 'b':
                    rtf += '\\b '; 
                    processChildren(node);
                    rtf += '\\b0 '; 
                    break;
                case 'i':
                    rtf += '\\i '; 
                    processChildren(node);
                    rtf += '\\i0 '; 
                    break;
                case 'u':
                    rtf += '\\ul '; 
                    processChildren(node);
                    rtf += '\\ulnone '; 
                    break;
                case 'font':
                    const fontColor = node.getAttribute('color');
                    const fontSize = window.getComputedStyle(node).fontSize;
                    const fontName = window.getComputedStyle(node).fontFamily; // Получаем имя шрифта
                    const fontIndex = addFontToTable(fontName); // Добавляем шрифт в таблицу
                    rtf += `\\f${fontIndex} `; // Устанавливаем шрифт

                    if (fontColor) {
                        const colorIndex = addColorToTable(fontColor);
                        rtf += `\\cf${colorIndex} `; 
                    }
                    if (fontSize) {
                        rtf += `\\fs${parseInt(fontSize) * 2} `; 
                    }
                    processChildren(node);
                    break;
                case 'span':
                    const bgColor = window.getComputedStyle(node).backgroundColor;
                    const textColor = window.getComputedStyle(node).color;

                    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
                        const hexBgColor = rgbToHex(bgColor);
                        const bgColorIndex = addColorToTable(hexBgColor);
                        rtf += `\\highlight${bgColorIndex} `; 
                    }
                    if (textColor) {
                        const hexTextColor = rgbToHex(textColor);
                        const textColorIndex = addColorToTable(hexTextColor);
                        rtf += `\\cf${textColorIndex} `; 
                    }
                    processChildren(node);
                    break;
                case 'br':
                    rtf += '\\par '; 
                    break;
                default:
                    processChildren(node);
                    break;
            }
        }
    };

    const rgbToHex = (rgb) => {
        const rgbArray = rgb.match(/\d+/g).map(Number);
        return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2])
            .toString(16)
            .slice(1)}`;
    };

    const processChildren = (parentNode) => {
        Array.from(parentNode.childNodes).forEach((child) => processNode(child));
    };

    processChildren(tempDiv);

    colors.forEach((color) => {
        colorTable += colorToRtf(color);
    });
    colorTable += '}\n';
    fontTable += '}\n'; // Закрываем таблицу шрифтов
    rtf = rtf.replace('{\\rtf1', `{\\rtf1${colorTable}${fontTable}`); // Вставляем таблицы
    rtf += '}'; 

    return rtf;
}

    
    rtfToHtml(rtf) {
        const tagMap = {
            '\\b': '<b>',
            '\\b0': '</b>',
            '\\i': '<i>',
            '\\i0': '</i>',
            '\\ul': '<u>',
            '\\ulnone': '</u>',
            '\\par': '<br>',
        };
    
        const colorMap = {
            '\\cf1': '<span style="color:red;">',  
            '\\cf2': '<span style="color:blue;">',
            '\\cf0': '</span>',
            '\\highlight1': '<span style="background-color:red;">',
            '\\highlight2': '<span style="background-color:blue;">',
        };
    
        let html = rtf;
    
        html = html.replace(/\{\\colortbl[^}]+\}/g, ''); 
        html = html.replace(/\{\\fonttbl[^}]+\}/g, '');
    
        Object.keys(tagMap).forEach((rtfTag) => {
            html = html.split(rtfTag).join(tagMap[rtfTag]);
        });
    
        Object.keys(colorMap).forEach((rtfColor) => {
            html = html.split(rtfColor).join(colorMap[rtfColor]);
        });
    
        html = html.replace(/\\[a-z]+\d*/g, ''); 
        html = html.replace(/[{}]/g, '');
    
        html = html.replace(/\\'([0-9a-f]{2})/g, (match, hex) => {
            return String.fromCharCode(parseInt(hex, 16));
        });
    
        return html;
    }
    
    // Обновленный метод для сохранения файла
    saveFile() {
        const text = this.getCurrentTabContent().innerHTML;
        const rtfContent = this.htmlToRtf(text);
        const blob = new Blob([rtfContent], { type: "application/rtf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "document.rtf";
        link.click();
    }
    
    // Обновленный метод для открытия файла
    openFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const rtfContent = e.target.result;
            const htmlContent = this.rtfToHtml(rtfContent);
            this.getCurrentTabContent().innerHTML = htmlContent;
        };
        reader.readAsText(file);
    }
    
    
}

const textSpace = document.querySelector(".textArea");
const fontSelector = document.querySelector(".fontsFamily");
const fontSizeInput = document.querySelector(".fontSize");
const boldButton = document.querySelector(".bolt");
const italicButton = document.querySelector(".cursiv");
const underlineButton = document.querySelector(".line");
const colorText = document.querySelector(".colorText");
const colorBackground = document.querySelector(".colorBackground");
const uppercaseButton = document.querySelector(".registorHight");
const lowercaseButton = document.querySelector(".registor");
const fileInput = document.querySelector(".fileInput");
const openFileButton = document.querySelector(".button");

const editor = new textRedactor(
    textSpace,
    openFileButton,
    fontSelector,
    fontSizeInput,
    boldButton,
    italicButton,
    underlineButton,
    colorText,
    colorBackground,
    uppercaseButton,
    lowercaseButton
);

document.querySelector(".button").addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    editor.openFile(file);
});

document.querySelector(".button:last-child").addEventListener("click", () => {
    editor.saveFile();
});

document.querySelector(".search-button").addEventListener("click", () => {
    const searchText = document.querySelector(".search-input").value.trim();
    const direction = document.querySelector(".search-direction").value;

    if (searchText) {
        const activeContent = editor.getCurrentTabContent();
        let contentHTML = activeContent.innerHTML;

        // Удалим все существующие выделения перед поиском (очистим предыдущие жёлтые фоны)
        contentHTML = contentHTML.replace(/<span style="background-color: yellow;">(.*?)<\/span>/g, '$1');
        activeContent.innerHTML = contentHTML;

        // Поиск подстроки с учётом HTML разметки
        const regex = new RegExp(`(${searchText})`, 'gi'); // Поиск в любом регистре
        const highlightedHTML = contentHTML.replace(regex, '<span style="background-color: yellow;">$1</span>');

        // Обновляем HTML содержимое с подсвеченным текстом
        activeContent.innerHTML = highlightedHTML;

        // Прокрутка к первому найденному элементу
        const firstHighlight = activeContent.querySelector('span[style="background-color: yellow;"]');
        if (firstHighlight) {
            firstHighlight.scrollIntoView({ block: "center", behavior: "smooth" });
        } else {
            alert("Text not found");
        }
    } else {
        alert("Please enter text to search");
    }
});





document.querySelector('.replace-button').addEventListener('click', function() {
    const searchInput = document.querySelector('.search-input').value;
    const replaceInput = document.querySelector('.replace-input').value;
    const replaceAll = document.querySelector('.replace-all').checked;
    
    const currentTabContent = editor.getCurrentTabContent();
    
    if (currentTabContent) {
        if (replaceAll) {
            const escapedSearchInput = searchInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            currentTabContent.innerHTML = currentTabContent.innerHTML.replace(new RegExp(escapedSearchInput, 'g'), replaceInput);
        } else {
            currentTabContent.innerHTML = currentTabContent.innerHTML.replace(searchInput, replaceInput);
        }
    } else {
        alert("Нет открытого документа для замены.");
    }
});
