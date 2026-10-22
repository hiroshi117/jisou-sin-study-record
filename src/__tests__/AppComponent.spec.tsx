import { App } from "../App";
import { render, waitFor } from "@testing-library/react";

jest.mock("../utils/supabaseClient");
jest.mock("../utils/fetchRecords", () => ({
  fetchRecords: jest.fn().mockResolvedValue([]),
}));

describe("title", () => {
  it("should render title", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      expect(getByText("シン学習記録一覧アプリ")).toBeInTheDocument();
    });
  });
});
