export interface WeatherForecast {
  location: {
    lat: number;
    lon: number;
  };
  forecast: WeatherDataPoint[];
}

export interface WeatherDataPoint {
  timestamp: string;
  wave_period: number;
  wave_height: number;
}

export interface Vessel {
  id: string;
  name: string;
}

export interface WeatherLimits {
  Hs: number;
  Tp: [number, number];
}

export interface Task {
  id: string;
  name: string;
  level: number;
  parentId: string;
  startDate: string;
  endDate: string;
  duration: number;
  weatherLimits: WeatherLimits;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    waterDepth: number;
    region: string;
  };
  startDate: string;
  endDate: string;
  projectManager: string;
  marineCoordinator: string;
  version: string;
  tasks: Task[];
}

export interface ProjectData {
  metadata: {
    title: string;
    generated: string;
    version: string;
  };
  vessels: Vessel[];
  projects: Project[];
}

export interface GoNoGoStatus {
  canProceed: boolean;
  reason: string;
  taskId: string;
  timestamp: string;
}
