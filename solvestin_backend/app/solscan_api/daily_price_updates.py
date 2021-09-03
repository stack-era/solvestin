import requests, os
from db import get_tokens_for_candle_prices, add_token_daily_data, get_all_user_id, save_user_historical_portfolio, get_last_portfolio_update
from datetime import datetime, timedelta
from dotenv import load_dotenv

# ENV Variables
DOTENV_PATH = os.path.join(os.path.dirname(__file__), '../../.env')
load_dotenv(DOTENV_PATH)
COINCAP_PRICE_URL=os.environ.get('COINCAP_PRICE_URL')
COINCAP_CANDLE_URL=os.environ.get('COINCAP_CANDLE_URL')

BASE_URL = os.environ.get("SOLSCAN_BASE_URL")
TOKENS_URL = os.environ.get("SOLANA_TOKENS_URL")
COINCAP_URL = os.environ.get("COINCAP_PRICE_URL")
SOLBEACH_URL = os.environ.get("SOLBEACH_API_URL")
SOLBEACH_TOKEN = os.environ.get("SOLBEACH_TOKEN")
SOL_ADDRESS = os.environ.get("SOL_ADDRESS")

def main():
    try:
        start = int((datetime.now() - timedelta(days=2)).timestamp())
        end = datetime.now().timestamp()
        tokens = get_tokens_for_candle_prices()
        for token in tokens:
            params = {"baseSymbol": token.symbol}
            price_res = requests.get(COINCAP_PRICE_URL, params=params)
            if price_res.status_code == 200:
                # print(price_res.json())
                data = price_res.json()
                params = {
                    "exchange": data['data'][0]['exchangeId'],
                    "baseId":  data['data'][0]['baseId'],
                    "quoteId": data['data'][0]['quoteId'],
                    "interval": "d1",
                    "start": int(start) * 1000,
                    "end": int(end) * 1000
                }
                res = requests.get(COINCAP_CANDLE_URL, params=params)
                if res.status_code == 200:
                    db_data = list()
                    data = res.json()
                    for candle in data['data']:
                        db_data.append({
                            "address": token.address,
                            "date": (datetime.utcfromtimestamp(int(candle['period']/1000))).date(),
                            "closePrice": float(candle['close'])
                        })
                    print(db_data)
                    add_token_daily_data(db_data)
        return True
    except Exception as e:
        print(e)
        return False

def update_portfolio():
    try:
        users = get_all_user_id()
        for user in users:
            save_historical_portfolio(user.id, user.publicKey)
        return True
    except Exception as e:
        print(e)
        return False

def save_historical_portfolio(userId, publicKey):
    try:
        last_epoch = get_last_portfolio_update(userId)
        # Get transactions, loop through them to find token chaneges and save to db
        if not last_epoch:
            last_epoch = int((datetime.now() - timedelta(days=20)).timestamp())
        print(last_epoch)
        transactions = True
        transactions_url = "{}/account/{}/transactions".format(SOLBEACH_URL, publicKey)
        headers = {"Authorization": "Bearer {}".format(SOLBEACH_TOKEN)}
        offset = 0
        limit = 1000
        tmp_balances = dict()
        while transactions:
            db_data = list()
            # transactions var will be False if no more transactions available or if one year transactions are parsed
            params = {"limit": limit, "offset": offset}
            resp = requests.get(transactions_url, params=params, headers=headers)
            print(resp)
            if resp.status_code == 200:
                data = resp.json()
                if not data:
                    transactions = False
                    break
                for tx in data:
                    if tx['blocktime']['absolute'] > last_epoch:
                        if SOL_ADDRESS not in tmp_balances or not tmp_balances[SOL_ADDRESS] != tx['meta']['postBalances'][0]:
                            db_data.append({
                                "userId": userId,
                                "balanceTimestamp": datetime.utcfromtimestamp(tx['blocktime']['absolute']),
                                "tokenAddress": SOL_ADDRESS,
                                "balance": tx['meta']['postBalances'][0] / 1000000000
                            })
                            tmp_balances[SOL_ADDRESS] = tx['meta']['postBalances'][0]
                        for token in tx['meta']['postTokenBalances']:
                            if not token['uiTokenAmount']['uiAmount']:
                                token['uiTokenAmount']['uiAmount'] = 0
                            if token['mint']['address'] not in tmp_balances or tmp_balances[token['mint']['address']] != token['uiTokenAmount']['uiAmount']:
                                db_data.append({
                                    "userId": userId,
                                    "balanceTimestamp": datetime.utcfromtimestamp(tx['blocktime']['absolute']),
                                    "tokenAddress": token['mint']['address'],
                                    "balance": token['uiTokenAmount']['uiAmount']
                                })
                                tmp_balances[token['mint']['address']] = token['uiTokenAmount']['uiAmount']
                    else:
                        transactions = False
                        break
                    offset += 1000
            save_user_historical_portfolio(db_data)
    except Exception as e:
        print(e)
        return False

if __name__ == '__main__':
    main()
    update_portfolio()
    exit()
