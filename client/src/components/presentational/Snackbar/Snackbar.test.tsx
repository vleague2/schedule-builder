import { render, fireEvent } from '@testing-library/react';

import { Snackbar } from './Snackbar';

describe(`<${Snackbar.name} />`, () => {
  it('calls the onClose function when the X button is clicked', () => {
    const mockClose = jest.fn();

    const { getByRole } = render(<Snackbar open={true} onClose={mockClose} />);

    const button = getByRole('button');

    expect(mockClose).toHaveBeenCalledTimes(0);

    fireEvent.click(button);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});