import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

(globalThis as any).console.warn = vi.fn();
(globalThis as any).console.error = vi.fn();
