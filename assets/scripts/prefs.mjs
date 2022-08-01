import {
    StateDomainSchema,
    StateDomain
} from "https://global.hexstream.dev/scripts/state-domain.mjs";

import {
    bind,
    DocumentSelector
} from "https://global.hexstream.dev/scripts/event-binding.mjs";

export {
    preferences
}

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

const preferencesSchema = new StateDomainSchema(
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
            computeRelevance (preferences) {
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
            computeRelevance (preferences) {
                return midParagraphTransitionMarksOptions.computeRelevance(preferences)
                    && preferences["/book/pages/mid-paragraph-transition-marks.visibility"] === "show";
            }
        }
    });

const preferences = new StateDomain(preferencesSchema);

bind("=",
     [
         {
             type: "storage",
             storage: globalThis.localStorage
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
bind("=",
     [
         {
             type: "storage",
             storage: preferences
         },
         {
             type: "selector",
             selector: new DocumentSelector(document.documentElement, "site-prefs")
         }
     ]);
bind(">",
     [
         {
             type: "storage",
             storage: preferences,
             keys: preferences.schema.keys
         },
         {
             type: "tokenlist",
             tokenlist: document.documentElement.classList
         }
     ]);
