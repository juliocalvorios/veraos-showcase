# Usage Examples - Intelligent Highlight System

Practical examples showing how to use the Intelligent Highlight System in different scenarios.

---

## Basic Usage

### 1. Simple Highlighting

```javascript
import IntelligentHighlightSystem from '../src/features/chat/utils/IntelligentHighlightSystem.js';

// Create highlighter instance
const highlighter = new IntelligentHighlightSystem('vibrant');

// Process a simple response
const aiResponse = "[Y]This is important[/Y] and [B]this is a definition[/B].";

// Step 1: Clean and validate
const cleaned = highlighter.processAIResponse(aiResponse, 'highlights');

// Step 2: Apply highlighting
const html = highlighter.processHighlightMode(cleaned);

// Output:
// <span style="background-color:#FFF4C3;...">This is important</span>
// and
// <span style="background-color:#D5FEFF;...">this is a definition</span>.
```

---

## Advanced Usage

### 2. Streaming Responses

```javascript
// Handle real-time AI streaming
class StreamingHighlighter {
  constructor() {
    this.highlighter = new IntelligentHighlightSystem('vibrant');
    this.buffer = '';
  }

  processChunk(chunk) {
    // Accumulate chunks
    this.buffer += chunk;
    
    // Process current buffer
    const cleaned = this.highlighter.processAIResponse(
      this.buffer, 
      'highlights'
    );
    const html = this.highlighter.processHighlightMode(cleaned);
    
    return html;
  }

  reset() {
    this.buffer = '';
  }
}

// Usage
const streamer = new StreamingHighlighter();

// Simulate streaming
const chunks = ['[Y]Stream', 'ing ', 'text[', '/Y]'];
chunks.forEach(chunk => {
  const html = streamer.processChunk(chunk);
  updateUI(html); // Update UI with partial response
});
```

### 3. Multiple Highlight Modes

```javascript
const highlighter = new IntelligentHighlightSystem('vibrant');
const text = "[Y]Important text[/Y] with [B]definition[/B]";

// Mode 1: Highlights only (background color)
const highlightsOnly = highlighter.processHighlightMode(
  highlighter.processAIResponse(text, 'highlights')
);

// Mode 2: Underlines only
const underlinesOnly = highlighter.processUnderlineMode(
  highlighter.processAIResponse(text, 'underline')
);

// Mode 3: Both (background + same color underline)
const both = highlighter.processBothMode(
  highlighter.processAIResponse(text, 'both')
);

// Mode 4: Highlights-Underline (background + darker underline)
const highlightsUnderline = highlighter.processHighlightUnderlineMode(
  highlighter.processAIResponse(text, 'highlights-underline')
);
```

### 4. Dynamic Theme Switching

```javascript
class ThemableHighlighter {
  constructor(initialTheme = 'vibrant') {
    this.theme = initialTheme;
    this.highlighter = new IntelligentHighlightSystem(initialTheme);
  }

  switchTheme(newTheme) {
    if (newTheme !== this.theme) {
      this.theme = newTheme;
      this.highlighter = new IntelligentHighlightSystem(newTheme);
    }
  }

  highlight(text) {
    const cleaned = this.highlighter.processAIResponse(text, 'highlights');
    return this.highlighter.processHighlightMode(cleaned);
  }
}

// Usage
const themable = new ThemableHighlighter('vibrant');

// Highlight with vibrant colors
let html1 = themable.highlight('[Y]Key point[/Y]');

// Switch to natural theme
themable.switchTheme('natural');

// Same content, different colors
let html2 = themable.highlight('[Y]Key point[/Y]');
```

---

## React Integration

### 5. React Component Wrapper

```javascript
import React, { useMemo } from 'react';
import IntelligentHighlightSystem from '../utils/IntelligentHighlightSystem';

function HighlightedMessage({ 
  content, 
  mode = 'highlights', 
  palette = 'vibrant' 
}) {
  const highlighter = useMemo(
    () => new IntelligentHighlightSystem(palette),
    [palette]
  );

  const html = useMemo(() => {
    const cleaned = highlighter.processAIResponse(content, mode);
    
    switch (mode) {
      case 'underline':
        return highlighter.processUnderlineMode(cleaned);
      case 'both':
        return highlighter.processBothMode(cleaned);
      case 'highlights-underline':
        return highlighter.processHighlightUnderlineMode(cleaned);
      default:
        return highlighter.processHighlightMode(cleaned);
    }
  }, [content, mode, highlighter]);

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: html }}
      className="highlighted-message"
    />
  );
}

// Usage
<HighlightedMessage 
  content="[Y]Important[/Y] and [B]definition[/B]"
  mode="highlights"
  palette="vibrant"
/>
```

