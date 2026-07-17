import { add } from "../utils/add";

describe("add", () => {
  it("adds two positive numbers", () => {
    expect(add(1, 2)).toBe(3);
  });

  it("adds a positive and a negative number", () => {
    expect(add(5, -3)).toBe(2);
  });

  it("adds two negative numbers", () => {
    expect(add(-2, -3)).toBe(-5);
  });
});
