from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.sql.functions import mode
from database import *
from app.solscan_api.solscan_api import Solscan
from .. import models, schemas
from datetime import datetime, date, timedelta
from sqlalchemy import DATE, cast, func, distinct, text
from app.solscan_api.streams_api import start_stream

router = APIRouter()

def get_user_id(address: str, db: Session):
    try:
        res = db.query(models.UsersKey).with_entities(models.UsersKey.id).filter(models.UsersKey.publicKey == address).first()
        if not res:
            return None
        return res.id
    except Exception as e:
        print(e)
        return False

def get_available_balances(key: str, db: Session):
    try:
        check = db.query(models.UsersKey).filter(models.UsersKey.publicKey == key).first()
        if not check:
            return {"success": False, "message": "Key does not exist in database, please add."}
        yesterday_date = date.today() - timedelta(days=1)
        week_date = date.today() - timedelta(days=7)
        print(yesterday_date)
        res = db.query(models.Balances).with_entities(models.Balances.priceUsdt, models.Balances.tokenName, models.Balances.tokenSymbol, models.Balances.tokenIcon, models.Balances.tokenAmountUI, ((models.Balances.priceUsdt / models.TokensDailyData.closePrice) - 1).label('todayChange'))\
                .join(models.SolanaTokens, models.SolanaTokens.symbol == models.Balances.tokenSymbol).join(models.TokensDailyData, models.SolanaTokens.address == models.TokensDailyData.tokenAddress)\
                .filter(models.Balances.userId == check.id, models.Balances.priceUsdt != None, models.TokensDailyData.date == yesterday_date).all()
        weekly = db.query(models.Balances).with_entities(func.sum((models.Balances.priceUsdt / models.TokensDailyData.closePrice) - 1).label('weekChange'))\
                .join(models.SolanaTokens, models.SolanaTokens.symbol == models.Balances.tokenSymbol).join(models.TokensDailyData, models.SolanaTokens.address == models.TokensDailyData.tokenAddress)\
                .filter(models.Balances.userId == check.id, models.Balances.priceUsdt != None, models.TokensDailyData.date == week_date).all()
        symbol_list = list()
        data = list()
        for row in res:
            if row.tokenSymbol not in symbol_list:
                data.append(row._asdict())
            symbol_list.append(row.tokenSymbol)
        res = {"data": data, "weekly": weekly}
        return res
    except Exception as e:
        print(e)
        return {"succeed": False, "message": "Error occured while getting available balances"}

def update_balances(key: str, db: Session):
    try:
        check = db.query(models.UsersKey).filter(models.UsersKey.publicKey == key).first()
        if not check:
            return {"success": False, "message": "Key does not exist in database, please add."}
        obj = Solscan(key)
        res = obj.update_balances_in_db(check.id)
        return res
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while updating balances in database."}

def save_tokens_in_db():
    try:
        obj = Solscan()
        obj.save_tokens()
    except Exception as e:
        print(e)

def fetch_solvest_tokens(db):
    try:
        yesterday_date = date.today() - timedelta(days=1)
        t = db.query(func.max(models.TokensPriceHistory.timestamp)).scalar_subquery()
        t2 = db.query(func.max(models.SolvestTokensHistory.timestamp)).filter(cast(models.SolvestTokensHistory.timestamp, DATE) == yesterday_date).scalar_subquery()
        res = db.query(models.SolvestTokens).with_entities(models.SolvestTokens.id, models.SolvestTokens.symbol.label("solvest_tkn_symbol"), models.SolvestTokens.name.label("solvest_tkn_name"), models.SolvestTokens.latestPrice.label("solvest_tkn_price"), models.UnderlyingTokens.symbol.label("under_tkn_symbol"), models.UnderlyingTokens.name.label("under_tkn_name"), models.UnderlyingTokens.weight.label("under_tkn_weight"), models.TokensPriceHistory.price.label("under_tkn_price"), ((models.SolvestTokens.latestPrice / models.SolvestTokensHistory.price) - 1).label("dayChange"))\
            .join(models.UnderlyingTokens, models.UnderlyingTokens.parentToken == models.SolvestTokens.id)\
            .join(models.TokensPriceHistory, models.TokensPriceHistory.address == models.UnderlyingTokens.address)\
            .join(models.SolvestTokensHistory, models.SolvestTokensHistory.symbol == models.SolvestTokens.symbol)\
            .filter(models.TokensPriceHistory.timestamp == t, models.SolvestTokensHistory.timestamp == t2).all()
        response = dict()
        for row in res:
            if row.solvest_tkn_symbol not in response:
                response[row.solvest_tkn_symbol] = {"id": row.id, "price": row.solvest_tkn_price, "name": row.solvest_tkn_name, "dayChange": row.dayChange, "underlyingTokens": [{row.under_tkn_symbol: {"name": row.under_tkn_name, "weight": row.under_tkn_weight, "price": row.under_tkn_price}}]}
            else:
                response[row.solvest_tkn_symbol]["underlyingTokens"].append({row.under_tkn_symbol: {"name": row.under_tkn_name, "weight": row.under_tkn_weight, "price": row.under_tkn_price}})
        return response
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while fetching tokens."}

