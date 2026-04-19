# Covered Query Proof — SkillBridge

## What is a Covered Query?
A covered query is one where MongoDB can answer the entire query using only
the index — without loading any actual documents from disk.

This means `executionStats.totalDocsExamined === 0`

## Why Does totalDocsExamined = 0 Matter?
- Normal queries scan documents → slow on large collections
- Covered queries only scan index keys → extremely fast
- For high-frequency queries like "all active Electricians", this is critical

## Our Index
```js
studentSchema.index({ trade: 1, status: 1 });
```
This compound index is created in server/models/Student.js

## The Query We Run
```js
db.students.find(
  { trade: "Electrician", status: "active" },
  { _id: 0, trade: 1, status: 1 }
)
```

## Why _id MUST Be Excluded
MongoDB always includes _id by default.
Since _id is NOT part of our { trade: 1, status: 1 } index,
including it forces MongoDB to fetch the actual document — breaking the covered query.
We must explicitly set _id: 0 in the projection.

## explain() Output
[INSERT screenshot of terminal output here after running node server/scripts/verifyIndex.js]

Expected results:
- totalDocsExamined : 0       ✅
- totalKeysExamined : (number of matched students)
- winningPlan stage : IXSCAN  ✅

## How to Run the Verification Script
```bash
node server/scripts/verifyIndex.js
```