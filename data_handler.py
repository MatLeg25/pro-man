import persistence


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['id'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards(force=True)


def get_cards():
    """
    Gather all cards
    :return:
    """
    return persistence.get_cards(force=True)


def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


def create_board(board_name):
    """
    Create new board element
    :return:
    """
    return persistence.add_new_board(board_name)


def create_card(card_data):
    """
    Create new board element
    :return:
    """
    return persistence.add_new_card(card_data)


def create_status(status_data):
    """
    Create new status
    :return:
    """
    return persistence.add_new_status(status_data)


def get_card(card_id):
    all_cards = persistence.get_cards()
    matching_card = ''
    for card in all_cards:
        if (int(card['id']) == card_id):
            matching_card = card
    return matching_card


def get_statuses():
    return persistence.get_statuses(force=True)


def get_status(status_id):
    all_statuses = get_statuses()
    for status in all_statuses:
        if status_id == int(status['id']):
            print(status)
            return status


def get_board(board_id):
    """
    Gather selected board
    :return:
    """
    all_boards = get_boards()

    for board in all_boards:
        if board_id == int(board['id']):
            print(board)
            return board


def create_board(board_name):
    """
    Create new board element
    :return:
    """
    return persistence.add_new_board(board_name)


def delete_board(board_id):
    """
    Delete specific board
    """
    return persistence.remove_board(board_id)


def create_card(card_data):
    """
    Create new card element
    :return:
    """
    return persistence.add_new_card(card_data)


def update_board_name(board_data):
    """
    Rename board element
    :return:
    """
    return persistence.rename_board(board_data)


def update_card_name(card_data):
    """
    Rename board element
    :return:
    """
    return persistence.rename_card(card_data)


def update_card_status(card_data):
    """
    Rename board element
    :return:
    """
    return persistence.reorder_card(card_data)


def update_column_name(column_data):
    """
    Rename board element
    :return:
    """
    return persistence.rename_column(column_data)
