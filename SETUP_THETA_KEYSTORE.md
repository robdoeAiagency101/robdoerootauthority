# Setup Theta Node Keystore as GitHub Secret

This keystore will be used for:
- ✅ ECDSA signing of sealed builds
- ✅ Theta Guardian Node attestations
- ✅ On-chain proof generation
- ✅ Non-repudiation (cannot deny signing)

## 🔐 Add to GitHub Secrets

Run this PowerShell command to add your Theta keystore:

```powershell
# Store the keystore JSON as a secret
$keystore = @'
{"version":3,"id":"2c1b8274-e0ee-4288-9353-bb86e7063fa9","address":"13e3468b1cfb3d45c116341f28ec4714333d7bbc","crypto":{"ciphertext":"a791cbf48c05d59ddee62da8388eb6ec47d423f65b56cbcc6d29fbc181f1185b","cipherparams":{"iv":"35a33d172cd6aafd515900c97d74ebfd"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"faf49e64a3d1989153a6df7764c00e845b1f4dcb46c6014639103c7c4a410fb3","n":8192,"r":8,"p":1},"mac":"55cda854e858752abba84249c2047e66558bdb05a137224829b1cb04f3713428"}}
'@

gh secret set ETHEREUM_KEYSTORE -b $keystore -R robdoeAiagency101/robdoerootauthority
```

Then add the password:

```powershell
gh secret set ETHEREUM_PASSWORD -b "YOUR_KEYSTORE_PASSWORD" -R robdoeAiagency101/robdoerootauthority
```

(Replace `YOUR_KEYSTORE_PASSWORD` with your actual keystore password)

## ✅ Verify Setup

```powershell
gh secret list -R robdoeAiagency101/robdoerootauthority
```

Should show:
```
ETHEREUM_KEYSTORE    
ETHEREUM_PASSWORD    
```

## 🚀 Then Push

```powershell
git push origin main
```

All workflows will automatically:
- Load your keystore
- Sign with your private key (ECDSA)
- Create Theta Guardian Node submissions
- Generate cryptographic proofs
- Everything non-repudiation secured
