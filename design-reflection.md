# Design Reflection: Entail Marine Dashboard

## State Management for Growing Complexity

Let's address how we'll handle increasingly complex state as our dashboard evolves:

### Current Approach

Right now, we're using React's Context API with `DashboardContext` to manage shared state across components. This works well for our current needs but will need enhancement as we scale.

### Proposed Strategy: React Context + TanStack Query

We recommend combining React Context for UI state with TanStack Query (formerly React Query) for server state management:

1. **React Context for UI State**:
   - Split UI state into focused contexts (e.g., `ThemeContext`, `UserPreferencesContext`, `NavigationContext`)
   - Use Context for state that rarely changes but needs global access
   - Implement reducer pattern for predictable state updates
   - Keep context state lean and focused on UI concerns only

2. **TanStack Query for Server State**:
   - Handles all data fetching, caching, and synchronization with the server
   - Key benefits include:
     - **Advanced Caching System** (The biggest advantage):
       - Smart cache invalidation using query keys
       - Memory-efficient storage through structural sharing
       - Time-based cache with configurable freshness settings
       - Auto-cleanup of unused data
       - Persistent cache across browser sessions
       - Prefetching data before it's needed
       - Race condition prevention through query cancellation
     - Background data refreshing without disrupting the UI
     - Eliminating duplicate network requests
     - Built-in support for pagination and infinite scrolling
     - Instant UI updates with server confirmation (optimistic updates)
     - Handling mutations with automatic rollbacks when errors occur

3. **Integration Pattern**:
   - Build custom hooks that combine Context and TanStack Query
   - For example: `useWeatherData()` would use TanStack Query for fetching/caching weather data, while accessing user unit preferences (metric/imperial) from Context

4. **State Persistence**:
   - Save UI preferences and settings to `localStorage` or `sessionStorage`
   - Use TanStack Query's built-in persistence for caching server responses

### Why TanStack Query's Caching is Critical for Marine Operations

In offshore marine operations, reliable data access can be mission-critical. TanStack Query's sophisticated caching provides several key advantages:

1. **Network Resilience**:
   - Vessels at sea often experience spotty or dropped connections
   - With TanStack Query, operations continue using cached data even when offline
   - When connection returns, data refreshes automatically in the background

2. **Bandwidth Optimization**:
   - Satellite bandwidth is expensive and limited at sea
   - Smart caching means we only download what's changed, saving precious bandwidth
   - When multiple dashboard components need the same data, we fetch it just once

3. **Performance in Critical Situations**:
   - During emergency operations, crews need immediate data access
   - Cached data appears instantly while fresh data loads in the background
   - Clear loading indicators show operators when data is live vs. cached
   - Predictable, consistent behavior even with poor connectivity

4. **User Experience Benefits**:
   - Instant UI feedback makes the dashboard feel responsive even with slow connections
   - No more frustrating data "flickering" when navigating between screens
   - Previous data remains available, providing valuable historical context for decision-making

5. **Implementation Example**:

   ```typescript
   const useWeatherData = (vesselId: string) => {
     return useQuery({
       queryKey: ['weather', vesselId],
       queryFn: () => fetchWeatherForVessel(vesselId),
       staleTime: 5 * 60 * 1000,
       gcTime: 24 * 60 * 60 * 1000,
       retry: (failureCount, error) => {
         return failureCount < 3 && !isServerError(error);
       },
     });
   };
   ```

## Component Architecture for Reusability and Testability

### Component Hierarchy Strategy

1. **Atomic Design with Material-UI**: We'll organize our components like building blocks:
   - Atoms (the basic building blocks)
     - Using MUI's base components (Button, TextField, Typography)
     - Creating a consistent visual language with customized MUI themes
     - Ensuring visual harmony through MUI's styling system
   - Molecules (combining atoms for purpose)
     - Creating reusable component combinations like search bars and menu items
     - Leveraging MUI's pre-built molecules like ButtonGroup and Tabs
     - Developing maritime-specific component combinations
   - Organisms (functional sections)
     - Building layouts with MUI's Grid, Stack, and Box components
     - Using Cards, Tables, and Charts for data visualization
     - Creating navigation with AppBar, Drawer and other navigation components
   - Templates (page structures)
   - Pages (complete screens)

   **Why MUI Works Well for Maritime Operations**:
   - Built-in accessibility features essential for operational safety
   - Ready-made responsive design for various screens (bridge stations to handheld devices)
   - Theming system for different operational modes (day/night, normal/emergency)
   - Consistent patterns making it easier for developers to maintain and extend
   - Enterprise-quality components built for mission-critical applications

