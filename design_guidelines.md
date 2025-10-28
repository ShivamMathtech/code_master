# CodeMaster - Coding Challenge Platform Design Guidelines

## Design Approach

**Reference-Based Strategy**: Drawing inspiration from LeetCode's clean problem-solving interface, HackerRank's organized challenge structure, and CodePen's elegant code editor design. The design emphasizes clarity, focus, and efficient code writing experience.

## Typography System

**Font Stack**: Google Fonts via CDN
- Primary: Inter (UI elements, headings) - weights 400, 500, 600, 700
- Secondary: DM Sans (body text, descriptions) - weights 400, 500
- Code: JetBrains Mono (code editor, snippets) - weights 400, 500, 700

**Hierarchy**:
- Hero headline: text-5xl to text-6xl, font-bold
- Section headings: text-2xl to text-3xl, font-semibold
- Problem titles: text-xl to text-2xl, font-semibold
- Body text: text-base
- Code snippets: text-sm, font-mono
- Labels/metadata: text-xs to text-sm, font-medium

## Color System

**Difficulty Badges**:
- Easy: Green (emerald-500)
- Medium: Amber (amber-500)
- Hard: Red (red-500)

**Status Indicators**:
- Solved: Green checkmark
- Attempted: Amber dot
- Locked: Gray lock icon

**Code Editor Theme**:
- Dark mode preferred for code editor
- Syntax highlighting with distinct colors
- Line numbers in muted color

## Layout & Spacing System

**Container Strategy**:
- Full-width sections with inner max-w-7xl containers
- Code editor: Full height split view
- Problem list: max-w-6xl with sidebar filters

**Spacing Primitives**: Tailwind units of 2, 3, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-16
- Element gaps: gap-3, gap-4, gap-6

## Page Structure

### 1. Landing Page
**Layout**: Hero section + features + CTA
- Hero with gradient background and code animation
- Headline: "Master Coding Challenges, One Problem at a Time"
- Stats: Total problems, users, solutions submitted
- CTA buttons: "Start Coding" (primary) + "Browse Problems"
- Feature cards: Problem library, Real-time execution, Track progress, Leaderboard

### 2. Problem List Page
**Layout**: Sidebar filters + main problem grid/table
- Left sidebar (280px):
  - Difficulty filter (checkboxes)
  - Category/Topic filter (collapsible sections)
  - Status filter (solved/unsolved)
  - Search bar at top
- Main area:
  - Table view with columns: Status, Title, Difficulty, Acceptance %, Category
  - Sortable headers
  - Hover states on rows
  - Pagination at bottom

### 3. Problem Detail Page
**Layout**: Split view (problem | editor)
- Left panel (40% width):
  - Problem title with difficulty badge
  - Description with examples
  - Constraints
  - Test cases tabs: Examples, Custom input
  - Tags/Topics
  - Stats: Acceptance rate, submissions
- Right panel (60% width):
  - Language selector dropdown
  - Code editor (full height)
  - Bottom action bar:
    - Run Code button
    - Submit button
    - Reset button
  - Collapsible output panel showing test results

### 4. Submission Results Modal/Page
**Layout**: Centered modal or full page
- Pass/Fail status with icon
- Test cases results (which passed/failed)
- Runtime and memory stats
- Success message or error details
- "Try Again" or "Next Problem" buttons

### 5. User Dashboard
**Layout**: Stats cards + recent activity + progress chart
- Top stats: Problems solved, streak, rank
- Progress by difficulty (pie chart or bars)
- Recent submissions table
- Calendar heatmap showing activity
- Badges/Achievements section

### 6. Leaderboard Page
**Layout**: Table with rankings
- User rank highlight
- Columns: Rank, Username, Problems Solved, Points
- Filter by time period (weekly, monthly, all-time)
- Search users

## Component Library

**Navigation**:
- Sticky header with logo, nav links, user avatar/login
- Mobile: Hamburger menu
- Active link highlighting

**Buttons**:
- Primary: Filled with rounded-lg
- Secondary: Outline
- Icon buttons for actions
- Sizes: sm, default, lg

**Cards**:
- Problem cards: Clean with title, difficulty badge, stats
- Feature cards: Icon, title, description
- Stat cards: Large number, label, change indicator

**Badges**:
- Difficulty: Small, rounded-full, colored background
- Topic tags: Small, rounded-md, muted colors
- Status indicators: Icons or colored dots

**Code Editor**:
- Monaco Editor (VS Code style)
- Dark theme with syntax highlighting
- Line numbers
- Auto-completion
- Resizable panels

**Tables**:
- Striped rows (subtle)
- Hover states
- Sortable columns
- Responsive (stack on mobile)

**Modals**:
- Centered overlay
- Backdrop blur
- Smooth fade in/out

**Progress Indicators**:
- Circular progress (problems by difficulty)
- Linear progress bars
- Calendar heatmap (GitHub style)

**Footer**:
- Simple, three columns: Product, Company, Community
- Social links
- Copyright

## Icons
**Library**: Lucide React
- Code-related: Code2, FileCode, Terminal, PlayCircle
- Status: CheckCircle, XCircle, Clock, Lock
- Navigation: ChevronRight, Filter, Search
- Actions: Play, RotateCcw, Send

## Accessibility & Interactions

- Keyboard shortcuts for common actions (Ctrl+Enter to submit)
- Focus states on all interactive elements
- ARIA labels for screen readers
- High contrast for code editor
- Smooth transitions on hover/focus
- Loading spinners during code execution

## Animations

- Fade in for modals and notifications
- Slide transitions for sidebar
- Pulse for "running code" indicator
- Success confetti animation on problem solve (optional)
- Smooth scroll to test results

## SEO Optimization

- Meta tags for each page
- Structured data for problem pages
- Semantic HTML structure
- Open Graph tags for social sharing
- Sitemap for problem pages

## Dark Mode

- Toggle in header
- Dark theme optimized for code reading
- Code editor always dark
- Proper contrast for all text

This design creates a professional, focused coding environment that helps users concentrate on solving problems while providing all necessary tools and feedback.
