# Marine Operations Dashboard

A comprehensive marine operations dashboard built for Entail Platform using React, TypeScript, Material-UI, and Vite. This dashboard provides real-time monitoring and decision support for maritime operations based on weather conditions and project timelines.

**Live Demo**: [https://entail-marine-dashboard.netlify.app](https://entail-marine-dashboard.netlify.app)

![Marine Operations Dashboard](public/marine-logo.svg)

## Features

- **Interactive Timeline**: Project timeline with task management and Go/No-Go indicators
- **Weather Forecast**: Real-time weather data visualization with zoom capabilities
- **3D View**: Maritime operations visualization with task-specific details
- **Go/No-Go Analysis**: Weather-based decision system for marine operations
- **Dark/Light Theme**: Complete theme support with Material UI theming
- **Responsive Design**: Optimized for desktop and mobile devices
- **Error Handling**: Comprehensive error state management with actionable feedback
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation, screen reader support, and skip links

## Technology Stack

- **React 19.1.1** - UI framework with functional components and hooks
- **TypeScript 5.8.3** - Type safety throughout the codebase
  - Strict type checking with advanced configuration
  - Path aliases for clean imports (`src/*`)
  - Modern ES2023 target with bundler-based module resolution
- **Material-UI 7.3.2** - Component library with custom theme support
- **MUI X Charts** - Data visualization for weather forecasts
- **ARIA Support** - Accessibility implementation with WCAG 2.1 compliance
  - Screen reader announcements
  - Keyboard navigation helpers
  - Focus management utilities
- **Vite 7.1.4** - Build tool with optimized production builds
  - Code splitting with manual chunk configuration
  - Asset optimization and processing
- **pnpm** - Fast, disk space efficient package manager

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```text
src/
├── assets/              # Static assets like images
├── components/          # React components
│   ├── Dashboard/       # Main dashboard component
│   ├── ErrorState/      # Error handling component with various states
│   ├── GoNoGoDialog/    # Decision analysis dialog
│   ├── Layout/          # App layout components
│   │   ├── Header.tsx       # App header component
│   │   ├── MainContent.tsx  # Main content wrapper
│   │   ├── NavigationSkipLinks.tsx # Accessibility navigation
│   │   └── RootLayout.tsx   # Root layout structure
│   ├── ProjectTimeline/ # Timeline visualization
│   ├── SkipLink/        # Accessibility skip navigation links
│   ├── ThreeDView/      # 3D visualization component
│   └── WeatherForecast/ # Weather data charts
├── contexts/            # React contexts
│   ├── DashboardContext.tsx # Dashboard state management
│   └── ThemeContext.tsx     # Theme management
├── data/                # Mock data
├── types/               # TypeScript type definitions
├── utils/               # Business logic utilities
│   ├── accessibilityUtils.ts # Accessibility helpers
│   ├── assetUtils.ts    # Asset management utilities
│   ├── goNoGoUtils.ts   # Decision support utilities
│   ├── responsiveUtils.ts # Responsive design helpers
│   ├── stateUtils.tsx   # State management utilities
│   ├── taskIcons.tsx    # Task icon components
│   ├── taskUtils.ts     # Task management utilities
│   ├── themeUtils.ts    # Theme configuration
│   └── weatherUtils.ts  # Weather data processing
└── router/              # Routing configuration
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (with optimized chunks)
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint

## Key Features Implementation

### Theme Support

The application implements a comprehensive dark/light theme system using MUI's ThemeProvider and a custom ThemeContext. The theming system features:

- **Complete Palette Configuration**: Custom color palettes for both light and dark modes
- **Component Style Overrides**: Custom styling for Cards, AppBar, and Paper components
- **Persistent User Preference**: Theme selection saved in localStorage
- **Typography Customization**: Custom font family and weight settings
- **Consistent Design Language**: Shared border radius and shadow styles
- **Runtime Theme Switching**: Seamless switching between light and dark modes

### Weather Visualization

Weather data is visualized using MUI X Charts with interactive features like zoom capabilities, task-specific highlighting, and responsive layouts.

### Task Management

The timeline component displays project tasks with weather-based status indicators, helping operations teams plan activities based on environmental conditions.

### Error Handling

The application includes a robust error handling system with:

- **Centralized Error Component**: Reusable `ErrorState` component for consistent error display
- **Multiple Severity Levels**: Support for error, warning, and informational states
- **Actionable Feedback**: Error states include retry actions when applicable
- **Contextual Messaging**: Custom error messages based on the error context
- **Visual Differentiation**: Color-coded error states with appropriate icons
- **Graceful Degradation**: Fallback UI elements when data cannot be loaded
- **Error Recovery**: Guided recovery options with actionable buttons

### Accessibility

Accessibility features are implemented according to WCAG 2.1 guidelines:

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Skip Links**: Skip navigation links allow keyboard users to bypass navigation
- **ARIA Attributes**: Proper labeling with aria-* attributes throughout the application
- **Screen Reader Announcements**: Dynamic announcements for state changes and important updates
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: Compliant color contrast ratios for text readability
- **Responsive Design**: Accessible on various screen sizes and devices
- **Text Alternatives**: All non-text content includes appropriate text alternatives
- **Semantic HTML**: Proper HTML elements for structural meaning

### Optimization

The application is optimized for performance with several key strategies:

- **Manual Code Splitting**: Vendor dependencies (MUI, React, utilities) are split into separate chunks
- **Bundle Size Management**: Custom chunk size warning limits with strategic code organization
- **Efficient Asset Loading**: Images and other assets are optimized at build time
- **Lazy Loading**: Components are loaded only when needed to improve initial load time
- **Type-Safe Development**: Strong TypeScript configuration prevents runtime errors
- **Strategic Import Aliasing**: Clean import paths using configured path aliases

## Development

The project uses modern React patterns with TypeScript for type safety. Business logic is separated into utility modules for better maintainability and testing.

### Component Architecture

The application follows a modular component architecture:

- **Core Components**: Base UI elements with focused responsibilities
- **Container Components**: Handle data fetching and state management
- **Utility Functions**: Extracted business logic for better testability
- **Layout Structure**: Optimized component organization with:
  - Separated header, content areas, and navigation
  - Modular component exports without index files
  - Logical grouping of related functionality
- **Context Management**: State isolation and sharing through React Context API
- **Error Boundaries**: Graceful error handling at component boundaries

## Project Configuration

### TypeScript Configuration

The project uses a modern TypeScript setup with:

- **Strict Type Checking**: Prevents common errors through strict typing
- **Path Aliases**: `src/*` mapping for cleaner imports
- **Module Management**:
  - ESNext module system with bundler-based resolution
  - Modern ES2023 target for latest JavaScript features
- **Optimization Flags**:
  - `noUnusedLocals` and `noUnusedParameters` to keep code clean
  - `noUncheckedSideEffectImports` to prevent unexpected behavior

### Vite Configuration

Build optimization is achieved through custom Vite configuration:

- **Manual Chunks**: Strategic code splitting for vendor libraries
- **Chunk Size Management**: Increased warning limits for better developer experience
- **Path Resolution**: Consistent alias configuration matching TypeScript paths
- **Performance Optimizations**: Built-in asset optimization and minification

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass and code follows style guidelines
5. Submit a pull request

## License

Proprietary - Entail Platform
