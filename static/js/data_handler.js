// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => callback(data));
    },
    _api_put: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => callback(data));
    },

    _api_delete: function (url, data, callback) {
        fetch(url, {
            method: "DELETE",
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify(data)
        })
            .then(response =>response.json())
            .then(data => callback(data))
    },

    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
        this._api_get(`/get-board/${boardId}`, (response) => {
            this._data['board'] = response;
        });
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        this._api_get('/get-statuses', (response) => {
            this._data['statuses'] = response;
            callback(response)
        })
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
        this._api_get(`/get-status/${statusId}`, (response) => {
            this._data['status'] = response;
            callback(response);
        });
    },
    getCards: function (callback) {
        // the cards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-cards', (response) => {
            this._data['AllCards'] = response;
            callback(response);
        });
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get(`/get-cards/${boardId}`, (response) => {
            this._data['cards'] = response;
            // console.log(response);
            callback(response);
        });
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
        this._api_get(`/get-card/${cardId}`), (response) => {
            this._data['cards'] = response;
            callback(response);
        }
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        const json = {"title": boardTitle};
        this._api_post("/new-board-created", json, (response) => {
            this._data['boards'] = response;
            callback(response);
        })

    },
    createNewCard: function (cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
        const json = {"title": cardTitle, "board_id": boardId, "status_id": statusId};
        this._api_post("/new-card-created", json, (response) => {
            this._data['cards'] = response;
            callback(response);
        })
    },

    createNewColumn: function (statusName, callback) {
        // creates new column, saves it and calls the callback function with its data
        const json = {"title": statusName};
        this._api_post("/new-column-created", json, (response) => {
            this._data['statuses'] = response;
            callback(response);
        })
    },

    // here comes more features

    getStatusesForBoard: function () {
        //console.log("SStarta");
        let current_Cards = this.getCardsByBoardId('BoardID1',function() {console.log("GET CARDS")});
       // console.log(current_Cards);
    },

    getBoardID: function (boardTitle) {
        let boardId = boardTitle.replace(/\D/g, "");
        return Number(boardId);
    },

    getStatusID:  function (statusTitle, boardId) {
        //OLD
   /*     if (statusTitle === `${boardId}new`) {return 0;}
        if (statusTitle === `${boardId}in-progress`) {return 1;}
        if (statusTitle === `${boardId}testing`) {return 2;}
        if (statusTitle === `${boardId}done`) {return 3;}
        else {console.log("Incorrect status number");}*/

        //NEW
       // console.log(statusTitle, boardId);
        let AllStatuses = this.getAllStatuses(); //get all existing statuse
        for (let status of AllStatuses) {
            //console.log(statusTitle +"|"+ `${boardId+status.title}`);
            if (statusTitle === `${boardId+status.title}`) {return status.id;}
        }
        console.log("Invalid status number")
    },
    getCardID: function (cardTitle) {
        let cardId = cardTitle.replace(/\D/g, "");
        return Number(cardId);
    },
    updateBoardName: function (boardId, boardTitle, callback) {
        const json = {"id": boardId, "title": boardTitle};
        this._api_put("/board-renamed", json, (response) => {
            this._data['boards'] = response;
            callback(response);
        })
    },

    deleteBoard: function (boardId, callback) {
        const json = {"id": boardId};
        this._api_delete('/board-deleted', json, (response) => {
            this._data['boards'] = response;
            callback(response);
        })
    },

    getAllStatuses: function () {
        //console.log(this._data.statuses);
        return this._data.statuses;
    },

    addNewStatus: function (boardID, statusName) {
        console.log("Added new status: " + statusName + " for board" + boardID);
        let AllStatuses = this.getAllStatuses(); //get all existing statuses
        let NewID = AllStatuses.length; //get ID for new status
        console.log(NewID);
    },
    updateCardName: function (cardId, cardTitle, callback) {
        const json = {"id": cardId, "title": cardTitle};
        this._api_put("/card-renamed", json, (response) => {
            this._data['cards'] = response;
            callback(response);
        })
    },
    updateColumnName: function (boardId, oldColumnName, newColumnName, callback) {
         console.log("Rename column - to be updated in data_handler");
         console.log("Old column name "+oldColumnName);
         console.log("New column name: "+newColumnName+" in board: "+boardId);

        oldColumnName = oldColumnName.replace(/\s/g, "");//remove white spaces from name
        newColumnName = newColumnName.replace(/\s/g, "");//remove white spaces from name

        let boardPrefix = "BoardID";
        let oldStatusID = this.getStatusID(boardPrefix+boardId+oldColumnName, boardPrefix+boardId);

        const json = {"id": oldStatusID, "title": newColumnName};
        this._api_put("/column-renamed", json, (response) => {
            this._data['last_status'] = response;
            console.log(response)
            callback(response);
        })
/*        //TO UPDATE: should be: get ID of new status and assign the new status to cards
        this.createNewColumn(newColumnName, function(newColumnName) {console.log("New column added: "+newColumnName)});;
        let newStatusID = this._data.statuses.length;
        console.log(newStatusID);*/
    },

    updateCardStatus: function (cardId, newCardStatus, newCardBoard, order, callback) {
        const json = {"id": cardId, "status_id": newCardStatus, "board_id": newCardBoard, "order":order };
        this._api_put("/card-restatused", json, (response) => {
            this._data['cards'] = response;
            callback(response);
        })
    },

};