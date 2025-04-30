import { useState, ComponentProps } from "react";
import { Popover, Button, Portal, Slider, Group } from "@chakra-ui/react";

type BetButtonProps = {
  text: string;
  onSubmit?: (amount: number) => void;
} & ComponentProps<typeof Button>;

const BetButton = ({ text, onSubmit, ...buttonProps }: BetButtonProps) => {
  const [amount, setAmount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={(event) => setIsOpen(event.open)}>
      <Popover.Trigger asChild {...buttonProps}>
        <Button
          onClick={() => {
            setAmount(0);
            setIsOpen(true);
          }}
          disabled={isOpen}
        >
          {text}
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Slider.Root
                value={[amount]}
                onValueChange={(event) => setAmount(event.value[0])}
                size="lg"
              >
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumbs />
                </Slider.Control>
              </Slider.Root>
            </Popover.Body>
            <Popover.Footer>
              <Group w="full">
                <Button
                  flex="1"
                  size="sm"
                  onClick={() => {
                    onSubmit?.(amount);
                    setIsOpen(false);
                  }}
                >
                  {text} ${amount}
                </Button>
                <Button
                  flex="1"
                  size="sm"
                  variant="subtle"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </Group>
            </Popover.Footer>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default BetButton;
