import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

import { company } from "../data/company";
import { departements } from "../data/departements";
import { documents } from "../data/documents";
import { events } from "../data/events";
import { news } from "../data/news";
import { quickLinks } from "../data/quick-links";
import { team } from "../data/team";
import {
  homeCollaborators,
  projects,
  homeEvents,
  homeNews,
  galleryImages,
  homeAnnouncements,
} from "../data/home";

const outputDir = path.join(process.cwd(), "sharepoint-ready-data");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper to write CSV and add to workbook
function exportDataSet(sheetName: string, fileName: string, data: any[]) {
  if (!data || data.length === 0) return;

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Save as CSV
  const csv = XLSX.utils.sheet_to_csv(ws);
  fs.writeFileSync(path.join(outputDir, `${fileName}.csv`), csv, "utf8");

  // Save as individual Excel
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, path.join(outputDir, `${fileName}.xlsx`));

  console.log(`Exported ${fileName}.csv and ${fileName}.xlsx (${data.length} rows)`);
}

// 1. Company
exportDataSet("Company", "1_Company_Settings", [company]);

// 2. Departments
exportDataSet("Departments", "2_Departments", departements);

// 3. News (Intranet actualité)
exportDataSet("News", "3_News", news);

// 4. Documents (Bibliothèque & métadonnées)
exportDataSet("Documents", "4_Documents", documents);

// 5. Team Directory (Annuaire)
exportDataSet("Team", "5_Team_Directory", team);

// 6. Events (Agenda)
exportDataSet("Events", "6_Events", events);

// 7. Quick Links (Accès rapides)
exportDataSet("QuickLinks", "7_Quick_Links", quickLinks);

// 8. Home Collaborators (Collaborateurs & Anniversaires)
exportDataSet("HomeCollaborators", "8_Home_Collaborators", homeCollaborators);

// 9. Home Projects (Projets en cours)
exportDataSet("Projects", "9_Home_Projects", projects);

// 10. Home Events & News
exportDataSet("HomeNews", "10_Home_News", homeNews);
exportDataSet("HomeEvents", "11_Home_Events", homeEvents);
exportDataSet("Gallery", "12_Home_Gallery", galleryImages);
exportDataSet("Announcements", "13_Home_Announcements", homeAnnouncements);

// Also create a master workbook with all sheets
const masterWb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet([company]), "Company");
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(departements), "Departments");
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(news), "News");
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(documents), "Documents");
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(team), "Team");
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(events), "Events");
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(quickLinks), "QuickLinks");
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(homeCollaborators), "HomeCollaborators");
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(projects), "Projects");
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(homeNews), "HomeNews");
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(homeEvents), "HomeEvents");
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(galleryImages), "Gallery");
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(homeAnnouncements), "Announcements");

XLSX.writeFile(masterWb, path.join(outputDir, "IKA_Solution_Intranet_Master.xlsx"));
console.log("Master workbook generated: IKA_Solution_Intranet_Master.xlsx");
