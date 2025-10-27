import User from "../../models/User.js";
import { setupTestDB, teardownTestDB, clearTestDB } from "../setup.js";

describe("User Model", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe("User Creation", () => {
    it("should create a user with valid data", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const user = await User.create(userData);

      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user.role).toBe("user"); // Default role
      expect(user.isActive).toBe(true); // Default active
    });

    it("should fail without required fields", async () => {
      const user = new User({});

      await expect(user.save()).rejects.toThrow();
    });

    it("should lowercase email", async () => {
      const userData = {
        name: "Test User",
        email: "TEST@EXAMPLE.COM",
        password: "password123",
      };

      const user = await User.create(userData);

      expect(user.email).toBe("test@example.com");
    });

    it("should trim whitespace from name and email", async () => {
      const userData = {
        name: "  Test User  ",
        email: "  test@example.com  ",
        password: "password123",
      };

      const user = await User.create(userData);

      expect(user.name).toBe("Test User");
      expect(user.email).toBe("test@example.com");
    });
  });

  describe("Password Methods", () => {
    it("should hash password before saving", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const user = await User.create(userData);

      expect(user.password).not.toBe("password123");
      expect(user.password).toMatch(/^\$2[aby]\$/); // Bcrypt hash format
    });

    it("should compare password correctly", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const user = await User.create(userData);
      const userWithPassword = await User.findById(user._id).select(
        "+password"
      );

      const isMatch = await userWithPassword.comparePassword("password123");
      const isNotMatch = await userWithPassword.comparePassword(
        "wrongpassword"
      );

      expect(isMatch).toBe(true);
      expect(isNotMatch).toBe(false);
    });

    it("should not rehash password if not modified", async () => {
      const user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      const originalPassword = user.password;

      // Update non-password field
      user.name = "Updated Name";
      await user.save();

      expect(user.password).toBe(originalPassword);
    });
  });

  describe("User Methods", () => {
    it("should remove sensitive fields in toJSON", async () => {
      const user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      const json = user.toJSON();

      expect(json.password).toBeUndefined();
      expect(json.refreshToken).toBeUndefined();
      expect(json.passwordResetToken).toBeUndefined();
    });
  });

  describe("Validation", () => {
    it("should fail with invalid email format", async () => {
      const userData = {
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should fail with short password", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "123",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should fail with duplicate email", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      await User.create(userData);

      // Try to create another user with same email
      await expect(User.create(userData)).rejects.toThrow();
    });
  });
});
