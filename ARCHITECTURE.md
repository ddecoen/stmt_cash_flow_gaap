# Storage Backend Architecture

## System Overview

```mermaid
graph TB
    subgraph "User Interface"
        A[Main App] --> B[Upload CSVs]
        B --> C[Generate Statement]
        C --> D[Review & Reconcile]
        D --> E{Variance < $1,000?}
        E -->|Yes| F[Save to History Button]
        E -->|No| G[Button Disabled]
        F --> H[Save Modal]
        H --> I[Add Metadata]
        I --> J[Confirm Save]
        
        A --> K[History Button]
        K --> L[History Modal]
        L --> M[View Statements]
        L --> N[Delete Statements]
    end
    
    subgraph "Storage Layer"
        J --> O[statementStorage.ts]
        M --> O
        N --> O
        O --> P[(IndexedDB)]
    end
    
    style E fill:#ff6b6b,color:#fff
    style F fill:#51cf66,color:#fff
    style G fill:#868e96,color:#fff
    style P fill:#339af0,color:#fff
```

## Component Architecture

```mermaid
graph LR
    subgraph "React Components"
        App[App.tsx]
        Export[ExportStep.tsx]
        History[StatementHistory.tsx]
    end
    
    subgraph "Data Layer"
        Storage[statementStorage.ts]
        Types[types.ts]
    end
    
    subgraph "Browser"
        IDB[(IndexedDB)]
    end
    
    App --> Export
    App --> History
    Export --> Storage
    History --> Storage
    Storage --> IDB
    Export -.uses.-> Types
    History -.uses.-> Types
    Storage -.uses.-> Types
    
    style Storage fill:#339af0,color:#fff
    style IDB fill:#12b886,color:#fff
```

## Data Flow: Saving a Statement

```mermaid
sequenceDiagram
    participant U as User
    participant E as ExportStep
    participant S as Storage
    participant DB as IndexedDB
    
    U->>E: Click "Save to History"
    E->>E: Check variance < $1,000
    alt Variance OK
        E->>U: Show save modal
        U->>E: Enter metadata
        U->>E: Click "Save Statement"
        E->>S: saveStatement()
        S->>S: Validate variance
        S->>DB: Create transaction
        DB->>DB: Store statement
        DB-->>S: Success + ID
        S-->>E: Return statement ID
        E->>U: Show success message
    else Variance too high
        E->>U: Button disabled
        E->>U: Show tooltip
    end
```

## Data Flow: Viewing History

```mermaid
sequenceDiagram
    participant U as User
    participant H as History Modal
    participant S as Storage
    participant DB as IndexedDB
    
    U->>H: Click "History" button
    H->>S: getStatements({maxVariance: 1000})
    S->>DB: Query all statements
    DB-->>S: Return statements
    S->>S: Filter by variance
    S->>S: Sort by timestamp
    S-->>H: Return filtered list
    H->>U: Display statement list
    
    U->>H: Click statement
    H->>U: Show details panel
    
    opt Delete statement
        U->>H: Click "Delete"
        H->>U: Show confirmation
        U->>H: Confirm
        H->>S: deleteStatement(id)
        S->>DB: Delete by ID
        DB-->>S: Success
        S-->>H: Success
        H->>S: getStatements() [refresh]
        S-->>H: Updated list
        H->>U: Update display
    end
```

## Storage Schema

```mermaid
erDiagram
    STATEMENTS {
        string id PK "stmt_[timestamp]_[random]"
        datetime timestamp "When saved"
        number variance "Reconciliation variance"
        json cashFlowStatement "Full statement"
        json extractedData "Input data"
        json balanceInputs "Cash balances"
        json metadata "Period, company, notes"
    }
    
    INDEXES {
        string name
        string keyPath
        boolean unique
    }
    
    STATEMENTS ||--o{ INDEXES : "indexed by"
```

## IndexedDB Structure

```
Database: CashFlowStatementsDB (v1)
│
└── Object Store: statements
    ├── Key Path: id
    ├── Indexes:
    │   ├── timestamp (non-unique)
    │   └── variance (non-unique)
    └── Data:
        ├── id: "stmt_1234567890_abc123"
        ├── timestamp: Date
        ├── variance: number
        ├── cashFlowStatement: {...}
        ├── extractedData: {...}
        ├── balanceInputs: {...}
        └── metadata: {
            ├── periodLabel?: string
            ├── companyName?: string
            └── notes?: string
        }
```

