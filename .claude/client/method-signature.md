# Method Signature

Always use `function(this: any)` syntax in controllers (never arrow functions):
```typescript
methodName: async function(this: any, param1: Type) { /* ... */ }
```

**Antipattern — arrow functions lose `this`:**
```typescript
// WRONG:  { myMethod: async (p) => { this.data = p; } }
// CORRECT: { myMethod: async function(this: any, p) { this.data = p; } }
```

**Other rules:**
- Never skip transactions for create/update/delete API calls
- Never swallow errors silently
- Use plural table names (`users` not `user`)
- Prefix columns with model name (`user_email` not `email`)
