
import type { DSAPattern } from "./problem-types";

export function getPatternGuidance(pattern: DSAPattern): string {
  switch (pattern) {
    case "Sliding Window":
      return `
Sliding Window pattern guidance:
- Maintain a contiguous window using left and right indices.
- Expand or shrink the window according to the problem's conditions.
- Clearly define when the window is valid.
- Preserve the original problem's learning objective.
- Use this pattern only when the problem naturally supports it.
`;

    case "Two Pointers":
      return `
Two Pointers pattern guidance:
- Use two indices to traverse a sequence, often from opposite ends or at different speeds.
- Each pointer should move according to a clear condition.
- The movement of the pointers should help solve the problem efficiently.
- Do not force this pattern if the original problem does not reasonably support it.
- Preserve the original problem's core learning objective while creating a new problem.
`;
  }
}
