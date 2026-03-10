# EzModel (Data Transformation)
Base class for transforming API response data. Fields define type conversions:
```typescript
class CandidateModel extends EzModel {
    static modelName = "candidate";
    constructor(data) {
        super({ fields: [
            { name: 'candidate_id', type: 'int' },
            { name: 'select_status', type: 'object', mapping: 'candidate_status_option', render: ... }
        ], data });
    }
}
```

## Type Conversions
| Type | Conversion |
|------|------------|
| `int`/`number` | parseInt / parseFloat |
| `boolean`/`string`/`object`/`array` | !! / toString / spread clone |
| `phone`/`money` | formatPhoneNumber / value÷100 |
