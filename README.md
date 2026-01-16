# veraOS - Technical Preview

[![npm version](https://img.shields.io/npm/v/react-ai-highlight-parser.svg)](https://www.npmjs.com/package/react-ai-highlight-parser)
[![npm downloads](https://img.shields.io/npm/dm/react-ai-highlight-parser.svg)](https://www.npmjs.com/package/react-ai-highlight-parser)
[![license](https://img.shields.io/npm/l/react-ai-highlight-parser.svg)](https://github.com/juliocalvorios/veraos-showcase/blob/main/LICENSE)

> A curated showcase of advanced features from **veraOS**, a full-stack productivity platform for students.

**Live Demo:** [veraos.ai](https://veraos.ai) | **npm Package:** [react-ai-highlight-parser](https://www.npmjs.com/package/react-ai-highlight-parser)

---

## 🎯 What's This?

This repository showcases the **Intelligent Semantic Highlighting System** - a unique feature that provides real-time, AI-powered semantic highlighting for streaming LLM responses.

**📦 Available as npm Package:**
```bash
npm install react-ai-highlight-parser
```

**Two ways to explore:**
- **This repository:** Technical deep dive, architecture analysis, and production context
- **npm package:** Production-ready, installable version for your projects

**Note:** This is a technical preview. The full veraOS codebase is private - this showcase demonstrates production-quality code and architecture from a larger project.

---

## ⭐ Featured: Intelligent Semantic Highlighting

### The Problem

When streaming AI responses in real-time, you need to:
- Parse and highlight content **as it arrives** (character-by-character)
- Handle **nested highlight tags** correctly
- Preserve **markdown formatting** (bold, italic, code)
- Clean up **malformed or orphaned tags** from AI responses
- Support **multiple highlight modes** (background, underline, both)
- Provide **dynamic theming** (multiple color palettes)

### The Solution

A 450-line intelligent parser that processes streaming AI responses in O(n) complexity with a single-pass algorithm.

**Key Features:**
- ✅ Real-time streaming processing (handles partial responses)
- ✅ 10 semantic color codes (Y, B, O, G, R, P, L, GR, H, BR)
- ✅ 2 color palettes (Vibrant, Natural)
- ✅ 4 highlight modes (highlights-only, underline-only, both, highlights-underline)
- ✅ Markdown preservation (bold, italic, inline code)
- ✅ Nested tag handling with stack-based parser
- ✅ Automatic cleanup of invalid/orphaned tags
- ✅ Code block protection (preserves syntax highlighting)

---

## 🏗️ Architecture

```
IntelligentHighlightSystem (Core Algorithm)
     │
     ├─ highlightPalettes.js (Color Configuration)
     │   ├─ Vibrant Palette (bright colors)
     │   └─ Natural Palette (earth tones)
     │
     └─ Processing Pipeline:
         1. Protect code blocks (``` blocks)
         2. Clean invalid tags (orphaned, malformed)
         3. Parse valid highlight tags
         4. Process markdown (**, *, `)
         5. Apply semantic colors
         6. Restore code blocks
```

---

## 💻 Technical Deep Dive

### Color System

10 semantic highlight codes with dual-palette support:

| Code | Meaning | Vibrant BG | Natural BG |
|------|---------|------------|------------|
| `Y`  | Important/Key Points | `#FFF4C3` (Yellow) | `#F5F0E8` (Beige) |
| `B`  | Concepts/Definitions | `#D5FEFF` (Blue) | `#E8F0F4` (Steel) |
| `O`  | Steps/Sequences | `#FFD5C3` (Orange) | `#F5E8DD` (Tan) |
| `G`  | Success/Positive | `#DCFCE7` (Green) | `#E8EDE6` (Sage) |
| `R`  | Warnings/Errors | `#fee2e2` (Red) | `#F5E8EA` (Rose) |
| `P`  | Examples | `#FEECFF` (Pink) | `#F0EAF5` (Lavender) |
| `L`  | Data/Numbers | `#E6F3FF` (Light Blue) | `#E6EEF3` (Slate) |
| `GR` | Code/Technical | `#E8E6E5` (Gray) | `#E8E6E5` (Gray) |
| `H`  | Emphasis/Highlights | `#ede9fe` (Purple) | `#EAE8F0` (Soft Purple) |
| `BR` | Context/Background | `#f5e8dd` (Brown) | `#F0E8E0` (Warm Beige) |

### Parsing Algorithm

**Stack-based tokenizer** that handles nesting correctly:

```javascript
// Example: Nested highlights
Input:  "[Y]Key point with [B]nested concept[/B] inside[/Y]"
Output: <span style="background:#FFF4C3">
          Key point with 
          <span style="background:#D5FEFF">nested concept</span> 
          inside
        </span>
```

**Algorithm complexity:** O(n) single-pass
- Tokenizes input into tags and plain text
- Maintains stack for tag matching
- Handles orphaned tags gracefully
- Preserves markdown during processing

### Edge Case Handling

The system handles real-world AI response issues:

1. **Orphaned Tags**
   ```javascript
   "[Y]Text with missing close tag"
   // Automatically cleaned to: "Text with missing close tag"
   ```

2. **Invalid Tag Names**
   ```javascript
   "[GREEN]Should be [G][/GREEN]"
   // Cleaned to: "Should be [G]"
   ```

3. **Code Block Protection**
   ```javascript
   "Here's code: ```\nfunction [Y]test[/Y]() {}\n```"
   // Highlights are NOT applied inside code blocks
   ```

4. **Markdown Preservation**
   ```javascript
   "[Y]**Bold** and *italic*[/Y]"
   // Output: Highlighted text with bold and italic preserved
   ```

---

## 📊 Code Examples

### Quick Start with npm

```bash
npm install react-ai-highlight-parser
```

```javascript
import IntelligentHighlightSystem from 'react-ai-highlight-parser';

const highlighter = new IntelligentHighlightSystem('vibrant');

// Process AI response
const aiResponse = "[Y]Important point[/Y] with [B]definition[/B]";
const processed = highlighter.processAIResponse(aiResponse, 'highlights');
const html = highlighter.processHighlightMode(processed);

// Result: Fully styled HTML with semantic colors
```

**See full npm documentation:** [react-ai-highlight-parser](https://www.npmjs.com/package/react-ai-highlight-parser)

### Basic Usage (Source Code)

### Streaming Processing

```javascript
// Handle streaming responses character-by-character
const chunks = ['[Y]Streami', 'ng res', 'ponse[/Y]'];
let accumulated = '';

chunks.forEach(chunk => {
  accumulated += chunk;
  // Parser handles partial tags gracefully
  const html = highlighter.processHighlightMode(accumulated);
  updateUI(html);
});
```

### Dynamic Theme Switching

```javascript
// Switch between palettes
const vibrantHighlighter = new IntelligentHighlightSystem('vibrant');
const naturalHighlighter = new IntelligentHighlightSystem('natural');

// Same content, different colors
const content = "[Y]Same text[/Y]";
const vibrantHTML = vibrantHighlighter.processHighlightMode(content);
const naturalHTML = naturalHighlighter.processHighlightMode(content);
```

---

## 🎨 Visual Examples

### Highlight Modes

**Highlights Only:**
```
[Y]Key concept[/Y] → Yellow background
```

**Underline Only:**
```
[Y]Key concept[/Y] → Yellow underline
```

**Both:**
```
[Y]Key concept[/Y] → Yellow background + Yellow underline
```

**Highlights-Underline:**
```
[Y]Key concept[/Y] → Yellow background + Darker yellow underline
```

---

## 🔧 Implementation Details

### File Structure
```
src/
├── features/chat/utils/
│   └── IntelligentHighlightSystem.js    # Core algorithm (450 lines)
├── theme/
│   └── highlightPalettes.js              # Color palettes
└── features/chat/components/utils/
    └── HighlightedSpan.jsx               # React component wrapper
```

### Performance Optimizations

- **Single-pass parsing:** O(n) complexity
- **Stack-based matching:** Efficient nested tag handling
- **Regex pre-compilation:** Reusable patterns
- **Code block caching:** Placeholder system for protection
- **Token cost estimation:** Built-in LLM token tracking

### Token Cost Optimization

The system adds minimal tokens to AI prompts:
- System prompt: ~170 tokens
- Per message: 3-8 tokens
- Estimated per conversation (20 messages): ~230-330 tokens

---

## 🌟 Why This Matters

### Unique Features

1. **Real-time Streaming Support**
   - Most highlighting systems work on complete text only
   - This handles partial responses during streaming

2. **Intelligent Tag Cleanup**
   - AI models sometimes generate malformed tags
   - Automatic cleanup prevents rendering issues

3. **Markdown Awareness**
   - Preserves text formatting while highlighting
   - Rare in semantic highlighting systems

4. **Production-Ready**
   - Handles edge cases from real user interactions
   - Battle-tested with 6 different LLM providers

### Technical Challenges Solved

- ✅ Nested highlight tags
- ✅ Partial response handling (streaming)
- ✅ Markdown + highlight coexistence
- ✅ AI-generated tag errors
- ✅ Code block protection
- ✅ Multi-palette theming
- ✅ Performance at scale

---

## 📖 Full veraOS Features

This showcase represents one feature from veraOS. The full platform includes:

- **Chat System:** 6 LLM providers with streaming responses
- **Flashcard System:** FSRS-4.5 spaced repetition algorithm
- **Study Tools:** Pomodoro, goal tracking, schedule management
- **Note Taking:** Cornell method, notebooks with folders
- **Academic Hub:** Assignment tracking, exam prep
- **Library System:** Nested folder organization with drag-and-drop
- **Settings:** Export/import data, privacy controls, multi-theme

**Architecture Highlights:**
- 13 React contexts for state isolation
- Lazy-loaded widget system (400KB bundle reduction)
- AES-256-GCM encryption for sensitive data
- Optimistic updates with automatic rollback
- Real-time sync across tabs

---

## 🚀 Try It Out

### Install from npm

```bash
npm install react-ai-highlight-parser
```

**Package Repository:** [npmjs.com/package/react-ai-highlight-parser](https://www.npmjs.com/package/react-ai-highlight-parser)

### See it Live in Production

**[veraos.ai](https://veraos.ai)**

1. Sign up (free tier available)
2. Open chat interface
3. Enable highlights in settings
4. Try different highlight modes
5. Switch between color palettes

**Interactive Demo:** [juliocalvorios.com](https://juliocalvorios.com) - See the highlight system in action with live mode switching

---

## 📝 License

MIT License - See full license terms in LICENSE file.

**Note:** This showcase repository is open source under MIT license. The full veraOS application is a private portfolio project.

---

## 👨‍💻 About

Built by **Julio Calvo** | [juliocalvorios.com](https://juliocalvorios.com)

**veraOS** is a full-stack productivity platform built to demonstrate production-ready architecture and modern development practices.

---

## 🔗 Links

- **Live Demo:** [veraos.ai](https://veraos.ai)
- **npm Package:** [react-ai-highlight-parser](https://www.npmjs.com/package/react-ai-highlight-parser)
- **Portfolio:** [juliocalvorios.com](https://juliocalvorios.com)
- **GitHub:** [github.com/juliocalvorios](https://github.com/juliocalvorios)
- **This Showcase:** Technical preview of production code

**Questions?** This code represents production-quality implementation of complex algorithmic challenges in real-time AI applications.

---

*This is a curated technical preview. Full codebase is private (portfolio project).*
# update
