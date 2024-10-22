import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import { ScrollText } from "lucide-react";

const Rules: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("");

  const sections = [
    { id: "definition", title: "1. Definition & Overview" },
    { id: "formation", title: "2. Bet Formation" },
    { id: "execution", title: "3. Execution Rules" },
    { id: "timing", title: "4. Time Limitations" },
    { id: "specifications", title: "5. Shot Specifications" },
    { id: "safety", title: "6. Safety & Responsibility" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((section) => ({
        id: section.id,
        element: document.getElementById(section.id),
      }));

      const currentSection = sectionElements.find((section) => {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= window.innerHeight / 2;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Call Your Shot | Rules & Guidelines</title>
      </Helmet>

      <div className="flex">
        {/* Table of Contents Sidebar - Hidden on mobile */}
        <div className="hidden md:block w-72 h-screen sticky top-0 bg-white p-6 border-r">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Table of Contents
          </h2>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left p-3 rounded text-sm transition-colors
                  ${
                    activeSection === section.id
                      ? "bg-indigo-100 text-indigo-700 font-semibold"
                      : "bg-indigo-600 text-white hover:bg-indigo-400"
                  }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          <Card className="shadow-xl overflow-hidden mb-8">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <ScrollText className="h-6 w-6" />
                <span className="text-left">Official Shot Bet Rules</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="max-w-4xl">
                <section id="definition" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                    1. Definition & Overview
                  </h2>
                  <p className="text-gray-700 text-left">
                    A Shot Bet constitutes a formal wagering agreement between
                    two consenting parties wherein the losing participant agrees
                    to consume a predetermined quantity of hard-liquor shots at
                    the discretion of the winning party. This document outlines
                    the governing rules and regulations for such agreements.
                  </p>
                </section>

                <section id="formation" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                    2. Bet Formation
                  </h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      2.1. Required Elements
                    </h3>
                    <p className="text-gray-700 mb-4 text-left">
                      The following elements must be present for a valid shot
                      bet:
                    </p>
                    <ul className="list-decimal ml-6 space-y-2 text-gray-700 text-left">
                      <li>
                        Explicit agreement from both participating parties
                      </li>
                      <li>Clear and unambiguous wager conditions</li>
                      <li>Specified quantity of shots</li>
                      <li>Defined criteria for determining the winner</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      2.2. Documentation
                    </h3>
                    <p className="text-gray-700 text-left">
                      All terms must be documented within the platform at the
                      time of bet resolution. Verbal modifications to documented
                      terms are not binding.
                    </p>
                  </div>
                </section>

                <section id="execution" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                    3. Execution Rules
                  </h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      3.1. Shot Calling Protocol
                    </h3>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700 text-left">
                      <li>
                        Winner may provide as little or as much advance notice
                        as they see fit
                      </li>
                      <li>Notice may be given through any contact method</li>
                      <li>
                        Witness must be present, or shot must be recorded for
                        proof of exercising the bet
                      </li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      3.2. Execution Restrictions
                    </h3>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700 text-left">
                      <li>
                        No calls during work hours or professional obligations
                      </li>
                      <li>
                        No calls during operation of vehicles or machinery
                      </li>
                      <li>
                        No calls during religious observations or family events
                      </li>
                    </ul>
                  </div>
                </section>

                <section id="timing" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                    4. Time Limitations
                  </h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      4.1. Standard Expiration Periods
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse bg-white">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-4 border text-left font-semibold">
                              Bet Type
                            </th>
                            <th className="p-4 border text-left font-semibold">
                              Expiration Period
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-4 border">
                              Fixed Outcome Event (wager, information, etc)
                            </td>
                            <td className="p-4 border">No expiration</td>
                          </tr>
                          <tr>
                            <td className="p-4 border">
                              Long-term Predictions
                            </td>
                            <td className="p-4 border">
                              1 year from determination
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 border">Perpetual Bets</td>
                            <td className="p-4 border">No expiration</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section id="specifications" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                    5. Shot Specifications
                  </h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      5.1. Technical Requirements
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse bg-white">
                        <tbody>
                          <tr>
                            <td className="p-4 border font-semibold text-left">
                              Standard Volume
                            </td>
                            <td className="p-4 border text-left">
                              1.5 oz (44ml)
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 border font-semibold text-left">
                              Minimum ABV
                            </td>
                            <td className="p-4 border text-left">20%</td>
                          </tr>
                          <tr>
                            <td className="p-4 border font-semibold text-left">
                              Maximum ABV
                            </td>
                            <td className="p-4 border text-left">70%</td>
                          </tr>
                          <tr>
                            <td className="p-4 border font-semibold text-left">
                              Production Requirements
                            </td>
                            <td className="p-4 border text-left">
                              No production requirement
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section id="safety" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                    6. Safety & Responsibility
                  </h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      6.1. Non-Negotiable Safety Requirements
                    </h3>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700 text-left">
                      <li>All participants must be of legal drinking age</li>
                      <li>Maximum of 5 shots per 24-hour period</li>
                      <li>Safe environment must be guaranteed</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      6.2. Deferral Rights
                    </h3>
                    <p className="text-gray-700 text-left">
                      The losing party maintains the right to defer shot
                      execution under the following conditions:
                    </p>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700 text-left">
                      <li>Medical conditions or illness</li>
                      <li>Prescription medication interactions</li>
                      <li>Religious observances</li>
                      <li>Professional obligations</li>
                    </ul>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Rules;
