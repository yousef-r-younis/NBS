# Tech & AI Classes

A comprehensive web-based educational platform for teaching technology and artificial intelligence concepts to students in Grades 3-12.

## Overview

This project contains interactive HTML presentations for various grade levels, covering fundamental concepts from "What's a Computer?" to advanced topics like "How Do Machines Learn?"

## Project Structure

```
NBS-main/
├── index.html                           # Main home page with grade navigation
├── brain.html                           # Additional resource
├── orientation.html                     # Orientation/intro page
├── math-index.html                      # Math-related content index
├── README.md                            # This file
├── common logo.png                      # Site logo
├── common logo2.png                     # Alternative logo
│
├── Grade 3+4/                           # Elementary level (Ages 8-10)
│   ├── gr34-chapter5.html              # Chapter hub: AI Applications
│   ├── gr34-chapter5-session1.html      # Session: What is a Computer?
│   ├── gr34-chapter5-session2.html      # Session: How Do Computers Think?
│   ├── gr34-chapter5-session3.html      # Session: Scratch
│   ├── gr34-chapter6.html              # Chapter hub: How AI Helps Us
│   ├── gr34-chapter6-session1.html      # Session: AI Basics for Kids
│   ├── gr34-chapter6-session2.html      # Session: AI Applications
│   ├── gr34-chapter6-session3.html      # Session: AI in Daily Life
│   ├── gr34-chapter7.html              # Chapter hub: Understanding AI & The Future
│   ├── gr34-chapter7-session1.html      # Session: AI & Creativity
│   ├── gr34-chapter7-session2.html      # Session: AI & Work
│   ├── gr34-chapter7-session3.html      # Session: Future of AI
│   ├── gr34-chapter8.html              # Presentations & Final Project
│   ├── gr34-activity-sheet.html        # Activity Worksheet
│   └── pics/                            # Images for Grade 3+4
│
├── Grade 5+6/                           # Middle level (Ages 10-12)
│   ├── gr56-chapter5-intro.html        # Introduction to Computers
│   ├── gr56-class1-internet-basics.html # Chapter 1: Internet Basics
│   ├── gr56-class2-websites.html       # Chapter 2: Websites
│   ├── gr56-chapter6.html              # Chapter hub: Internet & Web Basics
│   ├── gr56-chapter6-bonus-logic-gates.html # Bonus: Logic Gates
│   ├── gr56-chapter6-session1.html      # Session 1: Web Technologies
│   ├── gr56-chapter6-session2.html      # Session 2: Search Engines
│   ├── gr56-chapter6-session3.html      # Session 3: AI in Web
│   ├── gr56-chapter7.html              # Chapter hub: Search Engines & AI Recommendations
│   ├── gr56-chapter7-session1.html      # Session 1: How Search Works
│   ├── gr56-chapter7-session2.html      # Session 2: Recommendations
│   ├── gr56-chapter7-session3.html      # Session 3: Personalization
│   ├── gr56-chapter8.html              # Chapter hub: Advanced AI Topics
│   ├── gr56-chapter8-session1.html      # Session 1: Ethics
│   ├── gr56-chapter8-session2.html      # Session 2: Security
│   ├── gr56-chapter8-session3.html      # Session 3: Privacy
│   ├── gr56-chapter9.html              # Chapter hub: Professional Skills & Review
│   ├── gr56-chapter9-session1.html      # Session 1: Career Path Review
│   └── pics/                            # Images for Grade 5+6
│
├── Grade 7+8/                           # Lower secondary (Ages 13-14)
│   ├── gr78-class1-tech-ai.html        # Class 1: Technology & AI
│   ├── gr78-class2-computers-think.html # Class 2: How Computers Think
│   ├── gr78-class3-what-is-ai.html     # Class 3: What is AI?
│   ├── gr78-class4-presentations.html  # Class 4: PowerPoint Basics
│   ├── gr78-class5.html                # Class 5: Supporting Content
│   ├── gr78-class6.html                # Class 6: Supporting Content
│   ├── gr78-chapter5.html              # Chapter hub: Python Programming Basics
│   ├── gr78-chapter5-session1.html      # Session 1: Python Fundamentals
│   ├── gr78-chapter5-session2.html      # Session 2: Variables & Functions
│   ├── gr78-chapter5-session3.html      # Session 3: Python Projects
│   ├── gr78-chapter6.html              # Chapter hub: Understanding AI Systems
│   ├── gr78-chapter6-session1.html      # Session 1: AI Architecture
│   ├── gr78-chapter7.html              # Chapter hub: Building for the Web
│   ├── gr78-chapter7-session1.html      # Session 1: Web Development Basics
│   ├── gr78-chapter7-session2.html      # Session 2: Interactive Websites
│   ├── gr78-chapter8.html              # Chapter hub: Professional Skills & Assessment
│   ├── gr78-chapter8-session1.html      # Session 1: Project Management
│   ├── gr78-chapter8-session2.html      # Session 2: Final Assessment
│   └── pics/                            # Images for Grade 7+8
│
└── Grade 10+11+12/                      # Upper secondary (Ages 15-18)
    ├── gr101112-class1-ai-intro.html   # Class 1: AI Introduction
    ├── gr101112-class2-machines-learn.html # Class 2: How Machines Learn
    ├── gr101112-class3-ai-chatbot.html # Class 3: Building AI Chatbots
    ├── gr101112-class4-presentations.html # Class 4: Presentation Skills
    ├── gr101112-class5-ethics-debate.html # Class 5: AI Ethics Debate
    ├── gr101112-chapter6.html          # Chapter hub: AI Tools & Practical Skills
    ├── gr101112-chapter6-session1.html  # Session 1: AI Tools Overview
    ├── gr101112-chapter6-session2.html  # Session 2: Practical Applications
    ├── gr101112-chapter6-session3.html  # Session 3: Advanced Tools
    ├── gr101112-chapter7.html          # Chapter hub: Digital Life & Professional Skills
    ├── gr101112-chapter7-session1.html  # Session 1: Digital Citizenship
    ├── gr101112-chapter7-session2.html  # Session 2: Professional Development
    ├── gr101112-chapter7-session3.html  # Session 3: Career Pathways
    ├── gr101112-chapter8.html          # Chapter hub: Critical Thinking in Digital Age
    ├── gr101112-chapter8-session1.html  # Session 1: Critical Analysis
    ├── gr101112-chapter8-session2.html  # Session 2: Information Verification
    ├── gr101112-chapter8-session3.html  # Session 3: Digital Literacy
    ├── gr101112-chapter9.html          # Chapter hub: Assessment
    ├── gr101112-chapter9-session1.html  # Session 1: Final Project & Assessment
    ├── grade.html                       # Grade information page
    └── Math/                            # Mathematics-related resources
        ├── add-sub.html                # Addition & Subtraction
        └── [other math files...]
```

