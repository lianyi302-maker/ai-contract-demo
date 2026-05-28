import { flowSpec, flowPages } from '../flowSpec.js';

const CSV_HEADERS = [
  'id',
  'fromPageId',
  'fromPageName',
  'actionId',
  'actionLabel',
  'actionType',
  'toPageId',
  'toPageName',
  'condition',
  'disabledCondition',
  'feedback',
  'riskLevel',
  'note',
];

function escapeCsv(value) {
  const s = String(value ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toFlowSpecJson() {
  return JSON.stringify({ flowPages, flowSpec }, null, 2);
}

export function toFlowSpecCsv() {
  const rows = [CSV_HEADERS.join(',')];
  flowSpec.forEach((row) => {
    rows.push(CSV_HEADERS.map((h) => escapeCsv(row[h])).join(','));
  });
  return rows.join('\n');
}

export function toMermaidFlowchart() {
  const lines = ['flowchart LR'];
  flowSpec.forEach((t) => {
    const from = t.fromPageId;
    const to = t.toPageId;
    const label = `${t.actionLabel} | ${t.condition}`.replace(/"/g, "'");
    if (from === to) {
      lines.push(`  ${from} -->|"${label}"| ${to}`);
    } else {
      lines.push(`  ${from} -->|"${t.actionLabel}\\n${t.condition}"| ${to}`);
    }
  });
  lines.push('');
  lines.push('  %% Pages');
  flowPages.forEach((p) => {
    lines.push(`  %% ${p.id}: ${p.name}`);
  });
  return lines.join('\n');
}

export function toInteractionMarkdown() {
  const parts = [
    '# AI 合同录入助手 — 交互说明（Flow Spec）',
    '',
    '> 由 flowSpec.js 自动生成，供设计二创与评审。',
    '',
    '## 页面一览',
    '',
    '| 页面 ID | 名称 | 说明 | Demo 路径 |',
    '| --- | --- | --- | --- |',
  ];
  flowPages.forEach((p) => {
    parts.push(`| ${p.id} | ${p.name} | ${p.summary} | \`${p.demoPath}\` |`);
  });
  parts.push('', '## 触点与跳转', '');
  flowSpec.forEach((t) => {
    parts.push(`### ${t.id} · ${t.actionId} — ${t.actionLabel}`);
    parts.push('');
    parts.push(`- **来源**：${t.fromPageId} ${t.fromPageName}`);
    parts.push(`- **目标**：${t.toPageId} ${t.toPageName}`);
    parts.push(`- **类型**：\`${t.actionType}\` · **风险**：\`${t.riskLevel}\``);
    parts.push(`- **条件**：${t.condition}`);
    parts.push(`- **禁用**：${t.disabledCondition}`);
    parts.push(`- **反馈**：${t.feedback}`);
    parts.push(`- **说明**：${t.note}`);
    parts.push('');
  });
  return parts.join('\n');
}

export function downloadTextFile(filename, content, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
