// Intelligent Highlight System
// Real-time semantic highlighting for AI streaming responses

import { getHighlightPalette } from '../../../theme/highlightPalettes.js';

class IntelligentHighlightSystem {
  constructor(highlightPalette = 'vibrant') {
    // Get palette colors dynamically
    const palette = getHighlightPalette(highlightPalette);
    
    // Color maps for highlights (dynamic from palette)
    this.colorMap = palette.background;
    
    // Underline colors (dynamic from palette)
    this.underlineMap = palette.underline;
    
    // Store current palette name for reference
    this.currentPalette = highlightPalette;
  }

  // Get mode code for AI instruction
  getModeCode(mode) {
    const codes = {
      'underline': 'U',
      'highlights': 'HL',
      'both': 'B',
      'highlights-underline': 'HU'
    };
    return codes[mode] || 'HL';
  }

  // Process user message
  processUserMessage(message, highlightMode, density = 'auto') {
    if (highlightMode === 'none') {
      return { prompt: message, needsHighlights: false };
    }

    return {
      prompt: message,
      needsHighlights: true,
      mode: highlightMode,
      density: density,
      userMessage: message
    };
  }

  // Intelligent processor - handles edge cases
  processAIResponse(response, highlightMode) {
    if (!response) return response;
    
    // Replace em dash with comma + space
    let processedResponse = response.replace(/—/g, ', ');
    
    // Protect code blocks first (replace with placeholders)
    const codeBlocks = [];
    let protectedResponse = processedResponse.replace(/(```[\s\S]*?```)/g, (match) => {
      const index = codeBlocks.length;
      codeBlocks.push(match);
      return `___CODE_BLOCK_${index}___`;
    });
    
    // Auto-convert [P] with multi-line code to ``` blocks
    protectedResponse = protectedResponse.replace(/\[P\]([\s\S]+?)\[\/P\]/g, (match, content) => {
      // Detect if it's multi-line code
      const hasNewlines = content.includes('\n');
      const hasCodeKeywords = /\b(function|def|class|procedure|algorithm|if|while|for|return|const|let|var|import|export|distances|graph|node)\b/i.test(content);
      
      // If it looks like code, convert to code block
      if (hasNewlines && hasCodeKeywords) {
        const index = codeBlocks.length;
        codeBlocks.push('```\n' + content.trim() + '\n```');
        return `___CODE_BLOCK_${index}___`;
      }
      
      // Keep [P] for inline examples
      return match;
    });
    
    // Clean invalid codes
    protectedResponse = protectedResponse
      // Thinking mode tags (should never appear in responses)
      .replace(/\[response\]/gi, '')
      .replace(/\[\/response\]/gi, '')
      .replace(/\[thinking\]/gi, '')
      .replace(/\[\/thinking\]/gi, '')
      // Full word codes (invalid format)
      .replace(/\[GREEN\]([^\[]*)\[\/GREEN\]/gi, '$1')
      .replace(/\[RED\]([^\[]*)\[\/RED\]/gi, '$1')
      .replace(/\[BLUE\]([^\[]*)\[\/BLUE\]/gi, '$1')
      .replace(/\[YELLOW\]([^\[]*)\[\/YELLOW\]/gi, '$1')
      .replace(/\[ORANGE\]([^\[]*)\[\/ORANGE\]/gi, '$1')
      .replace(/\[PURPLE\]([^\[]*)\[\/PURPLE\]/gi, '$1')
      // Mode codes (invalid)
      .replace(/^\s*\[HU\]\s*/gi, '')
      .replace(/^\s*\[HL\]\s*/gi, '')
      .replace(/\[\/HU\]/gi, '')
      .replace(/\[\/HL\]/gi, '')
      // Random invented codes
      .replace(/\[E\]([^\[]*)\[\/E\]/gi, '$1')
      .replace(/\[I\]([^\[]*)\[\/I\]/gi, '$1')
      .replace(/\[N\]([^\[]*)\[\/N\]/gi, '$1')
      .replace(/\[T\]([^\[]*)\[\/T\]/gi, '$1')
      .replace(/\[S\]([^\[]*)\[\/S\]/gi, '$1')
      .replace(/\[M\]([^\[]*)\[\/M\]/gi, '$1')
      .replace(/\[D\]([^\[]*)\[\/D\]/gi, '$1')
      .replace(/\[C\]([^\[]*)\[\/C\]/gi, '$1')
      .replace(/\[A\]([^\[]*)\[\/A\]/gi, '$1')
      .replace(/\[X\]([^\[]*)\[\/X\]/gi, '$1');
    
    // Clean orphaned tags surgically
    const validCodes = ['Y', 'B', 'O', 'G', 'R', 'P', 'L', 'GR', 'U', 'H', 'BR'];
    
    validCodes.forEach(code => {
      // Regex to find valid pairs [CODE]...[/CODE]
      const validPairRegex = new RegExp(`\\[${code}\\]([^\\[]*)\\[\\/${code}\\]`, 'g');
      
      // Temporarily replace valid pairs with placeholders
      const validPairs = [];
      let tempText = protectedResponse.replace(validPairRegex, (match) => {
        const index = validPairs.length;
        validPairs.push(match);
        return `___VALID_${code}_${index}___`;
      });
      
      // Remove ALL remaining tags of this type (orphaned)
      tempText = tempText
        .replace(new RegExp(`\\[${code}\\]`, 'g'), '')
        .replace(new RegExp(`\\[\\/${code}\\]`, 'g'), '');
      
      // Restore valid pairs
      validPairs.forEach((pair, index) => {
        tempText = tempText.replace(`___VALID_${code}_${index}___`, pair);
      });
      
      protectedResponse = tempText;
    });
    
    // Check if response has valid highlight codes
    const hasHighlightCodes = /\[(Y|B|O|G|R|P|L|GR|B1|B2|B3|U|H|BR)\]/.test(protectedResponse);
    
    if (!hasHighlightCodes) {
      // Restore code blocks
      codeBlocks.forEach((block, index) => {
        protectedResponse = protectedResponse.replace(`___CODE_BLOCK_${index}___`, block);
      });
      return protectedResponse;
    }
    
    // Restore code blocks
    codeBlocks.forEach((block, index) => {
      protectedResponse = protectedResponse.replace(`___CODE_BLOCK_${index}___`, block);
    });
    
    // Return for processing (if mode is 'none', remove codes)
    if (highlightMode === 'none') {
      return this.removeHighlightCodes(protectedResponse);
    }
    
    return protectedResponse;
  }
  
  // Remove highlight codes while preserving markdown
  removeHighlightCodes(text) {
    let cleaned = text;
    const highlightCodes = ['Y', 'B', 'O', 'G', 'R', 'P', 'L', 'GR', 'B1', 'B2', 'B3', 'U', 'H', 'BR'];
    
    highlightCodes.forEach(code => {
      const regex = new RegExp(`\\[${code}\\]([^\\[]*)\\[\\/${code}\\]`, 'g');
      cleaned = cleaned.replace(regex, '$1');
    });
    
    return cleaned;
  }
  
  // Process highlight-only mode (uses token parser)
  processHighlightMode(text) {
    return this.parseAndProcessHighlights(text, 'highlights');
  }
  
  // Process underline-only mode (uses token parser)
  processUnderlineMode(text) {
    return this.parseAndProcessHighlights(text, 'underline');
  }

  // Intelligent token parser - handles nesting correctly
  parseAndProcessHighlights(text, mode) {
    let processedText = text;
    
    // Clean orphaned ** (not closed)
    // Remove ** at start of line (not markdown, just literal)
    processedText = processedText.replace(/^\*\*/gm, '');
    // Remove ** after newline + space
    processedText = processedText.replace(/\n\s*\*\*(?!\*)/g, '\n');
    
    // Process valid markdown: bold, italic, code (closed pairs only)
    processedText = processedText.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
    processedText = processedText.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
    processedText = processedText.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // Check if there are highlight codes
    const hasHighlightCodes = /\[(Y|B|O|G|R|P|L|GR|U|H|BR)\]/.test(processedText);
    
    if (!hasHighlightCodes) {
      return processedText;
    }
    
    // Has highlight codes - tokenize and process
    // Tokenize: split text into [TAG], [/TAG], and plain text
    const tokenPattern = /(\[\/?(?:Y|B|O|G|R|P|L|GR|U|H|BR)\])/g;
    const tokens = processedText.split(tokenPattern).filter(t => t.length > 0);
    
    const stack = [];
    const output = [];
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      // Check if it's an opening tag
      const openMatch = token.match(/^\[([YBOGRLP]|GR|U|H|BR)\]$/);
      if (openMatch) {
        stack.push({
          code: openMatch[1],
          startIndex: output.length,
          content: []
        });
        continue;
      }
      
      // Check if it's a closing tag
      const closeMatch = token.match(/^\[\/([YBOGRLP]|GR|U|H|BR)\]$/);
      if (closeMatch) {
        const code = closeMatch[1];
        
        // Find matching opening tag in stack
        let matchIndex = -1;
        for (let j = stack.length - 1; j >= 0; j--) {
          if (stack[j].code === code) {
            matchIndex = j;
            break;
          }
        }
        
        if (matchIndex !== -1) {
          // Found match - pop and process
          const open = stack[matchIndex];
          
          // Collect content (everything pushed after this tag opened)
          const content = output.slice(open.startIndex).join('');
          
          // Remove collected content from output
          output.splice(open.startIndex);
          
          // Apply styling
          const styled = this.wrapWithStyle(content, code, mode);
          output.push(styled);
          
          // Remove from stack
          stack.splice(matchIndex, 1);
        }
        continue;
      }
      
      // Plain text - add to output
      output.push(token);
    }
    
    return output.join('');
  }
  
  // Wrap content with appropriate style based on code and mode
  wrapWithStyle(content, code, mode) {
    if (mode === 'underline') {
      const color = this.underlineMap[code] || '#FF7744';
      return `<span style="text-decoration:underline ${color};text-decoration-thickness:2px;text-underline-offset:2px;text-decoration-skip-ink:none">${content}</span>`;
    } else if (mode === 'highlights') {
      const bgColor = this.colorMap[code] || '#FFF4C3';
      return `<span style="background-color:${bgColor};padding:1px 3px 0 3px;border-radius:3px;display:inline">${content}</span>`;
    } else if (mode === 'both' || mode === 'highlights-underline') {
      const bgColor = this.colorMap[code] || '#FFF4C3';
      const underlineColor = this.underlineMap[code] || '#FF7744';
      return `<span style="background-color:${bgColor};text-decoration:underline ${underlineColor};text-decoration-thickness:2px;text-underline-offset:2px;text-decoration-skip-ink:none;padding:1px 3px 0 3px;border-radius:3px">${content}</span>`;
    }
    
    return content;
  }

  // Process both mode (uses token parser)
  processBothMode(text) {
    return this.parseAndProcessHighlights(text, 'both');
  }
  
  // Process highlights-underline mode (uses token parser)
  processHighlightUnderlineMode(text) {
    return this.parseAndProcessHighlights(text, 'highlights-underline');
  }

  // Helper to escape HTML in code blocks
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // Darken color for underline
  darkenColor(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    
    const darkerR = Math.max(0, r - 40);
    const darkerG = Math.max(0, g - 40);
    const darkerB = Math.max(0, b - 40);
    
    return `#${darkerR.toString(16).padStart(2,'0')}${darkerG.toString(16).padStart(2,'0')}${darkerB.toString(16).padStart(2,'0')}`;
  }

  // Calculate token cost estimate
  estimateTokenCost(mode, density) {
    const systemPromptTokens = mode === 'none' ? 0 : 170;
    
    const instructionTokens = {
      'none': 0,
      'underline': 3,
      'highlights': 4,
      'both': 3,
      'highlights-underline': 4
    };
    
    const densityTokens = density === 'auto' ? 0 : 8;
    
    return {
      systemPrompt: systemPromptTokens,
      perMessage: instructionTokens[mode] + densityTokens,
      estimatedPerConversation: systemPromptTokens + (20 * (instructionTokens[mode] + densityTokens))
    };
  }
}

export default IntelligentHighlightSystem;
