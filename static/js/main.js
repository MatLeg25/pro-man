import {dom} from "./dom.js";

let requestInProgress = false;

// This function is to initialize the application
function init() {
    return new Promise(resolve => {
        requestInProgress = true;
        // init data
    dom.init();
    // loads the boards to the screen

    dom.loadBoards().then(() => {

        const boards = document.getElementsByClassName("board-title")
        return dom.loadStatuses(boards);
    }).then(() => {
        dom.addNewBoard();
        dom.addNewCard();
        dom.rollingBoardEvents();
        dom.addNewColumn();

        //init drag and drop
        dom.setDragAttributes();
       // dom.setDropAttributes(); //UPDATED - run after drag
        // window.addEventListener("load",dom.allowDrop.bind(null, event));
        // window.addEventListener("load",dom.dragStart.bind(null, event));
        // window.addEventListener("load",dom.dropIt.bind(null, event));
        dom.startRenameBoard();
        dom.startRenameCard();
        dom.startRenameColumn();
        dom.deleteBoardStart();
    });
    console.log('done');
    resolve();
    })

}

// function is responsible for loading whole page in proper, asynchronous way
async function allLoad(){
    if (!requestInProgress){
        //remove existing content before showing updated
        let boardContent = document.querySelector(".board-container");
        if (boardContent) {boardContent.remove();console.log("Content has been updated!")} else {console.log("INIT site opened")}
        await init();
        requestInProgress = false;
    }
}

// function shows site when it starts, and refresh automatically after each one edition
function showSite(){
    allLoad();
    window.addEventListener('boardSaved', function(){
        allLoad();
    });
    window.addEventListener('cardSaved', function(){
        allLoad();
    });
    window.addEventListener('columnSaved', function(){
        allLoad();
    });
}

showSite();