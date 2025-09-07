import type { ProjectData, Vessel, WeatherForecast } from "src/types";

export const mockVessels: Vessel[] = [
  {
    id: "V001",
    name: "Pioneering Spirit",
  },
];

export const mockWeatherForecast: WeatherForecast = {
  location: {
    lat: 61.5,
    lon: 4.8,
  },
  
  forecast: [
    
    {
      timestamp: "2025-08-24T00:00:00Z",
      wave_period: 8.5,
      wave_height: 2.1,
    },
    {
      timestamp: "2025-08-24T06:00:00Z",
      wave_period: 9.2,
      wave_height: 2.3,
    },
    {
      timestamp: "2025-08-24T12:00:00Z",
      wave_period: 10.1,
      wave_height: 2.8,
    },
    {
      timestamp: "2025-08-24T18:00:00Z",
      wave_period: 11.2,
      wave_height: 3.1,
    },
    
    {
      timestamp: "2025-08-25T00:00:00Z",
      wave_period: 12.1,
      wave_height: 3.4,
    },
    {
      timestamp: "2025-08-25T06:00:00Z",
      wave_period: 11.8,
      wave_height: 3.0,
    },
    {
      timestamp: "2025-08-25T12:00:00Z",
      wave_period: 10.5,
      wave_height: 2.7,
    },
    {
      timestamp: "2025-08-25T18:00:00Z",
      wave_period: 9.8,
      wave_height: 2.4,
    },
    
    {
      timestamp: "2025-08-26T00:00:00Z",
      wave_period: 9.2,
      wave_height: 2.2,
    },
    {
      timestamp: "2025-08-26T06:00:00Z",
      wave_period: 8.8,
      wave_height: 2.0,
    },
    {
      timestamp: "2025-08-26T12:00:00Z",
      wave_period: 8.1,
      wave_height: 1.8,
    },
    {
      timestamp: "2025-08-26T18:00:00Z",
      wave_period: 7.9,
      wave_height: 1.6,
    },
    
    {
      timestamp: "2025-08-27T00:00:00Z",
      wave_period: 7.5,
      wave_height: 1.4,
    },
    {
      timestamp: "2025-08-27T06:00:00Z",
      wave_period: 7.2,
      wave_height: 1.6,
    },
    {
      timestamp: "2025-08-27T12:00:00Z",
      wave_period: 6.8,
      wave_height: 1.8,
    },
    {
      timestamp: "2025-08-27T18:00:00Z",
      wave_period: 6.5,
      wave_height: 2.0,
    },
    
    {
      timestamp: "2025-08-28T00:00:00Z",
      wave_period: 7.0,
      wave_height: 2.2,
    },
    {
      timestamp: "2025-08-28T06:00:00Z",
      wave_period: 7.5,
      wave_height: 2.4,
    },
    {
      timestamp: "2025-08-28T12:00:00Z",
      wave_period: 8.2,
      wave_height: 2.7,
    },
    {
      timestamp: "2025-08-28T18:00:00Z",
      wave_period: 8.8,
      wave_height: 2.9, 
    },
    
    {
      timestamp: "2025-08-29T00:00:00Z",
      wave_period: 9.2,
      wave_height: 2.6,
    },
    {
      timestamp: "2025-08-29T06:00:00Z",
      wave_period: 9.8,
      wave_height: 2.3,
    },
    {
      timestamp: "2025-08-29T12:00:00Z",
      wave_period: 10.1,
      wave_height: 2.1,
    },
    {
      timestamp: "2025-08-29T18:00:00Z",
      wave_period: 10.5,
      wave_height: 1.9,
    },
    
    {
      timestamp: "2025-08-30T00:00:00Z",
      wave_period: 11.0,
      wave_height: 1.7,
    },
    {
      timestamp: "2025-08-30T06:00:00Z",
      wave_period: 11.5,
      wave_height: 1.5,
    },
    {
      timestamp: "2025-08-30T12:00:00Z",
      wave_period: 12.0,
      wave_height: 1.3,
    },
    {
      timestamp: "2025-08-30T18:00:00Z",
      wave_period: 12.5,
      wave_height: 1.1,
    },
    
    {
      timestamp: "2025-08-31T00:00:00Z",
      wave_period: 13.0,
      wave_height: 1.0,
    },
    {
      timestamp: "2025-08-31T06:00:00Z",
      wave_period: 13.2,
      wave_height: 1.2,
    },
    {
      timestamp: "2025-08-31T12:00:00Z",
      wave_period: 13.8,
      wave_height: 1.4,
    },
    {
      timestamp: "2025-08-31T18:00:00Z",
      wave_period: 14.1,
      wave_height: 1.6,
    },
    
    {
      timestamp: "2025-09-01T00:00:00Z",
      wave_period: 14.5,
      wave_height: 1.8, 
    },
    {
      timestamp: "2025-09-01T06:00:00Z",
      wave_period: 14.8,
      wave_height: 1.9, 
    },
    {
      timestamp: "2025-09-01T12:00:00Z",
      wave_period: 15.0,
      wave_height: 2.0, 
    },
    {
      timestamp: "2025-09-01T18:00:00Z",
      wave_period: 14.7,
      wave_height: 2.1, 
    },
    
    {
      timestamp: "2025-09-02T00:00:00Z",
      wave_period: 14.2,
      wave_height: 2.2, 
    },
    {
      timestamp: "2025-09-02T06:00:00Z",
      wave_period: 13.8,
      wave_height: 2.0, 
    },
    {
      timestamp: "2025-09-02T12:00:00Z",
      wave_period: 13.2,
      wave_height: 1.8, 
    },
    {
      timestamp: "2025-09-02T18:00:00Z",
      wave_period: 12.8,
      wave_height: 1.6,
    },
    
    {
      timestamp: "2025-09-03T00:00:00Z",
      wave_period: 12.5,
      wave_height: 1.4,
    },
    {
      timestamp: "2025-09-03T06:00:00Z",
      wave_period: 12.0,
      wave_height: 1.2,
    },
    {
      timestamp: "2025-09-03T12:00:00Z",
      wave_period: 11.5,
      wave_height: 1.0,
    },
    {
      timestamp: "2025-09-03T18:00:00Z",
      wave_period: 11.0,
      wave_height: 0.9,
    },
    
    {
      timestamp: "2025-09-04T00:00:00Z",
      wave_period: 10.8,
      wave_height: 1.1,
    },
    {
      timestamp: "2025-09-04T06:00:00Z",
      wave_period: 10.5,
      wave_height: 1.3,
    },
    {
      timestamp: "2025-09-04T12:00:00Z",
      wave_period: 10.2,
      wave_height: 1.5,
    },
    {
      timestamp: "2025-09-04T18:00:00Z",
      wave_period: 9.8,
      wave_height: 1.7,
    },
    
    {
      timestamp: "2025-09-05T00:00:00Z",
      wave_period: 9.5,
      wave_height: 1.9, 
    },
    {
      timestamp: "2025-09-05T06:00:00Z",
      wave_period: 9.2,
      wave_height: 2.0, 
    },
    {
      timestamp: "2025-09-05T12:00:00Z",
      wave_period: 9.0,
      wave_height: 2.1, 
    },
    {
      timestamp: "2025-09-05T18:00:00Z",
      wave_period: 8.8,
      wave_height: 2.3, 
    },
    
    {
      timestamp: "2025-09-06T00:00:00Z",
      wave_period: 8.5,
      wave_height: 2.5, 
    },
    {
      timestamp: "2025-09-06T06:00:00Z",
      wave_period: 8.2,
      wave_height: 2.6, 
    },
    {
      timestamp: "2025-09-06T12:00:00Z",
      wave_period: 8.0,
      wave_height: 2.4, 
    },
    {
      timestamp: "2025-09-06T18:00:00Z",
      wave_period: 7.8,
      wave_height: 2.2, 
    },
    
    {
      timestamp: "2025-09-07T00:00:00Z",
      wave_period: 7.5,
      wave_height: 2.0, 
    },
    {
      timestamp: "2025-09-07T06:00:00Z",
      wave_period: 7.2,
      wave_height: 1.8, 
    },
    {
      timestamp: "2025-09-07T12:00:00Z",
      wave_period: 7.0,
      wave_height: 1.6,
    },
    {
      timestamp: "2025-09-07T18:00:00Z",
      wave_period: 6.8,
      wave_height: 1.4,
    },
    
    {
      timestamp: "2025-09-08T00:00:00Z",
      wave_period: 6.5,
      wave_height: 1.2,
    },
    {
      timestamp: "2025-09-08T06:00:00Z",
      wave_period: 6.2,
      wave_height: 1.0,
    },
    {
      timestamp: "2025-09-08T12:00:00Z",
      wave_period: 6.0,
      wave_height: 0.9,
    },
    {
      timestamp: "2025-09-08T18:00:00Z",
      wave_period: 5.8,
      wave_height: 1.1,
    },
    
    {
      timestamp: "2025-09-09T00:00:00Z",
      wave_period: 5.5,
      wave_height: 1.3,
    },
    {
      timestamp: "2025-09-09T06:00:00Z",
      wave_period: 5.3,
      wave_height: 1.5,
    },
    {
      timestamp: "2025-09-09T12:00:00Z",
      wave_period: 5.0,
      wave_height: 1.7,
    },
    {
      timestamp: "2025-09-09T18:00:00Z",
      wave_period: 4.8,
      wave_height: 1.9,
    },
    
    {
      timestamp: "2025-09-10T00:00:00Z",
      wave_period: 4.5,
      wave_height: 2.1, 
    },
    {
      timestamp: "2025-09-10T06:00:00Z",
      wave_period: 4.3,
      wave_height: 1.8, 
    },
    {
      timestamp: "2025-09-10T12:00:00Z",
      wave_period: 4.0,
      wave_height: 1.6, 
    },
    {
      timestamp: "2025-09-10T18:00:00Z",
      wave_period: 3.8,
      wave_height: 1.4, 
    },
    
    {
      timestamp: "2025-09-11T00:00:00Z",
      wave_period: 3.5,
      wave_height: 1.2,
    },
    {
      timestamp: "2025-09-11T06:00:00Z",
      wave_period: 3.3,
      wave_height: 1.0,
    },
    {
      timestamp: "2025-09-11T12:00:00Z",
      wave_period: 3.0,
      wave_height: 0.9,
    },
    {
      timestamp: "2025-09-11T18:00:00Z",
      wave_period: 2.8,
      wave_height: 1.1,
    },
    
    {
      timestamp: "2025-09-12T00:00:00Z",
      wave_period: 2.5,
      wave_height: 1.3,
    },
    {
      timestamp: "2025-09-12T06:00:00Z",
      wave_period: 2.3,
      wave_height: 1.4, 
    },
    {
      timestamp: "2025-09-12T12:00:00Z",
      wave_period: 2.0,
      wave_height: 1.5, 
    },
    {
      timestamp: "2025-09-12T18:00:00Z",
      wave_period: 1.8,
      wave_height: 1.3,
    },
    
    {
      timestamp: "2025-09-13T00:00:00Z",
      wave_period: 1.5,
      wave_height: 1.1,
    },
    {
      timestamp: "2025-09-13T06:00:00Z",
      wave_period: 1.3,
      wave_height: 1.3,
    },
    {
      timestamp: "2025-09-13T12:00:00Z",
      wave_period: 1.0,
      wave_height: 1.5,
    },
    {
      timestamp: "2025-09-13T18:00:00Z",
      wave_period: 0.8,
      wave_height: 1.7,
    },
    
    {
      timestamp: "2025-09-14T00:00:00Z",
      wave_period: 0.5,
      wave_height: 1.9,
    },
    {
      timestamp: "2025-09-14T06:00:00Z",
      wave_period: 0.3,
      wave_height: 2.1,
    },
    {
      timestamp: "2025-09-14T12:00:00Z",
      wave_period: 0.2,
      wave_height: 2.3,
    },
    {
      timestamp: "2025-09-14T18:00:00Z",
      wave_period: 0.1,
      wave_height: 2.4, 
    },
    
    {
      timestamp: "2025-09-15T00:00:00Z",
      wave_period: 0.1,
      wave_height: 2.2,
    },
    {
      timestamp: "2025-09-15T06:00:00Z",
      wave_period: 0.2,
      wave_height: 2.0,
    },
    {
      timestamp: "2025-09-15T12:00:00Z",
      wave_period: 0.3,
      wave_height: 1.8,
    },
    {
      timestamp: "2025-09-15T18:00:00Z",
      wave_period: 0.5,
      wave_height: 1.6,
    },
  ],
};

