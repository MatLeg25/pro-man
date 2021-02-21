// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },

    compare: function (a, b) {
        if (a.order < b.order) {
            return -1;
        }
        if (a.order > b.order) {
            return 1;
        }
        return 0;
    },

    loadBoards: function () {
        // retrieves boards and makes showBoards called
        return new Promise(resolve => {
            dataHandler.getBoards(function (boards) {
                dom.showBoards(boards);
                resolve()
            })
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardList = '';

        for (let board of boards) {
            let currentBoardId = document.querySelector(`#BoardID${board.id}`);
            if (!currentBoardId) {
                boardList += `
                <li id=BoardID${board.id} class="board-title"><span class="board-name">${board.title}</span>
                    <button class="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                    <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                    </svg></button>
                    <button class="newColumnButton">Add new Column</button>
                    <button class="board-remove">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
                </button>
                </li>
            `;
            }

        }
        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);

    },
    loadStatuses: function (boards) {
        // retrieves cards and makes showCards called
        return new Promise(resolve => {
            dataHandler.getStatuses(async function (statuses) {
                // async - because asynchronous function
                for (let board of boards) {
                    const boardId = board.id.toString();
                    // Loading statuses provides statuses and corresponding cards for each board
                    dom.showStatuses(boardId, statuses);
                    // Loading statuses provides loading cards for each status
                    await dom.loadCards(boardId, statuses);
                    //await - waits for the request to finish
                }
                resolve();
            })
        })
    },
    showStatuses: function (boardId, statuses) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let statusList = '';
        for (let status of statuses) {
            let currentStatusId = document.querySelector(`#${boardId}${status.title}`);
            if (!currentStatusId) {
                statusList += `
                <li id=${boardId}${status.title} class="card-status list-group-item">
                    <span class="column-name">${status.title}</span>
                <button class="newCardButton">Add new Card</button></li>
            `;
            }
        }
        const outerHtml = `
            <ul class="status-container list-group list-group-horizontal"> 
                ${statusList}
            </ul>
        `;

        let statusContainer = document.getElementById(`${boardId}`);
        //console.dir(boardsContainer); //displays object and list of the properties
        statusContainer.insertAdjacentHTML("beforeend", outerHtml);
    },
    //loadCards is used only in dom.loadStatuses function
    loadCards: function (boardId, statuses) {
        // retrieves cards and makes showCards called
        return new Promise(resolve => {
            dataHandler.getCardsByBoardId(boardId, function (cards) {
                for (let status of statuses) {
                    dom.showCards(boardId, cards, status);
                }
                resolve();
            });
        })

    },
    showCards: function (boardId, cards, status) {
        // shows the cards of a board
        // it adds necessary event listeners also
        cards.sort(this.compare);
        for (let card of cards) {
            let cardList = '';
            //console.log(card);
            //console.log(card.status_id);
            //console.log(status.title);
            if (card.status_id === status.id) {
                let currentCardId = document.querySelector(`#card${card.id}`);
                if (!currentCardId) {
                    cardList += `
                    <li id="card${card.id}" class="card-title list-group-item"><span class="card-name">${card.title}</span></li>
                `;
                }

                const outerHtml = `
                <ul class="card-container list-group" id="card${card.id}"> 
                ${cardList}
                </ul>     
                `;

                let boardsContainer = document.querySelector(`#${boardId}`).querySelector(`#${boardId}${status.title}`);
                boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
            }
        }
    },
    handlingEventsHideBoard: function (boardID) {
        //1stage: select and hide board
        console.log("Hide board: " + boardID);
        let BoardToHide = document.querySelector(`#${boardID} ul`);
        BoardToHide.style.display = "none";
        //2stage: set button onclick event to show board
        let HiddenBoard = document.querySelector(`#${boardID} button`);
        HiddenBoard.onclick = function () {
            dom.handlingEventsShowBoard(boardID)
        };
    },
    handlingEventsShowBoard: function (boardID) {
        //1stage: select and hide board
        console.log("Show board: " + boardID);
        let BoardToShow = document.querySelector(`#${boardID} ul`);
        BoardToShow.style.display = "flex";
        //2stage: set button onclick event to hide board
        let ShownBoard = document.querySelector(`#${boardID} button`);
        ShownBoard.onclick = function () {
            dom.handlingEventsHideBoard(boardID)
        };
    },
    rollingBoardEvents: function () {
        let icons = document.getElementsByClassName('button');
        for (let i = 0; i < icons.length; i++) {
            // console.log(icons[i]);

            //for each button set parameter as BoardID
            let CurrentBoardID = icons[i].parentElement.id; //get number(x) from BoardIDx

            //icons[i].addEventListener('click', function() {dom.handlingEventsHideBoard(CurrentBoardID)});
            icons[i].onclick = function () {
                dom.handlingEventsHideBoard(CurrentBoardID)
            };
        }
    },
    loadBoard: function (boardId) {
        // Select one board(by ID) from all boards and makes showBoard called
        dataHandler.getBoards(function (boards) {
            let board = '';
            for (board of boards) {
                // console.log("iter"+JSON.stringify(board));
                if (board.id === boardId) {
                    return dom.showBoard(board)
                }
            }
        });
    },
    showBoard: function (board) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        console.log("Show board:", board);
        const outerHtml = `
            <li class="board-title">
                ${board.title} <!--//just from display currnet bord. Final will be in formated DIV-->
            </li>
        `;

        let boardsContainer = document.querySelector('.board-container');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
    },
    addNewBoard: function () {
        const addNewBoardBtn = document.querySelector('#add-board');
        addNewBoardBtn.addEventListener("click",
            this.showNewBoardForm.bind(this));

    },
    showNewBoardForm: function () {
        const body = document.querySelector('body');
        const modal = `
             <div id="backdrop"></div>
                <div class="add-modal" id="add-modal">
                  <div class="modal__content">
                  <h2>Create new board</h2>
                    <label for="title">Board Name</label>
                    <input type="text" name="title" id="title" />
                  </div>
                  <div class="modal__actions">
                    <button class="btn btn--passive">Cancel</button>
                    <button class="btn btn--success">Save</button>
              </div>`;
        body.insertAdjacentHTML("afterbegin", modal);
        this.addBoardModalEventListeners();
    },
    addBoardModalEventListeners: function () {
        const cancelNewBoard = document.querySelector('.btn--passive');
        const saveNewBoard = document.querySelector('.btn--success');
        cancelNewBoard.addEventListener("click", this.removeNewBoardForm);
        saveNewBoard.addEventListener("click", this.saveBoardName.bind(this));
    },
    removeNewBoardForm: function () {
        const body = document.querySelector('body');
        const backdrop = document.querySelector('div#backdrop');
        const modal = document.querySelector('div.add-modal');
        const text = modal.querySelector('#title').value;
        body.removeChild(backdrop);
        body.removeChild(modal);
        return text
    },
    saveBoardName: function () {
        const text = dom.removeNewBoardForm()
        dataHandler.createNewBoard(text, (board) => {
            let saved = new CustomEvent('boardSaved');
            window.dispatchEvent(saved);
        });
    },

    addNewCard: function () {
        const addNewCardBtns = document.querySelectorAll('.newCardButton');
        for (let addNewCardBtn of addNewCardBtns) {
            addNewCardBtn.addEventListener("click", dom.showNewCardForm);
        }


    },
    showNewCardForm: function () {
        const body = document.querySelector('body');
        this.classList.add("pushed");
        const modal = `
             <div id="backdrop"></div>
                <div class="add-modal" id="add-modal">
                  <div class="modal__content">
                  <h2>Create new Card</h2>
                    <label for="title">Card Name</label>
                    <input type="text" name="title" id="title" />
                  </div>
                  <div class="modal__actions">
                    <button class="btn btn--passive">Cancel</button>
                    <button class="btn btn--success">Save</button>
              </div>`;
        body.insertAdjacentHTML("afterbegin", modal);
        dom.addCardModalEventListeners();
    },

    addCardModalEventListeners: function () {
        const cancelNewBoard = document.querySelector('.btn--passive');
        const saveNewBoard = document.querySelector('.btn--success');
        cancelNewBoard.addEventListener("click", dom.removeNewCardForm);
        saveNewBoard.addEventListener("click", dom.saveCardName.bind());

    },

    removeNewCardForm: function () {
        const body = document.querySelector('body');
        const backdrop = document.querySelector('div#backdrop');
        const modal = document.querySelector('div.add-modal');
        const text = modal.querySelector('#title').value;
        body.removeChild(backdrop);
        body.removeChild(modal);
        return text
    },

    saveCardName: function () {
        const title = dom.removeNewCardForm();
        const statusName = document.querySelector(".pushed").parentElement.id;
        const boardStringId = document.querySelector(".pushed").parentElement.parentElement.parentElement.id;
        const statusId = dataHandler.getStatusID(statusName, boardStringId);
        const boardId = dataHandler.getBoardID(boardStringId);
        //console.log("CARD ID" + statusId);
        //console.log("NEW CARD " +boardId);
        let pushedBtn = document.querySelector(".pushed")
        pushedBtn.classList.remove("pushed");
        dataHandler.createNewCard(title, boardId, statusId, (card) => {
            var saved = new CustomEvent('cardSaved');
            window.dispatchEvent(saved);
        });
    },
    addNewColumn: function () {
        const addNewColumnBtns = document.querySelectorAll('.newColumnButton');
        for (let addNewColumnBtn of addNewColumnBtns) {
            addNewColumnBtn.addEventListener("click", dom.showNewColumnForm);
        }
    },
    showNewColumnForm: function () {
        const body = document.querySelector('body');
        this.classList.add("pushed");
        const modal = `
             <div id="backdrop"></div>
                <div class="add-modal" id="add-modal">
                  <div class="modal__content">
                  <h2>Create new Column</h2>
                    <label for="title">Column Name</label>
                    <input type="text" name="title" id="title" />
                  </div>
                  <div class="modal__actions">
                    <button class="btn btn--passive">Cancel</button>
                    <button class="btn btn--success">Save</button>
              </div>`;
        body.insertAdjacentHTML("afterbegin", modal);
        dom.addColumnModalEventListeners();
    },
    addColumnModalEventListeners: function () {
        const cancelNewColumn = document.querySelector('.btn--passive');
        const saveNewColumn = document.querySelector('.btn--success');
        cancelNewColumn.addEventListener("click", dom.removeNewColumnForm);
        saveNewColumn.addEventListener("click", dom.saveColumnName.bind());
    },
    removeNewColumnForm: function () {
        const body = document.querySelector('body');
        const backdrop = document.querySelector('div#backdrop');
        const modal = document.querySelector('div.add-modal');
        const text = modal.querySelector('#title').value;
        body.removeChild(backdrop);
        body.removeChild(modal);
        return text
    },
    saveColumnName: function () {
        const statusName = document.getElementById('title').value;
        dom.removeNewColumnForm();
        const boardStringId = document.querySelector(".pushed").parentElement.id; //get full ID
        const boardID = boardStringId.slice(7); //get only number from BoardID<num>
        const NewStatusId = dataHandler.getAllStatuses().length;
        const boardId = dataHandler.getBoardID(boardStringId);
        let pushedBtn = document.querySelector(".pushed")
        pushedBtn.classList.remove("pushed");
        dataHandler.createNewColumn(statusName, () => {
            console.log("New Column: " + statusName + " added!");
            var saved = new CustomEvent('columnSaved');
            window.dispatchEvent(saved);
        });

    },
    startRenameBoard: function () {
        const boardNameFields = document.querySelectorAll('.board-name');
        boardNameFields.forEach((element) => {
            const boardNameId = element.parentElement.id;
            element.addEventListener("click", dom.renameBoardName.bind(null, boardNameId));
        })
    },
    renameBoardName: function (boardId) {
        const nameField = document.querySelector(`li#${boardId}`).firstElementChild;
        const boardName = nameField.textContent;
        const nameInputField = document.createElement('input');
        nameInputField.setAttribute("type", "text");
        nameInputField.setAttribute("value", boardName);
        nameField.replaceWith(nameInputField);
        dom.renameBoardNameEventListeners(boardId);
    },
    returnBoardField: function (boardId) {
        const nameInputField = document.querySelector(`li#${boardId}`).firstElementChild;
        const boardName = nameInputField.value;
        const spanField = document.createElement('span');
        spanField.className = 'board-name';
        spanField.textContent = boardName;
        nameInputField.replaceWith(spanField);
        spanField.addEventListener("click", dom.renameBoardName.bind(null, boardId))
        return boardName
    },
    renameBoardHandler: function (boardId, event) {
        if (event.key === 'Escape') {
            dom.returnBoardField(boardId);
        } else if (event.key === 'Enter') {
            const newBoardName = dom.returnBoardField(boardId);
            boardId = dataHandler.getBoardID(boardId)
            dataHandler.updateBoardName(boardId, newBoardName, (response) => {
            })
        }
    },
    renameBoardNameEventListeners: function (boardId) {
        const inputField = document.querySelector(`li#${boardId}`).firstElementChild;
        const saveChanges = inputField.addEventListener("keydown", this.renameBoardHandler.bind(null, boardId))
    },
    startRenameCard: function () {
        const cardNameFields = document.querySelectorAll('.card-name');
        cardNameFields.forEach((element) => {
            const cardNameId = element.parentElement.parentElement.id;
            element.addEventListener("click", dom.renameCardName.bind(null, cardNameId));
        })
    },
    renameCardName: function (cardId) {
        console.log(cardId)
        const nameField = document.querySelector(`ul#${cardId}`).firstElementChild.firstElementChild;
        const cardName = nameField.textContent;
        console.log(cardName)
        const nameInputField = document.createElement('input');
        nameInputField.setAttribute("type", "text");
        nameInputField.setAttribute("value", cardName);
        nameField.replaceWith(nameInputField);
        dom.renameCardNameEventListeners(cardId);
    },
    returnCardField: function (cardId) {
        const nameInputField = document.querySelector(`ul#${cardId}`).firstElementChild.firstElementChild;
        const cardName = nameInputField.value;
        const spanField = document.createElement('span');
        spanField.className = 'card-name';
        spanField.textContent = cardName;
        nameInputField.replaceWith(spanField);
        spanField.addEventListener("click", dom.renameCardName.bind(null, cardId))
        return cardName
    },
    renameCardHandler: function (cardId, event) {
        if (event.key === 'Escape') {
            dom.returnCardField(cardId);
        } else if (event.key === 'Enter') {
            const newCardName = dom.returnCardField(cardId);
            cardId = dataHandler.getCardID(cardId);
            dataHandler.updateCardName(cardId, newCardName, (response) => console.log(`CardDone - ${response}`))
        }
    },
    renameCardNameEventListeners: function (cardId) {
        const inputField = document.querySelector(`ul#${cardId}`).firstElementChild.firstElementChild;
        const saveChanges = inputField.addEventListener("keydown", this.renameCardHandler.bind(null, cardId))
    },
    startRenameColumn: function () {
        const ColumnNameFields = document.querySelectorAll('.column-name');
        ColumnNameFields.forEach((element) => {
            const ColumnNameId = element.parentElement.id;
            element.addEventListener("click", dom.renameColumnName.bind(null, ColumnNameId));
        })

    },
    renameColumnName: function (boardId) {
        const nameField = document.querySelector(`li#${boardId}`).firstElementChild;
        const ColumnName = nameField.textContent;
        const nameInputField = document.createElement('input');
        nameInputField.setAttribute("type", "text");
        nameInputField.setAttribute("value", ColumnName);
        nameField.replaceWith(nameInputField);
        dom.renameColumnNameEventListeners(boardId, ColumnName);
    },
    returnColumnField: function (columnId) {
        const nameInputField = document.querySelector(`li#${columnId}`).firstElementChild;
        const columnName = nameInputField.value;
        const spanField = document.createElement('span');
        spanField.className = 'column-name';
        spanField.textContent = columnName;
        nameInputField.replaceWith(spanField);
        spanField.addEventListener("click", dom.renameColumnName.bind(null, columnId))
        return columnName
    },
    renameColumnHandler: function (boardId, oldColumnName, event) {
        if (event.key === 'Escape') {
            dom.returnColumnField(boardId);
        } else if (event.key === 'Enter') {
            const newColumnName = dom.returnColumnField(boardId);
            boardId = dataHandler.getBoardID(boardId);
            dataHandler.updateColumnName(boardId, oldColumnName, newColumnName, (response) => console.log(`Done - ${response}`))
        }
    },
    renameColumnNameEventListeners: function (boardId, oldColumnName) {
        const inputField = document.querySelector(`li#${boardId}`).firstElementChild;
        const saveChanges = inputField.addEventListener("keydown", this.renameColumnHandler.bind(null, boardId, oldColumnName))
    },
        reorderCardHandler: function (cardId, newCardBoard, newCardStatus,order) {
        //console.log("REORDER START =>" + cardId)
        let boardId = dataHandler.getBoardID(newCardBoard);
        let cardStatus = `${newCardBoard}${newCardStatus}`;
        //console.log(cardStatus);
        //console.log(newCardBoard);
        let statusId = dataHandler.getStatusID(cardStatus, newCardBoard);
        cardId = dataHandler.getCardID(cardId);
        dataHandler.updateCardStatus(cardId, statusId, boardId, order,(response) => console.log(`CardDone - ${response}`))
    },
    setDragAttributes: function () {
        let cards = document.getElementsByClassName('card-container')
        for (let i = 0; i < cards.length; i++) {
            cards[i].setAttribute('draggable', 'true');
            cards[i].ondragstart = function () {
                dom.dragStart(event)
            }
        }
    },
    deleteBoardStart: function () {
        const boardDeleteIcons = document.querySelectorAll('.board-remove');
        boardDeleteIcons.forEach(element => {
            const boardNameId = element.parentElement.id;
            const boardName = element.parentElement.firstChild.textContent;
            element.addEventListener("click", dom.showDeleteBoardForm.bind(this, boardNameId, boardName));
        })
    },
    showDeleteBoardForm: function (boardId, boardName) {
        const body = document.querySelector('body');
        const modal = `
             <div id="backdrop"></div>
                <div class="add-modal" id="add-modal">
                  <div class="modal__content">
                  <h2>Are you sure about deleting <i>${boardName}</i></h2>
                  </div>
                  <div class="modal__actions">
                    <button class="btn btn--passive">Cancel</button>
                    <button class="btn btn--success">Delete</button>
              </div>`;
        body.insertAdjacentHTML("afterbegin", modal);
        this.removeBoardEventListeners(boardId);
    },
    removeBoardEventListeners: function (boardId) {
        const cancelDelete = document.querySelector('.btn--passive');
        const confirmDelete = document.querySelector('.btn--success');
        cancelDelete.addEventListener("click", this.removeDeleteBoardForm);
        confirmDelete.addEventListener("click", this.confirmDeletion.bind(this, boardId));
    },
    removeDeleteBoardForm: function () {
        const body = document.querySelector('body');
        const backdrop = document.querySelector('div#backdrop');
        const modal = document.querySelector('div.add-modal');
        body.removeChild(backdrop);
        body.removeChild(modal);
    },
    confirmDeletion: function (boardId) {
        this.removeDeleteBoardForm();
        boardId = dataHandler.getBoardID(boardId)
        dataHandler.deleteBoard(boardId, (response) => {
            console.log(`Deletion completed successfully! Left boards: ${JSON.stringify(response)}`)
            let saved = new CustomEvent('boardSaved');
            window.dispatchEvent(saved);
        });
    },
    setDropAttributes: function () {
        let boardsUl = document.getElementsByClassName('dropZone')
        for (let i = 0; i < boardsUl.length; i++) {
            boardsUl[i].ondragover = function () {
                dom.allowDrop(event)
                boardsUl[i].style.color = 'black';
                boardsUl[i].style.backgroundColor = 'grey';
            }
            boardsUl[i].ondrop = function () {
                dom.dropIt(event)
            }
            boardsUl[i].ondragleave = function () {
                boardsUl[i].style.color = 'grey';
                boardsUl[i].style.backgroundColor = "white";
            }
        }
    },
    allowDrop: function (ev) {
      //  console.log(ev);
        //ev.srcElement.style.backgroundColor='red';
        ev.preventDefault();
    },
    dragStart: function (ev) {
        ev.dataTransfer.setData('text/plain', ev.target.id);
        //console.log("Drag start")
        this.manageDragEvent(event);
    },
    dropIt: function (ev) {
        ev.preventDefault();
        let sourceId = ev.dataTransfer.getData('text/plain');
        let sourceIdEl = document.getElementById(sourceId); // moved element
        let sourceIdParentEl = sourceIdEl.parentElement.parentElement.parentElement;
        let targetEl = document.getElementById(ev.target.id) // ev.target.id here is the id of target Object of the drop
        let targetParentEl = targetEl.parentElement.parentElement

        //IF dropped on tmpDropZone then replace
        //console.log(targetParentEl.className+"|"+sourceIdEl.parentElement.parentElement.className);
        if (targetParentEl.className === sourceIdEl.parentElement.parentElement.className)    {
            targetEl.replaceWith(sourceIdEl);
        }

        // Defining boardId and statusName for editing csv purposes
        let boardId = sourceIdEl.parentElement.parentElement.parentElement.id;
        let statusName = sourceIdEl.parentElement.querySelector('.column-name').textContent;
        this.reorganizeCardColum(sourceId,boardId,statusName);
    },
    addListenersByClass: function (className, event, fn) {
        let list = document.getElementsByClassName(className)
        for (let i = 0, len = list.length; i < len; i++) {
            list[i].addEventListener(event, fn, false)
        }
    },
    dragONstyle: function (event) {
        //define here special style for dragging element
        const draggingElement = event.srcElement;
        draggingElement.style.backgroundColor = 'grey'
        draggingElement.style.opacity = '0.5';
    },
    dragOFFstyle: function () {
        const draggingElement = event.srcElement
        draggingElement.style.backgroundColor = "white";
        draggingElement.style.opacity = '1';
        let allCards = document.querySelectorAll('.card-container');
        allCards.forEach(function (element) {
            element.classList.remove('onDrag');
        });
    },
    createDropZone: function(allCards) {
        return new Promise ((resolve, reject) => {
            let allCards = document.querySelectorAll('.card-container');
            setTimeout(function () {
                let counter=0
                for (let card of allCards) {
                    counter++;
                    const dropPlace = `
                                 <ul class="dropZone" id=dropZone${counter}>
                                    ->Drop Here<- 
                                  </ul>`;
                    card.insertAdjacentHTML('beforebegin', dropPlace);
                }
                let allBoards = document.getElementsByClassName('board-container')[0].children;

                //add last card
                for (let board of allBoards) {
                    let statuses = board.getElementsByClassName('card-status');
                    for (let status of statuses) {
                        let lastUlElement = status.lastElementChild;
                        counter++; //continue numeration to keep unique id
                        const dropPlace = `
                                 <ul class="dropZone dropZoneLast" id=dropZone${counter}>
                                    ->Drop Here<- 
                                  </ul>`;
                        lastUlElement.insertAdjacentHTML('afterend', dropPlace);
                    }
                }
            resolve();}, 100);
        })
    },
    hideDropZone: function () {
        let dropZoneElements = document.querySelectorAll('.dropZone');
            dropZoneElements.forEach(function (element) {
                element.remove();
            });
    },
    manageDragEvent: function(event) {
        console.log('start Drag&Drop MANAGER')
        dom.setDragEnd(event);
        this.dragONstyle(event);
        dom.createDropZone()
            .then(() => dom.setDropAttributes()); //run after end of createDropZone
    },
    reorganizeCardColum: function(sourceId,boardId,statusName){
        let columnCards = document.getElementById(sourceId).parentElement;
        columnCards = columnCards.getElementsByClassName('card-container');
        let columnCardsId = []
        let columnCardsData = []
        for (let card of columnCards) {
            columnCardsId.push(card.id); //ID number
            columnCardsData.push(card.parentElement.querySelector('.column-name').textContent); //statusName
        }
        //write to csv with order from column
        for (let i=0;i<columnCardsData.length;i++) {
            let cardId = columnCardsId[i];
            let statusName = columnCardsData[i];
            //console.log(columnCardsId[i]+"|"+columnCardsData[i]);
            dom.reorderCardHandler(cardId, boardId, statusName, i)
        }
    },
    setDragEnd: function (event) {
        document.body.ondragend = function() { //clear tmp dropZone after drop anywhere
            dom.dragOFFstyle(event);
            dom.hideDropZone(); }
    }
};
