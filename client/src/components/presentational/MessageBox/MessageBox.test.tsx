import { render } from "@testing-library/react";

import { MessageBox } from "./MessageBox";

describe(`<${MessageBox.name} />`, () => {
  it("displays the type of message in the text", () => {
    const style = "error";

    const { getByText } = render(<MessageBox style={style} messages={[]} />);

    const typeText = getByText("Error:");

    expect(typeText).toBeTruthy();
  });

  it("displays the provided messages in a list", () => {
    const messages = ["1", "2", "3"];
    const { getAllByRole } = render(
      <MessageBox style="warning" messages={messages} />
    );

    const messageListItems = getAllByRole("listitem");

    expect(messageListItems.length).toBe(messages.length);
  });

  it.each`
    type         | expectedIcon
    ${"error"}   | ${"errorIcon"}
    ${"success"} | ${"warningIcon"}
    ${"warning"} | ${"warningIcon"}
  `("when the message is the '$type' type, it uses the $expectedIcon", ({ type, expectedIcon }) => {
    const { getByTestId } = render(
      <MessageBox style={type} messages={[]} />
    );

    const icon = getByTestId(expectedIcon);

    expect(icon).toBeTruthy();
  });
});
