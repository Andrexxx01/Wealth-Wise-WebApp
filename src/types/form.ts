import type {
  FormHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export type FormSelectOption = {
  value: string;
  label: string;
};

export type FormSelectProps = {
  label: string;
  options: readonly FormSelectOption[];
  error?: string;
  placeholder?: string;
  registration?: UseFormRegisterReturn;
  disabled?: boolean;
  className?: string;
  selectClassName?: string;
};

export type FormInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  label: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  className?: string;
  inputClassName?: string;
};

export type FormTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
> & {
  label: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  className?: string;
  textareaClassName?: string;
};

export type FormDialogShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  formProps?: FormHTMLAttributes<HTMLFormElement>;
};

export type FormDialogFooterProps = {
  cancelLabel?: string;
  submitLabel: string;
  isSubmitting?: boolean;
  onCancel: () => void;
};