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

const preferencesSchema = new StateDomainSchema(
    {
        "/prefs/hints.visibility":
        true,

        "/prefs/preview.visibility":
        true,

        "arguments-and-values":
        {
            possibleValues: ["combined", "separate", "both"]
        },

        "diff.visibility":
        false,

        "diff.removed.visibility":
        {
            base: true,
            relevantIf: {
                "diff.visibility": "show"
            }
        },

        "diff.removed.strikethrough":
        {
            possibleValues: ["strike", "no-strike"],
            defaultValue: "no-strike",
            relevantIf: {
                "diff.visibility": "show",
                "diff.removed.visibility": "show"
            }
        },

        "/book/pages/references.visibility":
        true,

        "/book/pages/mid-paragraph-transition-marks.visibility":
        {
            base: true,
            relevantIf: {
                "/book/pages/references.visibility": "show"
            }
        },

        "/book/pages/mid-paragraph-transition-marks.type":
        {
            possibleValues: ["⁁", "‸"],
            relevantIf: {
                "/book/pages/references.visibility": "show",
                "/book/pages/mid-paragraph-transition-marks.visibility": "show"
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
