import ToolsSidebar from "@/components/layout/tools-sidebar";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <ToolsSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
