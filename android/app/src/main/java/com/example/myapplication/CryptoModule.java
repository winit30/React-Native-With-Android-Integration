package com.example.myapplication;

import android.util.Base64;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class CryptoModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  CryptoModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "CryptoModule";
  }

  @ReactMethod
   public void show(String message, int duration) {
     Toast.makeText(getReactApplicationContext(), message, duration).show();
   }

   @ReactMethod
   public void encrypt(String rawData, String key, Callback callback) {
      try {
      Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
           byte[] keyBytes = new byte[16];
           byte[] b = key.getBytes("UTF-8");
           int len = b.length;
           if (len > keyBytes.length)
              len = keyBytes.length;
           System.arraycopy(b, 0, keyBytes, 0, len);
           SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
           IvParameterSpec ivSpec = new IvParameterSpec(keyBytes);
           cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
           byte[] results = cipher.doFinal(rawData.getBytes("UTF-8"));
           System.out.println("Encrypted Text " + Base64.encodeToString(results, Base64.DEFAULT));
           callback.invoke(Base64.encodeToString(results, Base64.DEFAULT));

      } catch (Exception ex) {
          // throw new ConsumerCreditGenericException(ConsumerCreditExceptionCodes.DECRYPTION_ERROR);
      }
   };

    @ReactMethod
    public static String decrypt(String encryptedData, String key){
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            byte[] keyBytes = new byte[16];
            byte[] b = key.getBytes("UTF-8");
            int len = b.length;
            if (len > keyBytes.length)
                len = keyBytes.length;
            System.arraycopy(b, 0, keyBytes, 0, len);
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(keyBytes);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
            //BASE64Decoder decoder = new BASE64Decoder();
            //byte[] results = cipher.doFinal(decoder.decodeBuffer(encryptedData));
            //return new String(results, "UTF-8");
            return "decrypt";

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            //throw new ConsumerCreditGenericException(ConsumerCreditExceptionCodes.DECRYPTION_ERROR);
        }

        return "boom";
    }

}
