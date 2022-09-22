#!/usr/bin/python3

#############################################################################################
# Usage: brownie run scripts/waterdropNFT/deploy.py
#
#
#############################################################################################

from brownie import NFTDistributorv2, accounts, network, config
from scripts.helpful_scripts import get_publish_source


def main():
    dev = accounts.add(config["wallets"]["from_key"])
    print(network.show_active())

    # # get gas cost
    # gas_price = config["networks"][network.show_active()]["gas_price"]
    # print(f"Gas price: {gas_price}, in gwei: {gas_price/1e9}")
    # # if more than 20gwei, return
    # if gas_price > 20e9:
    #     print("Gas price too high, aborting")
    #     return

    VRFv2_subscriptionID_eth_main = 339
    # constructor(uint64 subscriptionId)

    contract = NFTDistributorv2.deploy(
        VRFv2_subscriptionID_eth_main,
        {"from": dev},
        publish_source=get_publish_source(),
    )
    print("Contract deployed to:", contract.address)

    # Brownies console.log equivalent
    # have to add emit events in contract...
    print()
    events = contract.tx.events  # dictionary
    if "Log" in events:
        for e in events["Log"]:
            print(e["message"])
    print()

    return contract
