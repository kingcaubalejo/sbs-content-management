
// content-editor.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatCardModule
  ],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  content: string = `# Welcome to the Editor

This is a **split-screen editor** with live preview!

## Features
- Write in Markdown on the left
- See live preview on the right
- Supports **bold**, *italic*, and more

## Try it out
Edit this text and watch the preview update in real-time.

\`\`\`javascript
const example = "You can even add code blocks!";
console.log(example);
\`\`\`

- Bullet points
- Work great too

> Blockquotes are also supported`;

  mode: 'markdown' | 'html' = 'markdown';

  constructor(private sanitizer: DomSanitizer) {}

  get preview(): SafeHtml {
    const html = this.mode === 'markdown' 
      ? this.parseMarkdown(this.content)
      : this.content;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private parseMarkdown(md: string): string {
    let html = md;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre><code>$2</code></pre>');
    
    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');
    
    // Blockquotes
    html = html.replace(/^&gt; (.+)/gim, '<blockquote>$1</blockquote>');
    html = html.replace(/^> (.+)/gim, '<blockquote>$1</blockquote>');
    
    // Lists
    html = html.replace(/^\- (.+)/gim, '<li>$1</li>');
    html = html.replace(/(<li.*<\/li>)/s, '<ul>$1</ul>');
    
    // Paragraphs
    html = html.split('\n\n').map(para => {
      if (!para.match(/^<(h|ul|blockquote|pre|li)/)) {
        return `<p>${para}</p>`;
      }
      return para;
    }).join('');
    
    return html;
  }
}