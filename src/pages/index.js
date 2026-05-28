/**
 * 页面组件注册 — 逐页精修时在此替换对应 id 的组件
 * 默认全部使用 PrototypeScreen 低保真壳
 */
import PrototypeScreen from '../components/PrototypeScreen';

// 示例（后续启用）:
// import P01Upload from './P01Upload';
// import P02Recognizing from './P02Recognizing';

export const screenComponents = {
  P01: PrototypeScreen,
  P02: PrototypeScreen,
  P03: PrototypeScreen,
  P04: PrototypeScreen,
  P05: PrototypeScreen,
  P06: PrototypeScreen,
  P07: PrototypeScreen,
  P08: PrototypeScreen,
};

export function getScreenComponent(id) {
  return screenComponents[id] ?? PrototypeScreen;
}
