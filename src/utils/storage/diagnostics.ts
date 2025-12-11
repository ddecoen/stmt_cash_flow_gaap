/**
 * Diagnostic utilities for IndexedDB storage debugging
 * Call these functions from the browser console to troubleshoot issues
 */

const DB_NAME = 'CashFlowStatementsDB';
const STORE_NAME = 'statements';

/**
 * Check if IndexedDB is available and working
 */
export async function checkIndexedDBSupport(): Promise<void> {
  console.log('🔍 Checking IndexedDB support...');
  
  if (!('indexedDB' in window)) {
    console.error('❌ IndexedDB is not supported in this browser');
    return;
  }
  
  console.log('✅ IndexedDB is supported');
  
  try {
    const request = indexedDB.open(DB_NAME);
    
    request.onsuccess = () => {
      const db = request.result;
      console.log('✅ Database opened successfully');
      console.log('📊 Database version:', db.version);
      console.log('📦 Object stores:', Array.from(db.objectStoreNames));
      db.close();
    };
    
    request.onerror = () => {
      console.error('❌ Failed to open database:', request.error);
    };
  } catch (err) {
    console.error('❌ Error checking IndexedDB:', err);
  }
}

/**
 * List all statements in the database
 */
export async function listAllStatements(): Promise<void> {
  console.log('📋 Listing all statements...');
  
  try {
    const request = indexedDB.open(DB_NAME);
    
    request.onsuccess = () => {
      const db = request.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.log('ℹ️ No statements store found - database is empty');
        db.close();
        return;
      }
      
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        const statements = getAllRequest.result;
        console.log(`📊 Found ${statements.length} statement(s):`);
        statements.forEach((stmt: any, index: number) => {
          console.log(`\n${index + 1}. ${stmt.metadata?.periodLabel || 'Untitled'}`);
          console.log(`   ID: ${stmt.id}`);
          console.log(`   Saved: ${new Date(stmt.timestamp).toLocaleString()}`);
          console.log(`   Variance: $${stmt.variance.toFixed(2)}`);
          console.log(`   Company: ${stmt.metadata?.companyName || 'N/A'}`);
        });
        db.close();
      };
      
      getAllRequest.onerror = () => {
        console.error('❌ Error reading statements:', getAllRequest.error);
        db.close();
      };
    };
    
    request.onerror = () => {
      console.error('❌ Failed to open database:', request.error);
    };
  } catch (err) {
    console.error('❌ Error listing statements:', err);
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<void> {
  console.log('📊 Getting database statistics...');
  
  try {
    const request = indexedDB.open(DB_NAME);
    
    request.onsuccess = () => {
      const db = request.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.log('ℹ️ Database exists but has no statements store');
        db.close();
        return;
      }
      
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const countRequest = store.count();
      
      countRequest.onsuccess = () => {
        console.log('📈 Statistics:');
        console.log(`   Total statements: ${countRequest.result}`);
        console.log(`   Database name: ${DB_NAME}`);
        console.log(`   Database version: ${db.version}`);
        console.log(`   Store name: ${STORE_NAME}`);
        db.close();
      };
      
      countRequest.onerror = () => {
        console.error('❌ Error counting statements:', countRequest.error);
        db.close();
      };
    };
    
    request.onerror = () => {
      console.error('❌ Failed to open database:', request.error);
    };
  } catch (err) {
    console.error('❌ Error getting stats:', err);
  }
}

/**
 * Clear all statements (use with caution!)
 */
export async function clearAllStatements(): Promise<void> {
  const confirmed = confirm('⚠️ Are you sure you want to delete ALL saved statements? This cannot be undone!');
  
  if (!confirmed) {
    console.log('❌ Operation cancelled');
    return;
  }
  
  console.log('🗑️ Clearing all statements...');
  
  try {
    const request = indexedDB.open(DB_NAME);
    
    request.onsuccess = () => {
      const db = request.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.log('ℹ️ No statements to clear');
        db.close();
        return;
      }
      
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        console.log('✅ All statements cleared successfully');
        db.close();
      };
      
      clearRequest.onerror = () => {
        console.error('❌ Error clearing statements:', clearRequest.error);
        db.close();
      };
    };
    
    request.onerror = () => {
      console.error('❌ Failed to open database:', request.error);
    };
  } catch (err) {
    console.error('❌ Error clearing statements:', err);
  }
}

/**
 * Delete the entire database (nuclear option!)
 */
export async function deleteDatabase(): Promise<void> {
  const confirmed = confirm('⚠️ Are you sure you want to DELETE THE ENTIRE DATABASE? This cannot be undone!');
  
  if (!confirmed) {
    console.log('❌ Operation cancelled');
    return;
  }
  
  console.log('💥 Deleting database...');
  
  try {
    const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
    
    deleteRequest.onsuccess = () => {
      console.log('✅ Database deleted successfully');
      console.log('ℹ️ Refresh the page to recreate a fresh database');
    };
    
    deleteRequest.onerror = () => {
      console.error('❌ Error deleting database:', deleteRequest.error);
    };
    
    deleteRequest.onblocked = () => {
      console.warn('⚠️ Database deletion blocked. Close all tabs with this app and try again.');
    };
  } catch (err) {
    console.error('❌ Error deleting database:', err);
  }
}

// Expose to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).dbDiagnostics = {
    checkSupport: checkIndexedDBSupport,
    listAll: listAllStatements,
    getStats: getDatabaseStats,
    clearAll: clearAllStatements,
    deleteDB: deleteDatabase,
  };
  
  console.log('🔧 Database diagnostics available! Use in console:');
  console.log('   window.dbDiagnostics.checkSupport() - Check if IndexedDB is working');
  console.log('   window.dbDiagnostics.listAll() - List all saved statements');
  console.log('   window.dbDiagnostics.getStats() - Get database statistics');
  console.log('   window.dbDiagnostics.clearAll() - Clear all statements');
  console.log('   window.dbDiagnostics.deleteDB() - Delete entire database');
}
