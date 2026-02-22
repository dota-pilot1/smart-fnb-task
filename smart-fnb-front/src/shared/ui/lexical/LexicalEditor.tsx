import { useCallback, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  type EditorState,
} from "lexical";
import { editorTheme } from "./theme";
import { ToolbarPlugin } from "./ToolbarPlugin";

interface LexicalEditorProps {
  initialState?: string;
  onChange: (state: string) => void;
  placeholder?: string;
}

function InitialContentPlugin({ initialState }: { initialState?: string }) {
  const [editor] = useLexicalComposerContext();
  const initialized = { current: false };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!initialState) return;

    // Lexical JSON인지 체크
    try {
      const parsed = JSON.parse(initialState);
      if (parsed.root) {
        const editorState = editor.parseEditorState(initialState);
        editor.setEditorState(editorState);
        return;
      }
    } catch {
      // JSON 파싱 실패 → 단순 텍스트
    }

    // 단순 텍스트 → ParagraphNode로 변환
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const lines = initialState.split("\n");
      for (const line of lines) {
        const paragraph = $createParagraphNode();
        if (line) {
          paragraph.append($createTextNode(line));
        }
        root.append(paragraph);
      }
    });
  }, [editor, initialState]);

  return null;
}

export function LexicalEditor({
  initialState,
  onChange,
  placeholder = "내용을 입력하세요...",
}: LexicalEditorProps) {
  const handleChange = useCallback(
    (editorState: EditorState) => {
      const json = JSON.stringify(editorState.toJSON());
      onChange(json);
    },
    [onChange],
  );

  const initialConfig = {
    namespace: "NoteEditor",
    theme: editorTheme,
    nodes: [HeadingNode, ListNode, ListItemNode],
    onError: (error: Error) => {
      console.error("Lexical error:", error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex flex-col h-full">
        <ToolbarPlugin />
        <div className="relative flex-1 overflow-y-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[120px] p-3 text-sm outline-none" />
            }
            placeholder={
              <div className="absolute top-3 left-3 text-sm text-gray-400 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <OnChangePlugin onChange={handleChange} />
        <InitialContentPlugin initialState={initialState} />
      </div>
    </LexicalComposer>
  );
}
