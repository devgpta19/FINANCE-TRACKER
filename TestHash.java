import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = "$2a$10$Dow1mU9x8XWv9FJX6KzW0eQ6h8f0g6n9zvZk9s5KkQY8xGlFZc6bO";
        String test = "password";
        
        System.out.println("Matches 'password': " + encoder.matches(test, hash));
        System.out.println("Matches '123456': " + encoder.matches("123456", hash));
        System.out.println("Matches 'analyst': " + encoder.matches("analyst", hash));
    }
}
