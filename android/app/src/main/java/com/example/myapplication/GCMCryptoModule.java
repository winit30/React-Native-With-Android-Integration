package com.example.myapplication;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.util.Base64;

public class GCMCryptoModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  GCMCryptoModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "GCMCryptoModule";
  }

  private Cipher initCipher(SecretKey secretKey, byte[] iv, int encryptMode) throws Exception {
    Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
    cipher.init(encryptMode, secretKey, new GCMParameterSpec(128, iv));
    return cipher;
  }

  public String encrypt(String plainText, String key) throws Exception {
    SecretKey secretKey = new SecretKeySpec(key.getBytes(), "AES");
    byte[] iv = new byte[12];
    Cipher cipher = initCipher(secretKey, iv, Cipher.ENCRYPT_MODE);
    byte[] cipherText = cipher.doFinal(plainText.getBytes());
    ByteBuffer byteBuffer = ByteBuffer.allocate(4 + iv.length + cipherText.length);
    byteBuffer.putInt(iv.length);
    byteBuffer.put(iv);
    byteBuffer.put(cipherText);
    byte[] cipherMessage = byteBuffer.array();
    return Base64.getEncoder().encodeToString(cipherMessage);
  }

  public String decrypt(String secretText, String key) throws Exception {
    SecretKey secretKey = new SecretKeySpec(key.getBytes(), "AES");
    byte[] cipherMessage = Base64.getDecoder().decode(secretText);

    ByteBuffer byteBuffer = ByteBuffer.wrap(cipherMessage);
    int ivLength = byteBuffer.getInt();
    if (ivLength < 12 || ivLength >= 16) {
    throw new IllegalArgumentException("invalid iv length");
    }

    byte[] iv = new byte[ivLength];
    byteBuffer.get(iv);

    byte[] cipherText = new byte[byteBuffer.remaining()];
    byteBuffer.get(cipherText);

    return new String(decipherText(secretKey, iv, cipherText));
  }

  private byte[] decipherText(SecretKey aes, byte[] iv, byte[] cipherText) throws Exception {
    Cipher cipher = initCipher(aes, iv, Cipher.DECRYPT_MODE);
    return cipher.doFinal(cipherText);
  }

  @ReactMethod
  public void nativeEncrypt(String plainText, String key, Callback errorCallback, Callback successCallback){
    try{
      //currently encrypt method has been placed in this file it can later be imported from the existing java file without touching any existing java code
      String encryptedData = encrypt(plainText, key);
      successCallback.invoke(encryptedData);
    }catch (Exception e){
      errorCallback.invoke(e.getMessage());
    }
  }

  @ReactMethod
  public void nativeDecrypt(String secretText, String key, Callback errorCallback, Callback successCallback){
    try{
      //currently decrypt method has been placed in this file it can later be imported from the existing java file without touching any existing java code
      String decryptedData = decrypt(secretText, key);
      successCallback.invoke(decryptedData);
    }catch (Exception e){
      errorCallback.invoke(e.getMessage());
    }
  }

}