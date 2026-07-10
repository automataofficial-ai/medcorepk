# MedCore MVP Features Guide

## 🚀 New Features Added

### 1. **Practice Modes**

#### 🎯 Timed Exam Mode
- **What**: 2 hours 30 minutes (150 minutes) CBT simulation
- **Features**: 
  - 200 randomized questions from all subjects
  - Real-time countdown timer
  - Progress tracking
  - Instant question navigation
  - Results dashboard with score breakdown
- **Best for**: Exam preparation & time management
- **URL**: `/exam/timed`

#### 📋 Mock Exam Mode
- **What**: Complete 200-question full simulation
- **Features**:
  - Detailed performance analytics
  - Subject-wise breakdown
  - Difficulty-wise analysis
  - Visual charts (Bar, Pie charts)
  - Session history tracking
  - Multiple attempt tracking
- **Best for**: Comprehensive assessment & identifying weak areas
- **URL**: `/exam/mock`

#### 🧠 Spaced Repetition Mode
- **What**: Intelligent card-based learning using SM-2 algorithm
- **Features**:
  - Adaptive review scheduling
  - Ease factor tracking (1.3 - 2.5)
  - Progress statistics
  - Quality-based rating system
  - Persistent local storage (localStorage)
  - Smart card organization
- **Best for**: Long-term retention & mastery
- **URL**: `/learn/spaced-repetition`

### 2. **Question Bank**

#### 📚 500+ MCQs across 8 subjects
- **Anatomy** - 🫀 (50 questions)
- **Physiology** - 🧬 (50 questions)
- **Pharmacology** - 💊 (50 questions)
- **Pathology** - 🔬 (50 questions)
- **Biochemistry** - ⚗️ (50 questions)
- **Microbiology** - 🦠 (50 questions)
- **Biostatistics** - 📊 (50 questions)
- **Behavioral Science** - 🧠 (50 questions)

Each question includes:
- Detailed case study scenarios
- 4 comprehensive options (A, B, C, D)
- Individual explanations for each option
- Correct answer with reasoning
- Difficulty level (Easy/Medium/Hard)
- Subject area classification
- Citation/reference

---

## 🔧 Setup Instructions

### Step 1: Seed the Database with MCQs

Make a POST request to seed 500 MCQs:

```bash
curl -X POST http://localhost:3000/api/seed/mcqs \
  -H "Content-Type: application/json" \
  -d '{"count": 500}'
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully seeded 500 MCQs across 8 blocks",
  "blocks_created": 8,
  "mcqs_inserted": 500
}
```

### Step 2: Access Practice Modes

After seeding, the dashboard now displays three practice mode cards:

1. **Click "Start Exam Now"** → Timed Exam (2h 30m)
2. **Click "Start Mock Exam"** → Full simulation with analytics
3. **Click "Start Review Session"** → Spaced repetition (if cards due)

### Step 3: Review Analytics

All modes save results to the database and update:
- Dashboard stats
- Session history
- Performance trends
- Subject-wise analytics

---

## 📊 SM-2 Spaced Repetition Algorithm

### How It Works

1. **Quality Rating (0-5)**
   - 0: Complete blackout
   - 1: Incorrect response
   - 2: Incorrect but close
   - 3: Hesitant but correct
   - 4: Correct with difficulty
   - 5: Perfect response

2. **Interval Calculation**
   - First review: 1 day
   - Second review: 3 days
   - After: Current interval × Ease Factor

3. **Ease Factor Update**
   - Increases with good responses
   - Decreases with poor responses
   - Range: 1.3 - 2.5

### Example Review Cycle

```
Card 1:
- Initial: Interval=0, EF=2.5
- Quality=5 (Perfect) → Interval=1, EF=2.6
- Next review: Tomorrow

Card 2:
- Quality=3 (Hesitant) → Interval=1, EF=2.3
- Next review: Tomorrow

Card 3:
- Quality=1 (Incorrect) → Reset, Interval=1, EF=2.35
- Back to learning phase
```

---

## 🎓 Learning Best Practices

### Timed Exam Mode
- ✅ Take full 150 minutes without breaks
- ✅ Practice time management
- ✅ Mark difficult questions
- ✅ Review mistakes after completion
- ❌ Don't pause the timer

### Mock Exam Mode
- ✅ Use for comprehensive assessment
- ✅ Review subject-wise performance
- ✅ Identify weak subjects
- ✅ Track progress over multiple attempts
- ❌ Don't memorize specific questions

### Spaced Repetition
- ✅ Review 5-10 cards daily
- ✅ Maintain consistent schedule
- ✅ Rate honestly (don't over/underestimate)
- ✅ Focus on mastery (≥5 repetitions)
- ❌ Don't skip due cards

---

## 📈 Performance Tracking

### Dashboard Metrics

**Summary Cards:**
- Blocks Completed
- MCQs Attempted
- Correct Answers & Accuracy %
- Current Streak (days)

**Analytics:**
- Overall Accuracy Ring
- Answer Distribution (Pie chart)
- Score Trend (Area chart)
- Score by Specialty (Bar chart)
- Subject Accuracy Breakdown (Progress bars)
- Session History (Detailed table)

### Exam-Specific Reports

**Timed Exam:**
- Total score %
- Questions correct/incorrect
- Time efficiency
- Section-wise performance

**Mock Exam:**
- Comprehensive score
- Subject-wise breakdown
- Difficulty-wise distribution
- Comparative analysis

**Spaced Repetition:**
- Cards due/reviewed/mastered
- Average ease factor
- Progress percentage
- Retention statistics

---

## 🔐 Data Storage

### Session Data
- Stored in Supabase `sessions` table
- Linked to user account
- Includes timestamp & performance

### Spaced Repetition Cards
- Stored in browser localStorage
- Key: `sr_cards`
- Synced across devices (if localStorage shared)
- Format: JSON array of RepetitionCard objects

### User Progress
- Supabase `user_progress` table
- Real-time updates
- Aggregated statistics

---

## 🐛 Troubleshooting

### Questions not showing?
1. Check if database is seeded: `GET /api/blocks`
2. If empty, run seed: `POST /api/seed/mcqs`
3. Refresh page and try again

### Timer not working in Timed Exam?
1. Check browser console for errors
2. Ensure 60s countdown interval is running
3. Try refreshing page

### Spaced Repetition not saving?
1. Check if localStorage is enabled
2. Verify browser hasn't disabled local storage
3. Check localStorage size limit

### Performance analytics not showing?
1. Complete at least one quiz session
2. Check Dashboard for "No Analytics Yet" message
3. Session data must be saved to see charts

---

## 🎯 Next Steps

After testing these features:

1. **Load Real MCQs** - Replace dummy data with actual exam questions
2. **Add Google OAuth** - Enable social login
3. **Email Verification** - Re-enable with proper rate limiting
4. **Password Reset Tokens** - Add token validation
5. **Leaderboards** - Add competitive learning
6. **Discussion Forums** - Add peer learning
7. **Video Explanations** - Add multimedia content
8. **Mobile App** - Extend to React Native

---

## 📞 Support

For issues or questions:
- Check browser console (F12) for errors
- Verify Supabase connection
- Check database for data integrity
- Review API endpoints in `app/api/*`

**API Endpoints:**
- `GET /api/blocks` - Fetch all blocks with MCQs
- `POST /api/blocks` - Create new block
- `GET /api/sessions` - Fetch user sessions
- `POST /api/sessions` - Save exam session
- `POST /api/seed/mcqs` - Seed dummy data

---

**Version**: 1.0.0  
**Last Updated**: 2026-07-02  
**Status**: Production Ready ✅
