// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {EthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Private Tips Contract with FHE
/// @notice Allows users to send encrypted tips to KOLs
contract PrivateTips is EthereumConfig {
    // Mapping from KOL address to encrypted balance
    mapping(address => euint32) private _balances;
    
    // Mapping from user to KOL to encrypted total tips sent
    mapping(address => mapping(address => euint32)) private _tipsSent;
    
    /// @notice Send an encrypted tip to a KOL
    /// @param kolAddress The address of the KOL receiving the tip
    /// @param inputEuint32 The encrypted tip amount
    /// @param inputProof The input proof
    function sendTip(
        address kolAddress,
        externalEuint32 inputEuint32,
        bytes calldata inputProof
    ) external payable {
        require(kolAddress != address(0), "Invalid KOL address");
        require(msg.value > 0, "Must send ETH");
        
        // Convert external encrypted value to internal
        euint32 encryptedAmount = FHE.fromExternal(inputEuint32, inputProof);
        
        // Add to KOL's encrypted balance
        _balances[kolAddress] = FHE.add(_balances[kolAddress], encryptedAmount);
        
        // Track tips sent from this user to this KOL
        _tipsSent[msg.sender][kolAddress] = FHE.add(
            _tipsSent[msg.sender][kolAddress],
            encryptedAmount
        );
        
        // Allow decryption permissions
        FHE.allowThis(_balances[kolAddress]);
        FHE.allow(_balances[kolAddress], kolAddress);
        FHE.allow(_balances[kolAddress], msg.sender);
    }
    
    /// @notice Get encrypted balance for a KOL
    /// @param kolAddress The KOL address
    /// @return The encrypted balance
    function getBalance(address kolAddress) external view returns (euint32) {
        return _balances[kolAddress];
    }
    
    /// @notice Get encrypted total tips sent from user to KOL
    /// @param userAddress The user address
    /// @param kolAddress The KOL address
    /// @return The encrypted total tips
    function getTipsSent(address userAddress, address kolAddress) 
        external 
        view 
        returns (euint32) 
    {
        return _tipsSent[userAddress][kolAddress];
    }
}

