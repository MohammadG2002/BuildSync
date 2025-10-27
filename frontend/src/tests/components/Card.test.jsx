import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Card from "../../components/common/Card";

describe("Card Component", () => {
  it("renders card with children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<Card title="Test Title">Content</Card>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <Card title="Title" subtitle="Test Subtitle">
        Content
      </Card>
    );
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });

  it("renders header actions when provided", () => {
    const actions = <button>Action</button>;
    render(
      <Card title="Title" headerActions={actions}>
        Content
      </Card>
    );
    expect(screen.getByRole("button", { name: /action/i })).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    const footer = <div>Footer content</div>;
    render(<Card footer={footer}>Content</Card>);
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies hover effect when hoverable prop is true", () => {
    const { container } = render(<Card hoverable>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass("hover:shadow-lg");
  });

  it("applies clickable styles when onClick is provided", () => {
    const handleClick = vi.fn();
    const { container } = render(<Card onClick={handleClick}>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass("cursor-pointer");
  });

  it("calls onClick handler when clicked", async () => {
    const handleClick = vi.fn();
    const { container, user } = render(
      <Card onClick={handleClick}>Content</Card>
    );

    await user.click(container.firstChild);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("removes padding when noPadding prop is true", () => {
    const { container } = render(<Card noPadding>Content</Card>);
    const cardBody = container.querySelector(".p-6");
    expect(cardBody).not.toBeInTheDocument();
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

  it("shows loading state when loading prop is true", () => {
    render(<Card loading>Content</Card>);
    // Should render skeleton loader
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });
});
