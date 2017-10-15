"use strict";

HexstreamSoft.modules.ensure("HexstreamSoft.StateDomain", "HexstreamSoft.EventBinding");

var preferencesSchema = (function () {
    var show_hide = {
        possibleValues: ["show", "hide"],
        defaultValue: "show"
    };
    var diff_options = Object.create(show_hide);
    diff_options.computeRelevance = function (preferences) {
        return preferences["diff.visibility"] === "show";
    };
    var mid_paragraph_transition_marks_options = Object.create(show_hide);
    mid_paragraph_transition_marks_options.computeRelevance = function (preferences) {
        return preferences["/book/pages/references.visibility"] === "show";
    };
    return new HexstreamSoft.StateDomainSchema(
    {
        "/prefs/hints.visibility":
        show_hide,

        "/prefs/preview.visibility":
        show_hide,

        "arguments-and-values":
        {
            possibleValues: ["combined", "separate", "combined-and-separate"],
            defaultValue: "combined"
        },

        "diff.visibility":
        show_hide,

        "diff.removed.visibility":
        diff_options,

        "diff.removed.strikethrough":
        {
            possibleValues: ["strike", "no-strike"],
            defaultValue: "no-strike",
            computeRelevance: function (preferences) {
                return diff_options.computeRelevance(preferences)
                    && preferences["diff.removed.visibility"] === "show";
            }
        },

        "/book/pages/references.visibility":
        show_hide,

        "/book/pages/mid-paragraph-transition-marks.visibility":
        mid_paragraph_transition_marks_options,

        "/book/pages/mid-paragraph-transition-marks.type":
        {
            possibleValues: ["⁁", "‸"],
            defaultValue: "⁁",
            computeRelevance: function (preferences) {
                return mid_paragraph_transition_marks_options.computeRelevance(preferences)
                    && preferences["/book/pages/mid-paragraph-transition-marks.visibility"] === "show";
            }
        }
    });
})();

var preferences = new HexstreamSoft.StateDomain(preferencesSchema);

HexstreamSoft.EventBinding.bind({
    combine: "=",
    endpoints:
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
    source:
    {
        keys: preferences.schema.keys
    }
});
HexstreamSoft.EventBinding.bind({
    combine: "=",
    endpoints:
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
    ]
});
HexstreamSoft.EventBinding.bind({
    combine: ">",
    endpoints:
    [
        {
            type: "storage",
            storage: preferences,
            keys: preferences.schema.keys
        },
        {
            type: "classList",
            document: document.documentElement
        }
    ]
});
HexstreamSoft.EventBinding.bind({
    combine: "=",
    endpoints:
    [
        {
            type: "storage",
            storage: localStorage
        },
        {
            type: "document",
            document: document.documentElement,
            stateDomainName: "page-prefs"
        }
    ]
});
