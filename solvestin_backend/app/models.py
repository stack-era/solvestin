from sqlalchemy import Boolean, Column, ForeignKey, UniqueConstraint, Integer, String, TIMESTAMP, DECIMAL, DATE

from database import Base


class UsersKey(Base):
    __tablename__ = "usersKey"
    id = Column(Integer, primary_key=True, index=True)
    publicKey = Column(String, unique=True)


class Balances(Base):
    __tablename__ = "balances"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey(UsersKey.id))
    tokenAccount = Column(String)
    tokenName = Column(String)
    tokenSymbol = Column(String)
    tokenIcon = Column(String)
    priceUsdt = Column(DECIMAL)
    tokenAmountUI = Column(DECIMAL)
    __table_args__ = (UniqueConstraint('userId', 'tokenSymbol', 'tokenAccount', name='_token_balance_uq'),)


class SolanaTokens(Base):
    __tablename__ = "solanaTokens"
    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, unique=True)
    chainId = Column(Integer)
    decimals = Column(Integer)
    logoURI = Column(String)
    name = Column(String)
    symbol = Column(String)
    priceAvailable = Column(Boolean)
    __table_args__ = (UniqueConstraint('address', 'symbol', 'chainId', 'decimals', 'logoURI', 'name', 'symbol', name='_token_name_uq'),)


class SolvestTokens(Base):
    __tablename__ = "solvestTokens"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    symbol = Column(String, unique=True)
    underlyingTokens = Column(Integer)
    latestPrice = Column(DECIMAL)
    lastupdateTimestamp = Column(TIMESTAMP)


class UnderlyingTokens(Base):
    __tablename__ = "underlyingTokens"
    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, ForeignKey(SolanaTokens.address))
    parentToken = Column(Integer, ForeignKey(SolvestTokens.id))
    symbol = Column(String)
    name = Column(String)
    weight = Column(DECIMAL)


class TokensPriceHistory(Base):
    __tablename__ = "tokenPriceHistory"
    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, ForeignKey(SolanaTokens.address))
    name = Column(String)
    symbol = Column(String)
    timestamp = Column(TIMESTAMP)
    price = Column(DECIMAL)


class UserStreams(Base):
    __tablename__ = "userStreams"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey(UsersKey.id))
    solvestToken = Column(Integer, ForeignKey(SolvestTokens.id))
    startTime = Column(Integer)
    endTime = Column(Integer)
    interval = Column(Integer)
    active = Column(Boolean)
    totalAmount = Column(DECIMAL)
    investPda = Column(String)


class UserHistoricalPortfolio(Base):
    __tablename__ = "userHistoricalPortfolio"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey(UsersKey.id))
    tokenAddress = Column(String, ForeignKey(SolanaTokens.address))
    timestamp = Column(TIMESTAMP)
    balance = Column(DECIMAL)


class TokensDailyData(Base):
    __tablename__ = "tokensDailyData"
    id = Column(Integer, primary_key=True, index=True)
    tokenAddress = Column(String, ForeignKey(SolanaTokens.address))
    date = Column(DATE)
    closePrice = Column(DECIMAL)


class SolvestTokensHistory(Base):
    __tablename__ = 'solvestTokensHistory'
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, ForeignKey(SolvestTokens.symbol))
    timestamp = Column(TIMESTAMP)
    price = Column(DECIMAL)


class UserSolvestTransactions(Base):
    __tablename__ = 'userSolvestTransactions'
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey(UsersKey.id))
    tokenId = Column(Integer, ForeignKey(SolvestTokens.id))
    transactionId = Column(String)
    side = Column(String)
    quantity = Column(DECIMAL)
    timestamp = Column(TIMESTAMP)
    source = Column(String)
    destination = Column(String)


class IndexTokens(Base):
    __tablename__ = 'indexTokens'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    symbol = Column(String, unique=True)
    underlyingTokens = Column(Integer)
    latestPrice = Column(DECIMAL)
    lastupdateTimestamp = Column(TIMESTAMP)


class IndexUnderlyingTokens(Base):
    __tablename__ = 'indexUnderlyingTokens'
    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, ForeignKey(SolanaTokens.address))
    parentToken = Column(Integer, ForeignKey(IndexTokens.id))
    symbol = Column(String)
    name = Column(String)
    weight = Column(DECIMAL)


class IndexTokensHistory(Base):
    __tablename__ = 'indexTokensHistory'
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, ForeignKey(IndexTokens.symbol))
    timestamp = Column(TIMESTAMP)
    price = Column(DECIMAL)


class UsersStreamTransactions(Base):
    __tablename__ = 'usersStreamTransactions'
    id = Column(Integer, primary_key=True, index=True)
    streamId = Column(Integer, ForeignKey(UserStreams.id))
    transactionTime = Column(DATE)
