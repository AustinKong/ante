import { useState, ComponentProps } from "react";
import { Popover, Button, Portal, Slider, Group } from "@chakra-ui/react";

type BetButtonProps = {
  text: string;
  onSubmit?: (amount: number) => void;
  min: number;
  max: number;
} & Omit<ComponentProps<typeof Button>, "onSubmit">;

const BetButton = ({
  text,
  onSubmit,
  min,
  max,
  ...buttonProps
}: BetButtonProps) => {
  const [amount, setAmount] = useState(min);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={(event) => setIsOpen(event.open)}>
      <Popover.Trigger asChild>
        <Button
          {...buttonProps}
          disabled={buttonProps?.disabled || isOpen}
          onClick={() => {
            setAmount(min);
            setIsOpen(true);
          }}
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
                max={max}
                min={min}
                size="lg"
                value={[amount]}
                onValueChange={(event) => setAmount(event.value[0])}
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
