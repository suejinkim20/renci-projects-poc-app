import { Modal as MantineModal } from "@mantine/core";

export default function Modal({ children, onClose, opened }) {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      size="xl"
      overlayOpacity={0.35}
      overlayBlur={2}
      radius="md"
    >
      {children}
    </MantineModal>
  );
}
