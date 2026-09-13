import * as XLSX from "xlsx";

export function exportToExcel(data, fileName = "export.xlsx", sheetName = "Data") {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, fileName);
}

export function exportTasksToExcel(tasks, filename = "Tasks_Report.xlsx") {
  const formattedData = tasks.map((t) => ({
    ID: t.id,
    Title: t.title,
    Project: t.project?.name || "-",
    Status: t.status,
    Priority: t.priority,
    Assignee: t.assignee?.name || "Unassigned",
    Progress: `${t.progress || 0}%`,
    "Start Date": t.startDate ? new Date(t.startDate).toLocaleDateString() : "-",
    "Due Date": t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-",
    "Estimated Hours": t.estimatedHours || "-",
    Description: t.description || "",
  }));

  exportToExcel(formattedData, filename, "Tasks");
}

export function exportProjectsToExcel(projects, filename = "Projects_Report.xlsx") {
  const formattedData = projects.map((p) => ({
    ID: p.id,
    Name: p.name,
    Status: p.status,
    Owner: p.owner?.name || "-",
    "Total Tasks": p._count?.tasks || p.tasks?.length || 0,
    "Start Date": p.startDate ? new Date(p.startDate).toLocaleDateString() : "-",
    "End Date": p.endDate ? new Date(p.endDate).toLocaleDateString() : "-",
    Description: p.description || "",
  }));

  exportToExcel(formattedData, filename, "Projects");
}
