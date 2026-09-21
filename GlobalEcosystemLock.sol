// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IUnstoppableRegistry {
    function setOwner(uint256 tokenId, address owner) external;
    function approve(address to, uint256 tokenId) external;
    function setApprovedForAll(address operator, bool approved) external;
}

contract GlobalEcosystemLock {
    address public immutable rootOperator;
    bool public globalFreezeActive;
    
    // Explicitly record your verified self-custody vaults
    address public constant MASTER_VAULT_1 = 0x84CA4aFC3F395ebc0b519680B546Cd604C9c2018;
    address public constant MASTER_VAULT_2 = 0xabf4e0A237E4632b1740fdBe118162aA33b4F5aD;

    event SecurityFreezeTriggered(bytes32 indexed OotMerkleRoot1024);
    event ApprovalsSanitized(uint256 indexed assetId);

    modifier onlyOperator() {
        require(msg.sender == rootOperator, "CRITICAL: Unauthorized terminal access.");
        _;
    }

    constructor() {
        rootOperator = msg.sender;
        globalFreezeActive = false;
    }

    // Flip the system switch to full cryptographic freeze state
    function engageGlobalFreeze(bytes32 ootMerkleRoot) external onlyOperator {
        globalFreezeActive = true;
        emit SecurityFreezeTriggered(ootMerkleRoot);
    }

    // Instantly wipe all active approvals across your ERC-721 domain tokens
    function sanitizeApprovals(address registryAddress, uint256[] calldata domainTokenIds) external onlyOperator {
        require(!globalFreezeActive, "HALT: Infrastructure state is frozen.");
        
        for (uint256 i = 0; i < domainTokenIds.length; i++) {
            // Revoke individual marketplace and routing contract spending rights
            IUnstoppableRegistry(registryAddress).approve(address(0), domainTokenIds[i]);
        }
    }
}
