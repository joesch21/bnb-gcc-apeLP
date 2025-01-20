const stakingTokenAddress = "0x5d5Af3462348422B6A6b110799FcF298CFc041D3"; // Token to Stake
const rewardTokenAddress = "0x092aC429b9c3450c9909433eB0662c3b7c13cF9A"; // Reward Token
const stakingContractAddress = "0x0B7DB663300949fB7Ec18F63cf44DEB6AAD3F165"; // Staking Contract

const abiStakingToken = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
    "function balanceOf(address owner) public view returns (uint256)"
];

const abiStakingContract = [
    "function stake(uint256 amount) public",
    "function withdraw(uint256 amount) public",
    "function withdrawRewardTokens(uint256 amount) public",
    "function getStakeInfo(address _staker) view returns (uint256 _tokensStaked, uint256 _rewards)"
];

let provider, signer;

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        document.getElementById("status").innerText = "✅ Wallet Connected!";
    } else {
        alert("Please install MetaMask.");
    }
}

async function approveTokens() {
    const amount = document.getElementById("amount").value;
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }
    const amountInWei = ethers.utils.parseUnits(amount, 18);
    try {
        const stakingTokenContract = new ethers.Contract(stakingTokenAddress, abiStakingToken, signer);
        document.getElementById("status").innerText = "⏳ Approving Tokens...";
        const approveTx = await stakingTokenContract.approve(stakingContractAddress, amountInWei);
        await approveTx.wait();
        document.getElementById("status").innerText = "✅ Tokens Approved!";
    } catch (error) {
        console.error("Approval Error:", error);
        document.getElementById("status").innerText = `❌ Error during approval: ${error.message}`;
    }
}

async function stakeTokens() {
    const amount = document.getElementById("amount").value;
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount to stake.");
        return;
    }
    const amountInWei = ethers.utils.parseUnits(amount, 18);
    try {
        const stakingContract = new ethers.Contract(stakingContractAddress, abiStakingContract, signer);
        document.getElementById("status").innerText = "⏳ Staking Tokens...";
        const stakeTx = await stakingContract.stake(amountInWei);
        await stakeTx.wait();
        document.getElementById("status").innerText = `✅ Successfully Staked ${amount} Tokens!`;
    } catch (error) {
        console.error("Staking Error:", error);
        document.getElementById("status").innerText = `❌ Error during staking: ${error.message}`;
    }
}

async function withdrawStakedTokens() {
    const amount = document.getElementById("amount").value;
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount to withdraw.");
        return;
    }
    const amountInWei = ethers.utils.parseUnits(amount, 18);
    try {
        const stakingContract = new ethers.Contract(stakingContractAddress, abiStakingContract, signer);
        document.getElementById("status").innerText = "⏳ Withdrawing Staked Tokens...";
        const withdrawTx = await stakingContract.withdraw(amountInWei);
        await withdrawTx.wait();
        document.getElementById("status").innerText = `✅ Successfully Withdrawn ${amount} Staked Tokens!`;
    } catch (error) {
        console.error("Withdraw Error:", error);
        document.getElementById("status").innerText = `❌ Error during withdrawal: ${error.message}`;
    }
}

async function withdrawRewardTokens() {
    const amount = document.getElementById("amount").value;
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount to withdraw.");
        return;
    }
    const amountInWei = ethers.utils.parseUnits(amount, 18);
    try {
        const stakingContract = new ethers.Contract(stakingContractAddress, abiStakingContract, signer);
        document.getElementById("status").innerText = "⏳ Withdrawing Reward Tokens...";
        const rewardWithdrawTx = await stakingContract.withdrawRewardTokens(amountInWei);
        await rewardWithdrawTx.wait();
        document.getElementById("status").innerText = `✅ Successfully Withdrawn ${amount} Reward Tokens!`;
    } catch (error) {
        console.error("Reward Withdraw Error:", error);
        document.getElementById("status").innerText = `❌ Error during reward withdrawal: ${error.message}`;
    }
}

async function checkStakedBalance() {
    try {
        const stakingContract = new ethers.Contract(stakingContractAddress, abiStakingContract, signer);
        const stakerAddress = await signer.getAddress();
        const [tokensStaked, rewards] = await stakingContract.getStakeInfo(stakerAddress);
        const tokensStakedFormatted = ethers.utils.formatUnits(tokensStaked, 18);
        const rewardsFormatted = ethers.utils.formatUnits(rewards, 18);
        document.getElementById("status").innerText =
            `🎯 Tokens Staked: ${tokensStakedFormatted}\n` +
            `💰 Rewards Earned: ${rewardsFormatted}`;
    } catch (error) {
        console.error("Balance Check Error:", error);
        document.getElementById("status").innerText = `❌ Error checking balance: ${error.message}`;
    }
}
