const htmlWidth = document.querySelector("html")
const teclaOn = document.querySelector("#on")
const teclaOff = document.querySelector("#off")
const allTeclas = [...document.querySelectorAll("button")]
const teclasNumericas = [...document.querySelectorAll(".tecla:not(.op)")]
const teclasOperacao = [...document.querySelectorAll(".op")]
const telcaBackSpace = document.querySelector("#backspace")
const teclaClear = document.querySelector("#clear")
const display = document.querySelector("#display")
const displayText = document.querySelector("#displayText")
const igual = document.querySelector("#igual")
let key = true

// Impede que o usuario digite uma quantidade de caracteres maior que o display
function displayWidths() {
    let dw = display.clientWidth - 70
    let dtx = displayText.clientWidth

    if (dtx > dw) {
        return false
    } else {
        return true
    }
}

//Liga o display e desbloqueia as teclas
teclaOn.addEventListener("click", () => {
    key = true
    displayText.innerHTML = 0

    allTeclas.map(tecla => {
        tecla.removeAttribute("disabled")
    })

})

//Desliga o display e bloqueia as teclas
teclaOff.addEventListener("click", () => {
    displayText.innerHTML = ""

    allTeclas.map(tecla => {
        // Desabilita todas as teclas menos a de ligar
        if (tecla.id != "on") {
            tecla.setAttribute("disabled", "disabled")
        }
    })
})

// Adiciona as funões das teclas numericas
teclasNumericas.map(tecla => {
    tecla.addEventListener("click", teclaEvt => {

        let tipoTecla = teclaEvt.target.innerText
        let ultCaractere = displayText.innerHTML[displayText.innerHTML.length -1]
        let tamDisplayText = displayText.innerHTML.length

        // Faz o primeiro número digitado ocupar o zero no display
        if (displayWidths()) {

            //impede a adição de zeros a esquerda
            if (!(tamDisplayText == 1 && tipoTecla == 0 && ultCaractere == 0)) {

                // verifica se a tecla acionada deve substituir o zero
                // caso não ele adiciona o valor no display
                if (key && tipoTecla != "." && ultCaractere != ".") {
                    displayText.innerHTML = tipoTecla
                    key = false
                } else {
                    displayText.innerHTML += tipoTecla
                    key = false
                }
            }
        }

    })
})


// Adiciona as funções das teclas de operação
teclasOperacao.map(tecla => {
    tecla.addEventListener("click", evt => {

        let ultCaractere = displayText.innerHTML[displayText.innerHTML.length -1]
        
        // verifica se o ultimo caractere digitado não e um outro simbolo de operação
        let permitirTeclaOp = teclasOperacao.every(btnOp => {
            return ultCaractere != btnOp.innerText 
        })

        if (displayWidths()) {
            // Permite adicionar o sinal de - para numeros negativos
            if (displayText.innerHTML == "0" && tecla.innerText == "-") {
                displayText.innerHTML = evt.target.innerHTML
                key = false
            }
    
            // so adiciona se cumprir a verificação acima e si o display não estiver zerado
            else if (displayText.innerHTML != "0" && permitirTeclaOp == true) {
                displayText.innerHTML += evt.target.innerHTML
            }
        }

    })
})

// Tecla AC limpa todo o contúdo da tela
teclaClear.addEventListener("click", () => {
    displayText.innerHTML = 0
    key = true
})

// Apaga o ultimo caractere
telcaBackSpace.addEventListener("click", () => {
    let s_display = displayText.innerHTML

    // Substitui o ultimo caractere apagado por 0 (para não deixar o display vazio ao apagar)
    if (s_display.length == 1) {
        s_display = 0
        key = true
    } else {
        s_display = s_display.substring(0 , s_display.length - 1)
    }

    displayText.innerHTML = s_display
})


// Mostra os resultados no display
igual.addEventListener("click", () => {

    let stringDisplay = displayText.innerText

    stringDisplay = stringDisplay.replace("x", "*")
    stringDisplay = stringDisplay.replace("÷", "/")

    try {
        if (isNaN(eval(stringDisplay))) {
            displayText.innerHTML = "Error"
            setTimeout(() => {
                displayText.innerHTML = 0
                key = true
            },1000)
        } else {

            displayText.innerHTML = eval(stringDisplay)
            // se o resultado for maior que o display ele limita em 2 digitos
            if (!displayWidths())
                displayText.innerHTML = eval(stringDisplay).toFixed(2)
            
            // Verifica se o resultado for 0 para que o proximo número digitado substitua o 0
            if (displayText.innerHTML == 0)
                key = true
        }
    } catch(err) {
        displayText.innerHTML = "Error"
        setTimeout(() => {
            displayText.innerHTML = 0
            key = true
        },1000)
    }
})