/**
 * FHEVM Core - Based on fhevm-react-template
 * Initializes FHEVM instance and provides encryption/decryption functions
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fheInstance: any = null;

/**
 * Initialize FHEVM instance for browser
 */
export async function initializeFheInstance() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Ethereum provider not found. Please install MetaMask.');
  }

  // Load RelayerSDK from CDN
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sdk = (window as any).RelayerSDK || (window as any).relayerSDK;
  
  if (!sdk) {
    // Load the SDK script if not already loaded
    await loadRelayerSDK();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sdk = (window as any).RelayerSDK || (window as any).relayerSDK;
  }

  if (!sdk) {
    throw new Error('RelayerSDK not loaded. Please include the script tag in your HTML.');
  }

  const { initSDK, createInstance, SepoliaConfig } = sdk;

  // Initialize SDK
  await initSDK();
  console.log('✅ FHEVM SDK initialized');
  
  const config = { ...SepoliaConfig, network: window.ethereum };
  
  try {
    fheInstance = await createInstance(config);
    return fheInstance;
  } catch (err) {
    console.error('FHEVM instance creation failed:', err);
    throw err;
  }
}

/**
 * Load RelayerSDK from CDN
 */
function loadRelayerSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).RelayerSDK || (window as any).relayerSDK) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.zama.org/relayer-sdk-js/0.3.0-5/relayer-sdk-js.umd.cjs';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load RelayerSDK'));
    document.head.appendChild(script);
  });
}

/**
 * Create encrypted input for contract
 */
export async function createEncryptedInput(
  contractAddress: string,
  userAddress: string,
  value: number
): Promise<{ encryptedData: string; proof: string }> {
  if (!fheInstance) {
    await initializeFheInstance();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputHandle: any = fheInstance.createEncryptedInput(contractAddress, userAddress);
  inputHandle.add32(value); // Use 32-bit for tip amounts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = await inputHandle.encrypt();
  
  // The FHEVM SDK returns an object with handles and inputProof
  if (result && typeof result === 'object') {
    if (result.handles && Array.isArray(result.handles) && result.handles.length > 0) {
      return {
        encryptedData: result.handles[0],
        proof: result.inputProof || '0x'
      };
    } else if (result.encryptedData && result.proof) {
      return {
        encryptedData: result.encryptedData,
        proof: result.proof
      };
    }
  }
  
  // Fallback
  return {
    encryptedData: result as string,
    proof: '0x'
  };
}

/**
 * Decrypt value using EIP-712 signature
 */
export async function decryptValue(
  handle: string,
  contractAddress: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signer: any
): Promise<number> {
  if (!fheInstance) {
    await initializeFheInstance();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keypair: any = fheInstance.generateKeypair();
  const handleContractPairs = [{
    handle: handle,
    contractAddress: contractAddress,
  }];
  
  const startTimeStamp = Math.floor(Date.now() / 1000).toString();
  const durationDays = "10";
  const contractAddresses = [contractAddress];

  const eip712 = fheInstance.createEIP712(
    keypair.publicKey,
    contractAddresses,
    startTimeStamp,
    durationDays
  );

  const signature = await signer.signTypedData(
    eip712.domain,
    {
      UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
    },
    eip712.message
  );

  const result = await fheInstance.userDecrypt(
    handleContractPairs,
    keypair.privateKey,
    keypair.publicKey,
    signature.replace("0x", ""),
    contractAddresses,
    await signer.getAddress(),
    startTimeStamp,
    durationDays
  );

  return Number(result[handle]);
}

/**
 * Public decrypt (no signature required)
 */
export async function publicDecrypt(handle: string): Promise<number> {
  if (!fheInstance) {
    await initializeFheInstance();
  }

  return await fheInstance.publicDecrypt(handle);
}

