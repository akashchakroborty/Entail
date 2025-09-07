import { Build, Engineering, Schedule, Storm } from "@mui/icons-material";
import type { ReactElement } from "react";
import { getTaskType } from "./taskUtils";

export const getTaskIcon = (taskName: string): ReactElement => {
  const taskType = getTaskType(taskName);

  switch (taskType) {
    case "STORM":
      return <Storm />;
    case "PREP":
      return <Engineering />;
    case "INSTALLATION":
      return <Build />;
    default:
      return <Schedule />;
  }
};