### 6. React Hook for Streaming

```javascript
import { useState, useCallback, useRef } from 'react';
import IntelligentHighlightSystem from '../utils/IntelligentHighlightSystem';

function useStreamingHighlights(palette = 'vibrant', mode = 'highlights') {
  const [html, setHtml] = useState('');
  const highlighter = useRef(new IntelligentHighlightSystem(palette));
  const buffer = useRef('');

  const processChunk = useCallback((chunk) => {
    buffer.current += chunk;
    const cleaned = highlighter.current.processAIResponse(
      buffer.current,
      mode
    );
    const newHtml = highlighter.current.processHighlightMode(cleaned);
    setHtml(newHtml);
  }, [mode]);

  const reset = useCallback(() => {
    buffer.current = '';
    setHtml('');
  }, []);

  return { html, processChunk, reset };
}

// Usage in component
function StreamingMessage({ eventSource }) {
  const { html, processChunk, reset } = useStreamingHighlights('vibrant', 'highlights');

  useEffect(() => {
    eventSource.onmessage = (event) => {
      processChunk(event.data);
    };

    return () => reset();
  }, [eventSource, processChunk, reset]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

---

## Real-World Scenarios

### 7. Chat Application Integration

```javascript
class ChatMessageProcessor {
  constructor() {
    this.highlighter = new IntelligentHighlightSystem('vibrant');
    this.activeStreams = new Map();
  }

  // Start new streaming message
  startStream(messageId) {
    this.activeStreams.set(messageId, '');
  }

  // Process chunk for specific message
  processStreamChunk(messageId, chunk) {
    const current = this.activeStreams.get(messageId) || '';
    const updated = current + chunk;
    this.activeStreams.set(messageId, updated);

    const cleaned = this.highlighter.processAIResponse(updated, 'highlights');
    return this.highlighter.processHighlightMode(cleaned);
  }

  // Finalize stream
  finalizeStream(messageId) {
    const final = this.activeStreams.get(messageId);
    this.activeStreams.delete(messageId);
    return final;
  }

  // Process complete (non-streaming) message
  processComplete(content) {
    const cleaned = this.highlighter.processAIResponse(content, 'highlights');
    return this.highlighter.processHighlightMode(cleaned);
  }
}

// Usage
const processor = new ChatMessageProcessor();

// Streaming message
processor.startStream('msg-123');
let html1 = processor.processStreamChunk('msg-123', '[Y]Start');
let html2 = processor.processStreamChunk('msg-123', 'ing...[/Y]');
processor.finalizeStream('msg-123');

// Complete message
let completeHtml = processor.processComplete('[B]Non-streaming message[/B]');
```

### 8. Error Handling & Validation

```javascript
class SafeHighlighter {
  constructor(palette = 'vibrant') {
    this.highlighter = new IntelligentHighlightSystem(palette);
  }

  safeHighlight(content, mode = 'highlights') {
    try {
      // Validate input
      if (!content || typeof content !== 'string') {
        return '';
      }

      // Limit content size (prevent DoS)
      if (content.length > 100000) {
        console.warn('Content too large, truncating');
        content = content.substring(0, 100000);
      }

      // Process with error handling
      const cleaned = this.highlighter.processAIResponse(content, mode);
      const html = this.highlighter.processHighlightMode(cleaned);

      // Validate output
      if (!html) {
        return content; // Fallback to original
      }

      return html;

    } catch (error) {
      console.error('Highlighting failed:', error);
      return content; // Return original on error
    }
  }
}

// Usage
const safe = new SafeHighlighter();
const html = safe.safeHighlight(userContent);
```

---

## Performance Optimization

### 9. Memoization for Repeated Content

```javascript
class MemoizedHighlighter {
  constructor(palette = 'vibrant') {
    this.highlighter = new IntelligentHighlightSystem(palette);
    this.cache = new Map();
    this.maxCacheSize = 100;
  }

