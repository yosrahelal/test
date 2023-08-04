// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop {
    ///@notice transferToken, this function allow a transfer a specific amount of tokens from the msg.sender 
    /// to the specific recipient
    ///@param tokenAddress, the erc20 token address to be used  
    ///@param recipient, the recipient address 
    ///@param amount, the amount of tokens to send 
    /// Before each call of this function the msg.sender need to approve the smart contract to use his tokens
    function transferToken(address tokenAddress, address recipient, uint256 amount) public {
        IERC20(tokenAddress).transferFrom(msg.sender, recipient, amount);
    }

    ///@notice transferEth, payable function to send ETH to a specific recipient
    ///@param recipient, the recipient address 
    function transferEth(address payable recipient) public payable {
        recipient.transfer(msg.value);
    }
}