def fetch_index_tokens(db):
    try:
        yesterday_date = date.today() - timedelta(days=1)
        t = db.query(func.max(models.TokensPriceHistory.timestamp)).scalar_subquery()
        t2 = db.query(func.max(models.IndexTokensHistory.timestamp)).filter(cast(models.IndexTokensHistory.timestamp, DATE) == yesterday_date).scalar_subquery()
        res = db.query(models.IndexTokens).with_entities(models.IndexTokens.id, models.IndexTokens.symbol.label("solvest_tkn_symbol"), models.IndexTokens.name.label("solvest_tkn_name"), models.IndexTokens.latestPrice.label("solvest_tkn_price"), models.IndexUnderlyingTokens.symbol.label("under_tkn_symbol"), models.IndexUnderlyingTokens.name.label("under_tkn_name"), models.IndexUnderlyingTokens.weight.label("under_tkn_weight"), models.TokensPriceHistory.price.label("under_tkn_price"), ((models.IndexTokens.latestPrice / models.IndexTokensHistory.price) - 1).label("dayChange"))\
            .join(models.IndexUnderlyingTokens, models.IndexUnderlyingTokens.parentToken == models.IndexTokens.id)\
            .join(models.TokensPriceHistory, models.TokensPriceHistory.address == models.IndexUnderlyingTokens.address)\
            .join(models.IndexTokensHistory, models.IndexTokensHistory.symbol == models.IndexTokens.symbol)\
            .filter(models.TokensPriceHistory.timestamp == t, models.IndexTokensHistory.timestamp == t2).all()
        response = dict()
        for row in res:
            if row.solvest_tkn_symbol not in response:
                response[row.solvest_tkn_symbol] = {"id": row.id, "price": row.solvest_tkn_price, "name": row.solvest_tkn_name, "dayChange": row.dayChange, "underlyingTokens": [{row.under_tkn_symbol: {"name": row.under_tkn_name, "weight": row.under_tkn_weight, "price": row.under_tkn_price}}]}
            else:
                response[row.solvest_tkn_symbol]["underlyingTokens"].append({row.under_tkn_symbol: {"name": row.under_tkn_name, "weight": row.under_tkn_weight, "price": row.under_tkn_price}})
        return response
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while fetching tokens."}

def save_user_stream(streamData: schemas.StreamCreate, db: Session, background_tasks: BackgroundTasks):
    try:
        user_id = get_user_id(streamData.publicAddress, db)
        if user_id is None:
            return {"success": False, "message": "User Key not found."}
        elif user_id == False:
            return {"success": False, "message": "Error occured while creating stream."}
        insertStream = models.UserStreams(userId=user_id, solvestToken=1, startTime=streamData.startTime, interval=streamData.interval, active=True, totalAmount=streamData.totalAmount, endTime=streamData.endTime, investPda=streamData.investPda)
        db.add(insertStream)
        db.commit()
        background_tasks.add_task(start_stream, streamData.publicAddress, streamData.investPda, insertStream.id)
        return {"success": True, "message": "Added stream successfully"}
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while adding stream."}

def fetch_key_streams(key: str, db: Session):
    try:
        user_id = get_user_id(key, db)
        if user_id is None:
            return {"success": False, "message": "User Key not found."}
        elif user_id == False:
            return {"success": False, "message": "Error occured while creating stream."}
        t = db.query(func.max(models.SolvestTokensHistory.timestamp)).scalar_subquery()
        res = db.query(models.UserStreams).with_entities(models.UserStreams.id, models.UserStreams.startTime, models.UserStreams.endTime, models.UserStreams.interval, models.UserStreams.active, models.UserStreams.totalAmount, models.SolvestTokens.name, models.SolvestTokens.symbol, models.SolvestTokensHistory.price)\
            .join(models.SolvestTokens, models.SolvestTokens.id == models.UserStreams.solvestToken)\
            .join(models.SolvestTokensHistory, models.SolvestTokensHistory.symbol == models.SolvestTokens.symbol).filter(models.UserStreams.userId == user_id, models.SolvestTokensHistory.timestamp == t).all()
        return res
    except Exception as e:
        print(e)
        return {"status": False, "message": "Error occured while getting streams."}

