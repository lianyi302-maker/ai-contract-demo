/** Screen Map 画布布局（仅坐标，不含业务数据） */
export const FLOW_MAP_LAYOUT = {
  P01: { x: 48, y: 56 },
  P02: { x: 400, y: 56 },
  P03: { x: 752, y: 56 },
  P04: { x: 120, y: 400 },
  P05: { x: 472, y: 400 },
  P06: { x: 824, y: 400 },
  P07: { x: 280, y: 744 },
  P08: { x: 632, y: 744 },
  P09: { x: 984, y: 744 },
};

export const FLOW_MAP_PAGE_WIDTH = 300;
export const FLOW_MAP_PAGE_HEIGHT = 120;
export const FLOW_MAP_CANVAS = { width: 1340, height: 920 };

export function getFlowMapPageCenter(pageId) {
  const pos = FLOW_MAP_LAYOUT[pageId] || { x: 0, y: 0 };
  return {
    x: pos.x + FLOW_MAP_PAGE_WIDTH / 2,
    y: pos.y + FLOW_MAP_PAGE_HEIGHT / 2,
  };
}

/** 触点从页面卡片右侧出发的纵向偏移 */
export function getActionAnchor(pageId, actionIndex, total) {
  const pos = FLOW_MAP_LAYOUT[pageId] || { x: 0, y: 0 };
  const slot = total <= 1 ? 0.5 : (actionIndex + 0.5) / total;
  return {
    x: pos.x + FLOW_MAP_PAGE_WIDTH,
    y: pos.y + 36 + slot * (FLOW_MAP_PAGE_HEIGHT - 48),
  };
}
