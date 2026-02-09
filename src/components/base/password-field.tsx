import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@components/base/field';
import { Input } from '@components/base/input';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Button } from './button';
import { Eye, EyeOff } from 'lucide-react';
import { ButtonGroup } from './button-group';

interface PasswordFieldProps extends React.ComponentProps<typeof Input> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  description?: string;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, icon, error, description, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleToggle = () => {
      toggleShowPassword();
      inputRef.current?.focus();
    };

    return (
      <Field className={className}>
        {label && (
          <FieldLabel>
            {icon}
            {label}
          </FieldLabel>
        )}

        {description && <FieldDescription>{description}</FieldDescription>}

        <ButtonGroup className='w-full'>
          <Input
            ref={inputRef}
            type={showPassword ? 'text' : 'password'}
            aria-invalid={!!error}
            {...props}
          />
          <Button
            onClick={handleToggle}
            type='button'
            variant='secondary'
            size='icon'
            tabIndex={-1}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </ButtonGroup>

        {error && <FieldError>{error}</FieldError>}
      </Field>
    );
  },
);

PasswordField.displayName = 'PasswordField';

export { PasswordField };
