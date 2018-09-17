const SHA256 = require('crypto-js/sha256');

class Transaction
{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block
{
    calculateHash()
    {
        return SHA256(this.index + this.timestamp + this.previousHash+ this.nonce + JSON.stringify(this.data)).toString();
    }

    constructor(index, timestamp, data, previousHash='')
    {
        this.index=index;
        this.timestamp=timestamp;
        this.data = data;
        this.previousHash=previousHash;
        this.nonce=0;
        this.hash=this.calculateHash();
    }

    mineNewBlock(difficulty)
    {
        while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0"))
        {
            this.nonce++;
            this.hash=this.calculateHash();
        }
        console.log("Block Mined with hash value : " + this.hash);
    }
}

class Blockchain
{

    constructor()
    {
        this.chain= [this.createGenesisBlock()];
        this.difficulty=2;
        this.pendingTransactions=[];
    }

    createGenesisBlock()
    {
        return new Block(0,Date.parse("03/08/1999"),"This Is The Genesis Block","0");
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress)
    {   
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineNewBlock(this.difficulty);

        const reward = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(reward);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    createTransaction(transaction)
    {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address)
    {
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions)
            {
                if(trans.fromAddress === address)
                {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address)
                {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }


    isChainValid()
    {
        for (let i = 1; i < this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) 
            {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) 
            {
                return false;
            }
        }

        return true;
    }
    
}

let AtharvCoin = new Blockchain();
AtharvCoin.createTransaction(new Transaction('address1', 'address2', 100));
AtharvCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
AtharvCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', AtharvCoin.getBalanceOfAddress('xaviers-address'));

console.log('\n Starting the miner again...');
AtharvCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', AtharvCoin.getBalanceOfAddress('xaviers-address'));