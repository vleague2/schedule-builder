import { render, fireEvent } from '@testing-library/react';
import { Dialog, TDialogProps } from './Dialog';

function getDialogProps(props: Partial<TDialogProps> = {}): TDialogProps {
  return {
    open: true,
    onClose: jest.fn(),
    dialogTitle: 'test',
    primaryButtonOnClick: jest.fn(),
    primaryButtonLabel: 'button',
    primaryButtonDisabled: false,
    ...props,
  }
}

describe(`<${Dialog.name} />`, () => {
  it('displays the given dialog title', () => {
    const titleText = 'dialog title text';
    const { getByText } = render(<Dialog {...getDialogProps({ dialogTitle: titleText })} />);

    const dialogTitle = getByText(titleText);

    expect(dialogTitle).toBeTruthy();
  });

  it('displays the provided children', () => {
    const childrenText = 'hi';
    const children = <div>{childrenText}</div>;

    const { getByText } = render(<Dialog {...getDialogProps()}>{children}</Dialog>);

    const childrenContent = getByText(childrenText);

    expect(childrenContent).toBeTruthy();
  });

  it('calls the provided primary onclick when the primary button is clicked', () => {
    const mockClick = jest.fn();
    const buttonLabel = 'button label';

    const { getByRole } = render(<Dialog {...getDialogProps({ primaryButtonOnClick: mockClick, primaryButtonLabel: buttonLabel })} />);

    const primaryButton = getByRole('button', { name: buttonLabel });

    expect(primaryButton).toBeTruthy();
    expect(mockClick).toHaveBeenCalledTimes(0);

    fireEvent.click(primaryButton);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('calls the provided close onclick when the cancel button is clicked', () => {
    const mockClick = jest.fn();
    const buttonLabel = 'Cancel';

    const { getByRole } = render(<Dialog {...getDialogProps({ onClose: mockClick })} />);

    const cancelButton = getByRole('button', { name: buttonLabel });

    expect(cancelButton).toBeTruthy();
    expect(mockClick).toHaveBeenCalledTimes(0);

    fireEvent.click(cancelButton);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});