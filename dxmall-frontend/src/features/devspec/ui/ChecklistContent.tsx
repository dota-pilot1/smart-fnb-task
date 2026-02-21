import { useState, useEffect } from "react";

interface CheckItem {
  text: string;
  checked: boolean;
}

interface ChecklistContentProps {
  content: string;
  onSave: (content: string) => void;
}

function parseChecklist(content: string): CheckItem[] {
  if (!content) return [];
  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export function ChecklistContent({ content, onSave }: ChecklistContentProps) {
  const [items, setItems] = useState<CheckItem[]>(parseChecklist(content));
  const [newItemText, setNewItemText] = useState("");

  useEffect(() => {
    setItems(parseChecklist(content));
  }, [content]);

  const save = (updated: CheckItem[]) => {
    setItems(updated);
    onSave(JSON.stringify(updated));
  };

  const toggleItem = (index: number) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    save(updated);
  };

  const addItem = () => {
    if (!newItemText.trim()) return;
    const updated = [...items, { text: newItemText.trim(), checked: false }];
    save(updated);
    setNewItemText("");
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    save(updated);
  };

  const updateItemText = (index: number, text: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, text } : item
    );
    setItems(updated);
  };

  const saveItemText = (index: number) => {
    save(items.map((item, i) =>
      i === index ? { ...item, text: items[index].text } : item
    ));
  };

  const doneCount = items.filter((i) => i.checked).length;
  const total = items.length;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="p-4 space-y-4">
      {total > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {doneCount}/{total} 완료
            </span>
            <span>{percent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(index)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <input
              value={item.text}
              onChange={(e) => updateItemText(index, e.target.value)}
              onBlur={() => saveItemText(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveItemText(index);
              }}
              className={`flex-1 text-sm bg-transparent border-none outline-none ${
                item.checked ? "line-through text-gray-400" : "text-gray-700"
              }`}
            />
            <button
              onClick={() => removeItem(index)}
              className="hidden group-hover:block text-xs text-gray-400 hover:text-red-500"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addItem();
          }}
          placeholder="새 항목 추가..."
          className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          추가
        </button>
      </div>
    </div>
  );
}
