/** 默认画布布局 — P01–P08 平铺 */
export const DEFAULT_NODE_LAYOUT = {
  P01: { x: 40, y: 40 },
  P02: { x: 280, y: 40 },
  P03: { x: 520, y: 40 },
  P04: { x: 760, y: 40 },
  P05: { x: 40, y: 280 },
  P06: { x: 280, y: 280 },
  P07: { x: 520, y: 280 },
  P08: { x: 760, y: 280 },
};

export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 88;

export function getNodeCenter(id, layout = DEFAULT_NODE_LAYOUT) {
  const pos = layout[id] || { x: 0, y: 0 };
  return {
    x: pos.x + NODE_WIDTH / 2,
    y: pos.y + NODE_HEIGHT / 2,
  };
}

export function buildFlowEdges(screens) {
  const edges = [];
  const seen = new Set();
  screens.forEach((screen) => {
    (screen.nextScreens || []).forEach((targetId) => {
      const key = `${screen.id}->${targetId}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ from: screen.id, to: targetId });
      }
    });
  });
  return edges;
}
