import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@components/base/field';
import { Input } from '@components/base/input';
import { forwardRef } from 'react';

interface TextFieldProps extends React.ComponentProps<typeof Input> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  description?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, icon, error, description, className, ...props }, ref) => {
    return (
      <Field className={className}>
        {label && (
          <FieldLabel>
            {icon}
            {label}
          </FieldLabel>
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
        <Input ref={ref} aria-invalid={!!error} {...props} />
        {error && <FieldError>{error}</FieldError>}
      </Field>
    );
  },
);

TextField.displayName = 'TextField';

export { TextField };