2. **Component Composition**: We'll favor composition over inheritance, creating flexible components that work like interchangeable parts.

3. **Custom Hooks for Data Separation**: We'll keep data handling separate from UI rendering:
   - Custom hooks manage all data fetching, caching, and state using TanStack Query
   - UI components stay focused on presentation, making them easier to test and maintain
   - Example:

     ```typescript
     function useVesselData(vesselId: string) {
       const vesselQuery = useQuery({
         queryKey: ['vessel', vesselId],
         queryFn: () => fetchVesselData(vesselId)
       });
       
       const vesselStatusQuery = useQuery({
         queryKey: ['vesselStatus', vesselId],
         queryFn: () => fetchVesselStatus(vesselId),
         refetchInterval: 30000
       });
       
       return {
         vessel: vesselQuery.data,
         status: vesselStatusQuery.data,
         isLoading: vesselQuery.isLoading || vesselStatusQuery.isLoading,
         isError: vesselQuery.isError || vesselStatusQuery.isError,
         error: vesselQuery.error || vesselStatusQuery.error
       };
     }
     
     function VesselCard({ vesselId }: { vesselId: string }) {
       const { vessel, status, isLoading, isError } = useVesselData(vesselId);
       
       if (isLoading) return <LoadingIndicator />;
       if (isError) return <ErrorDisplay />;
       
       return (
         <Card>
           <VesselInfo data={vessel} />
           <StatusIndicator status={status} />
         </Card>
       );
     }
     ```

### Making Testing Easy and Effective

1. **Clear Props Interfaces**: We'll define TypeScript interfaces for all component props to:
   - Catch errors early through type checking
   - Create self-documenting components that are easier to use

2. **Component Testing Tools**: Our testing approach will use modern tools:
   - Vitest for fast, reliable test execution
   - React Testing Library for testing components as users would interact with them
   - Mock Service Worker to simulate API calls without hitting actual endpoints

3. **Balanced Testing Approach**:
   - Unit tests to verify our business logic works correctly
   - Component tests to ensure UI renders properly
   - Integration tests to check component interactions
   - Playwright E2E tests for critical workflows like emergency procedures

4. **Living Documentation**: We'll use Storybook to:
   - Document each component in isolation
   - Test components in various states and configurations
   - Create a visual reference for the team

## Performance Optimization Approaches

### Handling Large Datasets Efficiently

1. **Virtualization**: We'll use windowing techniques with `react-window` or `react-virtualized` to only render what's visible on screen—critical for large vessel fleets or historical data.

2. **Smart Pagination**: We'll break large datasets (like maintenance logs or voyage histories) into manageable chunks, loading only what's needed.

3. **Optimized Data Structure**: We'll normalize state data to reduce redundancy and make lookups faster—especially important for real-time monitoring.

### Making 3D Visualizations Performant

1. **Background Processing**: Heavy calculations for 3D models will run in Web Workers, keeping the UI responsive even during complex operations.

2. **Optimizing 3D Rendering**:
   - Showing appropriate detail levels based on zoom (high detail for close inspection, simplified models when zoomed out)
   - Only rendering objects in the current field of view
   - Compressing textures and simplifying geometries for better performance

3. **On-Demand Loading**: 3D components and assets will only load when needed to reduce initial load times.

4. **Fallback Options**: We'll provide 2D alternatives when a device can't handle 3D visualization, ensuring critical information is always accessible.

### Overall Performance Improvements

1. **Preventing Wasted Renders**: We'll strategically use React.memo, useMemo, and useCallback to avoid unnecessary re-renders—especially important for data-intensive dashboard components.

