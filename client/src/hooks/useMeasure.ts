import { useCallback, useEffect, useRef, useState } from "react";

type Rect = {
  width: number;
  height: number;
};

const useMeasure = (): [React.RefObject<HTMLDivElement | null>, Rect] => {
  const [rect, setRect] = useState<Rect>({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement | null>(null);

  const updateRect = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    /* Alternatively:
      setRect({
        width: node.getBoundingClientRect().width,
        height: node.getBoundingClientRect().height,
      })
      Main difference is that getBoundingClientRect takes into account post-transformation size
      Whereas, offsetWidth/Height is the size of the element before any transformations
    */
    setRect({
      width: node.offsetWidth,
      height: node.offsetHeight,
    });
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    updateRect(); // Initial size

    const resizeObserver = new ResizeObserver(() => {
      updateRect();
    });
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, [updateRect]);

  return [ref, rect];
};

export default useMeasure;
