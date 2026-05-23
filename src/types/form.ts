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
