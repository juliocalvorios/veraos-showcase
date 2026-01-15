# Quick Start Guide

Get up and running with the Intelligent Highlight System in 5 minutes.

---

## What's in this Repo?

This showcase contains:
- **Core Algorithm:** 450-line intelligent parser (`IntelligentHighlightSystem.js`)
- **Color System:** Dynamic palette management (`highlightPalettes.js`)
- **React Component:** UI wrapper (`HighlightedSpan.jsx`)
- **Documentation:** Architecture + usage examples

---

## File Structure

```
veraos-showcase/
├── src/
│   ├── features/chat/utils/
│   │   └── IntelligentHighlightSystem.js    ⭐ Core algorithm
│   ├── features/chat/components/utils/
│   │   └── HighlightedSpan.jsx               React wrapper
│   └── theme/
│       └── highlightPalettes.js              Color palettes
├── examples/
│   └── USAGE_EXAMPLES.md                     12 practical examples
├── ARCHITECTURE.md                            Technical deep dive
├── README.md                                  Main documentation
└── package.json
```

---

## Installation

```bash
# Clone the repo
git clone https://github.com/juliocalvo/veraos-showcase.git
cd veraos-showcase

# Install dependencies (React only)
npm install
```

---

## Basic Usage

### 1. Import the System

```javascript
import IntelligentHighlightSystem from './src/features/chat/utils/IntelligentHighlightSystem.js';
```

### 2. Create Instance

```javascript
// 'vibrant' or 'natural' palette
const highlighter = new IntelligentHighlightSystem('vibrant');
```

### 3. Process Text

```javascript
const aiResponse = "[Y]Important point[/Y] with [B]definition[/B]";

// Step 1: Clean and validate
const cleaned = highlighter.processAIResponse(aiResponse, 'highlights');

// Step 2: Apply highlighting
const html = highlighter.processHighlightMode(cleaned);

// Step 3: Render
document.getElementById('output').innerHTML = html;
```

---

## Highlight Codes

| Code | Color | Meaning |
|------|-------|---------|
| `[Y]...[/Y]` | Yellow | Important/Key Points |
| `[B]...[/B]` | Blue | Concepts/Definitions |
| `[O]...[/O]` | Orange | Steps/Sequences |
| `[G]...[/G]` | Green | Success/Positive |
| `[R]...[/R]` | Red | Warnings/Errors |
| `[P]...[/P]` | Pink | Examples |
| `[L]...[/L]` | Light Blue | Data/Numbers |
| `[GR]...[/GR]` | Gray | Code/Technical |
| `[H]...[/H]` | Purple | Emphasis |
| `[BR]...[/BR]` | Brown | Context/Background |

---

## Highlight Modes

### Mode 1: Highlights (Background Color)
```javascript
const html = highlighter.processHighlightMode(cleaned);
```
Result: Text with colored background

### Mode 2: Underlines
```javascript
const html = highlighter.processUnderlineMode(cleaned);
```
Result: Colored underlines only

### Mode 3: Both (Background + Same Color Underline)
```javascript
const html = highlighter.processBothMode(cleaned);
```
Result: Background + matching underline

### Mode 4: Highlights-Underline (Background + Darker Underline)
```javascript
const html = highlighter.processHighlightUnderlineMode(cleaned);
```
Result: Background + darker underline for contrast

---

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Highlight Demo</title>
</head>
<body>
  <div id="output"></div>

  <script type="module">
    import IntelligentHighlightSystem from './src/features/chat/utils/IntelligentHighlightSystem.js';
    
    const highlighter = new IntelligentHighlightSystem('vibrant');
    
    const text = `
      [Y]Key concept:[/Y] Understanding [B]semantic highlighting[/B] 
      is [O]step 1[/O] to building great UX. 
      [G]Success tip:[/G] Use meaningful colors!
    `;
    
    const cleaned = highlighter.processAIResponse(text, 'highlights');
    const html = highlighter.processHighlightMode(cleaned);
    
    document.getElementById('output').innerHTML = html;
  </script>
</body>
</html>
```

---

## Streaming Example

```javascript
// Simulate AI streaming
const highlighter = new IntelligentHighlightSystem('vibrant');
let buffer = '';

const chunks = ['[Y]Stream', 'ing ', 'text', '...[/Y]'];

chunks.forEach((chunk, index) => {
  setTimeout(() => {
    buffer += chunk;
    const cleaned = highlighter.processAIResponse(buffer, 'highlights');
    const html = highlighter.processHighlightMode(cleaned);
    document.getElementById('output').innerHTML = html;
  }, index * 500); // Simulate 500ms delay between chunks
});
```

---

## Color Palettes

### Vibrant (Default)
Bright, saturated colors - great for dark backgrounds
```javascript
const highlighter = new IntelligentHighlightSystem('vibrant');
```

### Natural
Earth tones - great for light backgrounds
```javascript
const highlighter = new IntelligentHighlightSystem('natural');
```

---

## Next Steps

1. **Read Examples:** Check `examples/USAGE_EXAMPLES.md` for 12 detailed examples
2. **Study Architecture:** Read `ARCHITECTURE.md` for algorithm deep dive
3. **Try Live:** Visit [veraos.ai](https://veraos.ai) to see it in production
4. **Integrate:** Use in your React/vanilla JS project

---

## Key Features

✅ **Real-time streaming** - Handles partial responses  
✅ **Nested tags** - Stack-based parser  
✅ **Markdown aware** - Preserves bold, italic, code  
✅ **Auto-cleanup** - Fixes AI-generated errors  
✅ **Multiple modes** - 4 different highlight styles  
✅ **Dual palettes** - Vibrant & Natural themes  
✅ **O(n) complexity** - Single-pass algorithm  
✅ **Production tested** - 6 LLM providers  

---

## Common Issues

### Issue: No highlights appearing
**Solution:** Make sure you're calling `processAIResponse` first:
```javascript
const cleaned = highlighter.processAIResponse(text, 'highlights');
const html = highlighter.processHighlightMode(cleaned);
```

### Issue: Tags showing in output
**Solution:** Tags are cleaned by `processAIResponse`. Check your mode parameter.

### Issue: Colors don't match palette
**Solution:** Verify you're passing correct palette name ('vibrant' or 'natural')

---

## Performance Tips

1. **Reuse instances:** Create one highlighter, use many times
2. **Cache results:** Same input = same output (pure function)
3. **Limit input size:** Cap at ~100k characters for best performance
4. **Use memoization:** In React, wrap with `useMemo`

---

## Questions?

- **Documentation:** See README.md
- **Architecture:** See ARCHITECTURE.md
- **Examples:** See examples/USAGE_EXAMPLES.md
- **Live Demo:** [veraos.ai](https://veraos.ai)
- **Author:** [juliocalvo.dev](https://juliocalvo.dev)

---

*Ready to highlight? Start with the basic example above!*