  highlight(content, mode = 'highlights') {
    const cacheKey = `${content}-${mode}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Process
    const cleaned = this.highlighter.processAIResponse(content, mode);
    const html = this.highlighter.processHighlightMode(cleaned);

    // Cache result
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(cacheKey, html);

    return html;
  }

  clearCache() {
    this.cache.clear();
  }
}
```

### 10. Batch Processing

```javascript
class BatchHighlighter {
  constructor(palette = 'vibrant') {
    this.highlighter = new IntelligentHighlightSystem(palette);
  }

  highlightBatch(messages, mode = 'highlights') {
    return messages.map(message => ({
      id: message.id,
      original: message.content,
      highlighted: this.highlightSingle(message.content, mode)
    }));
  }

  highlightSingle(content, mode) {
    const cleaned = this.highlighter.processAIResponse(content, mode);
    return this.highlighter.processHighlightMode(cleaned);
  }
}

// Usage
const batch = new BatchHighlighter('vibrant');
const messages = [
  { id: 1, content: '[Y]Message 1[/Y]' },
  { id: 2, content: '[B]Message 2[/B]' },
  { id: 3, content: '[G]Message 3[/G]' }
];

const processed = batch.highlightBatch(messages);
// Returns array with highlighted versions
```

---

## Testing Examples

### 11. Unit Test Examples

```javascript
import IntelligentHighlightSystem from '../IntelligentHighlightSystem';

describe('IntelligentHighlightSystem', () => {
  let highlighter;

  beforeEach(() => {
    highlighter = new IntelligentHighlightSystem('vibrant');
  });

  test('handles simple highlighting', () => {
    const input = '[Y]Test[/Y]';
    const cleaned = highlighter.processAIResponse(input, 'highlights');
    const output = highlighter.processHighlightMode(cleaned);
    
    expect(output).toContain('background-color:#FFF4C3');
    expect(output).toContain('Test');
  });

  test('handles nested tags', () => {
    const input = '[Y]Outer [B]inner[/B] text[/Y]';
    const cleaned = highlighter.processAIResponse(input, 'highlights');
    const output = highlighter.processHighlightMode(cleaned);
    
    expect(output).toContain('#FFF4C3'); // Yellow
    expect(output).toContain('#D5FEFF'); // Blue
  });

  test('cleans orphaned tags', () => {
    const input = '[Y]No closing tag';
    const output = highlighter.processAIResponse(input, 'highlights');
    
    expect(output).not.toContain('[Y]');
    expect(output).toBe('No closing tag');
  });

  test('preserves markdown', () => {
    const input = '[Y]**Bold** and *italic*[/Y]';
    const cleaned = highlighter.processAIResponse(input, 'highlights');
    const output = highlighter.processHighlightMode(cleaned);
    
    expect(output).toContain('<strong>Bold</strong>');
    expect(output).toContain('<em>italic</em>');
  });

  test('protects code blocks', () => {
    const input = '```\nconst [Y]x[/Y] = 1;\n```';
    const cleaned = highlighter.processAIResponse(input, 'highlights');
    
    expect(cleaned).not.toMatch(/background-color/);
    expect(cleaned).toContain('```');
  });
});
```

---

## Common Patterns

### 12. Color Customization

```javascript
import { getHighlightPalette, getHighlightBackground } from '../theme/highlightPalettes';

// Get entire palette
const vibrant = getHighlightPalette('vibrant');
console.log(vibrant.background['Y']); // #FFF4C3

// Get specific color
const yellowBg = getHighlightBackground('vibrant', 'Y');
const blueBg = getHighlightBackground('natural', 'B');

// Use in custom styling
const customStyle = {
  backgroundColor: getHighlightBackground('vibrant', 'G'),
  padding: '2px 4px',
  borderRadius: '3px'
};
```

---

## Best Practices

1. **Always clean before highlighting**
   ```javascript
   const cleaned = highlighter.processAIResponse(text, mode);
   const html = highlighter.processHighlightMode(cleaned);
   ```

2. **Use memoization for repeated content**
   ```javascript
   const html = useMemo(() => /* highlight logic */, [content, mode]);
   ```

3. **Handle streaming in accumulating buffer**
   ```javascript
   buffer += chunk;
   const html = highlighter.processHighlightMode(buffer);
   ```

4. **Validate input sizes**
   ```javascript
   if (content.length > MAX_SIZE) content = content.substring(0, MAX_SIZE);
   ```

5. **Cache highlighter instances**
   ```javascript
   const highlighter = useRef(new IntelligentHighlightSystem('vibrant'));
   ```

---

*Usage examples for veraOS Showcase*
