import { render, screen } from '@testing-library/react';
import { InputText, InputTextProps } from '.';
import userEvent from '@testing-library/user-event';

type Props = Partial<InputTextProps>;

const makeInput = (p: Props = {}) => {
  return (
    <InputText
      labelText='label'
      placeholder='placeholder'
      type='text'
      disabled={false}
      readOnly={false}
      required={true}
      {...p}
    />
  );
};

const renderInput = (p?: Props) => {
  const renderResult = render(makeInput(p));
  const input = screen.getByRole('textbox');
  return { renderResult, input };
};

const input = (p?: Props) => {
  return renderInput(p).input;
};

describe('TextInput', () => {
  describe('Default behavior', () => {
    test('Should render with label', () => {
      const el = input({ labelText: 'new label' });
      const label = screen.getByText('new label');

      expect(el).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });
    test('Should render without label', () => {
      input({ labelText: undefined });
      const label = screen.queryByText('new label');

      expect(label).not.toBeInTheDocument();
    });

    test('Should render with placeholder', () => {
      const el = input({ placeholder: 'new placeholder' });
      expect(el).toHaveAttribute('placeholder', 'new placeholder');
    });
    test('Should render without placeholder', () => {
      const el = input({ placeholder: undefined });
      expect(el).not.toHaveAttribute('placeholder');
    });

    test('Uses labeltext as Aria-label when possible', () => {
      expect(input()).toHaveAttribute('aria-label', 'label');
    });
    test('Uses placeholderr as Aria-label fallback', () => {
      expect(input({ labelText: undefined })).toHaveAttribute(
        'aria-label',
        'placeholder',
      );
    });

    test('Should show default value correctly', () => {
      expect(input({ defaultValue: 'text' })).toHaveValue('text');
    });
    test('Should allows other props jsx (name, maxLength)', () => {
      const el = input({ name: 'name', maxLength: 10 });
      expect(el).toHaveAttribute('name', 'name');
      expect(el).toHaveAttribute('maxLength', '10');
    });
  });

  describe('Accessibility', () => {
    test('Does not display erro message by default', () => {
      const el = input();
      expect(el).toHaveAttribute('aria-invalid', 'false');
      expect(el).not.toHaveAttribute('aria-describedby');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    test('Does not mark the input invalid by default', () => {
      const el = input();
      expect(el).toHaveAttribute('aria-invalid', 'false');
    });
    test("Render error message when 'ErrorMessage' is passed", () => {
      const el = input({ errorMessage: 'error message' });
      const error = screen.getByRole('alert');
      const errorId = error.getAttribute('id');

      expect(el).toHaveAttribute('aria-invalid', 'true');
      expect(el).toHaveAttribute('aria-describedby', errorId);
      expect(error).toBeInTheDocument();
    });
  });

  describe('Interactive behavior', () => {
    test('Update the value as the user types', async () => {
      const user = userEvent.setup();
      const el = input();
      await user.type(el, 'new text');
      expect(el).toHaveValue('new text');
    });
  });

  describe('Visual States', () => {
    test('Add visual classes when disabled', () => {
      const el = input({ disabled: true });
      expect(el).toHaveClass('disabled:bg-slate-200 disabled:text-slate-400');
    });

    test('Add visual classes when readonly', () => {
      const el = input({ readOnly: true });
      expect(el).toHaveClass('read-only:bg-slate-100');
    });

    test('Add error classes (rind red) when invalid', () => {
      const el = input({ errorMessage: 'erro message' });
      expect(el).toHaveClass('ring-red-500 focus:ring-red-700');
    });

    test('Should keep personalized classes of the developer', () => {
      const el = input({ className: 'custom' });
      expect(el).toHaveClass('custom');
    });
  });
});
