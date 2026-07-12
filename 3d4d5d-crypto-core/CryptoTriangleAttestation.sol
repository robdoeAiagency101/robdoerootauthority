// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * 3D+4D+5D Cryptographic Triangle - On-Chain Attestation Registry
 * Stores sealed build attestations on Ethereum blockchain
 */

contract CryptoTriangleAttestation {
    
    // Attestation structure
    struct Attestation {
        bytes32 sealHash;           // Cryptographic seal
        bytes32 imageDigest;        // Docker image SHA256
        bytes32 sourceHash;         // Source code SHA256
        address signer;             // Keystore address
        uint256 timestamp;          // Block timestamp
        string ipfsHash;            // IPFS reference for full data
        bool verified;              // Verification status
        string robdoeWitness;       // robdoe.com signature
    }
    
    // Storage
    mapping(bytes32 => Attestation) public attestations;
    mapping(address => uint256) public signerCount;
    
    address public owner;
    address public robdoeWitness;
    
    event AttestationSealed(
        bytes32 indexed sealHash,
        bytes32 indexed imageDigest,
        address indexed signer,
        uint256 timestamp
    );
    
    event AttestationVerified(
        bytes32 indexed sealHash,
        bool verified
    );
    
    constructor(address _robdoeWitness) {
        owner = msg.sender;
        robdoeWitness = _robdoeWitness;
    }
    
    /**
     * Submit sealed attestation to chain
     */
    function submitAttestation(
        bytes32 _sealHash,
        bytes32 _imageDigest,
        bytes32 _sourceHash,
        string memory _ipfsHash,
        string memory _robdoeSignature
    ) public {
        require(_sealHash != bytes32(0), "Invalid seal hash");
        require(_imageDigest != bytes32(0), "Invalid image digest");
        
        attestations[_sealHash] = Attestation({
            sealHash: _sealHash,
            imageDigest: _imageDigest,
            sourceHash: _sourceHash,
            signer: msg.sender,
            timestamp: block.timestamp,
            ipfsHash: _ipfsHash,
            verified: false,
            robdoeWitness: _robdoeSignature
        });
        
        signerCount[msg.sender]++;
        
        emit AttestationSealed(
            _sealHash,
            _imageDigest,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * Verify attestation on chain
     */
    function verifyAttestation(bytes32 _sealHash) public {
        require(attestations[_sealHash].sealHash != bytes32(0), "Attestation not found");
        require(msg.sender == robdoeWitness || msg.sender == owner, "Only witness can verify");
        
        attestations[_sealHash].verified = true;
        
        emit AttestationVerified(_sealHash, true);
    }
    
    /**
     * Get attestation details
     */
    function getAttestation(bytes32 _sealHash) 
        public 
        view 
        returns (Attestation memory) 
    {
        return attestations[_sealHash];
    }
    
    /**
     * Check if attestation exists and is verified
     */
    function isAttested(bytes32 _sealHash) 
        public 
        view 
        returns (bool) 
    {
        return attestations[_sealHash].verified;
    }
    
    /**
     * Get attestation count for signer
     */
    function getSignerAttestedCount(address _signer) 
        public 
        view 
        returns (uint256) 
    {
        return signerCount[_signer];
    }
}
