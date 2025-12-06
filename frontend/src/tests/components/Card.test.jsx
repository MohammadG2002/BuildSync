import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Card from "../../components/common/card/Card/Card";

describe("Card Component", () => {
  it("renders card with children", () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<Card title="Test Title">Content</Card>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders action when provided", () => {
    render(
      <Card title="Title" action={<button>Action</button>}>
        Content
      </Card>
    );
    expect(screen.getByRole("button", { name: /action/i })).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { container } = render(<Card onClick={handleClick}>Content</Card>);

    await user.click(container.firstChild);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass("custom-class");
  });

  it("applies dark mode styles", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass("dark:bg-gray-800");
  });

  it("does not render title section when no title or action", () => {
    const { container } = render(<Card>Content</Card>);
    const titleSection = container.querySelector(
      ".flex.items-center.justify-between"
    );
    expect(titleSection).not.toBeInTheDocument();
  });
});