2. **Loading Only What's Needed**: We'll split our code by routes and features, so users only download what they need for their current task. This means faster initial loading times.

3. **Continuous Performance Tracking**: We'll use Lighthouse, WebVitals, and custom metrics to identify and fix performance bottlenecks before they impact operations.

4. **Offline Capabilities**: Using Service Workers, we'll cache critical assets and enable key features to work offline—essential for marine operations where connectivity can be lost unexpectedly.

## Accessibility and Usability for Offshore Operators

### Designing for High-Pressure Situations

1. **Making Critical Information Stand Out**: When every second counts, operators need to find information quickly:
   - Color-coding by urgency (red for critical, yellow for warnings, etc.)
   - Sizing elements based on importance
   - Placing critical controls where they're immediately accessible

2. **Reducing Mental Workload**:
   - Revealing complex information progressively so operators aren't overwhelmed
   - Creating task-focused modes that hide irrelevant information during critical operations
   - Maintaining consistent layouts so operators develop muscle memory

3. **Preventing and Recovering from Errors**:
   - Requiring confirmation for consequential actions
   - Providing undo functionality when possible
   - Showing clear error messages with specific recovery steps

### Making the System Accessible for All Crew Members

1. **Supporting Keyboard-Only Navigation**: Ensuring the system works without a mouse or touchscreen:
   - Visible focus indicators that stand out in all lighting conditions
   - Intuitive tab order that follows the natural workflow of maritime operations
   - Custom keyboard shortcuts for time-critical actions during operations

2. **Enabling Screen Reader Compatibility**:
   - Implementing proper ARIA roles and labels for all interface elements
   - Building with semantic HTML elements that convey meaning, not just appearance
   - Creating detailed text descriptions for charts, maps and other visual data

3. **Adapting to Harsh Marine Environments**:
   - High-contrast display modes for visibility when operating in direct sunlight on deck
   - User-adjustable text sizing for different viewing distances (from bridge stations to handheld use)
   - Large, well-spaced touch targets designed to be usable during vessel movement and when wearing work gloves

4. **Supporting International Crews with i18next**:
   - Creating a fully multilingual interface for diverse offshore teams using i18next
   - Making the system work for everyone with:
     - Organized translation namespaces that match different dashboard functions
     - Instant language switching that doesn't interrupt ongoing operations
     - Smart handling of plural forms and context-dependent phrases
     - Automatic formatting of numbers and dates based on crew member preferences
     - Full support for right-to-left languages like Arabic for Middle Eastern operations
     - Streamlined workflow for updating translations as terminology evolves
   - Here's how we're implementing it:

   ```typescript
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   
   i18n
     .use(initReactI18next)
     .init({
       resources: {
         en: {
           navigation: { },
           weather: { },
           safety: { },
           units: { }
         },
         no: { },
       },
       lng: 'en',
       fallbackLng: 'en',
       interpolation: {
         escapeValue: false,
         format: (value, format, lng) => {
           if (format === 'knots' && lng === 'en') {
             return `${value} kn`;
           }
           return value;
         }
       }
     });
   
   function WeatherDisplay({ windSpeed }) {
     const { t } = useTranslation('weather');
     const { unitPreference } = useContext(UserPreferencesContext);
     
     return (
       <div>
         <h3>{t('weather.wind.title')}</h3>
         <p>{t('weather.wind.speed', { 
           value: formatWindSpeed(windSpeed, unitPreference),
           unit: t(`units.wind.${unitPreference}`)
         })}</p>
       </div>
     );
   }
   ```

## Feature Toggling Strategy

### Smart Feature Management for Marine Operations

1. **Flexible Feature Flag System**: Creating a system that allows us to control feature availability:
   - During development and deployment to control what makes it into each release
   - During active operations for gradual feature introduction without disrupting critical work
   - Based on crew roles and permissions to match features to responsibilities

2. **Centralized Configuration Control**:
   - Managing features from our shore-based servers to update vessel systems remotely
   - Allowing local overrides for testing in different marine environments
   - Building relationships between dependent features to ensure system stability

