import crypto from 'crypto';

// Function to get a 32-byte key by hashing the provided key (or a default key).
const getEncryptionKey = (key: string): Buffer => {
  // Generate a 32-byte key using SHA-256 (this will always give a 256-bit key)
  return crypto.createHash('sha256').update(key).digest();
};

// Encryption function
export const encryptAnswer = (answer: string): string => {
  const key = getEncryptionKey(process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'secretkey'); // Get the 32-byte key
  const iv = crypto.randomBytes(16); // Generate a random 16-byte IV
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv); // Create the cipher with key and IV

  let encrypted = cipher.update(answer, 'utf8', 'hex'); // Encrypt the answer
  encrypted += cipher.final('hex'); // Finalize the encryption

  // Return the IV (prepended to the encrypted text) and the encrypted data
  return iv.toString('hex') + encrypted;
};

// Decryption function
export const decryptAnswer = (encryptedAnswer: string): string => {
  // Extract the IV (first 16 bytes of the encrypted text)
  const iv = Buffer.from(encryptedAnswer.slice(0, 32), 'hex'); // First 16 bytes as IV
  const encryptedText = encryptedAnswer.slice(32); // The rest is the actual encrypted answer

  const key = getEncryptionKey(process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'secretkey'); // Get the 32-byte key
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv); // Create the decipher with key and IV

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8'); // Decrypt the text
  decrypted += decipher.final('utf8'); // Finalize the decryption

  return decrypted;
};
