import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useFigmaLinks } from "../model/use-figma-links";
import { CommonCardForList } from "@/shared/ui/CommonCardForList";
import { CommonDialog } from "@/shared/ui/CommonDialog";

interface FigmaContentProps {
  devSpecId: number;
}

export function FigmaContent({ devSpecId }: FigmaContentProps) {
  const { links, loading, fetchLinks, createLink, deleteLink } =
    useFigmaLinks(devSpecId);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const form = useForm({
    defaultValues: { title: "", description: "", url: "" },
    onSubmit: async ({ value }) => {
      await createLink({
        title: value.title.trim(),
        description: value.description.trim(),
        url: value.url.trim(),
      });
      form.reset();
      setDialogOpen(false);
    },
  });

  return (
    <div className="p-4 space-y-4">
      {/* 추가 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={() => setDialogOpen(true)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Figma 링크 추가
        </button>
      </div>

      {/* 다이얼로그 */}
      <CommonDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          form.reset();
        }}
        title="Figma 링크 추가"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-3"
        >
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "제목은 필수입니다." : undefined,
            }}
          >
            {(field) => (
              <div>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="제목 (예: 쿠폰 테이블 디자인)"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-xs text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="설명 (선택)"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </form.Field>

          <form.Field
            name="url"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "URL은 필수입니다." : undefined,
            }}
          >
            {(field) => (
              <div>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Figma URL"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-xs text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setDialogOpen(false);
                form.reset();
              }}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  저장
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CommonDialog>

      {/* 카드 목록 */}
      {loading ? (
        <div className="text-sm text-gray-400 text-center py-8">로딩 중...</div>
      ) : links.length === 0 ? (
        <div className="text-sm text-gray-400 text-center py-8">
          등록된 Figma 링크가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {links.map((link) => (
            <CommonCardForList
              key={link.id}
              title={link.title}
              description={link.description}
              onClick={() => window.open(link.url, "_blank")}
              onDelete={() => deleteLink(link.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
