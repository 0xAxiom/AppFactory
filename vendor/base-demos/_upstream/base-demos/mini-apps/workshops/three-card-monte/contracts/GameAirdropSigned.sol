// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title GameAirdropSigned
 * @dev Contract to handle payments and rewards for web3 games with signed rewards
 * @custom:security-contact patrick.hughes@coinbase.com
 */
contract GameAirdropSigned {
    using SafeERC20 for IERC20;

    // State Variables
    uint256 public ethEntryFee;
    uint256 public usdcEntryFee;
    address public owner;
    IERC20 public immutable usdcToken;

    // Payout amounts
    uint256 public ethPayoutAmount;
    uint256 public usdcPayoutAmount;

    // Mappings for claimable rewards
    mapping(address => uint256) public ethRewards;
    mapping(address => uint256) public usdcRewards;
    
    // Track used signatures to prevent replay attacks
    mapping(bytes => bool) public usedSignatures;

    // Events
    event GameStarted(address indexed player, bool payWithETH, uint256 amount);
    event EntryFeeUpdated(bool isETH, uint256 oldFee, uint256 newFee);
    event RewardClaimed(address indexed player, bool wasETH, uint256 amount);
    event FundsWithdrawn(address indexed token, uint256 amount);
    event RewardRecorded(address indexed player, uint256 amount, bool isETH);
    event PayoutAmountUpdated(bool isETH, uint256 oldAmount, uint256 newAmount);
    event ContractFunded(address indexed token, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Custom errors
    error InsufficientFee(uint256 sent, uint256 required);
    error OnlyOwner();
    error WithdrawalFailed();
    error NoRewardsToClaim();
    error InvalidToken();
    error InvalidSignature();
    error SignatureAlreadyUsed();
    error ExpiredSignature();
    error InsufficientContractBalance();

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert OnlyOwner();
        }
        _;
    }

    /**
     * @dev Constructor to initialize the game contract
     * @param _ethEntryFee The initial ETH entry fee in wei
     * @param _usdcEntryFee The initial USDC entry fee (6 decimals)
     * @param _usdcToken Address of the USDC token contract
     * @param _ethPayoutAmount Initial ETH payout amount in wei
     * @param _usdcPayoutAmount Initial USDC payout amount
     */
    constructor(
        uint256 _ethEntryFee,
        uint256 _usdcEntryFee,
        address _usdcToken,
        uint256 _ethPayoutAmount,
        uint256 _usdcPayoutAmount
    ) payable {
        owner = msg.sender;
        ethEntryFee = _ethEntryFee;
        usdcEntryFee = _usdcEntryFee;
        usdcToken = IERC20(_usdcToken);
        ethPayoutAmount = _ethPayoutAmount;
        usdcPayoutAmount = _usdcPayoutAmount;

        // If constructor is called with ETH, emit funding event
        if (msg.value > 0) {
            emit ContractFunded(address(0), msg.value);
        }
    }

    /**
     * @dev Allows owner to fund the contract with ETH
     */
    function fundContract() external payable onlyOwner {
        if (msg.value == 0) revert InsufficientFee(0, 1);
        emit ContractFunded(address(0), msg.value);
    }

    /**
     * @dev Allows owner to fund the contract with USDC
     * @param amount Amount of USDC to fund
     */
    function fundContractUSDC(uint256 amount) external onlyOwner {
        if (amount == 0) revert InsufficientFee(0, 1);
        usdcToken.safeTransferFrom(msg.sender, address(this), amount);
        emit ContractFunded(address(usdcToken), amount);
    }

    /**
     * @dev Updates the ETH payout amount
     * @param newAmount New ETH payout amount in wei
     */
    function setEthPayoutAmount(uint256 newAmount) external onlyOwner {
        uint256 oldAmount = ethPayoutAmount;
        ethPayoutAmount = newAmount;
        emit PayoutAmountUpdated(true, oldAmount, newAmount);
    }

    /**
     * @dev Updates the USDC payout amount
     * @param newAmount New USDC payout amount
     */
    function setUsdcPayoutAmount(uint256 newAmount) external onlyOwner {
        uint256 oldAmount = usdcPayoutAmount;
        usdcPayoutAmount = newAmount;
        emit PayoutAmountUpdated(false, oldAmount, newAmount);
    }

    /**
     * @dev Allows a player to start a new game by paying the entry fee
     * @param payWithETH True if paying with ETH, false for USDC
     */
    function startGame(bool payWithETH) external payable {
        if (payWithETH) {
            if (msg.value != ethEntryFee) {
                revert InsufficientFee(msg.value, ethEntryFee);
            }
            emit GameStarted(msg.sender, true, ethEntryFee);
        } else {
            if (msg.value > 0) revert InsufficientFee(msg.value, 0);
            usdcToken.safeTransferFrom(msg.sender, address(this), usdcEntryFee);
            emit GameStarted(msg.sender, false, usdcEntryFee);
        }
    }

    /**
     * @dev Updates the entry fee for future games
     * @param isETH True to update ETH fee, false for USDC fee
     * @param newFee The new entry fee
     */
    function setEntryFee(bool isETH, uint256 newFee) external onlyOwner {
        if (isETH) {
            uint256 oldFee = ethEntryFee;
            ethEntryFee = newFee;
            emit EntryFeeUpdated(true, oldFee, newFee);
        } else {
            uint256 oldFee = usdcEntryFee;
            usdcEntryFee = newFee;
            emit EntryFeeUpdated(false, oldFee, newFee);
        }
    }

    /**
     * @dev Records a reward for a player using a signed message
     * @param player Address of the player
     * @param isETH True if reward is in ETH, false for USDC
     * @param deadline Timestamp after which the signature is no longer valid
     * @param signature The signature from the owner
     */
    function recordReward(
        address player,
        bool isETH,
        uint256 deadline,
        bytes calldata signature
    ) external {
        // Check if signature is expired
        if (block.timestamp > deadline) {
            revert ExpiredSignature();
        }

        // Check if signature has been used
        if (usedSignatures[signature]) {
            revert SignatureAlreadyUsed();
        }

        // Get the payout amount based on token type
        uint256 amount = isETH ? ethPayoutAmount : usdcPayoutAmount;

        // Check if contract has enough balance
        if (isETH) {
            if (amount > address(this).balance) revert InsufficientContractBalance();
        } else {
            if (amount > usdcToken.balanceOf(address(this))) revert InsufficientContractBalance();
        }

        // Create the message hash
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                player,
                isETH,
                deadline,
                address(this)
            )
        );

        // Add Ethereum Signed Message prefix
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        // Recover the signer
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        address signer = ecrecover(ethSignedMessageHash, v, r, s);

        // Verify the signer is the owner
        if (signer != owner) {
            revert InvalidSignature();
        }

        // Mark signature as used
        usedSignatures[signature] = true;

        // Record the reward
        if (isETH) {
            ethRewards[player] += amount;
        } else {
            usdcRewards[player] += amount;
        }

        emit RewardRecorded(player, amount, isETH);
    }

    /**
     * @dev Splits a signature into r, s, v components
     * @param sig The signature to split
     * @return r First 32 bytes of the signature
     * @return s Next 32 bytes of the signature
     * @return v Final byte of the signature
     */
    function splitSignature(bytes calldata sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := calldataload(sig.offset)
            s := calldataload(add(sig.offset, 32))
            v := byte(0, calldataload(add(sig.offset, 64)))
        }
    }

    /**
     * @dev Allows players to claim their rewards
     * @param isETH True to claim ETH rewards, false for USDC rewards
     */
    function claimReward(bool isETH) external {
        uint256 reward;
        
        if (isETH) {
            reward = ethRewards[msg.sender];
            if (reward == 0) revert NoRewardsToClaim();
            ethRewards[msg.sender] = 0;
            (bool success,) = msg.sender.call{value: reward}("");
            if (!success) revert WithdrawalFailed();
        } else {
            reward = usdcRewards[msg.sender];
            if (reward == 0) revert NoRewardsToClaim();
            usdcRewards[msg.sender] = 0;
            usdcToken.safeTransfer(msg.sender, reward);
        }

        emit RewardClaimed(msg.sender, isETH, reward);
    }

    /**
     * @dev Withdraws funds to the owner address
     * @param token Address of token to withdraw (address(0) for ETH)
     * @param amount Amount to withdraw
     */
    function withdrawFunds(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            if (amount > address(this).balance) revert InsufficientFee(amount, address(this).balance);
            (bool success,) = owner.call{value: amount}("");
            if (!success) revert WithdrawalFailed();
        } else if (token == address(usdcToken)) {
            if (amount > usdcToken.balanceOf(address(this))) revert InsufficientFee(amount, usdcToken.balanceOf(address(this)));
            usdcToken.safeTransfer(owner, amount);
        } else {
            revert InvalidToken();
        }
        emit FundsWithdrawn(token, amount);
    }

    /**
     * @dev Returns the current balance of the contract
     * @return ethBalance The ETH balance in wei
     * @return usdcBalance The USDC balance
     */
    function getContractBalance() external view returns (uint256 ethBalance, uint256 usdcBalance) {
        return (address(this).balance, usdcToken.balanceOf(address(this)));
    }

    /**
     * @dev Returns the claimable rewards for a player
     * @param player Address of the player
     * @return ethReward ETH rewards balance
     * @return usdcReward USDC rewards balance
     */
    function getRewards(address player) external view returns (uint256 ethReward, uint256 usdcReward) {
        return (ethRewards[player], usdcRewards[player]);
    }

    /**
     * @dev Transfers ownership of the contract to a new owner
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }

    // Required to receive ETH
    receive() external payable {}
} 