def stop_user_stream(streamId: int, db: Session):
    try:
        updateData = {"active": False, "endTime": datetime.now().timestamp()}
        db.query(models.UserStreams).filter(models.UserStreams.id == streamId).update(updateData, synchronize_session=False)
        db.commit()
        return {"success": True, "message": "Stream updated successfully"}
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while updating stream."}

def get_user_historical_portfolio(publicKey: str, db: Session):
    try:
        userId = get_user_id(publicKey, db)
        if userId is None:
            return {"success": False, "message": "User Key not found."}
        elif userId == False:
            return {"success": False, "message": "Error occured while getting portfolio."}
        res = db.query(models.UserHistoricalPortfolio).with_entities((func.date_trunc('hour', models.UserHistoricalPortfolio.timestamp)).label('date'), (func.avg(models.UserHistoricalPortfolio.balance * models.TokensDailyData.closePrice)).label('amount'), models.SolanaTokens.symbol)\
                .join(models.SolanaTokens, models.SolanaTokens.address == models.UserHistoricalPortfolio.tokenAddress)\
                .join(models.TokensDailyData, (models.TokensDailyData.tokenAddress == models.UserHistoricalPortfolio.tokenAddress) & (cast(text('date'), DATE) == models.TokensDailyData.date))\
                .group_by(models.UserHistoricalPortfolio.timestamp, models.SolanaTokens.symbol)\
                .order_by(text('date DESC')).filter(models.UserHistoricalPortfolio.userId == userId).all()
        portfolio_dic = dict()
        for row in res:
            if row['date'] not in portfolio_dic:
                portfolio_dic[row['date']] = [row['amount']]
            else:
                portfolio_dic[row['date']].append(row['amount'])
        for time in portfolio_dic:
            portfolio_dic[time] = sum(portfolio_dic[time]) / len(portfolio_dic[time])
        response = {"success": True, "data": portfolio_dic}
        return response
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while getting historical portfolio."}

def add_user_transaction(transactionData: schemas.SaveTransaction, db: Session):
    try:
        userId = get_user_id(transactionData.publicKey, db)
        if userId is None:
            return {"success": False, "message": "User Key not found."}
        elif userId == False:
            return {"success": False, "message": "Error occured while saving transaction."}
        insertTransaction = models.UserSolvestTransactions(userId=userId, tokenId=transactionData.tokenId, transactionId=transactionData.transactionId, side=transactionData.side, quantity=transactionData.quantity, timestamp=datetime.utcnow(), source=transactionData.source, destination=transactionData.destination)
        db.add(insertTransaction)
        db.commit()
        return {"success": True, "message": "Transaction added successfully."}
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while saving transaction."}

def get_user_transactions(publicKey: str, db: Session):
    try:
        userId = get_user_id(publicKey, db)
        if userId is None:
            return {"success": False, "message": "User Key not found."}
        elif userId == False:
            return {"success": False, "message": "Error occured while fetching transaction."}
        res = db.query(models.UserSolvestTransactions).with_entities(models.UserSolvestTransactions.transactionId, models.UserSolvestTransactions.side, models.UserSolvestTransactions.quantity, models.UserSolvestTransactions.timestamp, models.SolvestTokens.name, models.SolvestTokens.symbol, models.UserSolvestTransactions.source, models.UserSolvestTransactions.destination, models.SolvestTokens.latestPrice)\
                .join(models.SolvestTokens, models.SolvestTokens.id == models.UserSolvestTransactions.tokenId).filter(models.UserSolvestTransactions.userId == userId).order_by(models.UserSolvestTransactions.timestamp.desc()).all()
        return res
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while fetching transactions."}

def fetch_tokens_chart_data(symbol, db):
    try:
        res = db.query(models.TokensPriceHistory).with_entities(func.avg(models.TokensPriceHistory.price).label('price'), func.date_trunc('hour', models.TokensPriceHistory.timestamp).label('time'))\
                .filter(models.TokensPriceHistory.symbol == symbol)\
                .group_by(text('time'))\
                .order_by(text('time DESC')).all()
        return res
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while getting data."}

def fetch_solvest_tokens_chart_data(symbol, db):
    try:
        res = db.query(models.SolvestTokensHistory).with_entities(func.avg(models.SolvestTokensHistory.price).label('price'), func.date_trunc('hour', models.SolvestTokensHistory.timestamp).label('time'))\
                .filter(models.SolvestTokensHistory.symbol == symbol)\
                .group_by(text('time'))\
                .order_by(text('time DESC')).all()
        return res
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while getting data."}

def fetch_index_tokens_chart_data(symbol, db):
    try:
        res = db.query(models.IndexTokensHistory).with_entities(func.avg(models.IndexTokensHistory.price).label('price'), func.date_trunc('hour', models.IndexTokensHistory.timestamp).label('time'))\
                .filter(models.IndexTokensHistory.symbol == symbol)\
                .group_by(text('time'))\
                .order_by(text('time DESC')).all()
        return res
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while getting data."}
########################################################################################################
########################################################################################################

