from db import get_underlying_tokens, save_tokens_price, get_solvest_tokens, update_solvest_tokens_price, get_index_tokens, update_index_tokens_price
import requests, os, time
from dotenv import load_dotenv

# ENV Variables
DOTENV_PATH = os.path.join(os.path.dirname(__file__), '../../.env')
load_dotenv(DOTENV_PATH)

COINCAP_URL = os.environ.get("COINCAP_PRICE_URL")

def save_sol_tokens_prices():
    try:
        all_tokens = get_underlying_tokens()
        offset = 0
        db_data = list()
        updated = list()
        while len(all_tokens) > len(updated):
            time.sleep(10)
            params = {"offset": offset, "limit": 2000}
            res = requests.get(COINCAP_URL, params=params)
            if res.status_code == 200 and res.json()['data']:
                for token in all_tokens:
                    for row in res.json()['data']:
                        if row['baseSymbol'] == token.symbol and token.symbol not in updated:
                            print(row['baseSymbol'])
                            updated.append(row['baseSymbol'])
                            db_data.append({
                                "address": token.address,
                                "name": token.name,
                                "symbol": token.symbol,
                                "price": row['priceUsd']
                            })
            offset += 2000
        # for token in all_tokens:
        #     params = {"baseSymbol": token.symbol}
        #     res = requests.get(COINCAP_URL, params=params)
        #     print(res)
        #     if res.status_code == 200:
        #         data = res.json()
        #         if data['data']:
        #             db_data.append({
        #                 "address": token.address,
        #                 "name": token.name,
        #                 "symbol": token.symbol,
        #                 "price": data['data'][0]['priceUsd']
        #             })
        if db_data:
            save_tokens_price(db_data)
        return True
    except Exception as e:
        print(e)
        return False


def save_solvest_token_price():
    try:
        tokens = get_solvest_tokens()
        print(tokens)
        updated_price_dic = dict()
        for token in tokens:
            if token.solvest_symbol not in updated_price_dic:
                updated_price_dic[token.solvest_symbol] = 0
            updated_price_dic[token.solvest_symbol] += token.weight * token.price
        print(updated_price_dic)
        update_solvest_tokens_price(updated_price_dic)
        return True
    except Exception as e:
        print(e)
        return False

def save_index_tokens_price():
    try:
        tokens = get_index_tokens()
        print(tokens)
        updated_price_dic = dict()
        for token in tokens:
            if token.solvest_symbol not in updated_price_dic:
                updated_price_dic[token.solvest_symbol] = 0
            updated_price_dic[token.solvest_symbol] += token.weight * token.price
        print(updated_price_dic)
        update_index_tokens_price(updated_price_dic)
        return True
    except Exception as e:
        print(e)
        return False

if __name__ == '__main__':
    save_sol_tokens_prices()
    save_solvest_token_price()
    save_index_tokens_price()
    exit()