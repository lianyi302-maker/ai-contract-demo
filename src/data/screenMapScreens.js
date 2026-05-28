import { screens } from '../screens';

/** 仅用于页面地图展示，不注册 /p09 路由 */
export const P09_SCREEN = {
  id: 'P09',
  name: 'AI 工作台',
  path: '/demo',
  goal: '通过 AI 对话启动上传、识别、双表确认、生成草稿与提交审核检查全流程。',
  mainActions: [
    '输入自然语言指令',
    '打开上传材料',
    '查看识别结果索引',
    '生成系统草稿',
    '提交审核检查',
  ],
  nextScreens: ['P01'],
  exceptions: ['指令无法理解', '识别未完成即操作索引', '双表未确认即生成草稿'],
  humanConfirmPoints: [
    '确认识别摘要后再进入表格确认',
    '生成草稿前主合同与拍品均已确认',
  ],
};

/** P01–P09 页面地图数据源 */
export const screenMapScreens = [P09_SCREEN, ...screens];

export function resolveMapNextScreens(screen) {
  return (screen.nextScreens || [])
    .map((id) => screenMapScreens.find((s) => s.id === id))
    .filter(Boolean);
}
