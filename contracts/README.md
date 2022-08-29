
## Installation

### Running Scripts
# For the Simple ERC721
```
brownie run scripts/simple_collectible/deploy_simple.py --network rinkeby
brownie run scripts/simple_collectible/create_collectible.py --network rinkeby
```

# Verify on Etherscan

The simple contract and the advanced contract can be verified if you just set your `ETHERSCAN_TOKEN`. 

## Misc
There are some helpful scripts in `helpful_scripts.py`.

# Viewing on OpenSea
After running the scripts from the `For the Advanced ERC721` section

1. Create the metadata

Metadata is the URI needed to upload data. You can either:
- Upload to IPFS yourself
- Use the metadata already created when you cloned this repo. 

### If you want to upload to IPFS yourself

Download [IPFS](https://ipfs.io/) 
Set `export IPFS_URL=http://127.0.0.1:5001` and `export UPLOAD_IPFS=true` environment variables
Run the IPFS daemon: `ipfs daemon`
Then Run
```
brownie run scripts/advanced_collectible/create_metadata.py --network rinkeby
```

Alternatively, you could upload the uri manually:
Add the file created in `metadata/rinkeby/NAME.json` to [IPFS](https://ipfs.io/) or [Pinata](https://pinata.cloud/). 
### If you want to use the metadata from this repo

Just run:
```
brownie run scripts/advanced_collectible/create_metadata.py --network rinkeby
```

2. Set the tokenURI 
Run
```
brownie run scripts/advanced_collectible/set_tokenuri.py --network rinkeby
```
And after some time, (you may have to wait up to 20 minutes for it to render on opensea), you should see your NFT on opensea! [It'll look something like this.](https://testnets.opensea.io/assets/0x8acb7ca932892eb83e4411b59309d44dddbc4cdf/0)

## *NEW* Pinata

If you want to auto-upload to pinata instead of IPFS automatically, you can do so by getting a [Pinata API Key.](https://pinata.cloud/documentation#GettingStarted)

You'll need the following environment variables (you can get them from Pinata)
```
PINATA_API_KEY
PINATA_API_SECRET
```
Then run:
```
python scripts/upload_to_pinata.py
```

## Testing

```
brownie test
```

## Linting

```
pip install black 
pip install autoflake
autoflake --in-place --remove-unused-variables -r .
black .
```

## Resources

To get started with Brownie:

* [Chainlink Documentation](https://docs.chain.link/docs)
* Check out the [Chainlink documentation](https://docs.chain.link/docs) to get started from any level of smart contract engineering. 
* Check out the other [Brownie mixes](https://github.com/brownie-mix/) that can be used as a starting point for your own contracts. They also provide example code to help you get started.
* ["Getting Started with Brownie"](https://medium.com/@iamdefinitelyahuman/getting-started-with-brownie-part-1-9b2181f4cb99) is a good tutorial to help you familiarize yourself with Brownie.
* For more in-depth information, read the [Brownie documentation](https://eth-brownie.readthedocs.io/en/stable/).

Shoutout to [TheLinkMarines](https://twitter.com/TheLinkMarines) on twitter for the puppies!

Any questions? Join our [Discord](https://discord.gg/2YHSAey)

## License

This project is licensed under the [MIT license](LICENSE).
