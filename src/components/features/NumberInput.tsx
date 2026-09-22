import type { InputHTMLAttributes } from 'react';

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number | '';
  onChange: (value: number | '') => void;
}

/**
 * Number field that can be fully cleared (no stuck "0"), selects its content on focus
 * and never changes value on mouse-wheel scroll.
 */
export default function NumberInput({ value, onChange, className = '', ...rest }: NumberInputProps) {
  return (
    <input
      {...rest}
      type="number"
      inputMode="numeric"
      value={value}
      onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      onFocus={e => { e.target.select(); rest.onFocus?.(e); }}
      onWheel={e => (e.target as HTMLInputElement).blur()}
      className={className}
    />
  );
}