## File Naming Convention

All files follow a standardized naming pattern for easy identification and organization:

- **Chapter Hub**: `gr{grade}-chapter{number}.html`
  - Example: `gr34-chapter5.html` (Grade 3-4, Chapter 5)
  
- **Session Files**: `gr{grade}-chapter{number}-session{number}.html`
  - Example: `gr56-chapter7-session2.html` (Grade 5-6, Chapter 7, Session 2)

- **Class Files** (non-sequential content): `gr{grade}-class{number}[-descriptor].html`
  - Example: `gr78-class1-tech-ai.html` (Grade 7-8, Class 1: Technology & AI)

- **Special Files**: 
  - `gr{grade}-activity-sheet.html` - Worksheets
  - `gr{grade}-summary.html` - Review materials

Grade Codes:
- `gr34` = Grade 3-4 (Elementary)
- `gr56` = Grade 5-6 (Middle)
- `gr78` = Grade 7-8 (Lower Secondary)
- `gr101112` = Grade 10-11-12 (Upper Secondary)

## Features

### Navigation System
- **Home Page (`index.html`)**: Collapsible grade-level sections with expandable chapter listings
- **Back-to-Home Buttons**: Fixed navigation bar on all class pages for easy return to home
- **Responsive Design**: Modern, color-coded interface with smooth interactions

### Content Coverage

**Grade 3-4** (Elementary - Ages 8-10): Foundation in Computers and AI
- Chapter 5: AI Applications You Know (everyday AI examples)
- Chapter 6: How AI Helps Us (practical AI benefits)
- Chapter 7: Understanding AI & The Future (future of AI)
- Chapter 8: Presentations & Final Project

**Grade 5-6** (Middle - Ages 10-12): Computer Science Fundamentals
- Introduction: What are Computers?
- Chapter 6: Internet & Web Basics (web technologies, search engines)
- Chapter 7: Search Engines & AI Recommendations (personalization)
- Chapter 8: Advanced AI Topics (ethics, security, privacy)
- Chapter 9: Professional Skills & Review (career pathways)

**Grade 7-8** (Lower Secondary - Ages 13-14): Computer Science Essentials
- Classes 1-4: Foundational concepts (what's a computer, how computers think, AI intro, presentations)
- Chapter 5: Python Programming Basics (programming fundamentals)
- Chapter 6: Understanding AI Systems (AI architecture and concepts)
- Chapter 7: Building for the Web (web development)
- Chapter 8: Professional Skills & Assessment (project management, final assessment)

**Grade 10-12** (Upper Secondary - Ages 15-18): Advanced AI and Machine Learning
- Classes 1-5: Advanced topics (AI intro, machine learning, chatbots, presentations, ethics debate)
- Chapter 6: AI Tools & Practical Skills (practical AI applications)
- Chapter 7: Digital Life & Professional Skills (citizenship, career development)
- Chapter 8: Critical Thinking in Digital Age (analysis, verification, literacy)
- Chapter 9: Assessment (final projects and evaluation)

### Design Elements

- **Color Scheme**: Dark blue background (#1A154F) with cyan accents (#00D4FF)
- **Interactive Components**: Collapsible sections, smooth animations, keyboard navigation
- **Accessibility**: Semantic HTML, proper contrast ratios
- **Mobile Responsive**: Adaptive layouts for various screen sizes

## How to Use

1. **Open the Home Page**: Start with `index.html` in your browser
2. **Select a Grade Level**: Click on any grade section to expand chapter listings
3. **Browse Chapters**: Click on chapter links to view the presentation
4. **Navigate Content**: Use arrow buttons or keyboard (←/→ keys) to move between slides
5. **Return Home**: Click "← Back to Home" button in the top-left corner from any class page

## Instructor

**Mr. Yousef Younis**

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser supporting ES6 JavaScript

## Dependencies

- None! This is a static HTML/CSS/JavaScript project with no external dependencies
- Fonts are loaded from Google Fonts CDN
- All assets are self-contained

## File Accessibility

- All HTML files are cross-linked with relative paths for easy local browsing
- Images are organized in `pics/` subdirectories within each grade folder
- PDFs and presentation files are included for reference

## Future Enhancements

Potential additions:
- Interactive quizzes and assessments
- Discussion forums or comments
- Student progress tracking
- Additional multimedia content
- Mobile app version
- Multilingual support

## Notes

- Each grade level has its own styling optimized for that age group
- Content progresses from basic to advanced concepts
- All presentations include interactive elements and visual aids
- Class files link back to index.html for easy navigation

---

**Last Updated**: December 27, 2025
