import csv

STATUSES_FILE = './data/statuses.csv'
BOARDS_FILE = './data/boards.csv'
CARDS_FILE = './data/cards.csv'

_cache = {}  # We store cached data in this dict to avoid multiple file readings


def _read_csv(file_name):
    """
    Reads content of a .csv file
    :param file_name: relative path to data file
    :return: OrderedDict
    """
    with open(file_name) as boards:
        rows = csv.DictReader(boards, delimiter=',', quotechar='"')
        formatted_data = []
        for row in rows:
            formatted_data.append(dict(row))
        return formatted_data


def _append_csv(file_name, data):
    """
    Writes data content to a .csv file
    :param file_name: relative path to data file
    :param data: data to be written into the data file
    :return: OrderedDict
    """
    headers = _read_csv(file_name)[0].keys()
    with open(file_name, "a", newline="") as boards:
        csv_writer = csv.DictWriter(boards, fieldnames=headers, delimiter=',', quotechar='"',
                                    quoting=csv.QUOTE_NONNUMERIC)
        csv_writer.writerow(data)


def _write_csv(file_name, data):
    """
    Writes data content to a .csv file
    :param file_name: relative path to data file
    :param data: data to be written into the data file
    :return: OrderedDict
    """
    headers = data[0].keys()
    with open(file_name, "w", newline="") as boards:
        csv_writer = csv.DictWriter(boards, fieldnames=headers, delimiter=',', quotechar='"')
        csv_writer.writeheader()
        csv_writer = csv.DictWriter(boards, fieldnames=headers, delimiter=',', quotechar='"',
                                    quoting=csv.QUOTE_NONNUMERIC)
        for row in data:
            if file_name == BOARDS_FILE:
                row['id'] = int(row['id'])
            elif file_name == CARDS_FILE:
                row['id'] = int(row['id'])
                row['order'] = int(row['order'])
                row['status_id'] = int(row['status_id'])
                row['board_id'] = int(row['board_id'])

            csv_writer.writerow(row)


# def _delete_csv(filename, board_id):
#     updated_list = []
#     with open(filename, "r", newline="") as f:
#         reader = csv.reader(f)
#         print(reader)
#         for row in reader:
#             if row[0] != "id":
#                 if row[0] != str(board_id):
#                     updated_list.append(row)
#                     print(row)
#     with open(filename, "w", newline="") as file:
#         writer = csv.writer(file)
#         writer.writerows(updated_list)


def _get_data(data_type, file, force):
    """
    Reads defined type of data from file or cache
    :param data_type: key where the data is stored in cache
    :param file: relative path to data file
    :param force: if set to True, cache will be ignored
    :return: OrderedDict
    """
    if force or data_type not in _cache:
        _cache[data_type] = _read_csv(file)
    return _cache[data_type]


def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)


def get_statuses(force=False):
    return _get_data('statuses', STATUSES_FILE, force)


def get_boards(force=False):
    return _get_data('boards', BOARDS_FILE, force)


def get_cards(force=False):
    return _get_data('cards', CARDS_FILE, force)


def add_new_board(data, force=False):
    board_id = len(_get_data('boards', BOARDS_FILE, force)) + 1
    data["id"] = board_id
    _append_csv(BOARDS_FILE, data)
    return board_id


def add_new_card(data, force=False):
    cards = (_get_data('cards', CARDS_FILE, force))
    card_id = len(cards) + 1
    order = 0
    for card in cards:
        if int(data['board_id']) == int(card['board_id']):
            if int(data['status_id']) == int(card['status_id']):
                order = int(card['order']) + 1
    data["id"] = card_id
    data["order"] = order
    _append_csv(CARDS_FILE, data)
    return card_id


def add_new_status(data, force=False):
    status_id = len(_get_data('statuses', STATUSES_FILE, force))
    print(data)
    data["id"] = status_id
    _append_csv(STATUSES_FILE, data)
    return status_id


def rename_board(data, force=False):
    cached_data = _get_data('boards', BOARDS_FILE, force)
    for index, board in enumerate(cached_data):
        if int(board['id']) == data['id']:
            cached_data[index] = data
            print(cached_data[index])
    _write_csv(BOARDS_FILE, cached_data)
    return data["id"]


def rename_card(data, force=False):
    cached_data = _get_data('cards', CARDS_FILE, force)
    for index, card in enumerate(cached_data):
        if int(card['id']) == data['id']:
            # Check if cards id is the same with id of changed card. If yes then:
            # add to data order, status_id and board_id of this card (because there is no one from json)
            # and all the data of new card put into cached_data of proper index. Then write cached_data in csv
            data['board_id'] = card['board_id']
            print(card['status_id'])
            data['status_id'] = card['status_id']
            data['order'] = card['order']
            cached_data[index] = data
            print(cached_data[index])
    print("next cached_data")
    print(cached_data)
    _write_csv(CARDS_FILE, cached_data)
    return data["id"]


def reorder_card(data, force=False):
    cached_data = _get_data('cards', CARDS_FILE, force)
    for index, card in enumerate(cached_data):
        if int(card['id']) == data['id']:
            # Check if cards id is the same with id of changed card. If yes then:
            # add to data order and title of this card (because there is no one from json)
            # and all the data of new card put into cached_data of proper index. Then write cached_data in csv
            data['title'] = card['title']
           # data['order'] = card['order']
            cached_data[index] = data
            print(cached_data[index])
    print("next cached_data")
    print(cached_data)
    _write_csv(CARDS_FILE, cached_data)
    return data["id"]


def rename_column(data, force=False):
    cached_data = _get_data('statuses', STATUSES_FILE, force)
    print("cached data below")
    print(cached_data)
    for index, column in enumerate(cached_data):
        if int(column['id']) == int(data['id']):
            # Check if cards id is the same with id of changed card. If yes then:
            # add to data order, status_id and board_id of this card (because there is no one from json)
            # and all the data of new card put into cached_data of proper index. Then write cached_data in csv
            data['title'] = column['title']
            cached_data[index] = data
            print(cached_data[index])
    print("next cached_data")
    print(cached_data)
    _write_csv(STATUSES_FILE, cached_data)
    return data["id"]

def remove_card_from_board(board_id, force=False):
    cached_data = _get_data('cards', CARDS_FILE, force)
    for index, card in enumerate(cached_data):
        if int(card['board_id']) == board_id['id']:
            del cached_data[index]
    _write_csv(CARDS_FILE, cached_data)
    return cached_data


def remove_board(board_id, force=True):
    cached_data = _get_data('boards', BOARDS_FILE, force)
    for index, board in enumerate(cached_data):
        if int(board['id']) == board_id["id"]:
            del cached_data[index]
    _write_csv(BOARDS_FILE, cached_data)
    remove_card_from_board(board_id)
    return cached_data
