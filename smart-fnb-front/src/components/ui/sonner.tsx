import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!bg-slate-800 !text-white !border-slate-700 !shadow-xl !rounded-xl !text-sm !font-medium",
          title: "!text-white !font-semibold",
          description: "!text-slate-300",
          actionButton: "!bg-blue-500 !text-white",
          cancelButton: "!bg-slate-600 !text-slate-200",
          closeButton:
            "!bg-slate-700 !text-slate-300 !border-slate-600 hover:!bg-slate-600",
          success:
            "!bg-emerald-600 !border-emerald-500",
          error:
            "!bg-rose-600 !border-rose-500",
          warning:
            "!bg-amber-500 !border-amber-400 !text-slate-900",
          info:
            "!bg-blue-600 !border-blue-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

