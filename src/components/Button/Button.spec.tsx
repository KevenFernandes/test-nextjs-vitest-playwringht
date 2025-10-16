import { render, screen } from '@testing-library/react';
import { Button } from '.';
import { userEvent } from '@testing-library/user-event';

const VARIANT_DEFAULT_CLASSES = 'bg-blue-600 hover:bg-blue-700 text-blue-100';
const VARIANT_DANGER_CLASSES = 'bg-red-600 hover:bg-red-700 text-red-100';
const VARIANT_GHOST_CLASSES = 'bg-slate-300 hover:bg-slate-400 text-slate-950';

const SIZE_SM_CLASSES =
  'text-xs/tight py-1 px-2 rounded-sm [&_svg]:w-3 [&_svg]:h-3 gap-1';
const SIZE_MD_CLASSES =
  'text-base/tight py-2 px-4 rounded-md [&_svg]:w-4 [&_svg]:h-4 gap-2';
const SIZE_LG_CLASSES =
  'text-lg/tight py-4 px-6 rounded-lg [&_svg]:w-5 [&_svg]:h-5 gap-3';

const DISABLED_CLASSES =
  'disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed';

describe('<Button />', () => {
  describe('props default and jsx', () => {
    test('Should render the button with props default (only children)', async () => {
      render(<Button>Testando botao</Button>);

      const button = screen.getByRole('button', { name: 'Testando botao' });

      expect(button).toHaveClass(VARIANT_DEFAULT_CLASSES);
      expect(button).toHaveClass(SIZE_MD_CLASSES);
    });

    test('Check if the default JXS properties work correctly', async () => {
      const handleClick = vi.fn();

      render(
        <Button onClick={handleClick} type='submit' aria-hidden='false'>
          Testando botão
        </Button>,
      );
      const button = screen.getByText('Testando botão');

      await userEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('Variants Classes', () => {
    test('Check if the DEFAULT color is correct.', () => {
      render(
        <Button variant='default' title='botao'>
          Testando botão
        </Button>,
      );
      const button = screen.getByTitle('botao');

      expect(button).toHaveClass(VARIANT_DEFAULT_CLASSES);
    });

    test('Check if the DANGER color is correct', () => {
      render(
        <Button variant='danger' title='botao'>
          Testando botão
        </Button>,
      );
      const button = screen.getByTitle('botao');

      expect(button).toHaveClass(VARIANT_DANGER_CLASSES);
    });

    test('Check if the GHOST color is correct', () => {
      render(
        <Button variant='ghost' title='botao'>
          Testando botão
        </Button>,
      );
      const button = screen.getByTitle('botao');

      expect(button).toHaveClass(VARIANT_GHOST_CLASSES);
    });
  });

  describe('Sizes Classes', () => {
    test('Check if the SMALL(SM) size is correct', () => {
      render(
        <Button size='sm' data-testid='testando getByTestId'>
          Testando botão
        </Button>,
      );
      const button = screen.getByTestId('testando getByTestId');

      expect(button).toHaveClass(SIZE_SM_CLASSES);
    });

    test('Check if the MEDIUM(MD) size is correct', () => {
      const { container } = render(
        <Button size='md' id='button1'>
          Testando botão
        </Button>,
      );
      const button = container.querySelector('#button1');

      expect(button).toHaveClass(SIZE_MD_CLASSES);
    });

    test('Check if the LARGER(LG) size is correct', () => {
      render(<Button size='lg'>Testando botão</Button>);
      const button = screen.getByRole('button', { name: 'Testando botão' });

      expect(button).toHaveClass(SIZE_LG_CLASSES);
    });
  });

  describe('Disabled', () => {
    test('Check button class desactived state are correct', () => {
      render(<Button disabled>Testando botão</Button>);

      const button = screen.getByRole('button', { name: 'Testando botão' });

      expect(button).toHaveClass(DISABLED_CLASSES);
      expect(button).toBeDisabled();
    });
  });
});