## Component Hierarchy

```mermaid
graph TD
    A[App.tsx] --> B[WizardNavigation]
    A --> C[UploadStep]
    A --> D[BalancesStep]
    A --> E[GenerateStep]
    A --> F[ExportStep]
    A --> G[StatementHistory]
    
    F --> H[Save Modal]
    F --> I[Save Button]
    
    G --> J[List Panel]
    G --> K[Detail Panel]
    G --> L[Delete Confirmation]
    
    style A fill:#339af0,color:#fff
    style F fill:#51cf66,color:#fff
    style G fill:#ff6b6b,color:#fff
```

## State Management

```mermaid
stateDiagram-v2
    [*] --> NoStatements: Initial State
    NoStatements --> HasStatements: First save
    HasStatements --> ViewingHistory: Click history
    ViewingHistory --> HasStatements: Close modal
    HasStatements --> Deleting: Click delete
    Deleting --> HasStatements: Confirm
    Deleting --> ViewingHistory: Cancel
    
    HasStatements --> Saving: Click save
    Saving --> SaveSuccess: Valid
    Saving --> SaveError: Invalid variance
    SaveSuccess --> HasStatements: Complete
    SaveError --> HasStatements: Retry
```

## Variance Threshold Logic

```mermaid
flowchart TD
    A[Calculate Variance] --> B{|variance| < 0.01?}
    B -->|Yes| C[Perfectly Balanced ✓]
    B -->|No| D{|variance| < 1000?}
    D -->|Yes| E[Reconciled - Can Save]
    D -->|No| F[Not Reconciled - Cannot Save]
    
    C --> G[Show green badge]
    E --> H[Show yellow badge]
    F --> I[Disable save button]
    
    style C fill:#51cf66,color:#fff
    style E fill:#ffd43b,color:#000
    style F fill:#ff6b6b,color:#fff
```

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| Save Statement | < 50ms | Single IndexedDB write |
| Load All Statements | < 100ms | Up to 1000 statements |
| Filter by Variance | < 10ms | Using index |
| Delete Statement | < 30ms | Single transaction |
| Get Statement Count | < 20ms | Index scan |

## Storage Capacity

```
Browser Storage Hierarchy:
├── IndexedDB: 50MB - Unlimited (browser dependent)
│   └── Per Statement: ~5-10 KB
│       ├── Metadata: ~0.5 KB
│       ├── Statement Data: ~2-3 KB
│       ├── Extracted Data: ~1-2 KB
│       └── Balance Inputs: ~0.1 KB
│
├── Typical Capacity: 5,000 - 10,000+ statements
└── Quota Management: Browser handles automatically
```

## Error Handling

```mermaid
graph TD
    A[User Action] --> B{Try Operation}
    B -->|Success| C[Update UI]
    B -->|Error| D{Error Type}
    
    D -->|Variance| E[Show variance error]
    D -->|Storage| F[Show storage error]
    D -->|Network| G[N/A - All local]
    D -->|Unknown| H[Show generic error]
    
    E --> I[Disable save button]
    F --> J[Suggest clearing space]
    H --> K[Allow retry]
    
    style E fill:#ff6b6b,color:#fff
    style F fill:#ff8787,color:#fff
    style H fill:#ffa94d,color:#fff
```

## Security Considerations

```mermaid
graph LR
    A[User Data] --> B[Browser Storage]
    B --> C{Security Features}
    
    C --> D[Same-Origin Policy]
    C --> E[HTTPS Encryption]
    C --> F[No Server Transmission]
    C --> G[Private by Default]
    
    D --> H[Isolated per domain]
    E --> I[Data encrypted in transit]
    F --> J[Stays on device]
    G --> K[User controls access]
    
    style A fill:#339af0,color:#fff
    style B fill:#12b886,color:#fff
    style C fill:#51cf66,color:#fff
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│           User's Browser                │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │      React Application            │ │
│  │  (Static Files from CDN/Server)   │ │
│  └───────────────┬───────────────────┘ │
│                  │                      │
│                  ▼                      │
│  ┌───────────────────────────────────┐ │
│  │       IndexedDB Storage           │ │
│  │   (Browser's Local Storage)       │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘

No backend server required!
All data stored locally in browser.
```

---

**Note**: This architecture is designed to be simple, secure, and scalable for individual use cases. For enterprise deployments requiring multi-user collaboration or centralized storage, consider adding a backend API layer.
