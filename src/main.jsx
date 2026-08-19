import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Database,
  ExternalLink,
  FileStack,
  FolderOpen,
  GitBranch,
  ShieldCheck,
  Wrench,
  X
} from "lucide-react";
import "./styles.css";

const nodes = [
  {
    id: "intake",
    number: "01",
    title: "Intake",
    subtitle: "Facts enter once.",
    icon: ClipboardList,
    summary:
      "The intake form captures raw opportunity facts before a numbered CRM deal exists.",
    owner: "Sales / originating team",
    sections: [
      {
        title: "What The Form Captures",
        items: [
          "Working name, site, utility, customer/host, contact, and source.",
          "Power user, referral, EPC path, buyer/system-owner clues.",
          "Project type, mounting, battery, size, production, and constraints."
        ]
      },
      {
        title: "Why It Exists",
        items: [
          "Prevents the first facts from living only in Slack, Gmail, WhatsApp, or memory.",
          "Gives CRM enough data to create the deal and assign the four-digit number.",
          "Feeds Don’s automation from the same structured starting point."
        ]
      },
      {
        title: "Branching",
        items: [
          "PPA opens buyer/system-owner and finance tracking.",
          "Battery/storage opens utility, design, and technical questions.",
          "EPC opens scope, pricing, agreement, procurement, and schedule."
        ]
      },
      {
        title: "Exit Condition",
        items: [
          "CRM deal can be created or updated.",
          "Project number can be assigned in CRM.",
          "Drive folder and first known/missing list can be created."
        ]
      }
    ],
    links: []
  },
  {
    id: "crm-drive",
    number: "02",
    title: "CRM + Drive",
    subtitle: "Control record plus source files.",
    icon: Database,
    summary:
      "CRM shows the current truth. Drive holds the files that prove it.",
    owner: "CRM owner / intake owner",
    sections: [
      {
        title: "CRM Must Show",
        items: [
          "Deal name, assigned number, stage, owner, next action, date, and blocker.",
          "Quick Reference: people, EPC, owner/buyer path, size, mounting, battery, address, target date.",
          "Deal facts: PPA, buyer, CLA/draw, model, cash inputs, and current note."
        ]
      },
      {
        title: "Drive Must Hold",
        items: [
          "Folder named to match the CRM deal and assigned number.",
          "PPA, CLA/funding, model, proposal/design, site, utility, EPC, signatures, closeout.",
          "Useful message attachments saved into the project folder."
        ]
      },
      {
        title: "Why The Quick Reference Matters",
        items: [
          "Answers the top questions first: type, size, owner, power user, referral, missing items.",
          "Stops contradictions between fields, notes, files, and messages.",
          "Gives users and automation one current answer."
        ]
      },
      {
        title: "Exit Condition",
        items: [
          "The deal page can be reviewed without rebuilding the facts from messages."
        ]
      }
    ],
    links: []
  },
  {
    id: "gate-in",
    number: "03",
    title: "Handoff Gate",
    subtitle: "Ready for EPC / engineering.",
    icon: BadgeCheck,
    summary:
      "This is the hard checkpoint before CRM hands the project to EPC/engineering.",
    owner: "Nathan confirms the gate and handoff",
    sections: [
      {
        title: "Business Checklist",
        items: [
          "CRM number and matching Drive folder exist.",
          "Power user, customer/host, site, referral/source are known or assigned.",
          "Buyer/system-owner path and project type are clear."
        ]
      },
      {
        title: "Technical Checklist",
        items: [
          "Current model/design basis is linked.",
          "Size, production, mounting, equipment, battery, utility context are visible.",
          "Constraints are named: LUMA, PRIDCO, permit, roof, structural, procurement, access."
        ]
      },
      {
        title: "Commercial Checklist",
        items: [
          "PPA status, rate, term, signature path, and signature owner are visible.",
          "Financial path is clear: buyer, owner, CLA, draw model, tax/entity, cash.",
          "Open items have owner, next action, and date."
        ]
      },
      {
        title: "Exit Condition",
        items: [
          "Move only when Quick Reference, Drive, open items, and handoff note are ready."
        ]
      }
    ],
    links: []
  },
  {
    id: "epc",
    number: "04",
    title: "EPC + Engineering",
    subtitle: "Execution lane in Zoho Projects.",
    icon: Wrench,
    summary:
      "Zoho Projects starts here. This lane is execution work, not sales cleanup.",
    owner: "EPC / engineering lead manages this lane",
    sections: [
      {
        title: "What Gets Accepted",
        items: [
          "CRM handoff note, assigned number, and Quick Reference.",
          "Drive folder with current source files.",
          "Known assumptions, blockers, owner/buyer path, and EPC path."
        ]
      },
      {
        title: "What Happens Here",
        items: [
          "EPC agreement, scope, price, inclusions/exclusions, warranty, schedule.",
          "Engineering/design basis, model, equipment path, mounting, structural comfort.",
          "Utility/interconnection, permits, disconnects, procurement, lead times, build readiness."
        ]
      },
      {
        title: "How It Is Tracked",
        items: [
          "Each numbered project starts at the EPC/engineering handoff point.",
          "Tasks move open, in progress, waiting, blocked, complete.",
          "Delegation can happen, but status stays visible and tied to CRM."
        ]
      },
      {
        title: "Exit Condition",
        items: [
          "Complete when EPC/engineering can state ready, signed/priced, blocked, and next CRM action."
        ]
      }
    ],
    links: []
  },
  {
    id: "gate-out",
    number: "05",
    title: "Return Gate",
    subtitle: "Execution complete or blocked.",
    icon: ShieldCheck,
    summary:
      "The project comes back with enough information to close, escalate, or assign the final move.",
    owner: "EPC / engineering lead returns to Nathan",
    sections: [
      {
        title: "Return Checklist",
        items: [
          "CRM-to-EPC handoff happened and is documented.",
          "Handoff inputs were used, updated, or rejected with reason.",
          "EPC, pricing, design, utility, permit, procurement, schedule, warranty are current."
        ]
      },
      {
        title: "Parallel Work Check",
        items: [
          "Buyer/system-owner path is current.",
          "Financial model, CLA/draw/cash, tax/entity items are current.",
          "Contract/signature changes and outside messages are captured."
        ]
      },
      {
        title: "Exit Condition",
        items: [
          "Accept back only when execution and parallel branches are current enough to finalize CRM."
        ]
      }
    ],
    links: []
  },
  {
    id: "closeout",
    number: "06",
    title: "CRM Closeout",
    subtitle: "Final record and final next step.",
    icon: FileStack,
    summary:
      "Closeout writes the final operating truth back into CRM.",
    owner: "Nathan",
    sections: [
      {
        title: "Final CRM Updates",
        items: [
          "Stage, attention status, next action, due date, blocker, owner are current.",
          "Quick Reference matches the fields below it.",
          "Financial, legal, buyer, EPC, and source links are attached."
        ]
      },
      {
        title: "Final Decision",
        items: [
          "Close it out if there are no further actions.",
          "Leave it open with a named owner and date if there is still a real next step.",
          "Escalate if the blocker is outside the current owner’s lane."
        ]
      },
      {
        title: "Exit Condition",
        items: [
          "Complete when CRM shows final status, Drive has final files, and no hidden work remains."
        ]
      }
    ],
    links: []
  }
];

