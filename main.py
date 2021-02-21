from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-board/<int:board_id>")
@json_response
def get_board(board_id: int):
    """
    Selected board
    :param board_id: id of the board
    """
    return data_handler.get_board(board_id)


@app.route("/get-cards/BoardID<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/get-cards")
@json_response
def get_cards():
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards()


@app.route("/new-board-created", methods=["POST"])
@json_response
def create_board():
    """
    Create new board
    """
    board_name = request.get_json()
    board_id = data_handler.create_board(board_name)
    return data_handler.get_board(board_id)


@app.route('/board-deleted', methods=['DELETE'])
@json_response
def delete_board():
    """
    Delete specific board
    """
    board_id = request.get_json()
    return data_handler.delete_board(board_id)


@app.route("/get-card/<int:card_id>")
@json_response
def get_card(card_id: int):
    """
    Card by id
    param: card_id: id of desired card
    """

    return data_handler.get_card(card_id)


@app.route("/new-card-created", methods=["POST"])
@json_response
def create_card():
    """
    Create new board
    """
    card_data = request.get_json()
    card_id = data_handler.create_card(card_data)
    return data_handler.get_card(card_id)


@app.route("/get-statuses")
@json_response
def get_statuses():
    return data_handler.get_statuses()


@app.route("/get-status/<int:status_id>")
@json_response
def get_status(status_id: int):
    return data_handler.get_status(status_id)


@app.route("/new-column-created", methods=["POST"])
@json_response
def create_status():
    """
    Create new status
    """
    status_data = request.get_json()
    status_id = data_handler.create_status(status_data)
    print(data_handler.get_status(status_id))
    return data_handler.get_status(status_id)


@app.route("/board-renamed", methods=["PUT"])
@json_response
def rename_board():
    """
    Update board name
    """
    board_data = request.get_json()
    board_id = data_handler.update_board_name(board_data)
    return data_handler.get_board(board_id)


@app.route("/card-renamed", methods=["PUT"])
@json_response
def rename_card():
    """
    Update board name
    """
    card_data = request.get_json()
    card_id = data_handler.update_card_name(card_data)
    print("cardID")
    print(card_id)
    return data_handler.get_card(int(card_id))


@app.route("/column-renamed", methods=["PUT"])
@json_response
def rename_column():
    """
    Update board name
    """
    column_data = request.get_json()
    column_id = data_handler.update_column_name(column_data)
    print(column_data)
    return data_handler.get_status(int(column_id))


@app.route("/card-restatused", methods=["PUT"])
@json_response
def restatus_card():
    """
    Update board name
    """
    card_data = request.get_json()
    print("DATA")
    print(card_data)
    card_id = data_handler.update_card_status(card_data)

    print("cardID")
    print(card_id)
    return data_handler.get_card(int(card_id))


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
