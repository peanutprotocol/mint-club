######################################################################
# Minter
#
# Scrapes twitter & Opensea for newest freemints and mints them
######################################################################


import pandas as pd
from web3 import Web3
import requests
import time
import snscrape.modules.twitter as sntwitter
import os
import time
import datetime
import pytz
from bs4 import BeautifulSoup
import json
import random
from scrapingbee import ScrapingBeeClient
import sys
import traceback

# import cloudscraper

import dotenv

dotenv.load_dotenv("../../.env")


# scraper = cloudscraper.create_scraper() # doesnt work, cloudflare :(
client = ScrapingBeeClient(api_key=os.getenv("SCRAPINGBEE_API_KEY"))

utc = pytz.UTC

web3 = Web3(Web3.HTTPProvider(os.getenv("INFURA_ETHEREUM_MAINNET_URI")))
admin_account = web3.eth.account.from_key(os.getenv("WALLET_KEY"))


user_agents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2919.83 Safari/537.36",
]


def get_tweets(account="@FreeMintsAlert", mins=5, n=10):
    # gets all tweets from account in last n mins

    tweets = []
    query = f"from:{account}"
    for i, tweet in enumerate(sntwitter.TwitterSearchScraper(query).get_items()):
        if i >= n:
            break
        if utc.localize(datetime.datetime.utcnow()) - tweet.date < datetime.timedelta(
            minutes=mins
        ):
            tweets.append(tweet)
        # else:
        #     print(f"tweet {i} is too old, date: {tweet.date}. delta: {utc.localize(datetime.datetime.utcnow()) - tweet.date}")
    return tweets


def unshorten(twitter_url):
    response = requests.get(twitter_url)
    return response.url


def get_contract_address(opensea_url):
    # loads opensea website and gets contract address
    # scraper = cloudscraper.create_scraper()
    # scraper.headers['User-Agent'] = random.choice(user_agents)
    # response = scraper.get(opensea_url)
    # response = requests.get(opensea_url, headers=headers)
    response = client.get(opensea_url)

    if response.status_code != 200:
        print(f"response code: {response.status_code}")
        # save html to file (with timestamp)
        file_name = f"logs/{datetime.datetime.utcnow().timestamp()}.html"
        with open(file_name, "w") as f:
            f.write(response.text)
            print(
                f"saved response html to {file_name}. Requested URL was: {opensea_url}"
            )

        raise Exception("response code not 200")

    # save html to file
    with open("opensea.html", "w") as f:
        f.write(response.text)
    soup = BeautifulSoup(response.text, "html.parser")

    links = []
    # find any link that starts with https://etherscan.io/address/
    for link in soup.find_all("a"):
        href = link.get("href")
        if href is not None and href.startswith("https://etherscan.io/address/"):
            links.append(href)

    assert len(links) > 0, "no links found"
    if len(links) > 1:
        # get the shortest link
        links.sort(key=len)

    contract_address = links[0].split("/")[-1]
    return contract_address


def get_abi(contract_address):
    # gets abi from etherscan api
    url = f'https://api.etherscan.io/api?module=contract&action=getabi&address={contract_address}&apikey={os.getenv("ETHERSCAN_KEY_OWN")}'
    response = requests.get(url)
    abi = response.json()["result"]
    abi = json.loads(abi)
    return abi


# get current price of a token
def get_price(token):
    try:
        url = "https://api.binance.com/api/v3/ticker/price"
        params = {"symbol": token + "USDT"}
        response = requests.get(url, params=params)
        data = response.json()
        print(data)
        price = data["price"]
        return price
    except:
        return 2000


