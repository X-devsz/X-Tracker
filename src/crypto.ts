import { getRandomValues } from 'expo-crypto';

const globalCrypto = globalThis as typeof globalThis & {
  crypto?: Crypto;
};

if (!globalCrypto.crypto) {
  globalCrypto.crypto = {} as Crypto;
}

if (!globalCrypto.crypto.getRandomValues) {
  globalCrypto.crypto.getRandomValues = getRandomValues as Crypto['getRandomValues'];
}
