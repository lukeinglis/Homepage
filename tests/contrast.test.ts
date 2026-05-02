import { describe, it, expect } from "vitest";
import { contrastRatio } from "../src/lib/contrast";
import monday from "../src/config/days/monday";
import tuesday from "../src/config/days/tuesday";
import wednesday from "../src/config/days/wednesday";
import thursday from "../src/config/days/thursday";
import friday from "../src/config/days/friday";
import saturday from "../src/config/days/saturday";
import sunday from "../src/config/days/sunday";
import type { DayConfig } from "../src/config/types";

const allConfigs: DayConfig[] = [
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
];

describe("WCAG AA contrast validation", () => {
  for (const config of allConfigs) {
    describe(config.name, () => {
      const { theme } = config;

      it("text on background passes AA (4.5:1)", () => {
        const ratio = contrastRatio(theme.text, theme.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it("text on surface passes AA (4.5:1)", () => {
        const ratio = contrastRatio(theme.text, theme.surface);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it("primary on background passes AA large text (3:1)", () => {
        const ratio = contrastRatio(theme.primary, theme.background);
        expect(ratio).toBeGreaterThanOrEqual(3);
      });

      it("primary on surface passes AA large text (3:1)", () => {
        const ratio = contrastRatio(theme.primary, theme.surface);
        expect(ratio).toBeGreaterThanOrEqual(3);
      });

      it("secondary on surface passes AA (4.5:1)", () => {
        const ratio = contrastRatio(theme.secondary, theme.surface);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it("secondary on background passes AA (4.5:1)", () => {
        const ratio = contrastRatio(theme.secondary, theme.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it("text on accent passes AA (4.5:1) for hover states", () => {
        const ratio = contrastRatio(theme.text, theme.accent);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });
  }
});
