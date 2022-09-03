import { render, fireEvent, screen } from "@testing-library/react";

import { Dropdown } from "./Dropdown";

describe(`<${Dropdown.name} />`, () => {
  it("renders the provided options", () => {
    const { getByRole } = render(
      <Dropdown
        label="test"
        value="1"
        dropdownItems={[
          {
            value: "1",
            label: "1",
          },
          {
            value: "2",
            label: "2",
          },
        ]}
        setValue={jest.fn()}
      />
    );

    const dropdownTriggerButton = getByRole('button');

    // MUI's Select only opens on mouseDown
    fireEvent.mouseDown(dropdownTriggerButton);

    // the dropdown is in a popover
    const dropdownOptions = screen.getAllByRole("option");

    expect(dropdownOptions.length).toBe(2);
  });

  it("calls the provided setValue when the dropdown value changes", () => {
    const mockSetValue = jest.fn();

    const { getByRole } = render(
      <Dropdown
        label="test"
        value="1"
        dropdownItems={[
          {
            value: "1",
            label: "1",
          },
          {
            value: "2",
            label: "2",
          },
        ]}
        setValue={mockSetValue}
      />
    );

    const dropdownTriggerButton = getByRole('button');

    // MUI's Select only opens on mouseDown
    fireEvent.mouseDown(dropdownTriggerButton);

    // the dropdown is in a popover
    const dropdownOptions = screen.getAllByRole("option");

    expect(mockSetValue).toHaveBeenCalledTimes(0);

    fireEvent.click(dropdownOptions[1]);

    expect(mockSetValue).toHaveBeenCalledTimes(1);
  });
});
