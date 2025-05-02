import { Button, Group, Drawer, Slider, Grid } from "@chakra-ui/react";
import { ReactNode, useState } from "react";

type SliderConfig = {
  title?: string;
  min: number;
  max: number;
  initial?: number;
  onSubmit: (value: number) => void;
};

export type Action = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  sliderConfig?: SliderConfig;
  variant?: "outline" | "solid" | "ghost" | "subtle" | "surface" | "plain";
  disabled?: boolean;
};

interface ActionBarProps {
  actions: Action[];
  disabled?: boolean;
}

const ActionBar = ({ disabled = false, actions }: ActionBarProps) => {
  const [slider, setSlider] = useState<SliderConfig | null>(null);
  const [amount, setAmount] = useState(0);

  const openSlider = (config: SliderConfig) => {
    setSlider(config);
    setAmount(config.initial || config.min);
  };
  const closeSlider = () => setSlider(null);

  const handleClick = (action: Action) => {
    if (action.sliderConfig) {
      openSlider(action.sliderConfig);
    } else {
      action.onClick();
    }
  };

  return (
    <Drawer.Root
      open={!!slider}
      placement="bottom"
      onOpenChange={(event) => {
        if (!event.open) closeSlider();
      }}
    >
      <Drawer.Backdrop />
      {/* <Drawer.Trigger /> */}
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{slider?.title}</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Slider.Root
              max={slider?.max}
              min={slider?.min}
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
          </Drawer.Body>
          <Drawer.Footer>
            <Group w="full">
              <Button
                flex="1"
                size="sm"
                onClick={() => {
                  if (slider) slider.onSubmit(amount);
                  closeSlider();
                }}
              >
                {slider?.title} ${amount}
              </Button>
              <Button
                flex="1"
                size="sm"
                variant="outline"
                onClick={closeSlider}
              >
                Cancel
              </Button>
            </Group>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
      <Grid gap={2} templateColumns="repeat(2, 1fr)">
        {actions.map((action, index) => (
          <Button
            key={index}
            disabled={disabled || action.disabled}
            gridColumn={
              actions.length % 2 === 1 && index === 0 ? "span 2" : undefined
            }
            variant={action.variant || "solid"}
            onClick={() => handleClick(action)}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </Grid>
    </Drawer.Root>
  );
};

export default ActionBar;