@router.get("/get_key_balances")
async def get_key_balances(key: str, db: Session = Depends(get_db)):
    # TODO : DELETE
    key = "Bxp8yhH9zNwxyE4UqxP7a7hgJ5xTZfxNNft7YJJ2VRjT"
    res = get_available_balances(key, db)
    return res

@router.post("/update_balances_in_db")
async def update_balances_in_db(key: str, db: Session = Depends(get_db)):
    res = update_balances(key, db)
    return res

@router.get("/get_sol_balance")
async def get_sol_balance(key: str):
    try:
        # TODO : DELETE
        key = "Bxp8yhH9zNwxyE4UqxP7a7hgJ5xTZfxNNft7YJJ2VRjT"
        obj = Solscan(key)
        res = obj.get_solana_balance()
        return res
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while getting solana balance."}

@router.get("/get_tokens")
async def get_tokens(limit: int, offset: int):
    try:
        obj = Solscan()
        res = obj.get_tokens(limit, offset)
        return res
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while getting tokens."}

@router.get("/save_tokens")
async def save_tokens(background_tasks: BackgroundTasks):
    try:
        background_tasks.add_task(save_tokens_in_db)
        res = {"success": True, "message": "Updating tokens in DB."}
        return res
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while saving tokens."}

@router.get("/get_solvest_tokens")
async def get_solvest_tokens(db: Session = Depends(get_db)):
    res = fetch_solvest_tokens(db)
    return res

@router.get("/get_token_transactions")
async def get_token_transactions(address: str, limit: int = 100, offset: int = 0):
    try:
        # TODO : DELETE
        address = "Bxp8yhH9zNwxyE4UqxP7a7hgJ5xTZfxNNft7YJJ2VRjT"
        obj = Solscan()
        res = obj.get_token_transactions(address, limit, offset)
        return res
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occured while saving tokens"}

@router.post("/save_stream")
async def save_stream(streamData: schemas.StreamCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    res = save_user_stream(streamData, db, background_tasks)
    return res

@router.get("/get_streams")
async def get_streams(publicKey: str, db: Session = Depends(get_db)):
    res = fetch_key_streams(publicKey, db)
    return res

@router.get("/stop_stream")
async def stop_stream(streamId: int, db: Session = Depends(get_db)):
    res = stop_user_stream(streamId, db)
    return res

@router.get("/user_historical_portfolio")
async def user_historical_portfolio(publicKey: str, db: Session = Depends(get_db)):
    # TODO : DELETE
    publicKey = "Bxp8yhH9zNwxyE4UqxP7a7hgJ5xTZfxNNft7YJJ2VRjT"
    res = get_user_historical_portfolio(publicKey, db)
    return res

@router.post("/save_user_transaction")
async def save_user_transaction(transactionData: schemas.SaveTransaction, db: Session = Depends(get_db)):
    res = add_user_transaction(transactionData, db)
    return res

@router.get("/get_user_solvest_transactions")
async def fetch_user_transactions(publicKey: str, db: Session = Depends(get_db)):
    # TODO : DELETE
    publicKey = "Bxp8yhH9zNwxyE4UqxP7a7hgJ5xTZfxNNft7YJJ2VRjT"
    res = get_user_transactions(publicKey, db)
    return res

@router.get("/get_user_transactions")
async def get_user_transaction(publicKey: str, limit: int = 100, offset: int = 0):
    try:
        # TODO : DELETE
        publicKey = "Bxp8yhH9zNwxyE4UqxP7a7hgJ5xTZfxNNft7YJJ2VRjT"
        obj = Solscan(publicKey)
        res = obj.get_user_transactions(limit, offset)
        return res
    except Exception as e:
        print(e)
        return {"success": False, "message": "Error occurred while fetching transactions."}

@router.get("/get_index_tokens")
async def get_index_tokens(db: Session = Depends(get_db)):
    res = fetch_index_tokens(db)
    return res

@router.get("/tokens_chart_data")
async def get_tokens_chart_data(symbol: str, db: Session = Depends(get_db)):
    res = fetch_tokens_chart_data(symbol, db)
    return res

@router.get("/solvest_tokens_chart_data")
async def get_solvest_tokens_chart_data(symbol: str, db: Session = Depends(get_db)):
    res = fetch_solvest_tokens_chart_data(symbol, db)
    return res

@router.get("/index_tokens_chart_data")
async def get_index_tokens_chart_data(symbol: str, db: Session = Depends(get_db)):
    res = fetch_index_tokens_chart_data(symbol, db)
    return res