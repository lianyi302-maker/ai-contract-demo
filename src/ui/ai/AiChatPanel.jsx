import Button from '../primitives/Button';

/**
 * 右侧 AI 对话框
 * @param {{ id: string, role: 'user'|'assistant', content: string }[]} messages
 */
export default function AiChatPanel({
  title = 'AI 助手',
  messages = [],
  inputValue = '',
  placeholder = '输入自然语言指令…',
  onInputChange,
  onSend,
  className = '',
}) {
  return (
    <div className={`ui-ai-chat ${className}`.trim()}>
      <div className="ui-ai-chat__header">{title}</div>
      <div className="ui-ai-chat__messages" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`ui-ai-chat__bubble ui-ai-chat__bubble--${msg.role}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="ui-ai-chat__input-row">
        <input
          className="ui-ai-chat__input"
          value={inputValue}
          placeholder={placeholder}
          onChange={onInputChange ? (e) => onInputChange(e.target.value) : undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSend) onSend();
          }}
          aria-label="AI 指令输入"
        />
        <Button variant="primary" type="button" onClick={onSend}>
          发送
        </Button>
      </div>
    </div>
  );
}
