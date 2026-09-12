"use client";

import React from "react";
import { TemplateField } from "@/types";

interface A4DocumentPreviewProps {
  templateTitle: string;
  layoutType: string;
  fields: TemplateField[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>;
  disclaimer?: string;
}

export function A4DocumentPreview({
  templateTitle,
  layoutType,
  fields,
  values,
  disclaimer,
}: A4DocumentPreviewProps) {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const applicantName = values.applicantName || values.deponentName || "________________________";
  const fatherName = values.fatherHusbandName || values.deponentFatherName || values.guardianName || "________________________";
  const address = values.residentialAddress || values.currentAddress || values.deponentAddress || values.applicantAddress || "________________________________________________";
  const district = values.district || "________________";
  const state = values.state || "________________";
  const mobile = values.mobileNumber || "__________";

  return (
    <div className="a4-document w-full bg-white text-slate-900 border border-slate-300 shadow-lg p-8 sm:p-12 min-h-[842px] max-w-[595px] mx-auto text-xs sm:text-sm font-serif leading-normal relative flex flex-col justify-between">
      <div>
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
          <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-600 mb-1">
            प्रारूप आवेदन पत्र / STANDARDIZED CITIZEN DRAFT APPLICATION
          </div>
          <h2 className="text-base sm:text-lg font-bold uppercase text-slate-900">
            {templateTitle}
          </h2>
          <div className="text-[10px] text-slate-500 font-sans mt-1">
            (Under the provisions of State Citizen Service Standards / लोक सेवा गारंटी अधिनियम)
          </div>
        </div>

        {/* Addressed To */}
        <div className="mb-6">
          <p className="font-bold">सेवा में / To,</p>
          <p className="pl-4">
            {values.officerDesignation || "श्रीमान तहसीलदार महोदय / सक्षम प्राधिकारी (The Competent Authority)"}
          </p>
          <p className="pl-4">
            {values.officeDepartment || "राजस्व विभाग / नागरिक सेवा केंद्र (Revenue / Citizen Services Department)"}
          </p>
          <p className="pl-4">
            {district}, {state}
          </p>
        </div>

        {/* Subject Line */}
        <div className="bg-slate-100 p-2 border border-slate-300 rounded mb-6 font-bold text-center">
          विषय: {templateTitle} जारी करने / स्वीकार करने के संबंध में।
        </div>

        {/* Salutation & Body */}
        <p className="mb-3 font-semibold">महोदय / Respected Sir/Madam,</p>
        <p className="mb-4 text-justify leading-relaxed indent-8">
          सविनय निवेदन है कि प्रार्थी/शपथकर्ता <strong>{applicantName}</strong> सुपुत्र/पत्नी <strong>{fatherName}</strong>, निवासी <strong>{address}</strong>, जनपद <strong>{district}</strong> ({state}) का/की स्थाई नागरिक है। प्रार्थी द्वारा उपरोक्त प्रमाण पत्र / सेवा हेतु आवश्यक सभी व्यक्तिगत एवं पारिवारिक विवरण सत्य निष्ठा से प्रस्तुत किए जा रहे हैं:
        </p>

        {/* Dynamic Fields Data Table */}
        <div className="border border-slate-400 mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-400 text-[11px] font-bold">
                <th className="p-2 border-r border-slate-400 w-12 text-center">क्र.</th>
                <th className="p-2 border-r border-slate-400 w-1/2">विवरण / Parameter</th>
                <th className="p-2">प्रार्थी द्वारा प्रविष्ट मान / Citizen Input</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 text-xs">
              {fields
                .filter(
                  (f) =>
                    !["selfDeclaration", "oathConfirmation"].includes(f.id) &&
                    values[f.id] !== undefined &&
                    values[f.id] !== ""
                )
                .map((field, idx) => (
                  <tr key={field.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="p-2 border-r border-slate-300 text-center font-mono">
                      {idx + 1}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-medium">
                      {field.label.split("(")[0]}
                    </td>
                    <td className="p-2 font-bold text-slate-800">
                      {typeof values[field.id] === "boolean"
                        ? values[field.id] ? "हाँ / Yes" : "नहीं / No"
                        : String(values[field.id])}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Application Text if present */}
        {values.applicationContent && (
          <div className="mb-4 p-3 bg-slate-50 border border-slate-300 rounded text-xs text-justify leading-relaxed">
            <strong className="block mb-1 font-sans">आवेदन का विस्तृत विवरण / Application Details:</strong>
            {values.applicationContent}
          </div>
        )}

        {/* Self Declaration Oath */}
        <div className="border border-slate-400 p-3 bg-slate-50/70 rounded text-[11px] leading-relaxed mb-6">
          <p className="font-bold mb-1">स्वघोषणा एवं शपथ पत्र / Solemn Self-Declaration:</p>
          <p className="text-justify">
            मैं <strong>{applicantName}</strong> सत्य निष्ठा से घोषित करता/करती हूँ कि इस आवेदन में दिए गए सभी तथ्य एवं संलग्न विवरण मेरी सर्वोत्तम जानकारी व विश्वास के अनुसार पूर्णतः सत्य व सही हैं। यदि कोई भी जानकारी असत्य पाई जाती है, तो भारतीय न्याय संहिता (BNS) एवं संबंधित राज्य नियमों के अधीन विधिक कार्यवाही का उत्तरदायित्व प्रार्थी का होगा।
          </p>
        </div>
      </div>

      {/* Footer & Signature Section */}
      <div className="pt-4 border-t border-slate-300">
        <div className="flex justify-between items-end mb-8 text-xs">
          <div>
            <p><strong>दिनांक / Date:</strong> {currentDate}</p>
            <p><strong>स्थान / Place:</strong> {district}, {state}</p>
            <p><strong>दूरभाष / Mobile:</strong> {mobile}</p>
          </div>

          <div className="text-center">
            <div className="w-36 h-12 border-b border-dashed border-slate-700 mb-1"></div>
            <p className="font-bold">प्रार्थी के हस्ताक्षर / Signature</p>
            <p className="text-[10px] text-slate-500">({applicantName})</p>
          </div>
        </div>

        {/* Prominent Legal Disclaimer in accordance with rules */}
        <div className="text-[9px] text-center text-slate-500 font-sans border-t border-slate-200 pt-2 leading-tight">
          <p className="font-semibold text-slate-600">
            वैधानिक सूचना / STATUTORY ADVISORY:
          </p>
          <p>
            {disclaimer ||
              "यह प्रपत्र प्रार्थी द्वारा तैयार किया गया आवेदन प्रारूप है। यह कोई सरकारी प्रमाण पत्र नहीं है। इसे सक्षम अधिकारी अथवा राज्य लोक सेवा ई-डिस्ट्रिक्ट पोर्टल पर प्रस्तुत किया जाना अनिवार्य है।"}
          </p>
          <p className="mt-0.5 text-slate-400">
            Drafted via SevaDesk Citizen Document System • Unique ID: SD-{Math.abs(applicantName.length * 997).toString().padStart(6, "0")}
          </p>
        </div>
      </div>
    </div>
  );
}