export const mockProjectData: ProjectData = {
  metadata: {
    title: "Offshore Project Schedule",
    generated: "2024-08-31",
    version: "1.0",
  },
  vessels: [
    {
      id: "pioneering-spirit",
      name: "Pioneering Spirit",
    },
  ],
  projects: [
    {
      id: "1",
      name: "Riser Replacement",
      description: "Riser Replacement at offshore oil platform",
      location: {
        name: "North Sea",
        coordinates: {
          lat: 61.5,
          lng: 4.8,
        },
        waterDepth: 400,
        region: "North Sea",
      },
      startDate: "2025-08-24",
      endDate: "2025-09-15",
      projectManager: "Emma Thompson",
      marineCoordinator: "Lars Andersen",
      version: "v1.3",
      tasks: [
        {
          id: "wf-strm-001",
          name: "STORM RIDING",
          level: 1,
          parentId: "wf-001",
          startDate: "2025-08-24",
          endDate: "2025-08-26",
          duration: 2,
          weatherLimits: {
            Hs: 6.0,
            Tp: [5, 15],
          },
        },
        {
          id: "wf-prep-001",
          name: "PREP WORK",
          level: 1,
          parentId: "wf-001",
          startDate: "2025-08-27",
          endDate: "2025-08-29",
          duration: 2,
          weatherLimits: {
            Hs: 3.0,
            Tp: [5, 15],
          },
        },
        {
          id: "wf-inst-001",
          name: "INSTALLATION TASK 1",
          level: 1,
          parentId: "wf-001",
          startDate: "2025-08-30",
          endDate: "2025-09-02",
          duration: 4,
          weatherLimits: {
            Hs: 2.0,
            Tp: [5, 15],
          },
        },
        {
          id: "wf-inst-002",
          name: "INSTALLATION TASK 2",
          level: 1,
          parentId: "wf-001",
          startDate: "2025-09-03",
          endDate: "2025-09-07",
          duration: 4,
          weatherLimits: {
            Hs: 2.0,
            Tp: [5, 15],
          },
        },
        {
          id: "wf-strm-002",
          name: "STORM RIDING",
          level: 1,
          parentId: "wf-001",
          startDate: "2025-09-08",
          endDate: "2025-09-09",
          duration: 1,
          weatherLimits: {
            Hs: 6.0,
            Tp: [5, 15],
          },
        },
        {
          id: "wf-inst-003",
          name: "INSTALLATION TASK 3",
          level: 1,
          parentId: "wf-001",
          startDate: "2025-09-10",
          endDate: "2025-09-12",
          duration: 2,
          weatherLimits: {
            Hs: 1.5,
            Tp: [5, 15],
          },
        },
        {
          id: "wf-inst-004",
          name: "INSTALLATION TASK 4",
          level: 1,
          parentId: "wf-001",
          startDate: "2025-09-13",
          endDate: "2025-09-14",
          duration: 1,
          weatherLimits: {
            Hs: 3.5,
            Tp: [5, 15],
          },
        },
        {
          id: "wf-inst-005",
          name: "INSTALLATION TASK 5",
          level: 1,
          parentId: "wf-001",
          startDate: "2025-09-14",
          endDate: "2025-09-15",
          duration: 1,
          weatherLimits: {
            Hs: 2.5,
            Tp: [5, 15],
          },
        },
      ],
    },
  ],
};
