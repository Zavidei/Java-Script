let addElement = () => {
let enterContent = document.getElementById("myInput");
let valueContent = enterContent.value;
let contentElement = document.querySelector("p");
contentElement.innerHTML += `<h1>${valueContent}</h1>`;
enterContent.value = "";
};

const button = document.querySelector("button");
button.addEventListener("click",addElement);