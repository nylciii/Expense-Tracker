# Provider Scopes in NestJS - Examples

## Understanding Provider Scopes

NestJS providers have three different scopes that control their lifecycle:

### 1. **SINGLETON (Default)** ✅ Currently Using
- One instance for the entire application lifetime
- Shared across all requests
- Most efficient and commonly used

**Your Current Implementation:**
```typescript
@Injectable()  // Default is SINGLETON
export class ExpensesService {
  private expenses: Expense[] = [];
  // This array is shared across ALL requests
}
```

---

### 2. **REQUEST Scope**
- New instance created for each HTTP request
- Instance is destroyed after request completes
- Useful when you need request-specific data

**Example:**
```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  private requestId: string;

  constructor() {
    // Each request gets a new instance
    this.requestId = Math.random().toString(36);
  }

  getRequestId(): string {
    return this.requestId;
  }
}
```

**When to use:**
- Request-specific logging
- User context per request
- Temporary data that shouldn't persist

---

### 3. **TRANSIENT Scope**
- New instance every time it's injected
- Not shared between consumers
- Each class that injects it gets its own instance

**Example:**
```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  private instanceId: string;

  constructor() {
    this.instanceId = Math.random().toString(36);
  }

  getInstanceId(): string {
    return this.instanceId;
  }
}
```

**When to use:**
- Services that should be isolated per consumer
- When you need fresh state each time

---

## How to Test Scopes

### Test REQUEST Scope:

1. Create a test service:
```typescript
// src/expenses/request-logger.service.ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestLoggerService {
  private requestId: string;

  constructor() {
    this.requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getRequestId(): string {
    return this.requestId;
  }
}
```

2. Inject into controller:
```typescript
constructor(
  private readonly expensesService: ExpensesService,
  private readonly requestLogger: RequestLoggerService
) {}
```

3. Test with multiple simultaneous requests - each will have different `requestId`

---

## Your Current Setup

**ExpensesService** uses **SINGLETON** scope (default):
- ✅ Perfect for your use case
- ✅ The `expenses` array persists across requests
- ✅ Efficient - only one instance created

**This is the right choice** because:
- You want expenses to persist (in-memory database)
- You don't need request-specific instances
- Singleton is most performant

---

## Quick Reference

| Scope | Instances | Lifetime | Use Case |
|-------|-----------|----------|----------|
| **SINGLETON** | 1 | App lifetime | Default, most common |
| **REQUEST** | 1 per request | Request lifetime | Request-specific data |
| **TRANSIENT** | 1 per injection | Until garbage collected | Isolated instances |

---

## Summary

✅ **You're using SINGLETON scope** - which is perfect for your expense tracker!

The `ExpensesService` maintains state (the expenses array) across all requests, which is exactly what you want for an in-memory database.

No changes needed - your implementation is correct! 🎉

