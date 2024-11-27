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
    { id: "timing", title: "4. Expiration Guidelines" },
    { id: "specifications", title: "5. Shot Specifications" },
    { id: "safety", title: "6. Safety" },
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
                <span className="text-left">Shot Bet Rules & Guidelines</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="max-w-4xl">
                <section id="definition" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                    1. Definition & Overview
                  </h2>
                  <p className="text-gray-700 text-left">
                    A Shot Bet is a social agreement between two
                    consenting parties where one party agrees to take a certain number of shots of
                    liquor upon losing a predetermined wager. The general gist of the rules is that when
                    calling shots on someone,<b> you can be annoying, but don't be reckless. </b>
                    This platform tracks finalized bets only—indeterminate wagers or
                    speculative agreements are not supported.
                  </p>
                </section>

                <section id="formation" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                    2. Bet Formation
                  </h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      2.1. Key Requirements
                    </h3>
                    <p className="text-gray-700 text-left">
                      For a Shot Bet to be valid, the following conditions must
                      be met:
                    </p>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700 text-left">
                      <li>
                        <strong>Mutual Agreement:</strong> Both parties must
                        explicitly agree to the terms.
                      </li>
                      <li>
                        <strong>Clear Terms:</strong> The wager conditions and
                        criteria for determining the winner must be unambiguous.
                      </li>
                      <li>
                        <strong>Specified Quantity:</strong> The number of shots
                        owed should be clearly defined.
                      </li>
                      <li>
                        <strong>Documentation:</strong> Bets must be recorded in
                        the platform after resolution.
                      </li>
                    </ul>
                  </div>
                </section>

                <section id="execution" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                    3. Execution Rules
                  </h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      3.1. Proper Protocol
                    </h3>
                    <p className="text-gray-700 text-left">
                      Once a bet has been resolved, the winning party may call
                      the shot(s) under these guidelines:
                    </p>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700 text-left">
                      <li>Advance notice is encouraged but not required.</li>
                      <li>
                        All shots must be documented either by video or in the
                        presence of witnesses.
                      </li>
                      <li>
                        The winning party is entitled to creative timing and
                        context but must adhere to safety and decency standards.
                      </li>
                      <li>
                        You may call up to the number of shots agreed upon in the bet.
                        Marginal shot bets are allowed (ie. calling one of three shots owed).
                      </li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      3.2. Ethical Restrictions
                    </h3>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700 text-left">
                      <li>No calls during professional or religious commitments.</li>
                      <li>
                        Calls must not endanger the physical safety
                        of the losing party.
                      </li>
                      <li>
                        Excessive demands violate the spirit of the
                        agreement.
                      </li>
                      <li>
                        Targeting individuals from multiple bets owed is discouraged. Again, best judgement is advised.
                      </li>
                    </ul>
                  </div>
                </section>

                <section id="timing" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                    4. Expiration Guidelines
                  </h2>
                  <p className="text-gray-700 text-left">
                    All bets expire at the conclusion of the calendar year in
                    which the bet was finalized. Any unclaimed shots by December
                    31st are forfeited.
                  </p>
                </section>

                <section id="specifications" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                    5. Shot Specifications
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white">
                      <tbody>
                        <tr>
                          <td className="p-4 border font-semibold text-left">
                            Standard Volume
                          </td>
                          <td className="p-4 border text-left">1.5 oz (44 ml)</td>
                        </tr>
                        <tr>
                          <td className="p-4 border font-semibold text-left">
                            Minimum ABV
                          </td>
                          <td className="p-4 border text-left">15%</td>
                        </tr>
                        <tr>
                          <td className="p-4 border font-semibold text-left">
                            Maximum Shots (24 Hours)
                          </td>
                          <td className="p-4 border text-left">
                            No fixed limit (use discretion).
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section id="safety" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                    6. Safety
                  </h2>
                  <p className="text-gray-700 text-left">
                    Safety and respect are non-negotiable. The following
                    practices are required to ensure a fair and enjoyable
                    experience for all participants:
                  </p>
                  <br />
                  <ul className="list-disc ml-6 space-y-2 text-gray-700 text-left">
                    <li>
                      Participants must be of legal drinking age and in sound
                      health.
                    </li>
                    <li>
                      Shots must not be demanded in unsafe environments or under
                      conditions where harm could occur.
                    </li>
                    <li>
                      The losing party may defer a shot due to illness,
                      medication, or other reasonable constraints.
                    </li>
                  </ul>
                <br />
                <p className="text-gray-700 text-left">
                    The maintainer of this site (Davis Keene) is not responsible for any harm or injury resulting from the execution of shot bets.
                    Any shots called on this platform are done so at the discretion of the participants.
                </p>
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
