import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui';
import { TABLE_STATUS, DRAFT_STATUS } from '../../data/demoFlowState';

function statusLabel(status) {
  return status === TABLE_STATUS.CONFIRMED ? '已确认' : '待确认';
}

export default function ResultIndexPanel({
  contractTableStatus,
  lotTableStatus,
  draftStatus,
  canGenerateDraft,
  onGenerateDraft,
}) {
  const navigate = useNavigate();
  const draftLabel =
    draftStatus === DRAFT_STATUS.GENERATED
      ? '已生成'
      : draftStatus === DRAFT_STATUS.GENERATING
        ? '生成中…'
        : canGenerateDraft
          ? '可生成'
          : '待确认';

  const items = [
    {
      key: 'contract',
      title: '主合同线上表格',
      desc: '批量确认 AI 提取的主合同字段',
      status: contractTableStatus,
      viewPath: '/demo/contract-table',
      downloadName: '主合同线上表格.csv',
    },
    {
      key: 'lot',
      title: '拍品清单线上表格',
      desc: '批量确认拍品记录与合同编号归属',
      status: lotTableStatus,
      viewPath: '/demo/lot-table',
      downloadName: '拍品清单线上表格.csv',
    },
  ];

  return (
    <div className="demo-result-index">
      <h3 className="demo-result-index__title">查看索引</h3>
      <div className="demo-result-index__grid">
        {items.map((item) => (
          <div key={item.key} className="demo-result-index__card">
            <div className="demo-result-index__card-head">
              <strong>{item.title}</strong>
              <span
                className={`ui-badge ${
                  item.status === TABLE_STATUS.CONFIRMED
                    ? 'ui-badge--success'
                    : 'ui-badge--missing'
                }`}
              >
                {statusLabel(item.status)}
              </span>
            </div>
            <p className="demo-result-index__desc">{item.desc}</p>
            <div className="demo-result-index__actions">
              <Button
                variant="primary"
                size="sm"
                type="button"
                data-flow-action={item.key === 'contract' ? 'A-P03-001' : 'A-P03-002'}
                onClick={() => navigate(item.viewPath)}
              >
                查看/确认
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                data-flow-action={item.key === 'contract' ? 'A-P03-003' : 'A-P03-004'}
                onClick={() => window.alert(`[Demo] 下载 ${item.downloadName}`)}
              >
                下载
              </Button>
            </div>
          </div>
        ))}
        <div className="demo-result-index__card demo-result-index__card--draft">
          <div className="demo-result-index__card-head">
            <strong>生成系统草稿</strong>
            <span className="ui-badge ui-badge--neutral">{draftLabel}</span>
          </div>
          <p className="demo-result-index__desc">
            主合同与拍品清单均确认后可生成系统草稿
          </p>
          <Button
            variant="primary"
            type="button"
            data-flow-action="A-P03-005"
            disabled={!canGenerateDraft || draftStatus === DRAFT_STATUS.GENERATING}
            onClick={onGenerateDraft}
          >
            生成草稿
          </Button>
        </div>
      </div>
    </div>
  );
}
