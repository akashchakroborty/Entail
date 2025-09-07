import Task1Image from "src/assets/Task1.png";
import Task2Image from "src/assets/Task2.png";
import Task3Image from "src/assets/Task3.png";

export function getTaskImage(taskName: string): string | null {
  if (taskName === "INSTALLATION TASK 1") {
    return Task1Image;
  } else if (taskName === "INSTALLATION TASK 2") {
    return Task2Image;
  } else if (taskName === "INSTALLATION TASK 3") {
    return Task3Image;
  }
  return null;
}
