
let juliet = document.getElementById('juliet'); 
let romeo = document.getElementById('romeo'); 
let friar = document.getElementById('friar'); 
let capulet = document.getElementById('capulet'); 
let ladyCapulet = document.getElementById('lady-capulet'); 
let montague = document.getElementById('montague'); 
let ladyMontague = document.getElementById('lady-montague'); 
let benvolio = document.getElementById('benvolio'); 
let nurse = document.getElementById('nurse'); 


let connectLabel = document.getElementById('connect'); 
let submitConnections = document.getElementById('submit-connections'); 

let con1 = document.getElementById('con1'); 
let con1Label = document.getElementById('con1-label'); 
let con2 = document.getElementById('con2'); 
let con2Label = document.getElementById('con2-label'); 
let con3 = document.getElementById('con3'); 
let con3Label = document.getElementById('con3-label'); 
let con4 = document.getElementById('con4');
let con4Label = document.getElementById('con4-label'); 
let con5 = document.getElementById('con5'); 
let con5Label = document.getElementById('con5-label'); 
let con6 = document.getElementById('con6'); 
let con6Label = document.getElementById('con6-label'); 
let con7 = document.getElementById('con7'); 
let con7Label = document.getElementById('con7-label'); 
let con8 = document.getElementById('con8'); 
let con8Label = document.getElementById('con8-label'); 
let con9 = document.getElementById('con9'); 
let con9Label = document.getElementById('con9-label'); 


let characters = [juliet, romeo, friar, capulet, ladyCapulet, montague, ladyMontague, benvolio, nurse]; 

let connectionCharacters = [con1, con2, con3, con4, con5, con6, con7, con8,con9]; 

let submitCharacter = document.getElementById('submit-characters');

let charactersToUse = []; 

submitCharacter.onclick = function findCharacters(){
    for (let i = 0; i<characters.length; i++) {
        character = characters[i]; 
        if(character.checked){
            charactersToUse.push(character.value); 
        }
    }


    if(charactersToUse.length > 0){
        console.log(charactersToUse); 
        // code after finding characters here 


        connectLabel.style.opacity = '100%'; // Put title for connections back 
        submitConnections.style.opacity = '100%'; //put submit button for connections back 

       
        useCharacterConnections = []; 
        useCharacterLabels = []; 

        for(let i = 0; i<charactersToUse.length; i++){
            useCharacterConnections.push(document.getElementById('con'+ (i+1))); 
            useCharacterLabels.push(document.getElementById('con' + (i+1) +  '-label')); 
        }

        for(let i = 0; i<useCharacterConnections.length; i++){
            useCharacterConnections[i].style.opacity = '100%'; 
            useCharacterLabels[i].innerHTML = charactersToUse[i]; 
            useCharacterLabels[i].opacity = '100%'; 
        }

        submitConnections.onclick = function findConnections(){
            for(let i = 0; i<useCharacterConnections.length; i++){
                
            }
        }



    }

} 







