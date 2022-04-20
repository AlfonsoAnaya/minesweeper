let gridWidth = 16
let bombAmount = gridWidth * 2.5
let flagAmount = 0
let squares = []
const grid = document.getElementById("grid-container")
isGameOver = false

//Create Board with 16 squares each side
function createBoard () {
    // assign 40 randomly to squares in the grid (i.e, plant the bombs!)
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(gridWidth * gridWidth - bombAmount).fill("valid")
    const gameArray = emptyArray.concat(bombsArray);
        /* since the Sort method uses positive or negative values <0 or >0 to 
        determine the order of elements, we can use math.random -.5 to determine
        randomly the order of the elements of an array. 
        This works as follows: math.random gives us a value between 0 to .99
        By substractinc .5 we make sure that there is a 50% chance that
        each element will have a positive value and 50% chance it will have
        a negative value. The result is a randomized array*/
    const shuffledArray = gameArray.sort(() => Math.random() -.5);

    //create the grid with the bombs and valid squares
    for (let i = 0; i < gridWidth * gridWidth; i++) {
        const square = document.createElement("div");
        square.setAttribute('id', i);
        square.classList.add(gameArray[i])
        grid.appendChild(square);
        squares.push(square);
        // NORMAL CLICK  set up an event listener for a click on each square in the grid - on click perform function "clicked"
        square.addEventListener("click", function(e) {
            click(square)
        })
        
        // RIGHT CLICK set up even listener for right click on each
        square.oncontextmenu = function(e) {
            e.preventDefault();
            addFlag(square)
        }
        
    }
   
    //create numbers in valid square adjacent to bombs
    for (let i = 0; i < squares.length; i++) {
        let counter = 0;
        const isLeftEdge = i % gridWidth === 0
        const isRightEdge = (i+1) % gridWidth === 0 
        if (squares[i].classList.contains("valid")) {
            //check W square
            if (i > 0 && !isLeftEdge && squares[i-1].classList.contains("bomb")) counter++
            //check E square
            if (i < 255 && !isRightEdge && squares[i+1].classList.contains("bomb")) counter++
            //check NW square
            if (i > gridWidth-1 && !isLeftEdge && squares[i-(gridWidth+1)].classList.contains("bomb")) counter++
            //check N square
            if (i >gridWidth-1 && squares[i-gridWidth].classList.contains("bomb")) counter++
            //check NE square
            if (i > gridWidth-1 && !isRightEdge && squares[i-(gridWidth-1)].classList.contains("bomb")) counter++
            //check SW square
            if (i < squares.length-gridWidth && !isLeftEdge && squares[i+(gridWidth-1)].classList.contains("bomb")) counter++
            //check S square
            if (i < squares.length-gridWidth && squares[i+gridWidth].classList.contains("bomb")) counter++
            //check SE square
            if (i < squares.length-gridWidth && !isRightEdge && squares[i+(gridWidth+1)].classList.contains("bomb")) counter++
            squares[i].setAttribute("data", counter)
        }    
    }
}

createBoard()

//define right click function
function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains("checked") && (flagAmount < bombAmount)) {
        if (!square.classList.contains("flagged")) {
            square.classList.add("flagged")
            flagAmount++
            square.textContent = "🚩"
            checkForWin()
        } else {
            square.classList.remove("flagged")
            square.textContent = ""
            flagAmount--
        }
    }
}

// define "click" function
function click(square) {
    let currentId = square.id
    // do nothing if game is over or if squre has been checked
    if (isGameOver) return
    if (square.classList.contains("checked") || square.classList.contains("flagged")) return
    // If square has a bomb -> game over
    if (square.classList.contains("bomb")) {
        gameOver(square)     
    /* else if square has no bomb & has a bomb in the surroundings -> show number
    (add class number to display correct colour) */
    } else {
        square.classList.add("checked")
        let surroundingBombs = square.getAttribute("data")
        if (surroundingBombs > 0) square.textContent = surroundingBombs
        if (surroundingBombs === "1") square.classList.add("one")
        if (surroundingBombs === "2") square.classList.add("two")
        if (surroundingBombs === "3") square.classList.add("three")
        if (surroundingBombs === "4") square.classList.add("four")
        if (surroundingBombs === "5") square.classList.add("five")
        if (surroundingBombs === "6") square.classList.add("six")
        if (surroundingBombs === "7") square.classList.add("seven")
        if (surroundingBombs === "8") square.classList.add("eight")
        if (surroundingBombs === "0") {
            checkSquare(square, currentId)
        }
    }
}

function checkSquare(square, currentId) {
    const isLeftEdge = currentId % gridWidth === 0
    const isRightEdge = (parseInt(currentId)+1)%gridWidth === 0                     
    setTimeout(() => {
        //check E square
        if (currentId > 0 && !isLeftEdge) {
            const newId = parseInt(currentId) - 1
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        //check W square
        if (currentId < 255 && !isRightEdge) {
            const newId = parseInt(currentId)+1
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        //check NW square
        if (currentId > gridWidth-1 && !isLeftEdge) {
            const newId = parseInt(currentId-(gridWidth+1))
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        //check NE square
        if (currentId > gridWidth-1 && !isRightEdge) {
            const newId = parseInt(currentId-(gridWidth-1))
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        //check N square
        if (currentId > gridWidth-1) {
            const newId = parseInt(currentId-(gridWidth))
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        //check SW square
        if (currentId < squares.length-gridWidth && !isLeftEdge) {
            const newId = parseInt(currentId)+(gridWidth-1)
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        //check SE square
        if (currentId < squares.length-gridWidth && !isRightEdge) {
            const newId = parseInt(currentId)+(gridWidth+1)
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        //check S square        
        if (currentId < squares.length-gridWidth) {
            const newId = parseInt(currentId)+gridWidth
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
    }, 10) 
}

function gameOver(square) {
    console.log("game over")
    isGameOver = true
    squares.forEach(square => {
        if (square.classList.contains("bomb")) {
            square.textContent = "💣"
        }
    })
}

function checkForWin() {
    let matches = 0
    for (let i=0; i < squares.length; i++) {
        if(squares[i].classList.contains("flagged") && squares[i].classList.contains("bomb")) {
            matches++
            console.log(matches)
        }
        if (matches===bombAmount) {
            console.log("you've won!")
        } 
    }
}


/* set up an event listener for a right-click on each square in the grid*/

/* define "right-clicked" function*/


/* set up an event listener for new game in the new game button */
    /* clean the grid */
    /*redeploy function to assign the 40 bombs*/