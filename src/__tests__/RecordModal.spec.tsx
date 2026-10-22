import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RecordModal } from "../components/RecordModal";
import { createRecord } from "../utils/createRecord";
import { updateRecord } from "../utils/updateRecord";
import { Record } from "../domain/record";

jest.mock("../utils/supabaseClient");
jest.mock("../utils/createRecord");
jest.mock("../utils/updateRecord");

const mockedCreateRecord = createRecord as jest.MockedFunction<
  typeof createRecord
>;
const mockedUpdateRecord = updateRecord as jest.MockedFunction<
  typeof updateRecord
>;

describe("RecordModal(新規登録)", () => {
  const onClose = jest.fn();
  const onSaved = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderNew = () =>
    render(
      <RecordModal
        isOpen={true}
        onClose={onClose}
        record={null}
        onSaved={onSaved}
      />,
    );

  it("should have title '新規登録'", () => {
    renderNew();
    expect(screen.getByText("新規登録")).toBeInTheDocument();
  });

  it("should show error when title is empty", async () => {
    renderNew();
    fireEvent.click(screen.getByRole("button", { name: "登録" }));
    await waitFor(() => {
      expect(screen.getByText("内容の入力は必須です")).toBeInTheDocument();
    });
  });

  it("should show error when time is empty", async () => {
    renderNew();
    fireEvent.click(screen.getByRole("button", { name: "登録" }));
    await waitFor(() => {
      expect(screen.getByText("時間の入力は必須です")).toBeInTheDocument();
    });
  });

  it("should show error when time is negative", async () => {
    renderNew();
    fireEvent.change(screen.getByLabelText("学習記録"), {
      target: { value: "React入門" },
    });
    fireEvent.change(screen.getByLabelText("学習時間"), {
      target: { value: "-1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "登録" }));
    await waitFor(() => {
      expect(
        screen.getByText("時間は0以上である必要があります"),
      ).toBeInTheDocument();
    });
  });

  it("should register successfully with valid input", async () => {
    mockedCreateRecord.mockResolvedValue();
    renderNew();
    fireEvent.change(screen.getByLabelText("学習記録"), {
      target: { value: "React入門" },
    });
    fireEvent.change(screen.getByLabelText("学習時間"), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => {
      expect(mockedCreateRecord).toHaveBeenCalledWith({
        title: "React入門",
        time: 2,
      });
    });
    expect(mockedUpdateRecord).not.toHaveBeenCalled();
    expect(onSaved).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});

describe("RecordModal(編集)", () => {
  const onClose = jest.fn();
  const onSaved = jest.fn();
  const record = new Record("1", "React入門", 2);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have title '記録編集'", () => {
    render(
      <RecordModal
        isOpen={true}
        onClose={onClose}
        record={record}
        onSaved={onSaved}
      />,
    );
    expect(screen.getByText("記録編集")).toBeInTheDocument();
  });

  it("should show the values of the selected record", () => {
    render(
      <RecordModal
        isOpen={true}
        onClose={onClose}
        record={record}
        onSaved={onSaved}
      />,
    );
    expect((screen.getByLabelText("学習記録") as HTMLInputElement).value).toBe(
      "React入門",
    );
    expect((screen.getByLabelText("学習時間") as HTMLInputElement).value).toBe(
      "2",
    );
  });

  it("should change the values when another record is selected", () => {
    const { rerender } = render(
      <RecordModal
        isOpen={true}
        onClose={onClose}
        record={record}
        onSaved={onSaved}
      />,
    );
    rerender(
      <RecordModal
        isOpen={true}
        onClose={onClose}
        record={new Record("2", "TypeScript基礎", 5)}
        onSaved={onSaved}
      />,
    );
    expect((screen.getByLabelText("学習記録") as HTMLInputElement).value).toBe(
      "TypeScript基礎",
    );
    expect((screen.getByLabelText("学習時間") as HTMLInputElement).value).toBe(
      "5",
    );
  });

  it("should empty the form when switched to new registration", () => {
    const { rerender } = render(
      <RecordModal
        isOpen={true}
        onClose={onClose}
        record={record}
        onSaved={onSaved}
      />,
    );
    rerender(
      <RecordModal
        isOpen={true}
        onClose={onClose}
        record={null}
        onSaved={onSaved}
      />,
    );
    expect((screen.getByLabelText("学習記録") as HTMLInputElement).value).toBe(
      "",
    );
    expect((screen.getByLabelText("学習時間") as HTMLInputElement).value).toBe(
      "",
    );
  });

  it("should update the record when saved", async () => {
    mockedUpdateRecord.mockResolvedValue();
    render(
      <RecordModal
        isOpen={true}
        onClose={onClose}
        record={record}
        onSaved={onSaved}
      />,
    );
    fireEvent.change(screen.getByLabelText("学習時間"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => {
      expect(mockedUpdateRecord).toHaveBeenCalledWith({
        id: "1",
        title: "React入門",
        time: 10,
      });
    });
    expect(mockedCreateRecord).not.toHaveBeenCalled();
    expect(onSaved).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
