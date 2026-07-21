export type RecordActionButtonsProps = {
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
  deleteConfirmMessage: string;
  className?: string;
};
