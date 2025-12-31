# Test Data Cleanup Guide

## 🎯 Purpose

Remove all testing data from the database that contains the word "test" in:
- User names and emails
- Employee names and emails
- Animal names
- Visitor names and emails
- Event titles and descriptions
- Inventory item names
- Ticket sales with test visitors
- And all related records (attendance, jobs, stock requests)

## 🚀 Quick Start

### Run the Cleanup

```bash
node cleanup-test-data.cjs
```

## 📋 What Gets Cleaned

### 1. Users Table
- Removes users with "test" in name or email
- Example: "Test User", "test@example.com"

### 2. Employees Table
- Removes employees with "test" in name or email
- Example: "Test Employee", "test.employee@zoo.com"

### 3. Attendance Table
- Removes attendance records for test employees
- Automatically cleaned when test employees are removed

### 4. Jobs Table
- Removes jobs assigned to test employees
- Removes jobs with "test" in title

### 5. Stock Requests Table
- Removes stock requests from test employees
- Removes requests with "test" in item name

### 6. Animals Table
- Removes animals with "test" in name
- Example: "Test Lion", "Test Elephant"

### 7. Visitors Table
- Removes visitors with "test" in name or email
- Example: "Test Visitor", "test.visitor@email.com"

### 8. Ticket Sales Table
- Removes sales with test visitor names or emails

### 9. Events Table
- Removes events with "test" in title or description
- Example: "Test Event", "Testing Event"

### 10. Inventory Table
- Removes items with "test" in name
- Example: "Test Food", "Test Medicine"

## 📊 Expected Output

```
🧹 Cleaning up TEST data from database...
============================================================

👤 Cleaning USERS table...
Found 3 test users:
  1. Test User (test@example.com) - ID: user-123
  2. Test Employee (test.employee@zoo.com) - ID: user-456
  3. Testing Account (testing@zoo.com) - ID: user-789
✅ Deleted 3 test users

👷 Cleaning EMPLOYEES table...
Found 2 test employees:
  1. Test Employee (test.employee@zoo.com) - ID: user-456
  2. Testing Staff (testing.staff@zoo.com) - ID: user-999
✅ Deleted 2 test employees

📅 Cleaning ATTENDANCE table...
Found 5 test attendance records
✅ Deleted 5 test attendance records

💼 Cleaning JOBS table...
Found 3 test jobs
✅ Deleted 3 test jobs

📦 Cleaning STOCK_REQUESTS table...
Found 2 test stock requests
✅ Deleted 2 test stock requests

🦁 Cleaning ANIMALS table...
Found 1 test animals:
  1. Test Lion (Lion) - ID: A999
✅ Deleted 1 test animals

👥 Cleaning VISITORS table...
Found 4 test visitors:
  1. Test Visitor (test.visitor@email.com) - ID: visitor-123
  2. Testing User (testing@email.com) - ID: visitor-456
✅ Deleted 4 test visitors

🎫 Cleaning TICKET_SALES table...
Found 6 test ticket sales
✅ Deleted 6 test ticket sales

📅 Cleaning EVENTS table...
Found 2 test events:
  1. Test Event - ID: E999
  2. Testing Show - ID: E998
✅ Deleted 2 test events

📦 Cleaning INVENTORY table...
Found 1 test inventory items:
  1. Test Food - ID: INV999
✅ Deleted 1 test inventory items

============================================================
✅ TEST DATA CLEANUP COMPLETED!
============================================================

📊 Total Records Deleted: 29

✨ Database is now clean of test data!

📊 Remaining Records:
  - users: 5
  - employees: 10
  - attendance: 45
  - jobs: 12
  - stock_requests: 3
  - animals: 25
  - visitors: 100
  - ticket_sales: 150
  - events: 8
  - inventory: 30
```

## ⚠️ Important Notes

### Before Running

1. **Stop the backend server**:
   ```bash
   # Press Ctrl+C in backend terminal
   ```

2. **Optional backup** (recommended):
   ```bash
   copy backend\zoo.db backend\zoo.db.backup
   ```

3. **Make sure you're in project root directory**

### After Running

1. **Restart the backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Verify in UI**:
   - Login as admin
   - Check that test users are gone
   - Check that test employees are gone
   - Verify attendance records cleaned

## 🔍 What the Script Searches For

The script looks for the word "test" (case-insensitive) in:

- **Names**: "Test User", "Testing Account", "test employee"
- **Emails**: "test@example.com", "testing@zoo.com"
- **Titles**: "Test Event", "Testing Show"
- **Descriptions**: "This is a test event"
- **Item names**: "Test Food", "test medicine"

## 🔄 Cascade Deletion

When test employees are deleted, the script also removes:
- Their attendance records
- Their assigned jobs
- Their stock requests

This ensures no orphaned records remain.

## 🐛 Troubleshooting

### Error: "Cannot find module 'better-sqlite3'"

**Solution:**
```bash
cd backend
npm install
cd ..
node cleanup-test-data.cjs
```

### Error: "Database is locked"

**Solution:**
1. Stop the backend server
2. Close any database browser tools
3. Run the script again

### Error: "ENOENT: no such file or directory"

**Solution:**
Make sure you're in the project root:
```bash
# Check current directory
cd   # Windows
pwd  # Mac/Linux

# Should show: .../zms
```

## ✅ Verification

After cleanup, verify manually:

```bash
# Open database
cd backend
sqlite3 zoo.db

# Check for remaining test data
SELECT * FROM users WHERE LOWER(name) LIKE '%test%';
SELECT * FROM employees WHERE LOWER(name) LIKE '%test%';
SELECT * FROM animals WHERE LOWER(name) LIKE '%test%';

# Should return no results
.exit
```

## 🔒 Safety Features

- **Preview before delete**: Shows what will be deleted
- **Counts records**: Shows how many found in each table
- **Summary report**: Shows total deleted
- **Remaining counts**: Shows what's left in database
- **No accidental deletions**: Only removes records with "test" keyword

## 📝 What Won't Be Deleted

Records that DON'T contain "test":
- Regular users and employees
- Real animals and visitors
- Actual events and inventory
- Production data

## 🎯 Use Cases

### After Development Testing
```bash
# Clean up all test accounts and data
node cleanup-test-data.cjs
```

### Before Production Deployment
```bash
# Remove all testing data
node cleanup-test-data.cjs
```

### Regular Maintenance
```bash
# Clean up accumulated test data
node cleanup-test-data.cjs
```

## 🔄 Restore from Backup

If you need to restore:

```bash
# Stop backend first
copy backend\zoo.db.backup backend\zoo.db
```

## 📊 Tables Cleaned

| Table | What Gets Removed |
|-------|-------------------|
| users | Users with "test" in name/email |
| employees | Employees with "test" in name/email |
| attendance | Records for test employees |
| jobs | Jobs for test employees or with "test" in title |
| stock_requests | Requests from test employees or with "test" in item |
| animals | Animals with "test" in name |
| visitors | Visitors with "test" in name/email |
| ticket_sales | Sales with test visitor info |
| events | Events with "test" in title/description |
| inventory | Items with "test" in name |

## ✨ Benefits

- **Clean database**: No test clutter
- **Better performance**: Fewer unnecessary records
- **Professional**: Ready for production
- **Easy maintenance**: One command cleanup
- **Safe**: Only removes test data

## 🎉 Done!

Run the script to clean your database:

```bash
node cleanup-test-data.cjs
```

Your database will be free of all test data!
