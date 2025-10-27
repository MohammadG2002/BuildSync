# BuildSync Testing Guide

## Overview

BuildSync uses **Jest** for backend testing and **Vitest** for frontend testing, providing comprehensive test coverage for the entire application.

## Backend Testing (Jest + Supertest)

### Setup

All backend tests use an in-memory MongoDB instance (`mongodb-memory-server`) so no external database is required.

### Test Structure

```
backend/src/tests/
├── setup.js                 # Test configuration
├── api/                     # API endpoint tests
│   └── auth.test.js
└── models/                  # Model tests
    └── user.test.js
```

### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Writing Backend Tests

#### API Endpoint Tests

```javascript
import request from "supertest";
import express from "express";
import authRoutes from "../../routes/auth.routes.js";
import { setupTestDB, teardownTestDB, clearTestDB } from "../setup.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth API", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

#### Model Tests

```javascript
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

  it("should hash password before saving", async () => {
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(user.password).not.toBe("password123");
    expect(user.password).toMatch(/^\$2[aby]\$/);
  });
});
```

### Backend Test Coverage

Current test files:

- ✅ `auth.test.js` - Authentication endpoints (register, login, getMe)
- ✅ `user.test.js` - User model validation, password hashing, methods

To add:

- Workspace API tests
- Project API tests
- Task API tests
- Notification API tests
- Middleware tests
- WebSocket tests

## Frontend Testing (Vitest + React Testing Library)

### Setup

Vitest is configured to use `jsdom` environment for DOM testing.

### Test Structure

```
frontend/src/tests/
├── setup.js                    # Test configuration
├── components/                 # Component tests
│   ├── Button.test.jsx
│   └── Card.test.jsx
└── hooks/                      # Hook tests
    └── useLocalStorage.test.jsx
```

### Running Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Writing Frontend Tests

#### Component Tests

```javascript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Button from "../../components/common/Button";

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", async () => {
    const handleClick = vi.fn();
    const { user } = render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Hook Tests

```javascript
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useLocalStorage } from "../../hooks/useLocalStorage";

describe("useLocalStorage Hook", () => {
  it("should initialize with default value", () => {
    const { result } = renderHook(() => useLocalStorage("key", "default"));

    expect(result.current[0]).toBe("default");
  });

  it("should update value", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
  });
});
```

#### Context Tests

```javascript
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../context/AuthContext";

const TestComponent = () => {
  const { user, login } = useAuth();
  return <div>{user ? user.name : "Not logged in"}</div>;
};

describe("AuthContext", () => {
  it("provides auth context", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText("Not logged in")).toBeInTheDocument();
  });
});
```

### Frontend Test Coverage

Current test files:

- ✅ `Button.test.jsx` - Button component variants, sizes, states
- ✅ `Card.test.jsx` - Card component with header, footer, actions
- ✅ `useLocalStorage.test.jsx` - Local storage hook functionality

To add:

- Modal component tests
- Form component tests
- Context tests (AuthContext, ThemeContext, etc.)
- Service tests (API calls)
- Integration tests (user flows)

## Test Utilities

### Backend Test Helpers

```javascript
// setup.js
export const setupTestDB = async () => {
  // Creates in-memory MongoDB
};

export const teardownTestDB = async () => {
  // Cleans up test database
};

export const clearTestDB = async () => {
  // Clears all collections between tests
};
```

### Frontend Test Helpers

```javascript
// Custom render with providers
const renderWithProviders = (ui, options) => {
  return render(
    <AuthProvider>
      <ThemeProvider>{ui}</ThemeProvider>
    </AuthProvider>,
    options
  );
};
```

## Best Practices

### General

1. **Test Naming**: Use descriptive test names starting with "should"
2. **AAA Pattern**: Arrange, Act, Assert
3. **Isolation**: Each test should be independent
4. **Coverage**: Aim for >80% code coverage
5. **Speed**: Keep tests fast (mock external dependencies)

### Backend

1. **Use In-Memory DB**: Faster and no cleanup needed
2. **Clean Between Tests**: Clear data with `afterEach`
3. **Test Edge Cases**: Invalid inputs, errors, edge conditions
4. **Mock External Services**: Don't call real APIs
5. **Test Status Codes**: Verify correct HTTP responses

### Frontend

1. **Query by Role**: Use `getByRole` for better a11y
2. **User Events**: Use `@testing-library/user-event`
3. **Avoid Implementation Details**: Test behavior, not implementation
4. **Mock API Calls**: Use `vi.mock()` for API services
5. **Test Accessibility**: Ensure components are accessible

## Coverage Reports

### Backend

```bash
npm run test:coverage
```

View coverage: `backend/coverage/index.html`

### Frontend

```bash
npm run test:coverage
```

View coverage: `frontend/coverage/index.html`

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd backend && npm ci
      - run: cd backend && npm test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm ci
      - run: cd frontend && npm test
```

## Debugging Tests

### Backend

```bash
# Run specific test file
npm test -- auth.test.js

# Run with verbose output
npm test -- --verbose

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Frontend

```bash
# Run specific test file
npm test -- Button.test.jsx

# Run tests matching pattern
npm test -- --grep "Button"

# Update snapshots
npm test -- -u
```

## Common Issues

### Backend

**Issue**: MongoDB connection timeout
**Solution**: Ensure `mongodb-memory-server` is properly installed

**Issue**: Tests hanging
**Solution**: Use `forceExit: true` in jest.config.js

### Frontend

**Issue**: "document is not defined"
**Solution**: Ensure `environment: 'jsdom'` in vitest.config.js

**Issue**: "localStorage is not defined"
**Solution**: Mock localStorage in setup.js

## Next Steps

1. ✅ Backend test infrastructure setup
2. ✅ Frontend test infrastructure setup
3. ⏳ Add workspace API tests
4. ⏳ Add project API tests
5. ⏳ Add task API tests
6. ⏳ Add more component tests
7. ⏳ Add integration tests
8. ⏳ Add E2E tests with Playwright/Cypress

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

---

**Happy Testing!** 🧪
