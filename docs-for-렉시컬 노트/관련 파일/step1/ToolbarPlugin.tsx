import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";
import { $getNearestNodeOfType } from "@lexical/utils";

type BlockType = "paragraph" | "h1" | "h2" | "h3" | "ul" | "ol";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(element)) {
        setBlockType(element.getTag() as BlockType);
      } else if ($isListNode(element)) {
        const listType = element.getListType();
        setBlockType(listType === "number" ? "ol" : "ul");
      } else {
        const parent = anchorNode.getParent();
        if (parent && $isListNode(parent)) {
          const listType = parent.getListType();
          setBlockType(listType === "number" ? "ol" : "ul");
        } else {
          setBlockType("paragraph");
        }
      }
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  const formatHeading = (level: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (blockType === level) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(level));
        }
      }
    });
  };

  const btnClass = (active: boolean) =>
    `px-1.5 py-0.5 text-xs rounded transition-colors ${
      active
        ? "bg-blue-100 text-blue-700"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    }`;

  return (
    <div className="flex items-center gap-0.5 px-2 py-1 border-b border-gray-200 bg-gray-50 flex-wrap">
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={btnClass(isBold)}
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={btnClass(isItalic)}
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={btnClass(isUnderline)}
        title="Underline (Ctrl+U)"
      >
        <u>U</u>
      </button>

      <span className="w-px h-4 bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={() => formatHeading("h1")}
        className={btnClass(blockType === "h1")}
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => formatHeading("h2")}
        className={btnClass(blockType === "h2")}
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => formatHeading("h3")}
        className={btnClass(blockType === "h3")}
        title="Heading 3"
      >
        H3
      </button>

      <span className="w-px h-4 bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        className={btnClass(blockType === "ul")}
        title="Bullet List"
      >
        &bull; List
      </button>
      <button
        type="button"
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        className={btnClass(blockType === "ol")}
        title="Numbered List"
      >
        1. List
      </button>
    </div>
  );
}