def mint(contract_address, abi):
    contract_address = Web3.toChecksumAddress(contract_address)
    # mints a token from contract_address using 'mint' or 'freemint' function
    contract = web3.eth.contract(address=contract_address, abi=abi)
    nonce = web3.eth.getTransactionCount(admin_account.address)

    # check that we have 0 balance in contract (havent minted yet)
    balance = contract.functions.balanceOf(admin_account.address).call()
    if balance > 0:
        print(f"already minted, balance: {balance}")
        return

    gas_price = web3.eth.gasPrice  # LEGACY
    print(f"gas price: {gas_price/1e9} gwei")
    # if gasprice bigger than 20 gwei, return
    # if gas_price > 40e9:
    #     print(f"gas price too high: {gas_price/1e9} gwei")
    #     return

    mint_function = None
    for i in abi:
        if i["type"] == "function":
            if i["name"] == "mint":
                mint_function = i
                break

    if mint_function is None:
        print("no mint function found")
        return
    # get number of parameters
    n_params = len(mint_function["inputs"])

    # if 1 param and internalType is uint256, then mint 1
    if not (n_params == 1 and mint_function["inputs"][0]["internalType"] == "uint256"):
        print(f"can't figure out how to mint, returning")
        return

    # build transaction with EIP-1559
    max_priority_fee = web3.eth.max_priority_fee
    assert (
        max_priority_fee < 4e9
    ), f"max priority fee too high: {max_priority_fee/1e9} gwei"

    txn = contract.functions.mint(1).buildTransaction(
        {
            "chainId": 1,
            "gas": 150000,
            # 'gasPrice': gas_price, # dont need this if using EIP-1559
            "maxPriorityFeePerGas": max_priority_fee,
            "maxFeePerGas": gas_price,
            "nonce": nonce,
            "from": admin_account.address,
        }
    )

    eth_price = int(float(get_price("ETH")))  # python can use bignum with ints
    gas_estimate = web3.eth.estimateGas(txn)
    cost = gas_estimate * gas_price * eth_price / 1e18
    print(f"MAX gas estimate in USD: ${cost}")

    # sign transaction
    signed_txn = admin_account.sign_transaction(txn)

    # send transaction
    tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    print(f"tx hash: {tx_hash.hex()}")

    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    # print how much it cost
    gas_used = tx_receipt["gasUsed"]
    cost = gas_used * gas_price * eth_price / 1e18
    print(f"gas used: {gas_used}, TX cost in USD: ${cost}")

    # check if minted
    balance = contract.functions.balanceOf(admin_account.address).call()
    print(f"balance: {balance}")

    return tx_receipt


# check if a function containing 'mint' exists in abi
def has_mint_function(abi, debug=False):
    has_mint_flag = False

    for i in abi:
        if i["type"] == "function":
            if "mint" in i["name"]:
                if debug:
                    print(i)
                has_mint_flag = True

    return has_mint_flag


def process_tweet(tweet):

    print(f"processing tweet: {tweet.url}")

    # find urls
    content = tweet.content
    urls = [url for url in content.split(" ") if url.startswith("https://t.co/")]
    urls = [unshorten(url) for url in urls]

    # find the url with 'opensea' in it and get contract address
    opensea_urls = [url for url in urls if "opensea" in url]
    assert len(opensea_urls) > 0, f"No opensea url found. Opensea link: {opensea_urls}"
    assert len(opensea_urls) < 2, f"More than one opensea url found: {opensea_urls}"
    opensea_url = opensea_urls[0]
    contract_address = get_contract_address(opensea_url)

    # get abi & write to abis/contract_address_abi.json
    abi = get_abi(contract_address)
    # turn to dict
    with open(f"abis/{contract_address}_abi.json", "w") as f:
        json.dump(abi, f, indent=4)
    print(f"saved abi to abis/{contract_address}_abi.json")

    return contract_address, abi
    # mint(contract_address, abi)


def run_once(mins=5):
    # runs once and tries to mint on latest tweet
    tweets = get_tweets(mins=mins)
    try:
        tweet = tweets[0]
    except:
        print(f"no tweets found in the last {mins} minutes")
        return
    contract_address, abi = process_tweet(tweet)
    mint(contract_address, abi)


if __name__ == "__main__":
    minutes = 15
    print(f"running at {datetime.datetime.now()}")
    try:
        run_once(mins=minutes + 5)
    except Exception as e:
        print(e)
        print(traceback.format_exc())

    # while True:
    #     print(f'running at {datetime.datetime.now()}')
    #     try:
    #         run_once(mins=minutes+5)
    #     except Exception as e:
    #         print(e)
    #         # print line
    #         exc_type, exc_obj, exc_tb = sys.exc_info()
    #         fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
    #         print(exc_type, fname, exc_tb.tb_lineno)

    #     print(f"\nsleeping for {minutes} minutes...")
    #     time.sleep(60 * minutes)
