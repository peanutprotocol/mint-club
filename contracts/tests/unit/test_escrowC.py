import pytest
from brownie import network, EscrowC, convert, chain
from scripts.helpful_scripts import get_account


def test_init():
    if network.show_active() not in ["development"] or "fork" in network.show_active():
        pytest.skip("Only for local testing")
    escrow_c = EscrowC.deploy(
        {"from": get_account()},
        
    )
    
    assert escrow_c.address != None
    assert escrow_c.owner() == get_account()
    print(escrow_c.address)


