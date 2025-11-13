/**
 * React Hooks for FHEVM - Based on fhevm-react-template
 */

import { useState, useCallback, useEffect } from 'react';
import { initializeFheInstance, createEncryptedInput, decryptValue, publicDecrypt } from './core';
import { ethers } from 'ethers';

/**
 * Hook to initialize FHEVM
 */
export function useFhevm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [instance, setInstance] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const initialize = useCallback(async () => {
    setStatus('loading');
    setError('');
    
    try {
      const fheInstance = await initializeFheInstance();
      setInstance(fheInstance);
      setStatus('ready');
      console.log('✅ FHEVM initialized');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
      console.error('❌ FHEVM initialization failed:', err);
    }
  }, []);

  return {
    instance,
    status,
    error,
    initialize,
    isInitialized: status === 'ready',
  };
}

/**
 * Hook for encryption
 */
export function useEncrypt() {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string>('');

  const encrypt = useCallback(async (contractAddress: string, userAddress: string, value: number) => {
    setIsEncrypting(true);
    setError('');
    
    try {
      const result = await createEncryptedInput(contractAddress, userAddress, value);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
      throw err;
    } finally {
      setIsEncrypting(false);
    }
  }, []);

  return {
    encrypt,
    isEncrypting,
    error,
  };
}

/**
 * Hook for decryption
 */
export function useDecrypt() {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string>('');

  const decrypt = useCallback(async (
    handle: string,
    contractAddress: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signer: any
  ) => {
    setIsDecrypting(true);
    setError('');
    
    try {
      const result = await decryptValue(handle, contractAddress, signer);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
      throw err;
    } finally {
      setIsDecrypting(false);
    }
  }, []);

  const publicDecryptValue = useCallback(async (handle: string) => {
    setIsDecrypting(true);
    setError('');
    
    try {
      const result = await publicDecrypt(handle);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Public decryption failed');
      throw err;
    } finally {
      setIsDecrypting(false);
    }
  }, []);

  return {
    decrypt,
    publicDecrypt: publicDecryptValue,
    isDecrypting,
    error,
  };
}

/**
 * Hook for contract interactions
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useContract(contractAddress: string, abi: any[]) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (!contractAddress || !window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contractInstance = new ethers.Contract(contractAddress, abi, provider);
    setContract(contractInstance);
  }, [contractAddress, abi]);

  return { contract };
}

