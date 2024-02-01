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
        console.log("aaaaaaaaaaaaa")
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

async function importToken(tokenAddress) {

    const contract = new ethers.Contract(tokenAddress, tokenABI,)


}

async function sendNativeToken() { }

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


async function addNetwork(walletId) {

    const network = {
        "name": "fuji",
        "providerURL": "https://rpc.ankr.com/avalanche_fuji",
        "scanURL": "https://testnet.snowtrace.io/",
        "coinName": "AVAX",
        "chainId": "43113"

    }

    const response = await axios.post(baseUrl + "network/" + walletId, {
        ...network
    })

    console.log(response.data)

}


async function getNetworks(walletId) {

    const response = await axios.get(baseUrl + "network/" + walletId)

    console.log(response.data)

}

// Replace 'yourMnemonic' with your actual mnemonic phrase and specify the number of accounts you want to generate.
// generateAccounts('judge fortune repeat angle series umbrella suspect chronic infant airport lens lesson', 5).then((accounts) => {
//     console.log(accounts);
// });

// const seedPhrase = ""

// importWallet("sauce open stem stairs nephew fork eye economy pencil clean guide frost", password)
// createWallet(username, password)
// generateAccounts()

async function main() {


    const username = "Noman"
    const password = "abcdefg"
    await createWallet(username, password)

    // await getWallets()

    // const walletId = '6524c1dc0379cd66849498c1'
    // const accountId = "6512bdcac6e47751f00b275b"
    // await getWallet(walletId)

    // await createAccount()

    // const response = await getWallet(walletId)

    // console.log(response.data.accountCount)
    // const accountCount = response.data.accountCount
    // const accountName = "Acasde"
    // await createAccount(walletId, password, accountName, accountCount + 1)


    // await addNetwork(walletId)

    // await getNetworks(walletId)

    // await getAccountS(walletId)

    // await getTokens(walletId, accountId)
}

main()