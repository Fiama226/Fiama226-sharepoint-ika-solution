"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface TableRow {
  id: number;
  articleNo: string;
  description: string;
  deliveryDate: string;
  quantity: number;
  unitPrice: number;
}

const BorderauPrix: React.FC = () => {
  const [rows, setRows] = useState<TableRow[]>([
    {
      id: 1,
      articleNo: "1",
      description: "Mise en place de la redondance des pare-feu Palo Alto",
      deliveryDate: "90 jours",
      quantity: 1,
      unitPrice: 0,
    },
  ]);

  const [submissionAmount, setSubmissionAmount] = useState<number>(0);

  // Calculate totals
  const calculateTotals = () => {
    const totalHT = rows.reduce((sum, row) => {
      return sum + row.quantity * row.unitPrice;
    }, 0);

    const tva = totalHT * 0.18;
    const totalTTC = totalHT + tva;

    return { totalHT, tva, totalTTC };
  };

  const { totalHT, tva, totalTTC } = calculateTotals();

  // Add new row
  const addRow = () => {
    const newId =
      rows.length > 0
        ? Math.max(...rows.map((r) => parseInt(r.articleNo))) + 1
        : 1;
    setRows([
      ...rows,
      {
        id: Date.now(),
        articleNo: newId.toString(),
        description: "",
        deliveryDate: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  // Remove row
  const removeRow = (id: number) => {
    if (rows.length > 1) {
      const newRows = rows.filter((row) => row.id !== id);
      // Renumber articles
      const renumberedRows = newRows.map((row, index) => ({
        ...row,
        articleNo: (index + 1).toString(),
      }));
      setRows(renumberedRows);
    }
  };

  // Update row
  const updateRow = (
    id: number,
    field: keyof TableRow,
    value: string | number,
  ) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  // Export to Excel
  const exportToExcel = () => {
    const { totalHT, tva, totalTTC } = calculateTotals();

    // Create worksheet data
    const data = [
      ["BORDEREAU DES PRIX POUR LES FOURNITURES"],
      [],
      [
        "Article(s) N°",
        "Description (Désignation)",
        "Date de livraison (délais)",
        "Quantité (Nombre d&apos;unités)",
        "Prix unitaire",
        "Prix total par article (colonne 4 x colonne 5)",
      ],
      ...rows.map((row) => [
        row.articleNo,
        row.description,
        row.deliveryDate,
        row.quantity,
        row.unitPrice,
        row.quantity * row.unitPrice,
      ]),
      [],
      ["", "", "", "", "Prix total hors TVA", totalHT.toFixed(2)],
      ["", "", "", "", "Montant TVA (18%)", tva.toFixed(2)],
      [
        "",
        "",
        "",
        "",
        "Prix total toutes taxes comprises",
        totalTTC.toFixed(2),
      ],
      [],
      ["Arrêté la présente soumission à la somme de :"],
      [`Montant TTC : (${totalTTC.toFixed(2)}) francs CFA.`],
      [`Montant hors TVA : (${totalHT.toFixed(2)}) francs CFA.`],
      [`Montant de la TVA : (${tva.toFixed(2)}) francs CFA.`],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    ws["!cols"] = [
      { wch: 5 },
      { wch: 50 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Borderau Prix");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      blob,
      `borderau_prix_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8 underline">
          BORDEREAU DES PRIX POUR LES FOURNITURES
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-800 px-4 py-2 text-left w-16">
                  1
                </th>
                <th className="border border-gray-800 px-4 py-2 text-left">
                  2
                </th>
                <th className="border border-gray-800 px-4 py-2 text-left">
                  3
                </th>
                <th className="border border-gray-800 px-4 py-2 text-left">
                  4
                </th>
                <th className="border border-gray-800 px-4 py-2 text-left">
                  5
                </th>
                <th className="border border-gray-800 px-4 py-2 text-left">
                  6
                </th>
                <th className="border border-gray-800 px-4 py-2 text-left w-12">
                  Actions
                </th>
              </tr>
              <tr>
                <th className="border border-gray-800 px-4 py-2 font-semibold">
                  Article(s) N°
                </th>
                <th className="border border-gray-800 px-4 py-2 font-semibold">
                  Description (Désignation)
                </th>
                <th className="border border-gray-800 px-4 py-2 font-semibold">
                  Date de livraison (délais)
                </th>
                <th className="border border-gray-800 px-4 py-2 font-semibold">
                  Quantité (Nombre d&apos;unités)
                </th>
                <th className="border border-gray-800 px-4 py-2 font-semibold">
                  Prix unitaire
                </th>
                <th className="border border-gray-800 px-4 py-2 font-semibold">
                  Prix total par article (colonne 4 x colonne 5)
                </th>
                <th className="border border-gray-800 px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="border border-gray-800 px-4 py-2">
                    <input
                      type="text"
                      value={row.articleNo}
                      onChange={(e) =>
                        updateRow(row.id, "articleNo", e.target.value)
                      }
                      className="w-full border-none focus:outline-none focus:ring-0"
                    />
                  </td>
                  <td className="border border-gray-800 px-4 py-2">
                    <textarea
                      value={row.description}
                      onChange={(e) =>
                        updateRow(row.id, "description", e.target.value)
                      }
                      className="w-full border-none focus:outline-none focus:ring-0 resize-none"
                      rows={2}
                    />
                  </td>
                  <td className="border border-gray-800 px-4 py-2">
                    <input
                      type="text"
                      value={row.deliveryDate}
                      onChange={(e) =>
                        updateRow(row.id, "deliveryDate", e.target.value)
                      }
                      className="w-full border-none focus:outline-none focus:ring-0"
                    />
                  </td>
                  <td className="border border-gray-800 px-4 py-2">
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) =>
                        updateRow(
                          row.id,
                          "quantity",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-full border-none focus:outline-none focus:ring-0 text-center"
                      min="0"
                    />
                  </td>
                  <td className="border border-gray-800 px-4 py-2">
                    <input
                      type="number"
                      value={row.unitPrice}
                      onChange={(e) =>
                        updateRow(
                          row.id,
                          "unitPrice",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-full border-none focus:outline-none focus:ring-0 text-right"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="border border-gray-800 px-4 py-2 text-right font-semibold">
                    {formatNumber(row.quantity * row.unitPrice)}
                  </td>
                  <td className="border border-gray-800 px-4 py-2 text-center">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-red-600 hover:text-red-800 font-bold text-xl"
                      title="Supprimer la ligne"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-800 px-4 py-2"
                ></td>
                <td className="border border-gray-800 px-4 py-2 font-semibold">
                  Prix total hors TVA
                </td>
                <td className="border border-gray-800 px-4 py-2 text-right font-bold">
                  {formatNumber(totalHT)}
                </td>
                <td className="border border-gray-800 px-4 py-2"></td>
              </tr>
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-800 px-4 py-2"
                ></td>
                <td className="border border-gray-800 px-4 py-2 font-semibold">
                  Montant TVA (18%)
                </td>
                <td className="border border-gray-800 px-4 py-2 text-right font-bold">
                  {formatNumber(tva)}
                </td>
                <td className="border border-gray-800 px-4 py-2"></td>
              </tr>
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-800 px-4 py-2"
                ></td>
                <td className="border border-gray-800 px-4 py-2 font-semibold">
                  Prix total toutes taxes comprises
                </td>
                <td className="border border-gray-800 px-4 py-2 text-right font-bold text-lg">
                  {formatNumber(totalTTC)}
                </td>
                <td className="border border-gray-800 px-4 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-lg">
            Arrêté la présente soumission à la somme de :
          </p>
          <p className="text-lg">
            <strong>Montant TTC :</strong> ({formatNumber(totalTTC)}) francs
            CFA.
          </p>
          <p className="text-lg">
            <strong>Montant hors TVA :</strong> ({formatNumber(totalHT)}) francs
            CFA.
          </p>
          <p className="text-lg">
            <strong>Montant de la TVA :</strong> ({formatNumber(tva)}) francs
            CFA.
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={addRow}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2"
          >
            <span className="text-2xl">+</span> Ajouter une ligne
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exporter en Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorderauPrix;
