// Handles: Authentication business logic
authService = {
  register(userData),    // Create user, hash password
  login(credentials),    // Verify email/password, generate token
  generateToken(user)    // Create JWT
}