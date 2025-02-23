import type { ACTTestSuite } from "./act-test-runner"
import { getAccessibleName, getUniqueSelector } from "./act-test-runner"

export const headingTests: ACTTestSuite = {
  name: "Heading Structure",
  description: "Tests for proper heading structure and hierarchy",
  applicability: "h1, h2, h3, h4, h5, h6, [role='heading'][aria-level]",
  testCases: [
    {
      id: "heading-accessible-name",
      description: "Headings must have an accessible name",
      evaluate: (element: HTMLElement) => {
        const accessibleName = getAccessibleName(element)
        const level = element.getAttribute("aria-level")
          ? parseInt(element.getAttribute("aria-level")!, 10)
          : parseInt(element.tagName.charAt(1), 10)
        return {
          passed: !!accessibleName,
          message: accessibleName
            ? `Level ${level} heading has accessible name`
            : `Level ${level} heading is empty`
        }
      }
    },
    {
      id: "heading-first-level",
      description: "First heading must be h1",
      evaluate: (element: HTMLElement) => {
        const level = element.getAttribute("aria-level")
          ? parseInt(element.getAttribute("aria-level")!, 10)
          : parseInt(element.tagName.charAt(1), 10)

        // Find all headings in the document
        const allHeadings = Array.from(
          document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='heading']")
        )

        // Check if this is the first heading
        const isFirstHeading = allHeadings[0] === element

        if (!isFirstHeading) {
          return {
            passed: true,
            message: `Level ${level} heading is not the first heading`
          }
        }

        return {
          passed: level === 1,
          message:
            level === 1
              ? "Document starts with h1 heading"
              : `Document starts with h${level} - should start with h1`
        }
      }
    },
    {
      id: "heading-hierarchy",
      description: "Heading levels should only increase by one",
      evaluate: (element: HTMLElement) => {
        const currentLevel = element.getAttribute("aria-level")
          ? parseInt(element.getAttribute("aria-level")!, 10)
          : parseInt(element.tagName.charAt(1), 10)

        // Find all headings in the document
        const allHeadings = Array.from(
          document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='heading']")
        ) as HTMLElement[]

        // Find the index of the current heading
        const currentIndex = allHeadings.indexOf(element)
        if (currentIndex === 0) {
          // First heading is handled by heading-first-level test
          return {
            passed: true,
            message: `Level ${currentLevel} heading starts document`
          }
        }

        // Get the previous heading's level
        const previousHeading = allHeadings[currentIndex - 1]
        const previousLevel = previousHeading.getAttribute("aria-level")
          ? parseInt(previousHeading.getAttribute("aria-level")!, 10)
          : parseInt(previousHeading.tagName.charAt(1), 10)

        // Check if the heading level increase is valid
        // Valid cases:
        // 1. Same level as previous (h1 -> h1)
        // 2. One level deeper than previous (h1 -> h2)
        // 3. Any number of levels back up (h3 -> h1)
        const isValid = currentLevel <= previousLevel + 1

        return {
          passed: isValid,
          message: isValid
            ? `Level ${currentLevel} heading follows h${previousLevel} correctly`
            : `Invalid heading structure: h${previousLevel} is followed by h${currentLevel} - can only increase by one level`
        }
      }
    }
  ]
}
