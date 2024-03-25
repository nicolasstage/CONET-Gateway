
declare const ethers
declare const uuid
declare const Jimp

const CONET_ReferralsAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "referrer",
                "type": "address"
            }
        ],
        "name": "addReferrer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "refere",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "referees",
                "type": "address[]"
            }
        ],
        "name": "checkReferees",
        "outputs": [
            {
                "internalType": "bool",
                "name": "hasAddress",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "referrer",
                "type": "address"
            }
        ],
        "name": "getReferees",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "referees",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "referee",
                "type": "address"
            }
        ],
        "name": "getReferrer",
        "outputs": [
            {
                "internalType": "address",
                "name": "referrer",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

const conet_storageAbi=[
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "data",
                "type": "string"
            }
        ],
        "name": "FragmentsStorage",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "data",
                "type": "string"
            }
        ],
        "name": "_storageFragments",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "count",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "data",
                "type": "string"
            }
        ],
        "name": "storageFragments",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const blast_CNTPAbi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "_addresses",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "_amounts",
                "type": "uint256[]"
            }
        ],
        "name": "multiTransferToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const blast_usdbAbi = [
	{
		"inputs":[{"internalType":"address","name":"_admin","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
		{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},
		{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},
		{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},
		{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},
		{"inputs":[{"internalType":"address","name":"_admin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},
		{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},
		{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},
		{"inputs":[{"internalType":"address","name":"_implementation","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}
]


const conet_rpc = 'https://rpc.conet.network'
const api_endpoint = `https://api.conet.network`
const FragmentNameDeriveChildIndex = 65536
const cloudStorageEndpointUrl = 'https://s3.us-east-1.wasabisys.com/conet-mvp/storage/'
const blast_sepoliaRpc = 'https://sepolia.blast.io'
const ethRpc = 'https://rpc.ankr.com/eth'
const blast_mainnet = 'https://rpc.blast.io'
const bsc_mainchain = 'https://bsc-dataseed.binance.org/'

const ReferralsAddress = '0x8f6be4704a3735024F4D2CBC5BAC3722c0C8a0BD'
const ReferralsAddressV2 = '0x64Cab6D2217c665730e330a78be85a070e4706E7'
const conet_storage_contract_address = `0x30D870224419226eFcEA57B920a2e67929893DbA`
const adminCNTP= '0x44d1FCCce6BAF388617ee972A6FB898b6b5629B1'
const referrerCNTP= '0x63377154F972f6FC1319e382535EC9691754bd18'

const blast_CNTP = '0x53634b1285c256aE64BAd795301322E0e911153D'
const CNTPB_contract = '0x6056473ADD8bC89a95325845F6a431CCD7A849bb'
const eth_usdt_contract = '0xdac17f958d2ee523a2206206994597c13d831ec7'
const blast_usdb_contract = '0x4300000000000000000000000000000000000003'

const bnb_wbnb_contract = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const bnb_usdt_contract = '0x55d398326f99059fF775485246999027B3197955'

const checkRefereeV1 = async () => {
	if (!CoNET_Data?.profiles) {
		return logger(`registerReferrer CoNET_Data?.profiles Empty error!`)
	}
	const mainProfile = CoNET_Data.profiles[0]
	if (mainProfile.referrer) {
		return
	}

	const myKeyID = mainProfile.keyID
	const provideNewCONET = new ethers.JsonRpcProvider(conet_rpc)
	const CNTP_Referrals = new ethers.Contract(ReferralsAddress, CONET_ReferralsAbi, provideNewCONET)
	let referrer: string
	try {
		referrer = await CNTP_Referrals.getReferrer(myKeyID)
	} catch (ex) {
		return logger(`checkRefereeV1 Error!`, ex)
	}
	const add = referrer.toLowerCase()
	if (add === '0x0000000000000000000000000000000000000000') {
		return
	}
	mainProfile.referrer = referrer
}

const getReferees = async (wallet: string, CNTP_Referrals) => {
	

	let result: string[] = []
	try {
		result = await CNTP_Referrals.getReferees(wallet)
	} catch (ex) {
		logger(`getReferees [${wallet}] Error! try again!`)
		return await getReferees (wallet, CNTP_Referrals)
	}
	return result
}

const getAllReferees = async (_wallet: string, CNTP_Referrals) => {

	const firstArray: string[] = await getReferees(_wallet, CNTP_Referrals)
	if (!firstArray.length) {
		return []
	}
	const ret: any = []
	const getData = async (wallet: string) => {
		const kkk = await getReferees(wallet, CNTP_Referrals)
		const data = JSON.parse(`{"${wallet}": ${JSON.stringify(kkk)}}`)
		return data
	}
	for (let i = 0; i < firstArray.length; i++) {
		const kk = await getReferees(firstArray[i], CNTP_Referrals)
		const ret1: any[] = []

		if (kk.length) {
			
			for (let j = 0; j < kk.length; j ++) {
				ret1.push(await getData(kk[j]))
			}

		}
		const data = `{"${firstArray[i]}": ${JSON.stringify(ret1)}}`
		const k = JSON.parse(data)
		ret.push(k)
	}
	
	return ret
}

const sendState = (state: listenState, value: any) => {
	const sendChannel = new BroadcastChannel(state)
	sendChannel.postMessage (JSON.stringify(value))
	sendChannel.close()
}

const registerReferrer = async (referrer: string) => {
	if (!CoNET_Data?.profiles) {
		return logger(`registerReferrer CoNET_Data?.profiles Empty error!`)
	}

	const profile = CoNET_Data.profiles[0]
	if (!profile||!referrer) {
		return false
	}

	if (referrer.toLowerCase() === profile.keyID.toLowerCase() || profile.referrer) {
		return false
	}

	const provideNewCONET = new ethers.JsonRpcProvider(conet_rpc)
	const wallet = new ethers.Wallet(profile.privateKeyArmor, provideNewCONET)
	const CNTP_Referrals = new ethers.Contract(ReferralsAddressV2, CONET_ReferralsAbi, wallet)

	try {
		await CNTP_Referrals.addReferrer(referrer)
	} catch (ex) {
		logger(`registerReferrer Error`, ex)
		return false
	}
	profile.referrer = referrer
	return true
}

const getAddress = (addr: string) => {
	let ret = ''
	try {
		ret = ethers.getAddress(addr)
	} catch (ex) {
		return ret
	}
	return ret
}

const getReferrerList = async (cmd: worker_command) => {

	const referrer = getAddress(cmd.data[0])||getAddress(cmd.data[1])
	if (!referrer) {
		cmd.err = 'FAILURE'
		return returnUUIDChannel(cmd)
	}

	const provideNewCONET = new ethers.JsonRpcProvider(conet_rpc)
	const CNTP_Referrals = new ethers.Contract(ReferralsAddressV2, CONET_ReferralsAbi, provideNewCONET)
	cmd.data = [await getAllReferees(referrer, CNTP_Referrals)]
	returnUUIDChannel(cmd)
}

const getAllNodesInfo: () => Promise<node|null> = () => new Promise(resolve=> {

	return fetch('https://openpgp.online:4001/api/conet-nodes', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
			'Connection': 'close',
		},
		cache: 'no-store',
		referrerPolicy: 'no-referrer'
	})
	.then ( async res => {
		return res.json()
	}).then((data: node) => {
		allNodes = data
		resolve(data)
	}).catch(ex=> {
		resolve(null)
	})

})

let allNodes: node
let CNTP_Balance = '0'
let currentCNTP = '0'
let authorization_key = ''

let getProfileAssetsBalanceResult: getBalanceAPIresult = {CNTP_Balance: '0', CONET_Balance: '0', Referee: '0', lastTime: 0}
let scanPoint = 0


const getAllProfileAssetsBalance = async () => {
	if (!CoNET_Data?.profiles) {
		return logger(`getAllProfileAssetsBalance Error! CoNET_Data.profiles empty!`)
	}
	for (let profile of CoNET_Data.profiles) {
		await getProfileAssetsBalance(profile)
	}
}

const getProfileAssetsBalance = async (profile: profile) => {

	const key = profile.keyID
	
	if (key) {
		const current = profile.tokens
		checkTokenStauct(current)

		const provideETH = new ethers.JsonRpcProvider(ethRpc)
		const provideBlast = new ethers.JsonRpcProvider(blast_sepoliaRpc)
		const provideCONET = new ethers.JsonRpcProvider(conet_rpc)
		const provideBlastMainChain = new ethers.JsonRpcProvider(blast_mainnet)
		const provideBNB = new ethers.JsonRpcProvider(bsc_mainchain)
		// const walletETH = new ethers.Wallet(profile.privateKeyArmor, provideETH)
		const [balanceCNTP, balanceCNTPB, balanceUSDT, ETH, blastETH, usdb, wbnb, wusdt, conet_Holesky] = await Promise.all([
			scanCNTP (key, provideBlast),
			scanCNTPB (key, provideCONET),
			scanUSDT (key, provideETH),
			scanETH (key, provideETH),
			scanBlastETH (key, provideBlast),
			scanUSDB (key, provideBlastMainChain),
			scanWUSDT (key,provideBNB),
			scanWBNB (key,provideBNB),
			scanCONETHolesky(key, provideCONET)
		])
		

		current.cntp.balance = balanceCNTP === BigInt(0) ? '0' : parseFloat(ethers.formatEther(balanceCNTP)).toFixed(4)
		current.cntpb.balance = balanceCNTPB === BigInt(0) ? '0' : parseFloat(ethers.formatEther(balanceCNTPB)).toFixed(4)
		current.usdt.balance = balanceUSDT === BigInt(0) ? '0' : parseFloat(ethers.formatEther(balanceUSDT)).toFixed(4)
		current.eth.balance = ETH === BigInt(0) ? '0' : parseFloat(ethers.formatEther(ETH)).toFixed(4)
		current.blastETH.balance = blastETH === BigInt(0) ? '0' : parseFloat(ethers.formatEther(blastETH)).toFixed(4)
		current.usdb.balance = usdb === BigInt(0) ? '0' : parseFloat(ethers.formatEther(usdb)).toFixed(4)
		current.wbnb.balance = wbnb === BigInt(0) ? '0' : parseFloat(ethers.formatEther(wbnb)).toFixed(4)
		current.wusdt.balance = wusdt === BigInt(0) ? '0' : parseFloat(ethers.formatEther(wusdt)).toFixed(4)
		current.conet.balance = conet_Holesky === BigInt(0) ? '0' : parseFloat(ethers.formatEther(conet_Holesky)).toFixed(4)

		//current.usdb.balance = balanceUSDB === BigInt(0) ? '0' : parseFloat(ethers.formatEther(balanceUSDB)).toFixed(4)


		// return postToEndpoint(url, false, '')
		// 	.then (response => {
				
		// 		//@ts-ignore
		// 		const data: blockscout_result = response
		// 		if (data?.items) {

		// 			const balance = parseFloat(data.items[0].value)/10**18
		// 			const beforeBalance = parseFloat(getProfileAssetsBalanceResult.CNTP_Balance)
		// 			if (!isNaN(balance) && balance - beforeBalance > 0 ) {
		// 				getProfileAssetsBalanceResult.CNTP_Balance = current.cntp.balance = CNTP_Balance = balance.toFixed(4)
		// 				getProfileAssetsBalanceResult.lastTime = date
		// 			}
					
		// 		}
		// 		return postToEndpoint(url1, false, '')})
		// 	.then( async response => {
		// 		//@ts-ignore
		// 		const data: blockscout_address = response
				
		// 		if (data?.coin_balance ) {
		// 			const balance = parseFloat(data.coin_balance)
		// 			const beforeBalance = parseFloat(getProfileAssetsBalanceResult.CONET_Balance)
		// 			if (!isNaN(balance) && balance -beforeBalance >0) {
		// 				getProfileAssetsBalanceResult.CONET_Balance = current.conet.balance = balance.toFixed(4)
		// 				getProfileAssetsBalanceResult.lastTime = date
		// 			}
		// 		}
				
		// 		// if (profile.referrer) {
		// 		// 	await registerReferrer(profile.referrer)
		// 		// } else if (!profile.referrer && referrals) {
		// 		// 	await registerReferrer(referrals)
		// 		// 	profile.referrer = referrals
		// 		// }
				
		// 		sendState('cntp-balance', {CNTP_Balance: CNTP_Balance, CONET_Balance: profile.tokens.conet.balance, currentCNTP: currentCNTP})
		// 		const ret = {
		// 			CNTP_Balance,
		// 			CONET_Balance: profile.tokens.conet.balance,
		// 			Referee: profile.referrer
		// 		}
		// 		getProfileAssetsBalanceLocked = false
		// 		return ret
		// 	})
		// 	.catch (ex => {
		// 		getProfileAssetsBalanceLocked = false
		// 		return null
		// 	})
		

	}

	return false
}

const storeSystemData = async () => {

	if (!CoNET_Data||! passObj?.passcode) {
		return
	}

	const password = passObj.passcode.toString()
	if (CoNET_Data.ver > 0) {
		CoNET_Data.fragmentClass = new Fragment(CoNET_Data)
	}
	

	CoNET_Data.encryptedString = await CoNETModule.aesGcmEncrypt (buffer.Buffer.from(CoNET_Data.mnemonicPhrase), password)
	
	if (!CoNET_Data.encryptedString) {
		return logger(`encryptStoreData aesGcmEncrypt Error!`)
	}

    const putData = {
        title: CoNET_Data.encryptedString
    }
	const database = new PouchDB( databaseName, { auto_compaction: true  })
	sendState('beforeunload', true)
	const doc = await database.post( putData )
	await CoNET_initData_save (database, doc.id)
	sendState('beforeunload', false)
}

const createAccount = async (cmd: worker_command) => {
	const passcode: string = cmd.data[0]
	const _referrer = cmd.data[1]
	//	create passObj
	await createNumberPasscode (passcode)
	//	create GPG OBJ
	await initCoNET_Data ()
	//	Error
	if (!CoNET_Data?.profiles) {
		cmd.data[0] = ''
		return returnUUIDChannel (cmd)
	}
	const mainProfile = CoNET_Data.profiles[0]
	const ff = await getFaucet (mainProfile.keyID)
	if ( ff !== false && _referrer ) {
		await registerReferrer (_referrer)
		
	}
	// storage Data
	await storeSystemData ()
	cmd.data[0] = CoNET_Data.mnemonicPhrase
	returnUUIDChannel (cmd)
	
}

const testPasscode = async (cmd: worker_command) => {
	const passcode: string = cmd.data[0]
	const referrer = cmd.data[1]
	if ( !passcode || !passObj ) {
		cmd.err = 'INVALID_DATA'
		return returnUUIDChannel(cmd)
	}

	passObj.password = passcode
	await decodePasscode ()
	const provideCONET = new ethers.JsonRpcProvider(conet_rpc)
	try {
		await decryptSystemData ()
		await recoverProfileFromSRP()
	} catch (ex) {
		logger (`encrypt_TestPasscode get password error!`)
		cmd.err = 'FAILURE'
		return returnUUIDChannel(cmd)
	}

	if (!CoNET_Data?.profiles) {
		cmd.err = 'FAILURE'
		returnUUIDChannel(cmd)
		return logger(`testPasscode CoNET_Data?.profiles Empty error!`)
	}

	const mainProfile = CoNET_Data.profiles[0]
	
	if ( referrer ) {
		await registerReferrer (referrer)
	}
	
	authorization_key = cmd.data[0] = uuid.v4()
	returnUUIDChannel(cmd)
}

const createKeyHDWallets = () => {
	let root
	try {
		root = ethers.Wallet.createRandom()
	} catch (ex) {
		return null
	}
	return root
}

const decryptSystemData = async () => {
	//	old version data

	
		const password = passObj?.passcode.toString()
		if (!password) {
			throw new Error(`Password Error!`)
		}

		const objText = await CoNETModule.aesGcmDecrypt (buffer.Buffer.from(CoNET_Data?.encryptedString).toString(), password)

		if(!CoNET_Data || CoNET_Data?.passcode?.status === 'UNLOCKED') {
			return new Error(`Password Error!`)
		}

		CoNET_Data.mnemonicPhrase = objText	
	
}

const showSRP = (cmd: worker_command) => {
	const _authorization_key: string = cmd.data[0]
	if (!CoNET_Data || authorization_key!== _authorization_key) {
		cmd.err = 'FAILURE'
		return returnUUIDChannel(cmd)
	}

	cmd.data = [CoNET_Data.mnemonicPhrase]
	return returnUUIDChannel(cmd)
}

let getAllProfilesCount = 0
let lastTimeGetAllProfilesCount = 0
const minTimeStamp = 1000 * 15

const getAllProfiles = async (cmd: worker_command) => {
	const _authorization_key: string = cmd.data[0]
	if (!CoNET_Data || authorization_key!== _authorization_key) {
		cmd.err = 'FAILURE'
		return returnUUIDChannel(cmd)
	}
	logger(`getAllProfiles [${++getAllProfilesCount}]`)
	const timeStamp = new Date().getTime()
	if (timeStamp - lastTimeGetAllProfilesCount < minTimeStamp) {
		--getAllProfilesCount
		cmd.data = [CoNET_Data.profiles]
		return returnUUIDChannel(cmd)
	}

	await checkUpdateAccount()
	await getAllProfileAssetsBalance()
	cmd.data = [CoNET_Data.profiles]
	--getAllProfilesCount
	lastTimeGetAllProfilesCount = timeStamp
	return returnUUIDChannel(cmd)
}

const CoNET_initData_save = async (database, systemInitialization_uuid: string) => {
	if ( !CoNET_Data || !passObj ) {
		const msg = `storeUUID_Fragments Error: encrypted === null`
		
		return logger (msg)
	}
	
	
	let preferences = {}
	if (CoNET_Data.preferences) {
		preferences =  {
			language: CoNET_Data.preferences?.langurge,
			theme: CoNET_Data.preferences?.theme
		}
	}
	

	const CoNETIndexDBInit: CoNETIndexDBInit = {
		id: passObj,
		uuid: systemInitialization_uuid,
		preferences: preferences	
	}
	let doc
	try {
		doc = await database.get ('init', {latest: true})
		
	} catch (ex) {
		logger (`database.get 'init' error! keep next`, ex)
		
	}
    const putData = {
        _id: 'init',
        title: buffer.Buffer.from(JSON.stringify (CoNETIndexDBInit)).toString ('base64')
    }
	
	if (doc?._rev) {
		putData['_rev']= doc._rev
	}
	sendState('beforeunload', true)
	const uu = await database.put( putData )
	logger(`storeCoNET_initData database.put return [${uu}]`)
	sendState('beforeunload', false)

}

const importWallet = async (cmd: worker_command) => {
	const _authorization_key: string = cmd.data[0]
	const privateKey = cmd.data[1]
	const data = cmd.data[2]
	cmd.data = []
	if (!CoNET_Data || !CoNET_Data?.profiles || authorization_key !== _authorization_key) {
		cmd.err = 'FAILURE'
		return returnUUIDChannel(cmd)
	}
	let wallet
	try {
		wallet = new ethers.Wallet(privateKey)
	} catch (ex) {
		cmd.err = 'FAILURE'
		return returnUUIDChannel(cmd)
	}
	const key = await createGPGKey('', '', '')

	const profile: profile = {
		isPrimary: false,
		keyID: wallet.address,
		privateKeyArmor: privateKey,
		hdPath: '',
		index: -1,
		pgpKey: {
			privateKeyArmor: key.privateKey,
			publicKeyArmor: key.publicKey
		},
		referrer: null,
		network: {
			recipients: []
		},
		tokens: initProfileTokens(),
		data
	}
	CoNET_Data.profiles.push(profile)
	await storeSystemData ()
	cmd.data[0] = CoNET_Data.profiles
	return returnUUIDChannel(cmd)

}

const updateProfile = async (cmd: worker_command) => {
	const _authorization_key: string = cmd.data[0]
	const _profile:profile = cmd.data[1]
	if (!CoNET_Data || !CoNET_Data?.profiles|| !_profile.keyID || authorization_key !== _authorization_key) {
		cmd.err = 'FAILURE'
		return returnUUIDChannel(cmd)
	}
	const index = CoNET_Data.profiles.findIndex(n => n.keyID === _profile.keyID)
	if(index < 0) {
		cmd.err = 'FAILURE'
		return returnUUIDChannel(cmd)
	}
	const profileImg = _profile?.data?.profileImg
	if (profileImg) {
		const resized: any = await resizeImage(profileImg, 180, 180)
		_profile.data.profileImg = 'data:image/png;base64,' + resized.rawData
	}
	CoNET_Data.profiles[index].data = _profile.data
	await storeSystemData ()
	cmd.data[0] = CoNET_Data.profiles
	returnUUIDChannel(cmd)
	updateProfiles()
}

const addProfile =  async (cmd: worker_command) => {
	const _authorization_key: string = cmd.data[0]
	if (!CoNET_Data || !CoNET_Data?.profiles|| authorization_key !== _authorization_key) {
		cmd.err = 'FAILURE'
		return returnUUIDChannel(cmd)
	}
	const UIData = cmd.data[1]

	const indexMap = CoNET_Data.profiles.map(n=> n.index)
	const nextIndex = indexMap.sort((a,b) => b-a)[0] + 1
	const root = ethers.Wallet.fromPhrase(CoNET_Data.mnemonicPhrase)
	const newAcc = root.deriveChild(nextIndex)
	const key = await createGPGKey('', '', '')
	const profileImg = UIData?.data?.profileImg
	if (profileImg) {
		const resized: any = await resizeImage(profileImg, 180, 180)
		UIData.data.profileImg = 'data:image/png;base64,' + resized.rawData
	}
	const profile: profile = {
		isPrimary: false,
		keyID: newAcc.address,
		privateKeyArmor: newAcc.signingKey.privateKey,
		hdPath: newAcc.path,
		index: newAcc.index,
		pgpKey: {
			privateKeyArmor: key.privateKey,
			publicKeyArmor: key.publicKey
		},
		referrer: null,
		network: {
			recipients: []
		},
		tokens: initProfileTokens(),
		data: UIData
	}

	CoNET_Data.profiles.push(profile)
	++CoNET_Data.ver
	await storeSystemData ()
	cmd.data[0] = CoNET_Data.profiles
	returnUUIDChannel(cmd)
	updateProfiles()
}

const resetPasscode = async (cmd: worker_command) => {
	const oldPasscode: string = cmd.data[0]
	const newPasscode: string = cmd.data[1]
	if ( !oldPasscode || !passObj ) {
		cmd.err = 'INVALID_DATA'
		return returnUUIDChannel(cmd)
	}
	passObj.password = oldPasscode
	await decodePasscode ()
	try {
		await decryptSystemData ()
	} catch (ex) {
		logger (`encrypt_TestPasscode get password error!`)
		cmd.err = 'FAILURE'
		return returnUUIDChannel(cmd)
	}
	await createNumberPasscode (newPasscode)
	await storeSystemData()
	authorization_key = cmd.data[0] = uuid.v4()
	return returnUUIDChannel(cmd)
}

const recoverAccount = async (cmd: worker_command) => {
	const SRP: string = cmd.data[0]
	const passcode: string = cmd.data[1]
	let acc
	try {
		acc = ethers.Wallet.fromPhrase(SRP)
	} catch (ex) {
		logger(`recoverAccount Phrase SRP Error! [${SRP}]`)
		cmd.err = 'FAILURE'
		return returnUUIDChannel(cmd)
	}
	initSystemDataV1(acc)
	await createNumberPasscode (passcode)
	await storeSystemData ()
	authorization_key = cmd.data[0] = uuid.v4()
	returnUUIDChannel(cmd)
}

const initCoNET_Data = async ( passcode = '' ) => {
	
    //const acc = createKey (1)
	const acc = createKeyHDWallets()
	if (!acc) {
		return 
	}
	await initSystemDataV1(acc)
}

const checkTokenStauct = (token: any) => {
	if (!token?.cntp) {
		token.cntp = {
			balance: '0',
			history: [],
			network: 'Blast Mainnet',
			decimal: 18,
			contract: blast_CNTP
		}
	}
	if (!token?.cntpb) {
		token.cntpb = {
			balance: '0',
			history: [],
			network: 'CONET Holesky',
			decimal: 18,
			contract: CNTPB_contract
		}
	}
	if (!token?.usdt) {
		token.usdt = {
			balance: '0',
			history: [],
			network: 'ETH',
			decimal: 6,
			contract: eth_usdt_contract
		}
	}
	if (!token?.usdb) {
		token.usdb = {
			balance: '0',
			history: [],
			network: 'Blast Mainnet',
			decimal: 18,
			contract: eth_usdt_contract
		}
	}
	if (!token?.eth) {
		token.eth = {
			balance: '0',
			history: [],
			network: 'ETH',
			decimal: 18,
			contract: ''
		}
	}
	if (!token?.blastETH) {
		token.blastETH = {
			balance: '0',
			history: [],
			network: 'Blast Mainnet',
			decimal: 18,
			contract: ''
		}
	}
	if (!token?.conet) {
		token.conet = {
			balance: '0',
			history: [],
			network: 'CONET Holesky',
			decimal: 18,
			contract: ''
		}
	}
	if (!token?.wbnb) {
		token.wbnb = {
			balance: '0',
			history: [],
			network: 'BSC',
			decimal: 18,
			contract: bnb_wbnb_contract
		}
	}
	if (!token?.wusdt) {
		token.wusdt = {
			balance: '0',
			history: [],
			network: 'BSC',
			decimal: 18,
			contract: bnb_usdt_contract
		}
	}
}

const initSystemDataV1 = async (acc) => {
	
	const key = await createGPGKey('', '', '')

	const profile: profile = {
		tokens: initProfileTokens(),
		publicKeyArmor: acc.publicKey,
		keyID: acc.address,
		isPrimary: true,
		referrer: null,
		pgpKey: {
			privateKeyArmor: key.privateKey,
			publicKeyArmor: key.publicKey
		},
		privateKeyArmor: acc.signingKey.privateKey,
		hdPath: acc.path,
		index: acc.index,
		network: {
			recipients: []
		}
	}
	CoNET_Data = {
		mnemonicPhrase: acc.mnemonic.phrase,
		profiles:[profile],
		ver: 0,
		isReady: true
	}
	
}

<<<<<<< Updated upstream
const checkCoNET_DataVersion = async (callback?: (ver: number) => void) => {
=======


const regiestAccount = async () => {
	const url = `${api_endpoint}/api/storageFragments`
	if (!CoNET_Data?.mnemonicPhrase||!CoNET_Data?.profiles) {
		return logger (`regiestAccount CoNET_Data object null Error! Stop process!`)
	}
	const pass = CoNETModule.EthCrypto.hash.keccak256(CoNET_Data.mnemonicPhrase)
	const data = await CoNETModule.aesGcmEncrypt(buffer.Buffer.from(JSON.stringify(CoNET_Data)).toString('base64'), pass)
	const profile = CoNET_Data.profiles[0]
	const message =JSON.stringify({ walletAddress: profile.keyID, data})
	const messageHash = CoNETModule.EthCrypto.hash.keccak256(message)
	const wallet = new ethers.Wallet(profile.privateKeyArmor)
	const wallet_sign = await wallet.signMessage(messageHash)
	const signMessage = CoNETModule.EthCrypto.sign( profile.privateKeyArmor, messageHash )
	const sendData = {
		message, signMessage
	}
	const result: any = await postToEndpoint(url, true, sendData)

}

const conet_storage_contract_address = `0xd94532f8346d4FA5Bee21e8C5af2c341A0B7f511`
const checkCoNET_DataVersion = () => {
>>>>>>> Stashed changes
	if (!CoNET_Data?.mnemonicPhrase||!CoNET_Data?.profiles) {
		return logger (`regiestAccount CoNET_Data object null Error! Stop process!`)
	}
	const profile = CoNET_Data.profiles[0]
	const provide = new ethers.JsonRpcProvider(conet_rpc)
	const wallet = new ethers.Wallet(profile.privateKeyArmor, provide)
	const conet_storage = new ethers.Contract(conet_storage_contract_address, conet_storageAbi, wallet)
	
	try{
		const count = await	conet_storage.count(profile.keyID)
		if (callback) {
			const _count = parseInt(count)
			return callback (_count)
		}
	} catch (ex) {
		logger(`checkCoNET_DataVersion error!`, ex)
		return checkCoNET_DataVersion(callback)
	}
}

const checkUpdateAccount = () => {

	return new Promise(resolve=> {
		checkCoNET_DataVersion( async _ver => {
			logger(`checkUpdateAccount checkCoNET_DataVersion ver [${_ver}]`)
			if (!CoNET_Data || !CoNET_Data.profiles?.length) {
				resolve(false)
				return logger(`checkUpdateAccount CoNET_Data or CoNET_Data.profiles hasn't ready Error!`)
			}
			const profile = CoNET_Data.profiles[0]
	
			if (_ver > CoNET_Data.ver) {
				logger (`checkUpdateAccount current account [${CoNET_Data.ver}] version is old! Update it`)
				const privateKeyHash = ethers.id(profile.keyID)
				const filename = '0x' + (BigInt(privateKeyHash) + BigInt(_ver)).toString(16)
				const fileUrl = cloudStorageEndpointUrl + `${profile.keyID}/${filename}`
				return fetchWithTimeout (fileUrl, 
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json;charset=UTF-8',
							'Connection': 'close',
						},
						cache: 'no-store',
						referrerPolicy: 'no-referrer'
					}).then ( res => {
						if (res.status!== 200) {
							logger(`checkUpdateAccount can't get new version profiles ${_ver} Error!`)
							return ''
						}
						return res.text()
					}).then( async text => {
						logger(`checkUpdateAccount got new Profile [${_ver}] [${fileUrl}]`)
						if (text) {
							if (!CoNET_Data) {
								resolve(false)
								return logger(`checkUpdateAccount CoNET_Data or CoNET_Data.profiles hasn't ready Error!`)
							}
							const pass = ethers.id(CoNET_Data.mnemonicPhrase)
							
							try {
								const decryptedData = await CoNETModule.aesGcmDecrypt(text, pass)
								CoNET_Data.profiles = JSON.parse(decryptedData)
								CoNET_Data.ver = _ver
	
							} catch (ex) {
								resolve(false)
								return logger(`checkUpdateAccount decrypt & JSON.parse profiles Error!`, ex)
							}
							await storeSystemData ()
							resolve(true)
						}	
						
					}).catch(ex=> {
						logger(`checkUpdateAccount updated file[${fileUrl}] Error!`, ex)
					})
			}
			return resolve(false)
		})
	})

}

const updateProfiles = () => {
	logger(`updateProfiles`)
	return checkCoNET_DataVersion( async ver=> {
		logger(`updateProfiles checkCoNET_DataVersion ver [${ver}]`)
		const url = `${ api_endpoint }/api/storageFragments`

		if (!CoNET_Data?.mnemonicPhrase||!CoNET_Data?.profiles) {
			return logger (`regiestAccount CoNET_Data object null Error! Stop process!`)
		}
		//			password used mnemonicPhrase's hash
		const pass = ethers.id(CoNET_Data.mnemonicPhrase)
		const contant = JSON.stringify(CoNET_Data.profiles)

		const _data = await CoNETModule.aesGcmEncrypt(contant, pass)
		const profile = CoNET_Data.profiles[0]
		const privateKeyHash = ethers.id(profile.keyID)
		const hash = '0x' + (BigInt(privateKeyHash) + BigInt(ver+1)).toString(16)
		const message =JSON.stringify({ walletAddress: profile.keyID, data: _data, hash})
		const messageHash = ethers.id(message)

		const signMessage = CoNETModule.EthCrypto.sign(profile.privateKeyArmor, messageHash)

		const sendData = {
			message, signMessage
		}
		const result: any = await postToEndpoint(url, true, sendData)
		logger(`updateProfiles got result [${result}] from conet api server!`)
		
	})
	
	//	version contral with 
}

const initProfileTokens = () => {
	return {
		conet: {
			balance: '0',
			history: [],
			network: 'CONET Holesky',
			decimal: 18,
			contract: ''
		},
		cntp: {
			balance: '0',
			history: [],
			network: 'Blast Mainnet',
			decimal: 18,
			contract: blast_CNTP
		},
		cntpb: {
			balance: '0',
			history: [],
			network: 'CONET Holesky',
			decimal: 18,
			contract: CNTPB_contract
		},
		usdt: {
			balance: '0',
			history: [],
			network: 'ETH',
			decimal: 6,
			contract: eth_usdt_contract
		},
		usdb: {
			balance: '0',
			history: [],
			network: 'Blast Mainnet',
			decimal: 18,
			contract: eth_usdt_contract
		},
		eth: {
			balance: '0',
			history: [],
			network: 'ETH',
			decimal: 18,
			contract: ''
		},
		blastETH: {
			balance: '0',
			history: [],
			network: 'Blast Mainnet',
			decimal: 18,
			contract: ''
		},
		wbnb: {
			balance: '0',
			history: [],
			network: 'BSC',
			decimal: 18,
			contract: bnb_wbnb_contract
		},
		wusdt: {
			balance: '0',
			history: [],
			network: 'BSC',
			decimal: 18,
			contract: bnb_usdt_contract
		}
	}
}

const resizeImage = ( mediaData: string, imageMaxWidth: number, imageMaxHeight: number ) => {
	return new Promise(resolve => {
		const media = mediaData.split(',')
		const _media = buffer.Buffer.from ( media[1], 'base64')
		
		const ret = {
			total_bytes: media[1].length,
			media_type: 'image/png',
			rawData: media[1],
			media_id_string: null
		}
		
		
		//if ( mediaData.length > maxImageLength) {
		const exportImage = ( _type, img ) => {
			return img.getBuffer ( _type, ( err, _buf: Buffer ) => {
				if ( err ) {
					return resolve ( false )
				}
				ret.rawData = _buf.toString( 'base64' )
				ret.total_bytes = _buf.length
	
				return resolve ( ret )
			})
		}
	
		return Jimp.read ( _media, ( err, image ) => {
			if ( err ) {
				return resolve ( false )
			}
			const uu = image.bitmap
	
			if ( uu.height +  uu.width > imageMaxHeight + imageMaxWidth ) {
				if ( uu.height > uu.widt ) {
					image.resize ( Jimp.AUTO, imageMaxHeight )
				} else {
					image.resize ( imageMaxWidth, Jimp.AUTO )
				}
			
			}
			//		to PNG
	
			return image.deflateStrategy ( 2, () => {
				return exportImage ( ret.media_type, image )
			})
			
		})
	})

	
}

const getAssetsPrice = (cmd: worker_command) => {
	cmd.data =[]
	const url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=usdt,bnb,ETH&tsyms=USD'
	return fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
			'Connection': 'close',
		},
		cache: 'no-store',
		referrerPolicy: 'no-referrer'
	}).then ( async res => {
		if (res.status!== 200) {
			getAssetsPrice(cmd)
			return logger(`getPrice [${url}] response not 200 Error! try again!`)
		}
		return res.json()
	}).then((data) => {
		cmd.data = [data]
		returnUUIDChannel(cmd)
	}).catch(ex=> {
		logger(`getPrice [${url}] catch err`, ex)
		cmd.err = 'FAILURE'
		returnUUIDChannel(cmd)
	})
	
}

let getFaucetRoop = 0
const getFaucet = async (keyID: string) => {
	return new Promise (async resolve => {
		if (++getFaucetRoop > 6) {
			getFaucetRoop = 0
			logger(`getFaucet Roop > 6 STOP process!`)
			return resolve(null)
		}
		const url = `${api_endpoint}/api/conet-faucet`
		let result
		try {
			result = await postToEndpoint(url, true, { walletAddr: keyID })
		} catch (ex) {
			logger (`getFaucet postToEndpoint [${url}] error! `, ex)
			return setTimeout(() => {
				return getFaucet (keyID)
			}, 500)
		}
		getFaucetRoop = 0
		return resolve(result)
	})

}


class Fragment {
	private SRP: string
	private ver: number
	private root
	private FragmentNameWallet
	public mainFragmentName: string
	constructor(private CoNET_Data: encrypt_keys_object) {
		if (CoNET_Data) {
			this.SRP = CoNET_Data.mnemonicPhrase
			this.ver = CoNET_Data.ver
			this.root = ethers.Wallet.fromPhrase(CoNET_Data.mnemonicPhrase)
			this.FragmentNameWallet = this.root.deriveChild(FragmentNameDeriveChildIndex)
			const firVerFileName = ethers.id(this.FragmentNameWallet.address)
			const currentVer = '0x' + (BigInt(firVerFileName) + BigInt(this.ver)).toString(16)
			this.mainFragmentName = ethers.id( ethers.id( ethers.id(currentVer)))
		}
	}
	public nextFragmentName () {

	}
}

const recoverProfileFromSRP = () => {
	return new Promise((resolve, reject) => {
		if (!CoNET_Data || !CoNET_Data?.mnemonicPhrase) {
			const errMessage = 'recoverProfileFromSRP CoNET_Data.mnemonicPhrase is null Error!'
			return reject(new Error(errMessage))
		}
		const SRP = CoNET_Data.mnemonicPhrase
		let acc
		try {
			acc = ethers.Wallet.fromPhrase(SRP)
		} catch (ex) {
			logger(`recoverAccount Phrase SRP Error! [${SRP}]`)
			return reject (ex)
		}

		const privateKey = acc.signingKey.privateKey
		const publicKey = acc.address

		return checkProfileVersion(publicKey, async ver => {
			
			//		network error!
			if (ver < 0) {
				const errMessage =`recoverProfileFromSRP checkProfileVersion RoopCount > 5! Stop trying!`
				return reject (new Error(errMessage))
			}
			//		init
			if (ver === 0) {
				await initSystemDataV1(acc)
				await getFaucet (publicKey)
				return resolve(true)
			}
			const firstprice = getFirstFragmentName(SRP, ver)
			
		})
	})

}

let checkProfileVersionRoopCount = 0

const checkProfileVersion = (publicKeyID: string, callback: (ver: number) => void) => {
	if (++checkProfileVersionRoopCount > 5) {
		return callback(-1)
	}
	const provide = new ethers.JsonRpcProvider(conet_rpc)
	const conet_storage = new ethers.Contract(conet_storage_contract_address, conet_storageAbi, provide)
	conet_storage.count(publicKeyID)
	.then (count => {
		checkProfileVersionRoopCount = 0
		return callback (parseInt(count.toString()))
	}).catch (ex => {
		logger(`checkCoNET_DataVersion error! Try again! roop = [${checkProfileVersionRoopCount}]`, ex)
		return setTimeout(() => {
			return checkProfileVersion(publicKeyID, callback)
		}, 1000)
		
	})
}

//*		scan assets
		const scanCONETHolesky = async (walletAddr: string, privideCONET: any) => {
			try{
				const ret = privideCONET.getBalance(walletAddr)
				return ret
			} catch (ex) {
				logger(`scanCONETHolesky [${walletAddr}] try Again!`, ex)
				return setTimeout(async () => {
					return await scanCONETHolesky(walletAddr, privideCONET)
				}, 500)
			}
			
		}

		const scanCNTP = async (walletAddr: string, privideCONET: any) => {
			
			const CNTP = new ethers.Contract(blast_CNTP, blast_CNTPAbi, privideCONET)
			try {
				const ret = await CNTP.balanceOf(walletAddr)
				return ret
			} catch (ex) {
				logger(`scanCNTP [${walletAddr}]`, ex)
				return setTimeout(async () => {
					return await scanCNTP(walletAddr, privideCONET)
				}, 500)
			}

		}

		const scanCNTPB =  async (walletAddr: string, provideCONET: any) => {
			
			const CNTPB = new ethers.Contract(CNTPB_contract, blast_CNTPAbi, provideCONET)
			try {
				const ret = await CNTPB.balanceOf(walletAddr)
				return ret

			} catch (ex) {
				logger(`scanCNTPB Error, try again!`)
				return setTimeout(async () => {
					return await scanCNTPB(walletAddr, provideCONET)
				}, 1000)
				
			}
		}

		const scanUSDT = async (walletAddr: string, provideETH: any) => {
			
			const usdt = new ethers.Contract(eth_usdt_contract, blast_CNTPAbi, provideETH)
			try {
				return await usdt.balanceOf(walletAddr)

			} catch (ex) {
				logger(`scanUSDT [${walletAddr}]`, ex)
				return setTimeout(async () => {
					return await scanUSDT(walletAddr, provideETH)
				}, 500)
			}
		}

		const scanUSDB = async (walletAddr: string, provideBlast: any) => {

			const usdb = new ethers.Contract(blast_usdb_contract, blast_CNTPAbi, provideBlast)
			try {
				return await usdb.balanceOf(walletAddr)

			} catch (ex) {
				logger(`scanUSDB [${walletAddr}]`, ex)
				return setTimeout(async () => {
					return await scanUSDB(walletAddr, provideBlast)
				}, 500)
				
			}
		}

		const scanETH = async (walletAddr: string, provideETH: any) => {
			try {
				return await provideETH.getBalance(walletAddr)

			} catch (ex) {
				logger(`scanETH Error! try again!`)
				return setTimeout(async () => {
					return await scanETH(walletAddr, provideETH)
				}, 1000)
				
			}
		}

		const scanBlastETH = async (walletAddr: string, provideBlast: any) => {
			try {
				return await provideBlast.getBalance(walletAddr)

			} catch (ex) {
				logger(`scanBlastETH Error!`, ex)
				return setTimeout(async () => {
					return await scanBlastETH(walletAddr, provideBlast)
				}, 1000)
				
			}
		}

		const scanWBNB = async (walletAddr: string, provideBNB: any) => {
			const wbnb = new ethers.Contract(bnb_wbnb_contract, blast_CNTPAbi, provideBNB)
			try {
				return await wbnb.balanceOf(walletAddr)

			} catch (ex) {
				logger(`scanWBNB Error! try again!`)
				return setTimeout(async () => {
					return await scanWBNB(walletAddr, provideBNB)
				}, 1000)
			}
		}

		const scanWUSDT = async (walletAddr: string, provideBNB: any) => {
			const wusdt = new ethers.Contract(bnb_usdt_contract, blast_CNTPAbi, provideBNB)
			try {
				return await wusdt.balanceOf(walletAddr)

			} catch (ex) {
				logger(`scanWUSDT Error!`)
				return setTimeout(async () => {
					return await scanWUSDT(walletAddr, provideBNB)
				}, 1000)
			}
		}
//