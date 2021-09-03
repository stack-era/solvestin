import requests, os, time
from dotenv import load_dotenv
from .db import add_update_balances, add_update_tokens, save_user_historical_portfolio, get_last_portfolio_update
from datetime import datetime, timedelta

# ENV Variables
DOTENV_PATH = os.path.join(os.path.dirname(__file__), '../../.env')
load_dotenv(DOTENV_PATH)
BASE_URL = os.environ.get("SOLSCAN_BASE_URL")
TOKENS_URL = os.environ.get("SOLANA_TOKENS_URL")
COINCAP_URL = os.environ.get("COINCAP_PRICE_URL")
SOLBEACH_URL = os.environ.get("SOLBEACH_API_URL")
SOLBEACH_TOKEN = os.environ.get("SOLBEACH_TOKEN")
SOL_ADDRESS = os.environ.get("SOL_ADDRESS")


class Solscan():
    def __init__(self, publicKey = None):
        self.publicKey = publicKey

    def update_balances_in_db(self, userId):
        try:
            db_data = list()
            url = "{}/account/tokens".format(BASE_URL)
            params = {
                "address": self.publicKey,
                "price": 1
            }
            resp = requests.get(url, params=params)
            data = resp.json()
            if data['succcess']:
                for row in data["data"]:
                    db_data.append({
                        "userId": userId,
                        "tokenAccount": row["tokenAccount"],
                        "tokenName": row["tokenName"],
                        "tokenSymbol": row["tokenSymbol"],
                        "tokenIcon": row["tokenIcon"],
                        "priceUsdt": row["priceUsdt"] if "priceUsdt" in row else None,
                        "tokenAmountUI": row["tokenAmount"]["uiAmount"]
                    })
            else:
                return {"success": False, "message": "Error occured while Updating balacnes in DB"}
            status = add_update_balances(db_data)
            if status:
                return {"success": True, "message": "Updated balacnes in DB"}
            else:
                return {"success": False, "message": "Error occured while Updating balacnes in DB"}
        except Exception as e:
            print(e)
            return {"success": False, "message": "Error occured while Updating balacnes in DB"}

    def get_solana_balance(self):
        try:
            # Get account balance
            bal_url = "{}/account".format(BASE_URL)
            params = {"address": self.publicKey}
            bal_resp = requests.get(bal_url, params=params)
            bal_data = bal_resp.json()
            if bal_data['succcess']:
                lamports = bal_data['data']['lamports']
                sol = lamports / 1000000000
            else:
                return {"success": False, "message": "Error occured while fetching balance."}
            #Get SOL price
            price_url = "{}/market".format(BASE_URL)
            params = {"symbol": "SOL"}
            price_resp = requests.get(price_url, params=params)
            price_data = price_resp.json()
            if price_data['success']:
                price = price_data['data']['priceUsdt']
            else:
                return {"success": False, "message": "Error occured while fetching balance."}

            account_sol_amount = price * sol
            response = {
                "success": True,
                "SOLbalance": round(sol, 4),
                "USDTbalance": round(account_sol_amount, 2),
                "SOLcurrPrice": price
            }
            return response
        except Exception as e:
            print(e)
            return {"success": False, "message": "Error occured while fetching balance."}

    def get_tokens(self, limit, offset):
        try:
            url = "{}/tokens".format(BASE_URL)
            params = {"limit": limit, "offset": offset}
            token_resp = requests.get(url, params=params)
            token_data = token_resp.json()
            if token_data['succcess']:
                return token_data['data']
            else:
                return {"success": False, "message": "Error occured while fetching tokens."}
        except Exception as e:
            print(e)
            return {"success": False, "message": "Error occured while fetching tokens."}

    def save_tokens(self):
        try:
            db_data = list()
            url = TOKENS_URL
            tokens_response = requests.get(url)
            if tokens_response.status_code == 200:
                data = tokens_response.json()
                for token in data['tokens']:
                    if token['chainId'] == 101:
                        priceAvailable = False
                        params = {"baseSymbol": token['symbol']}
                        price_res = requests.get(COINCAP_URL, params=params)
                        print(price_res)
                        price_res = price_res.json()
                        if price_res['data']:
                            priceAvailable = True
                        db_data.append({
                            "address": token['address'],
                            "chainId": token['chainId'],
                            "decimals": token['decimals'],
                            "logoURI": token['logoURI'] if 'logoURI' in token else None,
                            "name": token['name'],
                            "symbol": token['symbol'],
                            "priceAvailable": priceAvailable
                        })
                if add_update_tokens(db_data) != False:
                    return {"success": True, "message": "Updated tokens in database."}
                else:
                    return {"success": False, "message": "Error occured while saving tokens"}
            else:
                return {"success": False, "message": "Error occured while saving tokens"}
        except Exception as e:
            print(e)
            return {"success": False, "message": "Error occured while saving tokens"}

    def get_token_transactions(self, token_address, limit, offset):
        try:
            url = "{}/token/{}/transfers".format(SOLBEACH_URL, token_address)
            headers = {"Authorization": "Bearer {}".format(SOLBEACH_TOKEN)}
            params = {'limit': limit, 'offset': offset}
            res = requests.get(url, params=params, headers=headers)
            if res.status_code == 200:
                return res.json()
            else:
                return {"success": False, "message": "Error occured while getting transactions"}
        except Exception as e:
            print(e)
            return {"success": False, "message": "Error occured while getting transactions"}

    def get_user_transactions(self, limit, offset):
        try:
            url = "{}/account/{}/transactions".format(SOLBEACH_URL, self.publicKey)
            headers = {"Authorization": "Bearer {}".format(SOLBEACH_TOKEN)}
            params = {'limit': limit, 'offset': offset}
            res = requests.get(url, params=params, headers=headers)
            if res.status_code == 200:
                return res.json()
            else:
                return {"success": False, "message": "Error occured while getting transactions"}
        except Exception as e:
            print(e)
            return {"success": False, "message": "Error occured while getting transactions"}


    def save_historical_portfolio(self, userId):
        last_epoch = get_last_portfolio_update(userId)
        # Get transactions, loop through them to find token chaneges and save to db
        if not last_epoch:
            last_epoch = int((datetime.now() - timedelta(days=20)).timestamp())
        print(last_epoch)
        transactions = True
        transactions_url = "{}/account/{}/transactions".format(SOLBEACH_URL, self.publicKey)
        headers = {"Authorization": "Bearer {}".format(SOLBEACH_TOKEN)}
        offset = 0
        limit = 200
        tmp_balances = dict()
        while transactions:
            db_data = list()
            # transactions var will be False if no more transactions available or if one year transactions are parsed
            params = {"limit": limit, "offset": offset}
            resp = requests.get(transactions_url, params=params, headers=headers)
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
                    offset += 200
            save_user_historical_portfolio(db_data)