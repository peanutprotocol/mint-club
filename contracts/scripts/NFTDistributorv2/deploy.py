#!/usr/bin/python3

#############################################################################################
# Usage: brownie run scripts/waterdropNFT/deploy.py
#
#
#############################################################################################

from brownie import NFTDistributorV2, accounts, network, config
from scripts.helpful_scripts import get_publish_source


def main():
    dev = accounts.add(config["wallets"]["from_key"])
    print(network.show_active())

    contract = NFTDistributorV2.deploy(
        {"from": dev},
        publish_source=get_publish_source(),
    )
    
    # Brownies console.log equivalent   
    # have to add emit events in contract...
    print()
    events = contract.tx.events # dictionary
    if "Log" in events:
        for e in events["Log"]:
            print(e['message'])
    print()

    return contract