3. **Technical Implementation Details**:
   - Using React.lazy with Suspense to load feature code only when needed, saving bandwidth
   - Creating specialized hooks and components that check feature availability before rendering
   - Implementing a configuration provider to share feature status across the application

### Keeping the Crew's Experience in Mind

1. **Introducing New Capabilities**: Subtly highlighting new features without interrupting critical operations through unobtrusive notifications and guided tours during downtime.

2. **Maintaining System Reliability**: Designing the core system to function smoothly even when experimental features are disabled or encounter problems.

3. **Learning from Users**: Building feedback mechanisms directly into the interface so crew members can quickly report what works and what doesn't during actual operations.

## Real-Time Data Stream Handling

### Managing Live Data Flow in Maritime Operations

1. **Maintaining Constant Connections**: Using WebSockets or Socket.IO to create stable connections that deliver updates instantly, even with limited maritime connectivity.

2. **Smart Data Distribution with Pusher**: Implementing a publish-subscribe system where dashboard components receive only the specific data they need:
   - Setting up Pusher to handle various marine operational data streams:
     - Separate channels for different data types to optimize bandwidth (position data, engine telemetry, environmental conditions)
     - Encrypted private channels for sensitive operational information and commands
     - Presence channels that show which crew members are actively monitoring systems
     - Permission-based access to ensure data reaches only authorized personnel
   - Here's how we're implementing it:

   ```typescript
   function useRealTimeData() {
     const [vesselData, setVesselData] = useState({});
     const [weatherAlerts, setWeatherAlerts] = useState([]);
     const { vesselId } = useParams();
     
     useEffect(() => {
       const pusher = new Pusher('app-key', {
         cluster: 'eu',
         authEndpoint: '/api/pusher-auth',
         forceTLS: true
       });
       
       const vesselChannel = pusher.subscribe(`vessel-${vesselId}`);
       
       vesselChannel.bind('telemetry-update', (data) => {
         setVesselData(prevData => ({
           ...prevData,
           ...data,
           lastUpdated: new Date()
         }));
       });
       
       const weatherChannel = pusher.subscribe('weather-alerts');
       
       weatherChannel.bind('new-alert', (alert) => {
         if (isAlertRelevantToVessel(alert, vesselData.position)) {
           setWeatherAlerts(prevAlerts => [...prevAlerts, {
             ...alert,
             received: new Date(),
             acknowledged: false
           }]);
           
           if (alert.severity === 'critical') {
             triggerCriticalAlert(alert);
           }
         }
       });
       
       return () => {
         pusher.unsubscribe(`vessel-${vesselId}`);
         pusher.unsubscribe('weather-alerts');
       };
     }, [vesselId]);
     
     return { vesselData, weatherAlerts };
   }
   ```

3. **Processing Data for Operational Use**:
   - Processing raw data streams as they arrive from marine sensors and systems
   - Converting diverse data formats into a consistent structure for our application
   - Applying maritime-specific calculations and business rules to raw values
   - Intelligently updating only the affected parts of the interface

### Keeping the Interface Responsive and Informative

1. **Instant Feedback**: Showing changes immediately while waiting for confirmation, so operators don't experience delays during critical operations.

2. **Preventing Interface Overload**: Managing update frequency for rapidly changing data (like positioning or engine telemetry) to keep the interface smooth and responsive.

3. **Communicating Data Status Clearly**:
   - Showing precise timestamps for when each data point was last updated
   - Using subtle animations to draw attention to changing values without being distracting
   - Visually distinguishing between live sensor readings and historical or predicted values

4. **Handling Connectivity Challenges at Sea**:
   - Storing critical data locally during connection interruptions
   - Automatically reconnecting and synchronizing when communication is restored
   - Providing clear indicators of connection status so operators know when data might be stale

5. **Putting Data in Context**: Displaying trend lines and historical patterns alongside current readings to help operators spot anomalies and make better decisions.

By implementing these strategies, the Entail Marine Dashboard will provide crews with a reliable, responsive, and intuitive platform that works even in challenging maritime conditions. The system is designed to grow and adapt over time, accommodating new features and capabilities while maintaining the performance and accessibility that offshore operations demand.