const parallel = {
  id: "parallel",
  title: "Parallel Work",
  subtitle: "Business work moving beside execution.",
  icon: GitBranch,
  summary:
    "Buyer, finance, legal, contract, CLA, and source-control work can move while EPC advances.",
  owner: "Assigned by branch",
  sections: [
    {
      title: "Buyer / System Owner",
      items: [
        "Identify first outreach, backup buyer, owner candidate, and sendable package.",
        "Update CRM when the buyer path changes."
      ]
    },
    {
      title: "Financials",
      items: [
        "Keep model, PPA economics, CLA, draws, cash needs, tax/entity visible.",
        "Open inputs stay named in CRM while finance works."
      ]
    },
    {
      title: "Contracts / Legal",
      items: [
        "Track PPA, land/site auth, MNDA, EPC agreement, redlines, signatures.",
        "Do not call ready if the controlling document is stale, missing, or unsigned."
      ]
    },
    {
      title: "Source Control",
      items: [
        "Move useful email, Slack, portal, WhatsApp, and attachments into Drive.",
        "Summarize the business answer in CRM."
      ]
    },
    {
      title: "Exit Condition",
      items: [
        "Each branch has one owner, one next step, one status, and no CRM contradiction."
      ]
    }
  ],
  links: []
};

function Modal({ item, onClose }) {
  if (!item) return null;
  const Icon = item.icon;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={item.title} onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close details">
          <X size={22} />
        </button>
        <div className="modal-head">
          <div className="modal-icon"><Icon size={36} /></div>
          <div>
            <p>{item.subtitle}</p>
            <h2>{item.title}</h2>
          </div>
        </div>
        <p className="modal-summary">{item.summary}</p>
        <div className="owner-line">
          <strong>Owner:</strong>
          <span>{item.owner}</span>
        </div>
        <div className="modal-sections">
          {item.sections.map((section) => (
            <article className="modal-section" key={section.title}>
              <h3>{section.title}</h3>
              {section.items.map((text) => (
                <div className="modal-check" key={text}>
                  <CheckCircle2 size={18} />
                  <span>{text}</span>
                </div>
              ))}
            </article>
          ))}
        </div>
        {item.links.length > 0 && (
          <div className="modal-links">
            {item.links.map(([label, href]) => (
              <a href={href} target="_blank" rel="noreferrer" key={href}>
                {label}
                <ExternalLink size={15} />
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function App() {
  const [openItem, setOpenItem] = useState(null);

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Soltaic Project Flow</p>
          <h1>Intake to CRM, handoff to EPC + engineering, return to CRM.</h1>
          <p>
            One control path: raw intake becomes a numbered CRM record, source files stay linked, execution is managed in Projects, and the final record lands back in CRM.
          </p>
        </div>
        <div className="control-card">
          <CheckCircle2 size={22} />
          <div>
            <strong>Operating Rule</strong>
            <span>CRM owns the truth. Drive owns the files. Zoho Projects starts only after the handoff gate.</span>
          </div>
        </div>
      </section>

      <section className="flow-panel" aria-label="Project flow">
        <div className="flow-row">
          {nodes.slice(0, 4).map((node, index) => {
            const Icon = node.icon;
            return (
              <React.Fragment key={node.id}>
                <button className="node-card" onClick={() => setOpenItem(node)}>
                  <span className="node-number">{node.number}</span>
                  <Icon size={30} />
                  <strong>{node.title}</strong>
                  <small>{node.subtitle}</small>
                </button>
                {index < 3 && <ArrowRight className="flow-arrow" size={30} />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="return-row">
          <button className="parallel-card" onClick={() => setOpenItem(parallel)}>
            <GitBranch size={32} />
            <div>
              <strong>Parallel Work</strong>
              <span>Buyer / system owner, finance, legal, contracts, CLA, source control.</span>
            </div>
          </button>
          <ArrowRight className="flow-arrow" size={30} />
          {nodes.slice(4).map((node) => {
            const Icon = node.icon;
            return (
              <button className="node-card small" key={node.id} onClick={() => setOpenItem(node)}>
                <span className="node-number">{node.number}</span>
                <Icon size={30} />
                <strong>{node.title}</strong>
                <small>{node.subtitle}</small>
              </button>
            );
          })}
        </div>
      </section>

      <footer>
        <FolderOpen size={16} />
        <span>Intake, CRM, Drive, Zoho Projects, financials, and closeout stay tied to the CRM-assigned project number.</span>
      </footer>

      <Modal item={openItem} onClose={() => setOpenItem(null)} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
