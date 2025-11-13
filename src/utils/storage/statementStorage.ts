import { StoredCashFlowStatement, StatementFilter } from '../../types';

const DB_NAME = 'CashFlowStatementsDB';
const DB_VERSION = 1;
const STORE_NAME = 'statements';

/**
 * Initialize IndexedDB for storing cash flow statements
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        
        // Create indexes for querying
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        objectStore.createIndex('variance', 'variance', { unique: false });
      }
    };
  });
}

/**
 * Save a cash flow statement to storage
 * Only saves statements with variance less than 1,000
 */
export async function saveStatement(
  statement: Omit<StoredCashFlowStatement, 'id' | 'timestamp'>
): Promise<string> {
  const variance = Math.abs(statement.variance);
  
  // Only save reconciled statements (variance < 1000)
  if (variance >= 1000) {
    throw new Error(`Statement variance ($${variance.toFixed(2)}) exceeds threshold. Only reconciled statements can be saved.`);
  }

  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const id = `stmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const storedStatement: StoredCashFlowStatement = {
    id,
    timestamp: new Date(),
    ...statement,
  };

  return new Promise((resolve, reject) => {
    const request = store.add(storedStatement);
    
    request.onsuccess = () => {
      db.close();
      resolve(id);
    };
    
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Retrieve all stored statements with optional filtering
 */
export async function getStatements(
  filter?: StatementFilter
): Promise<StoredCashFlowStatement[]> {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      db.close();
      let statements = request.result as StoredCashFlowStatement[];

      // Convert timestamp strings to Date objects
      statements = statements.map(stmt => ({
        ...stmt,
        timestamp: new Date(stmt.timestamp),
      }));

      // Apply filters
      if (filter) {
        statements = statements.filter(stmt => {
          // Filter by variance
          if (Math.abs(stmt.variance) > filter.maxVariance) {
            return false;
          }

          // Filter by date range
          if (filter.startDate && stmt.timestamp < filter.startDate) {
            return false;
          }
          if (filter.endDate && stmt.timestamp > filter.endDate) {
            return false;
          }

          return true;
        });
      }

      // Sort by timestamp descending (newest first)
      statements.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      resolve(statements);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Get a specific statement by ID
 */
export async function getStatement(id: string): Promise<StoredCashFlowStatement | null> {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.get(id);

    request.onsuccess = () => {
      db.close();
      const statement = request.result as StoredCashFlowStatement | undefined;
      if (statement) {
        statement.timestamp = new Date(statement.timestamp);
      }
      resolve(statement || null);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Delete a statement by ID
 */
export async function deleteStatement(id: string): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.delete(id);

    request.onsuccess = () => {
      db.close();
      resolve();
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Get count of stored statements
 */
export async function getStatementCount(): Promise<number> {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.count();

    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Clear all stored statements (use with caution)
 */
export async function clearAllStatements(): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.clear();

    request.onsuccess = () => {
      db.close();
      resolve();
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}
