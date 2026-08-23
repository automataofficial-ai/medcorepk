# Block IDs Reference Guide

## How to Find Your Block IDs

### Method 1: Admin Panel
1. Navigate to: `http://localhost:3000/admin/blocks`
2. View the complete list of blocks
3. Copy the ID of the block you want to upload MCQs to

### Method 2: Direct API Call
Run this command in your terminal:
```bash
curl http://localhost:3000/api/blocks
```

This returns JSON with all blocks including their IDs.

## Common Block IDs in Template

The `MCQ_UPLOAD_TEMPLATE.csv` uses these example IDs:

| Block Name | Block ID | Subject | Papers |
|------------|----------|---------|--------|
| Physiology | `550e8400-e29b-41d4-a716-446655440000` | Basic Science | Part 1 |
| Biochemistry | `550e8400-e29b-41d4-a716-446655440001` | Basic Science | Part 1 |
| Microbiology | `550e8400-e29b-41d4-a716-446655440002` | Basic Science | Part 1 |
| Biostatistics | `550e8400-e29b-41d4-a716-446655440003` | Public Health | Part 1 |
| Behavioral Science | `550e8400-e29b-41d4-a716-446655440004` | Clinical | Part 1 |

## How to Use This Reference

1. **Before uploading MCQs**, verify that the Block IDs you're using exist in your system
2. **Replace template IDs** with your actual Block IDs
3. **Check the Admin Blocks page** if your Block IDs are different

## Example: Finding Your Block ID

1. Go to `http://localhost:3000/admin/blocks`
2. Find the block named "Pharmacology"
3. Copy its UUID (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
4. Replace `550e8400-e29b-41d4-a716-446655440000` in the CSV with your actual ID

## Creating New Blocks (if needed)

If a block doesn't exist:
1. Go to `http://localhost:3000/admin/blocks`
2. Click "Add Block"
3. Fill in block details (name, specialty, icon, etc.)
4. Click "Create"
5. Copy the newly created Block ID
6. Use it in your CSV import

## How Block IDs are Used

- **Block ID** links MCQs to specific learning modules
- When users navigate to a block, only MCQs with that Block ID appear
- One MCQ can only belong to one Block

## Error: "Invalid block_id"

This means:
- ❌ The Block ID doesn't exist in the system
- ❌ The UUID format is incorrect
- ❌ There's a typo in the Block ID

**Solution:**
1. Go to Admin Blocks page
2. Copy the exact Block ID
3. Paste it into your CSV (no extra spaces)
4. Retry upload

## UUID Format

Block IDs should follow this format:
```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Example: `550e8400-e29b-41d4-a716-446655440000`

- 8 characters
- dash
- 4 characters
- dash
- 4 characters
- dash
- 4 characters
- dash
- 12 characters

---

**Tips:**
- ✅ Always verify Block IDs before bulk uploads
- ✅ Test with a single MCQ first using your real Block ID
- ✅ Keep a record of your Block IDs for reference
- ✅ Use the Admin Blocks page as your source of truth
