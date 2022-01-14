import { fireEvent, render, screen } from "@testing-library/react";
import { AddDialog, TAddDialogProps } from "./AddDialog";
import * as HttpContext from "../hooks/httpContext";

function getMockHttpContextService(props = {}) {
  return {
    httpPost: jest.fn(),
    httpDelete: jest.fn(),
    httpGet: jest.fn(),
    httpPatch: jest.fn(),
    httpDancersInDance: jest.fn(),
    authorizationToken: {
      accessToken: "",
      claims: {
        sub: "",
      },
      tokenType: "",
      userinfoUrl: "",
      expiresAt: 0,
      authorizeUrl: "",
      scopes: [],
    },
    defaultRequestParams: {},
  };
}

function getAddDialogProps(
  props: Partial<TAddDialogProps> = {}
): TAddDialogProps {
  return {
    open: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
    dialogType: "studio",
    teachers: [],
    ...props,
  };
}

describe(`<${AddDialog.name} />`, () => {
  beforeEach(() => {
    jest.spyOn(HttpContext, "useHttpContext").mockReturnValue({
      httpService: {
        ...getMockHttpContextService(),
      },
    });
  });

  describe("if dialog type is 'dance'", () => {
    it("does display a dropdown", () => {
      const { queryAllByRole } = render(
        <AddDialog
          {...getAddDialogProps({
            dialogType: "dance",
            teachers: [
              { name: "teacher1", id: 1 },
              { name: "teacher2", id: 2 },
            ],
          })}
        />
      );

      // MUI's Select component is a PITA to test because it's a popover, so this is the easiest way
      const inputs = queryAllByRole("textbox", { hidden: true });

      expect(inputs.length).toBe(2);
    });

    it("contains the teachers in the dropdown", () => {
      const { queryAllByRole } = render(
        <AddDialog
          {...getAddDialogProps({
            dialogType: "dance",
            teachers: [
              { name: "teacher1", id: 1 },
              { name: "teacher2", id: 2 },
            ],
          })}
        />
      );

      const buttons = queryAllByRole("button");

      const dropdownTriggerButton = buttons.find(
        (button) => button.getAttribute("aria-haspopup") === "listbox"
      ) as HTMLButtonElement;

      expect(dropdownTriggerButton).toBeTruthy();

      // MUI's Select only opens on mouseDown
      fireEvent.mouseDown(dropdownTriggerButton);

      // the dropdown is in a popover mounted outside of the dialog
      const dropdownOptions = screen.getAllByRole("option");

      expect(dropdownOptions.length).toBe(2);
    });

    it("clicking on a teacher changes the dropdown's value", () => {
      const { queryAllByRole } = render(
        <AddDialog
          {...getAddDialogProps({
            dialogType: "dance",
            teachers: [
              { name: "teacher1", id: 1 },
              { name: "teacher2", id: 2 },
            ],
          })}
        />
      );

      const buttons = queryAllByRole("button");

      const dropdownTriggerButton = buttons.find(
        (button) => button.getAttribute("aria-haspopup") === "listbox"
      ) as HTMLButtonElement;

      expect(dropdownTriggerButton).toBeTruthy();
      expect(dropdownTriggerButton.textContent).toBe("teacher1");

      // MUI's Select only opens on mouseDown
      fireEvent.mouseDown(dropdownTriggerButton);

      // the dropdown is in a popover mounted outside of the dialog
      const dropdownOptions = screen.getAllByRole("option");

      fireEvent.click(dropdownOptions[1]);

      expect(dropdownTriggerButton.textContent).toBe("teacher2");
    });

    it("enables the Save button if something is entered in the text area and there are teachers in the list", () => {
      const { getByRole } = render(
        <AddDialog
          {...getAddDialogProps({
            dialogType: "dance",
            teachers: [
              { name: "teacher1", id: 1 },
              { name: "teacher2", id: 2 },
            ],
          })}
        />
      );

      const saveButton = getByRole("button", { name: "Save" });

      expect(saveButton.getAttribute("disabled")).toBe("");

      const textField = getByRole("textbox");

      fireEvent.change(textField, { target: { value: "something" } });

      expect(saveButton.getAttribute("disabled")).toBe(null);
    });

    it("keeps the Save button disabled if something is entered in the text area but there are no teachers in the list", () => {
      const { getByRole } = render(
        <AddDialog
          {...getAddDialogProps({
            dialogType: "dance",
          })}
        />
      );

      const saveButton = getByRole("button", { name: "Save" });

      expect(saveButton.getAttribute("disabled")).toBe("");

      const textField = getByRole("textbox");

      fireEvent.change(textField, { target: { value: "something" } });

      expect(saveButton.getAttribute("disabled")).toBe("");
    });
  });

  describe("if the dialog type is not 'dance'", () => {
    it.each(["studio" as const, "teacher" as const, "dancer" as const])(
      "does not display a dropdown if dialog type is '%s'",
      (dialogType: TAddDialogProps["dialogType"]) => {
        const { queryAllByRole } = render(
          <AddDialog {...getAddDialogProps({ dialogType })} />
        );

        const inputs = queryAllByRole("textbox", { hidden: true });

        expect(inputs.length).toBe(1);
      }
    );

    it("disables the Save button if nothing is entered in the text area", () => {
      const { getByRole } = render(<AddDialog {...getAddDialogProps()} />);

      const saveButton = getByRole("button", { name: "Save" });

      expect(saveButton.getAttribute("disabled")).toBe("");
    });

    it("enables the Save button if something is entered in the text area", () => {
      const { getByRole } = render(<AddDialog {...getAddDialogProps()} />);

      const saveButton = getByRole("button", { name: "Save" });

      expect(saveButton.getAttribute("disabled")).toBe("");

      const textField = getByRole("textbox");

      fireEvent.change(textField, { target: { value: "something" } });

      expect(saveButton.getAttribute("disabled")).toBe(null);
    });
  });

  describe.only("clicking Save", () => {
    it.each([
      "studio" as const,
      // "teacher" as const,
      // "dancer" as const,
      // "dance" as const,
    ])(
      "when dialogType is '%s', it calls httpPost with the correct route ",
      async (dialogType: TAddDialogProps["dialogType"]) => {
        const mockHttpPost = jest.fn().mockResolvedValue({ error: null, data: []});

        jest.spyOn(HttpContext, "useHttpContext").mockReturnValue({
          httpService: {
            ...getMockHttpContextService({ httpPost: mockHttpPost }),
          },
        });

        const { getByRole } = render(
          <AddDialog
            {...getAddDialogProps({
              dialogType,
              teachers: [
                { name: "teacher1", id: 1 },
                { name: "teacher2", id: 2 },
              ],
            })}
          />
        );

        // enable the save button
        const textField = getByRole("textbox");
        fireEvent.change(textField, { target: { value: "something" } });

        const saveButton = getByRole("button", { name: "Save" });

        expect(mockHttpPost).toHaveBeenCalledTimes(0);

        fireEvent.click(saveButton);

        await waitFor(() => {
          expect(mockHttpPost).toHaveBeenCalledTimes(1);
        });
      }
    );
  });
});
