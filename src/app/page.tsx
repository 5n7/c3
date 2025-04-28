"use client";

import React, { useMemo, useState } from "react";

// Helper function to get code points for a string
const getCodePoints = (str: string | null | undefined): (number | null)[] => {
  if (!str) return [];
  // Use Array.from to handle multi-byte characters correctly
  return Array.from(str).map((char) => char.codePointAt(0) ?? null);
};

export default function Home() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  const comparisonResult = useMemo(() => {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const maxLength = Math.max(lines1.length, lines2.length);
    const result = [];

    for (let i = 0; i < maxLength; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];
      const codePoints1 = getCodePoints(line1);
      const codePoints2 = getCodePoints(line2);
      const maxChars = Math.max(codePoints1.length, codePoints2.length);
      const lineComparison = {
        line1: line1 ?? null,
        line2: line2 ?? null,
        chars: [] as {
          char1: string | null;
          code1: number | null;
          char2: string | null;
          code2: number | null;
          match: boolean;
        }[],
      };

      for (let j = 0; j < maxChars; j++) {
        const code1 = codePoints1[j] ?? null;
        const code2 = codePoints2[j] ?? null;
        const char1 = code1 !== null ? String.fromCodePoint(code1) : null;
        const char2 = code2 !== null ? String.fromCodePoint(code2) : null;

        lineComparison.chars.push({
          char1,
          code1,
          char2,
          code2,
          match: code1 === code2,
        });
      }
      result.push(lineComparison);
    }
    return result;
  }, [text1, text2]);

  return (
    <main className="flex min-h-screen flex-col items-center p-12 font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">c3 - Character Code Comparator</h1>
      </header>

      <section className="mb-8 flex w-full max-w-4xl flex-col gap-4 md:flex-row">
        {/* Input Area 1 */}
        <div className="flex-1">
          <textarea
            className="h-60 w-full resize-none rounded-md border bg-gray-50 p-4 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter text here..."
            value={text1}
            onChange={(e) => setText1(e.target.value)}
          />
        </div>

        {/* Input Area 2 */}
        <div className="flex-1">
          <textarea
            className="h-60 w-full resize-none rounded-md border bg-gray-50 p-4 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter text here..."
            value={text2}
            onChange={(e) => setText2(e.target.value)}
          />
        </div>
      </section>

      <section className="w-full max-w-6xl">
        <h2 className="mb-4 text-2xl font-semibold">Comparison Result</h2>
        <div className="min-h-[200px] overflow-x-auto rounded-md border bg-gray-50 p-4 font-mono text-sm">
          {comparisonResult.length === 0 || (text1 === "" && text2 === "") ? (
            <p className="font-sans text-gray-500">
              Comparison results will appear here.
            </p>
          ) : (
            comparisonResult.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className={`mb-4 rounded p-2 ${
                  line.line1 === line.line2 ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex gap-4">
                  {/* Line Number */}
                  <div className="w-8 text-right text-gray-400">
                    {lineIndex + 1}
                  </div>
                  {/* Comparison Details */}
                  <div className="flex flex-grow flex-col">
                    {/* Text Line 1 */}
                    <div className="mb-1 flex whitespace-pre">
                      {line.chars.map((charData, charIndex) => (
                        <span
                          key={`l1c${charIndex}`}
                          className={`inline-block min-w-[4rem] px-1 text-center ${
                            !charData.match && charData.char1 !== null
                              ? "rounded bg-red-200"
                              : ""
                          }`}
                        >
                          {charData.char1}
                        </span>
                      ))}
                    </div>
                    {/* Code Points Line 1 */}
                    <div className="mb-2 flex text-xs whitespace-pre text-gray-500">
                      {line.chars.map((charData, charIndex) => (
                        <span
                          key={`l1cp${charIndex}`}
                          className={`inline-block min-w-[4rem] px-1 text-center ${
                            !charData.match && charData.char1 !== null
                              ? "rounded bg-red-200"
                              : ""
                          }`}
                        >
                          {charData.code1 !== null
                            ? `U+${charData.code1
                                .toString(16)
                                .toUpperCase()
                                .padStart(4, "0")}`
                            : ""}
                        </span>
                      ))}
                    </div>

                    {/* Text Line 2 */}
                    <div className="mb-1 flex whitespace-pre">
                      {line.chars.map((charData, charIndex) => (
                        <span
                          key={`l2c${charIndex}`}
                          className={`inline-block min-w-[4rem] px-1 text-center ${
                            !charData.match && charData.char2 !== null
                              ? "rounded bg-red-200"
                              : ""
                          }`}
                        >
                          {charData.char2}
                        </span>
                      ))}
                    </div>
                    {/* Code Points Line 2 */}
                    <div className="flex text-xs whitespace-pre text-gray-500">
                      {line.chars.map((charData, charIndex) => (
                        <span
                          key={`l2cp${charIndex}`}
                          className={`inline-block min-w-[4rem] px-1 text-center ${
                            !charData.match && charData.char2 !== null
                              ? "rounded bg-red-200"
                              : ""
                          }`}
                        >
                          {charData.code2 !== null
                            ? `U+${charData.code2
                                .toString(16)
                                .toUpperCase()
                                .padStart(4, "0")}`
                            : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
