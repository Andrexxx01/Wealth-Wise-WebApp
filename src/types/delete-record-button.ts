export type DeleteRecordButtonProps = {
  confirmMessage: string;
  onConfirmDelete: () => void | Promise<void>;
  label?: string;
  className?: string;
};
