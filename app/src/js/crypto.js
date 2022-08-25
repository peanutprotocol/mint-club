/////////////
//
//  JS sucks but it's kinda cool once you get it working
//
/////////////

//// Alpine Vars

// setting Alpine.js global variables. You can access these from anywhere
Alpine.store("connected", false);
Alpine.store("buttonContent", "Connect");
Alpine.store("buttonDisabled", false);
Alpine.store('processingTransaction', false);
Alpine.store("contractAddress", contractAddress);
Alpine.store("contractAbi", escrowCAbi);

// setting a global prover oject
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
let web3 = window.ethereum;


// function to connect metamask and switch to certain network
async function connect() {

  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  console.log("Logged in with Account:", await signer.getAddress());

  // request connection to mumbai
  web3
    .request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }]
    })
    .then(function (response) {
      console.log(response);
    }).catch(function (error) {
      console.log(error);
    }).then(function () {
      Alpine.store("buttonContent", "Send Crypto");
      Alpine.store("connected", true);
    })
}

// sample function to interact with smart contract. Could be more elegant.
async function makeDeposit(amount, receiverEmail, message) {
  try{
    
    console.log("making deposit of " + amount + " to " + receiverEmail);
    Alpine.store('processingTransaction', true);
    Alpine.store('buttonContent', `<div role="status">
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

    // call .deposit function on the contract and attach value to tx
    const options = {
      value: ethers.utils.parseEther(amount)
    };

    console.log("options: " + options);
    // call function and listen to event
    const tx = await contract.deposit(receiverEmail, options);
    debug_list.push(tx);
    console.log("tx: " + tx);


    // submit depositForm to /send endpoint POST
    var form = document.getElementById("depositForm");
    // add tx.hash to form data
    var child = document.createElement("input");
    child.setAttribute("type", "hidden");
    child.setAttribute("name", "txHash");
    child.setAttribute("value", tx.hash);
    form.appendChild(child);

    // add address to form
    var child = document.createElement("input");
    child.setAttribute("type", "hidden");
    child.setAttribute("name", "senderAddress");
    child.setAttribute("value", await signer.getAddress());
    form.appendChild(child);

    // wait for tx to be mined and then submit form

    const tx_receipt = await tx.wait()
    debug_list.push(tx_receipt);

    Alpine.store('processingTransaction', false);
    Alpine.store('buttonContent', 'Done!');

    console.log("tx_receipt: " + tx_receipt);
    // TODO
    var depositIndex = tx_receipt.events[1].args[3]['_hex'];
    depositIndex = ethers.utils.formatEther(depositIndex);
    depositIndex = depositIndex.split('.')[1];
    // turn to int
    depositIndex = parseInt(depositIndex);
    console.log("depositIndex: " + depositIndex);


    var child2 = document.createElement("input");
    child2.setAttribute("type", "hidden");
    child2.setAttribute("name", "depositIndex");
    child2.setAttribute("value", depositIndex);
    form.appendChild(child2);


    // wait 2 seconds
    setTimeout(function () {
      console.log("SUBMITTING FORM");
      form.submit();
    }, 2000);
  } catch (error) {
    Alpine.store('buttonContent', 'Error')
    // wait 3 seconds and reload page
    setTimeout(function () {
      // window.location.reload();
    }
      , 3000);
    console.log(error);
  }
}


// another sample function
async function claimDeposit() {
  // claims deposit by making a POST request to server
  Alpine.store('processingTransaction', true);
  Alpine.store('claimButtonDisabled', true);
  Alpine.store('claimButtonContent', `<div role="status">
  <svg class="inline mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
  </svg> Processing...
  <span class="sr-only">Loading...</span>
</div>`);

  // send POST request with form data
  var form = document.getElementById("claimForm");
  form.submit();

  // async form submit with then
  // async function submitForm() {
  //   var response = await fetch(form.action, {
  //     method: form.method,
  //     body: new FormData(form)
  //   });
  //   var responseText = await response.text();
  //   console.log(responseText);
  //   Alpine.store('processingTransaction', false);
  //   Alpine.store('claimButtonDisabled', false);
    
  // .then(function (response) {
  //   console.log("response: " + response);
  //   Alpine.store('processingTransaction', false);
  //   Alpine.store('claimButtonContent', 'Done!');
  // }).catch(function (error) {
  //   alert(error);
  // });
}