
//// Alpine Vars

// setting Alpine.js global variables. You can access these from anywhere
Alpine.store("connected", false);
Alpine.store("connectButtonContent", "CONNECT WALLET");
Alpine.store("connectButtonDisabled", false);

Alpine.store('processingTransaction', false);
Alpine.store("buyButtonContent", "BUY BULLET");

// mainnet: 0x5c1b67ED2809e371aabbc58D934282E8Aa7E3fd4 // id 339
// id 339
// https://etherscan.io/address/0x5c1b67ed2809e371aabbc58d934282e8aa7e3fd4
var goerliAddress = "0x5c1b67ED2809e371aabbc58D934282E8Aa7E3fd4";

// goerli: 0x5c1b67ed2809e371aabbc58d934282e8aa7e3fd4
// id 716
// https://goerli.etherscan.io/address/0x5c1b67ed2809e371aabbc58d934282e8aa7e3fd4
var mainnetAddress = "0x5c1b67ED2809e371aabbc58D934282E8Aa7E3fd4";



Alpine.store("contractAddress", goerliAddress);
Alpine.store("contractAbi", contractAbi);

// setting a global prover oject
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
let web3 = window.ethereum;


// function to connect metamask and switch to certain network
async function connect() {

  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  console.log("Logged in with Account:", await signer.getAddress());

  // request connection to goerli network
  web3
    .request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x5" }],
    })
    .then(function (response) {
      console.log(response);
    }).catch(function (error) {
      console.log(error);
    }).then(function () {
      Alpine.store("connectButtonContent", "CONNECTED");
      Alpine.store("connected", true);
    })
}


// buy 1 mintSlot in contract
async function buySlot() {
  if (Alpine.store("processingTransaction")) {
    return;
  }
  if (!Alpine.store("connected")) {
    console.log("Not connected to network");
    alert("Please connect to network with Metamask!");
    return;
  }
  try {

    Alpine.store('processingTransaction', true);
    Alpine.store('buyButtonContent', `<div role="status">
    <svg class="inline mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg> Processing...
    <span class="sr-only">Loading...</span>
  </div>`);
    var contractAddress = Alpine.store("contractAddress");
    var contractAbi = Alpine.store("contractAbi");
    var signer = provider.getSigner();
    var contract = new ethers.Contract(contractAddress, contractAbi, signer);

    // add a value of 0.0066 ETH to the tx
    const options = {
      value: ethers.utils.parseEther("0.0066")
    };

    // call function and listen to event
    const tx = await contract.buyMintSpots(1, options);
    Alpine.store('buyButtonContent', `<div role="status">
    <svg class="inline mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg> Processing tx...
    <span class="sr-only">Loading...</span>
  </div>`);
    console.log("tx: " + tx);

    // wait for tx to be mined
    const tx_receipt = await tx.wait()

    Alpine.store('processingTransaction', false);
    Alpine.store('buyButtonContent', 'BUY SLOT');

    console.log("tx_receipt: " + tx_receipt);

    alert("You have bought a slot! \n\n" + "tx: " + tx);

  } catch (error) {
    Alpine.store('buyButtonContent', 'Error')
    alert(error);
  }
}
