const ethers = require('ethers')
const axios = require("axios")
const sha256 = require('crypto-js/sha256')
const AES = require('crypto-js/aes');
const CryptoJS = require("crypto-js")
const fs = require('fs');
const baseUrl = "http://localhost:8080/api/v1/"



const tokekABI = [{
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
        {
            "name": "",
            "type": "string"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
        {
            "name": "",
            "type": "uint8"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
        {
            "name": "",
            "type": "string"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
        {
            "name": "_spender",
            "type": "address"
        },
        {
            "name": "_value",
            "type": "uint256"
        }
    ],
    "name": "approve",
    "outputs": [
        {
            "name": "",
            "type": "bool"
        }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},

]
async function createWallet(username, password) {

    //create wallet
    const wallet = ethers.Wallet.createRandom()
    console.log('address:', wallet.address)
    console.log('mnemonic:', wallet.mnemonic.phrase)
    console.log('privateKey:', wallet.privateKey)

    const hashOfSeed = sha256(wallet.mnemonic.phrase + password).toString()
    const hashOfPassword = sha256(password).toString()
    // original password se encrypted he jo k sirf ap ko pata he
    const encryptedPk = AES.encrypt(wallet.privateKey, password).toString()
    const encryptedSp = AES.encrypt(wallet.mnemonic.phrase, password).toString()

    console.log(hashOfSeed)
    console.log(hashOfPassword)
    console.log(encryptedPk)
    console.log("decrypted", AES.decrypt(encryptedPk, password).toString(CryptoJS.enc.Utf8))
    const url = baseUrl + "wallet/"
    // call api
    const response = await axios.post(url, {
        username: username,
        password: hashOfPassword,
        seedHash: hashOfSeed,
        pk: encryptedPk,
        sp: encryptedSp,
        address: wallet.address
    })

    console.log(response.data)

    // we have to give user control over his seed phrase so we are supposing user save seed phrase by his self anywhere
    // store encrypted seed phrase in local machine in order to create account
    // save seed encypted seeed phrase in text file
    fs.writeFile(`${__dirname}/static/sp.txt`, response.data?.data?.saltySp + "\n", function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("phrase saved!");
    });

    // save encrypted private key into text file
    fs.writeFile(`${__dirname}/static/pks.txt`, response.data?.data?.saltyPk + "\n", function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("key saved!");
    });

}


async function importWallet(seedPhrase, password) {
    // seed phrase pass by the user
    // const wallet = ethers.Wallet.fromMnemonic(seedPhrase)
    // console.log('address:', wallet.address)
    // console.log('mnemonic:', wallet.mnemonic.phrase)
    // console.log('privateKey:', wallet.privateKey)
    // const hashOfSeed = sha256(wallet.mnemonic.phrase + password).toString()


    const res = await axios.post(baseUrl + "import", {

        seedHash: "ad",


    })

    console.log(res.data)

}



async function generateAccounts(mnemonic, numAccounts) {
    // const provider = new ethers.providers.JsonRpcProvider(); // You can replace this with your preferred Ethereum provider
    const walletMnemonic = ethers.utils.HDNode.fromMnemonic(mnemonic);

    const accounts = [];
    for (let i = 0; i < numAccounts; i++) {
        const path = `m/44'/60'/${i}'/0/0`; // Derivation path for Ethereum accounts
        const wallet = walletMnemonic.derivePath(path);
        const address = wallet.address;
        const pk = wallet.privateKey;
        const pbk = wallet.publicKey;


        accounts.push({ index: i, address, pk, pbk });
    }

    return accounts;

}

async function createAccount(walletId, password, accountName, accountNumber) {

    fs.readFile(`${__dirname}/static/sp.txt`, async function (err, data) {
        if (err) {
            console.log(err)
            return
        }
        const saltySp = data.toString()
        console.log(saltySp)

        const decryptResponse = await axios.post(baseUrl + "account/decrypt", {
            sp: saltySp
        })
        // console.log("aaaaaaaaaaaaa")
        console.log(decryptResponse.data.data.esp)
        const esp = decryptResponse.data.data.esp


        const sp = AES.decrypt(esp, password).toString(CryptoJS.enc.Utf8)

        console.log(sp)
        const walletMnemonic = ethers.utils.HDNode.fromMnemonic(sp);

        // we will pass account number on this function letter but right now we are calling api for it


        const path = `m/44'/60'/${accountNumber}'/0/0`; // Derivation path for Ethereum accounts
        const wallet = walletMnemonic.derivePath(path);
        const address = wallet.address;
        const pk = wallet.privateKey;


        const url = baseUrl + `account/${walletId}`

        const response = await axios.post(url, {
            address: address,
            name: accountName
        })

        console.log(response.data)
        console.log(password)

        // const pbk = wallet.publicKey;
        console.log(address)
        console.log(pk)

        // fs.writeFile(`${__dirname}/static/pks.txt`, response.data?.data?.saltyPk + "\n", function (err) {
        //     if (err) {
        //         return console.log(err);
        //     }
        //     console.log("key saved!");
        // });

    })
}

async function importToken(walletId, accountId, token) {

    // const contract = new ethers.Contract(tokenAddress, tokenABI,)
    const response = await axios.post(baseUrl + "token/" + walletId + "/" + accountId, {
        ...token
    })


    console.log(response.data)



}

// async function sendNativeToken() {


// }





async function sendERC20Token() {


}

async function getWallets() {

    const url = baseUrl + "wallet/"
    const res = await axios.get(url)
    console.log(res.data)
}

async function getWallet(walletId) {

    const url = baseUrl + `wallet/${walletId}`
    const res = await axios.get(url)
    console.log(res.data)
    return res.data

}

async function getAccountS(walletId) {

    const response = await axios.get(baseUrl + "account/" + walletId)

    console.log(response.data)
}

async function getActivities() {

}
async function getTokens(walletId, accountId) {


    const response = await axios.get(baseUrl + "token/" + walletId + "/" + accountId)

    console.log(response.data)
}


async function addNetwork(walletId, network) {

    // const network = {
    //     "name": "fuji",
    //     "providerURL": "https://rpc.ankr.com/avalanche_fuji",
    //     "scanURL": "https://testnet.snowtrace.io/",
    //     "coinName": "AVAX",
    //     "chainId": "43113"

    // }

    const response = await axios.post(baseUrl + "network/" + walletId, {
        ...network
    })

    console.log(response.data)

}


async function getNetworks(walletId) {

    const response = await axios.get(baseUrl + "network/" + walletId)

    console.log(response.data)

}


const sendNativeToken = async ()=>{

    const provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia.publicnode.com/")

    const pk = "0xf56ed0bb1a9c9db774b285c26dd58bd562cd779936e3d0000cf55fa6d9f67b5d"
    
    const wallet = new ethers.Wallet(pk,provider)
    const tx = {
        from:"0xa3050aE9cb69Dfd04784Eb24b732bedf1797347b",
        to: "0xafD453221E49748358d4AA086C17ee9E6e241c46",
        value: ethers.utils.parseEther("0.1"),
      };
    console.log(tx)
      const createReceipt = await wallet.sendTransaction(tx);
  await createReceipt.wait();
  console.log(`Transaction successful with hash: ${createReceipt}`);

  return createReceipt
};


// Replace 'yourMnemonic' with your actual mnemonic phrase and specify the number of accounts you want to generate.
// generateAccounts('judge fortune repeat angle series umbrella suspect chronic infant airport lens lesson', 5).then((accounts) => {
//     console.log(accounts);
// });

// const seedPhrase = ""

// importWallet("sauce open stem stairs nephew fork eye economy pencil clean guide frost", password)
// createWallet(username, password)
// generateAccounts()


// function timeConverter(UNIX_timestamp){
//     var a = new Date(UNIX_timestamp * 1000);
//     var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//     var year = a.getFullYear();
//     var month = months[a.getMonth()];
//     var date = a.getDate();

//     var time = date + ' ' + month + ' ' + year;
//     return time;
//   }

async function main() {


    // const username = "fahda"
    // const password = "abcasddefg"
    // const walletId = '653170cc8b470d03bc5dd47b'
    // const accountCount = 0
    // const accountName = "fahad account"
    // const accountId = "653170cc8b470d03bc5dd479"
    // const network = {
    //     "name": "fuji",
    //     "providerURL": "https://rpc.ankr.com/avalanche_fuji",
    //     "scanURL": "https://testnet.snowtrace.io/",
    //     "coinName": "AVAX",
    //     "chainId": "43113"

    // }

    // token = {
    //     name: "Chainlink Token on Avalanche",
    //     address: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    //     symbol: "LINK",
    //     decimal: 18,
    //     network: "fuji",
    // }



    // await createWallet(username, password)
    // await getWallets() // not use in frontend


    // await getWallet(walletId)


    // await createAccount(walletId, password, accountName, accountCount + 1)

    // await getAccountS(walletId)






    // await addNetwork(walletId, network)

    // await getNetworks(walletId)


    // await importToken(walletId, accountId, token)


    // await getTokens(walletId, accountId)


    // work has been going on  send tx, maintain history of Tx

    // all private keys and seed phrase will be store in local machine (path ="./static/")

    // const esp = CryptoJS.AES.decrypt("U2FsdGVkX19DKWpkzuRU4cTD90YA75tNNQih0Yxreo4nWZTVEY8W7MXiSXdQw4RtqW5dsN5mQRQQt7ZgUimLZPpgtQbKRZIvmqka5SgD2gZweYEuozPJER/nHk2vQ5VJ", "abc").toString(CryptoJS.enc.Utf8)
    // console.log(esp)
    // sendNativeToken()

//     let address = "0xa3050aE9cb69Dfd04784Eb24b732bedf1797347b";
// let etherscanProvider = new ethers.providers.EtherscanProvider("sepolia");

// const h = await etherscanProvider.getHistory(address)

// const sh = h.sort(function(a, b){return b.timestamp - a.timestamp});
// console.log(sh)
// let arr = []
// for (let index = 0; index < sh.length; index++) {
//     arr.push({
// hash:sh[index].hash,
// action: sh[index].from === address ? "Sent":"Recieved",
// date: timeConverter(sh[index].timestamp),
// amount: ethers.utils.formatEther(sh[index].value)
//     })
    
// }

// console.log(arr)


const provider = new ethers.providers.JsonRpcProvider("https://tiniest-old-wish.ethereum-goerli.quiknode.pro/ca2bb8aad57ca67196d952609aef4dd1b7ae3799/")
pk = "f7feba3bf0d43cfca9479c1110af88ec71a5a354bcaeff14b09f349b56948638"
const wallet = new ethers.Wallet(pk,provider)
const contract = new ethers.Contract("0x62bD2A599664D421132d7C54AB4DbE3233f4f0Ae",tokekABI,wallet)

const tx = await contract.approve("0x45D5d3340219aAbC74fB4CD2CdDBeCC917d8e632",ethers.utils.parseEther("10"))
await tx.wait()
console.log(tx)
}

main()