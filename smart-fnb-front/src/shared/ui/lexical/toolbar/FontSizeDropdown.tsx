import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import {
  $patchStyleText,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";

const FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
];

export function FontSizeDropdown() {
  const [editor] = useLexicalComposerContext();
  const [fontSize, setFontSize] = useState("16px");

  const updateState = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const size = $getSelectionStyleValueForProperty(
        selection,
        "font-size",
        "16px",
      );
      setFontSize(size);
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateState();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateState]);

  const handleChange = (size: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-size": size });
      }
    });
    setFontSize(size);
  };

  return (
    <select
      value={fontSize}
      onChange={(e) => handleChange(e.target.value)}
      className="text-xs border border-gray-300 rounded px-1 py-0.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
      title="Font Size"
    >
      {FONT_SIZES.map((size) => (
        <option key={size} value={size}>
          {parseInt(size)}
        </option>
      ))}
    </select>
  );
}
