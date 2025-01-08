let web3;
let twitterContract;
const contractAddress = "0x690c904ea6311dc05942000b347ca6284dca183c"; 
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "newTweetLength",
                "type": "uint16"
            }
        ],
        "name": "changeTweetLength",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_tweet",
                "type": "string"
            }
        ],
        "name": "createTweet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_i",
                "type": "uint256"
            }
        ],
        "name": "likeTweet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "author",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "content",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "TweetCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "liker",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "author",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "likeCount",
                "type": "uint256"
            }
        ],
        "name": "TweetLiked",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_i",
                "type": "uint256"
            }
        ],
        "name": "unLikeTweet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "getAllTweet",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "author",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "content",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "likes",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Twitter.Tweet[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_i",
                "type": "uint256"
            }
        ],
        "name": "getTweet",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "author",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "content",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "likes",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Twitter.Tweet",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_TWEET_LENGTH",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "tweets",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "author",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "content",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "likes",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
        try {
            web3 = new Web3(window.ethereum);
            await ethereum.request({ method: 'eth_requestAccounts' });
            twitterContract = new web3.eth.Contract(contractABI, contractAddress);
            alert("Wallet connected!");
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            alert("An error occurred while connecting to MetaMask. Please try again.");
        }
    } else {
        alert("MetaMask is not detected. Please ensure it is installed and enabled.");
    }
}

async function createTweet(event) {
    event.preventDefault();
    const tweetContent = document.getElementById("tweetContent").value;

    if (!tweetContent) {
        alert("Please enter tweet content.");
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];

    try {
        await twitterContract.methods.createTweet(tweetContent).send({ from: sender });
        alert("Tweet posted successfully!");
        document.getElementById("tweetContent").value = "";
        fetchTweets(); // Refresh tweets after posting
    } catch (error) {
        alert("Failed to post tweet: " + error.message);
    }
}

async function fetchTweets() {
const accounts = await web3.eth.getAccounts();
const sender = accounts[0];

try {
const tweets = await twitterContract.methods.getAllTweet(sender).call();
const tweetList = document.getElementById("tweetList");
tweetList.innerHTML = "";

if (tweets.length === 0) {
    tweetList.innerHTML = '<p class="text-gray-500 text-center">No tweets yet. Start sharing your thoughts!</p>';
} else {
    tweets.forEach(tweet => {
        const tweetElement = document.createElement("div");
        tweetElement.className = "p-4 bg-white rounded-lg shadow-md text-gray-800";

        // Ensure BigInt values are properly converted
        const timestamp = Number(tweet.timestamp);  // Convert BigInt to Number
        const likes = Number(tweet.likes);  // Convert BigInt to Number

        tweetElement.innerHTML = `
            <p><strong>Content:</strong> ${tweet.content}</p>
            <p><strong>Author:</strong> ${tweet.author}</p>
            <p><strong>Timestamp:</strong> ${new Date(timestamp * 1000).toLocaleString()}</p>
            <p><strong>Likes:</strong> ${likes}</p>
        `;
        tweetList.appendChild(tweetElement);
    });
}
} catch (error) {
alert("Failed to fetch tweets: " + error.message);
}
}

// Attach event listeners
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("tweetForm").addEventListener("submit", createTweet);
window.onload = fetchTweets;