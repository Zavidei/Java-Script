
function randomColor(){
    let letter = ["a","b","c","d","e","f"];
    let color = "";
    for(let i = 0; i < 6; i++){
        let randomNum = Math.floor(Math.random()*10);
        let randomLetter = letter[Math.floor(Math.random()*6)];
        let random = Math.floor(Math.random()*100);
        if(random % 2 === 0){
            color+=String(randomNum);
        }else{
            color+=randomLetter;
        }
    }
    return `#${color}`;
}

let updateColor = () => {

    let hexColor = randomColor();

    let nameColor = document.querySelector("h1");
nameColor.textContent = hexColor;

let divColor = document.querySelector(".color");
divColor.style.backgroundColor = hexColor;
}

const button = document.querySelector("#myButton");
button.addEventListener("click",updateColor);