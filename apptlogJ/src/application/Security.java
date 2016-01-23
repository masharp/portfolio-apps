package application;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Security {
	
	public static boolean isPasswordCorrect(String passwordHash, String password) {
		return (passwordHash.equals(hashPassword(password)));
	}
	
	public static String hashPassword(String password) {
		
		try {
			return SHA1(password);
		} catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
	}
	
	//uses a hex conversion algorithm that shifts bytes to produce a SHA1 hash (taken from StackOverflow)
    public static String SHA1(String text) throws NoSuchAlgorithmException, UnsupportedEncodingException  { 
        MessageDigest messageDigest;      
        byte[] sha1hash = new byte[40];
        
        messageDigest = MessageDigest.getInstance("SHA-1");
        
        messageDigest.update(text.getBytes("iso-8859-1"), 0, text.length());
        sha1hash = messageDigest.digest();
        
        return convertToHex(sha1hash);
    } 
	
    public static String convertToHex(byte[] data) { 
        StringBuffer buffer = new StringBuffer();
        
        for (int i = 0; i < data.length; i++) { 
        	
            int halfbyte = (data[i] >>> 4) & 0x0F;
            int two_halfs = 0;
            
            do { 
                if ((0 <= halfbyte) && (halfbyte <= 9)) 
                    buffer.append((char) ('0' + halfbyte));
                else 
                    buffer.append((char) ('a' + (halfbyte - 10)));
                	halfbyte = data[i] & 0x0F;
            } while(two_halfs++ < 1);
        } 
        return buffer.toString();
    } 
}
