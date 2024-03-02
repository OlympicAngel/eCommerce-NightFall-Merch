import * as XLSX from "xlsx"

function ConvertToExcel(jsonData, excelName) {
    const workbook = XLSX.utils.book_new();
    const workspace = XLSX.utils.json_to_sheet(jsonData);

    XLSX.utils.book_append_sheet(workbook, workspace, excelName);
    const filename = excelName + ".xlsx";
    return XLSX.writeFile(workbook, filename);
}

export default ConvertToExcel;