"use strict";

HexstreamSoft.modules.ensure("HexstreamSoft.StateDomain", "HexstreamSoft.EventBinding");

const preferencesSchema = (function () {
    const showHide = {
        possibleValues: ["show", "hide"],
        defaultValue: "show"
    };
    const diffOptions = Object.create(showHide);
    diffOptions.computeRelevance = function (preferences) {
        return preferences["diff.visibility"] === "show";
    };
    const midParagraphTransitionMarksOptions = Object.create(showHide);
    midParagraphTransitionMarksOptions.computeRelevance = function (preferences) {
        return preferences["/book/pages/references.visibility"] === "show";
    };
    return new HexstreamSoft.StateDomainSchema(
    {
        "/prefs/hints.visibility":
        showHide,

        "/prefs/preview.visibility":
        showHide,

        "arguments-and-values":
        {
            possibleValues: ["combined", "separate", "combined-and-separate"],
            defaultValue: "combined"
        },

        "diff.visibility":
        showHide,

        "diff.removed.visibility":
        diffOptions,

        "diff.removed.strikethrough":
        {
            possibleValues: ["strike", "no-strike"],
            defaultValue: "no-strike",
            computeRelevance: function (preferences) {
                return diffOptions.computeRelevance(preferences)
                    && preferences["diff.removed.visibility"] === "show";
            }
        },

        "/book/pages/references.visibility":
        showHide,

        "/book/pages/mid-paragraph-transition-marks.visibility":
        midParagraphTransitionMarksOptions,

        "/book/pages/mid-paragraph-transition-marks.type":
        {
            possibleValues: ["⁁", "‸"],
            defaultValue: "⁁",
            computeRelevance: function (preferences) {
                return midParagraphTransitionMarksOptions.computeRelevance(preferences)
                    && preferences["/book/pages/mid-paragraph-transition-marks.visibility"] === "show";
            }
        }
    });
})();

const preferences = new HexstreamSoft.StateDomain(preferencesSchema);

HexstreamSoft.EventBinding.bind(
    "=",
    [
        {
            type: "storage",
            storage: localStorage
        },
        {
            type: "storage",
            storage: preferences
        }
    ],
    {
        source:
        {
            keys: preferences.schema.keys
        }
    }
);
HexstreamSoft.EventBinding.bind(
    "=",
    [
        {
            type: "storage",
            storage: preferences
        },
        {
            type: "document",
            document: document.documentElement,
            stateDomainName: "site-prefs"
        }
    ]);
HexstreamSoft.EventBinding.bind(
    ">",
    [
        {
            type: "storage",
            storage: preferences,
            keys: preferences.schema.keys
        },
        {
            type: "classList",
            node: document.documentElement
        }
    ]);
